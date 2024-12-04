import React, { useState, useEffect } from 'react';
import { auth } from '../firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut, reload } from 'firebase/auth';

const Dashboard = () => {
    const [user] = useAuthState(auth);
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchUserName = async () => {
        if (user) {
          try {
            await reload(user);
            
            const name = user.displayName || 
                         (user.email ? user.email.split('@')[0] : 'User');
            setDisplayName(name);
          } catch (error) {
            console.error('Failed to reload user', error);
            setError('Failed to load user information');
          }
        }
      };
  
      fetchUserName();
    }, [user]);
  
    const handleSignOut = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Sign out error', error);
        setError('Failed to sign out. Please try again.');
      }
    };
  
    if (!user) return null;
  
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 space-y-6 border border-gray-200">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black">
              Welcome, {displayName}
            </h2>
            <p className="text-gray-600 mt-2 font-semibold">Your email: {user.email}</p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  };

  export default Dashboard;