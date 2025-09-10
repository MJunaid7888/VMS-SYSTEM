"use client";
import { useState, useEffect } from "react";
import {
  Users,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Check,
  X,
  Download,
  Filter,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { newVisitorAPI } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface BaseForm {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  siteLocation?: string;
  meetingLocation?: string;
  department?: string;
  hostEmployee?: string;
  purpose?: string;
  visitStartDate: string;
  visitEndDate: string;
  hazards?: {
    title: string;
    risk: string | number;
    selectedControls: string[];
  }[];
  ppe?: {
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
  status: string;
  createdAt?: string;
  visitorCategory: string; // to differentiate between visitor and contractor
}

interface Department {
  _id: string;
  name: string;
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<BaseForm[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<BaseForm[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  console.log(filteredVisitors);

  //state for editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<BaseForm | null>(null);
  const [formData, setFormData] = useState<Partial<BaseForm>>({});

  // New state for filtering and approval
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [approvingVisitor, setApprovingVisitor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setDepartments([]);
  }, []);

  const { user, token } = useAuth();

  useEffect(() => {
    fetchVisitors();
    // fetchDepartments();
  }, []);

  useEffect(() => {
    let filtered = visitors;

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (visitor) =>
          visitor.firstName.toLowerCase().includes(query) ||
          visitor.lastName.toLowerCase().includes(query) ||
          visitor.email.toLowerCase().includes(query) ||
          (visitor.hostEmployee &&
            visitor.hostEmployee.toLowerCase().includes(query)) ||
          (visitor.purpose && visitor.purpose.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((visitor) => visitor.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (visitor) => visitor.visitorCategory === categoryFilter
      );
    }

    // Apply department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (visitor) => visitor.department === departmentFilter
      );
    }

    setFilteredVisitors(filtered);
  }, [searchQuery, visitors, statusFilter, categoryFilter, departmentFilter]);

  const fetchVisitors = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const visitorData = await newVisitorAPI.getAll();
      setVisitors(visitorData);
      setFilteredVisitors(visitorData);
    } catch (err) {
      console.error("Error fetching visitors:", err);
      setError(err instanceof Error ? err.message : "Failed to load visitors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    }
  }, [successMessage]);

  const handleApproveVisitor = async (
    visitorId: string,
    approved: boolean,
    type: string = "visitor"
  ) => {
    if (!token) return;

    const status = approved ? "approved" : "cancelled";

    setApprovingVisitor(visitorId);
    setError(null);
    setSuccessMessage(null);

    try {
      const { doc } = await newVisitorAPI.updateStatus(
        visitorId,
        status,
        token,
        type
      );

      // Update local state
      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor._id === visitorId
            ? { ...visitor, status: doc.status }
            : visitor
        )
      );

      setSuccessMessage(
        `Visitor ${
          status === "approved" ? "approved" : "rejected"
        } successfully`
      );
    } catch (err) {
      console.error("Error updating visitor status:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update visitor status"
      );
    } finally {
      setApprovingVisitor(null);
    }
  };

  const handleEdit = async (
    visitorId: string,
    updatedData: Partial<BaseForm>,
    type: "visitor" | "contractor" = "visitor"
  ) => {
    if (!token) return;

    setError(null);
    setSuccessMessage(null);

    try {
      const { updated } = await newVisitorAPI.editForm(
        visitorId,
        updatedData,
        type
      );

      // Update the local visitors state with the edited data
      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor._id === visitorId ? { ...visitor, ...updated } : visitor
        )
      );

      setIsEditModalOpen(false); // Close modal
      setEditingVisitor(null);
      setFormData({});
      setSuccessMessage("Visitor information updated successfully");
    } catch (err) {
      console.error("Error updating visitor:", err);
      setError(err instanceof Error ? err.message : "Failed to update visitor");
    }
  };

  const handleExportToExcel = async () => {
    if (!token) return;

    try {
      const filters = {
        status: statusFilter !== "all" ? statusFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        department: departmentFilter !== "all" ? departmentFilter : undefined,
      };

      const blob = await newVisitorAPI.exportToExcel(token, filters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `visitor-report-${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccessMessage("Report exported successfully");
    } catch (err) {
      console.error("Error exporting report:", err);
      setError(err instanceof Error ? err.message : "Failed to export report");
    }
  };

  const handleCheckOut = async (visitorId: string) => {
    if (!token) return;

    setCheckingOut(visitorId);
    setError(null);
    setSuccessMessage(null);

    try {
      await newVisitorAPI.checkOutVisitor(visitorId, token);

      // Update local state
      setVisitors((prev) =>
        prev.map((visitor) =>
          visitor._id === visitorId
            ? {
                ...visitor,
                status: "checked-out",
                checkOutTime: new Date().toISOString(),
              }
            : visitor
        )
      );

      setSuccessMessage("Visitor checked out successfully");
    } catch (err) {
      console.error("Error checking out visitor:", err);
      setError(
        err instanceof Error ? err.message : "Failed to check out visitor"
      );
    } finally {
      setCheckingOut(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "checked-in":
        return "bg-green-100 text-green-800";
      case "checked-out":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "approved":
        return <Users className="w-4 h-4" />;
      case "checked-in":
        return <CheckCircle className="w-4 h-4" />;
      case "checked-out":
        return <XCircle className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user) {
    return null; // AppBar will handle unauthorized access
  }

  const contractorsForm = filteredVisitors.filter(
    (v) => v.visitorCategory === "contractor"
  );
  const visitorsForm = filteredVisitors.filter(
    (v) => v.visitorCategory === "visitor"
  );

  return (
    <>
      <div className="flex flex-col mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visitors</h1>
          <p className="mt-2 text-gray-600">
            Manage all visitors and their check-in/check-out status
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-4 sm:mt-0 sm:flex-row">
          <button
            type="button"
            onClick={handleExportToExcel}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            Export to Excel
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
            Filters
          </button>
          <Link
            href="/admin/visitors/add"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Users className="w-4 h-4 mr-2" aria-hidden="true" />
            Add New Visitor
          </Link>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Filters</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                title="Status Filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                title="Category Filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="visitor">Visitor</option>
                <option value="contractor">Contractor</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                title="Department Filter"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          className="flex items-start p-4 mb-6 text-red-700 border-l-4 border-red-500 rounded bg-red-50"
          role="alert"
          aria-labelledby="error-heading"
        >
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5" aria-hidden="true" />
          <div>
            <p id="error-heading" className="font-medium">
              Error
            </p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div
          className="flex items-start p-4 mb-6 text-green-700 border-l-4 border-green-500 rounded bg-green-50"
          role="status"
          aria-labelledby="success-heading"
        >
          <CheckCircle className="h-5 w-5 mr-2 mt-0.5" aria-hidden="true" />
          <div>
            <p id="success-heading" className="font-medium">
              Success
            </p>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              All Visitors
            </h2>
            <div className="relative mt-4 sm:mt-0">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Search visitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm sm:w-64 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search visitors"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div
            className="flex items-center justify-center p-8"
            role="status"
            aria-live="polite"
          >
            <div
              className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"
              aria-hidden="true"
            ></div>
            <span className="ml-2 text-gray-600">Loading visitors...</span>
            <span className="sr-only">Loading visitors, please wait</span>
          </div>
        ) : filteredVisitors.length === 0 ? (
          <div className="p-8 text-center" role="status">
            <Users
              className="w-12 h-12 mx-auto mb-4 text-gray-400"
              aria-hidden="true"
            />
            <h3 className="text-lg font-medium text-gray-900">
              No visitors found
            </h3>
            <p className="mt-1 text-gray-500">
              {searchQuery
                ? "Try adjusting your search criteria."
                : "There are no visitors in the system yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop view */}

            {/* Visitor Form */}
            {visitorsForm.length > 0 && (
              <div className="hidden mb-6 overflow-x-auto text-2xl md:block">
                <h1 className="px-4 py-2 font-bold text-gray-900">
                  Visitors Form
                </h1>
                <table
                  className="min-w-full divide-y divide-gray-200"
                  aria-label="Visitors list"
                >
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Visitor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Host & Department
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Visit Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Status
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
                    {visitorsForm.map((visitor) => (
                      <tr key={visitor._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full"
                              aria-hidden="true"
                            >
                              <span className="font-medium text-blue-600">
                                {visitor.firstName?.charAt(0)}
                                {visitor.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {visitor.firstName} {visitor.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {visitor.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">
                              {visitor.hostEmployee || "—"}
                            </div>
                            <div className="text-gray-500">
                              {visitor.department || "—"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatDate(visitor.visitStartDate)} -{" "}
                              {formatDate(visitor.visitEndDate)}
                            </div>
                            <div className="text-gray-500">
                              {visitor.siteLocation || "—"}
                            </div>
                            <div className="text-gray-500">
                              {visitor.meetingLocation || "—"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {visitor.visitorCategory || "Not specified"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                              visitor.status
                            )}`}
                          >
                            <span aria-hidden="true">
                              {getStatusIcon(visitor.status)}
                            </span>
                            <span className="ml-1 capitalize">
                              {visitor.status}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/visitors/${visitor._id}`}
                              className="text-blue-600 hover:text-blue-900"
                              aria-label={`View details for ${visitor.firstName} ${visitor.lastName}`}
                            >
                              <Eye className="w-4 h-4" aria-hidden="true" />
                            </Link>

                            {/* Edit form */}

                            <button
                              type="button"
                              onClick={() => {
                                setEditingVisitor(visitor);
                                setFormData(visitor); // prefill form
                                setIsEditModalOpen(true);
                              }}
                            >
                              {<Edit className="w-4 h-4" aria-hidden="true" />}
                            </button>

                            {/* Approval buttons for pending visitors */}
                            {visitor.status === "pending" &&
                              (user?.role === "admin" ||
                                user?.role === "manager") && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleApproveVisitor(
                                        visitor._id,
                                        true,
                                        visitor.visitorCategory
                                      )
                                    }
                                    disabled={approvingVisitor === visitor._id}
                                    className="text-green-600 hover:text-green-900 disabled:text-green-300 disabled:cursor-not-allowed"
                                    aria-label={`Approve ${visitor.firstName} ${visitor.lastName}`}
                                  >
                                    {approvingVisitor === visitor._id ? (
                                      <div
                                        className="w-4 h-4 border-t-2 border-b-2 border-green-600 rounded-full animate-spin"
                                        aria-hidden="true"
                                      ></div>
                                    ) : (
                                      <Check
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleApproveVisitor(
                                        visitor._id,
                                        false,
                                        visitor.visitorCategory
                                      )
                                    }
                                    disabled={approvingVisitor === visitor._id}
                                    className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed"
                                    aria-label={`Reject ${visitor.firstName} ${visitor.lastName}`}
                                  >
                                    <X className="w-4 h-4" aria-hidden="true" />
                                  </button>
                                </>
                              )}

                            {/* Check out button for checked-in visitors */}
                            {visitor.status === "checked-in" && (
                              <button
                                type="button"
                                onClick={() => handleCheckOut(visitor._id)}
                                disabled={checkingOut === visitor._id}
                                className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed"
                                aria-label={`Check out ${visitor.firstName} ${visitor.lastName}`}
                              >
                                {checkingOut === visitor._id ? (
                                  <div
                                    className="w-4 h-4 border-t-2 border-b-2 border-red-600 rounded-full animate-spin"
                                    aria-hidden="true"
                                  ></div>
                                ) : (
                                  <XCircle
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                  />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Contractor Form */}
            {contractorsForm.length > 0 && (
              <div className="hidden mt-6 overflow-x-auto md:block">
                <h1 className="px-4 py-2 text-2xl font-bold text-gray-900">
                  Contractors Form
                </h1>
                <table
                  className="min-w-full overflow-x-auto divide-y divide-gray-200"
                  aria-label="contractorsForm list"
                >
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Visitor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Host & Department
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Visit Details
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Hazards
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        PPE
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Status
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
                    {contractorsForm.map((visitor) => (
                      <tr key={visitor._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full"
                              aria-hidden="true"
                            >
                              <span className="font-medium text-blue-600">
                                {visitor.firstName?.charAt(0)}
                                {visitor.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {visitor.firstName} {visitor.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {visitor.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">
                              {visitor.hostEmployee || "—"}
                            </div>
                            <div className="text-gray-500">
                              {visitor.department || "—"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatDate(visitor.visitStartDate)} -{" "}
                              {formatDate(visitor.visitEndDate)}
                            </div>
                            <div className="text-gray-500">
                              {visitor.siteLocation || "—"}
                            </div>
                            <div className="text-gray-500">
                              {visitor.meetingLocation || "—"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {visitor.visitorCategory || "Not specified"}
                        </td>
                        {/* Hazards column */}
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {Array.isArray(visitor.hazards) &&
                          visitor.hazards.length > 0 ? (
                            <ul className="ml-4 space-y-1 list-disc">
                              {visitor.hazards.map((hazard, index) => (
                                <li key={index}>
                                  <div>
                                    <span className="font-semibold">
                                      Title:
                                    </span>{" "}
                                    {hazard.title}
                                  </div>
                                  <div>
                                    <span className="font-semibold">Risk:</span>{" "}
                                    {hazard.risk}
                                  </div>
                                  <div>
                                    <span className="font-semibold">
                                      Controls:
                                    </span>{" "}
                                    {hazard.selectedControls?.join(", ")}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="italic text-gray-400">
                              No hazards
                            </span>
                          )}
                        </td>

                        {/* PPE column */}
                        <td className="px-6 py-4 whitespace-nowrap text-[13px] text-gray-500">
                          {visitor.ppe &&
                          Object.values(visitor.ppe).includes("Y") ? (
                            <ul className="ml-4 space-y-1 list-disc">
                              {Object.entries(visitor.ppe).map(
                                ([item, value]) =>
                                  value === "Y" ? (
                                    <li key={item}>{item}</li>
                                  ) : null
                              )}
                            </ul>
                          ) : (
                            <span className="italic text-gray-400">No PPE</span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                              visitor.status
                            )}`}
                          >
                            <span aria-hidden="true">
                              {getStatusIcon(visitor.status)}
                            </span>
                            <span className="ml-1 capitalize">
                              {visitor.status}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/visitors/${visitor._id}`}
                              className="text-blue-600 hover:text-blue-900"
                              aria-label={`View details for ${visitor.firstName} ${visitor.lastName}`}
                            >
                              <Eye className="w-4 h-4" aria-hidden="true" />
                            </Link>
                            <Link
                              href={`/admin/documents?visitorId=${visitor._id}`}
                              className="text-green-600 hover:text-green-900"
                              aria-label={`View documents for ${visitor.firstName} ${visitor.lastName}`}
                            >
                              <FileText
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                            </Link>

                            {/* Edit form */}

                            <button
                              type="button"
                              onClick={() => {
                                setEditingVisitor(visitor);
                                setFormData(visitor); // prefill form
                                setIsEditModalOpen(true);
                              }}
                            >
                              {<Edit className="w-4 h-4" aria-hidden="true" />}
                            </button>

                            {/* Approval buttons for pending visitors */}
                            {visitor.status === "pending" &&
                              (user?.role === "admin" ||
                                user?.role === "manager") && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleApproveVisitor(
                                        visitor._id,
                                        true,
                                        visitor.visitorCategory
                                      )
                                    }
                                    disabled={approvingVisitor === visitor._id}
                                    className="text-green-600 hover:text-green-900 disabled:text-green-300 disabled:cursor-not-allowed"
                                    aria-label={`Approve ${visitor.firstName} ${visitor.lastName}`}
                                  >
                                    {approvingVisitor === visitor._id ? (
                                      <div
                                        className="w-4 h-4 border-t-2 border-b-2 border-green-600 rounded-full animate-spin"
                                        aria-hidden="true"
                                      ></div>
                                    ) : (
                                      <Check
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleApproveVisitor(
                                        visitor._id,
                                        false,
                                        visitor.visitorCategory
                                      )
                                    }
                                    disabled={approvingVisitor === visitor._id}
                                    className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed"
                                    aria-label={`Reject ${visitor.firstName} ${visitor.lastName}`}
                                  >
                                    <X className="w-4 h-4" aria-hidden="true" />
                                  </button>
                                </>
                              )}

                            {/* Check out button for checked-in visitors */}
                            {visitor.status === "checked-in" && (
                              <button
                                type="button"
                                onClick={() => handleCheckOut(visitor._id)}
                                disabled={checkingOut === visitor._id}
                                className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed"
                                aria-label={`Check out ${visitor.firstName} ${visitor.lastName}`}
                              >
                                {checkingOut === visitor._id ? (
                                  <div
                                    className="w-4 h-4 border-t-2 border-b-2 border-red-600 rounded-full animate-spin"
                                    aria-hidden="true"
                                  ></div>
                                ) : (
                                  <XCircle
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                  />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile view */}
            <div className="md:hidden">
              <ul
                className="divide-y divide-gray-200"
                aria-label="Visitors list"
              >
                {filteredVisitors.map((visitor) => (
                  <li key={visitor._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div
                          className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full"
                          aria-hidden="true"
                        >
                          <span className="font-medium text-blue-600">
                            {visitor.firstName?.charAt(0)}
                            {visitor.lastName?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {visitor.firstName} {visitor.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {visitor.email}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          visitor.status
                        )}`}
                      >
                        <span aria-hidden="true">
                          {getStatusIcon(visitor.status)}
                        </span>
                        <span className="ml-1 capitalize">
                          {visitor.status}
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      <div>
                        <span className="font-medium text-gray-500">Host:</span>
                        <div className="mt-1 text-gray-900">
                          {visitor.hostEmployee || "—"}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-500">
                          Department:
                        </span>
                        <div className="mt-1 text-gray-900">
                          {visitor.department || "—"}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-500">
                          Category:
                        </span>
                        <div className="mt-1 text-gray-900">
                          {visitor.visitorCategory || "Not specified"}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-500">
                          Meeting Location:
                        </span>
                        <div className="mt-1 text-gray-900">
                          {visitor.meetingLocation || "—"}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <span className="font-medium text-gray-500">
                          Visit Period:
                        </span>
                        <div className="mt-1 text-gray-900">
                          {formatDate(visitor.visitStartDate)} -{" "}
                          {formatDate(visitor.visitEndDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex space-x-3">
                        <Link
                          href={`/admin/visitors/${visitor._id}`}
                          className="flex items-center text-blue-600 hover:text-blue-900"
                          aria-label={`View details for ${visitor.firstName} ${visitor.lastName}`}
                        >
                          <Eye className="w-4 h-4 mr-1" aria-hidden="true" />
                          <span>Details</span>
                        </Link>
                        {visitor.visitorCategory === "contractor" && (
                          <Link
                            href={`/admin/documents?visitorId=${visitor._id}`}
                            className="flex items-center text-green-600 hover:text-green-900"
                            aria-label={`View documents for ${visitor.firstName} ${visitor.lastName}`}
                          >
                            <FileText
                              className="w-4 h-4 mr-1"
                              aria-hidden="true"
                            />
                            <span>Docs</span>
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setEditingVisitor(visitor);
                            setFormData(visitor); // prefill form
                            setIsEditModalOpen(true);
                          }}
                          className="flex items-center text-yellow-500 hover:text-yellow-600"
                          aria-label={`Edit documents for ${visitor.firstName} ${visitor.lastName}`}
                        >
                          {<Edit className="w-4 h-4" aria-hidden="true" />}
                          <span> edit</span>
                        </button>
                      </div>

                      <div className="flex space-x-2">
                        {/* Approval buttons for pending visitors */}
                        {visitor.status === "pending" &&
                          (user?.role === "admin" ||
                            user?.role === "manager") && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleApproveVisitor(
                                    visitor._id,
                                    true,
                                    visitor.visitorCategory
                                  )
                                }
                                disabled={approvingVisitor === visitor._id}
                                className="flex items-center text-green-600 hover:text-green-900 disabled:text-green-300 disabled:cursor-not-allowed"
                                aria-label={`Approve ${visitor.firstName} ${visitor.lastName}`}
                              >
                                {approvingVisitor === visitor._id ? (
                                  <div
                                    className="w-4 h-4 border-t-2 border-b-2 border-green-600 rounded-full animate-spin"
                                    aria-hidden="true"
                                  ></div>
                                ) : (
                                  <>
                                    <Check
                                      className="w-4 h-4 mr-1"
                                      aria-hidden="true"
                                    />
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleApproveVisitor(
                                    visitor._id,
                                    false,
                                    visitor.visitorCategory
                                  )
                                }
                                disabled={approvingVisitor === visitor._id}
                                className="flex items-center text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed"
                                aria-label={`Reject ${visitor.firstName} ${visitor.lastName}`}
                              >
                                <X
                                  className="w-4 h-4 mr-1"
                                  aria-hidden="true"
                                />
                              </button>
                            </>
                          )}

                        {/* Check out button for checked-in visitors */}
                        {visitor.status === "checked-in" && (
                          <button
                            type="button"
                            onClick={() => handleCheckOut(visitor._id)}
                            disabled={checkingOut === visitor._id}
                            className="flex items-center text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed"
                            aria-label={`Check out ${visitor.firstName} ${visitor.lastName}`}
                          >
                            {checkingOut === visitor._id ? (
                              <>
                                <div
                                  className="w-4 h-4 mr-1 border-t-2 border-b-2 border-red-600 rounded-full animate-spin"
                                  aria-hidden="true"
                                ></div>
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <XCircle
                                  className="w-4 h-4 mr-1"
                                  aria-hidden="true"
                                />
                                <span>Check Out</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {isEditModalOpen && editingVisitor && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-black/70">
                <div className="bg-white rounded-lg shadow p-6 max-w-md relative w-[80%]">
                  <h2 className="mb-4 text-lg font-semibold">
                    Edit Visitor Form
                  </h2>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!editingVisitor) return;
                      await handleEdit(
                        editingVisitor._id,
                        formData,
                        editingVisitor.visitorCategory as
                          | "visitor"
                          | "contractor"
                      );
                      setIsEditModalOpen(false);
                    }}
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium">
                        Site Location
                      </label>
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
                          <SelectItem value="Head Office">
                            Head Office
                          </SelectItem>
                          <SelectItem value="Branch A">Branch A</SelectItem>
                          <SelectItem value="Branch B">Branch B</SelectItem>
                          <SelectItem value="Remote Site">
                            Remote Site
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium">
                        Site Location
                      </label>
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
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium">
                        Department
                      </label>
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
                    </div>

                    {/* Add other fields as needed */}

                    <div className="flex justify-end space-x-3">
                      <Button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </Button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
