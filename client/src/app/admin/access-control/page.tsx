"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Device = {
  _id: string;
  name: string;
  type: "door" | "camera" | "sensor";
  status: boolean;
  apiEndpoint?: string;
};

export default function AccessControlPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch(
          "https://backend-vms-1.onrender.com/api/devices"
        );
        const data = await res.json();
        setDevices(data);
      } catch (error) {
        console.error("Failed to fetch devices", error);
      }
    };
    fetchDevices();
  }, []);

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const toggleDeviceStatus = async (id: string) => {
    try {
      const res = await fetch(
        `https://backend-vms-1.onrender.com/api/devices/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: !devices.find((d) => d._id === id)?.status,
          }),
        }
      );

      const updatedDevice = await res.json();
      setDevices((prev) => prev.map((d) => (d._id === id ? updatedDevice : d)));
    } catch (err) {
      console.error("Failed to toggle device status:", err);
    }
  };

  const updateApiEndpoint = async (id: string, value: string) => {
    setValidationErrors((prev) => ({
      ...prev,
      [id]: value && !isValidUrl(value) ? "Invalid URL format." : "",
    }));

    if (!isValidUrl(value)) return;

    try {
      await fetch(`https://backend-vms-1.onrender.com/api/devices/${id}/url`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiEndpoint: value }),
      });

      setDevices((prev) =>
        prev.map((device) =>
          device._id === id ? { ...device, apiEndpoint: value } : device
        )
      );
    } catch (e) {
      console.error("Failed to update API URL", e);
    }
  };

  return (
    <div className="max-w-5xl p-4 mx-auto space-y-8 sm:p-6 lg:p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Access Control Panel
        </h1>
        <p className="mt-2 text-gray-500 text-md">
          Manage door locks, cameras, and sensor endpoints.
        </p>
      </div>

      <div className="p-6 border shadow-sm bg-gray-50 rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          Add New Device
        </h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const name = form.deviceName.value;
            const type = form.deviceType.value;

            if (!name || !type) return alert("All fields required");

            try {
              const res = await fetch(
                "https://backend-vms-1.onrender.com/api/devices",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, type }),
                }
              );
              const newDevice = await res.json();
              setDevices((prev) => [...prev, newDevice]);
              form.reset();
            } catch (err) {
              console.error("Failed to add device", err);
            }
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div>
            <Label htmlFor="deviceName" className="block mb-1 text-sm">
              Device Name
            </Label>
            <Input id="deviceName" name="deviceName" required />
          </div>
          <div>
            <label htmlFor="deviceType" className="block mb-1 text-sm">
              Device Type
            </label>
            <select
              name="deviceType"
              id="deviceType"
              className="w-full px-3 py-2 text-sm border rounded-md"
              required
            >
              <option value="">Select type</option>
              <option value="door">Door</option>
              <option value="camera">Camera</option>
              <option value="sensor">Sensor</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="px-4 py-2 mt-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Add Device
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {devices.map((device) => (
          <Card
            key={device._id}
            className="border border-gray-200 shadow-lg rounded-2xl"
          >
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {device.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Type:{" "}
                    {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Status: {device.status ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`device-${device._id}`} className="text-sm">
                    {device.status ? "Turn Off" : "Turn On"}
                  </Label>
                  <Switch
                    id={`device-${device._id}`}
                    checked={device.status}
                    onCheckedChange={() => toggleDeviceStatus(device._id)}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Label htmlFor={`api-${device._id}`} className="text-sm">
                  Device API Endpoint
                </Label>
                <Input
                  id={`api-${device._id}`}
                  placeholder="https://example.com/device-api"
                  className="mt-1"
                  value={device.apiEndpoint || ""}
                  onChange={(e) =>
                    updateApiEndpoint(device._id, e.target.value)
                  }
                />
                {validationErrors[device._id] && (
                  <p className="mt-1 text-sm text-red-500">
                    {validationErrors[device._id]}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="pt-10">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Device Logs</h2>
        {devices.length > 0 ? (
          <ul className="pl-5 space-y-2 text-sm text-gray-600 list-disc">
            {devices.map((d) => (
              <li key={d._id}>
                {d.name} is currently{" "}
                <strong>{d.status ? "enabled" : "disabled"}</strong>.
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-600 text-[12px] md:text-sm pl-2">
            No device created yet!!!
          </div>
        )}
      </div>
    </div>
  );
}
