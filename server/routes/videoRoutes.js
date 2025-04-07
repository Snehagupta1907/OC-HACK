const express = require("express");
const router = express.Router();
const { submitVideo, getVideo } = require("../controllers/videoController");

router.post("/", submitVideo);
router.get("/:id", getVideo);

module.exports = router;

