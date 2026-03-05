import { useState } from "react";

const COLORS = { ocean: "#2E86AB", coral: "#F46036", mint: "#56C596", sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A", muted: "#8A9BB0" };

// ─── Pattern Detection Engine ─────────────────────────────────────────────────
// Takes a CGM-like time series (array of {time, value}) + context toggles
// Returns detected patterns with confidence scores

function detectPatterns(readings, ctx) {
  const patterns = [];

  if (!readings || readings.length < 6) return patterns;

  const vals = readings.map(r => r.value);
  const times = readings.map(r => r.time); // minutes from start

  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const max = arr => Math.max(...arr);
  const min = arr => Math.min(...arr);

  const overallMax = max(vals);
  const overallMin = min(vals);
  const range = overallMax - overallMin;
  const firstVal = vals[0];
  const lastVal = vals[vals.length - 1];

  // Find peaks and troughs
  const peaks = [], troughs = [];
  for (let i = 1; i < vals.length - 1; i++) {
    if (vals[i] > vals[i-1] && vals[i] > vals[i+1] && vals[i] > 10) peaks.push({ idx: i, val: vals[i], time: times[i] });
    if (vals[i] < vals[i-1] && vals[i] < vals[i+1] && vals[i] < 8) troughs.push({ idx: i, val: vals[i], time: times[i] });
  }

  // Rate of change segments
  const roc = vals.map((v, i) => i === 0 ? 0 : (v - vals[i-1]) / ((times[i] - times[i-1]) / 60));

  const mealTime = ctx.mealTime ? parseInt(ctx.mealTime) : null;
  const actTime  = ctx.activityTime ? parseInt(ctx.activityTime) : null;

  // ── A. EARLY SPIKE (rise within 60 min of meal) ──────────────────────────
  if (mealTime !== null) {
    const postMeal60 = readings.filter(r => r.time >= mealTime && r.time <= mealTime + 60);
    if (postMeal60.length >= 2) {
      const earlyRise = postMeal60[postMeal60.length-1].value - postMeal60[0].value;
      if (earlyRise >= 3) {
        let conf = Math.min(95, 50 + earlyRise * 8);
        if (ctx.mealType === "fast") conf = Math.min(95, conf + 15);
        if (ctx.insulinTiming === "after") conf = Math.min(95, conf + 10);
        patterns.push({
          id: "early-spike",
          label: "Early Post-Meal Spike",
          emoji: "📈",
          color: COLORS.coral,
          confidence: Math.round(conf),
          description: `Glucose rose ${earlyRise.toFixed(1)} mmol/L within 60 minutes of eating — a classic fast carbohydrate absorption pattern.`,
          drivers: buildDrivers("early-spike", ctx, earlyRise),
          nextTime: [
            "Was the meal mostly fast carbs — bread, rice, fruit, juice, cereal?",
            "Was insulin given 10–15 minutes before eating, or at/after the meal?",
            "Notice whether the spike peaks and then returns to range within 2–3 hours — that's the ideal pattern.",
          ],
        });
      }
    }
  }

  // ── B. DELAYED SPIKE ("pizza effect") ────────────────────────────────────
  if (mealTime !== null) {
    const earlyWindow = readings.filter(r => r.time >= mealTime && r.time <= mealTime + 90);
    const lateWindow  = readings.filter(r => r.time >= mealTime + 120 && r.time <= mealTime + 360);
    if (earlyWindow.length >= 2 && lateWindow.length >= 2) {
      const earlyRise = max(earlyWindow.map(r=>r.value)) - earlyWindow[0].value;
      const lateRise  = max(lateWindow.map(r=>r.value)) - min(earlyWindow.map(r=>r.value));
      if (lateRise >= 2.5 && lateRise > earlyRise) {
        let conf = Math.min(95, 45 + lateRise * 10);
        if (ctx.mealType === "highfat") conf = Math.min(95, conf + 20);
        if (ctx.mealType === "mixed")   conf = Math.min(95, conf + 10);
        patterns.push({
          id: "delayed-spike",
          label: "Delayed Spike — Possible Pizza Effect",
          emoji: "🍕",
          color: COLORS.sunshine,
          confidence: Math.round(conf),
          description: `Glucose stayed relatively stable after eating, then rose ${lateRise.toFixed(1)} mmol/L later — the classic pattern of fat slowing carbohydrate absorption.`,
          drivers: buildDrivers("delayed-spike", ctx, lateRise),
          nextTime: [
            "Was the meal high in fat — pizza, burger, pasta with cream, takeaway?",
            "Did the rise appear 2–4 hours after eating rather than immediately?",
            "Was there little physical activity after dinner?",
          ],
        });
      }
    }
  }

  // ── C. EXERCISE SPIKE ─────────────────────────────────────────────────────
  if (actTime !== null && ctx.activityLevel === "intense") {
    const preAct  = readings.filter(r => r.time >= actTime - 30 && r.time < actTime);
    const postAct = readings.filter(r => r.time >= actTime && r.time <= actTime + 120);
    if (preAct.length >= 1 && postAct.length >= 2) {
      const preVal  = avg(preAct.map(r=>r.value));
      const postMax = max(postAct.map(r=>r.value));
      const rise    = postMax - preVal;
      if (rise >= 2) {
        let conf = Math.min(90, 50 + rise * 10);
        patterns.push({
          id: "exercise-spike",
          label: "Exercise-Induced Glucose Rise",
          emoji: "⚡",
          color: COLORS.sunshine,
          confidence: Math.round(conf),
          description: `Glucose rose ${rise.toFixed(1)} mmol/L during or after intense activity. High-intensity exercise releases adrenaline, which triggers the liver to release glucose.`,
          drivers: buildDrivers("exercise-spike", ctx, rise),
          nextTime: [
            "Was the activity high-intensity — sprinting, competitive sport, intense intervals?",
            "Did the rise appear during or immediately after the activity?",
            "Did glucose then drop back to range (or below) in the 2–4 hours after sport?",
          ],
        });
      }
    }
  }

  // ── D. EXERCISE DROP / DELAYED LOW ────────────────────────────────────────
  if (actTime !== null) {
    const postActLate = readings.filter(r => r.time >= actTime + 120 && r.time <= actTime + 600);
    if (postActLate.length >= 3) {
      const minLate = min(postActLate.map(r=>r.value));
      const preActAvg = avg(readings.filter(r => r.time < actTime).map(r=>r.value));
      const drop = preActAvg - minLate;
      if (minLate < 4.5 || drop >= 3) {
        let conf = Math.min(92, 55 + drop * 8);
        if (actTime > 600) conf = Math.min(92, conf + 10); // evening activity → night lows
        patterns.push({
          id: "exercise-drop",
          label: ctx.actTime > 600 ? "Delayed Post-Exercise Low" : "Exercise-Related Glucose Drop",
          emoji: "📉",
          color: COLORS.ocean,
          confidence: Math.round(conf),
          description: `Glucose fell ${drop.toFixed(1)} mmol/L in the hours after activity. Muscles continue absorbing glucose to replenish energy stores for up to 12 hours after exercise.`,
          drivers: buildDrivers("exercise-drop", ctx, drop),
          nextTime: [
            "Did this happen again after similar activity?",
            "Was there a carb + protein snack after exercise?",
            "Was the activity in the afternoon or evening, leading to an overnight drop?",
          ],
        });
      }
    }
  }

  // ── E. OVERNIGHT RISE (Dawn Phenomenon) ──────────────────────────────────
  const nightStart = readings.findIndex(r => r.time >= 180); // 3am-ish if midnight is 0
  const morningEnd = readings.filter(r => r.time <= 480);
  if (nightStart > 0 && morningEnd.length > 3) {
    const nightVals = readings.slice(nightStart).map(r=>r.value);
    const nightMin  = min(nightVals.slice(0, 3));
    const morningMax= max(morningEnd.slice(-4).map(r=>r.value));
    const rise = morningMax - nightMin;
    if (rise >= 2.5 && morningMax > 8) {
      let conf = Math.min(90, 45 + rise * 10);
      patterns.push({
        id: "dawn-phenomenon",
        label: "Dawn Phenomenon — Overnight Rise",
        emoji: "🌙",
        color: COLORS.lavender,
        confidence: Math.round(conf),
        description: `Glucose rose ${rise.toFixed(1)} mmol/L in the overnight / early morning window — consistent with growth hormone release causing temporary insulin resistance. Very common in children.`,
        drivers: buildDrivers("dawn-phenomenon", ctx, rise),
        nextTime: [
          "Does this happen on most mornings, or only some?",
          "What time did the rise begin — 2am, 3am, 4am?",
          "Was there intense activity the previous afternoon? (This can also cause early morning lows, not rises — distinguishing them matters.)",
        ],
      });
    }
  }

  // ── F. STUBBORN HIGH ──────────────────────────────────────────────────────
  const highReadings = readings.filter(r => r.value > 13);
  if (highReadings.length > readings.length * 0.5 && overallMax > 13) {
    let conf = Math.min(90, 55 + highReadings.length);
    if (ctx.sick) conf = Math.min(90, conf + 20);
    if (ctx.pumpSiteChanged === false) conf = Math.min(90, conf + 15);
    patterns.push({
      id: "stubborn-high",
      label: "Persistent High — Glucose Not Coming Down",
      emoji: "🧱",
      color: COLORS.coral,
      confidence: Math.round(conf),
      description: `Glucose remained above 13 mmol/L for most of the period shown. When insulin corrections don't bring glucose down, there is almost always a specific cause worth identifying.`,
      drivers: buildDrivers("stubborn-high", ctx, overallMax),
      nextTime: [
        "Are there ketones present? Check immediately if glucose has been above 14 mmol/L for more than 2 hours.",
        "For pump users: has the infusion site been changed recently? A blocked cannula is the most common cause.",
        "Is the child unwell, even mildly? Illness raises insulin resistance significantly.",
        "Could the insulin be damaged or expired?",
      ],
    });
  }

  // ── G. ROLLERCOASTER ──────────────────────────────────────────────────────
  const swings = peaks.length + troughs.length;
  if (swings >= 3 && range >= 6) {
    patterns.push({
      id: "rollercoaster",
      label: "Glucose 'Rollercoaster' — Multiple Swings",
      emoji: "🎢",
      color: COLORS.lavender,
      confidence: Math.min(85, 40 + swings * 10),
      description: `Glucose swung ${range.toFixed(1)} mmol/L across ${peaks.length} peaks and ${troughs.length} troughs. Rollercoaster patterns are often driven by over-correction of lows, or multiple overlapping factors in the same day.`,
      drivers: buildDrivers("rollercoaster", ctx, range),
      nextTime: [
        "When a low occurred, was it treated with fast carbs and then re-checked after 15 minutes?",
        "Is it possible lows were over-treated with too much sugar, causing a rebound high?",
        "Were there multiple events (meal + activity + correction) all happening close together?",
      ],
    });
  }

  // Sort by confidence
  return patterns.sort((a, b) => b.confidence - a.confidence);
}

// ─── Driver Scoring ───────────────────────────────────────────────────────────
function buildDrivers(patternId, ctx, magnitude) {
  const drivers = [];

  const add = (label, explanation, score) => drivers.push({ label, explanation, score });

  if (patternId === "early-spike") {
    if (ctx.mealType === "fast")    add("Fast-absorbing meal", "Foods like bread, rice, cereal, fruit and juice raise glucose quickly — typically within 30–45 minutes.", 90);
    if (ctx.mealType === "mixed")   add("Mixed meal", "Carbohydrates in a mixed meal absorb at moderate speed, producing a moderate post-meal rise.", 70);
    if (ctx.insulinTiming === "at" || ctx.insulinTiming === "after")
                                    add("Insulin timing", "Insulin given at or after eating means glucose from food enters the bloodstream before insulin reaches peak activity.", 80);
    if (!ctx.activity || ctx.activityLevel === "none")
                                    add("Limited post-meal movement", "Physical activity after eating helps muscles absorb glucose. Sitting after a meal can steepen the post-meal rise.", 55);
  }

  if (patternId === "delayed-spike") {
    if (ctx.mealType === "highfat") add("High-fat meal", "Fat slows stomach emptying — carbs that would normally absorb in 1–2 hours take 3–5 hours. The insulin peaks early, leaving glucose to rise later.", 95);
    if (ctx.mealType === "mixed")   add("Mixed meal with fat content", "Some fat in the meal may have slowed carbohydrate absorption, creating a delayed rise.", 72);
    if (ctx.insulinTiming === "before") add("Pre-bolus timing", "Even with a pre-bolus, high-fat meals can outpace insulin timing due to very delayed absorption.", 60);
    if (!ctx.activity || ctx.activityLevel === "none")
                                    add("Sedentary post-meal period", "No activity after dinner is common — but it removes a helpful glucose-lowering mechanism.", 50);
  }

  if (patternId === "exercise-spike") {
    add("High-intensity activity", "Sprinting, competitive sport, and high-intensity intervals release adrenaline — which signals the liver to dump glucose for emergency fuel.", 92);
    add("Adrenaline / stress hormones", "Competition stress amplifies the adrenaline effect, even beyond the physical activity itself.", 75);
    if (ctx.activityLevel === "intense") add("Anaerobic effort", "Short explosive efforts are more likely to raise glucose than sustained aerobic exercise.", 85);
  }

  if (patternId === "exercise-drop") {
    add("Muscle glycogen replenishment", "After exercise, muscles absorb glucose from the bloodstream to refill energy stores. This process continues for up to 12 hours — often through the night.", 90);
    if (!ctx.snackAfterActivity) add("No post-exercise snack", "A carb + protein snack after activity helps buffer the prolonged glucose-lowering effect of exercise.", 70);
    if (ctx.activityLevel === "intense") add("High-volume exercise", "Longer or more intense sessions deplete glycogen more completely, extending the glucose absorption period.", 80);
  }

  if (patternId === "dawn-phenomenon") {
    add("Growth hormone (dawn phenomenon)", "The body releases growth hormone during deep sleep — especially in children. This temporarily reduces insulin effectiveness, causing glucose to rise.", 88);
    add("Cortisol rise before waking", "Cortisol increases in the early morning to prepare the body for waking. It raises insulin resistance, contributing to morning glucose rises.", 75);
    if (ctx.activityLevel === "intense") add("Previous day's exercise may rule out Somogyi effect", "Note: intense activity earlier can cause overnight lows and a rebound rise. CGM data helps distinguish this from the dawn phenomenon.", 60);
  }

  if (patternId === "stubborn-high") {
    if (ctx.sick)                  add("Illness", "Illness triggers significant stress hormones that raise both glucose production and insulin resistance. The same insulin dose works less effectively when unwell.", 95);
    if (ctx.pumpSiteChanged === false) add("Pump infusion site", "A site that hasn't been changed recently, or is blocked/kinked, can prevent insulin from entering the body effectively.", 88);
    add("Insulin resistance", "Persistent highs that don't respond to correction often indicate elevated insulin resistance — from illness, hormones, or stress.", 72);
    if (magnitude > 18) add("Ketone check advised", "Glucose above 18 mmol/L that is not responding warrants an immediate ketone check. Contact your diabetes team if ketones are present.", 90);
  }

  if (patternId === "rollercoaster") {
    add("Low over-treatment", "Treating a hypo with more sugar than needed often causes a rebound high — leading to a correction, then potentially another low.", 80);
    add("Multiple overlapping events", "Meals, activity, and corrections happening close together can create compounding glucose effects that are difficult to predict.", 75);
    if (ctx.sick) add("Illness contributing to variability", "Illness adds unpredictability to glucose — making existing patterns more extreme.", 70);
  }

  // Sort by score, return top 3
  return drivers.sort((a, b) => b.score - a.score).slice(0, 3);
}

// ─── CGM Data Generator (demo) ────────────────────────────────────────────────
function generateDemoData(scenario) {
  const points = [];
  const push = (t, v) => points.push({ time: t, value: parseFloat(v.toFixed(1)) });

  if (scenario === "pizza") {
    for (let t = 0; t <= 60; t += 10) push(t, 7 + Math.random()*0.3);
    for (let t = 70; t <= 180; t += 10) push(t, 7.2 + (t-70)*0.01 + Math.random()*0.3);
    for (let t = 190; t <= 360; t += 10) push(t, 8 + (t-190)*0.04 + Math.random()*0.4);
    for (let t = 370; t <= 480; t += 10) push(t, 14 - (t-370)*0.025 + Math.random()*0.3);
  } else if (scenario === "exercise-spike") {
    for (let t = 0; t <= 120; t += 10) push(t, 8 + Math.random()*0.4);
    for (let t = 130; t <= 240; t += 10) push(t, 8.5 + (t-130)*0.05 + Math.random()*0.3);
    for (let t = 250; t <= 360; t += 10) push(t, 14.5 - (t-250)*0.04 + Math.random()*0.3);
    for (let t = 370; t <= 480; t += 10) push(t, 10 - (t-370)*0.015 + Math.random()*0.3);
  } else if (scenario === "dawn") {
    for (let t = 0; t <= 180; t += 10) push(t, 7.5 - Math.random()*0.2);
    for (let t = 190; t <= 480; t += 10) push(t, 7.2 + (t-190)*0.018 + Math.random()*0.3);
  } else if (scenario === "overnight-low") {
    for (let t = 0; t <= 120; t += 10) push(t, 8 + Math.random()*0.3);
    for (let t = 130; t <= 300; t += 10) push(t, 8 - (t-130)*0.02 + Math.random()*0.3);
    for (let t = 310; t <= 480; t += 10) push(t, 3.8 + Math.random()*0.4);
  } else { // rollercoaster
    for (let t = 0; t <= 80; t += 10) push(t, 6 + (t/80)*5 + Math.random()*0.4);
    for (let t = 90; t <= 160; t += 10) push(t, 11 - (t-90)*0.08 + Math.random()*0.4);
    for (let t = 170; t <= 250; t += 10) push(t, 4.5 + (t-170)*0.06 + Math.random()*0.3);
    for (let t = 260; t <= 360; t += 10) push(t, 9 + Math.random()*0.4);
    for (let t = 370; t <= 480; t += 10) push(t, 9 - (t-370)*0.01 + Math.random()*0.3);
  }
  return points;
}

// ─── Mini CGM Chart ───────────────────────────────────────────────────────────
function CGMChart({ readings, mealTime, activityTime }) {
  if (!readings || readings.length === 0) return null;
  const W = 560, H = 160, PAD = { l: 40, r: 16, t: 12, b: 28 };
  const vals = readings.map(r => r.value);
  const times = readings.map(r => r.time);
  const minV = Math.max(0, Math.min(...vals) - 1);
  const maxV = Math.max(...vals) + 1;
  const minT = times[0], maxT = times[times.length - 1];

  const px = t => PAD.l + ((t - minT) / (maxT - minT)) * (W - PAD.l - PAD.r);
  const py = v => PAD.t + (1 - (v - minV) / (maxV - minV)) * (H - PAD.t - PAD.b);

  const low = py(3.9), high = py(10);
  const points = readings.map(r => `${px(r.time)},${py(r.value)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", borderRadius: 12, background: "#FAFAF9" }}>
      {/* Range band */}
      <rect x={PAD.l} y={high} width={W - PAD.l - PAD.r} height={low - high} fill="#EEF8F4" opacity="0.8" />
      {/* Range lines */}
      <line x1={PAD.l} y1={high} x2={W - PAD.r} y2={high} stroke="#56C596" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
      <line x1={PAD.l} y1={low}  x2={W - PAD.r} y2={low}  stroke="#F46036" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
      {/* Labels */}
      <text x={PAD.l - 4} y={high + 4} textAnchor="end" fontSize="9" fill="#56C596">10</text>
      <text x={PAD.l - 4} y={low  + 4} textAnchor="end" fontSize="9" fill="#F46036">4</text>
      {/* Meal marker */}
      {mealTime && <line x1={px(mealTime)} y1={PAD.t} x2={px(mealTime)} y2={H - PAD.b} stroke="#FFD166" strokeWidth="2" />}
      {mealTime && <text x={px(mealTime)} y={PAD.t - 2} textAnchor="middle" fontSize="9" fill="#F46036">🍽️</text>}
      {/* Activity marker */}
      {activityTime && <line x1={px(activityTime)} y1={PAD.t} x2={px(activityTime)} y2={H - PAD.b} stroke="#9B8EC4" strokeWidth="2" />}
      {activityTime && <text x={px(activityTime)} y={PAD.t - 2} textAnchor="middle" fontSize="9" fill="#9B8EC4">⚽</text>}
      {/* CGM line */}
      <polyline points={points} fill="none" stroke="#2E86AB" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots for lows */}
      {readings.filter(r => r.value < 3.9).map((r, i) => (
        <circle key={i} cx={px(r.time)} cy={py(r.value)} r="4" fill="#F46036" />
      ))}
    </svg>
  );
}

// ─── Confidence Badge ─────────────────────────────────────────────────────────
function ConfBadge({ score }) {
  const color = score >= 75 ? COLORS.mint : score >= 55 ? COLORS.sunshine : COLORS.muted;
  const label = score >= 75 ? "Strong match" : score >= 55 ? "Possible match" : "Weak signal";
  return (
    <span style={{ background: color + "22", color, fontSize: "0.7rem", fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", letterSpacing: 0.5 }}>
      {label} · {score}%
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExplainMyGlucose() {
  const STEPS = ["load", "context", "result", "feedback"];
  const [step, setStep] = useState("load");
  const [readings, setReadings] = useState(null);
  const [demoScenario, setDemoScenario] = useState(null);
  const [ctx, setCtx] = useState({
    mealTime: "", mealType: "", insulinTiming: "",
    activityTime: "", activityLevel: "",
    sick: false, schoolDay: false, pumpSiteChanged: null,
    snackAfterActivity: null,
  });
  const [patterns, setPatterns] = useState([]);
  const [openPattern, setOpenPattern] = useState(null);
  const [feedback, setFeedback] = useState({ helpful: null, likelyDriver: null, unusual: "" });
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const DEMOS = [
    { id: "pizza",          label: "Pizza dinner spike",         emoji: "🍕", ctx: { mealTime: "60", mealType: "highfat", insulinTiming: "at", activityLevel: "none" } },
    { id: "exercise-spike", label: "Exercise raises glucose",    emoji: "⚽", ctx: { activityTime: "120", activityLevel: "intense", mealTime: "30", mealType: "mixed", insulinTiming: "before" } },
    { id: "dawn",           label: "Overnight rise",             emoji: "🌙", ctx: { activityLevel: "none" } },
    { id: "overnight-low",  label: "Post-sport night low",       emoji: "📉", ctx: { activityTime: "120", activityLevel: "intense", snackAfterActivity: false } },
    { id: "rollercoaster",  label: "Rollercoaster day",          emoji: "🎢", ctx: { mealTime: "60", mealType: "fast", insulinTiming: "after", activityLevel: "light" } },
  ];

  const loadDemo = (demo) => {
    const data = generateDemoData(demo.id);
    setReadings(data);
    setCtx(prev => ({ ...prev, ...demo.ctx }));
    setDemoScenario(demo.id);
    setStep("context");
  };

  const runAnalysis = async () => {
    const found = detectPatterns(readings, ctx);
    setPatterns(found);
    setOpenPattern(found[0]?.id || null);
    setAiExplanation(null);
    setAiError(null);
    setStep("result");

    if (found.length === 0) return;

    // Build pattern summary JSON to pass to Claude
    const patternSummary = {
      units: "mmol/L",
      detected_patterns: found.map(p => ({
        label: p.id,
        display_label: p.label,
        confidence_score: p.confidence,
        description: p.description,
        top_drivers: p.drivers.map(d => ({ label: d.label, score: d.score })),
      })),
      context: {
        meal_type: ctx.mealType || "unknown",
        insulin_timing: ctx.insulinTiming || "unknown",
        activity_level: ctx.activityLevel || "unknown",
        illness: ctx.sick ? "yes" : "no",
        pump_site_changed: ctx.pumpSiteChanged === false ? "no" : "unknown",
        snack_after_activity: ctx.snackAfterActivity === false ? "no" : "unknown",
        school_day: ctx.schoolDay ? "yes" : "no",
      },
      safety_flags: {
        severe_low_detected: found.some(p => p.id === "exercise-drop") && Math.min(...readings.map(r=>r.value)) < 3.5,
        persistent_high: found.some(p => p.id === "stubborn-high"),
      }
    };

    setAiLoading(true);
    try {
      const systemPrompt = `You are a warm, supportive educational assistant for families learning to live with Type 1 Diabetes.

RULES — follow these strictly:
- Do NOT provide insulin dosing, medication changes, or treatment instructions of any kind
- Use "possible reasons" and "this might be" language — never state causes as fact
- Tone: calm, empathetic, parent-friendly — like a knowledgeable friend, not a doctor
- Reading level: simple, clear, no medical jargon unless briefly explained
- If safety_flags show severe lows or persistent highs, gently advise following care plan and contacting care team
- Always end with a brief encouragement

OUTPUT FORMAT — return valid JSON only, no markdown fences:
{
  "title": "short friendly title for what happened (max 10 words)",
  "what_happened": "2-3 warm sentences describing the glucose pattern in plain language. Reference mmol/L values if helpful.",
  "likely_reasons": [
    {"reason": "name of reason", "why_this_fits": "1-2 sentences explaining why this might apply, in plain language", "confidence": "high|medium|low"}
  ],
  "what_to_notice_next_time": ["question or observation 1", "question or observation 2", "question or observation 3"],
  "encouragement": "One warm sentence of encouragement for the family.",
  "safety_note": "Brief safety reminder if needed, otherwise empty string."
}

Return 2-3 likely_reasons maximum. Rank most likely first.`;

      const userContent = `Here is the glucose pattern summary for this family. Please explain it warmly and clearly.

${JSON.stringify(patternSummary, null, 2)}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }],
        }),
      });

      const data = await response.json();
      const raw = data.content?.map(b => b.text || "").join("").trim();
      const clean = raw.replace(/^```json|^```|```$/gm, "").trim();
      const parsed = JSON.parse(clean);
      setAiExplanation(parsed);
    } catch (err) {
      setAiError("Could not generate AI explanation — showing standard analysis below.");
    } finally {
      setAiLoading(false);
    }
  };

  const submitFeedback = () => {
    setFeedbackDone(true);
    setTimeout(() => setStep("load"), 2000);
  };

  const reset = () => {
    setStep("load"); setReadings(null); setPatterns([]); setOpenPattern(null);
    setFeedback({ helpful: null, likelyDriver: null, unusual: "" }); setFeedbackDone(false);
    setAiExplanation(null); setAiLoading(false); setAiError(null);
    setCtx({ mealTime: "", mealType: "", insulinTiming: "", activityTime: "", activityLevel: "", sick: false, schoolDay: false, pumpSiteChanged: null, snackAfterActivity: null });
  };

  // ── Step: Load ────────────────────────────────────────────────────────────
  if (step === "load") return (
    <div>
      <div className="section-header">
        <h2>🔎 Explain My Glucose</h2>
        <p>Select a scenario below to see how the pattern detector works — turning a glucose graph into a clear, educational explanation.</p>
      </div>

      <div className="tool-disclaimer">
        <strong>Educational tool only.</strong> This tool identifies glucose patterns and their likely educational explanations. It does not provide dosing advice and does not replace your diabetes care team. Always consult your endocrinologist for treatment decisions.
      </div>

      <div style={{ marginBottom: 28 }}>
        <div className="step-label">Choose a demo scenario to explore</div>
        <div style={{ display: "grid", gap: 12 }}>
          {DEMOS.map(d => (
            <button key={d.id} className="demo-scenario-btn" onClick={() => loadDemo(d)}>
              <span style={{ fontSize: "1.6rem" }}>{d.emoji}</span>
              <div>
                <div style={{ fontWeight: 800, color: COLORS.deep }}>{d.label}</div>
                <div style={{ fontSize: "0.8rem", color: COLORS.muted, marginTop: 2 }}>Tap to load sample CGM data and run pattern analysis</div>
              </div>
              <span style={{ color: COLORS.ocean, fontSize: "1.1rem", marginLeft: "auto" }}>→</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#F7F3EE", borderRadius: 16, padding: "20px 24px" }}>
        <div style={{ fontWeight: 800, fontSize: "0.85rem", color: COLORS.deep, marginBottom: 8 }}>🛣️ What's coming next</div>
        <div style={{ fontSize: "0.85rem", color: "#4A6070", lineHeight: 1.7 }}>
          Future versions will allow direct CGM data connection (Dexcom, Libre) or CSV upload. For now, the demo scenarios show exactly how the pattern detection and explanation engine works.
        </div>
      </div>
    </div>
  );

  // ── Step: Context ─────────────────────────────────────────────────────────
  if (step === "context") return (
    <div>
      <button className="back-btn" onClick={reset}>← Back</button>
      <div className="section-header">
        <h2>📋 Add context</h2>
        <p>A few quick taps make the explanation much more accurate. All fields are optional.</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="step-label">CGM preview</div>
        <CGMChart readings={readings} mealTime={ctx.mealTime ? parseInt(ctx.mealTime) : null} activityTime={ctx.activityTime ? parseInt(ctx.activityTime) : null} />
      </div>

      <div className="context-grid">
        {/* Meal */}
        <div className="context-card">
          <div className="context-card-title">🍽️ Meal type</div>
          {[["fast","Fast carbs (bread, rice, fruit, cereal)"],["mixed","Mixed meal"],["highfat","High-fat meal (pizza, burger, creamy)"],["highprotein","High-protein meal (steak, eggs)"]].map(([val, lab]) => (
            <button key={val} className={`ctx-option ${ctx.mealType === val ? "active" : ""}`} onClick={() => setCtx(p => ({...p, mealType: val}))}>{lab}</button>
          ))}
        </div>

        {/* Insulin timing */}
        <div className="context-card">
          <div className="context-card-title">💉 Insulin given…</div>
          {[["before","Before eating (10–15 min)"],["at","At the start of the meal"],["after","After eating"]].map(([val, lab]) => (
            <button key={val} className={`ctx-option ${ctx.insulinTiming === val ? "active" : ""}`} onClick={() => setCtx(p => ({...p, insulinTiming: val}))}>{lab}</button>
          ))}
        </div>

        {/* Activity */}
        <div className="context-card">
          <div className="context-card-title">⚽ Activity level</div>
          {[["none","No significant activity"],["light","Light activity (walking, play)"],["intense","Intense sport or exercise"]].map(([val, lab]) => (
            <button key={val} className={`ctx-option ${ctx.activityLevel === val ? "active" : ""}`} onClick={() => setCtx(p => ({...p, activityLevel: val}))}>{lab}</button>
          ))}
        </div>

        {/* Toggles */}
        <div className="context-card">
          <div className="context-card-title">🔘 Quick toggles</div>
          {[
            ["sick", "Sick day or illness"],
            ["schoolDay", "School day"],
          ].map(([key, lab]) => (
            <button key={key} className={`ctx-option ${ctx[key] ? "active" : ""}`} onClick={() => setCtx(p => ({...p, [key]: !p[key]}))}>
              {ctx[key] ? "✓ " : ""}{lab}
            </button>
          ))}
          <button className={`ctx-option ${ctx.pumpSiteChanged === false ? "active" : ""}`} onClick={() => setCtx(p => ({...p, pumpSiteChanged: p.pumpSiteChanged === false ? null : false}))}>
            {ctx.pumpSiteChanged === false ? "✓ " : ""}Pump site NOT changed today
          </button>
          <button className={`ctx-option ${ctx.snackAfterActivity === false ? "active" : ""}`} onClick={() => setCtx(p => ({...p, snackAfterActivity: p.snackAfterActivity === false ? null : false}))}>
            {ctx.snackAfterActivity === false ? "✓ " : ""}No snack after activity
          </button>
        </div>
      </div>

      <button className="explain-btn" style={{ width: "100%", padding: "16px", fontSize: "1rem", marginTop: 8 }} onClick={runAnalysis}>
        Analyse this glucose pattern →
      </button>
    </div>
  );

  // ── Step: Result ──────────────────────────────────────────────────────────
  if (step === "result") {
    const active = patterns.find(p => p.id === openPattern);
    const confidenceLabel = score => score >= 75 ? "Strong match" : score >= 55 ? "Possible match" : "Weak signal";
    const confidenceColor = score => score >= 75 ? COLORS.mint : score >= 55 ? COLORS.sunshine : COLORS.muted;

    return (
      <div>
        <button className="back-btn" onClick={() => setStep("context")}>← Adjust context</button>

        <div style={{ marginBottom: 20 }}>
          <CGMChart readings={readings} mealTime={ctx.mealTime ? parseInt(ctx.mealTime) : null} activityTime={ctx.activityTime ? parseInt(ctx.activityTime) : null} />
        </div>

        {patterns.length === 0 ? (
          <div style={{ background: "#EEF8F4", borderRadius: 16, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 800, color: COLORS.deep }}>No significant patterns detected</div>
            <div style={{ fontSize: "0.9rem", color: "#4A6070", marginTop: 8 }}>The glucose trace looks relatively stable. Try adding more context above, or explore a different scenario.</div>
          </div>
        ) : (
          <>
            {/* ── AI EXPLANATION — shown first and prominently ── */}
            {aiLoading && (
              <div className="ai-loading-panel">
                <div className="ai-loading-pulse" />
                <div>
                  <div style={{ fontWeight: 800, color: COLORS.deep, marginBottom: 4 }}>Generating explanation…</div>
                  <div style={{ fontSize: "0.82rem", color: COLORS.muted }}>Analysing the pattern and context to create a personalised explanation for your family.</div>
                </div>
              </div>
            )}

            {aiError && (
              <div className="tool-disclaimer" style={{ marginBottom: 16 }}>{aiError}</div>
            )}

            {aiExplanation && !aiLoading && (
              <div className="ai-explanation-panel">
                <div className="ai-panel-header">
                  <div className="ai-badge">✨ AI-powered explanation</div>
                  <h3 className="ai-title">{aiExplanation.title}</h3>
                </div>

                <div className="ai-section">
                  <div className="ai-section-label">📊 What happened</div>
                  <p className="ai-text">{aiExplanation.what_happened}</p>
                </div>

                <div className="ai-section">
                  <div className="ai-section-label">🔬 Possible reasons <span style={{ fontWeight: 400, color: COLORS.muted, fontSize: "0.75rem" }}>(educational — not medical advice)</span></div>
                  {aiExplanation.likely_reasons?.map((r, i) => {
                    const confColor = r.confidence === "high" ? COLORS.mint : r.confidence === "medium" ? COLORS.sunshine : COLORS.muted;
                    return (
                      <div key={i} className="ai-driver">
                        <div className="ai-driver-rank" style={{ background: COLORS.ocean }}>{i+1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontWeight: 800, fontSize: "0.9rem", color: COLORS.deep }}>{r.reason}</span>
                            <span style={{ fontSize: "0.68rem", fontWeight: 800, background: confColor + "22", color: confColor, padding: "2px 8px", borderRadius: 100, textTransform: "uppercase", letterSpacing: 0.5 }}>{r.confidence}</span>
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#4A6070", lineHeight: 1.55 }}>{r.why_this_fits}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="ai-section">
                  <div className="ai-section-label">💡 What to notice next time</div>
                  {aiExplanation.what_to_notice_next_time?.map((q, i) => (
                    <div key={i} className="next-time-item">
                      <span style={{ color: COLORS.ocean }}>→</span>
                      <span style={{ fontSize: "0.88rem", color: "#2A4A5A", lineHeight: 1.5 }}>{q}</span>
                    </div>
                  ))}
                </div>

                {aiExplanation.encouragement && (
                  <div className="ai-encouragement">
                    💙 {aiExplanation.encouragement}
                  </div>
                )}

                {aiExplanation.safety_note && (
                  <div className="tool-disclaimer" style={{ marginTop: 0 }}>
                    {aiExplanation.safety_note}
                  </div>
                )}
              </div>
            )}

            {/* ── PATTERN DETAIL — shown below AI explanation ── */}
            {!aiLoading && (
              <>
                <div className="step-label" style={{ margin: "24px 0 12px" }}>
                  {patterns.length} pattern{patterns.length > 1 ? "s" : ""} detected by analysis engine
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {patterns.map(p => (
                    <button key={p.id} onClick={() => setOpenPattern(p.id)}
                      style={{ padding: "8px 14px", borderRadius: 100, border: `2px solid ${p.color}`, background: openPattern === p.id ? p.color : "white", color: openPattern === p.id ? "white" : p.color, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.15s" }}>
                      {p.emoji} {p.label}
                    </button>
                  ))}
                </div>

                {active && (
                  <div className="result-panel" style={{ "--r-color": active.color }}>
                    <div className="result-section">
                      <div className="result-section-head">📊 Pattern detail</div>
                      <p style={{ color: "#2A4A5A", fontSize: "0.9rem", lineHeight: 1.7 }}>{active.description}</p>
                      <div style={{ marginTop: 8 }}>
                        <span style={{ background: confidenceColor(active.confidence) + "22", color: confidenceColor(active.confidence), fontSize: "0.7rem", fontWeight: 800, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", letterSpacing: 0.5 }}>
                          {confidenceLabel(active.confidence)} · {active.confidence}%
                        </span>
                      </div>
                    </div>
                    <div className="result-section">
                      <div className="result-section-head">🔬 Top drivers identified</div>
                      {active.drivers.map((d, i) => (
                        <div key={i} className="driver-item">
                          <div className="driver-rank" style={{ background: active.color }}>{i+1}</div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: "0.88rem", color: COLORS.deep, marginBottom: 2 }}>{d.label}</div>
                            <div style={{ fontSize: "0.82rem", color: "#4A6070", lineHeight: 1.5 }}>{d.explanation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="tool-disclaimer" style={{ marginTop: 0 }}>
                      Educational only. For dosing or treatment decisions, always follow your diabetes care team's guidance.
                    </div>
                  </div>
                )}

                <button className="forum-post-btn" style={{ marginTop: 20, width: "100%" }} onClick={() => setStep("feedback")}>
                  Was this helpful? Give 10 seconds of feedback →
                </button>
              </>
            )}
          </>
        )}
      </div>
    );
  }

  // ── Step: Feedback (Learning Loop) ───────────────────────────────────────
  if (step === "feedback") {
    if (feedbackDone) return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>💙</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: COLORS.deep, marginBottom: 8 }}>Thank you — that helps us improve.</div>
        <div style={{ color: COLORS.muted, fontSize: "0.9rem" }}>Returning to the start…</div>
      </div>
    );

    const topPattern = patterns[0];
    return (
      <div>
        <div className="section-header">
          <h2>💬 Quick feedback</h2>
          <p>10 seconds. Helps us make the explanations better for every family.</p>
        </div>

        <div className="feedback-card">
          <div className="feedback-q">Was this explanation helpful?</div>
          <div style={{ display: "flex", gap: 12 }}>
            {["Yes — it made sense", "Partially", "No — it didn't match"].map(opt => (
              <button key={opt} className={`ctx-option ${feedback.helpful === opt ? "active" : ""}`}
                style={{ flex: 1 }} onClick={() => setFeedback(p => ({...p, helpful: opt}))}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {topPattern && (
          <div className="feedback-card">
            <div className="feedback-q">Which reason seems most likely to you?</div>
            {topPattern.drivers.map((d, i) => (
              <button key={i} className={`ctx-option ${feedback.likelyDriver === d.label ? "active" : ""}`}
                onClick={() => setFeedback(p => ({...p, likelyDriver: d.label}))}>
                {d.label}
              </button>
            ))}
            <button className={`ctx-option ${feedback.likelyDriver === "unsure" ? "active" : ""}`}
              onClick={() => setFeedback(p => ({...p, likelyDriver: "unsure"}))}>
              Not sure
            </button>
          </div>
        )}

        <div className="feedback-card">
          <div className="feedback-q">Anything unusual that day? <span style={{ fontWeight: 400, color: COLORS.muted }}>(optional)</span></div>
          <input className="forum-input" style={{ width: "100%", marginTop: 8 }}
            placeholder="e.g. illness, stress, party, new infusion site, different meal..."
            value={feedback.unusual}
            onChange={e => setFeedback(p => ({...p, unusual: e.target.value}))} />
        </div>

        <button className="forum-post-btn" style={{ width: "100%", padding: 16, fontSize: "1rem" }} onClick={submitFeedback}>
          Submit feedback →
        </button>
        <button onClick={reset} style={{ display: "block", width: "100%", marginTop: 10, background: "none", border: "none", color: COLORS.muted, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", padding: 10 }}>
          Skip and start over
        </button>
      </div>
    );
  }

  return null;
}
