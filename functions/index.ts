import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import sgMail from "@sendgrid/mail";
import PDFDocument from "pdfkit";

admin.initializeApp();
const db = admin.firestore();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || functions.config().sendgrid?.key;
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// === PHASE 81: AUTOMATED REMINDERS ===
// Runs every 15 minutes to check for upcoming or completed tokens/bookings
export const bookingReminders = functions.pubsub
  .schedule("every 15 minutes")
  .onRun(async (context) => {
    const now = new Date();
    const nowMs = now.getTime();
    const tokensRef = db.collection("tokens");

    // We check for tokens scheduled today
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const snap = await tokensRef.where("date", "==", dateStr).get();

    for (const doc of snap.docs) {
      const token = doc.data();
      if (!token.customerId || token.status === "cancelled" || token.status === "no-show") continue;

      const userDoc = await db.collection("customers").doc(token.customerId).get();
      if (!userDoc.exists) continue;

      // Calculate appointment time if advance booking, or use estimatedWaitMinutes
      let aptTimeMs = 0;
      if (token.isAdvanceBooking && token.advanceDate) {
         aptTimeMs = new Date(token.advanceDate).getTime();
      } else {
         aptTimeMs = token.createdAt + (token.estimatedWaitMinutes || 0) * 60000;
      }

      const diffMin = (aptTimeMs - nowMs) / 60000;

      // 2 hours before: Time to get ready
      if (diffMin > 115 && diffMin <= 130 && !token.reminder2hSent) {
         await sendNotification(token.customerId, {
           title: "Time to get ready! ⏰",
           body: `Your appointment at ${token.salonName} is in 2 hours.`,
           type: "reminder_2h"
         });
         await doc.ref.update({ reminder2hSent: true });
      }
      // 30 mins before: Start heading over
      else if (diffMin > 15 && diffMin <= 30 && !token.reminder30mSent) {
         await sendNotification(token.customerId, {
           title: "Start heading over! 🚗",
           body: `Your appointment at ${token.salonName} is in 30 minutes.`,
           type: "reminder_30m"
         });
         await doc.ref.update({ reminder30mSent: true });
      }

      // After completion: Review request
      if (token.status === "done" && !token.reviewRequestSent && (nowMs - aptTimeMs) > 3600000) { // 1 hour after
         await sendNotification(token.customerId, {
           title: "How was your experience? ⭐",
           body: `Please review your recent visit to ${token.salonName}.`,
           type: "review_request",
           data: { salonId: token.salonId }
         });
         await doc.ref.update({ reviewRequestSent: true });
      }
    }
  });

export const daily24hReminders = functions.pubsub
  .schedule("0 8 * * *") // 8 AM daily
  .timeZone("Asia/Kolkata")
  .onRun(async (context) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    const snap = await db.collection("tokens").where("date", "==", dateStr).get();
    for (const doc of snap.docs) {
      const token = doc.data();
      if (token.status !== "waiting" && token.status !== "serving") continue;

      await sendNotification(token.customerId, {
        title: "Upcoming Appointment 📅",
        body: `Reminder: You have an appointment at ${token.salonName} tomorrow.`,
        type: "reminder_24h"
      });
      await doc.ref.update({ reminder24hSent: true });
    }
  });

// === PHASE 82: OWNER REPORTS AUTOMATION ===

// Monthly PDF report (1st of every month at 9 AM)
export const monthlyOwnerReports = functions.pubsub
  .schedule("0 9 1 * *")
  .timeZone("Asia/Kolkata")
  .onRun(async (context) => {
    if (!SENDGRID_API_KEY) return console.log("No Sendgrid Key");

    const snap = await db.collection("barbers").get();
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    for (const doc of snap.docs) {
      const barber = doc.data();
      if (!barber.ownerEmail) continue;

      const tokensSnap = await db.collection("tokens")
        .where("salonId", "==", barber.uid)
        .where("createdAt", ">=", lastMonth.getTime())
        .get();

      let revenue = 0;
      let newCustomers = new Set();

      tokensSnap.forEach(tDoc => {
        const t = tDoc.data();
        if (t.status === "done") {
           revenue += (t.totalPrice || 0);
           if (t.customerId) newCustomers.add(t.customerId);
        }
      });

      // Generate PDF
      const pdfBuffer: Buffer = await new Promise(resolve => {
        const doc = new PDFDocument();
        const buffers: any[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });

        doc.fontSize(20).text(`Monthly Report for ${barber.businessName}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Date: ${lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`);
        doc.moveDown();
        doc.fontSize(16).text(`Total Bookings: ${tokensSnap.size}`);
        doc.fontSize(16).text(`Revenue: Rs. ${revenue}`);
        doc.fontSize(16).text(`Unique Customers: ${newCustomers.size}`);

        doc.end();
      });

      const msg = {
        to: barber.ownerEmail,
        from: "noreply@linefree.in",
        subject: `Your Monthly Report - ${lastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        text: `Hello ${barber.ownerName},\n\nPlease find your monthly report attached.\n\nBest,\nLine Free Team`,
        attachments: [
          {
            content: pdfBuffer.toString('base64'),
            filename: `LineFree_MonthlyReport_${lastMonth.getMonth()+1}_${lastMonth.getFullYear()}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      };

      try {
        await sgMail.send(msg);
      } catch (err) {
        console.error("SendGrid error:", err);
      }
    }
  });


// Weekly email report (Sundays at 9 PM)
export const weeklyOwnerReports = functions.pubsub
  .schedule("0 21 * * 0")
  .timeZone("Asia/Kolkata")
  .onRun(async (context) => {
    if (!SENDGRID_API_KEY) return console.log("No Sendgrid Key");

    const snap = await db.collection("barbers").get();
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

    for (const doc of snap.docs) {
      const barber = doc.data();
      if (!barber.ownerEmail) continue; // Requires email

      // Gather stats
      const tokensSnap = await db.collection("tokens")
        .where("salonId", "==", barber.uid)
        .where("createdAt", ">=", oneWeekAgo)
        .get();

      let revenue = 0;
      let newCustomers = new Set();

      tokensSnap.forEach(tDoc => {
        const t = tDoc.data();
        if (t.status === "done") {
           revenue += (t.totalPrice || 0);
           if (t.customerId) newCustomers.add(t.customerId);
        }
      });

      const msg = {
        to: barber.ownerEmail,
        from: "noreply@linefree.in",
        subject: "Your Weekly Business Report - Line Free",
        text: `Hello ${barber.ownerName},\n\nHere is your weekly summary:\nBookings: ${tokensSnap.size}\nRevenue: ₹${revenue}\nNew Customers: ${newCustomers.size}\n\nKeep up the great work!\n- Line Free Team`,
        html: `<h3>Weekly Report for ${barber.businessName}</h3>
               <p><strong>Total Bookings:</strong> ${tokensSnap.size}</p>
               <p><strong>Revenue:</strong> ₹${revenue}</p>
               <p><strong>Unique Customers:</strong> ${newCustomers.size}</p>
               <br><p>Best,</p><p>Line Free Team</p>`
      };

      try {
        await sgMail.send(msg);
      } catch (err) {
        console.error("SendGrid error:", err);
      }
    }
  });

async function sendNotification(userId: string, payload: any) {
  if (!userId) return;
  await db.collection("notifications").add({
    userId,
    ...payload,
    read: false,
    createdAt: Date.now()
  });
}
