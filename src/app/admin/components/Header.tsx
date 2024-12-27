import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; 
// ^^^ Make sure this points to your firebaseConfig file where you call initializeApp

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  // Now we get the current user from our *already-initialized* auth instance
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('authenticated');
    router.push('/admin/login');
  };

  return (
    <div className="p-4 pb-0 w-full">
      <header className="admin-header p-4 pl-8 flex justify-between items-center bg-white/90 backdrop-blur-lg rounded-full shadow-sm">
        <h1 className="text-xl">Plumbing Market</h1>
        <div className="relative">
          <img
            src={user?.photoURL || '/default-profile.png'}
            alt="Profile"
            className="w-6 h-6 rounded-full cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute flex flex-col items-center right-0 mt-2  bg-white text-black rounded shadow-lg">
              <div className="p-2 text-sm color-gray-300">{user?.email}</div>
              <button
                className=" text-left p-2 p-x-4 rounded-full color-red hover:bg-gray-200"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
