"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import TrainingEnrollment from "@/components/TrainingEnrollment";
import { trainingAPI, Training, newVisitorAPI, VisitorForm } from "@/lib/api";
import {
  BookOpen,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { convertFileToBase64, uploadBase64File } from "@/utils";

export default function TrainingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(
    null
  );
  const [visitors, setVisitors] = useState<VisitorForm[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<VisitorForm[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoadingVisitors, setIsLoadingVisitors] = useState(true);
  const [isLoadingTrainings, setIsLoadingTrainings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [editForm, setEditForm] = useState<Partial<Training>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [videoUploadLoading, setVideoUploadLoading] = useState(false);
  const [bookUploadLoading, setBookUploadLoading] = useState(false);

  const { token, user } = useAuth();

  useEffect(() => {
    if (token) {
      fetchVisitors();
      fetchTrainings();
    }
  }, [token]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVisitors(visitors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = visitors.filter(
        (visitor) =>
          visitor.firstName.toLowerCase().includes(query) ||
          visitor.lastName.toLowerCase().includes(query) ||
          visitor.email.toLowerCase().includes(query)
      );
      setFilteredVisitors(filtered);
    }
  }, [searchQuery, visitors]);

  const fetchVisitors = async () => {
    if (!token) return;

    setIsLoadingVisitors(true);
    setError(null);

    try {
      // For admin users, get all visitors; for others, get only their hosted visitors
      const visitorData = await newVisitorAPI.getAll();
      // : await visitorAPI.getVisitorsByHost(token);
      setVisitors(visitorData);
      setFilteredVisitors(visitorData);

      // Select the first visitor by default if available
      if (visitorData.length > 0) {
        setSelectedVisitorId(visitorData[0]._id);
      }
    } catch (err) {
      console.error("Error fetching visitors:", err);
      setError(err instanceof Error ? err.message : "Failed to load visitors");
    } finally {
      setIsLoadingVisitors(false);
    }
  };

  const fetchTrainings = async () => {
    if (!token) return;

    setIsLoadingTrainings(true);

    try {
      const trainingData = await trainingAPI.getAllTrainings();
      console.log(trainingData);
      setTrainings(trainingData);
    } catch (err) {
      console.error("Error fetching trainings:", err);
      // We don't set the error here to avoid overriding visitor loading errors
    } finally {
      setIsLoadingTrainings(false);
    }
  };

  const handleEdit = async () => {
    if (!editingTraining || !token) return;

    try {
      setIsUpdating(true);
      const updatedTraining = await trainingAPI.updateTraining(
        editingTraining._id,
        editForm,
        token
      );

      console.log("Training updated:", updatedTraining);
      // Update training in state
      setTrainings((prev) =>
        prev.map((t) =>
          t._id === updatedTraining._id ? { ...t, ...editForm } : t
        )
      );

      // Close modal and reset
      setEditingTraining(null);
      setEditForm({});
    } catch (error) {
      console.error("Failed to update training:", error);
      alert("Error updating training");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (trainingId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this training?"
    );
    if (!confirmDelete) return;

    try {
      await trainingAPI.deleteTraining(trainingId, token);
      fetchTrainings();
    } catch (error) {
      console.error("Failed to delete training:", error);
      // Optionally: show an error toast
    }
  };

  const handleEnrollmentSuccess = () => {
    // Refresh the visitor list after successful enrollment
    fetchVisitors();
  };

  const handleToggleStatus = async (trainingId: string) => {
    try {
      await trainingAPI.toggleTrainingStatus(trainingId, token);
      fetchTrainings(); // Refresh list
    } catch (error) {
      console.error("Failed to toggle training status:", error);
      alert("Error updating status");
    }
  };

  // Upload Handlers
  const handleEditVideoUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sanitized = new File([file], file.name.replace(/\//g, "-"), {
      type: file.type,
    });

    try {
      setVideoUploadLoading(true);
      const base64 = await convertFileToBase64(sanitized);
      const url = await uploadBase64File(
        base64,
        "video",
        setVideoUploadLoading
      );

      setEditForm((prev) => {
        const updated = [...(prev.videos || [])];
        updated[index] = { name: sanitized.name, url: url! };
        return { ...prev, videos: updated };
      });
    } catch (err) {
      console.error("Upload failed:", err);
      setVideoUploadLoading(false);
    }
  };

  const handleEditBookUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sanitized = new File([file], file.name.replace(/\//g, "-"), {
      type: file.type,
    });

    try {
      setBookUploadLoading(true);
      const base64 = await convertFileToBase64(sanitized);
      const url = await uploadBase64File(base64, "raw", setBookUploadLoading);

      setEditForm((prev) => {
        const updated = [...(prev.books || [])];
        updated[index] = { name: sanitized.name, url: url! };
        return { ...prev, books: updated };
      });
    } catch (err) {
      console.error("Book upload failed:", err);
      setBookUploadLoading(false);
    }
  };

  if (!user) {
    return null; // Layout will handle unauthorized access
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Training Management
        </h1>
        <p className="mt-2 text-gray-600">
          Manage training modules and visitor enrollments.
        </p>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Available Trainings
            </h2>

            {isLoadingTrainings ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">Loading trainings...</span>
              </div>
            ) : trainings?.length === 0 ? (
              <div className="py-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">
                  No trainings available
                </h3>
                <p className="mt-1 text-gray-500">
                  Create a new training to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {trainings?.map((training) => (
                  <div
                    key={training._id}
                    className={`p-4 rounded-md border ${
                      training.isActive
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {training.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {training.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTraining(training);
                            setEditForm({
                              title: training.title || "",
                              description: training.description || "",
                              type: training.type || "",
                              videos: training.videos?.length
                                ? training.videos
                                : [],
                              books: training.books?.length
                                ? training.books
                                : [],
                              questions: training.questions?.length
                                ? training.questions.map((q) => ({
                                    question: q.question || "",
                                    options: q.options || ["", "", "", ""],
                                    answer:
                                      typeof q.answer === "number"
                                        ? q.answer
                                        : 0,
                                  }))
                                : [],
                            });
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Training"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(training._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Training"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(training._id)}
                          className={`text-sm px-2 py-1 rounded ${
                            training.isActive
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {training.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="mr-2 text-xs font-medium">Type:</span>
                      <span className="text-xs capitalize bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {training.type}
                      </span>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="mr-2 text-xs font-medium">Status:</span>
                      {training.isActive ? (
                        <span className="flex items-center text-xs text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-xs text-red-600">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <Link
                href="/admin/training/create"
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Training
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Enroll Visitor in Training
            </h2>

            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search visitors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {isLoadingVisitors ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">Loading visitors...</span>
              </div>
            ) : filteredVisitors.length === 0 ? (
              <div className="py-8 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">
                  No visitors found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                {filteredVisitors.map((visitor) => (
                  <button
                    type="button"
                    key={visitor._id}
                    onClick={() => setSelectedVisitorId(visitor._id)}
                    className={`text-left p-4 rounded-md border ${
                      selectedVisitorId === visitor._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {visitor.firstName} {visitor.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{visitor.email}</div>
                    {visitor.company && (
                      <div className="mt-1 text-xs text-gray-400">
                        {visitor.company}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {selectedVisitorId && (
              <TrainingEnrollment
                visitorId={selectedVisitorId}
                onEnrollmentSuccess={handleEnrollmentSuccess}
              />
            )}
          </div>
        </div>
      </div>

      {editingTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold">Edit Training</h2>

            {/* Title */}
            <label className="block mb-3">
              <span className="text-sm text-gray-700">Title</span>
              <input
                type="text"
                value={editForm.title || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              />
            </label>

            {/* Description */}
            <label className="block mb-3">
              <span className="text-sm text-gray-700">Description</span>
              <textarea
                value={editForm.description || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              />
            </label>

            {/* Type */}
            <label className="block mb-4">
              <span className="text-sm text-gray-700">Type</span>
              <select
                value={editForm.type || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, type: e.target.value }))
                }
                className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              >
                <option value="">Select type</option>
                <option value="safety">Safety</option>
                <option value="security">Security</option>
                <option value="procedure">Procedure</option>
                <option value="other">Other</option>
              </select>
            </label>

            {/* Videos */}
            <div className="mb-4">
              <h3 className="mb-2 font-semibold">Videos</h3>
              {editForm.videos?.map((video, idx) => (
                <div key={idx} className="mb-3">
                  <input
                    type="text"
                    placeholder="Video Name"
                    value={video.name}
                    onChange={(e) =>
                      setEditForm((prev) => {
                        const updated = [...(prev.videos || [])];
                        updated[idx].name = e.target.value;
                        return { ...prev, videos: updated };
                      })
                    }
                    className="w-full px-2 py-1 mb-2 border rounded"
                    disabled={videoUploadLoading}
                  />

                  <div
                    onClick={() =>
                      !videoUploadLoading &&
                      document
                        .getElementById(`edit-video-upload-${idx}`)
                        ?.click()
                    }
                    className={`cursor-pointer border border-dashed p-3 text-center rounded 
          ${
            videoUploadLoading
              ? "border-gray-300 bg-gray-100"
              : "hover:border-blue-500 hover:bg-blue-50"
          }`}
                  >
                    {videoUploadLoading &&
                    idx === (editForm.videos?.length ?? 0) - 1 ? (
                      <p className="text-sm text-blue-500">
                        Uploading video...
                      </p>
                    ) : video.url ? (
                      <p className="text-sm text-green-600">
                        Uploaded: {video.name}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Click to upload video
                      </p>
                    )}
                  </div>

                  <input
                    id={`edit-video-upload-${idx}`}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    placeholder="video"
                    onChange={(e) => handleEditVideoUpload(idx, e)}
                    disabled={videoUploadLoading}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setEditForm((prev) => ({
                    ...prev,
                    videos: [...(prev.videos || []), { name: "", url: "" }],
                  }))
                }
                className="text-sm text-blue-600 underline"
                disabled={videoUploadLoading}
              >
                ➕ Add Video
              </button>
            </div>

            {/* Books */}
            <div className="mb-4">
              <h3 className="mb-2 font-semibold">Books</h3>
              {editForm.books?.map((book, idx) => (
                <div key={idx} className="mb-3">
                  <input
                    type="text"
                    placeholder="Book Name"
                    value={book.name}
                    onChange={(e) =>
                      setEditForm((prev) => {
                        const updated = [...(prev.books || [])];
                        updated[idx].name = e.target.value;
                        return { ...prev, books: updated };
                      })
                    }
                    className="w-full px-2 py-1 mb-2 border rounded"
                    disabled={bookUploadLoading}
                  />

                  <div
                    onClick={() =>
                      !bookUploadLoading &&
                      document
                        .getElementById(`edit-book-upload-${idx}`)
                        ?.click()
                    }
                    className={`cursor-pointer border border-dashed p-3 text-center rounded 
          ${
            bookUploadLoading
              ? "border-gray-300 bg-gray-100"
              : "hover:border-blue-500 hover:bg-blue-50"
          }`}
                  >
                    {bookUploadLoading &&
                    idx === (editForm.books?.length ?? 0) - 1 ? (
                      <p className="text-sm text-blue-500">Uploading book...</p>
                    ) : book.url ? (
                      <p className="text-sm text-green-600">
                        Uploaded: {book.name}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Click to upload book
                      </p>
                    )}
                  </div>

                  <input
                    id={`edit-book-upload-${idx}`}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    placeholder="book"
                    onChange={(e) => handleEditBookUpload(idx, e)}
                    disabled={bookUploadLoading}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setEditForm((prev) => ({
                    ...prev,
                    books: [...(prev.books || []), { name: "", url: "" }],
                  }))
                }
                className="text-sm text-blue-600 underline"
                disabled={bookUploadLoading}
              >
                ➕ Add Book
              </button>
            </div>

            {/* Quiz */}
            <div className="mb-4">
              <h3 className="mb-2 font-semibold">Quiz Questions</h3>
              {editForm.questions?.map((q, qIdx) => (
                <div key={qIdx} className="p-2 mb-3 border rounded bg-gray-50">
                  <input
                    type="text"
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...(editForm.questions || [])];
                      updated[qIdx].question = e.target.value;
                      setEditForm((prev) => ({ ...prev, questions: updated }));
                    }}
                    className="w-full px-2 py-1 mb-2 border rounded"
                  />
                  {q.options.map((opt, oIdx) => (
                    <input
                      key={oIdx}
                      type="text"
                      placeholder={`Option ${oIdx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...(editForm.questions || [])];
                        updated[qIdx].options[oIdx] = e.target.value;
                        setEditForm((prev) => ({
                          ...prev,
                          questions: updated,
                        }));
                      }}
                      className="w-full px-2 py-1 mb-1 border rounded"
                    />
                  ))}
                  <label className="text-xs text-gray-600">
                    Correct Answer Index:
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={q.options.length - 1}
                    value={q.answer}
                    placeholder="ans"
                    onChange={(e) => {
                      const updated = [...(editForm.questions || [])];
                      updated[qIdx].answer = parseInt(e.target.value);
                      setEditForm((prev) => ({ ...prev, questions: updated }));
                    }}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setEditForm((prev) => ({
                    ...prev,
                    questions: [
                      ...(prev.questions || []),
                      { question: "", options: ["", "", "", ""], answer: 0 },
                    ],
                  }))
                }
                className="text-sm text-blue-600 underline"
              >
                ➕ Add Question
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setEditingTraining(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={isUpdating}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
