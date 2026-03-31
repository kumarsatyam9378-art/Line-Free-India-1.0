// src/hooks/useLoyalty.ts
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useApp } from '../store/AppContext';

export interface LoyaltyTier {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  minPoints: number;
  perk: string;
  color: string;
}

export const TIERS: LoyaltyTier[] = [
  { name: 'Bronze', minPoints: 0, perk: '1% back on bookings', color: 'from-[#CD7F32]/80 to-[#CD7F32]/20' },
  { name: 'Silver', minPoints: 500, perk: '3% back on bookings', color: 'from-gray-400 to-gray-200' },
  { name: 'Gold', minPoints: 2000, perk: '5% back + Priority Booking', color: 'from-yellow-500 to-yellow-300' },
  { name: 'Platinum', minPoints: 5000, perk: '10% back + Free Premium Service', color: 'from-indigo-600 to-purple-400' },
];

export function useLoyalty() {
  const { user } = useApp();
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPoints = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'customers', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().loyaltyPoints) {
          setPoints(docSnap.data().loyaltyPoints);
        } else {
          // Fallback calculate from total bookings
          const q = query(collection(db, 'bookings'), where('customerId', '==', user.uid), where('status', '==', 'completed'));
          const querySnapshot = await getDocs(q);
          let totalSpent = 0;
          querySnapshot.forEach(doc => {
            totalSpent += doc.data().totalPrice || 0;
          });

          // 1 point per 10 rs spent
          const calculatedPoints = Math.floor(totalSpent / 10);
          setPoints(calculatedPoints);

          // Save back
          await updateDoc(docRef, { loyaltyPoints: calculatedPoints });
        }
      } catch (err) {
        console.error('Error fetching loyalty points:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, [user]);

  const currentTier = TIERS.slice().reverse().find(t => points >= t.minPoints) || TIERS[0];

  const nextTierIndex = TIERS.findIndex(t => t.name === currentTier.name) + 1;
  const nextTier = nextTierIndex < TIERS.length ? TIERS[nextTierIndex] : null;

  const progress = nextTier ? ((points - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 : 100;

  return {
    points,
    currentTier,
    nextTier,
    progress,
    loading
  };
}
