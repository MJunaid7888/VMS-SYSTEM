"use client";

import { useState } from "react";
// import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { newVisitorAPI, VisitorForm } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import {
  User,
  Mail,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  LogOut,
  QrCode,
} from "lucide-react";
import AppBar from "@/components/AppBar";
import QRCodeScanner from "@/components/QRCodeScanner";

export default function CheckOut() {
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState<VisitorForm[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  const { token } = useAuth();
  // const router = useRouter();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(e.target.value);
  };

  const searchVisitor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!searchEmail) {
      setError("Please enter an email address");
      return;
    }

    setIsSearching(true);
    setError(null);
    setSuccess(null);
    // setSearchResults([]);

    try {
      const visitors = await newVisitorAPI.searchByEmail(searchEmail);

      // Filter for only checked-in visitors
      const checkedInVisitors = visitors;

      if (!checkedInVisitors) {
        setError("No checked-in visitors found with this email address");
      } else {
        setSearchResults([checkedInVisitors]);
      }
    } catch (err) {
      console.error("Error searching for visitor:", err);
      setError(
        err instanceof Error ? err.message : "Failed to search for visitor"
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleCheckOut = async (visitorId: string) => {
    setCheckingOut(visitorId);
    setError(null);
    setSuccess(null);

    try {
      await newVisitorAPI.checkOutVisitor(visitorId, token || "");

      // Update the search results to reflect the change
      setSearchResults((prev) =>
        prev.filter((visitor) => visitor._id !== visitorId)
      );

      setSuccess(
        "You have been checked out successfully. Thank you for your visit!"
      );
    } catch (err) {
      console.error("Error checking out visitor:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to check out. Please try again or contact reception."
      );
    } finally {
      setCheckingOut(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />

      {/* QR Code Scanner */}
      {showScanner && token && (
        <QRCodeScanner token={token} onClose={() => setShowScanner(false)} />
      )}

      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-3">
            <div className="flex items-center mb-2">
              <div className="p-2 mr-3 bg-blue-100 rounded-full">
                <LogOut className="w-6 h-6 text-blue-700" />
              </div>
              <h1 className="text-3xl font-bold text-blue-900 md:text-4xl">
                Visitor Check-Out
              </h1>
            </div>
            <p className="mb-6 text-gray-600">
              Please enter your email address to find your visit and check out.
            </p>

            {error && (
              <div className="flex items-start px-6 py-4 mb-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
                <div className="flex-shrink-0 p-2 mr-4 bg-red-100 rounded-full">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="mb-1 text-lg font-medium">Check-Out Error</p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="flex items-start px-6 py-4 mb-6 text-green-700 border border-green-200 rounded-lg bg-green-50">
                <div className="flex-shrink-0 p-2 mr-4 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="mb-1 text-lg font-medium">
                    Check-Out Successful!
                  </p>
                  <p className="text-green-700">{success}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link
                      href="/"
                      className="px-4 py-2 text-sm font-medium text-green-700 transition-colors bg-white border border-green-300 rounded-md hover:bg-green-50"
                    >
                      Return to Home
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Search Form */}
            <div className="p-6 mb-6 bg-white shadow-md rounded-xl">
              <h2 className="flex items-center mb-4 text-xl font-semibold">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Find Your Visit
              </h2>

              <form onSubmit={searchVisitor} className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchEmail}
                      onChange={handleSearchChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching || !searchEmail}
                    className="flex items-center justify-center px-6 py-3 text-white transition-colors bg-blue-700 rounded-lg shadow-sm hover:bg-blue-800 disabled:bg-blue-300 whitespace-nowrap"
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
                        Find My Visit
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-center mt-4">
                <div className="w-full border-t border-gray-200"></div>
                <span className="px-3 text-sm text-gray-500 bg-white">OR</span>
                <div className="w-full border-t border-gray-200"></div>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowScanner(true)}
                  className="flex items-center justify-center px-4 py-2 text-gray-800 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Scan QR Code
                </button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="flex items-center px-5 py-3 border-b border-gray-200 bg-blue-50">
                  <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                  <h5 className="font-medium text-blue-900">
                    Found {searchResults.length} active{" "}
                    {searchResults.length === 1 ? "visit" : "visits"}
                  </h5>
                </div>
                <ul className="divide-y divide-gray-200">
                  {searchResults.map((visitor) => (
                    <li
                      key={visitor._id}
                      className="p-5 transition-colors hover:bg-blue-50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center">
                            <div className="flex items-center justify-center w-10 h-10 mr-3 text-white rounded-full shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600">
                              <span className="font-medium">
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
                          <div className="grid grid-cols-1 mt-3 ml-13 sm:grid-cols-2 gap-x-6 gap-y-1">
                            <p className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="mr-1 font-medium">
                                Check-in time:
                              </span>
                              {visitor.createdAt
                                ? new Date(
                                    visitor.createdAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Not recorded"}
                            </p>
                            <p className="flex items-center text-sm text-gray-500">
                              <User className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="mr-1 font-medium">
                                Host:
                              </span>{" "}
                              {visitor.hostEmployee || "Not specified"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCheckOut(visitor._id)}
                          disabled={checkingOut === visitor._id}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center shadow-sm disabled:bg-blue-300"
                        >
                          {checkingOut === visitor._id ? (
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
                              Processing...
                            </>
                          ) : (
                            <>
                              <LogOut className="w-4 h-4 mr-2" />
                              Check Out
                            </>
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Side Content */}
          <div className="space-y-6 lg:col-span-2">
            <div className="p-6 bg-white shadow-md rounded-xl">
              <h2 className="mb-4 text-xl font-semibold">
                Check-Out Instructions
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Please check out before leaving the premises. This helps us
                  maintain accurate records and ensure security.
                </p>
                <ol className="pl-5 space-y-2 list-decimal">
                  <li>Enter the email address you used during check-in</li>
                  <li>Select your visit from the list</li>
                  <li>Click the &quot;Check Out&quot; button</li>
                  <li>Return your visitor badge to reception</li>
                </ol>
                <p className="p-3 mt-4 text-sm rounded-lg bg-blue-50">
                  If you have any issues checking out, please contact the
                  reception desk for assistance.
                </p>
              </div>
            </div>

            <div className="overflow-hidden bg-white shadow-md rounded-xl">
              <Image
                src="/reception.jpeg"
                alt="Reception"
                width={500}
                height={300}
                className="object-cover w-full h-48"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
