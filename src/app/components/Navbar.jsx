"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [user, setUser] = useState(null);

  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Website Logo / Name */}
        <Link href="/" className="text-xl font-bold">
          ExamShelf
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/explore">Explore</Link>
          <Link href="/tutorials">Tutorials</Link>

          {user ? (
            <>
              <Link href="/purchases">My Purchases</Link>

              <Link href="/account">Account</Link>

              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>

      </div>
    </nav>
  );
}