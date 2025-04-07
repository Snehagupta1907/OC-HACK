const express = require("express");
const { translateTranscript } = require("../controllers/translationController");

const router = express.Router();

// POST /api/translate - Translate transcript to target language
router.post("/translate", translateTranscript);

module.exports = router;
