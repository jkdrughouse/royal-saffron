// Quick connectivity test — run with: node --env-file=.env.local test-server.mjs
// Tests MongoDB Atlas connection and SMTP email sending

// ── 1. MongoDB Atlas ──────────────────────────────────────────────
async function testMongoDB() {
    const { MongoClient } = await import('mongodb');
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set');

    console.log('🔌 Connecting to MongoDB Atlas...');
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('jkc_store');

    // Write a test document
    await db.collection('_test').insertOne({ ok: true, ts: new Date() });
    const doc = await db.collection('_test').findOne({ ok: true });
    await db.collection('_test').deleteMany({});
    await client.close();

    console.log('✅ MongoDB Atlas: Connected and read/write works!', doc);
}

// ── 2. SMTP Email ────────────────────────────────────────────────
async function testSMTP() {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    console.log('📧 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP: Connection verified!');

    console.log('📨 Sending test email...');
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.SMTP_USER,
        subject: '✅ JKC Server Test — Email is Working!',
        html: '<h2>🎉 Your email server is configured correctly!</h2><p>Orders, OTPs, and notifications will be delivered from <strong>contact@jhelumkesarco.com</strong>.</p>',
    });
    console.log('✅ Test email sent to', process.env.SMTP_USER);
}

// ── Run both tests ───────────────────────────────────────────────
(async () => {
    try {
        await testMongoDB();
    } catch (e) {
        console.error('❌ MongoDB failed:', e.message);
    }
    try {
        await testSMTP();
    } catch (e) {
        console.error('❌ SMTP failed:', e.message);
    }
    console.log('\n🏁 Done.');
    process.exit(0);
})();
