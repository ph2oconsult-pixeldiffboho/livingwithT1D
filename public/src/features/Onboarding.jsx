import { useState } from "react";

const COLORS = { ocean: "#2E86AB", coral: "#F46036", mint: "#56C596", sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A" };

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ timeSince: "", childAge: "", treatment: "" });

  const questions = [
    {
      key: "timeSince",
      question: "How long since diagnosis?",
      emoji: "📅",
      options: [
        { value: "new",    label: "Just diagnosed",      sub: "Less than 1 month" },
        { value: "recent", label: "Recently diagnosed",  sub: "1–6 months" },
        { value: "year",   label: "Within the past year", sub: "6–12 months" },
        { value: "years",  label: "More than a year",    sub: "We're finding our rhythm" },
      ],
    },
    {
      key: "childAge",
      question: "How old is your child?",
      emoji: "🧒",
      options: [
        { value: "under5",  label: "Under 5",   sub: "Toddler / preschool" },
        { value: "5to9",    label: "5 – 9",     sub: "Primary school" },
        { value: "10to14",  label: "10 – 14",   sub: "Upper primary / early secondary" },
        { value: "15plus",  label: "15 or older", sub: "Secondary school / teen" },
      ],
    },
    {
      key: "treatment",
      question: "How does your child receive insulin?",
      emoji: "💉",
      options: [
        { value: "injections", label: "Injections (MDI)", sub: "Multiple daily injections with pen or syringe" },
        { value: "pump",       label: "Insulin pump",     sub: "Continuous infusion via pump" },
        { value: "loop",       label: "Closed-loop / hybrid", sub: "Automated insulin delivery system" },
        { value: "unsure",     label: "Not sure yet",     sub: "We're still learning" },
      ],
    },
  ];

  const current = questions[step];
  const isLast  = step === questions.length - 1;
  const canNext  = !!profile[current.key];

  const select = (val) => setProfile(p => ({ ...p, [current.key]: val }));

  const next = () => {
    if (isLast) onComplete(profile);
    else setStep(s => s + 1);
  };

  return (
    <div className="onboarding-wrap">
      <div className="onboarding-card">

        {/* Top row: progress dots + skip X */}
        <div className="ob-top-row">
          <div className="ob-progress">
            {questions.map((_, i) => (
              <div key={i} className={`ob-dot ${i <= step ? "filled" : ""}`} />
            ))}
          </div>
          <button className="ob-skip-x" onClick={() => onComplete(null)} title="Skip to app">
            Skip ✕
          </button>
        </div>

        <div className="ob-emoji">{current.emoji}</div>
        <h2 className="ob-question">{current.question}</h2>
        <p className="ob-hint">This helps us personalise the content for your family.</p>

        <div className="ob-options">
          {current.options.map(opt => (
            <button
              key={opt.value}
              className={`ob-option ${profile[current.key] === opt.value ? "active" : ""}`}
              onClick={() => select(opt.value)}
            >
              <div className="ob-option-label">{opt.label}</div>
              <div className="ob-option-sub">{opt.sub}</div>
            </button>
          ))}
        </div>

        <button className="ob-next-btn" disabled={!canNext} onClick={next}>
          {isLast ? "Take me to the app →" : "Next →"}
        </button>

        <button className="ob-skip-link" onClick={() => onComplete(null)}>
          Skip — take me straight to the app
        </button>

      </div>
    </div>
  );
}
