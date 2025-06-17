import { DonorRecord } from './database';
import { createThermalReceipt } from './printUtils';

interface PrinterDevice {
  deviceId: string;
  name: string;
  type: 'bluetooth' | 'usb';
  connected: boolean;
}

class PrinterManager {
  private static instance: PrinterManager;
  private currentPrinter: PrinterDevice | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectInterval = 2000; // 2 detik
  private autoReconnectEnabled = true;

  private constructor() {}

  static getInstance(): PrinterManager {
    if (!PrinterManager.instance) {
      PrinterManager.instance = new PrinterManager();
    }
    return PrinterManager.instance;
  }

  // Inisialisasi Web Bluetooth
  private async initializeBluetooth(): Promise<boolean> {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }], // Printer service UUID
        optionalServices: ['battery_service']
      });

      const server = await device.gatt?.connect();
      if (!server) return false;

      this.currentPrinter = {
        deviceId: device.id,
        name: device.name || 'Unknown Printer',
        type: 'bluetooth',
        connected: true
      };

      device.addEventListener('gattserverdisconnected', () => {
        this.handleDisconnect();
      });

      return true;
    } catch (error) {
      console.error('Bluetooth initialization failed:', error);
      return false;
    }
  }

  // Inisialisasi Web USB
  private async initializeUSB(): Promise<boolean> {
    try {
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x0483 }] // Contoh Vendor ID untuk printer thermal
      });

      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      this.currentPrinter = {
        deviceId: device.serialNumber || '',
        name: device.productName || 'Unknown USB Printer',
        type: 'usb',
        connected: true
      };

      return true;
    } catch (error) {
      console.error('USB initialization failed:', error);
      return false;
    }
  }

  // Handle disconnect dan auto-reconnect
  private async handleDisconnect(): Promise<void> {
    if (this.currentPrinter) {
      this.currentPrinter.connected = false;
      this.dispatchPrinterEvent('disconnected', this.currentPrinter);

      if (this.autoReconnectEnabled && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.reconnect(), this.reconnectInterval);
      }
    }
  }

  // Mencoba reconnect ke printer
  private async reconnect(): Promise<void> {
    if (!this.currentPrinter) return;

    const success = this.currentPrinter.type === 'bluetooth' ?
      await this.initializeBluetooth() :
      await this.initializeUSB();

    if (success) {
      this.reconnectAttempts = 0;
      this.dispatchPrinterEvent('connected', this.currentPrinter);
    } else if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => this.reconnect(), this.reconnectInterval);
    }
  }

  // Event dispatcher untuk status printer
  private dispatchPrinterEvent(status: 'connected' | 'disconnected' | 'error', printer: PrinterDevice): void {
    const event = new CustomEvent('printer-status', {
      detail: { status, printer }
    });
    window.dispatchEvent(event);
  }

  // API Publik
  async connectPrinter(type: 'bluetooth' | 'usb'): Promise<boolean> {
    try {
      const success = type === 'bluetooth' ?
        await this.initializeBluetooth() :
        await this.initializeUSB();

      if (success) {
        this.dispatchPrinterEvent('connected', this.currentPrinter!);
      }

      return success;
    } catch (error) {
      console.error(`Failed to connect ${type} printer:`, error);
      return false;
    }
  }

  async printReceipt(donor: DonorRecord): Promise<boolean> {
    if (!this.currentPrinter?.connected) {
      throw new Error('Printer tidak terhubung');
    }

    try {
      const receiptContent = createThermalReceipt(donor);
      // Implementasi pengiriman data ke printer sesuai dengan jenis koneksi
      if (this.currentPrinter.type === 'bluetooth') {
        // Kirim data via Bluetooth
        // Implementasi detail tergantung pada protokol printer
      } else {
        // Kirim data via USB
        // Implementasi detail tergantung pada protokol printer
      }
      return true;
    } catch (error) {
      console.error('Print failed:', error);
      this.dispatchPrinterEvent('error', this.currentPrinter);
      return false;
    }
  }

  getCurrentPrinter(): PrinterDevice | null {
    return this.currentPrinter;
  }

  setAutoReconnect(enabled: boolean): void {
    this.autoReconnectEnabled = enabled;
  }

  disconnect(): void {
    if (this.currentPrinter) {
      // Implementasi disconnect sesuai jenis printer
      this.currentPrinter.connected = false;
      this.dispatchPrinterEvent('disconnected', this.currentPrinter);
      this.currentPrinter = null;
    }
  }
}

export const printerManager = PrinterManager.getInstance();