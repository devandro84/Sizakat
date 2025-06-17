import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface PinLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const PinLoginModal = ({ isOpen, onClose, username }: PinLoginModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      toast({
        title: 'Error',
        description: 'Mohon masukkan PIN Anda.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Verify PIN from localStorage
      const storedPin = localStorage.getItem('userPin');
      if (pin === storedPin) {
        toast({
          title: 'Berhasil',
          description: 'Login berhasil!',
        });
        navigate('/');
      } else {
        toast({
          title: 'Error',
          description: 'PIN tidak valid.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal login. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center dark:text-white">
            Selamat Datang Kembali
          </DialogTitle>
          <DialogDescription className="text-center dark:text-gray-300">
            {username}, silakan masukkan PIN Anda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePinSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="password"
                placeholder="Masukkan PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                maxLength={6}
              />
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Login'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PinLoginModal;