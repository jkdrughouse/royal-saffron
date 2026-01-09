// OTP generation and verification utilities

// Store OTPs in memory (in production, use Redis or a database)
const otpStore = new Map<string, { otp: string; expiresAt: number; email: string }>();

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTP with expiration (5 minutes)
export function storeOTP(email: string, otp: string): void {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(email.toLowerCase(), { otp, expiresAt, email: email.toLowerCase() });
  
  // Clean up expired OTPs
  setTimeout(() => {
    otpStore.delete(email.toLowerCase());
  }, 5 * 60 * 1000);
}

// Verify OTP
export function verifyOTP(email: string, otp: string): boolean {
  const stored = otpStore.get(email.toLowerCase());
  
  if (!stored) {
    return false;
  }
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  
  if (stored.otp !== otp) {
    return false;
  }
  
  // OTP verified, remove it
  otpStore.delete(email.toLowerCase());
  return true;
}

// Get OTP for email (for testing/debugging)
export function getOTP(email: string): string | null {
  const stored = otpStore.get(email.toLowerCase());
  if (!stored || Date.now() > stored.expiresAt) {
    return null;
  }
  return stored.otp;
}
