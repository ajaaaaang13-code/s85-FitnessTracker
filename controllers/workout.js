const mongoose = require("mongoose");
const Workout = require("../models/Workout");

function getWorkoutId(req, res) {
  const { workoutId } = req.query;
  if (!mongoose.isValidObjectId(workoutId)) {
    res
      .status(400)
      .json({ message: "A valid workoutId query parameter is required" });
    return null;
  }
  return workoutId;
}

module.exports.addWorkout = async (req, res) => {
  const { name, duration } = req.body || {};

  if (
    typeof name !== "string" ||
    !name.trim() ||
    !Number.isFinite(duration) ||
    duration < 1

  ) {
    return res.status(400).json({
      message: "Name, positive duration (in minutes)",
    });
  }

  const workout = await Workout.create({
    userId: req.userId,
    name: name.trim(),
    duration,
   
  });

  return res.status(201).json({ workout });
};

module.exports.getMyWorkouts = async (req, res) => {
  const workouts = await Workout.find({ userId: req.userId }).sort({
    dateAdded: -1,
  });
  return res.status(200).json({ workouts });
};

module.exports.updateWorkout = async (req, res) => {
  const workoutId = req.params.workoutId
  if (!workoutId) {
    return;
  }

  const { name, duration, status } = req.body || {};
  const updates = {};
  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Name must be a non-empty string" });
    }
    updates.name = name.trim();
  }
  if (duration !== undefined) {
    if (!Number.isFinite(duration) || duration < 1) {
      return res.status(400).json({ message: "Duration must be a positive number" });
    }
    updates.duration = duration;
  }
  if (status !== undefined) {
    if (typeof status !== "string" || !status.trim()) {
      return res.status(400).json({ message: "Status must be a non-empty string" });
    }
    updates.status = status.trim();
  }
  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ message: "Provide at least one workout field to update" });
  }

  const workout = await Workout.findOneAndUpdate(
    { _id: workoutId, userId: req.userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!workout) {
    return res.status(404).json({ message: "Workout not found" });
  }
  return res.status(200).json({ workout });
};

module.exports.deleteWorkout = async (req, res) => {
  const workoutId = req.params.workoutId
  if (!workoutId) {
    return;
  }

  const workout = await Workout.findOneAndDelete({
    _id: workoutId,
    userId: req.userId,
  });
  if (!workout) {
    return res.status(404).json({ message: "Workout not found" });
  }
  return res.status(200).json({ message: "Workout deleted successfully" });
};

module.exports.completeWorkoutStatus = async (req, res) => {
    const workoutId = req.params.workoutId
  if (!workoutId) {
    return;
  }

  const workout = await Workout.findOneAndUpdate(
    { _id: workoutId, userId: req.userId },
    { $set: { status: "completed" } },
    { new: true, runValidators: true }
  );
  if (!workout) {
    return res.status(404).json({ message: "Workout not found" });
  }
  return res.status(200).json({ workout });
};
