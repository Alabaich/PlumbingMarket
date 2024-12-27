'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '../../firebaseConfig';

const allowedEmails = [
    '14alabaika88@gmail.com',
    'enjoyable.design@gmail.com'
];

const Login: React.FC = () => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user && user.email && allowedEmails.includes(user.email)) {
        localStorage.setItem('authenticated', 'true');
        router.push('/admin/dashboard');
      } else {
        alert('Access denied: Your email is not authorized.');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      alert('Failed to sign in');
    }
  };

  return (
    <div className="login-container bg-white h-screen flex items-center justify-center">
      <div className="login-box p-6 bg-gray-200 rounded shadow-md">
        <h1 className="text-2xl mb-4">Login</h1>
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;