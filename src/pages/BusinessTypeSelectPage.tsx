import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUSINESS_CATEGORIES_INFO } from '../constants/businessRegistry';
import { useApp } from '../store/AppContext';

const CATEGORY_TABS = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'healthcare', label: 'Health', icon: '🩺' },
  { id: 'beauty', label: 'Beauty', icon: '💅' },
  { id: 'education', label: 'Edu', icon: '📚' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'retail', label: 'Retail', icon: '🛍️' },
  { id: 'home_services', label: 'Home', icon: '🔧' },
  { id: 'transport', label: 'Auto', icon: '🚕' },
  { id: 'real_estate', label: 'Real Estate', icon: '🏠' },
  { id: 'tech_&_it', label: 'Tech', icon: '💻' },
  { id: 'finance_&_legal', label: 'Finance', icon: '⚖️' },
  { id: 'agriculture', label: 'Agri', icon: '🌾' },
  { id: 'hospitality', label: 'Events', icon: '🎪' },
  { id: 'special/misc', label: 'Misc', icon: '🏪' },
];

const POPULAR_IDS = [
  'restaurant', 'men_salon', 'clinic', 'coaching_institute',
  'gym', 'grocery_store', 'hotel', 'ca_firm'
];

const GRADIENTS: Record<string, string> = {
  food: 'from-orange-500 to-red-500',
  healthcare: 'from-blue-500 to-cyan-500',
  beauty: 'from-pink-500 to-rose-500',
  education: 'from-purple-500 to-indigo-500',
  fitness: 'from-green-500 to-emerald-500',
  retail: 'from-yellow-500 to-orange-400',
  home_services: 'from-teal-500 to-green-500',
  transport: 'from-sky-500 to-blue-600',
  real_estate: 'from-amber-600 to-yellow-500',
  'tech_&_it': 'from-violet-500 to-purple-600',
  'finance_&_legal': 'from-slate-600 to-slate-500',
  agriculture: 'from-lime-500 to-green-600',
  hospitality: 'from-fuchsia-500 to-pink-600',
  manufacturing: 'from-gray-500 to-slate-600',
  specialized: 'from-cyan-600 to-teal-500',
  digital: 'from-indigo-500 to-violet-500',
  default: 'from-primary to-accent',
};

export default function BusinessTypeSelectPage() {
  const { lang } = useApp();
  const nav = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredBusinesses = useMemo(() => {
    return BUSINESS_CATEGORIES_INFO.filter(b => {
      const matchesSearch =
        b.label.toLowerCase().includes(search.toLowerCase()) ||
        b.labelHi.toLowerCase().includes(search.toLowerCase()) ||
        b.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        b.category?.toLowerCase().includes(search.toLowerCase());

      const matchesCat = selectedCategory === 'all' || b.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [search, selectedCategory]);

  const popularBusinesses = useMemo(() => {
    return BUSINESS_CATEGORIES_INFO.filter(b => POPULAR_IDS.includes(b.id));
  }, []);

  const handleSelect = (b: any) => {
    setSelectedId(b.id);
    localStorage.setItem('selected_business_type', b.id);
    localStorage.setItem('selected_business_label', lang === 'hi' ? b.labelHi : b.label);
    localStorage.setItem('selected_business_icon', b.icon);

    setTimeout(() => {
      nav('/business/auth');
    }, 300);
  };

  const showPopular = search === '' && selectedCategory === 'all';

  return (
    <div className="min-h-screen bg-bg text-text pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-bg border-b border-border shadow-sm">
        <div className="p-4 pt-6">
          <button onClick={() => nav('/role')} className="text-text-dim hover:text-text mb-4">
            ← Back
          </button>
          <h1 className="text-2xl font-bold">Choose Your Business</h1>
          <p className="text-text-dim text-sm">अपना व्यवसाय चुनें</p>

          <div className="mt-4 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim">🔍</span>
            <input
              type="text"
              placeholder="Search business type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Horizontal Category Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide px-4 pb-4 gap-2 border-b border-border">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                selectedCategory === tab.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-card text-text-dim border-border hover:bg-card-2'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {showPopular && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span>🔥</span> Popular Businesses
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {popularBusinesses.map(b => (
                <BusinessCard key={b.id} business={b} selected={selectedId === b.id} onSelect={() => handleSelect(b)} lang={lang} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="font-semibold text-lg mb-3 flex items-center justify-between">
            <span>{showPopular ? 'All Businesses' : 'Search Results'}</span>
            <span className="text-xs text-text-dim font-normal bg-card-2 px-2 py-0.5 rounded-full border border-border">
              {filteredBusinesses.length} found
            </span>
          </h2>

          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-10 bg-card rounded-2xl border border-border">
              <span className="text-4xl mb-2 block">🤷</span>
              <p className="font-medium text-text">Koi business nahi mila</p>
              <p className="text-sm text-text-dim mt-1">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredBusinesses.map(b => (
                <BusinessCard key={b.id} business={b} selected={selectedId === b.id} onSelect={() => handleSelect(b)} lang={lang} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BusinessCard({ business, selected, onSelect, lang }: { business: any, selected: boolean, onSelect: () => void, lang: string }) {
  const gradientClass = GRADIENTS[business.category] || GRADIENTS.default;

  return (
    <button
      onClick={onSelect}
      className={`relative p-3 rounded-2xl border text-left flex flex-col items-center justify-center transition-all active:scale-95 group overflow-hidden ${
        selected
          ? 'border-primary bg-primary/10 shadow-md scale-95'
          : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs shadow-sm z-10">
          ✓
        </div>
      )}

      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform`}>
        <span className="text-3xl">{business.icon}</span>
      </div>

      <p className="font-semibold text-sm text-center line-clamp-2 leading-tight min-h-[2.5rem] flex items-center justify-center">
        {lang === 'hi' ? business.labelHi : business.label}
      </p>

      {business.category && (
        <span className="mt-2 text-[10px] text-text-dim uppercase tracking-wider bg-card-2 px-2 py-0.5 rounded-full border border-border/50 truncate w-full text-center">
          {business.category.replace('_', ' ')}
        </span>
      )}
    </button>
  );
}
