import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, googleProvider } from '../firebase';
import {
  onAuthStateChanged, signInWithPopup, signOut as fbSignOut,
  deleteUser, reauthenticateWithPopup, User
} from 'firebase/auth';
import {
  doc, setDoc, getDoc, collection, query, where, getDocs,
  updateDoc, addDoc, onSnapshot, deleteDoc, orderBy, limit, serverTimestamp
} from 'firebase/firestore';
import { uploadToCloudinary } from '../utils/cloudinary';

export type Lang = 'en' | 'hi' | 'gu' | 'ta' | 'mr' | 'bn';
export type Role = 'customer' | 'barber' | 'business';

export type BusinessCategory =
  | 'men_salon' | 'beauty_parlour' | 'unisex_salon' | 'clinic' | 'hospital'
  | 'restaurant' | 'cafe' | 'gym' | 'spa' | 'pet_care' | 'coaching'
  | 'law_firm' | 'photography' | 'repair_shop' | 'laundry' | 'event_planner' | 'other' | string;

export interface Terminology {
  provider: string;
  action: string;
  noun: string;
  item: string;
  unit: string;
}

export interface ServiceItem { id: string; name: string; price: number; avgTime: number; priceType?: 'fixed' | 'variable'; }

export interface StaffMember { id?: string; name?: string; role?: string; phone?: string; photoURL?: string; revenue?: number; }
export interface TaxSettings { name?: string; rate?: number; isInclusive?: boolean; type?: string; }
export interface PricingPlan { id?: string; name?: string; price?: number; durationDays?: number; features?: string[]; }
export interface MenuItem { id?: string; name?: string; price?: number; category?: string; isVeg?: boolean; photo?: string; available?: boolean; }
export interface TableItem { id?: string; seats?: number; x?: number; y?: number; isReserved?: boolean; label?: string; }
export interface Story { url?: string; expiresAt?: number; businessId?: string; }
export interface PortfolioItem { id?: string; imageURL?: string; category?: string; description?: string; tags?: string[]; }
export interface EventBooking { id?: string; clientName?: string; date?: string; type?: string; venue?: string; budget?: number; status?: string; }
export interface ServicePackage { id?: string; name?: string; description?: string; includedServiceIds?: string[]; price?: number; }
export interface HospitalDepartment { id?: string; name?: string; doctorIds?: string[]; }
export interface DynamicPricingRule { id?: string; }
export interface WaitlistEntry { id?: string; }
export interface PatientRecord { id?: string; }
export interface DoctorProfile { id?: string; }
export interface UserMembership { id?: string; }
export interface CoachingBatch { id?: string; }
export interface SpaRoom { id?: string; }
export interface TailorOrder { id?: string; }
export interface RepairEstimate { id?: string; }
export interface StudentProfile { id?: string; }
export interface AttendanceRecord { id?: string; }
export interface GroupClass { id?: string; }
export interface PetProfile { id?: string; name?: string; species?: string; breed?: string; dob?: string; photoURL?: string; }
export interface InventoryItem { id?: string; name?: string; quantity?: number; }

export interface BusinessProfile {
  uid: string; name: string; businessName: string; businessType: BusinessCategory;
  location: string; phone: string;
  photoURL: string; bannerImageURL: string; services: ServiceItem[];
  isOpen: boolean; isBreak: boolean; isStopped: boolean;
  currentToken: number; totalTokensToday: number; breakStartTime: number | null;
  createdAt: any; rating?: number; totalReviews?: number; totalEarnings?: number;
  subscription?: string | null; subscriptionExpiry?: number | null;
  upiId?: string; businessHours?: string; bio?: string;
  instagram?: string; website?: string;
  referralCode?: string; totalCustomersAllTime?: number;
  lat?: number; lng?: number; fcmToken?: string; queueDelayMinutes?: number;
  staffMembers?: StaffMember[];
  taxSettings?: TaxSettings[];
  blockedDates?: string[];
  products?: { id: string; name: string; price: number; stock?: number }[];
  promoCodes?: { code: string; type: 'percentage' | 'flat'; value: number; active: boolean }[];
  maxCapacity?: number;
  franchiseId?: string;
  stories?: Story[];
  menuItems?: MenuItem[];
  tableLayout?: TableItem[];
  memberships?: PricingPlan[];
  gymMembers?: UserMembership[];
  coachingBatches?: CoachingBatch[];
  doctors?: DoctorProfile[];
  patientRecords?: PatientRecord[];
  inventory?: InventoryItem[];
  pricingRules?: DynamicPricingRule[];
  waitlist?: WaitlistEntry[];
  spaRooms?: SpaRoom[];
  tailorOrders?: TailorOrder[];
  repairEstimates?: RepairEstimate[];
  portfolioItems?: PortfolioItem[];
  eventBookings?: EventBooking[];
  departments?: HospitalDepartment[];
  packages?: ServicePackage[];
  students?: StudentProfile[];
  attendance?: AttendanceRecord[];
  groupClasses?: GroupClass[];
  announcement?: string;
  salonName?: string; // legacy compat
  salonImageURL?: string; // legacy compat
}

export type BarberProfile = BusinessProfile;

export interface CustomerProfile {
  uid: string; name: string; phone: string; location: string; photoURL: string;
  favoriteSalons: string[]; subscription: string | null; createdAt: any;
  referralCode?: string; totalVisits?: number; referredBy?: string;
  fcmToken?: string; totalNoShows?: number; lat?: number; lng?: number;
  activeMemberships?: UserMembership[];
  pets?: PetProfile[];
  loyaltyPoints?: number; currentStreak?: number;
}

export interface TokenEntry {
  id?: string; salonId: string; salonName: string;
  customerId: string; customerName: string; customerPhone: string;
  tokenNumber: number; selectedServices: ServiceItem[];
  totalTime: number; totalPrice: number; estimatedWaitMinutes: number;
  status: 'waiting' | 'serving' | 'done' | 'cancelled' | 'no-show';
  createdAt: any; date: string; isAdvanceBooking: boolean; advanceDate?: string;
  rating?: number; assignedStaffId?: string;
  isTatkal?: boolean; tatkalFee?: number;
  groupSize?: number; promoCode?: string; discountAmount?: number;
  specialInstructions?: string; tipAmount?: number;
  repairStatus?: 'Received' | 'Diagnosed' | 'Parts Ordered' | 'Ready';
  caseStatus?: 'Consultation' | 'Filing' | 'Hearing' | 'Closed';
  photographyStatus?: 'Scheduled' | 'Shooting' | 'Editing' | 'Delivered';
  deliveryLink?: string;
  prescription?: any;
  assignedRoomId?: string;
  petHealthLog?: any;
}

export interface ReviewEntry {
  id?: string; salonId: string; customerId: string; customerName: string;
  customerPhoto: string; rating: number; comment: string; createdAt: any;
  images?: string[]; staffId?: string; staffName?: string;
}

export interface NotificationEntry {
  id?: string; userId: string; title: string; body: string;
  type: 'token_ready' | 'token_called' | 'salon_open' | 'review' | 'general' | string;
  data?: any; read: boolean; createdAt: number;
}

export interface MessageEntry {
  id?: string; salonId: string; salonName: string;
  senderId: string; senderName: string; senderPhoto: string;
  senderRole: 'customer' | 'barber' | 'business';
  customerId?: string; customerName?: string; customerPhoto?: string;
  message: string; createdAt: any; read: boolean;
}


export interface DayStat { date: string; dayName: string; count: number; revenue: number; cancelled: number; }

interface AppContextType {
  lang: Lang; setLang: (l: Lang) => void;
  role: Role | null; setRole: (r: Role | null) => void;
  user: User | null; loading: boolean;
  signInWithGoogle: () => Promise<any>;
  signOutUser: () => Promise<void>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  customerProfile: CustomerProfile | null;
  setCustomerProfile: (p: CustomerProfile | null) => void;
  saveCustomerProfile: (p: CustomerProfile) => Promise<void>;
  barberProfile: BarberProfile | null;
  setBarberProfile: (p: BarberProfile | null) => void;
  saveBarberProfile: (p: BarberProfile) => Promise<boolean>;
  retrySyncBarberProfile: () => Promise<boolean>;
  syncPending: boolean;
  uploadPhoto: (file: File, folder: string) => Promise<string>;
  getToken: (token: Omit<TokenEntry, 'id'>) => Promise<string | null>;
  cancelToken: (tokenId: string) => Promise<void>;
  rateToken: (tokenId: string, rating: number) => Promise<void>;
  searchSalons: (q: string) => Promise<BarberProfile[]>;
  getSalonById: (id: string) => Promise<BarberProfile | null>;
  getSalonTokens: (salonId: string, date: string) => Promise<TokenEntry[]>;
  getCustomerTokens: (customerId: string) => Promise<TokenEntry[]>;
  getCustomerFullHistory: (customerId: string) => Promise<TokenEntry[]>;
  allSalons: BarberProfile[];
  nextCustomer: () => Promise<void>;
  toggleSalonOpen: () => Promise<void>;
  toggleSalonBreak: () => Promise<void>;
  toggleSalonStop: () => Promise<void>;
  continueTokens: () => Promise<void>;
  getBarberFullStats: (days: number) => Promise<DayStat[]>;
  getBarberTrialDaysLeft: () => number;
  isBarberTrialActive: () => boolean;
  isBarberSubscribed: () => boolean;
  addReview: (review: Omit<ReviewEntry, 'id'>) => Promise<void>;
  getSalonReviews: (salonId: string) => Promise<ReviewEntry[]>;
  getTodayEarnings: () => Promise<number>;
  // Messaging — real-time
  sendMessage: (msg: Omit<MessageEntry, 'id'>) => Promise<void>;
  useChatMessages: (salonId: string) => MessageEntry[];
  // Notifications
  notifications: NotificationEntry[]; unreadCount: number;
  pushNotification: (userId: string, notif: Omit<NotificationEntry, 'id' | 'userId' | 'read' | 'createdAt'>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  toggleFavorite: (salonId: string) => void;
  isFavorite: (salonId: string) => boolean;
  getUserLocation: () => Promise<{ lat: number; lng: number } | null>;
  t: (key: string) => string;
  theme: 'dark' | 'light'; toggleTheme: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);
export const useApp = () => useContext(AppContext);

const translations: Record<string, Record<Lang, string>> = {
  'app.name': { en: 'Line Free', hi: 'लाइन फ्री' },
  'lang.select': { en: 'Select Language', hi: 'भाषा चुनें' },
  'role.select': { en: 'Continue as', hi: 'के रूप में जारी रखें' },
  'role.customer': { en: 'Customer', hi: 'ग्राहक' },
  'role.barber': { en: 'Salon Owner / Barber', hi: 'सैलून मालिक / बार्बर' },
  'auth.login': { en: 'Login', hi: 'लॉगिन' },
  'auth.google': { en: 'Continue with Google', hi: 'Google से लॉगिन करें' },
  'auth.logout': { en: 'Logout', hi: 'लॉगआउट' },
  'profile.setup': { en: 'Setup Profile', hi: 'प्रोफाइल सेटअप' },
  'profile.name': { en: 'Name', hi: 'नाम' },
  'profile.phone': { en: 'Phone Number', hi: 'फ़ोन नंबर' },
  'profile.location': { en: 'Location', hi: 'लोकेशन' },
  'profile.salonName': { en: 'Salon Name', hi: 'सैलून का नाम' },
  'profile.optional': { en: '(Optional)', hi: '(वैकल्पिक)' },
  'btn.continue': { en: 'Continue', hi: 'जारी रखें' },
  'btn.skip': { en: 'Skip', hi: 'छोड़ें' },
  'btn.save': { en: 'Save', hi: 'सेव करें' },
  'btn.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'btn.back': { en: 'Back', hi: 'वापस' },
  'btn.next': { en: 'Next', hi: 'अगला' },
  'btn.getToken': { en: 'Get Token', hi: 'टोकन लें' },
  'btn.cancelToken': { en: 'Cancel Token', hi: 'टोकन रद्द करें' },
  'home': { en: 'Home', hi: 'होम' },
  'search': { en: 'Search Salon', hi: 'सैलून खोजें' },
  'tokens': { en: 'My Tokens', hi: 'मेरे टोकन' },
  'profile': { en: 'Profile', hi: 'प्रोफाइल' },
  'subscription': { en: 'Subscription', hi: 'सब्सक्रिप्शन' },
  'hairstyles': { en: 'Hairstyles', hi: 'हेयरस्टाइल' },
  'salon.open': { en: 'Open Salon', hi: 'सैलून खोलें' },
  'salon.close': { en: 'Close Salon', hi: 'सैलून बंद करें' },
  'salon.break': { en: 'Take Break', hi: 'ब्रेक लें' },
  'salon.endBreak': { en: 'End Break', hi: 'ब्रेक खत्म' },
  'salon.closed': { en: 'Salon is Closed', hi: 'सैलून बंद है' },
  'salon.onBreak': { en: 'On Break', hi: 'ब्रेक पर' },
  'salon.isOpen': { en: 'Salon is Open', hi: 'सैलून खुला है' },
  'queue': { en: 'Queue', hi: 'कतार' },
  'queue.customers': { en: 'Customers in Queue', hi: 'कतार में ग्राहक' },
  'queue.next': { en: 'Next Customer', hi: 'अगला ग्राहक' },
  'queue.stop': { en: 'Stop Tokens', hi: 'टोकन बंद करें' },
  'queue.continue': { en: 'Continue Tokens', hi: 'टोकन जारी रखें' },
  'queue.current': { en: 'Current Token', hi: 'वर्तमान टोकन' },
  'queue.total': { en: 'Total Tokens', hi: 'कुल टोकन' },
  'queue.waiting': { en: 'Waiting', hi: 'इंतज़ार' },
  'queue.peopleBefore': { en: 'people before you', hi: 'लोग आपसे पहले' },
  'queue.estTime': { en: 'Estimated wait', hi: 'अनुमानित इंतज़ार' },
  'queue.yourToken': { en: 'Your Token', hi: 'आपका टोकन' },
  'services': { en: 'Services', hi: 'सेवाएं' },
  'services.add': { en: 'Add Service', hi: 'सेवा जोड़ें' },
  'services.select': { en: 'Select Services', hi: 'सेवाएं चुनें' },
  'min': { en: 'min', hi: 'मिनट' },
  'rs': { en: '₹', hi: '₹' },
  'today': { en: 'Today', hi: 'आज' },
  'favorites': { en: 'Favorites', hi: 'पसंदीदा' },
  'no.results': { en: 'No results found', hi: 'कोई परिणाम नहीं' },
  'sub.customer.title': { en: 'Customer Subscription', hi: 'ग्राहक सब्सक्रिप्शन' },
  'sub.barber.title': { en: 'Salon Subscription', hi: 'सैलून सब्सक्रिप्शन' },
  'error': { en: 'Something went wrong', hi: 'कुछ गलत हो गया' },
  'loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'earnings': { en: 'Earnings', hi: 'कमाई' },
  'reviews': { en: 'Reviews', hi: 'रिव्यू' },
  'share': { en: 'Share', hi: 'शेयर करें' },
  'pay': { en: 'Pay', hi: 'भुगतान करें' },
  'trial': { en: 'Free Trial', hi: 'फ्री ट्रायल' },
  'trial.active': { en: 'Trial Active', hi: 'ट्रायल चालू' },
  'trial.expired': { en: 'Trial Expired', hi: 'ट्रायल खत्म' },
  'nearby': { en: 'Nearby Salons', hi: 'आस-पास के सैलून' },
  'featured': { en: 'Featured Salons', hi: 'फीचर्ड सैलून' },
  'all.salons': { en: 'All Salons', hi: 'सभी सैलून' },
  'open.now': { en: 'Open Now', hi: 'अभी खुला' },
  'refer': { en: 'Refer & Earn', hi: 'रेफर करें और कमाएं' },
  'analytics': { en: 'Analytics', hi: 'एनालिटिक्स' },
  'history': { en: 'History', hi: 'इतिहास' },
  'notifications': { en: 'Notifications', hi: 'नोटिफिकेशन' },
  'delete.account': { en: 'Delete Account', hi: 'अकाउंट डिलीट करें' },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('lf_lang') as Lang) || 'en');
  const [role, setRoleState] = useState<Role | null>(() => localStorage.getItem('lf_role') as Role | null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerProfile, setCustomerProfileState] = useState<CustomerProfile | null>(null);
  const [barberProfile, setBarberProfileState] = useState<BarberProfile | null>(null);
  const [allSalons, setAllSalons] = useState<BarberProfile[]>([]);
  const [syncPending, setSyncPending] = useState(false);
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('lf_theme') as 'dark' | 'light') || 'dark');

  useEffect(() => { document.documentElement.classList.toggle('light', theme === 'light'); localStorage.setItem('lf_theme', theme); }, [theme]);
  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');
  const t = (key: string) => translations[key]?.[lang] || key;
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem('lf_lang', l); };
  const setRole = (r: Role | null) => { setRoleState(r); r ? localStorage.setItem('lf_role', r) : localStorage.removeItem('lf_role'); };
  const setCustomerProfile = (p: CustomerProfile | null) => { setCustomerProfileState(p); p ? localStorage.setItem('lf_customer', JSON.stringify(p)) : localStorage.removeItem('lf_customer'); };
  const setBarberProfile = (p: BarberProfile | null) => { setBarberProfileState(p); p ? localStorage.setItem('lf_barber', JSON.stringify(p)) : localStorage.removeItem('lf_barber'); };

  // ── Real-time salons ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'barbers'), snap => {
      const s = snap.docs.map(d => d.data() as BarberProfile);
      s.sort((a, b) => ((b.createdAt as number) || 0) - ((a.createdAt as number) || 0));
      setAllSalons(s);
    }, err => console.warn('Salon listener:', err));
    return () => unsub();
  }, []);

  // ── Real-time notifications ──
  useEffect(() => {
    if (!user) { setNotifications([]); return; }
    const q = query(collection(db, 'notifications'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'), limit(50));
    const unsub = onSnapshot(q, snap => setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as NotificationEntry))), () => {});
    return () => unsub();
  }, [user]);

  // ── Auth state ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u);
      if (u) {
        const savedRole = localStorage.getItem('lf_role') as Role | null;
        if (savedRole === 'customer') {
          try { const snap = await getDoc(doc(db, 'customers', u.uid)); if (snap.exists()) setCustomerProfile(snap.data() as CustomerProfile); else { const l = localStorage.getItem('lf_customer'); if (l) try { setCustomerProfileState(JSON.parse(l)); } catch {} } } catch { const l = localStorage.getItem('lf_customer'); if (l) try { setCustomerProfileState(JSON.parse(l)); } catch {} }
        } else if (savedRole === 'barber') {
          try { const snap = await getDoc(doc(db, 'barbers', u.uid)); if (snap.exists()) setBarberProfile(snap.data() as BarberProfile); else { const l = localStorage.getItem('lf_barber'); if (l) try { setBarberProfileState(JSON.parse(l)); } catch {} } } catch { const l = localStorage.getItem('lf_barber'); if (l) try { setBarberProfileState(JSON.parse(l)); } catch {} }
        }
      } else { setCustomerProfileState(null); setBarberProfileState(null); }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => { const r = await signInWithPopup(auth, googleProvider); return r; };

  const signOutUser = async () => {
    try { await fbSignOut(auth); } catch {}
    setUser(null); setRole(null); setCustomerProfile(null); setBarberProfile(null);
    localStorage.removeItem('lf_role'); localStorage.removeItem('lf_customer'); localStorage.removeItem('lf_barber');
  };

  const deleteAccount = async (): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in' };
    try {
      const colls = role === 'customer'
        ? [['customers', user.uid], ['tokens', 'customerId'], ['notifications', 'userId']]
        : [['barbers', user.uid], ['tokens', 'salonId'], ['reviews', 'salonId'], ['notifications', 'userId'], ['messages', 'salonId']];
      for (const [coll, field] of colls) {
        try {
          if (field === user.uid) { await deleteDoc(doc(db, coll, user.uid)); }
          else { const snap = await getDocs(query(collection(db, coll), where(field, '==', user.uid))); await Promise.all(snap.docs.map(d => deleteDoc(doc(db, coll, d.id)))); }
        } catch {}
      }
      await deleteUser(user);
      await signOutUser();
      return { success: true };
    } catch (e: any) {
      if (e?.code === 'auth/requires-recent-login') {
        try { await reauthenticateWithPopup(user, googleProvider); return deleteAccount(); } catch { return { success: false, error: 'Re-auth failed.' }; }
      }
      return { success: false, error: e?.message || 'Failed' };
    }
  };

  const uploadPhoto = async (file: File, folder: string) => uploadToCloudinary(file, folder);

  const saveCustomerProfile = async (p: CustomerProfile) => {
    if (!p.referralCode) p = { ...p, referralCode: `LF${p.uid.slice(0, 6).toUpperCase()}` };
    setCustomerProfile(p);
    try { await setDoc(doc(db, 'customers', p.uid), p, { merge: true }); } catch (e) { console.warn('Save failed:', e); }
  };

  const pendingRef = { current: null as BarberProfile | null };
  const firestoreRetry = async (fn: () => Promise<void>, retries = 3): Promise<boolean> => {
    for (let i = 0; i < retries; i++) {
      try { await fn(); return true; } catch { if (i < retries - 1) await new Promise(r => setTimeout(r, 1000 * (i + 1))); }
    }
    return false;
  };

  const syncBarberToFirestore = async (p: BarberProfile) => {
    setSyncPending(true);
    if (!p.referralCode) p = { ...p, referralCode: `LF${p.uid.slice(0, 6).toUpperCase()}` };
    const ok = await firestoreRetry(() => setDoc(doc(db, 'barbers', p.uid), p, { merge: true }));
    if (ok) { setSyncPending(false); pendingRef.current = null; } else { pendingRef.current = p; }
    return ok;
  };

  useEffect(() => { const iv = setInterval(() => { if (pendingRef.current) syncBarberToFirestore(pendingRef.current); }, 10000); return () => clearInterval(iv); }, []);

  const saveBarberProfile = async (p: BarberProfile) => { setBarberProfile(p); return syncBarberToFirestore(p); };
  const retrySyncBarberProfile = async () => barberProfile ? syncBarberToFirestore(barberProfile) : false;

  const searchSalons = async (q: string) => {
    if (!q.trim()) return allSalons;
    const l = q.toLowerCase();
    return allSalons.filter(s => s.salonName?.toLowerCase().includes(l) || s.name?.toLowerCase().includes(l) || s.location?.toLowerCase().includes(l) || s.services?.some(sv => sv.name.toLowerCase().includes(l)));
  };

  const getSalonById = async (id: string) => {
    const c = allSalons.find(s => s.uid === id);
    if (c) return c;
    try { const snap = await getDoc(doc(db, 'barbers', id)); if (snap.exists()) return snap.data() as BarberProfile; } catch {}
    return null;
  };

  const getTodayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

  // ✅ FIX: getSalonTokens — no compound index needed (filter date client-side fallback)
  const getSalonTokens = async (salonId: string, date: string): Promise<TokenEntry[]> => {
    try {
      // Try simple query first (only one where clause = no composite index needed)
      const q = query(collection(db, 'tokens'), where('salonId', '==', salonId));
      const snap = await getDocs(q);
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry));
      // Filter date client-side — no index required
      return all.filter(t => t.date === date);
    } catch (e) { console.error('getSalonTokens error:', e); return []; }
  };

  const getCustomerTokens = async (customerId: string): Promise<TokenEntry[]> => {
    try {
      const today = getTodayStr();
      // Simple query — no compound index
      const q = query(collection(db, 'tokens'), where('customerId', '==', customerId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry)).filter(t => t.date === today);
    } catch (e) { console.error('getCustomerTokens error:', e); return []; }
  };

  const getCustomerFullHistory = async (customerId: string): Promise<TokenEntry[]> => {
    try {
      const q = query(collection(db, 'tokens'), where('customerId', '==', customerId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as TokenEntry)).sort((a, b) => ((b.createdAt as number) || 0) - ((a.createdAt as number) || 0));
    } catch { return []; }
  };

  const getToken = async (token: Omit<TokenEntry, 'id'>): Promise<string | null> => {
    try {
      const ref = await addDoc(collection(db, 'tokens'), token);
      // Notify customer
      try { await pushNotification(token.customerId, { title: '🎫 Token Confirmed!', body: `Token #${token.tokenNumber} at ${token.salonName}. Est. wait: ${token.estimatedWaitMinutes} min`, type: 'token_ready', data: { salonId: token.salonId, tokenNumber: token.tokenNumber } }); } catch {}
      // Notify barber
      try { await pushNotification(token.salonId, { title: '🔔 New Customer!', body: `${token.customerName} booked Token #${token.tokenNumber} — ${token.selectedServices.map(s => s.name).join(', ')}`, type: 'token_ready', data: { tokenId: ref.id } }); } catch {}
      return ref.id;
    } catch (e) { console.error('getToken error:', e); return null; }
  };

  const cancelToken = async (tokenId: string) => { try { await updateDoc(doc(db, 'tokens', tokenId), { status: 'cancelled' }); } catch {} };
  const rateToken = async (tokenId: string, rating: number) => { try { await updateDoc(doc(db, 'tokens', tokenId), { rating }); } catch {} };

  const nextCustomer = async () => {
    if (!barberProfile || !user) return;
    const today = getTodayStr();
    try {
      const allTokens = await getSalonTokens(user.uid, today);
      const serving = allTokens.filter(t => t.status === 'serving');
      const waiting = allTokens.filter(t => t.status === 'waiting').sort((a, b) => a.tokenNumber - b.tokenNumber);
      await Promise.all(serving.map(t => updateDoc(doc(db, 'tokens', t.id!), { status: 'done' })));
      if (waiting.length > 0) {
        const next = waiting[0];
        await updateDoc(doc(db, 'tokens', next.id!), { status: 'serving' });
        try { await pushNotification(next.customerId, { title: '🔔 Your Turn!', body: `Token #${next.tokenNumber} — it's your turn at ${barberProfile.salonName}!`, type: 'token_called', data: { salonId: user.uid } }); } catch {}
        await saveBarberProfile({ ...barberProfile, currentToken: next.tokenNumber });
      }
    } catch (e) { console.error('nextCustomer error:', e); }
  };

  const toggleSalonOpen = async () => { if (!barberProfile) return; const o = !barberProfile.isOpen; await saveBarberProfile({ ...barberProfile, isOpen: o, isBreak: false, currentToken: o ? 0 : barberProfile.currentToken, totalTokensToday: o ? 0 : barberProfile.totalTokensToday }); };
  const toggleSalonBreak = async () => { if (!barberProfile) return; const b = !barberProfile.isBreak; await saveBarberProfile({ ...barberProfile, isBreak: b, breakStartTime: b ? Date.now() : null }); };
  const toggleSalonStop = async () => { if (!barberProfile) return; await saveBarberProfile({ ...barberProfile, isStopped: !barberProfile.isStopped }); };
  const continueTokens = async () => { if (!barberProfile) return; await saveBarberProfile({ ...barberProfile, isStopped: false }); };

  const getBarberFullStats = async (days: number): Promise<DayStat[]> => {
    if (!user) return [];
    const result: DayStat[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const dayName = d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
      try {
        const tks = await getSalonTokens(user.uid, dateStr);
        const done = tks.filter(t => t.status === 'done');
        result.push({ date: dateStr, dayName, count: done.length, revenue: done.reduce((a, c) => a + (c.totalPrice || 0), 0), cancelled: tks.filter(t => t.status === 'cancelled').length });
      } catch { result.push({ date: dateStr, dayName, count: 0, revenue: 0, cancelled: 0 }); }
    }
    return result;
  };

  const getBarberTrialDaysLeft = () => { if (!barberProfile?.createdAt) return 30; const c = typeof barberProfile.createdAt === 'number' ? barberProfile.createdAt : Date.now(); return Math.max(0, 30 - Math.floor((Date.now() - c) / 86400000)); };
  const isBarberTrialActive = () => getBarberTrialDaysLeft() > 0;
  const isBarberSubscribed = () => isBarberTrialActive() || (!!(barberProfile?.subscriptionExpiry) && barberProfile.subscriptionExpiry! > Date.now());

  const addReview = async (review: Omit<ReviewEntry, 'id'>) => {
    try {
      await addDoc(collection(db, 'reviews'), review);
      const snap = await getDocs(query(collection(db, 'reviews'), where('salonId', '==', review.salonId)));
      const all = snap.docs.map(d => d.data() as ReviewEntry);
      const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
      await updateDoc(doc(db, 'barbers', review.salonId), { rating: Math.round(avg * 10) / 10, totalReviews: all.length });
      try { await pushNotification(review.salonId, { title: '⭐ New Review!', body: `${review.customerName} gave ${review.rating} stars`, type: 'review' }); } catch {}
    } catch {}
  };

  const getSalonReviews = async (salonId: string): Promise<ReviewEntry[]> => {
    try {
      const snap = await getDocs(query(collection(db, 'reviews'), where('salonId', '==', salonId)));
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ReviewEntry)).sort((a, b) => ((b.createdAt as number) || 0) - ((a.createdAt as number) || 0));
    } catch { return []; }
  };

  const getTodayEarnings = async () => {
    if (!user) return 0;
    try {
      const tks = await getSalonTokens(user.uid, getTodayStr());
      return tks.filter(t => t.status === 'done').reduce((s, t) => s + (t.totalPrice || 0), 0);
    } catch { return 0; }
  };

  // ✅ FIX: sendMessage — updated schema with senderId/senderRole
  const sendMessage = async (msg: Omit<MessageEntry, 'id'>) => {
    try { await addDoc(collection(db, 'messages'), { ...msg, createdAt: Date.now() }); } catch (e) { console.error('sendMessage error:', e); }
  };

  // ✅ FIX: Real-time chat hook using onSnapshot
  const useChatMessages = (salonId: string): MessageEntry[] => {
    const [msgs, setMsgs] = useState<MessageEntry[]>([]);
    useEffect(() => {
      if (!salonId) return;
      const q = query(collection(db, 'messages'), where('salonId', '==', salonId));
      const unsub = onSnapshot(q, snap => {
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as MessageEntry));
        all.sort((a, b) => ((a.createdAt as number) || 0) - ((b.createdAt as number) || 0));
        setMsgs(all);
      }, err => console.warn('Chat listener:', err));
      return () => unsub();
    }, [salonId]);
    return msgs;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const pushNotification = async (userId: string, notif: Omit<NotificationEntry, 'id' | 'userId' | 'read' | 'createdAt'>) => {
    try { await addDoc(collection(db, 'notifications'), { ...notif, userId, read: false, createdAt: Date.now() }); } catch {}
  };

  const markNotificationRead = async (id: string) => { try { await updateDoc(doc(db, 'notifications', id), { read: true }); } catch {} };
  const markAllNotificationsRead = async () => { await Promise.all(notifications.filter(n => !n.read).map(n => markNotificationRead(n.id!))); };

  const toggleFavorite = (salonId: string) => {
    if (!customerProfile) return;
    const favs = customerProfile.favoriteSalons || [];
    saveCustomerProfile({ ...customerProfile, favoriteSalons: favs.includes(salonId) ? favs.filter(id => id !== salonId) : [...favs, salonId] });
  };
  const isFavorite = (salonId: string) => (customerProfile?.favoriteSalons || []).includes(salonId);

  const getUserLocation = (): Promise<{ lat: number; lng: number } | null> =>
    new Promise(resolve => { if (!navigator.geolocation) { resolve(null); return; } navigator.geolocation.getCurrentPosition(p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }), () => resolve(null), { timeout: 8000 }); });

  return (
    <AppContext.Provider value={{
      lang, setLang, role, setRole, user, loading,
      signInWithGoogle, signOutUser, deleteAccount,
      customerProfile, setCustomerProfile, saveCustomerProfile,
      barberProfile, setBarberProfile, saveBarberProfile, retrySyncBarberProfile, syncPending,
      uploadPhoto,
      getToken, cancelToken, rateToken,
      searchSalons, getSalonById, getSalonTokens, getCustomerTokens, getCustomerFullHistory,
      allSalons,
      nextCustomer, toggleSalonOpen, toggleSalonBreak, toggleSalonStop, continueTokens,
      getBarberFullStats,
      getBarberTrialDaysLeft, isBarberTrialActive, isBarberSubscribed,
      addReview, getSalonReviews, getTodayEarnings,
      sendMessage, useChatMessages,
      notifications, unreadCount, pushNotification, markNotificationRead, markAllNotificationsRead,
      toggleFavorite, isFavorite, getUserLocation,
      t, theme, toggleTheme,
    }}>
      {children}
    </AppContext.Provider>
  );
}
