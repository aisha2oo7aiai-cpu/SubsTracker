import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { TopNav } from '../navigation/TopNav';
import { AdminOverview } from './AdminOverview';
import { AdminServices } from './AdminServices';
import { AdminPlans } from './AdminPlans';
import { AdminCustomers } from './AdminCustomers';
import { AdminSubscriptions } from './AdminSubscriptions';
import { AdminQuotations } from './AdminQuotations';
import { AdminInvoices } from './AdminInvoices';
import { AdminPayments } from './AdminPayments';
import { AdminDiscounts } from './AdminDiscounts';
import { AdminStaff } from './AdminStaff';
import { AdminReports } from './AdminReports';
import { AdminSettings } from './AdminSettings';

export const AdminPortal: React.FC = () => {
  const { activeTab } = useApp();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'services':
        return <AdminServices />;
      case 'plans':
        return <AdminPlans />;
      case 'customers':
        return <AdminCustomers />;
      case 'subscriptions':
        return <AdminSubscriptions />;
      case 'quotations':
        return <AdminQuotations />;
      case 'invoices':
        return <AdminInvoices />;
      case 'payments':
        return <AdminPayments />;
      case 'discounts':
        return <AdminDiscounts />;
      case 'staff':
        return <AdminStaff />;
      case 'reports':
        return <AdminReports />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#faf5f0] text-[#1b1411] overflow-hidden font-sans">
      {/* Persistent Collapsible Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <TopNav />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#faf5f0]">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};
