"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming the Button component is in the src/components directory
import { ChevronDown, Menu } from "lucide-react";

export default function VisitorForm() {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-purple-50 to-white">
      {/* Navbar */}
      <nav className="relative flex items-center justify-between p-4 bg-white shadow">
        <div className="text-2xl font-bold text-blue-900">
          <span className="text-blue-500">Q</span>uick
          <span className="text-blue-500">P</span>ass
        </div>

        {/* Desktop Menu */}
        <div className="relative items-center hidden space-x-8 md:flex">
          <a href="#" className="font-medium text-gray-700 hover:text-blue-700">
            Have Appointment
          </a>
          <a href="#" className="font-medium text-gray-700 hover:text-blue-700">
            Been here Before
          </a>
          <div className="relative">
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center space-x-1 font-medium text-gray-700 hover:text-blue-700"
            >
              <span>GB English</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {languageOpen && (
              <ul className="absolute right-0 z-10 w-40 mt-2 bg-white border border-gray-300 rounded shadow-lg">
                <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                  GB English
                </li>
                <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                  FR Français
                </li>
                <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                  ES Español
                </li>
                <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                  DE Deutsch
                </li>
                <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                  IT Italiano
                </li>
                <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                  ZH 中文
                </li>
              </ul>
            )}
          </div>
          <Button className="px-6 py-2 text-white bg-blue-900 rounded-full shadow">
            Login
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          {menuOpen && (
            <div className="absolute z-10 w-48 p-2 mt-2 bg-white border border-gray-200 rounded-md shadow-lg top-full right-4">
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Have Appointment
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Been here Before
              </a>
              <div className="my-2 border-t"></div>
              <div className="relative">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <span>GB English</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {languageOpen && (
                  <ul className="mt-2 bg-white border border-gray-300 rounded shadow-lg">
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                      GB English
                    </li>
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                      FR Français
                    </li>
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                      ES Español
                    </li>
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                      DE Deutsch
                    </li>
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                      IT Italiano
                    </li>
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                      ZH 中文
                    </li>
                  </ul>
                )}
              </div>
              <Button className="w-full mt-2 text-white bg-blue-900 rounded-full">
                Login
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row">
        {/* Left side form section */}
        <div className="flex flex-col items-center justify-center w-full p-6 md:w-1/2">
          <div className="w-full max-w-md">
            <h1 className="mb-4 text-3xl font-bold text-center text-blue-900 md:text-left">
              Pre Registered Visitor Details
            </h1>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Visitor's Email or Phone or NID
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Email, Phone or NID"
            />
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button className="w-full px-6 py-2 text-white bg-red-500 rounded-full shadow hover:bg-red-600">
                Cancel
              </Button>
              <Button className="w-full px-6 py-2 text-white bg-blue-900 rounded-full shadow hover:bg-blue-800">
                Continue
              </Button>
            </div>
          </div>
        </div>

        {/* Right side image section */}
        <div className="flex-col items-center justify-center hidden p-6 space-y-6 md:flex md:w-1/2">
          <img
            src="/building.jpeg"
            alt="Building"
            className="w-3/4 shadow-lg rounded-3xl"
          />
          <img
            src="/discussion.jpeg"
            alt="Discussion"
            className="w-3/4 shadow-lg rounded-3xl"
          />
        </div>
      </div>

      {/* Responsive images for small screens */}
      <div className="w-full px-6 pt-6 space-y-4 md:hidden">
        <img
          src="/building.jpeg"
          alt="Building"
          className="w-full shadow-lg rounded-3xl"
        />
        <img
          src="/discussion.jpeg"
          alt="Discussion"
          className="w-full shadow-lg rounded-3xl"
        />
      </div>
    </div>
  );
}
