#!/usr/bin/env python3
"""
Image Optimization Script for JKC E-commerce
Converts and optimizes images using PIL/Pillow (no sudo required)
"""

import os
from PIL import Image
from pathlib import Path
import shutil
from datetime import datetime

def get_size_mb(filepath):
    """Get file size in MB"""
    size_bytes = os.path.getsize(filepath)
    return size_bytes / (1024 * 1024)

def optimize_image(input_path, output_path, quality=82):
    """
    Optimize image and save as WebP
    
    Args:
        input_path: Path to input image
        output_path: Path to output WebP file
        quality: WebP quality (1-100, default 82)
    """
    try:
        # Open and convert image
        img = Image.open(input_path)
        
        # Convert RGBA to RGB if necessary
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Save as WebP with optimization
        img.save(output_path, 'WEBP', quality=quality, method=6)
        return True
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("🖼️  Starting image optimization...")
    print("=" * 50)
    
    # Check if PIL is installed
    try:
        from PIL import Image
    except ImportError:
        print("❌ Pillow not installed. Installing...")
        os.system("pip install Pillow")
        from PIL import Image
    
    # Create backup directory
    backup_dir = f"public/images_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    os.makedirs(backup_dir, exist_ok=True)
    print(f"📁 Backup directory created: {backup_dir}")
    
    # Statistics
    stats = {
        'converted': 0,
        'optimized': 0,
        'total_saved_mb': 0,
        'errors': 0
    }
    
    # Process PNG and JPG files
    print("\n🔄 Converting PNG/JPG files to WebP...")
    for ext in ['*.png', '*.PNG', '*.jpg', '*.JPG', '*.jpeg', '*.JPEG']:
        for filepath in Path('public').rglob(ext):
            # Skip backup directories
            if 'images_backup' in str(filepath):
                continue
            try:
                original_size = get_size_mb(filepath)
                webp_path = filepath.with_suffix('.webp')
                
                # Skip if WebP exists and is newer
                if webp_path.exists() and webp_path.stat().st_mtime > filepath.stat().st_mtime:
                    print(f"⏭️  Skipping {filepath.name} (WebP already exists)")
                    continue
                
                # Backup original
                backup_path = Path(backup_dir) / filepath.relative_to('public')
                backup_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(filepath, backup_path)
                
                # Convert to WebP
                print(f"🔧 Converting: {filepath}")
                if optimize_image(str(filepath), str(webp_path), quality=82):
                    new_size = get_size_mb(webp_path)
                    saved = original_size - new_size
                    stats['total_saved_mb'] += saved
                    stats['converted'] += 1
                    print(f"   ✅ Saved {saved:.2f}MB ({original_size:.2f}MB → {new_size:.2f}MB)")
                else:
                    stats['errors'] += 1
                    
            except Exception as e:
                print(f"❌ Error processing {filepath}: {e}")
                stats['errors'] += 1
    
    # Optimize existing large WebP files
    print("\n🔄 Optimizing existing large WebP files (>500KB)...")
    for webp_file in Path('public').rglob('*.webp'):
        # Skip backup directories
        if 'images_backup' in str(webp_file):
            continue
        try:
            size_mb = get_size_mb(webp_file)
            
            # Only optimize if larger than 0.5MB
            if size_mb < 0.5:
                continue
                
            original_size = get_size_mb(webp_file)
            
            # Backup original
            backup_path = Path(backup_dir) / webp_file.relative_to('public')
            backup_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(webp_file, backup_path)
            
            # Create temporary file
            temp_file = webp_file.with_suffix('.tmp.webp')
            
            print(f"🔧 Optimizing: {webp_file} ({original_size:.2f}MB)")
            
            if optimize_image(str(webp_file), str(temp_file), quality=82):
                new_size = get_size_mb(temp_file)
                
                # Only replace if smaller
                if new_size < original_size:
                    temp_file.replace(webp_file)
                    saved = original_size - new_size
                    stats['total_saved_mb'] += saved
                    stats['optimized'] += 1
                    print(f"   ✅ Saved {saved:.2f}MB ({original_size:.2f}MB → {new_size:.2f}MB)")
                else:
                    temp_file.unlink()
                    print(f"   ℹ️  New file not smaller, keeping original")
            else:
                if temp_file.exists():
                    temp_file.unlink()
                stats['errors'] += 1
                
        except Exception as e:
            print(f"❌ Error processing {webp_file}: {e}")
            stats['errors'] += 1
    
    # Summary
    print("\n" + "=" * 50)
    print("✨ Optimization Complete!")
    print("=" * 50)
    print(f"📊 Files converted to WebP: {stats['converted']}")
    print(f"📊 WebP files optimized: {stats['optimized']}")
    print(f"💾 Total space saved: {stats['total_saved_mb']:.2f}MB")
    print(f"❌ Errors: {stats['errors']}")
    print(f"📁 Backups stored in: {backup_dir}")
    print("\nNext steps:")
    print("1. Test your website to ensure images display correctly")
    print("2. If everything works, you can delete the backup directory")
    print("3. Consider deleting original PNG/JPG files to save more space")

if __name__ == '__main__':
    main()
