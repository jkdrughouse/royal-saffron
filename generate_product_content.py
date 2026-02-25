"""
Product Content Generator
Generates premium content for incomplete products based on research
"""

# Product content templates based on research

PRODUCT_CONTENT = {
    "bringraj-hair-oil": {
        "painPointHeadline": "Struggling with Hair Fall & Thin Hair? Try Ayurvedic Bringraj Oil",
        "sensoryDescription": "Massage a few drops of this rich, amber-colored oil into your scalp and feel the traditional Ayurvedic formula at work. The oil has a distinctively herbal aroma from pure Bringraj extracts blended with natural carrier oils. Unlike chemical treatments, this feels nourishing, not harsh—your fingertips glide smoothly as the oil penetrates deep into hair follicles. Within minutes, your scalp feels soothed and relaxed, the cooling sensation calming any irritation. Used regularly as a pre-shampoo treatment, you'll notice your hair becomes softer, stronger, and more lustrous. The traditional 'King of Herbs' for hair, Bringraj has been trusted for centuries in Ayurveda. Apply it overnight for deep conditioning, or massage for 30 minutes before washing. Your hair will thank you with reduced fall, improved texture, and a natural healthy shine.",
        "benefits": [
            { "icon": "🌿", "title": "Reduces Hair Fall", "description": "Strengthens roots, promotes growth" },
            { "icon": "✨", "title": "Prevents Graying", "description": "Natural darkening properties" },
            { "icon": "💆", "title": "Soothes Scalp", "description": "Anti-inflammatory, fights dandruff" },
            { "icon": "💪", "title": "Ayurvedic Formula", "description": "Traditional 'King of Herbs'" },
        ]
    },
    "noormark-walnut-scrub": {
        "painPointHeadline": "Dull, Tired Skin? Get Natural Glow with Walnut Exfoliation",
        "sensoryDescription": "Squeeze a

 small amount onto damp skin and feel the finely ground walnut shells provide gentle yet effective exfoliation. The cream base feels smooth and moisturizing, not harsh or stripping. As you massage in circular motions, the natural walnut granules work to slough off dead skin cells and unclog pores without irritating sensitive areas. The herbal extracts release a mild, fresh aroma that makes the experience spa-like. Rinse with warm water and immediately notice how your skin feels smoother, softer, and refreshed. Unlike chemical peels, this traditional formula respects your skin's natural balance while revealing brighter, more radiant complexion. Use 2-3 times weekly for best results—your skin will glow with renewed vitality.",
        "sensoryDescription": "Squeeze a small amount onto damp skin and feel the finely ground walnut shells provide gentle yet effective exfoliation. The cream base feels smooth and moisturizing, not harsh or stripping. As you massage in circular motions, the natural walnut granules work to slough off dead skin cells and unclog pores without irritating sensitive areas. The herbal extracts release a mild, fresh aroma that makes the experience spa-like. Rinse with warm water and immediately notice how your skin feels smoother, softer, and refreshed. Unlike chemical peels, this traditional formula respects your skin's natural balance while revealing brighter, more radiant complexion. Use 2-3 times weekly for best results—your skin will glow with renewed vitality.",
        "benefits": [
            { "icon": "✨", "title": "Natural Exfoliation", "description": "Walnut shells gently remove dead skin" },
            { "icon": "🌿", "title": "Herbal Formula", "description": "Enriched with natural extracts" },
            { "icon": "💎", "title": "Unclogs Pores", "description": "Deep cleans for clearer skin" },
            { "icon": "😊", "title": "Radiant Glow", "description": "Reveals smoother, brighter complexion" },
        ]
    },
    # Add more products...
}

# Print formatted TypeScript code
for product_id, content in PRODUCT_CONTENT.items():
    print(f"\n// {product_id}")
    print(f'painPointHeadline: "{content["painPointHeadline"]}",')
    print(f'sensoryDescription: "{content["sensoryDescription"]}",')
    print("benefits: [")
    for benefit in content["benefits"]:
        print(f'    {{ icon: "{benefit["icon"]}", title: "{benefit["title"]}", description: "{benefit["description"]}" }},')
    print("],")
