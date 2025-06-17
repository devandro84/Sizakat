
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Label,
} from '@/components/ui';
import { Lock, User, KeyRound, Eye, EyeOff } from 'lucide-react';
import panahIcon from '@/assets/icons/Panah.png';
// Using public logo
// import zakatBagIcon from '@/assets/zakat.png';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appVersion, setAppVersion] = useState('1.0.0');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [logoHovered, setLogoHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Tambahkan animasi fade-in saat komponen dimount
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s ease-in-out';
    
    return () => {
      document.body.style.opacity = '';
      document.body.style.transition = '';
    };
  }, []);

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Mohon isi semua field yang diperlukan.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if user has logged in before
      const hasLoggedInBefore = localStorage.getItem('hasLoggedInBefore');
      const userPin = localStorage.getItem('userPin');
      
      // Save username and login status
      localStorage.setItem('username', username);
      localStorage.setItem('hasLoggedInBefore', 'true');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Berhasil",
        description: "Selamat kembali user!"
      });

      // If user has PIN set up, navigate to PIN login page
      if (userPin) {
        navigate('/login-pin');
      } else {
        // Otherwise, proceed with normal login
        login(username);
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal login. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword || !userCaptcha) {
      toast({
        title: "Error",
        description: "Mohon isi semua field yang diperlukan.",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Konfirmasi sandi tidak cocok.",
        variant: "destructive"
      });
      return;
    }

    if (userCaptcha.toUpperCase() !== captcha) {
      toast({
        title: "Error",
        description: "CAPTCHA tidak valid.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual registration logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Berhasil",
        description: "Registrasi berhasil! Silakan login."
      });
      setIsRegisterMode(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mendaftar. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword || !userCaptcha) {
      toast({
        title: "Error",
        description: "Mohon isi semua field yang diperlukan.",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Konfirmasi sandi tidak cocok.",
        variant: "destructive"
      });
      return;
    }

    if (userCaptcha.toUpperCase() !== captcha) {
      toast({
        title: "Error",
        description: "CAPTCHA tidak valid.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual password reset logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Berhasil",
        description: "Sandi berhasil diubah! Silakan login."
      });
      setIsResetMode(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengubah sandi. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="min-h-screen flex items-center justify-center p-4 bg-background"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: mounted ? 0 : 20, opacity: mounted ? 1 : 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="w-full max-w-[95%] sm:max-w-md bg-card/50 backdrop-blur-sm border-border/50 dark:bg-gray-800/30 dark:from-gray-800/30 dark:to-emerald-900/30 dark:border-emerald-800/30">

        <CardHeader className="text-center space-y-2 p-4 sm:p-6">
          <div className="flex justify-center mb-2">
            <div className="relative group" onMouseEnter={() => setLogoHovered(true)} onMouseLeave={() => setLogoHovered(false)}>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full blur-2xl transform scale-150 transition-all duration-500 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-xl transform scale-125 transition-all duration-500" />
              <img src="/LogoZakat.png" alt="Zakat Icon" className={`relative h-32 w-32 splash-logo-glow ${logoHovered ? 'scale-110 opacity-100 rotate-3' : 'opacity-90'}`} />
              <div className={`absolute inset-0 bg-gradient-to-r from-green-500/40 to-emerald-500/40 rounded-full blur-2xl transition-all duration-500 ${logoHovered ? 'scale-150 opacity-80' : 'scale-100 opacity-0'}`} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent transition-all duration-300 hover:from-emerald-300 hover:to-green-200">
            SiZakat
          </CardTitle>
          <p className="text-md text-foreground/90 font-medium transition-colors duration-300 hover:text-emerald-300">
            Aplikasi Pengelolaan Zakat
          </p>
          <p className="text-sm text-muted-foreground"></p>
        </CardHeader>
        <form onSubmit={isRegisterMode ? handleRegister : (isResetMode ? handleResetPassword : handleLogin)}>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="space-y-2">
              <Label htmlFor="username">Nama</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="username"
                  placeholder="Nama"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              {(isRegisterMode || isResetMode) && (
                <p className="text-xs text-muted-foreground mt-1">
                  *Min. 6 karakter (huruf besar, angka, simbol)
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Sandi</Label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sandi"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {(isRegisterMode || isResetMode) && (
                <p className="text-xs text-muted-foreground mt-1">
                  *Min. 8 karakter (huruf besar, angka, simbol)
                </p>
              )}
            </div>
            {!isRegisterMode && !isResetMode && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-emerald-500 hover:text-emerald-400 text-sm flex items-center gap-1 transition-all duration-300 transform hover:scale-110 hover:font-medium hover:shadow-[0_0_15px_rgba(52,211,153,0.5)] animate-pulse"
                >
                  <KeyRound className="h-4 w-4" />
                  Lupa Sandi?
                </button>
              </div>
            )}
            
            {/* Menghapus tombol login yang duplikat */}
            {(isRegisterMode || isResetMode) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Sandi</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Konfirmasi sandi"
                      className="pl-10 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="captcha">CAPTCHA</Label>
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        id="captcha"
                        placeholder="CAPTCHA"
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg shadow-inner backdrop-blur-sm border border-white/10 dark:border-white/5">
                      <span 
                        className="font-mono text-xl font-bold tracking-wider select-none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 animate-pulse" 
                        style={{ letterSpacing: '0.25em' }}
                      >
                        {captcha}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="px-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-110"
                      onClick={generateCaptcha}
                    >
                      <span className="inline-block transition-transform hover:rotate-180 duration-500">↻</span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span className="animate-pulse">Memproses...</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex-grow text-center">
                    {isRegisterMode ? 'Daftar' : (isResetMode ? 'Atur Sandi' : 'Masuk')}
                  </span>
                  <img 
                    src={panahIcon} 
                    alt="Panah" 
                    className="ml-2 h-5 w-5 cursor-pointer transition-transform hover:scale-110 duration-300" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isLoading) {
                        if (isRegisterMode) {
                          handleRegister(e);
                        } else if (isResetMode) {
                          handleResetPassword(e);
                        } else {
                          handleLogin(e);
                        }
                      }
                    }}
                  />
                </>
              )}
            </Button>
            <button 
              type="button" 
              className="text-sm" 
              onClick={() => {
                if (isResetMode) {
                  setIsResetMode(false);
                } else {
                  setIsRegisterMode(!isRegisterMode);
                }
                setUsername('');
                setPassword('');
                setConfirmPassword('');
              }}
            >
              {isRegisterMode ? (
                <>
                  <span className="text-white">Sudah punya akun? </span>
                  <span className="text-emerald-500 hover:text-emerald-400 cursor-pointer transition-all duration-300 hover:scale-105 inline-block hover:shadow-[0_0_15px_rgba(52,211,153,0.5)] animate-pulse">Masuk</span>
                </>
              ) : isResetMode ? (
                <>
                  <span className="text-white">Kembali ke </span>
                  <span className="text-emerald-500 hover:text-emerald-400 cursor-pointer transition-all duration-300 hover:scale-105 inline-block hover:shadow-[0_0_15px_rgba(52,211,153,0.5)] animate-pulse">Masuk</span>
                </>
              ) : (
                <>
                  <span className="text-white">Belum punya akun? </span>
                  <span className="text-emerald-500 hover:text-emerald-400 cursor-pointer transition-all duration-300 hover:scale-105 inline-block hover:shadow-[0_0_15px_rgba(52,211,153,0.5)] animate-pulse">Daftar</span>
                </>
              )}
            </button>
            {!isRegisterMode && !isResetMode && (
              <div className="text-sm text-center mt-4">
                <p className="text-xs text-center text-gray-500">
                  Versi {appVersion} - Aplikasi Zakat
                </p>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
