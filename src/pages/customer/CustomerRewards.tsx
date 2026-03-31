// src/pages/customer/CustomerRewards.tsx
import React from 'react';
import { useLoyalty, TIERS } from '../../hooks/useLoyalty';
import BackButton from '../../components/BackButton';
import BottomNav from '../../components/BottomNav';
import { motion } from 'framer-motion';

export default function CustomerRewards() {
  const { points, currentTier, nextTier, progress, loading } = useLoyalty();

  return (
    <div className="min-h-screen pb-24 bg-background animate-fadeIn">
      <div className="p-6">
        <BackButton to="/customer/home" />

        <div className="flex items-center justify-between mb-8 mt-2">
          <h1 className="text-2xl font-black">🎁 Rewards</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-48 rounded-3xl bg-card animate-pulse" />
            <div className="h-20 rounded-2xl bg-card animate-pulse" />
            <div className="h-64 rounded-3xl bg-card animate-pulse" />
          </div>
        ) : (
          <>
            {/* Tier Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-6 rounded-3xl bg-gradient-to-br ${currentTier.color} text-white shadow-xl relative overflow-hidden mb-6`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-5 -mb-5" />

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-1">Current Tier</p>
                    <h2 className="text-3xl font-black">{currentTier.name}</h2>
                  </div>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 text-2xl">
                    {currentTier.name === 'Bronze' ? '🥉' : currentTier.name === 'Silver' ? '🥈' : currentTier.name === 'Gold' ? '🥇' : '💎'}
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-black">{points}</span>
                    <span className="text-sm font-medium text-white/80 pb-1">pts</span>
                  </div>

                  {nextTier ? (
                    <div>
                      <div className="flex justify-between text-xs font-medium text-white/80 mb-2">
                        <span>{points} / {nextTier.minPoints}</span>
                        <span>{nextTier.minPoints - points} pts to {nextTier.name}</span>
                      </div>
                      <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-white rounded-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full inline-block text-xs font-bold border border-white/30">
                      MAX TIER UNLOCKED
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* How to Earn */}
            <div className="p-5 rounded-3xl bg-card border border-border mb-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">✨</span> How to Earn
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5">📅</div>
                  <div>
                    <p className="font-bold text-sm text-text">Book Services</p>
                    <p className="text-xs text-text-dim mt-0.5">Earn 1 pt for every ₹10 spent.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success mt-0.5">⭐</div>
                  <div>
                    <p className="font-bold text-sm text-text">Leave Reviews</p>
                    <p className="text-xs text-text-dim mt-0.5">Earn 50 pts for every verified review.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold mt-0.5">🔗</div>
                  <div>
                    <p className="font-bold text-sm text-text">Refer Friends</p>
                    <p className="text-xs text-text-dim mt-0.5">Earn 200 pts when they complete a booking.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Tiers Guide */}
            <h3 className="font-bold text-lg mb-4 mt-8 ml-1">Tiers & Perks</h3>
            <div className="space-y-3">
              {TIERS.map((tier, idx) => {
                const isCurrent = tier.name === currentTier.name;
                const isPassed = points >= tier.minPoints && !isCurrent;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                      isCurrent
                        ? `bg-gradient-to-r ${tier.color} text-white shadow-md border-transparent`
                        : isPassed
                          ? 'bg-card border-border opacity-60'
                          : 'bg-card border-border'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${
                      isCurrent ? 'bg-white/20 text-white shadow-inner' : 'bg-background shadow-inner'
                    }`}>
                      {tier.name === 'Bronze' ? '🥉' : tier.name === 'Silver' ? '🥈' : tier.name === 'Gold' ? '🥇' : '💎'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className={`font-bold ${isCurrent ? 'text-white' : 'text-text'}`}>{tier.name}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCurrent ? 'bg-white text-black' : isPassed ? 'bg-success/20 text-success' : 'bg-background text-text-dim'
                        }`}>
                          {isCurrent ? 'Current' : isPassed ? 'Unlocked' : `${tier.minPoints} pts`}
                        </span>
                      </div>
                      <p className={`text-xs ${isCurrent ? 'text-white/80' : 'text-text-dim'}`}>{tier.perk}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
