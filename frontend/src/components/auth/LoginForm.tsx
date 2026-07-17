"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/Toast";
import type { User } from "@/types/models";

export function LoginForm() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isEmail = usernameOrEmail.includes("@");
      const body = isEmail
        ? { email: usernameOrEmail, password }
        : { username: usernameOrEmail, password };

      interface LoginResponse {
        msg: string;
        user: User;
        token: string;
      }

      const data = await apiClient<LoginResponse>("/login", {
        method: "POST",
        body,
      });

      login(data.token, data.user);
      toast.success("Signed in successfully!");

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/";
      router.push(redirect);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="usernameOrEmail"
          className="mb-1 block text-sm font-medium text-muted"
        >
          Username or Email
        </label>
        <input
          id="usernameOrEmail"
          type="text"
          required
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          placeholder="Enter your username or email"
          className="glass-input w-full px-4 py-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-muted"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="glass-input w-full px-4 py-2 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-warm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full px-4 py-2 text-sm"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
