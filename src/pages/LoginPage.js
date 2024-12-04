import React, { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase-config';
import { useNavigate } from 'react-router-dom';
import googleLogo from './google-logo.svg';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-credential':
          setError('Incorrect email or password. Please try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many login attempts. Please try again later.');
          break;
        default:
          setError('An error occurred. Please try again.');
          console.error('Login error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(''); 
    setIsLoading(true); 
    
    try {
    
      await auth.signOut();
      
    
      const newWindow = window.open('about:blank', '_blank', 'width=600,height=600');
      if (!newWindow) {
        throw new Error('Popup blocked');
      }
      newWindow.close();
      
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google log-In error:', error);
      
      if (error.message === 'Popup blocked') {
        setError('THIS IS POPUP BASED GOOGLE LOG IN. YOU MUST ALLOW POPUPS FOR THIS SITE AND RELOAD.');
        return;
      }
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          setError('Please complete the sign-in process in the popup window');
          break;
        case 'auth/popup-blocked':
          setError('THIS IS POPUP BASED GOOGLE LOG IN. YOU MUST ALLOW POPUPS FOR THIS SITE.');
          break;
        default:
          setError('Sign-in failed. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 space-y-6 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-black">Login</h2>
        
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-black mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-black mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button 
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="flex items-center justify-center mt-4">
          <button 
            onClick={handleGoogleSignIn}
            className="flex items-center space-x-2 text-gray-600 hover:text-black"
            disabled={isLoading}
          >
            <img src={googleLogo} alt="Google logo" className="w-5 h-5" />
            <span className="text-sm">Google Sign in</span>
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-black">
            New User? 
            <button 
              onClick={() => navigate('/signup')}
              className="text-gray-700 ml-1 hover:underline"
              disabled={isLoading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;