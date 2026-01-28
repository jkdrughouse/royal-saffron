"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadCaptureBanner } from "@/components/lead-capture-banner";
import { WhatsAppLogo } from "@/components/whatsapp-logo";

export default function ContactPage() {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "917889852247";
  const whatsappUrl = `https://wa.me/${whatsappPhone.replace(/\D/g, "")}?text=${encodeURIComponent("Hello! I'd like to know more about Jhelum Kesar Co. products.")}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white to-[#FFF8F0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink-charcoal mb-4">
              Get in Touch
            </h1>
            <p className="text-deep-taupe text-lg sm:text-xl max-w-2xl mx-auto">
              We're here to help you discover the finest Kashmiri Saffron and Himalayan products
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
            {/* Contact Details */}
            <div className="space-y-6">
              <Card className="p-6 sm:p-8 border border-soft-silk-border bg-white">
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-charcoal mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-saffron-crimson/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-saffron-crimson" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink-charcoal mb-1">Address</h3>
                      <p className="text-deep-taupe text-sm sm:text-base leading-relaxed">
                        Jhelum Kesar Co.<br />
                        NH44, Lethipora<br />
                        Jammu and Kashmir - 192122
                      </p>
                      <a
                        href="https://share.google/CBYGchlsVy18P5dqu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-saffron-crimson hover:text-estate-gold transition-colors text-sm inline-flex items-center gap-1 mt-2"
                      >
                        View on Google Maps →
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-saffron-crimson/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-saffron-crimson" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink-charcoal mb-1">Phone</h3>
                      <a
                        href={`tel:${whatsappPhone}`}
                        className="text-saffron-crimson hover:text-estate-gold transition-colors text-sm sm:text-base"
                      >
                        +91 {whatsappPhone.slice(2)}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-saffron-crimson/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-saffron-crimson" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink-charcoal mb-1">Email</h3>
                      <a
                        href="mailto:info@jhelumkesarco.com"
                        className="text-saffron-crimson hover:text-estate-gold transition-colors text-sm sm:text-base"
                      >
                        info@jhelumkesarco.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-saffron-crimson/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-saffron-crimson" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink-charcoal mb-1">Business Hours</h3>
                      <p className="text-deep-taupe text-sm sm:text-base">
                        Monday - Saturday: 9:00 AM - 7:00 PM<br />
                        Sunday: 10:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-soft-silk-border">
                  <Button
                    onClick={() => window.open(whatsappUrl, "_blank")}
                    className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                    size="lg"
                  >
                    <WhatsAppLogo className="w-5 h-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </Card>
            </div>

            {/* Map Embed */}
            <div className="space-y-6">
              <Card className="p-6 sm:p-8 border border-soft-silk-border bg-white">
                <h2 className="font-serif text-2xl sm:text-3xl text-ink-charcoal mb-6">
                  Find Us
                </h2>
                <div className="aspect-square rounded-lg overflow-hidden border border-soft-silk-border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.1234567890123!2d74.7973!3d34.0837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDA1JzAxLjMiTiA3NMKwNDcnNTAuMyJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-sm text-deep-taupe mt-4 text-center">
                  <a
                    href="https://share.google/CBYGchlsVy18P5dqu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-saffron-crimson hover:text-estate-gold transition-colors"
                  >
                    View on Google Maps →
                  </a>
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Banner */}
      <LeadCaptureBanner />
    </div>
  );
}
