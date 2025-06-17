import React from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { ArrowLeft, ArrowRight, CreditCard, QrCode } from 'lucide-react';
import { formatCurrency } from '@/utils/zakatUtils';
import { getSettings } from '@/utils/database';

interface PaymentInstructionsProps {
  paymentType: string;
  amount: number;
  onBack: () => void;
  onConfirm: () => void;
}

const PaymentInstructions = ({
  paymentType,
  amount,
  onBack,
  onConfirm,
}: PaymentInstructionsProps) => {
  const settings = getSettings();
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">
          {paymentType === 'transfer' ? 'Transfer Bank' :
           paymentType === 'qris' ? 'Pembayaran QRIS' :
           'Pembayaran Tunai'}
        </CardTitle>
        <CardDescription className="dark:text-gray-300">
          Ikuti instruksi pembayaran di bawah ini
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Total Pembayaran
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {formatCurrency(amount)}
          </div>
        </div>

        {paymentType === 'transfer' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Informasi Rekening</h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-3">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Bank</div>
                <div className="font-medium dark:text-white">Bank Syariah Indonesia (BSI)</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Nomor Rekening</div>
                <div className="font-medium dark:text-white">7180281821</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Atas Nama</div>
                <div className="font-medium dark:text-white">Masjid Al-Ihsan</div>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Petunjuk Transfer</h4>
              <ol className="list-decimal list-inside space-y-2 text-yellow-700 dark:text-yellow-300">
                <li>Salin nomor rekening di atas</li>
                <li>Buka aplikasi m-banking Anda</li>
                <li>Pilih menu transfer</li>
                <li>Masukkan nominal sesuai total pembayaran</li>
                <li>Periksa kembali detail transfer</li>
                <li>Selesaikan pembayaran</li>
              </ol>
            </div>
          </div>
        )}

        {paymentType === 'qris' && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Scan QRIS</h3>
            {settings.qris.imageUrl ? (
              <div className="flex justify-center">
                <img src={settings.qris.imageUrl} alt="QRIS Code" className="w-48 h-48 object-contain" />
              </div>
            ) : (
              <div className="flex justify-center items-center h-48 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">Belum ada kode QRIS</p>
              </div>
            )}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Petunjuk Pembayaran QRIS</h4>
              <ol className="list-decimal list-inside space-y-2 text-yellow-700 dark:text-yellow-300">
                <li>Buka aplikasi e-wallet atau m-banking Anda</li>
                <li>Pilih menu scan QRIS</li>
                <li>Scan kode QR di atas</li>
                <li>Masukkan nominal sesuai total pembayaran</li>
                <li>Periksa kembali detail pembayaran</li>
                <li>Selesaikan pembayaran</li>
              </ol>
            </div>
          </div>
        )}

        {paymentType === 'tunai' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Petunjuk Pembayaran Tunai</h4>
              <ol className="list-decimal list-inside space-y-2 text-yellow-700 dark:text-yellow-300">
                <li>Siapkan uang tunai sesuai total pembayaran</li>
                <li>Serahkan kepada petugas zakat</li>
                <li>Tunggu konfirmasi dan struk pembayaran</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <Button
          className="bg-green-500 hover:bg-green-600 text-white"
          onClick={onConfirm}
        >
          Konfirmasi Pembayaran
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentInstructions;