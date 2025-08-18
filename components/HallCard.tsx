
import React from 'react';
import type { WeddingHall } from '../types';
import { StarRating } from './StarRating';
import { GuestIcon, LocationIcon, PriceIcon } from './icons';

interface HallCardProps {
  hall: WeddingHall;
  onClick: () => void;
}

export const HallCard: React.FC<HallCardProps> = ({ hall, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative">
        <img className="w-full h-56 object-cover" src={hall.images[0]} alt={hall.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-2 right-2 bg-brand-gold text-white text-xs font-bold px-3 py-1 rounded-full">
          FEATURED
        </div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-white text-2xl font-serif font-bold">{hall.name}</h3>
          <p className="text-gray-200 text-sm">{hall.area}, {hall.city}</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <StarRating rating={hall.rating} />
          <span className="text-sm text-gray-500">{hall.reviews.length} reviews</span>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-center">
            <GuestIcon className="w-5 h-5 mr-3 text-brand-maroon" />
            <span>{hall.capacity.min} - {hall.capacity.max} Guests</span>
          </div>
          <div className="flex items-center">
             <PriceIcon className="w-5 h-5 mr-3 text-brand-maroon" />
            <span>PKR {hall.pricePerEvent.toLocaleString()} / event</span>
          </div>
        </div>
      </div>
    </div>
  );
};
