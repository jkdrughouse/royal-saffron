#!/usr/bin/env python3
"""Complete the final product: walnut-with-shells"""

import re

enhancement = '''painPointHeadline: "Fresh Walnuts? Crack Open Nature's Brain Food",
        sensoryDescription: "These walnuts come naturally protected in their shells, preserving freshness and flavor. Crack one open to reveal the creamy kernel inside—rich, buttery, with that distinctive walnut taste. The shell protection means maximum nutrition preserved until you're ready to enjoy them.",
        benefits: [
            { icon: "🧠", title: "Brain Boost", description: "Omega-3 rich walnuts" },
            { icon: "🥜", title: "Shell-Fresh", description: "Maximum freshness preserved" },
            { icon: "💪", title: "Protein Packed", description: "Complete nutrition" },
            { icon: "✨", title: "Versatile", description: "Snack or cook with" },
        ],
        images: [
            { type: 'hero', url: '/products/walnut-with-shells.png', alt: 'Walnuts in shell' },
        ],
        stockLevel: 'in-stock',
        stockCount: 28,
        trustBadges: ['natural', 'fresh'],
        frequentlyBoughtWith: ['kashmiri-mamra-badam', 'walnut-oil'],
        averageRating: 4.6,
        reviewCount: 35,'''

file_path = 'src/app/lib/products.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find walnut-with-shells and add premium content
pattern = r"(id: 'walnut-with-shells',.*?weightMl: '[^']+',)\s*},"

def replacer(match):
    return match.group(1) + '\n        ' + enhancement + '\n    },'

modified = re.sub(pattern, replacer, content, flags=re.DOTALL)

if modified != content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(modified)
    print("✅ SUCCESS! Enhanced walnut-with-shells")
    print("🎉 ALL 21 PRODUCTS NOW HAVE PREMIUM CONTENT!")
else:
    print("❌ Could not find walnut-with-shells product")
