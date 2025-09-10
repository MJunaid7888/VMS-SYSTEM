"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { adminAPI } from "@/lib/api";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  AlertCircle,
  CheckCircle,
  Map,
  MapPin,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface EditData {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  siteLocation: string;
  meetingLocation: string;
  phoneNumber: string;
  role: string;
}

export default function EditUserPage() {
  const [formData, setFormData] = useState<EditData>({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    phoneNumber: "",
    siteLocation: "",
    meetingLocation: "",
    role: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const params = useParams();
  const userId = params?.id as string;

  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token || !userId) return;

      try {
        const user = await adminAPI.getUserById(userId, token);

        setFormData({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          department: user.department,
          siteLocation: user.siteLocation || "",
          meetingLocation: user.meetingLocation || "",
          phoneNumber: user.phoneNumber,
          role: user.role,
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to fetch user data");
      }
    };

    fetchUser();
  }, [token, userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("You must be logged in to add a user");
      return;
    }

    // Validate form
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.department ||
      !formData.phoneNumber ||
      !formData.role
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Create a new user
      await adminAPI.updateUser(userId, formData, token);

      setSuccessMessage("User edited successfully");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
        siteLocation: "",
        meetingLocation: "",
        phoneNumber: "",
        role: "",
      });

      // Redirect to the users page after a short delay
      setTimeout(() => {
        router.push("/admin/users");
      }, 1500);
    } catch (err) {
      console.error("Error editing user:", err);
      setError(err instanceof Error ? err.message : "Failed to edit user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link href="/admin/users" className="mr-4">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
            <p className="mt-2 text-gray-600">
              Edit user account in the system.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-start p-4 mb-6 text-red-700 border-l-4 border-red-500 rounded bg-red-50">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start p-4 mb-6 text-green-700 border-l-4 border-green-500 rounded bg-green-50">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Success</p>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div className="p-2">
              <label
                htmlFor="firstName"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="block w-full py-2 pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="block w-full py-2 pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full py-2 pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="block w-full py-2 pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="department"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Department <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Building className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="block w-full py-2 pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="siteLocation"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Site Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="siteLocation"
                  name="siteLocation"
                  value={formData.siteLocation}
                  onChange={handleChange}
                  required
                  className="block w-full py-2 pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="meetingLocation"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Meeting Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Map className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="meetingLocation"
                  name="meetingLocation"
                  value={formData.meetingLocation}
                  onChange={handleChange}
                  required
                  className="block w-full py-2 pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="role"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <UserCog className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="block w-full py-2 pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/users"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? "Editing..." : "Edit User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
