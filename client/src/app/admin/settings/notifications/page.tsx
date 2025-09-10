"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { notificationAPI, NotificationSettings } from "@/lib/api";
import { Bell, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotificationsEnabled: true,
    hostNotificationsEnabled: true,
    visitorNotificationsEnabled: true,
    notificationTypes: {
      "visitor-arrival": true,
      "visitor-departure": true,
      "visitor-registration": true,
      "visitor-cancelled": true,
      "check-in": true,
      "check-out": true,
      registration: true,
      cancelled: true,
      welcome: true,
      "reset-password": true,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token) {
      fetchSettings();
    }
  }, [token]);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await notificationAPI.getNotificationSettings(token || "");
      setSettings(data);
    } catch (err) {
      console.error("Error fetching notification settings:", err);
      setError("Failed to load notification settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChange = (field: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleNotificationTypeToggle = (type: string) => {
    setSettings((prev) => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: !prev.notificationTypes[type],
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await notificationAPI.updateNotificationSettings(settings, token || "");
      setSuccess("Notification settings updated successfully");
    } catch (err) {
      console.error("Error updating notification settings:", err);
      setError("Failed to update notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-6 text-center bg-white rounded-lg shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Access Denied
          </h2>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Link href="/admin/settings" className="mr-4">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Notification Settings
            </h1>
            <p className="mt-2 text-gray-600">
              Configure how and when notifications are sent to hosts and
              visitors.
            </p>
          </div>
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

        {success && (
          <div className="flex items-start p-4 mb-6 text-green-700 border-l-4 border-green-500 rounded bg-green-50">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Success</p>
              <p>{success}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading settings...</span>
          </div>
        ) : (
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="flex items-center text-xl font-semibold text-gray-900">
                <Bell className="w-5 h-5 mr-2 text-blue-600" />
                Notification Channels
              </h2>
              <p className="mt-1 text-gray-600">
                Enable or disable different notification channels.
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Send notifications via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.emailNotificationsEnabled}
                      onChange={() =>
                        handleToggleChange("emailNotificationsEnabled")
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Host Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Send notifications to hosts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.hostNotificationsEnabled}
                      onChange={() =>
                        handleToggleChange("hostNotificationsEnabled")
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Visitor Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Send notifications to visitors
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.visitorNotificationsEnabled}
                      onChange={() =>
                        handleToggleChange("visitorNotificationsEnabled")
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Notification Types
                </h3>
                <p className="mb-4 text-sm text-gray-500">
                  Select which types of notifications should be sent.
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="visitor-arrival"
                      checked={settings.notificationTypes["visitor-arrival"]}
                      onChange={() =>
                        handleNotificationTypeToggle("visitor-arrival")
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="visitor-arrival"
                      className="block ml-2 text-sm text-gray-900"
                    >
                      Visitor Arrival
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="visitor-departure"
                      checked={settings.notificationTypes["visitor-departure"]}
                      onChange={() =>
                        handleNotificationTypeToggle("visitor-departure")
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="visitor-departure"
                      className="block ml-2 text-sm text-gray-900"
                    >
                      Visitor Departure
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="visitor-registration"
                      checked={
                        settings.notificationTypes["visitor-registration"]
                      }
                      onChange={() =>
                        handleNotificationTypeToggle("visitor-registration")
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="visitor-registration"
                      className="block ml-2 text-sm text-gray-900"
                    >
                      Visitor Registration
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="visitor-cancelled"
                      checked={settings.notificationTypes["visitor-cancelled"]}
                      onChange={() =>
                        handleNotificationTypeToggle("visitor-cancelled")
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="visitor-cancelled"
                      className="block ml-2 text-sm text-gray-900"
                    >
                      Visitor Cancellation
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="check-in"
                      checked={settings.notificationTypes["check-in"]}
                      onChange={() => handleNotificationTypeToggle("check-in")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="check-in"
                      className="block ml-2 text-sm text-gray-900"
                    >
                      Check-in
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="check-out"
                      checked={settings.notificationTypes["check-out"]}
                      onChange={() => handleNotificationTypeToggle("check-out")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="check-out"
                      className="block ml-2 text-sm text-gray-900"
                    >
                      Check-out
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="welcome"
                      checked={settings.notificationTypes["welcome"]}
                      onChange={() => handleNotificationTypeToggle("welcome")}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="welcome"
                      className="block ml-2 text-sm text-gray-900"
                    >
                      Welcome
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="reset-password"
                      checked={settings.notificationTypes["reset-password"]}
                      onChange={() =>
                        handleNotificationTypeToggle("reset-password")
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="reset-password"
                      className="block ml-2 text-sm text-gray-900"
                    >
                      Reset Password
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
