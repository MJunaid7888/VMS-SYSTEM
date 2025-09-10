"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login({ email, password });
      router.push("/admin/dashboard"); // Redirect to dashboard after login
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-purple-50 to-white">
      <div className="flex items-center justify-center flex-grow p-4 sm:p-6">
        <div className="flex flex-col w-full max-w-5xl overflow-hidden bg-white shadow-xl md:flex-row rounded-2xl sm:rounded-3xl">
          {/* Left form section */}
          <div className="p-6 md:w-1/2 sm:p-8 md:p-12">
            <Link
              href="/"
              className="inline-flex items-center mb-4 text-blue-900 hover:text-blue-700 sm:mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2 sm:h-5 sm:w-5" />
              Back
            </Link>
            <h2 className="mb-1 text-2xl font-bold text-blue-900 sm:text-3xl sm:mb-2">
              Welcome Back
            </h2>
            <p className="mb-6 text-sm text-gray-600 sm:mb-8 sm:text-base">
              Please sign in to access your account
            </p>

            {error && (
              <div className="p-3 mb-4 text-red-700 border-l-4 border-red-500 rounded bg-red-50 sm:p-4 sm:mb-6">
                <p className="text-sm font-medium sm:text-base">Login Error</p>
                <p className="text-xs sm:text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400 sm:h-5 sm:w-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400 sm:h-5 sm:w-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span>Remember Me</span>
                </label>
                <Link
                  href="/reset-password"
                  className="text-sm text-blue-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 text-white rounded-lg py-2.5 sm:py-3 font-semibold hover:bg-blue-800 disabled:bg-blue-300 transition-colors text-sm sm:text-base mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-5 sm:mt-6">
              <p className="text-xs text-gray-600 sm:text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-blue-700 hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Right image section */}
          <div className="relative hidden md:block md:w-1/2">
            <Image
              src="/login-image.jpg"
              alt="Login Visual"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-900/40 to-purple-900/40">
              <div className="p-6 text-center text-white sm:p-8">
                <h3 className="mb-3 text-2xl font-bold sm:text-3xl sm:mb-4">
                  Visitor Management System
                </h3>
                <p className="max-w-md text-base sm:text-lg">
                  Streamline your visitor check-in process with our secure and
                  efficient system
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
