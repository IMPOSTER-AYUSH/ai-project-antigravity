const express = require("express");

const router = express.Router();

router.post("/message", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Verify API key is loaded
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set in environment variables");
      return res.status(500).json({ error: "AI service not configured" });
    }

    // Call Groq with streaming enabled
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are an expert AI tutor. Give a detailed, well-structured answer with explanations, examples, and proper formatting."
          },
          {
            role: "user",
            content: message
          }
        ],
        stream: true,
      }),
    });

    if (!groqResponse.ok) {
      const errBody = await groqResponse.text();
      console.error("Groq API error (status " + groqResponse.status + "):", errBody);
      return res.status(500).json({ error: "AI service failed" });
    }

    // Set headers for chunked streaming to the client
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Read Groq's SSE stream and forward each token as NDJSON
    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let sseBuffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      sseBuffer += decoder.decode(value, { stream: true });
      const sseLines = sseBuffer.split("\n");

      // Keep the last (potentially incomplete) line in the buffer
      sseBuffer = sseLines.pop();

      for (const line of sseLines) {
        const trimmed = line.trim();

        // Skip empty lines and SSE comments
        if (!trimmed || trimmed.startsWith(":")) continue;

        // End of stream signal
        if (trimmed === "data: [DONE]") continue;

        // Parse SSE data lines
        if (trimmed.startsWith("data: ")) {
          try {
            const json = JSON.parse(trimmed.slice(6));
            const token = json.choices?.[0]?.delta?.content;
            if (token) {
              // Write as NDJSON line — matches the format the frontend already parses
              res.write(JSON.stringify({ response: token }) + "\n");
            }
          } catch (e) {
            // Ignore malformed SSE chunks
          }
        }
      }
    }

    res.end();

  } catch (error) {
    console.error("Backend error:", error);
    // Only send error JSON if headers haven't been sent yet
    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to get AI response"
      });
    }
    res.end();
  }
});

module.exports = router;
