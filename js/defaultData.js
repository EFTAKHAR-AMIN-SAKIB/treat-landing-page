/**
 * Treat Landing Page - Default Configuration & Workflow Data
 * Aligned with Appetite-Focused Color Theory, Sensory Copywriting & Conversion Architecture
 */

const TREAT_DEFAULT_DATA = {
  brand: {
    appName: "Treat",
    tagline: "Funky Foodie Feasts & Squad Deals",
    heroHeadline: "Find Your Craving\nShare the Good Stuff\nMake It a Treat",
    heroCaption: "Treat connects modern foodies with dynamic platter deals, automated budget matching, instant 2-minute table holds, and real-time kitchen floor sync. The all-in-one culinary squad experience.",
    liveSocialProof: "🔥 348 Platters Claimed This Weekend • 94 Verified Kitchens",
    logoPath: "assets/images/treat_bubble_logo.png"
  },
  download: {
    ctaText: "Download Treat for Android",
    ctaSubtext: "Join 10,000+ sweeties & foodies. Feast together with unbeatable deals.",
    apkFileName: "Treat-v1.0.4-release.apk",
    apkVersion: "v1.0.4 (Android 9.0+)",
    apkSize: "24.8 MB",
    apkDownloadUrl: "assets/downloads/Treat-v1.0.4-release.apk",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.treat.app",
    webDemoUrl: "http://localhost:8080",
    releaseDate: "September 2026",
    trustBadge: "🛡️ 100% Verified Safe APK • 24.8 MB • No Account Required"
  },
  // 4 Primary Flow Steps with Appetite-Focused Copy
  flowSteps: [
    {
      id: "step-1",
      number: "01",
      icon: "local_fire_department",
      title: "Crave-Worthy Feast Drops",
      description: "Snag limited 2-for-1 platter drops, secret perks, and trending foodie spot deals before slots sell out.",
      image: "assets/screens/01_explore.png",
      tag: "2-FOR-1 DROPS",
      accentColor: "#E040A0" // Candy Berry Pink
    },
    {
      id: "step-2",
      number: "02",
      icon: "calculate",
      title: "Zero-Math Squad Budget",
      description: "Slide your budget per sweetie. Treat auto-matches massive feast boards with tax and tip included.",
      image: "assets/screens/02_budget.png",
      tag: "SMART SPLIT",
      accentColor: "#7C52AA" // Funky Violet
    },
    {
      id: "step-3",
      number: "03",
      icon: "timer",
      title: "2-Min Flash Table Lock",
      description: "Lock your prime table live with a 120s countdown clock. Zero deposit, direct kitchen sync.",
      image: "assets/screens/04_hold.png",
      tag: "INSTANT HOLD",
      accentColor: "#FF6B4A" // Sizzling Coral (Urgency & Appetite)
    },
    {
      id: "step-4",
      number: "04",
      icon: "forum",
      title: "Bite Talk & Squad Perks",
      description: "Post honest bite reviews, earn foodie street cred, and climb the squad savings milestones.",
      image: "assets/screens/06_social.png",
      tag: "SQUAD SOCIAL",
      accentColor: "#0096CC" // Fresh Cyan Mint
    }
  ],
  availableScreens: [
    { id: "lib-0", title: "Welcome & Onboarding", image: "assets/screens/00_welcome.png", icon: "celebration" },
    { id: "lib-1", title: "Crave-Worthy Feast Drops", image: "assets/screens/01_explore.png", icon: "local_fire_department" },
    { id: "lib-2", title: "Zero-Math Squad Budget", image: "assets/screens/02_budget.png", icon: "calculate" },
    { id: "lib-3", title: "Platter Packages in Budget", image: "assets/screens/03_platters.png", icon: "restaurant" },
    { id: "lib-4", title: "2-Min Flash Table Lock", image: "assets/screens/04_hold.png", icon: "timer" },
    { id: "lib-5", title: "Digital Voucher & Check-in", image: "assets/screens/05_voucher.png", icon: "qr_code_2" },
    { id: "lib-6", title: "Bite Talk & Squad Perks", image: "assets/screens/06_social.png", icon: "forum" },
    { id: "lib-7", title: "Kitchen Floor & Table Manager", image: "assets/screens/07_kitchen.png", icon: "table_restaurant" }
  ],
  foodPhotos: [
    { src: "assets/images/fiesta_platter.jpg", title: "Fiesta Platter Deluxe", tag: "2-for-1 Mega Platter", price: "$38.00" },
    { src: "assets/images/churro_sundae.jpg", title: "Churro Lava Sundae", tag: "Dessert Craze", price: "$14.50" },
    { src: "assets/images/taco_bodega.jpg", title: "Taco Bodega Box", tag: "Squad Feast (4-6)", price: "$46.00" },
    { src: "assets/images/bistro_bella.jpg", title: "Bistro Truffle Feast", tag: "Chef Special", price: "$52.00" }
  ],
  reviews: [
    {
      name: "Mia Candy",
      role: "VIP Sweetie • Squad of 5",
      avatar: "assets/images/churro_sundae.jpg",
      comment: "Treat saved our Friday night! The Zero-Math Budget Matcher picked a massive fiesta platter that fit our $15/person limit down to the cent.",
      rating: 5
    },
    {
      name: "Chef Marco V.",
      role: "Head Chef @ Taco Bodega",
      avatar: "assets/images/taco_bodega.jpg",
      comment: "The kitchen floor manager synced directly with diners holding tables live. Zero no-shows and our 2-for-1 platter drops sold out in 18 minutes.",
      rating: 5
    },
    {
      name: "Leo 'Bites' Chen",
      role: "Community Food Bar Host",
      avatar: "assets/images/fiesta_platter.jpg",
      comment: "The 3D slip and QR voucher worked seamlessly at the counter. The UI is funky, vibrant, and incredibly smooth.",
      rating: 5
    }
  ]
};

if (typeof window !== "undefined") {
  window.TREAT_DEFAULT_DATA = TREAT_DEFAULT_DATA;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = TREAT_DEFAULT_DATA;
}
