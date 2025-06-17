
import React, { useState, useEffect } from 'react';
import { 
  getDonors, 
  getRecipients, 
  getSettings,
  updateDonor,
  deleteDonor,
  DonorRecord,
  RecipientRecord
} from '@/utils/database';
import { 
  getZakatSummary, 
  getRTSummary,
  getZakatDistribution,
  formatCurrency,
  formatRiceWeight
} from '@/utils/zakatUtils';
import { generateReportPdf, printThermalReceipt } from '@/utils/printUtils';
import { Printer, FileText, FileDown, Filter, Pencil, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem
} from '@/components/ui';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const { toast } = useToast();
  const [donors, setDonors] = useState<DonorRecord[]>([]);
  const [recipients, setRecipients] = useState<RecipientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('donations');
  const [rtFilter, setRtFilter] = useState('all');
  const [editingDonor, setEditingDonor] = useState<DonorRecord | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (donor: DonorRecord) => {
    setEditingDonor(donor);
    setShowEditModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const success = deleteDonor(id);
      if (success) {
        setDonors(donors.filter(d => d.id !== id));
        toast({
          title: 'Data berhasil dihapus',
          description: 'Data pembayaran zakat telah dihapus',
        });
      }
    }
  };
  
  const settings = getSettings();
  
  useEffect(() => {
    const fetchData = () => {
      const donorData = getDonors();
      const recipientData = getRecipients();
      setDonors(donorData);
      setRecipients(recipientData);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const summary = getZakatSummary(donors);
  const distribution = getZakatDistribution(donors);
  const rtSummary = getRTSummary(donors);
  
  const filteredDonors = rtFilter === 'all' 
    ? donors 
    : donors.filter(d => d.rtNumber === rtFilter);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDonor) {
      const updatedDonor = {
        ...editingDonor,
        headOfFamily: editingDonor.headOfFamily,
        familyCount: parseInt(editingDonor.familyCount.toString()),
        rtNumber: editingDonor.rtNumber,
        paymentMethod: editingDonor.paymentMethod,
        cashAmount: editingDonor.paymentMethod === 'cash' ? parseFloat(editingDonor.cashAmount.toString()) : 0,
        riceAmount: editingDonor.paymentMethod === 'rice' ? parseFloat(editingDonor.riceAmount.toString()) : 0,
        infaqAmount: parseFloat(editingDonor.infaqAmount.toString()),
        infaqAmount2: parseFloat(editingDonor.infaqAmount2.toString()),
        mosqueInfaqAmount: parseFloat(editingDonor.mosqueInfaqAmount?.toString() || '0')
      };
      
      const success = updateDonor(updatedDonor);
      if (success) {
        setDonors(donors.map(d => d.id === editingDonor.id ? updatedDonor : d));
        setShowEditModal(false);
        toast({
          title: 'Data berhasil diperbarui',
          description: 'Data pembayaran zakat telah diperbarui',
        });
      }
    }
  };

  const handleDownloadReport = () => {
    try {
      generateReportPdf(donors, rtSummary, distribution, 'download');
      toast({
        title: 'Laporan berhasil diunduh',
        description: 'File PDF laporan telah tersimpan',
      });
    } catch (error) {
      toast({
        title: 'Gagal mengunduh laporan',
        description: 'Terjadi kesalahan saat mengunduh laporan',
        variant: 'destructive'
      });
    }
  };

  const handlePrintReport = () => {
    try {
      generateReportPdf(donors, rtSummary, distribution, 'print');
      toast({
        title: 'Laporan sedang dicetak',
        description: 'Mohon tunggu proses pencetakan selesai',
      });
    } catch (error) {
      toast({
        title: 'Gagal mencetak laporan',
        description: 'Terjadi kesalahan saat mencetak laporan',
        variant: 'destructive'
      });
    }
  };
  
  if (loading) {
    return (
      <div className="page-container py-8">
        <div className="text-center">
          <p>Loading data...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container py-8">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Laporan Zakat Fitrah</h2>
          <p className="text-gray-500 dark:text-gray-400">Lihat dan cetak laporan zakat fitrah</p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0">
          <Button 
            variant="outline"
            className="gap-2"
            onClick={handleDownloadReport}
          >
            <FileDown className="h-4 w-4" />
            Download Laporan
          </Button>
          
          <Button 
            className="gap-2 bg-zakat-green hover:bg-zakat-light-green"
            onClick={handlePrintReport}
          >
            <Printer className="h-4 w-4" />
            Cetak Laporan
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Keluarga</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{summary.totalFamilies}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total {summary.totalIndividuals} jiwa</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Zakat Uang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(summary.totalCash)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dari {summary.cashDonors} keluarga</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Zakat Beras</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatRiceWeight(summary.totalRice)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Dari {summary.riceDonors} keluarga</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Infaq/Sodaqoh</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(summary.totalInfaqBaznas + summary.totalInfaqMasjid)}</p>
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Baznas: {formatCurrency(summary.totalInfaqBaznas)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Masjid: {formatCurrency(summary.totalInfaqMasjid)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Pembayaran</DialogTitle>
            <DialogDescription>
              Ubah data pembayaran zakat fitrah
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Kepala Keluarga</Label>
                <Input
                  value={editingDonor?.headOfFamily || ''}
                  onChange={(e) => setEditingDonor({...editingDonor, headOfFamily: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Jumlah Jiwa</Label>
                <Input
                  type="number"
                  min="1"
                  value={editingDonor?.familyCount || 1}
                  onChange={(e) => setEditingDonor({...editingDonor, familyCount: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label>RT</Label>
                <Select
                  value={editingDonor?.rtNumber}
                  onValueChange={(value) => setEditingDonor({...editingDonor, rtNumber: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih RT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {settings.rtNumbers.map(rt => (
                        <SelectItem key={rt} value={rt}>RT {rt}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Metode Pembayaran</Label>
                <RadioGroup
                  value={editingDonor?.paymentMethod}
                  onValueChange={(value: 'cash' | 'rice') => setEditingDonor({...editingDonor, paymentMethod: value})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash">Uang</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rice" id="rice" />
                    <Label htmlFor="rice">Beras</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Jumlah {editingDonor?.paymentMethod === 'cash' ? 'Uang' : 'Beras'}</Label>
                <Input
                  type="number"
                  min="0"
                  value={editingDonor?.paymentMethod === 'cash' ? editingDonor?.cashAmount : editingDonor?.riceAmount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (editingDonor?.paymentMethod === 'cash') {
                      setEditingDonor({...editingDonor, cashAmount: value});
                    } else {
                      setEditingDonor({...editingDonor, riceAmount: value});
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>Infaq Baznas</Label>
                <Input
                  type="number"
                  min="0"
                  value={editingDonor?.infaqAmount2 || 0}
                  onChange={(e) => setEditingDonor({...editingDonor, infaqAmount2: parseFloat(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label>Infaq Mesjid</Label>
                <Input
                  type="number"
                  min="0"
                  value={editingDonor?.mosqueInfaqAmount || 0}
                  onChange={(e) => setEditingDonor({...editingDonor, mosqueInfaqAmount: parseFloat(e.target.value)})}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Tabs for different reports */}
      <Tabs 
        defaultValue="donations" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="w-full sm:w-auto grid grid-cols-1 sm:flex sm:space-x-2">
          <TabsTrigger value="donations">Data Pembayaran</TabsTrigger>
          <TabsTrigger value="distribution">Distribusi Zakat</TabsTrigger>
          <TabsTrigger value="rt">Rekap Per-RT</TabsTrigger>
        </TabsList>
        
        {/* Donations Tab */}
        <TabsContent value="donations" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Pembayaran Zakat Fitrah</CardTitle>
              <CardDescription className="flex justify-between items-center">
                <span>Semua data pembayaran zakat fitrah</span>
                
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <Select 
                    defaultValue="all"
                    onValueChange={setRtFilter}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Pilih RT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">Semua RT</SelectItem>
                        {settings.rtNumbers.map(rt => (
                          <SelectItem key={rt} value={rt}>RT {rt}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-900 dark:text-gray-100">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 dark:text-gray-200">#</th>
                      <th className="px-4 py-3 dark:text-gray-200">Nama KK</th>
                      <th className="px-4 py-3 dark:text-gray-200">RT</th>
                      <th className="px-4 py-3 dark:text-gray-200">Aksi</th>
                      <th className="px-4 py-3 dark:text-gray-200">Jiwa</th>
                      <th className="px-4 py-3 dark:text-gray-200">Metode</th>
                      <th className="px-4 py-3 dark:text-gray-200">Zakat</th>
                      <th className="px-4 py-3 dark:text-gray-200">Infaq Baznas</th>
                      <th className="px-4 py-3 dark:text-gray-200">Infaq Masjid</th>
                      <th className="px-4 py-3 dark:text-gray-200">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="dark:text-gray-300">
                    {filteredDonors.length > 0 ? (
                      filteredDonors.map((donor, index) => (
                        <tr key={donor.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3">{donor.headOfFamily}</td>
                          <td className="px-4 py-3">RT {donor.rtNumber}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(donor)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(donor.id)}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => printThermalReceipt({...donor,
                                  headOfFamily: donor.headOfFamily,
                                  rtNumber: donor.rtNumber,
                                  rwNumber: settings.rwNumbers[0],
                                  familyCount: donor.familyCount,
                                  paymentMethod: donor.paymentMethod,
                                  paymentType: donor.paymentType || 'tunai',
                                  zakatAmount: donor.paymentMethod === 'cash' ? donor.cashAmount : donor.riceAmount,
                                  infaqAmount: donor.infaqAmount || 0,
                                  infaqAmount2: donor.infaqAmount2 || 0,
                                  collectorName: donor.collectorName || '-',
                                  paymentDate: donor.paymentDate,
                                  riceAmount: donor.paymentMethod === 'rice' ? donor.riceAmount : 0,
                                  cashAmount: donor.paymentMethod === 'cash' ? donor.cashAmount : 0
                                })}
                                className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700"
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="px-4 py-3">{donor.familyCount}</td>
                          <td className="px-4 py-3">
                            {donor.paymentMethod === 'cash' ? 'Uang' : 'Beras'}
                          </td>
                          <td className="px-4 py-3">
                            {donor.paymentMethod === 'cash' 
                              ? formatCurrency(donor.cashAmount)
                              : formatRiceWeight(donor.riceAmount)
                            }
                          </td>
                          <td className="px-4 py-3">{formatCurrency(donor.infaqAmount)}</td>
                          <td className="px-4 py-3">{formatCurrency(donor.mosqueInfaqAmount)}</td>
                          <td className="px-4 py-3">
                            {new Date(donor.paymentDate).toLocaleDateString('id-ID')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-4 py-3 text-center">
                          Tidak ada data pembayaran
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Distribution Tab */}
        <TabsContent value="distribution" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Zakat Fitrah</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Perhitungan distribusi zakat fitrah berdasarkan persentase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-900 dark:text-gray-100">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 dark:text-gray-200">Kategori</th>
                      <th className="px-4 py-3 dark:text-gray-200">Persentase</th>
                      <th className="px-4 py-3 dark:text-gray-200">Zakat Uang</th>
                      <th className="px-4 py-3 dark:text-gray-200">Zakat Beras</th>
                    </tr>
                  </thead>
                  <tbody className="dark:text-gray-300">
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3">Fakir Miskin</td>
                      <td className="px-4 py-3">75%</td>
                      <td className="px-4 py-3">{formatCurrency(distribution.fakirMiskin.cash)}</td>
                      <td className="px-4 py-3">{formatRiceWeight(distribution.fakirMiskin.rice)}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3">Amil DKM/RT/RW</td>
                      <td className="px-4 py-3">8%</td>
                      <td className="px-4 py-3">{formatCurrency(distribution.amilinDKM.cash)}</td>
                      <td className="px-4 py-3">{formatRiceWeight(distribution.amilinDKM.rice)}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3">Fi Sabilillah</td>
                      <td className="px-4 py-3">12.5%</td>
                      <td className="px-4 py-3">{formatCurrency(distribution.fiSabilillah.cash)}</td>
                      <td className="px-4 py-3">{formatRiceWeight(distribution.fiSabilillah.rice)}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3">Amil Desa</td>
                      <td className="px-4 py-3">2.5%</td>
                      <td className="px-4 py-3">{formatCurrency(distribution.amilinDesa.cash)}</td>
                      <td className="px-4 py-3">{formatRiceWeight(distribution.amilinDesa.rice)}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="px-4 py-3">Amil Kecamatan</td>
                      <td className="px-4 py-3">2%</td>
                      <td className="px-4 py-3">{formatCurrency(distribution.amilinKecamatan.cash)}</td>
                      <td className="px-4 py-3">{formatRiceWeight(distribution.amilinKecamatan.rice)}</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-800 font-bold dark:text-gray-200">
                      <td className="px-4 py-3">Total</td>
                      <td className="px-4 py-3">100%</td>
                      <td className="px-4 py-3">{formatCurrency(summary.totalCash)}</td>
                      <td className="px-4 py-3">{formatRiceWeight(summary.totalRice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* RT Summary Tab */}
        <TabsContent value="rt" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rekapitulasi Per-RT</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Rekap pengumpulan zakat fitrah berdasarkan RT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-900 dark:text-gray-100">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 dark:text-gray-200">RT</th>
                      <th className="px-4 py-3 dark:text-gray-200">Keluarga</th>
                      <th className="px-4 py-3 dark:text-gray-200">Jiwa</th>
                      <th className="px-4 py-3 dark:text-gray-200">Pembayar Uang</th>
                      <th className="px-4 py-3 dark:text-gray-200">Pembayar Beras</th>
                      <th className="px-4 py-3 dark:text-gray-200">Zakat Uang</th>
                      <th className="px-4 py-3 dark:text-gray-200">Zakat Beras</th>
                      <th className="px-4 py-3 dark:text-gray-200">Infaq Baznas</th>
                    <th className="px-4 py-3 dark:text-gray-200">Infaq Masjid</th>
                    </tr>
                  </thead>
                  <tbody className="dark:text-gray-300">
                    {rtSummary.map(rt => (
                      <tr key={rt.rtNumber} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3">RT {rt.rtNumber}</td>
                        <td className="px-4 py-3">{rt.totalFamilies}</td>
                        <td className="px-4 py-3">{rt.totalIndividuals}</td>
                        <td className="px-4 py-3">{rt.cashDonors}</td>
                        <td className="px-4 py-3">{rt.riceDonors}</td>
                        <td className="px-4 py-3">{formatCurrency(rt.totalCash)}</td>
                        <td className="px-4 py-3">{formatRiceWeight(rt.totalRice)}</td>
                        <td className="px-4 py-3">{formatCurrency(rt.totalInfaqBaznas)}</td>
                        <td className="px-4 py-3">{formatCurrency(rt.totalInfaqMasjid || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
