# Treat App Landing Page 🍰✨

> High-Conversion Landing Page with Interactive 3D Android Mobile Mockup & Live Admin Studio

This is the official landing page for **Treat**, designed to showcase the app vision, demonstrate its dynamic culinary workflow via an interactive 3D Android flagship model, provide direct APK & app store downloads, and offer a built-in Admin Studio to customize mockups, captions, and links.

---

## 🌟 Key Features

1. **Eye-Catching Hero & App Vision**:
   - Punchy headline: *"Feast Together. Save Bigger. Crave Louder."*
   - Short-form vision caption highlighting group deals, smart budget matching, 2-minute instant table holds, and live kitchen floor sync.
   - Treat signature candy glassmorphism styling (`#E040A0`, `#7C52AA`, `#0096CC`).

2. **Interactive 3D Android Flagship Mockup**:
   - **Realistic 3D Geometry**: Three.js WebGL rendering with titanium chassis, beveled frame, centered front camera punch-hole lens, rear triple-camera bump, Treat logo embossing, and soft ground shadow.
   - **Full 3D Freedom**: 360° orbit rotation, mouse-following parallax tilt, and preset angles (*Front*, *3D Angle*, *Side*, *Back*).
   - **4 Color Finishes**: *Treat Candy Pink*, *Funky Violet*, *Midnight Obsidian*, and *Titanium Silver*.
   - **Dynamic 2D/3D Texture Engine**: Renders mobile screenshots at high resolution with smooth crossfades and simulated Android status/gesture bars.

3. **Smooth Workflow Showcase & Auto-Play**:
   - 8 preloaded high-res screens from the actual Treat mobile wireframes:
     1. `Welcome & Onboarding`
     2. `Trending Feasts & 2-for-1 Platters`
     3. `Smart Budget Matcher`
     4. `Platter Packages in Budget`
     5. `2-Minute Instant Table Hold`
     6. `Digital Voucher & Check-in Slip`
     7. `Community Food Bar & Social`
     8. `Kitchen Floor & Table Manager`
   - Synchronized feature context card updating in lockstep with the 3D screen.
   - Auto-advance timer with smooth progress bar, pause-on-hover, and keyboard navigation (`←` / `→`).

4. **Prominent Download Section**:
   - Direct **Download APK** CTA button with version indicator (`v1.0.4`) and file size (`24.8 MB`).
   - Quick **Scan QR Code** modal for instant Wi-Fi download from any physical phone.
   - Store links for Google Play Early Access and local web demo (`localhost:8080`).

5. **Built-in Admin Studio**:
   - **Access**: Click the top bar **"Admin Studio"** button or press `Ctrl + Shift + A` (`Cmd + Shift + A` on Mac).
   - **Upload Mockups**: Drag and drop new screenshots or paste image paths.
   - **Reorder & Edit**: Move steps up/down, edit titles, subtitles, badge tags, and durations.
   - **Hero & Vision Editor**: Modify the headline and short-form caption in real-time.
   - **Download Link Manager**: Update APK URL, version number, size, and store URLs.
   - **Backup & Restore**: Export configuration as JSON, import saved presets, or reset to factory defaults with one click.
   - **Zero Backend Required**: Changes persist instantly in `localStorage` and sync live to the 3D phone model!

---

## 🚀 How to Run

### Option 1: Direct File Open
Simply double-click `index.html` in your browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Recommended for texture loading)
Run any local server in this directory:

```bash
# Using Node.js (npx serve)
npx serve .

# Or using Python
python -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 File Structure

```
treat landing page/
├── index.html              # Main landing page HTML
├── css/
│   └── styles.css          # Candy glassmorphism, 3D viewport & custom tokens
├── js/
│   ├── defaultData.js      # Default workflow steps, captions & food photos
│   ├── phone3d.js          # Three.js 3D Android model, PBR materials & orbit
│   ├── screenFlow.js       # Workflow stepper, auto-advance & context card sync
│   ├── admin.js            # Admin Studio: mockup uploads, reordering & config
│   └── app.js              # Application coordinator & event bindings
├── assets/
│   ├── images/             # App logo, food photography
│   └── screens/            # High-resolution wireframe screens
└── README.md
```
