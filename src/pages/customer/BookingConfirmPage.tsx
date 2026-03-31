import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import BookingConfirmComponent from '../../components/booking/BookingConfirm';
import { useApp } from '../../store/AppContext';
import { TokenEntry } from '../../store/AppContext';

interface RouterState {
  booking?: TokenEntry;
  salon?: any;
}

export default function BookingConfirmPage() {
  const loc = useLocation();
  const nav = useNavigate();
  const { t } = useApp();

  const state = loc.state as RouterState;

  if (!state?.booking || !state?.salon) {
    return <Navigate to="/customer/home" replace />;
  }

  const { booking, salon } = state;

  const handleShare = () => {
    const text = `Booking Confirmed at ${salon.salonName}!\nToken: #${booking.tokenNumber}\nDate: ${booking.date}\nTime: ${booking.time || 'N/A'}\nServices: ${booking.selectedServices.map(s => s.name).join(', ')}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleViewBookings = () => {
    nav('/customer/tokens');
  };

  const handleTrackLive = () => {
    nav('/customer/tokens'); // You might have a specific tracking route or use tokens
  };

  return (
    <div className="min-h-screen bg-background">
      <BookingConfirmComponent
        tokenNumber={booking.tokenNumber}
        salonName={salon.salonName}
        services={booking.selectedServices.map(s => s.name)}
        date={booking.date}
        time={booking.time}
        totalAmount={booking.totalPrice}
        onShare={handleShare}
        onViewBookings={handleViewBookings}
        onTrackLive={handleTrackLive}
      />
    </div>
  );
}
