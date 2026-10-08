import React from 'react';

export default function Hero({ onWatchPilot, watchedCount, seriesInfo }) {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="home" aria-label="India's Got Latent Hero Spotlight">
      <div className="hero-backdrop" id="heroBackdrop">
        <picture>
          <source srcSet="/assets/hero_banner.webp" type="image/webp" />
          <img 
            src="/assets/hero_banner.jpg" 
            alt="India's Got Latent Hero Banner" 
            className="hero-banner-img"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-gradient-overlay"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          {/* Curated Badges */}
          <div className="hero-badges" aria-label="Show Features">
            <span className="pill-badge series-type"><i className="fa-solid fa-fire"></i> SHOW EXCLUSIVE</span>
            <span className="pill-badge ready-badge"><i className="fa-solid fa-bolt"></i> 3 EPISODES READY</span>
            <span className="pill-badge quality-badge"><i className="fa-solid fa-tv"></i> 4K FULL HD</span>
            <span className="pill-badge dolby-badge"><i className="fa-solid fa-microphone-lines"></i> HOST: SAMAY RAINA</span>
            <span className="pill-badge age-badge">18+ UNCENSORED</span>
            <span className="pill-badge buzzer-badge"><i className="fa-solid fa-bell"></i> RED BUZZER</span>
            <span className="pill-badge free-badge"><i className="fa-solid fa-crown"></i> VIP VAULT FREE</span>
          </div>

          <h1 className="hero-title" id="seriesTitle">
            {seriesInfo?.title || "INDIA'S GOT LATENT"}
          </h1>
          
          <p className="hero-tagline" id="seriesTagline">
            {seriesInfo?.subtitle || "Rate Your Latent Talent • Complete Season 1, Season 2 & VIP Vault"}
          </p>

          <div className="hero-meta" aria-label="Show Details">
            <span className="meta-item"><i className="fa-solid fa-star rating-star"></i> <strong>9.9</strong>/10 Audience</span>
            <span className="meta-item"><i className="fa-solid fa-calendar-days"></i> 2024–2025</span>
            <span className="meta-item"><i className="fa-solid fa-layer-group"></i> 2 Seasons • 30 Uncut Episodes</span>
            <span className="meta-item"><i className="fa-solid fa-closed-captioning"></i> Ultra HD</span>
          </div>

          <p className="hero-synopsis" id="seriesSynopsis">
            {seriesInfo?.synopsis || "India's wildest comedy talent show where contestants put their bizarre latent talents on the line in front of Samay Raina and an all-star comic panel! Stream every episode with fast cinema playback, seamless horizontal navigation, and full unedited cuts."}
          </p>

          <div className="hero-actions" aria-label="Quick Actions">
            <button 
              type="button" 
              className="btn-primary-play" 
              id="heroPlayS1Btn"
              onClick={onWatchPilot}
            >
              <i className="fa-solid fa-play"></i>
              <span>Watch Episode 1: Pilot</span>
            </button>
            <a 
              href="#season1Section" 
              onClick={scrollTo('season1Section')} 
              className="btn-secondary-action"
            >
              <i className="fa-solid fa-layer-group"></i>
              <span>Browse Episodes</span>
            </a>
            <a 
              href="#season2Section" 
              onClick={scrollTo('season2Section')} 
              className="btn-secondary-action" 
              id="heroPlayS2Btn"
            >
              <i className="fa-solid fa-fire"></i>
              <span>Season 2 Latents</span>
            </a>
            <a 
              href="#vipSection" 
              onClick={scrollTo('vipSection')} 
              className="btn-vip-action" 
              id="heroVipBtn"
            >
              <i className="fa-solid fa-crown"></i>
              <span>VIP Uncut Vault</span>
            </a>
          </div>
        </div>

        {/* Responsive Stream Stat Card */}
        <div className="hero-stat-card" aria-label="Streaming Statistics">
          <div className="stat-item">
            <span className="stat-number">24</span>
            <span className="stat-label">Main Episodes</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">06</span>
            <span className="stat-label">VIP Specials (Free)</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number" id="statsWatched">{watchedCount}</span>
            <span className="stat-label">Watched Episodes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
