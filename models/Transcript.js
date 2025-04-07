const mongoose = require("mongoose");

const TranscriptSchema = new mongoose.Schema({
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  originalText: { type: String, required: true },
  language: { type: String, required: true },
  translations: {
    type: Map,
    of: String // Stores translations as { "es": "Texto traducido", "fr": "Texte traduit" }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transcript", TranscriptSchema);
