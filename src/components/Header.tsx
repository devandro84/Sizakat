import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import HijriConverter from 'hijri-converter';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}${minutes}`);
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000); // Update setiap detik untuk animasi yang lebih halus
    
    return () => clearInterval(clockInterval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari aplikasi",
    });
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700/50 shadow-sm">
      <div className="flex justify-between items-center p-2 sm:p-4 relative">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="inline-block">
            <div className="clock-container">
              <span className="clock-time">{currentTime.slice(0, 2)}</span>
              <span className="clock-separator">:</span>
              <span className="clock-time">{currentTime.slice(2, 4)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img src="/LogoZakat.png" alt="SiZakat Logo" className="h-6 w-6 sm:h-8 sm:w-8 splash-logo-glow" />
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">SiZakat</h1>
        </div>
        
        <nav className="flex items-center space-x-2">
          <AlertDialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <button 
                      className="flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <img src="/src/assets/icons/keluar.png" alt="Keluar" className="h-8 w-8 hover:scale-110 transition-transform duration-200 filter hover:brightness-110 hover:drop-shadow-lg" />
                    </button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gradient-to-br from-red-500 to-red-700 text-white border border-red-600 px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-sm transform transition-all duration-300 scale-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0">
                  <p className="text-sm font-medium tracking-wide">Keluar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin keluar dari aplikasi?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Ya, Keluar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </nav>
      </div>
    </header>
  );
};

export default Header;