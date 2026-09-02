# Landing Page Customization Guide

Quick reference for updating content without breaking the design.

---

## 🎨 Visual Customizations

### Colors
Update Tailwind color classes throughout the file:

**Current Primary:** Blue (#2563EB) → Change all `blue-600` to your color  
**Current Secondary:** Indigo (#4F46E5) → Change all `indigo-600` to your accent  

**Example:**
```jsx
// Before
className="from-blue-600 to-indigo-600"

// After  
className="from-teal-600 to-cyan-600"
```

### Logo
```jsx
// Line 7
const LOGO = "https://onegrasp.com/wp-content/uploads/2026/07/onegrasp-logo.png";

// Update to your logo URL
const LOGO = "https://yourcdn.com/your-logo.png";
```

### Fonts
Fonts are inherited from global styles. If you want to customize:
```jsx
className="font-sans"  // System fonts (default)
className="font-serif" // Serif fonts
// Add custom fonts in app/layout.tsx
```

---

## 📝 Content Customizations

### Hero Statistics (WEF Data)
```jsx
// Line ~65
<div className="text-5xl font-black text-green-600 mb-1">
  170<span className="text-3xl">M</span>
</div>
```

Update the numbers if WEF data changes:
- 170M → New jobs
- 92M → Jobs displaced  
- 78M → Net growth

**Source:** World Economic Forum, Future of Jobs Report 2025

### Problem Cards
```jsx
// Line ~130 (Problems Section)
{ title: "MARKS", question: "My child scores well in Maths", doubt: "Does that automatically mean Engineering?" },
```

Customize to your audience's specific concerns.

### Timeline Stages
```jsx
// Line ~185 (Timeline)
{ stage: "Class 8–9", action: "Discover", desc: "Strengths & interests" },
```

Adjust for different education systems (e.g., Grade 9-10 for US).

### 8 Dimensions
**Do NOT change the 8 dimensions themselves** — they're core to positioning.

But you can customize descriptions:
```jsx
// Line ~270
{ icon: "🧠", name: "Personality", desc: "Natural behavioral patterns, decision approaches, and responses" },
```

### Benefits (Beyond Career)
```jsx
// Line ~345
{ icon: "🎯", title: "Better Career Decisions", desc: "Explore career directions aligned with the student's profile" },
```

Add or remove benefits as needed (limit to 4 for layout).

### Career Categories
```jsx
// Line ~430
["AI & Machine Learning", "Data & Analytics", "Cybersecurity", ...]
```

Update to reflect relevant emerging careers in your market.

### Salary Ranges
```jsx
// Line ~455
{ title: "Software Engineering & AI", range: "₹6–15L (entry) → ₹30–80L+ (experienced)" },
```

**⚠️ Important:** Update with verified, sourced data only.  
Add disclaimer if using estimates: "*Based on industry benchmarks"

### Frameworks
```jsx
// Line ~502
{ dimension: "Personality", framework: "Big Five (OCEAN) Model" },
```

Keep aligned with your actual assessment methodology.

### Trust Statistics
```jsx
// Line ~585
<div className="text-4xl font-black text-blue-600 mb-2">500+</div>
<p className="text-gray-700 font-semibold">Schools & programs</p>
```

Update to your actual numbers:
- 500+ → Schools using OneGrasp
- 50K+ → Students assessed
- 4.8/5 → Student satisfaction rating

**⚠️ Important:** Only use REAL numbers. Never fabricate.

### Testimonials
```jsx
// Line ~620
<p className="text-gray-800 font-semibold mb-4 italic">"The assessment helped us understand our child..."</p>
<p className="font-bold text-gray-900">— Parent, Mumbai</p>
```

Replace with authentic testimonials from your users.

**Format:**
- Quote (1-2 sentences)
- Source (Name, Role, Location)

### FAQ Questions
```jsx
// Line ~705
{ q: "Is this just a personality test?", a: "No. It combines eight different dimensions..." },
```

Update based on actual user questions.

---

## 🔗 Navigation & Links

### Update Links in Navigation
```jsx
// Line ~755 (Top navigation)
<motion.a href="#sample" className="...">Sample Report</motion.a>
<motion.a href="#" className="...">Methodology</motion.a>
```

Change `href="#"` to actual routes:
```jsx
href="/methodology"
href="/schools"
href="/about"
```

### Update Footer Links
```jsx
// Line ~850 (Footer)
<li><a href="#" className="...">About Us</a></li>
```

Replace `#` with your actual routes:
```jsx
href="/about"
href="/contact"
href="/blog"
href="/careers"
href="/privacy"
href="/terms"
```

### Update Footer Social/Contact
Add at bottom of Footer component:
```jsx
<div className="mt-4 flex gap-4">
  <a href="https://twitter.com/onegrasp">Twitter</a>
  <a href="https://linkedin.com/company/onegrasp">LinkedIn</a>
  <a href="mailto:hello@onegrasp.com">Email</a>
</div>
```

---

## 📱 Layout Customizations

### Change Grid Columns
```jsx
// 4-column grid (current)
className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"

// Change to 3-column
className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
```

### Adjust Spacing
```jsx
// Current: py-28
className="py-28 bg-white"

// Reduce to py-16, py-20, or py-24
```

### Change Section Colors
```jsx
// Current: bg-gradient-to-b from-white to-gray-50
className="bg-gradient-to-b from-white to-gray-50"

// Change to solid
className="bg-white"

// Or different gradient
className="bg-gradient-to-r from-blue-50 to-indigo-50"
```

---

## 🎯 CTA Customizations

### Change Button Text
```jsx
// Current
onClick={onStart}
className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl"
>
  Discover My Child's Career Fit <ArrowRight size={20} />
</motion.button>
```

Change text but keep consistent messaging:
- "Start Your Child's Assessment"
- "Explore Your Child's Profile"
- "Begin the Assessment"

### Change Button Colors
```jsx
// Current: blue-600 to indigo-600
className="from-blue-600 to-indigo-600"

// Change to your brand colors
className="from-teal-600 to-cyan-600"
```

### Change Button Size
```jsx
// Current: px-8 py-4
className="px-8 py-4"

// Larger: px-10 py-5
className="px-10 py-5"

// Smaller: px-6 py-3
className="px-6 py-3"
```

---

## 🖼️ Image Customizations

### Update Report Preview Images
```jsx
// Line ~430
<img src="https://onegrasp.com/wp-content/uploads/2026/08/Screenshot-2026-08-29-225423.png" alt="8 Dimensions Profile" />
```

Update these URLs to match your actual report screenshots.

### Optimize Images
Use Next.js Image component:
```jsx
import Image from 'next/image';

<Image 
  src="/path/to/image.png"
  alt="Descriptive alt text"
  width={800}
  height={600}
  priority={false}
/>
```

---

## 🎨 Advanced Customizations

### Add Analytics Tracking
```jsx
import { trackEvent } from "@/lib/metaPixel"; // Already imported in parent

// In any CTA button
onClick={() => {
  trackEvent('cta_clicked', { section: 'hero' });
  onStart();
}}
```

### Add AB Testing
```jsx
const [variant, setVariant] = useState('control');

// Show different text based on variant
{variant === 'control' ? 'Discover My Child\'s Career Fit' : 'Start the Assessment'}
```

### Add Custom Animations
Framer Motion variants at top of file:
```jsx
const customVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};
```

---

## ⚠️ DO NOT MODIFY

### Core Concepts (Never Change)
- ❌ The 8 dimensions list
- ❌ The core messaging ("Marks don't tell who they are")
- ❌ The conversion flow structure
- ❌ The trust/proof section positioning

### Structural Elements (Keep As-Is)
- ❌ Number of main sections (10 sections)
- ❌ Hero positioning
- ❌ Final CTA prominence
- ❌ Navigation sticky position

### Design Principles (Maintain)
- ❌ Warm white backgrounds
- ❌ Generous whitespace
- ❌ Premium feel
- ❌ Educational tone

---

## 🚀 Common Customization Scenarios

### Scenario: "We want to highlight our unique assessment approach"
**Where to customize:**
1. Update Methodology section frameworks
2. Add specific research/validation in What OneGrasp Does section
3. Emphasize in 8 Dimensions introduction

### Scenario: "We want to target a specific age group"
**Where to customize:**
1. Update Timeline stages (adjust class numbers)
2. Change Problem cards to relevant concerns
3. Update Career Categories to relevant fields
4. Adjust testimonial demographics

### Scenario: "We have different pricing tiers"
**Where to customize:**
1. Add note in FAQ about pricing
2. Update report features to match tier
3. May need payment gate changes (not on landing)

### Scenario: "We want to add case studies"
**Where to customize:**
1. Expand Testimonials section with detailed case study cards
2. Add dedicated case study section before FAQ
3. Link to full case study pages in footer

### Scenario: "We want to add video testimonials"
**Where to customize:**
1. Convert testimonial cards to embed YouTube/Vimeo
2. Add play button overlay
3. Adjust card height for video aspect ratio

---

## 🔍 Testing After Customization

After making changes, test:

1. **Visual:** Does layout still look good?
2. **Performance:** Did images slow down page?
3. **Responsive:** Does mobile layout work?
4. **Links:** Do new links work?
5. **Content:** No spelling errors?
6. **Consistency:** Does tone match throughout?

---

## 📖 Quick Copy-Paste Sections

### Add a New Benefit
```jsx
{ icon: "🆕", title: "New Benefit", desc: "Description of benefit" },
```

### Add a New FAQ
```jsx
{
  q: "Your question?",
  a: "Your answer explaining the benefit clearly and concisely.",
},
```

### Add a New Testimonial
```jsx
<motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8">
  <p className="text-gray-800 font-semibold mb-4 italic">"Your testimonial quote here."</p>
  <p className="font-bold text-gray-900">— Name, Role, Location</p>
</motion.div>
```

### Add a New Career Category
```jsx
"Your New Career Field"
```

Add to Career Landscape section array (around line 430).

---

## 📞 Support

If customizations break the layout or design, refer to:
- Original LANDING_PAGE_REDESIGN.md for section details
- Tailwind documentation for CSS changes
- Framer Motion docs for animation customizations

**Key File:** `app/LandingNew.tsx` (798 lines)  
**Companion Files:** 
- `LANDING_PAGE_REDESIGN.md` (comprehensive documentation)
- `TESTING_CHECKLIST.md` (QA guide)

---

**Last Updated:** August 29, 2026
