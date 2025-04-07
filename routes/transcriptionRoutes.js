const express = require("express");
const { transcribeAudio } = require("../controllers/transcriptionController");

const router = express.Router();

// POST /api/transcribe - Accepts a YouTube URL and returns the transcription
router.post("/transcribe", transcribeAudio);

module.exports = router;
