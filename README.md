# Treat Landing Page

A modern, fast landing page for Treat, a food tech platform connecting groups of food lovers with dynamic platter deals, automated budget matching, instant two-minute table reservations, and live restaurant kitchen synchronization.

The landing page features an interactive four-phone showcase, smooth mobile touch navigation, and a built-in Admin Studio protected by a master security passkey.

---

## Project Overview and Core Features

### 1. Hero Section and Brand Storytelling
The top hero area immediately explains the product vision through a clean three-line stacked headline:
* Line 1: "Find Your Craving"
* Line 2: "Share the Good Stuff" (highlighted in Treat's signature berry magenta with a responsive curved underline)
* Line 3: "Make It a Treat" (accompanied by a hand-drawn heart doodle)

Key conversion buttons use a high-contrast black and white palette to make the primary download action stand out clearly against the soft lilac backdrop.

### 2. Four-Phone Flow Showcase
Instead of static screenshots, the landing page walks visitors through four key stages of the user experience using realistic iPhone 16 Pro models:
1. Feast Drops (01): Shows limited-time two-for-one feast platters, category tags, and search filters.
2. Squad Budget (02): Lets visitors interact with a live budget slider that calculates per-person costs with tax and tip included.
3. Flash Lock (03): Displays a live table hold screen with an animated countdown ring, zero deposit requirement, and instant kitchen floor sync.
4. Squad Perks (04): Shows community foodie reviews, leveling progression, and shared XP reward milestones.

### 3. Mobile-First Responsive Design
On mobile screens and touch devices:
* The sticky navigation bar scales down to fifty-six pixels to save vertical space.
* A hamburger menu button opens a slide-down navigation drawer with direct links across the page.
* The four phones convert from a desktop grid into a horizontal touch-swipe snap carousel. Mobile users can swipe through cards naturally rather than scrolling through thousands of vertical pixels.
* A segmented pill bar (01 Drops, 02 Budget, 03 Hold, 04 Squad) and animated indicator dots let users jump directly to any step with a single tap.
* Perspective tilts are flattened on touchscreens so text remains upright, crisp, and legible.

### 4. Protected Admin Studio
The landing page includes an integrated management drawer allowing the site owner to update copy and phone mockups without touching the source code:
* Security Passkey: Access is protected behind master passkey 133162029.
* Login Dialog: Unauthenticated visitors see a centered login dialog with password masking, an eye toggle to reveal or hide the passkey, and error shake feedback on invalid attempts.
* Session Authentication: Logging in stores an authorization flag in browser session storage so you do not need to re-enter the passkey every time you open the drawer.
* Lock Button: An explicit Lock button in the drawer header allows instant logout and session clearing.
* Customization Options:
  * Upload custom mockup images for all four phones.
  * Edit step numbers, titles, badge icons, and descriptions.
  * Update hero headlines, category pills, and vision captions with live on-page preview.
  * Change APK download URLs, file sizes, and store links.
  * Export and import the complete configuration as a JSON file, or restore factory defaults.

---

## Technologies and Libraries Used

* Vanilla JavaScript (ES6+): Built using modular JavaScript classes (TreatAdminPanel, ScreenFlowController) without heavy external framework runtime overhead, ensuring fast load speeds and responsive interactions.
* Tailwind CSS: Used for utility layout construction alongside custom design tokens defined in css/styles.css for brand colors, surfaces, and shadows.
* Three.js: Integrated via CDN (r128) for hardware-accelerated 3D turntable model rendering.
* CSS 3D Engine: Custom perspective and matrix transform rules render realistic metallic chassis bevels, Dynamic Island sensor cutouts, titanium buttons, and glass sheen glares.
* Web Storage APIs:
  * localStorage stores custom landing page configurations under key treat_landing_config_v4.
  * sessionStorage manages authenticated access for the Admin Studio.

---

## How to Run the Project Locally

### Option 1: Direct File Open
You can open index.html directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari).

### Option 2: Using the Included Node.js Server (Recommended)
This repository includes a lightweight server script (server.js):
```bash
node server.js
```
Then visit:
```
http://localhost:3001
```

### Option 3: Using Python
If you prefer Python:
```bash
python -m http.server 3000
```
Then visit:
```
http://localhost:3000
```

---

## Repository File Structure

```
treat-landing-page/
├── assets/
│   ├── images/          # Brand logos, photography, and vector doodles
│   └── screens/         # High-resolution wireframe mockups
├── css/
│   └── styles.css       # Custom brand tokens, 3D phone chassis, and responsive rules
├── js/
│   ├── admin.js         # Protected Admin Studio controller with passkey authentication
│   ├── app.js           # Main coordinator, mobile carousel sync, and navigation logic
│   ├── defaultData.js   # Initial brand copy, workflow data, and reviews
│   ├── phone3d.js       # Three.js 3D model, lighting, and orbit controls
│   └── screenFlow.js    # Four-phone DOM renderer and data binder
├── index.html           # Main single-page landing layout
├── server.js            # Local HTTP development server
└── README.md            # Project documentation and guide
```

---

## License

Copyright 2026 Treat Inc. All rights reserved.
