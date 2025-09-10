"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Camera,
  CheckCircle,
  Clock,
  Shield,
  Users,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import QRCodeScanner from "@/components/QRCodeScanner";
import AppBar from "@/components/AppBar";
import Link from "next/link";

export default function Home() {
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Ensure hydration consistency
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div className="min-h-screen font-sans bg-gradient-to-r from-white to-purple-100">
      {/* Use the AppBar component for consistent navigation */}
      <AppBar showAuthButtons={true} />

      <main className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="flex flex-col-reverse items-center justify-between gap-10 lg:flex-row">
            {/* Text Content */}
            <div className="max-w-xl text-center lg:text-left animate-fadeIn">
              <div className="inline-block px-3 py-1 mb-4 bg-purple-100 rounded-full">
                <p className="text-xs font-medium tracking-widest text-purple-700 uppercase">
                  QuickPass - Visitor Management Simplified
                </p>
              </div>
              <h1 className="my-4 text-4xl font-extrabold leading-tight text-black md:text-5xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-purple-700">
                  Visitor Pass <br className="hidden md:block" /> Management
                  System
                </span>
              </h1>
              <p className="mb-8 text-lg text-gray-700">
                Streamline your visitor management process with our secure and
                efficient system. Quick check-ins, real-time notifications, and
                comprehensive analytics.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  href="/check-in"
                  className="flex items-center justify-center w-full px-8 py-4 font-semibold text-white transition-all transform rounded-full bg-gradient-to-r from-blue-800 to-indigo-700 sm:w-auto hover:shadow-lg hover:-translate-y-1"
                >
                  Check-in <ArrowUpRight className="ml-2 animate-pulse" />
                </Link>
                <button
                  onClick={() => setShowQRScanner(true)}
                  className="flex items-center justify-center w-full px-8 py-4 font-semibold text-blue-800 transition-all transform border-2 border-blue-800 rounded-full sm:w-auto hover:bg-blue-50 hover:-translate-y-1"
                >
                  Scan QR <Camera className="w-4 h-4 ml-2" />
                </button>

                {/* QR Code Scanner Modal */}
                {showQRScanner && (
                  <QRCodeScanner
                    token="" // No token needed for public scanning
                    onClose={() => setShowQRScanner(false)}
                  />
                )}
              </div>

              <div className="flex items-center justify-center mt-8 lg:justify-start">
                <div className="flex -space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 font-medium text-blue-700 bg-blue-100 border border-white rounded-full">
                    JD
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 font-medium text-green-700 bg-green-100 border border-white rounded-full">
                    AS
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 font-medium text-purple-700 bg-purple-100 border border-white rounded-full">
                    RK
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 font-medium text-yellow-700 bg-yellow-100 border border-white rounded-full">
                    +
                  </div>
                </div>
                <p className="ml-2 text-sm text-gray-600">
                  Trusted by 5,000+ organizations worldwide
                </p>
              </div>
            </div>

            {/* Images */}
            <div className="flex flex-col items-center gap-6 lg:flex-row animate-slideInRight">
              <div className="relative transition-transform transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-30 animate-pulse"></div>
                <Image
                  src="/img2.png"
                  alt="QR Scan"
                  width={320}
                  height={320}
                  className="relative shadow-lg rounded-xl"
                  priority
                />
              </div>
              <div className="relative mt-4 transition-transform transform hover:scale-105 lg:mt-12">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-30 animate-pulse"></div>
                <Image
                  src="/img1.png"
                  alt="Office"
                  width={320}
                  height={320}
                  className="relative shadow-lg rounded-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 my-12 bg-white shadow-sm bg-opacity-70 rounded-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-blue-900">Key Features</h2>
            <p className="max-w-2xl mx-auto mt-2 text-gray-600">
              Our visitor management system offers everything you need to
              streamline your front desk operations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-center">
                Easy Check-in
              </h3>
              <p className="text-center text-gray-600">
                Simple and quick check-in process for visitors with minimal
                waiting time
              </p>
            </div>

            <div className="p-6 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                <Shield className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-center">
                Enhanced Security
              </h3>
              <p className="text-center text-gray-600">
                Know exactly who is in your building at all times with detailed
                visitor logs
              </p>
            </div>

            <div className="p-6 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                <Clock className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-center">
                Real-time Notifications
              </h3>
              <p className="text-center text-gray-600">
                Instant alerts when visitors arrive, ensuring hosts are always
                informed
              </p>
            </div>

            <div className="p-6 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-center">
                Visitor Analytics
              </h3>
              <p className="text-center text-gray-600">
                Comprehensive reports and insights on visitor traffic and
                patterns
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 my-12 text-white bg-gradient-to-r from-blue-900 to-indigo-800 rounded-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">By The Numbers</h2>
            <p className="max-w-2xl mx-auto mt-2 text-blue-100">
              See how QuickPass is transforming visitor management across
              organizations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 transition-transform transform bg-white border border-white bg-opacity-10 backdrop-blur-sm rounded-xl border-opacity-20 hover:scale-105">
              <div className="mb-2 text-4xl font-bold text-white">98%</div>
              <p className="text-blue-100">Reduction in check-in time</p>
            </div>

            <div className="p-6 transition-transform transform bg-white border border-white bg-opacity-10 backdrop-blur-sm rounded-xl border-opacity-20 hover:scale-105">
              <div className="mb-2 text-4xl font-bold text-white">5,000+</div>
              <p className="text-blue-100">Organizations using QuickPass</p>
            </div>

            <div className="p-6 transition-transform transform bg-white border border-white bg-opacity-10 backdrop-blur-sm rounded-xl border-opacity-20 hover:scale-105">
              <div className="mb-2 text-4xl font-bold text-white">1M+</div>
              <p className="text-blue-100">Visitors processed monthly</p>
            </div>

            <div className="p-6 transition-transform transform bg-white border border-white bg-opacity-10 backdrop-blur-sm rounded-xl border-opacity-20 hover:scale-105">
              <div className="mb-2 text-4xl font-bold text-white">99.9%</div>
              <p className="text-blue-100">System uptime reliability</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 my-12">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-blue-900">How It Works</h2>
            <p className="max-w-2xl mx-auto mt-2 text-gray-600">
              Our simple three-step process makes visitor management effortless
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative p-6 transition-all transform bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 mx-auto mb-4 text-xl font-bold text-white bg-blue-800 rounded-full">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold text-center">
                Register
              </h3>
              <p className="text-center text-gray-600">
                Visitors enter their details through our user-friendly interface
              </p>
              <div className="hidden md:block absolute top-10 right-0 w-1/2 h-0.5 bg-blue-200"></div>
            </div>

            <div className="relative p-6 transition-all transform bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 mx-auto mb-4 text-xl font-bold text-white bg-blue-800 rounded-full">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold text-center">Notify</h3>
              <p className="text-center text-gray-600">
                The system automatically alerts the host about their visitor's
                arrival
              </p>
              <div className="hidden md:block absolute top-10 right-0 w-1/2 h-0.5 bg-blue-200"></div>
            </div>

            <div className="p-6 transition-all transform bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center w-10 h-10 mx-auto mb-4 text-xl font-bold text-white bg-blue-800 rounded-full">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold text-center">
                Check-in
              </h3>
              <p className="text-center text-gray-600">
                Visitors receive a digital pass for seamless access to the
                premises
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 my-12 bg-gray-50 rounded-3xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-blue-900">
              What Our Clients Say
            </h2>
            <p className="max-w-2xl mx-auto mt-2 text-gray-600">
              Hear from organizations that have transformed their visitor
              experience with QuickPass
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-3">
            <div className="p-6 transition-all bg-white shadow-sm rounded-xl hover:shadow-md">
              <div className="flex mb-4 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="mb-4 italic text-gray-700">
                "QuickPass has completely transformed our front desk operations.
                Our visitors love the seamless check-in process, and our staff
                appreciates the automated notifications."
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 font-medium text-blue-700 bg-blue-100 rounded-full">
                  JD
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Jane Doe</p>
                  <p className="text-xs text-gray-500">
                    Facilities Manager, Tech Corp
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 transition-all bg-white shadow-sm rounded-xl hover:shadow-md">
              <div className="flex mb-4 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="mb-4 italic text-gray-700">
                "The analytics feature has given us valuable insights into
                visitor patterns. We've been able to optimize staffing and
                improve security protocols based on this data."
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 font-medium text-blue-700 bg-blue-100 rounded-full">
                  JS
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    John Smith
                  </p>
                  <p className="text-xs text-gray-500">
                    Security Director, Global Industries
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 transition-all bg-white shadow-sm rounded-xl hover:shadow-md">
              <div className="flex mb-4 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="mb-4 italic text-gray-700">
                "The QR code system has made our visitor check-in process
                contactless and efficient. Implementation was smooth, and the
                support team has been exceptional."
              </p>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 font-medium text-blue-700 bg-blue-100 rounded-full">
                  AW
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Alice Williams
                  </p>
                  <p className="text-xs text-gray-500">
                    Office Manager, Innovate Co.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 my-12 overflow-hidden text-white bg-gradient-to-r from-blue-900 to-indigo-800 rounded-3xl">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 transform bg-purple-300 rounded-full w-96 h-96 blur-3xl translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="relative max-w-3xl px-4 mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to transform your visitor experience?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Join thousands of organizations that have streamlined their
              visitor management process with QuickPass
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="px-8 py-4 font-semibold text-blue-900 transition-all transform bg-white rounded-full shadow-lg hover:bg-blue-50 hover:shadow-xl hover:-translate-y-1"
              >
                Get Started
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 font-semibold text-white transition-all transform border-2 border-white rounded-full hover:bg-white hover:text-blue-900 hover:-translate-y-1"
              >
                Contact Sales
              </Link>
            </div>

            <div className="pt-8 mt-12 text-sm text-blue-200 border-t border-blue-800">
              <p>
                No credit card required • Free trial available • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-4">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-blue-700 text-white p-1.5 rounded mr-2">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-blue-800">
                  QuickPass
                </span>
              </div>
              <p className="mb-4 text-gray-600">
                Streamlining visitor management for modern organizations.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/features"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="/integrations"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gdpr"
                    className="text-gray-600 hover:text-blue-800"
                  >
                    GDPR
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between pt-8 border-t border-gray-200 md:flex-row">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} QuickPass. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <select className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
