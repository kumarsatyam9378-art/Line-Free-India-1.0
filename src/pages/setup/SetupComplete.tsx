import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SetupCompleteProps {
  businessName: string;
}

export default function SetupComplete({ businessName }: SetupCompleteProps) {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Basic CSS Confetti setup
    const style = document.createElement('style');
    style.innerHTML = `
      .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: #f00;
        animation: fall linear forwards;
      }
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(720deg);
        }
      }
    `;
    document.head.appendChild(style);

    const container = document.getElementById('confetti-container');
    if (!container) return;

    for (let i = 0; i < 100; i++) {
      const el = document.createElement('div');
      el.classList.add('confetti');
      el.style.left = Math.random() * 100 + 'vw';
      el.style.backgroundColor = ['#E91E63', '#6C63FF', '#4CAF50', '#FFC107', '#00BCD4'][Math.floor(Math.random() * 5)];
      el.style.animationDuration = Math.random() * 3 + 2 + 's';
      el.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(el);
    }

    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => {
      document.head.removeChild(style);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn relative">
      {showConfetti && <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50 overflow-hidden" />}

      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <span className="text-5xl">🎉</span>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2">You're All Set!</h1>
      <p className="text-text-dim text-center mb-8">
        <span className="font-semibold text-primary">{businessName}</span> is now ready to receive customers and bookings.
      </p>

      <div className="w-full space-y-4 max-w-sm">
        <button
          onClick={() => {
            // Logic to share profile could go here
            if (navigator.share) {
              navigator.share({
                title: businessName,
                text: 'Check out my business on Line Free!',
                url: window.location.origin
              }).catch(console.error);
            } else {
              alert('Profile link copied to clipboard!');
            }
          }}
          className="w-full btn-secondary py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          Share Profile
        </button>

        <button
          onClick={() => navigate('/barber/home')}
          className="w-full btn-primary py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30"
        >
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}
