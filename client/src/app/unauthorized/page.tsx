"use client";

import Link from "next/link";
import { Shield, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-red-50 via-white to-red-100">
      <div className="w-full max-w-md text-center">
        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-100 rounded-full">
              <Shield className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Access Denied
          </h1>

          <p className="mb-6 text-gray-600">
            You don't have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>

          {user && (
            <div className="p-4 mb-6 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Current user:</span>{" "}
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Role:</span> {user.role}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center justify-center w-full px-4 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Link>

            <Link
              href="/login"
              className="flex items-center justify-center w-full px-4 py-3 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>

            {user && (
              <button
                onClick={logout}
                className="w-full px-4 py-3 text-red-700 transition-colors bg-red-100 rounded-lg hover:bg-red-200"
              >
                Logout and Login as Different User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
