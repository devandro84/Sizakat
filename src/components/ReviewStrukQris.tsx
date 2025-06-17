import React from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Separator } from '@/components/ui';
import { formatCurrency } from '@/utils/zakatUtils';
import { format } from 'date-fns';
import './ReceiptStyle.css';

interface ReviewStrukQrisProps {
  headOfFamily: string;
  rtNumber: string;
  rwNumber: string;
  familyCount: number;
  zakatAmount: number;
  InfaqBaznas: number;
  InfaqMesjid: number;
  onClose: () => void;
}

const ReviewStrukQris = ({
  headOfFamily,
  rtNumber,
  rwNumber,
  familyCount,
  zakatAmount,
  InfaqBaznas,
  InfaqMesjid,
  onClose,
}: ReviewStrukQrisProps) => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'dd MMMM yyyy');
  const formattedTime = format(currentDate, 'HH:mm');

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 max-w-md mx-auto receipt-card">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <img src="/LogoZakat.png" alt="Logo Zakat" className="h-12 w-12" />
        </div>
        <div className="text-3xl font-bold text-green-500 mb-2">
          {formatCurrency(zakatAmount + (InfaqBaznas * familyCount) + (InfaqMesjid * familyCount))}
        </div>
        <CardDescription className="text-lg dark:text-gray-300">
          Dibayar via QRIS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informasi Pembayar */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Nama Kepala Keluarga</span>
            <span className="font-medium dark:text-white">{headOfFamily}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">RT/RW</span>
            <span className="font-medium dark:text-white">{rtNumber}/{rwNumber || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Tanggal</span>
            <span className="font-medium dark:text-white">{formattedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Jam</span>
            <span className="font-medium dark:text-white">{formattedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Metode Pembayaran</span>
            <span className="font-medium dark:text-white">QRIS</span>
          </div>
        </div>

        {/* Rincian Pembayaran */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Jumlah Jiwa</span>
            <span className="font-medium dark:text-white">{familyCount} orang</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Zakat Fitrah (Uang) per Jiwa</span>
            <span className="font-medium dark:text-white">{formatCurrency(zakatAmount / familyCount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total Zakat Fitrah</span>
            <span className="font-medium dark:text-white">{formatCurrency(zakatAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Infaq Baznas per Jiwa</span>
            <span className="font-medium dark:text-white">{formatCurrency(InfaqBaznas)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total Infaq Baznas</span>
            <span className="font-medium dark:text-white">{formatCurrency(InfaqBaznas * familyCount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Infaq Masjid per Jiwa</span>
            <span className="font-medium dark:text-white">{formatCurrency(InfaqMesjid)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total Infaq Masjid</span>
            <span className="font-medium dark:text-white">{formatCurrency(InfaqMesjid * familyCount)}</span>
          </div>
          <Separator className="my-2 dark:bg-gray-600" />
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-700 dark:text-gray-200">Total Pembayaran</span>
            <span className="text-green-600 dark:text-green-400">
              {formatCurrency(zakatAmount + (InfaqBaznas * familyCount) + (InfaqMesjid * familyCount))}
            </span>
          </div>
        </div>

        {/* QRIS Code */}
        <div className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-4">
          <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Scan QRIS</h4>
          <div className="flex justify-center mb-2">
            <img src="/qris-code.svg" alt="QRIS Code" className="w-48 h-48" />
          </div>
          <p className="text-purple-800 dark:text-purple-200 text-center text-sm">
            Scan kode QR di atas menggunakan aplikasi e-wallet Anda
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          onClick={onClose}
        >
          Bayar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewStrukQris;