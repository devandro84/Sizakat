import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Settings from '@/components/Settings';
import panahIcon from '@/assets/icons/Panah.png';

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pattern-bg">
      <Header />
      <div className="page-container py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <img src={panahIcon} alt="Kembali" className="h-5 w-5" />
        </button>
        <h2 className="text-3xl font-bold mb-8 dark:text-white capitalize tracking-tight">Pengaturan Aplikasi</h2>
        <Settings />
      </div>
    </div>
  );
};

export default SettingsPage;