// Run once: node scripts/seed-featured-reviews.mjs
// Seeds 8 high-quality curated reviews as featured=true into MongoDB
import { MongoClient } from "mongodb";
import { readFileSync } from "fs";

// Parse .env.local manually (no dotenv needed)
let MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    try {
        const env = readFileSync(".env.local", "utf8");
        const match = env.match(/^MONGODB_URI=(.+)$/m);
        if (match) MONGODB_URI = match[1].trim();
    } catch { }
}
if (!MONGODB_URI) throw new Error("MONGODB_URI not found in env or .env.local");


const SAMPLE_REVIEWS = [
    {
        id: "REV_SEED_001",
        productId: "kashmiri-saffron",
        userId: "SEED_USER_001",
        userName: "Priya Sharma",
        rating: 5,
        title: "Absolutely the finest saffron I've ever tasted",
        comment: "The colour it imparts to kheer is unlike anything from the market. Deep crimson threads, strong aroma. Worth every rupee. My family now won't accept anything else.",
        createdAt: "2026-01-15T08:00:00Z",
        verified: true,
        featured: true,
        reactions: { "❤️": 24, "🌟": 18, "👍": 12 },
    },
    {
        id: "REV_SEED_002",
        productId: "kashmiri-saffron",
        userId: "SEED_USER_002",
        userName: "Amit Bose",
        rating: 5,
        title: "Authentic — I can tell the difference",
        comment: "Bought saffron from many sources but this one has that unmistakable Kashmiri flavour. No adulteration. The packaging is also very elegant — perfect as a gift.",
        createdAt: "2026-01-20T11:00:00Z",
        verified: true,
        featured: true,
        reactions: { "👍": 31, "🔥": 9 },
    },
    {
        id: "REV_SEED_003",
        productId: "kashmiri-saffron",
        userId: "SEED_USER_003",
        userName: "Sunita Reddy",
        rating: 5,
        title: "My chef tested it and was impressed",
        comment: "I ordered for a catering event and even our head chef said the quality was exceptional. Will be ordering in bulk from now on.",
        createdAt: "2026-01-28T09:30:00Z",
        verified: true,
        featured: true,
        reactions: { "😍": 17, "❤️": 14, "🌟": 11 },
    },
    {
        id: "REV_SEED_004",
        productId: "kashmiri-saffron",
        userId: "SEED_USER_004",
        userName: "Rajan Mehta",
        rating: 5,
        title: "Delivery was fast, quality is amazing",
        comment: "Ordered on Saturday, received Monday. The saffron is beautifully packaged and the quality speaks for itself. 10/10 would recommend to anyone.",
        createdAt: "2026-02-03T14:20:00Z",
        verified: true,
        featured: true,
        reactions: { "👍": 22, "🔥": 7 },
    },
    {
        id: "REV_SEED_005",
        productId: "kashmiri-saffron",
        userId: "SEED_USER_005",
        userName: "Fatima Khan",
        rating: 5,
        title: "Gifted to my mother — she was overjoyed",
        comment: "Bought this as a Eid gift. The box presentation is gorgeous and the saffron itself is top-grade. My mother uses it in her biryani now and won't stop raving about it.",
        createdAt: "2026-02-10T16:45:00Z",
        verified: true,
        featured: true,
        reactions: { "❤️": 38, "😍": 21 },
    },
    {
        id: "REV_SEED_006",
        productId: "kashmiri-saffron",
        userId: "SEED_USER_006",
        userName: "Deepa Nair",
        rating: 5,
        title: "Finally found a trustworthy source",
        comment: "So tired of getting fake or low-grade saffron online. Jhelum Kesar Co. is the real deal. The lab certification and origin story give full confidence.",
        createdAt: "2026-02-14T10:00:00Z",
        verified: true,
        featured: true,
        reactions: { "🌟": 19, "👍": 16 },
    },
    {
        id: "REV_SEED_007",
        productId: "kashmiri-saffron",
        userId: "SEED_USER_007",
        userName: "Vikram Singh",
        rating: 5,
        title: "Just one pinch transforms the dish",
        comment: "Minimal quantity, maximum flavour. One small pinch in my wife's rice pudding turned it golden and fragrant. The difference from store-bought is night and day.",
        createdAt: "2026-02-18T13:15:00Z",
        verified: false,
        featured: true,
        reactions: { "🔥": 13, "😍": 10 },
    },
    {
        id: "REV_SEED_008",
        productId: "kashmiri-saffron",
        userId: "SEED_USER_008",
        userName: "Meera Joshi",
        rating: 5,
        title: "Premium quality — exceeded my expectations",
        comment: "I was a bit sceptical about ordering saffron online but took the plunge. So glad I did! The threads are long, deep red, and the soaking water turned a beautiful golden colour immediately.",
        createdAt: "2026-02-22T09:00:00Z",
        verified: true,
        featured: true,
        reactions: { "❤️": 29, "🌟": 15, "😍": 8 },
    },
];

const client = new MongoClient(MONGODB_URI);
try {
    await client.connect();
    const db = client.db("jkc_store");
    const col = db.collection("reviews");

    let seeded = 0;
    for (const review of SAMPLE_REVIEWS) {
        const exists = await col.findOne({ id: review.id });
        if (!exists) {
            await col.insertOne(review);
            seeded++;
            console.log(`  ✓ Seeded: ${review.userName} — "${review.title}"`);
        } else {
            console.log(`  ~ Skipped (exists): ${review.id}`);
        }
    }
    console.log(`\n✅ Done. ${seeded} new review(s) seeded as featured.`);
} finally {
    await client.close();
}
