"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleResetRequest(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabase.auth.resetPasswordForEmail(
      cleanEmail,
      {
        redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
      }
    );

    if (error) {
      console.error("Password reset error:", error.message);

      setMessage(
        "Unable to send the reset email. Please try again."
      );

      setLoading(false);
      return;
    }

    setMessage(
      "If an account exists with this email, a password reset link has been sent."
    );

    setLoading(false);
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Forgot your password?
          </h1>

          <p className="mt-3 text-gray-600">
            Enter your email and we&apos;ll send you a password
            reset link.
          </p>
        </div>

        <form onSubmit={handleResetRequest} className="mt-8">
          <label
            htmlFor="email"
            className="text-sm font-medium"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}

          <Link
            href="/login"
            className="font-semibold text-black hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}