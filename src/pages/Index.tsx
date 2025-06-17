
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import HijriConverter from 'hijri-converter';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { initializeDatabase, getSettings } from '@/utils/database';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Wallet, Calculator, BookOpen, Settings, FileText, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import zakatFitrahIcon from '@/assets/icons/zakat-fitrah.png';
import zakatMalIcon from '@/assets/icons/zakat-mal.png';
import zakatPenghasilanIcon from '@/assets/icons/zakat-penghasilan.png';
import laporanIcon from '@/assets/icons/Laporan.png';
import penerimaZakatIcon from '@/assets/icons/PenerimaZakat.png';
import sejarahDalilIcon from '@/assets/icons/SejarahDalil.png';
import kurbanIcon from '@/assets/icons/kurban.png';
import umrohIcon from '@/assets/icons/umroh.png';
import settingsIcon from '@/assets/icons/Pengaturan.png';
import danaKematianIcon from '@/assets/icons/DanaKematian.png';
import renovasiMasjidIcon from '@/assets/icons/RenovasiMasjid.png';
import pembangunanMadrasahIcon from '@/assets/icons/PembangunanMadrasah.png';


const Index = () => {
  const [settings, setSettings] = React.useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    try {
      // Initialize database when app starts
      initializeDatabase();
      const loadedSettings = getSettings();
      if (!loadedSettings) {
        throw new Error('Pengaturan tidak dapat dimuat');
      }
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error initializing settings:', error);
      // Re-initialize with default settings if there's an error
      initializeDatabase();
      setSettings(getSettings());
    }
    // Get logged in username from localStorage
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setUsername(loggedInUser);
    }
  }, []);

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-primary mx-auto mb-4"></div>
          <p className="text-primary dark:text-primary">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-gray-900 dark:to-gray-800 pattern-bg backdrop-blur-sm">
      <Header />
      
      <div className="page-container py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-sky-300 animate-gradient mb-4 sm:mb-6">{localStorage.getItem('hasLoggedInBefore') ? `Selamat kembali ${username}` : `Selamat Datang ${username}`}</h2>
          <div className="text-left sm:text-right">
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 font-medium">
              {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400">
              {(() => {
                const today = new Date();
                const hijri = HijriConverter.toHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());
                return `${hijri.hd} ${['Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir', 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Syaban', 'Ramadhan', 'Syawal', 'Dzulqadah', 'Dzulhijjah'][hijri.hm - 1]} ${hijri.hy} H`;
              })()}
            </p>
          </div>
        </div>
        <p className="text-base sm:text-lg bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-sky-300 mb-8 font-extrabold">
          {settings.mosqueName}
          <span className="block text-sm font-medium text-gray-600 dark:text-gray-400">{settings.address}</span>
        </p>
        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8 mb-8">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/payment" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={zakatFitrahIcon} alt="Zakat Fitrah" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Zakat fitrah</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/zakat-mal" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={zakatMalIcon} alt="Zakat Mal" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Zakat māl</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/zakat-penghasilan" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={zakatPenghasilanIcon} alt="Zakat Penghasilan" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Zakat Penghasilan</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/reports" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={laporanIcon} alt="Laporan" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Laporan Zakat</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/recipients" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={penerimaZakatIcon} alt="Penerima Zakat" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Penerima Zakat</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/niat-zakat" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={sejarahDalilIcon} alt="Sejarah" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Sejarah, Dalil & Niat</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/kurban" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={kurbanIcon} alt="Kurban" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Tabungan Kurban</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/umroh" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={umrohIcon} alt="Umroh" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Tabungan Umroh</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/dana-kematian" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={danaKematianIcon} alt="Dana Kematian" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Dana Kematian</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/renovasi-masjid" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={renovasiMasjidIcon} alt="Renovasi Masjid" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Renovasi Masjid</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/pembangunan-madrasah" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={pembangunanMadrasahIcon} alt="Pembangunan Madrasah" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Pembangunan Madrasah</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/settings" className="transform hover:scale-110 transition-all duration-300 text-center group">
                  <div className="h-28 w-28 bg-gradient-to-br from-emerald-400/90 to-emerald-600/90 dark:from-emerald-600/90 dark:to-emerald-800/90 rounded-2xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 mx-auto hover:shadow-xl hover:shadow-emerald-500/30 dark:hover:shadow-emerald-700/30 backdrop-blur-md border border-white/20 dark:border-white/10">
                    <img src={settingsIcon} alt="Pengaturan" className="h-26 w-26 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border border-emerald-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade">
                <p className="text-sm font-medium tracking-wide">Pengaturan Aplikasi</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Dashboard />
        
        <div className="text-center mt-12 space-y-1">
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">SiZakat</p>
          <p className="text-xs text-emerald-500 dark:text-emerald-500">Versi 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
