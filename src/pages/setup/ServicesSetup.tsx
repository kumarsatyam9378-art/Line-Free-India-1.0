import { useState } from 'react';
import { useApp, ServiceItem } from '../../store/AppContext';

interface ServicesSetupProps {
  services: ServiceItem[];
  setServices: (services: ServiceItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ServicesSetup({ services, setServices, onNext, onBack }: ServicesSetupProps) {
  const { t } = useApp();
  const [newService, setNewService] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newTime, setNewTime] = useState('');
  const [showAddService, setShowAddService] = useState(false);

  const addService = () => {
    if (!newService.trim()) return;
    const s: ServiceItem = {
      id: Date.now().toString(),
      name: newService.trim(),
      price: parseInt(newPrice) || 0,
      avgTime: parseInt(newTime) || 15,
    };
    setServices([...services, s]);
    setNewService('');
    setNewPrice('');
    setNewTime('');
    setShowAddService(false);
  };

  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="flex flex-col animate-fadeIn">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Services & Pricing</h1>
        <p className="text-text-dim text-sm mt-1">Review or add the services you offer</p>
      </div>

      <div className="space-y-3 mb-8">
        {services.length === 0 && (
          <p className="text-center text-text-dim text-sm italic py-4">No services added yet.</p>
        )}

        {services.map(s => (
          <div key={s.id} className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border shadow-sm">
            <div className="flex-1">
              <p className="font-semibold text-text">{s.name}</p>
              <p className="text-text-dim text-xs mt-1 font-medium">₹{s.price} • {s.avgTime} min</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setNewService(s.name);
                  setNewPrice(s.price.toString());
                  setNewTime(s.avgTime.toString());
                  removeService(s.id);
                  setShowAddService(true);
                }}
                className="text-text-dim hover:text-primary hover:bg-primary/10 p-2 rounded-xl transition-colors"
                title="Edit"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => removeService(s.id)} className="text-danger hover:bg-danger/10 p-2 rounded-xl transition-colors" title="Delete">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddService ? (
        <div className="mb-8 p-5 bg-card rounded-2xl border border-border space-y-4 animate-slideUp shadow-md">
          <h3 className="font-semibold text-sm text-text-dim">Add New Service</h3>
          <input
            value={newService}
            onChange={e => setNewService(e.target.value)}
            placeholder="Service name (e.g. Haircut)"
            className="input-field w-full text-sm"
          />
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim">₹</span>
              <input
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                placeholder="Price"
                className="input-field w-full text-sm pl-8"
                type="number"
              />
            </div>
            <div className="relative flex-1">
              <input
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                placeholder="Time"
                className="input-field w-full text-sm pr-10"
                type="number"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim text-xs">min</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAddService(false)} className="btn-secondary flex-1 py-2 text-sm">Cancel</button>
            <button onClick={addService} className="btn-primary flex-1 py-2 text-sm font-semibold">Add Service</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddService(true)}
          className="mb-8 w-full p-4 rounded-2xl border-2 border-dashed border-primary/40 text-primary font-semibold hover:bg-primary/5 transition-colors"
        >
          + Add New Service
        </button>
      )}

      <div className="mt-auto flex gap-3 pb-8">
        <button onClick={onBack} className="btn-secondary flex-1 py-3 rounded-xl font-semibold">
          {t('btn.back') || 'Back'}
        </button>
        <button
          onClick={onNext}
          className="btn-primary flex-1 py-3 rounded-xl font-semibold disabled:opacity-50"
          disabled={services.length === 0}
        >
          {t('btn.continue') || 'Continue'}
        </button>
      </div>
    </div>
  );
}
