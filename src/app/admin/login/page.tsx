// app/admin/login/page.tsx (for example)
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebaseConfig'

const allowedEmails = [
  '14alabaika88@gmail.com',
  'enjoyable.design@gmail.com'
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user?.email && allowedEmails.includes(user.email)) {
        // Now we call the context's login function
        login('admin'); 
        router.push('/admin/dashboard');
      } else {
        alert('Access denied: Your email is not authorized.');
      }
    } catch (error) {
      alert('Failed to sign in');
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <button onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}
