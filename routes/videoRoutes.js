const express = require("express");
const { createVideo, getVideos } = require("../controllers/videoController");
const { protect } = require("../middleware/protect");

const router = express.Router();

router.post("/", protect, createVideo);
router.get("/", protect, getVideos);

module.exports = router;
