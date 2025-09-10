"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  Mail,
  Phone,
  Building,
  User,
  Lock,
  Briefcase,
  UserPlus,
} from "lucide-react";
import Image from "next/image";

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    phoneNumber: "",
    role: "host", // Default role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await signup({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        department: form.department,
        phoneNumber: form.phoneNumber,
        role: form.role,
      });
      router.push("/login"); // Redirect to dashboard after signup
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-indigo-100 to-purple-200">
      <div className="flex items-center justify-center flex-grow">
        <div className="flex flex-col w-full max-w-5xl overflow-hidden bg-white shadow-xl md:flex-row rounded-3xl">
          {/* Left image section */}
          <div className="relative hidden bg-blue-900 md:block md:w-2/5">
            <Image
              src="/signup-image.jpg"
              alt="Signup Visual"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              style={{ objectFit: "cover" }}
              priority
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-900/70 to-purple-900/70">
              <div className="p-8 text-center text-white">
                <UserPlus className="w-16 h-16 mx-auto mb-6" />
                <h3 className="mb-4 text-3xl font-bold">Join Our Team</h3>
                <p className="text-lg">
                  Create an account to access the visitor management system and
                  help streamline the check-in process.
                </p>
              </div>
            </div>
          </div>

          {/* Right form section */}
          <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
            <h2 className="mb-1 text-2xl font-bold text-blue-900">
              Create Account
            </h2>
            <p className="mb-6 text-gray-600">
              Sign up for a new account to get started
            </p>

            {error && (
              <div className="p-4 mb-6 text-red-700 border-l-4 border-red-500 rounded bg-red-50">
                <p className="font-medium">Registration Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="department"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Building className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="department"
                      id="department"
                      value={form.department}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                      placeholder="IT, HR, Marketing, etc."
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                    </div>
                    <select
                      name="role"
                      id="role"
                      value={form.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    >
                      <option value="host">Host</option>
                      <option value="staff">Staff</option>
                      <option value="security">Security</option>
                      <option value="manager">Manager</option>
                      <option value="trainer">Trainer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters with a number and
                  special character
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center w-full py-3 mt-6 text-white transition bg-blue-900 rounded-lg hover:bg-blue-800 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="mt-4 text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-700 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
