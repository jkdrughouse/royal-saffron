#!/usr/bin/env python3
"""
Optimize hero images for mobile devices
- Resize to 1080x1920px (9:16 portrait ratio)
- Convert to WebP format
- Compress to 80% quality
- Target file size: < 200KB
"""

from PIL import Image
import os
import glob

def optimize_hero_image(input_path, output_dir="public"):
    """Optimize a single hero image"""
    try:
        # Open image
        img = Image.open(input_path)
        print(f"\n📸 Processing: {os.path.basename(input_path)}")
        print(f"   Original size: {img.size[0]}x{img.size[1]}")
        
        # Target dimensions for mobile hero (portrait)
        target_width = 1080
        target_height = 1920
        
        # Calculate aspect ratios
        img_ratio = img.size[0] / img.size[1]
        target_ratio = target_width / target_height
        
        # Resize to cover the target area (object-fit: cover behavior)
        if img_ratio > target_ratio:
            # Image is wider - scale by height
            new_height = target_height
            new_width = int(img.size[0] * (target_height / img.size[1]))
        else:
            # Image is taller - scale by width
            new_width = target_width
            new_height = int(img.size[1] * (target_width / img.size[0]))
        
        # Resize with high-quality Lanczos resampling
        img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Center crop to exact target dimensions
        left = (new_width - target_width) // 2
        top = (new_height - target_height) // 2
        right = left + target_width
        bottom = top + target_height
        
        img_final = img_resized.crop((left, top, right, bottom))
        
        # Convert to RGB if necessary (WebP doesn't support transparency well)
        if img_final.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img_final.size, (255, 255, 255))
            if img_final.mode == 'P':
                img_final = img_final.convert('RGBA')
            background.paste(img_final, mask=img_final.split()[-1] if img_final.mode == 'RGBA' else None)
            img_final = background
        elif img_final.mode != 'RGB':
            img_final = img_final.convert('RGB')
        
        # Generate output filename (replace extension with .webp)
        basename = os.path.splitext(os.path.basename(input_path))[0]
        output_path = os.path.join(output_dir, f"{basename}.webp")
        
        # Save as WebP with 80% quality
        img_final.save(output_path, 'WebP', quality=80, method=6)
        
        # Get file sizes
        original_size = os.path.getsize(input_path) / 1024  # KB
        new_size = os.path.getsize(output_path) / 1024  # KB
        reduction = ((original_size - new_size) / original_size) * 100
        
        print(f"   ✅ Optimized: {target_width}x{target_height}")
        print(f"   📦 Original: {original_size:.1f}KB → New: {new_size:.1f}KB")
        print(f"   💾 Size reduction: {reduction:.1f}%")
        
        if new_size > 200:
            print(f"   ⚠️  Warning: File size ({new_size:.1f}KB) exceeds 200KB target")
        
        return output_path
        
    except Exception as e:
        print(f"   ❌ Error processing {input_path}: {e}")
        return None

def main():
    print("🎨 Hero Image Optimization for Mobile")
    print("=" * 50)
    print("Target: 1080x1920px (9:16 portrait)")
    print("Format: WebP @ 80% quality")
    print("=" * 50)
    
    # Find all hero images
    hero_images = glob.glob("public/hero*.png") + glob.glob("public/hero*.jpg")
    
    if not hero_images:
        print("\n❌ No hero images found in public/ directory")
        return
    
    print(f"\n📁 Found {len(hero_images)} hero image(s)")
    
    optimized = []
    for img_path in sorted(hero_images):
        result = optimize_hero_image(img_path)
        if result:
            optimized.append(result)
    
    print("\n" + "=" * 50)
    print(f"✨ Successfully optimized {len(optimized)}/{len(hero_images)} images")
    print("\n📋 Optimized files:")
    for path in optimized:
        print(f"   • {path}")
    
    print("\n💡 Next step: Update src/app/page.tsx to use .webp extensions")

if __name__ == "__main__":
    main()
