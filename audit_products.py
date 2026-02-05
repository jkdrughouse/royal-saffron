#!/usr/bin/env python3
"""
Product Audit Script
Analyzes products.ts to find incomplete products and broken image references
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Set

def extract_products_from_ts(file_path: str) -> List[Dict]:
    """Extract product objects from TypeScript file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the products array
    products_match = re.search(r'export const products: Product\[\] = \[(.*)\];', content, re.DOTALL)
    if not products_match:
        return []
    
    products_str = products_match.group(1)
    
    # Split into individual product objects
    product_pattern = r'\{[^}]*?id:\s*[\'"]([^\'"]+)[\'"][^}]*?\}'
    
    products = []
    # More robust extraction
    depth = 0
    current_product = ""
    for char in products_str:
        if char == '{':
            depth += 1
        elif char == '}':
            depth -= 1
        current_product += char
        
        if depth == 0 and current_product.strip() and current_product.strip() != ',':
            # Extract key fields
            id_match = re.search(r'id:\s*[\'"]([^\'"]+)[\'"]', current_product)
            name_match = re.search(r'name:\s*[\'"]([^\'"]+)[\'"]', current_product)
            desc_match = re.search(r'description:\s*[\'"]([^\'"]+)[\'"]', current_product)
            detailed_match = re.search(r'detailedDescription:?\s*[\'"]([^\'"]+)', current_product)
            pain_match = re.search(r'painPointHeadline:?\s*[\'"]([^\'"]+)', current_product)
            sensory_match = re.search(r'sensoryDescription:?\s*[\'"]([^\'"]+)', current_product)
            benefits_match = re.search(r'benefits:\s*\[', current_product)
            images_match = re.findall(r'url:\s*[\'"]([^\'"]+)[\'"]', current_product)
            
            if id_match:
                products.append({
                    'id': id_match.group(1),
                    'name': name_match.group(1) if name_match else 'Unknown',
                    'description': desc_match.group(1) if desc_match else '',
                    'has_detailed': bool(detailed_match and len(detailed_match.group(1)) > 100),
                    'has_pain_point': bool(pain_match),
                    'has_sensory': bool(sensory_match and len(sensory_match.group(1)) > 100),
                    'has_benefits': bool(benefits_match),
                    'images': images_match,
                    'raw': current_product
                })
            current_product = ""
    
    return products

def check_image_exists(image_path: str, public_dir: str) -> bool:
    """Check if image file exists"""
    # Remove leading slash
    rel_path = image_path.lstrip('/')
    full_path = Path(public_dir) / rel_path
    return full_path.exists()

def audit_products(products_file: str, public_dir: str):
    """Audit all products for completeness and broken images"""
    products = extract_products_from_ts(products_file)
    
    print("=" * 80)
    print("PRODUCT AUDIT REPORT")
    print("=" * 80)
    print(f"\nTotal Products: {len(products)}\n")
    
    # Track issues
    incomplete_products = []
    missing_images = {}
    complete_products = []
    
    for product in products:
        issues = []
        
        # Check content completeness
        if not product['has_detailed']:
            issues.append("Missing detailed description")
        if not product['has_pain_point']:
            issues.append("Missing pain point headline")
        if not product['has_sensory']:
            issues.append("Missing sensory description")
        if not product['has_benefits']:
            issues.append("Missing benefits section")
        
        # Check images
        broken_images = []
        for img_path in product['images']:
            if not check_image_exists(img_path, public_dir):
                broken_images.append(img_path)
        
        if broken_images:
            missing_images[product['id']] = broken_images
            issues.append(f"{len(broken_images)} broken image(s)")
        
        if issues:
            incomplete_products.append({
                'id': product['id'],
                'name': product['name'],
                'issues': issues,
                'broken_images': broken_images
            })
        else:
            complete_products.append(product['name'])
    
    # Report incomplete products
    print("🔴 INCOMPLETE PRODUCTS")
    print("-" * 80)
    for p in sorted(incomplete_products, key=lambda x: len(x['issues']), reverse=True):
        print(f"\n✗ {p['name']} ({p['id']})")
        for issue in p['issues']:
            print(f"  - {issue}")
        if p['broken_images']:
            for img in p['broken_images']:
                print(f"    📷 {img}")
    
    print(f"\n\n✅ COMPLETE PRODUCTS ({len(complete_products)})")
    print("-" * 80)
    for name in complete_products:
        print(f"  ✓ {name}")
    
    # Summary
    print(f"\n\n📊 SUMMARY")
    print("=" * 80)
    print(f"Complete Products: {len(complete_products)}/{len(products)} ({len(complete_products)/len(products)*100:.1f}%)")
    print(f"Need Content Updates: {len([p for p in incomplete_products if any('Missing' in i for i in p['issues'])])}")
    print(f"Have Broken Images: {len(missing_images)}")
    
    # Export detailed report
    with open('product_audit_results.json', 'w') as f:
        json.dump({
            'total': len(products),
            'complete': complete_products,
            'incomplete': incomplete_products,
            'missing_images': missing_images
        }, f, indent=2)
    
    print(f"\nDetailed report saved to: product_audit_results.json")

if __name__ == '__main__':
    audit_products(
        'src/app/lib/products.ts',
        'public'
    )
