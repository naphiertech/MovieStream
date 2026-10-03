# 🎬 MovieStream — Next-Gen Cinematic Experience

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Motion-12-ff0055?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**MovieStream** is a high-fidelity, editorial-style movie discovery platform built for the modern web. It combines live TMDB data with a premium, cinematic user interface designed for enthusiasts who appreciate bold typography, smooth motion, and a distraction-free viewing experience.

---

## ✨ Key Features

- **🌐 Live TMDB Integration**: Powered by the official TMDB API for real-time trending, upcoming, and top-rated data.
- **🛡️ Secure Middleware**: Robust route protection for administrative hubs and restricted content.
- **📽️ Dynamic Genres Hub**: Explore cinematic sectors through an animated, glassmorphic discovery interface.
- **🕒 Intelligent Watch History**: Automatic local persistence tracking your recently viewed titles.
- **🎭 Motion-First Design**: Fluid transitions and scroll-aware animations powered by `framer-motion`.
- **🔍 Advanced Search**: Instant, high-performance filtering across thousands of cinematic titles.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Logic**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Motion 12](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: [TMDB API](https://www.themoviedb.org/documentation/api)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/bagatata05/MovieStream.git
cd MovieStream
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add your TMDB Access Token:
```env
TMDB_ACCESS_TOKEN=your_token_here
GEMINI_API_KEY=your_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ☁️ Deployment

The easiest way to deploy MovieStream is via the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add your `TMDB_ACCESS_TOKEN` to the Project Settings > Environment Variables.
4. Deploy!

---

## 🔐 Architecture

MovieStream implements a clean, resilient architecture:
- **Edge Stream Routing**: Dynamic stream extraction normalized directly from provider CDNs.
- **Stateless API Consumption**: No local database required for core discovery—fully decoupled and powered by TMDB.
- **Zero-Bloat Bundle**: Lightweight client bundles with fast hydration and strict performance budgets.

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built with ❤️ for the Cinematic Community - Naphier Awalie
</p>
