import { useState, useMemo } from 'react';
import { BUSINESS_CATEGORIES_INFO } from '../../constants/businessRegistry';
import { BusinessCategory, useApp } from '../../store/AppContext';

interface BusinessTypeSetupProps {
  initialType?: BusinessCategory;
  onSelect: (typeId: BusinessCategory) => void;
  onBack: () => void;
}

export default function BusinessTypeSetup({ initialType, onSelect, onBack }: BusinessTypeSetupProps) {
  const { lang, t } = useApp();
  const [search, setSearch] = useState('');

  // Find initial if provided
  const [selectedTypeId, setSelectedTypeId] = useState<BusinessCategory | null>(initialType || null);

  const filtered = useMemo(() => {
    return BUSINESS_CATEGORIES_INFO.filter(b => {
      const q = search.toLowerCase();
      return b.label.toLowerCase().includes(q) || b.labelHi.includes(q) || (b.tags && b.tags.some(t => t.toLowerCase().includes(q)));
    });
  }, [search]);

  return (
    <div className="flex flex-col animate-fadeIn">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Select Business Type</h1>
        <p className="text-text-dim text-sm mt-1">Choose your industry to get customized features</p>
      </div>

      <div className="relative mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search e.g. 'Salon', 'Clinic', 'Restaurant'"
          className="w-full bg-card border border-border rounded-2xl py-3 px-4 pl-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">🔍</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {filtered.map(b => {
          const isSelected = selectedTypeId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedTypeId(b.id)}
              className={`bg-card border rounded-2xl p-4 text-center transition-all active:scale-[0.98] relative overflow-hidden group ${
                isSelected
                  ? 'border-primary ring-1 ring-primary/50 bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 text-primary">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {b.mostPopular && !isSelected && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{b.icon}</div>
              <p className={`font-semibold text-sm leading-tight transition-colors ${isSelected ? 'text-primary' : 'text-text group-hover:text-primary'}`}>
                {lang === 'hi' ? b.labelHi : b.label}
              </p>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-text-dim mt-10 mb-8">
          <span className="text-4xl">🤷‍♂️</span>
          <p className="mt-2 text-sm">No business type found</p>
          <button onClick={() => setSelectedTypeId('other')} className="text-primary font-medium mt-2">
            Select "Other Business"
          </button>
        </div>
      )}

      <div className="mt-auto flex gap-3 pb-8">
        <button onClick={onBack} className="btn-secondary flex-1 py-3 rounded-xl font-semibold">
          {t('btn.back') || 'Back'}
        </button>
        <button
          onClick={() => selectedTypeId && onSelect(selectedTypeId)}
          disabled={!selectedTypeId}
          className="btn-primary flex-1 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('btn.continue') || 'Continue'}
        </button>
      </div>
    </div>
  );
}
