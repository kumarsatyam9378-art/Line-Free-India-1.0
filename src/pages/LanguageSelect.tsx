import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, Lang } from '../store/AppContext';
import { motion } from 'framer-motion';

const languages = [
  { id: 'en', name: 'English', script: 'English', emoji: '🇬🇧', flagBg: 'from-blue-500/20 to-blue-600/20', flagBorder: 'border-blue-500/30' },
  { id: 'hi', name: 'Hindi', script: 'हिंदी', emoji: '🇮🇳', flagBg: 'from-orange-500/20 to-green-600/20', flagBorder: 'border-orange-500/30' },
];

export default function LanguageSelect() {
  const { lang, setLang, t } = useApp();
  const nav = useNavigate();
  const [selectedLang, setSelectedLang] = useState<Lang>(lang as Lang || 'en');

  const handleContinue = () => {
    setLang(selectedLang);
    nav('/role');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg overflow-hidden relative p-6">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 flex flex-col max-w-md w-full mx-auto z-10 pt-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20">
            <span className="text-4xl">✂️</span>
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('selectLanguage', selectedLang)}
          </h1>
          <p className="text-text-dim text-sm mt-2">
            {t('chooseLanguage', selectedLang)}
          </p>
        </motion.div>

        {/* Language Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4 mb-8"
        >
          {languages.map((l) => {
            const isSelected = selectedLang === l.id;
            return (
              <motion.button
                key={l.id}
                variants={itemVariants}
                onClick={() => setSelectedLang(l.id as Lang)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300
                  ${isSelected
                    ? 'bg-gradient-to-br from-primary/20 to-accent/10 border-2 border-primary shadow-lg shadow-primary/20'
                    : 'bg-card border-2 border-border hover:border-primary/50'
                  }
                `}
              >
                {/* Active Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-md"
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}

                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${l.flagBg} border ${l.flagBorder} flex items-center justify-center mb-4 text-3xl shadow-inner`}>
                  {l.emoji}
                </div>
                <div className="text-center">
                  <span className={`block font-bold text-lg mb-1 ${isSelected ? 'text-primary' : 'text-text'}`}>
                    {l.script}
                  </span>
                  <span className={`block text-xs font-medium ${isSelected ? 'text-text' : 'text-text-dim'}`}>
                    {l.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="mt-auto pb-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-xl shadow-primary/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 group"
          >
            {t('continue', selectedLang)}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </motion.button>
        </div>

      </div>
    </div>
  );
}
