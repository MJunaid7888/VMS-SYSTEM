"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, CheckCircle, Clock } from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  visitorCategory: string;
  siteLocation: string;
  department: string;
  hostEmployee: string;
  meetingLocation: string;
  visitStartDate: string;
  visitEndDate: string;
  purpose: string;
};

const getInitialFormData = (formType: string): FormData => ({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  visitorCategory: formType,
  siteLocation: "",
  department: "",
  hostEmployee: "",
  meetingLocation: "",
  visitStartDate: new Date().toISOString().slice(0, 16),
  visitEndDate: new Date().toISOString().slice(0, 16),
  purpose: "",
});

export default function AddVisitorPage() {
  const [formType, setFormType] = useState<"visitor" | "contractor">("visitor");
  const [formData, setFormData] = useState<FormData>(() =>
    getInitialFormData("visitor")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { user, token } = useAuth();

  useEffect(() => {
    setFormData((prev) => ({ ...prev, visitorCategory: formType }));
  }, [formType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.purpose ||
      !formData.hostEmployee ||
      !formData.department ||
      !formData.meetingLocation ||
      !formData.visitStartDate ||
      !formData.visitEndDate ||
      !formData.visitorCategory
    ) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `https://backend-vms-1.onrender.com/api/admin/schedulevisit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Submission failed");
      }

      const data = await response.json();
      console.log(`${formType} form submitted:`, data);

      setFormData(getInitialFormData(formType));
      setSuccessMessage(`Visit Scheduled successfully!`);
    } catch (error) {
      console.error("Submission failed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add visitor"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !token) {
    return (
      <div className="mt-20 font-semibold text-center text-red-500">
        You must be logged in to add a visitor.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl px-4 py-8 pt-20 mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/visitors"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Visitors
          </Link>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Visitor
            </h1>
            <p className="mt-1 text-gray-600">
              Schedule a new visitor appointment
            </p>
          </div>

          {error && (
            <div className="flex items-start p-4 m-6 text-red-700 border-l-4 border-red-500 rounded bg-red-50">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start p-4 m-6 text-green-700 border-l-4 border-green-500 rounded bg-green-50">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Success</p>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Select
                  value={formData.visitorCategory}
                  onValueChange={(value) =>
                    setFormType(value as "visitor" | "contractor")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Visitor Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="visitor">Visitor</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={formData.siteLocation}
                  onValueChange={(value) =>
                    setFormData({ ...formData, siteLocation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Site Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Head Office">Head Office</SelectItem>
                    <SelectItem value="Branch A">Branch A</SelectItem>
                    <SelectItem value="Branch B">Branch B</SelectItem>
                    <SelectItem value="Remote Site">Remote Site</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <h2 className="mt-6 mb-2 text-xl font-semibold">
                Visit Information
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData({ ...formData, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={formData.hostEmployee}
                  onValueChange={(value) =>
                    setFormData({ ...formData, hostEmployee: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="John Smith">John Smith</SelectItem>
                    <SelectItem value="Jane Doe">Jane Doe</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={formData.meetingLocation}
                  onValueChange={(value) =>
                    setFormData({ ...formData, meetingLocation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Meeting Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conference Room A">
                      Conference Room A
                    </SelectItem>
                    <SelectItem value="Lobby">Lobby</SelectItem>
                  </SelectContent>
                </Select>

                <div>
                  <label className="block mb-1">Visit Start Date & Time</label>
                  <Input
                    type="datetime-local"
                    name="visitStartDate"
                    value={formData.visitStartDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block mb-1">Visit End Date & Time</label>
                  <Input
                    type="datetime-local"
                    name="visitEndDate"
                    value={formData.visitEndDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Textarea
                  name="purpose"
                  placeholder="Please describe the purpose of the visit"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule Visit
                  </>
                )}
              </Button>

              <div className="flex justify-end">
                <Link
                  href="/admin/visitors"
                  className="inline-flex items-center px-4 py-2 mr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
