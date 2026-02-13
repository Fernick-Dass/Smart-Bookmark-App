"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AuthButton() {
  const [user, setUser] = useState(null as any);
  const [loading, setLoading] = useState(false as boolean);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user ?? null);
    }
    load();

    const { data } = supabase.auth.onAuthStateChange((_: string, session: any) => {
      setUser(session?.user ?? null);
    });

    const subscription = data?.subscription;

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await supabase.auth.signInWithOAuth({ provider: "google" });
    } catch (err) {
      console.error("Google sign-in failed", err);
      alert("Sign-in failed");
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Sign-out failed", err);
      alert("Sign-out failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Redirecting…" : "Sign in with Google"}
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="text-sm">Hi, {user.email}</div>
      <button
        onClick={signOut}
        disabled={loading}
        className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300 disabled:opacity-60"
      >
        Sign out
      </button>
    </div>
  );
}


