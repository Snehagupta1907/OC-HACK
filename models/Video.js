const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  youtubeUrl: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  language: { type: String, required: true },
  transcriptId: { type: mongoose.Schema.Types.ObjectId, ref: "Transcript" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Video", VideoSchema);
