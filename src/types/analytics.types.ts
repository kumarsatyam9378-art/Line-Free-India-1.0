export interface DailyRevenue {
  date: string; // ISO format date string, e.g. YYYY-MM-DD
  totalRevenue: number;
  totalBookings: number;
}

export interface ServicePopularity {
  serviceId: string;
  serviceName: string;
  bookingCount: number;
  revenue: number;
}

export interface PeakHour {
  hour: number; // 0-23
  bookingCount: number;
}

export interface CustomerStats {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
}