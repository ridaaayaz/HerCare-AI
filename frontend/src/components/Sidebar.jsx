import React from 'react';
import { LayoutDashboard, ClipboardList, BookOpen, Library, FileText, HeartPulse, Key, MessageCircle, LogOut, User, X } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView, geminiKey, setGeminiKey, user, onLogout, open = true, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`} aria-hidden={!open}>
      <div className="logo-container" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-icon">
            <HeartPulse size={24} />
          </div>
          <span className="logo-text">HERCARE AI</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 8, display: 'inline-flex' }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="menu-list">
        <button 
          className={`menu-item ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
        >
          <LayoutDashboard />
          <span>Dashboard</span>
        </button>

        <button 
          className={`menu-item ${activeView === 'risk-assessment' ? 'active' : ''}`}
          onClick={() => setActiveView('risk-assessment')}
        >
          <ClipboardList />
          <span>Risk Assessment</span>
        </button>

        <button 
          className={`menu-item ${activeView === 'symptom-checker' ? 'active' : ''}`}
          onClick={() => setActiveView('symptom-checker')}
        >
          <BookOpen />
          <span>Symptom Checker</span>
        </button>

        <button
          className={`menu-item ${activeView === 'health-library' ? 'active' : ''}`}
          onClick={() => setActiveView('health-library')}
        >
          <Library />
          <span>Health Library</span>
        </button>

        <button 
          className={`menu-item ${activeView === 'report-explainer' ? 'active' : ''}`}
          onClick={() => setActiveView('report-explainer')}
        >
          <FileText />
          <span>Report Explainer</span>
        </button>

        <button 
          className={`menu-item ${activeView === 'recovery-assistant' ? 'active' : ''}`}
          onClick={() => setActiveView('recovery-assistant')}
        >
          <HeartPulse />
          <span>Recovery Assistant</span>
        </button>

        <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.5rem 0.75rem' }} />

        <button
          className="menu-item"
          onClick={() => {
            // Trigger chatbot open via custom event
            window.dispatchEvent(new CustomEvent('hercare-open-chat'));
          }}
        >
          <MessageCircle />
          <span>AI Chat</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        {/* User card */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.65rem 0.75rem', marginBottom: '0.75rem',
            background: 'var(--bg-tertiary)', borderRadius: '10px',
            border: '1px solid var(--border-color)',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={15} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign out"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', display: 'flex', padding: '4px',
                borderRadius: '6px', transition: 'color 0.15s, background 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#E85D75'; e.currentTarget.style.background = 'rgba(232,93,117,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
            >
              <LogOut size={15} />
            </button>
          </div>
        )}

        <div className="gemini-config-box">
          <label htmlFor="gemini-key-input">
            <Key size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            Gemini API Key:
          </label>
          <input 
            id="gemini-key-input"
            type="password" 
            placeholder="AI-key (optional)..."
            value={geminiKey}
            onChange={(e) => {
              setGeminiKey(e.target.value);
              localStorage.setItem('gemini_api_key', e.target.value);
            }}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Stores locally. Fallback mock will be used if left blank.
          </span>
        </div>
      </div>
    </aside>
  );
}
