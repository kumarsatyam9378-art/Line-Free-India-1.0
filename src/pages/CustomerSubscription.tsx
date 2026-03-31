import { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
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
    features: ['Basic search', 'Standard booking', 'Public reviews'],
    cta: 'Current Plan',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    period: '/month',
    features: ['Wait time alerts', 'Favorite salons notifications', 'Priority support'],
    cta: 'Upgrade to Basic',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    period: '/month',
    badge: 'Popular 🔥',
    features: ['Advance booking', '30min call alert', 'Exclusive discounts', 'Everything in Basic'],
    cta: 'Upgrade to Pro',
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 599,
    period: '/month',
    features: ['Skip the queue (1/mo)', 'Premium support', 'Home service priority', 'Everything in Pro'],
    cta: 'Upgrade to Elite',
  },
];

export default function CustomerSubscription() {
  const { customerProfile, t } = useApp();
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentPlan = customerProfile?.subscription || 'free';

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
    if (!customerProfile) return;
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
      description: `${plan.name} Subscription for ${customerProfile.name}`,
      handler: async function (response: any) {
        try {
          await updateDoc(doc(db, 'customers', customerProfile.uid), {
            subscription: plan.id,
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
        name: customerProfile.name,
        contact: customerProfile.phone,
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
        <BackButton to="/customer/home" />
        <h1 className="text-2xl font-bold mb-1">{t('sub.customer.title')}</h1>
        <p className="text-text-dim text-sm mb-5">Unlock premium features for a better experience</p>

        {customerProfile?.subscription && customerProfile.subscription !== 'free' && (
          <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 mb-5 flex items-center gap-3">
            <span className="text-2xl animate-float">👑</span>
            <div>
              <p className="text-gold font-bold">Active {PLANS.find(p => p.id === currentPlan)?.name} Plan</p>
              <p className="text-sm text-text-dim">Your subscription is active. Enjoy premium features!</p>
            </div>
          </div>
        )}

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

                <div className="flex items-center gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-lg">{plan.name} Plan</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold gradient-text">₹{plan.price}</span>
                      <span className="text-text-dim text-sm">{plan.period}</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-1.5 mb-4">
                  {plan.features.map((f, j) => (
                    <li key={j} className="text-sm text-text-dim flex items-center gap-2">
                      <span className="text-success text-xs">✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isCurrent || loading}
                  className={`w-full py-3 text-sm ${isCurrent ? 'btn-secondary opacity-50 cursor-not-allowed' : plan.badge ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {isCurrent ? 'Current Plan' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
