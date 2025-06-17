
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import panahIcon from '@/assets/icons/Panah.png';
import ZakatMalCalculator from '@/components/ZakatMalCalculator';

const ZakatMalPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pattern-bg">
      <Header />
      <div className="page-container py-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <img src={panahIcon} alt="" className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-6">Zakat Māl (Harta)</h2>
        <ZakatMalCalculator />
      </div>
    </div>
  );
};

export default ZakatMalPage;
