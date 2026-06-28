# Chicken Lollipop Images Guide

## Overview
This guide explains how to add the Chicken Lollipop product images from your screenshot to the project.

---

## Image Folder Structure

```
frontend/
└── public/
    └── images/
        └── products/
            ├── chicken-lollipop-main.jpg    (Main showcase image)
            ├── chicken-lollipop-1.jpg       (Thumbnail 1)
            ├── chicken-lollipop-2.jpg       (Thumbnail 2)
            ├── chicken-lollipop-3.jpg       (Thumbnail 3)
```

---

## Steps to Add Your Screenshot Image

### Option 1: Manual Copy (Recommended)

1. **Locate your screenshot:**
   - File: `Screenshot 2026-04-01 104756.png`
   - Location: `C:\Users\mohamed asarudeen\Downloads\`

2. **Copy to project:**
   ```bash
   # Create directory if not exists
   mkdir frontend\public\images\products
   
   # Copy and rename the screenshot
   copy "C:\Users\mohamed asarudeen\Downloads\Screenshot 2026-04-01 104756.png" "frontend\public\images\products\chicken-lollipop-main.jpg"
   ```

3. **Add additional images (optional):**
   - Find 3 more chicken lollipop images
   - Save as `chicken-lollipop-1.jpg`, `chicken-lollipop-2.jpg`, `chicken-lollipop-3.jpg`

---

### Option 2: Download from Unsplash (Automatic)

Use these high-quality chicken lollipop/wings images as placeholders:

#### Main Image (800x600)
```
https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=600&fit=crop
```
Save as: `chicken-lollipop-main.jpg`

#### Thumbnail 1 (400x300)
```
https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop
```
Save as: `chicken-lollipop-1.jpg`

#### Thumbnail 2 (400x300)
```
https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&h=300&fit=crop
```
Save as: `chicken-lollipop-2.jpg`

#### Thumbnail 3 (400x300)
```
https://images.unsplash.com/photo-1606491956689-2ea28c6746f5?w=400&h=300&fit=crop
```
Save as: `chicken-lollipop-3.jpg`

---

### Option 3: Use PowerShell Script

Create a file `download-images.ps1` in the frontend folder:

```powershell
# Create directory
New-Item -ItemType Directory -Force -Path "public\images\products"

# Download images
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=600&fit=crop" -OutFile "public\images\products\chicken-lollipop-main.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop" -OutFile "public\images\products\chicken-lollipop-1.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&h=300&fit=crop" -OutFile "public\images\products\chicken-lollipop-2.jpg"
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1606491956689-2ea28c6746f5?w=400&h=300&fit=crop" -OutFile "public\images\products\chicken-lollipop-3.jpg"

Write-Host "Images downloaded successfully!" -ForegroundColor Green
```

Run the script:
```powershell
cd frontend
.\download-images.ps1
```

---

## Current Component Configuration

### ChickenLollipopShowcase.jsx
```javascript
const product = {
  image: '/images/products/chicken-lollipop-main.jpg',
  additionalImages: [
    '/images/products/chicken-lollipop-1.jpg',
    '/images/products/chicken-lollipop-2.jpg',
    '/images/products/chicken-lollipop-3.jpg',
  ],
  fallbackImages: {
    main: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=600&fit=crop',
    thumb1: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
    thumb2: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&h=300&fit=crop',
    thumb3: 'https://images.unsplash.com/photo-1606491956689-2ea28c6746f5?w=400&h=300&fit=crop',
  },
};
```

**Note:** The component has fallback online images, so it will display properly even if local images are missing.

---

## Image Requirements

### Main Image
- **Size:** 800x600 pixels (or larger with 4:3 aspect ratio)
- **Format:** JPG or PNG
- **Content:** Clear shot of chicken lollipop (frenched drumettes)
- **Quality:** High resolution, good lighting

### Thumbnail Images
- **Size:** 400x300 pixels (or larger with 4:3 aspect ratio)
- **Format:** JPG or PNG
- **Content:** Different angles/preparations of chicken lollipop
- **Quality:** Clear, appetizing presentation

---

## Recommended Image Content

Based on your screenshot description:

**Main Image:**
- Frenched drumettes shaped like lollipops
- Restaurant-quality presentation
- Clear focus on the product
- Good lighting

**Thumbnails:**
1. Close-up of chicken lollipop shape
2. Cooked/prepared chicken lollipop dish
3. Multiple pieces showing the cut style

---

## Verification

After adding images, verify they work:

1. **Start development server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to:**
   - Home page → Scroll to Chicken Lollipop section
   - Or: `/products?category=chicken-cuts&cut=lollipop`

3. **Check:**
   - Main image displays correctly
   - All 3 thumbnails load
   - Images are clear and appetizing
   - No broken image icons

---

## Troubleshooting

### Images Not Loading?

1. **Check file paths:**
   ```bash
   # Verify files exist
   dir frontend\public\images\products\*.jpg
   ```

2. **Check file names:**
   - Must be exactly: `chicken-lollipop-main.jpg`, etc.
   - Case-sensitive on some systems

3. **Clear browser cache:**
   - Press `Ctrl+Shift+R` (hard refresh)
   - Or clear cache in browser settings

4. **Check browser console:**
   - Press `F12` → Console tab
   - Look for 404 errors on image paths

### Using Screenshot Directly?

If you want to use your screenshot as-is:

```bash
# Copy screenshot
copy "C:\Users\mohamed asarudeen\Downloads\Screenshot 2026-04-01 104756.png" "frontend\public\images\products\chicken-lollipop-main.jpg"
```

The component will automatically use it with the fallback system.

---

## Image Optimization Tips

1. **Compress images:**
   - Use TinyPNG or ImageOptim
   - Target: < 200KB for main image, < 100KB for thumbnails

2. **Resize appropriately:**
   - Don't use images larger than needed
   - Max 800px width for main image

3. **Use WebP format (optional):**
   - Better compression than JPG
   - Update component to use `.webp` extension

---

## Quick Command Reference

```bash
# Create directory
mkdir frontend\public\images\products

# Copy screenshot as main image
copy "C:\Users\mohamed asarudeen\Downloads\Screenshot*.png" "frontend\public\images\products\chicken-lollipop-main.jpg"

# List images
dir frontend\public\images\products

# Start dev server
cd frontend && npm run dev
```

---

**Status:** ✅ Component ready with fallback images  
**Date:** 1 April 2026  
**Author:** Mathina FreshHub Development Team
