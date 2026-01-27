"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";

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
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-saffron-crimson"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink-charcoal mb-2">
              Have a Question?
            </h2>
            <p className="text-deep-taupe">
              Fill out the form below and we'll get back to you via WhatsApp.
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
                "Submit"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
