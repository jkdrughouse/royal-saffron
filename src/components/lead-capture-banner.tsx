"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send } from "lucide-react";

export function LeadCaptureBanner() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    query: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.query) {
      setError("All fields are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      setError("Invalid phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit query");
      }

      // Open WhatsApp with pre-filled message
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank");
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", query: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white to-[#FFF8F0]">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto p-8 sm:p-12 text-center border-2 border-saffron-crimson/20 bg-white">
            <div className="w-16 h-16 bg-saffron-crimson/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-saffron-crimson" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink-charcoal mb-2">
              Thank You!
            </h3>
            <p className="text-deep-taupe">
              We've received your query and will contact you shortly via WhatsApp.
            </p>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white to-[#FFF8F0]">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto p-6 sm:p-8 md:p-12 border border-soft-silk-border bg-white shadow-lg">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-saffron-crimson/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-saffron-crimson" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink-charcoal mb-2">
              Have a Question?
            </h2>
            <p className="text-deep-taupe text-sm sm:text-base">
              Fill out the form below and our team will reach out to you via WhatsApp
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-charcoal mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-soft-silk-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-crimson focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-charcoal mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-soft-silk-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-crimson focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-charcoal mb-1">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-soft-silk-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-crimson focus:border-transparent"
                placeholder="10-digit mobile number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-charcoal mb-1">
                Your Query *
              </label>
              <textarea
                value={formData.query}
                onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-soft-silk-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-crimson focus:border-transparent resize-none"
                placeholder="Tell us what you're looking for..."
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-saffron-crimson hover:bg-estate-gold text-white py-6 text-base sm:text-lg font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Submit & Contact via WhatsApp
                </>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
