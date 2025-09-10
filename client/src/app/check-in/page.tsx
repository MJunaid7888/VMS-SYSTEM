"use client";
import React, { useEffect, useState } from "react";
import ContractorForm from "@/components/ContractorForm";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api";
import toast from "react-hot-toast";

type SystemSettingsType = {
  visitorPhotoRequired: boolean;
  trainingRequired: boolean;
};

type DocumentItem = {
  name: string;
  file?: File;
  url: string;
  type?: string;
  uploadedAt?: string;
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
  hazards: {
    title: string;
    risk: string | number;
    selectedControls: string[];
  }[];
  ppe: {
    "HARD HAT": "N" | "Y";
    "SAFETY SHOES": "N" | "Y";
    OVERALLS: "N" | "Y";
    "EYE PROTECTION": "N" | "Y";
    "VEST VEST": "N" | "Y";
    "EAR PROTECTION": "N" | "Y";
    "RESPIRATORY EQUIP": "N" | "Y";
    GLOVES: "N" | "Y";
    "DUST MASK": "N" | "Y";
    "FALL ARREST": "N" | "Y";
  };
  documents: DocumentItem[];
  pics?: string;
};

const defaultContractorForm = (formType: string): FormData => ({
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  visitorCategory: formType,
  siteLocation: "",
  department: "",
  hostEmployee: "",
  meetingLocation: "",
  visitStartDate: "", // leave blank initially
  visitEndDate: "", // leave blank initially
  // visitStartDate: new Date().toISOString().slice(0, 16),
  // visitEndDate: new Date().toISOString().slice(0, 16),
  purpose: "",
  agreed: "off",
  hazards: [],
  ppe: {
    "HARD HAT": "N",
    "SAFETY SHOES": "N",
    OVERALLS: "N",
    "EYE PROTECTION": "N",
    "VEST VEST": "N",
    "EAR PROTECTION": "N",
    "RESPIRATORY EQUIP": "N",
    GLOVES: "N",
    "DUST MASK": "N",
    "FALL ARREST": "N",
  },
  documents: [],
  pics: "",
});

export default function FormPage() {
  const [formType, setFormType] = useState<"contractor">("contractor"); // visitor disabled
  const [contractorForm, setContractorForm] = useState(
    defaultContractorForm("contractor")
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [settings, setSettings] = useState<SystemSettingsType>({
    visitorPhotoRequired: false,
    trainingRequired: false,
  });
  const router = useRouter();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const systemSettings = await adminAPI.getSystemSettings();
      setSettings({
        visitorPhotoRequired: systemSettings?.visitorPhotoRequired ?? false,
        trainingRequired: systemSettings?.trainingRequired ?? false,
      });
    } catch (err) {
      console.error("Error fetching system settings:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to load system settings"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setContractorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    updatedFormOverride?: FormData
  ) => {
    e.preventDefault();

    try {
      const dataToSubmit = updatedFormOverride || contractorForm;

      const response = await fetch(
        `https://backend-vms-1.onrender.com/api/forms/contractor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Submission failed");
      }

      const data = await response.json();
      console.log("Contractor form submitted:", data);

      localStorage.setItem("contractorId", data.contractor._id);

      setContractorForm(defaultContractorForm("contractor"));

      setSuccess(
        `Your visit has been scheduled successfully! Please check in at the reception desk when you arrive. ${
          contractorForm.hostEmployee
        } has been notified of your upcoming visit on ${new Date(
          contractorForm.visitStartDate
        ).toLocaleDateString()}.`
      );

      setTimeout(() => setError(""), 3000);

      alert("Redirecting You to Training Page!");
      setTimeout(() => {
        if (settings.trainingRequired) {
          router.push("/training-doc");
        } else {
          alert("Contractor Form Submitted");
          router.push("/");
        }
      }, 2000);
    } catch (error) {
      console.error("Submission failed:", error);
      setError("Your form was not submitted. Please try again.");
      setTimeout(() => setError(""), 3000);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <ContractorForm
      setForm={setContractorForm}
      form={contractorForm}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      setFormType={(type) => {
        if (type === "visitor") {
          alert("Visitor Form is Currently Disabled");
        }
      }}
      error={error}
      success={success}
    />
  );
}
