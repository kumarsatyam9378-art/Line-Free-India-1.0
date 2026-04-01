import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, BusinessCategory } from '../store/AppContext';
import { BUSINESS_CATEGORIES_INFO } from '../constants/businessRegistry';
import { HiMagnifyingGlass, HiArrowLeft } from 'react-icons/hi2';

const CATEGORY_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Food', value: 'food' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Education', value: 'education' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'Retail', value: 'retail' },
  { label: 'Home Services', value: 'home' },
  { label: 'Transport', value: 'transport' },
  { label: 'Real Estate', value: 'realestate' },
  { label: 'Technology', value: 'technology' },
  { label: 'Finance', value: 'finance' },
  { label: 'Agriculture', value: 'agriculture' },
  { label: 'Hospitality', value: 'hospitality' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Specialized', value: 'specialized' },
  { label: 'Digital', value: 'digital' }
];

const POPULAR_IDS = ['restaurant', 'men_salon', 'clinic', 'coaching_institute', 'coaching', 'gym', 'grocery', 'grocery_store', 'medical_store', 'pharmacy', 'hotel'];

const getGradient = (category?: string) => {
  switch (category) {
    case 'food': return 'from-orange-500 to-red-500';
    case 'healthcare': return 'from-blue-500 to-cyan-500';
    case 'beauty': return 'from-pink-500 to-rose-500';
    case 'education': return 'from-purple-500 to-indigo-500';
    case 'fitness': return 'from-green-500 to-emerald-500';
    case 'retail': return 'from-yellow-500 to-orange-400';
    case 'home': return 'from-teal-500 to-green-500';
    case 'transport': return 'from-sky-500 to-blue-600';
    case 'realestate': return 'from-amber-600 to-yellow-500';
    case 'technology': return 'from-violet-500 to-purple-600';
    case 'finance': return 'from-slate-600 to-slate-500';
    case 'finance_&_legal': return 'from-slate-600 to-slate-500';
    case 'agriculture': return 'from-lime-500 to-green-600';
    case 'real_estate': return 'from-amber-600 to-yellow-500';
    case 'tech_&_it': return 'from-violet-500 to-purple-600';
    case 'home_services': return 'from-teal-500 to-green-500';
    case 'special/misc': return 'from-cyan-600 to-teal-500';
    case 'hospitality': return 'from-fuchsia-500 to-pink-600';
    case 'manufacturing': return 'from-gray-500 to-slate-600';
    case 'specialized': return 'from-cyan-600 to-teal-500';
    case 'digital': return 'from-indigo-500 to-violet-500';
    default: return 'from-gray-500 to-gray-700';
  }
};

export default function BusinessTypeSelectPage() {
  const { lang } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBusinesses = useMemo(() => {
    return BUSINESS_CATEGORIES_INFO.filter(b => {
      const bCat = b.category || '';

      let matchCategory = false;
      if (selectedCategory === 'all') matchCategory = true;
      else if (selectedCategory === 'food') matchCategory = bCat === 'food';
      else if (selectedCategory === 'healthcare') matchCategory = bCat === 'healthcare';
      else if (selectedCategory === 'beauty') matchCategory = bCat === 'beauty';
      else if (selectedCategory === 'education') matchCategory = bCat === 'education';
      else if (selectedCategory === 'fitness') matchCategory = bCat === 'fitness';
      else if (selectedCategory === 'retail') matchCategory = bCat === 'retail';
      else if (selectedCategory === 'home') matchCategory = bCat === 'home' || bCat === 'home_services';
      else if (selectedCategory === 'transport') matchCategory = bCat === 'transport';
      else if (selectedCategory === 'realestate') matchCategory = bCat === 'realestate' || bCat === 'real_estate';
      else if (selectedCategory === 'technology') matchCategory = bCat === 'technology' || bCat === 'tech_&_it';
      else if (selectedCategory === 'finance') matchCategory = bCat === 'finance' || bCat === 'finance_&_legal';
      else if (selectedCategory === 'agriculture') matchCategory = bCat === 'agriculture';
      else if (selectedCategory === 'hospitality') matchCategory = bCat === 'hospitality';
      else if (selectedCategory === 'specialized') matchCategory = bCat === 'specialized' || bCat === 'special/misc';

      const q = search.toLowerCase();
      const matchSearch = q === '' ||
        b.label.toLowerCase().includes(q) ||
        b.labelHi.includes(q) ||
        (b.tags && b.tags.some(t => t.toLowerCase().includes(q)));
      return matchCategory && matchSearch;
    });
  }, [search, selectedCategory]);

  const popularBusinesses = useMemo(() => {
    return BUSINESS_CATEGORIES_INFO.filter(b => POPULAR_IDS.includes(b.id));
  }, []);

  const handleSelect = (b: any) => {
    localStorage.setItem('selected_business_type', b.id);
    localStorage.setItem('selected_business_label', lang === 'hi' ? b.labelHi : b.label);
    localStorage.setItem('selected_business_icon', b.icon);
    navigate('/business/auth');
  };

  const showPopular = selectedCategory === 'all' && search === '';

  const renderCard = (b: any) => (
    <button
      key={b.id}
      onClick={() => handleSelect(b)}
      className={`relative overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-transform active:scale-95 hover:scale-[1.02] shadow-sm text-white bg-gradient-to-br ${getGradient(b.category)}`}
    >
      <span className="text-4xl drop-shadow-md">{b.icon}</span>
      <div className="mt-1">
        <p className="font-bold text-sm leading-tight drop-shadow-md">{lang === 'hi' ? b.labelHi : b.label}</p>
        <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-black/20 text-[10px] font-medium backdrop-blur-sm uppercase tracking-wider">
          {b.category || 'Other'}
        </span>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-bg text-text pb-20">
      <div className="sticky top-0 z-20 bg-bg/80 backdrop-blur-xl border-b border-border pt-safe">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <button onClick={() => navigate('/role')} className="p-2 -ml-2 hover:bg-card rounded-full transition-colors">
            <HiArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold leading-tight">Choose Your Business Type</h1>
            <h2 className="text-sm text-text-dim">अपना व्यवसाय चुनें</h2>
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim w-5 h-5" />
            <input
              type="text"
              placeholder="Search business types..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="px-4 pb-3 pt-2 overflow-x-auto no-scrollbar flex gap-2">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === tab.value
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-card border border-border text-text-dim hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-6 space-y-8 animate-fadeIn">
        {showPopular && popularBusinesses.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span>🔥</span> Popular
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {popularBusinesses.slice(0, 8).map(renderCard)}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-bold text-lg mb-4">
            {showPopular ? 'All Categories' : 'Search Results'}
          </h3>
          {filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredBusinesses.map(renderCard)}
            </div>
          ) : (
            <div className="text-center py-10">
              <span className="text-4xl mb-3 block">🔍</span>
              <p className="text-text-dim">No business types found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
