# sintiasgraphy: A Personal Photography Portfolio

![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript)
![CSS3](https://img.shields.io/badge/CSS-3-1572B6?logo=css3)

[Live Site](https://sintiasnn.github.io/web-sintiasgraphy-sintia)

A clean, minimalist photography portfolio showcasing Sintia's simple snaps. Built as a static site with zero runtime dependencies—just pure HTML, CSS, and JavaScript powered by Vite for a smooth development experience.

---

## Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Author](#author)

---

## Overview
**sintiasgraphy** is a personal photography landing page that captures the essence of Sintia's journey behind the lens. Every element is designed to feel warm, earthy, and distraction-free—letting the photographs speak for themselves.

---

## Project Structure
```text
web-sintiasgraphy-sintia/
├── img/                    # Photography Assets
├── index.html              # Main HTML Document
├── style.css               # Aesthetic Definitions
├── script.js               # Interactive Logic
├── vite.config.js          # Vite Configuration
├── package.json            # Project Inventory & Scripts
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions Deployment
├── .gitignore              # Ignored Files Mapping
└── README.md               # Project Documentation
```

---

## Key Features

### 1. Minimalist Gallery Grid
A responsive image grid that adapts to any screen size, putting the focus entirely on the photographs.

### 2. Image Lightbox
Click any photo to view it in an enlarged overlay with a darkened background—no page reload, no distraction.

### 3. Scroll Animations
Sections fade into view as you scroll, creating a smooth and intentional browsing rhythm.

### 4. Active Navigation
The nav link highlights automatically based on which section you're viewing, powered by the Intersection Observer API.

### 5. Back-to-Top Button
A subtle floating button appears after scrolling down, making navigation effortless on long pages.

### 6. Responsive Design
Fully responsive from ultrawide monitors to mobile devices, with a hamburger menu that transforms the navigation on smaller screens.

---

## Tech Stack
- **Build Tool**: Vite 6 for fast development and optimized production builds.
- **Frontend**: Vanilla HTML, CSS (custom properties), and JavaScript (ES Modules).
- **Typography**: Inter for a clean, modern reading experience.
- **Deployment**: GitHub Pages via GitHub Actions.

---

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm

### 1. Clone Repository
```bash
git clone https://github.com/sintiasnn/web-sintiasgraphy-sintia.git
cd web-sintiasgraphy-sintia
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
```

---

## Original Submission
The original Dicoding "Belajar Dasar Pemrograman Web" submission is preserved in the [`main-old-version`](https://github.com/sintiasnn/web-sintiasgraphy-sintia/tree/main-old-version) branch.

---

## Author
**Ni Putu Sintia Wati**
- GitHub: [@sintiasnn](https://github.com/sintiasnn)
- Instagram: [@sinsintiashoots](https://instagram.com/sinsintiashoots)
- Project: [sintiasgraphy](https://github.com/sintiasnn/web-sintiasgraphy-sintia)
