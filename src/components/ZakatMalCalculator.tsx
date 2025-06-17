
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { calculateZakatMal, formatCurrency, zakatIntentions } from '@/utils/zakatUtils';
import { useToast } from '@/hooks/use-toast';
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
  Slider,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui';
import { Calculator, Download, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ZakatMalCalculator = () => {
  const { toast } = useToast();
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [goldPrice, setGoldPrice] = useState(1200000); // Default price per gram in IDR
  const [silverPrice, setSilverPrice] = useState(15000); // Default price per gram in IDR

  const form = useForm({
    defaultValues: {
      gold: 0,
      silver: 0,
      cash: 0,
      tradingAssets: 0,
      receivables: 0,
      liabilities: 0,
    }
  });

  const onSubmit = (data: any) => {
    // Calculate zakat māl
    const result = calculateZakatMal(
      Number(data.gold),
      Number(data.silver),
      Number(data.cash),
      Number(data.tradingAssets),
      Number(data.receivables),
      Number(data.liabilities),
      goldPrice,
      silverPrice
    );

    setCalculationResult(result);
    setShowResults(true);

    toast({
      title: "Perhitungan Zakat Māl Selesai",
      description: result.eligibleForZakat 
        ? `Anda wajib membayar zakat sebesar ${formatCurrency(result.zakatAmount)}` 
        : "Harta Anda belum mencapai nisab, belum wajib zakat",
    });
  };

  const handleDownloadPdf = () => {
    if (!calculationResult) return;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Laporan Perhitungan Zakat Māl', 105, 20, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 105, 30, { align: 'center' });
    
    // Add calculation details
    doc.setFontSize(12);
    const data = [
      ['Jenis', 'Nilai'],
      ['Total Aset', formatCurrency(calculationResult.totalAssets)],
      ['Total Kewajiban', formatCurrency(calculationResult.totalDeductibles)],
      ['Aset Bersih', formatCurrency(calculationResult.netAssets)],
      ['Nisab (85 gram emas)', formatCurrency(calculationResult.nisab)],
      ['Status', calculationResult.eligibleForZakat ? 'Wajib Zakat' : 'Belum Wajib Zakat'],
      ['Jumlah Zakat (2.5%)', formatCurrency(calculationResult.zakatAmount)],
    ];
    
    (doc as any).autoTable({
      startY: 40,
      head: [['Parameter', 'Nilai']],
      body: data.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [0, 128, 0] },
    });
    
    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text('Zakat Fitrah Digital Hub - Laporan Zakat Māl', 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    
    doc.save('perhitungan-zakat-māl.pdf');
    
    toast({
      title: "Laporan Berhasil Diunduh",
      description: "File PDF perhitungan zakat māl telah diunduh",
    });
  };

  const resetCalculation = () => {
    form.reset();
    setShowResults(false);
    setCalculationResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!showResults ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Kalkulator Zakat Māl (Harta)</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Hitung zakat māl berdasarkan harta yang Anda miliki
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Gold & Silver Price Setting */}
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md mb-6">
                  <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Harga Emas & Perak</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="goldPrice" className="dark:text-white">Harga Emas per gram (IDR)</Label>
                      <Input
                        id="goldPrice"
                        type="number"
                        value={goldPrice}
                        onChange={(e) => setGoldPrice(Number(e.target.value))}
                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="silverPrice" className="dark:text-white">Harga Perak per gram (IDR)</Label>
                      <Input
                        id="silverPrice"
                        type="number"
                        value={silverPrice}
                        onChange={(e) => setSilverPrice(Number(e.target.value))}
                        className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                    Nisab zakat māl adalah setara dengan 85 gram emas (atau 595 gram perak)
                  </p>
                </div>

                {/* Assets Input */}
                <div className="space-y-4">
                  <h3 className="font-medium border-b pb-2 dark:text-white dark:border-gray-600">Aset (Harta)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white">Emas (gram)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                          </FormControl>
                          <FormDescription className="dark:text-gray-400">
                            Jumlah emas yang dimiliki dalam gram
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="silver"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-white">Perak (gram)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} className="dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                          </FormControl>
                          <FormDescription>
                            Jumlah perak yang dimiliki dalam gram
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cash"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uang Tunai / Tabungan (IDR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Total uang tunai, tabungan, dan deposito
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tradingAssets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harta Perniagaan (IDR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Nilai aset perniagaan, investasi, dan stok barang dagangan
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="receivables"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Piutang (IDR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Jumlah piutang yang diharapkan dapat diterima
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Liabilities Input */}
                <div className="space-y-4">
                  <h3 className="font-medium border-b pb-2">Kewajiban (Hutang)</h3>
                  
                  <FormField
                    control={form.control}
                    name="liabilities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Hutang (IDR)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Total hutang yang jatuh tempo dalam waktu dekat
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Calculation Summary */}

                <Button type="submit" className="w-full bg-zakat-green hover:bg-zakat-light-green dark:bg-green-600 dark:hover:bg-green-500">
                  <Calculator className="mr-2 h-4 w-4" />
                  Hitung Zakat Māl
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Hasil Perhitungan Zakat Māl</CardTitle>
            <CardDescription>
              Berdasarkan harta yang Anda masukkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Total Aset</h3>
                  <p className="text-xl font-bold dark:text-white">{formatCurrency(calculationResult.totalAssets)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Total Kewajiban</h3>
                  <p className="text-xl font-bold dark:text-white">{formatCurrency(calculationResult.totalDeductibles)}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 dark:text-blue-100">Aset Bersih</h3>
                <p className="text-2xl font-bold dark:text-white">{formatCurrency(calculationResult.netAssets)}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
                  <h3 className="font-medium text-amber-800 dark:text-amber-100">Nisab (85g Emas)</h3>
                  <p className="text-xl font-bold dark:text-white">{formatCurrency(calculationResult.nisab)}</p>
                </div>
                <div className={`p-4 rounded-md ${calculationResult.eligibleForZakat ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <h3 className={`font-medium ${calculationResult.eligibleForZakat ? 'text-green-800 dark:text-green-100' : 'text-red-800 dark:text-red-100'}`}>
                    Status Zakat
                  </h3>
                  <p className="text-xl font-bold dark:text-white">
                    {calculationResult.eligibleForZakat ? 'Wajib Zakat' : 'Belum Wajib Zakat'}
                  </p>
                </div>
              </div>

              {calculationResult.eligibleForZakat && (
                <div className="bg-zakat-cream dark:bg-green-900/20 p-6 rounded-md border border-zakat-gold dark:border-green-600">
                  <h3 className="font-bold text-lg text-center mb-2 dark:text-white">Jumlah Zakat yang Wajib Dikeluarkan</h3>
                  <p className="text-3xl font-bold text-zakat-green dark:text-green-400 text-center">
                    {formatCurrency(calculationResult.zakatAmount)}
                  </p>
                  <p className="text-center text-sm mt-2 dark:text-gray-300">
                    2.5% dari aset bersih yang dimiliki
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex gap-4 w-full">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={resetCalculation}
              >
                <Calculator className="h-4 w-4" />
                Hitung Ulang
              </Button>
              <Button 
                className="flex-1 gap-2 bg-zakat-green hover:bg-zakat-light-green"
                onClick={handleDownloadPdf}
              >
                <Download className="h-4 w-4" />
                Unduh Laporan
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ZakatMalCalculator;
