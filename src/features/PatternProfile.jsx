import { useState, useEffect } from "react";
import { patternStore } from "./patternStore";

const COLORS = { ocean: "#2E86AB", coral: "#F46036", mint: "#56C596", sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A", muted: "#8A9BB0" };

// ─── Pattern metadata ───────────────────────────────────────────────────────
const PATTERN_META = {
  "early-spike":     { label: "Early meal spike",         emoji: "📈", color: COLORS.coral,     desc: "Glucose rose quickly within the first hour after eating." },
  "delayed-spike":   { label: "Delayed spike",            emoji: "🍕", color: COLORS.sunshine,  desc: "Glucose rose 2–5 hours after eating — often a high-fat meal effect." },
  "exercise-spike":  { label: "Exercise spike",           emoji: "⚽", color: COLORS.ocean,     desc: "Glucose rose during or shortly after intense activity." },
  "exercise-drop":   { label: "Delayed exercise low",     emoji: "📉", color: COLORS.lavender,  desc: "Glucose dropped hours after exercise as muscles replenished glycogen." },
  "dawn":            { label: "Dawn phenomenon",          emoji: "🌙", color: COLORS.ocean,     desc: "Glucose rose gradually overnight, peaking in the early morning." },
  "stubborn-high":   { label: "Persistent high",          emoji: "⬆️", color: COLORS.coral,     desc: "Glucose stayed elevated for an extended period." },
  "rollercoaster":   { label: "Rollercoaster pattern",    emoji: "🎢", color: COLORS.lavender,  desc: "Multiple large swings throughout the day." },
  "screenshot":      { label: "Screenshot analysis",      emoji: "📸", color: COLORS.mint,      desc: "Pattern identified from uploaded CGM screenshot." },
};

// ─── Hook to subscribe to pattern store ────────────────────────────────────
function usePatternStore() {
  const [entries, setEntries] = useState(patternStore.getAll());
  useEffect(() => {
    const unsub = patternStore.subscribe(setEntries);
    return unsub;
  }, []);
  return entries;
}

// ─── Helper: count pattern frequency ───────────────────────────────────────
function buildPatternCounts(entries) {
  const counts = {};
  entries.forEach(e => {
    (e.patternIds || []).forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, count, meta: PATTERN_META[id] || { label: id, emoji: "📊", color: COLORS.muted, desc: "" } }));
}

// ─── Entry card ─────────────────────────────────────────────────────────────
function EntryCard({ entry }) {
  const [open, setOpen] = useState(false);
  const date = new Date(entry.timestamp);
  const timeStr = date.toLocaleDateString("en-AU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const topPattern = entry.patternIds?.[0];
  const meta = topPattern ? (PATTERN_META[topPattern] || PATTERN_META["screenshot"]) : PATTERN_META["screenshot"];

  return (
    <div className="pp-entry" style={{ borderLeftColor: meta.color }}>
      <div className="pp-entry-header" onClick={() => setOpen(o => !o)}>
        <div className="pp-entry-left">
          <span className="pp-entry-emoji">{meta.emoji}</span>
          <div>
            <div className="pp-entry-title">{entry.title || meta.label}</div>
            <div className="pp-entry-time">{timeStr} · {entry.source === "screenshot" ? "Screenshot" : "Demo analysis"}</div>
          </div>
        </div>
        <div className="pp-entry-right">
          {entry.feedback === "yes" && <span className="pp-fb-tag pp-fb-yes">✔ Helpful</span>}
          {entry.feedback === "no"  && <span className="pp-fb-tag pp-fb-no">✖ Not quite</span>}
          <span className="pp-chevron">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {open && (
        <div className="pp-entry-body">
          {entry.what_happened && (
            <div className="pp-entry-section">
              <div className="pp-entry-section-label">What happened</div>
              <p>{entry.what_happened}</p>
            </div>
          )}
          {entry.likely_reasons?.length > 0 && (
            <div className="pp-entry-section">
              <div className="pp-entry-section-label">Possible reasons</div>
              {entry.likely_reasons.map((r, i) => (
                <div key={i} className="pp-reason-row">
                  <span className="pp-reason-num" style={{ background: meta.color }}>{i + 1}</span>
                  <span><strong>{r.reason}</strong> — {r.why_this_fits}</span>
                </div>
              ))}
            </div>
          )}
          {entry.feedbackReason && (
            <div className="pp-entry-section">
              <div className="pp-entry-section-label">Your feedback</div>
              <p style={{ color: COLORS.muted, fontStyle: "italic" }}>"{entry.feedbackReason}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main PatternProfile component ──────────────────────────────────────────
export default function PatternProfile({ onNavigate }) {
  const entries = usePatternStore();
  const patternCounts = buildPatternCounts(entries);
  const helpfulCount = entries.filter(e => e.feedback === "yes").length;
  const totalCount = entries.length;

  if (totalCount === 0) return (
    <div>
      <div className="section-header">
        <h2>🗂️ Your Pattern Profile</h2>
        <p>Your personal glucose behaviour map — built as you use the Explain My Glucose tool.</p>
      </div>

      <div className="pp-empty">
        <div className="pp-empty-icon">📊</div>
        <h3>No patterns recorded yet</h3>
        <p>Every time you analyse a glucose pattern — from a screenshot or a demo — it gets saved here. Over time you'll build a picture of which patterns occur most often for your family.</p>
        <button className="hero-cta-primary" onClick={() => onNavigate("explainer")}>
          Analyse your first pattern →
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="section-header">
        <h2>🗂️ Your Pattern Profile</h2>
        <p>Your personal glucose behaviour map — built from {totalCount} analysis session{totalCount !== 1 ? "s" : ""} this session.</p>
      </div>

      {/* ── Summary stats ── */}
      <div className="pp-stats">
        <div className="pp-stat">
          <div className="pp-stat-num" style={{ color: COLORS.ocean }}>{totalCount}</div>
          <div className="pp-stat-label">Patterns analysed</div>
        </div>
        <div className="pp-stat">
          <div className="pp-stat-num" style={{ color: COLORS.mint }}>{patternCounts.length}</div>
          <div className="pp-stat-label">Pattern types seen</div>
        </div>
        <div className="pp-stat">
          <div className="pp-stat-num" style={{ color: COLORS.sunshine }}>{totalCount > 0 ? Math.round(helpfulCount / totalCount * 100) : 0}%</div>
          <div className="pp-stat-label">Explanations rated helpful</div>
        </div>
      </div>

      {/* ── Most frequent patterns ── */}
      {patternCounts.length > 0 && (
        <div className="pp-block">
          <div className="pp-block-title">Most frequent patterns for your family</div>
          <div className="pp-pattern-map">
            {patternCounts.map(({ id, count, meta }) => (
              <div key={id} className="pp-pattern-bar">
                <div className="pp-pattern-bar-left">
                  <span className="pp-pattern-emoji">{meta.emoji}</span>
                  <div>
                    <div className="pp-pattern-label">{meta.label}</div>
                    <div className="pp-pattern-desc">{meta.desc}</div>
                  </div>
                </div>
                <div className="pp-pattern-bar-right">
                  <div className="pp-bar-track">
                    <div
                      className="pp-bar-fill"
                      style={{
                        width: `${(count / patternCounts[0].count) * 100}%`,
                        background: meta.color,
                      }}
                    />
                  </div>
                  <span className="pp-pattern-count" style={{ color: meta.color }}>×{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Session history ── */}
      <div className="pp-block">
        <div className="pp-block-title">Analysis history (this session)</div>
        <div className="pp-entries">
          {entries.map(e => <EntryCard key={e.id} entry={e} />)}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="pp-cta-row">
        <button className="hero-cta-primary" onClick={() => onNavigate("explainer")}>
          Analyse another pattern →
        </button>
        <div className="pp-persist-note">
          💡 Your pattern history is saved for this browser session. Sign-up for persistent history coming soon.
        </div>
      </div>
    </div>
  );
}
