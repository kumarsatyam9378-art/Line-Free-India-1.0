import { useState, useEffect } from 'react';
import { useApp, planFeatures } from '../store/AppContext';
import BottomNav from '../components/BottomNav';
import BackButton from '../components/BackButton';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: '/month',
    features: ['50 Bookings', '5 Gallery Photos', '1 Staff Member', '7 Days Analytics'],
    cta: 'Current Plan',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 299,
    period: '/month',
    features: ['200 Bookings', '15 Gallery Photos', '3 Staff Members', '30 Days Analytics', 'Priority Support'],
    cta: 'Upgrade to Basic',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 599,
    period: '/month',
    badge: 'Most Popular 🔥',
    features: ['1000 Bookings', '50 Gallery Photos', '10 Staff Members', '90 Days Analytics', 'Advance Booking Extensions'],
    cta: 'Upgrade to Pro',
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 1199,
    period: '/month',
    features: ['Unlimited Bookings', 'Unlimited Photos', 'Unlimited Staff', '365 Days Analytics', 'Dedicated Account Manager'],
    cta: 'Upgrade to Elite',
  },
];

export default function BarberSubscription() {
  const { barberProfile, t, isBarberSubscribed } = useApp();
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentPlan = barberProfile?.subscriptionPlan || 'free';
  const isSubscribed = isBarberSubscribed();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscribe = async (plan: typeof PLANS[0]) => {
    if (plan.price === 0) return;
    if (!barberProfile) return;
    if (!RAZORPAY_KEY) {
      toast.error('Payment gateway not configured');
      return;
    }

    setLoading(true);

    const options = {
      key: RAZORPAY_KEY,
      amount: plan.price * 100, // paise
      currency: 'INR',
      name: 'Line Free',
      description: `${plan.name} Subscription for ${barberProfile.businessName}`,
      handler: async function (response: any) {
        try {
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1);

          await updateDoc(doc(db, 'businesses', barberProfile.uid), {
            subscriptionPlan: plan.id,
            subscriptionExpiry: expiryDate.getTime(),
            lastPaymentId: response.razorpay_payment_id
          });

          setShowCelebration(true);
          toast.success(`Upgraded to ${plan.name} Plan successfully!`);
          setTimeout(() => setShowCelebration(false), 5000);
        } catch (error) {
          console.error("Error updating subscription:", error);
          toast.error("Payment successful but failed to update plan. Please contact support.");
        }
      },
      prefill: {
        name: barberProfile.name,
        contact: barberProfile.phone,
      },
      theme: {
        color: '#EAB308' // primary gold
      }
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(response.error.description || 'Payment failed');
      });
      rzp.open();
    } catch (err) {
      toast.error('Could not open payment gateway');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 animate-fadeIn relative">
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl animate-bounce">🎉</div>
        </div>
      )}

      <div className="p-6">
        <BackButton to="/barber/home" />
        <h1 className="text-2xl font-bold mb-1">{t('sub.barber.title')}</h1>
        <p className="text-text-dim text-sm mb-5">Choose the right plan for your business</p>

        {isSubscribed && barberProfile?.subscriptionPlan && (
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 mb-5 flex items-center gap-3">
            <span className="text-2xl">👑</span>
            <div>
              <p className="text-primary font-bold">Active {PLANS.find(p => p.id === currentPlan)?.name} Plan</p>
              <p className="text-sm text-text-dim">Your subscription is active. Thank you!</p>
            </div>
          </div>
        )}

        {/* Plans */}
        <div className="space-y-4">
          {PLANS.map((plan, i) => {
            const isCurrent = currentPlan === plan.id;

            return (
              <div key={plan.id} className={`p-5 rounded-2xl border relative overflow-hidden animate-fadeIn ${
                isCurrent ? 'border-primary bg-primary/5' : plan.badge ? 'premium-card border-primary' : 'bg-card border-border'
              }`} style={{ animationDelay: `${i * 0.1}s` }}>
                {plan.badge && !isCurrent && (
                  <span className="absolute -top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-primary text-white text-xs font-bold">
                    {plan.badge}
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-0 right-0 px-4 py-1.5 rounded-bl-xl bg-success text-white text-xs font-bold">
                    Current
                  </span>
                )}

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold gradient-text">₹{plan.price}</span>
                  <span className="text-text-dim text-sm">{plan.period}</span>
                </div>
                <p className="font-semibold mb-3 text-lg">{plan.name} Plan</p>

                <ul className="space-y-2 mb-5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-sm text-text-dim flex items-center gap-2">
                      <span className="text-success text-xs">✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isCurrent || loading}
                  className={`w-full ${isCurrent ? 'btn-secondary opacity-50 cursor-not-allowed' : plan.badge ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {isCurrent ? 'Current Plan' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-8 overflow-x-auto bg-card rounded-2xl border border-border p-4">
          <h3 className="font-bold text-lg mb-4">Feature Comparison</h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="py-2 text-text-dim font-medium">Feature</th>
                <th className="py-2 font-medium">Free</th>
                <th className="py-2 font-medium text-primary">Basic</th>
                <th className="py-2 font-medium text-primary">Pro</th>
                <th className="py-2 font-medium text-primary">Elite</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/10">
                <td className="py-3 text-text-dim">Bookings/mo</td>
                <td className="py-3">{planFeatures.free.bookings}</td>
                <td className="py-3 text-primary">{planFeatures.basic.bookings}</td>
                <td className="py-3 text-primary">{planFeatures.pro.bookings}</td>
                <td className="py-3 text-primary">Unltd</td>
              </tr>
              <tr className="border-b border-border/10">
                <td className="py-3 text-text-dim">Gallery Photos</td>
                <td className="py-3">{planFeatures.free.gallery}</td>
                <td className="py-3 text-primary">{planFeatures.basic.gallery}</td>
                <td className="py-3 text-primary">{planFeatures.pro.gallery}</td>
                <td className="py-3 text-primary">Unltd</td>
              </tr>
              <tr className="border-b border-border/10">
                <td className="py-3 text-text-dim">Staff Members</td>
                <td className="py-3">{planFeatures.free.staff}</td>
                <td className="py-3 text-primary">{planFeatures.basic.staff}</td>
                <td className="py-3 text-primary">{planFeatures.pro.staff}</td>
                <td className="py-3 text-primary">Unltd</td>
              </tr>
              <tr>
                <td className="py-3 text-text-dim">Analytics History</td>
                <td className="py-3">{planFeatures.free.analyticsDays}d</td>
                <td className="py-3 text-primary">{planFeatures.basic.analyticsDays}d</td>
                <td className="py-3 text-primary">{planFeatures.pro.analyticsDays}d</td>
                <td className="py-3 text-primary">{planFeatures.elite.analyticsDays}d</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
