import { useNavigate } from 'react-router-dom';

export default function BusinessTypeSelectPage() {
  const nav = useNavigate();

  const handleSelect = (type: string, label: string, icon: string) => {
    localStorage.setItem('selected_business_type', type);
    localStorage.setItem('selected_business_label', label);
    localStorage.setItem('selected_business_icon', icon);
    nav('/business/auth');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fadeIn bg-background text-text">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-extrabold text-text">Select Business Type</h1>
        <p className="text-text-dim text-sm mt-1">What kind of business do you run?</p>
      </div>

      <div className="w-full space-y-3 max-w-xs">
        <button
          onClick={() => handleSelect('salon', 'Salon & Spa', '✂️')}
          className="w-full p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-4 active:scale-[0.98]"
        >
          <span className="text-3xl">✂️</span>
          <span className="font-semibold text-lg flex-1 text-left">Salon & Spa</span>
        </button>

        <button
          onClick={() => handleSelect('clinic', 'Clinic', '⚕️')}
          className="w-full p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all flex items-center gap-4 active:scale-[0.98]"
        >
          <span className="text-3xl">⚕️</span>
          <span className="font-semibold text-lg flex-1 text-left">Clinic</span>
        </button>
      </div>

      <button onClick={() => nav('/role')} className="mt-8 text-text-dim text-sm hover:text-primary transition-colors">
        ← Back
      </button>
    </div>
  );
}