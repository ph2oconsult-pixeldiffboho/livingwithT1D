import { useState } from "react";

const situations = [
  {
    id: "honeymoon-phase",
    tonight: "No immediate action needed. The honeymoon phase is a time to learn and prepare — not a time for concern. Use this period to build your understanding of blood glucose patterns, carb counting, and what full insulin management will look like when the time comes.",
    question: "We are in the honeymoon phase — what should we expect?",
    emoji: "🌱",
    tags: ["High glucose", "Variability"],
    reassurance: "The honeymoon phase is a normal and expected part of type 1 diabetes after diagnosis. If a doctor told you to 'enjoy it while it lasts' and that felt unsettling — that's completely understandable. This is your time to prepare, not to worry.",
    explanation: `**What is the honeymoon phase?**\n\nShortly after diagnosis, many children with type 1 diabetes enter a period called the honeymoon phase (also called partial remission). During this time, the immune system has damaged — but not yet fully destroyed — the insulin-producing beta cells in the pancreas.\n\nThe remaining cells recover slightly and produce small amounts of insulin again. This makes blood glucose easier to manage and insulin requirements lower than they will eventually be.\n\n**How long does it last?**\n\nThe honeymoon phase typically lasts weeks to months — occasionally up to a year or more. It is different for every child. There is no way to predict exactly when it will end.\n\nGradually, as the immune system continues its attack on the remaining beta cells, insulin production decreases and blood glucose becomes harder to manage. This is not a setback — it is the natural progression of the condition.\n\n**What causes it to end?**\n\nThe honeymoon phase ends as the immune system destroys the remaining beta cells. There is nothing you can do to speed this up — and nothing you have done to cause it. It is the natural progression of the condition, and it happens regardless of how well blood glucose is managed during the honeymoon period. Illness, growth spurts, and puberty can sometimes accelerate this process. There is nothing families can do to prevent it — and nothing they have done to cause it.\n\n**What to do during the honeymoon phase:**\n\nThis is the most valuable learning time you will have. Blood glucose is relatively stable, the urgency is lower, and there is space to build understanding.\n\n• Learn how insulin works — even if doses are small now\n• Understand carbohydrate counting\n• Get familiar with CGM patterns and what they mean\n• Build your sick day and emergency knowledge\n• Develop your relationship with your diabetes care team\n\n**The transition out of honeymoon:**\n\nYour diabetes care team will monitor insulin requirements over time. When the honeymoon ends, doses will increase. This is expected and manageable — especially if you have used this time to build knowledge.`,
    isNormal: true,
  },
  {
    id: "high-two-days",
    tonight: "Check ketones now if blood glucose is above 14 mmol/L. If ketones are negative and your child seems well, check again in 2 hours. Contact your diabetes care team in the morning — or sooner if ketones appear or your child becomes unwell.",
    question: "Child running high for two days",
    emoji: "📈",
    tags: ["High glucose", "Hyperglycaemia"],
    reassurance: "Running high for 1–3 days is very common and usually has a clear explanation.",
    explanation: `**What to do:**\nIf blood glucose is above 14 mmol/L consistently — check ketones. If ketones are negative and blood glucose is coming down with corrections, monitor closely and contact your diabetes care team within 24–48 hours if the pattern continues. If ketones are moderate or large, seek medical care promptly.\n\n**Most likely reasons:**\n\n🤒 **Illness or infection** — Even a minor cold or ear infection triggers stress hormones that raise blood glucose significantly. Check for other symptoms.\n\n📈 **Growth spurt** — Children's insulin needs can change rapidly during growth. A pattern of persistent highs over several days often signals that background insulin or mealtime doses need a small adjustment.\n\n😰 **Stress or disruption** — School exams, travel, emotional upset, change of routine — all can raise blood glucose for days.\n\n💉 **Insulin site issue** — If using a pump, check for blocked cannula, air in tubing, or a site that is absorbing poorly.`,
    isNormal: true,
  },
  {
    id: "overnight-spikes",
    tonight: "If your child is sleeping and seems well, check blood glucose once more before you sleep and set an alarm for 2–3 hours. Note the readings to show your diabetes care team — overnight patterns are easier to address with a few nights of data.",
    question: "Sudden overnight glucose spikes",
    emoji: "🌙",
    tags: ["Overnight", "High glucose", "Growth hormone"],
    reassurance: "Overnight blood glucose rises are extremely common in children and adolescents — and usually have a hormonal explanation.",
    explanation: `**What to do:**\nReview overnight CGM data for several nights to identify the pattern. Bring the data to your diabetes care team — adjusting background insulin is best done with professional guidance.\n\n**Most likely reasons:**\n\n🌙 **The Dawn Phenomenon** — Hormones are released in pulses during deep sleep, causing temporary insulin resistance. Blood glucose can rise significantly between 2 AM and 8 AM with no dietary cause.\n\n📉 **Rebound after a low** — If blood glucose dropped overnight (possibly without waking anyone), the body released emergency hormones to raise it rapidly. The result is a high reading in the morning. CGM overnight data can show if this occurred.\n\n🍕 **High-fat dinner** — High-fat meals slow carbohydrate absorption. Dinner that looked well-managed can produce a rise 3–5 hours later — while your child is asleep.`,
    isNormal: true,
  },
  {
    id: "exercise-spike",
    tonight: "At 14.7 mmol/L after sport, check ketones now. If ketones are negative and your child seems well, recheck blood glucose in 90 minutes — the spike from intense exercise often resolves on its own as stress hormones clear. If blood glucose is still above 14 mmol/L after 2 hours and not coming down, contact your diabetes care team. Do not give a correction dose without guidance — a hypo risk often follows as the exercise hormones fade.",
    question: "Blood glucose went UP after sport or exercise",
    emoji: "⚡",
    tags: ["Exercise", "High glucose"],
    reassurance: "A glucose rise after intense sport is one of the most common and least expected patterns in type 1 diabetes. It is not a management failure — it is physiology.",
    explanation: `**What to do first:**\n\nCheck ketones if blood glucose is above 14 mmol/L. If ketones are negative and your child seems well, the most likely explanation is an exercise-related spike that will resolve on its own.\n\n**Why this happens:**\n\nNot all exercise lowers blood glucose. Intense exercise — sprinting, competitive sport, interval training — triggers a stress response that causes the liver to release stored glucose into the bloodstream.\n\nIn a person without type 1 diabetes, the pancreas instantly releases extra insulin to balance this. In type 1 diabetes, no automatic response occurs. The result is a temporary glucose rise — sometimes 3–5 mmol/L — during or shortly after intense activity.\n\nTeam sports like football, basketball, and hockey involve a mixture of sustained running and short explosive sprints. This mixed pattern often causes glucose to spike at the end of a session.\n\n**What typically happens next:**\n\nThe spike usually resolves within 1–2 hours as the stress hormones clear. However — and this is important — the same exercise that caused a rise during play can cause a drop hours later overnight, as the muscles continue absorbing glucose to refill their stores.\n\n**This is why the overnight period after sport needs careful attention**, even if blood glucose looks high at bedtime.

**Important:** The same exercise that caused a rise tonight can cause a low overnight. If your child has just had sport, check the "Blood glucose went LOW after sport" situation as well — both can happen on the same night.`,
    isNormal: true,
  },
  {
    id: "post-exercise-crash",
    tonight: "If blood glucose is in range or trending low after sport — check again in 1–2 hours and offer a small carbohydrate and protein snack. Note: if blood glucose went HIGH during sport, it can still drop LOW overnight as the exercise effect continues. Check the 'Blood glucose went UP after sport' situation for more on this pattern. If blood glucose drops below 4.0 mmol/L, treat as a low. Set an overnight alarm — delayed drops can happen hours after activity. If blood glucose is currently high after sport, see the 'Blood glucose went UP after sport' situation instead.",
    question: "Glucose crashes after exercise",
    emoji: "⚽",
    tags: ["Exercise", "Low glucose", "Hypoglycaemia"],
    reassurance: "Post-exercise blood glucose drops — including delayed drops hours later — are one of the most well-understood and expected patterns in type 1 diabetes.",
    explanation: `**Why this happens:**\n\nDuring exercise, muscles become more sensitive to insulin, using blood glucose more efficiently. After exercise, the body continues to store glucose in the muscles — drawing glucose from the bloodstream for up to 12 hours.\n\nThis late post-exercise low blood glucose is particularly common:\n• 4–8 hours after endurance exercise\n• Overnight after afternoon or evening sport\n• More pronounced with longer or more intense activity\n\n**This is completely normal. It does not mean your child is doing anything wrong.**\n\n**Strategies to manage it:**\n• Check blood glucose before, during (if long activity), and after exercise\n• Offer a carb + protein snack after sport\n• Your diabetes care team may suggest adjusting the insulin dose for meals before sport\n• Set CGM low alerts at a higher threshold after sport\n• For pump users: consider adjusting background insulin (basal rate) — discuss with your diabetes care team\n\n**Important:** Each child responds differently. Work with your diabetes educator to develop a personalised sport protocol.`,
    isNormal: true,
  },
  {
    id: "morning-high",
    tonight: "No immediate action needed unless blood glucose is above 14 mmol/L — in which case check ketones. Note the readings over the next few mornings and bring them to your diabetes care team.",
    question: "Glucose always high in the morning",
    emoji: "🌅",
    tags: ["Morning", "High glucose", "Dawn phenomenon"],
    reassurance: "Waking up with higher glucose than bedtime is one of the most common and well-documented patterns in type 1 diabetes — especially in children.",
    explanation: `**The science:**\n\nThe human body releases hormones in the early morning hours to prepare for waking. These hormones cause temporary insulin resistance — meaning the same insulin works less effectively at 6 AM than at 6 PM.\n\nIn type 1 diabetes, this effect is not buffered by the pancreas and shows up clearly as elevated morning glucose.\n\n**Two different patterns — and different causes:**\n\n🌙 **Dawn phenomenon** — Glucose is in range until approximately 2–4 AM, then rises steadily. Caused by growth hormone. Very common in children and adolescents.\n\n📉 **Rebound high (sometimes called the Somogyi effect)** — Glucose drops in the early hours (sometimes causing sweating or restlessness), triggering a hormonal response that pushes blood glucose high by morning. Less common — CGM data overnight can distinguish this.\n\n**What to do:**\nReview overnight CGM data with your diabetes care team. Adjusting background insulin (basal) timing or dose often resolves morning highs — but these adjustments should be made with guidance.`,
    isNormal: true,
  },
  {
    id: "variable-readings",
    tonight: "No immediate action needed. Keep a note of today's readings, meals, and activity level. This context will help your diabetes care team identify the pattern. Check blood glucose before bed and overnight if you're concerned.",
    question: "Glucose varies a lot — same meal, different result",
    emoji: "🎢",
    tags: ["Variability", "Inconsistency"],
    reassurance: "Glucose variability — where the same meal produces different results on different days — is completely normal and expected in type 1 diabetes.",
    explanation: `**Why the same meal produces different results:**\n\nBlood glucose management is affected by dozens of variables simultaneously. On any given day:\n\n• The child's stress level affects insulin resistance\n• The level of recent physical activity changes insulin sensitivity\n• Illness (even mild) raises glucose\n• Hydration affects glucose concentration\n• Sleep quality affects insulin resistance\n• Hormonal fluctuations (particularly in adolescents)\n• Slight variation in injection or pump absorption site\n\n**This variability is not a failure of management. It is the nature of the condition.**\n\n**A helpful reframe:**\nRather than comparing today's result to yesterday's for the same meal, look at weekly averages and time-in-range percentages. These smooth out daily variability and give a much more accurate picture of overall management.\n\nNot every day can be perfect — and that is nobody's fault. Type 1 diabetes is genuinely unpredictable. The goal is understanding what's happening and feeling more confident over time.

**Target:** Most diabetes care teams aim for 70% or more time-in-range (3.9–10 mmol/L). On a good week, some days will be better than others — that is perfectly normal.`,
    isNormal: true,
  },
  {
    id: "insulin-resistance-puberty",
    tonight: "No immediate action needed tonight. If doses have already been increased and management is still difficult — that is expected during peak puberty, not a sign that you have reached the wrong dose. Bring a week of CGM data to your next diabetes care team appointment. Ask specifically about whether further background insulin (basal) adjustments are appropriate and whether a referral to an adolescent psychologist with chronic illness experience would help.",
    question: "Glucose much harder to manage since puberty started",
    emoji: "📊",
    tags: ["Puberty", "Insulin resistance", "Adolescent"],
    reassurance: "Puberty causes significant insulin resistance in all people — but it is especially pronounced and challenging in type 1 diabetes. If time in range has dropped and insulin needs have surged, you have not failed. Puberty has made management genuinely harder — for physiological reasons entirely outside your control.",
    explanation: `**Why puberty changes everything:**\n\nDuring puberty, the body produces large amounts of growth hormone — which reduces the effectiveness of insulin. This means children going through puberty with type 1 diabetes need significantly more insulin to achieve the same glucose control as a younger child.\n\nThis effect can be dramatic:\n• Insulin doses may need to increase by 30–50% during puberty\n• Time-in-range may temporarily decrease even with good management efforts\n• Overnight rises become more pronounced\n• The same meal may require more insulin than it did a year ago\n\n**What to do:**\nThis is one of the most important times to stay in close contact with your endocrinologist (your child's diabetes specialist). Insulin doses will likely need regular upward adjustment during puberty.\n\n**Emotional dimension:**\nFor adolescents, managing type 1 diabetes during puberty is genuinely hard. The body is working against their efforts. Patience, encouragement, and psychological support are particularly important during this period.`,
    isNormal: true,
  },
];

export default function IsThisNormal({ onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const tags = ["all", "High glucose", "Low glucose", "Overnight", "Exercise", "Puberty"];
  const filtered = filter === "all" ? situations : situations.filter(s => s.tags.includes(filter));

  if (selected) {
    return (
      <div className="module-detail">
        <button className="back-btn" onClick={() => setSelected(null)}>← Back to situations</button>

        {/* 1 — BIG reassurance — first thing seen */}
        <div className="itn-reassurance-hero">
          <div className="itn-reassurance-tick">{selected.isNormal ? "✅" : "⚠️"}</div>
          <div className="itn-reassurance-text">
            {selected.isNormal ? "Yes — this is normal and expected" : "Worth monitoring"}
          </div>
        </div>

        <h2 className="itn-question-title">{selected.question}</h2>

        <div className="itn-reassurance-detail">
          {selected.reassurance}
        </div>

        {/* 2 — What to do TONIGHT — before the science */}
        <div className="itn-tonight">
          <div className="itn-tonight-title">⏰ What to do right now</div>
          {selected.tonight ? (
            <p>{selected.tonight}</p>
          ) : (
            <p>Keep monitoring. Check blood glucose again in 1–2 hours. If the pattern continues or your child seems unwell, contact your diabetes care team — or go to emergency if you're genuinely frightened. Trust your instincts.</p>
          )}
        </div>

        {/* 3 — The science / explanation — after reassurance and action */}
        <div className="itn-explanation-label">Why this happens</div>
        <div className="detail-content">
          {selected.explanation.split("\n").map((line, i) => {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return <span key={i}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}<br /></span>;
          })}
        </div>

        <div className="results-footer" style={{ marginTop: 16 }}>
          This information is for educational reassurance only. If you are ever genuinely concerned about your child's blood glucose patterns, contact your diabetes care team. Trust your instincts as a parent.
        </div>

        {/* What next — don't leave a dead end */}
        <div className="itn-what-next">
          <div className="itn-what-next-title">What would you like to do next?</div>
          <div className="itn-what-next-btns">
            <button className="itn-next-btn" onClick={() => setSelected(null)}>
              ← See all situations
            </button>
            <button className="itn-next-btn itn-next-btn--primary" onClick={() => {
              setSelected(null);
              // Signal parent to navigate to explainer
              if (typeof onNavigate === 'function') onNavigate('explainer');
            }}>
              🔎 Explain my graph →
            </button>
          </div>
          <p className="itn-next-hint">Or tap a related situation below</p>
          <div className="itn-related">
            {situations
              .filter(s => s.id !== selected?.id)
              .filter(s => s.tags.some(t => selected?.tags?.includes(t)))
              .slice(0, 2)
              .map(s => (
                <button key={s.id} className="itn-related-btn" onClick={() => setSelected(s)}>
                  <span>{s.emoji}</span><span>{s.question}</span><span>→</span>
                </button>
              ))
            }
          </div>
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
          Most confusing glucose patterns have a simple explanation
        </div>
        <div style={{ fontSize: "0.9rem", color: "#4A6070", lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
          Understanding why something happened turns confusion into understanding. Select a situation below to find out what's likely going on.
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
