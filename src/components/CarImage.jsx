import { useState, useEffect } from 'react';

const CarImage = ({ numberPlate, alt, style, className }) => {
  const formats = ['webp', 'jpg', 'png', 'jpeg'];
  const [formatIndex, setFormatIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setFormatIndex(0);
    setHasError(false);
  }, [numberPlate]);

  const handleError = (e) => {
    if (formatIndex < formats.length - 1) {
      setFormatIndex(prev => prev + 1);
    } else {
      setHasError(true);
      e.target.onerror = null; // Prevent infinite loop if default image also fails
    }
  };

  const src = hasError 
    ? '/cars/default_car.png' 
    : `/cars/${numberPlate}.${formats[formatIndex]}`;

  return (
    <img 
      src={src} 
      alt={alt || "Car"} 
      onError={handleError}
      style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }}
      className={className}
    />
  );
};

export default CarImage;
