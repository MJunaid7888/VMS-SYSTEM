"use client";
import React, { useState, useEffect } from "react";
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
import AppBar from "./AppBar";
import { ArrowUpRight, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { newVisitorAPI, adminAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { convertFileToBase64, uploadBase64File } from "../utils";

type SystemSettingsType = {
  visitorPhotoRequired: boolean;
};

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
  agreed: string;
  pics?: string;
};

interface VisitorFormProps {
  form: FormData;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setForm: React.Dispatch<React.SetStateAction<FormData>>;
  setFormType: React.Dispatch<React.SetStateAction<"visitor" | "contractor">>;
  error: string;
  success: string;
}

const VisitorForm = ({
  form,
  handleChange,
  handleSubmit,
  setForm,
  setFormType,
}: VisitorFormProps) => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<
    {
      id: string;
      firstName: string;
      lastName: string;
      siteLocation?: string;
      meetingLocation?: string;
    }[]
  >([]);

  useEffect(() => {
    fetchUserDetails();
    // ✅ Contractor default
    setFormType("contractor");
    setForm((prev) => ({ ...prev, visitorCategory: "contractor" }));
  }, []);

  const fetchUserDetails = async () => {
    try {
      const users = await adminAPI.getUsers();
      const nonAdminEmployees = users
        .filter((u) => u.role !== "admin")
        .map((u) => ({
          id: u._id,
          firstName: u.firstName,
          lastName: u.lastName,
          siteLocation: u.siteLocation,
          meetingLocation: u.meetingLocation,
        }));
      setEmployees(nonAdminEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleSubmit(e);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-4 bg-gradient-to-br from-white via-indigo-100 to-purple-100 sm:pb-8 lg:pb-10">
      <AppBar />
      <div className="grid w-full grid-cols-1 gap-6 p-4 mx-2 mt-4 bg-white shadow-lg rounded-xl sm:rounded-3xl sm:p-6 md:p-8 max-w-8xl sm:mx-4 md:mx-auto lg:grid-cols-2 sm:gap-8 sm:mt-6 not-first:mb-4 sm:pb-8">
        <div className="p-4 mx-auto mt-2 space-y-6 bg-white shadow-md rounded-xl sm:mt-6 lg:mt-8 xl:mt-10">
          <h1 className="mb-4 text-2xl font-bold">New Contractor</h1>
          <form onSubmit={onSubmit}>
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                <User className="w-5 h-5 text-blue-700 sm:h-6 sm:w-6" />
              </div>
              <h1 className="text-2xl font-bold leading-tight text-blue-900 sm:text-3xl md:text-4xl">
                Contractor Registration
              </h1>
            </div>
            <p className="mb-2 text-sm text-gray-600 sm:text-base sm:mb-4">
              Please fill in your details to register as a contractor. Fields
              marked with * are required.
            </p>

            {/* Contractor Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                value={form.department}
                onValueChange={(value) =>
                  setForm({ ...form, department: value })
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
                value={form.hostEmployee}
                onValueChange={(value) =>
                  setForm({ ...form, hostEmployee: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={`${employee.firstName?.toLowerCase()}-${employee.lastName?.toLowerCase()}`}
                    >
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={form.meetingLocation}
                onValueChange={(value) =>
                  setForm({ ...form, meetingLocation: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Meeting Location" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.id}
                      value={`${employee.meetingLocation?.toLowerCase()}`}
                    >
                      {employee.meetingLocation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <label className="block mb-1">Visit Start Date & Time</label>
                <Input
                  type="datetime-local"
                  name="visitStartDate"
                  value={form.visitStartDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1">Visit End Date & Time</label>
                <Input
                  type="datetime-local"
                  name="visitEndDate"
                  value={form.visitEndDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <Textarea
                name="purpose"
                placeholder="Please describe the purpose of your visit"
                value={form.purpose}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col justify-between gap-3 pt-2 sm:flex-row sm:gap-4 sm:pt-4">
              <Link
                href="/"
                className="flex items-center justify-center w-full px-2 py-1 text-sm text-center text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 sm:px-4 sm:py-2 sm:w-auto sm:text-base"
              >
                <ArrowUpRight className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 rotate-180" />
                Return to Home
              </Link>
              <Button
                type="submit"
                className="w-full mt-4 sm:w-auto"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>

        {/* IMAGE SECTION */}
        <div className="flex flex-col items-center justify-center w-full gap-3 sm:gap-4">
          <div className="relative w-full h-40 sm:h-48 md:h-60 lg:h-96">
            <Image
              src="/building.jpeg"
              alt="Building"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              className="rounded-lg sm:rounded-xl"
              priority
            />
          </div>
          <div className="relative w-full h-40 sm:h-48 md:h-60 lg:h-96">
            <Image
              src="/reception.jpeg"
              alt="Reception"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              className="rounded-lg sm:rounded-xl"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default VisitorForm;
