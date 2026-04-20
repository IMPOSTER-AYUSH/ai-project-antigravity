const express = require("express");

const router = express.Router();

router.post("/message", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "phi3",
        prompt: `You are an AI tutor. Give detailed answer:\n${message}`,
        stream: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Ollama error:", err);
      return res.status(500).end("Error");
    }

    res.setHeader("Content-Type", "text/plain");

    // stream chunks
    for await (const chunk of response.body) {
      res.write(chunk);
    }

    res.end();

  } catch (error) {
    console.error("Backend error:", error);
    return res.status(500).json({
      error: "Failed to get AI response"
    });
  }
});

module.exports = router;
