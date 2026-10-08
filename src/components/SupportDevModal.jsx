import React, { useState, useEffect } from 'react';

const UPI_ID = 'siddharthakumar109-2@okhdfcbank';
const PAYEE_NAME = 'Siddhartha Gautam';

const PRESET_TIERS = [
  { id: '20', label: '₹20', subtitle: 'Chai' },
  { id: '50', label: '₹50', subtitle: 'Coffee' },
  { id: '100', label: '₹100', subtitle: 'Snacks' },
  { id: 'custom', label: 'Custom', subtitle: 'Any' }
];

export default function SupportDevModal({
  isOpen,
  onClose,
  onProceedToVideo,
  showToast
}) {
  const [selectedTier, setSelectedTier] = useState('20');
  const [customAmount, setCustomAmount] = useState('150');
  const [isMobileQrOpen, setIsMobileQrOpen] = useState(false);
  const [isQrZoomed, setIsQrZoomed] = useState(false);
  const [hasAttemptedPay, setHasAttemptedPay] = useState(false);

  // Close on Escape key (first closes zoom overlay, then modal)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isQrZoomed) {
          setIsQrZoomed(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isQrZoomed, onClose]);

  // Reset transient state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setHasAttemptedPay(false);
      setIsMobileQrOpen(false);
      setIsQrZoomed(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate effective amount
  const parsedCustom = parseInt(customAmount, 10);
  const effectiveAmount = selectedTier === 'custom' 
    ? (Number.isFinite(parsedCustom) && parsedCustom > 0 ? parsedCustom : 1)
    : parseInt(selectedTier, 10);

  // Standard UPI URI deep link
  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&mc=&tr=&tn=Support%20IGL%20Developer&am=${encodeURIComponent(effectiveAmount)}&cu=INR`;

  // Handle Pay via UPI tap
  const handlePay = (e) => {
    e.preventDefault();
    setHasAttemptedPay(true);

    // Copy UPI ID to clipboard as a helpful fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(UPI_ID).catch(() => {});
    }

    if (showToast) {
      showToast(`🚀 Opening UPI app for ₹${effectiveAmount}...`, 'info');
    }

    // Launch UPI deep link
    window.location.href = upiUrl;
  };

  // Handle Custom Amount Input Change
  const handleCustomChange = (e) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCustomAmount(clean);
  };

  return (
    <div 
      className="donate-modal active" 
      id="donateModal" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="donateModalTitle"
    >
      {/* Backdrop */}
      <div 
        className="modal-backdrop" 
        id="donateBackdrop" 
        onClick={onClose}
      ></div>

      {/* Compact Dialog */}
      <div className="donate-dialog compact-support-dialog">
        {/* Close Button */}
        <button 
          type="button" 
          className="btn-close-donate" 
          id="closeDonateBtn" 
          title="Close modal"
          aria-label="Close Support Modal"
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Modal Header */}
        <div className="support-modal-header">
          <div className="support-header-text">
            <h3 className="support-title" id="donateModalTitle">
              <span className="support-icon"><i className="fa-solid fa-mug-hot"></i></span>
              Support the Developer
            </h3>
            <p className="support-subtitle">
              Help keep India's Got Latent stream ad-free & uncensored.
            </p>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="support-modal-content">
          {/* Left Column (Desktop QR) / Collapsible (Mobile QR) */}
          <div className={`support-qr-section ${isMobileQrOpen ? 'mobile-expanded' : ''}`}>
            <div 
              className="support-qr-box" 
              onClick={() => setIsQrZoomed(true)} 
              title="Click to zoom QR code"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') setIsQrZoomed(true); }}
            >
              <img 
                src="/assets/qr.jpg" 
                alt="Scan to support Siddhartha Gautam via UPI" 
                className="support-qr-image"
                width="160"
                height="190"
                loading="eager"
                onError={(e) => {
                  if (!e.target.dataset.tried) {
                    e.target.dataset.tried = 'true';
                    e.target.src = '/assets/developer_qr.jpg';
                  }
                }}
              />
              <span className="qr-zoom-hint">
                <i className="fa-solid fa-magnifying-glass-plus"></i> Tap to zoom
              </span>
            </div>
            <span className="support-qr-caption">Scan with any UPI app</span>
          </div>

          {/* Right Column (Controls & Amount Selection) */}
          <div className="support-controls-section">
            {/* Amount Selection Grid */}
            <div className="amount-selection-wrap">
              <span className="amount-selection-label">Choose amount:</span>
              <div className="amount-tier-row" role="group" aria-label="Choose support amount">
                {PRESET_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    className={`amount-tier-pill ${selectedTier === tier.id ? 'active' : ''}`}
                    onClick={() => setSelectedTier(tier.id)}
                    aria-pressed={selectedTier === tier.id}
                  >
                    <span className="tier-amount">{tier.label}</span>
                  </button>
                ))}
              </div>

              {/* Inline Custom Amount Input */}
              {selectedTier === 'custom' && (
                <div className="custom-amount-input-row">
                  <span className="currency-prefix">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder="Enter amount"
                    className="custom-amount-field"
                    id="customAmountField"
                    aria-label="Custom support amount in Rupees"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Primary Payment CTA */}
            <button
              type="button"
              className="btn-pay-primary"
              id="payViaUpiAppBtn"
              onClick={handlePay}
              aria-label={`Pay ₹${effectiveAmount} via UPI`}
            >
              <i className="fa-solid fa-bolt"></i>
              <span>Pay ₹{effectiveAmount} via UPI</span>
            </button>

            {/* Mobile Scan QR Toggle (Hidden on desktop) */}
            <button
              type="button"
              className="btn-toggle-qr-mobile"
              id="toggleQrMobileBtn"
              onClick={() => setIsMobileQrOpen(!isMobileQrOpen)}
              aria-expanded={isMobileQrOpen}
            >
              <i className="fa-solid fa-qrcode"></i>
              <span>{isMobileQrOpen ? 'Hide QR Code' : 'Scan QR instead'}</span>
              <i className={`fa-solid ${isMobileQrOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
            </button>

            {/* Secondary Continue Action */}
            <button
              type="button"
              className="btn-continue-video-clean"
              id="continueToVideoBtn"
              onClick={onProceedToVideo}
              aria-label="Continue to Video"
            >
              <span>{hasAttemptedPay ? 'Payment done? Continue to Video' : 'Continue to Video'}</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* QR Zoom Overlay Modal */}
      {isQrZoomed && (
        <div 
          className="qr-zoom-overlay" 
          onClick={() => setIsQrZoomed(false)} 
          role="dialog" 
          aria-modal="true" 
          aria-label="Enlarged QR Code"
        >
          <div className="qr-zoom-dialog" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="btn-close-zoom" 
              onClick={() => setIsQrZoomed(false)}
              aria-label="Close enlarged QR"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h4 className="zoom-title">Scan UPI QR Code</h4>
            <div className="zoom-image-wrapper">
              <img 
                src="/assets/qr.jpg" 
                alt="Enlarged UPI QR code" 
                className="zoom-qr-img"
                width="260"
                height="320"
                onError={(e) => {
                  e.target.src = '/assets/developer_qr.jpg';
                }}
              />
            </div>
            <p className="zoom-desc">Scan using GPay, PhonePe, Paytm, or any UPI app</p>
          </div>
        </div>
      )}
    </div>
  );
}
