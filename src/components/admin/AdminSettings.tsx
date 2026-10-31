import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building,
  Save,
  Shield,
  CreditCard,
  Bell,
  CheckCircle,
  FileText,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { company, updateCompany, addToast } = useApp();

  const [name, setName] = useState(company.name || 'ApexCloud Solutions Pvt Ltd');
  const [legalEntity, setLegalEntity] = useState(company.legalEntity || 'ApexCloud Technology Services India Private Limited');
  const [taxId, setTaxId] = useState(company.taxId || '27AABCA1234F1Z8');
  const [email, setEmail] = useState(company.email || 'billing@apexcloud.in');
  const [phone, setPhone] = useState(company.phone || '+91 22 4589 7700');
  const [address, setAddress] = useState(company.address || 'Peninsula Business Park, Lower Parel');
  const [city, setCity] = useState(company.city || 'Mumbai');
  const [state, setState] = useState(company.state || 'Maharashtra');
  const [postalCode, setPostalCode] = useState(company.postalCode || '400013');
  const [gracePeriodDays, setGracePeriodDays] = useState(company.gracePeriodDays || 5);
  const [autoRetryAttempts, setAutoRetryAttempts] = useState(company.autoRetryAttempts || 3);
  const [invoicePrefix, setInvoicePrefix] = useState(company.invoicePrefix || 'INV-2026');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompany({
      name,
      legalEntity,
      taxId,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      gracePeriodDays,
      autoRetryAttempts,
      invoicePrefix,
    });
    addToast({ title: 'Company Settings Saved', message: 'All changes synchronized.', type: 'success' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Organization & Billing Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage legal entity credentials, GSTIN registration, billing retry parameters, and invoice prefixes.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Legal Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-sm">Company Legal Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Legal Corporate Entity</label>
              <input
                type="text"
                required
                value={legalEntity}
                onChange={(e) => setLegalEntity(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">GSTIN (Indian Tax ID)</label>
              <input
                type="text"
                required
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Billing Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Billing Phone Line</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Registered Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City & State</label>
              <input
                type="text"
                value={`${city}, ${state}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setCity(parts[0]?.trim() || '');
                  setState(parts[1]?.trim() || '');
                }}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Billing & Dunning Automation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">Recurring Billing & Dunning Rules</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Grace Period (Days)</label>
              <input
                type="number"
                min={0}
                max={30}
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Days before service is suspended</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Auto-Retry Attempts</label>
              <input
                type="number"
                min={1}
                max={5}
                value={autoRetryAttempts}
                onChange={(e) => setAutoRetryAttempts(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Failed mandate retry count</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Invoice Number Prefix</label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-indigo-500/20"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Format: {invoicePrefix}-XXXX</span>
            </div>
          </div>
        </div>

        {/* Currency & Tax Localization */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-sm">Currency & India GST Localization</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Operating Currency</label>
              <input
                type="text"
                disabled
                value="Indian Rupee (INR - ₹)"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-semibold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Integrated GST Rate</label>
              <input
                type="text"
                disabled
                value="18% Standard SaaS GST"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
