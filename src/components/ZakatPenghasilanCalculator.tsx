
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { calculateZakatPenghasilan, formatCurrency, zakatIntentions } from '@/utils/zakatUtils';
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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui';
import { Calculator, Download, CreditCard, Wallet } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ZakatPenghasilanCalculator = () => {
  const { toast } = useToast();
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [goldPrice, setGoldPrice] = useState(1200000); // Default price per gram in IDR

  const form = useForm({
    defaultValues: {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      otherIncome: 0,
    }
  });

  const onSubmit = (data: any) => {
    // Calculate zakat penghasilan
    const result = calculateZakatPenghasilan(
      Number(data.monthlyIncome),
      Number(data.monthlyExpenses),
      Number(data.otherIncome),
      goldPrice
    );

    setCalculationResult(result);
    setShowResults(true);

    toast({
      title: "Perhitungan Zakat Penghasilan Selesai",
      description: result.eligibleForZakat 
        ? `Anda wajib membayar zakat sebesar ${formatCurrency(result.zakatAmount)}` 
        : "Penghasilan Anda belum mencapai nisab, belum wajib zakat",
    });
  };

  const handleDownloadPdf = () => {
    if (!calculationResult) return;

    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Laporan Perhitungan Zakat Penghasilan', 105, 20, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 105, 30, { align: 'center' });
    
    // Add calculation details
    doc.setFontSize(12);
    const data = [
      ['Jenis', 'Nilai'],
      ['Penghasilan Bersih per Bulan', formatCurrency(calculationResult.monthlyNetIncome)],
      ['Penghasilan Bersih per Tahun', formatCurrency(calculationResult.annualNetIncome)],
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
      doc.text('Zakat Fitrah Digital Hub - Laporan Zakat Penghasilan', 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    
    doc.save('perhitungan-zakat-penghasilan.pdf');
    
    toast({
      title: "Laporan Berhasil Diunduh",
      description: "File PDF perhitungan zakat penghasilan telah diunduh",
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
            <CardTitle className="dark:text-white">Kalkulator Zakat Penghasilan</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Hitung zakat dari penghasilan yang Anda peroleh
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Gold Price Setting */}
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md mb-6">
                  <h3 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Harga Emas</h3>
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
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                    Nisab zakat penghasilan adalah setara dengan 85 gram emas per tahun
                  </p>
                </div>

                {/* Income Input */}
                <div className="space-y-4">
                  <h3 className="font-medium border-b pb-2 dark:text-white dark:border-gray-600">Penghasilan</h3>
                  
                  <FormField
                    control={form.control}
                    name="monthlyIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-white">Penghasilan Bulanan (IDR)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          />
                        </FormControl>
                        <FormDescription className="dark:text-gray-400">
                          Gaji, pendapatan dari usaha, dan penghasilan rutin lainnya per bulan
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="otherIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-white">Penghasilan Lainnya per Bulan (IDR)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          />
                        </FormControl>
                        <FormDescription className="dark:text-gray-400">
                          Bonus, dividen, royalti, atau penghasilan tidak rutin (dirata-rata per bulan)
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Expenses Input */}
                <div className="space-y-4">
                  <h3 className="font-medium border-b pb-2 dark:text-white dark:border-gray-600">Pengeluaran</h3>
                  
                  <FormField
                    control={form.control}
                    name="monthlyExpenses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="dark:text-white">Pengeluaran Pokok Bulanan (IDR)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field} 
                            className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                          />
                        </FormControl>
                        <FormDescription className="dark:text-gray-400">
                          Kebutuhan pokok, hutang, dan pengeluaran wajib lainnya per bulan
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full bg-zakat-green hover:bg-zakat-light-green dark:bg-green-600 dark:hover:bg-green-500">
                  <Calculator className="mr-2 h-4 w-4" />
                  Hitung Zakat
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Hasil Perhitungan Zakat</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Detail perhitungan zakat penghasilan Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Penghasilan Bersih per Bulan</Label>
                  <p className="text-lg font-semibold dark:text-white">{formatCurrency(calculationResult.monthlyNetIncome)}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Penghasilan Bersih per Tahun</Label>
                  <p className="text-lg font-semibold dark:text-white">{formatCurrency(calculationResult.annualNetIncome)}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Nisab (85 gram emas)</Label>
                  <p className="text-lg font-semibold dark:text-white">{formatCurrency(calculationResult.nisab)}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Status</Label>
                  <p className={`text-lg font-semibold ${calculationResult.eligibleForZakat ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {calculationResult.eligibleForZakat ? 'Wajib Zakat' : 'Belum Wajib Zakat'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-100 mb-2">Jumlah Zakat yang Harus Dikeluarkan</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(calculationResult.zakatAmount)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-300 mt-2">
                  2.5% dari penghasilan bersih per tahun
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button
              onClick={handleDownloadPdf}
              className="flex-1 bg-zakat-green hover:bg-zakat-light-green dark:bg-green-600 dark:hover:bg-green-500"
            >
              <Download className="mr-2 h-4 w-4" />
              Unduh PDF
            </Button>
            <Button
              onClick={resetCalculation}
              variant="outline"
              className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Hitung Ulang
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ZakatPenghasilanCalculator;
