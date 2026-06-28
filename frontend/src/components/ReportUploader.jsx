import React, { useState, useRef } from 'react';
import { UploadCloud, MessageSquare, Send, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { t } from '../i18n';

export default function ReportUploader({ backendUrl, geminiKey, lang = 'en' }) {
  const [file, setFile] = useState(null);
  const [langPreference, setLangPreference] = useState('both');
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('lang', langPreference);

      const headers = {};
      if (geminiKey) {
        headers['Authorization'] = `Bearer ${geminiKey}`;
      }

      const res = await fetch(`${backendUrl}/api/explain-report`, {
        method: 'POST',
        headers: headers,
        body: formData
      });

      const data = await res.json();
      setAnalysis(data);

      // Initialize chat messages with a welcoming message
      setChatMessages([
        {
          sender: 'bot',
          text: "Assalam-o-Alaikum! Maine aapki report analyze kar li hai. Kya aap is report ke baare mein koi mazeed sawaal poochna chahti hain? (Do you have any follow-up questions?)"
        }
      ]);

    } catch (err) {
      console.error("Error analyzing medical report:", err);
      alert("Error analyzing report. Please ensure backend is running.");
    } finally {
      setUploading(false);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || sendingMessage) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setSendingMessage(true);

    try {
      // Connect to Gemini API locally via generativeai or simple backend proxy if available
      // For simplicity and robustness, we can call our backend or evaluate directly in the frontend
      // if geminiKey is available, or call backend to generate.
      // Let's create an endpoint /api/chat or perform simple post back to backend.
      // Let's call a quick endpoint or mock if no key.

      const payload = {
        message: userMsg,
        history: chatMessages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [m.text] })),
        report_context: analysis.explanation
      };

      // We can query Gemini in the frontend directly if key is available, or write a quick chat API in the backend.
      // Let's mock a high-quality reply if no key, or fetch from backend!
      // To keep it 100% functional, let's post it to a simple backend chat proxy or call Gemini from frontend if key is available.
      let replyText = "";

      try {
        const headers = { 'Content-Type': 'application/json' };
        if (geminiKey) headers['Authorization'] = `Bearer ${geminiKey}`;

        const response = await fetch(`${backendUrl}/api/chat`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            messages: [...chatMessages, { sender: 'user', text: userMsg }].map(m => ({
              role: m.sender === 'user' ? 'user' : 'model',
              content: m.text,
            })),
            report_context: analysis.explanation,
          }),
        });

        const data = await response.json();
        replyText = data.reply || "Maafi chahti hoon, abhi response nahi aa saka. Thodi der baad dobara koshish karein.";
      } catch (err) {
        console.error("Backend chat request failed:", err);
        replyText = "Backend se connection nahi ho pa raha. Please ensure the server is running.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: replyText }]);

    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      {!analysis ? (
        <div className="card">
          <div className="card-title">
            <Sparkles />
            <span>{t('uploadTitle', lang)}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Ovarian cyst scans, blood test reports (CBC, Thyroid panel, FSH, LH), or doctor's prescriptions ko upload karein. Hamara AI isko aasan zubaan (Urdu/English) mein explain karega.
          </p>

          <div
            className="upload-dropzone"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              accept="image/*,.pdf"
            />
            <div className="upload-icon">
              <UploadCloud size={32} />
            </div>

            {file ? (
              <div>
                <span style={{ fontWeight: '600', color: 'var(--primary)', display: 'block' }}>
                  {file.name}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Click to replace
                </span>
              </div>
            ) : (
              <div>
                <span style={{ fontWeight: '600', display: 'block', fontSize: '1.1rem' }}>
                  {t('dragDrop', lang)}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  or click to browse from files (Image or PDF)
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Explanation Language:</span>
              <div className="lang-switch">
                <button
                  className={`lang-btn ${langPreference === 'both' ? 'active' : ''}`}
                  onClick={() => setLangPreference('both')}
                >
                  Urdu + English
                </button>
                <button
                  className={`lang-btn ${langPreference === 'en' ? 'active' : ''}`}
                  onClick={() => setLangPreference('en')}
                >
                  English Only
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleUploadSubmit}
              disabled={!file || uploading}
            >
              {uploading ? "Analyzing File..." : "Start AI Analysis"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Analysis Result display */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 color="var(--success)" size={24} />
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>{t('analysisComplete', lang)}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Analyzed via {analysis.provider}</span>
                </div>
              </div>

              <button className="btn btn-secondary" onClick={() => setAnalysis(null)}>
                Upload Another Report
              </button>
            </div>

            {/* Structured Report Analysis Rendering */}
            <div className="report-markdown" style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.7' }}>
              {/* Parse headers/markdown elements simply */}
              {analysis.explanation.split('\n').map((line, idx) => {
                if (line.startsWith('# ')) {
                  return <h2 key={idx} style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', margin: '1.5rem 0 0.75rem 0', color: 'var(--primary)' }}>{line.replace('# ', '')}</h2>;
                }
                if (line.startsWith('## ')) {
                  return <h3 key={idx} style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: '1.25rem 0 0.5rem 0', color: 'var(--text-primary)' }}>{line.replace('## ', '')}</h3>;
                }
                if (line.startsWith('### ')) {
                  return <h4 key={idx} style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: '1rem 0 0.5rem 0', color: 'var(--text-primary)' }}>{line.replace('### ', '')}</h4>;
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                  return <li key={idx} style={{ marginLeft: '1.5rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>{line.replace(/^[-*]\s+/, '')}</li>;
                }
                if (line.trim() === '---') {
                  return <hr key={idx} style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '1.5rem 0' }} />;
                }
                if (line.startsWith('**') || line.startsWith('__')) {
                  // highlight matches
                }
                return <p key={idx} style={{ marginBottom: '0.75rem', color: line.startsWith('**') ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{line}</p>;
              })}
            </div>
          </div>

          {/* Follow-up Q&A Chat window */}
          <div className="card">
            <div className="card-title">
              <MessageSquare />
              <span>Ask Follow-up Questions (AI Chat Assistant)</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Report ke mutaalik mazeed koi baat samajh nahi aayi? Niche poochhein (e.g. dietary advices, follow-ups, parameters):
            </p>

            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`chat-bubble ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
                {sendingMessage && (
                  <div className="chat-bubble bot" style={{ color: 'var(--text-muted)' }}>
                    Gemini is thinking...
                  </div>
                )}
              </div>

              <form onSubmit={handleSendChat} className="chat-input-bar">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your question in English or Roman Urdu..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }} disabled={sendingMessage}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
