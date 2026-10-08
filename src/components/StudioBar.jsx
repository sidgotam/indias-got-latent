import React from 'react';

export default function StudioBar() {
  return (
    <section className="stream-studio-bar" aria-label="Studio Stream Status">
      <div className="studio-bar-container">
        <div className="studio-bar-left">
          <span className="studio-status-dot" aria-hidden="true"></span>
          <span className="studio-brand">IGL LATENT ARENA</span>
          <span className="studio-separator" aria-hidden="true">/</span>
          <span className="studio-status-text">
            Samay Raina's Uncut Direct Stream • Non-Download Network
          </span>
        </div>
        <div className="studio-bar-right">
          <span className="studio-quality-tag">
            <i className="fa-solid fa-bolt"></i> 1080p 60FPS
          </span>
        </div>
      </div>
    </section>
  );
}
