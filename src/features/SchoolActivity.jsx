import { useState } from "react";

const COLORS = { ocean: "#2E86AB", coral: "#F46036", mint: "#56C596", sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A" };

const situations = [
  {
    id: "school-lunch",
    title: "School Lunches",
    emoji: "🥪",
    color: COLORS.ocean,
    category: "School",
    intro: "Estimating carbs quickly for common school lunch items.",
    guide: `Quick carb reference for common school lunch items:\n\n**Sandwiches & Wraps:**\n• 2 slices white/wholemeal bread: 25–30g carbs\n• 1 large wrap: 30–35g carbs\n• 1 bread roll: 25–30g carbs\n\n**Fillings (add carbs for these):**\n• Vegemite/butter/cheese: 0g extra carbs\n• Jam or honey (1 tbsp): 15g carbs\n• Fruit chutney (1 tbsp): 10g carbs\n\n**Common sides:**\n• Small bag of chips/crackers: 15–20g carbs\n• 1 tub of yoghurt: 15–20g carbs\n• 1 piece of fruit (apple, banana, orange): 15–25g carbs\n• 1 muesli bar: 20–30g carbs\n• 1 small fruit juice box: 20–25g carbs\n\n**Quick tip for parents:**\nPre-loading favourite lunch combinations into your CGM app or insulin calculator means your child just needs to tap — not calculate — at school. This dramatically reduces embarrassment and friction.`,
    tip: "Pre-calculate your child's 3–4 most common lunches and save them in your carb counting app.",
  },
  {
    id: "birthday-party",
    title: "Birthday Parties",
    emoji: "🎂",
    color: COLORS.coral,
    category: "Social",
    intro: "Managing cake, sweets, and excitement — with confidence.",
    guide: `Birthday parties involve three simultaneous glucose challenges:\n1. High-sugar foods\n2. High-fat foods (cake, ice cream)\n3. Physical excitement and activity\n\n**Quick carb reference:**\n• 1 slice of birthday cake (average): 40–55g carbs\n• 1 scoop of ice cream: 15g carbs\n• Small bag of lollies: 25–30g carbs\n• 1 small party pie: 10–15g carbs\n• Chips/crackers (small bowl): 20–25g carbs\n• 1 juice box: 20–25g carbs\n\n**Practical approach:**\n✅ Check glucose before arriving\n✅ Estimate carbs for the meal or snacks and dose as normal\n✅ Check again 90 minutes after eating\n✅ Keep fast-acting sugar in your child's bag or with you\n✅ Expect some variation — one party day does not matter long-term\n\n**The most important thing:**\nYour child should participate fully. Diabetes should not be the reason they miss out. One imperfect glucose day is infinitely better than the social exclusion of not attending or not eating the cake.\n\n**For parents who are anxious:**\nFor the first few parties, consider staying nearby so you can monitor the CGM app remotely without hovering.`,
    tip: "Let your child eat the cake. One party doesn't define their health — but feeling included defines their confidence.",
  },
  {
    id: "sleepover",
    title: "Sleepovers",
    emoji: "🌙",
    color: COLORS.lavender,
    category: "Social",
    intro: "Preparation that makes sleepovers achievable and anxiety-free.",
    guide: `Sleepovers are very achievable with good preparation. Many T1D children have regular sleepovers from age 8 or 9 onwards.\n\n**Before the sleepover:**\n✅ Call or meet with the host parent — share a simple one-page guide\n✅ Make sure CGM is sharing to your phone so you can monitor remotely\n✅ Set CGM low alert at a higher threshold than usual (e.g., 5.5 mmol/L)\n✅ Pack a labelled kit: fast-acting sugar, spare supplies, contact card\n✅ Give your child a simple instruction: "If your CGM alarms, wake up and call me"\n\n**The host parent briefing (keep it simple):**\n• "If you hear the CGM alarm, wake [child's name] and call me immediately."\n• "Here is what a low looks like: shaky, pale, confused."\n• "If it's a low: give these glucose tablets. Then call me."\n• "My number is [number]. Call me anytime — I mean it."\n\n**What to prepare for the child:**\n• A small zip bag with: 4 glucose tablets, their meter, a contact card\n• Instructions written simply on the contact card\n• Reassurance: "If you feel weird at any time, wake [host parent] up"\n\n**First sleepover:**\nFor the first sleepover, some families arrange to be nearby or on standby. This gets easier with each one.`,
    tip: "Remote CGM monitoring means you can sleep knowing you'll be alerted if needed. Technology makes this very achievable.",
  },
  {
    id: "sport-soccer",
    title: "Soccer / Football",
    emoji: "⚽",
    color: COLORS.mint,
    category: "Sport",
    intro: "Managing glucose for one of the most common children's sports.",
    guide: `Soccer is a mixed aerobic/anaerobic sport — meaning it combines sustained running (which lowers glucose) with short sprints (which can temporarily raise glucose). Overall, soccer typically causes glucose to fall.\n\n**Before training or game:**\n• Check glucose — aim to start above 7–8 mmol/L\n• If below 7: have 15–20g of carbs before starting\n• Inform the coach of your child's T1D and where their kit is\n\n**During (for games over 60 minutes):**\n• Check at half time if possible, or CGM monitor\n• If glucose is falling fast: give 15g fast carbs (juice, glucose tablets)\n• Ensure water is available — dehydration worsens glucose drops\n\n**After soccer:**\n• Check glucose 30 minutes after\n• Offer a carb + protein snack (e.g., cheese and crackers, milk and fruit)\n• On competition/long training days: check before bed\n• Set CGM alert higher overnight (soccer causes glucose to drop for hours)\n\n**Reducing the pre-sport insulin (if on MDI):**\nSome families and diabetes teams recommend reducing the meal insulin dose by 10–30% before planned sport. This requires guidance from your diabetes educator — do not change doses without discussion.`,
    tip: "Talk to your coach at the start of the season — a 30-second conversation prevents 30 minutes of worry during the game.",
  },
  {
    id: "sport-swimming",
    title: "Swimming",
    emoji: "🏊",
    color: COLORS.ocean,
    category: "Sport",
    intro: "Swimming and water sports — what's different about aquatic activity.",
    guide: `Swimming is sustained exercise — typically one of the activities most likely to cause glucose to drop both during and after activity.\n\n**Key differences from land sports:**\n• CGMs and pumps are affected by water — check your device's water rating\n• Most CGMs (Dexcom G7, FreeStyle Libre 3) are water-resistant but accuracy may vary briefly after submersion\n• Pumps: most are waterproof for short periods; check your model's specifications\n• Many families disconnect a pump during swimming sessions — discuss this protocol with your team\n\n**Before swimming:**\n• Check glucose — aim above 8 mmol/L for a long session\n• Have glucose tablets and a towel within reach poolside\n• Brief the coach/lifeguard — a simple "my child has T1D" conversation\n\n**After swimming:**\n• Glucose can continue to drop for several hours after a swim session\n• Offer a carb + protein snack after swimming\n• Evening swim training: check glucose before bed, set higher overnight alerts\n\n**For competitive swimmers:**\nLong training sets significantly deplete glycogen. Some competitive swimmers with T1D snack between sets. Work with your diabetes educator to develop a training-specific protocol.`,
    tip: "Check your CGM and pump water rating before swimming. Most modern devices handle recreational swimming fine.",
  },
  {
    id: "sport-running",
    title: "Running / Athletics",
    emoji: "🏃",
    color: COLORS.sunshine,
    category: "Sport",
    intro: "Managing glucose during running events and cross country.",
    guide: `Running is primarily exercise — typically causing glucose to fall during and after activity. Sustained running (cross country, long distance) has a more significant glucose-lowering effect than short sprints.\n\n**Sprint-based running (100m, 200m):**\nHigh intensity, short duration — may briefly raise glucose due to adrenaline release.\n\n**Distance running (1500m, cross country):**\nSustained aerobic — typically causes significant glucose fall.\n\n**Relay and field events:**\nMixed — periods of waiting interspersed with intense short bursts.\n\n**Practical guidance:**\n\n**For training:**\n• Check glucose before and after\n• Target starting glucose above 7–8 mmol/L for distance runs\n• Carry glucose tablets during runs (arm band or pocket)\n• Hydrate well — water only is fine for most training sessions\n\n**For athletics carnivals:**\n• Pack extra snacks and glucose supplies\n• Plan for a long, active day with variable meal timing\n• CGM is invaluable at carnivals — alerts let you monitor without interrupting\n• Brief the PE teacher at the start of the day\n\n**Wearing a CGM for sport:**\nUse a CGM armband or overlay patch to prevent the sensor dislodging during active movement.`,
    tip: "Arm-band CGM covers and overlay patches are inexpensive and prevent sensors falling off during sport.",
  },
];

export default function SchoolActivityCompanion() {
  const [selected, setSelected] = useState(null);
  const [category, setCategory] = useState("all");

  const categories = ["all", "School", "Social", "Sport"];
  const filtered = category === "all" ? situations : situations.filter(s => s.category === category);

  if (selected) {
    return (
      <div className="module-detail">
        <button className="back-btn" onClick={() => setSelected(null)}>← Back to situations</button>
        <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{selected.emoji}</div>
        <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: selected.color, marginBottom: 8 }}>{selected.category}</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#1A3A4A", marginBottom: 8 }}>{selected.title}</h2>
        <p style={{ color: "#8A9BB0", marginBottom: 20 }}>{selected.intro}</p>

        <div className="detail-content">
          {selected.guide.split("\n").map((line, i) => {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return <span key={i}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}<br /></span>;
          })}
        </div>

        <div className="activity-box" style={{ marginTop: 24 }}>
          <div className="box-label" style={{ color: selected.color }}>💡 Quick Tip</div>
          <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{selected.tip}</div>
        </div>

        <div className="results-footer" style={{ marginTop: 16 }}>
          Always consult your diabetes educator before making changes to insulin doses for sport or activity. These are general guidance principles — your child's response may differ.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2>🏫 School & Activity Companion</h2>
        <p>Practical, shareable guidance for the real situations T1D families face every day — school, sport, and social life.</p>
      </div>

      <div className="filter-row">
        {categories.map(c => (
          <button key={c} className={`filter-btn ${category === c ? "active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      <div className="scenario-grid">
        {filtered.map(s => (
          <div key={s.id} className="scenario-card" onClick={() => setSelected(s)} style={{ "--sev-color": s.color, "--sev-bg": `${s.color}15` }}>
            <div className="scenario-emoji">{s.emoji}</div>
            <div className="scenario-title">{s.title}</div>
            <div style={{ fontSize: "0.8rem", color: "#8A9BB0", marginTop: 4 }}>{s.intro}</div>
            <div className="scenario-severity" style={{ color: s.color, background: `${s.color}18`, marginTop: 12 }}>{s.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
