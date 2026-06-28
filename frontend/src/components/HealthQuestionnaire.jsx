import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, AlertTriangle, Check, ArrowRight, Download } from 'lucide-react';
import { generateAssessmentPDF } from '../utils/generateReport';
import { t } from '../i18n';

export default function HealthQuestionnaire({ backendUrl, geminiKey, lang = 'en' }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: 26,
    weight: 62,
    height: 160,
    cycle_length: 28,
    cycle_regularity: 1, // 1 = regular, 2 = irregular
    exercise: true,
    fast_food: false,
    follicle_num_l: 5,
    follicle_num_r: 6
  });

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const symptomsList = [
    { id: "irregular periods", label: "Irregular/missed periods", category: "Cycle & Hormones" },
    { id: "periods missed for 2+ months", label: "Periods missed for 2+ months", category: "Cycle & Hormones" },
    { id: "cycle shorter than 21 days", label: "Cycle shorter than 21 days", category: "Cycle & Hormones" },
    { id: "cycle longer than 35 days", label: "Cycle longer than 35 days", category: "Cycle & Hormones" },
    { id: "extremely heavy bleeding", label: "Extremely heavy bleeding (soaking pad every hour)", category: "Cycle & Hormones" },
    { id: "bleeding between periods", label: "Bleeding/spotting between periods", category: "Cycle & Hormones" },
    { id: "periods lasting 7+ days", label: "Periods lasting 7+ days", category: "Cycle & Hormones" },
    
    { id: "excess facial hair", label: "Excess facial hair (Hirsutism)", category: "Skin & Hair" },
    { id: "excess body hair", label: "Excess body hair", category: "Skin & Hair" },
    { id: "acne", label: "Severe acne/pimples", category: "Skin & Hair" },
    { id: "hair thinning on scalp", label: "Hair thinning on scalp", category: "Skin & Hair" },
    { id: "hair fall", label: "Severe hair fall", category: "Skin & Hair" },
    { id: "dark skin patches", label: "Dark skin patches (neck, armpits)", category: "Skin & Hair" },
    { id: "pale skin", label: "Pale skin or pale inner eyelids", category: "Skin & Hair" },
    { id: "brittle nails", label: "Brittle nails", category: "Skin & Hair" },
    
    { id: "weight gain", label: "Sudden weight gain", category: "Energy & Weight" },
    { id: "weight loss", label: "Sudden weight loss", category: "Energy & Weight" },
    { id: "difficulty losing weight", label: "Difficulty losing weight", category: "Energy & Weight" },
    { id: "constant fatigue", label: "Constant fatigue/weakness", category: "Energy & Weight" },
    { id: "weakness", label: "Muscle weakness", category: "Energy & Weight" },
    { id: "cold intolerance", label: "Cold intolerance (feeling cold easily)", category: "Energy & Weight" },
    { id: "dry skin", label: "Dry skin", category: "Energy & Weight" },
    { id: "depression", label: "Feeling depressed or low mood", category: "Energy & Weight" },
    { id: "mood swings", label: "Frequent mood swings", category: "Energy & Weight" },
    { id: "anxiety", label: "Frequent anxiety/nervousness", category: "Energy & Weight" },
    { id: "difficulty sleeping", label: "Difficulty sleeping (Insomnia)", category: "Energy & Weight" },
    { id: "rapid heartbeat", label: "Rapid heartbeat / Palpitations", category: "Energy & Weight" },
    { id: "excessive sweating", label: "Excessive sweating", category: "Energy & Weight" },
    { id: "tremors", label: "Tremors in hands", category: "Energy & Weight" },
    
    { id: "severe pelvic pain", label: "Severe pelvic pain", category: "Pain & Infections" },
    { id: "pain during periods", label: "Severe pain during periods", category: "Pain & Infections" },
    { id: "pain during intercourse", label: "Pain during intercourse", category: "Pain & Infections" },
    { id: "pain during bowel movements", label: "Pain during bowel movements/urination during periods", category: "Pain & Infections" },
    { id: "lower back pain", label: "Lower back pain during cycle", category: "Pain & Infections" },
    { id: "burning during urination", label: "Burning sensation during urination", category: "Pain & Infections" },
    { id: "unusual discharge", label: "Unusual vaginal discharge/itching", category: "Pain & Infections" },
    { id: "frequent urge to urinate", label: "Frequent urge to urinate", category: "Pain & Infections" },
    
    { id: "hot flashes", label: "Hot flashes (sudden heat waves)", category: "Age Transition (40+)" },
    { id: "night sweats", label: "Night sweats", category: "Age Transition (40+)" },
    { id: "vaginal dryness", label: "Vaginal dryness", category: "Age Transition (40+)" }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId) 
        : [...prev, symptomId]
    );
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        symptoms: selectedSymptoms
      };
      
      const res = await fetch(`${backendUrl}/api/assess-health`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      setResults(data);
      // Persist for Health Score widget
      localStorage.setItem('last_assessment', JSON.stringify({
        results: data.results,
        timestamp: Date.now(),
      }));
      setStep(3);
    } catch (err) {
      console.error("Error submitting health assessment:", err);
      alert("Failed to connect to the backend server. Please make sure the Flask backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setResults(null);
  };

  const categories = ["Cycle & Hormones", "Skin & Hair", "Energy & Weight", "Pain & Infections", "Age Transition (40+)"];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Step Progress Bar */}
      <div className="steps-indicator">
        <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          {step > 1 ? <Check size={18} /> : "1"}
        </div>
        <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          {step > 2 ? <Check size={18} /> : "2"}
        </div>
        <div className={`step-node ${step >= 3 ? 'active' : ''}`}>
          3
        </div>
      </div>

      {step === 1 && (
        <div className="card">
          <div className="card-title">
            {t('step1Label', lang)}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>{t('ageLabel', lang)}</label>
              <input 
                type="number" 
                name="age" 
                className="form-control" 
                value={formData.age} 
                onChange={handleInputChange} 
                min="10" 
                max="100" 
              />
            </div>
            
            <div className="form-group">
              <label>{t('weightLabel', lang)}</label>
              <input 
                type="number" 
                name="weight" 
                className="form-control" 
                value={formData.weight} 
                onChange={handleInputChange} 
                min="30" 
                max="200" 
              />
            </div>

            <div className="form-group">
              <label>{t('heightLabel', lang)}</label>
              <input 
                type="number" 
                name="height" 
                className="form-control" 
                value={formData.height} 
                onChange={handleInputChange} 
                min="100" 
                max="250" 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label>{t('cycleLengthLabel', lang)}</label>
              <input 
                type="number" 
                name="cycle_length" 
                className="form-control" 
                value={formData.cycle_length} 
                onChange={handleInputChange} 
                min="15" 
                max="90" 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Typical is 28 days</span>
            </div>

            <div className="form-group">
              <label>{t('cycleRegularityLabel', lang)}</label>
              <select 
                name="cycle_regularity" 
                className="form-control"
                value={formData.cycle_regularity}
                onChange={handleInputChange}
              >
                <option value={1}>Regular (Time par aate hain)</option>
                <option value={2}>Irregular (Kayi din aage peeche / missed)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
            <div className="checkbox-tile checked" style={{ border: 'none', background: 'none', padding: 0 }}>
              <label className={`checkbox-tile ${formData.exercise ? 'checked' : ''}`}>
                <input 
                  type="checkbox" 
                  name="exercise" 
                  checked={formData.exercise} 
                  onChange={handleInputChange} 
                />
                <div className="custom-check"></div>
                <span>{t('exerciseLabel', lang)}</span>
              </label>
            </div>

            <div className="checkbox-tile checked" style={{ border: 'none', background: 'none', padding: 0 }}>
              <label className={`checkbox-tile ${formData.fast_food ? 'checked' : ''}`}>
                <input 
                  type="checkbox" 
                  name="fast_food" 
                  checked={formData.fast_food} 
                  onChange={handleInputChange} 
                />
                <div className="custom-check"></div>
                <span>{t('fastFoodLabel', lang)}</span>
              </label>
            </div>
          </div>

          <div className="btn-container">
            <div></div>
            <button className="btn btn-primary" onClick={handleNext}>
              Next: Symptoms <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <div className="card-title">
            <span>{t('step2Label', lang)}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {t('selectSymptomsHint', lang)}
          </p>

          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '1rem' }}>
                {cat}
              </h3>
              <div className="checkbox-grid">
                {symptomsList.filter(s => s.category === cat).map(symptom => {
                  const isChecked = selectedSymptoms.includes(symptom.id);
                  return (
                    <label key={symptom.id} className={`checkbox-tile ${isChecked ? 'checked' : ''}`}>
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => toggleSymptom(symptom.id)} 
                      />
                      <div className="custom-check"></div>
                      <span style={{ fontSize: '0.85rem' }}>{symptom.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="btn-container">
            <button className="btn btn-secondary" onClick={handlePrev}>
              <ChevronLeft size={18} /> Back
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? t('analyzingBtn', lang) : t('analyzeBtn', lang)}
                <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && results && (
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div className="result-header">
              <span style={{ color: 'var(--text-secondary)' }}>Body Mass Index (BMI)</span>
              <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: '800', margin: '0.2rem 0' }}>
                {results.bmi}
              </h2>
              <span style={{ 
                fontSize: '0.85rem', 
                color: results.bmi > 25 ? 'var(--warning)' : (results.bmi < 18.5 ? 'var(--warning)' : 'var(--success)') 
              }}>
                {results.bmi > 25 ? "Overweight (Wazan zyada hai)" : (results.bmi < 18.5 ? "Underweight" : "Normal Weight")}
              </span>
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            {t('resultsTitle', lang)}
          </h2>

          <div className="result-card-list">
            {Object.entries(results.results).map(([id, result]) => (
              <div key={id} className="result-card">
                <div className="result-card-header">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>
                    {result.name}
                  </h3>
                  <span className={`badge ${result.risk_level.toLowerCase()}`}>
                    {result.risk_level} Risk ({result.risk_score}%)
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic', borderLeft: '3px solid var(--primary)', paddingLeft: '0.75rem' }}>
                  {result.explanation}
                </p>

                {result.matched_symptoms.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Matched Symptoms:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {result.matched_symptoms.map(s => (
                        <span key={s} style={{ backgroundColor: 'var(--bg-tertiary)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Urgency:</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: result.urgency.includes('urgent') ? 'var(--danger)' : 'var(--text-primary)' }}>
                      {result.urgency} - <span style={{ fontWeight: 'normal', color: 'var(--text-secondary)' }}>{result.urgency_desc}</span>
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Lifestyle Advice (Tips):</span>
                    <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem' }}>
                      {result.lifestyle_tips.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="disclaimer-box">
            <strong>Disclaimer:</strong> {results.disclaimer}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => generateAssessmentPDF(results, localStorage.getItem('user_name') || 'Patient')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download size={16} /> {t('downloadPDF', lang)}
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              <RotateCcw size={16} /> {t('startNewAssessment', lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
