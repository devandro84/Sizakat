import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { bluetoothPrinter } from '../utils/bluetoothPrinter';
import { Loader2, Bluetooth, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface BluetoothPrinterModalProps {
  onClose: () => void;
}

export function BluetoothPrinterModal({ onClose }: BluetoothPrinterModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [connectedPrinter, setConnectedPrinter] = useState(bluetoothPrinter.getConnectedPrinter());
  const { toast } = useToast();

  useEffect(() => {
    // Check for connected printer on mount
    const printer = bluetoothPrinter.getConnectedPrinter();
    if (printer) {
      setConnectedPrinter(printer);
    }
  }, []);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const printer = await bluetoothPrinter.requestDevice();
      if (printer) {
        const connected = await bluetoothPrinter.connect(printer);
        if (connected) {
          setConnectedPrinter(printer);
          toast({
            title: 'Printer Terhubung',
            description: `Berhasil terhubung ke ${printer.name}`,
          });
        } else {
          toast({
            title: 'Gagal Terhubung',
            description: 'Tidak dapat terhubung ke printer. Silakan coba lagi.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat mencari printer bluetooth.',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await bluetoothPrinter.disconnect();
      setConnectedPrinter(null);
      toast({
        title: 'Printer Terputus',
        description: 'Printer bluetooth telah terputus.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memutuskan koneksi printer.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-[350px] dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5" />
            Printer Bluetooth
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>
          Hubungkan printer thermal bluetooth untuk mencetak struk
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectedPrinter ? (
          <div className="p-4 border rounded-lg dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium dark:text-white">{connectedPrinter.name}</h4>
                <p className="text-sm text-green-600 dark:text-green-400">Terhubung</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDisconnect}
              >
                Putuskan
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Tidak ada printer yang terhubung
            </p>
            <Button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mencari Printer...
                </>
              ) : (
                'Cari Printer'
              )}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500 dark:text-gray-400">
        Pastikan printer bluetooth Anda sudah dinyalakan dan dalam mode pairing
      </CardFooter>
    </Card>
  );
}