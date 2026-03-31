import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, BusinessProfile, ServiceItem, ReviewEntry } from '../store/AppContext';
import { BUSINESS_CATEGORIES_INFO } from '../constants/businessRegistry';
import BusinessHero from '../components/business/BusinessHero';
import ServiceList from '../components/business/ServiceList';
import LocationMap from '../components/business/LocationMap';
import BookingWidget from '../components/booking/BookingWidget';
import ThemeProvider from '../components/shared/ThemeProvider';

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const { getSalonById, allSalons, getSalonReviews, isFavorite, toggleFavorite } = useApp();
  const nav = useNavigate();

  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'reviews' | 'about'>('services');

  // Review functionality
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Load business data
  useEffect(() => {
    if (id) {
      const realtime = allSalons.find(s => s.uid === id);
      if (realtime) {
        setBusiness(realtime as BusinessProfile);
        setLoading(false);
      } else {
        getSalonById(id).then(s => {
          if (s) setBusiness(s as BusinessProfile);
          setLoading(false);
        });
      }
    }
  }, [id, allSalons]);

  // Load reviews
  useEffect(() => {
    if (id) {
      getSalonReviews(id).then(setReviews);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
        <span className="text-6xl mb-4">🏪</span>
        <h2 className="text-2xl font-bold mb-2">Business Not Found</h2>
        <p className="text-text-dim mb-6">The business you are looking for does not exist or has been removed.</p>
        <button onClick={() => nav(-1)} className="btn-primary">Go Back</button>
      </div>
    );
  }

  const businessInfo = BUSINESS_CATEGORIES_INFO.find(c => c.id === business.businessType) || BUSINESS_CATEGORIES_INFO[0];
  const isFav = isFavorite(business.uid);

  const handleToggleService = (service: ServiceItem) => {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) return prev.filter(s => s.id !== service.id);
      return [...prev, service];
    });
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const totalTime = selectedServices.reduce((sum, s) => sum + (s.avgTime || 15), 0);

  const { user, customerProfile, addReview } = useApp();

  const handleSubmitReview = async () => {
    if (!user || !customerProfile || !business) return;
    setSubmittingReview(true);
    await addReview({
      salonId: business.uid,
      customerId: user.uid,
      customerName: customerProfile.name,
      customerPhoto: customerProfile.photoURL,
      rating: reviewRating,
      comment: reviewComment,
      createdAt: Date.now()
    });
    setReviewComment('');
    setShowReview(false);
    setSubmittingReview(false);
    // reload reviews
    getSalonReviews(business.uid).then(setReviews);
  };

  const pageMotion = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.25 }
  };

  return (
    <ThemeProvider businessInfo={businessInfo}>
      <div className="min-h-screen bg-bg pb-32">
        <motion.div {...pageMotion}>

          {/* HERO SECTION */}
        <BusinessHero
          business={business}
          businessType={businessInfo}
          onBack={() => nav(-1)}
          onShare={() => {
            if (navigator.share) {
              navigator.share({
                title: business.businessName,
                text: `Check out ${business.businessName} on Line Free!`,
                url: window.location.href,
              }).catch(console.error);
            }
          }}
        />

        <div className="p-6 max-w-[480px] mx-auto space-y-8 -mt-6 relative z-20">

          {/* QUICK INFO CHIPS */}
          <div className="flex flex-wrap gap-2">
            {businessInfo.hasHomeService && (
              <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span>🏠</span> Home Service
              </span>
            )}
            {businessInfo.hasVideoConsult && (
              <span className="bg-[#E91E63]/10 text-[#E91E63] border border-[#E91E63]/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span>📹</span> Video Consult
              </span>
            )}
            {businessInfo.supportsGroupBooking && (
              <span className="bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span>👥</span> Group Booking
              </span>
            )}
            {businessInfo.hasEmergencySlot && (
              <span className="bg-[#F44336]/10 text-[#F44336] border border-[#F44336]/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm animate-pulse">
                <span>🚨</span> Emergency
              </span>
            )}
          </div>

          {/* BOOKING WIDGET */}
          <BookingWidget
            businessId={business.uid}
            businessInfo={businessInfo}
            business={business}
            selectedServices={selectedServices}
            totalPrice={totalPrice}
            totalTime={totalTime}
          />

          {/* TABS */}
          <div className="flex gap-2 p-1 bg-card-2 rounded-xl">
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'services' ? 'bg-card text-primary shadow-sm' : 'text-text-dim hover:text-text'
              }`}
            >
              {businessInfo.terminology.item}s
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'reviews' ? 'bg-card text-primary shadow-sm' : 'text-text-dim hover:text-text'
              }`}
            >
              Reviews ({business.totalReviews || 0})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'about' ? 'bg-card text-primary shadow-sm' : 'text-text-dim hover:text-text'
              }`}
            >
              About
            </button>
          </div>

          <AnimatePresence mode="wait">

            {/* SERVICES SECTION */}
            {activeTab === 'services' && (
              <motion.div
                key="services"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <ServiceList
                  title={`${businessInfo.terminology.item}s`}
                  services={business.services || businessInfo.defaultServices}
                  selectedIds={selectedServices.map(s => s.id)}
                  onToggleService={handleToggleService}
                  disabled={!business.isOpen || business.isStopped}
                />
              </motion.div>
            )}

            {/* REVIEWS SECTION */}
            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setShowReview(true)}
                  className="w-full p-3 rounded-xl border border-dashed border-primary/50 text-primary text-sm font-medium mb-4 hover:bg-primary/5 transition-colors"
                >
                  ✍️ Write a Review
                </button>

                <div className="p-6 rounded-2xl glass-card text-center">
                  <span className="text-5xl font-black bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent drop-shadow-sm block mb-1">
                    {business.rating ? business.rating.toFixed(1) : '5.0'}
                  </span>
                  <div className="flex justify-center gap-1 text-gold text-lg mb-2">
                    ★★★★★
                  </div>
                  <p className="text-text-dim text-sm font-medium">Based on {business.totalReviews || 0} reviews</p>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-10 bg-card rounded-2xl border border-border border-dashed">
                    <span className="text-4xl block mb-3 opacity-50">📝</span>
                    <p className="text-text-dim font-medium">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="p-4 rounded-xl bg-card border border-border shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-card-2 overflow-hidden flex-shrink-0">
                            {review.customerPhoto ? (
                              <img src={review.customerPhoto} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm">{review.customerName}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              {[1,2,3,4,5].map(s => (
                                <span key={s} className={`text-xs ${s <= review.rating ? 'text-gold' : 'text-border'}`}>★</span>
                              ))}
                            </div>
                          </div>
                          {review.createdAt && (
                            <span className="text-xs text-text-dim">
                              {new Date(typeof review.createdAt === 'number' ? review.createdAt : Date.now()).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {review.comment && <p className="text-text text-sm leading-relaxed">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ABOUT SECTION */}
            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* Description */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>About Us</h3>
                  <p className="text-text-dim text-sm leading-relaxed">
                    {business.bio || `Welcome to ${business.businessName}. We provide the best ${businessInfo.label.toLowerCase()} services in the city with top professionals.`}
                  </p>
                </div>

                {business.stories && business.stories.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                    <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Gallery</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {business.stories.slice(0, 6).map((story, i) => (
                        <div key={i} className="aspect-square bg-card-2 rounded-lg overflow-hidden relative cursor-pointer group">
                          <img src={story.url} alt="Gallery item" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          {i === 5 && business.stories && business.stories.length > 6 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-xl">
                              +{business.stories.length - 6}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Map */}
                <LocationMap
                  address={business.location || "123 Business Street, City, State"}
                  onCopy={() => {
                    navigator.clipboard.writeText(business.location);
                    alert("Address copied!"); // Will be replaced by toast in Phase 55
                  }}
                  onDirections={() => {
                    window.open(`https://maps.google.com/?q=${encodeURIComponent(business.location || business.businessName)}`, '_blank');
                  }}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* STICKY BOTTOM BAR */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg/80 backdrop-blur-xl border-t border-border z-40 pb-safe">
          <div className="max-w-[480px] mx-auto flex gap-3">
            <a
              href={`tel:${business.phone}`}
              className="flex-1 py-3.5 rounded-xl bg-card border border-border flex items-center justify-center gap-2 text-text font-bold text-sm shadow-sm active:scale-95 transition-transform"
            >
              📞 Call
            </a>
            <a
              href={`https://wa.me/91${business.phone}?text=Hi%20${encodeURIComponent(business.businessName)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 py-3.5 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 flex items-center justify-center gap-2 font-bold text-sm shadow-sm active:scale-95 transition-transform"
            >
              💬 WhatsApp
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(business.location || business.businessName)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 py-3.5 rounded-xl bg-[#2196F3]/10 text-[#2196F3] border border-[#2196F3]/20 flex items-center justify-center gap-2 font-bold text-sm shadow-sm active:scale-95 transition-transform"
            >
              📍 Directions
            </a>
            <button
              onClick={() => toggleFavorite(business.uid)}
              className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center text-xl shadow-sm active:scale-95 transition-transform flex-shrink-0"
            >
              {isFav ? '❤️' : '🤍'}
            </button>
          </div>
        </div>

      </motion.div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReview && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Write a Review</h2>
              <p className="text-text-dim text-sm mb-3">{business.businessName}</p>

              <div className="flex gap-2 justify-center mb-4">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    onClick={() => setReviewRating(s)}
                    className={`text-4xl transition-transform active:scale-90 ${s <= reviewRating ? 'text-gold scale-110 drop-shadow-sm' : 'text-border'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-center text-sm font-bold text-primary mb-5">
                {reviewRating === 5 ? '🤩 Excellent!' : reviewRating === 4 ? '😊 Good' : reviewRating === 3 ? '😐 Average' : reviewRating === 2 ? '😕 Poor' : '😞 Bad'}
              </p>

              <textarea
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="Share your experience... (optional)"
                className="w-full bg-card-2 border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm mb-5 h-28 resize-none"
              />

              <div className="flex gap-3">
                <button onClick={() => setShowReview(false)} className="flex-1 py-3 rounded-xl border border-border font-bold text-text-dim transition-colors hover:bg-card-2">
                  Cancel
                </button>
                <button onClick={handleSubmitReview} disabled={submittingReview} className="flex-1 py-3 rounded-xl btn-primary font-bold transition-all disabled:opacity-50">
                  {submittingReview ? 'Submitting...' : 'Submit'}
                </button>
              </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </ThemeProvider>
  );
}
