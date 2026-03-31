import { useState } from 'react';
import { useApp, MenuItem } from '../../store/AppContext';
import MenuItemCard from './MenuItemCard';

export default function MenuDisplay({ items }: { items: MenuItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(items.map(i => i.category || 'Other').filter(Boolean)))];

  const filteredItems = activeCategory === 'All' ? items : items.filter(i => (i.category || 'Other') === activeCategory);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border
              ${activeCategory === cat ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-card border-border text-text-dim hover:text-text'}`}>
            {cat}
          </button>
        ))}
      </div>
      <div className="grid gap-3">
        {filteredItems.map(item => (
          <div key={item.id} className="p-3 rounded-2xl glass-card border border-border/50">
            <MenuItemCard item={item} />
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-text-dim">
             <span className="text-4xl block mb-2 opacity-50">🍽️</span>
             <p>No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
