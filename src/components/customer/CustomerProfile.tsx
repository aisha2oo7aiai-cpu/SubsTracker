import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Building,
  Mail,
  Phone,
  CreditCard,
  ShieldCheck,
  Save,
} from 'lucide-react';

export const CustomerProfile: React.FC = () => {
  const { currentUser, customers, updateCustomer, addToast } = useApp();

  const currentCust = customers.find((c) => c.id === currentUser.customerId) || customers[0];

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [companyName, setCompanyName] = useState(currentUser.companyName || currentCust?.companyName || '');
  const [phone, setPhone] = useState(currentUser.phone || currentCust?.phone || '+91 97654 32109');
  const [address, setAddress] = useState(currentCust?.address || 'B-702, Trade World, Senapati Bapat Marg, Lower Parel');
  const [city, setCity] = useState(currentCust?.city || 'Mumbai');
  const [state, setState] = useState(currentCust?.state || 'Maharashtra');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCust) {
      await updateCustomer(currentCust.id, {
        name,
        email,
        companyName,
        phone,
        address,
        city,
        state,
      });
      addToast({ title: 'Profile Updated', message: 'Your subscriber contact info has been saved.', type: 'success' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subscriber Account Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Update primary company contact info, GST tax registration address, and default payment mandates.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">Authorized Contact Representative</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Representative Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address (Invoices Sent Here)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Billing Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">GST Billing Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City, State</label>
              <input
                type="text"
                value={`${city}, ${state}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setCity(parts[0]?.trim() || '');
                  setState(parts[1]?.trim() || '');
                }}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Payment Mandate info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">Linked Auto-Debit Mandate</h2>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                UPI
              </div>
              <div>
                <p className="font-bold text-slate-900">HDFC Bank Corporate e-Mandate</p>
                <p className="text-[11px] text-slate-500">Auto-debits authorized up to ₹1,00,000 / cycle</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> ACTIVE MANDATE
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
