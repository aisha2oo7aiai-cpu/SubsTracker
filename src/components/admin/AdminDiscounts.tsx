import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DiscountCoupon } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  Tag,
  Plus,
  Percent,
  CheckCircle,
  Clock,
  Sparkles,
  X,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export const AdminDiscounts: React.FC = () => {
  const { coupons, services, addCoupon, toggleCoupon } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(15);
  const [applicableServiceId, setApplicableServiceId] = useState('all');
  const [minPurchaseAmount, setMinPurchaseAmount] = useState(5000);
  const [maxUses, setMaxUses] = useState(50);
  const [validUntil, setValidUntil] = useState('2026-12-31');

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const service = services.find((s) => s.id === applicableServiceId);

    await addCoupon({
      code: code.toUpperCase().trim(),
      type,
      value,
      applicableServiceId,
      applicableServiceName: applicableServiceId === 'all' ? 'All Services' : service?.name,
      minPurchaseAmount,
      maxUses,
      validUntil,
      isActive: true,
    });

    setShowAddModal(false);
    setCode('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Promotions & Discount Codes</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure enterprise discount codes, promotional voucher thresholds, and campaign redemption limits.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
              coupon.isActive ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-base font-extrabold text-indigo-600 tracking-wider bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                  {coupon.code}
                </span>
                <button
                  onClick={() => toggleCoupon(coupon.id)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors ${
                    coupon.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${coupon.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {coupon.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-extrabold text-slate-900 font-mono">
                  {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `FLAT ${formatINR(coupon.value)} OFF`}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Applies to:{' '}
                  <strong className="text-slate-800">
                    {coupon.applicableServiceName || 'All Platform Services'}
                  </strong>
                </p>
              </div>

              {/* Usage Progress Bar */}
              <div className="mt-6 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Usage Redemptions</span>
                  <span className="font-bold text-slate-900">
                    {coupon.usedCount} / {coupon.maxUses}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (coupon.usedCount / coupon.maxUses) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Valid till {formatDate(coupon.validUntil)}
              </span>
              {coupon.minPurchaseAmount && (
                <span>Min: {formatINR(coupon.minPurchaseAmount)}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE COUPON MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Create Discount Coupon</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. DIWALI25, FESTIVE20"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {type === 'percentage' ? 'Percentage %' : 'Flat Value (₹)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Applicable Service</label>
                <select
                  value={applicableServiceId}
                  onChange={(e) => setApplicableServiceId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="all">All Services</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Redemptions</label>
                  <input
                    type="number"
                    min={1}
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
