// src/utils/analytics.ts
export interface Booking {
  id: string;
  createdAt: number;
  date: string;
  time: string;
  status: 'completed' | 'cancelled' | 'no-show' | 'booked';
  totalPrice: number;
  services: { id: string; name: string; price: number }[];
  customerId: string;
}

export function calculateDailyRevenue(bookings: Booking[], days: number = 7) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const data = Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().slice(0, 10);
    return {
      date: dateStr,
      revenue: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
    };
  });

  const dataMap = new Map(data.map((d) => [d.date, d]));

  bookings.forEach((b) => {
    const dateStr = b.date;
    const entry = dataMap.get(dateStr);
    if (entry) {
      if (b.status === 'completed') {
        entry.revenue += b.totalPrice || 0;
        entry.completed += 1;
      } else if (b.status === 'cancelled') {
        entry.cancelled += 1;
      } else if (b.status === 'no-show') {
        entry.noShow += 1;
      }
    }
  });

  return Array.from(dataMap.values());
}

export function findPeakHours(bookings: Booking[]) {
  // 7 days (0=Sun to 6=Sat), 17 hours (6=6 AM to 22=10 PM)
  const heatmap: { day: number; hour: number; count: number }[] = [];

  for (let d = 0; d < 7; d++) {
    for (let h = 6; h <= 22; h++) {
      heatmap.push({ day: d, hour: h, count: 0 });
    }
  }

  const map = new Map(heatmap.map((h) => [`${h.day}-${h.hour}`, h]));

  bookings.forEach((b) => {
    if (b.status !== 'completed' && b.status !== 'booked') return;

    const dt = new Date(b.date + 'T' + (b.time || '00:00') + ':00');
    if (isNaN(dt.getTime())) return; // invalid date

    const day = dt.getDay();
    let hour = dt.getHours();

    // Floor to closest hour mapped to our range
    if (hour < 6) hour = 6;
    if (hour > 22) hour = 22;

    const entry = map.get(`${day}-${hour}`);
    if (entry) {
      entry.count += 1;
    }
  });

  return heatmap;
}

export function getServiceBreakdown(bookings: Booking[]) {
  const serviceMap = new Map<string, { name: string; revenue: number; count: number }>();

  bookings.forEach((b) => {
    if (b.status !== 'completed') return;

    if (b.services) {
      b.services.forEach((s) => {
        const existing = serviceMap.get(s.name) || { name: s.name, revenue: 0, count: 0 };
        existing.revenue += s.price || 0;
        existing.count += 1;
        serviceMap.set(s.name, existing);
      });
    }
  });

  return Array.from(serviceMap.values()).sort((a, b) => b.revenue - a.revenue);
}

export function calculateRetentionRate(bookings: Booking[]) {
  // Group by customer
  const customerBookings = new Map<string, number>();

  bookings.forEach((b) => {
    if (b.status !== 'completed') return;
    if (!b.customerId) return;

    const count = customerBookings.get(b.customerId) || 0;
    customerBookings.set(b.customerId, count + 1);
  });

  let totalCustomers = 0;
  let repeatCustomers = 0;

  customerBookings.forEach((count) => {
    totalCustomers++;
    if (count > 1) {
      repeatCustomers++;
    }
  });

  const retentionRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

  return {
    totalCustomers,
    repeatCustomers,
    retentionRate,
  };
}
