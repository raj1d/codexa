"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock, Mail, User, AlertCircle, ArrowRight } from "lucide-react";
import { APP_NAME } from "@codexa/shared";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [githubUsername, setGithubUsername] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          githubUsername: githubUsername || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/auth/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignUp = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black text-[#E1E0CC]">
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Link
            href="/"
            className="text-3xl tracking-tight text-white font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {APP_NAME}<sup className="text-xs ml-0.5 text-[#DEDBC8]">®</sup>
          </Link>
        </div>

        <Card className="border border-white/[0.08] bg-[#101010] p-7 sm:p-8 shadow-2xl rounded-2xl">
          <CardHeader className="p-0 pb-6 text-center">
            <CardTitle
              className="text-3xl text-white font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Create Student Account
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-mono">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={handleGithubSignUp}
              className="w-full flex items-center justify-center gap-2"
            >
              <GithubIcon className="h-4 w-4" />
              <span>Sign Up with GitHub</span>
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="font-mono text-xs text-gray-500 uppercase">
                or details
              </span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                  <User className="h-3 w-3 text-[#DEDBC8]" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 px-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs focus:outline-none focus:border-[#DEDBC8] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-[#DEDBC8]" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 px-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs focus:outline-none focus:border-[#DEDBC8] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-[#DEDBC8]" />
                  Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 px-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs focus:outline-none focus:border-[#DEDBC8] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                  <GithubIcon className="h-3 w-3 text-[#DEDBC8]" />
                  GitHub Username (optional)
                </label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="h-11 px-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs focus:outline-none focus:border-[#DEDBC8] transition-colors"
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={loading}
                className="w-full mt-2 font-medium"
              >
                {loading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>

            <div className="pt-4 border-t border-white/[0.06] text-center font-mono text-xs text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#DEDBC8] hover:underline ml-1 font-medium"
              >
                Sign In &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
