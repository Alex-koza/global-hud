# Global HUD (Project 01)
## Cyberpunk Geopolitical & OSINT Intelligence Dashboard

Global HUD is a state-of-the-art interactive web application masquerading as a classified intelligence operating system dashboard. Built with Next.js 15 App Router, React 19, and Tailwind CSS, it visualizes real-time global events, cybersecurity threats, rare earth market trends, and cryptocurrency anomalies.

> 🇬🇧 **SEO Keywords:** Cyberpunk dashboard, OSINT intelligence tool, real-time geopolitical map, cybersecurity threat map, crypto market scanner, data visualization OS.
> 🇷🇺 **SEO Ключевые слова:** Киберпанк дашборд, OSINT разведка, геополитическая карта мира, мониторинг киберугроз онлайн, анализ криптовалют.
> 🇺🇦 **SEO Ключові слова:** Дашборд кіберпанк, OSINT розвідка, геополітична карта, моніторинг кіберзагроз, аналіз крипторинку.

### 🚀 Core Features

*   **Interactive Desktop OS Environment**: Multi-window draggable interface powered by `react-rnd` and `framer-motion`. Includes minimize-to-taskbar functionality, z-index stacking, and active focus tracking.
*   **Immersive Cyberpunk Aesthetics**: Custom CSS scanlines, CRT flickers, matrix green/cyan glows, and glitching overlays heavily inspired by *Mr. Robot* and *Mission Impossible*.
*   **Interactive Leaflet Globe**: A dark-mode topographical visualization of the globe with clickable GeoJSON layers that spawn deep-dive Intel Reports for specific nations.
*   **Multilingual Architecture**: Seamless `next-intl` integration supporting English (EN), Ukrainian (UK), and Russian (RU) localization for the entire OS, including dynamically fetched content.
*   **Simulated Real-Time Streams**: Animated canvas waveform visualization (Source Analysis), crypto tracking modules (VIP Signals), and automated logging terminals.
*   **Telegram Command Control**: Integrated `/api/telegram` route with `html2canvas` allows manual "screenshot & push" to Telegram channels, alongside automatic alert dispatching for high-priority global events.
*   **Classified Admin Panel**: Password-protected backend for configuring external API keys natively via `zustand` persist, launching custom Ad Banners, and sending test telegram dispatches.
*   **SEO & PWA Ready**: Fully configured `next-sitemap` dynamically creating static routes (`/intel/[country]`) alongside a Markdown-based `.md` Blog engine. 100% installable with `manifest.json`.

### 🛠 Tech Stack

*   **Framework:** Next.js 15 (App Router), React 19
*   **Styling & UI:** Tailwind CSS, `shadcn/ui`, `lucide-react`
*   **Motion & Dragging:** `framer-motion`, `react-rnd`
*   **Mapping:** `leaflet`, `react-leaflet`, GeoJSON
*   **Data Parsing:** `gray-matter`, `remark`, `remark-html` (Markdown Blogs)
*   **Sound Engine:** `howler`
*   **State Management:** `zustand`

---

### 💻 Local Development

1. **Clone & Install**:
   ```bash
   pnpm install
   # or npm install
   ```

2. **Environment Variables**:
   Copy the example and fill in your details:
   ```bash
   cp .env.example .env.local
   ```

3. **Run Cyber-Terminal**:
   ```bash
   npm run dev
   ```
   *Access the OS at `http://localhost:3000`*

### ☁️ Deployment (Vercel)

The application is heavily optimized for zero-config deployment on Vercel. 
Simply push to your main branch or use the Vercel CLI:

```bash
vercel --prod
```

It includes a native `vercel.json` configured for secure cross-origin HTTP headers and native Serverless Crons for Telegram dispatching.

---

*Classified End of Document.*
