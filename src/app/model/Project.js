import mongoose from "mongoose";

// Define the schema structure for the Project collection
const projectSchema = new mongoose.Schema({
  // Project name, required string
  projectName: {
    type: String,
    required: true,
    trim: true,
  },

  // ADL code (like "ADL-001"), required string
  adl: {
    type: String,
    required: true,
    trim: true,
  },

  // Number of beneficiaries, required number
  beneficiaries: {
    type: Number,
    required: true,
  },

  // Municipality name, required string
  municipality: {
    type: String,
    required: true,
    trim: true,
  },

  // Who uploaded the project, required string
  uploadedBy: {
    type: String,
    required: true,
    trim: true,
  },

  // Date the project was uploaded, default to current date
  dateUploaded: {
    type: Date,
    default: Date.now,
  },

  // Project progress in percent, string format (e.g. "75%")
  progress: {
    type: String,
    default: "0%",
  },

  // Status of the project (Ongoing, Completed, etc.)
  status: {
    type: String,
    enum: ["Ongoing", "Completed", "Pending"],
    default: "Pending",
  },
});

// Export the model. If it already exists, use that.
export default mongoose.models.Project || mongoose.model("Project", projectSchema);
