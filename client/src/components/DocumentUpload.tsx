"use client";

import { useState, useRef } from "react";
import { documentAPI, Document } from "@/lib/api";
import {
  Upload,
  File,
  X,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";

interface DocumentUploadProps {
  visitorId: string;
  token: string;
  onUploadSuccess?: (document: Document) => void;
}

export default function DocumentUpload({
  visitorId,
  token,
  onUploadSuccess,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] =
    useState<Document["documentType"]>("id");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!documentType) {
      setError("Please select a document type");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setSuccess(null);

      const uploadedDocument = await documentAPI.uploadDocument(
        file,
        visitorId,
        documentType,
        description,
        token
      );

      setSuccess("Document uploaded successfully");
      setFile(null);
      setDescription("");

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Notify parent component
      if (onUploadSuccess) {
        onUploadSuccess(uploadedDocument);
      }
    } catch (err) {
      console.error("Error uploading document:", err);
      setError(
        err instanceof Error ? err.message : "Failed to upload document"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setDescription("");
    setError(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
        <Upload className="w-5 h-5 mr-2 text-blue-600" />
        Upload Document
      </h2>

      {error && (
        <div className="flex items-start p-4 mb-4 text-red-700 border-l-4 border-red-500 rounded bg-red-50">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start p-4 mb-4 text-green-700 border-l-4 border-green-500 rounded bg-green-50">
          <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Success</p>
            <p className="text-sm">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label
            htmlFor="documentType"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Document Type
          </label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) =>
              setDocumentType(e.target.value as Document["documentType"])
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isUploading}
            required
          >
            <option value="id">Identification</option>
            <option value="nda">Non-Disclosure Agreement</option>
            <option value="training">Training Certificate</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Brief description of the document"
            disabled={isUploading}
          />
        </div>

        <div>
          <label
            htmlFor="file"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            File
          </label>
          <div className="flex items-center mt-1">
            <label
              htmlFor="file-upload"
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span>Select file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={isUploading}
                required
              />
            </label>
            <span className="ml-3 text-sm text-gray-500">
              {file ? file.name : "No file selected"}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB)
          </p>
        </div>

        {file && (
          <div className="flex items-center p-3 rounded-md bg-blue-50">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">{file.name}</p>
              <p className="text-xs text-blue-700">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-800"
              disabled={isUploading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isUploading || !file}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isUploading || !file}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
