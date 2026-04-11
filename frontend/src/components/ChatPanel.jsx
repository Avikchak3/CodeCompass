import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const SUGGESTIONS = [
  'Where should I start?',
  'What is the entry point?',
  'Explain the folder structure',
  'What are the key dependencies?',
  'How does data flow here?',
  'What should I set up first?',
];

const TypingIndicator = () => (
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '2px 0' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: '5px', height: '5px', borderRadius: '50%',
        background: 'var(--text3)',
        animation: 'typing 1.2s ease-in-out infinite',
        animationDelay: `${i * 0.2}s`,
      }} />
    ))}
  </div>
);

const ChatPanel = ({ analysis, context }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I've analyzed **${analysis.projectName}**. It's a ${analysis.projectType}.\n\n${analysis.summary}\n\nAsk me anything about the codebase! 🚀`,
    }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef        = useRef(null);
  const inputRef              = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, `<code style="font-family:var(--mono);font-size:12px;background:var(--bg4);padding:2px 6px;border-radius:4px;color:var(--accent)">$1</code>`)
      .replace(/\n/g, '<br/>');
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await axios.post('https://codecompass-backend-3bjg.onrender.com/api/chat', {
        message: msg,
        chatHistory: newMessages.slice(0, -1),
        context,
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again.',
      }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ animation: 'fadeUp 0.5s ease both' }}>
        <div style={{
          fontSize: '11px', fontFamily: 'var(--mono)',
          color: 'var(--text3)', letterSpacing: '2px',
          textTransform: 'uppercase', marginBottom: '12px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          AI Assistant
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
        <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Ask anything about the project
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
          Powered by Groq — answers based on your actual code
        </div>
      </div>

      {/* Suggestion Chips */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px',
        animation: 'fadeUp 0.5s ease 0.1s both',
      }}>
        {SUGGESTIONS.map((s, i) => (
          <button key={i} onClick={() => sendMessage(s)} style={{
            padding: '7px 14px', borderRadius: '20px',
            border: '1px solid var(--border)',
            background: 'var(--bg2)',
            color: 'var(--text2)', fontSize: '12px',
            cursor: 'pointer', fontFamily: 'var(--sans)',
            transition: 'var(--transition)',
            animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
          }}
            onMouseEnter={e => {
              e.currentTarget.style.border = '1px solid var(--border2)';
              e.currentTarget.style.color = 'var(--text)';
              e.currentTarget.style.background = 'var(--bg3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid var(--border)';
              e.currentTarget.style.color = 'var(--text2)';
              e.currentTarget.style.background = 'var(--bg2)';
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div style={{
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        animation: 'fadeUp 0.5s ease 0.15s both',
      }}>
        {/* Messages */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '2px',
          padding: '20px', overflowY: 'auto', maxHeight: '400px',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: '10px', alignItems: 'flex-start',
              marginBottom: '12px',
              animation: 'fadeUp 0.3s ease both',
            }}>
              {/* Avatar */}
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '13px',
                flexShrink: 0,
                background: msg.role === 'assistant'
                  ? 'rgba(0,212,170,0.1)'
                  : 'var(--bg3)',
                border: msg.role === 'assistant'
                  ? '1px solid rgba(0,212,170,0.2)'
                  : '1px solid var(--border)',
              }}>
                {msg.role === 'assistant' ? '🧭' : '👤'}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: '75%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user'
                  ? '16px 4px 16px 16px'
                  : '4px 16px 16px 16px',
                fontSize: '13px', lineHeight: '1.7',
                background: msg.role === 'user'
                  ? 'rgba(0,212,170,0.08)'
                  : 'var(--bg3)',
                border: msg.role === 'user'
                  ? '1px solid rgba(0,212,170,0.15)'
                  : '1px solid var(--border)',
                color: 'var(--text)',
              }}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div style={{
              display: 'flex', gap: '10px',
              alignItems: 'flex-start', marginBottom: '12px',
              animation: 'fadeIn 0.2s ease both',
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '13px',
                background: 'rgba(0,212,170,0.1)',
                border: '1px solid rgba(0,212,170,0.2)',
              }}>🧭</div>
              <div style={{
                padding: '12px 16px', borderRadius: '4px 16px 16px 16px',
                background: 'var(--bg3)', border: '1px solid var(--border)',
              }}>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg3)',
          display: 'flex', gap: '10px', alignItems: 'flex-end',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything about the project..."
            rows={1}
            style={{
              flex: 1, padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--bg2)',
              fontFamily: 'var(--sans)',
              fontSize: '13px', color: 'var(--text)',
              outline: 'none', resize: 'none',
              transition: 'var(--transition)',
              lineHeight: '1.5',
            }}
            onFocus={e => e.target.style.border = '1px solid var(--border2)'}
            onBlur={e => e.target.style.border = '1px solid var(--border)'}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
            padding: '10px 18px',
            borderRadius: '10px',
            background: input.trim() && !loading
              ? 'linear-gradient(135deg, #00d4aa, #0099ff)'
              : 'var(--bg4)',
            border: '1px solid var(--border)',
            color: input.trim() && !loading ? 'white' : 'var(--text3)',
            fontSize: '13px', fontWeight: '500',
            fontFamily: 'var(--sans)', cursor: 'pointer',
            transition: 'var(--transition)',
            flexShrink: 0,
          }}>
            {loading ? '...' : 'Send →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
