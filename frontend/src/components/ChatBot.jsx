import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, RotateCcw } from 'lucide-react';
import { t } from '../i18n';

const SUGGESTED_QUESTIONS = [
  "PCOS ke symptoms kya hain?",
  "Thyroid test kab karwana chahiye?",
  "Periods irregular kyun hote hain?",
  "Anemia se kaise bachein?",
  "Menopause kya hota hai?",
];

export default function ChatBot({ backendUrl, geminiKey, lang = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: t('chatWelcome', lang),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('hercare-open-chat', handler);
    return () => window.removeEventListener('hercare-open-chat', handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    setShowSuggestions(false);
    setInput('');

    const updatedMessages = [...messages, { role: 'user', content: userText }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (geminiKey) headers['Authorization'] = `Bearer ${geminiKey}`;

      const res = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content,
          }))
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Maafi chahti hoon, abhi response nahi aa saka. Thodi der baad dobara koshish karein.'
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Backend se connection nahi ho pa raha. Please ensure the server is running.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Assalam-o-Alaikum! Main HerCare AI hoon — aapki women's health companion. PCOS, thyroid, periods, anemia ya koi bhi sehat ka sawaal — poochhein, main yahaan hoon!\n\n(Remember: Main awareness deti hoon, diagnosis nahi. Doctor se zaroor milein.)",
    }]);
    setShowSuggestions(true);
    setInput('');
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px var(--primary-glow)',
          zIndex: 1000,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="Open AI health chatbot"
      >
        {isOpen
          ? <X size={22} color="#fff" />
          : <MessageCircle size={22} color="#fff" />
        }
      </button>

      {/* Unread dot when closed */}
      {!isOpen && (
        <span style={{
          position: 'fixed',
          bottom: 'calc(2rem + 38px)',
          right: 'calc(2rem - 2px)',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'var(--accent)',
          border: '2px solid var(--bg-primary)',
          zIndex: 1001,
        }} />
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(2rem + 70px)',
            right: '2rem',
            width: '360px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '520px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            borderRadius: '20px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            overflow: 'hidden',
            animation: 'chatSlideUp 0.25s ease',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Sparkles size={16} color="#fff" />
              </div>
              <div>
                <div style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.9rem', lineHeight: 1.2 }}>
                  HerCare AI
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem' }}>
                  Women's Health Companion
                </div>
              </div>
            </div>
            <button
              onClick={resetChat}
              title="Start new chat"
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#fff', display: 'flex' }}
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '85%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: msg.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, var(--primary), hsl(263, 67%, 42%))'
                    : 'var(--bg-tertiary)',
                  border: msg.role === 'user'
                    ? 'none'
                    : '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontSize: '0.83rem',
                  lineHeight: '1.55',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '16px 16px 16px 4px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex', gap: '4px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: 'var(--primary)',
                      animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                      display: 'inline-block',
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggested questions */}
            {showSuggestions && messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', paddingLeft: '2px' }}>{t('suggestedLabel', lang)}</span>
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '0.45rem 0.75rem',
                      color: 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'border-color 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.5rem',
            flexShrink: 0,
            background: 'var(--bg-secondary)',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              {...{placeholder: t('chatInputPlaceholder', lang)}}
              rows={1}
              style={{
                flex: 1,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.6rem 0.85rem',
                color: 'var(--text-primary)',
                fontSize: '0.83rem',
                resize: 'none',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                lineHeight: '1.4',
                maxHeight: '100px',
                overflowY: 'auto',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                  : 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                alignSelf: 'flex-end',
                transition: 'background 0.2s',
              }}
              aria-label="Send message"
            >
              <Send size={15} color={input.trim() && !loading ? '#fff' : 'var(--text-muted)'} />
            </button>
          </div>
        </div>
      )}

      {/* Keyframe animations injected once */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </>
  );
}
