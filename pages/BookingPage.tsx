
import React, { useState } from 'react';
import type { WeddingHall, SetView } from '../types';

interface BookingPageProps {
  hall: WeddingHall;
  setView: SetView;
}

export const BookingPage: React.FC<BookingPageProps> = ({ hall, setView }) => {
  const [formData, setFormData] = useState({
    date: '',
    guests: hall.capacity.min,
    eventType: 'Shaadi',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Booking request sent for ${hall.name} on ${formData.date} for ${formData.guests} guests. Event type: ${formData.eventType}.`);
    setView('PROFILE', { asRoot: true });
  };

  const advancePayment = hall.pricePerEvent * 0.25;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
          {/* Form Section */}
          <div>
            <h1 className="text-4xl font-serif font-bold text-brand-blue mb-2">Book Your Date</h1>
            <p className="text-lg text-gray-600 mb-8">for <span className="font-semibold text-brand-maroon">{hall.name}</span></p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="date" className="block text-sm font-bold text-gray-700 mb-2">Event Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                />
              </div>

              <div>
                <label htmlFor="guests" className="block text-sm font-bold text-gray-700 mb-2">Number of Guests</label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  min={hall.capacity.min}
                  max={hall.capacity.max}
                  defaultValue={hall.capacity.min}
                  required
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                />
                <p className="text-xs text-gray-500 mt-1">Capacity: {hall.capacity.min} - {hall.capacity.max}</p>
              </div>
              
              <div>
                <label htmlFor="eventType" className="block text-sm font-bold text-gray-700 mb-2">Event Type</label>
                <select 
                    id="eventType"
                    name="eventType"
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold bg-white"
                >
                    <option>Shaadi</option>
                    <option>Mehndi</option>
                    <option>Walima</option>
                    <option>Corporate</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-brand-gold to-yellow-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Confirm Booking
              </button>
            </form>
          </div>

          {/* Price Breakdown */}
          <div className="bg-brand-light p-8 rounded-lg">
              <h2 className="text-2xl font-serif font-bold text-brand-blue mb-6 border-b pb-4">Price Breakdown</h2>
              <div className="space-y-4 text-lg">
                  <div className="flex justify-between">
                      <span className="text-gray-600">Venue Cost</span>
                      <span className="font-semibold text-brand-dark">PKR {hall.pricePerEvent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-gray-600">Taxes & Fees (est.)</span>
                      <span className="font-semibold text-brand-dark">PKR {(hall.pricePerEvent * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="border-t my-4"></div>
                  <div className="flex justify-between text-2xl">
                      <span className="font-bold text-brand-blue">Total</span>
                      <span className="font-bold text-brand-gold">PKR {(hall.pricePerEvent * 1.1).toLocaleString()}</span>
                  </div>
                  <div className="border-t my-4"></div>
                  <div className="flex justify-between text-xl bg-yellow-100 p-4 rounded-md">
                      <span className="font-semibold text-brand-maroon">Advance Payment (25%)</span>
                      <span className="font-bold text-brand-maroon">PKR {advancePayment.toLocaleString()}</span>
                  </div>
              </div>
              <p className="text-sm text-gray-500 mt-6">An advance payment is required to confirm your booking. The remaining balance is due 2 weeks before the event date.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
