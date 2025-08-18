
import React, { useState } from 'react';
import type { WeddingHall, SetView } from '../types';
import { StarRating } from '../components/StarRating';
import { CalendarIcon, CheckCircleIcon, GuestIcon, HeartIcon, PhoneIcon, PriceIcon } from '../components/icons';

interface DetailPageProps {
  hall: WeddingHall;
  setView: SetView;
  toggleFavorite: (id: number) => void;
  isFavorite: boolean;
}

export const DetailPage: React.FC<DetailPageProps> = ({ hall, setView, toggleFavorite, isFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hall.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + hall.images.length) % hall.images.length);
  };

  return (
    <div className="bg-brand-light font-sans animate-fade-in">
      {/* Image Gallery */}
      <div className="relative h-[60vh] bg-gray-800">
        <img src={hall.images[currentImageIndex]} alt={hall.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <div className="absolute top-6 right-6 z-10 flex space-x-2">
            <button 
                onClick={() => toggleFavorite(hall.id)}
                className={`p-3 rounded-full transition-colors duration-300 ${isFavorite ? 'bg-brand-maroon text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
            >
                <HeartIcon className="w-6 h-6" />
            </button>
        </div>


        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition">
          &#10094;
        </button>
        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition">
          &#10095;
        </button>

        <div className="absolute bottom-6 left-6 z-10 text-white">
          <h1 className="text-5xl font-serif font-bold drop-shadow-lg">{hall.name}</h1>
          <p className="text-lg text-gray-200">{hall.area}, {hall.city}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <StarRating rating={hall.rating} className="w-6 h-6" />
              <span className="text-gray-600">{hall.reviews.length} Reviews</span>
            </div>
            
            <h2 className="text-3xl font-serif font-bold text-brand-blue mb-4">About Venue</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Welcome to {hall.name}, the premier destination for unforgettable weddings and grand celebrations in {hall.city}. Nestled in the heart of {hall.area}, our venue offers a perfect blend of modern elegance and timeless tradition, ensuring your special day is nothing short of magical.
            </p>
            
            <h2 className="text-3xl font-serif font-bold text-brand-blue mb-6">Facilities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {hall.facilities.map((facility, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-800">{facility}</span>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-serif font-bold text-brand-blue mb-6">Reviews</h2>
            <div className="space-y-6">
              {hall.reviews.map((review, index) => (
                <div key={index} className="p-5 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg text-gray-800">{review.author}</h4>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-gray-600">"{review.comment}"</p>
                </div>
              ))}
            </div>

          </div>

          {/* Sidebar with Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-xl shadow-xl">
              <div className="space-y-4 mb-6">
                  <div className="flex items-center text-lg">
                      <PriceIcon className="w-6 h-6 mr-4 text-brand-maroon"/>
                      <span className="font-bold text-brand-dark">PKR {hall.pricePerEvent.toLocaleString()}</span>
                      <span className="text-gray-500 ml-1">/ event</span>
                  </div>
                   <div className="flex items-center text-lg">
                      <GuestIcon className="w-6 h-6 mr-4 text-brand-maroon"/>
                      <span className="font-bold text-brand-dark">{hall.capacity.min} - {hall.capacity.max} Guests</span>
                  </div>
              </div>
              
              <div className="space-y-3">
                 <button
                    onClick={() => setView('BOOKING')}
                    className="w-full bg-gradient-to-r from-brand-gold to-yellow-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                 >
                    <CalendarIcon className="w-5 h-5"/>
                    <span>Book Now</span>
                 </button>
                 <a
                    href="tel:+1234567890"
                    className="w-full border border-brand-gold text-brand-gold font-bold py-3 px-6 rounded-lg hover:bg-brand-gold/10 transition-colors duration-300 flex items-center justify-center space-x-2"
                 >
                    <PhoneIcon className="w-5 h-5"/>
                    <span>Call Hall</span>
                 </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
