"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("userId", data.user.id);

      window.location.href = "/";
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold mb-2">
            STAC Inventory Login
          </h1>

          <p className="text-muted-foreground mb-6">
            Login using your assigned role.
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-black/20 border border-gray-700"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-black/20 border border-gray-700"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 transition-colors py-3 rounded-lg font-semibold"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

         
        </div>
      </motion.div>
    </div>
  );
}