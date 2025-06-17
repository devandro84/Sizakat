import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator
} from '@/components/ui';
import { CreditCard, Wallet, QrCode, Receipt } from 'lucide-react';
import { formatCurrency } from '@/utils/zakatUtils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (paymentType: string) => void;
  amount: number;
  paymentMethod: 'cash' | 'rice';
  familyCount?: number;
  infaqAmount?: number;
  infaqAmount2?: number;
  zakatAmount?: number;
}

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  amount, 
  paymentMethod,
  familyCount = 1,
  infaqAmount = 0,
  infaqAmount2 = 0,
  zakatAmount = 0
}: PaymentModalProps) => {
  if (paymentMethod === 'rice') {
    return null; // Don't show payment modal for rice payments
  }

  const handlePaymentSelect = (type: string) => {
    onComplete(type);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Pilih Metode Pembayaran</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Silakan periksa rincian pembayaran dan pilih metode pembayaran
          </DialogDescription>
        </DialogHeader>

        {/* Preview Struk */}
        <Card className="bg-white dark:bg-gray-700 mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 dark:text-white">
              <Receipt className="h-5 w-5" />
              Rincian Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Jumlah Jiwa</span>
              <span className="font-medium dark:text-white">{familyCount} orang</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Zakat Fitrah</span>
              <span className="font-medium dark:text-white">{formatCurrency(zakatAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Infaq Baznas</span>
              <span className="font-medium dark:text-white">{formatCurrency(infaqAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Infaq Masjid</span>
              <span className="font-medium dark:text-white">{formatCurrency(infaqAmount2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-base font-semibold">
              <span className="text-gray-700 dark:text-gray-200">Total Pembayaran</span>
              <span className="text-green-600 dark:text-green-400">{formatCurrency(zakatAmount + infaqAmount + infaqAmount2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 py-4">
          {/* Cash Payment */}
          <Card 
            className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => handlePaymentSelect('cash')}
          >
            <CardContent className="p-4 flex items-center space-x-4">
              <Wallet className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-medium dark:text-white">Tunai</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pembayaran langsung di tempat</p>
              </div>
            </CardContent>
          </Card>

          {/* Bank Transfer */}
          <Card 
            className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => handlePaymentSelect('transfer')}
          >
            <CardContent className="p-4 flex items-center space-x-4">
              <CreditCard className="h-6 w-6 text-blue-500" />
              <div>
                <h4 className="font-medium dark:text-white">Transfer Bank</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Transfer ke rekening bank yang tersedia</p>
              </div>
            </CardContent>
          </Card>

          {/* QRIS */}
          <Card 
            className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => handlePaymentSelect('qris')}
          >
            <CardContent className="p-4 flex items-center space-x-4">
              <QrCode className="h-6 w-6 text-purple-500" />
              <div>
                <h4 className="font-medium dark:text-white">QRIS</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scan kode QR untuk pembayaran</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-4" />

        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
            Batal
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;