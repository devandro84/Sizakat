
import { DonorRecord, getSettings, getRecipients } from './database';
import { calculateZakatDistribution } from './zakatCalculation';

// Get the total zakat collections
export const getZakatSummary = (donors: DonorRecord[]) => {
  const totalFamilies = donors.length;
  const totalIndividuals = donors.reduce((sum, donor) => sum + donor.familyCount, 0);
  
  const cashDonors = donors.filter(donor => donor.paymentMethod === 'cash');
  const riceDonors = donors.filter(donor => donor.paymentMethod === 'rice');
  
  const totalCash = cashDonors.reduce((sum, donor) => sum + donor.cashAmount, 0);
  
  // Hitung total beras 2.5 kg berdasarkan jumlah anggota keluarga
  const totalRice2_5 = riceDonors
    .filter(donor => donor.riceAmount === 2.5)
    .reduce((sum, donor) => sum + (2.5 * donor.familyCount), 0);
    
  // Hitung total beras 3 kg berdasarkan jumlah anggota keluarga
  const totalRice3 = riceDonors
    .filter(donor => donor.riceAmount === 3)
    .reduce((sum, donor) => sum + (3 * donor.familyCount), 0);
    
  // Total keseluruhan beras adalah jumlah dari totalRice2_5 dan totalRice3
  const totalRice = totalRice2_5 + totalRice3;
  
  // Hitung total InfaqBaznas dan InfaqMasjid berdasarkan jumlah anggota keluarga
  const totalInfaqBaznas = cashDonors.reduce((sum, donor) => sum + (donor.infaqAmount * donor.familyCount), 0);
  const totalInfaqMasjid = cashDonors.reduce((sum, donor) => sum + (donor.infaqAmount2 * donor.familyCount), 0);
  
  return {
    totalFamilies,
    totalIndividuals,
    cashDonors: cashDonors.length,
    riceDonors: riceDonors.length,
    totalCash,
    totalRice,
    totalRice2_5,
    totalRice3,
    totalInfaqBaznas,
    totalInfaqMasjid
  };
};

// Get summary per RT
export const getRTSummary = (donors: DonorRecord[]) => {
  const settings = getSettings();
  
  return settings.rtNumbers.map(rt => {
    const rtDonors = donors.filter(donor => donor.rtNumber === rt);
    const rtCashDonors = rtDonors.filter(donor => donor.paymentMethod === 'cash');
    const rtRiceDonors = rtDonors.filter(donor => donor.paymentMethod === 'rice');
    
    // Hitung total beras berdasarkan jumlah anggota keluarga
    const totalRice2_5 = rtRiceDonors
      .filter(donor => donor.riceAmount === 2.5)
      .reduce((sum, donor) => sum + (2.5 * donor.familyCount), 0);
      
    const totalRice3 = rtRiceDonors
      .filter(donor => donor.riceAmount === 3)
      .reduce((sum, donor) => sum + (3 * donor.familyCount), 0);
      
    const totalRice = totalRice2_5 + totalRice3;

    // Hitung total uang berdasarkan jumlah anggota keluarga
    const totalCash = rtCashDonors.reduce((sum, donor) => {
      const cashPerPerson = donor.cashAmount / donor.familyCount; // Uang per orang
      return sum + (cashPerPerson * donor.familyCount); // Total uang untuk keluarga
    }, 0);
    
    return {
      rtNumber: rt,
      totalFamilies: rtDonors.length,
      totalIndividuals: rtDonors.reduce((sum, donor) => sum + donor.familyCount, 0),
      cashDonors: rtCashDonors.length,
      riceDonors: rtRiceDonors.length,
      totalCash,
      totalRice,
      // Hitung total InfaqBaznas dan InfaqMasjid per RT berdasarkan jumlah anggota keluarga
      totalInfaqBaznas: rtCashDonors.reduce((sum, donor) => sum + (donor.infaqAmount * donor.familyCount), 0),
      totalInfaqMasjid: rtCashDonors.reduce((sum, donor) => sum + (donor.infaqAmount2 * donor.familyCount), 0)
    };
  });

};

// Get zakat amounts for an individual
export const getIndividualZakatAmounts = () => {
  const settings = getSettings();
  return {
    cashPerPerson: settings.cashZakatAmount,
    ricePerPerson: settings.riceZakatAmount,
    minInfaq: settings.minInfaqAmount
  };
};

// Get zakat distribution based on total collections
export const getZakatDistribution = (donors: DonorRecord[]) => {
  const summary = getZakatSummary(donors);
  return calculateZakatDistribution(summary.totalCash, summary.totalRice);
};

// Get recipients by category
export const getRecipientsByCategory = () => {
  const recipients = getRecipients();
  const categories = {
    fakirMiskin: recipients.filter(r => r.category === 'fakir_miskin'),
    amilinDKM: recipients.filter(r => r.category === 'amilin_dkm'),
    fiSabilillah: recipients.filter(r => r.category === 'fi_sabilillah'),
    amilinDesa: recipients.filter(r => r.category === 'amilin_desa'),
    amilinKecamatan: recipients.filter(r => r.category === 'amilin_kecamatan'),
  };
  return categories;
};
