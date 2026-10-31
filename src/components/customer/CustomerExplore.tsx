import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service, SubscriptionPlan } from '../../types';
import { formatINR } from '../../utils/formatters';
import { ServiceIcon } from '../shared/ServiceIcon';
import {
  Compass,
  Search,
  Filter,
  Check,
  Star,
  Layers,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  X,
  Sparkles,
} from 'lucide-react';

export const CustomerExplore: React.FC = () => {
  const { services, plans, currentUser, subscribeCustomer, setActiveTab, searchQuery } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Checkout Modal State
  const [subscribingPlan, setSubscribingPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI Autopay (BHIM / GPay)');
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = ['All', 'SaaS', 'Cloud', 'Streaming', 'Developer Tools', 'Productivity', 'Security', 'Fitness'];

  const filteredServices = services.filter((s) => {
    const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const activePlansForService = selectedService
    ? plans.filter((p) => p.serviceId === selectedService.id)
    : [];

  const handleConfirmSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribingPlan || !selectedService) return;

    setIsProcessing(true);
    try {
      const finalPrice =
        billingCycle === 'annual'
          ? Math.round(subscribingPlan.price * 0.8) // 20% annual discount
          : subscribingPlan.price;

      await subscribeCustomer({
        customerId: currentUser.customerId || 'cust-001',
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        serviceCategory: selectedService.category,
        planId: subscribingPlan.id,
        planName: subscribingPlan.name,
        billingCycle,
        amount: finalPrice,
        paymentMethod,
      });

      setSubscribingPlan(null);
      setSelectedService(null);
      setActiveTab('my_subscriptions');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Explore Services & Enterprise Catalog</h1>
        <p className="text-xs text-slate-500 mt-1">
          Select high-performance cloud compute, streaming suites, CRM tools, and security platforms.
        </p>
      </div>

      {/* Category filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedService(null);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid (When no specific service is focused) */}
      {!selectedService && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const servicePlans = plans.filter((p) => p.serviceId === service.id);
            const lowestPrice = servicePlans.length > 0 ? Math.min(...servicePlans.map((p) => p.price)) : 3999;
            return (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: service.brandColor }}
                    >
                      <ServiceIcon name={service.iconName} className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Starting from</span>
                    <p className="text-sm font-extrabold text-slate-900 font-mono">
                      {formatINR(lowestPrice)} <span className="text-[10px] font-normal text-slate-500">/ mo</span>
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1">
                    <span>Compare Plans</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PLAN COMPARISON VIEW (When a service is clicked) */}
      {selectedService && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs font-semibold"
              >
                ← Back to Catalog
              </button>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: selectedService.brandColor }}
              >
                <ServiceIcon name={selectedService.iconName} className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedService.name} Tiers</h2>
                <p className="text-xs text-slate-500">{selectedService.description}</p>
              </div>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  billingCycle === 'annual' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {activePlansForService.map((plan) => {
              const displayPrice =
                billingCycle === 'annual' ? Math.round(plan.price * 0.8) : plan.price;
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between relative transition-all ${
                    plan.isPopular
                      ? 'border-blue-600 ring-2 ring-blue-600/10 shadow-md'
                      : 'border-slate-200'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs">
                      Recommended
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-8 leading-snug">{plan.tagline}</p>

                    <div className="mt-5 pb-4 border-b border-slate-100">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-slate-900 font-mono">
                          {formatINR(displayPrice)}
                        </span>
                        <span className="text-xs text-slate-500">/ month</span>
                      </div>
                      {billingCycle === 'annual' && (
                        <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">
                          Billed annually (Save {formatINR(plan.price * 12 * 0.2)}/yr)
                        </span>
                      )}
                    </div>

                    <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSubscribingPlan(plan)}
                    className={`mt-8 w-full py-2.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                      plan.isPopular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    Subscribe to {plan.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {subscribingPlan && selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Confirm Subscription Onboarding</h3>
                <p className="text-[11px] text-slate-500">{selectedService.name}</p>
              </div>
              <button onClick={() => setSubscribingPlan(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubscription} className="py-4 space-y-4 text-xs">
              {/* Plan Summary Card */}
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1.5">
                <div className="flex justify-between items-center font-bold text-slate-900 text-sm">
                  <span>{subscribingPlan.name}</span>
                  <span className="font-mono text-blue-700">
                    {formatINR(billingCycle === 'annual' ? Math.round(subscribingPlan.price * 0.8) : subscribingPlan.price)}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{subscribingPlan.tagline}</p>
                <div className="pt-2 border-t border-blue-100 flex justify-between text-[11px] text-slate-600">
                  <span>Billing Interval:</span>
                  <span className="font-semibold capitalize text-slate-800">{billingCycle} Auto-Debit</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Select Payment Mandate / Channel
                </label>
                <div className="space-y-2">
                  {[
                    'UPI Autopay (BHIM / GPay / PhonePe)',
                    'Corporate Credit Card (Visa / Mastercard)',
                    'Net Banking (HDFC / ICICI / SBI Direct)',
                    'Auto-Debit NACH Mandate',
                  ].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        paymentMethod === method
                          ? 'border-blue-600 bg-blue-50/30 font-semibold text-blue-900'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-[11px] space-y-1">
                <p className="flex items-center gap-1 font-semibold text-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Instant Activation & Tax Invoice Generation
                </p>
                <p>
                  Upon confirmation, subscription code SUB-2026-XXX and official GST tax invoice INV-2026-XXXX will be registered in your account immediately.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubscribingPlan(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-xs"
                >
                  {isProcessing ? 'Activating...' : 'Confirm & Subscribe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
