// businessUIConfig.ts
// Maps businessType → dashboard-specific UI config

export interface BusinessDashboardConfig {
  // Header
  ownerTitle: string;        // "Doctor", "Chef", "Trainer", "Teacher"
  businessTitle: string;     // "My Clinic", "My Restaurant", "My Gym"

  // Stats labels on dashboard
  stats: {
    todayLabel: string;      // "Patients Today", "Orders Today", "Members Today"
    earningsLabel: string;   // "Today's Revenue", "Today's Fees"
    waitingLabel: string;    // "In Queue", "Waiting", "In Line"
    ratingLabel: string;     // "Rating", "Star Rating"
  };

  // Quick action buttons on dashboard
  quickActions: Array<{
    icon: string;
    label: string;
    route: string;           // relative route
  }>;

  // Customer info labels
  customerNoun: string;      // "Patient", "Customer", "Student", "Guest", "Client"
  tokenNoun: string;         // "Token", "Order", "Slot", "Booking", "Appointment"

  // Features to show/hide
  showMenu: boolean;         // Food businesses
  showAppointments: boolean; // Clinics, salons
  showInventory: boolean;    // Retail, pharmacies
  showStaff: boolean;        // Most businesses
  showGallery: boolean;      // Salons, studios
  showPortfolio: boolean;    // Photographers, designers
}

// Mapping: businessType ID → dashboard config
export const BUSINESS_DASHBOARD_CONFIG: Record<string, BusinessDashboardConfig> = {

  // ===== FOOD & RESTAURANT =====
  restaurant: {
    ownerTitle: 'Restaurant Manager',
    businessTitle: 'My Restaurant',
    stats: {
      todayLabel: 'Tables Today',
      earningsLabel: "Today's Revenue",
      waitingLabel: 'Tables Waiting',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '📋', label: 'Menu', route: '/barber/settings' },
      { icon: '🍽️', label: 'Tables', route: '/barber/customers' },
      { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
      { icon: '👨‍🍳', label: 'Staff', route: '/barber/staff' },
    ],
    customerNoun: 'Guest',
    tokenNoun: 'Table Booking',
    showMenu: true,
    showAppointments: false,
    showInventory: false,
    showStaff: true,
    showGallery: true,
    showPortfolio: false,
  },

  cafe: {
    ownerTitle: 'Café Owner',
    businessTitle: 'My Café',
    stats: {
      todayLabel: 'Customers Today',
      earningsLabel: "Today's Revenue",
      waitingLabel: 'In Queue',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '☕', label: 'Menu', route: '/barber/settings' },
      { icon: '👥', label: 'Customers', route: '/barber/customers' },
      { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
      { icon: '🖼️', label: 'Gallery', route: '/barber/gallery' },
    ],
    customerNoun: 'Guest',
    tokenNoun: 'Order',
    showMenu: true,
    showAppointments: false,
    showInventory: false,
    showStaff: true,
    showGallery: true,
    showPortfolio: false,
  },

  // ===== HEALTHCARE =====
  clinic: {
    ownerTitle: 'Doctor / Clinic',
    businessTitle: 'My Clinic',
    stats: {
      todayLabel: 'Patients Today',
      earningsLabel: 'Today\'s Fees',
      waitingLabel: 'Patients Waiting',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '🩺', label: 'Patients', route: '/barber/customers' },
      { icon: '📋', label: 'Records', route: '/barber/settings' },
      { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
      { icon: '👥', label: 'Staff', route: '/barber/staff' },
    ],
    customerNoun: 'Patient',
    tokenNoun: 'Appointment',
    showMenu: false,
    showAppointments: true,
    showInventory: false,
    showStaff: true,
    showGallery: false,
    showPortfolio: false,
  },

  hospital: {
    ownerTitle: 'Hospital Admin',
    businessTitle: 'My Hospital',
    stats: {
      todayLabel: 'Patients Today',
      earningsLabel: 'Today\'s Revenue',
      waitingLabel: 'In OPD Queue',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '🏥', label: 'OPD Queue', route: '/barber/customers' },
      { icon: '👨‍⚕️', label: 'Doctors', route: '/barber/staff' },
      { icon: '📋', label: 'Departments', route: '/barber/settings' },
      { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
    ],
    customerNoun: 'Patient',
    tokenNoun: 'OPD Token',
    showMenu: false,
    showAppointments: true,
    showInventory: false,
    showStaff: true,
    showGallery: false,
    showPortfolio: false,
  },

  pharmacy: {
    ownerTitle: 'Pharmacist',
    businessTitle: 'My Medical Store',
    stats: {
      todayLabel: 'Customers Today',
      earningsLabel: "Today's Sales",
      waitingLabel: 'In Queue',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '💊', label: 'Inventory', route: '/barber/settings' },
      { icon: '👥', label: 'Customers', route: '/barber/customers' },
      { icon: '📊', label: 'Sales', route: '/barber/analytics' },
      { icon: '📦', label: 'Orders', route: '/barber/staff' },
    ],
    customerNoun: 'Customer',
    tokenNoun: 'Token',
    showMenu: false,
    showAppointments: false,
    showInventory: true,
    showStaff: true,
    showGallery: false,
    showPortfolio: false,
  },

  // ===== BEAUTY & WELLNESS =====
  men_salon: {
    ownerTitle: 'Salon Owner',
    businessTitle: 'My Salon',
    stats: {
      todayLabel: 'Customers Today',
      earningsLabel: "Today's Revenue",
      waitingLabel: 'In Queue',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '✂️', label: 'Queue', route: '/barber/customers' },
      { icon: '🖼️', label: 'Gallery', route: '/barber/gallery' },
      { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
      { icon: '👥', label: 'Staff', route: '/barber/staff' },
    ],
    customerNoun: 'Customer',
    tokenNoun: 'Token',
    showMenu: false,
    showAppointments: true,
    showInventory: false,
    showStaff: true,
    showGallery: true,
    showPortfolio: false,
  },

  beauty_parlour: {
    ownerTitle: 'Parlour Owner',
    businessTitle: 'My Beauty Parlour',
    stats: {
      todayLabel: 'Clients Today',
      earningsLabel: "Today's Revenue",
      waitingLabel: 'In Queue',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '💄', label: 'Appointments', route: '/barber/customers' },
      { icon: '🖼️', label: 'Portfolio', route: '/barber/gallery' },
      { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
      { icon: '👥', label: 'Staff', route: '/barber/staff' },
    ],
    customerNoun: 'Client',
    tokenNoun: 'Appointment',
    showMenu: false,
    showAppointments: true,
    showInventory: false,
    showStaff: true,
    showGallery: true,
    showPortfolio: true,
  },

  // ===== EDUCATION =====
  coaching_institute: {
    ownerTitle: 'Institute Director',
    businessTitle: 'My Coaching Center',
    stats: {
      todayLabel: 'Students Today',
      earningsLabel: "Today's Fees",
      waitingLabel: 'In Queue',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '📚', label: 'Students', route: '/barber/customers' },
      { icon: '📅', label: 'Batches', route: '/barber/settings' },
      { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
      { icon: '👩‍🏫', label: 'Teachers', route: '/barber/staff' },
    ],
    customerNoun: 'Student',
    tokenNoun: 'Slot',
    showMenu: false,
    showAppointments: true,
    showInventory: false,
    showStaff: true,
    showGallery: false,
    showPortfolio: false,
  },

  // ===== FITNESS =====
  gym: {
    ownerTitle: 'Gym Owner',
    businessTitle: 'My Gym',
    stats: {
      todayLabel: 'Members Today',
      earningsLabel: "Today's Revenue",
      waitingLabel: 'Active Now',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '💪', label: 'Members', route: '/barber/customers' },
      { icon: '📋', label: 'Plans', route: '/barber/settings' },
      { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
      { icon: '🏋️', label: 'Trainers', route: '/barber/staff' },
    ],
    customerNoun: 'Member',
    tokenNoun: 'Session',
    showMenu: false,
    showAppointments: false,
    showInventory: false,
    showStaff: true,
    showGallery: true,
    showPortfolio: false,
  },

  // ===== RETAIL =====
  grocery: {
    ownerTitle: 'Store Owner',
    businessTitle: 'My Kirana Store',
    stats: {
      todayLabel: 'Customers Today',
      earningsLabel: "Today's Sales",
      waitingLabel: 'In Queue',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '🛒', label: 'Queue', route: '/barber/customers' },
      { icon: '📦', label: 'Inventory', route: '/barber/settings' },
      { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
      { icon: '👥', label: 'Staff', route: '/barber/staff' },
    ],
    customerNoun: 'Customer',
    tokenNoun: 'Token',
    showMenu: false,
    showAppointments: false,
    showInventory: true,
    showStaff: false,
    showGallery: false,
    showPortfolio: false,
  },

  // ===== HOME SERVICES =====
  electrician: {
    ownerTitle: 'Electrician',
    businessTitle: 'My Service',
    stats: {
      todayLabel: 'Jobs Today',
      earningsLabel: "Today's Earnings",
      waitingLabel: 'Pending Jobs',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '⚡', label: 'Jobs', route: '/barber/customers' },
      { icon: '📍', label: 'Visits', route: '/barber/settings' },
      { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
      { icon: '💬', label: 'Messages', route: '/barber/messages' },
    ],
    customerNoun: 'Client',
    tokenNoun: 'Job',
    showMenu: false,
    showAppointments: true,
    showInventory: false,
    showStaff: false,
    showGallery: true,
    showPortfolio: true,
  },

  // ===== HOSPITALITY =====
  hotel: {
    ownerTitle: 'Hotel Manager',
    businessTitle: 'My Hotel',
    stats: {
      todayLabel: 'Guests Today',
      earningsLabel: "Today's Revenue",
      waitingLabel: 'Awaiting Check-in',
      ratingLabel: 'Rating',
    },
    quickActions: [
      { icon: '🏨', label: 'Bookings', route: '/barber/customers' },
      { icon: '🛏️', label: 'Rooms', route: '/barber/settings' },
      { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
      { icon: '👨‍💼', label: 'Staff', route: '/barber/staff' },
    ],
    customerNoun: 'Guest',
    tokenNoun: 'Booking',
    showMenu: true,
    showAppointments: true,
    showInventory: false,
    showStaff: true,
    showGallery: true,
    showPortfolio: false,
  },
};

// DEFAULT config for businesses not in the map
export const DEFAULT_DASHBOARD_CONFIG: BusinessDashboardConfig = {
  ownerTitle: 'Business Owner',
  businessTitle: 'My Business',
  stats: {
    todayLabel: 'Customers Today',
    earningsLabel: "Today's Revenue",
    waitingLabel: 'In Queue',
    ratingLabel: 'Rating',
  },
  quickActions: [
    { icon: '👥', label: 'Customers', route: '/barber/customers' },
    { icon: '⚙️', label: 'Settings', route: '/barber/settings' },
    { icon: '📊', label: 'Analytics', route: '/barber/analytics' },
    { icon: '💬', label: 'Messages', route: '/barber/messages' },
  ],
  customerNoun: 'Customer',
  tokenNoun: 'Token',
  showMenu: false,
  showAppointments: false,
  showInventory: false,
  showStaff: true,
  showGallery: false,
  showPortfolio: false,
};

// Helper function to get config for any business type
export function getBusinessDashboardConfig(businessType: string): BusinessDashboardConfig {
  return BUSINESS_DASHBOARD_CONFIG[businessType] || DEFAULT_DASHBOARD_CONFIG;
}