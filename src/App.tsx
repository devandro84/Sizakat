
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import LoginPin from '@/pages/LoginPin';
import PaymentPage from '@/pages/PaymentPage';
import ReportsPage from '@/pages/ReportsPage';
import RecipientsPage from '@/pages/RecipientsPage';
import NiatZakat from '@/pages/NiatZakat';
import ZakatMalPage from '@/pages/ZakatMalPage';
import ZakatPenghasilanPage from '@/pages/ZakatPenghasilanPage';
import NotFound from '@/pages/NotFound';
import Settings from '@/pages/Settings';
import KurbanPage from '@/pages/KurbanPage';


const AppRoutes = () => {
  const navigate = useNavigate();



  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-pin" element={<LoginPin />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/recipients" element={<RecipientsPage />} />
      <Route path="/niat-zakat" element={<NiatZakat />} />
      <Route path="/zakat-mal" element={<ZakatMalPage />} />
      <Route path="/zakat-penghasilan" element={<ZakatPenghasilanPage />} />

      <Route path="/settings" element={<Settings />} />
      <Route path="/kurban" element={<KurbanPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
};

export default App;
