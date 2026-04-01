import { BusinessCategory, Terminology, ServiceItem } from '../store/AppContext';

export interface BusinessCategoryInfo {
  id: BusinessCategory;
  icon: string;
  label: string;
  labelHi: string;
  category?: string;
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
    "id": "skin_clinic",
    "category": "specialized",
    "icon": "✨",
    "label": "Skin Clinic",
    "labelHi": "Skin Clinic",
    "terminology": {
      "provider": "Doctor",
      "action": "Book Appt.",
      "noun": "Appointment",
      "item": "Consultation",
      "unit": "min",
      "customer": "Patient"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Skin Analysis",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Acne Treatment",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Pigmentation",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "PRP",
        "price": 5000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "healthcare",
      "skin clinic"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#EC407A",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "men_salon",
    "category": "beauty",
    "icon": "💈",
    "label": "Men's Salon",
    "labelHi": "बार्बर / सैलून",
    "terminology": {
      "provider": "Barber",
      "action": "Join Queue",
      "noun": "Queue",
      "item": "Service",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Hair Cut",
        "price": 100,
        "avgTime": 20
      },
      {
        "id": "2",
        "name": "Beard Trim",
        "price": 50,
        "avgTime": 15
      },
      {
        "id": "3",
        "name": "Hair Cut + Beard",
        "price": 140,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Clean Shave",
        "price": 60,
        "avgTime": 15
      },
      {
        "id": "5",
        "name": "Head Massage",
        "price": 80,
        "avgTime": 20
      },
      {
        "id": "6",
        "name": "Hair Wash + Blow Dry",
        "price": 120,
        "avgTime": 25
      },
      {
        "id": "7",
        "name": "Hair Color Full",
        "price": 600,
        "avgTime": 60
      },
      {
        "id": "8",
        "name": "D-Tan Face Pack",
        "price": 150,
        "avgTime": 20
      },
      {
        "id": "9",
        "name": "Facial Gents",
        "price": 300,
        "avgTime": 40
      },
      {
        "id": "10",
        "name": "Kids Hair Cut",
        "price": 70,
        "avgTime": 15
      },
      {
        "id": "11",
        "name": "Hair Straightening",
        "price": 1200,
        "avgTime": 90
      },
      {
        "id": "12",
        "name": "Highlights",
        "price": 800,
        "avgTime": 75
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "21:00"
    },
    "mostPopular": true,
    "tags": [
      "hair",
      "beard",
      "shave",
      "salon",
      "barber",
      "men"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#6C63FF",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "beauty_parlour",
    "category": "beauty",
    "icon": "💅",
    "label": "Beauty Parlour",
    "labelHi": "ब्यूटी पार्लर",
    "terminology": {
      "provider": "Stylist",
      "action": "Join Queue",
      "noun": "Queue",
      "item": "Service",
      "unit": "min",
      "customer": "Customer"
    },
    "hasHomeService": true,
    "supportsGroupBooking": true,
    "defaultServices": [
      {
        "id": "1",
        "name": "Eyebrow Threading",
        "price": 40,
        "avgTime": 10
      },
      {
        "id": "2",
        "name": "Upper Lip Threading",
        "price": 20,
        "avgTime": 5
      },
      {
        "id": "3",
        "name": "Full Face Threading",
        "price": 100,
        "avgTime": 20
      },
      {
        "id": "4",
        "name": "Gold Facial",
        "price": 700,
        "avgTime": 50
      },
      {
        "id": "5",
        "name": "Basic Cleanup",
        "price": 250,
        "avgTime": 30
      },
      {
        "id": "6",
        "name": "Full Arms Waxing",
        "price": 200,
        "avgTime": 25
      },
      {
        "id": "7",
        "name": "Full Legs Waxing",
        "price": 300,
        "avgTime": 35
      },
      {
        "id": "8",
        "name": "Manicure",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "9",
        "name": "Pedicure",
        "price": 400,
        "avgTime": 40
      },
      {
        "id": "10",
        "name": "Bridal Makeup",
        "price": 5000,
        "avgTime": 120
      },
      {
        "id": "11",
        "name": "Party Makeup",
        "price": 1500,
        "avgTime": 60
      },
      {
        "id": "12",
        "name": "Mehndi Bridal Full",
        "price": 2500,
        "avgTime": 90
      },
      {
        "id": "13",
        "name": "Hair Color Global",
        "price": 1200,
        "avgTime": 90
      },
      {
        "id": "14",
        "name": "Keratin Treatment",
        "price": 2500,
        "avgTime": 120
      },
      {
        "id": "15",
        "name": "Nail Art per hand",
        "price": 400,
        "avgTime": 45
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "21:00"
    },
    "mostPopular": true,
    "tags": [
      "beauty",
      "makeup",
      "threading",
      "waxing",
      "facial",
      "women"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#E91E63",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasVideoConsult": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "spa",
    "category": "beauty",
    "icon": "🧖",
    "label": "Spa & Wellness",
    "labelHi": "स्पा",
    "terminology": {
      "provider": "Therapist",
      "action": "Book Session",
      "noun": "Session",
      "item": "Treatment",
      "unit": "min",
      "customer": "Customer"
    },
    "hasTimedSlots": true,
    "hasHomeService": true,
    "defaultServices": [
      {
        "id": "1",
        "name": "Swedish Massage",
        "price": 1200,
        "avgTime": 60
      },
      {
        "id": "2",
        "name": "Deep Tissue",
        "price": 1500,
        "avgTime": 60
      },
      {
        "id": "3",
        "name": "Hot Stone Therapy",
        "price": 2000,
        "avgTime": 90
      },
      {
        "id": "4",
        "name": "Aromatherapy",
        "price": 1000,
        "avgTime": 45
      },
      {
        "id": "5",
        "name": "Body Scrub",
        "price": 800,
        "avgTime": 45
      },
      {
        "id": "6",
        "name": "Couple Massage",
        "price": 2500,
        "avgTime": 90
      },
      {
        "id": "7",
        "name": "Foot Reflexology",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "8",
        "name": "Thai Massage",
        "price": 1500,
        "avgTime": 60
      }
    ],
    "defaultWorkingHours": {
      "open": "10:00",
      "close": "20:00"
    },
    "tags": [
      "spa",
      "massage",
      "wellness",
      "relax",
      "therapy"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#E91E63",
    "hasEmergencySlot": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "nail_studio",
    "category": "beauty",
    "icon": "💅",
    "label": "Nail Studio",
    "labelHi": "Nail Studio",
    "terminology": {
      "provider": "Stylist",
      "action": "Book Slot",
      "noun": "Session",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Basic Manicure",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Gel Nails",
        "price": 600,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Nail Art",
        "price": 400,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Pedicure",
        "price": 400,
        "avgTime": 30
      },
      {
        "id": "5",
        "name": "Nail Extensions",
        "price": 1200,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "beauty",
      "nail studio"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#F06292",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "tattoo_studio",
    "category": "beauty",
    "icon": "🖊️",
    "label": "Tattoo Studio",
    "labelHi": "Tattoo Studio",
    "terminology": {
      "provider": "Stylist",
      "action": "Book Slot",
      "noun": "Session",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Small Tattoo",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Medium",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Large",
        "price": 5000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Removal",
        "price": 3000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "beauty",
      "tattoo studio"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#212121",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "mehndi_artist",
    "category": "beauty",
    "icon": "🌺",
    "label": "Mehndi Artist",
    "labelHi": "Mehndi Artist",
    "terminology": {
      "provider": "Stylist",
      "action": "Book Slot",
      "noun": "Session",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Bridal Mehndi",
        "price": 2500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Party Hands",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Simple Design",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Arabic Design",
        "price": 800,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "beauty",
      "mehndi artist"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#C0392B",
    "hasHomeService": true,
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "bridal_studio",
    "category": "beauty",
    "icon": "👰",
    "label": "Bridal Studio",
    "labelHi": "Bridal Studio",
    "terminology": {
      "provider": "Stylist",
      "action": "Book Slot",
      "noun": "Session",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Bridal Makeup",
        "price": 8000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Engagement Look",
        "price": 4000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Reception",
        "price": 6000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Pre-Bridal Package",
        "price": 15000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "beauty",
      "bridal studio"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#9B59B6",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "massage_center",
    "category": "beauty",
    "icon": "💆",
    "label": "Massage Center",
    "labelHi": "Massage Center",
    "terminology": {
      "provider": "Stylist",
      "action": "Book Slot",
      "noun": "Session",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Full Body",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Head Massage",
        "price": 400,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Foot Massage",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Couple",
        "price": 2000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "beauty",
      "massage center"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#6D4C41",
    "hasTimedSlots": true,
    "hasHomeService": true,
    "hasEmergencySlot": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "laser_hair_removal",
    "category": "specialized",
    "icon": "✨",
    "label": "Laser Hair Removal",
    "labelHi": "Laser Hair Removal",
    "terminology": {
      "provider": "Stylist",
      "action": "Book Slot",
      "noun": "Session",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Upper Lip",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Full Arms",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Full Legs",
        "price": 3000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Full Body",
        "price": 8000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "beauty",
      "laser hair_removal"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#E040FB",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "ayurvedic_spa",
    "category": "specialized",
    "icon": "🌿",
    "label": "Ayurvedic Spa",
    "labelHi": "Ayurvedic Spa",
    "terminology": {
      "provider": "Stylist",
      "action": "Book Slot",
      "noun": "Session",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Abhyanga",
        "price": 1200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Shirodhara",
        "price": 1800,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Udwarthanam",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Kerala Massage",
        "price": 2000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "beauty",
      "ayurvedic spa"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#558B2F",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "slimming_center",
    "category": "specialized",
    "icon": "⚡",
    "label": "Slimming Center",
    "labelHi": "Slimming Center",
    "terminology": {
      "provider": "Trainer",
      "action": "Book Class",
      "noun": "Session",
      "item": "Workout",
      "unit": "min",
      "customer": "Member"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Body Analysis",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "LPG Session",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Cavitation",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Weight Loss Package",
        "price": 15000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "fitness",
      "slimming center"
    ],
    "designTheme": "theme-fitness",
    "colorPrimary": "#FF6F00",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "unisex_salon",
    "category": "beauty",
    "icon": "✨",
    "label": "Unisex Salon",
    "labelHi": "Unisex Salon",
    "terminology": {
      "provider": "Expert",
      "action": "Book",
      "noun": "Appointment",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "General Consultation",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "10:00",
      "close": "20:00"
    },
    "tags": [
      "unisex salon",
      "service"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#E91E63",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "acupuncture_clinic",
    "category": "healthcare",
    "icon": "✨",
    "label": "Acupuncture Clinic",
    "labelHi": "Acupuncture Clinic",
    "terminology": {
      "provider": "Expert",
      "action": "Book",
      "noun": "Appointment",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "General Consultation",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "10:00",
      "close": "20:00"
    },
    "tags": [
      "acupuncture clinic",
      "service"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#E91E63",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "makeup_artist",
    "category": "beauty",
    "icon": "✨",
    "label": "Makeup Artist",
    "labelHi": "Makeup Artist",
    "terminology": {
      "provider": "Expert",
      "action": "Book",
      "noun": "Appointment",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "General Consultation",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "10:00",
      "close": "20:00"
    },
    "tags": [
      "makeup artist",
      "service"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#E91E63",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "threading_waxing_center",
    "category": "beauty",
    "icon": "✨",
    "label": "Threading Waxing Center",
    "labelHi": "Threading Waxing Center",
    "terminology": {
      "provider": "Expert",
      "action": "Book",
      "noun": "Appointment",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "General Consultation",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "10:00",
      "close": "20:00"
    },
    "tags": [
      "threading waxing center",
      "service"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#E91E63",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "hair_transplant_clinic",
    "category": "healthcare",
    "icon": "✨",
    "label": "Hair Transplant Clinic",
    "labelHi": "Hair Transplant Clinic",
    "terminology": {
      "provider": "Expert",
      "action": "Book",
      "noun": "Appointment",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "General Consultation",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "10:00",
      "close": "20:00"
    },
    "tags": [
      "hair transplant clinic",
      "service"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#E91E63",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 },
  {
    "id": "home_salon_service",
    "category": "beauty",
    "icon": "✨",
    "label": "Home Salon Service",
    "labelHi": "Home Salon Service",
    "terminology": {
      "provider": "Expert",
      "action": "Book",
      "noun": "Appointment",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "General Consultation",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "10:00",
      "close": "20:00"
    },
    "tags": [
      "home salon service",
      "service"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#E91E63",
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasHomeService": true,
    "hasVideoConsult": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true,
    "hasMenu": true
 }
];

export const ALL_BUSINESSES = BUSINESS_CATEGORIES_INFO;
