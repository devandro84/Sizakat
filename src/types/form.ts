export interface FormData {
  headOfFamily: string;
  familyCount: number;
  rtNumber: string;
  rwNumber: string;
  infaqAmount: number;
  infaqAmount2: number;
  mosqueInfaqAmount: number;
  paymentMethod: 'cash' | 'rice';
  cashAmount: number;
  riceAmount: number;
  paymentDate: string;
  collectorName: string;
}