# 🎙️ INDIA'S GOT LATENT (IGL STREAM) - Official Streaming Portal

A comedy club-grade dark streaming web platform built for **India's Got Latent** hosted by Samay Raina. Full episodes stream natively in high-speed 1080p with zero external redirects, native player controls, and Siddhartha Gautam's developer support QR integration.

---

## 🌟 Key Features

1. **Native OTT Cinema Player**:
   - Clean, professional streaming interface with zero external storage provider links or raw file URLs.
   - Built-in cinema theater mode, native fullscreen API support, auto-play next episode, and watched progress tracking.
   - Quick-switch episode drawer and responsive controls optimized for both desktop and mobile.

2. **Episodes Loaded & Live**:
   - **Season 1 • Episodes 1 to 8**: Full uncut episodes stream-ready in 1080p HD.
   - **Episodes 9–12, Season 2 & VIP Specials**: Cataloged and ready for stream deployment.

3. **Unified Storage Layer**:
   - Videos are served through the application's abstracted storage layer (`/api/video/:episodeId`).
   - The user-facing platform interacts with clean application endpoints (`/api/video/:id/embed` and `/api/video/:id`), completely decoupling video playback from underlying storage backends.
   - Supports HTTP Range requests (`206 Partial Content`) for seeking and responsive buffering without preloading entire video files into memory.

4. **Developer Support / Buy Chai QR**:
   - **Name**: Siddhartha Gautam
   - **UPI ID**: `siddharthakumar109-2@okhdfcbank`
   - **QR Image**: `assets/qr.jpg` (responsive across mobile and desktop)
   - Works with 1-tap redirect on mobile (Google Pay, PhonePe, Paytm, BHIM) and desktop clipboard copy.

---

## 💻 How to Run Locally

Double-click **`run.bat`** or run:

```bash
# 1. Start Vite development server
npm run dev

# Or build and run with the Node streaming server
npm run build
npm run server
```

Then visit **`http://localhost:3000`**.

---

## ⚙️ Architecture & Storage Configuration

For developers and administrators:
- Episode storage mappings are maintained server-side in `server/storageConfig.js`.
- Sensitive storage IDs and provider credentials remain strictly server-side and are never bundled into the client build.
- When deploying to serverless platforms (e.g. Vercel), route rewrites and API functions in `api/video.js` handle stream resolution seamlessly.
