import React, { useState } from 'react';
import type { SetView } from '../types';

interface AuthPageProps {
  onLogin: (email: string, password: string) => boolean;
  onSignup: (name: string, email: string, password: string) => boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let success = false;
        
        if (isLoginView) {
            if (!email || !password) {
                setError('Email and password are required.');
                return;
            }
            success = onLogin(email, password);
            if (!success) setError('Invalid email or password.');
        } else {
            if (!name || !email || !password) {
                setError('Name, email, and password are required for signup.');
                return;
            }
            success = onSignup(name, email, password);
            if (!success) setError('A user with this email already exists.');
        }
    };

    return (
        <div className="min-h-[calc(100vh-224px)] flex items-center justify-center bg-brand-light py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-dark font-serif">
                        {isLoginView ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {!isLoginView && (
                             <div>
                                <label htmlFor="name" className="sr-only">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required={!isLoginView}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm"
                                    placeholder="Full Name"
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 ${isLoginView ? 'rounded-t-md' : ''} focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm`}
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-gold focus:border-brand-gold focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 text-center">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-gold hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                        >
                            {isLoginView ? 'Sign in' : 'Sign up'}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-medium text-brand-blue hover:text-brand-maroon">
                        {isLoginView ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};
