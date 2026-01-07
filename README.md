# Royal Saffron - Jhelum Kesar Co.

E-commerce website for premium Kashmiri Saffron and Himalayan Shilajit products.

## Features

- 🎨 Modern, premium design with rotating hero carousel
- 📱 Fully responsive mobile-first design
- 🛒 Shopping cart with local storage persistence
- 📦 Product catalog with category filtering
- 💬 WhatsApp integration for order inquiries
- 🎯 SEO optimized with Next.js App Router

## Getting Started

### Development

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
npm start
```

## Deployment

This project is configured for deployment on Netlify with automatic deployments from GitHub.

### Setup Instructions

See [GITHUB_SETUP.md](./GITHUB_SETUP.md) for detailed setup instructions.

**Quick Setup:**
1. Create GitHub repository: `jkdrughouse/royal-saffron`
2. Push code: `git push -u origin main`
3. Connect to Netlify: Import from GitHub
4. Deploy automatically on every push!

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Language:** TypeScript

## Project Structure

```
royal_saffron/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   └── lib/           # Utilities and contexts
├── public/            # Static assets
└── netlify.toml       # Netlify configuration
```

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_WHATSAPP_PHONE=919876543210
```

## License

Private - Jhelum Kesar Co.
