"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { documentAPI, Document } from "@/lib/api";
import {
  File,
  FileText,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  Search,
} from "lucide-react";

interface DocumentListProps {
  visitorId: string;
  onDocumentDeleted?: () => void;
}

export default function DocumentList({
  visitorId,
  onDocumentDeleted,
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    fetchDocuments();
  }, [visitorId, token]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDocuments(documents);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = documents.filter(
        (doc) =>
          (doc.fileName && doc.fileName.toLowerCase().includes(query)) ||
          (doc.documentType &&
            doc.documentType.toLowerCase().includes(query)) ||
          (doc.description && doc.description.toLowerCase().includes(query))
      );
      setFilteredDocuments(filtered);
    }
  }, [searchQuery, documents]);

  const fetchDocuments = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const docs = await documentAPI.getVisitorDocuments(visitorId, token);
      setDocuments(docs);
      setFilteredDocuments(docs);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!token) return;

    setDeletingId(documentId);
    setError(null);
    setSuccessMessage(null);

    try {
      await documentAPI.deleteDocument(documentId, token);
      setDocuments((prevDocs) =>
        prevDocs.filter((doc) => doc._id !== documentId)
      );
      setSuccessMessage("Document deleted successfully");

      if (onDocumentDeleted) {
        onDocumentDeleted();
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete document"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case "id":
        return <File className="w-5 h-5 text-blue-500" />;
      case "nda":
        return <FileText className="w-5 h-5 text-purple-500" />;
      case "training":
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading documents...</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center text-xl font-semibold text-gray-900">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Documents
          </h2>
          <div className="relative mt-4 sm:mt-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm sm:w-64 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search documents"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start p-4 m-4 text-red-700 border-l-4 border-red-500 rounded bg-red-50">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start p-4 m-4 text-green-700 border-l-4 border-green-500 rounded bg-green-50">
          <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Success</p>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {filteredDocuments.length === 0 ? (
        <div className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            No documents found
          </h3>
          <p className="mt-1 text-gray-500">
            {searchQuery
              ? "Try adjusting your search criteria."
              : "This visitor has no uploaded documents."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Document
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Size
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Uploaded
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getDocumentTypeIcon(doc.documentType)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {doc.fileName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {doc.description || "No description"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-blue-800 capitalize bg-blue-100 rounded-full">
                      {doc.documentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatFileSize(doc.fileSize)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(doc.uploadedAt)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Download"
                        onClick={() =>
                          window.open(
                            `${process.env.NEXT_PUBLIC_API_URL}/documents/${doc._id}`,
                            "_blank"
                          )
                        }
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                        onClick={() => handleDeleteDocument(doc._id)}
                        disabled={deletingId === doc._id}
                      >
                        {deletingId === doc._id ? (
                          <div className="w-5 h-5 border-t-2 border-b-2 border-red-600 rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
