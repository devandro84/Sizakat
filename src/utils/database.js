// Types are converted to JSDoc comments for JavaScript compatibility

/**
 * @typedef {Object} DonorRecord
 * @property {string} [id]
 * @property {string} headOfFamily
 * @property {number} familyCount
 * @property {string} rtNumber
 * @property {string} [rwNumber]
 * @property {number} cashAmount
 * @property {number} riceAmount
 * @property {number} infaqAmount
 * @property {number} infaqAmount2
 * @property {number} mosqueInfaqAmount
 * @property {string} paymentDate
 * @property {string} paymentTime
 * @property {'cash' | 'rice'} paymentMethod
 * @property {string} paymentType
 * @property {number} zakatAmount
 * @property {string} [collectorName]
 */

/**
 * @typedef {Object} RecipientRecord
 * @property {string} [id]
 * @property {string} name
 * @property {string} category
 * @property {string} rtNumber
 * @property {string} [rwNumber]
 * @property {number} familyCount
 * @property {number} receivedAmount
 * @property {string} receivedDate
 * @property {string} [notes]
 * @property {number} cashAmount
 * @property {number} riceAmount
 */

/**
 * @typedef {Object} SettingsData
 * @property {string} mosqueName
 * @property {string} address
 * @property {string[]} rtNumbers
 * @property {string[]} rwNumbers
 * @property {Array<{id?: number, name: string, position: string, phoneNumber: string}>} committeeMembers
 * @property {number} cashZakatAmount
 * @property {number} riceZakatAmount
 * @property {number} riceToMoneyConversion
 * @property {number} minInfaqAmount
 * @property {number} minMosqueInfaqAmount
 * @property {number} minBaznasInfaqAmount
 * @property {string} [pin]
 * @property {{bankName: string, accountNumber: string, accountHolder: string}} bankTransfer
 * @property {{imageUrl: string, merchantName: string}} qris
 * @property {{fakirMiskin: number, fiSabilillah: number, amilinDKM: number, amilinDesa: number, amilinKecamatan: number}} distributionRules
 * @property {{headerText: string, footerText: string, fontSize: number, printerPort: string, paperWidth: number, printerType: 'thermal' | 'dot-matrix', marginLeft: number, marginRight: number, lineSpacing: number, characterSpacing: number, bluetoothPrinter?: {name: string, address: string, paired: boolean}, receiptTemplate: 'default' | 'modern' | 'classic' | 'minimalist', logo?: string}} [receiptSettings]
 */

// Local Storage Keys
const DONORS_KEY = 'zakatDonors';
const RECIPIENTS_KEY = 'zakatRecipients';
const SETTINGS_KEY = 'zakatSettings';

// Default Settings
/** @type {SettingsData} */
const defaultSettings = {
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
export const initializeDatabase = () => {
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
/**
 * @returns {DonorRecord[]}
 */
export const getDonors = () => {
  const donors = localStorage.getItem(DONORS_KEY);
  return donors ? JSON.parse(donors) : [];
};

/**
 * @returns {RecipientRecord[]}
 */
export const getRecipients = () => {
  const recipients = localStorage.getItem(RECIPIENTS_KEY);
  return recipients ? JSON.parse(recipients) : [];
};

/**
 * @returns {SettingsData}
 */
export const getSettings = () => {
  const settings = localStorage.getItem(SETTINGS_KEY);
  return settings ? JSON.parse(settings) : defaultSettings;
};

/**
 * @param {DonorRecord} donor
 * @returns {DonorRecord}
 */
export const addDonor = (donor) => {
  const donors = getDonors();
  const newDonor = { ...donor, id: Date.now().toString() };
  donors.push(newDonor);
  localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
  return newDonor;
};

/**
 * @param {RecipientRecord} recipient
 * @returns {RecipientRecord}
 */
export const addRecipient = (recipient) => {
  const recipients = getRecipients();
  const newRecipient = { ...recipient, id: Date.now().toString() };
  recipients.push(newRecipient);
  localStorage.setItem(RECIPIENTS_KEY, JSON.stringify(recipients));
  return newRecipient;
};

/**
 * @param {SettingsData} settings
 */
export const updateSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

/**
 * @param {DonorRecord} donor
 */
export const updateDonor = (donor) => {
  const donors = getDonors();
  const index = donors.findIndex(d => d.id === donor.id);
  if (index !== -1) {
    donors[index] = donor;
    localStorage.setItem(DONORS_KEY, JSON.stringify(donors));
  }
};

/**
 * @param {string} donorId
 */
export const deleteDonor = (donorId) => {
  const donors = getDonors();
  const updatedDonors = donors.filter(donor => donor.id !== donorId);
  localStorage.setItem(DONORS_KEY, JSON.stringify(updatedDonors));
};

/**
 * @param {RecipientRecord} recipient
 */
export const updateRecipient = (recipient) => {
  const recipients = getRecipients();
  const index = recipients.findIndex(r => r.id === recipient.id);
  if (index !== -1) {
    recipients[index] = recipient;
    localStorage.setItem(RECIPIENTS_KEY, JSON.stringify(recipients));
  }
};

/**
 * @param {string} recipientId
 */
export const deleteRecipient = (recipientId) => {
  const recipients = getRecipients();
  const updatedRecipients = recipients.filter(recipient => recipient.id !== recipientId);
  localStorage.setItem(RECIPIENTS_KEY, JSON.stringify(updatedRecipients));
};