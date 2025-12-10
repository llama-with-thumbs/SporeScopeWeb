// ImageModal.tsx

import React, { useEffect, useState } from 'react';

interface ImageModalProps {
  src: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, onClose }) => {
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);
  const [showImage, setShowImage] = useState(false);

  // Start gradual darkening immediately
  useEffect(() => {
    // Fade background opacity from 0 → 1 over 1 sec
    setTimeout(() => setBackgroundOpacity(1), 10);

    // Image appears after 1 second
    const timer = setTimeout(() => setShowImage(true), 300);

    return () => clearTimeout(timer);
  }, []);

  // Close modal with reversed animation
  const handleClose = () => {
    setShowImage(false);               // hide image first
    setBackgroundOpacity(0);           // fade out background

    setTimeout(() => {
      onClose();                       // fully close after fade-out
    }, 1000);
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: `rgba(0, 0, 0, ${0.9 * backgroundOpacity})`,
        backdropFilter: backgroundOpacity > 0 ? 'blur(1px)' : 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: 5000,
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      {showImage && (
        <img
          src={src}
          alt="full-size"
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            borderRadius: '6px',
            opacity: showImage ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}
    </div>
  );
};

export default ImageModal;
