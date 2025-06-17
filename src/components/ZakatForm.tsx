
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { addDonor, getSettings } from '@/utils/database';
import { calculateFamilyDonation, formatCurrency, formatRiceWeight, zakatIntentions, ijabQabul } from '@/utils/zakatUtils';
import { useToast } from '@/hooks/use-toast';
import PaymentDetails from './PaymentDetails';
import { 
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from '@/components/ui';
import { CalendarIcon, Calculator, Printer, Download, CreditCard, Save, Check, Plus } from 'lucide-react';
import Panah from '@/assets/icons/Panah.png';
import RiceSackIcon from './ui/icons/rice-sack';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createPdfReceipt, printThermalReceipt } from '@/utils/printUtils';
import { FormData } from '@/types/form';

const ZakatForm = () => {
  const { toast } = useToast();
  const settings = getSettings();
  const form = useForm<FormData>({    
    defaultValues: {
      headOfFamily: '',
      familyCount: 1,
      rtNumber: '',
      infaqAmount: settings.minInfaqAmount,
      infaqAmount2: settings.minInfaqAmount,
      mosqueInfaqAmount: 0,
      paymentMethod: 'cash',
      cashAmount: 0,
      riceAmount: 0,
      paymentDate: format(new Date(), 'yyyy-MM-dd')
    }
  });
  const { register, handleSubmit, reset, setValue, getValues, watch } = form;
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'rice'>('cash');
  const [riceAmount, setRiceAmount] = useState<2.5 | 3>(2.5);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm:ss'));
  const [showReceipt, setShowReceipt] = useState(false);
  const [showIjabQabul, setShowIjabQabul] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [calculatedAmounts, setCalculatedAmounts] = useState({
    zakatAmount: 0,
    totalAmount: 0,
  });

  const familyCount = watch('familyCount', 1);
  const mosqueInfaqAmount = watch('mosqueInfaqAmount', 0);
  const infaqAmount = Number(watch('infaqAmount', settings.minInfaqAmount));
  const infaqAmount2 = Number(watch('infaqAmount2', settings.minInfaqAmount));

  useEffect(() => {
    // Set default values
    setValue('paymentMethod', 'cash');

    // Register the date field
    setValue('paymentDate', format(date, 'yyyy-MM-dd'));
  }, [setValue, date]);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Calculate amounts when family count or payment method changes
    const count = parseInt(familyCount.toString()) || 1;
    const amounts = calculateFamilyDonation(count, paymentMethod as 'cash' | 'rice', riceAmount);
    
    // Reset infaq amounts when payment method is rice
    if (paymentMethod === 'rice') {
      setValue('infaqAmount', 0);
      setValue('infaqAmount2', 0);
    } else {
      setValue('infaqAmount', settings.minInfaqAmount);
      setValue('infaqAmount2', settings.minInfaqAmount);
    }
    
    const totalInfaq = paymentMethod === 'cash' ? (infaqAmount + infaqAmount2 + mosqueInfaqAmount) * count : 0;
    
    setCalculatedAmounts({
      zakatAmount: amounts.zakatAmount,
      totalAmount: paymentMethod === 'cash' ? amounts.zakatAmount + totalInfaq : amounts.zakatAmount
    });
    
    if (paymentMethod === 'cash') {
      setValue('cashAmount', amounts.zakatAmount);
      setValue('riceAmount', 0);
    } else {
      setValue('riceAmount', amounts.zakatAmount);
      setValue('cashAmount', 0);
    }
  }, [familyCount, paymentMethod, infaqAmount, riceAmount, setValue, settings.minInfaqAmount]);

  const onSubmit = (data: FormData) => {
    // Prepare the data
    const donorData = {
      headOfFamily: data.headOfFamily,
      familyCount: parseInt(data.familyCount.toString()),
      rtNumber: data.rtNumber,
      rwNumber: data.rwNumber,
      cashAmount: paymentMethod === 'cash' ? calculatedAmounts.zakatAmount : 0,
      riceAmount: paymentMethod === 'rice' ? calculatedAmounts.zakatAmount : 0,
      infaqAmount: parseInt(data.infaqAmount.toString()),
      infaqAmount2: parseInt(data.infaqAmount2.toString()),
      paymentDate: format(date, 'yyyy-MM-dd'),
      paymentTime: time,
      paymentMethod: paymentMethod,
      paymentType: '', // Will be set in handlePaymentComplete
      zakatAmount: calculatedAmounts.zakatAmount,
      collectorName: data.collectorName // Menambahkan nama petugas
    };

    setReceiptData(donorData);
    setShowPaymentDetails(true);
  };

  const handlePaymentComplete = (paymentType: string) => {
    if (receiptData) {
      // Add payment type to receipt data and set mosque infaq (infaqAmount2) as mosqueInfaqAmount
      const updatedReceiptData = {
        ...receiptData,
        paymentType: paymentType,
        mosqueInfaqAmount: infaqAmount2 // Use infaqAmount2 as mosque infaq amount
      };

      // Save to database
      const savedDonor = addDonor(updatedReceiptData);

      // Show success message
      toast({
        title: "Pembayaran berhasil disimpan",
        description: `Zakat dari ${receiptData.headOfFamily} telah dicatat`,
      });

      // Close payment modal and show receipt
      setShowPaymentDetails(false);
      setShowReceipt(true);
    }
  };

  const handleBackToForm = () => {
    setShowPaymentDetails(false);
  };

  const handlePrintReceipt = () => {
    if (receiptData) {
      printThermalReceipt(receiptData);
    }
  };

  const handleDownloadPdf = () => {
    if (receiptData) {
      createPdfReceipt(receiptData);
    }
  };

  const handleNewTransaction = () => {
    reset();
    setDate(new Date());
    setShowReceipt(false);
    setShowIjabQabul(false);
    setReceiptData(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {showPaymentDetails ? (
        <PaymentDetails
          onBack={handleBackToForm}
          onComplete={handlePaymentComplete}
          amount={calculatedAmounts.totalAmount}
          paymentMethod={paymentMethod}
          familyCount={parseInt(familyCount.toString())}
          infaqAmount={infaqAmount}
          infaqAmount2={infaqAmount2}
          zakatAmount={calculatedAmounts.zakatAmount}
          headOfFamily={getValues('headOfFamily')}
          rtNumber={getValues('rtNumber')}
          rwNumber={getValues('rwNumber')}
          collectorName={getValues('collectorName')}
        />
      ) : showReceipt ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Pembayaran Berhasil</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Transaksi zakat fitrah telah berhasil dicatat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Terima Kasih
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Pembayaran zakat fitrah telah diterima
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex gap-4 w-full">
              <Button 
                variant="outline" 
                className="flex-1 gap-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={handlePrintReceipt}
              >
                <Printer className="h-4 w-4" />
                Cetak Struk
              </Button>
              <Button 
                className="flex-1 gap-2 bg-zakat-green hover:bg-zakat-light-green dark:bg-green-600 dark:hover:bg-green-500"
                onClick={handleDownloadPdf}
              >
                <Download className="h-4 w-4" />
                Unduh PDF
              </Button>
            </div>
            <div className="flex gap-4 w-full">
              <Button
                variant="outline"
                className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={() => {
                  setShowReceipt(false);
                  setReceiptData(null);
                }}
              >
                Kembali
              </Button>
              <Button
                variant="outline"
                className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={() => {
                  setShowReceipt(false);
                }}
              >
                Edit
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              onClick={handleNewTransaction}
            >
              <Plus className="mr-2 h-4 w-4" />
              Transaksi Baru
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Form Pembayaran Zakat Fitrah</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Isi data pembayaran zakat fitrah
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headOfFamily">Nama Kepala Keluarga</Label>
                  <Input
                    id="headOfFamily"
                    {...register('headOfFamily', { required: true })}
                    className="bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rtNumber">RT</Label>
                    <Input
                      id="rtNumber"
                      {...register('rtNumber')}
                      className="bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rwNumber">RW</Label>
                    <Input
                      id="rwNumber"
                      {...register('rwNumber')}
                      className="bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectorName">Nama Petugas</Label>
                  <Input
                    id="collectorName"
                    {...register('collectorName', { required: true })}
                    className="bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Isi dengan nama yang bertugas
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="familyCount">Jumlah Jiwa</Label>
                <Input
                  id="familyCount"
                  type="number"
                  min="1"
                  {...register('familyCount', { required: true, min: 1 })}
                  className="bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Jumlah anggota keluarga yang membayar zakat fitrah
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium border-b pb-2 dark:text-white dark:border-gray-600">Metode Zakat</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500' : 'border-gray-200 dark:border-gray-600 dark:hover:border-gray-500'}`}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <div className="flex items-center space-x-2">
                      <CreditCard className={`h-5 w-5 ${paymentMethod === 'cash' ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className={`font-medium ${paymentMethod === 'cash' ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>Uang Tunai</span>
                    </div>
                    <p className={`mt-1 text-sm ${paymentMethod === 'cash' ? 'text-green-600 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      Rp {settings.cashZakatAmount.toLocaleString()} per jiwa
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'rice' ? 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-500' : 'border-gray-200 dark:border-gray-600 dark:hover:border-gray-500'}`}
                    onClick={() => setPaymentMethod('rice')}
                  >
                    <div className="flex items-center space-x-2">
                      <RiceSackIcon className={`h-5 w-5 ${paymentMethod === 'rice' ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className={`font-medium ${paymentMethod === 'rice' ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>Beras</span>
                    </div>
                    <p className={`mt-1 text-sm ${paymentMethod === 'rice' ? 'text-green-600 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>
                      {riceAmount} kg per jiwa
                    </p>
                  </div>
                </div>
                {paymentMethod === 'rice' && (
                  <div className="mt-4">
                    <Label htmlFor="riceAmount" className="dark:text-white">Jumlah Beras per Jiwa</Label>
                    <Select
                      value={riceAmount.toString()}
                      onValueChange={(value) => setRiceAmount(parseFloat(value) as 2.5 | 3)}
                    >
                      <SelectTrigger id="riceAmount" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <SelectValue placeholder="Pilih jumlah beras" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                        <SelectGroup>
                          <SelectItem value="2.5" className="dark:text-white dark:hover:bg-gray-700">2,5 kg</SelectItem>
                          <SelectItem value="3" className="dark:text-white dark:hover:bg-gray-700">3 kg</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {paymentMethod === 'cash' && (
                <div className="space-y-4">
                  <h3 className="font-medium border-b pb-2 dark:text-white dark:border-gray-600">Infaq</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="infaqAmount" className="dark:text-white">Infaq Baznas</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-l-md">
                          Rp
                        </span>
                        <Input
                          id="infaqAmount"
                          type="number"
                          {...register('infaqAmount')}
                          className="bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-l-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Minimal Rp {settings.minInfaqAmount.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="infaqAmount2" className="dark:text-white">Infaq Masjid</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-l-md">
                          Rp
                        </span>
                        <Input
                          id="infaqAmount2"
                          type="number"
                          {...register('infaqAmount2')}
                          className="bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-l-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Minimal Rp {settings.minInfaqAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paymentDate" className="dark:text-white">Tanggal Pembayaran</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    value={format(date, 'yyyy-MM-dd')}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <Label htmlFor="paymentTime" className="dark:text-white">Jam Pembayaran</Label>
                  <Input
                    id="paymentTime"
                    type="time"
                    value={time.substring(0, 5)}
                    onChange={(e) => setTime(e.target.value + ':00')}
                    className="bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Rincian Pembayaran */}
              <div className="space-y-4 mt-6">
                <h3 className="font-medium border-b pb-2 dark:text-white dark:border-gray-600">Rincian Pembayaran</h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Jumlah Jiwa</span>
                    <span className="font-medium dark:text-white">{familyCount} orang</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">{paymentMethod === 'cash' ? 'Zakat Fitrah (Uang)' : 'Zakat Fitrah (Beras)'} per Jiwa</span>
                    <span className="font-medium dark:text-white">
                      {paymentMethod === 'cash' 
                        ? formatCurrency(settings.cashZakatAmount)
                        : `${riceAmount} kg`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Zakat Fitrah</span>
                    <span className="font-medium dark:text-white">
                      {paymentMethod === 'cash'
                        ? formatCurrency(calculatedAmounts.zakatAmount)
                        : `${formatRiceWeight(calculatedAmounts.zakatAmount, false)} kg`}
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
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Total Infaq Keseluruhan</span>
                        <span className="font-medium dark:text-white">{formatCurrency((infaqAmount + infaqAmount2) * familyCount)}</span>
                      </div>
                    </>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Total Pembayaran</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {paymentMethod === 'cash'
                        ? formatCurrency(calculatedAmounts.zakatAmount + ((infaqAmount + infaqAmount2) * familyCount))
                        : `${formatRiceWeight(calculatedAmounts.zakatAmount, false)} kg`}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-zakat-green hover:bg-zakat-light-green dark:bg-green-600 dark:hover:bg-green-500"
              >
                <img src={Panah} alt="Lanjut" className="mr-2 h-4 w-4" />
                Lanjut
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ZakatForm;
