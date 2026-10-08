# 🎙️ INDIA'S GOT LATENT (IGL STREAM) - Official Streaming Portal

A comedy club-grade dark streaming web platform built for **India's Got Latent** hosted by Samay Raina. Full episodes stream natively in high-speed 1080p with zero external redirects, native player controls, and Siddhartha Gautam's developer support QR integration.

---

## 🌟 Key Features

1. **Native OTT Player Experience**:
   - Zero Google Drive branding or pop-out redirects visible to viewers.
   - Top frame clipping shields internal storage file names and download options.
   - Fullscreen mode, theater mode, episode drawer, auto-next playback, and watched progress tracking.

2. **Episodes Loaded & Live**:
   - **Season 1 • Episode 1**: The Pilot Chaos (Tanmay Bhat & Nishant Suri) • 1080p Live
   - **Season 1 • Episode 2**: Roast & Latents (Kunal Kamra & Atul Khatri) • 1080p Live
   - **Season 1 • Episode 3**: The Neuroscience of Latent (Dr. Sidharth Warrier) • 1080p Live
   - **Episodes 4–12, Season 2 & VIP Specials**: Fully cataloged and ready for your video links!

3. **Super Simple Video Embedding**:
   - To add or activate any episode, open `data.js` and paste your link/ID into `VIDEO_STREAM_LINKS`:
   ```javascript
   const VIDEO_STREAM_LINKS = {
       "s1-e01": "1bccMfHnHgSuegozF_5qp78vWwSVcwrIq",
       "s1-e02": "1EZ7-DvvGynEnxpBCHO93NmaD-Yesw1FU",
       "s1-e03": "1Fe1SkaCv7b2d2C4FWuS9gt18ygdIm3pu",
       "s1-e04": "https://drive.google.com/file/d/YOUR_ID/view", // <-- Paste here!
   };
   ```
   - As soon as a link is added, it turns into **STREAM READY (1080p)** with a **Watch Video** button automatically!

4. **Public Privacy (Manage Links Disabled)**:
   - All management controls and storage links are removed from public visitors.
   - Viewers only interact with the playback experience and support modal.

5. **Developer Support / Buy Chai QR**:
   - **Name**: Siddhartha Gautam
   - **UPI ID**: `siddharthakumar109-2@okhdfcbank`
   - **QR Image**: `assets/qr.jpg` (embedded and responsive across mobile and desktop)
   - Works with 1-tap redirect on mobile (Google Pay, PhonePe, Paytm, BHIM) and desktop clipboard copy.

---

## 🚀 How to Publish the Website (Free 1-Click Hosting)

Because this website is built with clean static HTML5, CSS3, and modern JavaScript, you can host it **100% for free** in less than 60 seconds:

### Option 1: Netlify Drop (Fastest - 30 seconds)
1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)** in your browser.
2. Drag and drop the **`IGL`** folder directly into the window.
3. Your site is instantly live with a free SSL `https://...` link!

### Option 2: Vercel
1. Install Vercel CLI via terminal: `npm i -g vercel` then run `vercel` in this folder.
2. Or connect your GitHub repository to [Vercel](https://vercel.com) and click **Deploy**.

### Option 3: GitHub Pages
1. Push this folder to a GitHub repository.
2. In repository **Settings** ➜ **Pages**, choose the `main` branch ➜ **Save**.
3. Your site is live at `https://<username>.github.io/<repo-name>/`.

---

## 💻 How to Run Locally
Double-click **`run.bat`** or run:
```powershell
npm start
```
Then visit **`http://localhost:3000`**.
