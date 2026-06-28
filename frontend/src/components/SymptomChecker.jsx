import React, { useState, useEffect } from 'react';
import { Search, Info, CheckCircle, ChevronRight } from 'lucide-react';
import { t } from '../i18n';

export default function SymptomChecker({ backendUrl, lang = 'en' }) {
  const [conditions, setConditions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCondition, setSelectedCondition] = useState(null);

  useEffect(() => {
    async function loadConditions() {
      try {
        const res = await fetch(`${backendUrl}/api/conditions`);
        const data = await res.json();
        setConditions(data);
        const firstKey = Object.keys(data)[0];
        if (firstKey) setSelectedCondition(firstKey);
      } catch (err) {
        console.error('Failed to load conditions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadConditions();
  }, [backendUrl]);

  const filteredKeys = Object.keys(conditions).filter(key => {
    const c = conditions[key];
    const q = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(q) ||
      c.symptoms.some(s => s.toLowerCase().includes(q)) ||
      c.explanation.toLowerCase().includes(q);
  });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
      {t('loadingConditions', lang)}
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder={t('searchPlaceholder', lang)}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="dashboard-grid">
        {/* Left: conditions list */}
        <div className="card span-4" style={{ height: 'fit-content', maxHeight: '550px', overflowY: 'auto', padding: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', padding: '0 0.5rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.75rem', color: 'var(--primary)' }}>
            {t('conditionsLabel', lang)} ({filteredKeys.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {filteredKeys.length === 0 ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>
                {t('noConditionsMatch', lang)}
              </span>
            ) : filteredKeys.map(key => {
              const cond = conditions[key];
              const isActive = selectedCondition === key;
              return (
                <button
                  key={key}
                  className={`menu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCondition(key)}
                  style={{
                    width: '100%', border: 'none', textAlign: 'left',
                    padding: '0.75rem 1rem', borderRadius: '8px',
                    background: isActive ? 'linear-gradient(90deg, var(--bg-tertiary) 0%, rgba(76,29,149,0.1) 100%)' : 'transparent',
                    borderLeft: isActive ? '4px solid var(--accent)' : '4px solid transparent',
                    paddingLeft: isActive ? 'calc(1rem - 4px)' : '1rem',
                  }}
                >
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>{cond.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {cond.symptoms.slice(0, 3).join(', ')}...
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: detail */}
        <div className="span-8">
          {selectedCondition && conditions[selectedCondition] ? (
            <div className="card" style={{ borderLeft: '4px solid var(--primary)', minHeight: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: '800' }}>
                    {conditions[selectedCondition].name}
                  </h2>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('clinicalInfo', lang)}</span>
                </div>
                <span className={`badge ${conditions[selectedCondition].urgency.toLowerCase().includes('urgent') ? 'high' : conditions[selectedCondition].urgency.toLowerCase().includes('soon') ? 'medium' : 'low'}`}>
                  {conditions[selectedCondition].urgency}
                </span>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Info size={16} /> {t('urduExplanation', lang)}
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.7', borderLeft: '3px solid var(--accent)', paddingLeft: '0.75rem', fontStyle: 'italic' }}>
                  {conditions[selectedCondition].explanation}
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '0.75rem' }}>
                  {t('associatedSymptoms', lang)}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem' }}>
                  {conditions[selectedCondition].symptoms.map(sym => (
                    <div key={sym} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={14} color="var(--success)" style={{ flexShrink: 0 }} />
                      <span>{sym}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>{t('urgencyDetails', lang)}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{conditions[selectedCondition].urgency_desc}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>{t('lifestyleTips', lang)}</span>
                  <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem' }}>
                    {conditions[selectedCondition].lifestyle_tips.map((tip, i) => (
                      <li key={i} style={{ marginBottom: '0.25rem' }}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="disclaimer-box" style={{ marginTop: '2rem' }}>
                {t('symptomDisclaimer', lang)}
              </div>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--text-muted)' }}>
              {t('selectCondition', lang)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
