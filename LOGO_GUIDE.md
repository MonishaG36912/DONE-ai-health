# Adding Your Custom Logo

## Method 1: Replace the SVG Logo

1. **Add your logo file** to `/public/logos/` folder:
   - Supported formats: PNG, JPG, SVG, WebP
   - Recommended size: 40x40px for icon, or 120x40px for horizontal logo
   - Example: `your-logo.png`

2. **Update the logo configuration** in `/lib/logo-config.js`:
   ```javascript
   export const currentLogo = {
     src: "/logos/your-logo.png",
     alt: "Your Brand Name",
     width: 120,
     height: 40
   };
   ```

## Method 2: Use Icon Only

Update `/lib/logo-config.js`:
```javascript
export const currentLogo = logoConfig.icon; // Shows only the calendar icon
```

## Method 3: Text Only

Update `/lib/logo-config.js`:
```javascript
export const currentLogo = logoConfig.textOnly; // Shows only "Period Tracker" text
```

## Method 4: Custom Brand Text

Edit `/components/logo.jsx` and change the brand text:
```javascript
<span className="font-bold text-lg bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
  Your Brand Name  {/* Change this */}
</span>
```

## Logo Specifications

- **Icon Logo**: 32x32px or 40x40px
- **Horizontal Logo**: 120x40px max
- **File Types**: PNG (with transparency), SVG (vector), JPG
- **Colors**: Works best with transparent background or white background

## Current Setup

✅ Responsive design (full logo on desktop, icon only on mobile)
✅ Gradient text effect
✅ Custom SVG logo included
✅ Easy logo switching via configuration file
