import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, Separator } from '@/components/ui';
import { formatCurrency, formatRiceWeight } from '@/utils/zakatUtils';
import './ReceiptStyle.css';

interface CetakStrukProps {
  data: {
    headOfFamily: string;
    rtNumber: string;
    familyCount: number;
    paymentMethod: 'cash' | 'rice';
    paymentType: string;
    zakatAmount: number;
    infaqAmount: number;
    infaqAmount2: number;
    tanggal: string;
    jam: string;
  };
}

const CetakStruk: React.FC<CetakStrukProps> = ({ data }) => {


  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 max-w-md mx-auto receipt-card print-area">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <img src="/LogoZakat.png" alt="Logo Zakat" className="h-12 w-12" />
        </div>
        <div className="text-3xl font-bold text-green-500 mb-2">
          {data.paymentMethod === 'cash' ? 
            formatCurrency(data.zakatAmount + (data.infaqAmount * data.familyCount) + (data.infaqAmount2 * data.familyCount)) : 
            `${formatRiceWeight(data.zakatAmount)} kg`}
        </div>
        <CardDescription className="text-lg dark:text-gray-300">
          {data.paymentMethod === 'cash' ? (
            data.paymentType === 'tunai' ? 'Dibayar Langsung ke Masjid' :
            data.paymentType === 'transfer' ? 'Ditransfer ke Rekening Masjid' :
            'Dibayar via QRIS'
          ) : 'Dibayar Langsung ke Masjid'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Nama Kepala Keluarga</span>
            <span className="font-medium dark:text-white">{data.headOfFamily}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">RT</span>
            <span className="font-medium dark:text-white">{data.rtNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Tanggal</span>
            <span className="font-medium dark:text-white">{data.tanggal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Jam</span>
            <span className="font-medium dark:text-white">{data.jam}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Metode Pembayaran</span>
            <span className="font-medium dark:text-white capitalize">
              {data.paymentMethod === 'cash' ? data.paymentType : 'Beras'}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Jumlah Jiwa</span>
            <span className="font-medium dark:text-white">{data.familyCount} orang</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              {data.paymentMethod === 'cash' ? 'Zakat Fitrah (Uang)' : 'Zakat Fitrah (Beras)'} per Jiwa
            </span>
            <span className="font-medium dark:text-white">
              {data.paymentMethod === 'cash' ? 
                formatCurrency(data.zakatAmount / data.familyCount) : 
                `${formatRiceWeight(data.zakatAmount / data.familyCount)} kg`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total Zakat Fitrah</span>
            <span className="font-medium dark:text-white">
              {data.paymentMethod === 'cash' ? 
                formatCurrency(data.zakatAmount) : 
                `${formatRiceWeight(data.zakatAmount)} kg`}
            </span>
          </div>
          {data.paymentMethod === 'cash' && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Infaq Baznas per Jiwa</span>
                <span className="font-medium dark:text-white">{formatCurrency(data.infaqAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Infaq Baznas</span>
                <span className="font-medium dark:text-white">{formatCurrency(data.infaqAmount * data.familyCount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Infaq Masjid per Jiwa</span>
                <span className="font-medium dark:text-white">{formatCurrency(data.infaqAmount2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Infaq Masjid</span>
                <span className="font-medium dark:text-white">{formatCurrency(data.infaqAmount2 * data.familyCount)}</span>
              </div>
              <Separator className="my-2 dark:bg-gray-600" />
              <Separator className="my-2 dark:bg-gray-600" />
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-700 dark:text-gray-200">Total Pembayaran</span>
                <span className="text-green-600 dark:text-green-400">
                  {data.paymentMethod === 'cash' ? 
                    formatCurrency(data.zakatAmount + (data.infaqAmount * data.familyCount) + (data.infaqAmount2 * data.familyCount)) :
                    `${formatRiceWeight(data.zakatAmount)} + ${formatCurrency(data.infaqAmount * data.familyCount + data.infaqAmount2 * data.familyCount)}`
                  }
                </span>
              </div>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        {data.paymentMethod === 'cash' && data.paymentType === 'transfer' && (
          <div className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Informasi Rekening</h4>
            <div className="space-y-2">
              <p className="text-blue-800 dark:text-blue-200">Bank Syariah Indonesia (BSI)</p>
              <p className="text-blue-800 dark:text-blue-200 font-medium">7180281821</p>
              <p className="text-blue-800 dark:text-blue-200">a.n. Masjid Al-Ihsan</p>
            </div>
          </div>
        )}
        {data.paymentMethod === 'cash' && data.paymentType === 'qris' && (
          <div className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-4">
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Scan QRIS</h4>
            <div className="flex justify-center mb-2">
              <img src="/qris-code.svg" alt="QRIS Code" className="w-48 h-48" />
            </div>
            <p className="text-purple-800 dark:text-purple-200 text-center text-sm">Scan kode QR di atas menggunakan aplikasi e-wallet Anda</p>
          </div>
        )}
        <div className="text-center space-y-1 text-gray-600 dark:text-gray-300">
          <p>Terima kasih atas pembayaran zakat Anda</p>
          <p>Semoga menjadi amal ibadah yang diterima</p>
        </div>
        <button onClick={handlePrint} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">
          Cetak Struk
        </button>
      </CardFooter>
    </Card>
  );
};

export default CetakStruk;