const { AssemblyAI } = require("assemblyai");
const fs = require("fs");
const { downloadAudio } = require("../utils/ytDownload");
const Video = require("../models/Video");
const Transcript = require("../models/Transcript");
const User = require("../models/User");
require("dotenv").config();

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

const transcribeAudio = async (req, res) => {
  try {
    const { youtubeUrl, title, language, userId } = req.body;

    if (!youtubeUrl || !title || !language || !userId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Check if video already exists
    const existingVideo = await Video.findOne({ youtubeUrl });
    if (existingVideo) {
      const existingTranscript = await Transcript.findOne({ videoId: existingVideo._id });

      if (existingTranscript) {
        return res.status(200).json({
          message: "Video and transcript already exist.",
          video: existingVideo,
          transcript: existingTranscript,
        });
      }

      // Transcript missing, re-transcribe
      const filePath = await downloadAudio(youtubeUrl);

      const data = {
        audio: filePath,
      };

      const transcript = await client.transcripts.transcribe(data);

      const transcriptDoc = new Transcript({
        videoId: existingVideo._id,
        originalText: transcript.text,
        language,
        translations: new Map(),
      });
      await transcriptDoc.save();

      existingVideo.transcriptId = transcriptDoc._id;
      await existingVideo.save();

      await User.findByIdAndUpdate(userId, { $addToSet: { courses: existingVideo._id } });

      fs.unlinkSync(filePath);

      return res.status(201).json({
        message: "Transcript created for existing video.",
        video: existingVideo,
        transcript: transcriptDoc,
      });
    }

    // New video: Download, transcribe, save both video + transcript
    const filePath = await downloadAudio(youtubeUrl);

    const data = {
      audio: filePath,
    };

    const transcript = await client.transcripts.transcribe(data);

    const videoDoc = new Video({
      youtubeUrl,
      title,
      language,
    });
    await videoDoc.save();

    const transcriptDoc = new Transcript({
      videoId: videoDoc._id,
      originalText: transcript.text,
      language,
      translations: new Map(),
    });
    await transcriptDoc.save();

    videoDoc.transcriptId = transcriptDoc._id;
    await videoDoc.save();

    await User.findByIdAndUpdate(userId, { $addToSet: { courses: videoDoc._id } });

    fs.unlinkSync(filePath);

    res.status(201).json({
      message: "Transcription successful",
      video: videoDoc,
      transcript: transcriptDoc,
    });
  } catch (error) {
    console.error("Transcription Error:", error.message);
    res.status(500).json({ error: "Failed to transcribe audio." });
  }
};

module.exports = { transcribeAudio };
