
export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export type VenueType = 'Palace' | 'Banquet' | 'Outdoor' | 'Marquee' | 'Destination';

export interface WeddingHall {
  id: number;
  name: string;
  area: string;
  city: string;
  venueType: VenueType;
  capacity: {
    min: number;
    max: number;
  };
  pricePerEvent: number;
  rating: number;
  reviews: Review[];
  images: string[];
  facilities: string[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
    id: number;
    hallId: number;
    userId: number; // In a real app, this would be the logged-in user's ID
    eventDate: string;
    eventType: 'Shaadi' | 'Mehndi' | 'Walima' | 'Corporate';
    status: 'Confirmed' | 'Completed' | 'Cancelled';
}


export type View = 'HOME' | 'LISTING' | 'DETAIL' | 'BOOKING' | 'FAVORITES' | 'PROFILE';

export type SetView = (view: View, options?: { asRoot?: boolean }) => void;