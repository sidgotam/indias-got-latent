import React, { useRef, useState } from 'react';
import EpisodeCard from './EpisodeCard.jsx';

export default function EpisodeSlider({
  sectionId,
  trackId,
  title,
  subtitle,
  icon,
  glowClass,
  badge,
  liveBadge,
  counterText,
  isVip,
  episodes,
  watchedEpisodes,
  onSelectEpisode
}) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const scroll = (direction) => {
    if (!trackRef.current) return;
    const scrollAmount = Math.max(280, Math.floor(trackRef.current.clientWidth * 0.75));
    trackRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return;
    setIsDragging(true);
    setStartX(e.clientX - trackRef.current.getBoundingClientRect().left);
    setScrollStart(trackRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.clientX - trackRef.current.getBoundingClientRect().left;
    const walk = (x - startX) * 1.4;
    trackRef.current.scrollLeft = scrollStart - walk;
  };

  return (
    <section 
      className={`slider-section ${isVip ? 'vip-slider-section' : ''}`} 
      id={sectionId}
      aria-label={title}
    >
      <div className={`section-row-header ${isVip ? 'vip-row-header' : ''}`}>
        <div className="row-header-left">
          {isVip && (
            <div className="vip-header-badge-row">
              <span className="highlight-badge"><i className="fa-solid fa-gem"></i> VIP EXCLUSIVE</span>
              <span className="badge-free"><i className="fa-solid fa-gift"></i> 100% FREE ACCESS</span>
            </div>
          )}
          <div className="row-title-wrap">
            <h2 className={`row-title ${isVip ? 'vip-title' : ''}`}>
              <span className={`row-glow-bar ${glowClass || ''}`}></span>
              <i className={`fa-solid ${icon} title-icon ${isVip ? 'vip-icon-gold' : ''}`}></i> {title}
            </h2>
            <div className="row-badges-wrap">
              {badge && <span className={`row-badge ${isVip ? 's2-badge' : ''}`}>{badge}</span>}
              {liveBadge && (
                <span className="row-badge row-badge-live">
                  <i className="fa-solid fa-circle"></i> {liveBadge}
                </span>
              )}
            </div>
          </div>
          {subtitle && (
            <p className={`row-subtitle ${isVip ? 'vip-subtitle' : ''}`}>{subtitle}</p>
          )}
        </div>

        <div className="row-header-right">
          {counterText && (
            <span className={`slider-counter ${isVip ? 'vip-counter' : ''}`}>{counterText}</span>
          )}
          <div className="slider-nav-btns" aria-label="Slider Controls">
            <button 
              type="button"
              className={`slider-btn-prev ${isVip ? 'vip-btn-nav' : ''}`} 
              aria-label={`Previous ${title} episodes`}
              title="Previous Episodes"
              onClick={() => scroll('prev')}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              type="button"
              className={`slider-btn-next ${isVip ? 'vip-btn-nav' : ''}`} 
              aria-label={`Next ${title} episodes`}
              title="Next Episodes"
              onClick={() => scroll('next')}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className={`slider-viewport ${isVip ? 'vip-viewport' : ''}`}>
        <button 
          type="button"
          className={`floating-nav-arrow float-arrow-left ${isVip ? 'vip-float-arrow' : ''}`} 
          aria-label="Previous Episodes"
          onClick={() => scroll('prev')}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <div 
          className={`horizontal-slider-track ${isVip ? 'vip-track' : ''}`} 
          id={trackId}
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseUp}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          tabIndex={0}
          role="region"
          aria-label={`${title} Episode Track`}
        >
          {episodes.map(ep => (
            <EpisodeCard 
              key={ep.id} 
              episode={ep} 
              isWatched={watchedEpisodes.has(ep.id)} 
              onSelect={onSelectEpisode} 
            />
          ))}
        </div>

        <button 
          type="button"
          className={`floating-nav-arrow float-arrow-right ${isVip ? 'vip-float-arrow' : ''}`} 
          aria-label="Next Episodes"
          onClick={() => scroll('next')}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}
