"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.refresh();
    router.push("/journal");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-[var(--theme-border)]/60 px-4 py-2.5 text-[var(--text-base)] text-[var(--theme-text)]">
          {error}
        </p>
      )}
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-[var(--text-base)] font-medium text-[var(--theme-text)]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-2.5 text-[var(--text-base)] text-[var(--theme-text)] transition-colors duration-150 focus:border-[var(--theme-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-[var(--text-base)] font-medium text-[var(--theme-text)]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="w-full rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-2.5 text-[var(--text-base)] text-[var(--theme-text)] transition-colors duration-150 focus:border-[var(--theme-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent)]"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[var(--theme-accent)] px-4 py-2.5 text-[var(--text-base)] font-medium text-white transition-colors duration-150 hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Creating account…" : "Sign up"}
      </button>
    </form>
  );
}
