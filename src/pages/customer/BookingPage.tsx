import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, ServiceItem, BarberProfile } from '../../store/AppContext';
import BackButton from '../../components/BackButton';
import ServiceSelector from '../../components/booking/ServiceSelector';
import StaffSelector, { Staff } from '../../components/booking/StaffSelector';
import SlotPicker from '../../components/booking/SlotPicker';
import CalendarView from '../../components/booking/CalendarView';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingPage() {
  const { salonId } = useParams<{ salonId: string }>();
  const { allSalons, getSalonById, getSalonTokens, getToken, user, customerProfile, db } = useApp();
  const nav = useNavigate();
  const [salon, setSalon] = useState<BarberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Multi-step state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Booking Data
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [note, setNote] = useState('');
  const [useLoyalty, setUseLoyalty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Existing bookings for slot picker
  const [existingBookings, setExistingBookings] = useState<{ time: string; duration: number }[]>([]);

  // Load Salon Data
  useEffect(() => {
    if (salonId) {
      const rt = allSalons.find(s => s.uid === salonId);
      if (rt) {
        setSalon(rt);
        setLoading(false);
      } else {
        getSalonById(salonId).then(s => {
          setSalon(s);
          setLoading(false);
        });
      }
    }
  }, [salonId, allSalons]);

  // Load Staff Data
  useEffect(() => {
    if (salonId) {
      // Mocking staff query from businesses/{id}/staff since not explicitly defined in AppContext yet
      setStaffList([
        { id: 's1', name: 'John Doe', role: 'Senior Barber' },
        { id: 's2', name: 'Jane Smith', role: 'Stylist' }
      ]);
    }
  }, [salonId]);

  // Load Existing Bookings for Date
  useEffect(() => {
    if (salonId && selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      getSalonTokens(salonId, dateStr).then(tokens => {
        const bookings = tokens
          .filter(t => t.isAdvanceBooking && t.time)
          .map(t => ({ time: t.time!, duration: t.totalTime }));
        setExistingBookings(bookings);
      });
    }
  }, [salonId, selectedDate]);

  if (loading || !salon) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.avgTime, 0);

  const handleConfirm = async () => {
    if (!user || !selectedTime) return;
    setIsSubmitting(true);

    const dateStr = selectedDate.toISOString().split('T')[0];

    // Create advance booking token
    const tokenObj = {
      salonId: salon.uid,
      salonName: salon.salonName,
      customerId: user.uid,
      customerName: customerProfile?.name || user.displayName || 'Customer',
      customerPhone: customerProfile?.phone || '',
      tokenNumber: Math.floor(Math.random() * 9000) + 1000, // random for advance
      selectedServices,
      totalTime: totalDuration,
      totalPrice: totalAmount,
      estimatedWaitMinutes: 0,
      status: 'waiting' as const,
      createdAt: Date.now(),
      date: dateStr,
      isAdvanceBooking: true,
      advanceDate: dateStr,
      time: selectedTime,
      staffId: selectedStaffId || undefined,
      note,
    };

    const tokenId = await getToken(tokenObj);
    setIsSubmitting(false);

    if (tokenId) {
      nav('/customer/booking-confirm', {
        state: { booking: { ...tokenObj, id: tokenId }, salon }
      });
    }
  };

  const getWorkingDays = () => {
    return salon.workingDays || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  };

  const getWorkingHoursForDate = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const isWorkingDay = getWorkingDays().includes(dayName);
    return {
      isOpen: isWorkingDay,
      open: salon.openTime || "09:00",
      close: salon.closeTime || "21:00"
    };
  };

  return (
    <div className="min-h-screen pb-safe bg-background text-text flex flex-col font-sans">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <BackButton customAction={() => {
            if (step > 1) setStep(step - 1 as any);
            else nav(-1);
          }} />
          <div>
            <h1 className="font-bold text-lg">{salon.salonName}</h1>
            <p className="text-text-dim text-xs">Book Appointment</p>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex gap-2 mt-4 mb-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-card overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: step >= i ? '100%' : '0%' }}
                className="h-full bg-gradient-to-r from-primary to-accent"
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-text-dim font-bold uppercase tracking-wider px-1">
          <span className={step >= 1 ? 'text-primary' : ''}>Service</span>
          <span className={step >= 2 ? 'text-primary' : ''}>Time</span>
          <span className={step >= 3 ? 'text-primary' : ''}>Staff</span>
          <span className={step >= 4 ? 'text-primary' : ''}>Confirm</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="absolute inset-0">
              <ServiceSelector
                services={salon.services || []}
                selectedServices={selectedServices}
                onSelect={setSelectedServices}
                onNext={() => setStep(2)}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="absolute inset-0 flex flex-col">
              <div className="pt-4 flex-none">
                <CalendarView
                  selectedDate={selectedDate}
                  onSelectDate={(d) => {
                    setSelectedDate(d);
                    setSelectedTime(null);
                  }}
                  workingDays={getWorkingDays()}
                />
              </div>
              <div className="flex-1 relative mt-2 border-t border-border">
                <SlotPicker
                  date={selectedDate}
                  workingHours={getWorkingHoursForDate(selectedDate)}
                  existingBookings={existingBookings}
                  totalDuration={totalDuration}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="absolute inset-0">
              <StaffSelector
                staffList={staffList}
                selectedStaffId={selectedStaffId}
                onSelect={setSelectedStaffId}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="absolute inset-0 flex flex-col h-full overflow-y-auto pb-32">
              <div className="p-4 space-y-6">
                <h2 className="text-xl font-bold">Review & Confirm</h2>

                {/* Summary Card */}
                <div className="glass-card rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-start border-b border-border/50 pb-4">
                    <div>
                      <h3 className="font-bold text-lg">{salon.salonName}</h3>
                      <p className="text-text-dim text-sm mt-1 flex items-center gap-1">
                        📅 {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {selectedTime}
                      </p>
                    </div>
                    {selectedStaffId ? (
                      <div className="text-right">
                        <p className="text-[10px] text-text-dim uppercase font-bold tracking-wider">Staff</p>
                        <p className="font-semibold text-sm">{staffList.find(s => s.id === selectedStaffId)?.name}</p>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="text-[10px] text-text-dim uppercase font-bold tracking-wider">Staff</p>
                        <p className="font-semibold text-sm">Any</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    {selectedServices.map(s => (
                      <div key={s.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm">{s.name}</p>
                          <p className="text-text-dim text-xs">{s.avgTime} min</p>
                        </div>
                        <p className="font-bold text-sm">₹{s.price}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border/50 flex justify-between items-end">
                    <div>
                      <p className="text-text-dim text-xs uppercase font-bold tracking-wider">Total Amount</p>
                      <p className="text-text-dim text-xs mt-0.5">{totalDuration} min service</p>
                    </div>
                    <p className="text-2xl font-black gradient-text">₹{totalAmount}</p>
                  </div>
                </div>

                {/* Add Note */}
                <div className="space-y-2">
                  <label className="text-sm font-bold ml-1">Add Note (Optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="E.g. Please be gentle, I have sensitive skin..."
                    className="w-full bg-card p-4 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24 text-sm"
                  />
                </div>

                {/* Loyalty Points */}
                <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-warning/10 text-warning flex items-center justify-center text-xl">
                      ⭐
                    </div>
                    <div>
                      <p className="font-bold text-sm">Use Loyalty Points</p>
                      <p className="text-text-dim text-xs">You have 150 points (₹15)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUseLoyalty(!useLoyalty)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${useLoyalty ? 'bg-primary' : 'bg-card-2 border border-border'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow-md ${useLoyalty ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t border-border shadow-[0_-10px_20px_rgba(0,0,0,0.1)] flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-4 rounded-xl font-bold transition-all bg-card-2 border border-border text-text hover:bg-card active:scale-95"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-xl font-bold text-center transition-all bg-gradient-to-r from-primary to-accent text-white active:scale-95 shadow-lg shadow-primary/25 hover:shadow-primary/40 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <span>Confirm Booking</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
