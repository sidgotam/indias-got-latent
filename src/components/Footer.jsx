import React from 'react';

export default function Footer({ onOpenSupport, onResetCache }) {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-logo">
              <span className="logo-icon"><i className="fa-solid fa-microphone-lines"></i></span>
              <span className="logo-text">IGL<span className="logo-accent">LATENT</span></span>
              <span className="logo-badge">UNCENSORED</span>
            </div>
            <p className="footer-desc">
              The premium cinema streaming portal for India's Got Latent Season 1, Season 2, and free VIP Vault specials. Ultra-fast direct streaming with zero download risks and unedited cuts.
            </p>
          </div>

          <div className="footer-nav-col">
            <h4>Series Navigation</h4>
            <ul>
              <li>
                <a href="#season1Section" onClick={scrollTo('season1Section')} className="footer-link">
                  <i className="fa-solid fa-microphone"></i> Season 1 (Episodes 1–12)
                </a>
              </li>
              <li>
                <a href="#season2Section" onClick={scrollTo('season2Section')} className="footer-link">
                  <i className="fa-solid fa-fire"></i> Season 2 (Episodes 1–12)
                </a>
              </li>
              <li>
                <a href="#vipSection" onClick={scrollTo('vipSection')} className="footer-link">
                  <i className="fa-solid fa-crown"></i> 💎 VIP Uncut Vault (Free)
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Streaming & Options</h4>
            <ul>
              <li>
                <a href="#season1Section" onClick={scrollTo('season1Section')} className="footer-link">
                  <i className="fa-solid fa-play"></i> High-Speed Web Playback
                </a>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={onOpenSupport} 
                  className="footer-link footer-btn-link"
                  id="footerSupportLink"
                >
                  <i className="fa-solid fa-mug-hot"></i> Support the Developer (Chai)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={onResetCache} 
                  className="footer-link footer-btn-link"
                  id="footerResetLink"
                >
                  <i className="fa-solid fa-clock-rotate-left"></i> Reset Episode Progress
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 INDIA'S GOT LATENT STREAM. All rights reserved. Ultra HD Cinema Streaming Platform.
          </p>
          <div className="footer-security-badges">
            <span className="badge-item"><i className="fa-solid fa-shield-halved"></i> Protected Stream</span>
            <span className="badge-item"><i className="fa-solid fa-ban"></i> No Downloads</span>
            <span className="badge-item"><i className="fa-solid fa-gem"></i> 100% Free Access</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
