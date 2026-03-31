import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, BusinessProfile } from '../../store/AppContext';
import { BusinessCategoryInfo } from '../../constants/businessRegistry';
import QueueCard from './QueueCard';
import TokenDisplay from './TokenDisplay';
import { useNavigate } from 'react-router-dom';

export interface BookingWidgetProps {
  businessId: string;
  businessInfo: BusinessCategoryInfo;
  business: BusinessProfile;
  selectedServices: { id: string; name: string; price: number; avgTime?: number }[];
  totalPrice: number;
  totalTime: number;
}

export default function BookingWidget({
  businessId,
  businessInfo,
  business,
  selectedServices,
  totalPrice,
  totalTime
}: BookingWidgetProps) {
  const { user } = useApp();
  const nav = useNavigate();

  const [isGettingToken, setIsGettingToken] = useState(false);
  const [tokenResult, setTokenResult] = useState<{ tokenNumber: number; date: string } | null>(null);

  // Real-time queue count state
  const [queueCount, setQueueCount] = useState(0);

  // Appointment state
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    const waiting = Math.max(0, business.totalTokensToday - business.currentToken);
    setQueueCount(waiting);
  }, [business.totalTokensToday, business.currentToken]);

  const estimatedWait = queueCount * (businessInfo.defaultServices[0]?.avgTime || 15);

  const hasTimedSlots = businessInfo.hasTimedSlots;
  const isClosed = !business.isOpen;
  const isPaused = business.isStopped;

  // Generate next 5 days for appointment picker
  const upcomingDates = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  // Generate slots (mocking a 10am to 6pm schedule for demonstration if businessHours is missing)
  const [openStr, closeStr] = business.businessHours ? business.businessHours.split('-') : ['10:00', '18:00'];

  const { getSalonTokens } = useApp();
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  const todayStrForQuery = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()+1).padStart(2,'0')}-${String(selectedDate.getDate()).padStart(2,'0')}`;

  useEffect(() => {
    if (hasTimedSlots) {
      getSalonTokens(businessId, todayStrForQuery).then(tokens => {
        // Find all tokens that have an advanceDate matching todayStrForQuery (for exact match logic)
        // or just rely on the existing advanceDate field to extract the booked time
        const times = tokens
          .filter(t => t.status !== 'cancelled' && t.isAdvanceBooking && t.advanceDate && t.advanceDate.includes('at '))
          .map(t => t.advanceDate!.split('at ')[1]);
        setBookedSlots(times);
      });
    }
  }, [businessId, todayStrForQuery, hasTimedSlots, getSalonTokens]);

  // Simple time parse (HH:mm)
  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const openMinutes = parseTime(openStr);
  const closeMinutes = parseTime(closeStr);
  const slotDuration = 30; // 30 min slots

  const availableSlots = [];
  for (let m = openMinutes; m < closeMinutes; m += slotDuration) {
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

    const isBooked = bookedSlots.includes(timeString);

    // Check if slot is in the past for today
    const now = new Date();
    const isToday = selectedDate.getDate() === now.getDate() && selectedDate.getMonth() === now.getMonth();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const isPast = isToday && m <= currentMinutes;

    if (!isPast) {
      availableSlots.push({ time: timeString, booked: isBooked });
    }
  }

  // Pulse animation trigger on queue count change
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 500);
    return () => clearTimeout(t);
  }, [queueCount]);

  const { customerProfile, getToken } = useApp();

  const handleBookingClick = async () => {
    if (!user || !customerProfile) {
      nav('/customer/auth', { state: { returnTo: `/customer/salon/${businessId}` } });
      return;
    }

    if (selectedServices.length === 0) return;
    if (hasTimedSlots && !selectedSlot) return;

    setIsGettingToken(true);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const tokenNumber = business.totalTokensToday + 1;

    const bookingDateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()+1).padStart(2,'0')}-${String(selectedDate.getDate()).padStart(2,'0')}`;
    const advanceDateString = hasTimedSlots ? `${bookingDateStr} at ${selectedSlot}` : (bookingDateStr !== todayStr ? bookingDateStr : undefined);
    const isAdvanceBooking = hasTimedSlots || bookingDateStr !== todayStr;

    const tokenData = {
      salonId: business.uid,
      salonName: business.businessName || business.name,
      customerId: user.uid,
      customerName: customerProfile.name,
      customerPhone: customerProfile.phone,
      tokenNumber,
      selectedServices: selectedServices as any, // Cast to avoid strict type mismatch on avgTime/price
      totalTime,
      totalPrice,
      estimatedWaitMinutes: estimatedWait,
      status: 'waiting' as const,
      createdAt: Date.now(),
      date: isAdvanceBooking ? bookingDateStr : todayStr, // Ensure tokens are created under the date they are booked for
      isAdvanceBooking,
      advanceDate: advanceDateString,
    };

    const tokenId = await getToken(tokenData);

    if (tokenId) {
      setTokenResult({ tokenNumber, date: advanceDateString || todayStr });
    } else {
      alert("Failed to create booking. Please try again.");
    }
    setIsGettingToken(false);
  };

  const handleViewBookings = () => {
    nav('/customer/tokens');
  };

  return (
    <div className="w-full">
      {/* Modes Switch based on businessInfo */}
      {!hasTimedSlots ? (
        // QUEUE MODE
        <QueueCard
          queueCount={queueCount}
          estimatedWait={estimatedWait}
          isPaused={isPaused}
          isClosed={isClosed}
          opensAt={business.businessHours?.split('-')[0]}
          className="mb-6"
        />
      ) : (
        // APPOINTMENT MODE
        <div className="p-4 rounded-2xl glass-card border border-border mb-6">
          <div className="mb-4">
            <h4 className="text-sm font-bold mb-3">Select Date</h4>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {upcomingDates.map((d, i) => {
                const isSelected = selectedDate.getDate() === d.getDate();
                const isToday = i === 0;
                const isTomorrow = i === 1;
                let displayDay = d.toLocaleDateString('en-US', { weekday: 'short' });
                if (isToday) displayDay = "Today";
                else if (isTomorrow) displayDay = "Tmrw";

                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedSlot(null);
                    }}
                    className={`flex-shrink-0 min-w-[60px] p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                        : 'bg-card border-border hover:border-primary/30'
                    }`}
                  >
                    <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-text-dim'}`}>{displayDay}</div>
                    <div className="font-bold text-lg">{d.getDate()}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold mb-3 flex justify-between">
              <span>Select Time</span>
              {availableSlots.length > 0 && <span className="text-text-dim text-xs font-normal">{slotDuration} min slots</span>}
            </h4>

            {availableSlots.length === 0 ? (
              <div className="text-center py-6 text-text-dim bg-card-2 rounded-xl">
                <span className="text-2xl mb-2 block">😴</span>
                <p className="text-sm">No slots available for this date.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot, i) => {
                  const isSelected = selectedSlot === slot.time;
                  return (
                    <button
                      key={i}
                      disabled={slot.booked}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        slot.booked
                          ? 'bg-card-2 text-text-dim/50 border border-transparent cursor-not-allowed'
                          : isSelected
                            ? 'bg-primary/20 border-primary text-primary shadow-sm'
                            : 'bg-card border-border hover:border-primary/50 text-text'
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main CTA */}
      <AnimatePresence>
        {selectedServices.length > 0 && !tokenResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full"
          >
            <motion.button
              whileTap={{ scale: isClosed || isPaused ? 1 : 0.98 }}
              animate={pulse ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
              onClick={handleBookingClick}
              disabled={isClosed || isPaused || isGettingToken || (hasTimedSlots && !selectedSlot)}
              className={`w-full py-4 px-6 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all ${
                isClosed || isPaused || (hasTimedSlots && !selectedSlot)
                  ? 'bg-card border border-border text-text-dim opacity-60 cursor-not-allowed shadow-none'
                  : 'btn-primary'
              }`}
            >
              {isGettingToken ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : isClosed ? (
                <span>Closed</span>
              ) : isPaused ? (
                <span>Paused</span>
              ) : (
                <>
                  <span>🎟️</span>
                  <span>{hasTimedSlots ? 'Confirm Appointment' : businessInfo.terminology.action}</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State */}
      <AnimatePresence>
        {tokenResult && (
          <TokenDisplay
            tokenNumber={tokenResult.tokenNumber}
            businessName={business.businessName || business.name}
            selectedServices={selectedServices.map(s => s.name)}
            totalTime={totalTime}
            totalPrice={totalPrice}
            date={tokenResult.date}
            onViewBookings={handleViewBookings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
