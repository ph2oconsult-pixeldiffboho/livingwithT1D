import { useState } from "react";

const COLORS = { ocean: "#2E86AB", coral: "#F46036", mint: "#56C596", sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A" };

const explanations = {
  spike: {
    highFat: "High-fat meals (pizza, burgers, pasta with cream sauce) slow stomach emptying. Carbs absorb gradually over 3–5 hours instead of 1–2 hours, causing a delayed glucose rise that can appear hours after eating.",
    insulinTiming: "Insulin given at or after eating (instead of 10–15 min before) means glucose from food enters the bloodstream before insulin is active. This mismatch causes a spike, even if the carb count was correct.",
    postExercise: "After intense exercise, the liver releases stored glucose (glycogen) as a rebound response. This 'post-exercise glucose rebound' can cause a rise 1–3 hours after activity ends, even when the child feels fine.",
    illness: "During illness, the body releases stress hormones (cortisol, adrenaline) that cause insulin resistance. Glucose rises even without eating — this is why sick days often require more insulin.",
    stress: "Emotional stress triggers the same hormonal response as physical stress. Exams, anxiety, and emotional upset can cause significant glucose rises. This is not the child's fault.",
    growth: "Growth hormone, released mainly at night, causes temporary insulin resistance. This is very common in children and adolescents and explains unexplained overnight rises — sometimes called the 'dawn phenomenon'.",
  },
  drop: {
    exercise: "Exercise makes muscles absorb glucose without needing insulin. During and after physical activity — especially sustained cardio like running or swimming — glucose can fall quickly, sometimes for up to 12 hours after.",
    tooMuchInsulin: "If the insulin dose was slightly higher than needed (easy to do — carb counting is not exact), glucose will fall below target range. Even small over-corrections can cause a low.",
    delayed: "Sometimes glucose drops 2–4 hours after a meal when the insulin is still active but food has already been absorbed. This 'late hypoglycaemia' is more common with high-fat meals that slow absorption.",
    hotWeather: "Heat increases circulation and speeds up insulin absorption from the injection or pump site. On hot days or after a hot shower, insulin may act faster than expected, causing glucose to fall.",
    growth2: "Children grow in spurts. During a growth phase, the body's insulin sensitivity can suddenly increase, meaning the same dose works harder than before — causing unexpected lows.",
  },
};

export default function GlucoseExplainer() {
  const [direction, setDirection] = useState(null);
  const [factors, setFactors] = useState([]);
  const [results, setResults] = useState(null);

  const spikeFactors = [
    { id: "highFat", label: "High-fat meal (pizza, cheese, cream)", emoji: "🍕" },
    { id: "insulinTiming", label: "Insulin given at or after eating", emoji: "💉" },
    { id: "postExercise", label: "High-intensity exercise beforehand", emoji: "⚽" },
    { id: "illness", label: "Child is unwell / sick day", emoji: "🤒" },
    { id: "stress", label: "Emotional stress or anxiety", emoji: "😰" },
    { id: "growth", label: "Overnight rise / early morning", emoji: "🌙" },
  ];

  const dropFactors = [
    { id: "exercise", label: "Exercise or active sport", emoji: "🏃" },
    { id: "tooMuchInsulin", label: "Possible over-correction / extra insulin", emoji: "💉" },
    { id: "delayed", label: "Drop 2–4 hours after a meal", emoji: "⏰" },
    { id: "hotWeather", label: "Hot weather or warm environment", emoji: "☀️" },
    { id: "growth2", label: "Unexpected — child growing", emoji: "📈" },
  ];

  const toggle = (id) => {
    setFactors(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    setResults(null);
  };

  const explain = () => {
    if (!direction || factors.length === 0) return;
    const pool = direction === "spike" ? explanations.spike : explanations.drop;
    setResults(factors.filter(f => pool[f]).map(f => ({ id: f, text: pool[f] })));
  };

  return (
    <div>
      <div className="section-header">
        <h2>🔍 Why Did This Happen?</h2>
        <p>Tell us what you observed and we'll explain the most likely reasons. Turn confusing glucose data into clear understanding.</p>
      </div>

      <div className="tool-disclaimer">
        This tool is for <strong>educational learning only</strong> and does not provide dosing advice. Always consult your diabetes care team for treatment decisions.
      </div>

      <div className="explainer-step">
        <div className="step-label">Step 1 — What did glucose do?</div>
        <div className="direction-grid">
          {[
            { id: "spike", label: "It went UP unexpectedly 📈", color: COLORS.coral },
            { id: "drop", label: "It went DOWN unexpectedly 📉", color: COLORS.ocean },
          ].map(d => (
            <button key={d.id} className={`direction-btn ${direction === d.id ? "active" : ""}`}
              style={{ "--d-color": d.color }} onClick={() => { setDirection(d.id); setFactors([]); setResults(null); }}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {direction && (
        <div className="explainer-step">
          <div className="step-label">Step 2 — Which factors apply? (select all that do)</div>
          <div className="factors-grid">
            {(direction === "spike" ? spikeFactors : dropFactors).map(f => (
              <button key={f.id} className={`factor-btn ${factors.includes(f.id) ? "active" : ""}`}
                onClick={() => toggle(f.id)}>
                <span style={{ fontSize: "1.4rem" }}>{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {direction && factors.length > 0 && (
        <div className="explainer-step">
          <div className="step-label">Step 3 — Get your explanation</div>
          <button className="explain-btn" onClick={explain}>Explain possible causes →</button>
        </div>
      )}

      {results && results.length > 0 && (
        <div className="results-panel">
          <div className="results-title">
            💡 Possible reasons for the {direction === "spike" ? "glucose rise" : "glucose drop"}
          </div>
          {results.map((r, i) => (
            <div key={r.id} className="result-item">
              <div className="result-number">{i + 1}</div>
              <div className="result-text">{r.text}</div>
            </div>
          ))}
          <div className="results-footer">
            Remember: glucose patterns often have multiple causes. This explanation is a learning guide — not a diagnosis. Discuss persistent patterns with your diabetes educator.
          </div>
        </div>
      )}
    </div>
  );
}
