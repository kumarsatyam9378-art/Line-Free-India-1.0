const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

exports.ping = functions.https.onRequest((request, response) => {
  response.send("pong");
});

// 1. onBookingCreated: Notify business owner
exports.onBookingCreated = functions.firestore
  .document('tokens/{tokenId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    if (!booking) return null;

    try {
      const businessId = booking.salonId;
      const businessSnap = await db.collection('barbers').doc(businessId).get();
      if (!businessSnap.exists) return null;

      const business = businessSnap.data();
      if (!business.fcmToken) return null;

      const message = {
        token: business.fcmToken,
        notification: {
          title: 'New Booking!',
          body: `${booking.customerName} booked for ₹${booking.totalPrice}`
        }
      };

      await messaging.send(message);
    } catch (err) {
      console.error('onBookingCreated error:', err);
    }
    return null;
  });

// 2. onBookingStatusChanged: Update stats and notify customer
exports.onBookingStatusChanged = functions.firestore
  .document('tokens/{tokenId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== 'done' && after.status === 'done') {
      try {
        const businessRef = db.collection('barbers').doc(after.salonId);

        // Use transaction to update stats safely
        await db.runTransaction(async (transaction) => {
          const doc = await transaction.get(businessRef);
          if (!doc.exists) return;
          const data = doc.data();
          const currentBookings = data.totalBookings || 0;
          const currentRevenue = data.totalRevenue || 0;

          transaction.update(businessRef, {
            totalBookings: currentBookings + 1,
            totalRevenue: currentRevenue + (after.totalPrice || 0)
          });
        });

        // Notify customer
        const customerSnap = await db.collection('customers').doc(after.customerId).get();
        if (customerSnap.exists) {
          const customer = customerSnap.data();
          if (customer.fcmToken) {
            await messaging.send({
              token: customer.fcmToken,
              notification: {
                title: 'Service Completed',
                body: `Your service is complete. Please leave a review!`
              }
            });
          }
        }
      } catch (err) {
        console.error('onBookingStatusChanged error:', err);
      }
    }
    return null;
  });

// 3. onReviewCreated: Update average rating
exports.onReviewCreated = functions.firestore
  .document('reviews/{reviewId}')
  .onCreate(async (snap, context) => {
    const review = snap.data();
    if (!review) return null;

    try {
      const businessId = review.salonId;
      const reviewsSnap = await db.collection('reviews').where('salonId', '==', businessId).get();

      let totalRating = 0;
      let count = 0;

      reviewsSnap.forEach(doc => {
        const data = doc.data();
        if (data.rating) {
          totalRating += data.rating;
          count++;
        }
      });

      const avgRating = count > 0 ? (totalRating / count) : 0;

      await db.collection('barbers').doc(businessId).update({
        rating: avgRating,
        reviewCount: count
      });
    } catch (err) {
      console.error('onReviewCreated error:', err);
    }
    return null;
  });

// 4. dailyCleanup: Mark pending as no_show
exports.dailyCleanup = functions.pubsub.schedule('every day 23:00').onRun(async (context) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

  try {
    const tokensSnap = await db.collection('tokens')
      .where('status', '==', 'pending')
      .where('date', '<', todayStr)
      .get();

    const batch = db.batch();
    tokensSnap.forEach(doc => {
      batch.update(doc.ref, { status: 'no_show' });
    });

    if (!tokensSnap.empty) {
      await batch.commit();
      console.log(`Cleaned up ${tokensSnap.size} stale bookings.`);
    }
  } catch (err) {
    console.error('dailyCleanup error:', err);
  }
  return null;
});

// 5. sendQueueReminder: Scheduled queue check
exports.sendQueueReminder = functions.pubsub.schedule('every 10 minutes').onRun(async (context) => {
  // Simplistic approach: just check pending tokens for today. Real implementation would require queue tracking logic.
  console.log('Running sendQueueReminder...');
  return null;
});
