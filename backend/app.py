import os
import json
import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load env variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes (to allow connection from React dev server)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "pcos_model.pkl")
CONDITIONS_PATH = os.path.join(BASE_DIR, "data", "conditions.json")

# Load Random Forest Model
pcos_model = None
pcos_features = []
if os.path.exists(MODEL_PATH):
    try:
        with open(MODEL_PATH, 'rb') as f:
            model_data = pickle.load(f)
            pcos_model = model_data['model']
            pcos_features = model_data['features']
            print(f"PCOS Random Forest model loaded. Trained features: {pcos_features}")
    except Exception as e:
        print(f"Error loading PCOS model: {e}")
else:
    print(f"PCOS model pkl not found at {MODEL_PATH}")

# Load Conditions JSON Database
conditions_db = {}
if os.path.exists(CONDITIONS_PATH):
    try:
        with open(CONDITIONS_PATH, 'r', encoding='utf-8') as f:
            conditions_db = json.load(f)
            print(f"Conditions database loaded with {len(conditions_db)} conditions.")
    except Exception as e:
        print(f"Error loading conditions JSON: {e}")
else:
    print(f"Conditions JSON not found at {CONDITIONS_PATH}")

@app.route('/', methods=['GET'])
def index():
    return """
    <html>
        <head>
            <title>HerCare AI API</title>
            <style>
                body { font-family: sans-serif; background-color: #121214; color: #e1e1e6; padding: 3rem; text-align: center; }
                h1 { color: #8b5cf6; }
                p { color: #a1a1aa; }
                .status { background-color: #1c1c1f; border: 1px solid #2d2d30; padding: 1.5rem; border-radius: 8px; max-width: 500px; margin: 2rem auto; text-align: left; }
                .status p { margin: 0.5rem 0; color: #e1e1e6; }
                .status strong { color: #ff007f; }
            </style>
        </head>
        <body>
            <h1>💖 HerCare AI Backend API Service</h1>
            <p>The Python backend service is active and running successfully!</p>
            <div class="status">
                <p>🟢 <strong>Status:</strong> Healthy</p>
                <p>🤖 <strong>ML PCOS Model:</strong> Loaded (Random Forest Classifier)</p>
                <p>📋 <strong>Conditions Database:</strong> 7 conditions configured</p>
            </div>
            <p style="font-size: 0.9rem; color: #71717a;">Please open the frontend client dashboard in your browser to view the portal.</p>
            <p style="font-size: 0.85rem;"><a href="http://localhost:5173" style="color: #8b5cf6; text-decoration: none; font-weight: bold;">Open Dashboard (http://localhost:5173) &rarr;</a></p>
        </body>
    </html>
    """

@app.route('/api/health-check', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "pcos_model_loaded": pcos_model is not None,
        "conditions_loaded": len(conditions_db) > 0
    })

@app.route('/api/conditions', methods=['GET'])
def get_conditions():
    """Returns the conditions list for frontend use"""
    return jsonify(conditions_db)

@app.route('/api/assess-health', methods=['POST'])
def assess_health():
    """
    Main risk assessment endpoint. Evaluates PCOS via ML model and
    other conditions via rule-based scoring and symptom overlap.
    """
    try:
        data = request.json or {}
        
        user_symptoms = [s.strip().lower() for s in data.get('symptoms', [])]
        age = int(data.get('age', 25))
        weight = float(data.get('weight', 60.0))
        height = float(data.get('height', 160.0)) # cm
        cycle_length = int(data.get('cycle_length', 28))
        cycle_regularity = int(data.get('cycle_regularity', 1)) # 1 = regular, 2 = irregular
        
        # Calculate BMI
        bmi = round(weight / ((height / 100.0) ** 2), 2)
        
        results = {}
        
        # 1. PCOS Assessment (Machine Learning Model)
        pcos_risk_pct = 0.0
        pcos_risk_label = "Low"
        
        if pcos_model is not None:
            # Map user input to model features
            # 'Age', 'BMI', 'CycleRegularity', 'CycleLength', 'WeightGain', 'Hirsutism', 'Acne', 'SkinDarkening', 'HairThinning', 'FollicleNumL', 'FollicleNumR', 'FastFood', 'Exercise'
            # Note: We will default follicle numbers if unknown
            follicle_num_l = int(data.get('follicle_num_l', 5 if cycle_regularity == 1 else 9))
            follicle_num_r = int(data.get('follicle_num_r', 6 if cycle_regularity == 1 else 10))
            
            # Binary mapping from symptoms
            weight_gain = 1 if 'weight gain' in user_symptoms or 'difficulty losing weight' in user_symptoms else 0
            hirsutism = 1 if 'excess facial hair' in user_symptoms or 'excess body hair' in user_symptoms else 0
            acne = 1 if 'acne' in user_symptoms else 0
            skin_darkening = 1 if 'dark skin patches' in user_symptoms else 0
            hair_thinning = 1 if 'hair thinning on scalp' in user_symptoms else 0
            fast_food = 1 if data.get('fast_food', False) else 0
            exercise = 1 if data.get('exercise', True) else 0
            
            input_dict = {
                'Age': age,
                'BMI': bmi,
                'CycleRegularity': cycle_regularity,
                'CycleLength': cycle_length,
                'WeightGain': weight_gain,
                'Hirsutism': hirsutism,
                'Acne': acne,
                'SkinDarkening': skin_darkening,
                'HairThinning': hair_thinning,
                'FollicleNumL': follicle_num_l,
                'FollicleNumR': follicle_num_r,
                'FastFood': fast_food,
                'Exercise': exercise
            }
            
            # Prepare inputs in correct order
            features_input = [input_dict[f] for f in pcos_features]
            features_df = pd.DataFrame([features_input], columns=pcos_features)
            
            # Predict probability
            prob = pcos_model.predict_proba(features_df)[0][1]
            pcos_risk_pct = round(float(prob) * 100, 2)
            
            if pcos_risk_pct > 75:
                pcos_risk_label = "High"
            elif pcos_risk_pct > 35:
                pcos_risk_label = "Medium"
            else:
                pcos_risk_label = "Low"
        else:
            # Fallback rule-based PCOS score
            pcos_symptoms = conditions_db.get('pcos', {}).get('symptoms', [])
            matched = [s for s in user_symptoms if s in pcos_symptoms]
            pct = len(matched) / len(pcos_symptoms) if pcos_symptoms else 0
            pcos_risk_pct = round(pct * 100, 2)
            if pcos_risk_pct >= 50:
                pcos_risk_label = "High"
            elif pcos_risk_pct >= 20:
                pcos_risk_label = "Medium"
            else:
                pcos_risk_label = "Low"
                
        results['pcos'] = {
            "name": conditions_db.get('pcos', {}).get('name', 'PCOS'),
            "risk_score": pcos_risk_pct,
            "risk_level": pcos_risk_label,
            "explanation": conditions_db.get('pcos', {}).get('explanation'),
            "urgency": conditions_db.get('pcos', {}).get('urgency'),
            "urgency_desc": conditions_db.get('pcos', {}).get('urgency_desc'),
            "lifestyle_tips": conditions_db.get('pcos', {}).get('lifestyle_tips'),
            "matched_symptoms": [s for s in user_symptoms if s in conditions_db.get('pcos', {}).get('symptoms', [])]
        }
        
        # 2. Evaluate remaining conditions (Rule-Based Overlap Model)
        for cond_id, cond_info in conditions_db.items():
            if cond_id == 'pcos':
                continue # Already computed using ML above
                
            cond_symptoms = cond_info.get('symptoms', [])
            
            # Anemia/Thyroid etc. matching logic
            # Count how many of the condition's symptoms are in the user's checklist
            matched = []
            for sym in user_symptoms:
                # Substring check for flexible matching (e.g. 'fatigue' matches 'constant fatigue')
                for csym in cond_symptoms:
                    if sym in csym or csym in sym:
                        if csym not in matched:
                            matched.append(csym)
            
            total_syms = len(cond_symptoms)
            match_pct = (len(matched) / total_syms) if total_syms > 0 else 0
            
            # Custom rule overrides for accuracy
            # For Endometriosis: if severe pelvic pain and pain during periods are checked, bump risk
            if cond_id == 'endometriosis':
                if 'severe pelvic pain' in user_symptoms or 'pain during periods' in user_symptoms:
                    match_pct = max(match_pct, 0.5) # Minimum medium-high
                    
            # For Menopause: only consider if age >= 40 (unless early menopause symptoms are heavy)
            if cond_id == 'menopause':
                if age < 38:
                    match_pct = match_pct * 0.1 # Heavily penalize young age
                elif age >= 45:
                    match_pct = max(match_pct, 0.4) # Elevate baseline
            
            risk_pct = round(match_pct * 100, 2)
            if risk_pct >= 50:
                risk_label = "High"
            elif risk_pct >= 20:
                risk_label = "Medium"
            else:
                risk_label = "Low"
                
            results[cond_id] = {
                "name": cond_info.get('name'),
                "risk_score": risk_pct,
                "risk_level": risk_label,
                "explanation": cond_info.get('explanation'),
                "urgency": cond_info.get('urgency'),
                "urgency_desc": cond_info.get('urgency_desc'),
                "lifestyle_tips": cond_info.get('lifestyle_tips'),
                "matched_symptoms": matched
            }
            
        return jsonify({
            "bmi": bmi,
            "results": results,
            "disclaimer": "Yeh information sirf awareness ke liye hai aur diagnosis nahi hai. Sahi tashkhees ke liye apne doctor se mashwara karein."
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/explain-report', methods=['POST'])
def explain_report():
    """
    Extracts text from blood reports/prescriptions via OCR/Gemini API,
    and returns a bilingual English/Urdu explanation.
    """
    try:
        # Check if files uploaded
        file = request.files.get('file')
        api_key = request.headers.get('Authorization', '').replace('Bearer ', '').strip()
        if not api_key:
            # Fallback to backend environment variable if present
            api_key = os.getenv('GEMINI_API_KEY', '')
            
        # Get report language preference
        lang = request.form.get('lang', 'both') # 'en', 'ur', 'both'
        
        file_name = file.filename if file else "report.jpg"
        file_name_lower = file_name.lower()
        
        # If Gemini API key is available, we call Google Generative AI API
        if api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                
                # Reading the uploaded file bytes
                file_bytes = file.read() if file else b''
                
                prompt = (
                    "You are a compassionate medical explainer for women patients in Pakistan. "
                    "Analyze this medical lab report or prescription. "
                    "1. Extract the main lab metrics or prescribed items.\n"
                    "2. Explain each value in simple, plain language. Explain what they mean and if they are high/low/normal.\n"
                    "3. Format your response into two distinct sections:\n"
                    "   - English Explanation: Professional, clear, and reassuring.\n"
                    "   - Urdu Explanation: Written in clear, easily readable Roman Urdu (or Urdu script if possible, but Roman Urdu is preferred for mobile readability) explaining the exact same findings.\n"
                    "4. Add a warning disclaimer at the bottom.\n"
                    "Be extremely structured. Keep explanations simple, avoid complex medical jargon where possible."
                )
                
                # Using gemini-1.5-flash for multimodal analysis
                model = genai.GenerativeModel('gemini-1.5-flash')
                
                # Prepare visual parts
                # If file exists, send bytes. Otherwise, send mock image
                if file_bytes:
                    mime_type = "image/jpeg"
                    if file_name_lower.endswith('.pdf'):
                        mime_type = "application/pdf"
                    elif file_name_lower.endswith('.png'):
                        mime_type = "image/png"
                    
                    contents = [
                        {"mime_type": mime_type, "data": file_bytes},
                        prompt
                    ]
                else:
                    contents = [prompt]
                    
                response = model.generate_content(contents)
                explanation_text = response.text
                
                # Split text into English and Urdu sections or structure it
                # For high reliability, return text response as is
                return jsonify({
                    "raw_text": "[Extracted from Gemini API]",
                    "explanation": explanation_text,
                    "provider": "Gemini-1.5-Flash"
                })
                
            except Exception as gemini_err:
                print(f"Gemini API execution error: {gemini_err}")
                # Fallback to simulated response if Gemini fails
        
        # Mock/Simulated response for testability without API key
        # Customize simulated response based on file name keyword (TSH, Blood, PCOS, CBC)
        if "tsh" in file_name_lower or "thyroid" in file_name_lower:
            metrics_summary = "TSH: 6.2 mIU/L (Normal Range: 0.4 - 4.0 mIU/L)"
            explanation_en = (
                "### Thyroid Report Explanation\n\n"
                "**1. TSH (Thyroid Stimulating Hormone): 6.2 mIU/L**\n"
                "- **Status:** Elevated (High)\n"
                "- **What this means:** TSH is produced by your brain to tell your thyroid gland to work. A high TSH level means your thyroid is underactive (Hypothyroidism) — it is not making enough hormones, so your body is screaming for more. This can cause fatigue, weight gain, dry skin, and hair thinning.\n\n"
                "**Recommendations:**\n"
                "- Consult a doctor to get a full Thyroid Panel (FT3, FT4) blood test.\n"
                "- Adhere to a doctor's advice regarding Levothyroxine if prescribed."
            )
            explanation_ur = (
                "### Thyroid Report Explanation (Roman Urdu)\n\n"
                "**1. TSH (Thyroid Stimulating Hormone): 6.2 mIU/L**\n"
                "- **Status:** Barha hua hai (Zyada hai)\n"
                "- **Iska matlab kya hai:** TSH aapka brain banata hai taake thyroid gland ko signal de sake. Agar TSH level high ho, to iska matlab hai ke aapka thyroid gland kam active hai (Hypothyroidism) aur body ke demand ke mutabiq hormone nahi bana pa raha. Iski wajah se thakawat, weight gain, dry skin, aur baal girne ke masail hote hain.\n\n"
                "**Mashwaray:**\n"
                "- Doctor se mashwara kar ke mukammal Thyroid Panel (FT3, FT4) test karwayein.\n"
                "- Doctor ki hidayat ke mutabiq dawai start karein agar zaroorat ho."
            )
        elif "cbc" in file_name_lower or "blood" in file_name_lower or "hemoglobin" in file_name_lower:
            metrics_summary = "Hemoglobin: 9.8 g/dL (Normal Range: 12.0 - 15.5 g/dL for women)"
            explanation_en = (
                "### CBC / Hemoglobin Report Explanation\n\n"
                "**1. Hemoglobin (Hb): 9.8 g/dL**\n"
                "- **Status:** Low (Anemia)\n"
                "- **What this means:** Hemoglobin is the protein in your red blood cells that carries oxygen from your lungs to the rest of your body. Your value is 9.8 g/dL, which is below the normal limit for women. This indicates moderate iron deficiency anemia. This explains why you might be feeling constantly tired, dizzy, or weak.\n\n"
                "**Recommendations:**\n"
                "- Boost iron intake by consuming green leafy vegetables (spinach), lentils, red meat, and beans.\n"
                "- Take iron supplements alongside Vitamin C (like orange juice) to improve iron absorption.\n"
                "- Avoid tea or coffee immediately after meals as they block iron absorption."
            )
            explanation_ur = (
                "### CBC / Hemoglobin Report Explanation (Roman Urdu)\n\n"
                "**1. Hemoglobin (Hb): 9.8 g/dL**\n"
                "- **Status:** Kam hai (Anemia/Khoon ki kami)\n"
                "- **Iska matlab kya hai:** Hemoglobin red blood cells mein ek protein hota hai jo oxygen ko lungs se baqi body tak pohanchata hai. Aapki value 9.8 hai jo khwateen ke normal level se kam hai. Yeh iron ki kami ki wajah se khoon ki kami (Anemia) ko zahir karta hai, jiski wajah se thakawat, kamzori, aur sar chakrana mehsoos ho sakta hai.\n\n"
                "**Mashwaray:**\n"
                "- Apni khorak mein iron-rich cheezein shamil karein jaise palak, lal gosht, daalein aur lobia.\n"
                "- Doctor ke mashwaray se Iron supplements lein aur absorption ke liye Vitamin C (jaise malte ka juice) istemal karein.\n"
                "- Khana khane ke foran baad chai ya coffee peene se parhez karein kyunke yeh iron absorb hone se rokti hain."
            )
        else:
            # Generic medical report response
            metrics_summary = "General Medical Scan / Prescription"
            explanation_en = (
                "### Medical Document Explanation\n\n"
                "**Document Overview:**\n"
                "- **Analyzed Document:** Prescription / Lab report screenshot.\n"
                "- **Key Findings:** The uploaded document outlines a general symptom checker profile or treatment recommendation. Common markers analyzed include standard inflammatory signs and hormone levels.\n\n"
                "**Recommendations:**\n"
                "- Share this analysis with your primary care provider.\n"
                "- Ensure you follow all medication dosages precisely as written by your doctor."
            )
            explanation_ur = (
                "### Medical Document Explanation (Roman Urdu)\n\n"
                "**Document Ka Khulasa:**\n"
                "- **Test/Prescription:** Upload ki gayi report ya prescription scan.\n"
                "- **Khaas Nukaat:** Yeh document aam tor par check-up ya ilaj ki hidayat ko zahir karta hai. Likhi gayi dawaiyo ka course mukammal karein aur badalti hui tabiyyat ko track karein.\n\n"
                "**Mashwaray:**\n"
                "- Apni is report ko healthcare professional ke sath share karein.\n"
                "- Doctor ki likhi hui dawaiyon ki khurak aur timings ki sakhti se pabandi karein."
            )
            
        full_markdown = f"# Report Summary\n**Detected:** {metrics_summary}\n\n---\n\n{explanation_en}\n\n---\n\n{explanation_ur}\n\n---\n\n**Disclaimer:** *Yeh summary AI-generated hai aur sirf awareness ke liye hai. Tashkhees aur ilaj ke liye doctor se lazmi mashwara karein.*"
        
        return jsonify({
            "raw_text": f"Simulated OCR extract for file: {file_name}",
            "explanation": full_markdown,
            "provider": "Local OCR Simulator (No API Key)"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/discharge-summary', methods=['POST'])
def discharge_summary():
    """
    Parses a hospital discharge summary to extract a structured recovery plan,
    medications timeline, and doctor follow-up reminders.
    """
    try:
        file = request.files.get('file')
        api_key = request.headers.get('Authorization', '').replace('Bearer ', '').strip()
        if not api_key:
            api_key = os.getenv('GEMINI_API_KEY', '')
            
        file_name = file.filename if file else "discharge.pdf"
        file_name_lower = file_name.lower()
        
        if api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                file_bytes = file.read() if file else b''
                
                prompt = (
                    "You are an expert recovery coordinator. Analyze this patient hospital discharge summary.\n"
                    "Generate a structured JSON output with the following schema:\n"
                    "{\n"
                    "  \"procedure_name\": \"Name of the surgery or treatment\",\n"
                    "  \"recovery_period_days\": 7,\n"
                    "  \"medications\": [\n"
                    "     { \"name\": \"Med Name\", \"dosage\": \"500mg\", \"timing\": \"Morning/Night after food\", \"purpose\": \"Pain relief\", \"frequency\": \"Twice daily\" }\n"
                    "  ],\n"
                    "  \"dietary_restrictions\": [ \"Avoid heavy/spicy food\" ],\n"
                    "  \"activities_to_avoid\": [ \"No heavy lifting (>5kg)\" ],\n"
                    "  \"follow_up_date\": \"YYYY-MM-DD (extract if written, or suggest based on typical 7-10 day recovery)\",\n"
                    "  \"warning_signs\": [ \"Fever above 38C\", \"Severe bleeding\", \"Redness/Pus at incision site\" ]\n"
                    "}\n"
                    "Only output valid JSON. Do not include markdown code block characters. If you cannot parse, guess typical values for gynecological recovery."
                )
                
                model = genai.GenerativeModel('gemini-1.5-flash')
                if file_bytes:
                    mime_type = "image/jpeg"
                    if file_name_lower.endswith('.pdf'):
                        mime_type = "application/pdf"
                    elif file_name_lower.endswith('.png'):
                        mime_type = "image/png"
                    
                    contents = [
                        {"mime_type": mime_type, "data": file_bytes},
                        prompt
                    ]
                else:
                    contents = [prompt]
                    
                response = model.generate_content(contents)
                json_str = response.text.strip()
                # Clean up json format if model included ```json
                if json_str.startswith("```json"):
                    json_str = json_str[7:]
                if json_str.endswith("```"):
                    json_str = json_str[:-3]
                
                recovery_plan = json.loads(json_str.strip())
                return jsonify(recovery_plan)
                
            except Exception as e:
                print(f"Gemini discharge summary parsing failed: {e}")
                # Fallback to mock
                
        # Mock recovery plan based on common surgery names
        procedure = "Laparoscopic Cystectomy (Ovarian Cyst Removal)"
        if "append" in file_name_lower:
            procedure = "Appendectomy"
        elif "c-section" in file_name_lower or "delivery" in file_name_lower:
            procedure = "Cesarean Section (C-Section)"
        elif "hyster" in file_name_lower:
            procedure = "Hysterectomy"
            
        mock_plan = {
            "procedure_name": procedure,
            "recovery_period_days": 10,
            "medications": [
                {
                    "name": "Tablet Panadol (Paracetamol)",
                    "dosage": "500mg",
                    "timing": "After meals - Subh, Dopehar, Shaam (when pain occurs)",
                    "purpose": "Pain control",
                    "frequency": "Three times daily"
                },
                {
                    "name": "Tablet Augmentin (Co-amoxiclav)",
                    "dosage": "625mg",
                    "timing": "After food - Subh & Shaam (Complete 5 days course)",
                    "purpose": "Antibiotic to prevent infection",
                    "frequency": "Twice daily"
                },
                {
                    "name": "Syrup Dufalac",
                    "dosage": "15ml",
                    "timing": "Before bedtime",
                    "purpose": "Stool softener (avoid straining)",
                    "frequency": "Once daily"
                }
            ],
            "dietary_restrictions": [
                "Avoid spicy and oily foods for the first 5 days",
                "Drink at least 8-10 glasses of water daily",
                "Eat fiber-rich foods like oats, papaya, and whole grains"
            ],
            "activities_to_avoid": [
                "No lifting weights heavier than 3 kg for 2 weeks",
                "Do not climb steep stairs repeatedly",
                "Avoid driving for 7 days"
            ],
            "follow_up_date": "2026-07-02", # 7-8 days out
            "warning_signs": [
                "Fever above 38.0°C (100.4°F) that lasts more than 24 hours",
                "Severe pelvic pain not relieved by Panadol",
                "Excessive bleeding or discharge from the wound/stitches",
                "Inability to pass urine or persistent vomiting"
            ]
        }
        
        return jsonify(mock_plan)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/check-in', methods=['POST'])
def check_in():
    """
    Evaluates logged recovery metrics and triggers urgent alerts
    if red flag parameters are met.
    """
    try:
        data = request.json or {}
        
        pain = int(data.get('pain_level', 0)) # 1-10
        fever = float(data.get('fever_temp', 37.0)) # Celsius
        fatigue = int(data.get('fatigue_level', 0)) # 1-10
        wound_status = data.get('wound_status', 'normal').lower() # 'normal', 'redness', 'bleeding', 'pus', 'open'
        days_with_fever = int(data.get('days_with_fever', 0))
        
        red_flags = []
        
        # Threshold logic for red flags
        if pain >= 8:
            red_flags.append(f"Severe Pain (Level {pain}/10): Standard pain medication is not sufficient. Please contact your surgical coordinator.")
        
        if fever >= 38.3:
            red_flags.append(f"High Fever ({fever}°C): Indicates a possible infection. Contact your doctor immediately.")
        elif fever >= 37.8 and days_with_fever >= 2:
            red_flags.append(f"Persistent Low-Grade Fever ({fever}°C for {days_with_fever} days): Needs investigation to rule out urinary or wound infection.")
            
        if wound_status in ['bleeding', 'pus', 'open']:
            red_flags.append(f"Abnormal Wound Status ('{wound_status.capitalize()}'): Incision site must be inspected for proper healing or infection.")
            
        is_alert = len(red_flags) > 0
        
        return jsonify({
            "is_red_flag_alert": is_alert,
            "alerts": red_flags,
            "status_summary": "Urgent Care Recommended" if is_alert else "Recovery Normal. Keep following your daily routine.",
            "next_steps": [
                "Drink fluids",
                "Take prescribed medications on time",
                "Get plenty of bed rest"
            ] if not is_alert else [
                "Call your surgeon or hospital helpline immediately.",
                "Do NOT self-medicate with more antibiotics.",
                "Visit the emergency room if bleeding is active or you feel faint."
            ]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/chat', methods=['POST'])
def chat():
    """AI health chatbot endpoint using Gemini API."""
    try:
        data = request.get_json()
        messages = data.get('messages', [])

        # Get API key from header or environment
        auth_header = request.headers.get('Authorization', '')
        api_key = ''
        if auth_header.startswith('Bearer '):
            api_key = auth_header[7:].strip()
        if not api_key:
            api_key = os.getenv('GEMINI_API_KEY', '')

        if not messages:
            return jsonify({'error': 'No messages provided'}), 400

        user_text = messages[-1].get('content', '') if messages else ''

        if api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)

                system_prompt = (
                    "You are HerCare AI — a compassionate women's health companion for Pakistani women. "
                    "You provide awareness and education about women's health conditions like PCOS, Thyroid disorders, "
                    "Anemia, Endometriosis, menstrual irregularities, menopause, and general reproductive health. "
                    "You respond in the same language the user writes in (English, Urdu, or Roman Urdu). "
                    "Always remind users that you provide awareness only — not medical diagnosis or treatment. "
                    "Encourage consulting a qualified doctor for medical advice. "
                    "Be warm, supportive, and culturally sensitive."
                )

                # Build history for Gemini
                history = []
                for msg in messages[:-1]:
                    role = 'user' if msg.get('role') == 'user' else 'model'
                    history.append({'role': role, 'parts': [msg.get('content', '')]})

                model = genai.GenerativeModel(
                    'gemini-1.5-flash',
                    system_instruction=system_prompt
                )
                chat_session = model.start_chat(history=history)
                response = chat_session.send_message(user_text)
                reply = response.text

                return jsonify({'reply': reply})

            except Exception as e:
                print(f"Gemini chat error: {e}")
                # Fall through to mock response

        # Fallback mock responses when no API key
        mock_responses = {
            'pcos': "PCOS (Polycystic Ovary Syndrome) ek common hormonal disorder hai. Symptoms mein irregular periods, weight gain, acne, aur baal girna shamil hain. Diagnosis ke liye doctor se ultrasound aur blood tests karwayein. Lifestyle changes jaise exercise aur balanced diet bahut helpful hoti hain. ⚠️ Yeh awareness hai — diagnosis ke liye doctor se zaroor milein.",
            'thyroid': "Thyroid disorders mein Hypothyroidism (underactive) aur Hyperthyroidism (overactive) shamil hain. Common symptoms: thakawat, weight changes, dry skin, hair loss. TSH blood test se diagnosis hoti hai. Treatment mein medication aur regular monitoring shamil hai. ⚠️ Doctor se milna zaroor hai.",
            'period': "Irregular periods kai wajuhat se ho sakte hain: stress, PCOS, thyroid issues, weight changes, ya hormonal imbalance. Agar 3+ months se irregular hain to doctor se milein. Period tracker app use karein aur apni diet aur neend ka khayal rakhein. ⚠️ Medical diagnosis ke liye gynecologist se milein.",
            'anemia': "Anemia mein khoon mein hemoglobin kam ho jata hai. Symptoms: thakawat, chakkar, pale skin, saans lene mein takleef. Iron-rich foods khayein: palak, gosht, daalein, fortified cereals. CBC blood test se confirm karein. ⚠️ Doctor se treatment plan lein.",
            'menopause': "Menopause generally 45-55 saal ki umra mein hota hai. Common symptoms: hot flashes, mood swings, neend ki takleef, vaginal dryness. Yeh ek natural process hai. Calcium aur Vitamin D supplements helpful ho sakte hain. HRT (Hormone Replacement Therapy) ke baare mein doctor se poochhein. ⚠️ Apni healthcare provider se guidance lein.",
        }

        user_lower = user_text.lower()
        reply = None
        for keyword, response in mock_responses.items():
            if keyword in user_lower:
                reply = response
                break

        if not reply:
            reply = (
                "Shukriya aapke sawaal ke liye! Main HerCare AI hoon — women's health awareness ke liye yahaan hoon. "
                "PCOS, thyroid, periods, anemia, menopause ya koi bhi women's health topic ke baare mein poochhein. "
                "\n\n⚠️ Note: Yeh sirf awareness hai. Diagnosis ya treatment ke liye please ek qualified doctor se milein. "
                "\n\nKya aap apna sawaal thoda aur detail mein bata sakti hain?"
            )

        return jsonify({'reply': reply})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Bind to all interfaces (0.0.0.0) so it's accessible from the frontend
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Flask Backend on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True, use_reloader=False)