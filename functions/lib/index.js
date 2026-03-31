"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.weeklyOwnerReports = exports.monthlyOwnerReports = exports.daily24hReminders = exports.bookingReminders = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const pdfkit_1 = __importDefault(require("pdfkit"));
admin.initializeApp();
const db = admin.firestore();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ((_a = functions.config().sendgrid) === null || _a === void 0 ? void 0 : _a.key);
if (SENDGRID_API_KEY) {
    mail_1.default.setApiKey(SENDGRID_API_KEY);
}
// === PHASE 81: AUTOMATED REMINDERS ===
// Runs every 15 minutes to check for upcoming or completed tokens/bookings
exports.bookingReminders = functions.pubsub
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
        if (!token.customerId || token.status === "cancelled" || token.status === "no-show")
            continue;
        const userDoc = await db.collection("customers").doc(token.customerId).get();
        if (!userDoc.exists)
            continue;
        // Calculate appointment time if advance booking, or use estimatedWaitMinutes
        let aptTimeMs = 0;
        if (token.isAdvanceBooking && token.advanceDate) {
            aptTimeMs = new Date(token.advanceDate).getTime();
        }
        else {
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
exports.daily24hReminders = functions.pubsub
    .schedule("0 8 * * *") // 8 AM daily
    .timeZone("Asia/Kolkata")
    .onRun(async (context) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
    const snap = await db.collection("tokens").where("date", "==", dateStr).get();
    for (const doc of snap.docs) {
        const token = doc.data();
        if (token.status !== "waiting" && token.status !== "serving")
            continue;
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
exports.monthlyOwnerReports = functions.pubsub
    .schedule("0 9 1 * *")
    .timeZone("Asia/Kolkata")
    .onRun(async (context) => {
    if (!SENDGRID_API_KEY)
        return console.log("No Sendgrid Key");
    const snap = await db.collection("barbers").get();
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    for (const doc of snap.docs) {
        const barber = doc.data();
        if (!barber.ownerEmail)
            continue;
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
                if (t.customerId)
                    newCustomers.add(t.customerId);
            }
        });
        // Generate PDF
        const pdfBuffer = await new Promise(resolve => {
            const doc = new pdfkit_1.default();
            const buffers = [];
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
                    filename: `LineFree_MonthlyReport_${lastMonth.getMonth() + 1}_${lastMonth.getFullYear()}.pdf`,
                    type: 'application/pdf',
                    disposition: 'attachment'
                }
            ]
        };
        try {
            await mail_1.default.send(msg);
        }
        catch (err) {
            console.error("SendGrid error:", err);
        }
    }
});
// Weekly email report (Sundays at 9 PM)
exports.weeklyOwnerReports = functions.pubsub
    .schedule("0 21 * * 0")
    .timeZone("Asia/Kolkata")
    .onRun(async (context) => {
    if (!SENDGRID_API_KEY)
        return console.log("No Sendgrid Key");
    const snap = await db.collection("barbers").get();
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    for (const doc of snap.docs) {
        const barber = doc.data();
        if (!barber.ownerEmail)
            continue; // Requires email
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
                if (t.customerId)
                    newCustomers.add(t.customerId);
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
            await mail_1.default.send(msg);
        }
        catch (err) {
            console.error("SendGrid error:", err);
        }
    }
});
async function sendNotification(userId, payload) {
    if (!userId)
        return;
    await db.collection("notifications").add(Object.assign(Object.assign({ userId }, payload), { read: false, createdAt: Date.now() }));
}
//# sourceMappingURL=index.js.map