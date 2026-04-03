const fs = require('fs');

let content = fs.readFileSync('src/pages/SalonDetail.tsx', 'utf8');

// I need to add coupon input in the booking flow. Let's check how the booking flow is handled.
// Looking for the selectedServices or totalPrice rendering to add a coupon input.
console.log(content.includes('selectedServices'));
