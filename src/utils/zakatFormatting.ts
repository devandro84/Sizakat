
// Format currency in Indonesian Rupiah
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format rice weight in kg
export const formatRiceWeight = (kg: number, includeUnit: boolean = true): string => {
  const formattedWeight = Number.isInteger(kg) ? kg.toString() : kg.toFixed(1);
  return includeUnit ? `${formattedWeight} kg` : formattedWeight;
};
