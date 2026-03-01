import { notFound } from "next/navigation";
import { DB } from "@/app/lib/db";
import { Metadata } from "next";

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

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <title>JKC Receipt — {order.id}</title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,500&family=Montserrat:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
                <style>{`
          :root {
            --red: hsl(12,85%,43%);
            --cream: #F9F7F2;
            --gold: #EFEBE0;
            --ink: #2B2522;
            --clay: #7B736E;
            --silk: #E6E2D9;
          }
          @page { size: A5 landscape; margin: 0; }
          @media print {
            html, body { width: 210mm; height: 148mm; }
            .no-print { display: none !important; }
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Montserrat', sans-serif;
            background: var(--gold);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
            gap: 16px;
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
            </head>
            <body>
                {/* Action bar — hidden on print */}
                <div className="no-print">
                    <button className="btn btn-back" onClick={() => window.history.back()}>← Back</button>
                    <button className="btn btn-print" onClick={() => window.print()}>🖨 Print Receipt</button>
                </div>

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
                                <div className="ty-sub">
                                    From our fields to your hands — every item was packed with care and pride
                                    from the saffron valleys of Kashmir.
                                </div>
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

                {/* Auto-print on page load */}
                <script dangerouslySetInnerHTML={{
                    __html: `
          window.addEventListener('load', function() {
            // Small delay so fonts load before print dialog
            setTimeout(function() { window.print(); }, 600);
          });
        `}} />
            </body>
        </html>
    );
}
