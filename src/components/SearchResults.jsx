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
    const scrollAmount = Math.max(280, Math.floor(trackRef.current.clientWidth * 0.75));
    trackRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="slider-section search-results-section" id="searchSection" aria-label="Search Results">
      <div className="section-row-header">
        <div className="row-header-left">
          <div className="row-title-wrap">
            <h2 className="row-title">
              <span className="row-glow-bar"></span>
              <i className="fa-solid fa-magnifying-glass title-icon"></i> Results for "{searchQuery}"
            </h2>
            <span className="row-badge">
              {results.length} Episode{results.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="row-subtitle" id="searchResultCountText">
            Found {results.length} matching episode{results.length === 1 ? '' : 's'} in the vault
          </p>
        </div>
        <div className="row-header-right">
          <button 
            type="button"
            className="btn-text-reset" 
            id="resetSearchBtn"
            onClick={onClearSearch}
            aria-label="Clear current search query"
          >
            <i className="fa-solid fa-rotate-left"></i>
            <span>Clear Search</span>
          </button>
          <div className="slider-nav-btns" aria-label="Search Results Controls">
            <button 
              type="button"
              className="slider-btn-prev" 
              onClick={() => scroll('prev')}
              aria-label="Slide Left"
              title="Previous Results"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              type="button"
              className="slider-btn-next" 
              onClick={() => scroll('next')}
              aria-label="Slide Right"
              title="Next Results"
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

        <div className="horizontal-slider-track" id="searchTrack" ref={trackRef} tabIndex={0} role="region" aria-label="Search Results Track">
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
            <div className="no-results-box">
              <i className="fa-regular fa-folder-open"></i>
              <p>No episodes found matching "<strong>{searchQuery}</strong>". Try another keyword, guest name, or season tag.</p>
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
