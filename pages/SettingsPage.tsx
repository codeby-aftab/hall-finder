import React, { useState, useRef } from 'react';
import type { User, SetView } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { DefaultAvatarIcon } from '../components/icons';

interface SettingsPageProps {
  currentUser: User;
  setView: SetView;
  onUpdateProfile: (data: { name?: string, picture?: string }) => boolean;
  onChangePassword: (currentPassword: string, newPassword: string) => 'SUCCESS' | 'WRONG_PASSWORD' | 'NO_USER';
  onDeleteAccount: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, setView, onUpdateProfile, onChangePassword, onDeleteAccount }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');

  // Profile state
  const [name, setName] = useState(currentUser.name);
  const [picture, setPicture] = useState(currentUser.picture);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Account state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPicture(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });
    if (name.trim() === '') {
      setProfileMessage({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }
    const success = onUpdateProfile({ name, picture });
    if (success) {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    const result = onChangePassword(currentPassword, newPassword);
    if (result === 'SUCCESS') {
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else if (result === 'WRONG_PASSWORD') {
      setPasswordMessage({ type: 'error', text: 'Incorrect current password.' });
    } else {
      setPasswordMessage({ type: 'error', text: 'An unexpected error occurred.' });
    }
  };

  const TabButton: React.FC<{ tabName: 'profile' | 'account', children: React.ReactNode }> = ({ tabName, children }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-6 py-3 font-semibold text-lg rounded-t-lg transition-colors duration-300 ${activeTab === tabName ? 'bg-white text-brand-blue' : 'bg-transparent text-gray-600 hover:bg-white/50'}`}
    >
      {children}
    </button>
  );

  return (
    <>
    <div className="bg-brand-light min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-serif font-bold text-brand-blue mb-8">Settings</h1>
        
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="border-b border-gray-300">
            <TabButton tabName="profile">Profile</TabButton>
            <TabButton tabName="account">Account</TabButton>
          </div>

          <div className="bg-white p-8 rounded-b-lg shadow-lg">
            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6 animate-fade-in">
                <h2 className="text-2xl font-serif font-bold text-brand-dark">Edit Profile</h2>
                
                {/* Profile Picture Section */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                       {picture ? (
                           <img src={picture} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                           <DefaultAvatarIcon className="w-16 h-16 text-gray-400" />
                       )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handlePictureChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg font-semibold text-brand-blue bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={currentUser.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
                 {profileMessage.text && (
                    <p className={`text-sm ${profileMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{profileMessage.text}</p>
                )}
                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={() => setView('PROFILE')} className="px-6 py-2 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-2 rounded-lg font-bold text-white bg-brand-gold hover:opacity-90 transition-opacity">Save Changes</button>
                </div>
              </form>
            )}

            {/* Account Tab Content */}
            {activeTab === 'account' && (
              <div className="space-y-10 animate-fade-in">
                {/* Change Password Form */}
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-brand-dark">Change Password</h2>
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                        <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold" />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                        <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                        <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold" />
                    </div>
                    {passwordMessage.text && (
                        <p className={`text-sm ${passwordMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{passwordMessage.text}</p>
                    )}
                    <div className="flex justify-end">
                         <button type="submit" className="px-6 py-2 rounded-lg font-bold text-white bg-brand-gold hover:opacity-90 transition-opacity">Change Password</button>
                    </div>
                </form>

                {/* Delete Account Section */}
                <div className="border-t pt-8">
                     <h2 className="text-2xl font-serif font-bold text-red-700">Danger Zone</h2>
                     <p className="text-gray-600 mt-2 mb-4">Deleting your account is permanent and cannot be undone. All your bookings and profile information will be lost.</p>
                     <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-6 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
                     >
                        Delete My Account
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmButtonText="Yes, Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
    />
    </>
  );
};