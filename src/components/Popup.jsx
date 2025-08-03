// src/components/Popup.jsx
import { useEffect } from 'react';
import '../assets/scss/components/_popup.scss';

const Popup = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true 
}) => {
  
  // Handle ESC key press to close popup
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scrolling when popup is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click to close popup
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={handleBackdropClick}>
      <div className={`popup-container popup-container--${size}`}>
        {/* Popup Header */}
        <div className="popup-header">
          <h2 className="popup-title">{title}</h2>
          {showCloseButton && (
            <button 
              className="popup-close-button"
              onClick={onClose}
              aria-label="Close popup"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M18 6L6 18M6 6L18 18" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Popup Content */}
        <div className="popup-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;