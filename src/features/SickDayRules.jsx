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
    title: "Low Blood Glucose (Hypoglycaemia)",
    threshold: "Below 4.0 mmol/L",
    color: COLORS.coral,
    urgency: "Act immediately",
    symptoms: ["Shakiness or trembling", "Sweating, pale skin", "Hunger, irritability", "Difficulty concentrating or glazed look", "Confusion or slurred speech"],
    steps: [
      { step: "1", action: "Give 15g fast-acting carbohydrates", detail: "4 glucose tablets · 150ml fruit juice · 6–7 jellybeans · 1 small tube glucose gel" },
      { step: "2", action: "Wait 15 minutes", detail: "Do not give more food yet — give the glucose time to absorb" },
      { step: "3", action: "Recheck blood glucose", detail: "If still below 4.0 mmol/L — repeat step 1" },
      { step: "4", action: "Once above 4.0 mmol/L", detail: "Give a small snack with protein if the next meal is more than 30 minutes away (e.g. crackers and cheese)" },
    ],
    warning: "NEVER give food or drink to a child who is unconscious or unable to swallow safely. Use glucagon instead — see below.",
    callOOO: false,
  },
  {
    id: "severe-hypo",
    emoji: "🚨",
    title: "Severe Low — Child Cannot Swallow",
    threshold: "Unconscious, seizing, or unable to swallow",
    color: COLORS.red,
    urgency: "Call 000 immediately",
    symptoms: ["Unconscious or unresponsive", "Seizure or convulsions", "Unable to swallow safely", "Treatment with food or drink has not worked"],
    steps: [
      { step: "1", action: "Call 000 now", detail: "Tell them your child has type 1 diabetes and is unconscious or seizing due to low blood glucose" },
      { step: "2", action: "Use glucagon", detail: "Baqsimi (nasal): insert tip into one nostril and press plunger. GlucaGen (injection): follow kit instructions." },
      { step: "3", action: "Place on their side", detail: "Recovery position — in case of vomiting" },
      { step: "4", action: "Stay with your child", detail: "Do not leave them alone. Glucagon should raise blood glucose within 10–15 minutes" },
    ],
    warning: "After glucagon is used, always seek emergency medical assessment — even if your child recovers quickly.",
    callOOO: true,
  },
  {
    id: "dka",
    emoji: "⚠️",
    title: "Diabetic Ketoacidosis (DKA)",
    threshold: "High blood glucose + ketones + vomiting",
    color: COLORS.red,
    urgency: "Go to emergency now",
    whatIsDka: "DKA happens when the body cannot use glucose for energy due to a lack of insulin. Instead, it breaks down fat, producing ketones. Ketones build up in the blood and can become life-threatening if not treated quickly.",
    symptoms: ["Blood glucose persistently above 14–15 mmol/L", "Moderate or large ketones on meter", "Vomiting or abdominal pain", "Deep, rapid breathing", "Fruity or sweet smell on breath", "Extreme tiredness or confusion"],
    steps: [
      { step: "1", action: "Go to the emergency department now", detail: "Do not wait to see if it improves. DKA can develop rapidly and is life-threatening." },
      { step: "2", action: "Do NOT stop insulin", detail: "Even if your child is vomiting and not eating — insulin must continue. Never stop insulin without medical guidance." },
      { step: "3", action: "Check ketones", detail: "Any time blood glucose is above 14 mmol/L for more than 2 hours — check ketones. Moderate or large ketones = urgent care." },
      { step: "4", action: "Bring all medications", detail: "Bring all insulin, pump equipment, and a list of current doses to the emergency department" },
    ],
    warning: "When in doubt — go. Early DKA is easier to treat than advanced DKA. Do not wait for a callback from your diabetes care team if your child is vomiting.",
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
    content: "Even if your child is not eating, insulin must continue. When the body is fighting illness, it releases stress hormones that raise blood glucose — often significantly. The need for insulin typically increases during illness.\n\nNever stop or reduce insulin without guidance from your diabetes care team. If you are unsure what to do, call your team.",
    keyPoint: "If your child cannot eat: contact your diabetes care team for guidance on adjusting doses during illness. Never make significant changes to insulin without speaking to your team first.",
  },
  {
    id: "rule2",
    emoji: "📊",
    color: COLORS.coral,
    title: "Check blood glucose more often",
    subtitle: "Every 2–3 hours during illness",
    content: "Illness causes unpredictable blood glucose swings. Normal checking intervals are not enough when your child is unwell.\n\nDuring illness, check blood glucose:\n• Every 2–3 hours during the day\n• Every 3–4 hours overnight (set an alarm)\n• Before and after any vomiting\n• Any time your child seems more unwell than expected",
    keyPoint: "If you use a CGM, tighten your alerts during illness. Consider setting your low alert to 5.0 mmol/L and your high alert to 12–13 mmol/L.",
  },
  {
    id: "rule3",
    emoji: "🧪",
    color: COLORS.amber,
    title: "Check ketones",
    subtitle: "Any blood glucose above 14 mmol/L for 2+ hours",
    content: "Ketones form when the body breaks down fat for energy, as it cannot use glucose due to the lack of insulin. This happens faster during illness.\n\nCheck ketones:\n• Any time blood glucose is above 14 mmol/L for more than 2 hours\n• Any time your child is vomiting\n• Any time your child has symptoms of DKA (see Emergency tab)\n• First thing in the morning when unwell\n\nKetone levels:\n• Below 0.6 mmol/L — monitor closely\n• 0.6–1.5 mmol/L — contact your diabetes care team now\n• Above 1.5 mmol/L — go to the emergency department",
    keyPoint: "If ketones are above 1.5 mmol/L, go to the emergency department. Do not wait to see if they come down on their own.",
  },
  {
    id: "rule4",
    emoji: "💧",
    color: COLORS.mint,
    title: "Keep fluids up",
    subtitle: "Especially when blood glucose is high",
    content: "High blood glucose causes fluid loss through increased urination. Combined with illness — fever, vomiting, reduced intake — dehydration can develop quickly in children.\n\nEncourage fluids:\n• Small, frequent sips rather than large amounts\n• If blood glucose is high: water is best\n• If blood glucose is low — treat as a hypo first, then encourage fluids\n• If vomiting: ice chips or very small sips every few minutes",
    keyPoint: "If your child cannot keep any fluids down for more than 4–6 hours, or shows signs of dehydration (dry mouth, no tears, no urination), seek medical care.",
  },
  {
    id: "rule5",
    emoji: "🍞",
    color: COLORS.sunshine,
    title: "Eating during illness",
    subtitle: "When appetite is poor",
    content: "When appetite is poor during illness, try to encourage small amounts of food to maintain blood glucose stability. Children still need to eat — even when blood glucose is high.\n\nIf blood glucose is in range or low, easy options include:\n• Plain crackers or dry toast\n• Banana\n• Plain rice or pasta\n• Yoghurt (plain)\n\nIf blood glucose is high, your child's insulin doses may need to be adjusted to account for food eaten — speak to your diabetes care team.",
    keyPoint: "Never withhold food from a child who is unwell. Contact your diabetes care team for guidance on managing food and insulin together during illness.",
  },
  {
    id: "rule6",
    emoji: "🩺",
    color: COLORS.lavender,
    title: "When to call your diabetes care team",
    subtitle: "Call early — do not wait",
    content: "Many families wait too long before calling. Your diabetes care team would rather hear from you early than see your child in emergency.\n\nCall your diabetes care team (or after-hours line) if:\n• Blood glucose above 14 mmol/L for more than 2 hours and not coming down\n• Any ketones above trace\n• Your child is vomiting and cannot keep fluids or insulin down\n• Your child seems increasingly unwell or confused\n• You are unsure what to do",
    keyPoint: "Save your diabetes care team's after-hours number in your phone now — before you need it.",
  },
  {
    id: "rule7",
    emoji: "🚑",
    color: COLORS.red,
    title: "Go to the hospital if…",
    subtitle: "Do not wait for a callback",
    content: "Go directly to your nearest emergency department — without waiting for a callback from your team — if:\n\n• Moderate or large ketones on meter\n• Your child is vomiting continuously and cannot keep anything down\n• Blood glucose above 15 mmol/L and ketones present\n• Your child is confused, drowsy, or very difficult to wake\n• Your child is breathing rapidly or deeply\n• Your child has a fruity or sweet smell on their breath\n• You are frightened — trust your instincts",
    keyPoint: "Tell emergency staff immediately: 'My child has type 1 diabetes and I am concerned about DKA.' Those words will get you seen faster.",
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

          {em.whatIsDka && (
            <div className="sdr-dka-explainer">
              <div className="sdr-dka-label">What is DKA?</div>
              <p>{em.whatIsDka}</p>
            </div>
          )}

          <div className="sdr-emerg-section">
            <div className="sdr-emerg-section-label">Signs and symptoms</div>
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
          ? "What to do when your child with type 1 diabetes is unwell. These rules could prevent a hospital admission."
          : "Step-by-step guidance for low blood glucose, severe lows, and DKA. Save this page to your home screen."
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
            <p className="sdr-intro-text">Illness is one of the most challenging situations in type 1 diabetes management. Stress hormones released during illness raise blood glucose unpredictably — and the rules change. Print this page and put it on your fridge.</p>
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
            <p className="sdr-intro-text">This guide covers the three most important emergencies in type 1 diabetes. Bookmark this page — or save your diabetes care team's after-hours number in your phone right now.</p>
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
              <div className="sdr-number-row"><span className="sdr-number-label">Your diabetes care team</span><span className="sdr-number-val">Add yours →</span></div>
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
