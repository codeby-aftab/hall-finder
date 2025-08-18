
import React from 'react';
import type { WeddingHall, SetView } from '../types';
import { HallCard } from '../components/HallCard';
import { HeartIcon } from '../components/icons';

interface FavoritesPageProps {
  favoriteHalls: WeddingHall[];
  setView: SetView;
  setSelectedHall: (hall: WeddingHall) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ favoriteHalls, setView, setSelectedHall }) => {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-brand-blue">Your Favorite Venues</h1>
            <p className="text-gray-600 mt-2">The places you've saved for your special day.</p>
        </div>

        {favoriteHalls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteHalls.map(hall => (
              <HallCard
                key={hall.id}
                hall={hall}
                onClick={() => {
                  setSelectedHall(hall);
                  setView('DETAIL');
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <HeartIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">No Favorites Yet</h2>
            <p className="text-gray-500 mt-2">Tap the heart icon on a venue to save it here.</p>
            <button 
                onClick={() => setView('HOME', { asRoot: true })} 
                className="mt-6 bg-brand-gold text-white font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity"
            >
                Discover Venues
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
