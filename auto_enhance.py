#!/usr/bin/env python3
"""
Automated script to add premium content to all remaining products
"""

import re

# Define premium content for each remaining product
ENHANCEMENTS = {
    'shilajit': '''painPointHeadline: "Feeling Drained? Reclaim Your Prime Energy",
        sensoryDescription: "Scoop out a pea-sized amount of this dark, tar-like resin and feel its sticky, mineral-rich texture. Dissolve it in warm water and watch it transform into an ancient elixir—earthy, slightly bitter, reminding you this is raw nature.",
        benefits: [
            { icon: "⚡", title: "Combat Fatigue", description: "Boosts energy naturally" },
            { icon: "💪", title: "Peak Performance", description: "Muscle recovery" },
            { icon: "🧠", title: "Mental Clarity", description: "Improves focus" },
            { icon: "🧪", title: "84 Minerals", description: "Rich in fulvic acid" },
        ],
        images: [
            { type: 'hero', url: '/products/shilajit.png', alt: 'Shilajit resin' },
            { type: 'lifestyle', url: '/products/shilajit-lifestyle.png', alt: 'In water' },
            { type: 'macro', url: '/products/shilajit-macro.png', alt: 'Texture' },
        ],
        stockLevel: 'low-stock',
        stockCount: 8,
        trustBadges: ['lab-tested', 'sun-dried'],
        frequentlyBoughtWith: ['kashmiri-saffron', 'acacia-honey'],
        averageRating: 4.8,
        reviewCount: 89,''',
    
    'walnut-oil': '''painPointHeadline: "Brain Food? Try Omega-3 Rich Oil",
        sensoryDescription: "Pour this golden oil with delicate nutty aroma. Cold-pressed from Kashmiri walnuts, it retains nutrients. Drizzle over salads—silky, mild, slightly sweet with earthy undertones.",
        benefits: [
            { icon: "🧠", title: "Brain Health", description: "High omega-3" },
            { icon: "❤️", title: "Heart Support", description: "Cardiovascular wellness" },
            { icon: "🌰", title: "Cold-Pressed", description: "Nutrients preserved" },
            { icon: "✨", title: "Multi-Use", description: "Cook, skin, hair" },
        ],
        images: [
            { type: 'hero', url: '/products/walnut-oil.png', alt: 'Walnut oil' },
        ],
        stockLevel: 'in-stock',
        stockCount: 15,
        trustBadges: ['cold-pressed', 'organic'],
        frequentlyBoughtWith: ['kashmiri-mamra-badam'],
        averageRating: 4.6,
        reviewCount: 42,''',
    
    'rose-water': '''painPointHeadline: "Dull Skin? Refresh with Kashmiri Roses",
        sensoryDescription: "Spritz and smell a garden of roses—pure, delicate. Ultra-fine mist, cooling on contact. Your skin drinks it in, instantly hydrated. Nature's facial in a bottle.",
        benefits: [
            { icon: "🌹", title: "Pure Extract", description: "100% natural" },
            { icon: "💧", title: "Hydrates", description: "Balances pH" },
            { icon: "✨", title: "Multi-Use", description: "Toner, spray" },
            { icon: "❄️", title: "Cooling", description: "Calms skin" },
        ],
        images: [
            { type: 'hero', url: '/products/rose-water.png', alt: 'Rose water' },
        ],
        stockLevel: 'in-stock',
        stockCount: 72,
        trustBadges: ['100-pure'],
        frequentlyBoughtWith: ['beetroot-lip-butter'],
        averageRating: 4.7,
        reviewCount: 103,''',
    
    'golden-oud': '''painPointHeadline: "Stand Out with Luxury Oud",
        sensoryDescription: "One drop envelops you in woody, sweet aroma. Lingers for hours, evolving. Scent of royalty, mysterious and captivating. Apply to pulse points and let it develop.",
        benefits: [
            { icon: "👑", title: "Long-Lasting", description: "8+ hours" },
            { icon: "🌟", title: "Premium", description: "Rare quality" },
            { icon: "🎭", title: "Natural", description: "No synthetics" },
            { icon: "✨", title: "Unisex", description: "For all" },
        ],
        images: [
            { type: 'hero', url: '/products/golden-oud.png', alt: 'Golden Oud' },
        ],
        stockLevel: 'low-stock',
        stockCount: 6,
        trustBadges: ['premium-grade'],
        frequentlyBoughtWith: ['rose-water'],
        averageRating: 4.9,
        reviewCount: 24,''',
    
    'white-oud': '''painPointHeadline: "Subtle Elegance? Try White Oud",
        sensoryDescription: "Delicate and refined. Soft woody notes with gentle sweetness. Elegant without overpowering, perfect for daily wear or meditation. Calming, peaceful atmosphere.",
        benefits: [
            { icon: "🤍", title: "Soft", description: "Refined fragrance" },
            { icon: "🌿", title: "Light", description: "Gentle sweetness" },
            { icon: "🕯️", title: "Meditation", description: "Peaceful" },
            { icon: "✨", title: "Daily", description: "Subtle" },
        ],
        images: [
            { type: 'hero', url: '/products/white-oud.png', alt: 'White Oud' },
        ],
        stockLevel: 'in-stock',
        stockCount: 12,
        trustBadges: ['premium-quality'],
        frequentlyBoughtWith: ['golden-oud'],
        averageRating: 4.7,
        reviewCount: 19,''',
    
    'acacia-honey': '''painPointHeadline: "Why Sugar? Have Liquid Gold",
        sensoryDescription: "Crystal-clear, silky texture like molten amber. Acacia is delicate—floral sweetness that enhances not overpowers. Stays smooth and pourable for months.",
        benefits: [
            { icon: "🍯", title: "Slow Crystallize", description: "Stays smooth" },
            { icon: "🌼", title: "Mild Floral", description: "Perfect for tea" },
            { icon: "🌿", title: "Pure", description: "No additives" },
            { icon: "💚", title: "Gentle", description: "Low glycemic" },
        ],
        images: [
            { type: 'hero', url: '/products/acacia-honey.png', alt: 'Acacia Honey' },
        ],
        stockLevel: 'in-stock',
        stockCount: 23,
        trustBadges: ['100-pure'],
        frequentlyBoughtWith: ['kashmiri-saffron'],
        averageRating: 4.7,
        reviewCount: 64,''',
}

# Simple enhancements for remaining products
SIMPLE_ENHANCEMENTS = {
    'safroon-honey': '''painPointHeadline: "Immunity Boost with Saffron Honey",
        benefits: [{ icon: "🌸", title: "Saffron-Infused", description: "Rare blend" }],
        images: [{ type: 'hero', url: '/products/safroon-honey.png', alt: 'Saffron Honey' }],
        stockLevel: 'in-stock', stockCount: 19, trustBadges: ['saffron-infused'],
        frequentlyBoughtWith: ['kashmiri-saffron'], averageRating: 4.8, reviewCount: 51,''',
    
    'shahi-heeing': '''painPointHeadline: "Premium Asafoetida for Digestion",
        benefits: [{ icon: "🌿", title: "Pure", description: "High potency" }],
        images: [{ type: 'hero', url: '/products/shahi-heeing.png', alt: 'Heeing' }],
        stockLevel: 'in-stock', stockCount: 30, trustBadges: ['premium-grade'],
        averageRating: 4.6, reviewCount: 25,''',
}

def add_premium_content(file_path):
    """Add premium content to all products"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content
    added_count = 0
    
    # Add detailed enhancements
    for product_id, enhancement in ENHANCEMENTS.items():
        # Find the product and add content before closing brace
        pattern = rf"(id: '{product_id}',.*?weightMl: '[^']+',)\s*\}},"
        
        def replacer(match):
            return match.group(1) + '\n        ' + enhancement + '\n    },'
        
        new_content = re.sub(pattern, replacer, modified, flags=re.DOTALL)
        if new_content != modified:
            added_count += 1
            print(f"✓ Enhanced: {product_id}")
            modified = new_content
    
    # Add simple enhancements
    for product_id, enhancement in SIMPLE_ENHANCEMENTS.items():
        pattern = rf"(id: '{product_id}',.*?weightMl: '[^']+',)\s*\}},"
        
        def replacer(match):
            return match.group(1) + '\n        ' + enhancement + '\n    },'
        
        new_content = re.sub(pattern, replacer, modified, flags=re.DOTALL)
        if new_content != modified:
            added_count += 1
            print(f"✓ Enhanced: {product_id}")
            modified = new_content
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(modified)
    
    print(f"\n✅ Total products enhanced: {added_count}")
    return added_count

if __name__ == '__main__':
    try:
        count = add_premium_content('src/app/lib/products.ts')
        print(f"✅ SUCCESS! Added premium content to {count} products")
    except Exception as e:
        print(f"❌ Error: {e}")
