import Link from "next/link";
import { Truck, RefreshCw, Clock, PackageCheck, Mail } from "lucide-react";

export const metadata = {
  title: "Shipping & Returns - Jhelum Kesar Co.",
  description:
    "Shipping and returns policy for Jhelum Kesar Co. Dispatch timelines, delivery estimates, and return eligibility.",
};

const SUPPORT_EMAIL = "contact@jhelumkesarco.com";

export default function ShippingAndReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white to-[#FFF8F0]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink-charcoal mb-4">
              Shipping &amp; Returns
            </h1>
            <p className="text-deep-taupe text-lg sm:text-xl">
              Clear timelines, simple rules, and quick support—so you can order with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-14 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Quick facts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="border border-soft-silk-border rounded-2xl p-5 sm:p-6 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <Truck className="w-6 h-6 text-saffron-crimson flex-shrink-0" />
                  <div>
                    <h2 className="font-serif text-xl text-ink-charcoal mb-1">Dispatch</h2>
                    <p className="text-deep-taupe">
                      Orders are usually shipped within <span className="font-semibold">2 business days</span>.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border border-soft-silk-border rounded-2xl p-5 sm:p-6 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 text-saffron-crimson flex-shrink-0" />
                  <div>
                    <h2 className="font-serif text-xl text-ink-charcoal mb-1">Delivery (India)</h2>
                    <p className="text-deep-taupe">
                      Delivery typically takes <span className="font-semibold">5–6 days</span> after dispatch (location-dependent).
                    </p>
                  </div>
                </div>
              </div>
              <div className="border border-soft-silk-border rounded-2xl p-5 sm:p-6 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-6 h-6 text-saffron-crimson flex-shrink-0" />
                  <div>
                    <h2 className="font-serif text-xl text-ink-charcoal mb-1">Returns</h2>
                    <p className="text-deep-taupe">
                      Returns within <span className="font-semibold">7 days</span>—only for{" "}
                      <span className="font-semibold">unopened</span> products.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border border-soft-silk-border rounded-2xl p-5 sm:p-6 bg-white shadow-sm">
                <div className="flex items-start gap-3">
                  <PackageCheck className="w-6 h-6 text-saffron-crimson flex-shrink-0" />
                  <div>
                    <h2 className="font-serif text-xl text-ink-charcoal mb-1">Updates</h2>
                    <p className="text-deep-taupe">
                      You’ll receive timely order processing and shipping updates via{" "}
                      <span className="font-semibold">WhatsApp</span> and <span className="font-semibold">email</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-charcoal">Shipping Policy</h2>
              <div className="space-y-3 text-deep-taupe leading-relaxed">
                <p>
                  We currently ship within <span className="font-semibold">India</span>. After you place an order,
                  you’ll receive confirmation and status updates via WhatsApp and email.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-semibold">Order processing</span>: Typically 0–2 business days.
                  </li>
                  <li>
                    <span className="font-semibold">Dispatch timeline</span>: Usually within 2 business days.
                  </li>
                  <li>
                    <span className="font-semibold">Delivery timeline</span>: Typically 5–6 days after dispatch, depending on your location and courier service.
                  </li>
                  <li>
                    <span className="font-semibold">Address accuracy</span>: Please ensure your shipping address and phone number are correct at checkout.
                  </li>
                </ul>
                <p>
                  If there’s an unexpected delay (weather, courier constraints, remote pincodes, or peak-season volume), we’ll keep you updated.
                </p>
              </div>
            </div>

            {/* Returns */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-charcoal">Returns &amp; Refunds</h2>
              <div className="space-y-3 text-deep-taupe leading-relaxed">
                <p>
                  We accept returns within <span className="font-semibold">7 days of delivery</span> only for{" "}
                  <span className="font-semibold">unopened</span> products. This helps us maintain strict hygiene and quality standards.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-semibold">Eligible</span>: Unopened items in original packaging (no tampering).
                  </li>
                  <li>
                    <span className="font-semibold">Not eligible</span>: Opened/used items, items with damaged or missing original packaging, and items returned after 7 days.
                  </li>
                </ul>
                <p>
                  <span className="font-semibold">How to request a return</span>: Email us your order ID and the reason for return.
                  Our team will guide you with the next steps.
                </p>
                <p>
                  <span className="font-semibold">Refund timeline</span>: After we receive and inspect the returned item, refunds (if approved) are typically processed within{" "}
                  <span className="font-semibold">7–10 business days</span> to the original payment method (bank processing times may vary).
                </p>
              </div>
            </div>

            {/* Damaged / incorrect */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-charcoal">Damaged or Incorrect Items</h2>
              <div className="space-y-3 text-deep-taupe leading-relaxed">
                <p>
                  If your order arrives damaged or you receive the wrong item, please contact us as soon as possible with your order ID and clear photos of the package and product.
                  We’ll work quickly to resolve it.
                </p>
              </div>
            </div>

            {/* Support */}
            <div className="rounded-2xl border border-soft-silk-border bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-saffron-crimson flex-shrink-0" />
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl text-ink-charcoal">Need help?</h2>
                  <p className="text-deep-taupe">
                    Contact us at{" "}
                    <a className="text-saffron-crimson hover:underline" href={`mailto:${SUPPORT_EMAIL}`}>
                      {SUPPORT_EMAIL}
                    </a>{" "}
                    or visit our{" "}
                    <Link href="/contact" className="text-saffron-crimson hover:underline">
                      Contact page
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-deep-taupe/70">
              Policy is subject to updates without prior notice. The most recent version will always be available on this page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

