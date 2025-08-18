
import React, { useState, useMemo, useEffect } from 'react';
import type { WeddingHall, SetView, VenueType } from '../types';
import { HallCard } from '../components/HallCard';
import { StarIcon } from '../components/icons';

interface ListingPageProps {
  title: string;
  halls: WeddingHall[];
  setView: SetView;
  setSelectedHall: (hall: WeddingHall) => void;
}

// Custom Checkbox Component for a more stylish look
const CustomCheckbox: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="absolute opacity-0 w-0 h-0"
        />
        <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${checked ? 'bg-brand-gold border-brand-gold' : 'border-gray-300 group-hover:border-brand-gold'}`}>
            {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
        <span className={`text-sm ${checked ? 'text-brand-dark font-semibold' : 'text-gray-600'}`}>{label}</span>
    </label>
);


export const ListingPage: React.FC<ListingPageProps> = ({ title, halls, setView, setSelectedHall }) => {
    
    // Dynamically generate filter options from the available halls
    const { cities, venueTypes, allFacilities, priceRange, maxCapacity } = useMemo(() => {
        const cities = [...new Set(halls.map(h => h.city))].sort();
        const venueTypes = [...new Set(halls.map(h => h.venueType))].sort();
        const allFacilities = [...new Set(halls.flatMap(h => h.facilities))].sort();
        const prices = halls.length > 0 ? halls.map(h => h.pricePerEvent) : [0];
        const capacities = halls.length > 0 ? halls.map(h => h.capacity.max) : [0];
        const priceRange = { min: Math.min(...prices), max: Math.max(...prices) };
        const maxCapacity = Math.max(...capacities);
        return { cities, venueTypes, allFacilities, priceRange, maxCapacity };
    }, [halls]);

    // State for all filters
    const [cityFilter, setCityFilter] = useState<string>('all');
    const [venueTypeFilter, setVenueTypeFilter] = useState<string>('all');
    const [maxPrice, setMaxPrice] = useState<number>(priceRange.max);
    const [minCapacity, setMinCapacity] = useState<string>('');
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [minRating, setMinRating] = useState<number>(0);
    const [sortOrder, setSortOrder] = useState('popularity');
    const [hoverRating, setHoverRating] = useState<number>(0);

    // Reset max price when data changes
    useEffect(() => {
        setMaxPrice(priceRange.max);
    }, [priceRange.max]);

    const handleFacilityChange = (facility: string, isChecked: boolean) => {
        setSelectedFacilities(prev => 
            isChecked ? [...prev, facility] : prev.filter(f => f !== facility)
        );
    };
    
    const resetFilters = () => {
        setCityFilter('all');
        setVenueTypeFilter('all');
        setMaxPrice(priceRange.max);
        setMinCapacity('');
        setSelectedFacilities([]);
        setMinRating(0);
        setSortOrder('popularity');
    };

    const displayedHalls = useMemo(() => {
        let filtered = halls.filter(hall => {
            if (cityFilter !== 'all' && hall.city !== cityFilter) return false;
            if (venueTypeFilter !== 'all' && hall.venueType !== venueTypeFilter) return false;
            if (hall.pricePerEvent > maxPrice) return false;
            if (minCapacity && hall.capacity.max < parseInt(minCapacity, 10)) return false;
            if (minRating > 0) {
                if (hall.rating < minRating) return false;
                // For ratings 1-4, filter for that specific range (e.g., 3.0 to 3.99)
                // For rating 5, filter for 5 and above (effectively just 5).
                if (minRating < 5 && hall.rating >= (minRating + 1)) return false;
            }
            if (selectedFacilities.length > 0 && !selectedFacilities.every(facility => hall.facilities.includes(facility))) return false;
            return true;
        });

        // Apply sorting
        switch (sortOrder) {
            case 'price_asc':
                filtered.sort((a, b) => a.pricePerEvent - b.pricePerEvent);
                break;
            case 'price_desc':
                filtered.sort((a, b) => b.pricePerEvent - a.pricePerEvent);
                break;
            case 'rating_desc':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default: // Popularity (default sort by rating)
                 filtered.sort((a, b) => b.rating - a.rating);
                break;
        }
        
        return filtered;

    }, [halls, cityFilter, venueTypeFilter, maxPrice, minCapacity, minRating, selectedFacilities, sortOrder]);
    
    return (
    <div className="bg-brand-light min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-serif font-bold text-brand-blue">{title}</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
                <div className="sticky top-28 bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="text-xl font-bold font-serif text-brand-blue">Filters</h3>
                        <button onClick={resetFilters} className="text-sm font-semibold text-brand-maroon hover:underline transition-colors">Reset</button>
                    </div>

                    {/* Filter sections */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="city-filter" className="block text-sm font-bold text-gray-700 mb-2">City</label>
                            <select id="city-filter" value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold bg-white">
                                <option value="all">All Cities</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="type-filter" className="block text-sm font-bold text-gray-700 mb-2">Venue Type</label>
                            <select id="type-filter" value={venueTypeFilter} onChange={e => setVenueTypeFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold bg-white">
                                <option value="all">All Types</option>
                                {venueTypes.map(vt => <option key={vt} value={vt}>{vt}</option>)}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="price-range" className="block text-sm font-bold text-gray-700 mb-2">Max Price</label>
                            <input id="price-range" type="range" min={priceRange.min} max={priceRange.max} step="10000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"/>
                            <div className="text-right font-semibold text-brand-dark mt-1">PKR {maxPrice.toLocaleString()}</div>
                        </div>

                        <div>
                            <label htmlFor="capacity-filter" className="block text-sm font-bold text-gray-700 mb-2">Guest Capacity (min)</label>
                            <input id="capacity-filter" type="number" value={minCapacity} onChange={e => setMinCapacity(e.target.value)} placeholder="e.g. 300" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                             <div
                                className="flex space-x-1 cursor-pointer"
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                {[1, 2, 3, 4, 5].map((starValue) => (
                                    <button
                                        key={starValue}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(starValue)}
                                        onClick={() => setMinRating(minRating === starValue ? 0 : starValue)}
                                        className="focus:outline-none p-1 -m-1"
                                        aria-label={`Set rating filter to ${starValue} star${starValue > 1 ? 's' : ''}`}
                                    >
                                        <StarIcon 
                                            className={`w-6 h-6 transition-colors duration-200 ${
                                                (hoverRating || minRating) >= starValue
                                                ? 'text-brand-gold'
                                                : 'text-gray-300'
                                            }`}
                                            filled={true}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Facilities</label>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {allFacilities.map(facility => (
                                    <CustomCheckbox key={facility} label={facility} checked={selectedFacilities.includes(facility)} onChange={(isChecked) => handleFacilityChange(facility, isChecked)} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
            
            {/* Main Content: Hall Listings */}
            <main className="lg:col-span-3">
                 <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                     <p className="text-gray-700 font-semibold mb-2 sm:mb-0">{displayedHalls.length} venue(s) found</p>
                     <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="border rounded-md px-3 py-2 bg-white focus:ring-brand-gold focus:border-brand-gold">
                         <option value="popularity">Sort by: Popularity</option>
                         <option value="price_asc">Price: Low to High</option>
                         <option value="price_desc">Price: High to Low</option>
                         <option value="rating_desc">Rating: High to Low</option>
                     </select>
                 </div>

                {displayedHalls.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {displayedHalls.map(hall => (
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
                  <div className="text-center py-20 bg-white rounded-lg shadow">
                    <h2 className="text-2xl font-semibold text-gray-700">No Venues Match Your Filters</h2>
                    <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
                    <button 
                        onClick={resetFilters} 
                        className="mt-6 bg-brand-gold text-white font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity"
                    >
                        Reset Filters
                    </button>
                  </div>
                )}
            </main>
        </div>
      </div>
      <style>{`
        .range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #C09A58; /* brand-gold */
            cursor: pointer;
            border-radius: 50%;
            margin-top: -7px;
        }
        .range-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #C09A58; /* brand-gold */
            cursor: pointer;
            border-radius: 50%;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #aaa;
        }
      `}</style>
    </div>
  );
};
