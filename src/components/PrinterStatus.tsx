import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { Printer, Bluetooth, Usb, RefreshCw, X } from 'lucide-react';
import { printerManager } from '@/utils/printerManager';

interface PrinterStatusProps {
  onPrinterConnected?: () => void;
}

interface PrinterState {
  connected: boolean;
  name: string;
  type: 'bluetooth' | 'usb' | null;
}

const PrinterStatus: React.FC<PrinterStatusProps> = ({ onPrinterConnected }) => {
  const [printerState, setPrinterState] = useState<PrinterState>({
    connected: false,
    name: '',
    type: null
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePrinterStatus = (event: CustomEvent) => {
      const { status, printer } = event.detail;
      setPrinterState({
        connected: status === 'connected',
        name: printer.name,
        type: printer.type
      });
      setError(status === 'error' ? 'Terjadi kesalahan pada printer' : null);
      if (status === 'connected' && onPrinterConnected) {
        onPrinterConnected();
      }
    };

    window.addEventListener('printer-status' as any, handlePrinterStatus);
    return () => {
      window.removeEventListener('printer-status' as any, handlePrinterStatus);
    };
  }, [onPrinterConnected]);

  const connectPrinter = async (type: 'bluetooth' | 'usb') => {
    try {
      setIsConnecting(true);
      setError(null);
      const success = await printerManager.connectPrinter(type);
      if (!success) {
        setError(`Gagal menghubungkan printer ${type}`);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectPrinter = () => {
    printerManager.disconnect();
    setPrinterState({
      connected: false,
      name: '',
      type: null
    });
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-white">
          <Printer className="h-5 w-5" />
          Status Printer
        </CardTitle>
        <CardDescription className="dark:text-gray-300">
          {printerState.connected
            ? `Terhubung ke ${printerState.name}`
            : 'Pilih jenis printer untuk menyambungkan'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={printerState.type === 'bluetooth' ? 'default' : 'outline'}
            className={`flex items-center justify-center gap-2 ${printerState.type === 'bluetooth' ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
            onClick={() => connectPrinter('bluetooth')}
            disabled={isConnecting || (printerState.connected && printerState.type !== 'bluetooth')}
          >
            <Bluetooth className="h-4 w-4" />
            Bluetooth
          </Button>

          <Button
            variant={printerState.type === 'usb' ? 'default' : 'outline'}
            className={`flex items-center justify-center gap-2 ${printerState.type === 'usb' ? 'bg-green-500 hover:bg-green-600' : ''}`}
            onClick={() => connectPrinter('usb')}
            disabled={isConnecting || (printerState.connected && printerState.type !== 'usb')}
          >
            <Usb className="h-4 w-4" />
            USB
          </Button>
        </div>

        {printerState.connected && (
          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              {printerState.type === 'bluetooth' ? (
                <Bluetooth className="h-4 w-4 text-blue-500" />
              ) : (
                <Usb className="h-4 w-4 text-green-500" />
              )}
              <span className="text-sm font-medium dark:text-white">{printerState.name}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => connectPrinter(printerState.type!)}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
                onClick={disconnectPrinter}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrinterStatus;