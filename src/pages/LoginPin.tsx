import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginPin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect to login if no PIN is set
    const storedPin = localStorage.getItem('userPin');
    if (!storedPin) {
      navigate('/login');
    }
  }, [navigate]);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setPin(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const storedPin = localStorage.getItem('userPin');
    
    if (pin === storedPin) {
      // Set session to indicate user is logged in
      sessionStorage.setItem('isLoggedIn', 'true');
      navigate('/');
    } else {
      toast({
        title: 'PIN Salah',
        description: 'PIN yang Anda masukkan tidak valid',
        variant: 'destructive'
      });
      setPin('');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Masukkan PIN</CardTitle>
          <CardDescription className="text-center">
            Masukkan 6 digit PIN untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Masukkan PIN"
                value={pin}
                onChange={handlePinChange}
                className="text-center text-2xl tracking-widest"
                maxLength={6}
                pattern="\d*"
                inputMode="numeric"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={pin.length !== 6 || isLoading}
            >
              {isLoading ? 'Memverifikasi...' : 'Lanjutkan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPin;