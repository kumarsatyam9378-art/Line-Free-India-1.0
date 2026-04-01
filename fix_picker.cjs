const fs = require('fs');

const path = 'src/components/business/BusinessTypePicker.tsx';
let content = fs.readFileSync(path, 'utf8');

const diff = `<<<<<<< SEARCH
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(b => (
          <button
            key={b.id}
            onClick={() => setSelectedType(b)}
            className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all active:scale-[0.98] relative overflow-hidden group"
          >
            {b.mostPopular && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                POPULAR
              </div>
            )}
            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{b.icon}</div>
            <p className="font-semibold text-sm leading-tight text-text group-hover:text-primary transition-colors">{lang === 'hi' ? b.labelHi : b.label}</p>
          </button>
        ))}
      </div>
=======
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
                style={{ background: \`linear-gradient(135deg, \${colors.from}, \${colors.to})\` }}
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
                    backgroundColor: \`\${colors.from}20\`,
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
>>>>>>> REPLACE`;

const [_, searchStr, replaceStr] = diff.split(/<<<<<<< SEARCH\n|=======\n|>>>>>>> REPLACE/);

if (content.includes(searchStr)) {
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(path, content);
  console.log('Replaced successfully');
} else {
  console.log('Search string not found');
}
