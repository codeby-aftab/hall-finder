import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MOCK_HALLS } from './constants';
import type { View, WeddingHall, SetView, User } from './types';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ListingPage } from './pages/ListingPage';
import { DetailPage } from './pages/DetailPage';
import { BookingPage } from './pages/BookingPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { SettingsPage } from './pages/SettingsPage';

const App: React.FC = () => {
    const [history, setHistory] = useState<View[]>(['HOME']);
    const [selectedHall, setSelectedHall] = useState<WeddingHall | null>(null);
    const [filteredHalls, setFilteredHalls] = useState<WeddingHall[]>(MOCK_HALLS);
    const [listingTitle, setListingTitle] = useState('Search Results');
    const [favorites, setFavorites] = useState<number[]>(() => [1, 3]);
    
    // Local user management state
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const currentView = history[history.length - 1];
    
    const setView: SetView = (view, options = {}) => {
        if (options.asRoot) {
            setHistory([view]);
            return;
        }
        if (currentView !== view) {
            setHistory(prev => [...prev, view]);
        }
    };

    const goBack = () => {
        if (history.length > 1) {
            setHistory(prev => prev.slice(0, -1));
        }
    };
    
    const handleLogin = (email: string, password: string): boolean => {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        setView('HOME', { asRoot: true });
        return true;
      }
      return false;
    };
    
    const handleSignup = (name: string, email: string, password: string): boolean => {
        if (users.some(u => u.email === email)) {
            return false; // User already exists
        }
        const newUser: User = {
            id: String(Date.now()),
            name,
            email,
            password,
            picture: "" // Start with no picture to show default avatar
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setView('HOME', { asRoot: true });
        return true;
    };

    const logout = () => {
        setCurrentUser(null);
        setFavorites([]);
        setView('HOME', { asRoot: true });
    };

    const handleUpdateProfile = (data: { name?: string; picture?: string }): boolean => {
        if (!currentUser) return false;
        const updatedUser = { ...currentUser, ...data };
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
        return true;
    };

    const handleChangePassword = (currentPassword: string, newPassword: string): 'SUCCESS' | 'WRONG_PASSWORD' | 'NO_USER' => {
        if (!currentUser) return 'NO_USER';
        if (currentUser.password !== currentPassword) {
            return 'WRONG_PASSWORD';
        }
        const updatedUser = { ...currentUser, password: newPassword };
        setCurrentUser(updatedUser);
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
        return 'SUCCESS';
    };

    const handleDeleteAccount = () => {
        if (!currentUser) return;
        setUsers(users.filter(u => u.id !== currentUser.id));
        logout();
    };

    const toggleFavorite = (id: number) => {
        if(!currentUser) {
            setView('AUTH');
            return;
        }
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
                setView('HOME', { asRoot: true });
                return null;
            case 'AUTH':
                if (currentUser) {
                    setView('HOME', { asRoot: true });
                    return null;
                }
                return <AuthPage onLogin={handleLogin} onSignup={handleSignup} />;
            case 'BOOKING':
                if (!currentUser) {
                    setView('AUTH');
                    return null;
                }
                if (selectedHall) {
                    return <BookingPage hall={selectedHall} setView={setView} />;
                }
                setView('HOME', { asRoot: true });
                return null;
            case 'FAVORITES':
                 if (!currentUser) {
                    setView('AUTH');
                    return null;
                }
                return <FavoritesPage favoriteHalls={favoriteHalls} setView={setView} setSelectedHall={setSelectedHall} />;
            case 'PROFILE':
                 if (!currentUser) {
                    setView('AUTH');
                    return null;
                }
                return <ProfilePage currentUser={currentUser} setView={setView} setSelectedHall={setSelectedHall} allHalls={MOCK_HALLS} logout={logout} />;
             case 'SETTINGS':
                if (!currentUser) {
                    setView('AUTH');
                    return null;
                }
                return <SettingsPage 
                    currentUser={currentUser} 
                    setView={setView}
                    onUpdateProfile={handleUpdateProfile}
                    onChangePassword={handleChangePassword}
                    onDeleteAccount={handleDeleteAccount}
                />;
            default:
                return <HomePage setView={setView} setSelectedHall={setSelectedHall} setFilteredHalls={setFilteredHalls} setListingTitle={setListingTitle} />;
        }
    };

    return (
        <div className="bg-brand-light text-brand-dark min-h-screen">
            <Header setView={setView} goBack={goBack} history={history} currentUser={currentUser} onLoginClick={() => setView('AUTH')} logout={logout} />
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