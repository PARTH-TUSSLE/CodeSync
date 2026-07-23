"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiClient } from "@/lib/api/client";
import { useToast } from "@/components/ui/Toast";
import { TokenDisplay } from "@/components/auth/TokenDisplay";
import type { User } from "@/types/models";

export function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signedUpToken, setSignedUpToken] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      interface SignupResponse {
        message: string;
        user: User;
        token: string;
      }

      const data = await apiClient<SignupResponse>("/signup", {
        method: "POST",
        body: { username, email, password },
      });

      login(data.token, data.user);
      toast.success("Account created!");
      setSignedUpToken(data.token);

      setTimeout(() => {
        router.push("/repos");
      }, 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (signedUpToken) {
    return (
      <div className="space-y-4">
        <p className="text-emerald">
          Account created! Redirecting...
        </p>
        <TokenDisplay token={signedUpToken} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="mb-1 block text-sm font-medium text-muted"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          required
          minLength={3}
          maxLength={50}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="glass-input w-full px-4 py-2 text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-muted"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
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
          placeholder="At least 6 characters"
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
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
