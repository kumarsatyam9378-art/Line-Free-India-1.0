import { useState } from 'react';
import { useApp, TokenEntry } from '../store/AppContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import { jsPDF } from 'jspdf';

type DatePreset = 'this_month' | 'last_month' | 'last_3_months' | 'custom';

export default function OwnerReports() {
  const { user, barberProfile, t } = useApp();
  const [preset, setPreset] = useState<DatePreset>('this_month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const calculateDateRange = () => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    if (preset === 'this_month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (preset === 'last_month') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    } else if (preset === 'last_3_months') {
      start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (preset === 'custom') {
      start = new Date(startDate);
      end = new Date(endDate);
    }

    return {
      startStr: start.toISOString().split('T')[0],
      endStr: end.toISOString().split('T')[0],
      startObj: start,
      endObj: end
    };
  };

  const handleGenerateReport = async () => {
    if (!user || !barberProfile) return;
    setGenerating(true);

    try {
      const { startStr, endStr, startObj, endObj } = calculateDateRange();

      // Fetch all tokens for salon
      const q = query(collection(db, 'tokens'), where('salonId', '==', user.uid));
      const snap = await getDocs(q);
      const allTokens = snap.docs.map(d => d.data() as TokenEntry);

      // Filter by date range and status 'done'
      const filteredTokens = allTokens.filter(t => {
        if (t.status !== 'done') return false;
        return t.date >= startStr && t.date <= endStr;
      });

      // Calculate Stats
      let totalRevenue = 0;
      const bookingsCount = filteredTokens.length;
      let totalRating = 0;
      let ratedTokensCount = 0;

      const servicesCount: Record<string, { count: number, revenue: number }> = {};
      const customersMap: Record<string, { name: string, visits: number, spent: number }> = {};

      filteredTokens.forEach(t => {
        totalRevenue += (t.totalPrice || 0);

        if (t.rating) {
          totalRating += t.rating;
          ratedTokensCount++;
        }

        t.selectedServices?.forEach(s => {
          if (!servicesCount[s.name]) servicesCount[s.name] = { count: 0, revenue: 0 };
          servicesCount[s.name].count++;
          servicesCount[s.name].revenue += s.price;
        });

        if (!customersMap[t.customerId]) {
          customersMap[t.customerId] = { name: t.customerName || 'Unknown', visits: 0, spent: 0 };
        }
        customersMap[t.customerId].visits++;
        customersMap[t.customerId].spent += (t.totalPrice || 0);
      });

      const avgRating = ratedTokensCount > 0 ? (totalRating / ratedTokensCount).toFixed(1) : 'N/A';

      const topServices = Object.entries(servicesCount)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const topCustomers = Object.values(customersMap)
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 5);

      const data = {
        dateRange: `${startObj.toLocaleDateString()} - ${endObj.toLocaleDateString()}`,
        totalRevenue,
        bookingsCount,
        avgRating,
        topServices,
        topCustomers,
        monthYear: `${startObj.toLocaleString('default', { month: 'short' })}-${startObj.getFullYear()}`
      };

      setReportData(data);
      generatePDF(data);

    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report.");
    } finally {
      setGenerating(false);
    }
  };

  const generatePDF = (data: any) => {
    if (!barberProfile) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Line Free Business Report', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(barberProfile.salonName || barberProfile.businessName, pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Date Range: ${data.dateRange}`, pageWidth / 2, 38, { align: 'center' });

    // Line separator
    doc.setDrawColor(200);
    doc.line(20, 45, pageWidth - 20, 45);

    // Summary Stats
    doc.setTextColor(0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 20, 60);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Revenue: INR ${data.totalRevenue}`, 20, 70);
    doc.text(`Total Bookings: ${data.bookingsCount}`, 20, 80);
    doc.text(`Average Rating: ${data.avgRating}`, 20, 90);

    // Placeholder for Chart Image
    doc.setDrawColor(150);
    doc.setFillColor(245, 245, 245);
    doc.rect(100, 60, 90, 40, 'FD');
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('[ Revenue Chart Placeholder ]', 145, 80, { align: 'center' });

    // Top Services Table
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Top 5 Services', 20, 120);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Service Name', 20, 130);
    doc.text('Bookings', 100, 130);
    doc.text('Revenue', 150, 130);

    doc.setFont('helvetica', 'normal');
    let y = 140;
    data.topServices.forEach((service: any) => {
      doc.text(service.name, 20, y);
      doc.text(service.count.toString(), 100, y);
      doc.text(`INR ${service.revenue}`, 150, y);
      y += 10;
    });

    // Top Customers Table
    y += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Top 5 Customers', 20, y);

    y += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Name', 20, y);
    doc.text('Visits', 100, y);
    doc.text('Total Spent', 150, y);

    doc.setFont('helvetica', 'normal');
    y += 10;
    data.topCustomers.forEach((customer: any) => {
      doc.text(customer.name, 20, y);
      doc.text(customer.visits.toString(), 100, y);
      doc.text(`INR ${customer.spent}`, 150, y);
      y += 10;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Generated on ${new Date().toLocaleString()} via Line Free App`, pageWidth / 2, 280, { align: 'center' });

    // Save PDF
    doc.save(`LineFree-Report-${data.monthYear}.pdf`);
  };

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      <div className="p-6">
        <BackButton to="/barber/analytics" />
        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold">Reports & Export</h1>
          <p className="text-text-dim text-sm mt-1">Download detailed business performance reports.</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm mb-6">
          <h2 className="font-bold text-lg mb-4">Select Date Range</h2>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { id: 'this_month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
              { id: 'last_3_months', label: 'Last 3 Months' },
              { id: 'custom', label: 'Custom Range' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id as DatePreset)}
                className={`py-3 rounded-xl text-sm font-semibold transition-all border ${
                  preset === p.id
                    ? 'bg-primary/10 border-primary text-primary shadow-sm'
                    : 'bg-bg border-border text-text-dim hover:bg-card-2'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {preset === 'custom' && (
            <div className="grid grid-cols-2 gap-3 mb-5 animate-slideUp">
              <div>
                <label className="text-xs text-text-dim mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="input-field w-full text-sm py-2.5"
                />
              </div>
              <div>
                <label className="text-xs text-text-dim mb-1 block">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="input-field w-full text-sm py-2.5"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateReport}
            disabled={generating || (preset === 'custom' && (!startDate || !endDate))}
            className="w-full btn-primary py-4 text-base font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <span>📄</span> Generate & Download PDF
              </>
            )}
          </button>
        </div>

        {/* Success Feedback Preview */}
        {reportData && !generating && (
          <div className="p-4 rounded-2xl bg-success/10 border border-success/30 flex items-start gap-3 animate-slideUp">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-bold text-success">Report Downloaded Successfully!</p>
              <p className="text-success/80 text-xs mt-0.5">
                Included {reportData.bookingsCount} bookings generating ₹{reportData.totalRevenue}.
              </p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
