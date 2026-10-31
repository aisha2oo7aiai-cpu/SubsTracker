import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Quotation, QuotationStatus } from '../../types';
import { formatINR, formatDate, getStatusBadge } from '../../utils/formatters';
import { geminiApi } from '../../services/api';
import {
  FileSpreadsheet,
  Plus,
  Sparkles,
  CheckCircle2,
  Calendar,
  X,
  FileCheck,
  Send,
  Loader2,
  ArrowRight,
  Eye,
  Trash2,
} from 'lucide-react';

export const AdminQuotations: React.FC = () => {
  const {
    quotations,
    customers,
    services,
    plans,
    addQuotation,
    updateQuotationStatus,
    convertQuotation,
    addToast,
    searchQuery,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);

  // Form states for creating quotation
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [planId, setPlanId] = useState(plans[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [validDays, setValidDays] = useState(30);
  const [notes, setNotes] = useState('Standard enterprise payment terms: 15 days from invoice issuance.');

  // AI Proposal Pitch generator modal
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitchText, setPitchText] = useState('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [pitchTargetQuote, setPitchTargetQuote] = useState<Quotation | null>(null);

  const filteredQuotes = quotations.filter((q) => {
    const matchStatus = statusFilter === 'all' || q.status === statusFilter;
    const s = searchQuery.toLowerCase();
    const matchSearch =
      q.quotationNumber.toLowerCase().includes(s) ||
      q.customerName.toLowerCase().includes(s) ||
      q.companyName.toLowerCase().includes(s);
    return matchStatus && matchSearch;
  });

  const availablePlans = plans.filter((p) => p.serviceId === serviceId);
  const selectedPlan = plans.find((p) => p.id === planId) || availablePlans[0] || plans[0];
  const unitPrice = selectedPlan ? selectedPlan.price : 4999;
  const subtotal = unitPrice * quantity;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = Math.round(taxableAmount * 0.18); // 18% GST
  const totalAmount = taxableAmount + taxAmount;

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === customerId);
    const service = services.find((s) => s.id === serviceId);

    const validDate = new Date();
    validDate.setDate(validDate.getDate() + validDays);

    await addQuotation({
      customerId,
      customerName: customer?.name || 'Enterprise Client',
      customerEmail: customer?.email || 'client@enterprise.com',
      companyName: customer?.companyName || 'Corporate Client',
      items: [
        {
          serviceId,
          serviceName: service?.name || 'Cloud Service',
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          quantity,
          unitPrice,
          totalPrice: subtotal,
        },
      ],
      subtotal,
      discountAmount,
      taxRate: 18,
      taxAmount,
      totalAmount,
      validityDate: validDate.toISOString().split('T')[0],
      status: 'sent',
      notes,
      assignedStaffName: customer?.assignedStaffName || 'Priya Sharma',
    });

    setShowCreateModal(false);
  };

  const handleGenerateAiPitch = async (quote: Quotation) => {
    setPitchTargetQuote(quote);
    setIsGeneratingPitch(true);
    setShowPitchModal(true);
    const primaryItem = quote.items[0];
    try {
      const generated = await geminiApi.generatePitch(
        quote.customerName,
        primaryItem?.serviceName || 'Cloud Enterprise Suite',
        primaryItem?.planName || 'Enterprise Tier',
        primaryItem?.unitPrice || 19999
      );
      setPitchText(generated);
    } catch (e) {
      setPitchText('Failed to generate pitch. Please try again.');
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const handleConvert = async (quoteId: string) => {
    await convertQuotation(quoteId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Commercial Quotations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create multi-tier price proposals, craft AI sales pitches, and convert accepted quotes into active subscriptions.
          </p>
        </div>
        <button
          onClick={() => {
            setServiceId(services[0]?.id || '');
            setPlanId(plans[0]?.id || '');
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(['all', 'draft', 'sent', 'accepted', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredQuotes.length}</span> Quotations
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Quotation ID</th>
                <th className="py-3.5 px-6">Customer & Entity</th>
                <th className="py-3.5 px-6">Proposed Items</th>
                <th className="py-3.5 px-6">Validity Window</th>
                <th className="py-3.5 px-6 text-right">Total with GST</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredQuotes.map((q) => {
                const badge = getStatusBadge(q.status);
                const item = q.items[0];
                return (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Quotation ID */}
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                      {q.quotationNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-slate-900 leading-snug">{q.customerName}</p>
                      <p className="text-[11px] text-slate-500">{q.companyName}</p>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-6">
                      <p className="font-semibold text-slate-900">{item?.serviceName}</p>
                      <p className="text-[11px] text-indigo-600 font-medium">
                        {item?.planName} (Qty: {item?.quantity})
                      </p>
                    </td>

                    {/* Validity */}
                    <td className="py-3.5 px-6">
                      <span className="font-medium text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Valid till {formatDate(q.validityDate)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Created {formatDate(q.createdAt)}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-6 text-right font-extrabold text-slate-900 font-mono">
                      {formatINR(q.totalAmount)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                        <span className={`w-1 h-1 rounded-full ${badge.dot}`}></span>
                        {badge.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Gemini AI Pitch Generator Button */}
                        <button
                          onClick={() => handleGenerateAiPitch(q)}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1"
                          title="Generate Sales Pitch via Gemini"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>AI Pitch</span>
                        </button>

                        {/* Convert to Subscription Button */}
                        {q.status !== 'accepted' && (
                          <button
                            onClick={() => handleConvert(q.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors flex items-center gap-1"
                          >
                            <FileCheck className="w-3 h-3" />
                            <span>Convert</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* GEMINI SALES PITCH PROPOSAL MODAL */}
      {showPitchModal && pitchTargetQuote && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Gemini Sales Proposal Pitch</h3>
                  <p className="text-[11px] text-slate-500">
                    Drafted for {pitchTargetQuote.customerName} ({pitchTargetQuote.companyName})
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPitchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 overflow-y-auto flex-1 text-xs text-slate-700 space-y-4">
              {isGeneratingPitch ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="font-semibold text-slate-900">Crafting Corporate Pitch Proposal...</p>
                  <p className="text-slate-500 text-xs">Formulating SLA assurances, pricing justification, and ROI points...</p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-line font-sans leading-relaxed text-slate-800">
                  {pitchText}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Model: gemini-3.8-flash</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pitchText);
                    addToast({ title: 'Pitch copied to clipboard!', type: 'success' });
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setShowPitchModal(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE QUOTATION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Generate New Sales Quotation</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Line</label>
                  <select
                    value={serviceId}
                    onChange={(e) => {
                      setServiceId(e.target.value);
                      const matchingPlans = plans.filter((p) => p.serviceId === e.target.value);
                      if (matchingPlans.length > 0) setPlanId(matchingPlans[0].id);
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subscription Plan Tier</label>
                  <select
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  >
                    {availablePlans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatINR(p.price)}/mo)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity (Seats/Nodes)</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Special Discount %</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Validity (Days)</label>
                  <input
                    type="number"
                    min={7}
                    max={90}
                    value={validDays}
                    onChange={(e) => setValidDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Financial Calculation Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({quantity} unit × {formatINR(unitPrice)}):</span>
                  <span className="font-semibold text-slate-800">{formatINR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({discountPercent}%):</span>
                    <span className="font-semibold">-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>GST (18% Integrated Tax):</span>
                  <span className="font-semibold text-slate-800">{formatINR(taxAmount)}</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Quotation Grand Total:</span>
                  <span className="text-indigo-600 font-extrabold">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Terms & Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Generate & Send Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
