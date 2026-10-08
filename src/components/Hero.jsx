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
    <section className="hero-section" id="home">
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

      <div className="hero-content">
        <div className="hero-badges">
          <span className="pill-badge series-type"><i className="fa-solid fa-fire"></i> SHOW EXCLUSIVE</span>
          <span className="pill-badge ready-badge"><i className="fa-solid fa-bolt"></i> 3 EPISODES READY TO STREAM</span>
          <span className="pill-badge quality-badge"><i className="fa-solid fa-tv"></i> 4K FULL HD</span>
          <span className="pill-badge dolby-badge"><i className="fa-solid fa-microphone-lines"></i> HOST: SAMAY RAINA</span>
          <span className="pill-badge age-badge">18+ UNCENSORED</span>
          <span className="pill-badge buzzer-badge"><i className="fa-solid fa-bell"></i> RED BUZZER READY</span>
          <span className="pill-badge free-badge"><i className="fa-solid fa-crown"></i> VIP VAULT INCLUDED</span>
        </div>

        <h1 className="hero-title" id="seriesTitle">
          {seriesInfo?.title || "INDIA'S GOT LATENT"}
        </h1>
        <p className="hero-tagline" id="seriesTagline">
          {seriesInfo?.subtitle || "Rate Your Latent Talent • Complete Season 1, Season 2 & VIP Vault"}
        </p>

        <div className="hero-meta">
          <span className="meta-item"><i className="fa-solid fa-star rating-star"></i> <strong>9.9</strong> / 10 Audience Score</span>
          <span className="meta-item"><i className="fa-solid fa-calendar-days"></i> 2024 - 2025</span>
          <span className="meta-item"><i className="fa-solid fa-layer-group"></i> 2 Seasons • 30 Uncut Episodes</span>
          <span className="meta-item"><i className="fa-solid fa-closed-captioning"></i> Ultra HD 4K</span>
        </div>

        <p className="hero-synopsis" id="seriesSynopsis">
          {seriesInfo?.synopsis || "India's wildest comedy talent show where contestants put their bizarre and latent talents on the line in front of Samay Raina and an all-star comic panel! From outrageous mimicry and mind games to unexpected musical acts, contestants guess their own latent score from 1 to 10 to win cash prizes. Stream every episode with zero download risks, seamless horizontal navigation, and full unedited cuts."}
        </p>

        <div className="hero-actions">
          <button 
            type="button" 
            className="btn-primary-play" 
            id="heroPlayS1Btn"
            onClick={onWatchPilot}
          >
            <i className="fa-solid fa-play"></i> Watch Episode 1: Pilot
          </button>
          <a 
            href="#season1Section" 
            onClick={scrollTo('season1Section')} 
            className="btn-secondary-action"
          >
            <i className="fa-solid fa-layer-group"></i> Browse Episodes
          </a>
          <a 
            href="#season2Section" 
            onClick={scrollTo('season2Section')} 
            className="btn-secondary-action" 
            id="heroPlayS2Btn"
          >
            <i className="fa-solid fa-fire"></i> Season 2 Latents
          </a>
          <a 
            href="#vipSection" 
            onClick={scrollTo('vipSection')} 
            className="btn-vip-action" 
            id="heroVipBtn"
          >
            <i className="fa-solid fa-crown"></i> 💎 VIP Uncut Vault (100% Free)
          </a>
        </div>
      </div>

      {/* Floating Stream Stat Card */}
      <div className="hero-stat-card">
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
    </section>
  );
}
