import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Label,
  Separator,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
} from '@/components/ui';
import { Plus, Trash2, Save, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Add type definition for jsPDF with autoTable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface TabunganKurban {
  id: string;
  nama: string;
  alamat: string;
  targetHewan: 'kambing' | 'sapi';
  targetNominal: number;
  terkumpul: number;
  tanggalMulai: string;
  kelompokSapi?: string;
  periodeSetoran: 'harian' | 'mingguan' | 'bulanan' | 'sekali';
  nominalPerSetoran: number;
  catatanSetoran: Array<{
    tanggal: string;
    nominal: number;
    keterangan?: string;
  }>;
  targetSelesai: string;
  anggotaKelompok?: Array<{
    nama: string;
    nominal: number;
  }>;
}

const Tabungan = () => {
  const { toast } = useToast();
  const [tabunganList, setTabunganList] = useState<TabunganKurban[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [newTabungan, setNewTabungan] = useState<Partial<TabunganKurban>>({
    targetHewan: 'kambing',
    targetNominal: 3000000,
    terkumpul: 0,
    tanggalMulai: new Date().toISOString().split('T')[0],
    periodeSetoran: 'sekali',
    nominalPerSetoran: 3000000,
    targetSelesai: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    catatanSetoran: [],
  });
  const [setoran, setSetoran] = useState({
    nominal: 0,
    keterangan: '',
    periodeSetoran: 'sekali' as 'harian' | 'mingguan' | 'bulanan' | 'sekali',
  });

  useEffect(() => {
    const savedTabungan = localStorage.getItem('tabunganKurban');
    if (savedTabungan) {
      setTabunganList(JSON.parse(savedTabungan));
    }
  }, []);

  const handleTargetHewanChange = (hewan: 'kambing' | 'sapi') => {
    const defaultNominal = {
      kambing: 3000000,
      sapi: 3500000,
    }[hewan];

    setNewTabungan({
      ...newTabungan,
      targetHewan: hewan,
      targetNominal: defaultNominal,
      nominalPerSetoran: defaultNominal,
    });
  };

  const handleAddTabungan = () => {
    if (!newTabungan.nama || !newTabungan.alamat) {
      toast({
        title: 'Error',
        description: 'Nama dan alamat peserta harus diisi',
        variant: 'destructive',
      });
      return;
    }

    if (newTabungan.targetHewan === 'sapi') {
      const sapiGroups = tabunganList.filter(t => t.targetHewan === 'sapi' && t.kelompokSapi);
      const availableGroup = sapiGroups.find(g => {
        const groupMembers = tabunganList.filter(t => t.kelompokSapi === g.kelompokSapi);
        return groupMembers.length < 7;
      });

      if (availableGroup) {
        newTabungan.kelompokSapi = availableGroup.kelompokSapi;
      } else {
        newTabungan.kelompokSapi = `sapi-${Date.now()}`;
      }
    }

    const newData: TabunganKurban = {
      id: Date.now().toString(),
      nama: newTabungan.nama!,
      alamat: newTabungan.alamat || '',
      targetHewan: newTabungan.targetHewan!,
      targetNominal: newTabungan.targetNominal!,
      terkumpul: newTabungan.periodeSetoran === 'sekali' ? newTabungan.targetNominal! : 0,
      tanggalMulai: newTabungan.tanggalMulai!,
      periodeSetoran: newTabungan.periodeSetoran!,
      nominalPerSetoran: newTabungan.nominalPerSetoran!,
      targetSelesai: newTabungan.targetSelesai!,
      catatanSetoran: newTabungan.periodeSetoran === 'sekali' ? [
        {
          tanggal: new Date().toISOString().split('T')[0],
          nominal: newTabungan.targetNominal!,
          keterangan: 'Pembayaran Sekali'
        }
      ] : [],
    };

    const updatedList = [...tabunganList, newData];
    setTabunganList(updatedList);
    localStorage.setItem('tabunganKurban', JSON.stringify(updatedList));

    setNewTabungan({
      targetHewan: 'kambing',
      targetNominal: 3000000,
      terkumpul: 0,
      tanggalMulai: new Date().toISOString().split('T')[0],
      catatanSetoran: [],
    });

    toast({
      title: 'Berhasil',
      description: 'Tabungan kurban berhasil ditambahkan',
    });
  };

  const handleDeleteTabungan = (tabunganId: string) => {
    const updatedList = tabunganList.filter((item) => item.id !== tabunganId);
    setTabunganList(updatedList);
    localStorage.setItem('tabunganKurban', JSON.stringify(updatedList));
    toast({
      title: 'Berhasil',
      description: 'Tabungan kurban berhasil dihapus',
    });
  };

  const handleEditTabungan = (tabunganId: string) => {
    const tabungan = tabunganList.find((item) => item.id === tabunganId);
    if (tabungan) {
      setEditMode(tabunganId);
      setNewTabungan({
        ...tabungan,
      });
    }
  };

  const handleSaveEdit = () => {
    if (!newTabungan.nama) {
      toast({
        title: 'Error',
        description: 'Nama peserta harus diisi',
        variant: 'destructive',
      });
      return;
    }

    const updatedList = tabunganList.map((item) =>
      item.id === editMode
        ? {
            ...item,
            nama: newTabungan.nama!,
            targetHewan: newTabungan.targetHewan!,
            targetNominal: newTabungan.targetNominal!,
          }
        : item
    );

    setTabunganList(updatedList);
    localStorage.setItem('tabunganKurban', JSON.stringify(updatedList));
    setEditMode(null);
    setNewTabungan({
      targetHewan: 'kambing',
      targetNominal: 3000000,
      terkumpul: 0,
      tanggalMulai: new Date().toISOString().split('T')[0],
      catatanSetoran: [],
    });

    toast({
      title: 'Berhasil',
      description: 'Data tabungan berhasil diperbarui',
    });
  };

  const handleAddSetoran = (tabunganId: string) => {
    if (setoran.nominal <= 0) {
      toast({
        title: 'Error',
        description: 'Nominal setoran harus lebih dari 0',
        variant: 'destructive',
      });
      return;
    }

    const updatedList = tabunganList.map((item) => {
      if (item.id === tabunganId) {
        const newTerkumpul = item.terkumpul + setoran.nominal;
        const targetTercapai = newTerkumpul >= item.targetNominal && item.terkumpul < item.targetNominal;
        
        if (targetTercapai) {
          toast({
            title: 'Selamat!',
            description: `Target tabungan kurban ${item.nama} telah tercapai!`,
            variant: 'default',
          });
        }

        return {
          ...item,
          terkumpul: newTerkumpul,
          catatanSetoran: [
            ...item.catatanSetoran,
            {
              tanggal: new Date().toISOString().split('T')[0],
              nominal: setoran.nominal,
              keterangan: setoran.keterangan,
            },
          ],
        };
      }
      return item;
    });

    setTabunganList(updatedList);
    localStorage.setItem('tabunganKurban', JSON.stringify(updatedList));
    setSetoran({ nominal: 0, keterangan: '', periodeSetoran: setoran.periodeSetoran });

    toast({
      title: 'Berhasil',
      description: 'Setoran berhasil ditambahkan',
    });
  };

  const handleDownloadPDF = (tabungan: TabunganKurban) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.text('Laporan Tabungan Kurban', 105, 15, { align: 'center' });
    
    // Informasi Peserta
    doc.setFontSize(12);
    doc.text(`Nama: ${tabungan.nama}`, 20, 30);
    doc.text(`Alamat: ${tabungan.alamat}`, 20, 37);
    doc.text(`Target Hewan: ${tabungan.targetHewan}`, 20, 44);
    doc.text(`Target Nominal: ${formatCurrency(tabungan.targetNominal)}`, 20, 51);
    doc.text(`Terkumpul: ${formatCurrency(tabungan.terkumpul)}`, 20, 58);
    doc.text(`Periode Setoran: ${tabungan.periodeSetoran}`, 20, 65);
    doc.text(`Nominal per Setoran: ${formatCurrency(tabungan.nominalPerSetoran)}`, 20, 72);
    
    // Tabel Riwayat Setoran
    doc.setFontSize(14);
    doc.text('Riwayat Setoran', 105, 85, { align: 'center' });
    
    const tableData = tabungan.catatanSetoran.map(setoran => [
      setoran.tanggal,
      formatCurrency(setoran.nominal),
      setoran.keterangan || '-'
    ]);
    
    let lastY = 90;
    doc.autoTable({
      startY: lastY,
      head: [['Tanggal', 'Nominal', 'Keterangan']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 },
      didDrawPage: function(data) {
        lastY = data.cursor.y;
      }
    });
    
    // Progress Bar
    const progress = (tabungan.terkumpul / tabungan.targetNominal) * 100;
    doc.setFontSize(12);
    doc.text(`Progress Tabungan: ${progress.toFixed(1)}%`, 20, lastY + 15);
    
    // Informasi Kelompok Sapi (jika ada)
    if (tabungan.targetHewan === 'sapi' && tabungan.kelompokSapi) {
      const groupMembers = tabunganList.filter(t => t.kelompokSapi === tabungan.kelompokSapi);
      doc.setFontSize(14);
      doc.text('Informasi Kelompok Sapi', 105, lastY + 30, { align: 'center' });
      
      const memberData = groupMembers.map(member => [
        member.nama,
        formatCurrency(member.terkumpul)
      ]);
      
      doc.autoTable({
        startY: lastY + 35,
        head: [['Nama Anggota', 'Total Setoran']],
        body: memberData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 }
      });
    }
    
    // Save PDF
    doc.save(`tabungan_kurban_${tabungan.nama}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: 'Berhasil',
      description: 'Laporan PDF berhasil diunduh',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tabungan Kurban</CardTitle>
        <CardDescription>
          Kelola tabungan kurban Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Peserta</Label>
              <Input
                id="nama"
                value={newTabungan.nama || ''}
                onChange={(e) => setNewTabungan({ ...newTabungan, nama: e.target.value })}
                placeholder="Masukkan nama peserta"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Input
                id="alamat"
                value={newTabungan.alamat || ''}
                onChange={(e) => setNewTabungan({ ...newTabungan, alamat: e.target.value })}
                placeholder="Masukkan alamat peserta"
              />
            </div>

            <div className="grid gap-2">
              <Label>Target Hewan Kurban</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={newTabungan.targetHewan === 'kambing' ? 'default' : 'outline'}
                  onClick={() => handleTargetHewanChange('kambing')}
                >
                  Kambing
                </Button>
                <Button
                  type="button"
                  variant={newTabungan.targetHewan === 'sapi' ? 'default' : 'outline'}
                  onClick={() => handleTargetHewanChange('sapi')}
                >
                  Sapi (1/7)
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Target Nominal</Label>
              <Input
                type="number"
                value={newTabungan.targetNominal}
                onChange={(e) => {
                  const nominal = Number(e.target.value);
                  setNewTabungan({
                    ...newTabungan,
                    targetNominal: nominal,
                    nominalPerSetoran: nominal
                  });
                }}
                placeholder="Masukkan target nominal"
              />
              {newTabungan.targetHewan === 'sapi' && (
                <p className="text-sm text-muted-foreground">
                  Anda akan bergabung dalam kelompok 7 orang untuk 1 ekor sapi
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Periode Setoran</Label>
              <RadioGroup
                value={newTabungan.periodeSetoran}
                onValueChange={(value: 'harian' | 'mingguan' | 'bulanan' | 'sekali') => {
                  const today = new Date();
                  const targetDate = new Date(today.setFullYear(today.getFullYear() + 1));
                  const nominalPerPeriode = {
                    harian: newTabungan.targetNominal! / 365,
                    mingguan: newTabungan.targetNominal! / 52,
                    bulanan: newTabungan.targetNominal! / 12,
                    sekali: newTabungan.targetNominal!
                  }[value];
                  
                  setNewTabungan({
                    ...newTabungan,
                    periodeSetoran: value,
                    nominalPerSetoran: Math.ceil(nominalPerPeriode),
                    targetSelesai: targetDate.toISOString().split('T')[0]
                  });
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="harian" id="harian" />
                  <Label htmlFor="harian">Harian</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mingguan" id="mingguan" />
                  <Label htmlFor="mingguan">Mingguan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bulanan" id="bulanan" />
                  <Label htmlFor="bulanan">Bulanan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sekali" id="sekali" />
                  <Label htmlFor="sekali">Sekali Bayar</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label>Nominal per Setoran</Label>
              <Input
                type="number"
                value={newTabungan.nominalPerSetoran}
                readOnly
                className="bg-gray-100 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div className="grid gap-2">
              <Label>Target Selesai</Label>
              <Input
                type="date"
                value={newTabungan.targetSelesai}
                onChange={(e) => setNewTabungan({ ...newTabungan, targetSelesai: e.target.value })}
              />
            </div>

            <Button onClick={handleAddTabungan} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tabungan
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Daftar Tabungan</h3>
            {tabunganList.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Belum ada tabungan kurban
              </div>
            ) : (
              <div className="grid gap-4">
                {tabunganList.map((tabungan) => (
                  <Card key={tabungan.id}>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <div>
                          <span>{tabungan.nama}</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {tabungan.alamat}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditTabungan(tabungan.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteTabungan(tabungan.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDownloadPDF(tabungan)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Target Hewan</p>
                            <p className="text-lg">{tabungan.targetHewan}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Progress</p>
                            <p className="text-lg">
                              {formatCurrency(tabungan.terkumpul)} / {formatCurrency(tabungan.targetNominal)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Tambah Setoran</Label>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Nominal setoran"
                              value={setoran.nominal}
                              onChange={(e) =>
                                setSetoran({
                                  ...setoran,
                                  nominal: Number(e.target.value),
                                })
                              }
                            />
                            <Input
                              placeholder="Keterangan"
                              value={setoran.keterangan}
                              onChange={(e) =>
                                setSetoran({
                                  ...setoran,
                                  keterangan: e.target.value,
                                })
                              }
                            />
                            <Button onClick={() => handleAddSetoran(tabungan.id)}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Riwayat Setoran</Label>
                          <ScrollArea className="h-32 rounded-md border">
                            <div className="p-4">
                              {tabungan.catatanSetoran.map((setoran, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center py-2"
                                >
                                  <div className="text-sm">
                                    <p>{setoran.tanggal}</p>
                                    <p className="text-gray-500">
                                      {setoran.keterangan || '-'}
                                    </p>
                                  </div>
                                  <p className="font-medium">
                                    {formatCurrency(setoran.nominal)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Tabungan;