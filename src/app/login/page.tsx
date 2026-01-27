"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";

export const dynamic = 'force-dynamic';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const redirect = searchParams.get("redirect") || "/orders";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Login failed");
        }

        router.push(redirect || "/account");
        router.refresh();
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }

        if (formData.password.length < 8) {
          throw new Error("Password must be at least 8 characters");
        }

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        router.push(redirect || "/account");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 sm:py-16 px-4">
      <Card className="w-full max-w-md p-6 sm:p-8 md:p-10 border border-soft-silk-border bg-white shadow-lg">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl text-ink-charcoal mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-deep-taupe text-sm sm:text-base">
            {isLogin
              ? "Sign in to your account to continue"
              : "Join us to track your orders and enjoy exclusive benefits"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-ink-charcoal mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-soft-silk-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-crimson focus:border-transparent"
                  required={!isLogin}
                />
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
                  required={!isLogin}
                />
              </div>
            </>
          )}

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

          <div>
            <label className="block text-sm font-medium text-ink-charcoal mb-1">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-soft-silk-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-crimson focus:border-transparent"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-ink-charcoal mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-soft-silk-border rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-crimson focus:border-transparent"
                required
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-saffron-crimson hover:bg-estate-gold text-white py-6 text-base font-medium"
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          {isLogin && (
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-saffron-crimson hover:text-estate-gold text-sm font-medium transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          )}
          <div className="text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
              className="text-saffron-crimson hover:text-estate-gold text-sm font-medium transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-deep-taupe">Loading...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
