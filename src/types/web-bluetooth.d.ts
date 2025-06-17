interface BluetoothDevice extends EventTarget {
  id: string;
  name: string | null;
  gatt?: BluetoothRemoteGATTServer;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

interface Navigator {
  bluetooth: {
    requestDevice(options: {
      filters: Array<{ services: string[] }>;
      optionalServices?: string[];
    }): Promise<BluetoothDevice>;
  };
  usb: {
    requestDevice(options: {
      filters: Array<{ vendorId: number }>;
    }): Promise<USBDevice>;
  };
}

interface USBDevice {
  serialNumber: string | null;
  productName: string | null;
  open(): Promise<void>;
  selectConfiguration(configurationValue: number): Promise<void>;
  claimInterface(interfaceNumber: number): Promise<void>;
}

interface Window {
  usb: {
    requestDevice(options: {
      filters: Array<{ vendorId: number }>;
    }): Promise<USBDevice>;
  };
}