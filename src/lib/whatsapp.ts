// src/lib/whatsapp.ts

export const openWhatsApp = (phone: string, message: string) => {
  if (!phone) return;
  // Ensure phone has country code
  const formattedPhone = phone.startsWith('+') ? phone.replace('+', '') : `91${phone}`;
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  window.open(url, '_blank');
};

export const generateBookingConfirmMessage = (booking: any, businessName: string) => {
  return `Hi! Your booking at *${businessName}* is confirmed.

📅 Date: ${booking.date}
⏰ Time: ${booking.time}
📝 Service(s): ${booking.services?.map((s: any) => s.name).join(', ') || 'General'}
💰 Total: ₹${booking.totalPrice || 0}

Track your booking status here:
https://linefree.in/b/${booking.businessId}

Thank you for choosing us!`;
};

export const generateBusinessShareMessage = (business: any) => {
  return `Check out *${business.salonName || business.name}* on Line Free!

Book your appointment instantly:
https://linefree.in/b/${business.id}`;
};
