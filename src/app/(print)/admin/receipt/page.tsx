import { notFound } from "next/navigation";
import { DB } from "@/app/lib/db";
import { Metadata } from "next";
import PrintActions from "./print-actions";
import { products } from "@/app/lib/products";

// ── Smart Thank-You Message Engine ───────────────────────────────────────────
// Ported from the original jkc_receipt_design.html smart-message JS block.
// Runs server-side so there is no flash / layout shift on the printed receipt.

const SMART_MESSAGES: Record<string, string[]> = {
    saffron: [
        "Every pinch of Kashmiri Kesar carries the fragrance of mountain valleys. Store in an airtight container away from light to preserve its vivid colour and aroma for months.",
        "You've chosen the finest Mongra threads — the gold standard of saffron. A pinch on warm milk or biryani and you'll understand why Kashmir's kesar is prized across the world.",
    ],
    gift: [
        "What a beautiful choice. We've packed every item with extra care — because whoever receives this deserves to feel truly special. Thank you for trusting us to carry your sentiment.",
        "Gifts from Jhelum Kesar Co. are more than products — they're stories from Kashmir. We hope this brings as much joy to the recipient as it did to choose it.",
    ],
    beauty: [
        "A few drops of liquid kesar go a long way. Add it to warm milk, desserts, or your skincare ritual and let the ancient magic of saffron unfold every day.",
        "Saffron has adorned royalty for centuries. Your beauty ritual just got a royal upgrade — enjoy the warmth and glow it brings from within.",
    ],
    honey: [
        "Pure Kashmiri honey — raw, unfiltered, and brimming with the highland terroir. Drizzle it over everything and never look back.",
        "This is honey that remembers where it came from. The bees, the flowers, the mountain air — every jar carries the whole story.",
    ],
    tea: [
        "Brew it slow, sip it slower. Kashmiri Kahwa isn't just tea — it's a ritual, a pause, a moment that belongs entirely to you.",
        "Add a strand of kesar to your brew and let the colour bloom. This is what winter mornings in Kashmir taste like.",
    ],
    spices: [
        "From our highland farms to your kitchen — every spice in this order carries the altitude, soil, and care of Kashmir. Cook boldly.",
        "The best recipes start with honest ingredients. These spices are exactly that — unblended, uncut, and full of character.",
    ],
    mixed: [
        "From our fields to your hands — thank you for bringing a little of Kashmir into your home. Each item has been packed with the same care and pride we put into every strand we harvest.",
        "A beautiful selection! Whether it's for your kitchen, a loved one, or simply a moment of indulgence — we're honoured to be part of it. Enjoy every drop, pinch, and gift.",
    ],
};

function pickMessage(itemNames: string[]): string {
    // Map item names → product categories from the catalog
    const cats = new Set<string>();
    for (const name of itemNames) {
        const product = products.find(
            (p) => p.name.toLowerCase() === name.toLowerCase()
        );
        if (product) cats.add(product.category.toLowerCase());
    }

    // Map catalog categories to message keys
    const catMap: Record<string, string> = {
        saffron: "saffron",
        "kashmiri special": "gift",
        beauty: "beauty",
        fragrance: "beauty",
        oils: "beauty",
        honey: "honey",
        tea: "tea",
        spices: "spices",
        food: "mixed",
        nuts: "mixed",
        other: "mixed",
    };

    const mappedKeys = [...cats].map((c) => catMap[c] ?? "mixed");
    const uniqueKeys = new Set(mappedKeys);

    // One dominant category → specific message; multiple → mixed
    const key = uniqueKeys.size === 1 ? [...uniqueKeys][0] : "mixed";
    const pool = SMART_MESSAGES[key] ?? SMART_MESSAGES.mixed;

    // Server-side deterministic pick (seeded by order item count to avoid random hydration mismatches)
    return pool[itemNames.length % pool.length];
}

export const metadata: Metadata = { title: "JKC Receipt" };

// Fetch the order server-side
async function getOrder(orderId: string) {
    const orders = await DB.orders();
    return orders.find((o: any) => o.id === orderId) ?? null;
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function formatINR(n: number) {
    return `₹${n.toLocaleString("en-IN")}`;
}

export default async function ReceiptPage({
    searchParams,
}: {
    searchParams: Promise<{ orderId?: string }>;
}) {
    const { orderId } = await searchParams;
    if (!orderId) notFound();

    const order = await getOrder(orderId);
    if (!order) notFound();

    const isOnline = order.type !== "offline";
    const payMethod = (order.paymentMethod ?? "online").toUpperCase();
    const payBadge = payMethod === "COD" ? "b-cod" : "b-paid";
    const payLabel = payMethod === "COD" ? "COD" : `✓ Paid · ${payMethod}`;

    const subtotal: number = order.subtotal ?? order.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const discount: number = order.discount ?? 0;
    const shipping: number = order.shipping ?? 0;
    const total: number = order.total ?? subtotal - discount + shipping;

    const addr = order.shippingAddress;

    // Smart thank-you message
    const itemNames: string[] = (order.items ?? []).map((i: any) => i.name as string);
    const thankYouMessage = pickMessage(itemNames);

    return (
        <>
            {/* Load print-specific fonts (Cormorant Garamond + Montserrat) */}
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&family=Montserrat:wght@400;500;600&display=swap"
            />
            <style>{`
          /* ── Hard reset: undo globals.css + Tailwind base that bleeds into print route ── */
          .receipt-shell, .receipt-shell * {
            box-sizing: border-box;
            border: none;     /* undo Tailwind's * { border-color } base reset         */
            outline: none;
          }
          :root {
            --red: hsl(12,85%,43%);
            --cream: #F9F7F2;
            --gold: #EFEBE0;
            --ink: #2B2522;
            --clay: #7B736E;
            --silk: #E6E2D9;
          }
          /* Full-viewport shell that replaces body layout (body styles overridden by globals.css) */
          .receipt-shell {
            font-family: 'Montserrat', sans-serif;
            background: var(--gold);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            width: 100%;
            padding: 20px;
            gap: 16px;
            position: fixed;   /* escape body positioning constraints from globals.css */
            inset: 0;
            overflow: auto;
          }
          @page { size: A5 landscape; margin: 0; }
          @media print {
            .receipt-shell { position: static; min-height: unset; padding: 0; background: #fff; }
            html, body { width: 210mm; height: 148mm; background: #fff !important; }
            .no-print { display: none !important; }
          }
          /* Print action bar */
          .no-print {
            display: flex;
            gap: 10px;
          }
          .btn {
            padding: 10px 22px;
            border: none;
            border-radius: 6px;
            font-family: 'Montserrat', sans-serif;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
          }
          .btn-print { background: var(--red); color: #fff; box-shadow: 0 3px 12px rgba(0,0,0,.2);}
          .btn-back  { background: var(--silk); color: var(--ink); }
          /* Receipt */
          .receipt {
            width: 210mm;
            height: 148mm;
            background: #fff;
            display: grid;
            grid-template-columns: 72mm 1fr;
            overflow: hidden;
            box-shadow: 0 6px 40px rgba(43,37,34,.18);
          }
          /* LEFT */
          .left {
            background: var(--cream);
            padding: 14mm 9mm 8mm;
            display: flex;
            flex-direction: column;
            gap: 8px;
            border-right: 1px solid var(--silk);
            position: relative;
          }
          .left::before {
            content: '';
            position: absolute;
            top: 0; left: 0; bottom: 0;
            width: 4px;
            background: var(--red);
          }
          .logo-row { display: flex; align-items: center; gap: 7px; margin-bottom: 2px; }
          .logo-img { width: 36px; height: 36px; object-fit: contain; flex-shrink: 0; }
          .brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 16px; font-weight: 700; color: var(--red);
            letter-spacing: -.01em; line-height: 1.1;
          }
          .tagline {
            font-family: 'Cormorant Garamond', serif;
            font-style: italic; font-size: 7.5px;
            color: var(--clay); letter-spacing: .06em; margin-bottom: 8px;
          }
          .divider { height: 1px; background: var(--silk); margin: 4px 0; }
          .meta-block { display: flex; flex-direction: column; gap: 5px; }
          .meta-row { display: flex; flex-direction: column; }
          .lbl { font-size: 6.5px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--clay); }
          .val { font-size: 9px; font-weight: 500; color: var(--ink); margin-top: 1px; line-height: 1.4; }
          .badge {
            display: inline-block; font-size: 6px; font-weight: 700;
            letter-spacing: .1em; text-transform: uppercase;
            padding: 2px 7px; border-radius: 20px; margin-right: 4px;
          }
          .b-online { background: #E8F4EA; color: #2D7A3A; }
          .b-offline { background: #FDF3E3; color: #A05A2C; }
          .b-paid   { background: #E8F4EA; color: #2D7A3A; }
          .b-cod    { background: #FDF3E3; color: #A05A2C; }
          .paid-stamp {
            margin-top: auto;
            display: inline-flex; align-items: center; gap: 5px;
            border: 1.5px solid #2D7A3A; border-radius: 3px;
            padding: 3px 9px; align-self: flex-start;
            color: #2D7A3A; font-size: 7px; font-weight: 700;
            letter-spacing: .12em; text-transform: uppercase;
          }
          .dot { width: 5px; height: 5px; border-radius: 50%; background: #2D7A3A; }
          /* RIGHT */
          .right { padding: 10mm 9mm 7mm 10mm; display: flex; flex-direction: column; }
          table { width: 100%; border-collapse: collapse; font-size: 8px; margin-bottom: 5px; }
          thead th {
            font-size: 6.5px; font-weight: 600; letter-spacing: .12em;
            text-transform: uppercase; color: var(--clay);
            padding: 0 4px 5px; border-bottom: 1px solid var(--silk); text-align: left;
          }
          thead th:last-child { text-align: right; }
          tbody td { padding: 4.5px 4px; color: var(--ink); border-bottom: 1px dotted var(--silk); vertical-align: top; }
          tbody td:last-child { text-align: right; font-weight: 500; }
          .iname { font-size: 8.5px; font-weight: 500; }
          .ivar  { font-size: 6.5px; color: var(--clay); margin-top: 1px; }
          .totals { border-top: 1px solid var(--silk); padding-top: 5px; margin-bottom: 5px; }
          .trow  { display: flex; justify-content: space-between; font-size: 8px; color: var(--ink); padding: 2px 0; }
          .tlbl  { color: var(--clay); }
          .disc .tamt { color: #2D7A3A; }
          .grand {
            background: var(--red);
            display: flex; justify-content: space-between; align-items: center;
            padding: 5px 8px; margin-bottom: 6px;
          }
          .grand .glbl { font-family: 'Cormorant Garamond', serif; font-size: 11px; font-weight: 700; color: #fff; }
          .grand .gamt { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 700; color: #fff; }
          .footer-row {
            display: flex; justify-content: space-between; align-items: flex-end;
            border-top: 1px solid var(--silk); padding-top: 6px; margin-top: auto;
          }
          .ty { font-family: 'Cormorant Garamond', serif; font-size: 10px; font-weight: 700; font-style: italic; color: var(--red); margin-bottom: 2px; }
          .ty-sub { font-size: 6.5px; color: var(--clay); line-height: 1.5; max-width: 78mm; }
          .social-col { text-align: right; }
          .social-col span { display: block; font-size: 6.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--red); line-height: 1.8; }
          .fine { font-size: 6px; color: var(--clay); margin-top: 2px; line-height: 1.4; }
            `}</style>

            {/* Full-viewport shell — isolates receipt from globals.css body styles */}
            <div className="receipt-shell">
                {/* Action bar — client component handles window.print() + window.history.back() */}
                <PrintActions />

                <div className="receipt">
                    {/* ── LEFT PANEL ── */}
                    <div className="left">
                        <div className="logo-row">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img className="logo-img" src="/logo-final.png" alt="JKC Logo" />
                            <div className="brand">Jhelum Kesar Co.</div>
                        </div>
                        <div className="tagline">Pure Saffron, From Source to Table.</div>
                        <div className="divider" />

                        <div className="meta-block">
                            <div className="meta-row">
                                <span className="lbl">Invoice</span>
                                <span className="val">#{order.id}</span>
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <div className="meta-row">
                                    <span className="lbl">Date</span>
                                    <span className="val">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="meta-row">
                                    <span className="lbl">Time</span>
                                    <span className="val">{formatTime(order.createdAt)}</span>
                                </div>
                            </div>
                            <div>
                                <span className={`badge ${isOnline ? "b-online" : "b-offline"}`}>
                                    {isOnline ? "● Online" : "🏪 Walk-in"}
                                </span>
                                <span className={`badge ${payBadge}`}>{payLabel}</span>
                            </div>
                        </div>
                        <div className="divider" />

                        <div className="meta-block">
                            <div className="meta-row">
                                <span className="lbl">Customer</span>
                                <span className="val">{addr?.name} · {addr?.phone}</span>
                            </div>
                            {isOnline && addr?.address && (
                                <div className="meta-row">
                                    <span className="lbl">Deliver To</span>
                                    <span className="val">
                                        {addr.address}<br />
                                        {addr.city}{addr.state ? `, ${addr.state}` : ""} – {addr.pincode}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="paid-stamp">
                            <span className="dot" />
                            {payMethod === "COD" ? "Cash on Delivery" : "Payment Received"}
                        </div>
                    </div>

                    {/* ── RIGHT PANEL ── */}
                    <div className="right">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th style={{ textAlign: "center" }}>Qty</th>
                                    <th style={{ textAlign: "right" }}>Unit</th>
                                    <th style={{ textAlign: "right" }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td>
                                            <div className="iname">{item.name}</div>
                                            {item.variant && (
                                                <div className="ivar">{item.variant}{item.unit ?? "g"}</div>
                                            )}
                                        </td>
                                        <td style={{ textAlign: "center" }}>{item.quantity}</td>
                                        <td style={{ textAlign: "right" }}>{formatINR(item.price)}</td>
                                        <td style={{ textAlign: "right" }}>{formatINR(item.price * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="totals">
                            <div className="trow">
                                <span className="tlbl">Subtotal</span>
                                <span>{formatINR(subtotal)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="trow disc">
                                    <span className="tlbl">Discount</span>
                                    <span className="tamt">−{formatINR(discount)}</span>
                                </div>
                            )}
                            <div className="trow">
                                <span className="tlbl">Shipping</span>
                                <span style={{ color: shipping === 0 ? "#2D7A3A" : undefined }}>
                                    {shipping === 0 ? "Free ✓" : formatINR(shipping)}
                                </span>
                            </div>
                        </div>

                        <div className="grand">
                            <span className="glbl">Grand Total</span>
                            <span className="gamt">{formatINR(total)}</span>
                        </div>

                        <div className="footer-row">
                            <div>
                                <div className="ty">Thank you, {addr?.name?.split(" ")[0]}! 🌸</div>
                                <div className="ty-sub">{thankYouMessage}</div>
                            </div>
                            <div className="social-col">
                                <span>📷 @jhelumkesar</span>
                                <span>💬 +91 78898 52247</span>
                                <span>🌐 jhelumkesarco.com</span>
                                <div className="fine">
                                    GSTIN: 01ABCDE1234F1ZX · HSN 0910<br />
                                    Returns accepted within 7 days (unopened)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> {/* /receipt-shell */}
        </>
    );
}
