# Athrios — Enterprise Value Execution

Premium marketing site for **Athrios** (Value OS) and its first product expression, **Xavio by Athrios** (Data & AI Value Execution System).

## Pages
- `index.html` — Athrios landing: Value OS cinematic hero, Conversion Gap, operating model console, Value Acceleration cockpit, Products console.
- `products.html` — Product family: Xavio Data & AI · Xavio Applications.
- `xavio.html` — Xavio product page: conversion engine, brand film, operating spine, value playlists (AI core + per-stream quality gates with embedded domain experts), trust & evidence gauge.

## Stack
Static HTML/CSS/JS. React + Babel are loaded from CDN at runtime (no build step). Runs on any static host.

## Deploy on Azure Static Web Apps
Deployed via GitHub Actions (`.github/workflows/azure-static-web-apps-yellow-mud-02fab500f.yml`) from the repo root (`app_location: "/"`, no build step). `staticwebapp.config.json` sets the correct MIME types for `.jsx`/`.mp4` and a navigation fallback to `index.html`.
Production: https://yellow-mud-02fab500f.7.azurestaticapps.net

© 2026 Athrios · Sample value figures are illustrative of the operating model, not client claims.
