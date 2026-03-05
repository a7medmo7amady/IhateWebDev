const express = require("express");
const userController = require("../controllers/userController");
const { protect } = require("../middleware/protect");
const { restrictTo } = require("../middleware/restrictTo");

const router = express.Router();

router.get("/me", protect, userController.getMe);
router.delete("/:id", protect, restrictTo("admin"), userController.deleteUser);

module.exports = router;
