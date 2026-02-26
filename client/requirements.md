## Packages
zustand | For global cart state management
framer-motion | For premium page transitions and micro-interactions
recharts | For the seller dashboard analytics

## Notes
- RTL Layout required, handled via document.documentElement.dir = "rtl" in App.tsx.
- UI elements use Tailwind logical properties (start, end, pe, ps, ms, me).
- Zustand manages the Cart across the entire application.
- API assumes single familyId per order for simplicity, taking the familyId of the first item in the cart.
