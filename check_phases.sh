#!/bin/bash

echo "Checking Phase 1: Dependencies"
cat package.json | grep -E "recharts|react-hot-toast|date-fns|react-intersection-observer|react-window|react-cropper|react-helmet-async|algoliasearch|@tanstack/react-query|vite-plugin-pwa"

echo "Checking Phase 5: UI Primitive Components"
ls src/components/ui/ 2>/dev/null || echo "Missing src/components/ui/"

echo "Checking Phase 6: Global State & Context"
ls src/store/useBooking.ts src/store/useAnalytics.ts src/store/useNotifications.ts 2>/dev/null || echo "Missing some hooks in src/store/"
ls src/lib/firebase/auth.ts src/lib/firebase/firestore.ts src/lib/firebase/storage.ts 2>/dev/null || echo "Missing firebase helpers in src/lib/firebase/"

echo "Checking Phase 8: Layout Components"
ls src/components/layout/TopBar.tsx src/components/layout/PageContainer.tsx src/components/layout/SplashScreen.tsx 2>/dev/null || echo "Missing some layout components"

echo "Checking Phase 11: Business Setup Wizard"
ls src/pages/setup/BusinessTypeSetup.tsx src/pages/setup/ServicesSetup.tsx src/pages/setup/HoursSetup.tsx src/pages/setup/SetupComplete.tsx 2>/dev/null || echo "Missing setup wizard pages"

echo "Checking Phase 13: Business Components"
ls src/components/business/BusinessCard.tsx src/components/business/BusinessHero.tsx src/components/business/BusinessBadges.tsx src/components/business/WorkingHours.tsx 2>/dev/null || echo "Missing business components"

echo "Checking Phase 14: Business Detail Components"
ls src/components/business/ServiceCard.tsx src/components/business/ServiceList.tsx src/components/business/LocationMap.tsx 2>/dev/null || echo "Missing business detail components"

echo "Checking Phase 15: Booking Widget Component"
ls src/components/booking/BookingWidget.tsx src/components/booking/QueueCard.tsx src/components/booking/TokenDisplay.tsx 2>/dev/null || echo "Missing booking widget components"

echo "Checking Phase 16: Owner Dashboard Components"
ls src/components/dashboard/StatCard.tsx src/components/dashboard/LiveQueueDisplay.tsx src/components/dashboard/BookingsList.tsx 2>/dev/null || echo "Missing owner dashboard components"

echo "Checking Phase 17: Owner Bookings Page"
ls src/pages/OwnerBookings.tsx src/components/dashboard/BookingCard.tsx 2>/dev/null || echo "Missing owner bookings page"

echo "Checking Phase 18: Live Queue Management"
ls src/pages/OwnerQueue.tsx 2>/dev/null || echo "Missing owner queue page"

echo "Checking Phase 19: Customer Search + Filters"
ls src/components/shared/FilterBar.tsx 2>/dev/null || echo "Missing filter bar component"

echo "Checking Phase 20: Category Browse Pages"
ls src/pages/customer/CategoryPage.tsx 2>/dev/null || echo "Missing category browse page"
