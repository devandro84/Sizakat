import React, { useEffect, useState } from 'react';
import { getDonors, getSettings, getRecipients, RecipientRecord, DonorRecord } from '@/utils/database';
import { 
  getZakatSummary, 
  getRTSummary, 
  getZakatDistribution, 
  formatCurrency, 
  formatRiceWeight 
} from '@/utils/zakatUtils';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  Calendar, 
  Wallet, 
  BarChart3, 
  ArrowRightCircle, 
  DollarSign, 
  CreditCard,
  Coins
} from 'lucide-react';
import TotalMuzakkiIcon from '@/assets/icons/TotalMuzakki.png';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import TotalUang from '@/assets/icons/TotalUang.png';
import TotalBeras from '@/assets/icons/TotalBeras.png';
import TotalInfaq from '@/assets/icons/TotalInfaq.png';

const Dashboard = () => {
  const [donors, setDonors] = useState<DonorRecord[]>([]);
  const [recipients, setRecipients] = useState<RecipientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const settings = getSettings();

  const fetchData = () => {
    const donorData = getDonors();
    const recipientData = getRecipients();
    setDonors(donorData);
    setRecipients(recipientData);
    setLoading(false);
  };

  // Listen for storage changes to update dashboard
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'zakatDonors') {
        fetchData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    fetchData(); // Initial fetch

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="page-container py-8">
        <div className="text-center">
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  const summary = getZakatSummary(donors);
  const distribution = getZakatDistribution(donors);
  const rtSummary = getRTSummary(donors);

  // Data for distribution pie chart with improved styling
  const distributionData = [
    { name: 'Zakat Uang', value: Number(summary.totalCash) || 0, color: '#FF6B6B' },
    { name: 'Zakat Beras', value: Number(summary.totalRice) || 0, color: '#45B7D1' },
    { name: 'Infaq Baznas', value: Number(summary.totalInfaqBaznas) || 0, color: '#4ECDC4' },
    { name: 'Infaq Masjid', value: Number(summary.totalInfaqMasjid) || 0, color: '#96CEB4' }
  ];

  // Warna solid yang lebih kontras dan mudah dibaca
  const COLORS = ['#FF6B6B', '#45B7D1', '#4ECDC4', '#96CEB4'];

  return (
    <div className="page-container py-8 dark:bg-gray-900/95">
      <div className="flex flex-col items-start mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-sky-300">Dashboard Zakat</h2>
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="card-hover backdrop-blur-sm bg-white/80 border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/90 to-white/90 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 dark:bg-gray-800/80 dark:from-emerald-950/90 dark:to-gray-900/90 dark:border-emerald-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-emerald-800 dark:text-emerald-200">
              <img src={TotalMuzakkiIcon} alt="Total Muzakki" className="mr-2 h-16 w-16" />
              Total Muzakki
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold tracking-tight text-emerald-900 dark:text-emerald-100">{summary.totalFamilies}</p>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Keluarga yang telah membayar zakat</p>
          </CardContent>
          <CardFooter className="pt-0 text-xs text-emerald-600 dark:text-emerald-400">
            Total {summary.totalIndividuals} jiwa
          </CardFooter>
        </Card>

        <Card className="card-hover backdrop-blur-sm bg-white/80 border-2 border-amber-200/50 bg-gradient-to-br from-amber-50/90 to-white/90 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 dark:bg-gray-800/80 dark:from-amber-950/90 dark:to-gray-900/90 dark:border-amber-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-amber-800 dark:text-amber-200">
              <img src={TotalUang} alt="Total Zakat Uang" className="mr-2 h-16 w-16" />
              Total Zakat Uang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold tracking-tight text-amber-900 dark:text-amber-100">{formatCurrency(summary.totalCash)}</p>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Dari {summary.cashDonors} pembayar</p>
          </CardContent>
          <CardFooter className="pt-0 text-xs text-amber-600 dark:text-amber-400">
            {formatCurrency(settings.cashZakatAmount)} per jiwa
          </CardFooter>
        </Card>

        <Card className="card-hover backdrop-blur-sm bg-white/80 border-2 border-sky-200/50 bg-gradient-to-br from-sky-50/90 to-white/90 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 dark:bg-gray-800/80 dark:from-sky-950/90 dark:to-gray-900/90 dark:border-sky-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-sky-800 dark:text-sky-200">
              <img src={TotalBeras} alt="Total Zakat Beras" className="mr-2 h-16 w-16" />
              Total Zakat Beras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-4xl font-extrabold tracking-tight text-sky-900 dark:text-sky-100">{formatRiceWeight(summary.totalRice)}</p>
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-sky-900 dark:text-sky-100">{formatRiceWeight(summary.totalRice2_5 || 0)}</p>
                <p className="text-xs font-medium text-sky-700 dark:text-sky-300">Beras 2,5 Kg</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-sky-900 dark:text-sky-100">{formatRiceWeight(summary.totalRice3 || 0)}</p>
                <p className="text-xs font-medium text-sky-700 dark:text-sky-300">Beras 3 Kg</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 text-xs text-sky-600 dark:text-sky-400">
            Dari {summary.riceDonors} pembayar
            <br />
            Pilihan: 2,5 Kg atau 3 Kg per jiwa
          </CardFooter>
        </Card>

        <Card className="card-hover backdrop-blur-sm bg-white/80 border-2 border-purple-200/50 bg-gradient-to-br from-purple-50/90 to-white/90 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 dark:bg-gray-800/80 dark:from-purple-950/90 dark:to-gray-900/90 dark:border-purple-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-purple-800 dark:text-purple-200">
              <img src={TotalInfaq} alt="Total Infaq" className="mr-2 h-16 w-16" />
              Total Infaq
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold tracking-tight text-purple-900 dark:text-purple-100">{formatCurrency(summary.totalInfaqBaznas + summary.totalInfaqMasjid)}</p>
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Baznas: {formatCurrency(summary.totalInfaqBaznas)} <br />
              Masjid: {formatCurrency(summary.totalInfaqMasjid)}
            </p>
          </CardContent>
          <CardFooter className="pt-0 text-xs text-purple-600 dark:text-purple-400">
            Minimal {formatCurrency(settings.minInfaqAmount)} per keluarga
          </CardFooter>
        </Card>
      </div>

      {/* Distribution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card className="lg:col-span-1 card-hover backdrop-blur-sm bg-white/80 border-2 border-indigo-200/50 bg-gradient-to-br from-indigo-50/90 to-white/90 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 dark:bg-gray-800/80 dark:from-indigo-950/90 dark:to-gray-900/90 dark:border-indigo-800/50">
          <CardHeader>
            <CardTitle className="text-indigo-800 dark:text-indigo-200">Distribusi Zakat</CardTitle>
            <CardDescription className="text-indigo-600 dark:text-indigo-300">
              Persentase distribusi zakat fitrah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={5}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 card-hover backdrop-blur-sm bg-white/80 border-2 border-indigo-200/50 bg-gradient-to-br from-indigo-50/90 to-white/90 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 dark:bg-gray-800/80 dark:from-indigo-950/90 dark:to-gray-900/90 dark:border-indigo-800/50">
          <CardHeader>
            <CardTitle className="text-indigo-800 dark:text-indigo-200">Distribusi Zakat Fitrah</CardTitle>
            <CardDescription className="text-indigo-600 dark:text-indigo-300">
              Perhitungan distribusi zakat fitrah berdasarkan persentase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-sm text-left dark:text-gray-300">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Persentase</th>
                    <th className="px-4 py-3">Zakat Uang</th>
                    <th className="px-4 py-3">Zakat Beras</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3">Fakir Miskin</td>
                    <td className="px-4 py-3">75%</td>
                    <td className="px-4 py-3">{formatCurrency(distribution.fakirMiskin.cash)}</td>
                    <td className="px-4 py-3">{formatRiceWeight(distribution.fakirMiskin.rice)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3">Fi Sabilillah</td>
                    <td className="px-4 py-3">12.5%</td>
                    <td className="px-4 py-3">{formatCurrency(distribution.fiSabilillah.cash)}</td>
                    <td className="px-4 py-3">{formatRiceWeight(distribution.fiSabilillah.rice)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3">Amilin DKM/RT/RW</td>
                    <td className="px-4 py-3">8%</td>
                    <td className="px-4 py-3">{formatCurrency(distribution.amilinDKM.cash)}</td>
                    <td className="px-4 py-3">{formatRiceWeight(distribution.amilinDKM.rice)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3">Amilin Desa</td>
                    <td className="px-4 py-3">2.5%</td>
                    <td className="px-4 py-3">{formatCurrency(distribution.amilinDesa.cash)}</td>
                    <td className="px-4 py-3">{formatRiceWeight(distribution.amilinDesa.rice)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3">Amilin Kecamatan</td>
                    <td className="px-4 py-3">2%</td>
                    <td className="px-4 py-3">{formatCurrency(distribution.amilinKecamatan.cash)}</td>
                    <td className="px-4 py-3">{formatRiceWeight(distribution.amilinKecamatan.rice)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Konversi Beras ke Uang */}
      <Card className="card-hover backdrop-blur-sm bg-white/80 border-2 border-yellow-200/50 bg-gradient-to-br from-yellow-50/90 to-white/90 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 dark:bg-gray-800/80 dark:from-yellow-950/90 dark:to-gray-900/90 dark:border-yellow-800/50 mb-8">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-200">Konversi Zakat Beras ke Uang</CardTitle>
          <CardDescription className="text-yellow-600 dark:text-yellow-300">
            Total nilai zakat beras jika dikonversi ke uang (Rp. {formatCurrency(settings.riceToMoneyConversion)}/kg)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left dark:text-gray-300">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Jumlah Beras</th>
                  <th className="px-4 py-3">Nilai Uang</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">Beras 2,5 Kg</td>
                  <td className="px-4 py-3">{formatRiceWeight(summary.totalRice2_5 || 0)}</td>
                  <td className="px-4 py-3">{formatCurrency((summary.totalRice2_5 || 0) * settings.riceToMoneyConversion)}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">Beras 3 Kg</td>
                  <td className="px-4 py-3">{formatRiceWeight(summary.totalRice3 || 0)}</td>
                  <td className="px-4 py-3">{formatCurrency((summary.totalRice3 || 0) * settings.riceToMoneyConversion)}</td>
                </tr>
                <tr className="border-b bg-gray-50 dark:bg-gray-700 font-medium">
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3">{formatRiceWeight(summary.totalRice)}</td>
                  <td className="px-4 py-3">{formatCurrency(summary.totalRice * settings.riceToMoneyConversion)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* RT Summary */}
      <Card className="card-hover backdrop-blur-sm bg-white/80 border-2 border-teal-200/50 bg-gradient-to-br from-teal-50/90 to-white/90 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 dark:bg-gray-800/80 dark:from-teal-950/90 dark:to-gray-900/90 dark:border-teal-800/50 mb-8">
        <CardHeader>
          <CardTitle className="text-teal-800 dark:text-teal-200">Pengumpulan Zakat Per-RT</CardTitle>
          <CardDescription className="text-teal-600 dark:text-teal-300">
            Rekap total pengumpulan zakat per RT/RW
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left dark:text-gray-300">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-3">RT</th>
                  <th className="px-4 py-3">Keluarga</th>
                  <th className="px-4 py-3">Jiwa</th>
                  <th className="px-4 py-3">Zakat Uang</th>
                  <th className="px-4 py-3">Zakat Beras</th>
                  <th className="px-4 py-3">Infaq Baznas</th>
                  <th className="px-4 py-3">Infaq Masjid</th>
                  <th className="px-4 py-3">Total Infaq</th>
                  <th className="px-4 py-3">Total Zakat</th>
                </tr>
              </thead>
              <tbody>
                {rtSummary.slice(0, 4).map((rt, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">RT {rt.rtNumber}</td>
                    <td className="px-4 py-3">{rt.totalFamilies}</td>
                    <td className="px-4 py-3">{rt.totalIndividuals}</td>
                    <td className="px-4 py-3">{formatCurrency(rt.totalCash)}</td>
                    <td className="px-4 py-3">{formatRiceWeight(rt.totalRice)}</td>
                    <td className="px-4 py-3">{formatCurrency(rt.totalInfaqBaznas)}</td>
                    <td className="px-4 py-3">{formatCurrency(rt.totalInfaqMasjid)}</td>
                    <td className="px-4 py-3">{formatCurrency(rt.totalInfaqBaznas + rt.totalInfaqMasjid)}</td>
                    <td className="px-4 py-3">{formatCurrency(rt.totalCash + rt.totalInfaqBaznas + rt.totalInfaqMasjid)}</td>
                  </tr>
                ))}
                <tr className="border-b bg-gray-50 dark:bg-gray-700 font-medium">
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3">{summary.totalFamilies}</td>
                  <td className="px-4 py-3">{summary.totalIndividuals}</td>
                  <td className="px-4 py-3">{formatCurrency(summary.totalCash)}</td>
                  <td className="px-4 py-3">{formatRiceWeight(summary.totalRice)}</td>
                  <td className="px-4 py-3">{formatCurrency(summary.totalInfaqBaznas)}</td>
                  <td className="px-4 py-3">{formatCurrency(summary.totalInfaqMasjid)}</td>
                  <td className="px-4 py-3">{formatCurrency(summary.totalInfaqBaznas + summary.totalInfaqMasjid)}</td>
                  <td className="px-4 py-3">{formatCurrency(summary.totalCash + summary.totalInfaqBaznas + summary.totalInfaqMasjid)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Daftar Penerima Zakat */}
      <Card className="card-hover backdrop-blur-sm bg-white/80 border-2 border-rose-200/50 bg-gradient-to-br from-rose-50/90 to-white/90 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 dark:bg-gray-800/80 dark:from-rose-950/90 dark:to-gray-900/90 dark:border-rose-800/50">
        <CardHeader>
          <CardTitle className="text-rose-800 dark:text-rose-200">Daftar Penerima Zakat</CardTitle>
          <CardDescription className="text-rose-600 dark:text-rose-300">
            Rekap penerima zakat berdasarkan kategori
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left dark:text-gray-300">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">RT</th>
                  <th className="px-4 py-3">Zakat Uang</th>
                  <th className="px-4 py-3">Zakat Beras</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((recipient, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3">{recipient.name}</td>
                    <td className="px-4 py-3">{recipient.category === 'fakir_miskin' ? 'Fakir Miskin' : 
                      recipient.category === 'fi_sabilillah' ? 'Fi Sabilillah' : 
                      recipient.category === 'amilin_dkm' ? 'Amil DKM/RT/RW' : 
                      recipient.category === 'amilin_desa' ? 'Amil Desa' : 
                      recipient.category === 'amilin_kecamatan' ? 'Amil Kecamatan' : 
                      recipient.category === 'amilin_rt' ? 'Amil RT' : 
                      recipient.category === 'amilin_rw' ? 'Amil RW' : 
                      recipient.category === 'pengumpul_zakat' ? 'Pengumpul Zakat' : 
                      recipient.category === 'penyalur_zakat' ? 'Penyalur Zakat' : recipient.category}</td>
                    <td className="px-4 py-3">RT {recipient.rtNumber}</td>
                    <td className="px-4 py-3">{formatCurrency(recipient.cashAmount)}</td>
                    <td className="px-4 py-3">{formatRiceWeight(recipient.riceAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;