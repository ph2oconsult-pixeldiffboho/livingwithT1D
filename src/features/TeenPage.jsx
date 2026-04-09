import { useState } from "react";

const COLORS = {
  ocean: "#2E86AB", coral: "#F46036", mint: "#56C596",
  sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A",
};

// ─── TEEN VIEW ───────────────────────────────────────────────────────────────
// Written directly to a teenager. Different voice. Different assumptions.
// Not about them — to them.

function TeenView({ onSwitchToParent }) {
  const [openSection, setOpenSection] = useState(null);

  const toggle = (id) => setOpenSection(openSection === id ? null : id);

  return (
    <div>
      {/* Hero — direct, honest, peer-level */}
      <div className="tv-hero">
        <div className="tv-hero-eyebrow">This part of the app is for you — not your parents.</div>
        <h2 className="tv-hero-title">Having type 1 diabetes as a teenager is hard.<br />Not because you're doing it wrong.</h2>
        <p className="tv-hero-body">The constant checking. The injecting in public. The explaining to people who don't get it. The numbers that make no sense even when you've done everything right. That's real. It's not in your head.</p>
        <button className="tv-parent-switch" onClick={onSwitchToParent}>
          Switch to parent view →
        </button>
      </div>

      {/* "You're not being dramatic" — pulled up, visible before anything else */}
      <div className="tv-dramatic-callout">
        <div className="tv-dramatic-quote">You're not being dramatic.</div>
        <p className="tv-dramatic-body">Managing a chronic condition in public — at the age when fitting in matters most — is genuinely, objectively harder than what most of your peers are dealing with. Anyone who implies otherwise hasn't thought about it carefully enough.</p>
      </div>

      {/* The honest bit about puberty */}
      <div className="tv-section">
        <div className="tv-section-title">Why everything has probably gotten harder lately</div>
        <p className="tv-body">If your numbers have gone up, your insulin needs have increased, and your time in range has dropped — and you're doing the same things you always did — this is not your fault.</p>
        <p className="tv-body" style={{ marginTop: 10 }}>Puberty releases growth hormone in your body. Growth hormone directly blocks insulin from working properly. The same dose that kept you in range at age 11 can only do half the job at age 14. This is biology. It happens to everyone with type 1 diabetes during puberty. It will get better when your hormones settle down.</p>
        <div className="tv-callout">
          <span className="tv-callout-icon">💡</span>
          <span>Your time in range dropping during puberty is clinically expected — even in people who are doing everything perfectly. You are not failing. Your body is going through something genuinely difficult.</span>
        </div>
      </div>

      {/* The stuff nobody really talks about */}
      <div className="tv-section">
        <div className="tv-section-title">The stuff nobody really talks about</div>
        {[
          {
            id: "visible",
            emoji: "👀",
            title: "The visibility of it",
            content: "Checking your blood glucose at the lunch table. Injecting before a meal when everyone else just eats. Wearing a device that people notice and ask about. Having to explain your condition to strangers, teachers, coaches — over and over.\n\nThe desire to just be normal — to not have diabetes be the first thing people know about you — is completely legitimate. You're not being dramatic. Managing a chronic condition in public, at the age when fitting in matters most, is genuinely hard."
          },
          {
            id: "burnout",
            emoji: "😮‍💨",
            title: "Diabetes burnout is real",
            content: "There will be periods where you don't want to check. Where you skip doses. Where you can't bring yourself to care as much as you're supposed to. This is called diabetes burnout and it happens to almost everyone with type 1 diabetes at some point — adults included.\n\nIt doesn't mean you've given up. It means you're exhausted by something that never stops.\n\nIf this is where you are — it's worth talking to someone about it. Not to be told off, but because there are ways to make it feel less heavy."
          },
          {
            id: "sport",
            emoji: "⚽",
            title: "Sport and exercise",
            content: "Type 1 diabetes does not mean you can't do sport. Some of the world's top professional athletes have type 1 diabetes — footballers, swimmers, tennis players, Olympic competitors.\n\nExercise does affect blood glucose in complicated ways — sometimes raising it, sometimes dropping it hours later — but these patterns are learnable. Over time, you'll start to know how your body responds to different activities.\n\nIf sport is important to you, it should remain important to you. Talk to your diabetes care team about building a plan that works for your sport — not one that keeps you off the field."
          },
          {
            id: "social",
            emoji: "🎉",
            title: "Parties, food, and social stuff",
            content: "Managing blood glucose at a party, when everyone else is eating freely, is one of the more annoying parts of this condition. You don't have to miss out — but it does require a bit more planning.\n\nA few things that help:\n• Eat something before you go if you're not sure what food will be available\n• Carry glucose tablets so a low doesn't ruin your night\n• You don't owe anyone an explanation — you can check or inject discreetly or openly, whatever works for you\n• If someone makes you feel weird about your diabetes, that's their problem, not yours"
          },
          {
            id: "numbers",
            emoji: "📊",
            title: "When the numbers are bad and you don't know why",
            content: "Sometimes blood glucose is high and you've done everything right. You gave the right dose. You ate roughly what you usually eat. You weren't sick. And it's still 16.\n\nThis is the most frustrating thing about type 1 diabetes. There are dozens of variables that affect blood glucose — stress, sleep, where you injected, what you ate the day before, where you are in your cycle if you have periods, what your hormones are doing.\n\nA single bad reading is not a reflection of how well you're managing. It's noise in a complicated system. The trend over weeks matters far more than any single number."
          },
          {
            id: "future",
            emoji: "🔮",
            title: "What does the future look like",
            content: "Type 1 diabetes technology has changed dramatically in the last decade and is still improving fast. Closed-loop systems — where a CGM and pump communicate and adjust your insulin automatically — are already available and getting better every year.\n\nResearch into cures, transplants, and prevention is active and genuinely progressing. Breakthrough T1D funds billions of dollars of research. There are real scientists working on this every day.\n\nPeople with type 1 diabetes live full, long, active lives. The management gets less exhausting as you build experience. The technology gets less intrusive every year. This is genuinely a better time to have type 1 diabetes than any point in history — and it will be better still."
          },
        ].map((sec) => (
          <div key={sec.id} className={`tv-accordion ${openSection === sec.id ? "open" : ""}`}>
            <div className="tv-accordion-header" onClick={() => toggle(sec.id)}>
              <span className="tv-acc-emoji">{sec.emoji}</span>
              <span className="tv-acc-title">{sec.title}</span>
              <span className="tv-acc-chevron">{openSection === sec.id ? "▲" : "▼"}</span>
            </div>
            {openSection === sec.id && (
              <div className="tv-accordion-body">
                {sec.content.split("\n").map((line, i) =>
                  line.trim() === "" ? <br key={i} /> : <p key={i}>{line}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* When to actually get help */}
      <div className="tv-help">
        <div className="tv-help-title">When it's worth talking to someone</div>
        <p className="tv-help-intro">Not about numbers. About how you're actually doing.</p>
        {[
          "You've stopped caring about management and it scares you",
          "You feel like diabetes is taking over your identity",
          "You're hiding lows or highs from your parents or team",
          "You feel genuinely alone with this in a way that doesn't go away",
          "You're using food, insulin, or anything else in ways that feel out of control",
        ].map((item, i) => (
          <div key={i} className="tv-help-item">
            <span className="tv-help-bullet">→</span><span>{item}</span>
          </div>
        ))}
        <div className="tv-help-note">
          A diabetes psychologist or counsellor who works with chronic illness understands this in a way that a general counsellor often doesn't. Ask your diabetes care team for a referral — it's a normal part of care, not a sign that something is wrong with you.
        </div>
      </div>

      {/* People like you */}
      <div className="tv-people">
        <div className="tv-people-title">People who have done this</div>
        <p className="tv-people-intro">Some of them at the highest levels of their field.</p>
        <div className="tv-people-grid">
          {[
            { name: "Nick Jonas", field: "Musician", note: "Diagnosed at 13. Sells out stadiums." },
            { name: "Alexander Zverev", field: "Professional tennis player", note: "Top 10 in the world. Manages on tour." },
            { name: "Sonia Sotomayor", field: "US Supreme Court Justice", note: "Diagnosed at 7. One of the most powerful legal minds in the world." },
            { name: "Charlie Kimball", field: "IndyCar racing driver", note: "Diagnosed at 22. Competed at professional racing level." },
          ].map((p, i) => (
            <div key={i} className="tv-person">
              <div className="tv-person-name">{p.name}</div>
              <div className="tv-person-field">{p.field}</div>
              <div className="tv-person-note">{p.note}</div>
            </div>
          ))}
        </div>
        <p className="tv-people-footer">Type 1 diabetes will be part of your story. It doesn't have to be the whole story.</p>
      </div>

      <div className="sdr-disclaimer">
        This section is for educational and emotional support only. It does not replace the guidance of your diabetes care team. If you are struggling, please speak to your team or a trusted adult.
      </div>
    </div>
  );
}

// ─── PARENT VIEW ─────────────────────────────────────────────────────────────
function ParentView({ onSwitchToTeen }) {
  return (
    <div>
      {/* Teen toggle — FIRST, before any parent content */}
      {/* A teenager arriving alone sees this immediately */}
      <div className="teen-view-switch-prominent">
        <div className="teen-view-switch-prominent-left">
          <div className="teen-view-switch-prominent-label">👤 Are you the teenager?</div>
          <div className="teen-view-switch-prominent-sub">There's a section of this page written directly for you — tap below.</div>
        </div>
        <button className="teen-view-switch-prominent-btn" onClick={onSwitchToTeen}>
          This is for me →
        </button>
      </div>

      <div className="section-header">
        <h2>🧭 The Teen Years</h2>
        <p>Supporting a teenager with type 1 diabetes through puberty, independence, and the handover of control.</p>
      </div>

      <div className="teen-hero">
        <div className="teen-hero-title">You haven't failed. Puberty has.</div>
        <p className="teen-hero-body">If your teenager's time in range has dropped, insulin needs have surged, and management feels harder than it did two years ago — this is not a reflection of your parenting or their effort. Puberty is one of the most challenging periods in type 1 diabetes management, for physiological reasons that are entirely outside anyone's control.</p>
      </div>

      <div className="teen-section">
        <div className="teen-section-title">🔬 What puberty actually does to blood glucose</div>
        <div className="teen-cards">
          {[
            { emoji: "📈", title: "Insulin resistance increases 30–50%", body: "Growth hormone surges during puberty directly block insulin's effectiveness. The same dose that worked at age 10 may only achieve half the effect at age 14. This is not a dosing failure — it is physiology." },
            { emoji: "🌙", title: "Overnight patterns become more unpredictable", body: "Growth hormone is released in pulses during sleep — more intensely during puberty. Dawn phenomenon becomes more pronounced. Overnight management that was stable can become chaotic with no obvious cause." },
            { emoji: "🎢", title: "Time in range typically drops", body: "Research consistently shows that time in range decreases during puberty — even in families doing everything right. A drop from 75% to 55% during peak puberty is clinically expected, not exceptional." },
            { emoji: "😤", title: "Emotional stress affects blood glucose too", body: "Stress hormones surge during adolescence. A difficult day at school, a fight with a friend, exam anxiety — all of these have real physiological effects on blood glucose, entirely separate from food and insulin." },
          ].map((c, i) => (
            <div key={i} className="teen-card">
              <div className="teen-card-header">
                <span className="teen-card-emoji">{c.emoji}</span>
                <div className="teen-card-title">{c.title}</div>
              </div>
              <p className="teen-card-body">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="teen-section">
        <div className="teen-section-title">🤝 The independence challenge</div>
        <p className="teen-section-intro">The goal of the teenage years in type 1 diabetes is not perfect glucose control. It is the gradual, supported transfer of management responsibility from parent to teenager — so that by the time they leave home, they can manage safely on their own.</p>
        <div className="teen-independence-stages" style={{ marginTop: 14 }}>
          {[
            { age: "Ages 12–14", label: "Growing autonomy", color: "#2E86AB", items: ["Checking own blood glucose and deciding on corrections — with parent awareness", "Carb counting and estimating mealtime doses", "Managing their kit at school independently", "Knowing when to seek help vs. handle it themselves"] },
            { age: "Ages 14–16", label: "Shared responsibility", color: "#56C596", items: ["Making most day-to-day decisions with parental awareness but less direct involvement", "Managing sport, social events, and school independently", "Communicating with their diabetes care team directly in appointments", "Understanding their own patterns — not just following rules"] },
            { age: "Ages 16–18", label: "Approaching independence", color: "#9B8EC4", items: ["Near-full independence in daily management", "Booking and attending some appointments themselves", "Understanding sick day rules and when to seek help without prompting"] },
          ].map((stage, i) => (
            <div key={i} className="teen-stage" style={{ borderColor: stage.color }}>
              <div className="teen-stage-header" style={{ background: stage.color }}>
                <span className="teen-stage-age">{stage.age}</span>
                <span className="teen-stage-label">{stage.label}</span>
              </div>
              <div className="teen-stage-items">
                {stage.items.map((item, j) => (
                  <div key={j} className="teen-stage-item">
                    <span className="teen-stage-bullet">→</span><span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="teen-disengage">
        <div className="teen-disengage-title">⚠️ When a teenager starts disengaging</div>
        <p className="teen-disengage-intro">Disengagement — skipping checks, avoiding doses, not disclosing lows — is extremely common in adolescence with type 1 diabetes. It is frightening for parents. It is also, in most cases, a normal part of adolescent development applied to a chronic condition.</p>
        <div className="teen-disengage-cards">
          {[
            { emoji: "🧠", title: "Why it happens", body: "Teenagers are developmentally driven to assert independence and fit in with peers. A chronic condition that requires constant visibility runs directly counter to this drive. Disengagement is often not apathy — it is resistance to being different." },
            { emoji: "💬", title: "What usually doesn't help", body: "Increased pressure, more frequent reminders, expressing fear in the moment, framing management as a parental priority rather than the teenager's own. These approaches typically increase resistance." },
            { emoji: "✅", title: "What tends to help", body: "Curiosity rather than judgment. 'What made today hard?' rather than 'Why didn't you check?' Genuine control over small decisions. Reducing management visibility where possible. Connecting them with peers who have type 1 diabetes." },
          ].map((c, i) => (
            <div key={i} className="teen-dis-card">
              <div className="teen-dis-header"><span>{c.emoji}</span><strong>{c.title}</strong></div>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="teen-resources">
        <div className="teen-resources-title">📚 Support for this stage</div>
        {[
          { emoji: "🧠", label: "Ask your team about adolescent independence", detail: "Not just dose adjustments. Many diabetes educators have specific experience supporting teenagers through this transition — ask directly." },
          { emoji: "👥", label: "Peer connection changes outcomes", detail: "Teenagers with type 1 diabetes who connect with others their age — through camps, online communities, or youth programs — consistently report better wellbeing and engagement with management." },
          { emoji: "💙", label: "Breakthrough T1D Australia — youth programs", detail: "breakthrought1d.org.au — peer networks and research communities for young people with type 1 diabetes." },
          { emoji: "🏥", label: "Transition clinics", detail: "Many paediatric hospitals run transition programs supporting teenagers moving from paediatric to adult diabetes care. Ask your team when this is appropriate." },
        ].map((r, i) => (
          <div key={i} className="teen-resource-row">
            <span className="teen-resource-emoji">{r.emoji}</span>
            <div>
              <div className="teen-resource-label">{r.label}</div>
              <div className="teen-resource-detail">{r.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sdr-disclaimer">
        Educational resource only. This content does not replace the guidance of your diabetes care team or a qualified mental health professional. If you are concerned about your teenager's wellbeing or diabetes management, please speak to your care team.
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function TeenPage({ switchTab }) {
  const [view, setView] = useState("parent");

  return view === "teen"
    ? <TeenView onSwitchToParent={() => setView("parent")} />
    : <ParentView onSwitchToTeen={() => setView("teen")} />;
}
