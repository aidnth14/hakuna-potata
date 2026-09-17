import React, { useState } from 'react';

interface PotataIconProps {
  className?: string;
  size?: number;
  rotation?: number; // degrees, default 15deg (slightly rotated to the right)
  invert?: boolean;
}

export const PotataIcon: React.FC<PotataIconProps> = ({
  className = '',
  size = 36,
  rotation = 15,
  invert = false,
}) => {
  // Primary URL specified by user:
  const primaryUrl = 'https://img.icons8.com/?size=100&id=qO9PznYhh370&format=png&color=000000';
  // Fallbacks: local downloaded asset & alternative
  const fallbackUrl = '/tab-icon.png';
  const secondaryFallbackUrl = '/potata-icon.png';

  const [imgSrc, setImgSrc] = useState<string>(primaryUrl);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc === primaryUrl) {
      setImgSrc(fallbackUrl);
    } else if (imgSrc === fallbackUrl) {
      setImgSrc(secondaryFallbackUrl);
    } else {
      setHasError(true);
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center transition-transform duration-300 hover:scale-110 ${className}`}
      style={{
        width: size,
        height: size,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        display: 'inline-block',
      }}
      title="Hakuna Potata Icon (slightly rotated right)"
    >
      {!hasError ? (
        <img
          src={imgSrc}
          alt="HAKUNA POTATA Icon"
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: invert ? 'brightness(0) invert(1)' : 'none',
          }}
        />
      ) : (
        /* Vector SVG fallback */
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50,22 C68,20 80,32 82,48 C84,65 72,78 52,80 C34,82 20,70 18,52 C16,36 32,24 50,22 Z"
            fill="#d97706"
          />
          <ellipse cx="38" cy="38" rx="3" ry="2" fill="#92400e" />
          <ellipse cx="62" cy="42" rx="3.5" ry="2.2" fill="#92400e" />
          <ellipse cx="44" cy="62" rx="4" ry="2.5" fill="#92400e" />
          <circle cx="43" cy="48" r="2.5" fill="#18181b" />
          <circle cx="57" cy="48" r="2.5" fill="#18181b" />
          <path d="M47,54 Q50,57 53,54" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};
