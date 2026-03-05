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

// Section C — 6 situation tiles
const SITUATIONS = [
  { emoji: "🍕", label: "Pizza night",      sub: "Why the spike comes 3–5 hours later", tab: "activity", scenario: "pizza" },
  { emoji: "⚽", label: "Sport day",         sub: "Exercise spikes + overnight lows", tab: "activity", scenario: "sport" },
  { emoji: "🌙", label: "Overnight rise",    sub: "The dawn phenomenon explained", tab: "isnormal", scenario: "overnight" },
  { emoji: "🎂", label: "Birthday party",    sub: "Cake, juice, excitement — what to expect", tab: "activity", scenario: "party" },
  { emoji: "🤒", label: "Sick day",          sub: "Why illness raises glucose even without food", tab: "activity", scenario: "sick" },
  { emoji: "🏫", label: "School lunch",      sub: "Carb counting, timing, and independence", tab: "activity", scenario: "school" },
];

// Section D — 3 how-it-helps steps
const HOW_STEPS = [
  { num: "1", emoji: "👀", title: "Observe a pattern", desc: "Notice what's happening on the CGM graph — a spike after dinner, a rise overnight, a drop after sport." },
  { num: "2", emoji: "💡", title: "Get a clear explanation", desc: "Use 'Explain My Glucose' to understand the likely drivers behind what you're seeing — in plain, calm language." },
  { num: "3", emoji: "💪", title: "Build confidence over time", desc: "Each explanation adds to your family's understanding. Patterns that once felt frightening start to make sense." },
];

const secondaryFeatures = [
  { tab: "profile",    emoji: "🗂️", title: "My Pattern Profile",    desc: "Your personal glucose behaviour map, built from every analysis you run.", color: COLORS.ocean },
  { tab: "patterns",   emoji: "📈", title: "10 Glucose Patterns",   desc: "The most searched glucose behaviours, explained clearly.", color: COLORS.lavender },
  { tab: "simulator",  emoji: "🎮", title: "What Happens If…",       desc: "Simulate situations before they happen — sport, sick days, parties.", color: COLORS.sunshine },
  { tab: "learning",   emoji: "🗓️", title: "First 90 Days",          desc: "A structured 6-week learning path. Track your progress.", color: COLORS.ocean },
  { tab: "sickday",    emoji: "🤒", title: "Sick Day Rules",            desc: "What to do when your child is unwell. Includes emergency guide for hypos and DKA.", color: COLORS.coral },
  { tab: "explorer",   emoji: "🔍", title: "Glucose Explorer",          desc: "Stories, guessing games and badges. Kids learn why glucose behaves the way it does.", color: COLORS.mint },
  { tab: "child",      emoji: "🌟", title: "For Kids",               desc: "Age-appropriate modules to help your child understand T1D.", color: COLORS.coral },
  { tab: "parent",     emoji: "❤️", title: "Parent Education",        desc: "Evidence-based guides for school, emotions, and technology.", color: COLORS.mint },
  { tab: "treatments", emoji: "💊", title: "Treatments & Access",     desc: "CGMs, pumps, closed-loop systems, NDSS subsidies.", color: COLORS.lavender },
  { tab: "mental",     emoji: "🧠", title: "Mental Health",           desc: "Emotional support and crisis links for the whole family.", color: COLORS.ocean },
  { tab: "inspiring",  emoji: "✨", title: "Inspiring Lives",         desc: "Athletes, leaders, and artists who thrive with T1D.", color: COLORS.coral },
  { tab: "research",   emoji: "🔬", title: "Research",               desc: "Find clinical trials and studies your family can participate in.", color: COLORS.mint },
  { tab: "forum",      emoji: "💬", title: "Community Forum",         desc: "Connect with other T1D families. Ask questions, share stories.", color: COLORS.lavender },
  { tab: "resources",  emoji: "📚", title: "Resources",              desc: "Breakthrough T1D, Diabetes Australia, JDRF and more.", color: COLORS.sunshine },
];

// Persistent feedback widget
function FeedbackWidget() {
  const [answer, setAnswer] = useState(null);
  const [looking, setLooking] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div className="feedback-widget done">
      <span>💙</span> Thank you — your feedback helps us improve for every family.
    </div>
  );

  return (
    <div className="feedback-widget">
      <div className="fw-question">Was this page helpful?</div>
      <div className="fw-row">
        {["👍 Yes", "👎 No", "🤷 Partly"].map(opt => (
          <button key={opt} className={`fw-opt ${answer === opt ? "active" : ""}`} onClick={() => setAnswer(opt)}>{opt}</button>
        ))}
      </div>
      {answer && (
        <>
          <input
            className="fw-input"
            placeholder="What were you looking for? (optional)"
            value={looking}
            onChange={e => setLooking(e.target.value)}
          />
          <button className="fw-submit" onClick={() => setSubmitted(true)}>Send feedback →</button>
        </>
      )}
    </div>
  );
}

export default function Dashboard({ profile, onNavigate }) {
  const diag     = profile?.timeSince ? greetings[profile.timeSince] : null;
  const treatTip = profile?.treatment ? treatmentTips[profile.treatment] : null;
  const ageTip   = profile?.childAge  ? ageTips[profile.childAge]  : null;

  const startHere = (() => {
    if (!profile) return null;
    if (profile.timeSince === "new" || profile.timeSince === "recent")
      return { tab: "learning", label: "Your First 90 Days", reason: "A structured week-by-week path — the ideal start for newly diagnosed families.", emoji: "🗓️" };
    if (profile.timeSince === "year")
      return { tab: "patterns", label: "10 Glucose Patterns", reason: "You have real experience — understanding why patterns happen takes knowledge to the next level.", emoji: "📈" };
    return { tab: "explainer", label: "Explain My Glucose", reason: "Load a CGM scenario and explore our pattern detection tool.", emoji: "🔎" };
  })();

  return (
    <div>

      {/* ── SECTION A: THREE CORE ACTIONS — first thing seen ── */}
      <div className="home-actions">
        <div className="home-actions-headline">
          <h2>A learning companion for families navigating Type 1 Diabetes.</h2>
          <p>Understand why glucose behaves the way it does — meals, sport, nights, illness.</p>
        </div>
        <div className="home-actions-grid">
          <button className="home-action-btn primary-action" onClick={() => onNavigate("explainer")}>
            <span className="action-emoji">🔎</span>
            <div className="action-content">
              <div className="action-title">Explain a glucose pattern</div>
              <div className="action-sub">Load a CGM scenario and get a clear educational explanation of what happened and why.</div>
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
              <div className="action-title">Real-life situations</div>
              <div className="action-sub">Pizza nights, birthday parties, sport days, sleepovers, illness — practical guides for everyday life.</div>
            </div>
            <span className="action-arrow">→</span>
          </button>
        </div>
        <div className="home-actions-trust">
          <span>🔒 Educational only — not medical advice</span>
          <span className="trust-dot">·</span>
          <button className="trust-link" onClick={() => onNavigate("disclaimer")}>Disclaimer & Privacy</button>
          <span className="trust-dot">·</span>
          <span>Built from lived experience with T1D</span>
        </div>
      </div>

      {/* ── PERSONALISED RECOMMENDATION (if onboarded) ── */}
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

      {/* ── SECTION B: FOUNDER STORY ── */}
      <div className="founder-story">
        <div className="founder-story-inner">
          {/* Left: image */}
          <div className="founder-photo">
            <img
              src="/founders-square.jpg"
              alt="A father and daughter — the family behind Living Brilliantly with T1D"
              className="founder-photo-img"
            />
            <div className="founder-photo-caption">When our daughter was diagnosed with Type 1 Diabetes, we began a journey of learning, resilience, and growth. This project was created to help other families navigate the same path.</div>
          </div>

          {/* Right: story */}
          <div className="founder-text">
            <div className="founder-eyebrow">Why this project exists</div>
            <h2 className="founder-headline">
              "Our daughter was diagnosed with Type&nbsp;1 Diabetes. We had no idea what we were doing."
            </h2>
            <p className="founder-body">
              When she was diagnosed, our family entered a world we knew nothing about. Suddenly there were new routines, constant decisions, and a level of vigilance none of us had experienced before. The numbers on the CGM were frightening because we didn't yet understand what they meant.
            </p>
            <p className="founder-body">
              Over time, something remarkable happened. Instead of defining her, diabetes became part of what shaped her resilience and purpose. <strong>Today she works for Breakthrough T1D</strong>, helping advance the search for better treatments and ultimately a cure.
            </p>
            <p className="founder-body">
              This project grew out of that journey — built to help other families understand what we had to learn the hard way, and to feel more confident in the everyday decisions that come with T1D.
            </p>
            <div className="founder-actions">
              <button className="founder-cta" onClick={() => onNavigate("letter")}>
                Read our open letter to newly diagnosed families →
              </button>
              <div className="founder-trust-line">
                <span className="founder-trust-badge">🔬</span>
                Connected with <strong>Breakthrough T1D</strong> — the world's leading T1D research funder
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION C: SITUATION TILES ── */}
      <div className="situations-block">
        <div className="section-divider-label">🍽️ What do you need help with today?</div>
        <div className="situations-grid">
          {SITUATIONS.map(s => (
            <button key={s.label} className="situation-tile" onClick={() => onNavigate(s.tab)}>
              <span className="situation-emoji">{s.emoji}</span>
              <div className="situation-label">{s.label}</div>
              <div className="situation-sub">{s.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── SECTION D: HOW IT HELPS ── */}
      <div className="how-it-helps">
        <div className="section-divider-label">✨ How it helps</div>
        <div className="how-steps">
          {HOW_STEPS.map((s, i) => (
            <div key={i} className="how-step">
              <div className="how-step-num">{s.num}</div>
              <div className="how-step-emoji">{s.emoji}</div>
              <div className="how-step-title">{s.title}</div>
              <div className="how-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONVERSION: PDF DOWNLOAD ── */}
      <div className="email-capture">
        <div className="ec-emoji">📄</div>
        <h3 className="ec-title">Download the First 90 Days guide</h3>
        <p className="ec-sub">A free PDF guide for newly diagnosed families — 6 weeks of essential knowledge, 18 topics, print-friendly. Yours instantly, no sign-up needed.</p>
        <a
          href="/T1D-First-90-Days-Guide.pdf"
          download="T1D-First-90-Days-Guide.pdf"
          className="ec-btn"
          style={{ display: "inline-block", textDecoration: "none" }}
        >
          ⬇️ Download free PDF →
        </a>
        <div className="ec-note">Free. No email required. Educational only — not medical advice.</div>
      </div>

      {/* ── ALL FEATURES ── */}
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

      {/* ── SECTION E: SAFETY STRIP ── */}
      <div className="safety-strip">
        <div className="safety-strip-inner">
          <div className="safety-col">
            <div className="safety-icon">⚕️</div>
            <div className="safety-title">Medical disclaimer</div>
            <div className="safety-text">This app is educational only. It does not replace your diabetes care team. Never use it to make dosing or treatment decisions.</div>
          </div>
          <div className="safety-col">
            <div className="safety-icon">🛡️</div>
            <div className="safety-title">Privacy</div>
            <div className="safety-text">We don't collect personal health data. No CGM data is stored. The AI feature uses the Anthropic API — no data is retained beyond your session.</div>
          </div>
          <div className="safety-col">
            <div className="safety-icon">🆘</div>
            <div className="safety-title">Emergency</div>
            <div className="safety-text">In a medical emergency, call <strong>000</strong> (Australia) immediately. For severe hypo, DKA, or loss of consciousness — do not use this app.</div>
          </div>
        </div>
        <button className="safety-link" onClick={() => onNavigate("disclaimer")}>
          Read full disclaimer & privacy policy →
        </button>
      </div>

      {/* ── FEEDBACK WIDGET ── */}
      <FeedbackWidget />

      {/* ── CLOSING QUOTE ── */}
      <div className="quote-banner" style={{ marginTop: 24 }}>
        <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>💬</div>
        <div className="quote-text">"The goal isn't perfect glucose control. The goal is understanding what's happening — and feeling confident navigating it."</div>
        <div className="quote-attr">— Living Brilliantly with T1D</div>
      </div>

    </div>
  );
}
