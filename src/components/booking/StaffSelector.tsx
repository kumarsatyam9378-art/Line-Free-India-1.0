import { motion } from 'framer-motion';

export interface Staff {
  id: string;
  name: string;
  photoUrl?: string;
  role?: string;
}

interface StaffSelectorProps {
  staffList: Staff[];
  selectedStaffId: string | null;
  onSelect: (staffId: string | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StaffSelector({ staffList, selectedStaffId, onSelect, onNext, onBack }: StaffSelectorProps) {
  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto pb-32 px-4 space-y-4 pt-4">
        <h2 className="text-xl font-bold mb-6">Select Staff</h2>

        {/* No Preference Option */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(null)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
            selectedStaffId === null
              ? 'bg-primary/10 border-primary'
              : 'bg-card border-border hover:border-primary/50'
          }`}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-primary/20">
            ✨
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">No Preference</h3>
            <p className="text-text-dim text-sm">Any available staff</p>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            selectedStaffId === null ? 'border-primary bg-primary text-white' : 'border-border'
          }`}>
            {selectedStaffId === null && <span className="text-xs">✓</span>}
          </div>
        </motion.div>

        {/* Staff List */}
        {staffList.map(staff => {
          const isSelected = selectedStaffId === staff.id;
          return (
            <motion.div
              whileTap={{ scale: 0.98 }}
              key={staff.id}
              onClick={() => onSelect(staff.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                isSelected
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              {staff.photoUrl ? (
                <img src={staff.photoUrl} alt={staff.name} className="w-16 h-16 object-cover rounded-full border-2 border-border" />
              ) : (
                <div className="w-16 h-16 bg-card-2 rounded-full border-2 border-border flex items-center justify-center text-2xl text-text-dim">
                  👤
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-bold text-lg">{staff.name}</h3>
                {staff.role && <p className="text-text-dim text-sm">{staff.role}</p>}
              </div>

              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                isSelected ? 'border-primary bg-primary text-white' : 'border-border'
              }`}>
                {isSelected && <span className="text-xs">✓</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t border-border shadow-[0_-10px_20px_rgba(0,0,0,0.1)] flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-xl font-bold transition-all bg-card-2 border border-border text-text hover:bg-card active:scale-95"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={selectedStaffId === undefined}
          className={`flex-1 py-4 rounded-xl font-bold text-center transition-all ${
            selectedStaffId !== undefined
              ? 'bg-gradient-to-r from-primary to-accent text-white active:scale-95 shadow-lg shadow-primary/25 hover:shadow-primary/40'
              : 'bg-card-2 text-text-dim opacity-50 cursor-not-allowed border border-border'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
