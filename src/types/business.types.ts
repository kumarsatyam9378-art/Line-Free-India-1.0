export type BusinessCategory =
  | 'men_salon' | 'beauty_parlour' | 'clinic' | 'restaurant' | 'cafe'
  | 'dhaba' | 'fast_food' | 'sweet_shop' | 'juice_bar' | 'bakery'
  | 'dental_clinic' | 'eye_clinic' | 'physiotherapy' | 'ayurveda_clinic'
  | 'pharmacy' | 'lab_diagnostic' | 'nursing_home' | 'skin_clinic'
  | 'nail_studio' | 'tattoo_studio' | 'mehndi_artist' | 'bridal_studio'
  | 'spa' | 'yoga_studio' | 'meditation_center' | 'slimming_center'
  | 'gym' | 'crossfit_gym' | 'sports_academy' | 'boxing_gym'
  | 'swimming_pool' | 'dance_studio' | 'martial_arts'
  | 'coaching' | 'music_school' | 'art_classes' | 'language_classes'
  | 'computer_classes' | 'driving_school' | 'neet_coaching' | 'jee_coaching'
  | 'clothing_store' | 'footwear_shop' | 'jewelry_shop' | 'electronics_store'
  | 'mobile_shop' | 'grocery_store' | 'hardware_store' | 'stationery_shop'
  | 'book_shop' | 'toy_store' | 'furniture_shop' | 'flower_shop'
  | 'plumber' | 'electrician' | 'carpenter' | 'painter'
  | 'home_cleaning' | 'pest_control' | 'laundry' | 'ac_repair'
  | 'taxi_service' | 'auto_rickshaw' | 'travel_agency' | 'car_rental'
  | 'law_firm' | 'ca_firm' | 'insurance_agent' | 'tax_consultant'
  | 'real_estate_agent' | 'property_dealer' | 'pg_hostel' | 'co_working_space'
  | 'repair_shop' | 'computer_repair' | 'it_company' | 'web_designer'
  | 'hotel' | 'resort' | 'banquet_hall' | 'wedding_venue'
  | 'hospital' | 'photography' | 'event_planner' | 'pet_care' | 'other';

export interface ServiceItem {
  id: string;
  name: string;
  nameHi?: string;
  description?: string;
  price: number;
  discountPrice?: number;
  avgTime: number;
  photoUrl?: string;
  isActive: boolean;
  category?: string;
  tags?: string[];
}

export interface WorkingHoursDay {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface WorkingHours {
  monday: WorkingHoursDay;
  tuesday: WorkingHoursDay;
  wednesday: WorkingHoursDay;
  thursday: WorkingHoursDay;
  friday: WorkingHoursDay;
  saturday: WorkingHoursDay;
  sunday: WorkingHoursDay;
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  businessNameHi?: string;
  businessType: BusinessCategory;
  category: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  ownerPhoto?: string;
  description?: string;
  descriptionHi?: string;
  tagline?: string;
  establishedYear?: number;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  logoUrl?: string;
  coverPhotoUrl?: string;
  galleryUrls?: string[];
  services: ServiceItem[];
  workingHours?: WorkingHours;
  holidays?: string[];
  maxCapacity?: number;
  avgServiceTime?: number;
  autoConfirm?: boolean;
  totalBookings: number;
  totalRevenue: number;
  avgRating: number;
  totalReviews: number;
  subscriptionPlan: 'free' | 'basic' | 'pro' | 'elite';
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  isPaused: boolean;
  createdAt: any;
  updatedAt: any;
}
