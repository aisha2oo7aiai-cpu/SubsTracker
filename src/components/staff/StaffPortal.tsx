import React from 'react';
import { useApp } from '../../context/AppContext';
import { StaffSidebar } from './StaffSidebar';
import { TopNav } from '../navigation/TopNav';
import { StaffDashboard } from './StaffDashboard';
import { StaffTasks } from './StaffTasks';
import { StaffProfile } from './StaffProfile';
import { AdminCustomers } from '../admin/AdminCustomers';
import { AdminQuotations } from '../admin/AdminQuotations';
import { AdminSubscriptions } from '../admin/AdminSubscriptions';
import { AdminInvoices } from '../admin/AdminInvoices';
import { AdminPayments } from '../admin/AdminPayments';

export const StaffPortal: React.FC = () => {
  const { activeTab } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StaffDashboard />;
      case 'my_customers':
        return <AdminCustomers />;
      case 'quotations':
        return <AdminQuotations />;
      case 'subscriptions':
        return <AdminSubscriptions />;
      case 'invoices':
        return <AdminInvoices />;
      case 'payments':
        return <AdminPayments />;
      case 'tasks':
        return <StaffTasks />;
      case 'profile':
        return <StaffProfile />;
      default:
        return <StaffDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#faf5f0] text-[#1b1411] overflow-hidden font-sans">
      <StaffSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#faf5f0]">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
