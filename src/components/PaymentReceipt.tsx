import React from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Separator } from '@/components/ui';
import { getSettings } from '@/utils/database';
import { Download, Printer } from 'lucide-react';
import { printThermalReceipt } from '@/utils/printUtils';
import { formatCurrency, formatRiceWeight } from '@/utils/zakatUtils';
import { format } from 'date-fns';

interface PaymentReceiptProps {
  headOfFamily: string;
  rtNumber: string;
  rwNumber: string;
  familyCount: number;
  paymentMethod: 'cash' | 'rice';
  paymentType: string;
  zakatAmount: number;
  infaqAmount: number;
  infaqAmount2: number;
  collectorName: string;
  paymentTime: string;
  onDownloadPdf: () => void;
  onClose: () => void;
}

const PaymentReceipt = ({
  headOfFamily,
  rtNumber,
  rwNumber,
  familyCount,
  paymentMethod,
  paymentType,
  zakatAmount,
  infaqAmount,
  infaqAmount2,
  collectorName,
  paymentTime,
  onDownloadPdf,
  onClose,
}: PaymentReceiptProps) => {

  const [currentDate, setCurrentDate] = React.useState(new Date());
  const settings = getSettings();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = format(currentDate, 'dd MMMM yyyy');
  const formattedTime = paymentTime;

  const calculateTotalAmount = () => {
    if (paymentMethod === 'rice') {
      return zakatAmount; // Untuk pembayaran beras, total hanya zakat
    }
    // Untuk pembayaran tunai, total adalah zakat + infaq
    const totalInfaq = (infaqAmount + infaqAmount2) * familyCount;
    return zakatAmount + totalInfaq;
  };

  const totalAmount = calculateTotalAmount();

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 max-w-md mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <img src="/LogoZakat.png" alt="Logo Zakat" className="h-12 w-12" />
        </div>
        <div className="text-3xl font-bold text-green-500 mb-2">
          {paymentMethod === 'cash' ? formatCurrency(totalAmount) : formatRiceWeight(zakatAmount)}
        </div>
        <CardDescription className="text-lg dark:text-gray-300">
          {paymentMethod === 'cash' ? (
            paymentType === 'tunai' ? 'Dibayar Langsung ke Masjid' :
            paymentType === 'transfer' ? 'Ditransfer ke Rekening Masjid' :
            'Dibayar via QRIS'
          ) : 'Dibayar Langsung ke Masjid'}
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
            <span className="font-medium dark:text-white">{(rtNumber || '').padStart(2, '0')}/{rwNumber || ''}</span>
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
            <span className="text-gray-600 dark:text-gray-300">Petugas</span>
            <span className="font-medium dark:text-white">{collectorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Metode Pembayaran</span>
            <span className="font-medium dark:text-white capitalize">
              {paymentMethod === 'cash' ? `${paymentType}` : 'Beras'}
            </span>
          </div>
        </div>

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
          {paymentMethod === 'cash' && (
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
                <span className="text-green-600 dark:text-green-400">
                  {formatCurrency(zakatAmount + (infaqAmount * familyCount) + (infaqAmount2 * familyCount))}
                </span>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {paymentMethod === 'cash' && paymentType === 'transfer' && (
          <div className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Informasi Rekening</h4>
            <div className="space-y-2">
              <p className="text-blue-800 dark:text-blue-200">Bank Syariah Indonesia (BSI)</p>
              <p className="text-blue-800 dark:text-blue-200 font-medium">7180281821</p>
              <p className="text-blue-800 dark:text-blue-200">a.n. Masjid Al-Ihsan</p>
            </div>
          </div>
        )}
        {paymentMethod === 'cash' && paymentType === 'qris' && (
          <div className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-4">
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Scan QRIS</h4>
            {settings.qris.imageUrl ? (
              <div className="flex justify-center mb-2">
                <img src={settings.qris.imageUrl} alt="QRIS Code" className="w-48 h-48 object-contain" />
              </div>
            ) : (
              <div className="flex justify-center items-center h-48 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
                <p className="text-gray-500 dark:text-gray-400">Belum ada kode QRIS</p>
              </div>
            )}
            <p className="text-purple-800 dark:text-purple-200 text-center text-sm">Scan kode QR di atas menggunakan aplikasi e-wallet Anda</p>
          </div>
        )}
        <div className="flex gap-4">
          <Button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => printThermalReceipt({
              headOfFamily,
              rtNumber,
              rwNumber,
              familyCount,
              paymentMethod,
              paymentType,
              zakatAmount,
              infaqAmount,
              infaqAmount2,
              mosqueInfaqAmount: infaqAmount2,
              collectorName,
              paymentTime,
              paymentDate: format(currentDate, 'yyyy-MM-dd'),
              riceAmount: paymentMethod === 'rice' ? zakatAmount : 0,
              cashAmount: paymentMethod === 'cash' ? zakatAmount : 0
            })}
          >
            <Printer className="mr-2 h-4 w-4" />
            Cetak Struk
          </Button>
          <Button
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
            onClick={onDownloadPdf}
          >
            <Download className="mr-2 h-4 w-4" />
            Unduh PDF
          </Button>
        </div>
        <Button
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          onClick={onClose}
        >
          Selesai
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentReceipt;