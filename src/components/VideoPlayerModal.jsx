import React, { useState, useEffect, useRef } from 'react';
import { extractGoogleDriveId, isEpisodeStreamReady, getDriveEmbedUrl } from '../data/seriesData.js';

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isDrawerOpen) {
          setIsDrawerOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDrawerOpen, onClose]);

  if (!isOpen || !episode) return null;

  const isPlayable = isEpisodeStreamReady(episode);
  const embedUrl = isPlayable ? getDriveEmbedUrl(episode.driveId) : '';

  const currentIndex = allEpisodes.findIndex(e => e.id === episode.id);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const isVip = episode.isPremium || episode.season === 'VIP';
  const tagText = isVip 
    ? `VIP SP ${episode.episodeNum < 10 ? '0' + episode.episodeNum : episode.episodeNum}` 
    : `S${episode.season} • EP ${episode.episodeNum < 10 ? '0' + episode.episodeNum : episode.episodeNum}`;

  return (
    <div className="player-modal active" id="playerModal" role="dialog" aria-modal="true">
      <div className="player-modal-backdrop" id="playerBackdrop" onClick={onClose}></div>

      <div 
        className={`player-container ${isTheater ? 'is-theater' : ''}`} 
        ref={containerRef}
      >
        {/* Cinema Player Header */}
        <div className="player-header">
          <div className="player-header-info">
            <span className="player-tag" id="playerEpisodeTag">{tagText}</span>
            <h3 className="player-title" id="playerEpisodeTitle">{episode.title}</h3>
            <span className="badge-protected">
              <i className="fa-solid fa-shield-halved"></i> Ultra HD 1080p • Protected Stream
            </span>
          </div>

          <div className="player-header-actions">
            <button 
              type="button"
              className="player-ctrl-btn btn-fullscreen-player" 
              id="fullscreenPlayerBtn" 
              title="Fullscreen"
              onClick={toggleFullscreen}
            >
              <i className="fa-solid fa-up-right-and-down-left-and-up-left-to-down-right"></i>
            </button>
            <button 
              type="button"
              className={`player-ctrl-btn ${isTheater ? 'active' : ''}`} 
              id="toggleTheaterBtn" 
              title="Theater Mode"
              onClick={() => setIsTheater(!isTheater)}
            >
              <i className="fa-solid fa-expand"></i>
            </button>
            <button 
              type="button"
              className="player-ctrl-btn btn-close-player" 
              id="closePlayerBtn" 
              title="Close (Esc)"
              onClick={onClose}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Video Wrapper with Top Shielding Mask */}
        <div className="video-frame-wrapper" id="videoWrapper">
          {/* Top Shield Overlay (Anti-download) */}
          <div className="anti-download-shield" id="antiDownloadShield">
            <div className="shield-watermark">
              <i className="fa-solid fa-shield-halved"></i> INDIA'S GOT LATENT • PROTECTED STREAM • NO DOWNLOAD
            </div>
          </div>

          {/* Google Drive Preview Iframe */}
          {isPlayable ? (
            <iframe
              id="driveVideoIframe"
              src={embedUrl}
              title={episode.title}
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          ) : (
            /* Episode Coming Soon Overlay */
            <div className="unloaded-notice-overlay" id="unloadedNoticeOverlay">
              <div className="unloaded-card">
                <div className="unloaded-pill">
                  <i className="fa-solid fa-clock"></i> COMING SOON
                </div>
                <h3 id="unloadedTitle">{episode.title}</h3>
                <p className="unloaded-desc">
                  This unedited episode is currently being processed for streaming. However, <strong>Season 1 Episodes 1, 2, and 3</strong> are fully uploaded and ready to watch right now!
                </p>

                <div className="unloaded-quick-watch">
                  <span className="quick-watch-label">Stream Available Episodes Now:</span>
                  <div className="quick-watch-buttons">
                    <button 
                      type="button" 
                      className="btn-quick-stream"
                      onClick={() => onSelectEpisode(allEpisodes.find(e => e.id === 's1-e01'))}
                    >
                      <i className="fa-solid fa-circle-play"></i> Ep 1: Pilot Chaos (1080p)
                    </button>
                    <button 
                      type="button" 
                      className="btn-quick-stream"
                      onClick={() => onSelectEpisode(allEpisodes.find(e => e.id === 's1-e02'))}
                    >
                      <i className="fa-solid fa-circle-play"></i> Ep 2: Roast & Latents (1080p)
                    </button>
                    <button 
                      type="button" 
                      className="btn-quick-stream"
                      onClick={() => onSelectEpisode(allEpisodes.find(e => e.id === 's1-e03'))}
                    >
                      <i className="fa-solid fa-circle-play"></i> Ep 3: Neuroscience (1080p)
                    </button>
                  </div>
                </div>

                <div className="unloaded-actions">
                  <button 
                    type="button" 
                    className="btn-quick-stream" 
                    onClick={onClose}
                    style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'var(--border-subtle)', cursor: 'pointer' }}
                  >
                    <i className="fa-solid fa-xmark"></i> Back to Episode Guide
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Footer Controls */}
        <div className="player-footer">
          <div className="player-footer-left">
            <button 
              type="button"
              className="btn-player-nav" 
              id="prevEpisodeBtn"
              disabled={!hasPrev}
              onClick={handlePrev}
            >
              <i className="fa-solid fa-backward-step"></i> Previous Episode
            </button>
            <button 
              type="button"
              className="btn-player-nav" 
              id="nextEpisodeBtn"
              disabled={!hasNext}
              onClick={handleNext}
            >
              Next Episode <i className="fa-solid fa-forward-step"></i>
            </button>
            <label className="auto-play-toggle">
              <input 
                type="checkbox" 
                id="autoNextCheck" 
                checked={autoNext} 
                onChange={(e) => setAutoNext(e.target.checked)} 
              />
              <span>Auto-play Next Episode</span>
            </label>
          </div>

          <div className="player-footer-right">
            <button 
              type="button"
              className={`btn-player-action ${isWatched ? 'active' : ''}`} 
              id="markWatchedBtn"
              onClick={() => onToggleWatched(episode.id)}
            >
              <i className={isWatched ? "fa-solid fa-circle-check" : "fa-regular fa-circle-check"}></i>
              <span id="markWatchedText">{isWatched ? 'Watched' : 'Mark as Watched'}</span>
            </button>
            <button 
              type="button"
              className={`btn-player-action ${isDrawerOpen ? 'active' : ''}`} 
              id="toggleEpisodeListBtn"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <i className="fa-solid fa-list-ul"></i> Episode Selector
            </button>
          </div>
        </div>

        {/* In-Player Episode Quick Switch Drawer */}
        <div className={`player-episode-drawer ${isDrawerOpen ? 'active' : 'hidden'}`} id="playerEpisodeDrawer">
          <div className="drawer-header">
            <h4><i className="fa-solid fa-microphone-lines"></i> Quick Episode Switch</h4>
            <button 
              type="button"
              className="btn-close-drawer" 
              id="closeDrawerBtn"
              onClick={() => setIsDrawerOpen(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="drawer-episode-list" id="drawerEpisodeList">
            {allEpisodes.map((ep) => {
              const active = ep.id === episode.id;
              const epVip = ep.isPremium || ep.season === 'VIP';
              const tag = epVip ? `VIP SP ${ep.episodeNum}` : `S${ep.season} • E${ep.episodeNum < 10 ? '0' + ep.episodeNum : ep.episodeNum}`;
              return (
                <div 
                  key={ep.id}
                  className={`drawer-ep-item ${active ? 'active' : ''}`}
                  onClick={() => {
                    onSelectEpisode(ep);
                    setIsDrawerOpen(false);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={ep.thumbnail || '/assets/thumbnails/s1_thumb.webp'} 
                    alt={ep.title} 
                    className="drawer-ep-thumb"
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
