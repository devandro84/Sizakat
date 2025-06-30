import { getSettings } from './database';

// Format currency in Indonesian Rupiah
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format rice weight in kg
export const formatRiceWeight = (kg, includeUnit = true) => {
  const formattedWeight = Number.isInteger(kg) ? kg.toString() : kg.toFixed(1);
  return includeUnit ? `${formattedWeight} kg` : formattedWeight;
};

// Calculate total zakat distribution for a given amount
export const calculateZakatDistribution = (totalCash, totalRice) => {
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
export const calculateFamilyDonation = (familyCount, paymentMethod, riceAmountPerPerson) => {
  const settings = getSettings();
  const zakatAmountPerPerson = paymentMethod === 'cash' 
    ? settings.cashZakatAmount 
    : (riceAmountPerPerson || settings.riceZakatAmount);
  
  const zakatAmount = zakatAmountPerPerson * familyCount;
  const infaqAmount = settings.minInfaqAmount;
  
  return {
    zakatAmount,
    infaqAmount,
    totalAmount: paymentMethod === 'cash' ? zakatAmount + infaqAmount : zakatAmount
  };
};

// Calculate Zakat Māl based on assets and liabilities
export const calculateZakatMal = (
  gold,   // in grams
  silver, // in grams
  cash,   // in IDR
  tradingAssets, // in IDR
  receivables,   // in IDR
  liabilities,   // in IDR
  goldPrice,     // price per gram in IDR
  silverPrice    // price per gram in IDR
) => {
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
  monthlyIncome,   // in IDR
  monthlyExpenses, // in IDR
  otherIncome,     // in IDR
  goldPrice        // price per gram in IDR
) => {
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

// Niat zakat and ijab kabul
export const zakatIntentions = {
  fitrah: {
    self: {
      arabic: "نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ الْفِطْرِ عَنْ نَفْسِي فَرْضًا لِلَّهِ تَعَالَى",
      latin: "Nawaitu an ukhrija zakaatal fithri 'an nafsii fardhan lillaahi ta'aalaa",
      translation: "Saya niat mengeluarkan zakat fitrah untuk diri saya sendiri fardhu karena Allah Ta'ala"
    },
    family: {
      arabic: "نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ الْفِطْرِ عَنْ نَفْسِي وَعَنْ مَنْ تَلْزَمُنِي نَفَقَتُهُ فَرْضًا لِلَّهِ تَعَالَى",
      latin: "Nawaitu an ukhrija zakaatal fithri 'an nafsi wa 'amman talzamunii nafaqotuhu fardhan lillaahi ta'aalaa",
      translation: "Saya niat mengeluarkan zakat fitrah untuk diriku dan orang yang wajib aku nafkahi, fardhu karena Allah Ta'ala"
    }
  },
  mal: {
    arabic: "نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ مَالِي فَرْضًا لِلَّهِ تَعَالَى",
    latin: "Nawaitu an ukhrija zakaata maalii fardhan lillaahi ta'aalaa",
    translation: "Saya niat mengeluarkan zakat harta saya fardhu karena Allah Ta'ala"
  },
  penghasilan: {
    arabic: "نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ كَسْبِي فَرْضًا لِلَّهِ تَعَالَى",
    latin: "Nawaitu an ukhrija zakaata kasbii fardhan lillaahi ta'aalaa",
    translation: "Saya niat mengeluarkan zakat penghasilan saya fardhu karena Allah Ta'ala"
  }
};

export const ijabQabul = {
  fitrah: {
    ijab: {
      arabic: "أَعْطَيْتُكَ هَذِهِ الزَّكَاةَ عَنْ نَفْسِي وَعَنْ أَهْلِ بَيْتِي",
      latin: "A'thaituka hadhihi az-zakata 'an nafsi wa 'an ahli baiti",
      translation: "Saya berikan zakat fitrah ini untuk diriku dan keluargaku"
    },
    kabul: {
      arabic: "قَبِلْتُ زَكَاتَكَ وَأَجْزَأَتْكَ",
      latin: "Qabiltu zakataka wa ajza'atka",
      translation: "Saya terima zakatmu, semoga diterima (oleh Allah SWT)"
    }
  },
  mal: {
    ijab: {
      arabic: "أَعْطَيْتُكَ هَذِهِ الزَّكَاةَ عَنْ مَالِي",
      latin: "A'thaituka hadhihi az-zakata 'an mali",
      translation: "Saya berikan zakat harta ini dari harta saya"
    },
    kabul: {
      arabic: "قَبِلْتُ زَكَاةَ مَالِكَ وَأَجْزَأَتْكَ",
      latin: "Qabiltu zakata malika wa ajza'atka",
      translation: "Saya terima zakat hartamu, semoga diterima (oleh Allah SWT)"
    }
  },
  penghasilan: {
    ijab: {
      arabic: "أَعْطَيْتُكَ هَذِهِ الزَّكَاةَ عَنْ كَسْبِي",
      latin: "A'thaituka hadhihi az-zakata 'an kasbi",
      translation: "Saya berikan zakat ini dari penghasilan saya"
    },
    kabul: {
      arabic: "قَبِلْتُ زَكَاةَ كَسْبِكَ وَأَجْزَأَتْكَ",
      latin: "Qabiltu zakata kasbika wa ajza'atka",
      translation: "Saya terima zakat penghasilanmu, semoga diterima (oleh Allah SWT)"
    }
  }
};