"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import Image from 'next/image';
import { newVisitorAPI, VisitorForm } from "@/lib/api";
import {
  Mail,
  Search,
  ArrowRight,
  Check,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import AppBar from "@/components/AppBar";

export default function BeenHereBeforePage() {
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<VisitorForm[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(e.target.value);
  };

  const searchVisitor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchEmail) {
      setError("Please enter an email address to search");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(searchEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSearching(true);
    setError("");
    setSearchResults([]);

    try {
      // Use the API to search for visitors by email
      const results = await newVisitorAPI.searchByEmail(searchEmail);

      if (results.length === 0) {
        setError("No previous visits found for this email address.");
      }
      // console.log(results)
      setSearchResults([results]);
    } catch (err) {
      console.error("Error searching for visitor:", err);
      setError("Failed to search for visitor. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const selectReturnVisitor = (visitor: VisitorForm) => {
    // Store visitor data in session storage to be used in the check-in page
    sessionStorage.setItem("returnVisitor", JSON.stringify(visitor));

    // Show success message
    setSuccess("Your information has been found! Redirecting to check-in...");

    // Redirect to check-in page after a short delay
    setTimeout(() => {
      router.push("/check-in");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-100 to-purple-100">
      <AppBar />

      <div className="max-w-4xl px-4 py-12 mx-auto">
        <div className="overflow-hidden bg-white shadow-lg rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left side - Form */}
            <div className="p-8 md:p-10">
              <Link
                href="/"
                className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>

              <h1 className="mb-2 text-3xl font-bold text-blue-900">
                Returning Visitor
              </h1>
              <p className="mb-8 text-gray-600">
                If you&apos;ve visited us before, we can quickly retrieve your
                information to make check-in faster.
              </p>

              {error && (
                <div className="p-4 mb-6 text-red-700 border-l-4 border-red-500 rounded bg-red-50">
                  <div className="flex">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="p-4 mb-6 text-green-700 border-l-4 border-green-500 rounded bg-green-50">
                  <div className="flex">
                    <Check className="w-5 h-5 mr-2" />
                    <div>
                      <p className="font-medium">Success</p>
                      <p className="text-sm">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={searchVisitor} className="space-y-6">
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
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchEmail}
                      onChange={handleSearchChange}
                      disabled={isSearching}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSearching || !searchEmail}
                  className="flex items-center justify-center w-full px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isSearching ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Find My Information
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    First time visitor?{" "}
                    <Link
                      href="/check-in"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Register here
                    </Link>
                  </p>
                </div>
              </form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-lg font-medium text-blue-900">
                    Your Previous Visits
                  </h3>
                  <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
                    <ul className="divide-y divide-gray-200">
                      {searchResults.map((visitor) => (
                        <li
                          key={visitor._id}
                          className="p-4 transition-colors hover:bg-gray-50"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center">
                                <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                                  <span className="font-medium text-blue-700">
                                    {visitor.firstName?.charAt(0)}
                                    {visitor.lastName?.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {visitor.firstName} {visitor.lastName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {visitor.email}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 ml-13">
                                <p className="text-sm text-gray-500">
                                  <span className="font-medium">
                                    Last visit:
                                  </span>{" "}
                                  {new Date(
                                    visitor.visitStartDate ||
                                      visitor.visitEndDate
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => selectReturnVisitor(visitor)}
                              className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                              Continue
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Image */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'url("/pattern.svg")',
                    backgroundSize: "100px",
                  }}
                ></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-white">
                <div className="max-w-md p-8 bg-white/10 backdrop-blur-sm rounded-xl">
                  <h2 className="mb-4 text-2xl font-bold">Welcome Back!</h2>
                  <p className="mb-4">
                    We&apos;re glad to see you again. Using your email, we can
                    quickly retrieve your information to make your check-in
                    process faster and easier.
                  </p>
                  <p>
                    If you have any questions or need assistance, please
                    don&apos;t hesitate to ask our reception staff.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
