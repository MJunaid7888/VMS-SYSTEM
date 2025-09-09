"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { analyticsAPI } from "@/lib/api";
import {
  BarChart2,
  PieChart,
  TrendingUp,
  Users,
  Shield,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import VisitorChart from "./VisitorChart";

interface AnalyticsDashboardProps {
  refreshInterval?: number; // in milliseconds, default is 60000 (1 minute)
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface VisitMetrics {
  visitorsByDay: {
    date: string;
    count: number;
  }[];
  visitorsByPurpose: {
    label: string;
    value: number;
  }[];
}

interface VisitorMetrics {
  totalVisitors: number;
  checkedIn: number;
  checkedOut: number;
  scheduled: number;
  cancelled: number;
  visitorsByDay: {
    date: string;
    count: number;
  }[];
  visitorsByPurpose: {
    purpose: string;
    count: number;
  }[];
}

interface AccessMetrics {
  totalAccesses: number;
  successfulAccesses: number;
  deniedAccesses: number;
  accessesByDay: {
    date: string;
    count: number;
  }[];
  accessesByLocation: {
    location: string;
    count: number;
  }[];
}

export default function AnalyticsDashboard({
  refreshInterval = 60000,
}: AnalyticsDashboardProps) {
  const { token } = useAuth();
  const [visitorMetrics, setVisitorMetrics] = useState<VisitorMetrics | null>(
    null
  );
  const [visitMetrics, setVisitMetrics] = useState<VisitMetrics | null>(null);
  const [accessMetrics, setAccessMetrics] = useState<AccessMetrics | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // today
  });

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    if (!token) return;

    try {
      setIsRefreshing(true);

      // Fetch visitor and access metrics in parallel
      const [visitorData, accessData, visitMetric] = await Promise.all([
        analyticsAPI.getVisitorStats(token),
        analyticsAPI.getAccessMetrics(token),
        analyticsAPI.getVisitorMetrics(token),
      ]);

      console.log(accessData);
      // Transform visitor data to match interface
      const transformedVisitorData: VisitorMetrics = {
        totalVisitors:
          visitorData.visitor?.total + visitorData.contractor?.total,
        checkedIn:
          visitorData.visitor?.checkedIn + visitorData.contractor?.checkedIn,
        checkedOut:
          visitorData.visitor?.checkedOut + visitorData.contractor.checkedOut,
        scheduled:
          visitorData.visitor?.scheduled + visitorData.contractor?.scheduled,
        cancelled: 0, // Default value
        visitorsByDay: [], // Default empty array
        visitorsByPurpose: [], // Default empty array
      };

      setVisitorMetrics(transformedVisitorData);
      setAccessMetrics(accessData as AccessMetrics);
      setVisitMetrics(visitMetric);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics data"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAnalyticsData();
  }, [token, dateRange]);

  // Set up refresh interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAnalyticsData();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [token, dateRange, refreshInterval]);

  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  return (
    <div className="space-y-6">
      {/* Header with date range selector and refresh button */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            {lastUpdated ? (
              <>Last updated: {lastUpdated.toLocaleTimeString()}</>
            ) : (
              <>Loading analytics data...</>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center space-x-2">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                From
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="mt-1 block w-[80%] md:w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                To
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="mt-1 block w-[80%] md:w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center self-end px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start p-4 text-red-700 border-l-4 border-red-500 rounded-lg bg-red-50">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && !visitorMetrics && !accessMetrics ? (
        <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 mb-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Visitor Metrics */}
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="flex items-center text-lg font-medium text-gray-900">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Visitor Metrics
              </h3>
            </div>

            <div className="p-6">
              {visitorMetrics ? (
                <div className="space-y-6">
                  {/* Visitor Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4">
                    <div className="p-2 text-center rounded-lg bg-blue-50 sm:p-4">
                      <p className="text-[12px] sm:text-sm font-medium text-blue-800">
                        Total
                      </p>
                      <p className="text-2xl font-bold">
                        {visitorMetrics.totalVisitors}
                      </p>
                    </div>
                    <div className="p-2 text-center rounded-lg bg-green-50 sm:p-4">
                      <p className="text-[12px] sm:text-sm font-medium text-green-800">
                        Checked In
                      </p>
                      <p className="text-2xl font-bold">
                        {visitorMetrics.checkedIn}
                      </p>
                    </div>
                    <div className="p-2 text-center rounded-lg bg-purple-50 sm:p-4">
                      <p className="text-[12px] sm:text-sm font-medium text-purple-800">
                        Checked Out
                      </p>
                      <p className="text-2xl font-bold">
                        {visitorMetrics.checkedOut}
                      </p>
                    </div>
                    <div className="p-2 text-center rounded-lg bg-yellow-50 sm:p-4">
                      <p className="text-[12px] sm:text-sm font-medium text-yellow-800">
                        Scheduled
                      </p>
                      <p className="text-2xl font-bold">
                        {visitorMetrics.scheduled}
                      </p>
                    </div>
                  </div>

                  {/* Visitor Charts */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="mb-2 font-semibold text-md">
                        Visitors by Day
                      </h4>
                      <div className="p-4 rounded-lg bg-gray-50">
                        {visitMetrics?.visitorsByDay &&
                        visitMetrics.visitorsByDay.length > 0 ? (
                          <VisitorChart
                            data={visitMetrics?.visitorsByDay}
                            type="bar"
                            title="Visitor Trends"
                            height={300}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-64">
                            <BarChart2 className="w-12 h-12 text-gray-400" />
                            <p className="ml-2 text-gray-500">
                              No visitor trend data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 font-semibold text-md">
                        Visitors by Purpose
                      </h4>
                      <div className="p-4 rounded-lg bg-gray-50">
                        {visitMetrics?.visitorsByPurpose &&
                        visitMetrics.visitorsByPurpose.length > 0 ? (
                          <VisitorChart
                            data={visitMetrics?.visitorsByPurpose}
                            type="pie"
                            title="Visit Purposes"
                            height={300}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-64">
                            <PieChart className="w-12 h-12 text-gray-400" />
                            <p className="ml-2 text-gray-500">
                              No purpose data available
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No visitor metrics available
                </div>
              )}
            </div>
          </div>

          {/* Access Metrics */}
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h3 className="flex items-center text-lg font-medium text-gray-900">
                <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                Access Control Metrics
              </h3>
            </div>

            <div className="p-6">
              {accessMetrics ? (
                <div className="space-y-6">
                  {/* Access Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-2 text-center rounded-lg bg-indigo-50 sm:p-4">
                      <p className="text-[12px] sm:text-sm font-medium text-indigo-800">
                        Total
                      </p>
                      <p className="text-2xl font-bold">
                        {accessMetrics.totalAccesses}
                      </p>
                    </div>
                    <div className="p-2 text-center rounded-lg bg-green-50 sm:p-4">
                      <p className="text-[12px] sm:text-sm font-medium text-green-800">
                        Successful
                      </p>
                      <p className="text-2xl font-bold">
                        {accessMetrics.successfulAccesses}
                      </p>
                    </div>
                    <div className="p-2 text-center rounded-lg bg-red-50 sm:p-4">
                      <p className="text-[12px] sm:text-sm font-medium text-red-800">
                        Denied
                      </p>
                      <p className="text-2xl font-bold">
                        {accessMetrics.deniedAccesses}
                      </p>
                    </div>
                  </div>

                  {/* Access Charts */}
                  <div>
                    <h4 className="mb-2 font-semibold text-md">
                      Access Trends
                    </h4>
                    <div className="p-4 rounded-lg bg-gray-50">
                      {accessMetrics.accessesByDay &&
                      accessMetrics.accessesByDay.length > 0 ? (
                        <VisitorChart
                          data={accessMetrics}
                          type="line"
                          title="Access Trends"
                          height={300}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-64">
                          <TrendingUp className="w-12 h-12 text-gray-400" />
                          <p className="ml-2 text-gray-500">
                            No access trend data available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No access metrics available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
