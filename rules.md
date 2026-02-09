
## 📄 `rules.md`

```md
# Antigravity Frontend Rules (Next.js + Tailwind)

This document defines the coding standards, folder structure, naming conventions, and best practices for the Antigravity Next.js frontend project.

---

# 1. GENERAL PROJECT PRINCIPLES

## 1.1 Clean Code Rules
- Always write readable, maintainable code.
- Avoid duplicated logic (DRY principle).
- Keep components small and reusable.
- Use descriptive naming (no vague names like `data`, `thing`, `temp`).
- Prefer composition over complex inheritance.
- Never push code with console logs unless needed for debugging.

## 1.2 Consistency Rules
- Follow the same structure everywhere.
- If a pattern is chosen, it must be used across the entire project.
- Always follow ESLint + Prettier formatting.

---

# 2. TECH STACK RULES

## 2.1 Must Use
- Next.js App Router
- TypeScript (strict mode)
- TailwindCSS
- Zustand or Redux Toolkit (for global state)
- React Query (TanStack Query) for server fetching and caching
- Axios or Fetch wrapper
- ShadCN UI for UI components (recommended)

---

# 3. FOLDER STRUCTURE RULES

## 3.1 Root Folder Structure

```

src/
app/
components/
features/
hooks/
lib/
services/
store/
styles/
types/
utils/
constants/
assets/

```

---

# 4. APP ROUTER RULES

## 4.1 App Folder Structure

Inside `src/app/`:

```

app/
(auth)/
login/
register/
(dashboard)/
dashboard/
bookings/
api/
layout.tsx
page.tsx
globals.css

```

### Rules:
- Route groups must be wrapped in parentheses: `(auth)`, `(dashboard)`
- Every page must have a `page.tsx`
- Every route must have a `loading.tsx` and `error.tsx` if needed
- Layout must be used for shared UI (navbars, sidebars, wrappers)

---

# 5. COMPONENT STRUCTURE RULES

## 5.1 Component Folder Structure

All reusable UI components must go inside:

```

src/components/
ui/
layout/
common/

```

### Meaning:
- `ui/` → small generic components (Button, Card, Input, Modal)
- `layout/` → navbar, sidebar, footer, wrappers
- `common/` → reusable components used in multiple features

---

# 6. FEATURE-BASED ARCHITECTURE

## 6.1 Feature Folder Rule

Every business domain must be in:

```

src/features/
auth/
booking/
profile/
photographers/

```

Each feature must follow:

```

feature-name/
components/
hooks/
services/
types/
utils/
index.ts

```

Example:

```

src/features/auth/
components/
LoginForm.tsx
RegisterForm.tsx
hooks/
useLogin.ts
services/
auth.service.ts
types/
auth.types.ts
utils/
auth.helpers.ts
index.ts

````

---

# 7. FILE NAMING RULES

## 7.1 Naming Convention
- Components: `PascalCase.tsx`
- Hooks: `useSomething.ts`
- Services: `something.service.ts`
- Types: `something.types.ts`
- Utils: `something.utils.ts`
- Constants: `something.constants.ts`

### Examples:
✅ `BookingCard.tsx`  
✅ `useBookings.ts`  
✅ `booking.service.ts`  
✅ `booking.types.ts`  

❌ `bookingCard.tsx`  
❌ `BookingsHook.ts`  
❌ `serviceBooking.ts`

---

# 8. COMPONENT RULES

## 8.1 Component Rules
- Every component must be a function component.
- Always use TypeScript props interfaces.
- Components must be reusable and flexible.
- No large components (max ~150 lines recommended).
- Split logic into hooks if component becomes complex.

Example:

```tsx
interface BookingCardProps {
  name: string;
  date: string;
}

export function BookingCard({ name, date }: BookingCardProps) {
  return (
    <div className="rounded-xl border p-4">
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-sm text-muted-foreground">{date}</p>
    </div>
  );
}
````

---

# 9. TAILWIND RULES (VERY IMPORTANT)

## 9.1 No Hardcoded Styling

Hardcoding must be avoided.

❌ BAD:

```tsx
<div className="bg-[#123456] text-[17px] p-[13px]" />
```

✅ GOOD:

```tsx
<div className="bg-primary text-base p-4" />
```

---

# 10. TAILWIND VARIABLES RULES

## 10.1 Must Use Theme Variables

All colors must be controlled in Tailwind config / CSS variables.

Use:

* `bg-primary`
* `text-primary`
* `bg-secondary`
* `text-muted-foreground`
* `border-border`

### Allowed custom values

Custom values are allowed ONLY if:

* It is part of design system
* It is declared in `tailwind.config.ts`

---

# 11. DESIGN TOKENS RULE

## 11.1 Define Tokens in CSS

All design tokens must be declared in:

`src/app/globals.css`

Example:

```css
:root {
  --primary: 222 47% 11%;
  --secondary: 210 40% 96%;
  --radius: 12px;
}
```

---

# 12. TAILWIND CONFIG RULES

## 12.1 Tailwind Config Must Define Theme

`tailwind.config.ts` must include:

* colors mapped to CSS variables
* consistent spacing rules
* font family variables
* breakpoints

No random customizations inside components.

---

# 13. STYLING RULES

## 13.1 Global Styles Rule

* Only global resets should be inside `globals.css`
* No custom CSS unless Tailwind cannot solve the problem
* Animations should use Tailwind utilities or plugin

---

# 14. STATE MANAGEMENT RULES

## 14.1 Local vs Global State

* Local UI state belongs in the component
* Shared state belongs in Zustand/Redux store
* Server state belongs in React Query

---

# 15. API & SERVICES RULES

## 15.1 API Calls Must Be Inside Services

No API call should be done inside UI components directly.

❌ BAD:

```tsx
useEffect(() => {
  fetch("/api/bookings")
}, [])
```

✅ GOOD:

```tsx
import { bookingService } from "@/features/booking/services/booking.service";

const data = await bookingService.getBookings();
```

---

# 16. SERVICES STRUCTURE

All API calls must live in:

```
src/services/
  api.ts
```

Feature-specific services live in:

```
src/features/<feature>/services/
```

---

# 17. API WRAPPER RULE

Create one reusable API client:

`src/services/api.ts`

Example:

* configure baseURL
* attach token
* handle errors globally

No repeated fetch logic.

---

# 18. ENVIRONMENT VARIABLES RULE

All environment variables must be inside `.env.local`

Use only:

* `NEXT_PUBLIC_*` for frontend variables
* secure server-only variables without NEXT_PUBLIC

Never hardcode API URLs in code.

---

# 19. TYPESCRIPT RULES

## 19.1 Type Safety

* Never use `any`
* Use `unknown` instead of `any` if needed
* Always define types for API responses
* Always type component props

---

# 20. IMPORT RULES

## 20.1 Absolute Imports

Always import using aliases:

✅ GOOD:

```ts
import { Button } from "@/components/ui/button";
```

❌ BAD:

```ts
import { Button } from "../../../components/ui/button";
```

---

# 21. UTILS & HELPERS RULES

## 21.1 Utility Functions Location

All shared utilities must go into:

```
src/utils/
```

Feature utilities must go into:

```
src/features/<feature>/utils/
```

No helper functions inside components unless extremely small.

---

# 22. CONSTANTS RULES

All constant values must go into:

```
src/constants/
```

Example:

* roles
* app routes
* regex patterns
* pagination limits
* feature flags

Never hardcode repeated values inside components.

---

# 23. ROUTES CONSTANTS RULE

Define routes inside:

`src/constants/routes.ts`

Example:

```ts
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
};
```

---

# 24. ICONS RULES

* Use Lucide icons or a single icon library
* Do not mix multiple icon libraries
* Keep icons consistent in size

---

# 25. ERROR HANDLING RULES

## 25.1 UI Error Handling

* Always show a fallback UI
* Never leave blank screens
* Use toast notifications for important feedback

---

# 26. FORMS RULES

* Use React Hook Form for forms
* Use Zod for validation schemas
* All validation schemas must be in `schemas/`

Example:

```
src/features/auth/schemas/login.schema.ts
```

---

# 27. PERFORMANCE RULES

* Use `dynamic()` for heavy components
* Avoid unnecessary re-renders
* Memoize expensive calculations
* Lazy-load images

---

# 28. IMAGE RULES

* Use Next.js `<Image />`
* Never use `<img />` unless necessary
* Always define width and height

---

# 29. TESTING RULES (Optional but Recommended)

* Use Jest + React Testing Library
* Feature tests must be stored inside each feature folder:

```
src/features/auth/__tests__/
```

---

# 30. EXPORT RULES

Each feature must have an `index.ts` exporting public items.

Example:

```ts
export * from "./components/LoginForm";
export * from "./services/auth.service";
```

No importing deep internal files from other features.

---

# 31. COMMENTS RULES

* Avoid useless comments
* Code should be self-explanatory
* Only comment business logic or tricky sections

---

# 32. GIT RULES

## 32.1 Commit Message Format

Use this format:

* `feat: add login screen`
* `fix: correct booking price bug`
* `refactor: restructure auth feature`
* `chore: update dependencies`

---

# 33. FINAL RULE (NON-NEGOTIABLE)

If a code decision breaks:

* readability
* scalability
* folder structure consistency
* design token usage
* tailwind variable usage

Then it must be refactored before merging.

---

✅ Antigravity frontend must always remain scalable, clean, and feature-based.

```

---
