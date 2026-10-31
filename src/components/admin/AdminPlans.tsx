import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionPlan, BillingCycle } from '../../types';
import { formatINR } from '../../utils/formatters';
import {
  Plus,
  Search,
  Filter,
  Check,
  Edit2,
  Trash2,
  Star,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
} from 'lucide-react';

export const AdminPlans: React.FC = () => {
  const { plans, services, addPlan, updatePlan, deletePlan, searchQuery } = useApp();

  const [selectedServiceId, setSelectedServiceId] = useState<string>('all');
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Multi-step Wizard State (Step 1, 2, 3)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [price, setPrice] = useState<number>(4999);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [featuresInput, setFeaturesInput] = useState<string>('99.95% Availability SLA\nDedicated Account Support\nAutomated Daily Backups');
  const [isPopular, setIsPopular] = useState(false);
  const [status, setStatus] = useState<'active' | 'archived'>('active');

  const filteredPlans = plans.filter((p) => {
    const matchService = selectedServiceId === 'all' || p.serviceId === selectedServiceId;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.features.some((f) => f.toLowerCase().includes(q));
    return matchService && matchSearch;
  });

  const openAddWizard = () => {
    setEditingPlan(null);
    setStep(1);
    setServiceId(services[0]?.id || '');
    setName('');
    setTagline('');
    setPrice(4999);
    setBillingCycle('monthly');
    setDiscountPercent(0);
    setFeaturesInput('99.95% SLA\n24/7 Priority Support\nAutomated Backups\nCustom API Integrations');
    setIsPopular(false);
    setStatus('active');
    setShowWizardModal(true);
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setStep(1);
    setServiceId(plan.serviceId);
    setName(plan.name);
    setTagline(plan.tagline);
    setPrice(plan.price);
    setBillingCycle(plan.billingCycle);
    setDiscountPercent(plan.discountPercent || 0);
    setFeaturesInput(plan.features.join('\n'));
    setIsPopular(!!plan.isPopular);
    setStatus(plan.status);
    setShowWizardModal(true);
  };

  const handleFinishWizard = async (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    if (editingPlan) {
      await updatePlan(editingPlan.id, {
        serviceId,
        name,
        tagline,
        price,
        billingCycle,
        discountPercent,
        features: featuresList,
        isPopular,
        status,
      });
    } else {
      await addPlan({
        serviceId,
        name,
        tagline,
        price,
        billingCycle,
        discountPercent,
        features: featuresList,
        isPopular,
        status,
      });
    }
    setShowWizardModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subscription Plans Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure multi-tier packaging, pricing formulas in INR (₹), and feature entitlement matrices.
          </p>
        </div>
        <button
          onClick={openAddWizard}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan (Wizard)</span>
        </button>
      </div>

      {/* Service Selector Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4 overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by Service:
          </span>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Services ({services.length})</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({plans.filter((p) => p.serviceId === s.id).length} Tiers)
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Showing <span className="font-bold text-slate-800">{filteredPlans.length}</span> active subscription tiers
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => {
          const service = services.find((s) => s.id === plan.serviceId);
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all relative ${
                plan.isPopular
                  ? 'border-indigo-600 ring-2 ring-indigo-600/10 shadow-md'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 right-6 bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Most Popular
                </div>
              )}

              <div>
                {/* Service Tag */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mb-3">
                  {service?.name || 'Enterprise Service'}
                </span>

                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-8">{plan.tagline}</p>

                {/* Pricing Display */}
                <div className="mt-5 pb-4 border-b border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono">
                      {formatINR(plan.price)}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">/ {plan.billingCycle}</span>
                  </div>
                  {plan.discountPercent ? (
                    <span className="text-[11px] font-bold text-emerald-600 mt-0.5 block">
                      Includes {plan.discountPercent}% Enterprise Discount
                    </span>
                  ) : null}
                </div>

                {/* Features List */}
                <div className="mt-4 space-y-2 text-xs text-slate-700">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">
                  <strong className="text-slate-900">{plan.subscriberCount}</strong> Subscribers
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Edit Plan"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-colors"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MULTI-STEP "CREATE NEW PLAN" WIZARD MODAL */}
      {showWizardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingPlan ? 'Edit Subscription Plan' : 'Plan Creator Wizard'}
                </h3>
              </div>
              <button onClick={() => setShowWizardModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wizard Step Progress Tracker */}
            <div className="py-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
              <div
                className={`flex items-center gap-2 ${
                  step === 1 ? 'text-indigo-600' : step > 1 ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold">1</span>
                <span>Basic Details</span>
              </div>
              <div className="w-8 h-px bg-slate-200"></div>
              <div
                className={`flex items-center gap-2 ${
                  step === 2 ? 'text-indigo-600' : step > 2 ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold">2</span>
                <span>Pricing & Cycle</span>
              </div>
              <div className="w-8 h-px bg-slate-200"></div>
              <div
                className={`flex items-center gap-2 ${
                  step === 3 ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold">3</span>
                <span>Features & Preview</span>
              </div>
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="py-4 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Service</label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Plan Tier Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Enterprise Apex / Growth Edition"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tagline / Value Proposition</label>
                  <input
                    type="text"
                    required
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Mission critical infrastructure with 99.99% SLA"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={!name || !tagline}
                    onClick={() => setStep(2)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    Continue to Pricing <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Pricing & Cycle */}
            {step === 2 && (
              <div className="py-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Billing Frequency</label>
                    <select
                      value={billingCycle}
                      onChange={(e) => setBillingCycle(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Discount % (Optional)</label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="popular-check"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="popular-check" className="font-semibold text-slate-700 cursor-pointer">
                    Highlight as "Most Popular" on comparison tables
                  </label>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    Continue to Features <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Features & Live Preview */}
            {step === 3 && (
              <form onSubmit={handleFinishWizard} className="py-4 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Features Included (One feature per line)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    placeholder="99.95% Availability SLA&#10;Dedicated Technical Support&#10;Private Cloud Gateways"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-[11px]"
                  />
                </div>

                {/* Mini Card Preview */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Live Preview
                  </span>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{name || 'Plan Name'}</h4>
                      <p className="text-slate-500 text-[11px]">{tagline}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-base font-mono">{formatINR(price)}</p>
                      <span className="text-[10px] text-slate-400 capitalize">/ {billingCycle}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                  >
                    {editingPlan ? 'Save Plan Updates' : 'Publish Plan'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
