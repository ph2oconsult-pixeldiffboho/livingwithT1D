import { useState } from "react";

const COLORS = { ocean: "#2E86AB", coral: "#F46036", mint: "#56C596", sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A" };

const patterns = [
  {
    id: "pizza-effect",
    number: "01",
    title: "The Pizza Effect",
    subtitle: "Why glucose spikes hours after a high-fat meal",
    emoji: "🍕",
    color: COLORS.coral,
    searchTerms: ["pizza spike", "delayed glucose rise", "high fat meal diabetes"],
    tldr: "Fat slows stomach emptying, so carbs absorb 3–5 hours later — long after insulin has peaked.",
    whatParentsSee: "Glucose looks perfect right after dinner. Then at 11pm or 2am it climbs sharply, seemingly out of nowhere.",
    whyItHappens: `When a meal contains significant fat (pizza, burgers, pasta with cream sauce, fish and chips), the fat physically slows the emptying of the stomach.\n\nIn a low-fat meal, carbohydrates leave the stomach and enter the bloodstream within 1–2 hours — closely matching when rapid-acting insulin peaks.\n\nIn a high-fat meal, that same amount of carbohydrate may trickle into the bloodstream over 3–6 hours. The insulin has already peaked and is fading when the glucose finally arrives.\n\nThe result: a delayed spike that looks like it came from nowhere — because from the insulin's perspective, it did.`,
    practical: `• Expect a delayed rise after pizza, burgers, creamy pasta, stir-fries with oil, and takeaway meals\n• Check glucose 3–4 hours after high-fat meals, not just at the 90-minute mark\n• Set CGM alerts overnight when a high-fat dinner was eaten\n• Some families and care teams use a "split dose" for high-fat meals — giving part of the mealtime insulin before eating and the rest 1–2 hours later. Discuss this approach with your diabetes educator before trying it.\n• Recognising the pattern is itself progress — it stops the 2am spike feeling random`,
    shareableInsight: "Fat doesn't raise glucose directly — it delays when carbs absorb. That's why pizza causes spikes hours later, not immediately.",
  },
  {
    id: "exercise-spike",
    number: "02",
    title: "The Exercise Spike",
    subtitle: "Why intense sport sometimes raises glucose instead of lowering it",
    emoji: "⚡",
    color: COLORS.sunshine,
    searchTerms: ["exercise raises blood sugar", "sport glucose spike", "exercise glucose spike"],
    tldr: "High-intensity exercise triggers a stress response that causes the liver to release stored glucose — temporarily raising blood glucose.",
    whatParentsSee: "Child plays a hard soccer game or runs sprints. Instead of glucose dropping (as expected), it rises — sometimes significantly.",
    whyItHappens: `Exercise affects glucose in two fundamentally different ways depending on intensity:\n\n**Steady exercise** (jogging, swimming, cycling at moderate pace): Muscles become more sensitive to insulin, using blood glucose more efficiently. Blood glucose typically falls during and after activity.\n\n**Anaerobic / high-intensity exercise** (sprinting, competitive races, intense interval training, heavy weightlifting): The body perceives this as a "fight or flight" stress. It releases hormones that signal the liver to release stored glucose into the bloodstream — providing emergency fuel.\n\nIn a person without type 1 diabetes, the pancreas instantly releases insulin to balance this glucose dump. In type 1 diabetes, no such automatic response occurs. The result is a temporary glucose rise that can be significant — sometimes 3–5 mmol/L — during or shortly after intense activity.\n\nMost team sports like soccer and basketball involve both types: long aerobic periods interrupted by short explosive sprints. Glucose may fall during play then spike at the final whistle.`,
    practical: `• Expect glucose rises during and after very intense, short-duration exercise\n• Expect glucose falls during and after sustained moderate exercise\n• Mixed sports (soccer, basketball, hockey): variable — monitor with CGM\n• If glucose is already high before sport, exercise may push it higher\n• The post-exercise spike usually resolves within 1–2 hours as adrenaline clears\n• Do not correct an exercise spike aggressively — a hypo risk often follows as the adrenaline fades`,
    shareableInsight: "Intense exercise triggers a stress response that tells the liver to release stored glucose. That's why high-intensity sport can raise blood glucose instead of lowering it.",
  },
  {
    id: "overnight-rise",
    number: "03",
    title: "The Overnight Rise",
    subtitle: "Why glucose climbs during sleep — the Dawn Phenomenon",
    emoji: "🌙",
    color: COLORS.lavender,
    searchTerms: ["overnight glucose rise child", "dawn phenomenon children", "morning high blood sugar"],
    tldr: "Growth hormone released during sleep causes temporary insulin resistance — glucose climbs even without food.",
    whatParentsSee: "Glucose is in range at bedtime. By 3–6am it has risen steadily to 12–15 mmol/L despite no food being eaten.",
    whyItHappens: `The human body releases growth hormone in pulses during deep sleep. This is a normal and essential part of childhood development.\n\nGrowth hormone directly reduces insulin's effectiveness. The same amount of insulin has less effect during these hormonal surges than it would during the day.\n\nAdditionally, cortisol (the "waking up" hormone) rises in the early morning hours (typically 4–8am) to prepare the body for the day. These hormones also increase insulin resistance.\n\nIn people without type 1 diabetes, the pancreas automatically produces more insulin to compensate for these hormonal effects. In type 1 diabetes, the basal insulin dose was set for average conditions — it cannot automatically increase when growth hormone surges.\n\nThis phenomenon is called the **Dawn Phenomenon** and is extremely common in children and adolescents with type 1 diabetes — precisely because they release more growth hormone than adults.\n\nA related pattern — sometimes called the rebound high — occurs when a glucose drop overnight triggers a hormonal rebound that pushes glucose high by morning. CGM data can distinguish between the two.`,
    practical: `• The dawn phenomenon is not a management failure — it is a predictable hormonal pattern\n• Review overnight CGM data with your diabetes care team — adjusting background insulin (basal) timing or dose often helps\n• For pump users: a higher temporary background insulin (basal) rate in the early morning hours is a common strategy\n• For families using multiple daily injections (MDI): injection timing adjustments or changing to a different basal insulin may help\n• Do not chase overnight highs with correction doses without understanding the pattern first`,
    shareableInsight: "Growth hormone released during sleep causes temporary insulin resistance. That's why children's glucose often rises overnight — not because of anything they ate.",
  },
  {
    id: "afternoon-crash",
    number: "04",
    title: "The Random Afternoon Crash",
    subtitle: "When glucose drops suddenly for no obvious reason",
    emoji: "📉",
    color: COLORS.ocean,
    searchTerms: ["afternoon low blood sugar child", "random glucose drop", "insulin stacking"],
    tldr: "Multiple insulin doses overlapping ('stacking'), afternoon activity, or faster afternoon digestion can all cause unexpected drops.",
    whatParentsSee: "Glucose was fine after lunch. Then mid-afternoon — 3–4 hours later — it drops quickly, sometimes without warning symptoms.",
    whyItHappens: `Several factors commonly contribute to afternoon glucose drops:\n\n**Insulin stacking**: If a correction dose was given in the morning or at lunch, and another dose was given at lunch, the active insulin from both doses may still be working simultaneously in the afternoon. This overlap — called insulin stacking — can push glucose lower than intended.\n\n**Afternoon activity**: School afternoons often involve PE, recess games, or walking home. Even moderate activity can accelerate a glucose drop that was already trending down.\n\n**Faster afternoon digestion**: Some people digest food more quickly at certain times of day. If lunch carbs absorbed faster than expected, the insulin may outlast the glucose — causing a late drop.\n\n**Waning hormones**: Morning stress hormones that provide some insulin resistance early in the day fade by afternoon, sometimes making insulin more effective in the afternoon than at breakfast.`,
    practical: `• Check CGM trend arrows during afternoon — a downward arrow combined with active insulin is an early warning\n• Account for "insulin on board" before giving correction doses — most pump systems calculate this automatically; for MDI families, discuss with your educator\n• On school sport days, expect more afternoon and evening drops\n• A small afternoon snack with protein can help buffer afternoon lows for active children`,
    shareableInsight: "Afternoon glucose crashes often happen because multiple insulin doses are still active at the same time — a phenomenon called insulin stacking.",
  },
  {
    id: "illness-spike",
    number: "05",
    title: "The Illness Spike",
    subtitle: "Why glucose runs high when your child is sick — even without eating",
    emoji: "🤒",
    color: COLORS.coral,
    searchTerms: ["sick day diabetes", "illness blood sugar rise", "infection glucose spike"],
    tldr: "Illness triggers stress hormones that raise glucose AND cause insulin resistance — simultaneously. Insulin needs increase when sick.",
    whatParentsSee: "Child has a cold, stomach bug, or ear infection. Glucose climbs to 12–18 mmol/L and is stubborn. The child isn't eating much — so why is glucose so high?",
    whyItHappens: `The body's immune response to illness triggers a cascade of stress hormones. These do two things simultaneously that affect glucose:\n\n1. **They tell the liver to release stored glucose** (even without eating, the liver pumps glucose into the bloodstream to fuel the immune response)\n\n2. **They cause significant insulin resistance** (cells become less responsive to insulin, so the same dose has less effect)\n\nThese two effects combine to push glucose high — and make it stubborn to bring down.\n\nThis occurs with virtually any illness: viral infections, bacterial infections, even teething in very young children. The more severe the illness, the more pronounced the glucose effect.\n\nDuring illness, insulin requirements often increase significantly — sometimes 20–50% or more.`,
    practical: `• **Never stop insulin during illness** — even if the child is not eating, insulin is still needed to prevent DKA\n• Check glucose every 2 hours when your child is unwell\n• Check ketones if glucose is above 14 mmol/L\n• Contact your diabetes care team early — don't wait until ketones are large\n• Maintain hydration — dehydration worsens hyperglycaemia\n• Have a written sick day plan from your diabetes care team before illness strikes`,
    shareableInsight: "When a child with type 1 diabetes gets sick, their body releases stress hormones that raise glucose AND block insulin — even without eating. That's why sick days always require extra vigilance.",
  },
  {
    id: "nothing-works-high",
    number: "06",
    title: "The 'Nothing Works' High",
    subtitle: "When correction doses don't seem to be bringing glucose down",
    emoji: "🧱",
    color: COLORS.mint,
    searchTerms: ["insulin not working", "correction dose not working", "stubborn high glucose"],
    tldr: "Stubborn highs usually have a cause — illness, infusion site failure, hormones, or significant insulin resistance. Finding the cause matters more than repeating corrections.",
    whatParentsSee: "Glucose is 18 mmol/L. A correction dose was given. Two hours later it's still 18. Another correction. Still not moving. Panic sets in.",
    whyItHappens: `When insulin corrections appear to have no effect, there is almost always a specific reason. The most common causes:\n\n**For pump users:**\n• Blocked or kinked cannula at the infusion site — insulin is not entering the body\n• Air in the tubing — causing incomplete doses\n• Infusion site that has been in too long and is absorbing poorly\n• Reservoir running low\n\n**For all users:**\n• Active illness — stress hormones causing significant insulin resistance\n• Ketones present — ketoacidosis impairs insulin action; the body needs significantly more insulin\n• Hormonal event — growth hormone surges, menstrual cycle (in adolescent girls)\n• Expired or heat-damaged insulin — insulin stored in a hot car or expired loses potency\n• Injection into scar tissue — common at frequently used injection sites\n• Lipohypertrophy — fatty lumps at overused injection sites absorb insulin unpredictably`,
    practical: `• For pump users: change the infusion site FIRST before stacking correction doses\n• Check ketones — if moderate or large, seek medical advice promptly\n• Consider whether the insulin could be damaged or expired\n• Rotate injection and infusion sites to prevent lipohypertrophy\n• If glucose is above 15 mmol/L with moderate/large ketones — contact your diabetes care team or go to emergency\n• Trust the pattern: if insulin rarely fails to work, one non-responding dose has a cause worth investigating`,
    shareableInsight: "When insulin doesn't seem to be working, it's almost always because of a blocked pump site, illness, or compromised insulin — not because the condition has suddenly changed.",
  },
  {
    id: "post-exercise-night-low",
    number: "07",
    title: "Post-Exercise Nighttime Lows",
    subtitle: "Why glucose crashes overnight after an active day",
    emoji: "😴",
    color: COLORS.ocean,
    searchTerms: ["overnight low after exercise", "post sport glucose drop", "delayed exercise hypoglycaemia"],
    tldr: "Muscles continue absorbing glucose for up to 12 hours after exercise to replenish glucose stores — creating an extended overnight hypoglycaemia risk.",
    whatParentsSee: "Child had soccer training or a big sport day. Glucose was fine at bedtime. CGM alarm goes off at 2am with a low. This keeps happening after active days.",
    whyItHappens: `During exercise, muscles use glucose for fuel. After exercise ends, the muscles need to refill their glucose stores.\n\nThis process continues for up to 12 hours after exercise — often entirely during sleep. The muscles continue pulling glucose out of the bloodstream to refill their stores, gradually lowering blood glucose.\n\nThe effect is most pronounced:\n• After endurance or high-volume exercise (long training sessions, matches, swimming carnivals)\n• When exercise happened in the afternoon or evening\n• In children and adolescents who are more sensitive to exercise effects\n• On days when insulin doses were not reduced to account for activity\n\nThis pattern is well understood by diabetes clinicians but often surprises families — because the timing makes it seem disconnected from the activity.`,
    practical: `• On sport days, check glucose before bed — do not skip this\n• Offer a carbohydrate + protein bedtime snack on active days (e.g., milk and crackers, cheese and toast)\n• Set CGM low alert at a higher threshold on after sport (e.g., 5.5 mmol/L instead of 4.0)\n• Consider reducing background insulin (basal) or dinner insulin on heavy sport days — discuss with your team\n• The pattern is predictable once recognised — tracking which activities cause it helps enormously`,
    shareableInsight: "Muscles keep absorbing glucose for 12 hours after exercise to replenish energy stores. That's why active children can go low overnight — long after sport has finished.",
  },
  {
    id: "growth-spurt-highs",
    number: "08",
    title: "Growth Spurt Highs",
    subtitle: "When glucose suddenly becomes much harder to control for weeks",
    emoji: "📏",
    color: COLORS.lavender,
    searchTerms: ["growth spurt diabetes", "puberty blood sugar harder control", "insulin needs increasing"],
    tldr: "During growth spurts, the body floods with growth hormone — causing weeks of increased insulin resistance that often requires dose adjustments.",
    whatParentsSee: "For weeks, glucose is running higher than usual. The same doses that worked last month don't seem to be enough. Nothing obvious has changed.",
    whyItHappens: `Growth spurts are driven by surges in growth hormone — the same hormone responsible for the overnight dawn phenomenon, but during a growth spurt, it is elevated throughout the day and night.\n\nGrowth hormone directly antagonises insulin. During a growth spurt:\n• Insulin sensitivity decreases across the entire day\n• The same insulin dose produces less glucose-lowering effect\n• Both mealtime and background insulin needs often increase\n• The effect can last for weeks or months\n\nThis is entirely normal physiology. It is not a management failure. It is the predictable effect of a growing body on a condition that requires insulin.\n\nPuberty amplifies this effect significantly. The teenage years typically involve the highest insulin requirements a person with type 1 diabetes will ever experience. Adolescent girls and boys may need 30–50% more insulin during growth periods than they did as younger children.`,
    practical: `• If glucose has been running higher for more than 1 week without an obvious cause, consider a growth spurt\n• Contact your diabetes care team — dose increases during growth spurts are expected and common\n• Track height periodically — a growth spurt is often confirmed by a visible height change\n• Reassure your child that this is not their fault and does not mean their management has changed\n• Insulin needs will eventually plateau and may even decrease after the growth phase ends`,
    shareableInsight: "During a growth spurt, the body releases extra growth hormone that directly blocks insulin. It's why children can suddenly need much more insulin for weeks — and it's completely normal.",
  },
  {
    id: "protein-rise",
    number: "09",
    title: "The High-Protein Meal Rise",
    subtitle: "Why glucose rises slowly after protein-heavy meals",
    emoji: "🥩",
    color: COLORS.sunshine,
    searchTerms: ["protein raises blood sugar", "steak glucose rise", "meat diabetes effect"],
    tldr: "Large amounts of protein can be converted to glucose by the liver — causing a slow, gradual rise 2–4 hours after eating.",
    whatParentsSee: "Child eats a steak dinner with vegetables — very few carbs. Glucose should be stable. Instead, it rises slowly a few hours later.",
    whyItHappens: `Protein does not directly raise blood glucose the way carbohydrates do. However, it has an indirect effect.\n\nWhen large amounts of protein are consumed, the liver converts some of it to glucose through a process called **gluconeogenesis** — literally "creating new glucose." This process is slow, typically producing a gradual glucose rise 2–4 hours after eating.\n\nThe effect is:\n• Most noticeable with large protein meals (a large steak, a big serving of chicken or fish)\n• Slower and more gradual than carbohydrate-driven rises\n• More significant when few carbohydrates are eaten alongside (because there's less competing carb absorption to mask it)\n• Highly variable between individuals\n\nFor most children eating standard portion sizes, the protein effect is mild. It becomes more relevant for teenagers eating larger portions or families following low-carbohydrate dietary approaches.`,
    practical: `• A standard child's portion of protein at dinner is unlikely to cause a significant rise\n• Large protein servings — particularly in low-carb meals — may produce a 2–4 hour delayed rise\n• If you notice consistent late rises after protein-heavy dinners, discuss with your diabetes educator\n• Some families using pumps learn to give a small, extended insulin dose for large protein meals — this is an advanced technique for experienced families`,
    shareableInsight: "The liver can convert large amounts of protein into glucose — slowly, over 2–4 hours. That's why a big steak dinner can cause a gentle glucose rise even with very few carbs.",
  },
  {
    id: "sensor-confusion",
    number: "10",
    title: "When the CGM Doesn't Match Reality",
    subtitle: "Understanding sensor lag — and when to trust symptoms over numbers",
    emoji: "📡",
    color: COLORS.mint,
    searchTerms: ["CGM wrong reading", "sensor lag diabetes", "dexcom not accurate", "libre wrong"],
    tldr: "CGMs measure glucose in the fluid between cells — which runs 5–15 minutes behind blood glucose. During fast changes, the CGM reading can be significantly different from actual blood glucose.",
    whatParentsSee: "CGM shows glucose is fine — but child looks pale and shaky. Or CGM shows a worrying number but the child feels completely normal. Which do you trust?",
    whyItHappens: `CGMs measure glucose in **interstitial fluid** — the fluid that surrounds cells beneath the skin. This is different from blood glucose.\n\nGlucose moves from blood into interstitial fluid with a short delay — typically 5–15 minutes. Under normal, stable conditions this delay is clinically insignificant.\n\nDuring rapid glucose changes, however, the delay becomes important:\n\n**Rapidly falling glucose**: Blood glucose may have already dropped to 3.5 mmol/L, but the sensor still reads 5.5 mmol/L (because the interstitial fluid hasn't caught up yet). Your child may feel hypo symptoms while the CGM shows a "safe" number.\n\n**Rapidly rising glucose**: The CGM may show a high reading that is already resolving in the blood.\n\n**Additional factors affecting accuracy:**\n• Pressure on the sensor during sleep (lying on it causes false readings)\n• Very first day of a new sensor (still calibrating)\n• Dehydration (affects interstitial fluid)\n• Certain medications (including some vitamin C supplements at high doses)`,
    practical: `• **Always trust symptoms over numbers** — if a child looks or feels low, treat first, verify after\n• If CGM and symptoms disagree significantly, use a finger-prick blood glucose test to confirm\n• During rapid changes (exercise, treating a low), CGM arrows are more useful than the number itself\n• A double-down arrow (↓↓) means glucose is falling faster than 3 mmol/L per minute — act immediately regardless of the displayed number\n• If CGM readings are consistently inaccurate, check sensor placement, hydration, and whether a new sensor is needed`,
    shareableInsight: "CGMs read glucose in tissue fluid, which lags 5–15 minutes behind blood. During a fast drop, your child can feel hypoglycaemic while the CGM still shows a normal number. Always trust symptoms first.",
  },
];

export default function GlucosePatterns() {
  const [selected, setSelected] = useState(null);

  const formatContent = (text) => text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return <span key={i}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}<br /></span>;
  });

  if (selected) {
    return (
      <div>
        <button className="back-btn" onClick={() => setSelected(null)}>← Back to all patterns</button>

        <div className="pattern-detail-header" style={{ "--p-color": selected.color }}>
          <div className="pattern-detail-number">{selected.number}</div>
          <div style={{ fontSize: "3rem", margin: "12px 0" }}>{selected.emoji}</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "#1A3A4A", marginBottom: 6 }}>{selected.title}</h2>
          <p style={{ color: "#8A9BB0", fontSize: "1rem" }}>{selected.subtitle}</p>
        </div>

        <div className="pattern-tldr" style={{ borderLeftColor: selected.color }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: selected.color, marginBottom: 6 }}>TL;DR — The one-sentence explanation</div>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1A3A4A", lineHeight: 1.5 }}>{selected.tldr}</div>
        </div>

        <div className="pattern-section">
          <div className="pattern-section-label">👁️ What parents see</div>
          <div className="pattern-section-content">{selected.whatParentsSee}</div>
        </div>

        <div className="pattern-section">
          <div className="pattern-section-label">🔬 Why it happens</div>
          <div className="pattern-section-content">{formatContent(selected.whyItHappens)}</div>
        </div>

        <div className="pattern-section">
          <div className="pattern-section-label">✅ What this means practically</div>
          <div className="pattern-section-content">{formatContent(selected.practical)}</div>
        </div>

        <div className="pattern-shareable" style={{ borderColor: selected.color }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: selected.color, marginBottom: 8 }}>💬 Share this insight</div>
          <div style={{ fontStyle: "italic", color: "#1A3A4A", lineHeight: 1.6, fontSize: "0.95rem" }}>"{selected.shareableInsight}"</div>
        </div>

        <div className="results-footer" style={{ marginTop: 16 }}>
          This explanation is for educational purposes only. Always discuss persistent or concerning glucose patterns with your endocrinologist or diabetes educator.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2>📈 Understanding Glucose Patterns</h2>
        <p>The 10 most confusing glucose behaviours parents search for online — explained clearly. Turn "why did this happen?" into understanding.</p>
      </div>

      <div style={{ background: "linear-gradient(135deg, #1A3A4A, #2E86AB)", borderRadius: 20, padding: "28px 32px", marginBottom: 32, color: "white" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: 10 }}>
          "Glucose patterns often feel random. They rarely are."
        </div>
        <div style={{ fontSize: "0.9rem", opacity: 0.85, lineHeight: 1.7 }}>
          Most confusing glucose patterns have a clear, well-understood cause. Once you can name what's happening — the pizza effect, the dawn phenomenon, exercise rebound — it stops feeling chaotic and starts feeling manageable.
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {patterns.map(p => (
          <div key={p.id} className="pattern-card" style={{ "--p-color": p.color }} onClick={() => setSelected(p)}>
            <div className="pattern-num" style={{ color: p.color }}>{p.number}</div>
            <div style={{ fontSize: "1.6rem", flexShrink: 0 }}>{p.emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="pattern-card-title">{p.title}</div>
              <div className="pattern-card-sub">{p.subtitle}</div>
              <div className="pattern-card-tldr">{p.tldr}</div>
            </div>
            <span style={{ color: p.color, fontSize: "1.2rem", flexShrink: 0 }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}
