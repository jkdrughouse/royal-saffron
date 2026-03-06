/**
 * seed-reviews.mjs
 * Run once: node seed-reviews.mjs
 * Seeds MongoDB reviews collection with realistic reviews that match the
 * homepage carousel testimonials.
 */

import { MongoClient } from "mongodb";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

// Load .env.local manually (dotenv not required)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, ".env.local");
let envStr = "";
try { envStr = readFileSync(envPath, "utf8"); } catch { }
envStr.split("\n").forEach(line => {
    const eq = line.indexOf("=");
    if (eq === -1) return;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim().replace(/^"|"$/g, "");
    if (k && !process.env[k]) process.env[k] = v;
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local");

// ── Review data ──────────────────────────────────────────────────────────────
// Dates spread realistically over the past 6 months
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
}

const reviews = [
    // kashmiri-saffron (4 reviews)
    {
        id: "rev-001",
        productId: "kashmiri-saffron",
        userId: "user-amit-b",
        userName: "Amit Bhatnagar",
        rating: 5,
        title: "Pure & Authentic!",
        comment: "The saffron threads are deep red with an incredible aroma. You can tell it's genuine Kashmiri kesar — no fake yellow threads. My milk turned golden in seconds! Will be ordering again.",
        verified: true,
        featured: true,
        createdAt: daysAgo(14),
    },
    {
        id: "rev-002",
        productId: "kashmiri-saffron",
        userId: "user-priya-s",
        userName: "Priya Sharma",
        rating: 5,
        title: "Best Kesar I've Found",
        comment: "I've tried many brands but Jhelum Kesar Co. is on another level. The flavor in my biryani was extraordinary — rich, floral, and intensely fragrant. Will never switch!",
        verified: true,
        featured: true,
        createdAt: daysAgo(28),
    },
    {
        id: "rev-003",
        productId: "kashmiri-saffron",
        userId: "user-vikram-s",
        userName: "Vikram Singh",
        rating: 5,
        title: "Worth Every Rupee",
        comment: "Premium quality saffron at a very fair price. The threads are long and aromatic — exactly what I need for my morning kesar doodh routine. Highly recommend.",
        verified: true,
        featured: true,
        createdAt: daysAgo(45),
    },
    {
        id: "rev-004",
        productId: "kashmiri-saffron",
        userId: "user-rohan-m",
        userName: "Rohan Mehta",
        rating: 5,
        title: "Fast Delivery & Excellent Quality",
        comment: "Ordered on Monday, received by Wednesday. The packaging was perfectly sealed and the saffron arrived absolutely fresh. The color payoff in my phirni was stunning — deep rich gold.",
        verified: true,
        featured: true,
        createdAt: daysAgo(60),
    },

    // saffron-honey (2 reviews)
    {
        id: "rev-005",
        productId: "saffron-honey",
        userId: "user-deepa-n",
        userName: "Deepa Nair",
        rating: 5,
        title: "Incredible Aroma",
        comment: "Just opening the jar fills the room with the most divine fragrance. The combination of pure honey and Kashmiri saffron is magical. Using it in my desserts has been a total game-changer!",
        verified: true,
        featured: true,
        createdAt: daysAgo(22),
    },
    {
        id: "rev-006",
        productId: "saffron-honey",
        userId: "user-fatima-k",
        userName: "Fatima Khan",
        rating: 5,
        title: "A Family Favorite",
        comment: "We use this for special occasions — Eid, Diwali, birthdays. The quality is always consistent and the taste is absolutely unmatched. My kids now refuse regular honey!",
        verified: true,
        featured: true,
        createdAt: daysAgo(50),
    },

    // saffron-face-wash (2 reviews)
    {
        id: "rev-007",
        productId: "saffron-face-wash",
        userId: "user-sunita-p",
        userName: "Sunita Patel",
        rating: 4,
        title: "Skin Care Magic",
        comment: "I use this saffron face wash daily and the glow is real! Love that it's gentle enough for my sensitive skin. My complexion has visibly brightened after 3 weeks of consistent use.",
        verified: true,
        featured: true,
        createdAt: daysAgo(18),
    },
    {
        id: "rev-008",
        productId: "saffron-face-wash",
        userId: "user-meera-j",
        userName: "Meera Joshi",
        rating: 5,
        title: "Beautiful Packaging, Brilliant Results",
        comment: "Gifted this to my mother-in-law and she absolutely loved it! The packaging is so elegant — feels premium. The face wash lathers beautifully and leaves skin soft. Quality speaks for itself.",
        verified: true,
        featured: true,
        createdAt: daysAgo(35),
    },

    // shahi-kehwa (2 reviews)
    {
        id: "rev-009",
        productId: "shahi-kehwa",
        userId: "user-suresh-i",
        userName: "Suresh Iyer",
        rating: 5,
        title: "Kehwa that Takes You to Kashmir",
        comment: "One sip of this Shahi Kehwa and I felt transported to Dal Lake. The blend of spices is perfect — not overpowering, just beautifully balanced. Ordering a second box already!",
        verified: true,
        featured: false,
        createdAt: daysAgo(40),
    },
    {
        id: "rev-010",
        productId: "shahi-kehwa",
        userId: "user-anjali-v",
        userName: "Anjali Verma",
        rating: 5,
        title: "Perfect Winter Warmth",
        comment: "Started my mornings with this kehwa and it's absolutely transformed my routine. The saffron aroma is unmistakable and the cardamom and cinnamon blend is just right. Absolutely divine.",
        verified: true,
        featured: false,
        createdAt: daysAgo(70),
    },

    // acacia-honey (2 reviews)
    {
        id: "rev-011",
        productId: "acacia-honey",
        userId: "user-raj-m",
        userName: "Raj Mahajan",
        rating: 5,
        title: "Purest Honey I've Tasted",
        comment: "Crystal clear and with a light, floral sweetness that's addictive. You can tell it's raw and unprocessed — no artificial aftertaste. My go-to for morning toast and tea now.",
        verified: true,
        featured: false,
        createdAt: daysAgo(55),
    },
    {
        id: "rev-012",
        productId: "acacia-honey",
        userId: "user-kavya-r",
        userName: "Kavya Rao",
        rating: 5,
        title: "Using for Ayurvedic Remedies",
        comment: "I specifically needed pure acacia honey for my Ayurvedic routine and this is perfect. No crystallization even after months. Great value for such high quality.",
        verified: false,
        featured: false,
        createdAt: daysAgo(80),
    },

    // kashmiri-mamra-badam (2 reviews)
    {
        id: "rev-013",
        productId: "kashmiri-mamra-badam",
        userId: "user-ravi-k",
        userName: "Ravi Kumar",
        rating: 5,
        title: "Thin Shell, Rich Flavor",
        comment: "These Mamra almonds are on a completely different level from regular almonds. Thinner shell, crunchy, and so much more flavorful. My nutritionist recommended them and I'm now hooked.",
        verified: true,
        featured: false,
        createdAt: daysAgo(25),
    },
    {
        id: "rev-014",
        productId: "kashmiri-mamra-badam",
        userId: "user-pooja-s",
        userName: "Pooja Shah",
        rating: 4,
        title: "Great Quality, Fast Shipping",
        comment: "Very fresh and crunchy. The Kashmiri variety really does taste different from supermarket almonds. Although I wish the quantity was a little more, the quality justifies the price.",
        verified: true,
        featured: false,
        createdAt: daysAgo(90),
    },

    // shilajit (2 reviews)
    {
        id: "rev-015",
        productId: "shilajit",
        userId: "user-arjun-n",
        userName: "Arjun Nair",
        rating: 5,
        title: "Noticed Difference in 2 Weeks",
        comment: "I was skeptical but after 2 weeks of taking this Shilajit with warm milk I noticed better energy and focus. The resin quality looks pure — dark, sticky, and with the typical mineral smell.",
        verified: true,
        featured: false,
        createdAt: daysAgo(32),
    },
    {
        id: "rev-016",
        productId: "shilajit",
        userId: "user-manish-t",
        userName: "Manish Tripathi",
        rating: 5,
        title: "Authentic Himalayan Shilajit",
        comment: "Hard to find authentic Shilajit. This one dissolves cleanly in warm water and has the right consistency. No filler ingredients. Been using for a month and energy levels are noticeably better.",
        verified: true,
        featured: false,
        createdAt: daysAgo(65),
    },

    // sidr-honey (2 reviews)
    {
        id: "rev-017",
        productId: "sidr-honey",
        userId: "user-hina-a",
        userName: "Hina Ansari",
        rating: 5,
        title: "The Rolls-Royce of Honey",
        comment: "Sidr honey has a rich, complex flavor unlike anything from a supermarket. You taste the flowers, the wildness, the purity. Using it medicinally and the results have been amazing.",
        verified: true,
        featured: false,
        createdAt: daysAgo(48),
    },
    {
        id: "rev-018",
        productId: "sidr-honey",
        userId: "user-tariq-h",
        userName: "Tariq Hussain",
        rating: 5,
        title: "Worth Every Paisa",
        comment: "Yes it's premium priced but the quality is extraordinary. Thick, dark, intensely flavored. I use a spoonful every morning. My immunity has noticeably improved this winter.",
        verified: false,
        featured: false,
        createdAt: daysAgo(100),
    },
];

// ── Seed ────────────────────────────────────────────────────────────────────
const client = new MongoClient(MONGODB_URI);

try {
    await client.connect();
    const db = client.db("jkc_store");
    const col = db.collection("reviews");

    let inserted = 0;
    let skipped = 0;

    for (const review of reviews) {
        const existing = await col.findOne({ id: review.id });
        if (existing) {
            console.log(`  ⏭  Skipped existing: ${review.id}`);
            skipped++;
        } else {
            await col.insertOne(review);
            console.log(`  ✅ Inserted: ${review.id} — ${review.title}`);
            inserted++;
        }
    }

    console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}`);
} finally {
    await client.close();
}
