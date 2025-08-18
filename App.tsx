
import React, { useState, useMemo } from 'react';
import { MOCK_HALLS } from './constants';
import type { View, WeddingHall, SetView } from './types';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ListingPage } from './pages/ListingPage';
import { DetailPage } from './pages/DetailPage';
import { BookingPage } from './pages/BookingPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <h1 className="text-4xl font-serif text-gray-400">{title} - Coming Soon</h1>
    </div>
);


const App: React.FC = () => {
    const [history, setHistory] = useState<View[]>(['HOME']);
    const [selectedHall, setSelectedHall] = useState<WeddingHall | null>(null);
    const [filteredHalls, setFilteredHalls] = useState<WeddingHall[]>(MOCK_HALLS);
    const [listingTitle, setListingTitle] = useState('Search Results');
    const [favorites, setFavorites] = useState<number[]>(() => {
        // You can persist this to localStorage in a real app
        return [1, 3];
    });

    const currentView = history[history.length - 1];

    const setView: SetView = (view, options = {}) => {
        if (options.asRoot) {
            setHistory([view]);
            return;
        }
        // Prevent pushing the same view consecutively
        if (currentView !== view) {
            setHistory(prev => [...prev, view]);
        }
    };

    const goBack = () => {
        if (history.length > 1) {
            setHistory(prev => prev.slice(0, -1));
        }
    };

    const toggleFavorite = (id: number) => {
        setFavorites(prev => 
            prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
        );
    };

    const favoriteHalls = useMemo(() => {
        return MOCK_HALLS.filter(hall => favorites.includes(hall.id));
    }, [favorites]);

    const renderView = () => {
        switch (currentView) {
            case 'HOME':
                return <HomePage setView={setView} setSelectedHall={setSelectedHall} setFilteredHalls={setFilteredHalls} setListingTitle={setListingTitle} />;
            case 'LISTING':
                return <ListingPage title={listingTitle} halls={filteredHalls} setView={setView} setSelectedHall={setSelectedHall} />;
            case 'DETAIL':
                if (selectedHall) {
                    return <DetailPage hall={selectedHall} setView={setView} toggleFavorite={toggleFavorite} isFavorite={favorites.includes(selectedHall.id)} />;
                }
                setView('HOME', { asRoot: true }); // Fallback
                return null;
            case 'BOOKING':
                if (selectedHall) {
                    return <BookingPage hall={selectedHall} setView={setView} />;
                }
                setView('HOME', { asRoot: true }); // Fallback
                return null;
            case 'FAVORITES':
                return <FavoritesPage favoriteHalls={favoriteHalls} setView={setView} setSelectedHall={setSelectedHall} />;
            case 'PROFILE':
                return <ProfilePage setView={setView} setSelectedHall={setSelectedHall} allHalls={MOCK_HALLS} />;
            default:
                return <HomePage setView={setView} setSelectedHall={setSelectedHall} setFilteredHalls={setFilteredHalls} setListingTitle={setListingTitle} />;
        }
    };

    return (
        <div className="bg-brand-light text-brand-dark min-h-screen">
            <Header setView={setView} goBack={goBack} history={history} />
            <main>
                {renderView()}
            </main>
            <footer className="bg-brand-blue text-white py-8">
                <div className="container mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} ShaadiHallFinder. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default App;