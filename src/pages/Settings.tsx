import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSettings, updateSettings } from '@/utils/database';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import panahIcon from '@/assets/icons/Panah.png';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, Save } from 'lucide-react';

interface CommitteeMember {
  id?: number;
  name: string;
  position: string;
  phoneNumber: string;
}

interface SettingsData {
  mosqueName: string;
  address: string;
  rtNumbers: string[];
  rwNumbers: string[];
  committeeMembers: CommitteeMember[];
  cashZakatAmount: number;
  riceZakatAmount: number;
  riceToMoneyConversion: number;
  minInfaqAmount: number;
  minMosqueInfaqAmount: number;
  minBaznasInfaqAmount: number;
  pin?: string;
  bankTransfer: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  qris: {
    imageUrl: string;
    merchantName: string;
  };
  distributionRules: {
    fakirMiskin: number;
    fiSabilillah: number;
    amilinDKM: number;
    amilinDesa: number;
    amilinKecamatan: number;
  };
  receiptSettings?: {
    headerText: string;
    footerText: string;
    fontSize: number;
    printerPort: string;
    paperWidth: number;
    printerType: 'thermal' | 'dot-matrix';
    marginLeft: number;
    marginRight: number;
    lineSpacing: number;
    characterSpacing: number;
    bluetoothPrinter?: {
      name: string;
      address: string;
      paired: boolean;
    };
    receiptTemplate: 'default' | 'modern' | 'classic' | 'minimalist';
    logo?: string;
  };
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPin, setCurrentPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [settings, setSettings] = useState<SettingsData>({
    mosqueName: '',
    address: '',
    rtNumbers: [],
    rwNumbers: [],
    committeeMembers: [],
    cashZakatAmount: 45000,
    riceZakatAmount: 2.5,
    riceToMoneyConversion: 15000,
    minInfaqAmount: 10000,
    minMosqueInfaqAmount: 5000,
    minBaznasInfaqAmount: 5000,
    bankTransfer: {
      bankName: '',
      accountNumber: '',
      accountHolder: ''
    },
    qris: {
      imageUrl: '',
      merchantName: ''
    },
    distributionRules: {
      fakirMiskin: 40,
      fiSabilillah: 30,
      amilinDKM: 15,
      amilinDesa: 10,
      amilinKecamatan: 5,
    },
  });
  const [newRTNumber, setNewRTNumber] = useState('');
  const [newRWNumber, setNewRWNumber] = useState('');
  const [newCommitteeMember, setNewCommitteeMember] = useState<CommitteeMember>({
    name: '',
    position: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const currentSettings = getSettings();
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, []);

  const handleQRISImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({
          ...settings,
          qris: {
            ...settings.qris,
            imageUrl: reader.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    if (settings.pin) {
      if (settings.pin.length !== 6) {
        toast({
          title: 'Error',
          description: 'PIN harus 6 digit',
          variant: 'destructive'
        });
        return;
      }

      if (settings.pin !== confirmPin) {
        toast({
          title: 'Error',
          description: 'PIN dan konfirmasi PIN tidak cocok',
          variant: 'destructive'
        });
        return;
      }

      if (localStorage.getItem('userPin') && currentPin !== localStorage.getItem('userPin')) {
        toast({
          title: 'Error',
          description: 'PIN saat ini tidak valid',
          variant: 'destructive'
        });
        return;
      }

      localStorage.setItem('userPin', settings.pin);
    }

    // Validasi nilai konversi beras ke uang
    if (settings.riceToMoneyConversion < 10000) {
      toast({
        title: 'Error',
        description: 'Nilai konversi beras ke uang minimal Rp 10.000',
        variant: 'destructive'
      });
      return;
    }

    const currentSettings = getSettings();
    updateSettings({
      ...settings,
      receiptSettings: currentSettings.receiptSettings || {
        headerText: '',
        footerText: '',
        fontSize: 12,
        printerPort: 'COM1',
        paperWidth: 58,
        printerType: 'thermal',
        marginLeft: 0,
        marginRight: 0,
        lineSpacing: 1,
        characterSpacing: 1,
        receiptTemplate: 'default',
        logo: ''
      }
    });
    toast({
      title: 'Pengaturan berhasil disimpan',
      description: 'Semua perubahan telah disimpan',
    });
  };

  const handleAddRT = () => {
    if (newRTNumber) {
      setSettings({
        ...settings,
        rtNumbers: [...settings.rtNumbers, newRTNumber],
      });
      setNewRTNumber('');
    }
  };

  const handleRemoveRT = (rt: string) => {
    setSettings({
      ...settings,
      rtNumbers: settings.rtNumbers.filter((number) => number !== rt),
    });
  };

  const handleAddRW = () => {
    if (newRWNumber) {
      setSettings({
        ...settings,
        rwNumbers: [...settings.rwNumbers, newRWNumber],
      });
      setNewRWNumber('');
    }
  };

  const handleRemoveRW = (rw: string) => {
    setSettings({
      ...settings,
      rwNumbers: settings.rwNumbers.filter((number) => number !== rw),
    });
  };

  const handleAddCommitteeMember = () => {
    if (newCommitteeMember.name && newCommitteeMember.position) {
      const newMember = {
        ...newCommitteeMember,
        id: settings.committeeMembers.length + 1,
      };
      setSettings({
        ...settings,
        committeeMembers: [...settings.committeeMembers, newMember],
      });
      setNewCommitteeMember({ name: '', position: '', phoneNumber: '' });
    }
  };

  const handleRemoveCommitteeMember = (id: number) => {
    setSettings({
      ...settings,
      committeeMembers: settings.committeeMembers.filter((member) => member.id !== id),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pattern-bg flex flex-col">
      <Header />
      <div className="flex-1 page-container py-4 px-3 sm:py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center mb-3 sm:mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <img src={panahIcon} alt="Kembali" className="h-4 sm:h-5 w-4 sm:w-5" />
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 dark:text-white capitalize tracking-tight">Pengaturan Aplikasi</h2>

        <div className="flex-1 w-full sm:max-w-4xl mx-auto flex flex-col">
          <Tabs defaultValue="general" className="flex-1 flex flex-col">
            <TabsList className="mb-4 flex overflow-x-auto space-x-1 p-1 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg">
              <TabsTrigger value="general" className="flex-shrink-0">Umum</TabsTrigger>
              <TabsTrigger value="committee" className="flex-shrink-0">Pengurus</TabsTrigger>
              <TabsTrigger value="amounts" className="flex-shrink-0">Nominal</TabsTrigger>
              <TabsTrigger value="payment" className="flex-shrink-0">Pembayaran</TabsTrigger>
              <TabsTrigger value="security" className="flex-shrink-0">Keamanan</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="general" className="mt-0">
                <Card className="border-0 sm:border shadow-none sm:shadow">
                  <CardHeader className="px-3 sm:px-6 py-4 sm:py-6">
                    <CardTitle className="text-lg sm:text-xl">Informasi Masjid</CardTitle>
                    <CardDescription className="text-sm">
                      Pengaturan informasi dasar masjid dan wilayah
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
                    <div className="space-y-2">
                      <Label htmlFor="mosqueName">Nama Masjid</Label>
                      <Input
                        id="mosqueName"
                        value={settings.mosqueName}
                        onChange={(e) =>
                          setSettings({ ...settings, mosqueName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Alamat</Label>
                      <Input
                        id="address"
                        value={settings.address}
                        onChange={(e) =>
                          setSettings({ ...settings, address: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>RT</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newRTNumber}
                          onChange={(e) => setNewRTNumber(e.target.value)}
                          placeholder="Nomor RT"
                        />
                        <Button onClick={handleAddRT}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {settings.rtNumbers.map((rt) => (
                          <div
                            key={rt}
                            className="flex items-center gap-1 bg-secondary p-1 rounded"
                          >
                            <span>RT {rt}</span>
                            <button
                              onClick={() => handleRemoveRT(rt)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>RW</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newRWNumber}
                          onChange={(e) => setNewRWNumber(e.target.value)}
                          placeholder="Nomor RW"
                        />
                        <Button onClick={handleAddRW}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {settings.rwNumbers.map((rw) => (
                          <div
                            key={rw}
                            className="flex items-center gap-1 bg-secondary p-1 rounded"
                          >
                            <span>RW {rw}</span>
                            <button
                              onClick={() => handleRemoveRW(rw)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="committee" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Panitia Zakat Fitrah</CardTitle>
                    <CardDescription>
                      Kelola data panitia zakat fitrah
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tambah Panitia</Label>
                      <div className="grid gap-2">
                        <Input
                          value={newCommitteeMember.name}
                          onChange={(e) =>
                            setNewCommitteeMember({
                              ...newCommitteeMember,
                              name: e.target.value,
                            })}
                          placeholder="Nama"
                        />
                        <Input
                          value={newCommitteeMember.position}
                          onChange={(e) =>
                            setNewCommitteeMember({
                              ...newCommitteeMember,
                              position: e.target.value,
                            })}
                          placeholder="Jabatan"
                        />
                        <Input
                          value={newCommitteeMember.phoneNumber}
                          onChange={(e) =>
                            setNewCommitteeMember({
                              ...newCommitteeMember,
                              phoneNumber: e.target.value,
                            })}
                          placeholder="Nomor Telepon"
                        />
                        <Button onClick={handleAddCommitteeMember}>
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Panitia
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Daftar Pengurus</Label>
                      <div className="grid gap-2">
                        {settings.committeeMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-2 bg-secondary rounded-lg border border-primary/20"
                          >
                            <div>
                              <div className="font-medium text-foreground">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.position}</div>
                            </div>
                            <button
                              onClick={() => handleRemoveCommitteeMember(member.id!)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amounts" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Nominal</CardTitle>
                    <CardDescription>
                      Pengaturan nominal zakat dan infaq
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashZakatAmount">Nominal Zakat Tunai</Label>
                      <Input
                        id="cashZakatAmount"
                        type="number"
                        value={settings.cashZakatAmount}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            cashZakatAmount: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="riceZakatAmount">Nominal Zakat Beras (kg)</Label>
                      <Input
                        id="riceZakatAmount"
                        type="number"
                        value={settings.riceZakatAmount}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            riceZakatAmount: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="riceToMoneyConversion">Nilai Konversi 1 Kg Beras ke Rupiah</Label>
                      <Input
                        id="riceToMoneyConversion"
                        type="number"
                        value={settings.riceToMoneyConversion}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            riceToMoneyConversion: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Label htmlFor="minInfaqAmount">Minimal Infaq</Label>
                      <Input
                        id="minInfaqAmount"
                        type="number"
                        value={settings.minInfaqAmount}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            minInfaqAmount: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minMosqueInfaqAmount">
                        Minimal Infaq Masjid
                      </Label>
                      <Input
                        id="minMosqueInfaqAmount"
                        type="number"
                        value={settings.minMosqueInfaqAmount}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            minMosqueInfaqAmount: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minBaznasInfaqAmount">
                        Minimal Infaq BAZNAS
                      </Label>
                      <Input
                        id="minBaznasInfaqAmount"
                        type="number"
                        value={settings.minBaznasInfaqAmount}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            minBaznasInfaqAmount: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Label>Aturan Distribusi</Label>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <span>Fakir Miskin</span>
                          <Input
                            type="number"
                            className="w-20"
                            value={settings.distributionRules.fakirMiskin}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                distributionRules: {
                                  ...settings.distributionRules,
                                  fakirMiskin: Number(e.target.value)
                                }
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Fi Sabilillah</span>
                          <Input
                            type="number"
                            className="w-20"
                            value={settings.distributionRules.fiSabilillah}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                distributionRules: {
                                  ...settings.distributionRules,
                                  fiSabilillah: Number(e.target.value)
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Amilin DKM</span>
                          <Input
                            type="number"
                            className="w-20"
                            value={settings.distributionRules.amilinDKM}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                distributionRules: {
                                  ...settings.distributionRules,
                                  amilinDKM: Number(e.target.value)
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Amilin Desa</span>
                          <Input
                            type="number"
                            className="w-20"
                            value={settings.distributionRules.amilinDesa}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                distributionRules: {
                                  ...settings.distributionRules,
                                  amilinDesa: Number(e.target.value)
                                },
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Amilin Kecamatan</span>
                          <Input
                            type="number"
                            className="w-20"
                            value={settings.distributionRules.amilinKecamatan}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                distributionRules: {
                                  ...settings.distributionRules,
                                  amilinKecamatan: Number(e.target.value)
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payment" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Metode Pembayaran</CardTitle>
                    <CardDescription>
                      Pengaturan metode pembayaran transfer bank dan QRIS
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Transfer Bank</Label>
                      <div className="grid gap-2">
                        <Input
                          placeholder="Nama Bank"
                          value={settings.bankTransfer.bankName}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              bankTransfer: {
                                ...settings.bankTransfer,
                                bankName: e.target.value,
                              },
                            })
                          }
                        />
                        <Input
                          placeholder="Nomor Rekening"
                          value={settings.bankTransfer.accountNumber}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              bankTransfer: {
                                ...settings.bankTransfer,
                                accountNumber: e.target.value,
                              },
                            })
                          }
                        />
                        <Input
                          placeholder="Nama Pemilik Rekening"
                          value={settings.bankTransfer.accountHolder}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              bankTransfer: {
                                ...settings.bankTransfer,
                                accountHolder: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <Label>QRIS</Label>
                      <div className="grid gap-2">
                        <div className="flex gap-4 items-center">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setSettings({
                                    ...settings,
                                    qris: {
                                      ...settings.qris,
                                      imageUrl: reader.result as string
                                    }
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          {settings.qris.imageUrl && (
                            <div className="relative w-24 h-24">
                              <img
                                src={settings.qris.imageUrl}
                                alt="QRIS Preview"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                        <Input
                          placeholder="Nama Merchant"
                          value={settings.qris.merchantName}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              qris: {
                                ...settings.qris,
                                merchantName: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Keamanan</CardTitle>
                    <CardDescription>
                      Pengaturan PIN dan keamanan aplikasi
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {localStorage.getItem('userPin') && (
                      <div className="space-y-2">
                        <Label htmlFor="currentPin">PIN Saat Ini</Label>
                        <Input
                          id="currentPin"
                          type="password"
                          maxLength={6}
                          value={currentPin}
                          onChange={(e) => setCurrentPin(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="newPin">PIN Baru</Label>
                      <Input
                        id="newPin"
                        type="password"
                        maxLength={6}
                        value={settings.pin || ''}
                        onChange={(e) =>
                          setSettings({ ...settings, pin: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPin">Konfirmasi PIN</Label>
                      <Input
                        id="confirmPin"
                        type="password"
                        maxLength={6}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;