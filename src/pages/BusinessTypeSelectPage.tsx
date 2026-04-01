import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, BusinessCategory } from '../store/AppContext';
import { BUSINESS_CATEGORIES_INFO } from '../constants/businessRegistry';
import BackButton from '../components/BackButton';

export default function BusinessTypeSelectPage() {
  const { lang, t } = useApp();
  const nav = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = new Set(BUSINESS_CATEGORIES_INFO.map(b => b.category || 'Other'));
    return ['All', ...Array.from(cats)].sort();
  }, []);

  const filtered = useMemo(() => {
    return BUSINESS_CATEGORIES_INFO.filter(b => {
      const matchCat = activeCategory === 'All' || b.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = q === '' ||
        b.label.toLowerCase().includes(q) ||
        b.labelHi.includes(q) ||
        (b.tags && b.tags.some(tag => tag.toLowerCase().includes(q)));

      return matchCat && matchSearch;
    });
  }, [search, activeCategory]);

  const handleSelect = (id: BusinessCategory) => {
    localStorage.setItem('selected_business_type', id);
    nav('/business/auth');
  };

  return (
    <div className="min-h-screen flex flex-col p-6 animate-fadeIn bg-bg text-text pb-20">
      <div className="flex items-center gap-3 mb-6">
        <BackButton onClick={() => nav('/role')} />
        <div>
          <h1 className="text-xl font-bold">Select Business Type</h1>
          <p className="text-text-dim text-xs">What kind of business do you run?</p>
        </div>
      </div>

      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for your business (e.g. Salon, Cafe, Plumber)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border focus:border-primary/50 transition-colors text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === c
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-card text-text-dim border border-border hover:border-primary/30'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center mt-10">
          <div className="text-4xl mb-3">😕</div>
          <p className="text-text-dim">No business types found.</p>
          <button
            onClick={() => setSearch('')}
            className="text-primary mt-2 text-sm font-medium"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map(b => (
            <button
              key={b.id}
              onClick={() => handleSelect(b.id)}
              className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all flex flex-col items-center gap-3 active:scale-[0.98] group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--cat-primary,#6C63FF)] to-[var(--cat-accent,#4ECDC4)] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <span className="text-2xl">{b.icon}</span>
              </div>
              <p className="font-semibold text-sm text-center line-clamp-2">
                {lang === 'hi' ? b.labelHi : b.label}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
