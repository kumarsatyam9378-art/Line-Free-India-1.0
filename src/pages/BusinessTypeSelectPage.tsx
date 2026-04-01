import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUSINESS_CATEGORIES_INFO } from '../constants/businessRegistry';
import { BusinessCategory } from '../store/AppContext';
import { useApp } from '../store/AppContext';

// Category groups for filter tabs
const CATEGORY_TABS = [
  { id: 'all', label: 'All', emoji: '🌐' },
  { id: 'beauty', label: 'Beauty & Salon', emoji: '💄' },
  { id: 'healthcare', label: 'Health & Clinic', emoji: '🏥' },
  { id: 'fitness', label: 'Fitness & Wellness', emoji: '💪' }
];

// Background gradients per category
const CATEGORY_GRADIENTS: Record<string, string> = {
  food: 'from-orange-500 to-red-500',
  healthcare: 'from-blue-500 to-cyan-500',
  beauty: 'from-pink-500 to-rose-500',
  education: 'from-purple-500 to-indigo-500',
  fitness: 'from-green-500 to-emerald-500',
  retail: 'from-yellow-500 to-orange-400',
  home: 'from-teal-500 to-green-500',
  transport: 'from-sky-500 to-blue-600',
  realestate: 'from-amber-600 to-yellow-500',
  technology: 'from-violet-500 to-purple-600',
  finance: 'from-slate-600 to-slate-500',
  agriculture: 'from-lime-500 to-green-600',
  hospitality: 'from-fuchsia-500 to-pink-600',
  manufacturing: 'from-gray-500 to-slate-600',
  specialized: 'from-cyan-600 to-teal-500',
  digital: 'from-indigo-500 to-violet-500',
};

export default function BusinessTypeSelectPage() {
  const nav = useNavigate();
  const { lang } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  // POPULAR businesses to show at top
  const POPULAR_IDS = [
    'men_salon', 'beauty_parlour', 'unisex_salon', 'spa',
    'makeup_artist', 'bridal_studio', 'skin_clinic', 'laser_hair_removal'
  ];

  const filteredBusinesses = useMemo(() => {
    let list = BUSINESS_CATEGORIES_INFO;

    // Category filter
    if (activeCategory !== 'all') {
      list = list.filter(b => b.category === activeCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(b =>
        b.label.toLowerCase().includes(q) ||
        b.labelHi.includes(q) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(q))) ||
        (b.category && b.category.toLowerCase().includes(q))
      );
    }

    return list;
  }, [search, activeCategory]);

  // Popular section - only shown when search is empty and no category filter
  const popularBusinesses = useMemo(() => {
    if (search || activeCategory !== 'all') return [];
    return BUSINESS_CATEGORIES_INFO.filter(b => POPULAR_IDS.includes(b.id));
  }, [search, activeCategory]);

  const handleSelect = (businessId: BusinessCategory) => {
    setSelectedBusiness(businessId);
    // Save to localStorage - BarberProfileSetup will read this
    localStorage.setItem('selected_business_type', businessId);
    const bInfo = BUSINESS_CATEGORIES_INFO.find(b => b.id === businessId);
    if (bInfo) {
      localStorage.setItem('selected_business_label', bInfo.label);
      localStorage.setItem('selected_business_icon', bInfo.icon);
    }
    // Small delay for animation then navigate to auth
    setTimeout(() => {
      nav('/business/auth');
    }, 300);
  };

  const getGradient = (category?: string) => {
    return CATEGORY_GRADIENTS[category || 'technology'] || 'from-primary to-accent';
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col animate-fadeIn">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-bg border-b border-border pb-3 px-4 pt-4">
        {/* Title Row */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => nav('/role')} className="p-2 rounded-xl bg-card border border-border text-text-dim hover:text-primary transition-colors">
            ←
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-text">Choose Your Business</h1>
            <p className="text-text-dim text-xs">अपना business चुनें • {BUSINESS_CATEGORIES_INFO.length}+ types</p>
          </div>
        </div>

        {/* SEARCH BAR - Always visible, prominent */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurant, clinic, salon... (Hindi भी चलेगा)"
            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-2xl text-sm focus:outline-none focus:border-primary text-text placeholder:text-text-dim"
            autoFocus={false}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text text-lg">
              ✕
            </button>
          )}
        </div>

        {/* CATEGORY TABS - Horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-card border border-border text-text-dim hover:border-primary/50'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 py-4">

        {/* POPULAR SECTION - shown only when no search/filter */}
        {popularBusinesses.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-text-dim uppercase tracking-wide mb-3">
              🔥 Popular Businesses
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {popularBusinesses.map(business => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  gradient={getGradient(business.category)}
                  isSelected={selectedBusiness === business.id}
                  onSelect={handleSelect}
                  lang={lang}
                  showBadge="Popular"
                />
              ))}
            </div>
          </div>
        )}

        {/* SEARCH RESULTS / FULL LIST */}
        {search && (
          <p className="text-text-dim text-xs mb-3">
            {filteredBusinesses.length} results for "{search}"
          </p>
        )}

        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl">🔍</span>
            <p className="text-text font-semibold mt-3">Koi business nahi mila</p>
            <p className="text-text-dim text-sm mt-1">Try another keyword</p>
          </div>
        ) : (
          <div>
            {activeCategory !== 'all' && (
              <p className="text-sm text-text-dim mb-3">{filteredBusinesses.length} businesses</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {filteredBusinesses.map(business => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  gradient={getGradient(business.category)}
                  isSelected={selectedBusiness === business.id}
                  onSelect={handleSelect}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </div>
  );
}

// -------------------------------------------------------
// BusinessCard Component
// -------------------------------------------------------
function BusinessCard({
  business,
  gradient,
  isSelected,
  onSelect,
  lang,
  showBadge,
}: {
  business: any;
  gradient: string;
  isSelected: boolean;
  onSelect: (id: BusinessCategory) => void;
  lang: string;
  showBadge?: string;
}) {
  return (
    <button
      onClick={() => onSelect(business.id as BusinessCategory)}
      className={`relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all active:scale-95 ${
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-95'
          : 'border-border bg-card hover:border-primary/40 hover:shadow-md'
      }`}
    >
      {/* Badge */}
      {showBadge && (
        <span className="absolute -top-2 left-3 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
          {showBadge}
        </span>
      )}

      {/* Emoji Icon with gradient background */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-2 shadow-sm`}>
        <span className="text-2xl">{business.icon}</span>
      </div>

      {/* Business Name */}
      <p className="text-xs font-semibold text-text leading-tight line-clamp-2">
        {lang === 'hi' ? business.labelHi : business.label}
      </p>

      {/* Category tag */}
      {business.category && (
        <span className="mt-1.5 text-[9px] text-text-dim bg-card-2 px-1.5 py-0.5 rounded-full capitalize">
          {business.category}
        </span>
      )}

      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </button>
  );
}