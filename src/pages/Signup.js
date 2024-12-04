import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth} from '../firebase-config';
import { useNavigate } from 'react-router-dom';


const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password should be at least 6 characters long');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name
      });

      navigate('/dashboard');
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Email is already registered');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        default:
          setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 space-y-6 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-black">Sign Up</h2>
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-black mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-black mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
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
              minLength="6"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button 
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
  <p className="text-sm text-black">
    Existing User? 
    <button 
      onClick={() => navigate('/login')}
      className="text-gray-700 ml-1 hover:underline"
    >
      Login
    </button>
  </p>
</div>


      </div>
    </div>
  );
};

export default SignupPage;