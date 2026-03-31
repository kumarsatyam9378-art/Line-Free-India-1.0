import { BusinessCategory } from '../store/AppContext';
import { BUSINESS_CATEGORIES_INFO } from './businessRegistry';

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  route: string;
}

export const COMMON_QUICK_ACTIONS: QuickAction[] = [
  { id: 'staff', icon: '👔', label: 'Staff', route: '/barber/staff' },
  { id: 'analytics', icon: '📊', label: 'Analytics', route: '/barber/analytics' },
  { id: 'qr', icon: '📱', label: 'My QR', route: '/barber/qr' },
  { id: 'expenses', icon: '🧾', label: 'Expenses', route: '/barber/expenses' },
];

export function getQuickActionsForBusiness(categoryId: BusinessCategory): QuickAction[] {
  const info = BUSINESS_CATEGORIES_INFO.find(c => c.id === categoryId);
  if (!info) return COMMON_QUICK_ACTIONS;

  const actions: QuickAction[] = [];

  // 1. Appointments vs Live Queue
  if (info.hasTimedSlots) {
    actions.push({ id: 'calendar', icon: '📅', label: 'Appointments', route: '/barber/calendar' });
  }

  // 2. Customers / Patients
  const customerLabel = info.terminology?.customer || 'Customers';
  actions.push({ id: 'customers', icon: '🧑‍🤝‍🧑', label: !info.hasTimedSlots ? 'Live Queue' : customerLabel, route: '/barber/customers' });

  // 3. Menu (Restaurants/Cafes)
  if (info.hasMenu) {
    actions.push({ id: 'menu', icon: '📖', label: 'Menu', route: '/barber/digital-menu' });
  }

  // 4. Tables (Restaurants)
  if (categoryId === 'restaurant' || categoryId === 'cafe') {
    actions.push({ id: 'tables', icon: '🪑', label: 'Tables', route: '/barber/tables' });
  }

  // 5. Patient Vault (Healthcare)
  if (info.category === 'healthcare' || categoryId === 'clinic' || categoryId === 'hospital') {
    actions.push({ id: 'patients', icon: '🗂️', label: 'Records', route: '/barber/patient-vault' });
  }

  // Add common actions to fill up the grid
  return [...actions, ...COMMON_QUICK_ACTIONS].slice(0, 8); // Max 8 actions for the grid
}

export function getDashboardConfig(categoryId: BusinessCategory) {
    const info = BUSINESS_CATEGORIES_INFO.find(c => c.id === categoryId);
    return {
        showQueueControls: info ? !info.hasTimedSlots : true,
        statsNoun: info?.terminology?.noun || 'Tokens',
        providerNoun: info?.terminology?.provider || 'Owner'
    };
}
