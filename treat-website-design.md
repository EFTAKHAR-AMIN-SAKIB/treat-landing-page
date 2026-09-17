# Treat — Website Redesign & UI/UX Implementation Specification

> **Purpose:** Rebuild the Treat landing website into a premium, playful, food-first product experience based on the approved visual direction.
>
> **Primary reference:** the attached Treat redesign concept image generated for this project.
>
> **Important:** This document is an implementation specification, not a request for a static mockup. The AI coding agent must inspect the existing repository, preserve working functionality/content where appropriate, and implement the visual system as real responsive UI.

---

## 1. Product Direction

### Brand
**Treat**

### Brand personality
- Playful
- Social
- Food-loving
- Premium but approachable
- Modern and trustworthy
- Energetic without becoming visually noisy

### Core message
Treat helps people discover food deals, match meals to a budget, quickly hold tables, and enjoy/share food together.

### Primary audience
- Everyday diners
- Groups/friends looking for food deals
- Budget-conscious foodies
- Restaurant partners/staff

### Main UX objective

The website should answer these questions in order:

1. **What is Treat?**
2. **Why would I care?**
3. **How does it work?**
4. **What does the actual app experience look like?**
5. **Can I trust it?**
6. **Where do I download/join?**

The visitor should understand the product within the first 5–8 seconds without reading a large block of text.

---

# 2. Design Concept

## Visual theme

Use a **premium pastel food-tech aesthetic**.

Think:

- Warm cream background
- Deep plum/ink typography
- Pink/magenta highlights
- Soft lavender surfaces
- Subtle mint/green supporting accents
- Real food photography
- Modern 3D device mockups
- Handwritten/doodle annotations used sparingly
- Large whitespace
- Soft depth instead of heavy gradients

The page should feel like a combination of:

**modern startup landing page + premium food brand + friendly social app.**

Avoid making it look like a generic SaaS dashboard.

---

# 3. Color System

Create centralized CSS/design tokens instead of scattering colors throughout components.

### Primary
```text
Ink / Midnight:
#191426

Deep Plum:
#2A183D

Treat Purple:
#7448D8

Treat Violet:
#9C72F2

Treat Pink:
#E63D91

Soft Pink:
#FBE1EF

Lavender:
#EEE7FF

Cream:
#FFF9F1

Warm White:
#FFFCF8

Soft Mint:
#E4F6ED

Mint Accent:
#56C99B

White:
#FFFFFF
```

### Recommended usage

- `Ink / Midnight` → primary headings, body text, dark CTA
- `Treat Pink` → major emphasis, active states, key numbers
- `Treat Purple` → brand elements, secondary CTA, diagrams
- `Cream` → primary page background
- `Lavender` → feature surfaces
- `Soft Mint` → restaurant/kitchen/social feature surfaces
- `White` → cards and device interiors
- Avoid using more than 2 strong accent colors in a single component.

---

# 4. Typography

Use a modern geometric/sans font system.

Preferred hierarchy:

```text
Display:
64–84px
weight 700–800
tight line-height

Hero:
56–76px desktop
40–48px tablet
34–40px mobile

Section heading:
42–56px

Subheading:
22–28px

Body:
16–18px
line-height 1.55

Small UI:
12–14px
```

Recommended font families:

1. Inter / Geist / Manrope for interface text
2. Optional rounded display font only for accent moments

Do not use more than two font families.

### Typography behavior

Headlines should be short.

Use emphasis such as:

> Find your people.  
> Find your table.  
> **Make it a Treat.**

The final phrase may use the Treat pink accent.

---

# 5. Global Layout

### Desktop

```text
Maximum content width:
1200–1320px

Main horizontal padding:
32–48px

Section vertical spacing:
100–150px
```

### Tablet

```text
Horizontal padding:
24–32px

Section spacing:
80–110px
```

### Mobile

```text
Horizontal padding:
18–20px

Section spacing:
64–88px
```

The website must never feel cramped.

---

# 6. Navigation

Create a clean floating/light navigation bar.

### Desktop

Left:
- Treat logo

Center:
- How It Works
- Features
- Reviews

Right:
- Restaurant Login
- Download App

### Behavior

- Sticky after scrolling
- Semi-transparent cream/white background
- Subtle blur
- Bottom border with very low opacity
- Compact height after scrolling

### Mobile

Use:

```text
Logo
Menu button
```

Open a full-width or centered mobile navigation panel.

Primary CTA should remain easily accessible.

---

# 7. Hero Section

## Goal

Immediately communicate:

**Treat helps you find food, match your budget, secure a table, and enjoy it together.**

### Recommended composition

Two-column desktop layout.

### Left

Small handwritten/doodle eyebrow:

> Good food.  
> Better together.

Main headline:

> **Find your people.  
> Find your table.  
> Make it a Treat.**

Use the pink color on:

> Make it a Treat.

Supporting copy:

> Discover amazing deals and platter offers, match your budget, hold a table in seconds, and enjoy great food together.

### CTAs

Primary:
> Download the app

Secondary:
> See how it works

Primary CTA:
- Dark plum background
- White text
- Rounded pill
- subtle hover lift

Secondary:
- White/cream background
- thin purple border

### Trust strip

Immediately below CTA:

```text
10,000+ foodies
   |
2-min table holds
   |
Smart budget matching
```

Use small icons with compact stats.

---

# 8. Hero Visual

The hero should show **one hero phone** rather than four phones.

### Phone

Use a realistic 3D phone mockup displaying the Treat app.

Position:

```text
desktop:
right side
slightly rotated
floating above the background

mobile:
below the headline
centered
```

### Supporting visual elements

Around the phone:

- floating food dish
- small handwritten notes
- tiny heart/doodle
- soft lavender/pink blobs
- subtle sparkle particles

Example notes:

> Good food,  
> great vibes ♡

Keep decorations behind or beside the phone.

Do not overload the hero.

---

# 9. Feature Journey Section

## Purpose

Show the core user journey visually.

Section intro:

Eyebrow:
> SIMPLE STEPS

Title:

> **From craving  
> to together.**

Supporting copy:

> Everything you need for a great food experience, in just a few taps.

### Four-step sequence

Create four spaced phone mockups.

Do NOT place the phones tightly together.

Use generous horizontal spacing.

Connect them using a thin curved line.

### Step 01

**Discover a deal**

Show food deal/discovery screen.

Description:

> Explore exclusive offers, platter deals and trending spots near you.

### Step 02

**Match your budget**

Show Smart Budget Matcher.

Description:

> Set your budget and let Treat find deals that fit.

### Step 03

**Hold the table**

Show 2-minute hold UI.

Description:

> Secure your table instantly with a timed hold.

### Step 04

**Share the feast**

Show social/squad screen.

Description:

> Post, tag, and be part of the food-loving community.

---

# 10. Phone Flow Art Direction

This section is important.

The phones must feel like **one connected visual story** rather than four screenshots placed in a row.

### Layout

```text
Phone 01

        Phone 02

                Phone 03

                        Phone 04
```

They can have subtle vertical offsets.

The connection line should visually travel through the entire sequence.

### Connection line

Use:

- SVG path
- thin stroke
- pink/purple
- animated dash or moving glow

Example concept:

```text
Phone 01 ───╮
             ╰── Phone 02 ───╮
                              ╰── Phone 03 ───╮
                                               ╰── Phone 04
```

### Scroll animation

As the section enters viewport:

1. line draws itself
2. phones fade/slide upward
3. phone screens slightly tilt into position
4. step numbers appear
5. supporting text fades in

Keep animation subtle and fast.

---

# 11. Feature Bento Grid

After the four-step experience, introduce a bento-style feature area.

Title:

> **Everything that makes dining better.**

Create 4 major cards.

---

## Card 01 — Smart budget

Background:
soft lavender

Title:
> Smart budget.  
> Zero guesswork.

Copy:

> Get personalized deals and platter options that match your budget.

Visual:
Budget slider / matching UI.

---

## Card 02 — 2-minute table hold

Background:
deep plum

Text:
white

Title:
> Your table,  
> held for 2 minutes.

Visual:
large countdown/timer UI.

Use strong contrast.

---

## Card 03 — Squad savings

Background:
soft mint

Title:
> Better food.  
> Better together.

Visual:
social/dining photo.

Copy:

> Save more when you dine with your people.

---

## Card 04 — Kitchen sync

Background:
lavender / white

Title:
> Kitchen sync,  
> without the chaos.

Visual:
restaurant floor manager UI.

Copy:

> Restaurants can keep reservations, floor status, and team activity in sync.

---

# 12. How It Works

Create a calmer editorial section.

Heading:

> **It’s as easy as 1, 2, 3.**

Use 3 steps.

### 01 — Find a deal
Discover amazing deals and platter offers near you.

### 02 — Hold your table
Use the 2-minute hold feature to secure your spot.

### 03 — Enjoy together
Gather your squad and make it a Treat.

Use large numbers:

```text
01
02
03
```

Color the number pink/purple.

---

# 13. Restaurant Partner Section

Treat is not only a diner product.

Create a dedicated dark feature section.

### Background

Deep plum / midnight gradient.

### Headline

> **Dine in the kitchen.  
> Real-time sync.**

Or:

> **For restaurant teams.  
> Less chaos. More flow.**

### Content

Explain:

- floor management
- reservations
- table states
- kitchen coordination
- restaurant-side visibility

### Visual

Large laptop/tablet mockup.

Show:

```text
Live Floor Manager

Free
Reserved
Dining
Cleaning

T1 T2 T3 T4
T5 T6 T7 T8
```

Add a small CTA:

> Join as a restaurant →

This section should clearly feel different from the diner experience.

---

# 14. Testimonials

Do not use overly generic SaaS testimonial cards.

Use a **food-story format**.

Section eyebrow:

> REAL FOODIES. REAL STORIES.

Headline:

> **Good food brings people together.**

Use 3 cards.

Each card can include:

- food photo
- short quote
- avatar
- name
- role/context
- small rating

Example:

> “The budget matcher helped us find the perfect platter without going over.”

Cards should feel like mini food stories.

---

# 15. Final CTA

Large emotional closing section.

Heading:

> **Your next great meal  
> is already waiting.**

Supporting text:

> Find your people. Find your table. Make it a Treat.

CTA:

> Download Treat

Show:

- iOS
- Android

Use a generous amount of whitespace.

Optional decorative details:
- leaves
- tiny doodles
- food icons
- heart

Keep it elegant.

---

# 16. Footer

Footer should be simple.

Left:

Treat logo + short phrase:

> Funky foodie life.

Navigation:

- How It Works
- Features
- Reviews

Restaurant:

- Restaurant Login

App:

- Download App

Legal:

- Privacy
- Terms

Bottom line:

> © 2026 Treat Inc. All rights reserved.

---

# 17. Interaction Design

The website should feel alive but not distracting.

### Hover

Buttons:
- translateY(-2px)
- subtle shadow increase

Cards:
- translateY(-4px)
- image scale 1.02

Phone mockups:
- very subtle rotation/parallax

### Scroll

Use motion only where it improves storytelling.

Good animations:

- fade-up
- slide-up
- line drawing
- subtle scale
- floating food objects

Avoid:

- excessive bouncing
- long loading animations
- spinning UI everywhere
- scroll hijacking

---

# 18. Motion Timing

Recommended:

```text
micro interaction:
150–220ms

card hover:
220–300ms

section reveal:
500–700ms

phone entrance:
700–900ms

line drawing:
900–1400ms
```

Use easing:

```text
ease-out
cubic-bezier(...)
```

Animations should be disabled/reduced for users with:

```text
prefers-reduced-motion
```

---

# 19. Responsive Behavior

## Desktop

Full visual composition.

```text
Hero:
2 columns

Journey:
4 phones

Feature grid:
2 × 2

Restaurant:
2 columns
```

## Tablet

Hero can remain two columns but reduce mockup size.

Journey:

```text
2 × 2
```

Feature grid:

```text
2 columns
```

## Mobile

Hero:

```text
text
CTA
stats
phone
```

Journey:

Use a vertical story:

```text
01
phone
title
description
↓
02
phone
title
description
↓
03
phone
title
description
↓
04
phone
title
description
```

Do NOT try to squeeze four phones into one row on mobile.

---

# 20. Mobile Navigation

Use a compact header:

```text
Treat logo                  Menu
```

Menu opens with:

- How it Works
- Features
- Reviews
- Restaurant Login
- Download App

The Download App CTA should be visually strongest.

---

# 21. Components

Create reusable components.

Recommended component structure:

```text
Navbar
Hero
TrustStats
FeatureJourney
JourneyStep
FeatureBento
FeatureCard
HowItWorks
RestaurantSection
TestimonialSection
TestimonialCard
FinalCTA
Footer
PhoneMockup
DeviceFrame
FloatingFood
Doodle
AnimatedConnectionLine
```

Do not duplicate markup for repeated patterns.

---

# 22. Design Tokens

Create one central token system.

Example:

```css
:root {
  --treat-ink: #191426;
  --treat-plum: #2A183D;

  --treat-purple: #7448D8;
  --treat-violet: #9C72F2;

  --treat-pink: #E63D91;
  --treat-pink-soft: #FBE1EF;

  --treat-cream: #FFF9F1;
  --treat-white: #FFFCF8;

  --treat-lavender: #EEE7FF;

  --treat-mint: #E4F6ED;
  --treat-green: #56C99B;

  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 30px;
  --radius-pill: 999px;

  --shadow-soft:
    0 20px 60px rgba(42, 24, 61, 0.10);
}
```

Adjust values if the existing design system already contains equivalent tokens.

---

# 23. Buttons

Primary:

```text
background: #191426
color: #FFFFFF
radius: 999px
height: 48–54px
padding: 0 24–28px
```

Secondary:

```text
background: transparent
border: 1px solid rgba(...)
color: #191426
radius: 999px
```

Small download/store buttons may use compact pill styling.

Buttons should never become visually oversized.

---

# 24. Card Styling

Cards should feel tactile.

Recommended:

```text
border-radius: 24–32px
border: 1px solid rgba(25,20,38,0.06)
shadow: soft
background: white/cream
```

Avoid heavy borders.

---

# 25. Food Photography

Food is a major part of the brand.

Photography direction:

- natural lighting
- close crops
- authentic dishes
- warm tones
- social dining moments
- modern restaurant interiors

Avoid:
- obvious stock-photo appearance
- overly saturated food
- unrealistic AI-looking food
- excessive image decoration

When an image can be cropped as a rounded card, use larger image areas rather than tiny thumbnails.

---

# 26. Device Mockups

Use realistic phone/laptop frames.

Rules:

- consistent device frame
- consistent perspective
- consistent shadow
- realistic screen screenshots
- enough breathing space around devices

Do not mix multiple different phone styles.

Phone shadows should be soft:

```text
0 24px 60px rgba(30,20,50,0.18)
```

---

# 27. Accessibility

Must support:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible button labels
- proper heading hierarchy
- alt text
- reduced motion
- minimum reasonable contrast
- touch targets of at least ~44px

Do not rely on color alone for meaning.

---

# 28. Performance

The redesign must not make the website heavy unnecessarily.

Implement:

- lazy-loaded images
- responsive image sizes
- optimized WebP/AVIF where supported
- CSS/SVG decorations rather than huge raster assets where practical
- lazy-loaded below-the-fold mockups
- animation using transform/opacity
- avoid expensive blur effects everywhere

The hero should load quickly.

---

# 29. SEO / Metadata

Preserve or improve:

```text
title
meta description
Open Graph image
Twitter/X card
favicon
canonical URL
```

Recommended title pattern:

> Treat — Find Your People. Find Your Table.

Recommended description:

> Discover food deals, match your budget, hold a table in minutes, and enjoy great food together with Treat.

Do not remove existing SEO metadata unless replacing it with better metadata.

---

# 30. UX Copy Rules

Treat should sound human.

Prefer:

> Find your table.

Instead of:

> Explore our advanced reservation solution.

Prefer:

> Match your budget.

Instead of:

> Utilize our intelligent budget optimization engine.

Prefer:

> Good food. Better together.

Avoid corporate SaaS jargon.

Tone:

**friendly + confident + concise.**

---

# 31. Important Existing Functionality Rule

Before modifying anything:

1. Inspect the repository.
2. Identify the existing framework/build system.
3. Identify routes and existing functional interactions.
4. Identify existing app screenshots/assets.
5. Identify existing design tokens/components.
6. Preserve working functionality.
7. Improve UI/UX without breaking product behavior.

Do NOT rebuild the entire project from scratch unless the current architecture genuinely prevents the redesign.

---

# 32. Implementation Strategy for AI Agent

Use this order:

### Phase 1 — Audit

Analyze:

```text
package/project configuration
routes
components
assets
styles
existing design system
responsive behavior
CTA behavior
download links
restaurant login flow
```

Create a short internal implementation plan before editing.

### Phase 2 — Design system

Implement:

- colors
- typography
- spacing
- radii
- shadows
- button variants
- card variants
- responsive containers

### Phase 3 — Core layout

Implement:

1. Navbar
2. Hero
3. Trust stats
4. Journey section
5. Feature bento
6. How it works
7. Restaurant section
8. Testimonials
9. Final CTA
10. Footer

### Phase 4 — Motion

Add:

- scroll reveals
- animated connection line
- subtle phone movement
- floating decorative elements
- hover states

### Phase 5 — Responsive

Test:

```text
1440px
1280px
1024px
768px
430px
390px
360px
```

### Phase 6 — QA

Check:

- no overflow
- no broken images
- no layout jumps
- no text clipping
- CTA links work
- mobile menu works
- keyboard navigation
- reduced-motion behavior
- production build

---

# 33. Critical Visual Requirements

The final implementation must preserve these visual ideas:

### 01
Large clean hero with generous whitespace.

### 02
Hero phone is a major visual focal point.

### 03
Pink is reserved for important emotional/product moments.

### 04
The 4-phone journey is the core visual storytelling section.

### 05
Phones must have comfortable spacing.

### 06
The curved connection line should make the four screens feel like one journey.

### 07
Feature cards should feel editorial and premium, not like generic SaaS cards.

### 08
Restaurant features should have a dedicated visual identity.

### 09
Food photography should make the site feel appetizing.

### 10
The entire website should feel lighter and more spacious than the current version.

---

# 34. What to Avoid

Do NOT:

- use excessive gradients
- make every section a card
- use huge amounts of purple
- use tiny unreadable labels
- overcrowd the hero
- put 4 phones tightly together
- add random animations
- use generic SaaS illustrations
- use giant paragraphs
- create unnecessary dashboards
- replace functional links with fake buttons
- remove working app/download functionality
- sacrifice performance for decorative effects

---

# 35. Success Criteria

The redesign is successful when:

### Visual

The page looks like a polished consumer food-tech brand rather than a template.

### UX

A first-time visitor understands Treat within seconds.

### Storytelling

The visitor naturally understands:

```text
Discover
→ Match budget
→ Hold table
→ Enjoy together
```

### Brand

Treat feels:

```text
playful
premium
social
food-first
human
```

### Technical

The implementation is:

```text
responsive
accessible
performant
componentized
maintainable
production-ready
```

---

# 36. Final Agent Instruction

**Build the website from this specification, using the attached visual reference as the visual target.**

Do not blindly copy every pixel of the reference image. Use it as the art-direction reference and translate it into real responsive components.

First inspect the current project and reuse its existing functionality, assets, routes, and design tokens where they make sense.

The final result should feel like:

> **A premium food app landing page designed by a strong product design team — playful enough to feel human, refined enough to feel trustworthy, and visual enough to make the app itself the hero.**

Prioritize:
1. hierarchy
2. whitespace
3. product storytelling
4. device mockups
5. food photography
6. CTA clarity
7. responsive behavior
8. performance
9. accessibility
10. maintainability

Do not stop at a visual mockup. Implement the actual production-ready website.
