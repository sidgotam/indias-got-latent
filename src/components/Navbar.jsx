import React, { useState, useEffect } from 'react';

export default function Navbar({ searchQuery, setSearchQuery, onOpenSupport, watchedCount, masterDriveUrl }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      
      const s1 = document.getElementById('season1Section');
      const s2 = document.getElementById('season2Section');
      const vip = document.getElementById('vipSection');
      
      const scrollPos = window.scrollY + 200;
      if (vip && scrollPos >= vip.offsetTop) {
        setActiveSection('vip');
      } else if (s2 && scrollPos >= s2.offsetTop) {
        setActiveSection('season2');
      } else if (s1 && scrollPos >= s1.offsetTop) {
        setActiveSection('season1');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <a href="#home" onClick={scrollTo('home')} className="brand-logo" id="brandLogo">
            <span className="logo-icon"><i className="fa-solid fa-microphone-lines"></i></span>
            <span className="logo-text">IGL<span className="logo-accent">LATENT</span></span>
            <span className="logo-badge">UNCENSORED</span>
          </a>
          <nav className="nav-links">
            <a 
              href="#home" 
              onClick={scrollTo('home')} 
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-house"></i> Home
            </a>
            <a 
              href="#season1Section" 
              onClick={scrollTo('season1Section')} 
              className={`nav-link ${activeSection === 'season1' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-microphone"></i> Season 1 (12)
            </a>
            <a 
              href="#season2Section" 
              onClick={scrollTo('season2Section')} 
              className={`nav-link ${activeSection === 'season2' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-fire"></i> Season 2 (12)
            </a>
            <a 
              href="#vipSection" 
              onClick={scrollTo('vipSection')} 
              className={`nav-link vip-nav-link ${activeSection === 'vip' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-crown"></i> VIP Vault <span className="badge-free">100% FREE</span>
            </a>
          </nav>
        </div>

        <div className="nav-right">
          {/* Search Box */}
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input 
              type="text" 
              id="searchInput" 
              placeholder="Search episodes, guests, latent tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {searchQuery && (
              <button 
                className="clear-search-btn" 
                id="clearSearchBtn" 
                title="Clear search"
                onClick={() => setSearchQuery('')}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Support Developer Button (Chai Contribution) */}
          <button 
            type="button"
            className="btn-donate-nav" 
            id="navSupportBtn" 
            title="Support Developer / Buy a Chai"
            onClick={onOpenSupport}
          >
            <i className="fa-solid fa-mug-hot"></i>
            <span>Support Dev</span>
          </button>

          {masterDriveUrl && (
            <a 
              href={masterDriveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-drive-folder-nav" 
              id="navDriveFolderBtn"
              title="Open Google Drive Master Folder"
            >
              <i className="fa-solid fa-folder-open"></i>
              <span>Drive Folder</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
