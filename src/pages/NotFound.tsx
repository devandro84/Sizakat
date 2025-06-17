import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-green-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan kembali ke halaman utama.
        </p>
        <Button
          onClick={() => navigate('/')}
          className="mt-6 bg-green-600 hover:bg-green-700 inline-flex items-center"
        >
          <Home className="mr-2 h-4 w-4" />
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;