
import React from 'react';
import type { WeddingHall, SetView, VenueType } from '../types';
import { MOCK_HALLS } from '../constants';
import { HallCard } from '../components/HallCard';
import { SearchIcon } from '../components/icons';

interface HomePageProps {
  setView: SetView;
  setSelectedHall: (hall: WeddingHall) => void;
  setFilteredHalls: (halls: WeddingHall[]) => void;
  setListingTitle: (title: string) => void;
}

// Button component for hero section categories
const HeroCategoryButton: React.FC<{ label: string, onClick: () => void }> = ({ label, onClick }) => (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-white/20 text-white border border-white/30 rounded-full hover:bg-white/30 backdrop-blur-sm transition-all duration-300 text-sm font-medium"
    >
        {label}
    </button>
);

const ALL_VENUE_TYPES: VenueType[] = ['Banquet', 'Marquee', 'Outdoor', 'Palace', 'Destination'];

export const HomePage: React.FC<HomePageProps> = ({ setView, setSelectedHall, setFilteredHalls, setListingTitle }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const filtered = MOCK_HALLS.filter(hall =>
        hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hall.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hall.area.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHalls(filtered);
    setListingTitle(`Results for "${searchTerm}"`);
    setView('LISTING');
  }
  
  const handleFilter = (filterType: 'venueType' | 'city', value: string) => {
    const filtered = MOCK_HALLS.filter(hall => hall[filterType].toLowerCase() === value.toLowerCase());
    setFilteredHalls(filtered);
    
    if (filterType === 'venueType') {
        setListingTitle(`${value} Halls`);
    } else if (filterType === 'city') {
        setListingTitle(`Venues in ${value}`);
    }

    setView('LISTING');
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/wedding-bg/1600/900')" }}>
        <div className="absolute inset-0 bg-brand-dark/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 drop-shadow-lg">Find Your Dream Venue</h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">Search, Compare, and Book the most exclusive wedding halls for your special day.</p>
          <form onSubmit={handleSearch} className="w-full max-w-2xl bg-white/20 backdrop-blur-sm p-2 rounded-full shadow-2xl">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by city, area, or hall name..."
                className="w-full bg-transparent text-white placeholder-gray-200 py-3 pl-5 pr-20 rounded-full focus:outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-brand-gold to-yellow-600 text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity">
                <SearchIcon className="w-6 h-6" />
              </button>
            </div>
          </form>

          {/* Category buttons */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
              {ALL_VENUE_TYPES.map(type => (
                  <HeroCategoryButton key={type} label={type} onClick={() => handleFilter('venueType', type)} />
              ))}
          </div>
        </div>
      </div>

      {/* Featured Halls Section */}
      <div className="py-16 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-center text-brand-blue mb-2">Featured Halls</h2>
          <p className="text-center text-gray-600 mb-12">Handpicked venues for an unforgettable celebration</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_HALLS.slice(0, 3).map(hall => (
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
        </div>
      </div>
    </div>
  );
};
