import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, getStatusBadge } from '../../utils/formatters';
import { Printer, Download, X, CheckCircle, CreditCard, Send, ShieldCheck } from 'lucide-react';

export const PrintableInvoiceModal: React.FC = () => {
  const { previewInvoice, setPreviewInvoice, company, markInvoicePaid, addToast, currentUser } = useApp();

  if (!previewInvoice) return null;

  const badge = getStatusBadge(previewInvoice.status);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    addToast({
      title: 'Downloading Tax Invoice PDF',
      message: `${previewInvoice.invoiceNumber}.pdf ready for accounting records.`,
      type: 'success',
    });
  };

  const handleSendEmail = () => {
    addToast({
      title: 'Invoice Dispatched',
      message: `Tax invoice sent to ${previewInvoice.customerEmail}.`,
      type: 'success',
    });
  };

  const handleQuickPay = async () => {
    await markInvoicePaid(previewInvoice.id, 'UPI Instant Pay');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none">
        {/* Header Action Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FAF9F5] border-b border-[#E2DDD0] print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5E629A]">Document Preview</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
              {badge.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#282B4A] bg-white border border-[#E2DDD0] hover:bg-[#FAF9F5] transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#5E629A]" />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#282B4A] bg-white border border-[#E2DDD0] hover:bg-[#FAF9F5] transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#5E629A]" />
              Download PDF
            </button>
            <button
              onClick={handleSendEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#282B4A] bg-white border border-[#E2DDD0] hover:bg-[#FAF9F5] transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5 text-[#5E629A]" />
              Email
            </button>
            {previewInvoice.status !== 'paid' && currentUser.role === 'customer' && (
              <button
                onClick={handleQuickPay}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#EEEBDA] bg-[#282B4A] hover:bg-[#1D1F37] transition-colors shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Pay Now ({formatINR(previewInvoice.totalAmount)})
              </button>
            )}
            <button
              onClick={() => setPreviewInvoice(null)}
              className="p-1.5 text-[#888AB9] hover:text-[#282B4A] rounded-lg hover:bg-[#EEEBDA]/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 sm:p-10 text-slate-800" id="printable-invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#282B4A] text-[#EEEBDA] flex items-center justify-center font-bold text-lg shadow-sm">
                  S
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#282B4A]">SubsTracker</h1>
                  <p className="text-xs text-[#5E629A] font-medium">Enterprise Subscription Platform</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-900">{company.legalEntity || company.name}</p>
                <p>{company.address}</p>
                <p>{company.city}, {company.state} - {company.postalCode}, {company.country}</p>
                <p><span className="font-semibold text-slate-700">GSTIN:</span> {company.taxId}</p>
                <p><span className="font-semibold text-slate-700">Email:</span> {company.email}</p>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-xs uppercase tracking-widest font-bold text-[#282B4A] bg-[#EEEBDA] border border-[#D8D2C2] px-3 py-1 rounded-md">
                TAX INVOICE
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">{previewInvoice.invoiceNumber}</h2>
              <div className="mt-4 text-xs text-slate-600 space-y-1.5 sm:text-right">
                <p><span className="font-semibold text-slate-700">Issue Date:</span> {formatDate(previewInvoice.issueDate)}</p>
                <p><span className="font-semibold text-slate-700">Payment Due:</span> {formatDate(previewInvoice.dueDate)}</p>
                {previewInvoice.paidDate && (
                  <p className="text-emerald-600 font-semibold flex items-center sm:justify-end gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Paid on {formatDate(previewInvoice.paidDate)} ({previewInvoice.paymentMethod})
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="py-6 border-b border-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Billed To</p>
            <h3 className="text-base font-bold text-slate-900">{previewInvoice.customerName}</h3>
            <p className="text-xs text-slate-600 mt-0.5">{previewInvoice.customerEmail}</p>
            {previewInvoice.customerAddress && (
              <p className="text-xs text-slate-600 mt-1 max-w-sm">{previewInvoice.customerAddress}</p>
            )}
          </div>

          {/* Items Table */}
          <div className="py-6 border-b border-slate-200">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 w-1/2">Description / Subscription Tier</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Unit Price</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewInvoice.items.map((item, idx) => (
                  <tr key={idx} className="text-slate-800">
                    <td className="py-3.5 font-medium text-slate-900">{item.description}</td>
                    <td className="py-3.5 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-3.5 text-right text-slate-600">{formatINR(item.unitPrice)}</td>
                    <td className="py-3.5 text-right font-semibold text-slate-900">{formatINR(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Calculation */}
          <div className="py-6 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="text-xs text-slate-500 max-w-sm space-y-2">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>GST Compliant Digital Tax Invoice</span>
              </div>
              <p>
                This electronic invoice is generated under SubsTracker Enterprise Financial Protocol. 
                Values are denominated in Indian Rupees (INR) with standard 18% integrated GST.
              </p>
              {previewInvoice.notes && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                  <span className="font-semibold block text-slate-900">Notes:</span>
                  {previewInvoice.notes}
                </div>
              )}
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">{formatINR(previewInvoice.subtotal)}</span>
              </div>
              {previewInvoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Special Discount:</span>
                  <span className="font-semibold">-{formatINR(previewInvoice.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Integrated GST (18%):</span>
                <span className="font-semibold text-slate-800">{formatINR(previewInvoice.taxAmount)}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-bold text-slate-900">
                <span>Total Due:</span>
                <span className="text-[#282B4A] font-extrabold">{formatINR(previewInvoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <div>
              <p>ApexCloud Solutions Pvt Ltd | Peninsula Business Park, Mumbai</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated recurring billing generated on SubsTracker Platform</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="font-serif italic text-slate-800 text-sm font-semibold tracking-wider">Rajesh Varma</div>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
