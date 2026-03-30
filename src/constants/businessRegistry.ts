import { BusinessCategory, Terminology, ServiceItem } from '../store/AppContext';

export interface BusinessCategoryInfo {
  id: BusinessCategory;
  icon: string;
  label: string;
  labelHi: string;
  terminology: Terminology;
  defaultServices: ServiceItem[];
  hasTimedSlots?: boolean;
  hasMenu?: boolean;
  hasEmergencySlot?: boolean;
  hasHomeService?: boolean;
  hasVideoConsult?: boolean;
  supportsGroupBooking?: boolean;
  hasCapacityLimit?: boolean;
  defaultWorkingHours?: { open: string; close: string };
  mostPopular?: boolean;
  tags?: string[];
  designTheme?: string;
  colorPrimary?: string;
  colorAccent?: string;
}

export const BUSINESS_CATEGORIES_INFO: BusinessCategoryInfo[] = [
  {
    id: 'men_salon',
    icon: '💈',
    label: "Men's Salon",
    labelHi: 'बार्बर / सैलून',
    terminology: { provider: 'Barber', action: 'Join Queue', noun: 'Queue', item: 'Service', unit: 'min' },
    defaultServices: [
      { id: '1', name: 'Hair Cut', price: 100, avgTime: 20 },
      { id: '2', name: 'Beard Trim', price: 50, avgTime: 15 },
      { id: '3', name: 'Hair Cut + Beard', price: 140, avgTime: 30 },
      { id: '4', name: 'Clean Shave', price: 60, avgTime: 15 },
      { id: '5', name: 'Head Massage', price: 80, avgTime: 20 },
      { id: '6', name: 'Hair Wash + Blow Dry', price: 120, avgTime: 25 },
      { id: '7', name: 'Hair Color Full', price: 600, avgTime: 60 },
      { id: '8', name: 'D-Tan Face Pack', price: 150, avgTime: 20 },
      { id: '9', name: 'Facial Gents', price: 300, avgTime: 40 },
      { id: '10', name: 'Kids Hair Cut', price: 70, avgTime: 15 },
      { id: '11', name: 'Hair Straightening', price: 1200, avgTime: 90 },
      { id: '12', name: 'Highlights', price: 800, avgTime: 75 },
    ],
    defaultWorkingHours: { open: '09:00', close: '21:00' },
    mostPopular: true,
    tags: ['hair', 'beard', 'shave', 'salon', 'barber', 'men'],
    designTheme: 'theme-beauty',
    colorPrimary: '#6C63FF',
  },
  {
    id: 'beauty_parlour',
    icon: '💅',
    label: 'Beauty Parlour',
    labelHi: 'ब्यूटी पार्लर',
    terminology: { provider: 'Stylist', action: 'Join Queue', noun: 'Queue', item: 'Service', unit: 'min' },
    hasHomeService: true,
    supportsGroupBooking: true,
    defaultServices: [
      { id: '1', name: 'Eyebrow Threading', price: 40, avgTime: 10 },
      { id: '2', name: 'Upper Lip Threading', price: 20, avgTime: 5 },
      { id: '3', name: 'Full Face Threading', price: 100, avgTime: 20 },
      { id: '4', name: 'Gold Facial', price: 700, avgTime: 50 },
      { id: '5', name: 'Basic Cleanup', price: 250, avgTime: 30 },
      { id: '6', name: 'Full Arms Waxing', price: 200, avgTime: 25 },
      { id: '7', name: 'Full Legs Waxing', price: 300, avgTime: 35 },
      { id: '8', name: 'Manicure', price: 300, avgTime: 30 },
      { id: '9', name: 'Pedicure', price: 400, avgTime: 40 },
      { id: '10', name: 'Bridal Makeup', price: 5000, avgTime: 120 },
      { id: '11', name: 'Party Makeup', price: 1500, avgTime: 60 },
      { id: '12', name: 'Mehndi Bridal Full', price: 2500, avgTime: 90 },
      { id: '13', name: 'Hair Color Global', price: 1200, avgTime: 90 },
      { id: '14', name: 'Keratin Treatment', price: 2500, avgTime: 120 },
      { id: '15', name: 'Nail Art per hand', price: 400, avgTime: 45 },
    ],
    defaultWorkingHours: { open: '09:00', close: '21:00' },
    mostPopular: true,
    tags: ['beauty', 'makeup', 'threading', 'waxing', 'facial', 'women'],
    designTheme: 'theme-beauty',
    colorPrimary: '#E91E63',
  },
  {
    id: 'clinic',
    icon: '🩺',
    label: 'Clinic / Doctor',
    labelHi: 'क्लिनिक / डॉक्टर',
    terminology: { provider: 'Doctor', action: 'Book Appt.', noun: 'Appointment', item: 'Consultation', unit: 'min' },
    hasTimedSlots: true,
    hasEmergencySlot: true,
    hasVideoConsult: true,
    defaultServices: [
      { id: '1', name: 'General Consultation', price: 400, avgTime: 15 },
      { id: '2', name: 'Follow-up', price: 200, avgTime: 10 },
      { id: '3', name: 'Pediatric Consult', price: 500, avgTime: 15 },
      { id: '4', name: 'Dermatology', price: 700, avgTime: 20 },
      { id: '5', name: 'Gynecology', price: 700, avgTime: 20 },
      { id: '6', name: 'Eye/Ophthalmology', price: 600, avgTime: 20 },
      { id: '7', name: 'ENT', price: 600, avgTime: 20 },
      { id: '8', name: 'Psychiatric', price: 1000, avgTime: 30 },
      { id: '9', name: 'Senior Citizen', price: 300, avgTime: 20 },
      { id: '10', name: 'Video Consult', price: 350, avgTime: 15 },
      { id: '11', name: 'Medical Certificate', price: 200, avgTime: 10 },
    ],
    defaultWorkingHours: { open: '09:00', close: '19:00' },
    mostPopular: true,
    tags: ['doctor', 'clinic', 'medical', 'health', 'appointment'],
    designTheme: 'theme-healthcare',
    colorPrimary: '#1976D2',
  },
  {
    id: 'restaurant',
    icon: '🍽️',
    label: 'Restaurant / Dhaba',
    labelHi: 'रेस्टोरेंट / ढाबा',
    terminology: { provider: 'Chef', action: 'Reserve Table', noun: 'Reservation', item: 'Dish', unit: 'min' },
    hasMenu: true,
    supportsGroupBooking: true,
    defaultServices: [
      { id: '1', name: 'Table for 2', price: 0, avgTime: 60 },
      { id: '2', name: 'Table for 4', price: 0, avgTime: 90 },
      { id: '3', name: 'Private Dining', price: 500, avgTime: 120 },
      { id: '4', name: 'Birthday Setup', price: 1000, avgTime: 180 },
      { id: '5', name: 'Buffet Slot', price: 299, avgTime: 90 },
    ],
    defaultWorkingHours: { open: '11:00', close: '23:00' },
    mostPopular: true,
    tags: ['food', 'restaurant', 'dhaba', 'eat', 'dinner', 'lunch'],
    designTheme: 'theme-food',
    colorPrimary: '#FF5722',
  },
  {
    id: 'gym',
    icon: '💪',
    label: 'Gym / Fitness Center',
    labelHi: 'जिम / फिटनेस सेंटर',
    terminology: { provider: 'Trainer', action: 'Book Slot', noun: 'Session', item: 'Workout', unit: 'min' },
    defaultServices: [
      { id: '1', name: 'Day Pass', price: 100, avgTime: 60 },
      { id: '2', name: 'Personal Training', price: 500, avgTime: 60 },
      { id: '3', name: 'Group Class', price: 150, avgTime: 45 },
      { id: '4', name: 'Monthly Member', price: 1200, avgTime: 43200 }, // 30 days in min
      { id: '5', name: 'Quarterly', price: 3000, avgTime: 129600 },
      { id: '6', name: 'Annual', price: 9000, avgTime: 525600 },
      { id: '7', name: 'Zumba Class', price: 200, avgTime: 45 },
      { id: '8', name: 'Boxing Session', price: 400, avgTime: 45 },
    ],
    defaultWorkingHours: { open: '05:00', close: '22:00' },
    mostPopular: true,
    tags: ['gym', 'fitness', 'workout', 'training', 'health'],
    designTheme: 'theme-fitness',
    colorPrimary: '#FF6F00',
  },
  {
    id: 'spa',
    icon: '🧖',
    label: 'Spa & Wellness',
    labelHi: 'स्पा',
    terminology: { provider: 'Therapist', action: 'Book Session', noun: 'Session', item: 'Treatment', unit: 'min' },
    hasTimedSlots: true,
    hasHomeService: true,
    defaultServices: [
      { id: '1', name: 'Swedish Massage', price: 1200, avgTime: 60 },
      { id: '2', name: 'Deep Tissue', price: 1500, avgTime: 60 },
      { id: '3', name: 'Hot Stone Therapy', price: 2000, avgTime: 90 },
      { id: '4', name: 'Aromatherapy', price: 1000, avgTime: 45 },
      { id: '5', name: 'Body Scrub', price: 800, avgTime: 45 },
      { id: '6', name: 'Couple Massage', price: 2500, avgTime: 90 },
      { id: '7', name: 'Foot Reflexology', price: 500, avgTime: 30 },
      { id: '8', name: 'Thai Massage', price: 1500, avgTime: 60 },
    ],
    defaultWorkingHours: { open: '10:00', close: '20:00' },
    tags: ['spa', 'massage', 'wellness', 'relax', 'therapy'],
    designTheme: 'theme-beauty',
    colorPrimary: '#E91E63',
  },
  {
    id: 'hospital',
    icon: '🏥',
    label: 'Hospital',
    labelHi: 'हॉस्पिटल',
    terminology: { provider: 'Specialist', action: 'Book Appt.', noun: 'Appointment', item: 'Test', unit: 'min' },
    hasTimedSlots: true,
    hasEmergencySlot: true,
    hasVideoConsult: true,
    hasHomeService: true,
    defaultServices: [
        { id: '1', name: 'OPD Consultation', price: 500, avgTime: 20 }
    ],
    defaultWorkingHours: { open: '00:00', close: '23:59' },
    tags: ['hospital', 'medical', 'emergency', 'doctor', 'care'],
    designTheme: 'theme-healthcare',
    colorPrimary: '#0D47A1',
  },
  {
    id: 'cafe',
    icon: '☕',
    label: 'Café / Coffee Shop',
    labelHi: 'कैफे',
    terminology: { provider: 'Barista', action: 'Reserve Seat', noun: 'Reservation', item: 'Item', unit: 'min' },
    hasMenu: true,
    defaultServices: [
      { id: '1', name: 'Dine-in Reservation', price: 0, avgTime: 60 },
      { id: '2', name: 'Work Slot', price: 99, avgTime: 120 },
      { id: '3', name: 'Private Event Booking', price: 2000, avgTime: 180 },
      { id: '4', name: 'Group Hangout', price: 0, avgTime: 120 },
    ],
    defaultWorkingHours: { open: '08:00', close: '22:00' },
    tags: ['cafe', 'coffee', 'tea', 'snacks', 'work'],
    designTheme: 'theme-food',
    colorPrimary: '#6F4E37',
  },
  {
    id: 'coaching',
    icon: '📚',
    label: 'Coaching / Tuition',
    labelHi: 'कोचिंग',
    terminology: { provider: 'Tutor', action: 'Enroll', noun: 'Batch', item: 'Subject', unit: 'min' },
    defaultServices: [
      { id: '1', name: 'Doubt Session', price: 200, avgTime: 60 },
      { id: '2', name: 'Demo Class', price: 0, avgTime: 60 },
      { id: '3', name: 'Monthly Batch', price: 1500, avgTime: 43200 },
      { id: '4', name: 'Weekly Package', price: 400, avgTime: 10080 },
    ],
    defaultWorkingHours: { open: '08:00', close: '20:00' },
    tags: ['education', 'tutor', 'school', 'learn', 'coaching'],
    designTheme: 'theme-education',
    colorPrimary: '#3F51B5',
  },
  {
    id: 'law_firm',
    icon: '⚖️',
    label: 'Lawyer / Law Firm',
    labelHi: 'वकील',
    terminology: { provider: 'Lawyer', action: 'Book Consultation', noun: 'Appointment', item: 'Case', unit: 'min' },
    hasTimedSlots: true,
    hasVideoConsult: true,
    defaultServices: [
        { id: '1', name: 'Initial Consultation', price: 1000, avgTime: 30 }
    ],
    defaultWorkingHours: { open: '09:00', close: '18:00' },
    tags: ['law', 'lawyer', 'legal', 'advocate', 'court'],
    designTheme: 'theme-finance',
    colorPrimary: '#212121',
  },
  {
    id: 'photography',
    icon: '📷',
    label: 'Photography Studio',
    labelHi: 'फोटोग्राफी',
    terminology: { provider: 'Photographer', action: 'Book Shoot', noun: 'Session', item: 'Package', unit: 'min' },
    defaultServices: [
      { id: '1', name: 'Passport Photo', price: 100, avgTime: 15 },
      { id: '2', name: 'Portfolio Shoot', price: 2000, avgTime: 120 },
      { id: '3', name: 'Event Photography', price: 5000, avgTime: 240 },
      { id: '4', name: 'Wedding Photography', price: 15000, avgTime: 1440 }, // 1 day
    ],
    defaultWorkingHours: { open: '10:00', close: '20:00' },
    tags: ['photo', 'studio', 'shoot', 'camera', 'wedding'],
    designTheme: 'theme-retail',
    colorPrimary: '#455A64',
  },
  {
    id: 'repair_shop',
    icon: '🔧',
    label: 'Repair Shop',
    labelHi: 'रिपेयर शॉप',
    terminology: { provider: 'Technician', action: 'Drop Device', noun: 'Job Card', item: 'Repair', unit: 'min' },
    defaultServices: [
        { id: '1', name: 'Diagnostic Check', price: 200, avgTime: 30 }
    ],
    defaultWorkingHours: { open: '10:00', close: '19:00' },
    tags: ['repair', 'fix', 'mobile', 'electronics', 'mechanic'],
    designTheme: 'theme-tech',
    colorPrimary: '#607D8B',
  },
  {
    id: 'laundry',
    icon: '👕',
    label: 'Laundry / Dry Cleaner',
    labelHi: 'लॉन्ड्री',
    terminology: { provider: 'Staff', action: 'Schedule Pickup', noun: 'Order', item: 'Item', unit: 'min' },
    hasHomeService: true,
    defaultServices: [
        { id: '1', name: 'Wash & Fold per kg', price: 60, avgTime: 1440 }
    ],
    defaultWorkingHours: { open: '09:00', close: '21:00' },
    tags: ['wash', 'clothes', 'dry clean', 'iron', 'laundry'],
    designTheme: 'theme-tech',
    colorPrimary: '#42A5F5',
  },
  {
    id: 'event_planner',
    icon: '🎪',
    label: 'Event Planner',
    labelHi: 'इवेंट प्लानर',
    terminology: { provider: 'Planner', action: 'Book Consultation', noun: 'Meeting', item: 'Event', unit: 'min' },
    defaultServices: [
        { id: '1', name: 'Event Consultation', price: 500, avgTime: 60 }
    ],
    defaultWorkingHours: { open: '10:00', close: '19:00' },
    tags: ['event', 'party', 'wedding', 'planner', 'organizer'],
    designTheme: 'theme-retail',
    colorPrimary: '#7B1FA2',
  },
  {
    id: 'pet_care',
    icon: '🐾',
    label: 'Pet Care / Vet',
    labelHi: 'पालतू देखभाल',
    terminology: { provider: 'Vet', action: 'Book Appointment', noun: 'Appointment', item: 'Checkup', unit: 'min' },
    hasTimedSlots: true,
    hasEmergencySlot: true,
    defaultServices: [
        { id: '1', name: 'General Checkup', price: 300, avgTime: 20 }
    ],
    defaultWorkingHours: { open: '09:00', close: '20:00' },
    tags: ['pet', 'dog', 'cat', 'vet', 'animal'],
    designTheme: 'theme-healthcare',
    colorPrimary: '#FF8F00',
  },
  {
    id: 'other',
    icon: '🏪',
    label: 'Other Business',
    labelHi: 'अन्य व्यवसाय',
    terminology: { provider: 'Staff', action: 'Book', noun: 'Booking', item: 'Service', unit: 'min' },
    defaultServices: [
        { id: '1', name: 'General Service', price: 100, avgTime: 30 }
    ],
    defaultWorkingHours: { open: '09:00', close: '20:00' },
    tags: ['business', 'shop', 'store'],
    designTheme: 'theme-retail',
    colorPrimary: '#607D8B',
  }
];

// Simplified ALL_BUSINESSES to the main categories to satisfy prompt while remaining concise
export const ALL_BUSINESSES = BUSINESS_CATEGORIES_INFO;
