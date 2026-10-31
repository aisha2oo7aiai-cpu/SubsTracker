import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Briefcase,
  User,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { authView, setAuthView, switchRole, setPortal, addToast, addCustomer } = useApp();

  const [portalLogin, setPortalLogin] = useState<'admin' | 'staff' | 'customer'>('admin');
  const [email, setEmail] = useState('admin.shayaan@gmail.com');
  const [password, setPassword] = useState('admin1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration Form States
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password reset step
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSelectPortalLogin = (target: 'admin' | 'staff' | 'customer') => {
    setPortalLogin(target);
    if (target === 'admin') {
      setEmail('admin.shayaan@gmail.com');
    } else if (target === 'staff') {
      setEmail('priya.sharma@apexcloud.in');
    } else {
      setEmail('vikram.m@zenithmedia.in');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast({ title: 'Validation Error', message: 'Please enter both email and password.', type: 'warning' });
      return;
    }

    if (portalLogin === 'customer' || email.toLowerCase().includes('cust') || email.toLowerCase().includes('zenith')) {
      switchRole('customer');
    } else if (portalLogin === 'staff' || email.toLowerCase().includes('staff') || email.toLowerCase().includes('priya')) {
      switchRole('staff');
    } else {
      switchRole('admin');
    }
  };

  const handleCompanyRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !fullName || !email || !password) {
      addToast({ title: 'Missing required fields', message: 'Please fill in all company and admin fields.', type: 'warning' });
      return;
    }
    addToast({
      title: 'Company Account Provisioned!',
      message: `Welcome ${fullName}. ${companyName} has been registered successfully.`,
      type: 'success',
    });
    switchRole('admin');
  };

  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      addToast({ title: 'Missing required fields', message: 'Please complete all customer registration fields.', type: 'warning' });
      return;
    }
    await addCustomer({
      name: fullName,
      email: email,
      phone: phone || '+91 98000 00000',
      companyName: companyName || 'Independent Subscriber',
      status: 'active',
      address: 'Corporate Headquarters',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    });
    addToast({
      title: 'Customer Profile Created',
      message: 'Your subscriber account is live. Explore our catalog!',
      type: 'success',
    });
    switchRole('customer');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast({ title: 'Enter your email', type: 'warning' });
      return;
    }
    setResetSuccess(true);
    addToast({
      title: 'Verification Link Sent',
      message: `Secure password reset instructions dispatched to ${email}`,
      type: 'info',
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast({ title: 'Passwords do not match', type: 'error' });
      return;
    }
    addToast({ title: 'Password Successfully Changed', message: 'Please sign in with your new credentials.', type: 'success' });
    setAuthView('login');
  };

  return (
    <div className="min-h-screen bg-[#faf5f0] text-[#1b1411] flex font-sans">
      {/* Left Column: 8B Navy (#1f3954) Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1f3954] text-[#faf5f0] p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#33cc7a]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#bacde0]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        {/* Top Logo */}
        <div className="flex items-center gap-3 cursor-pointer z-10" onClick={() => setPortal('landing')}>
          <div className="w-10 h-10 rounded-full bg-[#33cc7a] text-[#1b1411] flex items-center justify-center font-extrabold text-lg shadow-md">
            S
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#faf5f0]">SubsTracker</span>
            <span className="text-[10px] block font-semibold text-[#bacde0] uppercase tracking-widest -mt-1">
              Enterprise Subscription OS
            </span>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="space-y-8 z-10 max-w-md my-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#33cc7a] text-[#1b1411] text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Recurring Operations</span>
          </div>

          <h2 className="text-4xl font-semibold tracking-[-0.04em] leading-[1.08] text-[#faf5f0]">
            Every recurring plan, customer and invoice. One calm interface.
          </h2>

          <div className="space-y-4 text-sm text-[#bacde0]">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#33cc7a] text-[#1b1411] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p><strong className="text-[#faf5f0]">Distinct Role Architecture:</strong> Clean partition between Admin governance, Staff client operations, and Customer self-service.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#33cc7a] text-[#1b1411] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p><strong className="text-[#faf5f0]">Indian Rupee (₹) & GST Compliant:</strong> Instant GSTIN validation, automatic 18% tax calculation, and compliant PDF invoices.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#33cc7a] text-[#1b1411] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p><strong className="text-[#faf5f0]">Gemini Copilot Built-In:</strong> Real-time churn detection, intelligent proposal drafting, and executive MRR velocity audits.</p>
            </div>
          </div>
        </div>

        {/* Bottom Security Tag */}
        <div className="border-t border-white/10 pt-6 z-10 flex items-center justify-between text-xs text-[#bacde0]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#33cc7a]" />
            <span>Bank-grade 256-bit encryption</span>
          </div>
          <span>Production Ready v3.0</span>
        </div>
      </div>

      {/* Right Column: 8B Warm Paper Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 lg:p-16 max-w-xl mx-auto">
        {/* Back to landing link */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setPortal('landing')}
            className="text-xs font-semibold text-[#66574f] hover:text-[#1b1411] transition-colors"
          >
            ← Back to Homepage
          </button>
          <div className="flex items-center gap-1.5 text-xs text-[#66574f]">
            {authView === 'login' ? 'Need an account?' : 'Already registered?'}
            <button
              onClick={() => setAuthView(authView === 'login' ? 'register_company' : 'login')}
              className="font-bold text-[#1b1411] hover:underline ml-1"
            >
              {authView === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>

        {/* DEDICATED PORTAL LOGIN SELECTOR - 8B Style */}
        <div className="mb-6">
          <p className="text-[11px] font-semibold text-[#66574f] uppercase tracking-wider mb-2">
            Select Your Workspace Portal
          </p>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#eee5dc] rounded-full">
            <button
              type="button"
              onClick={() => handleSelectPortalLogin('admin')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs transition-all ${
                portalLogin === 'admin'
                  ? 'bg-[#1b1411] text-[#faf5f0] shadow-sm font-semibold'
                  : 'text-[#66574f] hover:text-[#1b1411] font-medium'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectPortalLogin('staff')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs transition-all ${
                portalLogin === 'staff'
                  ? 'bg-[#1b1411] text-[#faf5f0] shadow-sm font-semibold'
                  : 'text-[#66574f] hover:text-[#1b1411] font-medium'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Staff</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectPortalLogin('customer')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs transition-all ${
                portalLogin === 'customer'
                  ? 'bg-[#1b1411] text-[#faf5f0] shadow-sm font-semibold'
                  : 'text-[#66574f] hover:text-[#1b1411] font-medium'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        {/* 1. LOGIN VIEW */}
        {authView === 'login' && (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#eee5dc] text-[#1b1411] mb-2.5">
                {portalLogin === 'admin' ? 'Company Administration' : portalLogin === 'staff' ? 'Employee Operations' : 'Subscriber Self-Service'}
              </div>
              <h2 className="text-3xl font-semibold text-[#1b1411] tracking-[-0.035em]">
                {portalLogin === 'admin' ? 'Sign in as Administrator' : portalLogin === 'staff' ? 'Sign in as Staff Member' : 'Sign in as Subscriber'}
              </h2>
              <p className="text-sm text-[#66574f] mt-1.5">
                {portalLogin === 'admin'
                  ? 'Manage corporate subscriptions, financial reports, all clients, and company settings.'
                  : portalLogin === 'staff'
                  ? 'Access your assigned accounts, issue quotations, record offline payments, and track tasks.'
                  : 'Manage active subscriptions, download official GST tax invoices, and request support.'}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1b1411] mb-1.5">Work Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#66574f] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      portalLogin === 'admin'
                        ? 'admin.shayaan@gmail.com'
                        : portalLogin === 'staff'
                        ? 'priya.sharma@apexcloud.in'
                        : 'vikram.m@zenithmedia.in'
                    }
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] placeholder-[#66574f]/60 focus:outline-none focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#1b1411]">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthView('forgot_password')}
                    className="text-xs text-[#1b1411] hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#66574f] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] placeholder-[#66574f]/60 focus:outline-none focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#66574f] hover:text-[#1b1411]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#33cc7a] border-[#1b1411]/20 focus:ring-[#33cc7a]"
                  />
                  <span className="text-xs text-[#66574f]">Keep me signed in to this workspace</span>
                </label>
              </div>

              {/* 8B Primary Green Action Button */}
              <button
                type="submit"
                className="btn-8b-primary w-full text-sm font-semibold mt-2"
              >
                {portalLogin === 'admin'
                  ? 'Access Admin Workspace'
                  : portalLogin === 'staff'
                  ? 'Access Staff Workspace'
                  : 'Access Customer Workspace'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </form>
          </div>
        )}

        {/* 2. COMPANY REGISTRATION */}
        {authView === 'register_company' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-[#1b1411] tracking-[-0.035em]">Register Your Company</h2>
              <p className="text-sm text-[#66574f] mt-1.5">
                Establish a new corporate workspace for services, billing, and team accounts.
              </p>
            </div>

            <form onSubmit={handleCompanyRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1b1411] mb-1">Company Trade Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Cloud Technologies"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1b1411] mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="27AABCA1234F1Z8"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1411] mb-1">Company Admin Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rajesh Varma"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1b1411] mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@company.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1b1411] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1411] mb-1">Master Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-8b-primary w-full text-sm font-semibold"
                >
                  Create Company Workspace <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 3. CUSTOMER REGISTRATION */}
        {authView === 'register_customer' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-[#1b1411] tracking-[-0.035em]">Customer Sign Up</h2>
              <p className="text-sm text-[#66574f] mt-1.5">
                Create a subscriber account to manage active services, invoices, and payment methods.
              </p>
            </div>

            <form onSubmit={handleCustomerRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1b1411] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Vikram Malhotra"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1411] mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Zenith Media Labs"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1411] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikram.m@zenithmedia.in"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1411] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-8b-primary w-full text-sm font-semibold"
                >
                  Create Subscriber Profile <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 4. FORGOT PASSWORD */}
        {authView === 'forgot_password' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-[#1b1411] tracking-[-0.035em]">Reset Password</h2>
              <p className="text-sm text-[#66574f] mt-1.5">
                Enter your registered corporate or subscriber email to receive a recovery link.
              </p>
            </div>

            {resetSuccess ? (
              <div className="p-6 bg-[#eee5dc] rounded-[28px] border border-[#1b1411]/10 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#33cc7a] mx-auto" />
                <h3 className="text-base font-bold text-[#1b1411]">Verification Email Dispatched</h3>
                <p className="text-xs text-[#66574f]">
                  We've sent a 6-digit security code to <strong>{email}</strong>.
                </p>
                <button
                  onClick={() => setAuthView('reset_password')}
                  className="btn-8b-dark mt-2 text-xs"
                >
                  Enter New Password Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1b1411] mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#66574f] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-8b-primary w-full text-sm font-semibold"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        )}

        {/* 5. RESET PASSWORD CONFIRM */}
        {authView === 'reset_password' && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-semibold text-[#1b1411] tracking-[-0.035em]">Set New Password</h2>
              <p className="text-sm text-[#66574f] mt-1.5">
                Choose a strong passphrase for your SubsTracker account.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1b1411] mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1b1411] mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1b1411]/15 rounded-[14px] text-[#1b1411] focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn-8b-primary w-full text-sm font-semibold"
                >
                  Update Password & Sign In
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
