"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import DocumentUploader from "@/components/DocumentUploader";
import EnhancedDocumentViewer from "@/components/EnhancedDocumentViewer";
import { newVisitorAPI, VisitorForm } from "@/lib/api";
import { FileText, Search, AlertCircle } from "lucide-react";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorForm | null>(
    null
  );
  const [visitors, setVisitors] = useState<VisitorForm[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<VisitorForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentsUpdated, setDocumentsUpdated] = useState(0);
  const { token, user } = useAuth();

  useEffect(() => {
    fetchVisitors();
  }, [token, documentsUpdated]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVisitors(visitors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = visitors.filter(
        (visitor) =>
          visitor.firstName.toLowerCase().includes(query) ||
          visitor.lastName.toLowerCase().includes(query) ||
          visitor.email.toLowerCase().includes(query) ||
          (visitor.company && visitor.company.toLowerCase().includes(query))
      );
      setFilteredVisitors(filtered);
    }
  }, [searchQuery, visitors]);

  const fetchVisitors = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const visitorData: VisitorForm[] = await newVisitorAPI.getAll();
      const contractorVisitor = visitorData.filter(
        (v) => v.visitorCategory === "contractor"
      );
      setVisitors(contractorVisitor);
      setFilteredVisitors(contractorVisitor);
      if (contractorVisitor.length > 0) {
        const selected =
          contractorVisitor.find((v) => v._id === selectedVisitor?._id) ||
          contractorVisitor[0];
        setSelectedVisitor(selected);
      }
    } catch (err) {
      console.error("Error fetching visitors:", err);
      setError(err instanceof Error ? err.message : "Failed to load visitors");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentChange = () => {
    setDocumentsUpdated((prev) => prev + 1);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-6 text-center bg-white rounded-lg shadow-md">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Access Denied
            </h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Document Management
          </h1>
          <p className="mt-2 text-gray-600">
            Upload, view, and manage visitor documents.
          </p>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Visitors
              </h2>

              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search visitors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                  <span className="ml-2 text-gray-600">
                    Loading visitors...
                  </span>
                </div>
              ) : filteredVisitors.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No visitors found
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                <div className="px-6 -mx-6 overflow-y-auto max-h-96">
                  <ul className="divide-y divide-gray-200">
                    {filteredVisitors.map((visitor) => (
                      <li key={visitor._id}>
                        <button
                          onClick={() => setSelectedVisitor(visitor)}
                          className={`w-full text-left px-4 py-3 rounded-md ${
                            selectedVisitor?._id === visitor._id
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="font-medium text-gray-900">
                            {visitor.firstName} {visitor.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {visitor.email}
                          </div>
                          {visitor.company && (
                            <div className="mt-1 text-xs text-gray-400">
                              {visitor.company}
                            </div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 md:col-span-2">
            {selectedVisitor ? (
              <>
                <DocumentUploader
                  visitorId={selectedVisitor._id}
                  onUploadSuccess={handleDocumentChange}
                />
                <EnhancedDocumentViewer
                  documents={selectedVisitor.documents || []}
                />
              </>
            ) : (
              <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">
                  No visitor selected
                </h3>
                <p className="mt-1 text-gray-500">
                  Select a visitor from the list to view and manage their
                  documents.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
