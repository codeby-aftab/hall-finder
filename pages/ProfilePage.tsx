
import React, { useState } from 'react';
import type { WeddingHall, SetView, Booking } from '../types';
import { MOCK_BOOKINGS } from '../constants';
import { CalendarIcon } from '../components/icons';
import { ReviewModal } from '../components/ReviewModal';

interface ProfilePageProps {
  setView: SetView;
  setSelectedHall: (hall: WeddingHall) => void;
  allHalls: WeddingHall[];
}

const BookingCard: React.FC<{ 
    booking: Booking, 
    hall?: WeddingHall, 
    setView: SetView, 
    setSelectedHall: (hall: WeddingHall) => void,
    onLeaveReview: (hall: WeddingHall) => void 
}> = ({ booking, hall, setView, setSelectedHall, onLeaveReview }) => {
    if (!hall) return null;

    const isPast = new Date(booking.eventDate) < new Date();
    
    const handleViewVenue = () => {
        setSelectedHall(hall);
        setView('DETAIL');
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row items-start p-5 gap-5">
            <img src={hall.images[0]} alt={hall.name} className="w-full sm:w-40 h-40 object-cover rounded-md"/>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-500">{booking.eventType} at</p>
                        <h3 className="text-xl font-bold font-serif text-brand-blue">{hall.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                           <CalendarIcon className="w-4 h-4 mr-2"/>
                           {new Date(booking.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                     <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${isPast ? 'bg-gray-500' : 'bg-green-600'}`}>
                        {booking.status}
                    </span>
                </div>
                <div className="border-t mt-4 pt-4 flex space-x-3">
                    <button onClick={handleViewVenue} className="text-sm bg-brand-blue text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
                        View Venue
                    </button>
                    {!isPast ? (
                         <button className="text-sm bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                            Manage Booking
                         </button>
                    ) : (
                         <button 
                            onClick={() => onLeaveReview(hall)}
                            className="text-sm bg-brand-gold text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
                            Leave a Review
                         </button>
                    )}
                </div>
            </div>
        </div>
    );
};


export const ProfilePage: React.FC<ProfilePageProps> = ({ setView, setSelectedHall, allHalls }) => {
  const [reviewingHall, setReviewingHall] = useState<WeddingHall | null>(null);

  const handleOpenReviewModal = (hall: WeddingHall) => {
    setReviewingHall(hall);
  };

  const handleCloseReviewModal = () => {
    setReviewingHall(null);
  };

  const handleSubmitReview = (review: { rating: number; comment: string }) => {
    if (!reviewingHall) return;
    // In a real app, you'd send this to a backend.
    // Here we'll just simulate it.
    alert(`Review Submitted for ${reviewingHall.name}!\nRating: ${review.rating} stars\nComment: "${review.comment}"`);
    handleCloseReviewModal();
  };


  // In a real app, you'd filter bookings for the logged-in user
  const userBookings = MOCK_BOOKINGS;

  const upcomingBookings = userBookings
    .filter(b => new Date(b.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    
  const pastBookings = userBookings
    .filter(b => new Date(b.eventDate) < new Date())
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  const getHallById = (id: number) => allHalls.find(h => h.id === id);

  return (
    <>
    <div className="bg-brand-light min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-serif font-bold text-brand-blue mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <main className="lg:col-span-2 space-y-10">
            {/* Upcoming Bookings */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-brand-blue mb-4">Upcoming Bookings</h2>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-6">
                  {upcomingBookings.map(booking => {
                    const hall = getHallById(booking.hallId);
                    return hall ? <BookingCard key={booking.id} booking={booking} hall={hall} setView={setView} setSelectedHall={setSelectedHall} onLeaveReview={handleOpenReviewModal} /> : null;
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                  <p className="text-gray-600">You have no upcoming events.</p>
                   <button onClick={() => setView('HOME', {asRoot: true})} className="mt-4 bg-brand-gold text-white font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity">
                        Discover Venues
                    </button>
                </div>
              )}
            </div>
            
            {/* Past Events */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-brand-blue mb-4">Past Events</h2>
              {pastBookings.length > 0 ? (
                <div className="space-y-6">
                  {pastBookings.map(booking => {
                     const hall = getHallById(booking.hallId);
                     return hall ? <BookingCard key={booking.id} booking={booking} hall={hall} setView={setView} setSelectedHall={setSelectedHall} onLeaveReview={handleOpenReviewModal} /> : null;
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                   <p className="text-gray-600">No past events to show.</p>
                </div>
              )}
            </div>
          </main>

          {/* Profile Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex flex-col items-center text-center">
                 <div className="w-24 h-24 rounded-full bg-brand-gold text-white flex items-center justify-center font-bold text-4xl font-sans mb-4">
                    U
                 </div>
                 <h3 className="text-2xl font-bold font-serif text-brand-blue">Uzair Khan</h3>
                 <p className="text-gray-500">uzair.k@example.com</p>
              </div>
              <div className="border-t my-6"></div>
              <div className="space-y-4">
                <button className="w-full text-left font-semibold text-gray-700 hover:text-brand-maroon transition-colors">
                    Edit Profile
                </button>
                <button className="w-full text-left font-semibold text-gray-700 hover:text-brand-maroon transition-colors">
                    Account Settings
                </button>
                <button 
                    onClick={() => setView('HOME', {asRoot: true})}
                    className="w-full text-left font-semibold text-red-600 hover:text-red-800 transition-colors"
                >
                    Logout
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
    {reviewingHall && (
        <ReviewModal
            isOpen={!!reviewingHall}
            onClose={handleCloseReviewModal}
            onSubmit={handleSubmitReview}
            hallName={reviewingHall.name}
        />
    )}
    </>
  );
};
