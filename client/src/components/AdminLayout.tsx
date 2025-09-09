"use client";

import { ReactNode } from "react";
import { useAuth } from "@/lib/AuthContext";
import AdminSidebar from "./AdminSidebar";
import AppBar from "./AppBar";
import { AlertCircle } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AdminLayout({
  children,
  title = "Admin Dashboard",
  description,
}: AdminLayoutProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div
            className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"
            aria-hidden="true"
          ></div>
          <span className="mt-4 text-gray-600">Loading...</span>
          <span className="sr-only">Loading, please wait</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppBar />
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div
            className="flex items-start p-4 mb-6 text-red-700 border-l-4 border-red-500 rounded bg-red-50"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium">Access Denied</p>
              <p>You must be logged in to access the admin area.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppBar />
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div
            className="flex items-start p-4 mb-6 text-red-700 border-l-4 border-red-500 rounded bg-red-50"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium">Access Denied</p>
              <p>You do not have permission to access the admin area.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      <AdminSidebar />

      <div className="pt-6 lg:pl-64 lg:pt-10">
        <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {(title || description) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              )}
              {description && (
                <p className="mt-2 text-gray-600">{description}</p>
              )}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
