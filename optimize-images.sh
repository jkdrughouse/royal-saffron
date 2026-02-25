#!/bin/bash

# Image Optimization Script for JKC E-commerce
# Converts JPG/PNG to WebP at 82% quality and optimizes existing WebP files

echo "🖼️  Starting image optimization..."
echo "=================================="

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."
    sudo apt-get update && sudo apt-get install -y imagemagick
fi

# Check if webp tools are installed
if ! command -v cwebp &> /dev/null; then
    echo "❌ WebP tools not found. Installing..."
    sudo apt-get install -y webp
fi

# Create backup directory
BACKUP_DIR="public/images_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📁 Backup directory created: $BACKUP_DIR"

# Counter variables
total_files=0
converted_files=0
optimized_files=0
total_saved=0

# Function to get file size in bytes
get_size() {
    stat -f%z "$1" 2>/dev/null || stat -c%s "$1" 2>/dev/null
}

# Function to format bytes to human readable
format_size() {
    numfmt --to=iec-i --suffix=B "$1" 2>/dev/null || echo "$1 bytes"
}

# Process PNG and JPG files - convert to WebP
echo ""
echo "🔄 Converting PNG/JPG files to WebP..."
find public -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r file; do
    total_files=$((total_files + 1))
    
    # Get original size
    original_size=$(get_size "$file")
    
    # Create WebP filename
    webp_file="${file%.*}.webp"
    
    # Skip if WebP already exists and is newer
    if [ -f "$webp_file" ] && [ "$webp_file" -nt "$file" ]; then
        echo "⏭️  Skipping $file (WebP already exists and is newer)"
        continue
    fi
    
    # Backup original
    backup_path="$BACKUP_DIR/${file#public/}"
    mkdir -p "$(dirname "$backup_path")"
    cp "$file" "$backup_path"
    
    # Convert to WebP with 82% quality
    echo "🔧 Converting: $file"
    cwebp -q 82 -m 6 "$file" -o "$webp_file" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        new_size=$(get_size "$webp_file")
        saved=$((original_size - new_size))
        total_saved=$((total_saved + saved))
        
        echo "   ✅ Saved $(format_size $saved) ($(format_size $original_size) → $(format_size $new_size))"
        converted_files=$((converted_files + 1))
        
        # Remove original PNG/JPG (optional - comment out if you want to keep originals)
        # rm "$file"
    else
        echo "   ❌ Failed to convert $file"
    fi
done

# Optimize existing WebP files that are large
echo ""
echo "🔄 Optimizing existing large WebP files..."
find public -type f -name "*.webp" -size +500k | while read -r file; do
    original_size=$(get_size "$file")
    
    # Backup original
    backup_path="$BACKUP_DIR/${file#public/}"
    mkdir -p "$(dirname "$backup_path")"
    cp "$file" "$backup_path"
    
    # Create temporary file
    temp_file="${file}.tmp.webp"
    
    echo "🔧 Optimizing: $file ($(format_size $original_size))"
    
    # Re-encode with optimal settings
    cwebp -q 82 -m 6 "$file" -o "$temp_file" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        new_size=$(get_size "$temp_file")
        
        # Only replace if new file is smaller
        if [ $new_size -lt $original_size ]; then
            mv "$temp_file" "$file"
            saved=$((original_size - new_size))
            total_saved=$((total_saved + saved))
            
            echo "   ✅ Saved $(format_size $saved) ($(format_size $original_size) → $(format_size $new_size))"
            optimized_files=$((optimized_files + 1))
        else
            rm "$temp_file"
            echo "   ℹ️  New file not smaller, keeping original"
        fi
    else
        echo "   ❌ Failed to optimize $file"
        rm -f "$temp_file"
    fi
done

# Summary
echo ""
echo "=================================="
echo "✨ Optimization Complete!"
echo "=================================="
echo "📊 Files converted to WebP: $converted_files"
echo "📊 WebP files optimized: $optimized_files"
echo "💾 Total space saved: $(format_size $total_saved)"
echo "📁 Backups stored in: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Test your website to ensure images display correctly"
echo "2. Update image references in your code if needed"
echo "3. If everything works, you can delete the backup directory"
echo "4. Consider deleting original PNG/JPG files to save more space"
