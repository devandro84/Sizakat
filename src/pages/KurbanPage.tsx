import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import panahIcon from '@/assets/icons/Panah.png';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import SejarahKurban from '@/components/SejarahKurban';
import NiatKurban from '@/components/NiatKurban';
import Tabungan from '@/components/Tabungan';

const KurbanPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pattern-bg">
      <Header />
      <div className="page-container p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center mb-2 sm:mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <img src={panahIcon} alt="Kembali" className="h-4 sm:h-5 w-4 sm:w-5" />
        </button>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 dark:text-white capitalize tracking-tight">
          Kurban
        </h2>

        <Tabs defaultValue="tabungan" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="sejarah">Sejarah Kurban</TabsTrigger>
            <TabsTrigger value="niat">Niat Kurban</TabsTrigger>
            <TabsTrigger value="tabungan">Tabungan</TabsTrigger>
          </TabsList>
          <TabsContent value="sejarah">
            <SejarahKurban />
          </TabsContent>
          <TabsContent value="niat">
            <NiatKurban />
          </TabsContent>
          <TabsContent value="tabungan">
            <Tabungan />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KurbanPage;