"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  QrCode,
  UserPlus,
  User,
  Clock,
  Shield,
  BookOpen,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import QRCodeScanner from "@/components/QRCodeScanner";
import AppBar from "@/components/AppBar";

export default function Home() {
  const [showScanner, setShowScanner] = useState(false);
  const { user, token } = useAuth();

  // Ensure hydration consistency
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const features = [
    {
      icon: <UserPlus className="w-6 h-6 text-blue-600" />,
      title: "Easy Check-in",
      description:
        "Streamlined visitor registration process with digital forms",
    },
    {
      icon: <QrCode className="w-6 h-6 text-blue-600" />,
      title: "QR Code Passes",
      description: "Generate secure QR codes for quick access and verification",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Security Compliance",
      description: "Ensure all visitors meet security requirements",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: "Training Modules",
      description: "Required safety and security training for visitors",
    },
  ];

  return (
    <main className="min-h-screen font-sans bg-white">
      {/* QR Code Scanner */}
      {showScanner && token && (
        <QRCodeScanner token={token} onClose={() => setShowScanner(false)} />
      )}

      {/* App Bar */}
      <AppBar />

      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white md:py-16 lg:py-24">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url("/pattern.svg")',
            backgroundSize: "100px",
          }}
        ></div>
        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 rounded-full mb-4 sm:mb-6">
                <span className="text-xs font-medium text-blue-800 sm:text-sm">
                  Visitor Management System
                </span>
              </div>
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl sm:mb-6">
                Streamline Your{" "}
                <span className="text-blue-700">Visitor Experience</span>
              </h1>
              <p className="max-w-2xl mx-auto mb-6 text-base text-gray-600 sm:text-lg md:text-xl sm:mb-8 lg:mx-0">
                A comprehensive solution for managing visitors, security
                compliance, and access control with digital passes.
              </p>

              <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 lg:flex lg:flex-wrap sm:gap-4 sm:mb-8">
                <Link
                  href="/check-in"
                  className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-all bg-blue-700 rounded-lg shadow-md hover:bg-blue-800 sm:px-6 md:px-8 md:py-4 hover:shadow-lg"
                >
                  New Visitor <ArrowUpRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/been-here-before"
                  className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-all bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 sm:px-6 md:px-8 md:py-4 hover:shadow-lg"
                >
                  Returning Visitor <User className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/check-out"
                  className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-all bg-green-600 rounded-lg shadow-md hover:bg-green-700 sm:px-6 md:px-8 md:py-4 hover:shadow-lg"
                >
                  Check Out <Clock className="w-5 h-5 ml-2" />
                </Link>
                <button
                  className="flex items-center justify-center w-full px-4 py-3 font-semibold text-blue-700 transition-all border-2 border-blue-700 rounded-lg hover:bg-blue-50 sm:px-6 md:px-8 md:py-4"
                  onClick={() => setShowScanner(true)}
                >
                  Scan QR <QrCode className="w-5 h-5 ml-2" />
                </button>
              </div>

              {user && user.role === "admin" && (
                <div className="inline-block mt-4">
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center font-medium text-blue-700 hover:text-blue-900"
                  >
                    Go to Admin Dashboard{" "}
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Link>
                </div>
              )}
            </div>

            {/* Hero Image */}
            <div className="relative mt-6 lg:mt-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20"></div>
              <div className="relative overflow-hidden bg-white shadow-xl rounded-2xl">
                <Image
                  src="/img2.png"
                  alt="Visitor Management"
                  width={600}
                  height={400}
                  className="object-cover w-full h-auto"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white rounded-lg shadow-lg p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3 max-w-[180px] sm:max-w-none">
                <div className="bg-green-100 rounded-full p-1.5 sm:p-2 flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900 sm:text-sm">
                    Quick Check-in
                  </p>
                  <p className="text-xs text-gray-500">
                    Average time: 45 seconds
                  </p>
                </div>
              </div>
              <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 bg-white rounded-lg shadow-lg p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3 max-w-[180px] sm:max-w-none">
                <div className="bg-blue-100 rounded-full p-1.5 sm:p-2 flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900 sm:text-sm">
                    Secure Access
                  </p>
                  <p className="text-xs text-gray-500">
                    Enterprise-grade security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white sm:py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl sm:mb-4">
              Key Features
            </h2>
            <p className="max-w-3xl mx-auto text-base text-gray-600 sm:text-lg md:text-xl">
              Our visitor management system provides everything you need to
              streamline the check-in process and enhance security.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-5 transition-shadow bg-gray-50 rounded-xl sm:p-6 hover:shadow-md"
              >
                <div className="flex items-center justify-center w-10 h-10 mb-3 bg-blue-100 rounded-full sm:w-12 sm:h-12 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 sm:text-xl sm:mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl sm:mb-4">
              How It Works
            </h2>
            <p className="max-w-3xl mx-auto text-base text-gray-600 sm:text-lg md:text-xl">
              A simple three-step process for visitors to check in and access
              your facility.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 sm:gap-8">
            <div className="p-6 text-center bg-white shadow-sm rounded-xl sm:p-8">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full sm:w-16 sm:h-16 sm:mb-6">
                <UserPlus className="w-6 h-6 text-blue-700 sm:h-8 sm:w-8" />
              </div>
              <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full sm:mb-4">
                Step 1
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl sm:mb-3">
                Register
              </h3>
              <p className="text-sm text-gray-600 sm:text-base">
                Fill out the digital check-in form with your information and
                purpose of visit.
              </p>
            </div>

            <div className="p-6 text-center bg-white shadow-sm rounded-xl sm:p-8">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-indigo-100 rounded-full sm:w-16 sm:h-16 sm:mb-6">
                <BookOpen className="w-6 h-6 text-indigo-700 sm:h-8 sm:w-8" />
              </div>
              <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-indigo-800 bg-indigo-100 rounded-full sm:mb-4">
                Step 2
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl sm:mb-3">
                Complete Training
              </h3>
              <p className="text-sm text-gray-600 sm:text-base">
                If required, complete any safety or security training modules
                for your visit.
              </p>
            </div>

            <div className="p-6 text-center bg-white shadow-sm rounded-xl sm:p-8">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full sm:w-16 sm:h-16 sm:mb-6">
                <QrCode className="w-6 h-6 text-green-700 sm:h-8 sm:w-8" />
              </div>
              <div className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-green-800 bg-green-100 rounded-full sm:mb-4">
                Step 3
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:text-xl sm:mb-3">
                Receive Pass
              </h3>
              <p className="text-sm text-gray-600 sm:text-base">
                Get your digital visitor pass with QR code for access throughout
                the facility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-white sm:py-16 bg-gradient-to-r from-blue-700 to-indigo-800">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl sm:mb-6">
            Ready to Get Started?
          </h2>
          <p className="max-w-3xl mx-auto mb-6 text-base sm:text-lg md:text-xl sm:mb-8 opacity-90">
            Experience a seamless visitor management process with our digital
            solution.
          </p>
          <div className="grid max-w-3xl grid-cols-1 gap-3 mx-auto sm:grid-cols-3 sm:gap-4">
            <Link
              href="/check-in"
              className="px-4 py-3 font-semibold text-blue-700 transition-colors bg-white rounded-lg shadow-md hover:bg-blue-50 sm:px-6 md:px-8 md:py-4"
            >
              Check In Now
            </Link>
            <Link
              href="/been-here-before"
              className="px-4 py-3 font-semibold text-white transition-colors bg-blue-600 border border-blue-400 rounded-lg shadow-md hover:bg-blue-500 sm:px-6 md:px-8 md:py-4"
            >
              Returning Visitor
            </Link>
            <Link
              href="/check-out"
              className="px-4 py-3 font-semibold text-white transition-colors bg-green-600 border border-green-400 rounded-lg shadow-md hover:bg-green-500 sm:px-6 md:px-8 md:py-4"
            >
              Check Out
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-gray-400 bg-gray-900 sm:py-12">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-4">
            <div className="text-center md:text-left">
              <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
                FV VMS
              </h2>
              <p className="text-sm">Visitor Management System</p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="mb-3 font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/check-in"
                    className="transition-colors hover:text-white"
                  >
                    Check In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/been-here-before"
                    className="transition-colors hover:text-white"
                  >
                    Returning Visitor
                  </Link>
                </li>
                <li>
                  <Link
                    href="/training-registeration"
                    className="transition-colors hover:text-white"
                  >
                    Register for training
                  </Link>
                </li>
                <li>
                  <Link
                    href="/check-out"
                    className="transition-colors hover:text-white"
                  >
                    Check Out
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="transition-colors hover:text-white"
                  >
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h3 className="mb-3 font-semibold text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help-center"
                    className="transition-colors hover:text-white"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="transition-colors hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="transition-colors hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 text-sm text-center border-t border-gray-800">
            <p>
              &copy; {new Date().getFullYear()} QuickPass Visitor Management
              System.{" "}
              <Link href="https://wa.me/message/V64INIRXSEJNC1">
                POWERED BY ATLAS TECH CORPORATION.
              </Link>{" "}
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
