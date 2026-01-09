export type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    variants?: number[];
};

export const products: Product[] = [
    // Existing products
    {
        id: 'saffron-premium',
        name: 'Premium Kashmiri Saffron',
        price: 500,
        image: '/products/saffron-premium.png',
        category: 'Saffron',
        description: "Our signature Mongra saffron, hand-picked from the highlands of Pampore. Known for its deep crimson stigmas and potent aroma.",
        variants: [1, 3, 5]
    },
    {
        id: 'saffron-bulk',
        name: 'Royal Saffron (Bulk)',
        price: 9000,
        image: '/products/saffron-bulk.jpg',
        category: 'Saffron',
        description: "The same premium quality saffron, available in larger quantities for chefs and connoisseurs. Packaged in a traditional tin.",
        variants: [20]
    },
    {
        id: 'shilajit-original',
        name: 'Pure Himalayan Shilajit',
        price: 800,
        image: '/products/shilajit.png',
        category: 'Kashmiri Special',
        description: "Sourced from the highest altitudes of the Himalayas, purified using traditional Ayurvedic methods. Rich in fulvic acid.",
        variants: [15, 30]
    },
    {
        id: 'almonds',
        name: 'Mamra Almonds',
        price: 400,
        image: '/products/almonds.jpg',
        category: 'Nuts',
        description: "Kashmiri Mamra Almonds are famous for their high oil content and superior taste. Concave in shape and packed with nutrition.",
        variants: [250, 500]
    },
    {
        id: 'dry-mix',
        name: 'Premium Dry Fruit Mix',
        price: 300,
        image: '/products/dry-mix.jpg',
        category: 'Nuts',
        description: "A royal blend of cashews, almonds, raisins, walnuts, and dried apricots. A healthy, energy-boosting snack.",
        variants: [250, 500]
    },
    {
        id: 'saffron-honey',
        name: 'Kashmiri Saffron Honey',
        price: 600,
        image: '/products/saffron-honey.png',
        category: 'Honey',
        description: "Raw, unprocessed acacia honey infused with our premium Mongra saffron strands. A golden elixir.",
        variants: [250, 500]
    },
    {
        id: 'shahi-qawah',
        name: 'Shahi Qawah (Herbal Tea)',
        price: 250,
        image: '/products/shahi-qawah.jpg',
        category: 'Tea',
        description: "The traditional tea of Kashmir. A fragrant blend of green tea leaves, whole spices, and rose petals.",
        variants: [100, 200]
    },
    {
        id: 'shahi-heing',
        name: 'Shahi Heing (Crystal)',
        price: 150,
        image: '/products/shahi-heing.jpg',
        category: 'Spice',
        description: "Potent, aromatic crystal Asafoetida straight from the spice routes. Transforms any dish with rich, savory flavor.",
        variants: [10, 20]
    },
    // New products from Jehlum Kaiser Company
    {
        id: 'choco-almond-rocks',
        name: 'Choco Almond Rocks',
        price: 800,
        image: '/products/choco-almond-rocks.png',
        category: 'Nuts',
        description: "Premium quality Choco Almond Rocks from Jehlum Kesar Co.",
    },
    {
        id: 'dried-kiwi',
        name: 'Dried Kiwi',
        price: 500,
        image: '/products/dried-kiwi.png',
        category: 'Nuts',
        description: "Premium quality Dried Kiwi from Jehlum Kesar Co.",
    },
    {
        id: 'cherry',
        name: 'Cherry',
        price: 600,
        image: '/products/cherry.png',
        category: 'Nuts',
        description: "Premium quality Cherry from Jehlum Kesar Co.",
    },
    {
        id: 'macadamia-nuts-in-shell',
        name: 'Macadamia Nuts In Shell',
        price: 1500,
        image: '/products/macadamia-nuts-in-shell.png',
        category: 'Nuts',
        description: "Premium quality Macadamia Nuts In Shell from Jehlum Kesar Co.",
    },
    {
        id: 'beetroot-lip-butter',
        name: 'Beetroot Lip Butter',
        price: 350,
        image: '/products/beetroot-lip-butter.png',
        category: 'Beauty',
        description: "Premium quality Beetroot Lip Butter from Jehlum Kesar Co.",
    },
    {
        id: 'rosemary-essential-oil',
        name: 'Rosemary Essential Oil',
        price: 599,
        image: '/products/rosemary-essential-oil.png',
        category: 'Beauty',
        description: "Premium quality Rosemary Essential Oil from Jehlum Kesar Co.",
    },
    {
        id: 'saffron-lip-butter',
        name: 'Saffron Lip Butter',
        price: 350,
        image: '/products/saffron-lip-butter.png',
        category: 'Beauty',
        description: "Premium quality Saffron Lip Butter from Jehlum Kesar Co.",
    },
    {
        id: 'white-oud',
        name: 'White Oud',
        price: 1649,
        image: '/products/white-oud.png',
        category: 'Fragrance',
        description: "Premium quality White Oud from Jehlum Kesar Co.",
    },
    {
        id: 'golden-oud',
        name: 'Golden Oud',
        price: 199,
        image: '/products/golden-oud.png',
        category: 'Fragrance',
        description: "Premium quality Golden Oud from Jehlum Kesar Co.",
    },
    {
        id: 'acacia-honey',
        name: 'Acacia Honey',
        price: 800,
        image: '/products/acacia-honey.png',
        category: 'Honey',
        description: "Premium quality Acacia Honey from Jehlum Kesar Co.",
    },
    {
        id: 'gulkhand',
        name: 'Gulkhand',
        price: 400,
        image: '/products/gulkhand.webp',
        category: 'Kashmiri Special',
        description: "Premium quality Gulkhand from Jehlum Kesar Co.",
    },
    {
        id: 'kashmiri-mamra-badam',
        name: 'Kashmiri Mamra Badam',
        price: 1000,
        image: '/products/kashmiri-mamra-badam.png',
        category: 'Nuts',
        description: "Premium quality Kashmiri Mamra Badam from Jehlum Kesar Co.",
        variants: [10, 20],
    },
    {
        id: 'kashmiri-saffron',
        name: 'Kashmiri Saffron',
        price: 350,
        image: '/products/kashmiri-saffron.png',
        category: 'Saffron',
        description: "Premium quality Kashmiri Saffron from Jehlum Kesar Co.",
        variants: [1, 3, 5, 10, 20, 50],
    },
    {
        id: 'mix-dry-fruits',
        name: 'Mix Dry Fruits',
        price: 700,
        image: '/products/mix-dry-fruits.png',
        category: 'Nuts',
        description: "Premium quality Mix Dry Fruits from Jehlum Kesar Co.",
    },
    {
        id: 'rose-water',
        name: 'Rose Water',
        price: 350,
        image: '/products/rose-water.webp',
        category: 'Beauty',
        description: "Premium quality Rose Water from Jehlum Kesar Co.",
    },
    {
        id: 'safroon-honey',
        name: 'Safroon Honey',
        price: 800,
        image: '/products/safroon-honey.png',
        category: 'Honey',
        description: "Premium quality Safroon Honey from Jehlum Kesar Co.",
    },
    {
        id: 'shahi-heeing',
        name: 'Shahi Heeing',
        price: 599,
        image: '/products/shahi-heeing.png',
        category: 'Kashmiri Special',
        description: "Premium quality Shahi Heeing from Jehlum Kesar Co.",
    },
    {
        id: 'shahi-kehwa',
        name: 'Shahi Kehwa',
        price: 1000,
        image: '/products/shahi-kehwa.webp',
        category: 'Tea',
        description: "Premium quality Shahi Kehwa from Jehlum Kesar Co.",
    },
    {
        id: 'shilajit',
        name: 'Shilajit',
        price: 3000,
        image: '/products/shilajit.png',
        category: 'Kashmiri Special',
        description: "Premium quality Shilajit from Jehlum Kesar Co.",
    },
    {
        id: 'walnut-oil',
        name: 'Walnut Oil',
        price: 1300,
        image: '/products/walnut-oil.png',
        category: 'Nuts',
        description: "Premium quality Walnut Oil from Jehlum Kesar Co.",
    },
    {
        id: 'walnut-with-shells',
        name: 'Walnut with Shells',
        price: 600,
        image: '/products/walnut-with-shells.png',
        category: 'Nuts',
        description: "Premium quality Walnut with Shells from Jehlum Kesar Co.",
    },
];
