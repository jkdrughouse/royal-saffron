export const SITE_URL = "https://jhelumkesarco.com";
export const SITE_NAME = "Jhelum Kesar Co.";
export const CONTACT_EMAIL = "contact@jhelumkesarco.com";
export const CONTACT_PHONE = "+91-7889852247";
export const INSTAGRAM_URL = "https://www.instagram.com/jhelumkesarco";

const DEFAULT_WHATSAPP_PHONE = "917889852247";
const DEFAULT_WHATSAPP_MESSAGE =
  "Hello! I'm interested in Jhelum Kesar Co. products.";

export const SITE_DESCRIPTION =
  "Buy authentic Kashmiri saffron online from Pampore. Explore premium saffron, honey, dry fruits, wellness products, our story, and chat with Jhelum Kesar Co. on WhatsApp.";

export const siteNavigationLinks = [
  { name: "Our Products", href: "/shop" },
  { name: "Order Saffron", href: "/product/kashmiri-saffron" },
  { name: "Our Story", href: "/our-story" },
  { name: "WhatsApp Chat", href: "/whatsapp" },
] as const;

export const footerQuickLinks = [
  { name: "Shop All", href: "/shop" },
  { name: "Our Story", href: "/our-story" },
  { name: "Contact Us", href: "/contact" },
  { name: "Shipping & Returns", href: "/shipping" },
] as const;

export function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function getWhatsAppPhone() {
  return process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.replace(/\D/g, "") || DEFAULT_WHATSAPP_PHONE;
}

export function getWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${getWhatsAppPhone()}?text=${encodeURIComponent(message)}`;
}
