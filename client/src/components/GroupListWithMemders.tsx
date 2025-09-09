"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

type Group = {
  _id: string;
  name: string;
  description?: string;
};

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  groups: string[];
};

export default function GroupListWithMembers() {
  const { token } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupMembers, setGroupMembers] = useState<Record<string, User[]>>({});

  useEffect(() => {
    const fetchGroupsAndMembers = async () => {
      if (!token) return;
      try {
        const groupsData = (await adminAPI.fetchGroups(token)).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setGroups(groupsData);

        const membersMap: Record<string, User[]> = {};

        for (const group of groupsData) {
          const users = await adminAPI.getGroupMembers(group.name, token);

          membersMap[group.name] = users;
        }

        setGroupMembers(membersMap);
      } catch (err) {
        console.error("Failed to fetch groups or members", err);
      }
    };

    fetchGroupsAndMembers();
  }, [token]);

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Groups and Members</h2>

      {groups.map((group) => (
        <div
          key={group._id}
          className="p-4 mb-6 bg-white border rounded shadow-sm"
        >
          <h3 className="mb-2 text-lg font-bold text-blue-700">
            {group.name}
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {groupMembers[group.name]?.length || 0} members
            </span>
          </h3>

          <p className="mb-2 text-sm text-gray-600">
            <span className="font-semibold">Desc:</span> {group.description}
          </p>

          <table className="w-full border table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left text-[14px] sm:text-sm md:text-base">
                  S/N
                </th>
                <th className="border p-2 text-left text-[14px] sm:text-sm md:text-base">
                  Member Name
                </th>
                <th className="border p-2 text-left text-[14px] sm:text-sm md:text-base">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {groupMembers[group.name]?.length > 0 ? (
                groupMembers[group.name].map((user, index) => (
                  <tr key={user._id}>
                    <td className="border p-2 text-[13px] md:text-sm">
                      {index + 1}
                    </td>
                    <td className="border p-2 text-[13px] md:text-sm">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="border p-2 text-[13px] md:text-sm">
                      {user.email}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="p-2 italic text-center text-gray-500 border"
                  >
                    No members assigned
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
