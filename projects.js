const express = require("express");
const mongoose = require("mongoose");
const Project = require("../models/Project");

const router = express.Router();
const statuses = ["idea", "working", "done"];
const categories = ["illustration", "comic", "design", "other"];
const allowedFields = ["name", "category", "description", "status", "targetDate"];

function validId(id) {
  return mongoose.isValidObjectId(id);
}

function validateFields(data, partial = false) {
  if (!partial && (typeof data.name !== "string" || !data.name.trim())) {
    return "Project name is required";
  }
  if (Object.hasOwn(data, "name") &&
      (typeof data.name !== "string" || !data.name.trim())) {
    return "Project name cannot be empty";
  }
  if (data.status && !statuses.includes(data.status)) {
    return `Invalid status. Use: ${statuses.join(", ")}`;
  }
  if (data.category && !categories.includes(data.category)) {
    return `Invalid category. Use: ${categories.join(", ")}`;
  }
  return null;
}

// GET /api/projects?status=idea
router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      if (!statuses.includes(req.query.status)) {
        return res.status(400).json({ message: `Invalid status. Use: ${statuses.join(", ")}` });
      }
      filter.status = req.query.status;
    }
    if (req.query.category) {
      if (!categories.includes(req.query.category)) {
        return res.status(400).json({ message: `Invalid category. Use: ${categories.join(", ")}` });
      }
      filter.category = req.query.category;
    }
    res.json(await Project.find(filter).sort({ updatedAt: -1 }));
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid project ID" });
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// POST /api/projects
router.post("/", async (req, res, next) => {
  try {
    const errorMessage = validateFields(req.body);
    if (errorMessage) return res.status(400).json({ message: errorMessage });

    const project = await Project.create({
      name: req.body.name,
      category: req.body.category || "illustration",
      description: req.body.description || "",
      status: req.body.status || "idea",
      targetDate: req.body.targetDate || null
    });
    res.status(201).json(project);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// PATCH /api/projects/:id
router.patch("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid project ID" });
    const updates = {};
    for (const field of allowedFields) {
      if (Object.hasOwn(req.body, field)) updates[field] = req.body[field];
    }
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Provide at least one valid field to update" });
    }
    const errorMessage = validateFields(updates, true);
    if (errorMessage) return res.status(400).json({ message: errorMessage });
    if (updates.targetDate === "") updates.targetDate = null;

    const project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// DELETE /api/projects/:id
router.delete("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid project ID" });
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully", id: project._id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
