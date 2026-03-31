// src/pages/customer/ReviewPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { addDoc, collection, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import BackButton from '../../components/BackButton';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_TAGS = [
  'Clean', 'Fast', 'Friendly', 'Good Value', 'Great Ambience', 'Professional', 'Highly Recommend'
];

export default function ReviewPage() {
  const { businessId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useApp();

  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]); // Optional
  const [loading, setLoading] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (photos.length + newFiles.length > 3) {
        toast.error('Maximum 3 photos allowed');
        return;
      }
      setPhotos([...photos, ...newFiles]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user || !businessId) return;
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload photos if any (Mock implementation)
      const photoUrls: string[] = []; // In a real app, upload these to Firebase Storage

      // 2. Create review document
      const reviewData = {
        businessId,
        customerId: user.uid,
        customerName: profile?.name || 'Anonymous',
        customerAvatar: profile?.photoURL || '',
        rating,
        tags: selectedTags,
        comment,
        photos: photoUrls,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await addDoc(collection(db, 'reviews'), reviewData);

      // 3. Update business average rating (using increment for simplicity, real app needs transaction)
      const businessRef = doc(db, 'businesses', businessId);
      await updateDoc(businessRef, {
        totalReviews: increment(1),
        // Simplistic avg update, a proper cloud function is recommended
        // rating: increment(rating)
      });

      toast.success('Review submitted successfully! 🎉');
      navigate(`/customer/salon/${businessId}`, { replace: true });

    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <BackButton to={`/customer/salon/${businessId}`} />

      <div className="mt-6 mb-8">
        <h1 className="text-2xl font-black mb-2">Write a Review</h1>
        <p className="text-text-dim text-sm">Share your experience to help others.</p>

        {/* Progress Bar */}
        <div className="flex gap-2 mt-6">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center py-10"
          >
            <h2 className="text-xl font-bold mb-8 text-center">How would you rate your experience?</h2>

            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => { setRating(star); setTimeout(() => setStep(2), 300); }}
                  className="text-5xl focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <span className={star <= rating ? 'text-gold' : 'text-border grayscale opacity-30 drop-shadow-sm'}>
                    ★
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-8 text-primary font-bold text-lg h-8">
              {rating === 1 && "Terrible 😞"}
              {rating === 2 && "Poor 😕"}
              {rating === 3 && "Okay 😐"}
              {rating === 4 && "Good 🙂"}
              {rating === 5 && "Excellent! 🤩"}
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col"
          >
            <h2 className="text-xl font-bold mb-6">What stood out to you?</h2>

            <div className="flex flex-wrap gap-3">
              {QUICK_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-card text-text-dim border-border hover:border-primary/50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-12">
              <button onClick={() => setStep(1)} className="px-6 py-3 font-semibold text-text-dim">Back</button>
              <button onClick={() => setStep(3)} className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg">Next</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            <h2 className="text-xl font-bold mb-2">Tell us more</h2>
            <p className="text-text-dim text-xs mb-6">Describe your experience in a few words.</p>

            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="The service was great because..."
              className="w-full bg-card border border-border rounded-3xl p-5 text-sm h-48 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none shadow-inner"
            />

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(2)} className="px-6 py-3 font-semibold text-text-dim">Back</button>
              <button onClick={() => setStep(4)} className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg">Next</button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col"
          >
            <h2 className="text-xl font-bold mb-2">Add Photos (Optional)</h2>
            <p className="text-text-dim text-xs mb-6">Show off your new look or the clean salon!</p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                  <img src={URL.createObjectURL(photo)} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}

              {photos.length < 3 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors text-primary">
                  <span className="text-2xl mb-1">+</span>
                  <span className="text-xs font-bold">Add Photo</span>
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="flex justify-between mt-auto pt-8 border-t border-border">
              <button onClick={() => setStep(3)} className="px-6 py-3 font-semibold text-text-dim" disabled={loading}>Back</button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 max-w-[200px] ml-4 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
