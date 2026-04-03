import jsPDF from 'jspdf';
import { Booking } from '../types/booking.types';

export const generateReceiptPDF = (booking: Booking, businessName: string) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text(businessName, 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Payment Receipt', 105, 30, { align: 'center' });
  doc.line(20, 35, 190, 35);

  // Details
  doc.setFontSize(10);
  doc.text(`Receipt No: ${booking.id?.slice(-6).toUpperCase() || 'N/A'}`, 20, 45);
  doc.text(`Date: ${new Date(booking.bookingDate).toLocaleDateString()}`, 140, 45);
  doc.text(`Customer: ${booking.customerName}`, 20, 55);

  // Services
  doc.text('Services/Items:', 20, 70);
  let y = 80;
  if (booking.services && booking.services.length > 0) {
    booking.services.forEach(s => {
      doc.text(s.name, 30, y);
      doc.text(`Rs. ${s.price}`, 160, y);
      y += 10;
    });
  } else {
    doc.text('General Service', 30, y);
    doc.text(`Rs. ${booking.totalPrice}`, 160, y);
    y += 10;
  }

  doc.line(20, y + 5, 190, y + 5);
  y += 15;

  doc.setFontSize(12);
  doc.text(`Total Amount: Rs. ${booking.totalPrice}`, 140, y);

  doc.setFontSize(10);
  doc.text('Thank you for your visit!', 105, y + 20, { align: 'center' });

  doc.save(`Receipt_${booking.id?.slice(-6)}.pdf`);
};
