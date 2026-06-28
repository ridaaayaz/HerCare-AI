import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import HealthQuestionnaire from './components/HealthQuestionnaire';
import SymptomChecker from './components/SymptomChecker';
import ReportUploader from './components/ReportUploader';
import SymptomLog from './components/SymptomLog';
import ChatBot from './components/ChatBot';
import HealthLibrary from './components/HealthLibrary';
import AuthScreen, { getCurrentUser, logout } from './components/AuthScreen';
import { init3DCards } from './utils/use3DCard';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [language, setLanguage] = useState('en');
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [user, setUser] = useState(() => getCurrentUser());
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const backendUrl = "http://localhost:5000";

  // Initialize 3D card tilt effect
  useEffect(() => {
    // Small delay so React has painted the new view's DOM
    const timer = setTimeout(() => {
      const cleanup = init3DCards();
      return cleanup;
    }, 50);
    return () => clearTimeout(timer);
  }, [activeView]);

  // Document Title update based on view
  useEffect(() => {
    const titles = {
      'dashboard': 'Patient Portal | HerCare AI',
      'risk-assessment': 'Hormonal & Health Risk Screening | HerCare AI',
      'symptom-checker': 'Women\'s Health Awareness Guide | HerCare AI',
      'report-explainer': 'Medical Report & Prescription Explainer | HerCare AI',
      'recovery-assistant': 'Post-Discharge Recovery tracker | HerCare AI',
      'health-library': 'Health Library | HerCare AI'
    };
    document.title = titles[activeView] || 'HerCare AI';
  }, [activeView]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView setActiveView={setActiveView} backendUrl={backendUrl} lang={language} />;
      case 'risk-assessment':
        return <HealthQuestionnaire backendUrl={backendUrl} geminiKey={geminiKey} lang={language} />;
      case 'symptom-checker':
        return <SymptomChecker backendUrl={backendUrl} lang={language} />;
      case 'report-explainer':
        return <ReportUploader backendUrl={backendUrl} geminiKey={geminiKey} lang={language} />;
      case 'recovery-assistant':
        return <SymptomLog backendUrl={backendUrl} geminiKey={geminiKey} />;
      case 'health-library':
        return <HealthLibrary lang={language} />;
      default:
        return <DashboardView setActiveView={setActiveView} backendUrl={backendUrl} />;
    }
  };

  const getViewMeta = () => {
    switch (activeView) {
      case 'dashboard':
        return {
          title: "Patient Dashboard",
          subtitle: "Manage your health risk assessments, reports, and recovery timeline."
        };
      case 'risk-assessment':
        return {
          title: "AI Health Risk Assessment",
          subtitle: "Screen for PCOS, Thyroid, Anemia, Endometriosis, and Menstrual Irregularities."
        };
      case 'symptom-checker':
        return {
          title: "Symptom Checker & Awareness Guide",
          subtitle: "Understand your symptoms and get urgency tags for gynecological conditions."
        };
      case 'report-explainer':
        return {
          title: "Medical Report & Prescription Explainer",
          subtitle: "Upload lab tests or recipes for a clear, bilingual Roman Urdu & English breakdown."
        };
      case 'recovery-assistant':
        return {
          title: "Post-Discharge Recovery Assistant",
          subtitle: "Log daily recovery metrics, track surgical routines, and monitor safety limits."
        };
      case 'health-library':
        return {
          title: "Health Library",
          subtitle: "Evidence-based awareness for 12 women's health conditions — in English & Roman Urdu."
        };
      default:
        return {
          title: "HerCare AI Portal",
          subtitle: "Intelligent Women's Health Companion."
        };
    }
  };

  const meta = getViewMeta();

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!user) {
    return <AuthScreen onAuth={(session) => setUser(session)} />;
  }

  const handleLogout = () => {
    logout();
    setUser(null);
    setActiveView('dashboard');
  };

  return (
    <div className={`app-container ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      {/* Left Sidebar Menu */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        user={user}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* Main Panel */}
      <main className="main-content">
        <Navbar 
          title={meta.title} 
          subtitle={meta.subtitle} 
          language={language}
          setLanguage={setLanguage}
          user={user}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          sidebarOpen={sidebarOpen}
        />

        <div style={{ flex: 1, width: '100%' }}>
          {renderActiveView()}
        </div>
      </main>

      {/* Floating AI Chatbot — visible on all views */}
      <ChatBot backendUrl={backendUrl} geminiKey={geminiKey} lang={language} />
    </div>
  );
}