## 2024-05-18 - Prevent unnecessary cascading re-renders via useMemo
**Learning:** Initializing derived lists using `useEffect` and `useState` can lead to unnecessary multi-render waterfalls, especially when the lists compute based on app-wide contexts that update frequently.
**Action:** Always derive filtered lists from context values synchronously with `useMemo` in React components, replacing the anti-pattern of managing them in component state populated via `useEffect`.
