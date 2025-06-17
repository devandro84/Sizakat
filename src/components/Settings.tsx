import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getSettings, updateSettings, SettingsData } from '@/utils/database';
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
  Separator,
  Textarea,
} from '@/components/ui';
import { Save, Upload, Download, Plus, Trash } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsData>(getSettings());
  const { register, handleSubmit, setValue, watch } = useForm<SettingsData>({
    defaultValues: settings
  });

  useEffect(() => {
    const currentSettings = getSettings();
    setSettings(currentSettings);
    Object.entries(currentSettings).forEach(([key, value]) => {
      setValue(key as keyof SettingsData, value);
    });
  }, [setValue]);

  const onSubmit = (data: SettingsData) => {
    try {
      updateSettings(data);
      setSettings(data);
      toast({
        title: "Pengaturan berhasil disimpan",
        description: "Semua perubahan telah disimpan dengan sukses",
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan pengaturan",
        description: "Terjadi kesalahan saat menyimpan pengaturan",
        variant: "destructive",
      });
    }
  };

  const handleAddCommitteeMember = () => {
    const currentMembers = watch('committeeMembers') || [];
    setValue('committeeMembers', [...currentMembers, { name: '', position: '', phoneNumber: '' }]);
  };

  const handleRemoveCommitteeMember = (index: number) => {
    const currentMembers = watch('committeeMembers') || [];
    setValue('committeeMembers', currentMembers.filter((_, i) => i !== index));
  };

  const handleAddRTRW = (type: 'rt' | 'rw') => {
    const currentNumbers = watch(type === 'rt' ? 'rtNumbers' : 'rwNumbers') || [];
    setValue(type === 'rt' ? 'rtNumbers' : 'rwNumbers', [...currentNumbers, '']);
  };

  const handleRemoveRTRW = (type: 'rt' | 'rw', index: number) => {
    const currentNumbers = watch(type === 'rt' ? 'rtNumbers' : 'rwNumbers') || [];
    setValue(type === 'rt' ? 'rtNumbers' : 'rwNumbers', currentNumbers.filter((_, i) => i !== index));
  };

  const handleQRISImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('qris.imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackupSettings = () => {
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sizakat-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const restoredSettings = JSON.parse(e.target?.result as string) as SettingsData;
          // Validasi struktur data
          if (!restoredSettings.mosqueName || !restoredSettings.address || 
              !Array.isArray(restoredSettings.rtNumbers) || !Array.isArray(restoredSettings.rwNumbers) || 
              !Array.isArray(restoredSettings.committeeMembers)) {
            throw new Error('Format data tidak valid');
          }
          updateSettings(restoredSettings);
          setSettings(restoredSettings);
          Object.entries(restoredSettings).forEach(([key, value]) => {
            setValue(key as keyof SettingsData, value);
          });
          toast({
            title: "Pengaturan berhasil dipulihkan",
            description: "Semua pengaturan telah dipulihkan dari file backup",
          });
        } catch (error) {
          toast({
            title: "Gagal memulihkan pengaturan",
            description: "Format file backup tidak valid",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs defaultValue="masjid" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto gap-1">
          <TabsTrigger value="masjid">Masjid</TabsTrigger>
          <TabsTrigger value="pengurus">Pengurus</TabsTrigger>
          <TabsTrigger value="pembayaran">Pembayaran</TabsTrigger>
          <TabsTrigger value="struk">Struk</TabsTrigger>
        </TabsList>

        <TabsContent value="masjid" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Masjid</CardTitle>
              <CardDescription>Pengaturan informasi dasar masjid</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mosqueName">Nama Masjid</Label>
                <Input
                  id="mosqueName"
                  placeholder="Masukkan nama masjid"
                  {...register('mosqueName')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  placeholder="Masukkan alamat masjid"
                  {...register('address')}
                />
              </div>

              {/* RT Numbers */}
              <div className="space-y-2">
                <Label>Daftar RT</Label>
                <div className="space-y-2">
                  {watch('rtNumbers')?.map((rt, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Nomor RT"
                        value={rt}
                        onChange={(e) => {
                          const newRTs = [...(watch('rtNumbers') || [])];
                          newRTs[index] = e.target.value;
                          setValue('rtNumbers', newRTs);
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveRTRW('rt', index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddRTRW('rt')}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Tambah RT
                  </Button>
                </div>
              </div>

              {/* RW Numbers */}
              <div className="space-y-2">
                <Label>Daftar RW</Label>
                <div className="space-y-2">
                  {watch('rwNumbers')?.map((rw, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Nomor RW"
                        value={rw}
                        onChange={(e) => {
                          const newRWs = [...(watch('rwNumbers') || [])];
                          newRWs[index] = e.target.value;
                          setValue('rwNumbers', newRWs);
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveRTRW('rw', index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddRTRW('rw')}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Tambah RW
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pengurus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Pengurus</CardTitle>
              <CardDescription>Pengaturan data pengurus/amil zakat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {watch('committeeMembers')?.map((member, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Pengurus {index + 1}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveCommitteeMember(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Nama Pengurus"
                      value={member.name}
                      onChange={(e) => {
                        const newMembers = [...(watch('committeeMembers') || [])];
                        newMembers[index] = { ...member, name: e.target.value };
                        setValue('committeeMembers', newMembers);
                      }}
                    />
                    <Input
                      placeholder="Jabatan"
                      value={member.position}
                      onChange={(e) => {
                        const newMembers = [...(watch('committeeMembers') || [])];
                        newMembers[index] = { ...member, position: e.target.value };
                        setValue('committeeMembers', newMembers);
                      }}
                    />
                    <Input
                      placeholder="Nomor Telepon"
                      value={member.phoneNumber}
                      onChange={(e) => {
                        const newMembers = [...(watch('committeeMembers') || [])];
                        newMembers[index] = { ...member, phoneNumber: e.target.value };
                        setValue('committeeMembers', newMembers);
                      }}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={handleAddCommitteeMember}
              >
                <Plus className="h-4 w-4 mr-2" /> Tambah Pengurus
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pembayaran" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pembayaran</CardTitle>
              <CardDescription>Pengaturan metode pembayaran</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Bank Transfer */}
              <div className="space-y-4">
                <h4 className="font-medium">Transfer Bank</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Nama Bank"
                    {...register('bankTransfer.bankName')}
                  />
                  <Input
                    placeholder="Nomor Rekening"
                    {...register('bankTransfer.accountNumber')}
                  />
                  <Input
                    placeholder="Atas Nama"
                    {...register('bankTransfer.accountHolder')}
                  />
                </div>
              </div>

              <Separator />

              {/* QRIS */}
              <div className="space-y-4">
                <h4 className="font-medium">QRIS</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Nama Merchant"
                    {...register('qris.merchantName')}
                  />
                  <div className="space-y-2">
                    <Label>Kode QRIS</Label>
                    {watch('qris.imageUrl') && (
                      <div className="mb-2">
                        <img
                          src={watch('qris.imageUrl')}
                          alt="QRIS Code"
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleQRISImageUpload}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="struk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Struk</CardTitle>
              <CardDescription>Kustomisasi tampilan struk pembayaran</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="headerText">Teks Header</Label>
                <Input
                  id="headerText"
                  placeholder="Teks header struk"
                  {...register('receiptSettings.headerText')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerText">Teks Footer</Label>
                <Input
                  id="footerText"
                  placeholder="Teks footer struk"
                  {...register('receiptSettings.footerText')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleBackupSettings}>
            <Download className="h-4 w-4 mr-2" /> Backup
          </Button>
          <div className="relative">
            <Button type="button" variant="outline">
              <Upload className="h-4 w-4 mr-2" /> Restore
            </Button>
            <Input
              type="file"
              accept=".json"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleRestoreSettings}
            />
          </div>
        </div>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" /> Simpan Pengaturan
        </Button>
      </div>
    </form>
  );
};

export default Settings;