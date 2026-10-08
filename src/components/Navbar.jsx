import React, { useState, useEffect } from 'react';

export default function Navbar({ searchQuery, setSearchQuery, onOpenSupport, watchedCount, masterDriveUrl }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSupportClick = () => {
    setIsMobileMenuOpen(false);
    onOpenSupport();
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`} id="navbar">
      <div className="nav-container">
        {/* Main Header Bar */}
        <div className="nav-main-row">
          <div className="nav-left">
            <a href="#home" onClick={scrollTo('home')} className="brand-logo" id="brandLogo" aria-label="India's Got Latent Home">
              <span className="logo-icon"><i className="fa-solid fa-microphone-lines"></i></span>
              <span className="logo-text">IGL<span className="logo-accent">LATENT</span></span>
              <span className="logo-badge">UNCENSORED</span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="nav-links" aria-label="Main Navigation">
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
            {/* Desktop Search Box */}
            <div className="search-box desktop-search-box">
              <i className="fa-solid fa-magnifying-glass search-icon" aria-hidden="true"></i>
              <input 
                type="text" 
                id="searchInput" 
                placeholder="Search episodes, guests..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                aria-label="Search episodes"
              />
              {searchQuery && (
                <button 
                  type="button"
                  className="clear-search-btn" 
                  id="clearSearchBtn" 
                  title="Clear search"
                  aria-label="Clear search text"
                  onClick={() => setSearchQuery('')}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Support Developer Button */}
            <button 
              type="button"
              className="btn-donate-nav" 
              id="navSupportBtn" 
              title="Support Developer / Buy a Chai"
              onClick={handleSupportClick}
            >
              <i className="fa-solid fa-mug-hot"></i>
              <span>Support Dev</span>
            </button>

            {/* Drive Folder Link */}
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
                <span>Drive</span>
              </a>
            )}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              className="mobile-menu-toggle"
              id="mobileMenuToggle"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className={isMobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
            </button>
          </div>
        </div>

        {/* Mobile Search Row (Always visible & full width on small screens) */}
        <div className="mobile-search-row">
          <div className="search-box mobile-search-box">
            <i className="fa-solid fa-magnifying-glass search-icon" aria-hidden="true"></i>
            <input 
              type="text" 
              id="mobileSearchInput" 
              placeholder="Search episodes, guests, latent tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
              aria-label="Search episodes"
            />
            {searchQuery && (
              <button 
                type="button"
                className="clear-search-btn" 
                id="clearMobileSearchBtn" 
                title="Clear search"
                aria-label="Clear search text"
                onClick={() => setSearchQuery('')}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`} id="mobileNavDrawer">
        <div className="mobile-nav-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="mobile-drawer-content">
          <div className="mobile-drawer-header">
            <div className="brand-logo">
              <span className="logo-icon"><i className="fa-solid fa-microphone-lines"></i></span>
              <span className="logo-text">IGL<span className="logo-accent">LATENT</span></span>
            </div>
            <button 
              type="button"
              className="drawer-close-btn" 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <nav className="mobile-nav-list" aria-label="Mobile Navigation Links">
            <a 
              href="#home" 
              onClick={scrollTo('home')} 
              className={`mobile-nav-item ${activeSection === 'home' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-house"></i>
              <span>Home</span>
            </a>
            <a 
              href="#season1Section" 
              onClick={scrollTo('season1Section')} 
              className={`mobile-nav-item ${activeSection === 'season1' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-microphone"></i>
              <span>Season 1 (Episodes 1–12)</span>
            </a>
            <a 
              href="#season2Section" 
              onClick={scrollTo('season2Section')} 
              className={`mobile-nav-item ${activeSection === 'season2' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-fire"></i>
              <span>Season 2 (Episodes 1–12)</span>
            </a>
            <a 
              href="#vipSection" 
              onClick={scrollTo('vipSection')} 
              className={`mobile-nav-item vip-item ${activeSection === 'vip' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-crown"></i>
              <span>VIP Latent Vault</span>
              <span className="badge-free">100% FREE</span>
            </a>
          </nav>

          <div className="mobile-drawer-actions">
            <button 
              type="button"
              className="btn-donate-mobile"
              onClick={handleSupportClick}
            >
              <i className="fa-solid fa-mug-hot"></i>
              <span>Support Dev (Buy a Chai)</span>
            </button>

            {masterDriveUrl && (
              <a 
                href={masterDriveUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-drive-mobile"
              >
                <i className="fa-solid fa-folder-open"></i>
                <span>Open Google Drive Folder</span>
              </a>
            )}

            <div className="mobile-drawer-stats">
              <span className="drawer-stat-pill">
                <i className="fa-solid fa-check"></i> Watched: <strong>{watchedCount}</strong> episodes
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
