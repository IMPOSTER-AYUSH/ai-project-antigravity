import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FiSend, FiCopy, FiCheck } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import Logo from '../../components/UI/Logo';
import './Chat.css';

export default function Chat() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { addToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  const handleTextareaChange = useCallback((e) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 150) + 'px';
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopyCode = (text, blockId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(blockId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const botMessageId = Date.now().toString();
    setMessages((prev) => [...prev, { _id: botMessageId, role: 'model', content: '' }]);

    try {
      const response = await fetch('http://localhost:5000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let result = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        
        // keep incomplete line in buffer
        buffer = lines.pop();

        for (let line of lines) {
          if (!line.trim()) continue;

          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              result += parsed.response;

              // update UI live
              setMessages((prev) =>
                prev.map((msg) =>
                  msg._id === botMessageId ? { ...msg, content: result } : msg
                )
              );
            }
          } catch (e) {
            // safely ignore broken JSON if network chunk split was weird
          }
        }
      }
    } catch (error) {
      addToast('Failed to get AI response', 'error');
      setMessages((prev) => prev.filter((msg) => msg._id !== botMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  // Code block counter for unique copy IDs
  let codeBlockCounter = 0;

  return (
    <div className="chat-page">
      {/* Messages Region */}
      <div className="chat-messages-region">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="welcome-logo">
              <Logo size={48} color="var(--text-primary)" />
            </div>
            <h1 className="welcome-heading" style={{ color: theme === 'dark' ? 'white' : 'black' }}>
              How can I help you today?
            </h1>
          </div>
        ) : (
          <div className="chat-conversation">
            {messages.map((msg, idx) => {
              const isAI = msg.role === 'model';
              const isTyping = isAI && isLoading && idx === messages.length - 1 && !msg.content;

              return (
                <div key={msg._id || idx} className={`chat-msg flex items-end gap-2 ${msg.role}`}>
                  {isAI && (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-transparent flex-shrink-0">
                      <Logo size={24} color={theme === 'dark' ? '#ffffff' : '#000000'} />
                    </div>
                  )}
                  <div className="chat-bubble">
                    {isTyping ? (
                      <div className="typing-indicator">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    ) : isAI ? (
                      <ReactMarkdown
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const codeText = String(children).replace(/\n$/, '');
                            const blockId = `code-${idx}-${codeBlockCounter++}`;

                            return !inline && match ? (
                              <div className="chat-code-block">
                                <div className="chat-code-header">
                                  <span className="chat-code-lang">{match[1]}</span>
                                  <button
                                    className={`chat-copy-btn ${copiedId === blockId ? 'copied' : ''}`}
                                    onClick={() => handleCopyCode(codeText, blockId)}
                                  >
                                    {copiedId === blockId ? (
                                      <><FiCheck size={13} /> Copied</>
                                    ) : (
                                      <><FiCopy size={13} /> Copy</>
                                    )}
                                  </button>
                                </div>
                                <SyntaxHighlighter
                                  style={oneDark}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{
                                    margin: 0,
                                    padding: '16px',
                                    background: 'transparent',
                                    fontSize: '0.85rem',
                                  }}
                                  {...props}
                                >
                                  {codeText}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code className="chat-inline-code" {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                  {!isAI && (
                    <img
                      src={user?.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.name || 'User'}`}
                      alt="user"
                      className="chat-avatar w-8 h-8 rounded-full object-cover bg-gray-200"
                    />
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Sticky Input Bar */}
      <div className="chat-input-bar">
        <form onSubmit={handleSubmit}>
          <div className="chat-input-container">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Message AI Tutor..."
              className="chat-textarea"
              disabled={isLoading}
              rows={1}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <FiSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
