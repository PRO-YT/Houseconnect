# HouseConnect

HouseConnect is a production-lean MVP for a premium real estate marketplace that connects:

- Property seekers
- Verified real estate agents
- Landlords and property owners
- Marketplace admins

The product is designed for trust-sensitive markets like Nigeria and similar African ecosystems, where moderation, fee clarity, verification, and mobile performance matter as much as visual polish.

## Architecture Summary

- Frontend: Next.js App Router, TypeScript, Tailwind CSS v4
- Backend: Next.js route handlers and server components
- Auth: Signed `HttpOnly` session cookies with role-based server guards
- Data: Prisma schema for PostgreSQL, plus rich demo data for instant MVP walkthroughs
- Monetization: Subscription plans, featured listing hooks, verification fee scaffolding
- Trust: Verification queue, reviewed listings, fraud reports, moderation states, disclosure panels

## MVP Modules Included

- Marketing website and trust-focused landing pages
- Listing discovery with URL-based filters and pagination
- Property detail pages with gallery, map-ready section, inquiry, and booking flows
- Authentication pages and signed-session API routes
- Buyer, agent, landlord, and admin dashboards
- Messaging, inquiry, booking, moderation, verification, and billing-ready API routes
- Prisma schema and seed script for PostgreSQL
- SEO basics: metadata, dynamic listing pages, sitemap, robots

## Demo Accounts

All seeded demo users use the same password:

`SecurePass123!`

Available demo emails:

- `buyer@houseconnect.africa`
- `agent@houseconnect.africa`
- `proagent@houseconnect.africa`
- `landlord@houseconnect.africa`
- `admin@houseconnect.africa`

## Project Structure

```text
app/
  api/                    Route handlers for auth, listings, inquiries, bookings, billing, admin
  auth/                   Sign-in, sign-up, reset-password scaffolds
  dashboard/              Buyer, agent, landlord, admin workspaces
  listings/               Search and property detail pages
  about/, pricing/, etc.  Public marketing pages
components/
  dashboard/              Tables, queues, message modules
  forms/                  Sign-in, sign-up, inquiry, booking, listing, verification forms
  layout/                 Header, footer, dashboard shell, marketing hero
  property/               Search controls, property cards, gallery, map block
  ui/                     Buttons, cards, badges, inputs, section headings
lib/
  data/demo.ts            Rich demo marketplace data
  auth.ts                 Session signing, role guards, password hashing helpers
  repository.ts           Search, dashboard, and lookup helpers
  validators.ts           Input validation layer for routes and forms
prisma/
  schema.prisma           PostgreSQL relational schema
  seed.ts                 Seed script for users, plans, listings, profiles, media
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Update at least:

- `SESSION_SECRET`
- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`

4. Generate Prisma client and seed the database:

```bash
npx prisma generate
npm run db:push
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

## Environment Variables

See [.env.example](./.env.example).

Core variables:

- `NEXT_PUBLIC_SITE_URL`
- `SESSION_SECRET`
- `DATABASE_URL`
- `PAYSTACK_SECRET_KEY`
- `FLUTTERWAVE_SECRET_KEY`
- `RESEND_API_KEY`
- `CLOUDINARY_*`
- `GOOGLE_MAPS_API_KEY`
- `SENTRY_DSN`

## Deployment Guidance

Recommended production setup:

- Frontend and route handlers: Vercel
- Database: Neon, Supabase, Railway Postgres, or Render Postgres
- Media: Cloudinary or S3-compatible storage
- Email: Resend, Postmark, or SendGrid
- Payments: Paystack and Flutterwave first, Stripe-ready abstraction if needed

Production checklist:

1. Replace demo repository reads with Prisma-backed repositories where persistence is required.
2. Run `prisma migrate deploy` instead of `db:push`.
3. Use a long random `SESSION_SECRET`.
4. Wire the email abstraction to a real provider.
5. Connect payment provider secrets on the server only.
6. Add Sentry or another error monitor.
7. Tighten CSP if third-party embeds are added.

## Security Notes

The MVP includes:

- Signed `HttpOnly` session cookies
- Password hashing helpers
- Role-based access guards
- Input sanitization and validation helpers
- In-memory rate limiting for auth, inquiry, booking, messaging, and contact routes
- Security headers in middleware
- No secret exposure in public code

Production follow-up recommended:

- Replace in-memory rate limiting with Redis or Upstash
- Move from demo auth to persistent database auth
- Add CSRF protection if cross-site form exposure is expanded
- Add audit logging persistence for sensitive admin actions
- Add virus scanning and MIME checks for real file uploads

## MVP Assumptions

- Demo marketplace data powers the UI immediately so the product is explorable before full database wiring.
- Prisma models represent the target production data contract.
- Social login, phone OTP, full checkout, and persistent live chat are scaffolded conceptually but not fully integrated.
- WhatsApp is treated as an optional support CTA, while the platform remains the primary trust record.
- Public listing discovery only shows approved properties.

## Future Roadmap

- Replace demo repositories with Prisma CRUD services end to end
- Add persistent favorites, compare lists, and saved search alerts
- Add agent public profile pages and landlord-agent assignment views
- Add full payment checkout, webhooks, and invoice history
- Add advanced fraud detection and duplicate listing scoring
- Add richer analytics funnels and conversion reporting
- Add map autocomplete and area landing pages
- Add document uploads with moderation review UI

## Notes For Review

- The app is intentionally modular and future-extensible rather than overbuilt.
- Admin styling follows the same premium visual language as the public product.
- Search, trust indicators, and conversion CTAs are prioritized over decorative complexity.
