import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { BarberProfile } from '../../store/AppContext';
import { BUSINESS_CATEGORIES_INFO } from '../../constants/businessRegistry';
import { QRCodeSVG } from 'qrcode.react';

export default function DigitalCard() {
  const { businessId } = useParams<{ businessId: string }>();
  const [profile, setProfile] = useState<BarberProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!businessId) return;
      try {
        const docRef = doc(db, 'barbers', businessId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as BarberProfile);
        }
      } catch (error) {
        console.error("Error fetching business profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [businessId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-text">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-text">
        <div className="text-center">
          <span className="text-6xl block mb-4">😔</span>
          <h1 className="text-xl font-bold">Business Not Found</h1>
          <p className="text-text-dim mt-2">The link might be broken or the business has been removed.</p>
        </div>
      </div>
    );
  }

  const bInfo = BUSINESS_CATEGORIES_INFO.find(c => c.id === profile.businessType)
                || BUSINESS_CATEGORIES_INFO.find(c => c.id === 'other')!;

  const currentUrl = window.location.href;
  const shareText = `Check out ${profile.salonName || profile.businessName} on Line Free! \n📍 ${profile.location}\nBook your tokens online and skip the queue!`;

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + currentUrl)}`, '_blank');
  };

  return (
    <div className={`min-h-screen pb-10 ${bInfo.designTheme} bg-bg text-text selection:bg-primary/30`}>
      {/* Banner */}
      <div className="relative h-64 w-full bg-card-2 overflow-hidden">
        {profile.salonImageURL ? (
          <img src={profile.salonImageURL} alt="Business Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-8xl opacity-50">{bInfo.icon}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

        {/* Profile Avatar floating over banner bottom */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-bg bg-card overflow-hidden shadow-2xl z-10">
          {profile.photoURL ? (
            <img src={profile.photoURL} alt="Owner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
          )}
        </div>
      </div>

      <div className="pt-12 px-6 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-black mb-1">{profile.salonName || profile.businessName}</h1>
        <p className="text-primary font-bold text-sm uppercase tracking-widest mb-4">{bInfo.label}</p>

        {profile.bio && (
          <p className="text-text-dim text-sm italic mb-6 leading-relaxed">"{profile.bio}"</p>
        )}

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {profile.location && (
            <div className="p-3 rounded-2xl bg-card border border-border flex flex-col items-center text-center">
              <span className="text-xl mb-1">📍</span>
              <p className="text-xs font-semibold leading-tight">{profile.location}</p>
            </div>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} className="p-3 rounded-2xl bg-card border border-border flex flex-col items-center text-center hover:bg-card-2 transition-colors">
              <span className="text-xl mb-1">📞</span>
              <p className="text-xs font-semibold leading-tight">{profile.phone}</p>
            </a>
          )}
          {profile.businessHours && (
            <div className="p-3 rounded-2xl bg-card border border-border flex flex-col items-center text-center col-span-2">
              <span className="text-xl mb-1">⏰</span>
              <p className="text-xs font-semibold leading-tight">{profile.businessHours}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-10">
          <a
            href={`/customer/salon/${profile.uid}`}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-[0.98]"
          >
            Get Token / Book Appointment
          </a>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsAppShare}
              className="py-3 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <span>💬</span> WhatsApp
            </button>
            {profile.instagram ? (
              <a
                href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                target="_blank" rel="noopener noreferrer"
                className="py-3 rounded-xl bg-[#E1306C]/10 text-[#E1306C] border border-[#E1306C]/30 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span>📸</span> Instagram
              </a>
            ) : (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentUrl);
                  alert('Link copied to clipboard!');
                }}
                className="py-3 rounded-xl bg-card border border-border text-text font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span>🔗</span> Copy Link
              </button>
            )}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="p-6 rounded-3xl bg-card border border-border mb-10 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />

          <h2 className="text-sm font-bold text-text-dim uppercase tracking-widest mb-4 relative z-10">Scan to Book</h2>
          <div className="inline-block p-4 bg-white rounded-2xl shadow-xl relative z-10 mb-4">
            <QRCodeSVG
              value={currentUrl}
              size={160}
              bgColor="#ffffff"
              fgColor="#000000"
              level="Q"
              imageSettings={{
                src: profile.photoURL || '/icon.svg',
                x: undefined,
                y: undefined,
                height: 30,
                width: 30,
                excavate: true,
              }}
            />
          </div>
          <p className="text-xs text-text-dim relative z-10 max-w-[200px] mx-auto">
            Show this QR code to customers so they can join your queue instantly.
          </p>
        </div>

        {/* Services List Preview */}
        {profile.services && profile.services.length > 0 && (
          <div className="text-left">
            <h2 className="text-lg font-bold mb-4 px-2">Our Services</h2>
            <div className="space-y-3">
              {profile.services.map(service => (
                <div key={service.id} className="p-4 rounded-2xl bg-card border border-border flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm">{service.name}</h3>
                    <p className="text-text-dim text-xs mt-0.5">~{service.avgTime} mins</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">₹{service.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 opacity-50 text-xs font-semibold tracking-widest uppercase">
          Powered by Line Free
        </div>
      </div>
    </div>
  );
}
