import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  isEpisodeStreamReady,
  getVideoDirectStreamUrl,
  getVideoStreamUrl
} from '../data/seriesData.js';

// Watch-progress persistence: save at most once every N seconds to avoid
// hammering localStorage on every timeupdate event.
const PROGRESS_SAVE_INTERVAL = 3000;
// Restore playback position only if the user watched at least this long.
const MIN_RESUME_SECONDS = 3;

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const totalSecs = Math.floor(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const pad = (n) => (n < 10 ? '0' + n : String(n));

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export default function VideoPlayerModal({
  isOpen,
  episode,
  allEpisodes,
  onClose,
  onSelectEpisode,
  isWatched,
  onToggleWatched,
  autoNext,
  setAutoNext,
  showToast
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useFallbackEmbed, setUseFallbackEmbed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [doubleTapFeedback, setDoubleTapFeedback] = useState(null);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const lastTapRef = useRef({ time: 0, x: 0 });

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Sync fullscreen state
  const updateFullscreenState = useCallback(() => {
    const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
    const isFs = Boolean(
      fsElement &&
      containerRef.current &&
      (fsElement === containerRef.current || containerRef.current.contains(fsElement))
    );
    setIsFullscreen(isFs);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', updateFullscreenState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenState);
    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreenState);
      document.removeEventListener('webkitfullscreenchange', updateFullscreenState);
    };
  }, [updateFullscreenState]);

  // Auto-hide controls timer during playback
  const scheduleControlsHide = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setControlsVisible(true);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
        setShowSpeedMenu(false);
      }, 2800);
    }
  }, [isPlaying]);

  const handleUserActivity = useCallback(() => {
    scheduleControlsHide();
  }, [scheduleControlsHide]);

  // Reset state when episode changes
  useEffect(() => {
    if (isOpen && episode) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setBufferedPercent(0);
      setIsLoading(true);
      setIsBuffering(false);
      setHasError(false);
      setUseFallbackEmbed(false);
      setShowSpeedMenu(false);
      setControlsVisible(true);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.playbackRate = playbackRate;
        videoRef.current.load();
      }
    }
  }, [isOpen, episode?.id]);

  // Keyboard navigation & controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Ignore if user is in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case 'Escape':
          if (document.fullscreenElement || document.webkitFullscreenElement) {
            if (document.exitFullscreen) {
              document.exitFullscreen().catch(() => {});
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen().catch(() => {});
            }
          } else if (isDrawerOpen) {
            setIsDrawerOpen(false);
          } else {
            onClose();
          }
          break;
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'j':
        case 'J':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'ArrowRight':
        case 'l':
        case 'L':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.min(1, v + 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            setIsMuted(false);
            return next;
          });
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume((v) => {
            const next = Math.max(0, v - 0.1);
            if (videoRef.current) videoRef.current.volume = next;
            return next;
          });
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDrawerOpen, isPlaying, duration, onClose]);

  if (!isOpen || !episode) return null;

  const isPlayable = isEpisodeStreamReady(episode);
  const directVideoUrl = isPlayable ? getVideoDirectStreamUrl(episode.id) : '';
  const embedFallbackUrl = isPlayable ? getVideoStreamUrl(episode.id) : '';

  const currentIndex = allEpisodes.findIndex((e) => e.id === episode.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allEpisodes.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      onSelectEpisode(allEpisodes[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onSelectEpisode(allEpisodes[currentIndex + 1]);
    }
  };

  // Video playback functions
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        scheduleControlsHide();
      }).catch((err) => {
        console.warn('Playback play promise error:', err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setControlsVisible(true);
    }
  };

  const seekRelative = (delta) => {
    if (!videoRef.current) return;
    const next = Math.max(0, Math.min(videoRef.current.currentTime + delta, duration || 0));
    videoRef.current.currentTime = next;
    setCurrentTime(next);
    scheduleControlsHide();
  };

  const handleScrubberClick = (e) => {
    if (!progressBarRef.current || !videoRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(clickX / rect.width, 1));
    const nextTime = percent * duration;
    videoRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
    scheduleControlsHide();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
    scheduleControlsHide();
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const handleSpeedSelect = (rate) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    scheduleControlsHide();
    if (showToast) {
      showToast(`Speed set to ${rate}x`);
    }
  };

  const toggleFullscreen = async () => {
    try {
      const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
      if (fsElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      } else if (containerRef.current) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  // Double-tap seeking on touch devices
  const handleVideoTouch = (e) => {
    const now = Date.now();
    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const width = rect.width;
    const timeDiff = now - lastTapRef.current.time;

    if (timeDiff < 320 && Math.abs(x - lastTapRef.current.x) < 80) {
      // Double tap detected
      if (x < width * 0.4) {
        // Double tap on left side -> rewind 10s
        seekRelative(-10);
        setDoubleTapFeedback({ type: 'rewind', id: now });
        setTimeout(() => setDoubleTapFeedback(null), 700);
      } else if (x > width * 0.6) {
        // Double tap on right side -> forward 10s
        seekRelative(10);
        setDoubleTapFeedback({ type: 'forward', id: now });
        setTimeout(() => setDoubleTapFeedback(null), 700);
      } else {
        togglePlay();
      }
      lastTapRef.current = { time: 0, x: 0 };
    } else {
      // Single tap -> toggle controls
      lastTapRef.current = { time: now, x };
      setControlsVisible((prev) => !prev);
      if (!controlsVisible) {
        scheduleControlsHide();
      }
    }
  };

  // Video event handlers
  const onLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
      setIsLoading(false);
      setHasError(false);
    }
  };

  const onTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.buffered.length > 0 && videoRef.current.duration) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        setBufferedPercent(Math.min(100, (bufferedEnd / videoRef.current.duration) * 100));
      }
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setControlsVisible(true);
    if (!isWatched) {
      onToggleWatched(episode.id);
    }
    if (autoNext && hasNext) {
      if (showToast) {
        showToast('Auto-playing next episode in 3 seconds...');
      }
      setTimeout(() => {
        handleNext();
      }, 2500);
    }
  };

  const handleVideoError = (err) => {
    console.warn('Native video error encountered, falling back to embedded player:', err);
    // If native video playback errors out (e.g., Safari codec incompatibility), fall back to embed
    setUseFallbackEmbed(true);
    setIsLoading(false);
  };

  const progressPercent = duration ? Math.min(100, (currentTime / duration) * 100) : 0;

  const isVip = episode.isPremium || episode.season === 'VIP';
  const tagText = isVip
    ? `VIP SP ${episode.episodeNum < 10 ? '0' + episode.episodeNum : episode.episodeNum}`
    : `S${episode.season} • EP ${episode.episodeNum < 10 ? '0' + episode.episodeNum : episode.episodeNum}`;

  return (
    <div
      className={`player-modal active ${isFullscreen ? 'in-fullscreen' : ''}`}
      id="playerModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="playerEpisodeTitle"
    >
      <div className="player-modal-backdrop" id="playerBackdrop" onClick={onClose}></div>

      {/* Main Responsive Player Container */}
      <div
        className={`player-container ${isFullscreen ? 'is-fullscreen' : ''}`}
        ref={containerRef}
        id="playerFullscreenContainer"
        onMouseMove={handleUserActivity}
        onTouchStart={handleUserActivity}
      >
        {/* Episode Header */}
        <header className={`player-header ${!controlsVisible && isPlaying ? 'header-autohide' : ''}`}>
          <div className="player-header-info">
            <span className="player-tag" id="playerEpisodeTag">
              {tagText}
            </span>
            <h3 className="player-title" id="playerEpisodeTitle" title={episode.title}>
              {episode.title}
            </h3>
            <span className="badge-quality">
              <i className="fa-solid fa-bolt"></i> 1080p HD
            </span>
          </div>

          <div className="player-header-actions">
            {/* Fullscreen Toggle in Header */}
            <button
              type="button"
              className={`player-ctrl-btn btn-fullscreen-player ${isFullscreen ? 'active' : ''}`}
              id="fullscreenPlayerBtn"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              onClick={toggleFullscreen}
            >
              <i className={isFullscreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand'}></i>
            </button>

            {/* Close Button */}
            <button
              type="button"
              className="player-ctrl-btn btn-close-player"
              id="closePlayerBtn"
              title="Close (Esc)"
              aria-label="Close player"
              onClick={onClose}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </header>

        {/* Video Area (Dominates screen) */}
        <div
          className="video-frame-wrapper"
          id="videoWrapper"
          onClick={handleUserActivity}
          onTouchEnd={handleVideoTouch}
        >
          {/* Native HTML5 Video Player */}
          {isPlayable && !useFallbackEmbed && (
            <video
              ref={videoRef}
              id="cinemaNativeVideo"
              className="cinema-native-video"
              src={directVideoUrl}
              playsInline
              preload="metadata"
              onLoadedMetadata={onLoadedMetadata}
              onTimeUpdate={onTimeUpdate}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => {
                setIsBuffering(false);
                setIsLoading(false);
                setIsPlaying(true);
              }}
              onPause={() => setIsPlaying(false)}
              onEnded={onEnded}
              onError={handleVideoError}
            />
          )}

          {/* Fallback Sandboxed Stream Embed */}
          {isPlayable && useFallbackEmbed && (
            <iframe
              id="cinemaVideoPlayerFrame"
              className="cinema-player-frame"
              src={embedFallbackUrl}
              title={episode.title}
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
            />
          )}

          {/* Coming Soon Overlay */}
          {!isPlayable && (
            <div className="unloaded-notice-overlay" id="unloadedNoticeOverlay">
              <div className="unloaded-card">
                <div className="unloaded-pill">
                  <i className="fa-solid fa-clock"></i> COMING SOON
                </div>
                <h3 id="unloadedTitle">{episode.title}</h3>
                <p className="unloaded-desc">
                  This episode is currently being processed for streaming. Season 1 Episodes 1 through 12 are
                  ready to stream right now in full unedited 1080p HD!
                </p>

                <div className="unloaded-quick-watch">
                  <span className="quick-watch-label">Stream Ready Episodes:</span>
                  <div className="quick-watch-buttons">
                    <button
                      type="button"
                      className="btn-quick-stream"
                      onClick={() => onSelectEpisode(allEpisodes.find((e) => e.id === 's1-e01'))}
                    >
                      <i className="fa-solid fa-circle-play"></i> Ep 1: Pilot Chaos (1080p)
                    </button>
                    <button
                      type="button"
                      className="btn-quick-stream"
                      onClick={() => onSelectEpisode(allEpisodes.find((e) => e.id === 's1-e02'))}
                    >
                      <i className="fa-solid fa-circle-play"></i> Ep 2: Roast & Latents (1080p)
                    </button>
                    <button
                      type="button"
                      className="btn-quick-stream"
                      onClick={() => onSelectEpisode(allEpisodes.find((e) => e.id === 's1-e03'))}
                    >
                      <i className="fa-solid fa-circle-play"></i> Ep 3: Neuroscience (1080p)
                    </button>
                  </div>
                </div>

                <div className="unloaded-actions">
                  <button type="button" className="btn-quick-stream btn-back-guide" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i> Back to Episode Guide
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Buffering Spinner */}
          {isPlayable && (isLoading || isBuffering) && !hasError && (
            <div className="player-loader" aria-live="polite">
              <div className="player-loader-spinner"></div>
              <span className="player-loader-text">
                {isLoading ? `Loading ${episode.title}...` : 'Buffering...'}
              </span>
            </div>
          )}

          {/* Double Tap Ripple Animations */}
          {doubleTapFeedback && (
            <div
              className={`double-tap-feedback ${
                doubleTapFeedback.type === 'rewind' ? 'feedback-left' : 'feedback-right'
              }`}
            >
              <div className="double-tap-pill">
                <i
                  className={
                    doubleTapFeedback.type === 'rewind'
                      ? 'fa-solid fa-rotate-left'
                      : 'fa-solid fa-rotate-right'
                  }
                ></i>
                <span>{doubleTapFeedback.type === 'rewind' ? '-10s' : '+10s'}</span>
              </div>
            </div>
          )}

          {/* Center Play / Pause Button Overlay (when paused or ended) */}
          {isPlayable && !useFallbackEmbed && !isPlaying && !isLoading && !isBuffering && (
            <button
              type="button"
              className="center-play-button"
              aria-label="Play"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              <i className="fa-solid fa-play"></i>
            </button>
          )}

          {/* In-Video Professional OTT Controls Bar */}
          {isPlayable && !useFallbackEmbed && (
            <div
              className={`ott-controls-wrapper ${controlsVisible ? 'visible' : 'hidden'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Progress Scrubber Bar */}
              <div
                className="ott-scrubber-container"
                ref={progressBarRef}
                onClick={handleScrubberClick}
              >
                <div className="ott-scrubber-track">
                  {/* Buffered Track */}
                  <div
                    className="ott-scrubber-buffered"
                    style={{ width: `${bufferedPercent}%` }}
                  />
                  {/* Played Track */}
                  <div
                    className="ott-scrubber-played"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="ott-scrubber-thumb" />
                  </div>
                </div>
              </div>

              {/* Bottom Controls Row */}
              <div className="ott-controls-row">
                <div className="ott-controls-left">
                  {/* Play / Pause Toggle */}
                  <button
                    type="button"
                    className="ott-btn ott-btn-play"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    onClick={togglePlay}
                  >
                    <i className={isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'}></i>
                  </button>

                  {/* Rewind 10s */}
                  <button
                    type="button"
                    className="ott-btn ott-btn-seek"
                    aria-label="Rewind 10 seconds"
                    title="Rewind 10s (Left Arrow)"
                    onClick={() => seekRelative(-10)}
                  >
                    <i className="fa-solid fa-rotate-left"></i>
                    <span className="seek-badge">10</span>
                  </button>

                  {/* Forward 10s */}
                  <button
                    type="button"
                    className="ott-btn ott-btn-seek"
                    aria-label="Forward 10 seconds"
                    title="Forward 10s (Right Arrow)"
                    onClick={() => seekRelative(10)}
                  >
                    <i className="fa-solid fa-rotate-right"></i>
                    <span className="seek-badge">10</span>
                  </button>

                  {/* Time Counter */}
                  <div className="ott-time-display">
                    <span className="time-current">{formatTime(currentTime)}</span>
                    <span className="time-sep">/</span>
                    <span className="time-duration">{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="ott-controls-right">
                  {/* Volume Control */}
                  <div className="ott-volume-group">
                    <button
                      type="button"
                      className="ott-btn ott-btn-volume"
                      aria-label={isMuted || volume === 0 ? 'Unmute' : 'Mute'}
                      onClick={toggleMute}
                    >
                      <i
                        className={
                          isMuted || volume === 0
                            ? 'fa-solid fa-volume-xmark'
                            : volume < 0.5
                            ? 'fa-solid fa-volume-low'
                            : 'fa-solid fa-volume-high'
                        }
                      ></i>
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="ott-volume-slider"
                      aria-label="Volume slider"
                    />
                  </div>

                  {/* Speed Selector */}
                  <div className="ott-speed-group">
                    <button
                      type="button"
                      className="ott-btn ott-btn-speed"
                      aria-label="Playback speed"
                      title="Playback speed"
                      onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    >
                      <span>{playbackRate}x</span>
                    </button>
                    {showSpeedMenu && (
                      <div className="ott-speed-menu">
                        {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            className={`ott-speed-item ${playbackRate === rate ? 'active' : ''}`}
                            onClick={() => handleSpeedSelect(rate)}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen Button in Player */}
                  <button
                    type="button"
                    className="ott-btn ott-btn-fullscreen"
                    aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                    onClick={toggleFullscreen}
                  >
                    <i className={isFullscreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand'}></i>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Footer Controls (Compact Episode Management) */}
        <footer className="player-footer">
          {/* Row 1: Episode Navigation (Previous / Next) */}
          <div className="player-nav-row">
            <button
              type="button"
              className="btn-player-nav btn-prev-ep"
              id="prevEpisodeBtn"
              disabled={!hasPrev}
              onClick={handlePrev}
              aria-label="Previous episode"
            >
              <i className="fa-solid fa-backward-step"></i>
              <span>Previous Episode</span>
            </button>

            <button
              type="button"
              className="btn-player-nav btn-next-ep"
              id="nextEpisodeBtn"
              disabled={!hasNext}
              onClick={handleNext}
              aria-label="Next episode"
            >
              <span>Next Episode</span>
              <i className="fa-solid fa-forward-step"></i>
            </button>
          </div>

          {/* Row 2: Secondary Controls (Autoplay, Watched, Episode Selector) */}
          <div className="player-actions-row">
            <label className="auto-play-toggle" htmlFor="autoNextCheck">
              <input
                type="checkbox"
                id="autoNextCheck"
                checked={autoNext}
                onChange={(e) => setAutoNext(e.target.checked)}
              />
              <span className="toggle-label">Auto-play Next</span>
            </label>

            <div className="player-secondary-btns">
              <button
                type="button"
                className={`btn-player-action ${isWatched ? 'active' : ''}`}
                id="markWatchedBtn"
                onClick={() => onToggleWatched(episode.id)}
                aria-label={isWatched ? 'Remove from watched' : 'Mark as watched'}
              >
                <i className={isWatched ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle-check'}></i>
                <span id="markWatchedText">{isWatched ? 'Watched' : 'Mark Watched'}</span>
              </button>

              <button
                type="button"
                className={`btn-player-action ${isDrawerOpen ? 'active' : ''}`}
                id="toggleEpisodeListBtn"
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                aria-expanded={isDrawerOpen}
                aria-label="Open episode drawer"
              >
                <i className="fa-solid fa-list-ul"></i>
                <span>Episodes</span>
              </button>
            </div>
          </div>
        </footer>

        {/* In-Player Episode Drawer */}
        <div
          className={`player-episode-drawer ${isDrawerOpen ? 'active' : 'hidden'}`}
          id="playerEpisodeDrawer"
        >
          <div className="drawer-header">
            <h4>
              <i className="fa-solid fa-microphone-lines"></i> Episodes Guide
            </h4>
            <button
              type="button"
              className="btn-close-drawer"
              id="closeDrawerBtn"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close episode guide"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="drawer-episode-list" id="drawerEpisodeList">
            {allEpisodes.map((ep) => {
              const active = ep.id === episode.id;
              const epVip = ep.isPremium || ep.season === 'VIP';
              const tag = epVip
                ? `VIP SP ${ep.episodeNum}`
                : `S${ep.season} • E${ep.episodeNum < 10 ? '0' + ep.episodeNum : ep.episodeNum}`;
              return (
                <div
                  key={ep.id}
                  className={`drawer-ep-item ${active ? 'active' : ''}`}
                  onClick={() => {
                    onSelectEpisode(ep);
                    setIsDrawerOpen(false);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      onSelectEpisode(ep);
                      setIsDrawerOpen(false);
                    }
                  }}
                >
                  <img
                    src={ep.thumbnail || '/assets/thumbnails/s1_thumb.webp'}
                    alt={ep.title}
                    className="drawer-ep-thumb"
                    loading="lazy"
                  />
                  <div className="drawer-ep-info">
                    <span className="drawer-ep-tag">{tag}</span>
                    <h5 className="drawer-ep-title">{ep.title}</h5>
                    <span className="drawer-ep-meta">{ep.duration}</span>
                  </div>
                  {active && (
                    <span className="drawer-now-playing">
                      <i className="fa-solid fa-volume-high"></i> Playing
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
