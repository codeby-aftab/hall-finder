
import React from 'react';
import { StarIcon } from './icons';

interface StarRatingProps {
  rating: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, className = 'w-5 h-5' }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center text-brand-gold">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} className={className} filled={true} />
      ))}
      {/* Note: Simplified to only show full stars for this implementation */}
      {[...Array(5 - fullStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} className={`${className} text-gray-300`} filled={true} />
      ))}
    </div>
  );
};
