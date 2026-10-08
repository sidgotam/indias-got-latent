import React from 'react';
import { isEpisodeStreamReady } from '../data/seriesData.js';

export default function EpisodeCard({ episode, isWatched, onSelect }) {
  const isVip = Boolean(episode.isPremium || episode.season === 'VIP');
  const isPlayable = isEpisodeStreamReady(episode);
  const epNumFormatted = episode.episodeNum < 10 ? `0${episode.episodeNum}` : episode.episodeNum;
  const seasonTag = isVip ? `VIP • SP ${epNumFormatted}` : `S${episode.season} • EP ${epNumFormatted}`;

  const handleClick = (e) => {
    e.preventDefault();
    onSelect(episode);
  };

  return (
    <div 
      className={`episode-card ${isVip ? 'is-vip' : ''} ${isPlayable ? 'is-stream-ready' : ''}`}
      data-id={episode.id}
      onClick={handleClick}
    >
      <div className="card-thumbnail-wrap" data-action="play">
        <picture>
          <source 
            srcSet={episode.thumbnail?.replace(/\.(jpg|png)$/, '.webp') || '/assets/thumbnails/s1_thumb.webp'} 
            type="image/webp" 
          />
          <img 
            src={episode.thumbnail || '/assets/thumbnails/s1_thumb.jpg'} 
            alt={episode.title} 
            className="card-img" 
            width="240" 
            height="135" 
            loading="lazy" 
            decoding="async"
          />
        </picture>
        <div className="card-thumbnail-overlay"></div>
        <span className="card-badge-ep">{seasonTag}</span>
        {isVip && (
          <span className="card-badge-vip"><i className="fa-solid fa-crown"></i> VIP</span>
        )}
        {isPlayable ? (
          <span className="card-badge-ready"><i className="fa-solid fa-bolt"></i> STREAM READY (1080p)</span>
        ) : (
          <span className="card-badge-duration">{episode.duration}</span>
        )}
        <button 
          type="button"
          className={`card-play-hover-btn ${isPlayable ? 'btn-hover-live' : ''}`} 
          title={isPlayable ? 'Stream Episode' : 'Episode Info'}
        >
          <i className="fa-solid fa-play"></i>
        </button>
        {isWatched && (
          <div className="card-progress-bar">
            <div className="progress-fill"></div>
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="card-title-row">
          <h4 className="card-title" title={episode.title}>{episode.title}</h4>
        </div>
        <div className="card-meta-line">
          {isPlayable ? (
            <span className="meta-tag-pill meta-stream-live">
              <i className="fa-solid fa-circle-play"></i> Available Now
            </span>
          ) : (
            <span className="meta-tag-pill">{isVip ? 'VIP Special' : 'Coming Soon'}</span>
          )}
          <span className="meta-dot">•</span>
          <span className="meta-runtime">{episode.fileSize || episode.duration}</span>
          {isWatched && (
            <span className="watched-tag"><i className="fa-solid fa-check"></i> Watched</span>
          )}
        </div>
        <button 
          type="button"
          className={`btn-quick-play ${isPlayable ? 'btn-live-stream' : ''}`}
        >
          <i className="fa-solid fa-play"></i> {isPlayable ? 'Watch Video' : 'Episode Info'}
        </button>
      </div>
    </div>
  );
}
