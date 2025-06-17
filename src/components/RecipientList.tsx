
import React, { useState, useEffect } from 'react';
import { 
  getRecipients, 
  addRecipient,
  updateRecipient,
  deleteRecipient,
  getSettings,
  RecipientRecord
} from '@/utils/database';
import * as XLSX from 'xlsx';
import { Download, Upload } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator
} from '@/components/ui';
import { Plus, Edit, Trash2, Save, Users } from 'lucide-react';
import { formatCurrency, formatRiceWeight } from '@/utils/zakatUtils';

const RecipientList = () => {
  const { toast } = useToast();
  const [recipients, setRecipients] = useState<RecipientRecord[]>([]);
  const [editingRecipient, setEditingRecipient] = useState<RecipientRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'fakir_miskin',
    rtNumber: '',
    cashAmount: 0,
    riceAmount: 0
  });
  
  const settings = getSettings();
  
  useEffect(() => {
    loadRecipients();
  }, []);
  
  const loadRecipients = () => {
    const data = getRecipients();
    setRecipients(data);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'fakir_miskin',
      rtNumber: settings.rtNumbers[0],
      cashAmount: 0,
      riceAmount: 0
    });
    setEditingRecipient(null);
  };
  
  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (recipient: RecipientRecord) => {
    setEditingRecipient(recipient);
    setFormData({
      name: recipient.name,
      category: recipient.category,
      rtNumber: recipient.rtNumber,
      cashAmount: recipient.cashAmount,
      riceAmount: recipient.riceAmount
    });
    setIsDialogOpen(true);
  };
  
  const handleSaveRecipient = () => {
    if (!formData.name) {
      toast({
        title: "Kesalahan",
        description: "Nama penerima wajib diisi",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editingRecipient) {
        // Update existing recipient
        const updatedRecipient = {
          ...editingRecipient,
          name: formData.name,
          category: formData.category as any,
          rtNumber: formData.rtNumber,
          cashAmount: parseFloat(formData.cashAmount as any) || 0,
          riceAmount: parseFloat(formData.riceAmount as any) || 0
        };
        
        updateRecipient(updatedRecipient);
        toast({
          title: "Berhasil",
          description: "Data penerima berhasil diperbarui"
        });
      } else {
        // Add new recipient
        const newRecipient = {
          name: formData.name,
          category: formData.category as any,
          rtNumber: formData.rtNumber,
          cashAmount: parseFloat(formData.cashAmount as any) || 0,
          riceAmount: parseFloat(formData.riceAmount as any) || 0
        };
        
        addRecipient(newRecipient);
        toast({
          title: "Berhasil",
          description: "Penerima baru berhasil ditambahkan"
        });
      }
      
      loadRecipients();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteRecipient = (id?: number) => {
    if (!id) return;
    
    try {
      deleteRecipient(id);
      loadRecipients();
      toast({
        title: "Berhasil",
        description: "Data penerima berhasil dihapus"
      });
    } catch (error) {
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan saat menghapus data",
        variant: "destructive"
      });
    }
  };
  
  const handleDownloadTemplate = () => {
    // Create template workbook
    const template = XLSX.utils.book_new();
    const templateData = [
      ['Nama', 'Kategori', 'RT', 'Jumlah Uang', 'Jumlah Beras'],
      ['Contoh: Ahmad', 'fakir_miskin', '01', '100000', '2.5']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    XLSX.utils.book_append_sheet(template, ws, 'Template');
    
    // Save template
    XLSX.writeFile(template, 'template-penerima-zakat.xlsx');
    
    toast({
      title: 'Template berhasil diunduh',
      description: 'Silakan isi template sesuai format yang ada'
    });
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Skip header row
          const recipients = jsonData.slice(1).map((row: any) => ({
            name: row[0],
            category: row[1],
            rtNumber: row[2],
            cashAmount: parseFloat(row[3]) || 0,
            riceAmount: parseFloat(row[4]) || 0
          }));

          // Validate and add recipients
          let successCount = 0;
          let errorCount = 0;

          for (const recipient of recipients) {
            if (recipient.name && recipient.category && recipient.rtNumber) {
              try {
                addRecipient(recipient);
                successCount++;
              } catch (error) {
                errorCount++;
              }
            } else {
              errorCount++;
            }
          }

          loadRecipients();
          toast({
            title: 'Import selesai',
            description: `Berhasil: ${successCount}, Gagal: ${errorCount}`,
            variant: successCount > 0 ? 'default' : 'destructive'
          });

        } catch (error) {
          toast({
            title: 'Gagal memproses file',
            description: 'Format file tidak sesuai',
            variant: 'destructive'
          });
        }
      };

      reader.readAsBinaryString(file);

    } catch (error) {
      toast({
        title: 'Gagal mengimpor data',
        description: 'Terjadi kesalahan saat mengimpor data',
        variant: 'destructive'
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'fakir_miskin': return 'Fakir Miskin';
      case 'fi_sabilillah': return 'Fi Sabilillah';
      case 'amilin_dkm': return 'Amil DKM';
      case 'amilin_rt': return 'Amil RT';
      case 'amilin_rw': return 'Amil RW';
      case 'amilin_desa': return 'Amil Desa';
      case 'amilin_kecamatan': return 'Amil Kecamatan';
      case 'pengumpul_zakat': return 'Pengumpul Zakat';
      case 'penyalur_zakat': return 'Penyalur Zakat';
      default: return category;
    }
  };
  
  return (
    <div className="page-container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Daftar Penerima Zakat</h2>
          <p className="text-gray-500 dark:text-gray-400">Kelola data penerima zakat (mustahik)</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            <label htmlFor="file-import" className="cursor-pointer">
              <Input
                id="file-import"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileImport}
              />
              <Button variant="outline" className="gap-2" asChild>
                <span>
                  <Upload className="h-4 w-4" />
                  Import Excel
                </span>
              </Button>
            </label>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={openAddDialog}>
                <Plus className="h-4 w-4" />
                Tambah Penerima
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="dark:text-white">
                {editingRecipient ? 'Edit Penerima' : 'Tambah Penerima Baru'}
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                {editingRecipient ? 'Edit data penerima zakat' : 'Tambahkan data penerima zakat baru'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="dark:text-white">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              
              <div>
                <Label htmlFor="category" className="dark:text-white">Kategori</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectGroup>
                      <SelectItem value="fakir">Fakir</SelectItem>
                      <SelectItem value="miskin">Miskin</SelectItem>
                      <SelectItem value="amilin_dkm">Amil DKM/RT/RW</SelectItem>
                      <SelectItem value="fi_sabilillah">Fi Sabilillah</SelectItem>
                      <SelectItem value="amilin_desa">Amil Desa</SelectItem>
                      <SelectItem value="amilin_kecamatan">Amil Kecamatan</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="rtNumber" className="dark:text-white">Nomor RT</Label>
                <Select
                  value={formData.rtNumber}
                  onValueChange={(value) => handleSelectChange('rtNumber', value)}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                    <SelectValue placeholder="Pilih RT" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectGroup>
                      {settings.rtNumbers.map(rt => (
                        <SelectItem key={rt} value={rt}>RT {rt}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="cashAmount" className="dark:text-white">Jumlah Uang (Rp)</Label>
                <Input
                  id="cashAmount"
                  name="cashAmount"
                  type="number"
                  value={formData.cashAmount}
                  onChange={handleInputChange}
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              
              <div>
                <Label htmlFor="riceAmount" className="dark:text-white">Jumlah Beras (Kg)</Label>
                <Input
                  id="riceAmount"
                  name="riceAmount"
                  type="number"
                  value={formData.riceAmount}
                  onChange={handleInputChange}
                  className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">
                Batal
              </Button>
              <Button onClick={handleSaveRecipient} className="gap-2">
                <Save className="h-4 w-4" />
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Data Penerima Zakat</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Daftar semua penerima zakat yang terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-900 dark:text-gray-100">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 dark:text-gray-200">#</th>
                  <th className="px-4 py-3 dark:text-gray-200">Nama</th>
                  <th className="px-4 py-3 dark:text-gray-200">RT</th>
                  <th className="px-4 py-3 dark:text-gray-200">Kategori</th>
                  <th className="px-4 py-3 dark:text-gray-200">Zakat Uang</th>
                  <th className="px-4 py-3 dark:text-gray-200">Zakat Beras</th>
                  <th className="px-4 py-3 dark:text-gray-200">Aksi</th>
                </tr>
              </thead>
              <tbody className="dark:text-gray-300">
                {recipients.length > 0 ? (
                  recipients.map((recipient, index) => (
                    <tr key={recipient.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{recipient.name}</td>
                      <td className="px-4 py-3">RT {recipient.rtNumber}</td>
                      <td className="px-4 py-3">{getCategoryLabel(recipient.category)}</td>
                      <td className="px-4 py-3">{formatCurrency(recipient.cashAmount)}</td>
                      <td className="px-4 py-3">{formatRiceWeight(recipient.riceAmount)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                            onClick={() => openEditDialog(recipient)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                            onClick={() => handleDeleteRecipient(recipient.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-3 text-center dark:text-gray-400">
                      Belum ada data penerima
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipientList;
