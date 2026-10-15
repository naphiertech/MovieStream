# 01 Design Tokens & UI Architecture

## 1. Engine & Configuration
* **Styling Framework**: Tailwind CSS v4.1.11 via `@import "tailwindcss";` in [`app/globals.css`](../app/globals.css).
* **Configuration Paradigm**: CSS-first `@theme` block in `globals.css` (no `tailwind.config.js`).

---

## 2. Color Palette & Brand Tokens

| Token | Value | Purpose |
| :--- | :--- | :--- |
| `--color-bg-dark` | `#000000` | True OLED black background |
| `--color-brand` | `#84a98c` | Sage primary brand green |
| `--color-brand-cyan` | `#98c1a9` | Sage cyan accent for highlights and active controls |
| `--color-accent-glow` | `rgba(132, 169, 140, 0.2)` | Ambient neon aura on poster hover and player controls |
| `--color-sage-50` .. `950` | `#f4f7f5` to `#131c18` | Complete 10-step monochromatic sage scale |
| `--background` / `--foreground` | `#000000` / `#ffffff` | Core contrast baseline |

---

## 3. Typography
* **Sans Primary**: `--font-sans: "Outfit", "Geist", "Inter", system-ui, sans-serif;`
* **Display / Cursive**: `--font-cursive: "Dancing Script", cursive;` (hero badge accents).

---

## 4. Invariants & Mobile Zero-Animation Law
* **True Black Canvas**: `html, body { background-color: #000000 !important; }`. Never allow grey/slate body background.
* **Mobile Zero-Animation Performance Law (`max-width: 767px`)**:
  * On mobile viewports (`< 768px`), all heavy CSS keyframe animations, Framer Motion transforms, transitions, and hover-scales are stripped to prevent frame drops during touch scrolling and video decoding.
  * `overscroll-behavior-y: none;` prevents bounce-scroll rubber-banding inside the player.
  * `-webkit-tap-highlight-color: transparent;` ensures clean touch feedback.
