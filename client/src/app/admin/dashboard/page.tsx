"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import VisitHistoryTable from "@/components/VisitHistoryTable";
import {
  Users,
  Calendar,
  Clock,
  BarChart2,
  ArrowUp,
  FileText,
  BookOpen,
} from "lucide-react";

import { analyticsAPI, newVisitorAPI, VisitorForm } from "@/lib/api";
import AnalyticsDashboard from "@/components/charts/AnalyticsDashboard";

export default function AdminDashboard() {
  const [visitorStats, setVisitorStats] = useState({
    total: 0,
    checkedIn: 0,
    checkedOut: 0,
    scheduled: 0,
    pending: 0,
    approved: 0,
  });
  const [filteredVisitors, setFilteredVisitors] = useState<VisitorForm[]>([]);
  const [filteredContractors, setFilteredcontractors] = useState<VisitorForm[]>(
    []
  );
  const [filteredScheduleVisit, setFilteredScheduleVisit] = useState([]);
  const [checkedOut, setCheckedOut] = useState<VisitorForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuth();

  const fetchVisitors = async () => {
    setIsLoading(true);
    try {
      const visitorData: VisitorForm[] = await newVisitorAPI.getAll();
      const scheduleVisitData = await newVisitorAPI.getAllSchedule();
      const visitors = visitorData.filter(
        (v) => v.visitorCategory === "visitor"
      );
      setFilteredVisitors(visitors);
      const contractors = visitorData.filter(
        (v) => v.visitorCategory === "contractor"
      );

      const checkedout = visitorData.filter((v) => v.status === "checked-out");
      setCheckedOut(checkedout);

      setFilteredcontractors(contractors);
      setFilteredScheduleVisit(scheduleVisitData);

      console.log(filteredVisitors);
      console.log(filteredScheduleVisit);
    } catch (err) {
      console.error("Error fetching visitors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // fetchVisitorStats();
      fetchVisitors();
    }
  }, [token]);

  if (!user) return null;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user.firstName}. Here&apos;s an overview of your
          visitor management system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Total Visitors
            </h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold">
            {isLoading ? "..." : filteredVisitors.length}
          </p>
          <p className="flex items-center mt-2 text-sm text-green-500">
            <ArrowUp className="w-3 h-3 mr-1" />
            <span>12% from last month</span>
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">
              Total Contractors
            </h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold">
            {isLoading ? "..." : filteredContractors.length}
          </p>
          <p className="flex items-center mt-2 text-sm text-green-500">
            <ArrowUp className="w-3 h-3 mr-1" />
            <span>12% from last month</span>
          </p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Scheduled</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold">
            {isLoading ? "..." : filteredScheduleVisit.length}
          </p>
          <p className="mt-2 text-sm text-gray-500">Upcoming visits</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Checked Out</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold">
            {isLoading ? "..." : checkedOut.length}
          </p>
          <p className="mt-2 text-sm text-gray-500">Completed visits</p>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/visitors"
          className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 mr-3 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Manage Visitors
            </h3>
          </div>
          <p className="text-gray-600">
            View, edit, and manage all visitor records and check-ins.
          </p>
        </Link>

        <Link
          href="/admin/documents"
          className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 mr-3 bg-green-100 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Document Management
            </h3>
          </div>
          <p className="text-gray-600">
            Upload and manage visitor documents and certifications.
          </p>
        </Link>

        <Link
          href="/admin/training"
          className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 mr-3 bg-purple-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Training</h3>
          </div>
          <p className="text-gray-600">
            Manage training modules and visitor enrollments.
          </p>
        </Link>

        <Link
          href="/admin/users"
          className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-md"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 mr-3 bg-yellow-100 rounded-lg">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              User Management
            </h3>
          </div>
          <p className="text-gray-600">
            Manage system users, roles, and permissions.
          </p>
        </Link>
      </div>

      {/* Analytics Dashboard */}
      <div className="p-6 mb-8 bg-white rounded-lg shadow">
        <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Analytics Dashboard
            </h2>
            <p className="mt-1 text-gray-600">
              Real-time analytics and reports for visitors and access control
            </p>
          </div>
          <Link
            href="/admin/analytics"
            className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm md:mt-0 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <BarChart2 className="w-4 h-4 mr-2" />
            Full Analytics
          </Link>
        </div>

        <AnalyticsDashboard refreshInterval={300000} />
      </div>

      {/* Visit History Table */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Visit History
          </h2>
          <p className="mt-1 text-gray-600">View recent visitor activity</p>
        </div>

        <div className="p-2 sm:p-4 lg:p-6">
          <VisitHistoryTable />
        </div>
      </div>
    </>
  );
}
