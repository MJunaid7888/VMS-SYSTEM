"use client";

import { useState } from "react";
import { adminAPI } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

type Props = {
  refreshGroups: () => void;
};

export default function GroupCreator({ refreshGroups }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const createGroup = async () => {
    setLoading(true);

    if (!token) {
      console.error("No token found. User might not be authenticated.");
      return;
    }
    try {
      const group = await adminAPI.createGroup({ name, description }, token);
      alert(`Group '${group.name}' created!`);
      setName("");
      setDescription("");
      refreshGroups();
    } catch (err: any) {
      alert("Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-4 mt-6 border rounded shadow-sm bg-gray-50">
      <h2 className="mb-4 text-lg font-semibold">Create New Group</h2>

      <div className="mb-3">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Group Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="e.g. Safety Team"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Description (optional)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="e.g. Handles safety training"
        />
      </div>

      <button
        onClick={createGroup}
        disabled={!name || loading}
        className="px-4 py-2 text-white bg-blue-600 rounded disabled:bg-gray-400"
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </div>
  );
}
