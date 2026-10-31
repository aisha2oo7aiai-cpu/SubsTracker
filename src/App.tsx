import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { AdminPortal } from './components/admin/AdminPortal';
import { StaffPortal } from './components/staff/StaffPortal';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { ToastContainer } from './components/shared/ToastContainer';
import { PrintableInvoiceModal } from './components/shared/PrintableInvoiceModal';

const AppContent: React.FC = () => {
  const { portal } = useApp();

  return (
    <div className="min-h-screen bg-[#faf5f0] text-[#1b1411] selection:bg-[#33cc7a] selection:text-[#1b1411]">
      {portal === 'landing' && <LandingPage />}
      {portal === 'auth' && <AuthPage />}
      {portal === 'admin' && <AdminPortal />}
      {portal === 'staff' && <StaffPortal />}
      {portal === 'customer' && <CustomerPortal />}

      {/* Global Modals & Notifications */}
      <PrintableInvoiceModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
