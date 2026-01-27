// Enhanced Products with Premium Content - Products 2-10
// This file contains premium content additions for the product catalog

const enhancedProductsData = {
    // Shilajit
    'shilajit': {
        painPointHeadline: "Feeling Drained? Reclaim Your Prime Energy",
        sensoryDescription: "Scoop out a pea-sized amount of this dark, tar-like resin and feel its sticky, mineral-rich texture. Dissolve it in warm water and watch it transform into an ancient elixir—earthy, slightly bitter, reminding you this is raw nature, not a processed supplement. Harvested from rocky cliffs 16,000 feet above sea level, sun-dried using traditional Surya Tapi methods that preserve every bioactive compound. Within weeks of daily use, feel sharper mental clarity, sustained energy that carries you through the day, and faster post-workout recovery. This is nature's ultimate multivitamin in its purest form.",
        benefits: [
            { icon: "⚡", title: "Combat Chronic Fatigue", description: "Boosts mitochondrial energy naturally" },
            { icon: "💪", title: "Peak Performance", description: "Supports muscle recovery and stamina" },
            { icon: "🧠", title: "Mental Clarity", description: "Clears brain fog, improves focus" },
            { icon: "🧪", title: "84 Trace Minerals", description: "Complete nutrition, rich in fulvic acid" },
        ],
        images: [
            { type: 'hero', url: '/products/shilajit.png', alt: 'Pure Himalayan Shilajit resin in jar' },
            { type: 'lifestyle', url: '/products/shilajit-lifestyle.png', alt: 'Shilajit dissolving in warm water' },
            { type: 'macro', url: '/products/shilajit-macro.png', alt: 'Close-up of Shilajit resin texture' },
        ],
        stockLevel: 'low-stock',
        stockCount: 8,
        trustBadges: ['lab-tested', 'sun-dried', 'high-altitude'],
        frequentlyBoughtWith: ['kashmiri-saffron', 'acacia-honey'],
        averageRating: 4.8,
        reviewCount: 89,
    },

    // Acacia Honey
    'acacia-honey': {
        painPointHeadline: "Why Settle for Sugar When You Can Have Liquid Gold?",
        sensoryDescription: "Pour slowly and watch it cascade—crystal-clear, almost translucent, with a silky texture that coats your spoon like molten amber. Unlike darker honeys, Acacia is delicate: a whisper of floral sweetness that enhances rather than overpowers. Drizzle it over warm toast and watch it seep into every crevice. The magic? Acacia honey stays smooth and pourable for months without crystallizing. Each spoonful delivers gentle energy—nature's perfect balance without the spike-and-crash of refined sugar. Taste the difference from bees who feast on a single, pristine flower source.",
        benefits: [
            { icon: "🍯", title: "Slow to Crystallize", description: "Stays smooth and pourable for months" },
            { icon: "🌼", title: "Mild, Floral Taste", description: "Perfect for tea and everyday use" },
            { icon: "🌿", title: "100% Pure & Raw", description: "No additives or heat treatment" },
            { icon: "💚", title: "Gentle on Digestion", description: "Low glycemic index" },
        ],
        images: [
            { type: 'hero', url: '/products/acacia-honey.png', alt: 'Crystal-clear Acacia Honey' },
            { type: 'lifestyle', url: '/products/acacia-honey-lifestyle.png', alt: 'Honey drizzling over toast' },
            { type: 'macro', url: '/products/acacia-honey-macro.png', alt: 'Close-up of clear, silky texture' },
        ],
        stockLevel: 'in-stock',
        stockCount: 23,
        trustBadges: ['100-pure', 'raw-unfiltered', 'organic'],
        frequentlyBoughtWith: ['kashmiri-saffron', 'shahi-kehwa'],
        averageRating: 4.7,
        reviewCount: 64,
    },

    // Shahi Kehwa
    'shahi-kehwa': {
        painPointHeadline: "Tired of Ordinary Tea? Experience Royal Kashmiri Tradition",
        sensoryDescription: "Steep the blend and inhale—saffron threads unfurl in hot water, releasing their golden essence alongside cardamom, cinnamon, and crushed almonds. This isn't just tea; it's a centuries-old Kashmiri ritual reserved for royalty. Each sip delivers warmth that spreads from your chest outward, the spices dancing on your palate while saffron adds a subtle, exotic sweetness. The crushed almonds lend a delicate nuttiness. Traditionally served during cold Kashmiri mornings and festive gatherings, Shahi Kehwa aids digestion, gently energizes without caffeine jitters, and wraps you in comforting warmth.",
        benefits: [
            { icon: "👑", title: "Royal Heritage Blend", description: "Authentic saffron + aromatic spices" },
            { icon: "🍃", title: "Light & Refreshing", description: "Green tea base, gentle on stomach" },
            { icon: "🌸", title: "Saffron-Infused", description: "Premium Kashmiri saffron in every sip" },
            { icon: "☕", title: "Perfect After Meals", description: "Aids digestion, refreshes palate" },
        ],
        images: [
            { type: 'hero', url: '/products/shahi-kehwa.webp', alt: 'Shahi Kehwa tea blend with saffron' },
            { type: 'lifestyle', url: '/products/shahi-kehwa-lifestyle.png', alt: 'Steaming cup of Shahi Kehwa' },
            { type: 'macro', url: '/products/shahi-kehwa-macro.png', alt: 'Close-up of tea blend with saffron threads' },
        ],
        stockLevel: 'in-stock',
        stockCount: 34,
        trustBadges: ['organic', 'traditional-recipe', 'free-shipping'],
        frequentlyBoughtWith: ['kashmiri-saffron', 'acacia-honey'],
        averageRating: 4.7,
        reviewCount: 56,
    },

    // Walnut Oil
    'walnut-oil': {
        painPointHeadline: "Looking for Brain Food? Discover Omega-3 Rich Golden Elixir",
        sensoryDescription: "Pour this light golden oil and notice its delicate, nutty aroma—subtle yet distinctive. Cold-pressed from premium Kashmiri walnuts, it retains every nutrient heat-processing destroys. Drizzle it over salads and watch it coat leaves with a silky sheen. The taste is mild, slightly sweet, with earthy undertones that complement rather than dominate. Just one tablespoon delivers omega-3 fatty acids equivalent to a handful of walnuts. Use it for cooking at medium heat, as a finishing oil, or even apply it to skin and hair for deep nourishment. This is traditional Kashmir",
        benefits: [
            { icon: "🧠", title: "Brain Health", description: "High in omega-3 for cognitive function" },
            { icon: "❤️", title: "Heart Support", description: "Promotes cardiovascular wellness" },
            { icon: "🌰", title: "100% Cold-Pressed", description: "Nutrients preserved, no heat damage" },
            { icon: "✨", title: "Multi-Purpose", description: "Cooking, skincare, hair care" },
        ],
        images: [
            { type: 'hero', url: '/products/walnut-oil.png', alt: 'Golden walnut oil in glass bottle' },
            { type: 'lifestyle', url: '/products/walnut-oil-lifestyle.png', alt: 'Walnut oil drizzled over salad' },
            { type: 'macro', url: '/products/walnut-oil-macro.png', alt: 'Close-up of golden oil texture' },
        ],
        stockLevel: 'in-stock',
        stockCount: 15,
        trustBadges: ['cold-pressed', 'organic', 'no-preservatives'],
        frequentlyBoughtWith: ['kashmiri-mamra-badam', 'acacia-honey'],
        averageRating: 4.6,
        reviewCount: 42,
    },

    // Gulkhand
    'gulkhand': {
        painPointHeadline: "Why Suffer from Heat? Cool Down with Royal Rose Preserve",
        sensoryDescription: "Open the jar and the fragrance of a thousand rose petals greets you—sweet, floral, utterly captivating. Scoop out this ruby-red preserve and notice the soft, jam-like texture studded with visible rose petals. The taste is a perfect harmony of natural sweetness and delicate rose essence. In Ayurveda, Gulkhand is hailed as a natural coolant, perfect for hot summers or after spicy meals. Take a spoonful directly, mix it into milk, or spread it on bread. Feel the cooling sensation and digestive comfort it brings—this is Kashmir's answer to beat the heat naturally.",
        benefits: [
            { icon: "❄️", title: "Natural Body Coolant", description: "Balances body heat, perfect for summer" },
            { icon: "🌹", title: "Handpicked Rose Petals", description: "Premium Kashmiri roses only" },
            { icon: "🌿", title: "Aids Digestion", description: "Supports gut health naturally" },
            { icon: "💖", title: "Skin & Heart Health", description: "Rich in antioxidants" },
        ],
        images: [
            { type: 'hero', url: '/products/gulkhand.webp', alt: 'Gulkhand rose petal preserve in jar' },
            { type: 'lifestyle', url: '/products/gulkhand-lifestyle.png', alt: 'Gulkhand served with milk' },
            { type: 'macro', url: '/products/gulkhand-macro.png', alt: 'Close-up showing rose petals' },
        ],
        stockLevel: 'in-stock',
        stockCount: 28,
        trustBadges: ['traditional-recipe', 'no-preservatives', 'organic'],
        frequentlyBoughtWith: ['acacia-honey', 'shahi-kehwa'],
        averageRating: 4.5,
        reviewCount: 38,
    },
};

// Export for integration
export default enhancedProductsData;
