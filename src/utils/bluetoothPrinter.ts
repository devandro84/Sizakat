import { DonorRecord } from './database';
import { createThermalReceipt } from './printUtils';

interface BluetoothPrinter {
  deviceId: string;
  name: string;
  connected: boolean;
}

export class BluetoothPrinterManager {
  private static instance: BluetoothPrinterManager;
  private connectedPrinter: BluetoothPrinter | null = null;

  private constructor() {}

  static getInstance(): BluetoothPrinterManager {
    if (!BluetoothPrinterManager.instance) {
      BluetoothPrinterManager.instance = new BluetoothPrinterManager();
    }
    return BluetoothPrinterManager.instance;
  }

  async requestDevice(): Promise<BluetoothPrinter | null> {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['1812'] }, // Printer service UUID
          { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }, // Common thermal printer service
        ],
        optionalServices: ['battery_service']
      });

      const printer: BluetoothPrinter = {
        deviceId: device.id,
        name: device.name || 'Unknown Printer',
        connected: false
      };

      return printer;
    } catch (error) {
      console.error('Error requesting Bluetooth device:', error);
      return null;
    }
  }

  async connect(printer: BluetoothPrinter): Promise<boolean> {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: printer.name }]
      });

      const server = await device.gatt?.connect();
      if (!server) return false;

      // Get the printer service
      const service = await server.getPrimaryService('1812');
      if (!service) return false;

      this.connectedPrinter = {
        ...printer,
        connected: true
      };

      return true;
    } catch (error) {
      console.error('Error connecting to printer:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connectedPrinter) {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [{ name: this.connectedPrinter.name }]
        });
        if (device.gatt?.connected) {
          await device.gatt.disconnect();
        }
        this.connectedPrinter = null;
      } catch (error) {
        console.error('Error disconnecting printer:', error);
      }
    }
  }

  async printReceipt(donor: DonorRecord): Promise<boolean> {
    if (!this.connectedPrinter) {
      console.error('No printer connected');
      return false;
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: this.connectedPrinter.name }]
      });

      const server = await device.gatt?.connect();
      if (!server) return false;

      const service = await server.getPrimaryService('1812');
      const characteristic = await service.getCharacteristic('2A53');

      // Generate receipt content
      const receipt = createThermalReceipt(donor);
      const encoder = new TextEncoder();
      const data = encoder.encode(receipt);

      // Send data to printer
      await characteristic.writeValue(data);
      return true;
    } catch (error) {
      console.error('Error printing receipt:', error);
      return false;
    }
  }

  getConnectedPrinter(): BluetoothPrinter | null {
    return this.connectedPrinter;
  }
}

// Export singleton instance
export const bluetoothPrinter = BluetoothPrinterManager.getInstance();