"use client";

import { useState, useEffect } from "react";
import { X, Bell, Calendar, User, Info } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success";
  read: boolean;
}

interface NotificationsPanelProps {
  onClose: () => void;
}

export default function NotificationsPanel({
  onClose,
}: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;

      setIsLoading(true);
      setError(null);

      try {
        // For now, show empty notifications since there's no backend endpoint yet
        // TODO: Implement real notifications API endpoint
        setNotifications([]);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load notifications");
        setIsLoading(false);
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [token]);

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="absolute right-0 z-50 mt-2 overflow-hidden bg-white rounded-lg shadow-lg top-full w-80">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-900" />
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="mr-3 text-xs text-blue-700 hover:text-blue-900"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-96">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="w-6 h-6 mx-auto border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-500">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    {notification.type === "info" && (
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                        <Info className="w-4 h-4 text-blue-600" />
                      </div>
                    )}
                    {notification.type === "warning" && (
                      <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                        <Calendar className="w-4 h-4 text-yellow-600" />
                      </div>
                    )}
                    {notification.type === "success" && (
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 text-center border-t">
        <button
          onClick={() => {
            // In a real implementation, this would navigate to a notifications page
            // For now, we'll just close the panel
            onClose();
            // You could also use router.push('/notifications') if you had a notifications page
          }}
          className="text-sm text-blue-700 hover:text-blue-900"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}
