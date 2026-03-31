import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUSINESS_CATEGORIES_INFO, BusinessCategoryInfo } from '../constants/businessRegistry';
import { useApp } from '../store/AppContext';
import BackButton from '../components/BackButton';

export default function BusinessTypeSelectPage() {
  const { lang, t } = useApp();
  const nav = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Derive unique categories from BUSINESS_CATEGORIES_INFO
  const categories = useMemo(() => {
    const cats = new Set<string>();
    BUSINESS_CATEGORIES_INFO.forEach(b => {
      if (b.category) cats.add(b.category);
    });
    return ['all', ...Array.from(cats)];
  }, []);

  const filtered = useMemo(() => {
    return BUSINESS_CATEGORIES_INFO.filter(b => {
      const q = search.toLowerCase();
      const matchesSearch = b.label.toLowerCase().includes(q) || b.labelHi.includes(q) || (b.tags && b.tags.some(t => t.toLowerCase().includes(q)));
      const matchesCategory = activeCategory === 'all' || b.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const handleSelect = (b: BusinessCategoryInfo) => {
    localStorage.setItem('lf_selected_business_type', b.id);
    nav('/business/auth');
  };

  const formatCategoryName = (cat: string) => {
    if (cat === 'all') return 'All Businesses';
    return cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="min-h-screen flex flex-col p-6 animate-fadeIn pb-24 bg-bg text-text">
      <BackButton to="/role" />

      <div className="text-center mb-6 pt-2">
        <h1 className="text-2xl font-bold">Choose Your Business Type</h1>
        <p className="text-text-dim text-sm mt-1">Select your industry to get customized features</p>
      </div>

      <div className="sticky top-0 z-10 bg-bg pt-2 pb-4">
        <div className="relative mb-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search e.g. 'Clinic', 'Restaurant', 'Gym'"
            className="w-full bg-card border border-border rounded-2xl py-3 px-4 pl-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">🔍</span>
        </div>

        {/* Category Filter Tabs */}
        <div className="horizontal-scroll pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                activeCategory === cat
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                  : 'bg-card text-text-dim border-border hover:border-primary/50 hover:text-primary'
              }`}
            >
              {formatCategoryName(cat)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        {filtered.map(b => (
          <button
            key={b.id}
            onClick={() => handleSelect(b)}
            className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all active:scale-[0.98] relative overflow-hidden group flex flex-col items-center"
          >
            {b.mostPopular && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                POPULAR
              </div>
            )}
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
              {b.icon}
            </div>
            <p className="font-semibold text-sm leading-tight text-text group-hover:text-primary transition-colors">
              {lang === 'hi' ? b.labelHi : b.label}
            </p>
            {b.category && (
              <span className="text-[10px] text-text-dim mt-1 px-2 py-0.5 rounded-full bg-card-2">
                {formatCategoryName(b.category)}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-text-dim mt-10">
          <span className="text-4xl">🤷‍♂️</span>
          <p className="mt-2 text-sm">No business type found</p>
          <button onClick={() => {
            const other = BUSINESS_CATEGORIES_INFO.find(c => c.id === 'other');
            if (other) handleSelect(other);
          }} className="text-primary font-medium mt-2">
            Select "Other Business"
          </button>
        </div>
      )}
    </div>
  );
}
