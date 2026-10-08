import React, { useState, useEffect } from 'react';

const UPI_ID = 'siddharthakumar109-2@okhdfcbank';
const PAYEE_NAME = 'Siddhartha Gautam';

export default function SupportDevModal({
  isOpen,
  targetEpisode,
  onClose,
  onProceedToVideo,
  onContributed,
  showToast
}) {
  const [selectedAmount, setSelectedAmount] = useState('20');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getUpiUrl = (amt) => {
    const amtParam = amt && amt !== 'custom' ? `&am=${encodeURIComponent(amt)}` : '';
    return `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&mc=&tr=&tn=Support%20IGL%20Developer${amtParam}&cu=INR`;
  };

  const currentUpiUrl = getUpiUrl(selectedAmount);

  const handleCopyUpi = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(UPI_ID).then(() => {
        setCopied(true);
        showToast('UPI ID copied to clipboard! (siddharthakumar109-2@okhdfcbank)', 'success');
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleIntentClick = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(UPI_ID).catch(() => {});
    }
    const amtLabel = selectedAmount !== 'custom' ? `for ₹${selectedAmount}` : '';
    showToast(`🚀 Opening UPI Payment App ${amtLabel}... (UPI ID copied)`, 'info');
  };

  const formatTargetTitle = () => {
    if (!targetEpisode) return "India's Got Latent Stream";
    const isVip = targetEpisode.isPremium || targetEpisode.season === 'VIP';
    const tag = isVip 
      ? `VIP SP ${targetEpisode.episodeNum < 10 ? '0' + targetEpisode.episodeNum : targetEpisode.episodeNum}` 
      : `S${targetEpisode.season} • EP ${targetEpisode.episodeNum < 10 ? '0' + targetEpisode.episodeNum : targetEpisode.episodeNum}`;
    return `${tag}: ${targetEpisode.title}`;
  };

  return (
    <div className="donate-modal active" id="donateModal" role="dialog" aria-modal="true">
      <div className="modal-backdrop" id="donateBackdrop" onClick={onClose}></div>
      <div className="donate-dialog">
        <button 
          type="button" 
          className="btn-close-donate" 
          id="closeDonateBtn" 
          title="Close"
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="donate-header">
          <div className="donate-icon-badge">
            <i className="fa-solid fa-mug-hot"></i>
          </div>
          <div className="donate-badge-pill">
            <i className="fa-solid fa-heart"></i> <span>SUPPORT THE DEVELOPER</span>
          </div>
          <h3 className="donate-title">Enjoying India's Got Latent?</h3>
          <p className="donate-subtitle">
            100% ad-free & uncensored stream! If you appreciate the platform, consider buying a chai to help keep the stream fast and alive. 💖
          </p>
        </div>

        <div className="donate-body">
          {/* Left Column: QR Code Display Card */}
          <div className="donate-qr-card">
            <div className="qr-glow-wrapper">
              <picture>
                <source srcSet="/assets/qr.jpg" type="image/jpeg" />
                <source srcSet="/assets/developer_qr.webp" type="image/webp" />
                <img 
                  src="/assets/qr.jpg" 
                  alt="Scan QR to Support Siddhartha Gautam" 
                  id="developerQrImg" 
                  className="developer-qr-img"
                  width="210"
                  height="290"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to developer_qr.jpg if qr.jpg ever encounters an issue
                    if (!e.target.dataset.tried) {
                      e.target.dataset.tried = 'true';
                      e.target.src = '/assets/developer_qr.jpg';
                    }
                  }}
                />
              </picture>
            </div>
            <div className="qr-scan-label">
              <i className="fa-solid fa-qrcode"></i> Scan with any UPI App
            </div>
            <span className="qr-scan-sublabel">Instant auto-verification</span>
          </div>

          {/* Right Column: Payment Details & Direct Redirect */}
          <div className="donate-details-card">
            {/* Step 1: Select Contribution Tier */}
            <div className="detail-section">
              <span className="detail-section-label">
                <i className="fa-solid fa-mug-hot"></i> Choose Contribution Amount
              </span>
              <div className="chai-tier-grid">
                <button 
                  type="button"
                  className={`chai-tier-btn ${selectedAmount === '20' ? 'active' : ''}`}
                  onClick={() => setSelectedAmount('20')}
                >
                  <span className="tier-icon">☕</span>
                  <span className="tier-val">₹20</span>
                  <span className="tier-name">Chai</span>
                </button>
                <button 
                  type="button"
                  className={`chai-tier-btn ${selectedAmount === '50' ? 'active' : ''}`}
                  onClick={() => setSelectedAmount('50')}
                >
                  <span className="tier-icon">🧋</span>
                  <span className="tier-val">₹50</span>
                  <span className="tier-name">Coffee</span>
                </button>
                <button 
                  type="button"
                  className={`chai-tier-btn ${selectedAmount === '100' ? 'active' : ''}`}
                  onClick={() => setSelectedAmount('100')}
                >
                  <span className="tier-icon">🍕</span>
                  <span className="tier-val">₹100</span>
                  <span className="tier-name">Snacks</span>
                </button>
                <button 
                  type="button"
                  className={`chai-tier-btn ${selectedAmount === 'custom' ? 'active' : ''}`}
                  onClick={() => setSelectedAmount('custom')}
                >
                  <span className="tier-icon">❤️</span>
                  <span className="tier-val">Custom</span>
                  <span className="tier-name">Any Amt</span>
                </button>
              </div>
            </div>

            {/* Step 2: Instant 1-Tap UPI Pay Button */}
            <div className="detail-section">
              <a 
                href={currentUpiUrl} 
                className="btn-pay-intent" 
                id="payViaUpiAppBtn" 
                title="Launch Installed UPI App"
                onClick={handleIntentClick}
              >
                <span className="pay-intent-icon"><i className="fa-solid fa-bolt"></i></span>
                <span className="pay-intent-text">
                  Pay <strong>{selectedAmount === 'custom' ? 'Any Amount' : `₹${selectedAmount}`}</strong> via UPI App
                </span>
                <i className="fa-solid fa-arrow-up-right-from-square arrow-icon"></i>
              </a>

              <div className="upi-apps-row">
                <span className="upi-apps-label">Or open directly:</span>
                <a 
                  href={currentUpiUrl} 
                  className="upi-app-pill upi-intent-link" 
                  data-app="gpay" 
                  title="Open Google Pay"
                  onClick={handleIntentClick}
                >
                  <i className="fa-brands fa-google-pay"></i> GPay
                </a>
                <a 
                  href={currentUpiUrl} 
                  className="upi-app-pill upi-intent-link" 
                  data-app="phonepe" 
                  title="Open PhonePe"
                  onClick={handleIntentClick}
                >
                  <i className="fa-solid fa-bolt"></i> PhonePe
                </a>
                <a 
                  href={currentUpiUrl} 
                  className="upi-app-pill upi-intent-link" 
                  data-app="paytm" 
                  title="Open Paytm"
                  onClick={handleIntentClick}
                >
                  <i className="fa-solid fa-wallet"></i> Paytm
                </a>
                <a 
                  href={currentUpiUrl} 
                  className="upi-app-pill upi-intent-link" 
                  data-app="bhim" 
                  title="Open BHIM"
                  onClick={handleIntentClick}
                >
                  <i className="fa-solid fa-building-columns"></i> BHIM
                </a>
              </div>
            </div>

            {/* Step 3: Desktop Manual UPI Copy */}
            <div className="upi-box">
              <div className="upi-label-row">
                <span className="upi-label">UPI ID: Siddhartha Gautam</span>
              </div>
              <div className="upi-row">
                <code className="upi-text" id="upiIdText">{UPI_ID}</code>
                <button 
                  type="button"
                  className={`btn-copy-upi ${copied ? 'copied' : ''}`} 
                  id="copyUpiBtn" 
                  title="Copy UPI ID"
                  onClick={handleCopyUpi}
                >
                  <i className={copied ? "fa-solid fa-check" : "fa-regular fa-copy"}></i> 
                  <span id="copyBtnText">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Target Episode Preview */}
            <div className="qr-target-preview">
              <i className="fa-solid fa-circle-play"></i>
              <div className="qr-target-text">
                <span className="target-head">Next Up:</span>
                <strong id="donateEpisodeTitle" className="target-title">
                  {formatTargetTitle()}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="donate-footer">
          <button 
            type="button" 
            className="btn-contributed-action" 
            id="donateContributedBtn"
            onClick={onContributed}
          >
            <i className="fa-solid fa-heart"></i> I Have Contributed!
          </button>
          <button 
            type="button" 
            className="btn-continue-play" 
            id="donateContinueBtn"
            onClick={onProceedToVideo}
          >
            <span>Continue to Video</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
