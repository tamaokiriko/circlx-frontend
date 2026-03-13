import { useState } from 'react';
import type { NextPage } from 'next';
import LoginView from '../components/LoginView';
import AdminView from '../components/AdminView';

const HomePage: NextPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {isLoggedIn ? (
        <AdminView onLogout={handleLogout} />
      ) : (
        <LoginView onLogin={handleLogin} />
      )}
    </div>
  );
};

export default HomePage;
