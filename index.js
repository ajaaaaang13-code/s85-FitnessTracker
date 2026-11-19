
const express = require("express");
const mongoose = require("mongoose");

const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode || error.status;

  if (Number.isInteger(statusCode) && statusCode >= 400 && statusCode < 500) {
    return res.status(statusCode).json({
      message:
        error.type === "entity.parse.failed"
          ? "Invalid JSON body"
          : "Invalid request",
    });
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

// MongoDB connection
if (require.main === module) {
  const port = 4000;

  mongoose
    .connect("mongodb+srv://admin:admin1234@b645-reyes.bl6yxg5.mongodb.net/workoutDB")
    .then(() => {
      console.log("Now connected to MongoDB Atlas!");

      app.listen(port, () => {
        console.log(`API is now online on port ${port}.`);
      });
    })
    .catch((error) => {
      console.error("Connection to the database failed:", error.message);
      process.exitCode = 1;
    });
}

module.exports = { app, mongoose };
