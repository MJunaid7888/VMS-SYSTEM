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
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle,
  FileText,
  ImageDownIcon,
  Mail,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { newVisitorAPI, adminAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { convertFileToBase64, uploadBase64File } from "../utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type SystemSettingsType = {
  visitorPhotoRequired?: boolean;
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
  error?: string;
  success?: string;
}

const VisitorForm = ({
  form,
  handleChange,
  handleSubmit,
  setForm,
  setFormType,
  error,
  success,
}: VisitorFormProps) => {
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettingsType>({
    visitorPhotoRequired: false,
  });
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
    // ensure contractor is default
    setFormType("contractor");
    setForm((prev) => ({ ...prev, visitorCategory: "contractor" }));
    fetchSettings();
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    try {
      const systemSettings = await adminAPI.getSystemSettings();
      setSettings({
        visitorPhotoRequired: systemSettings?.visitorPhotoRequired ?? false,
      });
    } catch (err) {
      console.error("Error fetching system settings:", err);
      toast.error("Failed to load system settings");
    }
  };

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const MAX_FILE_SIZE_MB = 5;
  type UploadEvent =
    | React.ChangeEvent<HTMLInputElement>
    | React.DragEvent<HTMLDivElement>;

  const handleFileUpload = async (e: UploadEvent) => {
    e.preventDefault();
    let file: File | null = null;

    if ("dataTransfer" in e) {
      file = e.dataTransfer.files?.[0] || null;
    } else {
      file =
        (e as React.ChangeEvent<HTMLInputElement>).target.files?.[0] || null;
    }

    if (!file) {
      console.warn("No file selected");
      return;
    }

    const sanitizedFile = new File([file], file.name.replace(/\//g, "-"), {
      type: file.type,
    });

    const fileSizeInMB = sanitizedFile.size / (1024 * 1024);
    if (fileSizeInMB > MAX_FILE_SIZE_MB) {
      alert("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    try {
      const base64 = await convertFileToBase64(sanitizedFile);
      if (!base64) return;
      setUploadLoading(true);
      const url = await uploadBase64File(base64, "image", setUploadLoading);
      setUploadLoading(false);
      if (url) {
        setForm((prev) => ({ ...prev, pics: url }));
      } else {
        toast.error("Image upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadLoading(false);
      toast.error("Image upload failed");
    }
  };

  // helper: get unique site locations from employees
  const uniqueSiteLocations = Array.from(
    new Set(employees.map((e) => e.siteLocation).filter(Boolean))
  ) as string[];

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

            {error && (
              <div className="flex items-start p-4 mb-4 text-red-700 border border-red-200 rounded-lg bg-red-50 sm:p-6 sm:mb-6">
                <div className="bg-red-100 p-1.5 rounded-full mr-3 flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="mb-1 text-base font-medium">
                    Registration Error
                  </p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="flex items-start p-4 mb-4 text-green-700 border border-green-200 rounded-lg bg-green-50 sm:p-6 sm:mb-6">
                <div className="bg-green-100 p-1.5 rounded-full mr-3 flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="mb-1 text-base font-medium">
                    Registration Successful!
                  </p>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Basic Contact Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
              <Input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Site Location (restored) */}
            <div className="mt-4">
              <Select
                value={form.siteLocation || ""}
                onValueChange={(value) =>
                  setForm({ ...form, siteLocation: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Site Location" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueSiteLocations.length ? (
                    uniqueSiteLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="">No locations</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Upload Profile Image (restored) */}
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-700 md:text-base">
                Upload Profile Picture
              </h2>
              <div
                className={`w-full md:w-2/3 h-fit border-2 border-gray-300 p-2 bg-white rounded-3xl my-4 ${
                  form.pics ? "p-1" : "p-8"
                }`}
                onDrop={(e) => handleFileUpload(e)}
                onDragOver={(e) => e.preventDefault()}
              >
                <label htmlFor="pics" className="block w-full cursor-pointer">
                  {form.pics ? (
                    <Image
                      src={form.pics}
                      alt="profile"
                      width={400}
                      height={300}
                      className="w-full h-[200px] object-cover object-center rounded-2xl"
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      {uploadLoading ? (
                        <div className="flex items-center justify-center w-full h-full">
                          <AiOutlineLoading3Quarters className="text-4xl animate-spin" />
                        </div>
                      ) : (
                        <>
                          <div className="p-2 bg-gray-100 rounded-full">
                            <ImageDownIcon />
                          </div>
                          <p className="text-sm text-gray-600">
                            Click or drag & drop to upload image
                          </p>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    id="pics"
                    type="file"
                    name="pics"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e)}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Contractor-specific selects */}
            <h2 className="mt-6 mb-2 text-xl font-semibold">
              Visit Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                value={form.department || ""}
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
                value={form.hostEmployee || ""}
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
                value={form.meetingLocation || ""}
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
                      value={`${employee.meetingLocation ?? ""}`}
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

            {/* Terms and condition */}
            <div className="p-4 mt-4 mb-4 bg-white border border-gray-200 shadow-sm rounded-xl sm:p-6 sm:mb-6 sm:mt-6">
              <h3 className="flex items-center mb-3 text-base font-semibold text-gray-900 sm:text-lg sm:mb-4">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-1.5 sm:mr-2 flex-shrink-0" />
                Terms and Conditions
              </h3>

              <div className="p-3 mb-3 text-xs text-gray-700 border border-gray-200 rounded-lg bg-gray-50 sm:p-4 sm:mb-4 sm:text-sm">
                <p className="mb-1.5 sm:mb-2">
                  By checking the box below, you agree to:
                </p>
                <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1">
                  <li>
                    Follow all safety and security protocols during your visit
                  </li>
                  <li>Wear your contractor badge visibly at all times</li>
                  <li>Be escorted by your host in restricted areas</li>
                  <li>Provide accurate information for security purposes</li>
                  <li>Allow your information to be stored in our system</li>
                </ul>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <div className="mt-0.5">
                  <input
                    type="checkbox"
                    name="agreed"
                    id="agreed"
                    required
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded sm:h-5 sm:w-5 focus:ring-blue-500"
                  />
                </div>
                <label
                  htmlFor="agreed"
                  className="text-xs text-gray-700 sm:text-sm"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and acknowledge the Privacy Policy.*
                </label>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-3 pt-2 sm:flex-row sm:gap-4 sm:pt-4">
              <Link
                href="/"
                className="flex items-center justify-center w-full px-2 py-1 text-sm text-center text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 sm:px-4 sm:py-2 sm:w-auto sm:text-base"
              >
                <ArrowUpRight className="mr-1.5 sm:mr-2 h-4 w-4 rotate-180" />
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
