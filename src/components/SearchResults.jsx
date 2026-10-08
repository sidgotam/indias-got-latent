import React, { useRef } from 'react';
import EpisodeCard from './EpisodeCard.jsx';

export default function SearchResults({
  searchQuery,
  results,
  onClearSearch,
  watchedEpisodes,
  onSelectEpisode
}) {
  const trackRef = useRef(null);

  const scroll = (direction) => {
    if (!trackRef.current) return;
    const scrollAmount = Math.max(340, Math.floor(trackRef.current.clientWidth * 0.75));
    trackRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="slider-section search-results-section" id="searchSection">
      <div className="section-row-header">
        <div className="row-header-left">
          <h2 className="row-title">
            <span className="row-glow-bar"></span>
            Search Results for "{searchQuery}"
          </h2>
          <p className="row-subtitle" id="searchResultCountText">
            Found {results.length} matching episode(s)
          </p>
        </div>
        <div className="row-header-right">
          <button 
            type="button"
            className="btn-text-reset" 
            id="resetSearchBtn"
            onClick={onClearSearch}
          >
            <i className="fa-solid fa-rotate-left"></i> Clear Search
          </button>
          <div className="slider-nav-btns">
            <button 
              type="button"
              className="slider-btn-prev" 
              onClick={() => scroll('prev')}
              aria-label="Slide Left"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              type="button"
              className="slider-btn-next" 
              onClick={() => scroll('next')}
              aria-label="Slide Right"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="slider-viewport">
        <button 
          type="button"
          className="floating-nav-arrow float-arrow-left" 
          onClick={() => scroll('prev')}
          aria-label="Slide Left"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <div className="horizontal-slider-track" id="searchTrack" ref={trackRef}>
          {results.length > 0 ? (
            results.map(ep => (
              <EpisodeCard 
                key={ep.id} 
                episode={ep} 
                isWatched={watchedEpisodes.has(ep.id)} 
                onSelect={onSelectEpisode} 
              />
            ))
          ) : (
            <div style={{ padding: '2.5rem', color: '#94a3b8', fontSize: '0.95rem' }}>
              <i className="fa-regular fa-folder-open" style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}></i>
              No episodes found matching "{searchQuery}". Try another title or guest keyword.
            </div>
          )}
        </div>

        <button 
          type="button"
          className="floating-nav-arrow float-arrow-right" 
          onClick={() => scroll('next')}
          aria-label="Slide Right"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
}
