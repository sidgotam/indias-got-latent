import React, { useState, useEffect, useRef, useCallback } from 'react';
import { isEpisodeStreamReady, getDriveEmbedUrl } from '../data/seriesData.js';

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
  const [isTheater, setIsTheater] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Sync fullscreen state with document.fullscreenElement
  const updateFullscreenState = useCallback(() => {
    const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
    const isFs = Boolean(
      fsElement &&
      containerRef.current &&
      (fsElement === containerRef.current || containerRef.current.contains(fsElement))
    );
    setIsFullscreen(isFs);
  }, []);

  // Listen to fullscreen changes across all browsers
  useEffect(() => {
    document.addEventListener('fullscreenchange', updateFullscreenState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenState);

    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreenState);
      document.removeEventListener('webkitfullscreenchange', updateFullscreenState);
    };
  }, [updateFullscreenState]);

  // Handle keyboard events (Escape key)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
          // If in fullscreen, exit fullscreen first
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDrawerOpen, onClose]);

  // Reset loading and error states when episode changes or modal opens
  useEffect(() => {
    if (isOpen && episode) {
      setIsLoading(true);
      setHasError(false);

      // Timeout fallback: if iframe doesn't load within 14s, show retry option
      const timer = setTimeout(() => {
        setIsLoading((loading) => {
          if (loading) {
            setHasError(true);
            return false;
          }
          return false;
        });
      }, 14000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, episode?.id]);

  if (!isOpen || !episode) return null;

  const isPlayable = isEpisodeStreamReady(episode);
  const embedUrl = isPlayable ? getDriveEmbedUrl(episode.driveId) : '';

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
      console.warn('Fullscreen toggle failed:', err);
      // Fallback: Toggle in-viewport expanded theater mode if fullscreen API rejected
      setIsTheater((prev) => !prev);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    if (iframeRef.current) {
      iframeRef.current.src = embedUrl;
    }
  };

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

      {/* Dedicated Player Wrapper - Targets Fullscreen Only */}
      <div
        className={`player-container ${isTheater ? 'is-theater' : ''} ${isFullscreen ? 'is-fullscreen' : ''}`}
        ref={containerRef}
        id="playerFullscreenContainer"
      >
        {/* Player Header */}
        <div className="player-header">
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
            {/* Fullscreen Toggle Button */}
            <button
              type="button"
              className={`player-ctrl-btn btn-fullscreen-player ${isFullscreen ? 'active' : ''}`}
              id="fullscreenPlayerBtn"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              onClick={toggleFullscreen}
            >
              <i
                className={
                  isFullscreen
                    ? 'fa-solid fa-compress'
                    : 'fa-solid fa-up-right-and-down-left-and-up-left-to-down-right'
                }
              ></i>
            </button>

            {/* Theater Mode Button (Hidden on small mobile) */}
            {!isFullscreen && (
              <button
                type="button"
                className={`player-ctrl-btn btn-theater-player ${isTheater ? 'active' : ''}`}
                id="toggleTheaterBtn"
                title="Theater Mode"
                aria-label="Toggle Theater Mode"
                onClick={() => setIsTheater(!isTheater)}
              >
                <i className="fa-solid fa-expand"></i>
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              className="player-ctrl-btn btn-close-player"
              id="closePlayerBtn"
              title="Close (Esc)"
              aria-label="Close Video Player"
              onClick={onClose}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Video Wrapper */}
        <div className="video-frame-wrapper" id="videoWrapper">
          {/* Loading Skeleton / Spinner */}
          {isPlayable && isLoading && !hasError && (
            <div className="player-loader" aria-live="polite">
              <div className="player-loader-spinner"></div>
              <span className="player-loader-text">Loading {episode.title}...</span>
            </div>
          )}

          {/* Error State Fallback */}
          {isPlayable && hasError && (
            <div className="player-error-overlay" role="alert">
              <div className="player-error-card">
                <i className="fa-solid fa-triangle-exclamation error-icon"></i>
                <h4>Unable to load this video right now</h4>
                <p>Please check your connection or retry playback.</p>
                <div className="player-error-actions">
                  <button type="button" className="btn-retry-stream" onClick={handleRetry}>
                    <i className="fa-solid fa-rotate-right"></i>
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video Stream Embed */}
          {isPlayable ? (
            <iframe
              ref={iframeRef}
              id="driveVideoIframe"
              src={embedUrl}
              title={episode.title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={handleIframeLoad}
            ></iframe>
          ) : (
            /* Coming Soon Overlay */
            <div className="unloaded-notice-overlay" id="unloadedNoticeOverlay">
              <div className="unloaded-card">
                <div className="unloaded-pill">
                  <i className="fa-solid fa-clock"></i> COMING SOON
                </div>
                <h3 id="unloadedTitle">{episode.title}</h3>
                <p className="unloaded-desc">
                  This episode is being processed for streaming. Season 1 Episodes 1, 2, and 3 are
                  ready to watch right now!
                </p>

                <div className="unloaded-quick-watch">
                  <span className="quick-watch-label">Stream Available Episodes:</span>
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
        </div>

        {/* Video Footer Controls */}
        <div className={`player-footer ${isFullscreen ? 'fullscreen-footer' : ''}`}>
          {/* Row 1: Episode Navigation (Prev / Next) */}
          <div className="player-nav-row">
            <button
              type="button"
              className="btn-player-nav btn-prev-ep"
              id="prevEpisodeBtn"
              disabled={!hasPrev}
              onClick={handlePrev}
              aria-label="Previous Episode"
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
              aria-label="Next Episode"
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
                aria-label="Open Episode Selector"
              >
                <i className="fa-solid fa-list-ul"></i>
                <span>Episodes</span>
              </button>
            </div>
          </div>
        </div>

        {/* In-Player Episode Quick Switch Drawer */}
        <div
          className={`player-episode-drawer ${isDrawerOpen ? 'active' : 'hidden'}`}
          id="playerEpisodeDrawer"
        >
          <div className="drawer-header">
            <h4>
              <i className="fa-solid fa-microphone-lines"></i> Quick Episode Switch
            </h4>
            <button
              type="button"
              className="btn-close-drawer"
              id="closeDrawerBtn"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close episode selector"
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
