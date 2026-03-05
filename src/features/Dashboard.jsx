import { useState } from "react";

const COLORS = { ocean: "#2E86AB", coral: "#F46036", mint: "#56C596", sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A", muted: "#8A9BB0" };

const greetings = {
  new:    { label: "Newly diagnosed",    message: "The first weeks are the hardest. Start with the basics and take it one day at a time.", color: COLORS.coral,   emoji: "💙" },
  recent: { label: "Recently diagnosed", message: "You're through the first shock. Now is the perfect time to deepen your understanding.", color: COLORS.ocean,   emoji: "📈" },
  year:   { label: "Within a year",      message: "You've built real experience now. The tools below will help you go deeper.", color: COLORS.mint,    emoji: "🌱" },
  years:  { label: "Finding our rhythm", message: "Welcome back. Use the tools below whenever a new question comes up.", color: COLORS.lavender, emoji: "⭐" },
};

const treatmentTips = {
  injections: "💉 On injections (MDI) — the timing of your rapid-acting insulin relative to meals is one of the most important variables to master.",
  pump:       "⚙️ On a pump — you have more flexibility with basal rates. The 'Explain My Glucose' tool can help you spot patterns worth discussing with your team.",
  loop:       "🤖 On a closed-loop system — the algorithm handles a lot, but understanding why it's making decisions builds your confidence enormously.",
  unsure:     "📖 Still learning your treatment — start with the First 90 Days learning path. It walks through everything step by step.",
};

const ageTips = {
  under5:  "🧒 Very young children can't communicate symptoms well — CGM alerts are especially important. The 'Is This Normal?' tool covers many infant patterns.",
  "5to9":  "🎒 Primary-school age: this is the time to start building simple self-awareness. The Kids section has age-appropriate modules.",
  "10to14":"⚽ Pre-teens are often very active and going through early growth — both significantly affect glucose. The exercise and growth sections are particularly relevant.",
  "15plus":"📱 Teens are working toward greater independence. The School & Activity guide and the Learning Path support that transition.",
};

export default function Dashboard({ profile, onNavigate }) {
  const diag     = profile?.timeSince ? greetings[profile.timeSince] : null;
  const treatTip = profile?.treatment ? treatmentTips[profile.treatment] : null;
  const ageTip   = profile?.childAge  ? ageTips[profile.childAge]  : null;

  // The three core feature cards (always shown prominently)
  const coreFeatures = [
    {
      tab: "explainer",
      emoji: "🔎",
      title: "Explain My Glucose",
      desc: "Load a CGM scenario, add context, and get a clear pattern explanation — drivers, causes, what to watch next time.",
      color: COLORS.coral,
      badge: "Signature feature",
    },
    {
      tab: "isnormal",
      emoji: "🤔",
      title: "Is This Normal?",
      desc: "Overnight spikes, exercise crashes, stubborn highs — find out if what you're seeing has a clear explanation.",
      color: COLORS.ocean,
      badge: "Anxiety reducer",
    },
    {
      tab: "activity",
      emoji: "🏫",
      title: "Real Life Situations",
      desc: "Pizza nights, birthday parties, sport days, sleepovers, illness — practical glucose guides for everyday life.",
      color: COLORS.mint,
      badge: "Everyday life",
    },
  ];

  // Personalised "Start here" recommendation
  const startHere = (() => {
    if (!profile) return null;
    if (profile.timeSince === "new" || profile.timeSince === "recent") return { tab: "learning", label: "Your First 90 Days", reason: "You're newly diagnosed — this structured learning path builds knowledge week by week.", emoji: "🗓️" };
    if (profile.timeSince === "year") return { tab: "patterns", label: "10 Glucose Patterns", reason: "You have real experience now. Understanding why patterns happen takes your knowledge to the next level.", emoji: "📈" };
    return { tab: "explainer", label: "Explain My Glucose", reason: "Load a CGM scenario and explore our pattern detection tool.", emoji: "🔎" };
  })();

  const secondaryFeatures = [
    { tab: "patterns",   emoji: "📈", title: "10 Glucose Patterns",   desc: "The most searched-for glucose behaviours, explained clearly.", color: COLORS.lavender },
    { tab: "simulator",  emoji: "🎮", title: "What Happens If…",       desc: "Simulate situations before they happen — sport, sick days, parties.", color: COLORS.sunshine },
    { tab: "learning",   emoji: "🗓️", title: "First 90 Days",          desc: "A structured 6-week learning path. Track your progress.", color: COLORS.ocean },
    { tab: "child",      emoji: "🌟", title: "For Kids",               desc: "Age-appropriate modules to help your child understand T1D.", color: COLORS.coral },
    { tab: "parent",     emoji: "❤️", title: "Parent Education",        desc: "Evidence-based guides for managing school, emotions, and technology.", color: COLORS.mint },
    { tab: "treatments", emoji: "💊", title: "Treatments & Access",     desc: "CGMs, pumps, closed-loop systems, NDSS subsidies and what's coming.", color: COLORS.lavender },
    { tab: "mental",     emoji: "🧠", title: "Mental Health",           desc: "Emotional support and crisis links for children, parents, and families.", color: COLORS.ocean },
    { tab: "inspiring",  emoji: "✨", title: "Inspiring Lives",         desc: "Athletes, leaders, and artists who thrive with T1D.", color: COLORS.coral },
    { tab: "research",   emoji: "🔬", title: "Research",               desc: "Find clinical trials and studies your family can participate in.", color: COLORS.mint },
    { tab: "forum",      emoji: "💬", title: "Community Forum",         desc: "Connect with other T1D families. Ask questions, share stories.", color: COLORS.lavender },
    { tab: "resources",  emoji: "📚", title: "Resources",              desc: "Breakthrough T1D, Diabetes Australia, JDRF and more.", color: COLORS.sunshine },
  ];

  return (
    <div>
      {/* Why this project exists — always shown at top */}
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

      {/* Personalised greeting */}
      {diag && (
        <div className="dashboard-greeting" style={{ "--g-color": diag.color }}>
          <div className="greeting-badge" style={{ background: diag.color + "22", color: diag.color }}>{diag.label}</div>
          <p className="greeting-msg">{diag.emoji} {diag.message}</p>

          {/* Start here recommendation */}
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

          {/* Personalised tips */}
          {(treatTip || ageTip) && (
            <div className="personal-tips">
              {treatTip && <div className="personal-tip">{treatTip}</div>}
              {ageTip   && <div className="personal-tip">{ageTip}</div>}
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="welcome-panel" style={{ marginBottom: 28 }}>
        <h2>Understanding T1D builds confidence. 💙</h2>
        <p>Parents who understand why glucose behaves the way it does make better decisions, feel less anxious, and help their children thrive. That's what this app is for.</p>
        <div className="stat-row">
          <div className="stat-item"><span className="stat-number">8.4M</span><span className="stat-label">People with T1D worldwide</span></div>
          <div className="stat-item"><span className="stat-number">85K+</span><span className="stat-label">New diagnoses each year</span></div>
          <div className="stat-item"><span className="stat-number">100%</span><span className="stat-label">Can live full, amazing lives</span></div>
        </div>
      </div>

      {/* Three core features — always prominent */}
      <div style={{ marginBottom: 10 }}>
        <div className="section-divider-label">🎯 The three core tools</div>
      </div>
      <div className="core-features-grid">
        {coreFeatures.map(f => (
          <div key={f.tab} className="core-feature-card" style={{ "--cf-color": f.color }} onClick={() => onNavigate(f.tab)}>
            <div className="cf-badge" style={{ background: f.color + "18", color: f.color }}>{f.badge}</div>
            <div style={{ fontSize: "2.2rem", margin: "12px 0 8px" }}>{f.emoji}</div>
            <div className="cf-title">{f.title}</div>
            <div className="cf-desc">{f.desc}</div>
            <div className="cf-cta" style={{ color: f.color }}>Open →</div>
          </div>
        ))}
      </div>

      {/* Secondary features grid */}
      <div style={{ marginTop: 28, marginBottom: 10 }}>
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

      {/* Quote */}
      <div className="quote-banner" style={{ marginTop: 32 }}>
        <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>💬</div>
        <div className="quote-text">"The goal isn't perfect glucose control. The goal is understanding what's happening — and feeling confident navigating it."</div>
        <div className="quote-attr">— Living Brilliantly with T1D</div>
      </div>
    </div>
  );
}
