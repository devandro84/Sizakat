// Types
export interface DonorRecord {
  id?: string;
  headOfFamily: string;
  familyCount: number;
  rtNumber: string;
  rwNumber?: string;
  cashAmount: number;
  riceAmount: number;
  infaqAmount: number;
  infaqAmount2: number;
  mosqueInfaqAmount: number;
  paymentDate: string;
  paymentTime: string;
  paymentMethod: 'cash' | 'rice';
  paymentType: string;
  zakatAmount: number;
  collectorName?: string;
}

export interface RecipientRecord {
  id?: string;
  name: string;
  category: string;
  rtNumber: string;
  rwNumber?: string;
  familyCount: number;
  receivedAmount: number;
  receivedDate: string;
  notes?: string;
  cashAmount: number;
  riceAmount: number;
}

export interface SettingsData {
  mosqueName: string;
  address: string;
  rtNumbers: string[];
  rwNumbers: string[];
  committeeMembers: Array<{
    id?: number;
    name: string;
    position: string;
    phoneNumber: string;
  }>;
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

// Local Storage Keys
const DONORS_KEY = 'zakatDonors';
const RECIPIENTS_KEY = 'zakatRecipients';
const SETTINGS_KEY = 'zakatSettings';

// Default Settings
const defaultSettings: SettingsData = {
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
  }
};

// Initialize Database
export const initializeDatabase = (): void => {
  // Check if settings exist, if not create default settings
  if (!localStorage.getItem(SETTINGS_KEY)) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  }
  
  // Initialize donors array if it doesn't exist
  if (!localStorage.getItem(DONORS_KEY)) {
    localStorage.setItem(DONORS_KEY, JSON.stringify([]));
  }
  
  // Initialize recipients array if it doesn't exist
  if (!localStorage.getItem(RECIPIENTS_KEY)) {
    localStorage.setItem(RECIPIENTS_KEY, JSON.stringify([]));
  }
};

// Database Functions
export const getDonors = (): DonorRecord[] => {
  const donors = localStorage.getItem(DONORS_KEY);
  return donors ? JSON.parse(donors) : [];
};

export const getRecipients = (): RecipientRecord[] => {
  const recipients = localStorage.getItem(RECIPIENTS_KEY);
  return recipients ? JSON.parse(recipients) : [];
};

export const getSettings = (): SettingsData => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings ? JSON.parse(settings) : defaultSettings;
};

export const addDonor = (donor: DonorRecord): DonorRecord => {
  const donors = getDonors();
  const newDonor = { ...donor, id: Date.now().toString() };
  donors.push(newDonor);
  localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
  return newDonor;
};

export const addRecipient = (recipient: RecipientRecord): RecipientRecord => {
  const recipients = getRecipients();
  const newRecipient = { ...recipient, id: Date.now().toString() };
  recipients.push(newRecipient);
  localStorage.setItem(RECIPIENTS_KEY, JSON.stringify(recipients));
  return newRecipient;
};

export const updateSettings = (settings: SettingsData): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const updateDonor = (donor: DonorRecord): void => {
  const donors = getDonors();
  const index = donors.findIndex(d => d.id === donor.id);
  if (index !== -1) {
    donors[index] = donor;
    localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
  }
};

export const deleteDonor = (donorId: string): void => {
  const donors = getDonors();
  const updatedDonors = donors.filter(donor => donor.id !== donorId);
  localStorage.setItem(DONORS_KEY, JSON.stringify(updatedDonors));
};

export const updateRecipient = (recipient: RecipientRecord): void => {
  const recipients = getRecipients();
  const index = recipients.findIndex(r => r.id === recipient.id);
  if (index !== -1) {
    recipients[index] = recipient;
    localStorage.setItem(RECIPIENTS_KEY, JSON.stringify(recipients));
  }
};

export const deleteRecipient = (recipientId: string): void => {
  const recipients = getRecipients();
  const updatedRecipients = recipients.filter(recipient => recipient.id !== recipientId);
  localStorage.setItem(RECIPIENTS_KEY, JSON.stringify(updatedRecipients));
};