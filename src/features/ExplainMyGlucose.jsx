import { useState } from "react";
import { patternStore } from "./patternStore";

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
    add("High-intensity activity", "Sprinting, competitive sport, and high-intensity intervals release hormones — which signal the liver to release stored glucose for emergency fuel.", 92);
    add("Exercise stress hormones", "Competition stress amplifies the exercise hormone effect, even beyond the physical activity itself.", 75);
    if (ctx.activityLevel === "intense") add("Anaerobic effort", "Short explosive efforts are more likely to raise glucose than sustained exercise.", 85);
  }

  if (patternId === "exercise-drop") {
    add("Muscle glycogen replenishment", "After exercise, muscles absorb glucose from the bloodstream to refill energy stores. This process continues for up to 12 hours — often through the night.", 90);
    if (!ctx.snackAfterActivity) add("No post-exercise snack", "A carb + protein snack after activity helps buffer the prolonged glucose-lowering effect of exercise.", 70);
    if (ctx.activityLevel === "intense") add("High-volume exercise", "Longer or more intense sessions deplete glycogen more completely, extending the glucose absorption period.", 80);
  }

  if (patternId === "dawn-phenomenon") {
    add("Growth hormone (dawn phenomenon)", "The body releases growth hormone during deep sleep — especially in children. This temporarily reduces insulin effectiveness, causing glucose to rise.", 88);
    add("Morning hormone rise", "Hormones increase in the early morning hours to prepare the body for waking. It raises insulin resistance, contributing to morning glucose rises.", 75);
    if (ctx.activityLevel === "intense") add("Previous day's exercise may rule out Somogyi effect", "Note: intense activity earlier can cause overnight lows and a rebound rise. CGM data helps distinguish this from the dawn phenomenon.", 60);
  }

  if (patternId === "stubborn-high") {
    if (ctx.sick)                  add("Illness", "Illness triggers significant stress hormones that raise both glucose production and insulin resistance. The same insulin dose works less effectively when unwell.", 95);
    if (ctx.pumpSiteChanged === false) add("Pump infusion site", "A site that hasn't been changed recently, or is blocked/kinked, can prevent insulin from entering the body effectively.", 88);
    add("Insulin resistance", "Persistent highs that don't respond to correction often indicate elevated insulin resistance — from illness, hormones, or stress.", 72);
    if (magnitude > 18) add("Ketone check advised", "Glucose above 18 mmol/L that is not responding warrants an immediate ketone check. Contact your diabetes care team if ketones are present.", 90);
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
function CGMChart({ readings, mealTime, activityTime, highlight }) {
  if (!readings || readings.length === 0) return null;
  const W = 560, H = 160, PAD = { l: 40, r: 16, t: 20, b: 28 };
  const vals = readings.map(r => r.value);
  const times = readings.map(r => r.time);
  const minV = Math.max(0, Math.min(...vals) - 1);
  const maxV = Math.max(...vals) + 1;
  const minT = times[0], maxT = times[times.length - 1];

  const px = t => PAD.l + ((t - minT) / (maxT - minT)) * (W - PAD.l - PAD.r);
  const py = v => PAD.t + (1 - (v - minV) / (maxV - minV)) * (H - PAD.t - PAD.b);

  const low = py(3.9), high = py(10);
  const points = readings.map(r => `${px(r.time)},${py(r.value)}`).join(" ");

  // Compute highlight region from detected pattern if present
  const hl = highlight || (() => {
    if (!readings || readings.length < 4) return null;
    // Find the region with the steepest sustained rise or the lowest point
    let maxRise = 0, hlStart = null, hlEnd = null;
    for (let i = 1; i < readings.length - 1; i++) {
      const rise = readings[i + 1].value - readings[i - 1].value;
      if (rise > maxRise) { maxRise = rise; hlStart = readings[i - 1].time; hlEnd = readings[Math.min(i + 3, readings.length - 1)].time; }
    }
    // Also check for significant lows
    const minVal = Math.min(...vals);
    if (minVal < 4.5) {
      const lowIdx = vals.indexOf(minVal);
      return { startT: readings[Math.max(0, lowIdx - 2)].time, endT: readings[Math.min(readings.length - 1, lowIdx + 2)].time, label: "Pattern detected", color: "#F46036" };
    }
    if (maxRise > 2 && hlStart !== null) return { startT: hlStart, endT: hlEnd, label: "Pattern detected", color: "#F46036" };
    return null;
  })();

  return (
    <div style={{ position: "relative" }}>
      {hl && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "flex-end",
          padding: "4px 8px", zIndex: 2, pointerEvents: "none",
        }}>
          <span style={{ background: "#F46036", color: "white", fontSize: "0.65rem", fontWeight: 900, padding: "2px 8px", borderRadius: 99, letterSpacing: 0.5 }}>
            ● {hl.label}
          </span>
        </div>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", borderRadius: 12, background: "#FAFAF9", display: "block" }}>
        {/* Range band */}
        <rect x={PAD.l} y={high} width={W - PAD.l - PAD.r} height={low - high} fill="#EEF8F4" opacity="0.8" />
        {/* Highlight region */}
        {hl && (
          <>
            <rect
              x={px(hl.startT)} y={PAD.t}
              width={px(hl.endT) - px(hl.startT)} height={H - PAD.t - PAD.b}
              fill={hl.color || "#F46036"} fillOpacity="0.1"
              stroke={hl.color || "#F46036"} strokeWidth="1.5" strokeDasharray="4,3"
              rx="4"
            />
            <line x1={px(hl.startT)} y1={PAD.t} x2={px(hl.startT)} y2={H - PAD.b} stroke={hl.color || "#F46036"} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
            <line x1={px(hl.endT)}   y1={PAD.t} x2={px(hl.endT)}   y2={H - PAD.b} stroke={hl.color || "#F46036"} strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7" />
          </>
        )}
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
    </div>
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

// ─── Similar Patterns Data ────────────────────────────────────────────────────
const SIMILAR_PATTERNS = {
  "post-meal-spike": [
    { emoji: "🍕", label: "High-fat meals (pizza, burgers, pasta with cream)" },
    { emoji: "🍞", label: "Large carbohydrate portions without early insulin" },
    { emoji: "💉", label: "Insulin given after the meal rather than before" },
    { emoji: "😰", label: "Stressful day — stress hormones slow insulin action" },
  ],
  "pizza-effect": [
    { emoji: "🍕", label: "Pizza, burgers, or any high-fat meal" },
    { emoji: "🧀", label: "Creamy pasta, cheese-heavy dishes, fried food" },
    { emoji: "🌙", label: "After-dinner glucose rising hours after eating" },
    { emoji: "⏰", label: "Insulin peaked too early for the delayed carb absorption" },
  ],
  "exercise-spike": [
    { emoji: "⚽", label: "Intense sport or competitive exercise" },
    { emoji: "🏃", label: "Sprint training, HIIT, or high-adrenaline activity" },
    { emoji: "😤", label: "Excitement or competition nerves before sport" },
    { emoji: "💪", label: "Resistance training (weights, gymnastics)" },
  ],
  "exercise-drop": [
    { emoji: "⚽", label: "Aerobic sport (football, swimming, running, cycling)" },
    { emoji: "🌙", label: "Overnight after afternoon or evening exercise" },
    { emoji: "🍫", label: "No snack given after activity" },
    { emoji: "⏳", label: "Muscles still absorbing glucose hours after activity" },
  ],
  "dawn-phenomenon": [
    { emoji: "🌙", label: "Overnight rise starting from around 2–4 AM" },
    { emoji: "📈", label: "Growth hormone released during deep sleep" },
    { emoji: "🧒", label: "Very common in children and teenagers" },
    { emoji: "🌅", label: "Waking up with higher glucose than bedtime" },
  ],
  "stubborn-high": [
    { emoji: "🤒", label: "Mild illness or infection (even without obvious symptoms)" },
    { emoji: "😰", label: "Stress, exams, or emotional upset" },
    { emoji: "📈", label: "Growth spurt — insulin needs can change rapidly" },
    { emoji: "💉", label: "Pump site issue — blocked cannula or poor absorption" },
  ],
  "rollercoaster": [
    { emoji: "🍬", label: "Fast-acting carbs followed by aggressive correction" },
    { emoji: "💉", label: "Insulin stacking — too much insulin too close together" },
    { emoji: "🍕", label: "Mixed meals with both fast and slow carbs" },
    { emoji: "⚽", label: "Active day with variable insulin sensitivity" },
  ],
  "screenshot": [
    { emoji: "🍽️", label: "Meals in the hours before the pattern" },
    { emoji: "⚽", label: "Physical activity earlier in the day" },
    { emoji: "🌙", label: "Overnight hormone changes during sleep" },
    { emoji: "🤒", label: "Illness, stress, or disruption to routine" },
  ],
};

// ─── Shared 5-Part Explanation Panel ────────────────────────────────────────────
// Used by both screenshot result and demo result steps.
// Always renders the same trusted structure regardless of input source.

function ExplanationPanel({ explanation, source, onFeedback, patternIds }) {
  if (!explanation) return null;
  const { title, what_happened, likely_reasons, what_families_notice, what_to_notice_next_time, encouragement, safety_note } = explanation;

  // Pick similar patterns from the first detected pattern id, fallback to screenshot
  const similarKey = (patternIds && patternIds[0]) || source || "screenshot";
  const similarItems = SIMILAR_PATTERNS[similarKey] || SIMILAR_PATTERNS["screenshot"];

  return (
    <div className="exp-panel">

      {/* Header */}
      <div className="exp-header">
        <div className="exp-source-badge">
          {source === "screenshot" ? "📸 Screenshot analysis" : "✨ Pattern analysis"}
        </div>
        <h3 className="exp-title">{title}</h3>
      </div>

      {/* Part 1 — What happened */}
      <div className="exp-section exp-section--1">
        <div className="exp-section-num">1</div>
        <div className="exp-section-body">
          <div className="exp-section-label">What happened</div>
          <p className="exp-narrative">{what_happened}</p>
        </div>
      </div>

      {/* Part 2 — Possible reasons */}
      {likely_reasons?.length > 0 && (
        <div className="exp-section exp-section--2">
          <div className="exp-section-num">2</div>
          <div className="exp-section-body">
            <div className="exp-section-label">
              Possible reasons
              <span className="exp-not-advice">— educational, not medical advice</span>
            </div>
            <div className="exp-reasons">
              {likely_reasons.map((r, i) => {
                const confColor = r.confidence === "high" ? COLORS.mint : r.confidence === "medium" ? COLORS.sunshine : COLORS.muted;
                return (
                  <div key={i} className="exp-reason">
                    <div className="exp-reason-num" style={{ background: confColor }}>{i + 1}</div>
                    <div className="exp-reason-content">
                      <div className="exp-reason-title">{r.reason}</div>
                      <div className="exp-reason-detail">{r.why_this_fits}</div>
                    </div>
                    <span className="exp-conf-badge" style={{ background: confColor + "20", color: confColor }}>
                      {r.confidence}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Part 3 — What families often notice */}
      {what_families_notice && (
        <div className="exp-section exp-section--3">
          <div className="exp-section-num">3</div>
          <div className="exp-section-body">
            <div className="exp-section-label">What families often notice</div>
            <div className="exp-families-notice">
              <span className="exp-families-icon">💬</span>
              <p>{what_families_notice}</p>
            </div>
          </div>
        </div>
      )}

      {/* Part 4 — What to watch next time */}
      {what_to_notice_next_time?.length > 0 && (
        <div className="exp-section exp-section--4">
          <div className="exp-section-num">4</div>
          <div className="exp-section-body">
            <div className="exp-section-label">What to watch next time</div>
            <div className="exp-watch-list">
              {what_to_notice_next_time.map((q, i) => (
                <div key={i} className="exp-watch-item">
                  <span className="exp-watch-bullet">•</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Encouragement */}
      {encouragement && (
        <div className="exp-encouragement">
          💙 {encouragement}
        </div>
      )}

      {/* Part 5 — Safety note (always shown) */}
      <div className="exp-safety">
        <span className="exp-safety-icon">⚕️</span>
        <p>{safety_note || "This explanation is designed to help families understand glucose behaviour. It does not replace advice from your diabetes care team and should not be used to make treatment decisions. Always follow your healthcare provider's guidance."}</p>
      </div>

      {/* Similar patterns families see */}
      <div className="exp-section exp-section--similar">
        <div className="exp-section-num" style={{ background: "#9B8EC4" }}>💬</div>
        <div className="exp-section-body">
          <div className="exp-section-label">Families often see this pattern when…</div>
          <div className="exp-similar-grid">
            {similarItems.map((item, i) => (
              <div key={i} className="exp-similar-item">
                <span className="exp-similar-emoji">{item.emoji}</span>
                <span className="exp-similar-label">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="exp-similar-note">You are not alone — these patterns are seen by families all around the world living with type 1 diabetes.</div>
        </div>
      </div>

      {/* Inline feedback */}
      <InlineFeedback onFeedback={onFeedback} />
    </div>
  );
}

// ─── Inline Feedback Widget ───────────────────────────────────────────────────
function InlineFeedback({ onFeedback }) {
  const [answer, setAnswer] = useState(null);
  const [reason, setReason] = useState(null);
  const [done, setDone] = useState(false);

  const NOT_REALLY_OPTIONS = [
    "Meal timing was wrong",
    "Activity level was missing",
    "Illness wasn't considered",
    "The explanation didn't match",
    "Something else",
  ];

  if (done) return (
    <div className="exp-feedback exp-feedback--done">
      💙 Thank you — your feedback helps us improve for every family.
    </div>
  );

  return (
    <div className="exp-feedback">
      <div className="exp-feedback-q">Was this explanation helpful?</div>
      <div className="exp-feedback-btns">
        <button
          className={`exp-fb-btn ${answer === "yes" ? "yes" : ""}`}
          onClick={() => { setAnswer("yes"); setDone(true); if (onFeedback) onFeedback("yes", null); }}
        >
          ✔ Yes
        </button>
        <button
          className={`exp-fb-btn ${answer === "no" ? "no" : ""}`}
          onClick={() => setAnswer("no")}
        >
          ✖ Not really
        </button>
      </div>
      {answer === "no" && !done && (
        <div className="exp-feedback-reasons">
          <div className="exp-feedback-why">What was missing or incorrect?</div>
          <div className="exp-feedback-reason-grid">
            {NOT_REALLY_OPTIONS.map(opt => (
              <button
                key={opt}
                className={`exp-fb-reason ${reason === opt ? "active" : ""}`}
                onClick={() => setReason(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <button className="exp-fb-submit" onClick={() => { setDone(true); if (onFeedback) onFeedback("no", reason); }}>
            Send feedback →
          </button>
        </div>
      )}
    </div>
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
  const [uploadMode, setUploadMode] = useState(false);
  const [uploadImage, setUploadImage] = useState(null);   // base64 data URL
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const DEMOS = [
    { id: "pizza",          label: "Spike hours after dinner",          emoji: "🍕", sub: "High-fat meal — delayed rise", ctx: { mealTime: "60", mealType: "highfat", insulinTiming: "at", activityLevel: "none" } },
    { id: "exercise-spike", label: "Glucose went up after sport",       emoji: "⚡", sub: "Intense exercise — stress response", ctx: { activityTime: "120", activityLevel: "intense", mealTime: "30", mealType: "mixed", insulinTiming: "before" } },
    { id: "dawn",           label: "Glucose rose overnight",            emoji: "🌙", sub: "Dawn phenomenon — hormones during sleep", ctx: { activityLevel: "none" } },
    { id: "overnight-low",  label: "Low glucose after a sport day",     emoji: "📉", sub: "Delayed exercise effect overnight", ctx: { activityTime: "120", activityLevel: "intense", snackAfterActivity: false } },
    { id: "rollercoaster",  label: "Up and down all day",               emoji: "🎢", sub: "Fast carbs and variable insulin timing", ctx: { mealTime: "60", mealType: "fast", insulinTiming: "after", activityLevel: "light" } },
  ];

  const saveFeedbackEntry = (vote, reason) => {
    if (!aiExplanation) return;
    patternStore.add({
      source: uploadImage ? "screenshot" : "demo",
      title: aiExplanation.title,
      what_happened: aiExplanation.what_happened,
      likely_reasons: aiExplanation.likely_reasons,
      patternIds: patterns.length > 0
        ? patterns.map(p => p.id)
        : ["screenshot"],
      feedback: vote,
      feedbackReason: reason,
    });
  };

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

OUTPUT FORMAT — return valid JSON only, no markdown fences:
{
  "title": "short friendly title for what happened (max 10 words)",
  "what_happened": "2-3 warm sentences describing the glucose pattern in plain language. Be specific — reference approximate values and time windows.",
  "likely_reasons": [
    {"reason": "name of reason", "why_this_fits": "1-2 plain sentences explaining why this might apply", "confidence": "high|medium|low"}
  ],
  "what_families_notice": "1-2 sentences describing what families commonly observe with this pattern in real life. Should sound like a real parent's observation, not clinical language. E.g. 'Many families notice this kind of delayed rise after pizza or takeaway nights — the spike often surprises them because glucose looked fine right after dinner.'",
  "what_to_notice_next_time": ["question or observation 1", "question or observation 2", "question or observation 3"],
  "encouragement": "One warm sentence of encouragement for the family.",
  "safety_note": "This explanation is educational and does not replace advice from your diabetes care team. Always follow the guidance of your healthcare provider."
}

Return 2-3 likely_reasons maximum. Rank most likely first.`;

      const userContent = `Here is the glucose pattern summary for this family. Please explain it warmly and clearly.

${JSON.stringify(patternSummary, null, 2)}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: userContent }],
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(`API ${response.status}: ${errBody?.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const raw = data.content?.map(b => b.text || "").join("").trim();
      const clean = raw.replace(/^```json|^```|```$/gm, "").trim();
      const parsed = JSON.parse(clean);
      setAiExplanation(parsed);
    } catch (err) {
      console.error("AI explanation error:", err);
      setAiError(`Could not generate explanation: ${err.message}`);
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
    setUploadMode(false); setUploadImage(null); setUploadLoading(false); setUploadError(null);
    setCtx({ mealTime: "", mealType: "", insulinTiming: "", activityTime: "", activityLevel: "", sick: false, schoolDay: false, pumpSiteChanged: null, snackAfterActivity: null });
  };

  // Handle file selection → base64
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError("Please select an image file (PNG, JPG, etc.)"); return; }
    if (file.size > 8 * 1024 * 1024) { setUploadError("Image is too large — please use a screenshot under 8MB."); return; }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Send screenshot to Claude Vision → extract pattern → set AI explanation directly
  const analyseScreenshot = async () => {
    if (!uploadImage) return;
    setUploadLoading(true);
    setUploadError(null);
    setAiExplanation(null);

    try {
      const base64 = uploadImage.split(",")[1];
      const mimeType = uploadImage.split(";")[0].split(":")[1];

      const systemPrompt = `You are a warm, supportive educational assistant for families living with Type 1 Diabetes.
You will be shown a CGM (Continuous Glucose Monitor) screenshot. Your job is to describe what you see in plain, calm, family-friendly language.

STRICT RULES:
- Do NOT give dosing advice, medication recommendations, or any treatment instructions
- Use "possible reasons" language throughout — never state causes as facts
- Tone: calm, reassuring, like a knowledgeable friend — not a doctor
- If the image does not appear to be a CGM graph, say so gently and ask the user to upload a CGM screenshot

Return ONLY valid JSON (no markdown fences, no preamble):
{
  "title": "short friendly title describing what you see (max 10 words)",
  "what_happened": "2-3 warm sentences describing the glucose pattern visible in the graph. Be specific — reference approximate time windows and values if visible. Use mmol/L.",
  "likely_reasons": [
    {"reason": "name of reason", "why_this_fits": "1-2 plain sentences explaining why this might apply", "confidence": "high|medium|low"}
  ],
  "what_families_notice": "1-2 sentences describing what families commonly observe with this pattern in real life. Should sound like a lived observation, not clinical language.",
  "what_to_notice_next_time": ["observation or question 1", "observation or question 2", "observation or question 3"],
  "encouragement": "One warm sentence of encouragement for the family.",
  "safety_note": "This explanation is educational and does not replace advice from your diabetes care team. Always follow the guidance of your healthcare provider.",
  "is_cgm_image": true
}
Return 2-3 likely_reasons. If you cannot see a clear glucose pattern, set is_cgm_image to false and explain in what_happened.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mimeType, data: base64 }
              },
              {
                type: "text",
                text: "Please analyse this CGM screenshot and explain the glucose pattern you can see in plain, warm, family-friendly language. Return JSON only."
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(`API ${response.status}: ${errBody?.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const raw = data.content?.map(b => b.text || "").join("").trim();
      const clean = raw.replace(/^```json|^```|```$/gm, "").trim();
      const parsed = JSON.parse(clean);
      setAiExplanation(parsed);
      setStep("screenshot-result");
    } catch (err) {
      console.error("Screenshot analysis error:", err);
      setUploadError(`Could not analyse the screenshot: ${err.message}`);
    } finally {
      setUploadLoading(false);
    }
  };

  // ── Step: Load ────────────────────────────────────────────────────────────
  if (step === "load") return (
    <div>
      <div className="section-header">
        <h2>🔎 Why did this happen?</h2>
        <p>Select a scenario or upload your own graph — and get a plain-language explanation of what likely caused the pattern.</p>
      </div>

      <div className="finger-prick-note">
        <span>💉</span>
        <span>No CGM? No problem. The demo scenarios work just as well for finger prick families.</span>
      </div>

      {/* ── UPLOAD OPTION — action first ── */}
      <div className="upload-panel">
        <div className="upload-panel-header">
          <span style={{ fontSize: "1.8rem" }}>📸</span>
          <div>
            <div className="upload-panel-title">Upload a CGM screenshot</div>
            <div className="upload-panel-sub">Take a screenshot of your Dexcom, Libre, or any CGM app and upload it here for an explanation.</div>
          </div>
        </div>

        {!uploadImage ? (
          <label className="upload-dropzone">
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileSelect} />
            <div className="upload-dropzone-icon">⬆️</div>
            <div className="upload-dropzone-label">Tap to choose a screenshot</div>
            <div className="upload-dropzone-sub">PNG, JPG · Max 8MB</div>
          </label>
        ) : (
          <div className="upload-preview-wrap">
            <img src={uploadImage} alt="CGM screenshot" className="upload-preview-img" />
            <div className="upload-preview-actions">
              {uploadLoading ? (
                <div className="upload-analysing">
                  <div className="ai-loading-pulse" style={{ width: 28, height: 28 }} />
                  <span>Analysing your screenshot…</span>
                </div>
              ) : (
                <>
                  <button className="explain-btn" onClick={analyseScreenshot}>
                    Explain this graph →
                  </button>
                  <button className="back-btn" style={{ marginTop: 8 }} onClick={() => { setUploadImage(null); setUploadError(null); }}>
                    ← Choose a different image
                  </button>
                </>
              )}
            </div>
            {uploadError && <div className="upload-error">{uploadError}</div>}
          </div>
        )}
        {uploadError && !uploadImage && <div className="upload-error">{uploadError}</div>}

        <div className="upload-trust-notes">
          <div className="upload-trust-row">
            <span>🔒</span><span>Your CGM image is analysed only to explain patterns and is not stored or shared.</span>
          </div>
          <div className="upload-trust-row">
            <span>⚕️</span><span>This tool supports learning about glucose behaviour. It does not replace advice from your diabetes care team.</span>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="upload-divider">
        <span>recognise one of these?</span>
      </div>

      {/* ── DEMO SCENARIOS — secondary ── */}
      <div style={{ display: "grid", gap: 10 }}>
        {DEMOS.map(d => (
          <button key={d.id} className="demo-scenario-btn" onClick={() => loadDemo(d)}>
            <span style={{ fontSize: "1.5rem" }}>{d.emoji}</span>
            <div>
              <div style={{ fontWeight: 800, color: COLORS.deep, fontSize: "0.9rem" }}>{d.label}</div>
              <div style={{ fontSize: "0.78rem", color: COLORS.muted, marginTop: 2 }}>{d.sub}</div>
            </div>
            <span style={{ color: COLORS.ocean, fontSize: "1.1rem", marginLeft: "auto" }}>→</span>
          </button>
        ))}
      </div>

      {/* ── EDUCATION LAST — pattern library and context ── */}
      <div className="upload-divider" style={{ marginTop: 24 }}>
        <span>want to understand the patterns first?</span>
      </div>

      {/* ── PATTERN LIBRARY OVERVIEW ── */}
      <div className="tool-pattern-library">
        <div className="tool-pattern-library-title">8 patterns families ask about most</div>
        <p className="tool-pattern-library-sub">Every one of these has a clear explanation. Tap a demo above to explore any of them.</p>
        <img
          src="/pattern-library.png"
          alt="8 common CGM glucose patterns including pizza spike, exercise low, overnight rise and more"
          className="tool-pattern-library-img"
        />
      </div>

      {/* ── REAL EXAMPLE CHARTS ── */}
      <div className="tool-examples-wrap">
        <div className="tool-examples-label">Real examples — tap to load the explanation</div>
        <div className="tool-examples-grid">
          {[
            { src: "/pizza-effect-example.png", alt: "Pizza effect CGM graph", caption: "🍕 Delayed spike after pizza dinner", tag: "Pizza effect", demo: 0 },
            { src: "/soccer-effect-example.png", alt: "Soccer training glucose rise", caption: "⚽ Glucose rise after soccer training", tag: "Exercise spike", demo: 1 },
            { src: "/overnight-effect-example.png", alt: "Overnight glucose rise CGM graph", caption: "🌙 Steady rise during sleep — dawn phenomenon", tag: "Overnight rise", demo: 2 },
            { src: "/soccer-drop-example.png", alt: "Glucose drop during soccer training", caption: "📉 Glucose falling during sport — hypo risk", tag: "Exercise drop", demo: 3 },
          ].map((ex, i) => (
            <div key={i} className="tool-example-card" onClick={() => loadDemo(DEMOS[ex.demo])}>
              <img src={ex.src} alt={ex.alt} className="tool-example-img" />
              <div className="tool-example-footer">
                <span className="tool-example-tag">{ex.tag}</span>
                <span className="tool-example-caption">{ex.caption}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="tool-examples-note">Tap any example to explore the pattern.</p>
      </div>

      {/* ── CONTEXT EXPLAINER — moved to bottom ── */}
      <div className="tool-context-block">
        <div className="tool-context-patterns-label">This tool helps explain</div>
        <div className="tool-context-patterns">
          {[
            { emoji: "🍕", text: "Delayed spikes after high-fat meals" },
            { emoji: "⚽", text: "Blood glucose rises after intense exercise" },
            { emoji: "🌙", text: "Overnight hormone effects" },
            { emoji: "📉", text: "Delayed lows hours after activity" },
            { emoji: "🤒", text: "Illness raising blood glucose unexpectedly" },
            { emoji: "🌅", text: "Dawn phenomenon — early morning rises" },
          ].map((p, i) => (
            <div key={i} className="tool-context-pattern">
              <span>{p.emoji}</span><span>{p.text}</span>
            </div>
          ))}
        </div>
        <div className="tool-context-goal">
          The goal is to help families understand patterns and build confidence over time.
        </div>
      </div>
    </div>
  );
  );

  // ── Step: Screenshot Result ────────────────────────────────────────────────
  if (step === "screenshot-result") return (
    <div>
      <button className="back-btn" onClick={reset}>← Upload a different screenshot</button>

      {uploadImage && (
        <div style={{ marginBottom: 20 }}>
          <div className="step-label">Your CGM screenshot</div>
          <img src={uploadImage} alt="CGM screenshot" style={{ width: "100%", borderRadius: 14, maxHeight: 260, objectFit: "contain", background: "#F7F3EE", border: "1px solid #E8E4DF" }} />
        </div>
      )}

      {uploadLoading && (
        <div className="ai-loading-panel">
          <div className="ai-loading-pulse" />
          <div>
            <div style={{ fontWeight: 800, color: COLORS.deep, marginBottom: 4 }}>Reading your screenshot…</div>
            <div style={{ fontSize: "0.82rem", color: COLORS.muted }}>Looking at the graph and building an explanation for your family.</div>
          </div>
        </div>
      )}

      {uploadError && <div className="upload-error" style={{ marginTop: 8 }}>{uploadError}</div>}

      <ExplanationPanel explanation={aiExplanation} source="screenshot" onFeedback={saveFeedbackEntry} patternIds={["screenshot"]} />
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

  // ── Step: Result (demo analysis) ─────────────────────────────────────────
  if (step === "result") return (
    <div>
      <button className="back-btn" onClick={() => setStep("context")}>← Adjust context</button>

      <div style={{ marginBottom: 20 }}>
        <CGMChart readings={readings} mealTime={ctx.mealTime ? parseInt(ctx.mealTime) : null} activityTime={ctx.activityTime ? parseInt(ctx.activityTime) : null} />
      </div>

      {patterns.length === 0 ? (
        <div style={{ background: "#EEF8F4", borderRadius: 16, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>✅</div>
          <div style={{ fontWeight: 800, color: COLORS.deep }}>No significant patterns detected</div>
          <div style={{ fontSize: "0.9rem", color: "#4A6070", marginTop: 8 }}>The glucose trace looks relatively stable. Try adding more context, or explore a different scenario.</div>
        </div>
      ) : (
        <>
          {aiLoading && (
            <div className="ai-loading-panel">
              <div className="ai-loading-pulse" />
              <div>
                <div style={{ fontWeight: 800, color: COLORS.deep, marginBottom: 4 }}>Building your explanation…</div>
                <div style={{ fontSize: "0.82rem", color: COLORS.muted }}>Analysing the pattern and context to create a clear explanation for your family.</div>
              </div>
            </div>
          )}
          {aiError && <div className="tool-disclaimer" style={{ marginBottom: 12 }}>{aiError}</div>}
          {aiExplanation && !aiLoading && (
            <ExplanationPanel explanation={aiExplanation} source="demo" onFeedback={saveFeedbackEntry} patternIds={patterns.map(p => p.id)} />
          )}
        </>
      )}
    </div>
  );

  return null;
}
