const Video = require("../models/Video");
const { downloadAudio } = require("../utils/ytDownload");

exports.submitVideo = async (req, res) => {
  try {
    const { youtubeUrl } = req.body;

    if (!youtubeUrl) {
      return res.status(400).json({ error: "YouTube URL is required" });
    }

    // Create DB entry
    const video = await Video.create({ youtubeUrl, status: "processing" });

    // Download audio (we'll use ytdl-core here)
    const audioPath = `audio/${video._id}.mp3`;

    await downloadAudio(youtubeUrl, audioPath);

    video.audioFilePath = audioPath;
    video.status = "completed";
    await video.save();

    res.status(200).json({ message: "Video processed", video });
  } catch (err) {
    console.error("submitVideo error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
