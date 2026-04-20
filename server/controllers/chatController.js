const ChatHistory = require('../models/ChatHistory');
const AppError = require('../utils/AppError');

// @desc    Send message and get AI response (Ollama Local)
// @route   POST /api/chat/message
exports.sendMessage = async (req, res, next) => {
  try {
    const { message, chatId } = req.body;

    if (!message) {
      return res.json({ error: 'Message is required.' });
    }

    let chatHistory;

    if (chatId) {
      chatHistory = await ChatHistory.findOne({ _id: chatId, user: req.user._id });
      if (!chatHistory) {
        return res.json({ error: 'Chat not found.' });
      }
    } else {
      // Create new chat
      chatHistory = await ChatHistory.create({
        user: req.user._id,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: [],
      });
    }

    // Add user message
    chatHistory.messages.push({ role: 'user', content: message });

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "phi3",
          prompt: `You are an expert AI tutor. Give a detailed, well-structured answer with explanations, examples, and proper formatting:\n${message}`,
          stream: false
        }),
      });

      if (!response.ok) {
        console.error("Ollama HTTP Error");
        return res.json({ error: "Local AI failed" });
      }

      const data = await response.json();
      const text = data.response || "No response";

      // Save assistant response
      chatHistory.messages.push({ role: 'assistant', content: text });
      await chatHistory.save();

      res.json({ text: data.response });
    } catch (error) {
      console.error("Ollama error:", error);
      res.json({ error: "Local AI not running" });
    }
  } catch (error) {
    console.error("Internal server error:", error);
    res.json({ error: 'Internal server error' });
  }
};

// @desc    Get all chat sessions
// @route   GET /api/chat/history
exports.getChatHistory = async (req, res, next) => {
  try {
    const chats = await ChatHistory.find({ user: req.user._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific chat session
// @route   GET /api/chat/history/:id
exports.getChatSession = async (req, res, next) => {
  try {
    const chat = await ChatHistory.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return next(new AppError('Chat not found.', 404));
    }

    res.status(200).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete chat session
// @route   DELETE /api/chat/history/:id
exports.deleteChatSession = async (req, res, next) => {
  try {
    const chat = await ChatHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!chat) {
      return next(new AppError('Chat not found.', 404));
    }

    res.status(200).json({ success: true, message: 'Chat deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Start new chat
// @route   POST /api/chat/new
exports.newChat = async (req, res, next) => {
  try {
    const chat = await ChatHistory.create({
      user: req.user._id,
      title: 'New Chat',
      messages: [],
    });

    res.status(201).json({ success: true, chat });
  } catch (error) {
    next(error);
  }
};
