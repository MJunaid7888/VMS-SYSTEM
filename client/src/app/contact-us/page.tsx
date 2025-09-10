"use client";
import { useState } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import AppBar from "@/components/AppBar";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div>
      <AppBar />
      <section className="flex items-center justify-center min-h-screen px-4 py-16 bg-gradient-to-br from-sky-100 to-white">
        <div className="w-full max-w-3xl p-10 border border-blue-100 shadow-2xl bg-white/90 backdrop-blur-md rounded-3xl sm:p-14">
          <h2 className="mb-10 text-4xl font-bold tracking-tight text-center text-blue-800 sm:text-5xl">
            Let&apos;s Talk
          </h2>

          {submitted && (
            <div className="px-4 py-3 mb-8 font-medium text-center text-green-700 border border-green-300 bg-green-50 rounded-xl">
              ✅ Thank you! We received your message.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full p-3 bg-white border border-gray-300 shadow-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full p-3 bg-white border border-gray-300 shadow-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block mb-1 text-sm font-semibold text-gray-700"
              >
                Your Message
              </label>
              <textarea
                name="message"
                rows={6}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message..."
                className="w-full p-3 bg-white border border-gray-300 shadow-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="flex items-center justify-center w-full gap-2 px-8 py-3 font-semibold text-white transition-all duration-200 shadow-md sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl hover:shadow-lg"
              >
                <PaperPlaneIcon className="w-5 h-5" />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
