import { useState } from "react";

const situations = [
  {
    id: "high-two-days",
    question: "Child running high for two days",
    emoji: "📈",
    tags: ["High glucose", "Hyperglycaemia"],
    reassurance: "Running high for 1–3 days is very common and usually has a clear explanation.",
    explanation: `**Most likely reasons:**\n\n🤒 **Illness or infection** — Even a minor cold or ear infection triggers stress hormones that raise glucose significantly. Check for other symptoms.\n\n📈 **Growth spurt** — Children's insulin needs can change rapidly during growth. A pattern of persistent highs over several days often signals that basal or mealtime doses need a small adjustment.\n\n😰 **Stress or disruption** — School exams, travel, emotional upset, change of routine — all can raise glucose for days.\n\n💉 **Insulin site issue** — If using a pump, check for blocked cannula, air in tubing, or a 'tired' infusion site that is absorbing poorly.\n\n**What to do:**\nIf glucose is above 14 mmol/L consistently — check ketones. If ketones are negative and glucose is coming down with corrections, monitor closely and contact your diabetes team within 24–48 hours if the pattern continues. If ketones are moderate/large, seek medical care promptly.`,
    isNormal: true,
  },
  {
    id: "overnight-spikes",
    question: "Sudden overnight glucose spikes",
    emoji: "🌙",
    tags: ["Overnight", "High glucose", "Growth hormone"],
    reassurance: "Overnight glucose rises are extremely common in children and adolescents — and usually have a hormonal explanation.",
    explanation: `**Most likely reasons:**\n\n🌙 **The Dawn Phenomenon** — Growth hormone is released in pulses during deep sleep, causing temporary insulin resistance. Glucose can rise significantly between 2 AM and 8 AM with no dietary cause.\n\n📉 **Rebound after a low** — If glucose dropped overnight (possibly without waking anyone), the body released emergency hormones (glucagon, adrenaline) to raise glucose rapidly. The result is a high reading in the morning. CGM overnight data can show if this occurred.\n\n🍕 **High-fat dinner** — As discussed elsewhere, high-fat meals slow carb absorption. Dinner that looked well-managed can produce a rise 3–5 hours later — while you're asleep.\n\n**What to do:**\nReview overnight CGM data for several nights to identify the pattern. Bring the data to your diabetes team — overnight basal adjustments are best made with professional guidance.`,
    isNormal: true,
  },
  {
    id: "post-exercise-crash",
    question: "Glucose crashes after exercise",
    emoji: "⚽",
    tags: ["Exercise", "Low glucose", "Hypoglycaemia"],
    reassurance: "Post-exercise glucose drops — including delayed drops hours later — are one of the most well-understood and expected patterns in T1D.",
    explanation: `**Why this happens:**\n\nDuring aerobic exercise, muscles absorb glucose directly without needing insulin. After exercise, the body continues to replenish muscle glycogen stores — drawing glucose from the bloodstream for up to 12 hours.\n\nThis 'late post-exercise hypoglycaemia' is particularly common:\n• 4–8 hours after endurance exercise\n• Overnight after afternoon or evening sport\n• More pronounced with longer or more intense activity\n\n**This is completely normal. It does not mean your child is doing anything wrong.**\n\n**Strategies to manage it:**\n• Check glucose before, during (if long activity), and after exercise\n• Offer a carb + protein snack after sport\n• Reduce the insulin dose for the meal before sport (discuss with team)\n• Set CGM low alerts at a higher threshold on sport nights\n• For pump users: consider a temporary reduced basal rate — discuss with your team\n\n**Important:** Each child responds differently. Work with your diabetes educator to develop a personalised sport protocol.`,
    isNormal: true,
  },
  {
    id: "morning-high",
    question: "Glucose always high in the morning",
    emoji: "🌅",
    tags: ["Morning", "High glucose", "Dawn phenomenon"],
    reassurance: "Waking up with higher glucose than bedtime is one of the most common and well-documented patterns in T1D — especially in children.",
    explanation: `**The science:**\n\nThe human body releases growth hormone and cortisol in the early morning hours to prepare for waking. These hormones cause temporary insulin resistance — meaning the same insulin works less effectively at 6 AM than at 6 PM.\n\nIn T1D, this effect is not buffered by the pancreas and shows up clearly as elevated morning glucose.\n\n**Two different patterns — and different causes:**\n\n🌙 **Dawn phenomenon** — Glucose is in range until approximately 3–4 AM, then rises steadily. Caused by growth hormone. Very common in children and adolescents.\n\n📉 **Somogyi effect** — Glucose drops in the early hours (sometimes causing sweating or restlessness), triggering a hormonal response that pushes glucose high by morning. Less common — CGM data overnight can distinguish this.\n\n**What to do:**\nReview overnight CGM data with your diabetes team. Adjusting basal insulin timing or dose often resolves morning highs — but these adjustments should be made with guidance.`,
    isNormal: true,
  },
  {
    id: "variable-readings",
    question: "Glucose varies a lot — same meal, different result",
    emoji: "🎢",
    tags: ["Variability", "Inconsistency"],
    reassurance: "Glucose variability — where the same meal produces different results on different days — is completely normal and expected in T1D.",
    explanation: `**Why the same meal produces different results:**\n\nBlood glucose management is affected by dozens of variables simultaneously. On any given day:\n\n• The child's stress level affects insulin resistance\n• The level of recent physical activity changes insulin sensitivity\n• Illness (even mild) raises glucose\n• Hydration affects glucose concentration\n• Sleep quality affects insulin resistance\n• Hormonal fluctuations (particularly in adolescents)\n• Slight variation in injection or pump absorption site\n\n**This variability is not a failure of management. It is the nature of the condition.**\n\n**A helpful reframe:**\nRather than comparing today's result to yesterday's for the same meal, look at weekly averages and time-in-range percentages. These smooth out daily variability and give a much more accurate picture of overall management.\n\n**Target:** Most diabetes teams aim for 70% or more time-in-range (70–180 mg/dL or 3.9–10 mmol/L). On a good week, some days will be better than others — that is perfectly normal.`,
    isNormal: true,
  },
  {
    id: "insulin-resistance-puberty",
    question: "Glucose much harder to manage since puberty started",
    emoji: "📊",
    tags: ["Puberty", "Insulin resistance", "Adolescent"],
    reassurance: "Puberty causes significant insulin resistance in all people — but it is especially pronounced and challenging in T1D. This is not your child's fault and it is not a management failure.",
    explanation: `**Why puberty changes everything:**\n\nDuring puberty, the body produces large amounts of growth hormone — which directly antagonises (blocks) insulin. This means pubescent children with T1D need significantly more insulin to achieve the same glucose control as a younger child.\n\nThis effect can be dramatic:\n• Insulin doses may need to increase by 30–50% during puberty\n• Time-in-range may temporarily decrease even with good management efforts\n• Overnight rises become more pronounced\n• The same meal may require more insulin than it did a year ago\n\n**What to do:**\nThis is one of the most important times to stay in close contact with your endocrinologist. Insulin doses will likely need regular upward adjustment during puberty.\n\n**Emotional dimension:**\nFor adolescents, managing T1D during puberty is genuinely hard. The body is working against their efforts. Patience, encouragement, and psychological support are particularly important during this period.`,
    isNormal: true,
  },
];

export default function IsThisNormal() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const tags = ["all", "High glucose", "Low glucose", "Overnight", "Exercise", "Puberty"];
  const filtered = filter === "all" ? situations : situations.filter(s => s.tags.includes(filter));

  if (selected) {
    return (
      <div className="module-detail">
        <button className="back-btn" onClick={() => setSelected(null)}>← Back to situations</button>
        <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{selected.emoji}</div>

        <div className="normal-badge">
          {selected.isNormal ? "✅ Yes — this is normal and expected" : "⚠️ Worth monitoring"}
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#1A3A4A", margin: "16px 0 8px" }}>
          {selected.question}
        </h2>

        <div style={{ background: "#EEF8F4", borderRadius: 14, padding: "16px 20px", marginBottom: 24, border: "1px solid #56C596" }}>
          <div style={{ fontWeight: 700, color: "#1A3A4A", fontSize: "0.95rem", lineHeight: 1.5 }}>{selected.reassurance}</div>
        </div>

        <div className="detail-content">
          {selected.explanation.split("\n").map((line, i) => {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return <span key={i}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}<br /></span>;
          })}
        </div>

        <div className="results-footer" style={{ marginTop: 24 }}>
          This information is for educational reassurance only. If you are ever genuinely concerned about your child's glucose patterns, contact your diabetes care team. Trust your instincts as a parent.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2>🤔 Is This Normal?</h2>
        <p>Parents constantly worry that something is wrong. Most of the time, there's a clear explanation. Find yours here.</p>
      </div>

      <div style={{ background: "linear-gradient(135deg, #EEF8F4, #E8F4FD)", borderRadius: 20, padding: "24px", marginBottom: 28, textAlign: "center" }}>
        <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>😮‍💨</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: "#1A3A4A", marginBottom: 8 }}>
          Most "alarming" glucose patterns have a simple explanation
        </div>
        <div style={{ fontSize: "0.9rem", color: "#4A6070", lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
          Understanding why something happened turns fear into knowledge. Select a situation below to find out what's likely going on.
        </div>
      </div>

      <div className="filter-row">
        {tags.map(t => (
          <button key={t} className={`filter-btn ${filter === t ? "active" : ""}`} onClick={() => setFilter(t)}>{t}</button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {filtered.map(s => (
          <div key={s.id} className="normal-card" onClick={() => setSelected(s)}>
            <div style={{ fontSize: "1.8rem", flexShrink: 0 }}>{s.emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="normal-question">{s.question}</div>
              <div className="normal-tags">
                {s.tags.map(t => <span key={t} className="scenario-tag">{t}</span>)}
              </div>
            </div>
            <div className="normal-badge-small">✅ Normal</div>
            <span style={{ color: "#2E86AB", fontSize: "1.2rem" }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}
