import React, { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Separator } from '@/components/ui';
import { ArrowLeft, CreditCard, QrCode, Wallet } from 'lucide-react';
import PaymentInstructions from './PaymentInstructions';
import { formatCurrency, formatRiceWeight } from '@/utils/zakatUtils';
import PaymentReceipt from './PaymentReceipt';
import { printThermalReceipt, createPdfReceipt } from '@/utils/printUtils';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

interface PaymentDetailsProps {
  onBack: () => void;
  onComplete: (paymentType: string) => void;
  amount: number;
  paymentMethod: 'cash' | 'rice';
  familyCount: number;
  infaqAmount: number;
  infaqAmount2: number;
  zakatAmount: number;
  headOfFamily: string;
  rtNumber: string;
  rwNumber?: string;
  collectorName: string;
}

const PaymentDetails = ({
  onBack,
  onComplete,
  amount,
  paymentMethod,
  familyCount,
  infaqAmount,
  infaqAmount2,
  zakatAmount,
  headOfFamily,
  rtNumber,
  rwNumber,
  collectorName,
}: PaymentDetailsProps) => {
  const { getValues } = useForm();
  const [showReceipt, setShowReceipt] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');
  const [paymentTime] = useState(format(new Date(), 'HH:mm'));

  const handleDownloadPdf = () => {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    const formattedTime = format(currentDate, 'HH:mm');

    createPdfReceipt({
      headOfFamily,
      rtNumber,
      rwNumber,
      familyCount,
      paymentMethod,
      paymentType: selectedPaymentType,
      zakatAmount,
      infaqAmount,
      infaqAmount2,
      mosqueInfaqAmount: infaqAmount2,
      collectorName,
      paymentDate: formattedDate,
      paymentTime: formattedTime,
      riceAmount: paymentMethod === 'rice' ? zakatAmount : 0,
      cashAmount: paymentMethod === 'cash' ? zakatAmount : 0
    });
  };

  const calculateTotalAmount = () => {
    if (paymentMethod === 'rice') {
      return zakatAmount; // Untuk pembayaran beras, total hanya zakat
    }
    // Untuk pembayaran tunai, total adalah zakat + infaq
    const totalInfaq = (infaqAmount + infaqAmount2) * familyCount;
    return zakatAmount + totalInfaq;
  };



  if (showInstructions) {
    if (paymentMethod === 'rice') {
      return (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Konfirmasi Pembayaran Beras</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Silakan periksa rincian pembayaran beras zakat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300 text-xl font-semibold">Total Beras yang Harus Diserahkan</span>
                <span className="font-bold text-2xl dark:text-white">{formatRiceWeight(zakatAmount)}</span>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Petunjuk Penyerahan Beras:</h4>
                <ul className="list-disc pl-4 space-y-2 text-blue-800 dark:text-blue-200 text-sm">
                  <li>Pastikan beras yang diserahkan dalam kondisi baik dan layak konsumsi</li>
                  <li>Beras dapat diserahkan dalam kemasan yang rapi</li>
                  <li>Serahkan beras ke petugas zakat di masjid</li>
                  <li>Simpan bukti pembayaran yang diberikan</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={() => setShowInstructions(false)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                onClick={() => {
                  setShowInstructions(false);
                  setShowReceipt(true);
                }}
              >
                Konfirmasi Pembayaran
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    return (
      <PaymentInstructions
        paymentType={selectedPaymentType}
        amount={paymentMethod === 'cash' ? zakatAmount + (infaqAmount * familyCount) + (infaqAmount2 * familyCount) : zakatAmount}
        onBack={() => setShowInstructions(false)}
        onConfirm={() => {
          setShowInstructions(false);
          setShowReceipt(true);
        }}
      />
    );
  }

  if (showReceipt) {
     return (
      <div className="space-y-6">
        <PaymentReceipt
                 headOfFamily={headOfFamily}
                 rtNumber={rtNumber}
                 rwNumber={rwNumber}
                 familyCount={familyCount}
                 paymentMethod={paymentMethod}
                 paymentType={selectedPaymentType}
                 zakatAmount={zakatAmount}
                 infaqAmount={infaqAmount}
                 infaqAmount2={infaqAmount2}
                 collectorName={collectorName}
                 paymentTime={format(new Date(), 'HH:mm')}
                 onClose={() => {
                     onComplete(selectedPaymentType);
                     setShowReceipt(false);
                 }}
                 onDownloadPdf={handleDownloadPdf}
        />
      </div>
    );
  }
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Rincian Pembayaran</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Pilih metode pembayaran yang Anda inginkan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">


        {/* Rincian Pembayaran */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Jumlah Jiwa</span>
            <span className="font-medium dark:text-white">{familyCount} orang</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">
              {paymentMethod === 'cash' ? 'Zakat Fitrah (Uang)' : 'Zakat Fitrah (Beras)'} per Jiwa
            </span>
            <span className="font-medium dark:text-white">
              {paymentMethod === 'cash' 
                ? formatCurrency(zakatAmount / familyCount)
                : formatRiceWeight(zakatAmount / familyCount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Total Zakat Fitrah</span>
            <span className="font-medium dark:text-white">
              {paymentMethod === 'cash'
                ? formatCurrency(zakatAmount)
                : formatRiceWeight(zakatAmount)}
            </span>
          </div>
          {paymentMethod === 'cash' ? (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Infaq Baznas per Jiwa</span>
                <span className="font-medium dark:text-white">{formatCurrency(infaqAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Infaq Baznas</span>
                <span className="font-medium dark:text-white">{formatCurrency(infaqAmount * familyCount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Infaq Masjid per Jiwa</span>
                <span className="font-medium dark:text-white">{formatCurrency(infaqAmount2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Total Infaq Masjid</span>
                <span className="font-medium dark:text-white">{formatCurrency(infaqAmount2 * familyCount)}</span>
              </div>
              <Separator className="my-2 dark:bg-gray-600" />
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-700 dark:text-gray-200">Total Pembayaran</span>
                <span className="text-green-600 dark:text-green-400">{formatCurrency(zakatAmount + (infaqAmount * familyCount) + (infaqAmount2 * familyCount))}</span>
              </div>
            </>
          ) : (
            <>
              <Separator className="my-2 dark:bg-gray-600" />
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-700 dark:text-gray-200">Total Pembayaran Beras</span>
                <span className="text-green-600 dark:text-green-400">{formatRiceWeight(zakatAmount)}</span>
              </div>
            </>
          )}
        </div>

        {/* Metode Pembayaran */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {paymentMethod === 'cash' ? 'Metode Pembayaran' : 'Konfirmasi Pembayaran'}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {paymentMethod === 'cash' ? (
              <>
                <button
                  onClick={() => {
                    setSelectedPaymentType('tunai');
                    setShowInstructions(true);
                  }}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                >
                  <Wallet className="h-5 w-5 text-green-500 mr-3" />
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Tunai</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pembayaran langsung dengan uang tunai</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedPaymentType('transfer');
                    setShowInstructions(true);
                  }}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                >
                  <CreditCard className="h-5 w-5 text-blue-500 mr-3" />
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Transfer Bank</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transfer melalui rekening bank</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedPaymentType('qris');
                    setShowInstructions(true);
                  }}
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                >
                  <QrCode className="h-5 w-5 text-purple-500 mr-3" />
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">QRIS</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pembayaran menggunakan QRIS</p>
                  </div>
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setSelectedPaymentType('rice');
                    setShowInstructions(true);
                  }}
                  className="flex items-center w-full p-4 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                >
                  <Wallet className="h-5 w-5 text-green-500 mr-3" />
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">Konfirmasi Pembayaran Beras</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Konfirmasi penyerahan beras zakat</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </CardFooter>
    </Card>
  );

};

export default PaymentDetails;