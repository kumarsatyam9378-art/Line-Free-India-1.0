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
    "id": "restaurant",
    "icon": "🍽️",
    "label": "Restaurant / Dhaba",
    "labelHi": "रेस्टोरेंट / ढाबा",
    "terminology": {
      "provider": "Chef",
      "action": "Reserve Table",
      "noun": "Reservation",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "hasMenu": true,
    "supportsGroupBooking": true,
    "defaultServices": [
      {
        "id": "1",
        "name": "Table for 2",
        "price": 0,
        "avgTime": 60
      },
      {
        "id": "2",
        "name": "Table for 4",
        "price": 0,
        "avgTime": 90
      },
      {
        "id": "3",
        "name": "Private Dining",
        "price": 500,
        "avgTime": 120
      },
      {
        "id": "4",
        "name": "Birthday Setup",
        "price": 1000,
        "avgTime": 180
      },
      {
        "id": "5",
        "name": "Buffet Slot",
        "price": 299,
        "avgTime": 90
      }
    ],
    "defaultWorkingHours": {
      "open": "11:00",
      "close": "23:00"
    },
    "mostPopular": true,
    "tags": [
      "food",
      "restaurant",
      "dhaba",
      "eat",
      "dinner",
      "lunch"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#FF5722",
    "category": "food"
  },
  {
    "id": "cafe",
    "icon": "☕",
    "label": "Café / Coffee Shop",
    "labelHi": "कैफे",
    "terminology": {
      "provider": "Barista",
      "action": "Reserve Seat",
      "noun": "Reservation",
      "item": "Item",
      "unit": "min",
      "customer": "Customer"
    },
    "hasMenu": true,
    "defaultServices": [
      {
        "id": "1",
        "name": "Dine-in Reservation",
        "price": 0,
        "avgTime": 60
      },
      {
        "id": "2",
        "name": "Work Slot",
        "price": 99,
        "avgTime": 120
      },
      {
        "id": "3",
        "name": "Private Event Booking",
        "price": 2000,
        "avgTime": 180
      },
      {
        "id": "4",
        "name": "Group Hangout",
        "price": 0,
        "avgTime": 120
      }
    ],
    "defaultWorkingHours": {
      "open": "08:00",
      "close": "22:00"
    },
    "tags": [
      "cafe",
      "coffee",
      "tea",
      "snacks",
      "work"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#6F4E37",
    "category": "food"
  },
  {
    "id": "dhaba",
    "icon": "🫙",
    "label": "Dhaba",
    "labelHi": "Dhaba",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Dal Makhani",
        "price": 120,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Roti",
        "price": 15,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Paneer Dish",
        "price": 180,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Chicken Curry",
        "price": 220,
        "avgTime": 30
      },
      {
        "id": "5",
        "name": "Thali",
        "price": 150,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "dhaba"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#8B4513"
  },
  {
    "id": "fast_food",
    "icon": "🍔",
    "label": "Fast Food",
    "labelHi": "Fast Food",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Burger",
        "price": 80,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Pizza",
        "price": 150,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "French Fries",
        "price": 60,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Sandwich",
        "price": 70,
        "avgTime": 30
      },
      {
        "id": "5",
        "name": "Cold Drink",
        "price": 40,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "fast food"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#FF6B35"
  },
  {
    "id": "sweet_shop",
    "icon": "🍬",
    "label": "Sweet Shop",
    "labelHi": "Sweet Shop",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Gulab Jamun",
        "price": 10,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Jalebi",
        "price": 20,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Barfi",
        "price": 30,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Rasgulla",
        "price": 15,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "sweet shop"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#D4906A"
  },
  {
    "id": "juice_bar",
    "icon": "🥤",
    "label": "Juice Bar",
    "labelHi": "Juice Bar",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Fresh Orange Juice",
        "price": 60,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Sugarcane",
        "price": 30,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Watermelon",
        "price": 40,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Mixed Fruit",
        "price": 80,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "juice bar"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#2ECC71"
  },
  {
    "id": "bakery",
    "icon": "🎂",
    "label": "Bakery",
    "labelHi": "Bakery",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Birthday Cake",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Bread Loaf",
        "price": 40,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Cookies",
        "price": 20,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Pastry",
        "price": 60,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "bakery"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#C0956C"
  },
  {
    "id": "ice_cream_parlour",
    "icon": "🍦",
    "label": "Ice Cream Parlour",
    "labelHi": "Ice Cream Parlour",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Single Scoop",
        "price": 40,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Double Scoop",
        "price": 70,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Sundae",
        "price": 120,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Milkshake",
        "price": 80,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "ice cream_parlour"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#FFB6C1"
  },
  {
    "id": "tiffin_service",
    "icon": "🍱",
    "label": "Tiffin Service",
    "labelHi": "Tiffin Service",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Daily Tiffin",
        "price": 100,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Monthly Pack",
        "price": 2500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Weekend Special",
        "price": 150,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "tiffin service"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#FF8C00",
    "hasHomeService": true
  },
  {
    "id": "caterer",
    "icon": "👨‍🍳",
    "label": "Caterer",
    "labelHi": "Caterer",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Per Plate",
        "price": 150,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Veg Thali",
        "price": 120,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Wedding Catering",
        "price": 200,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "caterer"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#8B0000"
  },
  {
    "id": "food_truck",
    "icon": "🚚",
    "label": "Food Truck",
    "labelHi": "Food Truck",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Signature Dish",
        "price": 80,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Combo Meal",
        "price": 120,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Snack Plate",
        "price": 60,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "food truck"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#FF5722"
  },
  {
    "id": "cloud_kitchen",
    "icon": "📦",
    "label": "Cloud Kitchen",
    "labelHi": "Cloud Kitchen",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Combo Meal",
        "price": 150,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "cloud kitchen"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#FF4500",
    "hasMenu": true,
    "hasHomeService": true
  },
  {
    "id": "paan_shop",
    "icon": "🌿",
    "label": "Paan Shop",
    "labelHi": "Paan Shop",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Meetha Paan",
        "price": 20,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Banarasi Paan",
        "price": 50,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Chocolate Paan",
        "price": 40,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "paan shop"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#228B22"
  },
  {
    "id": "chaat_stall",
    "icon": "🥙",
    "label": "Chaat Stall",
    "labelHi": "Chaat Stall",
    "category": "food",
    "terminology": {
      "provider": "Staff",
      "action": "Order",
      "noun": "Order",
      "item": "Dish",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Pani Puri",
        "price": 30,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Bhel Puri",
        "price": 40,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Dahi Puri",
        "price": 50,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Sev Puri",
        "price": 40,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "food",
      "chaat stall"
    ],
    "designTheme": "theme-food",
    "colorPrimary": "#FF6347"
  },
  {
    "id": "clinic",
    "icon": "🩺",
    "label": "Clinic / Doctor",
    "labelHi": "क्लिनिक / डॉक्टर",
    "terminology": {
      "provider": "Doctor",
      "action": "Book Appt.",
      "noun": "Appointment",
      "item": "Consultation",
      "unit": "min",
      "customer": "Customer"
    },
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasVideoConsult": true,
    "defaultServices": [
      {
        "id": "1",
        "name": "General Consultation",
        "price": 400,
        "avgTime": 15
      },
      {
        "id": "2",
        "name": "Follow-up",
        "price": 200,
        "avgTime": 10
      },
      {
        "id": "3",
        "name": "Pediatric Consult",
        "price": 500,
        "avgTime": 15
      },
      {
        "id": "4",
        "name": "Dermatology",
        "price": 700,
        "avgTime": 20
      },
      {
        "id": "5",
        "name": "Gynecology",
        "price": 700,
        "avgTime": 20
      },
      {
        "id": "6",
        "name": "Eye/Ophthalmology",
        "price": 600,
        "avgTime": 20
      },
      {
        "id": "7",
        "name": "ENT",
        "price": 600,
        "avgTime": 20
      },
      {
        "id": "8",
        "name": "Psychiatric",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "9",
        "name": "Senior Citizen",
        "price": 300,
        "avgTime": 20
      },
      {
        "id": "10",
        "name": "Video Consult",
        "price": 350,
        "avgTime": 15
      },
      {
        "id": "11",
        "name": "Medical Certificate",
        "price": 200,
        "avgTime": 10
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "19:00"
    },
    "mostPopular": true,
    "tags": [
      "doctor",
      "clinic",
      "medical",
      "health",
      "appointment"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#1976D2",
    "category": "healthcare"
  },
  {
    "id": "hospital",
    "icon": "🏥",
    "label": "Hospital",
    "labelHi": "हॉस्पिटल",
    "terminology": {
      "provider": "Specialist",
      "action": "Book Appt.",
      "noun": "Appointment",
      "item": "Test",
      "unit": "min",
      "customer": "Customer"
    },
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "hasVideoConsult": true,
    "hasHomeService": true,
    "defaultServices": [
      {
        "id": "1",
        "name": "OPD Consultation",
        "price": 500,
        "avgTime": 20
      }
    ],
    "defaultWorkingHours": {
      "open": "00:00",
      "close": "23:59"
    },
    "tags": [
      "hospital",
      "medical",
      "emergency",
      "doctor",
      "care"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#0D47A1",
    "category": "healthcare"
  },
  {
    "id": "dental_clinic",
    "icon": "🦷",
    "label": "Dental Clinic",
    "labelHi": "Dental Clinic",
    "category": "healthcare",
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
        "name": "Tooth Cleaning",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Filling",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Root Canal",
        "price": 3000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Extraction",
        "price": 600,
        "avgTime": 30
      },
      {
        "id": "5",
        "name": "Whitening",
        "price": 3500,
        "avgTime": 30
      },
      {
        "id": "6",
        "name": "Braces Consult",
        "price": 500,
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
      "dental clinic"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#00BCD4",
    "hasTimedSlots": true
  },
  {
    "id": "eye_clinic",
    "icon": "👁️",
    "label": "Eye Clinic",
    "labelHi": "Eye Clinic",
    "category": "healthcare",
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
        "name": "Eye Test",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Glasses Prescription",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Cataract Consult",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Retina Check",
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
      "healthcare",
      "eye clinic"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#1565C0",
    "hasTimedSlots": true,
    "hasVideoConsult": true
  },
  {
    "id": "physiotherapy",
    "icon": "🏋️",
    "label": "Physiotherapy",
    "labelHi": "Physiotherapy",
    "category": "healthcare",
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
        "name": "Assessment",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Session",
        "price": 600,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Sports Rehab",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Post Surgery",
        "price": 700,
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
      "physiotherapy"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#00897B",
    "hasTimedSlots": true,
    "hasHomeService": true
  },
  {
    "id": "ayurveda_clinic",
    "icon": "🌿",
    "label": "Ayurveda Clinic",
    "labelHi": "Ayurveda Clinic",
    "category": "healthcare",
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
        "name": "Consultation",
        "price": 400,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Panchakarma",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Shirodhara",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Abhyanga",
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
      "healthcare",
      "ayurveda clinic"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#388E3C",
    "hasTimedSlots": true
  },
  {
    "id": "homeopathy_clinic",
    "icon": "💊",
    "label": "Homeopathy Clinic",
    "labelHi": "Homeopathy Clinic",
    "category": "healthcare",
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
        "name": "First Consult",
        "price": 400,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Follow-up",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Chronic Treatment",
        "price": 500,
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
      "homeopathy clinic"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#5C6BC0",
    "hasTimedSlots": true,
    "hasVideoConsult": true
  },
  {
    "id": "lab_diagnostic",
    "icon": "🔬",
    "label": "Lab Diagnostic",
    "labelHi": "Lab Diagnostic",
    "category": "healthcare",
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
        "name": "CBC Blood Test",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Thyroid Test",
        "price": 400,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Diabetes Panel",
        "price": 350,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "X-Ray",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "5",
        "name": "ECG",
        "price": 250,
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
      "lab diagnostic"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#0277BD",
    "hasHomeService": true
  },
  {
    "id": "pharmacy",
    "icon": "💊",
    "label": "Pharmacy",
    "labelHi": "Pharmacy",
    "category": "healthcare",
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
        "name": "Medicine Supply (list)",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Medical Equipment Rent",
        "price": 0,
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
      "pharmacy"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#1976D2"
  },
  {
    "id": "skin_clinic",
    "icon": "✨",
    "label": "Skin Clinic",
    "labelHi": "Skin Clinic",
    "category": "healthcare",
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
    "hasTimedSlots": true
  },
  {
    "id": "orthopaedic",
    "icon": "🦴",
    "label": "Orthopaedic",
    "labelHi": "Orthopaedic",
    "category": "healthcare",
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
        "name": "Consultation",
        "price": 600,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Fracture Check",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Spine Analysis",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Joint Injection",
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
      "healthcare",
      "orthopaedic"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#37474F",
    "hasTimedSlots": true,
    "hasEmergencySlot": true
  },
  {
    "id": "children_clinic",
    "icon": "👶",
    "label": "Children Clinic",
    "labelHi": "Children Clinic",
    "category": "healthcare",
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
        "name": "Newborn Checkup",
        "price": 400,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Vaccination",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Fever/Cold",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Growth Assessment",
        "price": 400,
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
      "children clinic"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#42A5F5",
    "hasTimedSlots": true,
    "hasEmergencySlot": true
  },
  {
    "id": "psychiatry_clinic",
    "icon": "🧠",
    "label": "Psychiatry Clinic",
    "labelHi": "Psychiatry Clinic",
    "category": "healthcare",
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
        "name": "First Consult",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Therapy Session",
        "price": 1200,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Medication Review",
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
      "healthcare",
      "psychiatry clinic"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#7E57C2",
    "hasTimedSlots": true,
    "hasVideoConsult": true
  },
  {
    "id": "gynecology_clinic",
    "icon": "🌸",
    "label": "Gynecology Clinic",
    "labelHi": "Gynecology Clinic",
    "category": "healthcare",
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
        "name": "Gynec Consult",
        "price": 600,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Pregnancy Check",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Sonography Consult",
        "price": 400,
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
      "gynecology clinic"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#E91E63",
    "hasTimedSlots": true
  },
  {
    "id": "rehabilitation_center",
    "icon": "♿",
    "label": "Rehabilitation Center",
    "labelHi": "Rehabilitation Center",
    "category": "healthcare",
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
        "name": "Assessment",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Daily Session",
        "price": 600,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Home Visit",
        "price": 1000,
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
      "rehabilitation center"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#0288D1",
    "hasTimedSlots": true,
    "hasHomeService": true
  },
  {
    "id": "men_salon",
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
    "category": "beauty"
  },
  {
    "id": "beauty_parlour",
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
    "category": "beauty"
  },
  {
    "id": "spa",
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
    "category": "beauty"
  },
  {
    "id": "nail_studio",
    "icon": "💅",
    "label": "Nail Studio",
    "labelHi": "Nail Studio",
    "category": "beauty",
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
    "colorPrimary": "#F06292"
  },
  {
    "id": "eyebrow_studio",
    "icon": "👁️‍🗨️",
    "label": "Eyebrow Studio",
    "labelHi": "Eyebrow Studio",
    "category": "beauty",
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
        "name": "Threading",
        "price": 40,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Microblading",
        "price": 3500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Eyebrow Tinting",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Lamination",
        "price": 1500,
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
      "eyebrow studio"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#AD1457"
  },
  {
    "id": "tattoo_studio",
    "icon": "🖊️",
    "label": "Tattoo Studio",
    "labelHi": "Tattoo Studio",
    "category": "beauty",
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
    "hasTimedSlots": true
  },
  {
    "id": "mehndi_artist",
    "icon": "🌺",
    "label": "Mehndi Artist",
    "labelHi": "Mehndi Artist",
    "category": "beauty",
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
    "hasHomeService": true
  },
  {
    "id": "bridal_studio",
    "icon": "👰",
    "label": "Bridal Studio",
    "labelHi": "Bridal Studio",
    "category": "beauty",
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
    "hasTimedSlots": true
  },
  {
    "id": "lash_studio",
    "icon": "✨",
    "label": "Lash Studio",
    "labelHi": "Lash Studio",
    "category": "beauty",
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
        "name": "Classic Lashes",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Volume Lashes",
        "price": 2500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Lash Lift",
        "price": 1200,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Removal",
        "price": 500,
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
      "lash studio"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#C2185B",
    "hasTimedSlots": true
  },
  {
    "id": "massage_center",
    "icon": "💆",
    "label": "Massage Center",
    "labelHi": "Massage Center",
    "category": "beauty",
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
    "hasHomeService": true
  },
  {
    "id": "laser_hair_removal",
    "icon": "✨",
    "label": "Laser Hair Removal",
    "labelHi": "Laser Hair Removal",
    "category": "beauty",
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
    "hasTimedSlots": true
  },
  {
    "id": "ayurvedic_spa",
    "icon": "🌿",
    "label": "Ayurvedic Spa",
    "labelHi": "Ayurvedic Spa",
    "category": "beauty",
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
    "hasTimedSlots": true
  },
  {
    "id": "gym",
    "icon": "💪",
    "label": "Gym / Fitness Center",
    "labelHi": "जिम / फिटनेस सेंटर",
    "terminology": {
      "provider": "Trainer",
      "action": "Book Slot",
      "noun": "Session",
      "item": "Workout",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Day Pass",
        "price": 100,
        "avgTime": 60
      },
      {
        "id": "2",
        "name": "Personal Training",
        "price": 500,
        "avgTime": 60
      },
      {
        "id": "3",
        "name": "Group Class",
        "price": 150,
        "avgTime": 45
      },
      {
        "id": "4",
        "name": "Monthly Member",
        "price": 1200,
        "avgTime": 43200
      },
      {
        "id": "5",
        "name": "Quarterly",
        "price": 3000,
        "avgTime": 129600
      },
      {
        "id": "6",
        "name": "Annual",
        "price": 9000,
        "avgTime": 525600
      },
      {
        "id": "7",
        "name": "Zumba Class",
        "price": 200,
        "avgTime": 45
      },
      {
        "id": "8",
        "name": "Boxing Session",
        "price": 400,
        "avgTime": 45
      }
    ],
    "defaultWorkingHours": {
      "open": "05:00",
      "close": "22:00"
    },
    "mostPopular": true,
    "tags": [
      "gym",
      "fitness",
      "workout",
      "training",
      "health"
    ],
    "designTheme": "theme-fitness",
    "colorPrimary": "#FF6F00",
    "category": "fitness"
  },
  {
    "id": "yoga_studio",
    "icon": "🧘",
    "label": "Yoga Studio",
    "labelHi": "Yoga Studio",
    "category": "fitness",
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
        "name": "Drop-in Class",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Monthly",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Private Session",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Prenatal Yoga",
        "price": 300,
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
      "yoga studio"
    ],
    "designTheme": "theme-fitness",
    "colorPrimary": "#7CB342",
    "hasTimedSlots": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true
  },
  {
    "id": "slimming_center",
    "icon": "⚡",
    "label": "Slimming Center",
    "labelHi": "Slimming Center",
    "category": "fitness",
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
    "hasTimedSlots": true
  },
  {
    "id": "crossfit_gym",
    "icon": "🏋️",
    "label": "Crossfit Gym",
    "labelHi": "Crossfit Gym",
    "category": "fitness",
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
        "name": "Drop-in",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Monthly",
        "price": 2500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "3 Month",
        "price": 6000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Annual",
        "price": 20000,
        "avgTime": 30
      },
      {
        "id": "5",
        "name": "PT",
        "price": 600,
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
      "crossfit gym"
    ],
    "designTheme": "theme-fitness",
    "colorPrimary": "#E65100",
    "hasTimedSlots": true,
    "hasCapacityLimit": true
  },
  {
    "id": "swimming_pool",
    "icon": "🏊",
    "label": "Swimming Pool",
    "labelHi": "Swimming Pool",
    "category": "fitness",
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
        "name": "Entry",
        "price": 100,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Monthly",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Coaching",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Competitive Training",
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
      "fitness",
      "swimming pool"
    ],
    "designTheme": "theme-fitness",
    "colorPrimary": "#0288D1",
    "hasTimedSlots": true,
    "hasCapacityLimit": true
  },
  {
    "id": "sports_academy",
    "icon": "🏏",
    "label": "Sports Academy",
    "labelHi": "Sports Academy",
    "category": "fitness",
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
        "name": "Cricket Coaching",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Football",
        "price": 1200,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Badminton",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Tennis",
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
      "fitness",
      "sports academy"
    ],
    "designTheme": "theme-fitness",
    "colorPrimary": "#2E7D32",
    "hasTimedSlots": true
  },
  {
    "id": "martial_arts",
    "icon": "🥋",
    "label": "Martial Arts",
    "labelHi": "Martial Arts",
    "category": "fitness",
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
        "name": "Karate Monthly",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Judo",
        "price": 1200,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Taekwondo",
        "price": 1100,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "MMA",
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
      "fitness",
      "martial arts"
    ],
    "designTheme": "theme-fitness",
    "colorPrimary": "#B71C1C",
    "hasTimedSlots": true
  },
  {
    "id": "boxing_gym",
    "icon": "🥊",
    "label": "Boxing Gym",
    "labelHi": "Boxing Gym",
    "category": "fitness",
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
        "name": "Monthly",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Personal Training",
        "price": 600,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Group Class",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Competition Prep",
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
      "fitness",
      "boxing gym"
    ],
    "designTheme": "theme-fitness",
    "colorPrimary": "#E53935"
  },
  {
    "id": "dance_studio",
    "icon": "💃",
    "label": "Dance Studio",
    "labelHi": "Dance Studio",
    "category": "fitness",
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
        "name": "Bollywood Monthly",
        "price": 1200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Classical",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Hip-Hop",
        "price": 1300,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Wedding Choreography",
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
      "fitness",
      "dance studio"
    ],
    "designTheme": "theme-beauty",
    "colorPrimary": "#D81B60",
    "hasTimedSlots": true,
    "hasCapacityLimit": true
  },
  {
    "id": "cycling_studio",
    "icon": "🚴",
    "label": "Cycling Studio",
    "labelHi": "Cycling Studio",
    "category": "fitness",
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
        "name": "Drop-in",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Monthly",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Corporate Package",
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
      "cycling studio"
    ],
    "designTheme": "theme-fitness",
    "colorPrimary": "#FF8F00",
    "hasTimedSlots": true,
    "hasCapacityLimit": true
  },
  {
    "id": "aerobics_center",
    "icon": "🤸",
    "label": "Aerobics Center",
    "labelHi": "Aerobics Center",
    "category": "fitness",
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
        "name": "Monthly",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Zumba",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Aerobics",
        "price": 150,
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
      "aerobics center"
    ],
    "designTheme": "theme-fitness",
    "colorPrimary": "#FB8C00",
    "hasTimedSlots": true,
    "supportsGroupBooking": true
  },
  {
    "id": "coaching",
    "icon": "📚",
    "label": "Coaching / Tuition",
    "labelHi": "कोचिंग",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Batch",
      "item": "Subject",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Doubt Session",
        "price": 200,
        "avgTime": 60
      },
      {
        "id": "2",
        "name": "Demo Class",
        "price": 0,
        "avgTime": 60
      },
      {
        "id": "3",
        "name": "Monthly Batch",
        "price": 1500,
        "avgTime": 43200
      },
      {
        "id": "4",
        "name": "Weekly Package",
        "price": 400,
        "avgTime": 10080
      }
    ],
    "defaultWorkingHours": {
      "open": "08:00",
      "close": "20:00"
    },
    "tags": [
      "education",
      "tutor",
      "school",
      "learn",
      "coaching"
    ],
    "designTheme": "theme-education",
    "colorPrimary": "#3F51B5",
    "category": "education"
  },
  {
    "id": "music_school",
    "icon": "🎵",
    "label": "Music School",
    "labelHi": "Music School",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Guitar Monthly",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Piano",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Vocals",
        "price": 1200,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Tabla",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "5",
        "name": "Violin",
        "price": 2500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "education",
      "music school"
    ],
    "designTheme": "theme-education",
    "colorPrimary": "#5E35B1",
    "hasTimedSlots": true
  },
  {
    "id": "dance_school",
    "icon": "🩰",
    "label": "Dance School",
    "labelHi": "Dance School",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Bharatanatyam",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Kathak",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Contemporary",
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
      "education",
      "dance school"
    ],
    "designTheme": "theme-education",
    "colorPrimary": "#D81B60"
  },
  {
    "id": "art_classes",
    "icon": "🎨",
    "label": "Art Classes",
    "labelHi": "Art Classes",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Basic Art",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Oil Painting",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Sketch",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Digital Art",
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
      "education",
      "art classes"
    ],
    "designTheme": "theme-education",
    "colorPrimary": "#E53935"
  },
  {
    "id": "language_classes",
    "icon": "📖",
    "label": "Language Classes",
    "labelHi": "Language Classes",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "English Monthly",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "French",
        "price": 1200,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "German",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Japanese",
        "price": 1800,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "education",
      "language classes"
    ],
    "designTheme": "theme-education",
    "colorPrimary": "#1565C0",
    "hasVideoConsult": true
  },
  {
    "id": "computer_classes",
    "icon": "💻",
    "label": "Computer Classes",
    "labelHi": "Computer Classes",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Basic Computer",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "MS Office",
        "price": 600,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Tally",
        "price": 1200,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Python",
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
      "education",
      "computer classes"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#00838F"
  },
  {
    "id": "driving_school",
    "icon": "🚗",
    "label": "Driving School",
    "labelHi": "Driving School",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "2-Wheeler Course",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "4-Wheeler",
        "price": 3000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Heavy Vehicle",
        "price": 5000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Refresher",
        "price": 1000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "education",
      "driving school"
    ],
    "designTheme": "theme-education",
    "colorPrimary": "#FF8F00",
    "hasTimedSlots": true
  },
  {
    "id": "neet_coaching",
    "icon": "🏥",
    "label": "Neet Coaching",
    "labelHi": "Neet Coaching",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Monthly Batch",
        "price": 3000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Full Year",
        "price": 25000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Test Series",
        "price": 5000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Doubt Session",
        "price": 200,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "education",
      "neet coaching"
    ],
    "designTheme": "theme-education",
    "colorPrimary": "#1A237E"
  },
  {
    "id": "jee_coaching",
    "icon": "⚙️",
    "label": "Jee Coaching",
    "labelHi": "Jee Coaching",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Monthly Batch",
        "price": 3500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Full Year",
        "price": 30000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Crash Course",
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
      "education",
      "jee coaching"
    ],
    "designTheme": "theme-education",
    "colorPrimary": "#0D47A1"
  },
  {
    "id": "upsc_coaching",
    "icon": "🏛️",
    "label": "Upsc Coaching",
    "labelHi": "Upsc Coaching",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "GS Batch",
        "price": 4000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Optional",
        "price": 3000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Test Series",
        "price": 6000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "education",
      "upsc coaching"
    ],
    "designTheme": "theme-education",
    "colorPrimary": "#4A148C"
  },
  {
    "id": "spoken_english",
    "icon": "🗣️",
    "label": "Spoken English",
    "labelHi": "Spoken English",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Monthly Course",
        "price": 1200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Intensive",
        "price": 3000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "1-on-1",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "education",
      "spoken english"
    ],
    "designTheme": "theme-education",
    "colorPrimary": "#1976D2",
    "hasVideoConsult": true
  },
  {
    "id": "coding_bootcamp",
    "icon": "👨‍💻",
    "label": "Coding Bootcamp",
    "labelHi": "Coding Bootcamp",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Web Dev Course",
        "price": 15000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Python",
        "price": 8000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "App Dev",
        "price": 20000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Data Science",
        "price": 25000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "education",
      "coding bootcamp"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#00BCD4",
    "hasVideoConsult": true
  },
  {
    "id": "chess_academy",
    "icon": "♟️",
    "label": "Chess Academy",
    "labelHi": "Chess Academy",
    "category": "education",
    "terminology": {
      "provider": "Tutor",
      "action": "Enroll",
      "noun": "Class",
      "item": "Course",
      "unit": "min",
      "customer": "Student"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Beginner Monthly",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Advanced",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Tournament Prep",
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
      "education",
      "chess academy"
    ],
    "designTheme": "theme-education",
    "colorPrimary": "#795548"
  },
  {
    "id": "clothing_store",
    "icon": "👗",
    "label": "Clothing Store",
    "labelHi": "Clothing Store",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Alteration",
        "price": 100,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Custom Stitch",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Readymade (catalog)",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "clothing store"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#E91E63"
  },
  {
    "id": "footwear_shop",
    "icon": "👟",
    "label": "Footwear Shop",
    "labelHi": "Footwear Shop",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Shoe Repair",
        "price": 100,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Sole Change",
        "price": 150,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Polish",
        "price": 50,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "footwear shop"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#795548"
  },
  {
    "id": "jewelry_shop",
    "icon": "💍",
    "label": "Jewelry Shop",
    "labelHi": "Jewelry Shop",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Custom Design consult",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Repair",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Polishing",
        "price": 200,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "jewelry shop"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#FFD700"
  },
  {
    "id": "electronics_store",
    "icon": "📱",
    "label": "Electronics Store",
    "labelHi": "Electronics Store",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Demo",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Installation",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Extended Warranty",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "electronics store"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#1565C0"
  },
  {
    "id": "mobile_shop",
    "icon": "📱",
    "label": "Mobile Shop",
    "labelHi": "Mobile Shop",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Screen Repair",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Battery",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Accessories",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "mobile shop"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#1976D2"
  },
  {
    "id": "grocery_store",
    "icon": "🛒",
    "label": "Grocery Store",
    "labelHi": "Grocery Store",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Home Delivery",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Bulk Orders",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Monthly Grocery Package",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "grocery store"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#43A047",
    "hasHomeService": true
  },
  {
    "id": "hardware_store",
    "icon": "🔨",
    "label": "Hardware Store",
    "labelHi": "Hardware Store",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Material Consultation",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Bulk Supply",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Delivery",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "hardware store"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#5D4037"
  },
  {
    "id": "stationery_shop",
    "icon": "✏️",
    "label": "Stationery Shop",
    "labelHi": "Stationery Shop",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Custom Printing",
        "price": 5,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Binding",
        "price": 50,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Lamination",
        "price": 20,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "stationery shop"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#1E88E5"
  },
  {
    "id": "book_shop",
    "icon": "📚",
    "label": "Book Shop",
    "labelHi": "Book Shop",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Second-hand books",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Custom order",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Book subscription",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "book shop"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#6D4C41"
  },
  {
    "id": "toy_store",
    "icon": "🧸",
    "label": "Toy Store",
    "labelHi": "Toy Store",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Customization",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Gift wrapping",
        "price": 50,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Bulk school orders",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "toy store"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#FF8F00"
  },
  {
    "id": "furniture_shop",
    "icon": "🪑",
    "label": "Furniture Shop",
    "labelHi": "Furniture Shop",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Home Visit",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Assembly",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Custom Furniture consultation",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "furniture shop"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#6D4C41",
    "hasHomeService": true
  },
  {
    "id": "flower_shop",
    "icon": "🌸",
    "label": "Flower Shop",
    "labelHi": "Flower Shop",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Bouquet",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Event Decoration",
        "price": 5000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Daily Subscription",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "flower shop"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#E91E63",
    "hasHomeService": true
  },
  {
    "id": "optician",
    "icon": "👓",
    "label": "Optician",
    "labelHi": "Optician",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Eye Test",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Frame Fitting",
        "price": 100,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Lens Change",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Contact Lens consult",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "optician"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#1565C0"
  },
  {
    "id": "tailoring_shop",
    "icon": "✂️",
    "label": "Tailoring Shop",
    "labelHi": "Tailoring Shop",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Blouse Stitching",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Suit",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Alteration",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "School Uniform",
        "price": 400,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "tailoring shop"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#7B1FA2"
  },
  {
    "id": "saree_shop",
    "icon": "🥻",
    "label": "Saree Shop",
    "labelHi": "Saree Shop",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Saree Draping",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Blouse Stitching",
        "price": 400,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Dry Cleaning",
        "price": 150,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "saree shop"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#880E4F"
  },
  {
    "id": "gift_shop",
    "icon": "🎁",
    "label": "Gift Shop",
    "labelHi": "Gift Shop",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Gift Wrapping",
        "price": 100,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Personalization",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Hamper Making",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "gift shop"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#FF5722"
  },
  {
    "id": "handicraft_shop",
    "icon": "🏺",
    "label": "Handicraft Shop",
    "labelHi": "Handicraft Shop",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Custom Orders",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Bulk Corporate",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Workshop",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "handicraft shop"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#795548"
  },
  {
    "id": "home_decor_store",
    "icon": "🏠",
    "label": "Home Decor Store",
    "labelHi": "Home Decor Store",
    "category": "retail",
    "terminology": {
      "provider": "Staff",
      "action": "Buy",
      "noun": "Order",
      "item": "Product",
      "unit": "item",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Home Consultation",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Custom Decor",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Bulk Interior",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "retail",
      "home decor_store"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#FF7043"
  },
  {
    "id": "plumber",
    "icon": "🔧",
    "label": "Plumber",
    "labelHi": "Plumber",
    "category": "home_services",
    "terminology": {
      "provider": "Technician",
      "action": "Book Service",
      "noun": "Booking",
      "item": "Job",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Tap Repair",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Pipe Fix",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Geyser Install",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Drainage",
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
      "home_services",
      "plumber"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#1565C0",
    "hasHomeService": true,
    "hasEmergencySlot": true
  },
  {
    "id": "electrician",
    "icon": "⚡",
    "label": "Electrician",
    "labelHi": "Electrician",
    "category": "home_services",
    "terminology": {
      "provider": "Technician",
      "action": "Book Service",
      "noun": "Booking",
      "item": "Job",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Fan Install",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "AC Point",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "MCB Fix",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Full Wiring",
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
      "home_services",
      "electrician"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#F9A825",
    "hasHomeService": true,
    "hasEmergencySlot": true
  },
  {
    "id": "carpenter",
    "icon": "🪚",
    "label": "Carpenter",
    "labelHi": "Carpenter",
    "category": "home_services",
    "terminology": {
      "provider": "Technician",
      "action": "Book Service",
      "noun": "Booking",
      "item": "Job",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Furniture Repair",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Shelf Install",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Door Fix",
        "price": 400,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Custom",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "home_services",
      "carpenter"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#5D4037",
    "hasHomeService": true
  },
  {
    "id": "painter",
    "icon": "🎨",
    "label": "Painter",
    "labelHi": "Painter",
    "category": "home_services",
    "terminology": {
      "provider": "Technician",
      "action": "Book Service",
      "noun": "Booking",
      "item": "Job",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Room Painting",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Full House",
        "price": 15000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Texture Paint",
        "price": 50,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "home_services",
      "painter"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#FF7043",
    "hasHomeService": true
  },
  {
    "id": "home_cleaning",
    "icon": "🧹",
    "label": "Home Cleaning",
    "labelHi": "Home Cleaning",
    "category": "home_services",
    "terminology": {
      "provider": "Technician",
      "action": "Book Service",
      "noun": "Booking",
      "item": "Job",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "1BHK Deep Clean",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "2BHK",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Bathroom",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Kitchen",
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
      "home_services",
      "home cleaning"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#26C6DA",
    "hasHomeService": true,
    "hasTimedSlots": true
  },
  {
    "id": "pest_control",
    "icon": "🐛",
    "label": "Pest Control",
    "labelHi": "Pest Control",
    "category": "home_services",
    "terminology": {
      "provider": "Technician",
      "action": "Book Service",
      "noun": "Booking",
      "item": "Job",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Cockroach Treatment",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Termite",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Bed Bugs",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Annual AMC",
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
      "home_services",
      "pest control"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#827717",
    "hasHomeService": true,
    "hasTimedSlots": true
  },
  {
    "id": "laundry",
    "icon": "👕",
    "label": "Laundry / Dry Cleaner",
    "labelHi": "लॉन्ड्री",
    "terminology": {
      "provider": "Staff",
      "action": "Schedule Pickup",
      "noun": "Order",
      "item": "Item",
      "unit": "min",
      "customer": "Customer"
    },
    "hasHomeService": true,
    "defaultServices": [
      {
        "id": "1",
        "name": "Wash & Fold per kg",
        "price": 60,
        "avgTime": 1440
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "21:00"
    },
    "tags": [
      "wash",
      "clothes",
      "dry clean",
      "iron",
      "laundry"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#42A5F5",
    "category": "home_services"
  },
  {
    "id": "ac_repair",
    "icon": "❄️",
    "label": "Ac Repair",
    "labelHi": "Ac Repair",
    "category": "home_services",
    "terminology": {
      "provider": "Technician",
      "action": "Book Service",
      "noun": "Booking",
      "item": "Job",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Service",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Gas Refill",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "PCB Repair",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Installation",
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
      "home_services",
      "ac repair"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#0277BD",
    "hasHomeService": true,
    "hasEmergencySlot": true
  },
  {
    "id": "appliance_repair",
    "icon": "🔌",
    "label": "Appliance Repair",
    "labelHi": "Appliance Repair",
    "category": "home_services",
    "terminology": {
      "provider": "Technician",
      "action": "Book Service",
      "noun": "Booking",
      "item": "Job",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Washing Machine",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Fridge",
        "price": 600,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Microwave",
        "price": 400,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "TV",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "home_services",
      "appliance repair"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#546E7A",
    "hasHomeService": true
  },
  {
    "id": "packers_movers",
    "icon": "📦",
    "label": "Packers Movers",
    "labelHi": "Packers Movers",
    "category": "home_services",
    "terminology": {
      "provider": "Technician",
      "action": "Book Service",
      "noun": "Booking",
      "item": "Job",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "1BHK Local",
        "price": 5000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "2BHK",
        "price": 8000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Intercity",
        "price": 15000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Packing Only",
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
      "home_services",
      "packers movers"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#795548",
    "hasTimedSlots": true
  },
  {
    "id": "solar_panel_installer",
    "icon": "☀️",
    "label": "Solar Panel Installer",
    "labelHi": "Solar Panel Installer",
    "category": "home_services",
    "terminology": {
      "provider": "Technician",
      "action": "Book Service",
      "noun": "Booking",
      "item": "Job",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Site Survey",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "1kW Install",
        "price": 40000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Maintenance",
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
      "home_services",
      "solar panel_installer"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#F9A825",
    "hasHomeService": true
  },
  {
    "id": "water_purifier_service",
    "icon": "💧",
    "label": "Water Purifier Service",
    "labelHi": "Water Purifier Service",
    "category": "home_services",
    "terminology": {
      "provider": "Technician",
      "action": "Book Service",
      "noun": "Booking",
      "item": "Job",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Annual Service",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Filter Change",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Installation",
        "price": 1000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "home_services",
      "water purifier_service"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#0288D1",
    "hasHomeService": true
  },
  {
    "id": "taxi_service",
    "icon": "🚕",
    "label": "Taxi Service",
    "labelHi": "Taxi Service",
    "category": "transport",
    "terminology": {
      "provider": "Driver",
      "action": "Book Ride",
      "noun": "Booking",
      "item": "Trip",
      "unit": "km",
      "customer": "Passenger"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Local Trip",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Airport Drop",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Outstation",
        "price": 12,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Full Day",
        "price": 1500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "transport",
      "taxi service"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#F9A825",
    "hasTimedSlots": true
  },
  {
    "id": "auto_rickshaw",
    "icon": "🛺",
    "label": "Auto Rickshaw",
    "labelHi": "Auto Rickshaw",
    "category": "transport",
    "terminology": {
      "provider": "Driver",
      "action": "Book Ride",
      "noun": "Booking",
      "item": "Trip",
      "unit": "km",
      "customer": "Passenger"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Meter ride",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Fixed route",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "School pickup",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "transport",
      "auto rickshaw"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#FF8F00"
  },
  {
    "id": "travel_agency",
    "icon": "✈️",
    "label": "Travel Agency",
    "labelHi": "Travel Agency",
    "category": "transport",
    "terminology": {
      "provider": "Driver",
      "action": "Book Ride",
      "noun": "Booking",
      "item": "Trip",
      "unit": "km",
      "customer": "Passenger"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Domestic Package",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "International",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Honeymoon Package",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Corporate Travel",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "transport",
      "travel agency"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#1565C0",
    "hasVideoConsult": true
  },
  {
    "id": "car_rental",
    "icon": "🚗",
    "label": "Car Rental",
    "labelHi": "Car Rental",
    "category": "transport",
    "terminology": {
      "provider": "Driver",
      "action": "Book Ride",
      "noun": "Booking",
      "item": "Trip",
      "unit": "km",
      "customer": "Passenger"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Hatchback",
        "price": 800,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Sedan",
        "price": 1200,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "SUV",
        "price": 1800,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "with Driver",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "transport",
      "car rental"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#37474F",
    "hasTimedSlots": true
  },
  {
    "id": "ambulance_service",
    "icon": "🚑",
    "label": "Ambulance Service",
    "labelHi": "Ambulance Service",
    "category": "transport",
    "terminology": {
      "provider": "Driver",
      "action": "Book Ride",
      "noun": "Booking",
      "item": "Trip",
      "unit": "km",
      "customer": "Passenger"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Basic Ambulance",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Advanced",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Air Ambulance",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "transport",
      "ambulance service"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#B71C1C",
    "hasEmergencySlot": true
  },
  {
    "id": "courier_service",
    "icon": "📦",
    "label": "Courier Service",
    "labelHi": "Courier Service",
    "category": "transport",
    "terminology": {
      "provider": "Driver",
      "action": "Book Ride",
      "noun": "Booking",
      "item": "Trip",
      "unit": "km",
      "customer": "Passenger"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Local Parcel",
        "price": 50,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "500g",
        "price": 80,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "1kg",
        "price": 120,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Bulk shipment",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "transport",
      "courier service"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#FF8F00",
    "hasHomeService": true
  },
  {
    "id": "towing_service",
    "icon": "🔩",
    "label": "Towing Service",
    "labelHi": "Towing Service",
    "category": "transport",
    "terminology": {
      "provider": "Driver",
      "action": "Book Ride",
      "noun": "Booking",
      "item": "Trip",
      "unit": "km",
      "customer": "Passenger"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Car Tow",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "2-Wheeler",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Highway",
        "price": 1000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "transport",
      "towing service"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#546E7A",
    "hasEmergencySlot": true
  },
  {
    "id": "law_firm",
    "icon": "⚖️",
    "label": "Lawyer / Law Firm",
    "labelHi": "वकील",
    "terminology": {
      "provider": "Lawyer",
      "action": "Book Consultation",
      "noun": "Appointment",
      "item": "Case",
      "unit": "min",
      "customer": "Customer"
    },
    "hasTimedSlots": true,
    "hasVideoConsult": true,
    "defaultServices": [
      {
        "id": "1",
        "name": "Initial Consultation",
        "price": 1000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "18:00"
    },
    "tags": [
      "law",
      "lawyer",
      "legal",
      "advocate",
      "court"
    ],
    "designTheme": "theme-finance",
    "colorPrimary": "#212121",
    "category": "finance_&_legal"
  },
  {
    "id": "ca_firm",
    "icon": "📊",
    "label": "Ca Firm",
    "labelHi": "Ca Firm",
    "category": "finance_&_legal",
    "terminology": {
      "provider": "Consultant",
      "action": "Book Appt.",
      "noun": "Meeting",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "ITR Filing",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "GST Monthly",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Company Reg",
        "price": 5000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Audit",
        "price": 10000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "finance_&_legal",
      "ca firm"
    ],
    "designTheme": "theme-finance",
    "colorPrimary": "#1A237E",
    "hasTimedSlots": true,
    "hasVideoConsult": true
  },
  {
    "id": "insurance_agent",
    "icon": "🛡️",
    "label": "Insurance Agent",
    "labelHi": "Insurance Agent",
    "category": "finance_&_legal",
    "terminology": {
      "provider": "Consultant",
      "action": "Book Appt.",
      "noun": "Meeting",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Health Insurance consult",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Life Insurance",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Vehicle",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Property",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "finance_&_legal",
      "insurance agent"
    ],
    "designTheme": "theme-finance",
    "colorPrimary": "#0D47A1",
    "hasTimedSlots": true,
    "hasVideoConsult": true
  },
  {
    "id": "loan_agent",
    "icon": "💰",
    "label": "Loan Agent",
    "labelHi": "Loan Agent",
    "category": "finance_&_legal",
    "terminology": {
      "provider": "Consultant",
      "action": "Book Appt.",
      "noun": "Meeting",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Home Loan",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Personal Loan",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Business Loan",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Gold Loan",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "finance_&_legal",
      "loan agent"
    ],
    "designTheme": "theme-finance",
    "colorPrimary": "#1B5E20",
    "hasTimedSlots": true
  },
  {
    "id": "tax_consultant",
    "icon": "📋",
    "label": "Tax Consultant",
    "labelHi": "Tax Consultant",
    "category": "finance_&_legal",
    "terminology": {
      "provider": "Consultant",
      "action": "Book Appt.",
      "noun": "Meeting",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "ITR",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "GST Registration",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "GST Filing",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Tax Planning",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "finance_&_legal",
      "tax consultant"
    ],
    "designTheme": "theme-finance",
    "colorPrimary": "#212121",
    "hasTimedSlots": true,
    "hasVideoConsult": true
  },
  {
    "id": "gst_consultant",
    "icon": "🧾",
    "label": "Gst Consultant",
    "labelHi": "Gst Consultant",
    "category": "finance_&_legal",
    "terminology": {
      "provider": "Consultant",
      "action": "Book Appt.",
      "noun": "Meeting",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "GST Registration",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Monthly Return",
        "price": 1000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Reconciliation",
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
      "finance_&_legal",
      "gst consultant"
    ],
    "designTheme": "theme-finance",
    "colorPrimary": "#1565C0"
  },
  {
    "id": "company_registration",
    "icon": "🏢",
    "label": "Company Registration",
    "labelHi": "Company Registration",
    "category": "finance_&_legal",
    "terminology": {
      "provider": "Consultant",
      "action": "Book Appt.",
      "noun": "Meeting",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Pvt Ltd",
        "price": 8000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "LLP",
        "price": 5000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "OPC",
        "price": 6000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Trademark",
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
      "finance_&_legal",
      "company registration"
    ],
    "designTheme": "theme-finance",
    "colorPrimary": "#4A148C"
  },
  {
    "id": "notary",
    "icon": "📝",
    "label": "Notary",
    "labelHi": "Notary",
    "category": "finance_&_legal",
    "terminology": {
      "provider": "Consultant",
      "action": "Book Appt.",
      "noun": "Meeting",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Document Notary",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Affidavit",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Power of Attorney",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "finance_&_legal",
      "notary"
    ],
    "designTheme": "theme-finance",
    "colorPrimary": "#3E2723"
  },
  {
    "id": "money_transfer",
    "icon": "💸",
    "label": "Money Transfer",
    "labelHi": "Money Transfer",
    "category": "finance_&_legal",
    "terminology": {
      "provider": "Consultant",
      "action": "Book Appt.",
      "noun": "Meeting",
      "item": "Service",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Domestic Transfer",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Bill Payment",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "PAN Card",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Insurance Premium",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "finance_&_legal",
      "money transfer"
    ],
    "designTheme": "theme-finance",
    "colorPrimary": "#1B5E20"
  },
  {
    "id": "real_estate_agent",
    "icon": "🏠",
    "label": "Real Estate Agent",
    "labelHi": "Real Estate Agent",
    "category": "real_estate",
    "terminology": {
      "provider": "Agent",
      "action": "Book Visit",
      "noun": "Visit",
      "item": "Property",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Buy/Sell consult",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Rental",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Site Visit",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Legal verify",
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
      "real_estate",
      "real estate_agent"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#1565C0",
    "hasTimedSlots": true
  },
  {
    "id": "property_dealer",
    "icon": "🏢",
    "label": "Property Dealer",
    "labelHi": "Property Dealer",
    "category": "real_estate",
    "terminology": {
      "provider": "Agent",
      "action": "Book Visit",
      "noun": "Visit",
      "item": "Property",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Property Listing",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Site Visit",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Documentation",
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
      "real_estate",
      "property dealer"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#0D47A1"
  },
  {
    "id": "pg_hostel",
    "icon": "🛏️",
    "label": "Pg Hostel",
    "labelHi": "Pg Hostel",
    "category": "real_estate",
    "terminology": {
      "provider": "Agent",
      "action": "Book Visit",
      "noun": "Visit",
      "item": "Property",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Single Room/month",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Double Sharing",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Triple Sharing",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Monthly Meal",
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
      "real_estate",
      "pg hostel"
    ],
    "designTheme": "theme-hospitality",
    "colorPrimary": "#6D4C41"
  },
  {
    "id": "co_working_space",
    "icon": "💻",
    "label": "Co Working Space",
    "labelHi": "Co Working Space",
    "category": "real_estate",
    "terminology": {
      "provider": "Agent",
      "action": "Book Visit",
      "noun": "Visit",
      "item": "Property",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Day Pass",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Weekly",
        "price": 1500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Monthly Hot Desk",
        "price": 3000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Dedicated",
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
      "real_estate",
      "co working_space"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#1A237E",
    "hasTimedSlots": true,
    "hasCapacityLimit": true
  },
  {
    "id": "repair_shop",
    "icon": "🔧",
    "label": "Repair Shop",
    "labelHi": "रिपेयर शॉप",
    "terminology": {
      "provider": "Technician",
      "action": "Drop Device",
      "noun": "Job Card",
      "item": "Repair",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Diagnostic Check",
        "price": 200,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "10:00",
      "close": "19:00"
    },
    "tags": [
      "repair",
      "fix",
      "mobile",
      "electronics",
      "mechanic"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#607D8B",
    "category": "tech_&_it"
  },
  {
    "id": "computer_repair",
    "icon": "💻",
    "label": "Computer Repair",
    "labelHi": "Computer Repair",
    "category": "tech_&_it",
    "terminology": {
      "provider": "Expert",
      "action": "Book Service",
      "noun": "Request",
      "item": "Project",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Diagnosis",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Virus Remove",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "OS Install",
        "price": 600,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Screen",
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
      "tech_&_it",
      "computer repair"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#546E7A"
  },
  {
    "id": "mobile_repair",
    "icon": "📱",
    "label": "Mobile Repair",
    "labelHi": "Mobile Repair",
    "category": "tech_&_it",
    "terminology": {
      "provider": "Expert",
      "action": "Book Service",
      "noun": "Request",
      "item": "Project",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Screen Replace",
        "price": 500,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Battery",
        "price": 400,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Charging Port",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Water Damage",
        "price": 1000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "tech_&_it",
      "mobile repair"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#607D8B"
  },
  {
    "id": "it_company",
    "icon": "🖥️",
    "label": "It Company",
    "labelHi": "It Company",
    "category": "tech_&_it",
    "terminology": {
      "provider": "Expert",
      "action": "Book Service",
      "noun": "Request",
      "item": "Project",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Website",
        "price": 5000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "App Development",
        "price": 30000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "SEO",
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
      "tech_&_it",
      "it company"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#01579B",
    "hasVideoConsult": true
  },
  {
    "id": "web_designer",
    "icon": "🌐",
    "label": "Web Designer",
    "labelHi": "Web Designer",
    "category": "tech_&_it",
    "terminology": {
      "provider": "Expert",
      "action": "Book Service",
      "noun": "Request",
      "item": "Project",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Landing Page",
        "price": 3000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Business Website",
        "price": 8000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "E-commerce",
        "price": 20000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "tech_&_it",
      "web designer"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#00BCD4",
    "hasVideoConsult": true
  },
  {
    "id": "digital_marketing_agency",
    "icon": "📱",
    "label": "Digital Marketing Agency",
    "labelHi": "Digital Marketing Agency",
    "category": "tech_&_it",
    "terminology": {
      "provider": "Expert",
      "action": "Book Service",
      "noun": "Request",
      "item": "Project",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Social Media",
        "price": 5000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Google Ads",
        "price": 3000,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "SEO",
        "price": 4000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Content",
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
      "tech_&_it",
      "digital marketing_agency"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#1E88E5",
    "hasVideoConsult": true
  },
  {
    "id": "cybercafe",
    "icon": "🖥️",
    "label": "Cybercafe",
    "labelHi": "Cybercafe",
    "category": "tech_&_it",
    "terminology": {
      "provider": "Expert",
      "action": "Book Service",
      "noun": "Request",
      "item": "Project",
      "unit": "min",
      "customer": "Client"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Per Hour",
        "price": 20,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Printing",
        "price": 5,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Scanning",
        "price": 10,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Form Fill",
        "price": 50,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "tech_&_it",
      "cybercafe"
    ],
    "designTheme": "theme-tech",
    "colorPrimary": "#37474F",
    "hasTimedSlots": true,
    "hasCapacityLimit": true
  },
  {
    "id": "hotel",
    "icon": "🏨",
    "label": "Hotel",
    "labelHi": "Hotel",
    "category": "hospitality",
    "terminology": {
      "provider": "Manager",
      "action": "Book",
      "noun": "Reservation",
      "item": "Package",
      "unit": "day",
      "customer": "Guest"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Single Room/night",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Double",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Suite",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Conference Hall",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "5",
        "name": "Restaurant",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "hospitality",
      "hotel"
    ],
    "designTheme": "theme-hospitality",
    "colorPrimary": "#B8860B",
    "hasTimedSlots": true,
    "supportsGroupBooking": true
  },
  {
    "id": "resort",
    "icon": "🌴",
    "label": "Resort",
    "labelHi": "Resort",
    "category": "hospitality",
    "terminology": {
      "provider": "Manager",
      "action": "Book",
      "noun": "Reservation",
      "item": "Package",
      "unit": "day",
      "customer": "Guest"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Cottage",
        "price": 5000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Villa",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Day Package",
        "price": 2000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Pool Access",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "hospitality",
      "resort"
    ],
    "designTheme": "theme-hospitality",
    "colorPrimary": "#2E7D32",
    "hasTimedSlots": true
  },
  {
    "id": "banquet_hall",
    "icon": "🎉",
    "label": "Banquet Hall",
    "labelHi": "Banquet Hall",
    "category": "hospitality",
    "terminology": {
      "provider": "Manager",
      "action": "Book",
      "noun": "Reservation",
      "item": "Package",
      "unit": "day",
      "customer": "Guest"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Hall Booking/day",
        "price": 15000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Catering",
        "price": 200,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Decor",
        "price": 10000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "hospitality",
      "banquet hall"
    ],
    "designTheme": "theme-hospitality",
    "colorPrimary": "#7B1FA2",
    "hasTimedSlots": true,
    "supportsGroupBooking": true,
    "hasCapacityLimit": true
  },
  {
    "id": "wedding_venue",
    "icon": "💒",
    "label": "Wedding Venue",
    "labelHi": "Wedding Venue",
    "category": "hospitality",
    "terminology": {
      "provider": "Manager",
      "action": "Book",
      "noun": "Reservation",
      "item": "Package",
      "unit": "day",
      "customer": "Guest"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Garden",
        "price": 50000,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Banquet",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Lawn",
        "price": 30000,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Full Package",
        "price": 200000,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "hospitality",
      "wedding venue"
    ],
    "designTheme": "theme-hospitality",
    "colorPrimary": "#C62828",
    "hasTimedSlots": true
  },
  {
    "id": "photography",
    "icon": "📷",
    "label": "Photography Studio",
    "labelHi": "फोटोग्राफी",
    "terminology": {
      "provider": "Photographer",
      "action": "Book Shoot",
      "noun": "Session",
      "item": "Package",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Passport Photo",
        "price": 100,
        "avgTime": 15
      },
      {
        "id": "2",
        "name": "Portfolio Shoot",
        "price": 2000,
        "avgTime": 120
      },
      {
        "id": "3",
        "name": "Event Photography",
        "price": 5000,
        "avgTime": 240
      },
      {
        "id": "4",
        "name": "Wedding Photography",
        "price": 15000,
        "avgTime": 1440
      }
    ],
    "defaultWorkingHours": {
      "open": "10:00",
      "close": "20:00"
    },
    "tags": [
      "photo",
      "studio",
      "shoot",
      "camera",
      "wedding"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#455A64",
    "category": "hospitality"
  },
  {
    "id": "event_planner",
    "icon": "🎪",
    "label": "Event Planner",
    "labelHi": "इवेंट प्लानर",
    "terminology": {
      "provider": "Planner",
      "action": "Book Consultation",
      "noun": "Meeting",
      "item": "Event",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Event Consultation",
        "price": 500,
        "avgTime": 60
      }
    ],
    "defaultWorkingHours": {
      "open": "10:00",
      "close": "19:00"
    },
    "tags": [
      "event",
      "party",
      "wedding",
      "planner",
      "organizer"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#7B1FA2",
    "category": "hospitality"
  },
  {
    "id": "nursery",
    "icon": "🌱",
    "label": "Nursery",
    "labelHi": "Nursery",
    "category": "agriculture",
    "terminology": {
      "provider": "Farmer",
      "action": "Order",
      "noun": "Order",
      "item": "Product",
      "unit": "kg",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Plants",
        "price": 50,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Seeds",
        "price": 20,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Fertilizer",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Garden Setup",
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
      "agriculture",
      "nursery"
    ],
    "designTheme": "theme-agriculture",
    "colorPrimary": "#2E7D32"
  },
  {
    "id": "farm_shop",
    "icon": "🌾",
    "label": "Farm Shop",
    "labelHi": "Farm Shop",
    "category": "agriculture",
    "terminology": {
      "provider": "Farmer",
      "action": "Order",
      "noun": "Order",
      "item": "Product",
      "unit": "kg",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Vegetables (kg",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Organic Produce",
        "price": 0,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Fruit Basket",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Monthly Box",
        "price": 500,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "agriculture",
      "farm shop"
    ],
    "designTheme": "theme-agriculture",
    "colorPrimary": "#558B2F",
    "hasHomeService": true
  },
  {
    "id": "dairy_farm",
    "icon": "🥛",
    "label": "Dairy Farm",
    "labelHi": "Dairy Farm",
    "category": "agriculture",
    "terminology": {
      "provider": "Farmer",
      "action": "Order",
      "noun": "Order",
      "item": "Product",
      "unit": "kg",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "Milk",
        "price": 50,
        "avgTime": 30
      },
      {
        "id": "2",
        "name": "Paneer",
        "price": 300,
        "avgTime": 30
      },
      {
        "id": "3",
        "name": "Ghee",
        "price": 600,
        "avgTime": 30
      },
      {
        "id": "4",
        "name": "Monthly Pack",
        "price": 0,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "mostPopular": false,
    "tags": [
      "agriculture",
      "dairy farm"
    ],
    "designTheme": "theme-agriculture",
    "colorPrimary": "#66BB6A",
    "hasHomeService": true
  },
  {
    "id": "pet_care",
    "icon": "🐾",
    "label": "Pet Care / Vet",
    "labelHi": "पालतू देखभाल",
    "terminology": {
      "provider": "Vet",
      "action": "Book Appointment",
      "noun": "Appointment",
      "item": "Checkup",
      "unit": "min",
      "customer": "Customer"
    },
    "hasTimedSlots": true,
    "hasEmergencySlot": true,
    "defaultServices": [
      {
        "id": "1",
        "name": "General Checkup",
        "price": 300,
        "avgTime": 20
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "tags": [
      "pet",
      "dog",
      "cat",
      "vet",
      "animal"
    ],
    "designTheme": "theme-healthcare",
    "colorPrimary": "#FF8F00",
    "category": "special/misc"
  },
  {
    "id": "other",
    "icon": "🏪",
    "label": "Other Business",
    "labelHi": "अन्य व्यवसाय",
    "terminology": {
      "provider": "Staff",
      "action": "Book",
      "noun": "Booking",
      "item": "Service",
      "unit": "min",
      "customer": "Customer"
    },
    "defaultServices": [
      {
        "id": "1",
        "name": "General Service",
        "price": 100,
        "avgTime": 30
      }
    ],
    "defaultWorkingHours": {
      "open": "09:00",
      "close": "20:00"
    },
    "tags": [
      "business",
      "shop",
      "store"
    ],
    "designTheme": "theme-retail",
    "colorPrimary": "#607D8B",
    "category": "special/misc"
  }
];

export const ALL_BUSINESSES = BUSINESS_CATEGORIES_INFO;
