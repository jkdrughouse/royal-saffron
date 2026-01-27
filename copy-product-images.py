#!/usr/bin/env python3
"""
Image Transfer Script for JKC Product Images
Copies and renames product images from source to website public folder
"""

import os
import shutil
from pathlib import Path

# Paths
SOURCE_DIR = Path("/home/leo/Pictures/JKC product images")
TARGET_DIR = Path("/home/leo/Desktop/JKC cursor/public/products")

# Image mapping: source -> target filename
IMAGE_MAPPING = {
    # Existing Products - Main Images
    "acacia honey.png": "acacia-honey.png",
    "safroon-honey1.jpg": "saffron-honey.png",
    "golden oud.png": "golden-oud.png",
    "white oud.png": "white-oud.png",
    "shahi-kehwa1.png": "shahi-kehwa.png",
    "shahi-heeing1.png": "shahi-heeing.png",
    "walnut1.png": "walnut-with-shells.png",
    "Rose water.png": "rose-water.png",
    "Pecan Nuts.png": "pecan-nuts.png",  # New product
    
    # Multi-image variants
    "golden oud-2.png": "golden-oud-lifestyle.png",
    "white oud-2.png": "white-oud-lifestyle.png",
    "Rose water-2.png": "rose-water-lifestyle.png",
    "walnut.png": "walnut-with-shells-lifestyle.png",
    "walnut3.png": "walnut-with-shells-macro.png",
    
    # Saffron variants
    "safroon2.png": "kashmiri-saffron-lifestyle.png",
    "safroon3.png": "kashmiri-saffron-macro.png",
    
    # New Products
    "kashmiri oud.png": "kashmiri-oud.png",
    "kashmiri oud-2.png": "kashmiri-oud-lifestyle.png",
    "herbal kehwa-3.png": "herbal-kehwa.png",
    "herbal kehwa-4.png": "herbal-kehwa-lifestyle.png",
    
    # Subdirectory images - Gulkand
    "Gulkand/PXL_20260112_073932620.jpg": "gulkhand.png",
    "Gulkand/PXL_20260112_073944783.jpg": "gulkhand-lifestyle.png",
    
    # Subdirectory images - Shilajit (6 images)
    "Shilajit/PXL_20260112_074019809.png": "shilajit.png",
    "Shilajit/PXL_20260112_074102750.png": "shilajit-lifestyle-1.png",
    "Shilajit/PXL_20260112_074120866.png": "shilajit-lifestyle-2.png",
    "Shilajit/PXL_20260112_074130334.MP.png": "shilajit-lifestyle-3.png",
    "Shilajit/PXL_20260112_074140259.png": "shilajit-macro.png",
    "Shilajit/banner.png": "shilajit-banner.png",
    
    # Lip butter (2 separate products)
    "lip butter/PXL_20260112_072825882.png": "beetroot-lip-butter.png",
    "lip butter/PXL_20260112_072835975.png": "saffron-lip-butter.png",
}

def copy_images():
    """Copy images from source to target directory"""
    
    print("🚀 Starting image transfer...")
    print(f"📁 Source: {SOURCE_DIR}")
    print(f"📁 Target: {TARGET_DIR}")
    print()
    
    # Create backup directory
    backup_dir = TARGET_DIR.parent / "products_backup"
    if TARGET_DIR.exists() and not backup_dir.exists():
        print(f"💾 Creating backup at {backup_dir}")
        shutil.copytree(TARGET_DIR, backup_dir)
        print("✅ Backup created")
        print()
    
    # Ensure target directory exists
    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    
    copied = 0
    skipped = 0
    errors = []
    
    for source_file, target_filename in IMAGE_MAPPING.items():
        source_path = SOURCE_DIR / source_file
        target_path = TARGET_DIR / target_filename
        
        if not source_path.exists():
            errors.append(f"❌ Source not found: {source_file}")
            continue
        
        try:
            shutil.copy2(source_path, target_path)
            size_mb = source_path.stat().st_size / (1024 * 1024)
            print(f"✅ Copied: {source_file} → {target_filename} ({size_mb:.2f} MB)")
            copied += 1
        except Exception as e:
            errors.append(f"❌ Error copying {source_file}: {e}")
            skipped += 1
    
    print()
    print("=" * 60)
    print(f"📊 Summary:")
    print(f"   ✅ Successfully copied: {copied} images")
    print(f"   ⚠️  Skipped/Failed: {skipped} images")
    print()
    
    if errors:
        print("⚠️  Errors encountered:")
        for error in errors:
            print(f"   {error}")
        print()
    
    print(f"🎉 Image transfer complete!")
    print(f"📁 Images copied to: {TARGET_DIR}")

if __name__ == "__main__":
    copy_images()
