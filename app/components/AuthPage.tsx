"use client"
import React, { useState } from "react";
import { API_BASE } from "@/lib/config";

interface AuthPageProps {
  onAuthSuccess: (user: { name: string; email: string }) => void;
}

type AuthMode = "signin" | "signup";

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const switchMode = (m: AuthMode) => {
    setMode(m);
    setError(null);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const endpoint =
        mode === "signin"
          ? `${API_BASE}/api/auth/sign-in/email`
          : `${API_BASE}/api/auth/sign-up/email`;

      const body =
        mode === "signin"
          ? { email, password }
          : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message ?? (mode === "signin" ? "Invalid email or password." : "Could not create account."));
      }

      // better-auth returns { user: { name, email, ... } }
      const user = data?.user ?? data;
      onAuthSuccess({ name: user?.name ?? email.split("@")[0], email });
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center px-4 selection:bg-[#fde68a] selection:text-[#78350f]">
      {/* Background blobs in Akwa Ibom Orange & Green */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-[#e8720c]/12 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[550px] h-[550px] rounded-full bg-[#166534]/12 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#d4af37]/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e8720c] to-[#c25e0a] flex items-center justify-center shadow-lg shadow-[#e8720c]/25 mb-3 ring-2 ring-[#d4af37]/60">
            <span className="material-symbols-outlined text-[#fde68a] text-[32px]">menu_book</span>
          </div>
          <h1 className="text-[26px] font-bold text-[#1c1917] tracking-tight font-serif">
            EduTranslate <span className="text-[#e8720c]">Efik</span>
          </h1>
          <p className="text-[13px] text-[#44403c] mt-1 font-medium">Akwa Ibom Heritage Education Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(26,26,26,0.08)] border border-[#e7e0d3] overflow-hidden">
          {/* Mode toggle */}
          <div className="flex border-b border-[#e7e0d3]">
            {(["signin", "signup"] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-3.5 text-[14px] font-semibold transition-all ${mode === m
                  ? "text-[#e8720c] border-b-2 border-[#e8720c] bg-[#fff4ea]"
                  : "text-[#44403c] hover:text-[#1c1917] hover:bg-gray-50"
                  }`}
              >
                {m === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {/* Name field — sign up only */}
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-name" className="text-[13px] font-medium text-[#1c1917]">
                  Full Name
                </label>
                <div className="flex items-center gap-2 border border-[#d0c5af] rounded-lg px-3 py-2.5 focus-within:border-[#e8720c] focus-within:ring-2 focus-within:ring-[#e8720c]/15 transition-all bg-[#fdfbf7]">
                  <span className="material-symbols-outlined text-[18px] text-[#166534]">person</span>
                  <input
                    id="auth-name"
                    type="text"
                    placeholder="E.g. Ekanem Henshaw"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={mode === "signup"}
                    className="flex-1 bg-transparent text-[14px] text-[#1c1917] placeholder-[#a8a29e] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-email" className="text-[13px] font-medium text-[#1c1917]">
                Email Address
              </label>
              <div className="flex items-center gap-2 border border-[#d0c5af] rounded-lg px-3 py-2.5 focus-within:border-[#e8720c] focus-within:ring-2 focus-within:ring-[#e8720c]/15 transition-all bg-[#fdfbf7]">
                <span className="material-symbols-outlined text-[18px] text-[#166534]">mail</span>
                <input
                  id="auth-email"
                  type="email"
                  placeholder="you@school.edu.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-[14px] text-[#1c1917] placeholder-[#a8a29e] outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password" className="text-[13px] font-medium text-[#1c1917]">
                  Password
                </label>
                {mode === "signin" && (
                  <span className="text-[12px] text-[#e8720c] cursor-pointer hover:underline font-medium">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 border border-[#d0c5af] rounded-lg px-3 py-2.5 focus-within:border-[#e8720c] focus-within:ring-2 focus-within:ring-[#e8720c]/15 transition-all bg-[#fdfbf7]">
                <span className="material-symbols-outlined text-[18px] text-[#166534]">lock</span>
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signup" ? "Min. 8 characters" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === "signup" ? 8 : undefined}
                  className="flex-1 bg-transparent text-[14px] text-[#1c1917] placeholder-[#a8a29e] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-[#78716c] hover:text-[#e8720c] transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-[11px] text-[#78716c]">
                  Use at least 8 characters with a mix of letters and numbers.
                </p>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-start gap-2 bg-[#fef2f2] border border-[#fca5a5] rounded-lg px-3 py-2.5">
                <span className="material-symbols-outlined text-[16px] text-[#b91c1c] mt-0.5">error</span>
                <p className="text-[13px] text-[#b91c1c]">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 w-full py-3 rounded-xl bg-gradient-to-r from-[#e8720c] to-[#c25e0a] hover:from-[#c25e0a] hover:to-[#a84d06] text-white font-semibold text-[15px] active:scale-[0.98] transition-all shadow-md shadow-[#e8720c]/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                mode === "signin" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-[12px] text-[#78716c] mt-6">
          By continuing, you agree to EduTranslate's{" "}
          <span className="text-[#e8720c] cursor-pointer hover:underline font-medium">Terms</span> and{" "}
          <span className="text-[#e8720c] cursor-pointer hover:underline font-medium">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
