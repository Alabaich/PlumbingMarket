'use client';

import React from 'react';

interface PlaceholderImageProps {
  src?: string; // Optional source for the image
  alt?: string; // Optional alt text for the image
  className?: string; // Optional class for styling
  size?: 'small' | 'medium' | 'large'; // Placeholder size: small, medium, or large
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  src,
  alt = 'Placeholder',
  className,
  size = 'medium', // Default size is medium
}) => {
  const placeholderMap = {
    small: '/placeholderSmall.webp',
    medium: '/placeholderMedium.webp',
    large: '/placeholderLarge.webp',
  };

  const placeholder = placeholderMap[size]; // Select the appropriate placeholder size

  return (
    <img
      src={src || placeholder} // Use provided src or fallback to the appropriate placeholder
      alt={alt}
      className={className}
    />
  );
};

export default PlaceholderImage;
