import React, { useState } from 'react';

interface FixedImageProps {
  candidates: string[];
  alt: string;
  className?: string;
  fallbackIcon?: string;
}

export const FixedImage: React.FC<FixedImageProps> = ({
  candidates,
  alt,
  className = 'w-full h-auto object-contain',
  fallbackIcon = '🌸'
}) => {
  const [index, setIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  const handleError = () => {
    if (index + 1 < candidates.length) {
      setIndex(prev => prev + 1);
    } else {
      setAllFailed(true);
    }
  };

  if (allFailed || candidates.length === 0) {
    return (
      <div className="w-full min-h-[220px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-50 to-pink-50 rounded-2xl text-center">
        <span className="text-4xl mb-2">{fallbackIcon}</span>
        <span className="text-sm font-bold text-slate-700">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={candidates[index]}
      alt={alt}
      className={className}
      onError={handleError}
      loading="eager"
      decoding="async"
    />
  );
};
