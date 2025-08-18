import React from 'react';
import type { View, SetView, User } from '../types';
import { BackIcon, DefaultAvatarIcon, HeartIcon } from './icons';

interface HeaderProps {
  setView: SetView;
  goBack: () => void;
  history: View[];
  currentUser: User | null;
  onLoginClick: () => void;
  logout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setView, goBack, history, currentUser, onLoginClick, logout }) => {
  return (
    <header className="bg-brand-light/80 backdrop-blur-md shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2 sm:gap-4">
            {history.length > 1 && (
              <button
                onClick={goBack}
                className="p-2 rounded-full text-brand-blue hover:bg-gray-200 transition-colors"
                aria-label="Go back"
              >
                <BackIcon className="w-6 h-6" />
              </button>
            )}
            <div 
              className="cursor-pointer"
              onClick={() => setView('HOME', { asRoot: true })}
            >
              <h1 className="text-2xl sm:text-3xl font-serif text-brand-blue font-bold">
                Shaadi<span className="text-brand-gold">Hall</span>Finder
              </h1>
              <p className="hidden sm:block text-sm text-gray-500 font-sans -mt-1">Your perfect venue awaits</p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <button
                  onClick={() => setView('FAVORITES')}
                  className="p-2 rounded-full text-brand-maroon hover:bg-brand-maroon/10 transition-colors duration-300"
                  aria-label="Favorites"
                >
                  <HeartIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setView('PROFILE')}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-brand-gold"
                  aria-label="User profile"
                >
                  {currentUser.picture ? (
                     <img src={currentUser.picture} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                     <DefaultAvatarIcon className="w-8 h-8 text-gray-400" />
                  )}
                </button>
                 <button
                    onClick={logout}
                    className="hidden sm:block text-sm font-semibold text-brand-blue hover:text-brand-maroon transition-colors"
                    aria-label="Logout"
                >
                    Logout
                </button>
              </>
            ) : (
                <button
                    onClick={onLoginClick}
                    className="bg-brand-gold text-white font-bold py-2 px-5 rounded-full hover:opacity-90 transition-opacity text-sm"
                >
                    Login
                </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};