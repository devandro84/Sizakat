import React from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Separator } from '@/components/ui';
import { formatCurrency, formatRiceWeight } from '@/utils/zakatUtils';
import { format } from 'date-fns';
import './ReceiptStyle.css';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ReviewStrukBerasProps {
  headOfFamily: string;
  rtNumber: string;
  rwNumber: string;
  familyCount: number;
  zakatAmount: number;
  InfaqBaznas: number;
  InfaqMesjid: number;
  onClose: () => void;
}

const ReviewStrukBeras = ({
  headOfFamily,
  rtNumber,
  rwNumber,
  familyCount,
  zakatAmount,
  InfaqBaznas,
  InfaqMesjid,
  onClose,
}: ReviewStrukBerasProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'dd MMMM yyyy');
  const formattedTime = format(currentDate, 'HH:mm');

  const handlePayment = () => {
    toast({
      title: "Pembayaran Berhasil",
      description: "Terima kasih telah membayar zakat",
      duration: 2000,
    });
    navigate('/payment');
    onClose();
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 max-w-md mx-auto receipt-card">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <img src="/LogoZakat.png" alt="Logo Zakat" className="h-12 w-12" />
        </div>
        <div className="text-3xl font-bold text-green-500 mb-2">
          {formatRiceWeight(zakatAmount)}
        </div>
        <CardDescription className="text-lg dark:text-gray-300">
          Dibayar Langsung ke Masjid
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
            <span className="font-medium dark:text-white">Beras</span>
          </div>
        </div>

        {/* Rincian Pembayaran */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Jumlah Jiwa</span>
            <span className="font-medium dark:text-white">{familyCount} orang</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Zakat Fitrah (Beras) per Jiwa</span>
            <span className="font-medium dark:text-white">{formatRiceWeight(zakatAmount / familyCount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total Zakat Fitrah</span>
            <span className="font-medium dark:text-white">{formatRiceWeight(zakatAmount)}</span>
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
              {formatRiceWeight(zakatAmount)} + {formatCurrency(InfaqBaznas * familyCount + InfaqMesjid * familyCount)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          onClick={handlePayment}
        >
          Bayar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewStrukBeras;