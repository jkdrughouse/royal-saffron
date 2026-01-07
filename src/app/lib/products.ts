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
        id: 'shilajit',
        name: 'Pure Himalayan Shilajit',
        price: 800,
        image: '/products/shilajit.png',
        category: 'Shilajit',
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
    }
];
