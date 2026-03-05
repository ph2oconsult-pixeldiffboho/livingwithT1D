import { useState } from "react";

const scenarios = [
  {
    id: "late-insulin",
    title: "What if insulin is given 10 minutes late?",
    emoji: "⏰",
    tags: ["Insulin timing"],
    response: `When rapid-acting insulin is given at the start of a meal (rather than 10–15 minutes before), food is digested and glucose enters the bloodstream before insulin reaches peak activity.\n\n**Likely glucose response:**\nGlucose rises sharply in the first 60–90 minutes after eating, then returns to range once insulin catches up — often 2–3 hours after the meal.\n\n**What this looks like on a CGM:**\nA steep rise followed by a slow return — sometimes called a "spike and drift" pattern.\n\n**Learning point:**\nFor rapid-acting insulins, a 10–15 minute pre-bolus (giving insulin before eating) typically produces a flatter post-meal glucose curve. Discuss optimal timing with your diabetes educator, as it varies by insulin type and individual.`,
    severity: "mild",
  },
  {
    id: "soccer-after-dinner",
    title: "What if the child plays soccer after dinner?",
    emoji: "⚽",
    tags: ["Exercise", "Evening activity"],
    response: `Post-dinner exercise is one of the most common causes of unexpected overnight lows in children with T1D.\n\n**During soccer (aerobic exercise):**\nMuscles absorb glucose directly without needing insulin. Glucose typically falls during and shortly after play.\n\n**After soccer (2–8 hours later):**\nThe body continues to replenish muscle glycogen stores through the night — drawing glucose from the bloodstream. This creates an extended window of hypoglycaemia risk, often peaking in the early hours.\n\n**What many families do:**\n• Reduce the dinner insulin dose on sport nights (discuss with your care team)\n• Offer a small protein/carb snack before bed\n• Set a CGM alert at a higher threshold overnight after sport\n\n**Learning point:**\nEach sport affects glucose differently. Soccer (mixed aerobic and sprint) typically causes falls. Strength-based activity can sometimes cause rises.`,
    severity: "important",
  },
  {
    id: "high-fat-meal",
    title: "What if the meal contains high-fat foods?",
    emoji: "🍕",
    tags: ["Food", "Carb absorption"],
    response: `High-fat meals are one of the most misunderstood causes of unexpected post-meal glucose spikes.\n\n**Why fat matters:**\nFat dramatically slows stomach emptying. A slice of pizza with 40g of carbs will absorb very differently to 40g of carbs from fruit juice.\n\n**Typical glucose response with high-fat meals:**\n• Normal or slightly elevated glucose in the first 1–2 hours\n• Prolonged glucose rise 2–5 hours after eating, often catching families off guard overnight\n\n**Common high-fat examples:**\nPizza, cheeseburgers, pasta with cream, stir-fry with oil, fish and chips\n\n**What many families do:**\nSome use a "split bolus" — giving part of the insulin dose before eating and the remainder 1–2 hours later — to better match the extended carb absorption. This is an advanced technique to discuss with your endocrinologist.\n\n**Learning point:**\nCarb counting alone is not enough for high-fat meals. The fat content changes when those carbs absorb.`,
    severity: "important",
  },
  {
    id: "sick-day",
    title: "What happens on a sick day?",
    emoji: "🤒",
    tags: ["Illness", "Sick day rules"],
    response: `Illness is one of the most important situations to understand in T1D management, and one of the most anxiety-provoking for parents.\n\n**Why illness raises glucose:**\nThe body's immune response releases stress hormones (cortisol, glucagon, adrenaline). These hormones cause the liver to release stored glucose AND make cells resistant to insulin — often simultaneously.\n\n**What to expect:**\nGlucose can rise significantly even if the child is not eating. This is counterintuitive and surprises many families.\n\n**Critical rules on sick days:**\n• Never stop insulin during illness — even if the child is not eating\n• Check glucose more frequently (every 2 hours if unwell)\n• Check ketones if glucose is persistently above 14 mmol/L\n• Maintain hydration — dehydration worsens hyperglycaemia\n• Contact your diabetes team early if unsure\n\n**When to seek emergency help:**\nIf glucose is above 15 mmol/L with moderate/large ketones, vomiting, confusion, or rapid breathing — seek urgent medical care. This can indicate DKA (diabetic ketoacidosis), a medical emergency.\n\n**Learning point:**\nSick day management is one of the most important skills to master. Ask your diabetes team for a personalised sick day plan.`,
    severity: "critical",
  },
  {
    id: "birthday-party",
    title: "What about birthday cake and sweets?",
    emoji: "🎂",
    tags: ["Food", "Social situations"],
    response: `Birthday parties are a common source of anxiety for parents — but with the right approach, children with T1D can fully participate.\n\n**The good news:**\nNo food is completely off limits with T1D. The goal is learning to count carbs and adjust insulin accordingly.\n\n**Typical birthday party challenge:**\nUnpredictable food timing, high-sugar and high-fat treats (cake, ice cream, lollies), excitement and physical activity all occurring at once.\n\n**Practical approaches:**\n• Estimate carbs as best you can and dose accordingly\n• Check glucose before eating and 90 minutes after\n• Allow the child to participate fully — social inclusion matters enormously for wellbeing\n• Keep fast-acting sugar available in case of a low\n• Accept that some variation is normal — one imperfect day is not harmful\n\n**For school parties:**\nPrepare the teacher in advance. Send a note with carb estimates for common party foods.\n\n**Learning point:**\nPerfect glucose control at a birthday party is not the goal. Participation and joy are the goal. Aim for 'good enough' and adjust from what you learn.`,
    severity: "mild",
  },
  {
    id: "sleepover",
    title: "What about overnight sleepovers?",
    emoji: "🌙",
    tags: ["Sleep", "Social situations"],
    response: `Sleepovers are one of the most anxiety-provoking situations for T1D parents — but with preparation, they're absolutely achievable.\n\n**Key glucose risks overnight:**\n• Delayed hypoglycaemia from afternoon/evening activity\n• Missed alarms from CGM alerts\n• Different food and eating schedule disrupting usual patterns\n• Less parental oversight for corrections\n\n**Preparation checklist:**\n• Speak with the host parents beforehand — share your emergency contact and a simple action guide\n• Ensure CGM is shared to your phone so you can monitor remotely\n• Set CGM alerts at a higher threshold than usual (e.g., alert at 6 mmol/L instead of 5)\n• Prepare a small kit for the child to bring: fast-acting sugar, glucose meter, spare supplies\n• Give the child a clear, simple instruction: "If your CGM alarms, wake up and call mum/dad"\n\n**For younger children:**\nConsider a "parent on call" arrangement for the first few sleepovers, where you're available to come quickly if needed.\n\n**Learning point:**\nSleepovers become easier with experience. Each one builds your child's confidence and independence.`,
    severity: "important",
  },
];

const severityConfig = {
  mild: { label: "Low complexity", color: "#56C596", bg: "#EEF8F4" },
  important: { label: "Important to understand", color: "#FFD166", bg: "#FFF8E7" },
  critical: { label: "Critical knowledge", color: "#F46036", bg: "#FFF0EE" },
};

export default function ScenarioSimulator() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div className="section-header">
        <h2>🎮 What Happens If…</h2>
        <p>Simulate common T1D situations before they happen. Build confidence by understanding likely glucose responses in advance.</p>
      </div>

      <div className="tool-disclaimer">
        These simulations show <strong>common glucose responses for educational purposes only</strong>. They do not provide dosing advice and do not replace your personalised diabetes management plan. Always consult your diabetes care team.
      </div>

      {!selected ? (
        <div className="scenario-grid">
          {scenarios.map(s => {
            const sev = severityConfig[s.severity];
            return (
              <div key={s.id} className="scenario-card" onClick={() => setSelected(s)}
                style={{ "--sev-color": sev.color, "--sev-bg": sev.bg }}>
                <div className="scenario-emoji">{s.emoji}</div>
                <div className="scenario-title">{s.title}</div>
                <div className="scenario-tags">
                  {s.tags.map(t => <span key={t} className="scenario-tag">{t}</span>)}
                </div>
                <div className="scenario-severity" style={{ color: sev.color, background: sev.bg }}>
                  {sev.label}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="scenario-detail">
          <button className="back-btn" onClick={() => setSelected(null)}>← Back to scenarios</button>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{selected.emoji}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: 8, color: "#1A3A4A" }}>{selected.title}</h2>
          <div className="scenario-severity-large" style={{ color: severityConfig[selected.severity].color, background: severityConfig[selected.severity].bg }}>
            {severityConfig[selected.severity].label}
          </div>
          <div className="detail-content" style={{ marginTop: 24 }}>
            {selected.response.split("\n").map((line, i) => {
              const parts = line.split(/\*\*(.*?)\*\*/g);
              return <span key={i}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}<br /></span>;
            })}
          </div>
          <div className="results-footer" style={{ marginTop: 24 }}>
            This is a general educational simulation. Your child's glucose response may differ based on their insulin type, dose, timing, and individual physiology. Always discuss patterns with your diabetes care team.
          </div>
        </div>
      )}
    </div>
  );
}
