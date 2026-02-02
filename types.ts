
export interface PaymentFormData {
  country: string;
  state: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  email: string;
  fullName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  isConfirmed: boolean;
}

export enum FormStatus {
  IDLE = 'IDLE',
  SUBMITTING = 'SUBMITTING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
