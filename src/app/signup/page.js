"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  // Form state
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Username availability state
  const [usernameStatus, setUsernameStatus] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Check username after user stops typing
  useEffect(() => {
    const cleanUsername = username.trim().toLowerCase();

    setUsernameStatus("");

    if (!cleanUsername) {
      return;
    }

    if (cleanUsername.length < 3) {
      setUsernameStatus("invalid");
      return;
    }

    if (cleanUsername.length > 20) {
      setUsernameStatus("invalid");
      return;
    }

    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      setUsernameStatus("invalid");
      return;
    }

    setCheckingUsername(true);

    const timer = setTimeout(async () => {
      const { data, error } = await supabase.rpc(
        "is_username_available",
        {
          check_username: cleanUsername,
        }
      );

      if (error) {
        console.error(
          "Username availability error:",
          error.message
        );

        setUsernameStatus("error");
        setCheckingUsername(false);
        return;
      }

      setUsernameStatus(data ? "available" : "taken");
      setCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  async function handleSignup(event) {
    event.preventDefault();

    setMessage("");

    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Full name validation
    if (!cleanFullName) {
      setMessage("Please enter your full name.");
      return;
    }

    // Username validation
    if (!cleanUsername) {
      setMessage("Please enter a username.");
      return;
    }

    if (cleanUsername.length < 3) {
      setMessage("Username must be at least 3 characters.");
      return;
    }

    if (cleanUsername.length > 20) {
      setMessage("Username must be 20 characters or less.");
      return;
    }

    if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
      setMessage(
        "Username can contain only lowercase letters, numbers, and underscores."
      );
      return;
    }

    // Check username availability before signup
    const {
      data: usernameAvailable,
      error: usernameError,
    } = await supabase.rpc("is_username_available", {
      check_username: cleanUsername,
    });

    if (usernameError) {
      console.error(
        "Username availability error:",
        usernameError.message
      );

      setMessage("Unable to check username. Please try again.");
      return;
    }

    if (!usernameAvailable) {
      setMessage("That username is already taken.");
      return;
    }

    // Password validation
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,

        data: {
          full_name: cleanFullName,
          username: cleanUsername,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error.message);

      if (
        error.message
          .toLowerCase()
          .includes("already registered")
      ) {
        setMessage(
          "An account with this email already exists."
        );
      } else {
        setMessage(
          "Unable to create your account. Please try again."
        );
      }

      setLoading(false);
      return;
    }

    setMessage(
      "Account created! Please check your email to verify your account."
    );

    setLoading(false);
  }

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Create your ExamShelf account
          </h1>

          <p className="mt-3 text-gray-600">
            Create an account to access resources and purchases.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="mt-8">

          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="text-sm font-medium"
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="First Last Name"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Username */}
          <div className="mt-5">
            <label
              htmlFor="username"
              className="text-sm font-medium"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="your_username"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />

            {/* Username Status */}
            {checkingUsername && (
              <p className="mt-2 text-xs text-gray-500">
                Checking username...
              </p>
            )}

            {usernameStatus === "taken" && (
              <p className="mt-2 text-xs text-red-600">
                That username is already taken.
              </p>
            )}

            {usernameStatus === "available" && (
              <p className="mt-2 text-xs text-green-600">
                ✓ Username is available.
              </p>
            )}

            {usernameStatus === "invalid" && (
              <p className="mt-2 text-xs text-red-600">
                Username must be 3–20 characters and contain
                only letters, numbers, and underscores.
              </p>
            )}

            {usernameStatus === "error" && (
              <p className="mt-2 text-xs text-red-600">
                Unable to check username. Please try again.
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mt-5">
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
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Password */}
          <div className="mt-5">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Password
            </label>

            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Create a password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-black"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Password must be at least 8 characters.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">
            {message}
          </p>
        )}

        {/* Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}

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