
import { getSettings } from './database';

// Calculate total zakat distribution for a given amount, returns distribution split based on the specified percentages
export const calculateZakatDistribution = (totalCash: number, totalRice: number) => {
  return {
    fakirMiskin: {
      percentage: 75,
      cash: (totalCash * 0.75),
      rice: (totalRice * 0.75)
    },
    amilinDKM: {
      percentage: 8,
      cash: (totalCash * 0.08),
      rice: (totalRice * 0.08)
    },
    fiSabilillah: {
      percentage: 12.5,
      cash: (totalCash * 0.125),
      rice: (totalRice * 0.125)
    },
    amilinDesa: {
      percentage: 2.5,
      cash: (totalCash * 0.025),
      rice: (totalRice * 0.025)
    },
    amilinKecamatan: {
      percentage: 2,
      cash: (totalCash * 0.02),
      rice: (totalRice * 0.02)
    }
  };
};

// Calculate total amounts for a family donation
export const calculateFamilyDonation = (familyCount: number, paymentMethod: 'cash' | 'rice', riceAmountPerPerson?: number): {
  zakatAmount: number;
  infaqAmount: number;
  totalAmount: number;
} => {
  const settings = getSettings();
  const zakatAmountPerPerson = paymentMethod === 'cash' 
    ? settings.cashZakatAmount 
    : (riceAmountPerPerson || settings.riceZakatAmount);
  
  const zakatAmount = paymentMethod === 'cash'
    ? zakatAmountPerPerson * familyCount
    : zakatAmountPerPerson * familyCount;
    
  const infaqAmount = settings.minInfaqAmount;
  
  return {
    zakatAmount,
    infaqAmount,
    totalAmount: paymentMethod === 'cash' ? zakatAmount + infaqAmount : zakatAmount
  };
};

// Calculate Zakat Māl based on assets and liabilities
export const calculateZakatMal = (
  gold: number,   // in grams
  silver: number, // in grams
  cash: number,   // in IDR
  tradingAssets: number, // in IDR
  receivables: number,   // in IDR
  liabilities: number,   // in IDR
  goldPrice: number,     // price per gram in IDR
  silverPrice: number    // price per gram in IDR
): {
  totalAssets: number;
  totalDeductibles: number;
  netAssets: number;
  nisab: number;
  eligibleForZakat: boolean;
  zakatAmount: number;
} => {
  // Calculate the value of assets
  const goldValue = gold * goldPrice;
  const silverValue = silver * silverPrice;
  const totalAssets = goldValue + silverValue + cash + tradingAssets + receivables;
  
  // Deduct liabilities
  const totalDeductibles = liabilities;
  const netAssets = totalAssets - totalDeductibles;
  
  // Calculate nisab (85 grams of gold)
  const nisab = 85 * goldPrice;
  
  // Check if eligible for zakat
  const eligibleForZakat = netAssets >= nisab;
  
  // Calculate zakat amount (2.5%)
  const zakatAmount = eligibleForZakat ? netAssets * 0.025 : 0;
  
  return {
    totalAssets,
    totalDeductibles,
    netAssets,
    nisab,
    eligibleForZakat,
    zakatAmount
  };
};

// Calculate Zakat Penghasilan (Income Zakat)
export const calculateZakatPenghasilan = (
  monthlyIncome: number,   // in IDR
  monthlyExpenses: number, // in IDR
  otherIncome: number,     // in IDR
  goldPrice: number        // price per gram in IDR
): {
  monthlyNetIncome: number;
  annualNetIncome: number;
  nisab: number;
  eligibleForZakat: boolean;
  zakatAmount: number;
} => {
  // Calculate monthly and annual net income
  const monthlyNetIncome = monthlyIncome - monthlyExpenses + otherIncome;
  const annualNetIncome = monthlyNetIncome * 12;
  
  // Nisab for zakat penghasilan (85 grams of gold)
  const nisab = 85 * goldPrice;
  
  // Check if eligible for zakat (annual or monthly basis)
  const eligibleForZakat = annualNetIncome >= nisab;
  
  // Calculate zakat amount (2.5% of annual income)
  const zakatAmount = eligibleForZakat ? annualNetIncome * 0.025 : 0;
  
  return {
    monthlyNetIncome,
    annualNetIncome,
    nisab,
    eligibleForZakat,
    zakatAmount
  };
};
