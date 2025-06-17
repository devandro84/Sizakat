import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/utils/database';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  minInfaqAmount: number;
  minMosqueInfaqAmount: number;
  minBaznasInfaqAmount: number;
  pin?: string;
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

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
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
    minInfaqAmount: 10000,
    minMosqueInfaqAmount: 5000,
    minBaznasInfaqAmount: 5000,
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

    // Simpan pengaturan dengan mempertahankan receiptSettings yang ada
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
    onClose();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <ScrollArea className="h-full w-full">
          <DialogHeader>
            <DialogTitle>Pengaturan Aplikasi</DialogTitle>
            <DialogDescription>
              Kelola pengaturan aplikasi zakat
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Tabs defaultValue="mosque" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="mosque">Data Masjid</TabsTrigger>
                <TabsTrigger value="committee">Panitia Zakat</TabsTrigger>
                <TabsTrigger value="zakat">Nilai Zakat</TabsTrigger>
                <TabsTrigger value="distribution">Distribusi</TabsTrigger>
                <TabsTrigger value="security">Keamanan</TabsTrigger>
              </TabsList>

              <TabsContent value="mosque" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Masjid</CardTitle>
                    <CardDescription>Informasi dasar masjid</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Daftar RW</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Nomor RW"
                              value={newRWNumber}
                              onChange={(e) => setNewRWNumber(e.target.value)}
                            />
                            <Button 
                              onClick={() => {
                                if (newRWNumber) {
                                  setSettings({
                                    ...settings,
                                    rwNumbers: [...settings.rwNumbers, newRWNumber]
                                  });
                                  setNewRWNumber('');
                                }
                              }} 
                              className="shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {settings.rwNumbers.map((rw) => (
                              <div
                                key={rw}
                                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1"
                              >
                                <span>RW {rw}</span>
                                <button
                                  onClick={() => {
                                    setSettings({
                                      ...settings,
                                      rwNumbers: settings.rwNumbers.filter((number) => number !== rw)
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Daftar RT</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Nomor RT"
                              value={newRTNumber}
                              onChange={(e) => setNewRTNumber(e.target.value)}
                            />
                            <Button onClick={handleAddRT} className="shrink-0">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {settings.rtNumbers.map((rt) => (
                              <div
                                key={rt}
                                className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1"
                              >
                                <span>RT {rt}</span>
                                <button
                                  onClick={() => handleRemoveRT(rt)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="committee" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Panitia Zakat</CardTitle>
                    <CardDescription>Kelola data panitia zakat</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="memberName">Nama Panitia</Label>
                        <Input
                          id="memberName"
                          value={newCommitteeMember.name}
                          onChange={(e) =>
                            setNewCommitteeMember({
                              ...newCommitteeMember,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Jabatan</Label>
                        <Input
                          id="position"
                          value={newCommitteeMember.position}
                          onChange={(e) =>
                            setNewCommitteeMember({
                              ...newCommitteeMember,
                              position: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                        <Input
                          id="phoneNumber"
                          value={newCommitteeMember.phoneNumber}
                          onChange={(e) =>
                            setNewCommitteeMember({
                              ...newCommitteeMember,
                              phoneNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddCommitteeMember} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Panitia
                    </Button>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      {settings.committeeMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                        >
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-500">
                              {member.position}
                            </p>
                            <p className="text-sm text-gray-500">
                              {member.phoneNumber}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveCommitteeMember(member.id!)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="zakat" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Nilai Zakat & Infaq</CardTitle>
                    <CardDescription>Atur nilai zakat dan infaq minimal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cashZakat">Zakat Fitrah (Uang)</Label>
                        <Input
                          id="cashZakat"
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
                        <Label htmlFor="riceZakat">Zakat Fitrah (Beras/Kg)</Label>
                        <Input
                          id="riceZakat"
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
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minMosqueInfaq">Infaq/Sodaqoh Masjid</Label>
                        <Input
                          id="minMosqueInfaq"
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
                        <Label htmlFor="minBaznasInfaq">Infaq/Sodaqoh BAZNAS</Label>
                        <Input
                          id="minBaznasInfaq"
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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="distribution" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Aturan Distribusi</CardTitle>
                    <CardDescription>Atur persentase distribusi zakat</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fakirMiskin">Fakir Miskin (%)</Label>
                        <Input
                          id="fakirMiskin"
                          type="number"
                          value={settings.distributionRules.fakirMiskin}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              distributionRules: {
                                ...settings.distributionRules,
                                fakirMiskin: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fiSabilillah">Fi Sabilillah (%)</Label>
                        <Input
                          id="fiSabilillah"
                          type="number"
                          value={settings.distributionRules.fiSabilillah}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              distributionRules: {
                                ...settings.distributionRules,
                                fiSabilillah: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amilinDKM">Amilin DKM (%)</Label>
                        <Input
                          id="amilinDKM"
                          type="number"
                          value={settings.distributionRules.amilinDKM}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              distributionRules: {
                                ...settings.distributionRules,
                                amilinDKM: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amilinDesa">Amilin Desa (%)</Label>
                        <Input
                          id="amilinDesa"
                          type="number"
                          value={settings.distributionRules.amilinDesa}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              distributionRules: {
                                ...settings.distributionRules,
                                amilinDesa: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amilinKecamatan">Amilin Kecamatan (%)</Label>
                        <Input
                          id="amilinKecamatan"
                          type="number"
                          value={settings.distributionRules.amilinKecamatan}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              distributionRules: {
                                ...settings.distributionRules,
                                amilinKecamatan: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pengaturan PIN</CardTitle>
                    <CardDescription>Atur PIN untuk keamanan aplikasi</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {settings.pin ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="currentPin">PIN Saat Ini</Label>
                            <Input
                              id="currentPin"
                              type="password"
                              maxLength={6}
                              placeholder="Masukkan PIN saat ini"
                              value={currentPin}
                              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pin">PIN Baru (6 digit)</Label>
                            <Input
                              id="pin"
                              type="password"
                              maxLength={6}
                              placeholder="Masukkan PIN baru"
                              value={settings.pin}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  pin: e.target.value.replace(/\D/g, '').slice(0, 6)
                                })
                              }
                              disabled={!currentPin || currentPin !== localStorage.getItem('userPin')}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="pin">PIN Baru (6 digit)</Label>
                          <Input
                            id="pin"
                            type="password"
                            maxLength={6}
                            placeholder="Masukkan PIN baru"
                            value={settings.pin || ''}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                pin: e.target.value.replace(/\D/g, '').slice(0, 6)
                              })
                            }
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPin">Konfirmasi PIN</Label>
                        <Input
                          id="confirmPin"
                          type="password"
                          maxLength={6}
                          placeholder="Masukkan PIN kembali"
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        />
                        {settings.pin && confirmPin && settings.pin !== confirmPin && (
                          <p className="text-sm text-red-500">
                            PIN tidak cocok
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          PIN akan digunakan untuk login ke aplikasi. Pastikan untuk mengingat PIN Anda.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button onClick={handleSaveSettings} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;