"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { adminAPI, User } from "@/lib/api";
import {
  Users,
  Search,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [userGroups, setUserGroups] = useState<Record<string, string[]>>({});

  const { token, user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [token]);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter, departmentFilter, statusFilter]);

  const fetchUsers = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const userData = await adminAPI.getUsers(token);
      console.log(userData);

      setUsers(userData);

      // Fetch groups for each user
      const groupMap: Record<string, string[]> = {};
      for (const usr of userData) {
        try {
          const res = await adminAPI.getUserGroups(usr._id, token);
          groupMap[usr._id] = res.groups;
        } catch (groupErr) {
          console.error(`Failed to fetch groups for user ${usr._id}`, groupErr);
          groupMap[usr._id] = [];
        }
      }

      setUserGroups(groupMap);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user?.firstName?.toLowerCase().includes(query) ||
          user?.lastName?.toLowerCase().includes(query) ||
          user?.email?.toLowerCase().includes(query) ||
          user?.department?.toLowerCase().includes(query)
      );
    }
    if (roleFilter) {
      filtered = filtered.filter((user) => user?.role === roleFilter);
    }
    if (departmentFilter) {
      filtered = filtered.filter(
        (user) => user?.department === departmentFilter
      );
    }
    if (statusFilter) {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((user) => user?.isActive === isActive);
    }
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!token || !userId) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setError(null);
    setSuccessMessage(null);
    try {
      await adminAPI.deleteUser(userId, token);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      setSuccessMessage("User deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const getDepartments = () => {
    const departments = new Set<string>();
    users?.forEach(
      (user) => user?.department && departments.add(user.department)
    );
    return Array.from(departments);
  };

  if (!user) return null;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            View, edit, and manage system users.
          </p>
        </div>
        <Link
          href="/admin/users/add"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Link>
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

      {successMessage && (
        <div className="flex items-start p-4 mb-6 text-green-700 border-l-4 border-green-500 rounded bg-green-50">
          <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Success</p>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="host">Host</option>
                <option value="security">Security</option>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">All Departments</option>
                {getDepartments().map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    Department
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    Groups
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-right text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const firstName = user?.firstName ?? "Unknown";
                  const lastName = user?.lastName ?? "";
                  const email = user?.email ?? "";
                  const role = user?.role ?? "unknown";
                  const department = user?.department ?? "N/A";
                  const isActive = user?.isActive ?? false;

                  return (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                            <span className="font-medium text-blue-800">
                              {firstName.charAt(0)}
                              {lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {firstName} {lastName}
                            </div>
                            <div className="text-sm text-gray-500">{email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 text-xs font-semibold text-blue-800 capitalize bg-blue-100 rounded-full">
                          {role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {department}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {userGroups[user._id]?.length > 0 ? (
                          userGroups[user._id].join(", ")
                        ) : (
                          <span className="italic text-gray-400">None</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/users/${user?._id ?? ""}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user?._id ?? "")}
                            className="text-red-600 hover:text-red-900"
                          >
                            {<Trash2 className="w-5 h-5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
