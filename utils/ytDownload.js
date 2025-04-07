const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const downloadAudio = async (youtubeUrl) => {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(__dirname, "../downloads");
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

    const filePath = path.join(outputPath, `${Date.now()}.mp3`);
    
    const command = `yt-dlp -x --audio-format mp3 -o "${filePath}" ${youtubeUrl}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Error downloading audio:", stderr);
        return reject("Failed to download audio.");
      }
      console.log("Downloaded audio:", filePath);
      resolve(filePath);
    });
  });
};

module.exports = { downloadAudio };
