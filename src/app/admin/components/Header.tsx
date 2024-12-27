import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';

const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('authenticated');
    router.push('/admin/login');
  };

  return (
    <div className="p-4 pb-0 w-full">
    <header className="admin-header p-4 pl-8  flex justify-between items-center bg-white/90 backdrop-blur-lg rounded-full shadow-sm">
      <h1 className="text-xl">Plumbing Market</h1>
      <div className="relative">
        <img
          src={user?.photoURL || '/default-profile.png'}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
            <div className="p-2 border-b">{user?.email}</div>
            <button
              className="w-full text-left p-2 hover:bg-gray-200"
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