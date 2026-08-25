# Magnus Enterprises

> **ISO 9001:2015 Certified Precision Machining & Industrial Manufacturing Company**  
> Based in **Nashik, Maharashtra, India**. 

Magnus Enterprises delivers state-of-the-art, high-quality precision engineering and manufacturing solutions engineered for modern, high-stakes industrial applications. Specializing in CNC milling, CNC turning, switchgear assemblies, and bespoke fabrication, we operate as a trusted manufacturing partner for sector leaders in electrical transmission, machinery development, and heavy engineering.

---

## ⚡ Key Highlights & Capabilities

- **ISO 9001:2015 QMS Standard**: Rigid quality assurance across all manufacturing workflows with precision instruments including digital verniers, micrometers, and dial gauges.
- **CNC Milling & Turning Centers**: High-performance multi-axis machining capable of maintaining ultra-tight tolerances (up to `±0.005mm`).
- **Comprehensive Switchgear Manufacture**: Specialized mechanism engineering and assembly for advanced electrical grids and high-voltage transmission units.
- **Advanced Metal Processing**: In-house capacity for radial drilling, high-accuracy automatic tapping (M2 - M24), and custom-configured bandsaw cutting.
- **Dynamic Infrastructure Showcase**: Seamless toggle framework that highlights live mechanical specifications of our vertical milling center, turning units, and tapping apparatus.

---

## 🛠️ Technology Stack

This application is built with a modern frontend stack designed for fluid interactions, rich micro-animations, and high-performance rendering:

*   **Framework:** [React 19](https://react.dev/) + [Vite](https://vite.dev/) (fast, modular building with TypeScript)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (modern CSS compilation and sleek utility integration)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) (smooth state transitions, high-end hover responses, and interactive physics)
*   **Iconography:** [Lucide React](https://lucide.dev/) (clean, geometric vector indicators)
*   **Structure:** Semantic HTML5, responsive grid structures, and modular, component-driven architecture

---

## 🚀 Getting Started

### Prerequisites

To run this application locally, you need:
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) (installed automatically with Node.js)

### Installation & Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/RandomKid24/magnus-enterprise-site.git
    cd magnus-enterprise-site
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**  
    Copy `.env.example` to `.env` (or `.env.local` for local development):
    ```bash
    cp .env.example .env.local
    ```
    *Note: This project is a fully static, high-performance, standalone showcase and does not require external backend API keys.*

4.  **Run the local development server:**
    ```bash
    npm run dev
    ```
    The site will start on [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Production Build & Verification

To build an optimized, minified production-ready bundle:

```bash
# Build the production bundle
npm run build

# Preview the built application locally
npm run preview
```

To run TypeScript verification:
```bash
npm run lint
```

---

## 📂 Project Architecture

```bash
magnus-enterprise-site/
├── src/
│   ├── components/
│   │   ├── layout/       # Core layout elements (Navbar, Footer)
│   │   └── sections/     # High-end showcase sections (Hero, About, Services, Products, Quality, Contact)
│   ├── lib/              # Utility configurations (Tailwind CSS merges)
│   ├── constants.ts      # Shared business tokens, services data, product manifests, & coordinates
│   ├── App.tsx           # Application orchestrator & interactive contact form handler
│   ├── main.tsx          # React application entrypoint
│   └── index.css         # Modern styling rules, custom patterns, and textured filters
├── index.html            # Entrypoint template with SEO meta tags
├── vite.config.ts        # Vite execution compiler rules
└── tsconfig.json         # TypeScript rules
```

---

## 🗄️ CMS Setup (Supabase + Cloudinary)

The site includes a built-in headless CMS at `/admin`. To activate it:

1. **Create a Supabase project** (https://supabase.com) and a **Cloudinary account** (https://cloudinary.com).
2. **Run the database migrations**: paste each file from `supabase/migrations/` into the Supabase SQL Editor, in numbered order (see `supabase/migrations/README.md`).
3. **Configure environment variables**: copy `.env.example` to `.env.local` and fill in the Supabase URL/keys, Cloudinary keys, and admin bootstrap credentials.
4. **Create the first administrator**: `npm run create-admin`
5. Start the app (`npm run dev`) and log in at `/admin/login`.

### How content works

- The public site renders **exactly as before** until you publish CMS pages.
- Create a page with slug `home` in `/admin/pages`, add blocks (Hero, Features, Products…), publish — the homepage is now database-driven.
- Any other published page appears at `/{slug}` automatically.
- Navbar/footer menus, contact details and social links are editable under Navigation & Settings.
- Publishing revalidates cached pages instantly (ISR + targeted `revalidatePath`).

---

## 📐 Design & Layout

Detailed specifications regarding color theory (Lime + Slate), grid rules, blueprint textures, typography hierarchy, and transition timings can be found in the [design.md](file:///Users/ady/Documents/magnus-enterprise-site/design.md) file.
