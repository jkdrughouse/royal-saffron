import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME, getWhatsAppUrl } from "@/app/lib/site-metadata";

export const metadata: Metadata = {
  title: "WhatsApp Chat",
  description:
    "Chat with Jhelum Kesar Co. on WhatsApp for saffron orders, product questions, shipping support, and personalised help.",
  alternates: {
    canonical: "/whatsapp",
  },
};

export default function WhatsAppPage() {
  const whatsappUrl = getWhatsAppUrl(
    "Hello! I would like help with Jhelum Kesar Co. products and saffron orders."
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FFF8F0]">
      <section className="container mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <div className="rounded-3xl border border-soft-silk-border bg-white p-8 shadow-sm sm:p-12">
          <span className="inline-flex rounded-full bg-[#25D366]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#25D366]">
            WhatsApp Support
          </span>
          <h1 className="mt-4 font-serif text-4xl text-ink-charcoal sm:text-5xl">
            Chat with {SITE_NAME}
          </h1>
          <p className="mt-4 text-base leading-7 text-deep-taupe sm:text-lg">
            Use WhatsApp to ask about saffron quality, gifting, shipping, bulk orders, and product recommendations.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="sm:flex-1">
              <Button
                size="lg"
                className="w-full bg-[#25D366] text-white hover:bg-[#20BA5A]"
              >
                Open WhatsApp Chat
              </Button>
            </a>
            <Link href="/shop" className="sm:flex-1">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-saffron-crimson text-saffron-crimson hover:bg-saffron-crimson/5"
              >
                Browse Products
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-4 rounded-2xl bg-muted/20 p-5 text-sm text-deep-taupe sm:grid-cols-2">
            <div>
              <p className="font-semibold text-ink-charcoal">Phone</p>
              <a href={`tel:${CONTACT_PHONE}`} className="hover:text-saffron-crimson">
                {CONTACT_PHONE}
              </a>
            </div>
            <div>
              <p className="font-semibold text-ink-charcoal">Email</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-saffron-crimson">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
