import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 0,
    title: 'Koi Line Nahi!',
    subtitle: 'Skip the queue, save your time',
    content: (
      <div className="flex flex-col items-center justify-center h-48 relative">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex space-x-2 absolute"
        >
          <span className="text-4xl">🧍</span>
          <span className="text-4xl">🧍</span>
          <span className="text-4xl">🧍</span>
          <span className="text-4xl">🧍</span>
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 360 }}
          transition={{ delay: 1, duration: 0.5, type: 'spring' }}
          className="absolute w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 z-10"
        >
          <span className="text-5xl text-white">✓</span>
        </motion.div>
      </div>
    ),
  },
  {
    id: 1,
    title: '218+ Business Types',
    subtitle: 'From salons to clinics, we got you covered',
    content: (
      <div className="grid grid-cols-4 gap-4 p-4 h-48 content-center">
        {['✂️', '🏥', '🦷', '🐾', '🚗', '💅', '💆', '👔'].map((emoji, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-4xl flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl shadow-sm backdrop-blur-md"
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    id: 2,
    title: 'For Business Owners',
    subtitle: 'Manage queues, analyze data, grow your business',
    content: (
      <div className="flex flex-col items-center justify-center h-48">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[200px] h-32 bg-card rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="h-8 bg-card-2 flex items-center px-3 gap-1 border-b border-border">
             <div className="w-2 h-2 rounded-full bg-red-400" />
             <div className="w-2 h-2 rounded-full bg-yellow-400" />
             <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <div className="p-3 flex-1 flex flex-col gap-2">
            <div className="h-3 w-1/2 bg-primary/20 rounded-full" />
            <div className="h-2 w-3/4 bg-border rounded-full" />
            <div className="h-2 w-full bg-border rounded-full" />
            <div className="mt-auto flex justify-between">
              <div className="h-8 w-8 bg-primary/20 rounded-lg" />
              <div className="h-8 w-8 bg-accent/20 rounded-lg" />
              <div className="h-8 w-8 bg-gold/20 rounded-lg" />
            </div>
          </div>
        </motion.div>
      </div>
    ),
  },
];

export default function SplashPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      finishOnboarding();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const finishOnboarding = () => {
    localStorage.setItem('onboarding_done', 'true');
    // We use replace to prevent going back to splash screen
    navigate('/language', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg overflow-hidden relative">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center z-10 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center text-center"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x > 50 && currentSlide > 0) {
                setCurrentSlide((prev) => prev - 1);
              } else if (info.offset.x < -50 && currentSlide < slides.length - 1) {
                setCurrentSlide((prev) => prev + 1);
              }
            }}
          >
            {/* Visual Content */}
            <div className="w-full mb-8">
              {slides[currentSlide].content}
            </div>

            {/* Text Content */}
            <h1 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {slides[currentSlide].title}
            </h1>
            <p className="text-text-dim text-lg px-4">
              {slides[currentSlide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="pb-8 pt-4 px-6 z-10 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full ${index === currentSlide ? 'bg-primary' : 'bg-border'}`}
                animate={{ width: index === currentSlide ? 24 : 8 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
          {currentSlide < slides.length - 1 ? (
            <button
              onClick={finishOnboarding}
              className="text-text-dim font-medium hover:text-text transition-colors"
            >
              Skip
            </button>
          ) : (
            <div className="w-8"></div> // Spacer to keep dots centered if we want, or just let it float
          )}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}
