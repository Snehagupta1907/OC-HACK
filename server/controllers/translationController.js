const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const translateTranscript = async (req, res) => {
  const { originalText, targetLanguage } = req.body;

  if (!originalText || !targetLanguage) {
    return res.status(400).json({ error: "originalText and targetLanguage are required." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4" if needed
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that translates English transcripts to ${targetLanguage}.`,
        },
        {
          role: "user",
          content: `Translate this: "${originalText}"`,
        },
      ],
    });

    const translatedText = response.choices[0].message.content;
    res.json({ translatedText });
  } catch (error) {
    console.error("Translation Error:", error);
    res.status(500).json({ error: "Translation failed." });
  }
};

module.exports = { translateTranscript };
