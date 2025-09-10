"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trainingAPI, Training } from "@/lib/api";
import { Loader2 } from "lucide-react";
import AppBar from "@/components/AppBar";

export default function VisitorCourseList() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTrainings = async () => {
      const contractorId = localStorage.getItem("contractorId");
      console.log(contractorId);

      if (!contractorId) {
        alert("Contractor not identified. Please check in first.");
        router.push("/check-in");
        return;
      }

      try {
        const all: Training[] = await trainingAPI.getAllTrainings();
        const completed: Training[] =
          await trainingAPI.getCompletedTrainingsByVisitor(contractorId);
        console.log(all);

        setTrainings(all.filter((t) => t.isActive));
        setCompletedIds(completed.map((c) => c._id));
      } catch (error) {
        console.error("Failed to load trainings or completions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainings();
  }, [router]);

  const progressPercent = trainings.length
    ? Math.round((completedIds.length / trainings.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-600">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Loading trainings...
      </div>
    );
  }

  return (
    <>
      <AppBar />

      <div className="px-4 mt-8 md:mt-12">
        <h1 className="mb-4 text-2xl font-bold text-center">
          Your Training Progress
        </h1>

        {/* Progress Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="h-4 overflow-hidden bg-gray-200 rounded-full">
            <div
              className="h-full transition-all duration-500 bg-green-600"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="mt-1 text-sm text-center text-gray-600">
            {progressPercent}% completed
          </p>
        </div>

        {/* Training Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training, index) => {
            const isCompleted = completedIds.includes(training._id);
            const isLocked =
              index > 0 && !completedIds.includes(trainings[index - 1]._id);

            return (
              <div
                key={training._id}
                className={`p-4 border rounded-lg transition shadow-sm ${
                  isCompleted
                    ? "bg-green-50 border-green-300"
                    : "bg-white border-gray-200"
                } ${
                  isLocked
                    ? "opacity-50 pointer-events-none"
                    : "hover:shadow-lg"
                }`}
              >
                <Link href={`/training-doc/${training._id}`}>
                  <h2 className="mb-1 text-xl font-semibold text-blue-700">
                    {training.title}
                  </h2>
                  <p className="mb-2 text-sm text-gray-600">
                    {training.description}
                  </p>
                  <p className="mt-1 mb-2 text-xs text-gray-500">
                    Created on{" "}
                    {new Date(training.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>

                  {/* Type */}
                  <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full capitalize">
                    {training.type}
                  </span>

                  {/* Status */}
                  {isCompleted && (
                    <p className="mt-2 text-xs font-medium text-green-700">
                      ✔ Completed
                    </p>
                  )}
                  {isLocked && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      🔒 Locked
                    </p>
                  )}

                  {/* ✅ Start Training Button */}
                  {!isCompleted && !isLocked && (
                    <div className="mt-4 sm:mt-6">
                      <Link
                        href={`/training-doc/${training._id}`}
                        className="inline-block bg-blue-600 text-white text-[12px] sm:text-sm font-medium px-3 sm:px-4 py-2 rounded hover:bg-blue-700 transition"
                      >
                        ▶ Start Training
                      </Link>
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
