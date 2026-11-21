# 🎨 CluckFresh Hub - Design System & UI Guide

## Color Palette

### Primary Colors

#### Fresh Green → `#16A34A` (Freshness, Trust)
Used for: Primary buttons, success states, fresh badges, primary actions

```css
primary-50: #f0fdf4
primary-100: #dcfce7
primary-200: #bbf7d0
primary-300: #86efac
primary-400: #4ade80
primary-500: #22c55e
primary-600: #16a34a  ← Main Primary
primary-700: #15803d
primary-800: #166534
primary-900: #14532d
```

#### Warm Red → `#DC2626` (Meat, Appetite)
Used for: Accent buttons, sale badges, important notifications

```css
accent-50: #fef2f2
accent-100: #fee2e2
accent-200: #fecaca
accent-300: #fca5a5
accent-400: #f87171
accent-500: #ef4444
accent-600: #dc2626  ← Main Accent
accent-700: #b91c1c
accent-800: #991b1b
accent-900: #7f1d1d
```

### Secondary Colors

#### Soft Yellow → `#FACC15` (Energy, Food Vibe)
Used for: Highlights, special offers, ratings

```css
yellow-50: #fefce8
yellow-100: #fef9c3
yellow-200: #fef08a
yellow-300: #fde047
yellow-400: #facc15  ← Main Yellow
yellow-500: #eab308
yellow-600: #ca8a04
yellow-700: #a16207
yellow-800: #854d0e
yellow-900: #713f12
```

#### Dark Gray → `#1F2937` (Text, Professionalism)
Used for: Primary text, headings, professional elements

```css
dark-50: #f9fafb
dark-100: #f3f4f6
dark-200: #e5e7eb
dark-300: #d1d5db
dark-400: #9ca3af
dark-500: #6b7280
dark-600: #4b5563
dark-700: #374151
dark-800: #1f2937  ← Main Dark
dark-900: #111827
```

### Background Colors

- **White**: `#FFFFFF` - Main background
- **Light Gray**: `#F9FAFB` - Secondary background

## 🏷️ Brand Taglines

### Primary Tagline
**"Fresh Chicken. Smarter Delivery."**

Usage: Hero banners, main marketing materials, email signatures

### Alternative Taglines
- "From Farm to Home."
- "Freshness You Can Trust."
- "Order Fresh. Eat Better."

## 🎨 UI Components

### Buttons

#### Primary Button (Fresh Green)
```jsx
<button className="btn-primary">
  Shop Now
</button>
```
- Background: `primary-600`
- Hover: `primary-700`
- Text: White
- Border Radius: `rounded-2xl`
- Shadow: `shadow-md hover:shadow-lg`

#### Secondary Button (Warm Red)
```jsx
<button className="btn-secondary">
  View Subscriptions
</button>
```
- Background: `accent-600`
- Hover: `accent-700`
- Text: White
- Border Radius: `rounded-2xl`

#### Outline Button
```jsx
<button className="btn-outline">
  Learn More
</button>
```
- Border: `2px solid primary-600`
- Text: `primary-600`
- Hover Background: `primary-600`
- Hover Text: White

### Cards
```jsx
<div className="card">
  {/* Card content */}
</div>
```
- Background: White
- Border Radius: `rounded-2xl`
- Shadow: `shadow-md hover:shadow-xl`
- Border: `border-dark-100`

### Badges

#### Fresh Badge (Green)
```jsx
<span className="badge badge-fresh">Fresh</span>
```
- Background: `primary-100`
- Text: `primary-800`

#### Halal Badge (Yellow)
```jsx
<span className="badge badge-halal">Halal</span>
```
- Background: `yellow-100`
- Text: `yellow-800`

#### Frozen Badge (Blue)
```jsx
<span className="badge badge-frozen">Frozen</span>
```
- Background: `blue-100`
- Text: `blue-800`

### Input Fields
```jsx
<input className="input-field" placeholder="Enter text..." />
```
- Border: `border-dark-200`
- Focus Ring: `ring-2 ring-primary-500`
- Border Radius: `rounded-2xl`
- Background: White

## 🏠 Page-Specific Styles

### Homepage

#### Hero Section
```jsx
<section className="gradient-primary text-white">
  <div className="inline-block bg-yellow-400 text-dark-800 px-4 py-2 rounded-full text-sm font-bold mb-4">
    🎉 Fresh Chicken. Smarter Delivery.
  </div>
  <h1 className="text-4xl md:text-6xl font-bold mb-6">
    Fresh Chicken Delivered to Your Doorstep
  </h1>
</section>
```

#### Features Section
```jsx
<div className={`${feature.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
  <feature.icon className={`w-8 h-8 ${feature.color}`} />
</div>
```

### Navigation

#### Navbar
```jsx
<nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-primary-200">
  {/* Logo with green background */}
  <div className="bg-primary-600 p-2 rounded-xl">
    <GiChickenOven className="w-6 h-6 text-white" />
  </div>
</nav>
```

### Product Cards
```jsx
<div className="card group">
  <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
  {/* Badges positioned absolutely */}
  <div className="absolute top-2 left-2 flex flex-col space-y-1">
    <span className="badge badge-fresh">Fresh</span>
    <span className="badge badge-halal">Halal</span>
  </div>
</div>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
```jsx
<div className="text-sm md:text-base lg:text-lg">
  {/* Responsive text */}
</div>
```

## ✨ Animations

### Fade In
```jsx
<div className="animate-fade-in">
  {/* Content */}
</div>
```

### Hover Effects
- Cards: `hover:shadow-xl`
- Buttons: `hover:shadow-lg hover:scale-105`
- Images: `group-hover:scale-105`

### Loading Spinner
```jsx
<div className="spinner"></div>
```
- Border: `4px solid #f3f3f3`
- Top Border: `4px solid #16a34a` (Fresh Green)
- Animation: 1s linear infinite

## 🎯 Design Principles

### 1. Freshness First
- Use green (`primary-600`) as the dominant color
- Associate green with fresh products and success actions

### 2. Appetite Appeal
- Use red (`accent-600`) for important CTAs and sale items
- Red stimulates appetite and urgency

### 3. Energy & Warmth
- Use yellow (`yellow-400`) for highlights and special offers
- Creates positive emotional connection

### 4. Professionalism
- Use dark gray (`dark-800`) for text
- Ensures readability and trust

### 5. Clean & Modern
- Rounded corners (`rounded-2xl`)
- Soft shadows
- Generous whitespace
- Large, clear typography

## 🧩 Component Library

### Available Components
1. **Navbar** - Navigation with logo and cart
2. **Footer** - Site information and links
3. **ProductCard** - Product display
4. **LoadingSpinner** - Loading indicator
5. **ProtectedRoute** - Route protection

### Usage Examples

#### Product Card
```jsx
import ProductCard from './components/ProductCard';

<ProductCard product={productData} />
```

#### Loading Spinner
```jsx
import LoadingSpinner from './components/LoadingSpinner';

<LoadingSpinner fullScreen />
```

## 📊 Color Usage Guide

| Element | Color | Usage |
|---------|-------|-------|
| Primary Buttons | `primary-600` | Main CTAs, Add to Cart |
| Secondary Buttons | `accent-600` | Sale, Limited Offers |
| Success Messages | `primary-600` | Order confirmed, Added to cart |
| Error Messages | `accent-600` | Out of stock, Errors |
| Fresh Badge | `primary-100/800` | Fresh products |
| Halal Badge | `yellow-100/800` | Halal certified |
| Sale Badge | `accent-100/800` | Discounts |
| Text Headings | `dark-800` | All headings |
| Text Body | `dark-600` | Paragraphs |
| Background | `background-light` | Page backgrounds |

## 🚀 Implementation Checklist

✅ Tailwind config updated with new colors  
✅ CSS components styled with new palette  
✅ Navbar updated with green logo  
✅ Homepage hero with tagline  
✅ Buttons use fresh green primary  
✅ Cards have rounded-2xl corners  
✅ Badges use appropriate colors  
✅ Scrollbar styled green  
✅ All components responsive  

## 🎨 Quick Reference

```css
/* Fresh Green (Primary) */
bg-primary-600 hover:bg-primary-700

/* Warm Red (Accent) */
bg-accent-600 hover:bg-accent-700

/* Soft Yellow (Highlights) */
bg-yellow-400 text-dark-800

/* Dark Gray (Text) */
text-dark-800

/* Background */
bg-background-light
```

---

**Design System Version:** 2.0  
**Last Updated:** 2024  
**Status:** ✅ Implemented
