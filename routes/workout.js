const express = require("express");
const workoutController = require("../controllers/workout");
const authenticate = require("../auth");

const router = express.Router();

router.post("/addWorkout", authenticate, workoutController.addWorkout);
router.get("/getMyWorkouts", authenticate, workoutController.getMyWorkouts);
router.patch("/updateWorkout/:workoutId", authenticate, workoutController.updateWorkout);
router.delete("/deleteWorkout/:workoutId", authenticate, workoutController.deleteWorkout);
router.patch(
  "/completeWorkoutStatus/:workoutId",
  authenticate,
  workoutController.completeWorkoutStatus
);

module.exports = router;
