"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Visitor } from "@/lib/api";
import { QRCodeSVG } from "qrcode.react";
import {
  Download,
  Share,
  Clock,
  Calendar,
  Building,
  User,
  Shield,
  Info,
  CheckCircle,
} from "lucide-react";

interface VisitorBadgeProps {
  visitor: Visitor;
  hostName?: string;
}

export default function VisitorBadge({ visitor, hostName }: VisitorBadgeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [qrValue, setQrValue] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  // Update the current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Generate QR code data
  useEffect(() => {
    if (visitor) {
      const badgeData = {
        visitorId: visitor._id,
        name: `${visitor.firstName} ${visitor.lastName}`,
        status: visitor.status,
        timestamp: Date.now(),
        type: "visitor-badge",
      };
      setQrValue(JSON.stringify(badgeData));
    }
  }, [visitor]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTime = (dateString?: string) => {
    const date = dateString ? new Date(dateString) : new Date();
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle badge download
  const handleDownload = () => {
    const badgeElement = document.getElementById("visitor-badge");
    if (!badgeElement) return;

    // Use html2canvas or similar library to capture the badge as an image
    // This is a placeholder - in a real implementation, you would use a library
    alert("Download functionality would capture the badge as an image");
  };

  // Handle badge sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Visitor Badge",
          text: `Visitor Badge for ${visitor.firstName} ${visitor.lastName}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API not supported in your browser");
    }
  };

  if (!visitor) return null;

  return (
    <div className="max-w-md mx-auto">
      {/* Badge Container */}
      <div
        id="visitor-badge"
        className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg sm:rounded-xl"
      >
        {/* Badge Header */}
        <div className="p-3 text-white bg-gradient-to-r from-blue-600 to-indigo-700 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 mr-1.5 sm:mr-2" />
              <h2 className="text-lg font-bold sm:text-xl">VISITOR</h2>
            </div>
            <div className="text-xs sm:text-sm opacity-90">
              ID: {visitor._id.substring(0, 8)}
            </div>
          </div>
        </div>

        {/* Badge Content */}
        <div className="p-3 sm:p-4">
          {/* Visitor Info */}
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mr-2 text-base font-bold text-white rounded-full sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 sm:text-xl sm:mr-3">
              {visitor.firstName.charAt(0)}
              {visitor.lastName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-lg font-bold text-gray-900 truncate sm:text-xl">
                {visitor.firstName} {visitor.lastName}
              </h3>
              <p className="text-sm text-gray-600 truncate sm:text-base">
                {visitor.company || "Guest"}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 ${
              visitor.status === "checked-in"
                ? "bg-green-100 text-green-800"
                : visitor.status === "approved"
                ? "bg-blue-100 text-blue-800"
                : visitor.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <CheckCircle className="w-3 h-3 mr-1 sm:h-4 sm:w-4" />
            {visitor.status === "checked-in"
              ? "Checked In"
              : visitor.status === "approved"
              ? "Approved"
              : visitor.status === "pending"
              ? "Pending"
              : visitor.status === "checked-out"
              ? "Checked Out"
              : visitor.status === "cancelled"
              ? "Cancelled"
              : visitor.status}
          </div>

          {/* Visit Details */}
          <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="mr-1 font-medium">Date:</span>
              <span className="truncate">
                {formatDate(visitor.visitStartDate)}
              </span>
            </div>

            <div className="flex items-start text-gray-700 sm:items-center">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mr-1.5 sm:mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
              <span className="mr-1 font-medium">Start:</span>
              <span className="truncate">
                {visitor.visitStartDate
                  ? formatDate(visitor.visitStartDate) +
                    " " +
                    formatTime(visitor.visitStartDate)
                  : "Not specified"}
              </span>
            </div>

            <div className="flex items-start text-gray-700 sm:items-center">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mr-1.5 sm:mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
              <span className="mr-1 font-medium">End:</span>
              <span className="truncate">
                {visitor.visitEndDate
                  ? formatDate(visitor.visitEndDate) +
                    " " +
                    formatTime(visitor.visitEndDate)
                  : "Not specified"}
              </span>
            </div>

            <div className="flex items-center text-gray-700">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="mr-1 font-medium">Category:</span>
              <span className="truncate">
                {visitor.category || "Not specified"}
              </span>
            </div>

            {visitor.checkInTime && (
              <div className="flex items-center text-gray-700">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mr-1.5 sm:mr-2 flex-shrink-0" />
                <span className="mr-1 font-medium">Check-in:</span>
                <span className="truncate">
                  {formatTime(visitor.checkInTime)}
                </span>
              </div>
            )}

            <div className="flex items-center text-gray-700">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mr-1.5 sm:mr-2 flex-shrink-0" />
              <span className="mr-1 font-medium">Host:</span>
              <span className="truncate">
                {hostName || visitor.hostEmployee || "Not specified"}
              </span>
            </div>

            <div className="flex items-start text-gray-700 sm:items-center">
              <Building className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 mr-1.5 sm:mr-2 mt-0.5 sm:mt-0 flex-shrink-0" />
              <span className="mr-1 font-medium">Purpose:</span>
              <span className="truncate">{visitor.purpose || "Visit"}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-white p-1.5 sm:p-2 border border-gray-200 rounded-lg">
              <QRCodeSVG
                value={qrValue}
                size={120}
                level="H"
                className="mx-auto"
              />
            </div>
          </div>

          {/* Current Time */}
          <div className="mb-3 text-xs text-center text-gray-500 sm:text-sm sm:mb-4">
            Current time: {formatTime()}
          </div>

          {/* Info Button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 text-xs sm:text-sm py-1.5 sm:py-2 border-t border-gray-100"
          >
            <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
            {showInfo ? "Hide Information" : "Show Information"}
          </button>

          {/* Additional Info */}
          {showInfo && (
            <div className="p-2 mt-2 text-xs text-blue-800 rounded-lg sm:mt-3 sm:p-3 bg-blue-50 sm:text-sm">
              <p className="mb-1 sm:mb-2">
                This digital badge serves as your identification while on
                premises.
              </p>
              <p>
                Please keep it accessible on your device. You may be asked to
                show this badge at security checkpoints.
              </p>
            </div>
          )}
        </div>

        {/* Badge Footer */}
        <div className="p-2 border-t border-gray-200 bg-gray-50 sm:p-3">
          <div className="flex justify-between">
            <button
              onClick={handleDownload}
              className="flex items-center py-1 text-xs text-gray-700 hover:text-blue-700 sm:text-sm"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
              Save Badge
            </button>

            {typeof navigator !== "undefined" && "share" in navigator && (
              <button
                onClick={handleShare}
                className="flex items-center py-1 text-xs text-gray-700 hover:text-blue-700 sm:text-sm"
              >
                <Share className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                Share
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
