import React from 'react';
import { useApp } from '../../context/AppContext';
import { CustomerSidebar } from './CustomerSidebar';
import { TopNav } from '../navigation/TopNav';
import { CustomerOverview } from './CustomerOverview';
import { CustomerExplore } from './CustomerExplore';
import { CustomerSubscriptions } from './CustomerSubscriptions';
import { CustomerInvoices } from './CustomerInvoices';
import { CustomerSupport } from './CustomerSupport';
import { CustomerProfile } from './CustomerProfile';
import { AdminPayments } from '../admin/AdminPayments';

export const CustomerPortal: React.FC = () => {
  const { activeTab } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <CustomerOverview />;
      case 'explore':
      case 'plans':
        return <CustomerExplore />;
      case 'my_subscriptions':
        return <CustomerSubscriptions />;
      case 'invoices':
        return <CustomerInvoices />;
      case 'payments':
        return <AdminPayments />;
      case 'support':
        return <CustomerSupport />;
      case 'profile':
        return <CustomerProfile />;
      default:
        return <CustomerOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#faf5f0] text-[#1b1411] overflow-hidden font-sans">
      <CustomerSidebar />
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
