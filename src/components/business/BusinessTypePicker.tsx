import { useState, useMemo } from 'react';
import { BUSINESS_CATEGORIES_INFO, BusinessCategoryInfo } from '../../constants/businessRegistry';
import { BusinessCategory, useApp } from '../../store/AppContext';
import BackButton from '../BackButton';

export default function BusinessTypePicker({ onSelect }: { onSelect: (typeId: BusinessCategory) => void }) {
  const { lang } = useApp();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<BusinessCategoryInfo | null>(null);

  const filtered = useMemo(() => {
    return BUSINESS_CATEGORIES_INFO.filter(b => {
      const q = search.toLowerCase();
      return b.label.toLowerCase().includes(q) || b.labelHi.includes(q) || (b.tags && b.tags.some(t => t.toLowerCase().includes(q)));
    });
  }, [search]);

  if (selectedType) {
    return (
      <div className="min-h-screen flex flex-col p-6 animate-slideUp bg-bg z-50 fixed inset-0 overflow-y-auto">
        <button onClick={() => setSelectedType(null)} className="text-text-dim text-sm absolute top-6 left-6 hover:text-primary transition-colors">
          ← Back
        </button>
        <div className="mt-12 text-center">
          <span className="text-6xl">{selectedType.icon}</span>
          <h2 className="text-2xl font-bold mt-4">{lang === 'hi' ? selectedType.labelHi : selectedType.label}</h2>
          <div className="flex justify-center gap-2 mt-2">
            {selectedType.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-card-2 text-text-dim px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Included Features</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border p-3 rounded-xl flex items-center gap-2">
              <span className="text-lg">📅</span>
              <span className="text-sm font-medium">Booking / Queue</span>
            </div>
            {selectedType.hasMenu && (
              <div className="bg-card border border-border p-3 rounded-xl flex items-center gap-2">
                <span className="text-lg">📋</span>
                <span className="text-sm font-medium">Digital Menu</span>
              </div>
            )}
            {selectedType.hasTimedSlots && (
              <div className="bg-card border border-border p-3 rounded-xl flex items-center gap-2">
                <span className="text-lg">⏱️</span>
                <span className="text-sm font-medium">Timed Slots</span>
              </div>
            )}
            {selectedType.hasVideoConsult && (
              <div className="bg-card border border-border p-3 rounded-xl flex items-center gap-2">
                <span className="text-lg">📹</span>
                <span className="text-sm font-medium">Video Consult</span>
              </div>
            )}
            {selectedType.hasHomeService && (
              <div className="bg-card border border-border p-3 rounded-xl flex items-center gap-2">
                <span className="text-lg">🏠</span>
                <span className="text-sm font-medium">Home Service</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Example Services</h3>
          <div className="space-y-2">
            {selectedType.defaultServices.slice(0, 4).map(s => (
              <div key={s.id} className="bg-card border border-border p-3 rounded-xl flex justify-between items-center">
                <span className="text-sm font-medium">{s.name}</span>
                <span className="text-xs text-text-dim">₹{s.price}</span>
              </div>
            ))}
            {selectedType.defaultServices.length > 4 && (
              <div className="text-center text-xs text-text-dim mt-2">
                + {selectedType.defaultServices.length - 4} more services included
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex-1 flex items-end">
          <button onClick={() => onSelect(selectedType.id)} className="w-full btn-primary text-lg font-semibold py-4">
            Select {lang === 'hi' ? selectedType.labelHi : selectedType.label}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 animate-fadeIn pb-24">
      <BackButton to="/role" />

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

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(b => {
          const CATEGORY_COLORS: Record<string, { from: string; to: string }> = {
            food:          { from: '#FF5722', to: '#F44336' },
            healthcare:    { from: '#2196F3', to: '#00BCD4' },
            beauty:        { from: '#E91E63', to: '#FF4081' },
            education:     { from: '#9C27B0', to: '#673AB7' },
            fitness:       { from: '#4CAF50', to: '#009688' },
            retail:        { from: '#FF9800', to: '#FF5722' },
            home:          { from: '#009688', to: '#4CAF50' },
            transport:     { from: '#03A9F4', to: '#2196F3' },
            realestate:    { from: '#FF6F00', to: '#FFB300' },
            technology:    { from: '#7C4DFF', to: '#651FFF' },
            finance:       { from: '#607D8B', to: '#455A64' },
            agriculture:   { from: '#8BC34A', to: '#558B2F' },
            hospitality:   { from: '#E040FB', to: '#AA00FF' },
            manufacturing: { from: '#9E9E9E', to: '#616161' },
            specialized:   { from: '#00BCD4', to: '#0097A7' },
            digital:       { from: '#5C6BC0', to: '#3F51B5' },
          };

          const colors = CATEGORY_COLORS[b.category || 'technology'] || CATEGORY_COLORS.technology;

          return (
            <button
              key={b.id}
              onClick={() => setSelectedType(b)}
              className="relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all active:scale-[0.98] border-border bg-card hover:shadow-md hover:border-primary/50 overflow-hidden group"
            >
              {b.mostPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg z-10">
                  POPULAR
                </div>
              )}

              {/* Emoji with gradient background */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform"
                style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
              >
                <span className="text-2xl">{b.icon}</span>
              </div>

              <p className="font-semibold text-xs leading-tight text-text group-hover:text-primary transition-colors line-clamp-2 mt-1">
                {lang === 'hi' ? b.labelHi : b.label}
              </p>

              {/* Category badge */}
              {b.category && (
                <span
                  className="mt-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: `${colors.from}20`,
                    color: colors.from
                  }}
                >
                  {b.category}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-text-dim mt-10">
          <span className="text-4xl">🤷‍♂️</span>
          <p className="mt-2 text-sm">No business type found</p>
          <button onClick={() => setSelectedType(BUSINESS_CATEGORIES_INFO.find(c => c.id === 'other') || null)} className="text-primary font-medium mt-2">
            Select "Other Business"
          </button>
        </div>
      )}
    </div>
  );
}
