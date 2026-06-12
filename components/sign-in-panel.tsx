"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { roleDescriptions, roleLabels, type Role } from "@/lib/types";

const demoRoles: Role[] = [
  "customer",
  "support",
  "inventory_manager",
  "operations_manager",
  "admin"
];

export function SignInPanel() {
  const supabase = createBrowserSupabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    supabase
      ? "Use a Supabase Auth account to sign in."
      : "Supabase env vars are not configured, so the app is in demo mode."
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handlePasswordAuth(mode: "sign-in" | "sign-up") {
    if (!supabase) {
      setMessage("Add Supabase env vars to enable real user accounts.");
      return;
    }

    setIsLoading(true);
    const result =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setIsLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    setMessage(
      mode === "sign-in"
        ? "Signed in. Return to the commerce workspace."
        : "Account created. Check your email if confirmation is enabled."
    );
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <Link href="/" className="quiet-link">
          <ArrowLeft size={16} />
          Back to workspace
        </Link>

        <div className="auth-card">
          <div className="auth-icon">
            <KeyRound size={24} />
          </div>
          <h1>Sign in to Sebby Commerce</h1>
          <p>
            User accounts are powered by Supabase Auth. Staff permissions are
            resolved from the protected profile role attached to each user.
          </p>

          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
            />
          </label>

          <div className="auth-actions">
            <button
              className="button primary"
              disabled={isLoading}
              onClick={() => handlePasswordAuth("sign-in")}
              type="button"
            >
              Sign in
            </button>
            <button
              className="button secondary"
              disabled={isLoading}
              onClick={() => handlePasswordAuth("sign-up")}
              type="button"
            >
              Create account
            </button>
          </div>

          <p className="form-message">{message}</p>
        </div>

        <div className="demo-role-list" aria-label="Demo roles">
          <div className="section-heading">
            <ShieldCheck size={18} />
            Demo permission roles
          </div>
          {demoRoles.map((role) => (
            <div className="demo-role" key={role}>
              <strong>{roleLabels[role]}</strong>
              <span>{roleDescriptions[role]}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
