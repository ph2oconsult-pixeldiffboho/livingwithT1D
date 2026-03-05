import { useState } from "react";

const COLORS = {
  ocean: "#2E86AB", coral: "#F46036", mint: "#56C596",
  sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A",
  red: "#C0392B", amber: "#E67E22", soft: "#F7F3EE",
};

// ── Emergency quick-reference data ───────────────────────────────────────────
const EMERGENCIES = [
  {
    id: "hypo",
    emoji: "📉",
    title: "Hypoglycaemia (Low Glucose)",
    threshold: "Below 4.0 mmol/L",
    color: COLORS.coral,
    urgency: "Act immediately",
    symptoms: ["Shakiness or trembling", "Sweating, pale skin", "Hunger, irritability", "Difficulty concentrating or glazed look", "Confusion or slurred speech"],
    steps: [
      { step: "1", action: "Give 15g fast-acting carbs", detail: "4 glucose tablets · 150ml fruit juice · 6–7 jellybeans · 1 small tube glucose gel" },
      { step: "2", action: "Wait 15 minutes", detail: "Do not give more food yet — give the glucose time to absorb" },
      { step: "3", action: "Recheck glucose", detail: "If still below 4.0 mmol/L — repeat step 1" },
      { step: "4", action: "Once above 4.0 mmol/L", detail: "Give a small snack with protein if the next meal is more than 30 minutes away (e.g. crackers and cheese)" },
    ],
    warning: "NEVER give food or drink to a child who is unconscious or unable to swallow safely. Use glucagon instead — see below.",
    callOOO: false,
  },
  {
    id: "severe-hypo",
    emoji: "🚨",
    title: "Severe Hypo — Child Cannot Swallow",
    threshold: "Unconscious, seizing, or unable to swallow",
    color: COLORS.red,
    urgency: "Call 000 immediately",
    symptoms: ["Unconscious or unresponsive", "Seizure / convulsions", "Unable to swallow safely", "Oral glucose has not worked"],
    steps: [
      { step: "1", action: "Call 000 now", detail: "Tell them your child has Type 1 Diabetes and is unconscious or seizing due to low glucose" },
      { step: "2", action: "Use glucagon", detail: "Baqsimi (nasal): insert tip into one nostril and press plunger. GlucaGen (injection): follow kit instructions." },
      { step: "3", action: "Place on side", detail: "Recovery position — in case of vomiting" },
      { step: "4", action: "Stay with child", detail: "Do not leave them alone. Glucagon should raise glucose within 10–15 minutes" },
    ],
    warning: "After glucagon is used, always seek emergency medical assessment — even if the child recovers quickly.",
    callOOO: true,
  },
  {
    id: "dka",
    emoji: "⚠️",
    title: "DKA — Diabetic Ketoacidosis",
    threshold: "High glucose + ketones + vomiting",
    color: COLORS.red,
    urgency: "Go to emergency now",
    symptoms: ["Glucose persistently above 14–15 mmol/L", "Moderate or large ketones on meter", "Vomiting or abdominal pain", "Deep, rapid breathing", "Fruity / acetone smell on breath", "Extreme tiredness or confusion"],
    steps: [
      { step: "1", action: "Go to emergency department now", detail: "Do not wait to see if it improves. DKA can develop rapidly and is life-threatening." },
      { step: "2", action: "Do NOT withhold insulin", detail: "Even if the child is vomiting and not eating — insulin must continue. Stopping insulin accelerates DKA." },
      { step: "3", action: "Check ketones", detail: "Any time glucose is above 14 mmol/L for more than 2 hours — check ketones. Moderate or large = urgent care." },
      { step: "4", action: "Bring medications", detail: "Bring all insulin, pump equipment, and a list of current doses to the emergency department" },
    ],
    warning: "When in doubt — go. Early DKA is easier to treat than advanced DKA. Do not wait for a callback from your team if the child is vomiting.",
    callOOO: true,
  },
];

// ── Sick day rules data ───────────────────────────────────────────────────────
const SICK_SECTIONS = [
  {
    id: "rule1",
    emoji: "💉",
    color: COLORS.ocean,
    title: "Never stop insulin",
    subtitle: "The most important sick day rule",
    content: "Even if your child is not eating, insulin must continue. When the body is fighting illness, it releases stress hormones (cortisol, adrenaline, glucagon) that raise glucose — often significantly. The need for insulin increases during illness, not decreases.\n\nStopping insulin during illness is one of the most common causes of DKA admissions.",
    keyPoint: "If your child cannot eat: give basal insulin as normal. For mealtime insulin, you may reduce or skip the dose if they cannot eat — but discuss this protocol with your diabetes team in advance, not during a crisis.",
  },
  {
    id: "rule2",
    emoji: "📊",
    color: COLORS.coral,
    title: "Check glucose more often",
    subtitle: "Every 2–3 hours during illness",
    content: "Illness causes unpredictable glucose swings. Normal checking intervals are not enough when your child is unwell.\n\nDuring illness, check glucose:\n• Every 2–3 hours during the day\n• Every 3–4 hours overnight (set an alarm)\n• Before and after any vomiting\n• Any time the child seems more unwell than expected",
    keyPoint: "CGM alerts should be tightened during illness. Consider setting your low alert to 5.0 mmol/L and your high alert to 12–13 mmol/L.",
  },
  {
    id: "rule3",
    emoji: "🧪",
    color: COLORS.amber,
    title: "Check ketones",
    subtitle: "Any glucose above 14 mmol/L for 2+ hours",
    content: "Ketones form when the body breaks down fat for energy in the absence of sufficient insulin. This happens faster during illness.\n\nCheck ketones:\n• Any time glucose is above 14 mmol/L for more than 2 hours\n• Any time the child is vomiting\n• Any time the child has symptoms of DKA (see Emergency tab)\n• First thing in the morning when unwell",
    keyPoint: "Ketone levels: Trace/small (under 0.6 mmol/L) — monitor closely. Moderate (0.6–1.5 mmol/L) — contact your diabetes team now. Large (above 1.5 mmol/L) — go to emergency department.",
  },
  {
    id: "rule4",
    emoji: "💧",
    color: COLORS.mint,
    title: "Keep fluids up",
    subtitle: "Especially when glucose is high",
    content: "High glucose causes fluid loss through increased urination. Combined with illness (fever, vomiting, reduced intake), dehydration can develop quickly in children.\n\nEncourage fluids:\n• Small, frequent sips rather than large amounts\n• If glucose is high: water, diet drinks, clear broth\n• If glucose is low or borderline: juice, sports drink, regular soft drink\n• If vomiting: ice chips, very small sips every few minutes",
    keyPoint: "If the child cannot keep any fluids down for more than 4–6 hours, or shows signs of dehydration (dry mouth, no tears, no urination), seek medical care.",
  },
  {
    id: "rule5",
    emoji: "🍞",
    color: COLORS.sunshine,
    title: "Sick day foods",
    subtitle: "When appetite is poor",
    content: "When appetite is poor during illness, the goal is to maintain glucose stability — not normal nutrition. Easy-to-digest carbohydrates help prevent hypoglycaemia if insulin continues.\n\nGood sick day foods (when glucose is in range or low):\n• Plain crackers or dry toast\n• Banana or apple\n• Plain rice or pasta\n• Yoghurt (plain)\n• Ice cream or ice blocks (for low glucose)\n• Honey or glucose gel\n\nIf glucose is high (above 10 mmol/L): encourage fluids only — avoid sugary foods.",
    keyPoint: "Try to match food intake to reduced insulin doses during illness — your diabetes team should give you a sick day protocol in advance.",
  },
  {
    id: "rule6",
    emoji: "🩺",
    color: COLORS.lavender,
    title: "When to call your diabetes team",
    subtitle: "Do not wait — call early",
    content: "Many families are reluctant to call their team and wait too long. Your diabetes team would rather hear from you early than see your child in emergency.\n\nCall your diabetes team (or after-hours line) if:\n• Glucose above 14 mmol/L for more than 2 hours and not coming down with correction\n• Any ketones above trace/small\n• Child is vomiting and cannot keep fluids or insulin down\n• Child seems increasingly unwell or confused\n• You are unsure what to do",
    keyPoint: "Program your diabetes team's after-hours number into your phone now — before you need it. In Australia, many paediatric hospitals have a 24-hour diabetes nurse hotline.",
  },
  {
    id: "rule7",
    emoji: "🚑",
    color: COLORS.red,
    title: "Go to emergency if…",
    subtitle: "Do not wait for a callback",
    content: "Go directly to your nearest emergency department — without waiting for a callback from your team — if:\n\n• Moderate or large ketones on meter\n• Child is vomiting continuously and cannot keep anything down\n• Glucose above 15 mmol/L and ketones present\n• Child is confused, drowsy, or very difficult to wake\n• Child is breathing rapidly or deeply (DKA sign)\n• Child has fruity or acetone-smelling breath\n• You are frightened — trust your instincts",
    keyPoint: "Tell emergency staff immediately: 'My child has Type 1 Diabetes and I am concerned about DKA.' Those words will get you seen faster.",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function EmergencyCard({ em, isOpen, onToggle }) {
  return (
    <div className={`sdr-emerg-card ${isOpen ? "open" : ""}`}
      style={{ "--em-color": em.color }}>
      <div className="sdr-emerg-header" onClick={onToggle}>
        <div className="sdr-emerg-left">
          <div className="sdr-emerg-emoji">{em.emoji}</div>
          <div>
            <div className="sdr-emerg-title">{em.title}</div>
            <div className="sdr-emerg-threshold">{em.threshold}</div>
          </div>
        </div>
        <div className="sdr-emerg-right">
          {em.callOOO && <span className="sdr-ooo-badge">000</span>}
          <span className="sdr-chevron">{isOpen ? "▲" : "▼"}</span>
        </div>
      </div>

      {isOpen && (
        <div className="sdr-emerg-body">
          {em.callOOO && (
            <div className="sdr-call-bar">
              🚨 Call 000 (Australia) · 111 (NZ) · 999 (UK) · 911 (US/Canada)
            </div>
          )}

          <div className="sdr-emerg-section">
            <div className="sdr-emerg-section-label">Symptoms to look for</div>
            <ul className="sdr-symptom-list">
              {em.symptoms.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div className="sdr-emerg-section">
            <div className="sdr-emerg-section-label">What to do — step by step</div>
            {em.steps.map(s => (
              <div key={s.step} className="sdr-step">
                <div className="sdr-step-num" style={{ background: em.color }}>{s.step}</div>
                <div>
                  <div className="sdr-step-action">{s.action}</div>
                  <div className="sdr-step-detail">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sdr-warning-box" style={{ borderColor: em.color }}>
            <span className="sdr-warning-icon">⚠️</span>
            <span>{em.warning}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SickSection({ sec, isOpen, onToggle }) {
  return (
    <div className={`sdr-sick-card ${isOpen ? "open" : ""}`}
      style={{ "--s-color": sec.color }}>
      <div className="sdr-sick-header" onClick={onToggle}>
        <div className="sdr-sick-emoji">{sec.emoji}</div>
        <div className="sdr-sick-titles">
          <div className="sdr-sick-title">{sec.title}</div>
          <div className="sdr-sick-subtitle">{sec.subtitle}</div>
        </div>
        <span className="sdr-chevron">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="sdr-sick-body">
          <div className="sdr-sick-content">
            {sec.content.split("\n").map((line, i) => (
              line.trim() === ""
                ? <br key={i} />
                : <p key={i} style={{ margin: "0 0 6px 0" }}>{line}</p>
            ))}
          </div>
          <div className="sdr-key-point">
            <span className="sdr-key-icon">💡</span>
            <span>{sec.keyPoint}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SickDayRules() {
  const [activeTab, setActiveTab] = useState("sick");
  const [openEmerg, setOpenEmerg] = useState("hypo");
  const [openSick, setOpenSick] = useState("rule1");

  return (
    <div>
      {/* Emergency banner */}
      <div className="sdr-emergency-banner">
        <div className="sdr-banner-icon">🚨</div>
        <div>
          <div className="sdr-banner-title">Medical emergency? Call 000 immediately.</div>
          <div className="sdr-banner-sub">Unconscious child · Seizure · Cannot breathe normally · DKA suspected</div>
        </div>
      </div>

      <div className="section-header">
        <h2>{activeTab === "sick" ? "🤒 Sick Day Rules" : "⚡ Emergency Guide"}</h2>
        <p>{activeTab === "sick"
          ? "What to do when your child with T1D is unwell. These rules could prevent a hospital admission."
          : "Step-by-step guidance for hypoglycaemia, severe hypos, and DKA. Save this page to your home screen."
        }</p>
      </div>

      {/* Tab toggle */}
      <div className="sdr-tabs">
        <button
          className={`sdr-tab ${activeTab === "sick" ? "active" : ""}`}
          onClick={() => setActiveTab("sick")}>
          🤒 Sick Day Rules
        </button>
        <button
          className={`sdr-tab ${activeTab === "emergency" ? "active" : ""}`}
          onClick={() => setActiveTab("emergency")}>
          ⚡ Emergency Guide
        </button>
      </div>

      {/* SICK DAY RULES */}
      {activeTab === "sick" && (
        <div>
          <div className="sdr-intro-box">
            <div className="sdr-intro-title">📋 The 7 Sick Day Rules</div>
            <p className="sdr-intro-text">Illness is one of the most challenging situations in T1D management. Stress hormones released during illness raise glucose unpredictably — and the rules change. Print this page and put it on your fridge.</p>
          </div>

          {SICK_SECTIONS.map(sec => (
            <SickSection
              key={sec.id}
              sec={sec}
              isOpen={openSick === sec.id}
              onToggle={() => setOpenSick(openSick === sec.id ? null : sec.id)}
            />
          ))}

          <div className="sdr-print-note">
            💡 Tip: Save or screenshot this page so you have it available when your child is unwell and you need it quickly.
          </div>
        </div>
      )}

      {/* EMERGENCY GUIDE */}
      {activeTab === "emergency" && (
        <div>
          <div className="sdr-intro-box" style={{ borderColor: COLORS.red, background: "#FFF5F5" }}>
            <div className="sdr-intro-title" style={{ color: COLORS.red }}>⚡ Tap each section to expand</div>
            <p className="sdr-intro-text">This guide covers the three most important emergencies in T1D. Bookmark this page — or save your diabetes team's after-hours number in your phone right now.</p>
          </div>

          {EMERGENCIES.map(em => (
            <EmergencyCard
              key={em.id}
              em={em}
              isOpen={openEmerg === em.id}
              onToggle={() => setOpenEmerg(openEmerg === em.id ? null : em.id)}
            />
          ))}

          {/* Quick reference numbers */}
          <div className="sdr-numbers-box">
            <div className="sdr-numbers-title">📞 Key numbers — save these now</div>
            <div className="sdr-numbers-grid">
              <div className="sdr-number-row"><span className="sdr-number-label">Australia emergency</span><span className="sdr-number-val">000</span></div>
              <div className="sdr-number-row"><span className="sdr-number-label">Diabetes Australia helpline</span><span className="sdr-number-val">1300 136 588</span></div>
              <div className="sdr-number-row"><span className="sdr-number-label">Your diabetes team</span><span className="sdr-number-val">Add yours →</span></div>
              <div className="sdr-number-row"><span className="sdr-number-label">After-hours hospital line</span><span className="sdr-number-val">Add yours →</span></div>
            </div>
          </div>

          <div className="sdr-print-note">
            💡 Screenshot the emergency guide and save it to your phone's photos — so it's accessible even without internet.
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="sdr-disclaimer">
        Educational resource only. This guide is for general information and does not replace the specific sick day plan provided by your diabetes care team. Always follow your team's personalised protocols. In an emergency, call 000.
      </div>
    </div>
  );
}
