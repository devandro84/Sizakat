
// Import SVG icons
import {
  zakatFitrahIcon,
  zakatMalIcon,
  zakatPenghasilanIcon,
  laporanPenerimaIcon,
  kurbanIcon,
  umrohIcon
} from '../assets/icons';

// Export from zakatCalculation.ts
export { 
  calculateZakatDistribution, 
  calculateFamilyDonation, 
  calculateZakatMal, 
  calculateZakatPenghasilan 
} from './zakatCalculation';

// Export from zakatSummary.ts
export { 
  getZakatSummary, 
  getRTSummary, 
  getIndividualZakatAmounts, 
  getZakatDistribution,
  getRecipientsByCategory
} from './zakatSummary';

// Export from zakatFormatting.ts
export { 
  formatCurrency, 
  formatRiceWeight 
} from './zakatFormatting';

// Export from zakatReligious.ts
export { 
  zakatIntentions, 
  ijabQabul 
} from './zakatReligious';

// Features configuration for splash screen
export const features = [
  {
    title: 'Zakat Fitrah',
    description: 'Hitung dan kelola zakat fitrah dengan mudah',
    icon: zakatFitrahIcon,
    available: true
  },
  {
    title: 'Zakat Māl',
    description: 'Kalkulasi zakat harta sesuai syariat',
    icon: zakatMalIcon,
    available: true
  },
  {
    title: 'Zakat Penghasilan',
    description: 'Hitung zakat dari pendapatan Anda',
    icon: zakatPenghasilanIcon,
    available: true
  },
  {
    title: 'Infaq/Sodaqoh',
    description: 'Kelola infaq dan sodaqoh dengan efisien',
    icon: zakatPenghasilanIcon, // Menggunakan ikon penghasilan untuk sementara
    available: true
  },
  {
    title: 'Laporan & Penerima',
    description: 'Kelola data mustahik dan laporan zakat',
    icon: laporanPenerimaIcon,
    available: true
  },
  {
    title: 'Kurban',
    description: 'Manajemen program kurban digital',
    icon: kurbanIcon,
    available: false,
    comingSoon: true
  },
  {
    title: 'Umroh',
    description: 'Layanan umroh terintegrasi',
    icon: umrohIcon,
    available: false,
    comingSoon: true
  }
];
