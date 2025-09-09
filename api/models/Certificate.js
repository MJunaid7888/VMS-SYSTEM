import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment" },
  issuedAt: { type: Date, default: Date.now },
  certificateUrl: String,
});

export default mongoose.model("Certificate", certificateSchema);
