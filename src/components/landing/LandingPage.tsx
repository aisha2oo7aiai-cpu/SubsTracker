import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TiltedGridHeroDemo } from '@/components/ui/tilted-grid-hero-demo';
import { RainbowButton } from '@/components/ui/rainbow-button';
import {
  ShieldCheck,
  CreditCard,
  Users,
  Repeat,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  TrendingUp,
  FileText,
  Lock,
  Check,
  ChevronRight,
  Shield,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setPortal, setAuthView, switchRole } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [heroTab, setHeroTab] = useState<'overview' | 'invoices' | 'ai'>('overview');

  const faqs = [
    {
      q: 'How does SubsTracker handle recurring payments in India?',
      a: 'SubsTracker natively supports RBI-compliant e-mandates across UPI Autopay, Net Banking, and Credit Cards with automated retry schedules and Indian Rupee (INR) tax invoicing with full GSTIN support.',
    },
    {
      q: 'Can we integrate with our existing backend or database?',
      a: 'Yes! SubsTracker features a completely decoupled architecture with a centralized API abstraction layer ready to interface directly with Python FastAPI, Node.js, or PostgreSQL Cloud SQL backends.',
    },
    {
      q: 'What role-based access control (RBAC) levels are provided?',
      a: 'Three dedicated workspace portals: Company Admin Portal for global financial oversight and service creation, Staff Portal for day-to-day customer management and quotation generation, and Customer Portal for self-service subscriber management.',
    },
    {
      q: 'Does SubsTracker support custom enterprise quotations and discount codes?',
      a: 'Yes, you can create multi-line quotations with custom pricing, tax rates, validity windows, and apply promotional coupon codes (percentage or flat INR discounts). Accepted quotes convert directly into active subscriptions with a single click.',
    },
    {
      q: 'How does the Gemini AI copilot assist financial operations?',
      a: 'Our integrated Gemini intelligence analyzes MRR velocity, surfaces accounts at risk of churning, generates personalized sales quotation pitches, and prescribes revenue optimization tactics.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf5f0] text-[#1b1411] selection:bg-[#33cc7a] selection:text-[#1b1411] font-sans">
      {/* Floating 8B Nav Bar */}
      <div className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <header className="bg-[#1b1411]/90 backdrop-blur-md text-[#faf5f0] rounded-full border border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xl shadow-black/15">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPortal('landing')}>
            <div className="w-8 h-8 rounded-full bg-[#33cc7a] text-[#1b1411] flex items-center justify-center font-extrabold text-sm">
              S
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-[#faf5f0]">SubsTracker</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#b8aba3]">
            <a href="#features" className="hover:text-[#faf5f0] transition-colors">Features</a>
            <a href="#showcase" className="hover:text-[#faf5f0] transition-colors">Showcase</a>
            <a href="#how-it-works" className="hover:text-[#faf5f0] transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-[#faf5f0] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#faf5f0] transition-colors">FAQ</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setAuthView('login');
                setPortal('auth');
              }}
              className="text-xs font-semibold text-[#faf5f0] hover:text-[#33cc7a] px-3 py-1.5 rounded-full transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => {
                setAuthView('register_company');
                setPortal('auth');
              }}
              className="btn-8b-compact text-xs"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>
      </div>

      {/* Hero Section - 8B Navy (#1f3954) Sheet with pale ice blue text and green accents */}
      <section className="relative overflow-hidden pt-28 pb-24 lg:pt-32 lg:pb-32 bg-[#1f3954] text-[#faf5f0] -mt-16 rounded-b-sheet">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#faf5f0]/10 border border-white/15 text-[#bacde0] text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#33cc7a]" />
                <span>Enterprise Subscription OS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#faf5f0] tracking-[-0.04em] leading-[0.98]">
                Every subscription. <br />
                <span className="text-[#33cc7a]">
                  One calm interface.
                </span>
              </h1>

              <p className="text-lg text-[#bacde0] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Manage customers, automate recurring billing, track payments and grow your subscription business with complete control. Built for high-growth digital businesses.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <RainbowButton
                  onClick={() => switchRole('admin')}
                  className="w-full sm:w-auto h-12 px-7 text-sm font-semibold shadow-xl"
                >
                  Enter Admin Console
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </RainbowButton>
                <button
                  onClick={() => switchRole('customer')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#faf5f0] bg-white/10 hover:bg-white/15 border border-white/20 transition-colors h-12"
                >
                  Customer Portal Demo
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#bacde0] font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#33cc7a]" />
                  <span>GST & Tax Invoicing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#33cc7a]" />
                  <span>3 Role-Based Portals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#33cc7a]" />
                  <span>Gemini Financial Copilot</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Dashboard Mockup Preview */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Glow backdrop */}
                <div className="absolute -inset-1 rounded-card bg-[#33cc7a]/15 blur-2xl"></div>

                <div className="relative bg-[#faf5f0] text-[#1b1411] rounded-[28px] border border-white/20 shadow-2xl overflow-hidden">
                  {/* Mock Window Top Bar */}
                  <div className="bg-[#1b1411] px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#33cc7a]"></div>
                      <span className="text-xs text-[#b8aba3] font-mono ml-2">app.substracker.in / live-overview</span>
                    </div>

                    {/* Live Tab Switcher */}
                    <div className="flex items-center bg-[#2e241f] p-0.5 rounded-full text-[11px] text-[#b8aba3]">
                      <button
                        onClick={() => setHeroTab('overview')}
                        className={`px-3 py-1 rounded-full transition-colors ${
                          heroTab === 'overview' ? 'bg-[#33cc7a] text-[#1b1411] font-semibold' : 'hover:text-[#faf5f0]'
                        }`}
                      >
                        Metrics
                      </button>
                      <button
                        onClick={() => setHeroTab('invoices')}
                        className={`px-3 py-1 rounded-full transition-colors ${
                          heroTab === 'invoices' ? 'bg-[#33cc7a] text-[#1b1411] font-semibold' : 'hover:text-[#faf5f0]'
                        }`}
                      >
                        Invoices
                      </button>
                      <button
                        onClick={() => setHeroTab('ai')}
                        className={`px-3 py-1 rounded-full transition-colors ${
                          heroTab === 'ai' ? 'bg-[#33cc7a] text-[#1b1411] font-semibold' : 'hover:text-[#faf5f0]'
                        }`}
                      >
                        AI Guard
                      </button>
                    </div>
                  </div>

                  {/* Mock Window Body */}
                  <div className="p-6 bg-[#faf5f0]">
                    {heroTab === 'overview' && (
                      <div className="space-y-4">
                        {/* 2x2 Mini KPI Cards */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-4 rounded-xl border border-[#1b1411]/8 shadow-xs">
                            <span className="text-[11px] font-medium text-[#66574f]">Monthly Recurring (MRR)</span>
                            <p className="text-2xl font-bold text-[#1b1411] mt-1 tracking-tight">₹2,84,520</p>
                            <span className="text-[10px] text-[#1b1411] font-semibold flex items-center gap-1 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#33cc7a]"></span> +18.4% MoM
                            </span>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-[#1b1411]/8 shadow-xs">
                            <span className="text-[11px] font-medium text-[#66574f]">Active Subscriptions</span>
                            <p className="text-2xl font-bold text-[#1b1411] mt-1 tracking-tight">25 Accounts</p>
                            <span className="text-[10px] text-[#1b1411] font-semibold mt-1 block">
                              8 Enterprise Services
                            </span>
                          </div>
                        </div>

                        {/* Recent Transactions List */}
                        <div className="bg-white p-4 rounded-xl border border-[#1b1411]/8 shadow-xs">
                          <div className="flex items-center justify-between pb-2.5 border-b border-[#eee5dc]">
                            <span className="text-xs font-bold text-[#1b1411]">Recent Automated Renewals</span>
                            <span className="text-[10px] font-bold text-[#1b1411] bg-[#33cc7a] px-2.5 py-0.5 rounded-full">
                              Real-Time UPI Autopay
                            </span>
                          </div>
                          <div className="divide-y divide-[#eee5dc] text-xs">
                            <div className="py-2.5 flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-[#1b1411]">Zenith Media Labs</p>
                                <p className="text-[11px] text-[#66574f]">CloudScale Business Pro</p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-[#1b1411]">₹10,619</span>
                                <span className="block text-[10px] text-[#33cc7a] font-bold">PAID</span>
                              </div>
                            </div>
                            <div className="py-2.5 flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-[#1b1411]">HyperScale Cloud Systems</p>
                                <p className="text-[11px] text-[#66574f]">CloudScale Enterprise Apex</p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-[#1b1411]">₹30,089</span>
                                <span className="block text-[10px] text-[#33cc7a] font-bold">PAID</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {heroTab === 'invoices' && (
                      <div className="space-y-3">
                        <div className="bg-white p-4 rounded-xl border border-[#1b1411]/8 shadow-xs">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-[#1b1411]">Electronic Tax Invoice INV-2026-4401</span>
                            <span className="text-[10px] font-bold text-[#1b1411] bg-[#33cc7a] px-2.5 py-0.5 rounded-full">
                              GST Paid
                            </span>
                          </div>
                          <div className="text-xs text-[#66574f] space-y-1 bg-[#faf5f0] p-3 rounded-lg border border-[#eee5dc] font-mono text-[11px]">
                            <p className="font-bold text-[#1b1411]">ApexCloud Solutions Pvt Ltd</p>
                            <p>GSTIN: 27AABCA1234F1Z8</p>
                            <p>Customer: Vikram Malhotra (Zenith Media)</p>
                            <div className="border-t border-[#eee5dc] pt-1 mt-1 flex justify-between font-bold text-[#1b1411] text-xs">
                              <span>Total with 18% GST:</span>
                              <span className="text-[#1b1411]">₹10,619</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {heroTab === 'ai' && (
                      <div className="bg-[#1b1411] text-[#faf5f0] p-4 rounded-xl border border-white/10 shadow-xs space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#faf5f0]">
                          <Sparkles className="w-4 h-4 text-[#33cc7a]" />
                          <span>Gemini Revenue Copilot Alert</span>
                        </div>
                        <p className="text-xs text-[#b8aba3] leading-relaxed">
                          "Detected 2 high-value accounts due for quarterly renewal within 7 days. Automatic payment nudges dispatched with pre-filled UPI links. Projected 0% churn for October cohort."
                        </p>
                        <div className="pt-2 flex items-center justify-between text-[11px] text-[#b8aba3] border-t border-white/10">
                          <span>Confidence: 98.4%</span>
                          <span className="text-[#33cc7a] font-semibold">Action Automated</span>
                        </div>
                      </div>
                    )}

                    {/* Bottom CTA to jump right into app */}
                    <div className="mt-4 pt-3 border-t border-[#eee5dc] flex items-center justify-between text-xs">
                      <span className="text-[#66574f] font-medium">Ready to see full workflow?</span>
                      <button
                        onClick={() => switchRole('admin')}
                        className="text-[#1b1411] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        Open Company Portal <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sheet 1: Enterprise Metrics Strip on Deep Paper (#eee5dc) */}
      <section className="bg-[#eee5dc] py-12 -mt-8 rounded-t-sheet relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-[#1b1411]">₹450 Cr+</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66574f] mt-1">Processed Annually</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-[#1b1411]">99.99%</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66574f] mt-1">Platform Uptime SLA</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-[#1b1411]">1,200+</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66574f] mt-1">Enterprise Customers</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-semibold tracking-[-0.035em] text-[#1b1411]">32%</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66574f] mt-1">Average Churn Reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sheet 2: Visual Experience Showcase with Cylindrical 3D Reel */}
      <section id="showcase" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eee5dc] text-[#1b1411] text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Cylindrical 3D Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.04em] text-[#1b1411]">
              Supported subscription platforms
            </h2>
          </div>
          <p className="text-sm text-[#66574f] max-w-sm">
            Continuous streaming reel of supported digital services, consumer streaming subscriptions, and cloud infrastructure plans.
          </p>
        </div>
        <div className="bg-[#faf5f0] rounded-[28px] border border-[#1b1411]/8 p-4 sm:p-6 shadow-[0_16px_40px_-20px_rgba(27,20,17,0.06)]">
          <TiltedGridHeroDemo />
        </div>
      </section>

      {/* Sheet 3: Core Platform Features - Warm Paper with Deep Paper Cards */}
      <section id="features" className="py-24 bg-[#eee5dc] rounded-t-sheet">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#66574f] mb-2 block">Platform Capabilities</span>
            <h2 className="text-3xl sm:text-5xl font-semibold text-[#1b1411] tracking-[-0.04em]">
              Engineered for complete subscription lifecycle control
            </h2>
            <p className="text-base text-[#66574f] mt-4">
              Everything required to configure services, issue enterprise quotes, automate recurring billing, and empower cross-functional teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#faf5f0] p-8 rounded-[28px] border border-[#1b1411]/8 shadow-xs hover:border-[#33cc7a]/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#1b1411] text-[#faf5f0] flex items-center justify-center mb-6 font-bold">
                <Repeat className="w-5 h-5 text-[#33cc7a]" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#1b1411]">Subscription Lifecycle Management</h3>
              <p className="text-sm text-[#66574f] mt-2.5 leading-relaxed">
                Seamlessly pause, resume, upgrade, downgrade or renew subscriptions. Maintain complete historical logs with granular audit trails.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#faf5f0] p-8 rounded-[28px] border border-[#1b1411]/8 shadow-xs hover:border-[#33cc7a]/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#1b1411] text-[#faf5f0] flex items-center justify-center mb-6 font-bold">
                <CreditCard className="w-5 h-5 text-[#33cc7a]" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#1b1411]">Automated Recurring Billing</h3>
              <p className="text-sm text-[#66574f] mt-2.5 leading-relaxed">
                Smart recurring invoicing with automated GST calculations, configurable grace periods, smart dunning schedules, and failure retry logic.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#faf5f0] p-8 rounded-[28px] border border-[#1b1411]/8 shadow-xs hover:border-[#33cc7a]/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#1b1411] text-[#faf5f0] flex items-center justify-center mb-6 font-bold">
                <Users className="w-5 h-5 text-[#33cc7a]" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#1b1411]">Customer 360 & Profiles</h3>
              <p className="text-sm text-[#66574f] mt-2.5 leading-relaxed">
                Detailed customer directory with lifetime spend tracking, active subscription maps, invoice records, and assigned staff account managers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#faf5f0] p-8 rounded-[28px] border border-[#1b1411]/8 shadow-xs hover:border-[#33cc7a]/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#1b1411] text-[#faf5f0] flex items-center justify-center mb-6 font-bold">
                <Sparkles className="w-5 h-5 text-[#33cc7a]" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#1b1411]">Gemini Strategic Intelligence</h3>
              <p className="text-sm text-[#66574f] mt-2.5 leading-relaxed">
                Leverage Gemini AI models to analyze MRR health, draft personalized enterprise sales pitches, and predict account churn risks.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#faf5f0] p-8 rounded-[28px] border border-[#1b1411]/8 shadow-xs hover:border-[#33cc7a]/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#1b1411] text-[#faf5f0] flex items-center justify-center mb-6 font-bold">
                <FileText className="w-5 h-5 text-[#33cc7a]" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#1b1411]">Quotation Management & Convert</h3>
              <p className="text-sm text-[#66574f] mt-2.5 leading-relaxed">
                Draft multi-tier proposals, configure tax codes, calculate volume discounts, and instantly convert accepted quotes into active subscriptions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#faf5f0] p-8 rounded-[28px] border border-[#1b1411]/8 shadow-xs hover:border-[#33cc7a]/40 transition-all">
              <div className="w-12 h-12 rounded-full bg-[#1b1411] text-[#faf5f0] flex items-center justify-center mb-6 font-bold">
                <Lock className="w-5 h-5 text-[#33cc7a]" />
              </div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#1b1411]">Role-Based Team Governance</h3>
              <p className="text-sm text-[#66574f] mt-2.5 leading-relaxed">
                Empower your workforce with tailored staff workspaces. Restrict financial and plan administrative actions with granular permissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sheet 4: How It Works Section - Warm Paper (#faf5f0) with 8B Card Numbers */}
      <section id="how-it-works" className="py-24 bg-[#faf5f0] rounded-t-sheet">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#66574f] mb-2 block">Workflow Simplicity</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1b1411] tracking-[-0.04em]">
              Three steps, then seamless scale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#eee5dc] p-8 rounded-[28px] border border-[#1b1411]/8 shadow-xs relative">
              <div className="w-12 h-12 rounded-full bg-[#1b1411] text-[#33cc7a] font-extrabold flex items-center justify-center text-lg mb-6 shadow-sm">
                1
              </div>
              <h3 className="text-xl font-semibold text-[#1b1411] tracking-[-0.02em]">Configure Services & Tiers</h3>
              <p className="text-sm text-[#66574f] mt-2.5 leading-relaxed">
                Define your catalog of cloud software, media streaming, or enterprise SaaS services with flexible billing intervals and feature tiers.
              </p>
            </div>

            <div className="bg-[#eee5dc] p-8 rounded-[28px] border border-[#1b1411]/8 shadow-xs relative">
              <div className="w-12 h-12 rounded-full bg-[#1b1411] text-[#33cc7a] font-extrabold flex items-center justify-center text-lg mb-6 shadow-sm">
                2
              </div>
              <h3 className="text-xl font-semibold text-[#1b1411] tracking-[-0.02em]">Onboard & Issue Quotes</h3>
              <p className="text-sm text-[#66574f] mt-2.5 leading-relaxed">
                Register corporate clients or let them browse via Customer Portal. Sales reps generate GST-compliant quotations with Gemini AI pitches.
              </p>
            </div>

            <div className="bg-[#eee5dc] p-8 rounded-[28px] border border-[#1b1411]/8 shadow-xs relative">
              <div className="w-12 h-12 rounded-full bg-[#1b1411] text-[#33cc7a] font-extrabold flex items-center justify-center text-lg mb-6 shadow-sm">
                3
              </div>
              <h3 className="text-xl font-semibold text-[#1b1411] tracking-[-0.02em]">Automate & Scale Revenue</h3>
              <p className="text-sm text-[#66574f] mt-2.5 leading-relaxed">
                Recurring invoices generate automatically. Real-time dashboards track MRR velocity, customer retention, and overdue payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sheet 5: Pricing Section - Deep Paper (#eee5dc) with 8B Navy Popular Card */}
      <section id="pricing" className="py-24 bg-[#eee5dc] rounded-t-sheet">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#66574f] mb-2 block">Transparent Pricing</span>
            <h2 className="text-3xl sm:text-5xl font-semibold text-[#1b1411] tracking-[-0.04em]">
              Simple plans that grow with you
            </h2>
            <p className="text-sm text-[#66574f] mt-3">All plans include complete portal access and GST invoicing support.</p>

            {/* Monthly / Annual Toggle */}
            <div className="mt-8 inline-flex items-center bg-[#faf5f0] p-1.5 rounded-full border border-[#1b1411]/10 shadow-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                  billingCycle === 'monthly' ? 'bg-[#1b1411] text-[#faf5f0] shadow-sm' : 'text-[#66574f] hover:text-[#1b1411]'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                  billingCycle === 'annual' ? 'bg-[#1b1411] text-[#faf5f0] shadow-sm' : 'text-[#66574f] hover:text-[#1b1411]'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-[#33cc7a] text-[#1b1411] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="bg-[#faf5f0] p-8 rounded-[28px] border border-[#1b1411]/10 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#66574f]">Starter</span>
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#1b1411] mt-1">Founding Teams</h3>
                <p className="text-xs text-[#66574f] mt-2">For startups launching their first subscription services.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#1b1411] font-mono tracking-tight">
                    {billingCycle === 'annual' ? '₹3,999' : '₹4,999'}
                  </span>
                  <span className="text-xs text-[#66574f]">/ month</span>
                </div>

                <div className="mt-8 space-y-3.5 text-xs text-[#1b1411]">
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Up to 100 Active Subscriptions</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> 3 Team Staff Logins</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> GST Compliant PDF Invoicing</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Customer Self-service Portal</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Standard Email Support</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setAuthView('register_company');
                  setPortal('auth');
                }}
                className="mt-8 w-full py-3.5 rounded-full border border-[#1b1411]/20 text-[#1b1411] font-semibold text-xs hover:bg-[#eee5dc] transition-colors"
              >
                Choose Starter
              </button>
            </div>

            {/* Growth Plan (Popular) - 8B Navy (#1f3954) Card */}
            <div className="bg-[#1f3954] text-[#faf5f0] p-8 rounded-[28px] border-2 border-[#33cc7a] shadow-2xl flex flex-col justify-between relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#33cc7a] text-[#1b1411] px-4 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-md">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#33cc7a]">Growth</span>
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#faf5f0] mt-1">Scaling Enterprises</h3>
                <p className="text-xs text-[#bacde0] mt-2">Accelerate revenue with automated dunning & quotes.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#faf5f0] font-mono tracking-tight">
                    {billingCycle === 'annual' ? '₹9,999' : '₹12,999'}
                  </span>
                  <span className="text-xs text-[#bacde0]">/ month</span>
                </div>

                <div className="mt-8 space-y-3.5 text-xs text-[#bacde0]">
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> <span className="text-[#faf5f0]">Up to 1,000 Active Subscriptions</span></div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> <span className="text-[#faf5f0]">15 Team Staff Members with RBAC</span></div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Quotation-to-Subscription Engine</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Gemini AI Churn & Revenue Audits</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Automated UPI & Card Retries</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Priority 24/7 Support</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setAuthView('register_company');
                  setPortal('auth');
                }}
                className="btn-8b-primary mt-8 w-full text-xs font-bold"
              >
                Get Started with Growth
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-[#faf5f0] p-8 rounded-[28px] border border-[#1b1411]/10 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#66574f]">Enterprise</span>
                <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#1b1411] mt-1">High Scale & Telecom</h3>
                <p className="text-xs text-[#66574f] mt-2">Unlimited scale, custom ERP integrations & dedicated TAM.</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#1b1411] font-mono tracking-tight">
                    {billingCycle === 'annual' ? '₹24,999' : '₹29,999'}
                  </span>
                  <span className="text-xs text-[#66574f]">/ month</span>
                </div>

                <div className="mt-8 space-y-3.5 text-xs text-[#1b1411]">
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Unlimited Active Subscriptions</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Unlimited Staff Accounts</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Custom Python FastAPI & SQL Peering</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Dedicated Technical Account Manager</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> 99.99% Financially-backed SLA</div>
                  <div className="flex items-center gap-2.5"><Check className="w-4 h-4 text-[#33cc7a] shrink-0" /> Custom Legal & Billing Terms</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setAuthView('register_company');
                  setPortal('auth');
                }}
                className="mt-8 w-full py-3.5 rounded-full border border-[#1b1411]/20 text-[#1b1411] font-semibold text-xs hover:bg-[#eee5dc] transition-colors"
              >
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sheet 6: FAQ Section - Warm Paper (#faf5f0) */}
      <section id="faq" className="py-24 bg-[#faf5f0] rounded-t-sheet">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#66574f] mb-2 block">Common Inquiries</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1b1411] tracking-[-0.04em]">
              Questions, answered plainly
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#eee5dc] rounded-[20px] border border-[#1b1411]/8 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm font-semibold text-[#1b1411] hover:text-[#33cc7a] transition-colors"
                >
                  <span>{faq.q}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${activeFaq === idx ? 'bg-[#33cc7a] text-[#1b1411] rotate-180' : 'bg-white text-[#1b1411]'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-[#66574f] leading-relaxed border-t border-[#1b1411]/8 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sheet 7: Closing CTA Strip - Navy (#1f3954) Sheet with Green Pill */}
      <section className="bg-[#1f3954] text-[#faf5f0] py-20 rounded-t-sheet">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.04em] text-[#faf5f0]">
            Ready to take control of your subscription revenue?
          </h2>
          <p className="text-[#bacde0] max-w-2xl mx-auto text-base">
            Join hundreds of modern businesses that run their subscription catalogs, automated recurring invoicing, and customer success on SubsTracker.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <RainbowButton
              onClick={() => switchRole('admin')}
              className="h-12 px-8 text-sm font-semibold shadow-xl"
            >
              Get Unlimited Access
            </RainbowButton>
            <button
              onClick={() => {
                setAuthView('register_company');
                setPortal('auth');
              }}
              className="btn-8b-dark h-12 px-8 text-sm font-semibold border border-white/20"
            >
              Register Your Company
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Espresso (#1b1411) */}
      <footer className="bg-[#1b1411] text-[#b8aba3] py-16 text-xs border-t border-[#2e241f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 text-[#faf5f0]">
                <div className="w-8 h-8 rounded-full bg-[#33cc7a] text-[#1b1411] flex items-center justify-center font-extrabold text-sm">
                  S
                </div>
                <span className="text-base font-bold tracking-tight text-[#faf5f0]">SubsTracker</span>
              </div>
              <p className="mt-3 text-[#b8aba3] text-xs max-w-sm leading-relaxed">
                Premium subscription management platform. Manage services, multi-tier plans, invoices, recurring payments, and cross-portal team workflows.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[11px] text-[#b8aba3]">
                <span className="w-2 h-2 rounded-full bg-[#33cc7a]"></span>
                <span>System Status: All Systems Operational (100%)</span>
              </div>
            </div>

            <div>
              <p className="text-[#faf5f0] font-semibold uppercase tracking-wider mb-3">Portals</p>
              <ul className="space-y-2">
                <li><button onClick={() => switchRole('admin')} className="hover:text-[#faf5f0]">Company Admin Portal</button></li>
                <li><button onClick={() => switchRole('staff')} className="hover:text-[#faf5f0]">Staff Portal</button></li>
                <li><button onClick={() => switchRole('customer')} className="hover:text-[#faf5f0]">Customer Portal</button></li>
                <li><a href="#features" className="hover:text-[#faf5f0]">Lifecycle Billing</a></li>
                <li><a href="#pricing" className="hover:text-[#faf5f0]">Pricing Plans</a></li>
              </ul>
            </div>

            <div>
              <p className="text-[#faf5f0] font-semibold uppercase tracking-wider mb-3">Compliance</p>
              <ul className="space-y-2">
                <li><span className="text-[#b8aba3]">GST E-Invoice Ready</span></li>
                <li><span className="text-[#b8aba3]">RBI E-Mandate Compliant</span></li>
                <li><span className="text-[#b8aba3]">SOC2 Type II Controls</span></li>
                <li><span className="text-[#b8aba3]">256-bit Encryption</span></li>
                <li><span className="text-[#b8aba3]">Data Residency in India</span></li>
              </ul>
            </div>

            <div>
              <p className="text-[#faf5f0] font-semibold uppercase tracking-wider mb-3">Design & Credit</p>
              <ul className="space-y-2">
                <li><span className="text-[#faf5f0]">Design: 8B Template</span></li>
                <li><span className="text-[#b8aba3]">Host Grotesk Typography</span></li>
                <li><span className="text-[#b8aba3]">Tilted 3D Cylindrical Grid</span></li>
                <li><span className="text-[#b8aba3]">Rainbow Button Component</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#2e241f] pt-8 flex flex-col sm:flex-row justify-between items-center text-[#b8aba3] gap-4">
            <p>© 2026 SubsTracker Platforms Pvt Ltd. All rights reserved. Design: 8B.</p>
            <div className="flex gap-6">
              <span className="hover:text-[#faf5f0] cursor-pointer">Privacy Policy</span>
              <span className="hover:text-[#faf5f0] cursor-pointer">Terms of Service</span>
              <span className="hover:text-[#faf5f0] cursor-pointer">Security Center</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
