const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Project name is required"],
    trim: true,
    maxlength: [100, "Project name must be 100 characters or fewer"]
  },
  category: {
    type: String,
    enum: ["illustration", "comic", "design", "other"],
    default: "illustration"
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1500, "Description must be 1500 characters or fewer"],
    default: ""
  },
  status: {
    type: String,
    enum: ["idea", "working", "done"],
    default: "idea"
  },
  targetDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
