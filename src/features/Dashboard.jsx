import { useState } from "react";

const COLORS = { ocean: "#2E86AB", coral: "#F46036", mint: "#56C596", sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A", muted: "#8A9BB0" };

const greetings = {
  new:    { label: "Newly diagnosed",    message: "The first weeks are the hardest. Start with the basics — take it one day at a time.", color: COLORS.coral,   emoji: "💙" },
  recent: { label: "Recently diagnosed", message: "You're through the initial shock. Now is the perfect time to deepen your understanding.", color: COLORS.ocean,   emoji: "📈" },
  year:   { label: "Within a year",      message: "You've built real experience. The tools below will help you go deeper.", color: COLORS.mint,    emoji: "🌱" },
  years:  { label: "Finding our rhythm", message: "Welcome back. Use the tools whenever a new question comes up.", color: COLORS.lavender, emoji: "⭐" },
};

const treatmentTips = {
  injections: "💉 On injections (MDI) — the timing of your rapid-acting insulin relative to meals is one of the most important variables to master.",
  pump:       "⚙️ On a pump — you have flexibility with basal rates. The 'Explain My Glucose' tool can help spot patterns worth discussing with your team.",
  loop:       "🤖 On a closed-loop system — the algorithm handles a lot, but understanding why it's making decisions builds confidence enormously.",
  unsure:     "📖 Still learning your treatment — start with the First 90 Days learning path. It walks through everything step by step.",
};

const ageTips = {
  under5:  "🧒 Very young children can't communicate symptoms well — CGM alerts are especially important.",
  "5to9":  "🎒 Primary-school age: a great time to start building simple self-awareness. The Kids section has age-appropriate modules.",
  "10to14":"⚽ Pre-teens are often very active and going through early growth — both significantly affect glucose.",
  "15plus":"📱 Teens are working toward greater independence. The School & Activity guide supports that transition.",
};

const secondaryFeatures = [
  { tab: "patterns",   emoji: "📈", title: "10 Glucose Patterns",   desc: "The most searched-for glucose behaviours, explained clearly.", color: COLORS.lavender },
  { tab: "simulator",  emoji: "🎮", title: "What Happens If…",       desc: "Simulate situations before they happen — sport, sick days, parties.", color: COLORS.sunshine },
  { tab: "learning",   emoji: "🗓️", title: "First 90 Days",          desc: "A structured 6-week learning path. Track your progress.", color: COLORS.ocean },
  { tab: "child",      emoji: "🌟", title: "For Kids",               desc: "Age-appropriate modules to help your child understand T1D.", color: COLORS.coral },
  { tab: "parent",     emoji: "❤️", title: "Parent Education",        desc: "Evidence-based guides for school, emotions, and technology.", color: COLORS.mint },
  { tab: "treatments", emoji: "💊", title: "Treatments & Access",     desc: "CGMs, pumps, closed-loop systems, NDSS subsidies and what's coming.", color: COLORS.lavender },
  { tab: "mental",     emoji: "🧠", title: "Mental Health",           desc: "Emotional support and crisis links for children, parents, and families.", color: COLORS.ocean },
  { tab: "inspiring",  emoji: "✨", title: "Inspiring Lives",         desc: "Athletes, leaders, and artists who thrive with T1D.", color: COLORS.coral },
  { tab: "research",   emoji: "🔬", title: "Research",               desc: "Find clinical trials and studies your family can participate in.", color: COLORS.mint },
  { tab: "forum",      emoji: "💬", title: "Community Forum",         desc: "Connect with other T1D families. Ask questions, share stories.", color: COLORS.lavender },
  { tab: "resources",  emoji: "📚", title: "Resources",              desc: "Breakthrough T1D, Diabetes Australia, JDRF and more.", color: COLORS.sunshine },
];

export default function Dashboard({ profile, onNavigate }) {
  const diag     = profile?.timeSince ? greetings[profile.timeSince] : null;
  const treatTip = profile?.treatment ? treatmentTips[profile.treatment] : null;
  const ageTip   = profile?.childAge  ? ageTips[profile.childAge]  : null;

  const startHere = (() => {
    if (!profile) return null;
    if (profile.timeSince === "new" || profile.timeSince === "recent")
      return { tab: "learning", label: "Your First 90 Days", reason: "A structured week-by-week learning path — the ideal starting point for newly diagnosed families.", emoji: "🗓️" };
    if (profile.timeSince === "year")
      return { tab: "patterns", label: "10 Glucose Patterns", reason: "You have real experience now. Understanding why patterns happen takes your knowledge to the next level.", emoji: "📈" };
    return { tab: "explainer", label: "Explain My Glucose", reason: "Load a CGM scenario and explore our pattern detection tool.", emoji: "🔎" };
  })();

  return (
    <div>

      {/* ── 1. THREE CORE ACTIONS — first thing a parent sees ── */}
      <div className="home-actions">
        <div className="home-actions-headline">
          <h2>Understand why glucose behaves the way it does.</h2>
          <p>Choose where to start:</p>
        </div>
        <div className="home-actions-grid">
          <button className="home-action-btn primary-action" onClick={() => onNavigate("explainer")}>
            <span className="action-emoji">🔎</span>
            <div className="action-content">
              <div className="action-title">Explain a glucose pattern</div>
              <div className="action-sub">Load a CGM scenario and get a clear, educational explanation of what happened and why.</div>
            </div>
            <span className="action-arrow">→</span>
          </button>
          <button className="home-action-btn" onClick={() => onNavigate("isnormal")}>
            <span className="action-emoji">🤔</span>
            <div className="action-content">
              <div className="action-title">Is this normal?</div>
              <div className="action-sub">Overnight rises, exercise spikes, stubborn highs — find out if what you're seeing has a clear explanation.</div>
            </div>
            <span className="action-arrow">→</span>
          </button>
          <button className="home-action-btn" onClick={() => onNavigate("activity")}>
            <span className="action-emoji">🏫</span>
            <div className="action-content">
              <div className="action-title">Real life situations</div>
              <div className="action-sub">Pizza nights, birthday parties, sport days, sleepovers, illness — practical guides for everyday life.</div>
            </div>
            <span className="action-arrow">→</span>
          </button>
        </div>
      </div>

      {/* ── 2. PERSONALISED RECOMMENDATION (if onboarded) ── */}
      {diag && (
        <div className="dashboard-greeting" style={{ "--g-color": diag.color }}>
          <div className="greeting-badge" style={{ background: diag.color + "22", color: diag.color }}>{diag.label}</div>
          <p className="greeting-msg">{diag.emoji} {diag.message}</p>
          {startHere && (
            <div className="start-here-card" onClick={() => onNavigate(startHere.tab)}>
              <div className="start-here-label">✦ Recommended for you</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.8rem" }}>{startHere.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800, color: COLORS.deep, fontSize: "0.95rem" }}>{startHere.label}</div>
                  <div style={{ fontSize: "0.82rem", color: "#4A6070", marginTop: 2 }}>{startHere.reason}</div>
                </div>
                <span style={{ marginLeft: "auto", color: COLORS.ocean, fontSize: "1.1rem" }}>→</span>
              </div>
            </div>
          )}
          {(treatTip || ageTip) && (
            <div className="personal-tips">
              {treatTip && <div className="personal-tip">{treatTip}</div>}
              {ageTip   && <div className="personal-tip">{ageTip}</div>}
            </div>
          )}
        </div>
      )}

      {/* ── 3. WHY THIS PROJECT EXISTS ── */}
      <div className="why-story">
        <div className="why-story-text">
          <div className="why-label">Why this project exists</div>
          <p>When my daughter was diagnosed with Type 1 Diabetes, our family entered a world we knew nothing about. Suddenly there were new routines, constant decisions, and a level of vigilance we had never experienced before.</p>
          <p>We watched the daily ups and downs — the uncertainty, the learning, the resilience it required.</p>
          <p>Over time something remarkable happened. Instead of defining her, diabetes became part of what shaped her determination and purpose.</p>
          <p>Today she works for <strong>Breakthrough T1D</strong>, helping advance the search for better treatments and ultimately a cure.</p>
          <p>This project grew out of that journey — designed to help other families understand the everyday realities of living with Type 1 Diabetes, and to build confidence in the decisions that come with it.</p>
          <button className="letter-link-btn" onClick={() => onNavigate("letter")}>Read our open letter to newly diagnosed families →</button>
        </div>
        <div className="why-story-image">
          <div className="story-image-placeholder">
            <div style={{ fontSize: "4rem", marginBottom: 12 }}>👨‍👧</div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#8A9BB0", lineHeight: 1.6 }}>A parent & daughter.<br />A journey of resilience.<br />A project born from love.</div>
          </div>
        </div>
      </div>

      {/* ── 4. STATS ── */}
      <div className="welcome-panel" style={{ marginBottom: 28 }}>
        <h2>You are not alone in this. 💙</h2>
        <p>Parents who understand why glucose behaves the way it does make better decisions, feel less anxious, and help their children thrive.</p>
        <div className="stat-row">
          <div className="stat-item"><span className="stat-number">8.4M</span><span className="stat-label">People with T1D worldwide</span></div>
          <div className="stat-item"><span className="stat-number">85K+</span><span className="stat-label">New diagnoses each year</span></div>
          <div className="stat-item"><span className="stat-number">100%</span><span className="stat-label">Can live full, amazing lives</span></div>
        </div>
      </div>

      {/* ── 5. ALL FEATURES ── */}
      <div style={{ marginBottom: 10 }}>
        <div className="section-divider-label">📚 All features</div>
      </div>
      <div className="modules-grid">
        {secondaryFeatures.map(f => (
          <div key={f.tab} className="module-card" style={{ "--card-color": f.color }} onClick={() => onNavigate(f.tab)}>
            <span className="module-emoji">{f.emoji}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── 6. CLOSING QUOTE ── */}
      <div className="quote-banner" style={{ marginTop: 32 }}>
        <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>💬</div>
        <div className="quote-text">"The goal isn't perfect glucose control. The goal is understanding what's happening — and feeling confident navigating it."</div>
        <div className="quote-attr">— Living Brilliantly with T1D</div>
      </div>

    </div>
  );
}
