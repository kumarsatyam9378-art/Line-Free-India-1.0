export interface BusinessDashboardConfig {
  ownerTitle: string;
  todayLabel: string;
  waitingLabel: string;
  earningsLabel: string;
  customerNoun: string;
  tokenNoun: string;
}

export const BUSINESS_DASHBOARD_CONFIG: Record<string, BusinessDashboardConfig> = {
  restaurant:          { ownerTitle: 'Restaurant Manager', todayLabel: 'Tables Today', waitingLabel: 'Tables Waiting', earningsLabel: "Today's Revenue", customerNoun: 'Guest', tokenNoun: 'Table Booking' },
  cafe:                { ownerTitle: 'Café Owner', todayLabel: 'Customers Today', waitingLabel: 'In Queue', earningsLabel: "Today's Revenue", customerNoun: 'Guest', tokenNoun: 'Order' },
  clinic:              { ownerTitle: 'Doctor / Clinic', todayLabel: 'Patients Today', waitingLabel: 'Patients Waiting', earningsLabel: "Today's Fees", customerNoun: 'Patient', tokenNoun: 'Appointment' },
  hospital:            { ownerTitle: 'Hospital Admin', todayLabel: 'Patients Today', waitingLabel: 'In OPD Queue', earningsLabel: "Today's Revenue", customerNoun: 'Patient', tokenNoun: 'OPD Token' },
  dental_clinic:       { ownerTitle: 'Dentist', todayLabel: 'Patients Today', waitingLabel: 'Patients Waiting', earningsLabel: "Today's Fees", customerNoun: 'Patient', tokenNoun: 'Appointment' },
  pharmacy:            { ownerTitle: 'Pharmacist', todayLabel: 'Customers Today', waitingLabel: 'In Queue', earningsLabel: "Today's Sales", customerNoun: 'Customer', tokenNoun: 'Token' },
  men_salon:           { ownerTitle: 'Salon Owner', todayLabel: 'Customers Today', waitingLabel: 'In Queue', earningsLabel: "Today's Revenue", customerNoun: 'Customer', tokenNoun: 'Token' },
  beauty_parlour:      { ownerTitle: 'Parlour Owner', todayLabel: 'Clients Today', waitingLabel: 'In Queue', earningsLabel: "Today's Revenue", customerNoun: 'Client', tokenNoun: 'Appointment' },
  unisex_salon:        { ownerTitle: 'Salon Owner', todayLabel: 'Clients Today', waitingLabel: 'In Queue', earningsLabel: "Today's Revenue", customerNoun: 'Client', tokenNoun: 'Token' },
  spa:                 { ownerTitle: 'Spa Owner', todayLabel: 'Clients Today', waitingLabel: 'Awaiting Session', earningsLabel: "Today's Revenue", customerNoun: 'Client', tokenNoun: 'Session' },
  coaching_institute:  { ownerTitle: 'Institute Director', todayLabel: 'Students Today', waitingLabel: 'In Queue', earningsLabel: "Today's Fees", customerNoun: 'Student', tokenNoun: 'Slot' },
  school:              { ownerTitle: 'School Admin', todayLabel: 'Students Today', waitingLabel: 'In Queue', earningsLabel: "Today's Fees", customerNoun: 'Student', tokenNoun: 'Slot' },
  yoga_studio:         { ownerTitle: 'Yoga Instructor', todayLabel: 'Members Today', waitingLabel: 'In Queue', earningsLabel: "Today's Fees", customerNoun: 'Member', tokenNoun: 'Session' },
  gym:                 { ownerTitle: 'Gym Owner', todayLabel: 'Members Today', waitingLabel: 'Active Now', earningsLabel: "Today's Revenue", customerNoun: 'Member', tokenNoun: 'Session' },
  grocery:             { ownerTitle: 'Store Owner', todayLabel: 'Customers Today', waitingLabel: 'In Queue', earningsLabel: "Today's Sales", customerNoun: 'Customer', tokenNoun: 'Token' },
  medical_store:       { ownerTitle: 'Store Owner', todayLabel: 'Customers Today', waitingLabel: 'In Queue', earningsLabel: "Today's Sales", customerNoun: 'Customer', tokenNoun: 'Token' },
  hotel:               { ownerTitle: 'Hotel Manager', todayLabel: 'Guests Today', waitingLabel: 'Awaiting Check-in', earningsLabel: "Today's Revenue", customerNoun: 'Guest', tokenNoun: 'Booking' },
  ca_firm:             { ownerTitle: 'CA / Consultant', todayLabel: 'Clients Today', waitingLabel: 'Waiting', earningsLabel: "Today's Fees", customerNoun: 'Client', tokenNoun: 'Appointment' },
  lawyer:              { ownerTitle: 'Advocate', todayLabel: 'Clients Today', waitingLabel: 'Waiting', earningsLabel: "Today's Fees", customerNoun: 'Client', tokenNoun: 'Appointment' },
  electrician:         { ownerTitle: 'Electrician', todayLabel: 'Jobs Today', waitingLabel: 'Pending Jobs', earningsLabel: "Today's Earnings", customerNoun: 'Client', tokenNoun: 'Job' },
  plumber:             { ownerTitle: 'Plumber', todayLabel: 'Jobs Today', waitingLabel: 'Pending Jobs', earningsLabel: "Today's Earnings", customerNoun: 'Client', tokenNoun: 'Job' },
  veterinary_clinic:   { ownerTitle: 'Veterinarian', todayLabel: 'Patients Today', waitingLabel: 'Patients Waiting', earningsLabel: "Today's Fees", customerNoun: 'Patient', tokenNoun: 'Appointment' },
};

export const DEFAULT_DASHBOARD_CONFIG: BusinessDashboardConfig = {
  ownerTitle: 'Business Owner',
  todayLabel: 'Customers Today',
  waitingLabel: 'In Queue',
  earningsLabel: "Today's Revenue",
  customerNoun: 'Customer',
  tokenNoun: 'Token'
};

export function getBusinessDashboardConfig(businessType: string): BusinessDashboardConfig {
  return BUSINESS_DASHBOARD_CONFIG[businessType] ?? DEFAULT_DASHBOARD_CONFIG;
}
