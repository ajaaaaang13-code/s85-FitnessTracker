const express = require("express");
const userController = require("../controllers/user");
const authenticate = require("../auth");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", authenticate, userController.details);

module.exports = router;
