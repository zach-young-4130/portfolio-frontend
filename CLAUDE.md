# portfolio-frontend — project guidelines

Angular 21 standalone app (SSR enabled), paired with `../portfolio-api`.

This file extends `~/.claude/CLAUDE.md` and the Angular skill. Follow those first; these are project-specific rules.

## 1. Core Angular standards

- Use standalone components only. No NgModules.
- Use `ChangeDetectionStrategy.OnPush` by default.
- Prefer signals (`signal`, `computed`, `effect`) for local/component state.
- Keep TypeScript strict. No `any` unless unavoidable and explained.
- Keep components thin; move API logic into services.

## 2. App structure

Use this structure as the default:

- `src/app/core` for singleton services, guards, interceptors, models.
- `src/app/shared` for reusable UI pieces.
- `src/app/features` for route-based features.

Expected feature pages for this project:

- `home`
- `projects`
- `faq`
- `community`
- `contact`
- `admin` (login + CMS)

## 3. Routing and loading

- Public routes:
  - `/`
  - `/projects`
  - `/faq`
  - `/community`
  - `/contact`
- Admin routes:
  - `/admin/login`
  - `/admin/**` (guarded)
- Lazy-load non-root features with `loadChildren`/`loadComponent`.

## 4. Styling and UI framework

- Use Bootstrap 5 + NgBootstrap only.
- Do not mix Angular Material.
- Keep theme tokens in `src/styles.scss` via CSS custom properties.
- Support both light and dark theme with a single `ThemeService` and root class toggle.
- Visual direction for this portfolio:
  - neutral black/white base
  - Carolina/royal blue accent
  - black-and-white personal photos
  - color project imagery

## 5. API integration contract

- Rails API is cookie-session auth. Always send `withCredentials: true`.
- Use a shared API service in `core/services` to centralize `/api/v1` calls.
- Reuse backend response shapes; do not invent alternative frontend contracts.
- When backend contract changes, update frontend types in the same change.

## 6. Admin CMS expectations

Admin area is backend-driven and should manage:

- Projects CRUD
- FAQ CRUD
- Community involvement CRUD
- Contact message inbox/read state

Use route guard protection and session check endpoint integration.

## 7. Testing requirements

- Write tests for new behavior; do not skip tests for core flows.
- Keep tests near code (`*.spec.ts`).
- Cover at minimum:
  - services that call API
  - auth guard behavior
  - theme toggle behavior
  - contact form validation + submit states
  - one happy-path render test per feature page
- Prefer behavior-focused tests over implementation details.

## 8. Accessibility baseline

- Every interactive control needs an accessible name.
- Icon-only buttons require `aria-label`.
- Form controls require labels (`<label>` or `aria-label`), not placeholder-only.
- Data tables need caption or `aria-label`, plus proper `th` scopes.
- Status/error messages should use `role="status"`/`role="alert"` when appropriate.

## 9. Simplicity and scope discipline

- Build only what is requested.
- Avoid speculative abstractions.
- Reuse existing patterns before adding new ones.
- Keep edits surgical; do not refactor unrelated areas without request.

## 10. Environment and command safety

- Ask before running `npm install`, `npm ci`, `ng serve`, `ng build`, or destructive commands.
- Never commit, amend, or push unless explicitly asked.
