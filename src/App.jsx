import { useState } from "react";
import "./App.css";

const COLORS = {
  sky: "#E8F4FD",
  ocean: "#2E86AB",
  coral: "#F46036",
  mint: "#56C596",
  sunshine: "#FFD166",
  lavender: "#9B8EC4",
  deep: "#1A3A4A",
  soft: "#F7F3EE",
  white: "#FFFFFF",
  muted: "#8A9BB0",
};

const inspiringPeople = [
  { name: "Nick Jonas", field: "Musician & Actor", diagnosed: "Age 13", quote: "T1D doesn't define me — it's just part of my story.", emoji: "🎵", color: COLORS.ocean },
  { name: "James Norton", field: "Actor (Happy Valley, Grantchester)", diagnosed: "Childhood", quote: "It's just something I manage — it's never stopped me doing anything.", emoji: "🎭", color: COLORS.lavender },
  { name: "Alexander Zverev", field: "Professional Tennis Player", diagnosed: "Age 4", quote: "I've had diabetes my whole life. It's never stopped me competing at the very top.", emoji: "🎾", color: COLORS.mint },
  { name: "Halle Berry", field: "Oscar-Winning Actress", diagnosed: "Age 22", quote: "Diabetes has actually made me healthier than I've ever been in my entire life.", emoji: "🌟", color: COLORS.coral },
  { name: "Theresa May", field: "Former UK Prime Minister", diagnosed: "Age 56", quote: "Having diabetes doesn't stop you from doing the things you want to do in life.", emoji: "🇬🇧", color: COLORS.ocean },
  { name: "Sarah Klau", field: "Australian Netball Player", diagnosed: "Childhood", quote: "Managing T1D is just part of my routine — it hasn't held me back from representing my country.", emoji: "🏐", color: COLORS.sunshine },
  { name: "Sonia Sotomayor", field: "US Supreme Court Justice", diagnosed: "Age 7", quote: "I was born to do this. T1D never slowed me down.", emoji: "⚖️", color: COLORS.lavender },
  { name: "Jay Cutler", field: "NFL Quarterback", diagnosed: "Age 25", quote: "Managing diabetes is just part of my daily routine.", emoji: "🏈", color: COLORS.mint },
  { name: "Mary Tyler Moore", field: "Actress & Activist", diagnosed: "Age 33", quote: "You have to believe in yourself when no one else does.", emoji: "🎬", color: COLORS.coral },
  { name: "Elliott Yamin", field: "American Idol Star", diagnosed: "Age 16", quote: "Music is my medicine. Diabetes never silenced my voice.", emoji: "🎤", color: COLORS.ocean },
  { name: "Anne Rice", field: "Author", diagnosed: "Adult", quote: "Writing carried me through everything — including diabetes.", emoji: "📚", color: COLORS.sunshine },
];

const childModules = [
  {
    id: "what-is-t1d",
    title: "What's happening in my body?",
    emoji: "🫀",
    color: COLORS.ocean,
    ageGroup: "All ages",
    description: "A friendly journey through how insulin works — with simple words.",
    content: `Your body has a special organ called the **pancreas**. In most people, it makes a helpful molecule called **insulin** — like a tiny key 🔑 that lets sugar into your cells for energy.\n\nWith Type 1 Diabetes, the body's own defense system accidentally attacks the cells that make insulin. It's not anyone's fault — not yours, not your parents'. It just happens.\n\nNow you get to be your own superhero — checking your blood sugar and giving your body the insulin it needs! 💪`,
    activity: "Draw your pancreas and give it a superhero cape!",
    funFact: "Your pancreas is about the size of your hand — pretty small for such an important job! 🖐️",
  },
  {
    id: "blood-sugar",
    title: "Understanding my blood sugar",
    emoji: "📊",
    color: COLORS.coral,
    ageGroup: "Ages 6+",
    description: "Learn what blood sugar is, why it matters, and what the numbers mean.",
    content: `**Blood sugar** (also called blood glucose) is the amount of sugar floating in your blood. You need just the right amount — not too much, not too little!\n\n🟢 **In range** (about 70–180 mg/dL): Feels great! You have energy to play, think and laugh.\n\n🔴 **Too low (Hypo)**: You might feel shaky, hungry, or dizzy. Quick fix: eat some fast sugar like juice or glucose tablets!\n\n🟡 **Too high (Hyper)**: You might feel tired or need to go to the bathroom a lot. Insulin helps bring it back down.`,
    activity: "Keep a 3-day 'mood and blood sugar' journal. Do you notice any patterns?",
    funFact: "Your brain uses 20% of all the sugar in your blood — it's a super hungry organ! 🧠",
  },
  {
    id: "coping",
    title: "It's okay to feel big feelings",
    emoji: "💙",
    color: COLORS.lavender,
    ageGroup: "All ages",
    description: "T1D can bring up lots of emotions. All of them are completely normal.",
    content: `Finding out you have T1D can feel overwhelming. You might feel:\n\n😢 **Sad** — It's okay to grieve. This is a big change.\n😡 **Angry** — "Why me?" is a completely fair question.\n😰 **Scared** — New things can feel scary, but you'll learn to manage them.\n😌 **Hopeful** — Millions of people live amazing lives with T1D!\n\nTalk to your parents, a counselor, or another T1D kid. You are **never** alone in this. There are whole communities of T1D families who understand exactly what you're going through. 🤝`,
    activity: "Write a letter to your future self — a version of you who has learned to live brilliantly with T1D.",
    funFact: "Over 8.4 million people worldwide live with T1D. That's a huge community rooting for you! 🌍",
  },
  {
    id: "daily-life",
    title: "T1D in my daily life",
    emoji: "☀️",
    color: COLORS.mint,
    ageGroup: "Ages 8+",
    description: "How to handle school, sports, sleepovers and everything in between.",
    content: `T1D comes with you everywhere — and that's actually okay! Here's how to handle some common situations:\n\n🏫 **At school**: Tell a trusted teacher. Keep snacks and your kit nearby. You have the right to check your blood sugar anytime.\n\n⚽ **Playing sports**: Exercise can lower blood sugar — have snacks ready, let your coach know, and wear your medical ID.\n\n🌙 **Sleepovers**: Talk to your parents and your friend's parents beforehand. Set a nighttime alarm to check your levels.\n\n🎂 **Parties & treats**: You can still eat birthday cake! You'll just learn how to balance it with insulin. Nothing is fully off limits.`,
    activity: "Create a 'T1D Kit' checklist for your school bag — what do you need every day?",
    funFact: "Many T1D athletes have competed in the Olympics and professional sports! 🏅",
  },
];

const parentModules = [
  {
    id: "parent-understanding",
    title: "Understanding T1D: The Science",
    icon: "🔬",
    color: COLORS.ocean,
    description: "What T1D actually is — and crucially, what it isn't.",
    content: `Type 1 Diabetes is an **autoimmune condition** where the body's immune system mistakenly destroys the beta cells in the pancreas that produce insulin. Without insulin, glucose cannot enter cells and accumulates in the bloodstream.\n\n**This is NOT:**\n• Caused by eating too much sugar\n• A lifestyle disease (that is Type 2)\n• Something your child or you caused\n• Curable through diet alone\n\n**This IS:**\n• Manageable with insulin therapy, monitoring, and lifestyle awareness\n• A condition thousands of children thrive with every single day\n• Something your whole family will adapt to — and you will adapt.\n\nCurrent treatment involves insulin delivery (via injections or pump) and continuous blood glucose monitoring. Technology has made this more manageable than ever before.`,
    keyTakeaway: "T1D is manageable. Your child can live a full, extraordinary life.",
  },
  {
    id: "parent-emotional",
    title: "Supporting your child emotionally",
    icon: "❤️",
    color: COLORS.coral,
    description: "How to be present without increasing fear or anxiety.",
    content: `The diagnosis is a grief process — for you AND your child. Research shows that parental anxiety directly affects a child's adaptation to T1D. Here's how to help:\n\n**DO:**\n✅ Acknowledge their feelings without minimizing them\n✅ Use calm, factual language about T1D management\n✅ Celebrate their resilience and small wins\n✅ Involve them in age-appropriate decisions about their care\n✅ Connect with other T1D families — peer support is invaluable\n\n**AVOID:**\n❌ Projecting your own fears onto them\n❌ Over-monitoring to the point of anxiety\n❌ Making T1D the center of every family conversation\n❌ Treating them as fragile — they are strong!\n\nPsychological support for both child and parent is a legitimate and important part of T1D care.`,
    keyTakeaway: "Your calm is their calm. Your resilience models theirs.",
  },
  {
    id: "parent-school",
    title: "Navigating school & social life",
    icon: "🏫",
    color: COLORS.mint,
    description: "Advocating for your child while fostering independence.",
    content: `**At School:**\nWork with the school to create a **Diabetes Medical Management Plan (DMMP)**. This legally ensures your child gets appropriate support. Key inclusions:\n• Freedom to check blood sugar and treat lows immediately\n• Access to snacks without permission delays\n• A trained staff member for emergencies\n• Clear communication protocols with you\n\n**Building Independence:**\nAge-appropriate independence in diabetes management is a health outcome in itself. Children who have ownership over their care tend to have better long-term outcomes. Start small:\n• Ages 6–8: Recognize symptoms, tell adults\n• Ages 8–12: Participate in carb counting, understand their kit\n• Ages 12+: Growing autonomy with parental oversight\n\n**Social situations:**\nCoach your child on how to briefly explain T1D to peers. Most children are curious, not unkind. Normalizing it early makes social life much easier.`,
    keyTakeaway: "Advocate fiercely AND foster independence — both are acts of love.",
  },
  {
    id: "parent-tech",
    title: "Technology & Management Tools",
    icon: "📱",
    color: COLORS.lavender,
    description: "The remarkable technology that helps manage T1D today.",
    content: `T1D management has transformed remarkably in recent decades:\n\n**Continuous Glucose Monitors (CGMs)**\nDevices like Dexcom G7 and Libre 3 check blood sugar every few minutes, sending alerts to your phone. No more constant finger pricks.\n\n**Insulin Pumps**\nDelivers continuous insulin through a small cannula. Some systems like Omnipod and Tandem t:slim X2 can communicate with CGMs for semi-automated dosing.\n\n**Closed-Loop / Hybrid Closed-Loop Systems**\nSometimes called an "artificial pancreas" — the CGM and pump communicate automatically to adjust insulin based on glucose trends. Life-changing for many families.\n\n**Apps & Data**\nApps allow parents to view their child's glucose levels remotely. This "share" feature provides peace of mind without constant intrusion.\n\n**Important**: Work with your endocrinology team to find the right combination for your child's age, activity level, and lifestyle.`,
    keyTakeaway: "The technology available today is extraordinary — and it keeps improving.",
  },
];

const resources = [
  { name: "Breakthrough T1D", url: "https://www.breakthrought1d.org", description: "Leading funder of T1D research. Find clinical trials, latest breakthroughs, and family support programs.", type: "Research & Charity", emoji: "🔬", color: COLORS.ocean },
  { name: "Beyond Type 1", url: "https://beyondtype1.org", description: "Peer support community, education resources, and tools for people living with T1D.", type: "Community & Education", emoji: "🤝", color: COLORS.coral },
  { name: "JDRF Australia", url: "https://jdrf.org.au", description: "Australian chapter of the global T1D research and advocacy organization.", type: "Research & Advocacy", emoji: "🇦🇺", color: COLORS.mint },
  { name: "Children with Diabetes", url: "https://childrenwithdiabetes.com", description: "The largest online community for kids, families, and adults with T1D.", type: "Family Community", emoji: "👨‍👩‍👧", color: COLORS.lavender },
  { name: "Diabetes Australia", url: "https://www.diabetesaustralia.com.au", description: "National support, resources, and advocacy for all Australians living with diabetes.", type: "National Support", emoji: "🏥", color: COLORS.sunshine },
  { name: "T1D Exchange", url: "https://t1dexchange.org", description: "Registry and research platform connecting T1D patients with cutting-edge studies.", type: "Research Platform", emoji: "📊", color: COLORS.ocean },
];

function formatContent(text) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        <br />
      </span>
    );
  });
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedModule, setSelectedModule] = useState(null);

  const tabs = [
    { id: "home", label: "Home", emoji: "🏠" },
    { id: "child", label: "For Kids", emoji: "🌟" },
    { id: "parent", label: "For Parents", emoji: "❤️" },
    { id: "inspiring", label: "Inspiring Lives", emoji: "✨" },
    { id: "resources", label: "Resources", emoji: "📚" },
  ];

  const switchTab = (id) => {
    setActiveTab(id);
    setSelectedModule(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">A Family Learning Journey</div>
        <h1>Living Brilliantly<br />with <span>Type 1 Diabetes</span></h1>
        <p>A warm, honest, and empowering companion for families navigating a T1D diagnosis together — learning, growing, and thriving as one.</p>
      </div>

      {/* Nav */}
      <div className="nav-container">
        <div className="nav-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`nav-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => switchTab(t.id)}
            >
              <span className="tab-emoji">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="content">

        {/* HOME */}
        {activeTab === "home" && (
          <>
            <div className="welcome-panel">
              <h2>You're not alone in this. 💙</h2>
              <p>
                A T1D diagnosis changes things — but it doesn't limit what's possible. This app is your family's companion: a place to learn together, find comfort in others' stories, and access the latest support and resources.
              </p>
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-number">8.4M</span>
                  <span className="stat-label">People with T1D worldwide</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">85K+</span>
                  <span className="stat-label">New diagnoses each year</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Can live full, amazing lives</span>
                </div>
              </div>
            </div>

            <div className="modules-grid">
              {[
                { tab: "child", emoji: "🌟", title: "Learning for Kids", desc: "Fun, age-appropriate modules to help your child understand their body and feel empowered.", color: COLORS.ocean },
                { tab: "parent", emoji: "❤️", title: "Parent Education", desc: "In-depth guides to understand T1D, support your child emotionally, and navigate daily challenges.", color: COLORS.coral },
                { tab: "inspiring", emoji: "✨", title: "Inspiring Lives", desc: "Discover the musicians, athletes, scientists and leaders who thrive with T1D.", color: COLORS.lavender },
                { tab: "resources", emoji: "📚", title: "Support & Resources", desc: "Connect with charities like Breakthrough T1D, peer communities, and the latest research.", color: COLORS.mint },
              ].map(item => (
                <div
                  key={item.tab}
                  className="module-card"
                  style={{ "--card-color": item.color }}
                  onClick={() => switchTab(item.tab)}
                >
                  <span className="module-emoji">{item.emoji}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="quote-banner">
              <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>💬</div>
              <div className="quote-text">
                "T1D is not a limitation — it's a different way of navigating life. With the right knowledge and support, children with T1D can do anything."
              </div>
              <div className="quote-attr">— The T1D Family Community</div>
            </div>
          </>
        )}

        {/* CHILD MODULES */}
        {activeTab === "child" && !selectedModule && (
          <>
            <div className="section-header">
              <h2>🌟 Learning together</h2>
              <p>Fun, honest, and age-appropriate modules to help your child understand T1D — and feel truly empowered by their knowledge.</p>
            </div>
            <div className="modules-grid">
              {childModules.map(mod => (
                <div
                  key={mod.id}
                  className="module-card"
                  style={{ "--card-color": mod.color }}
                  onClick={() => setSelectedModule({ ...mod, type: "child" })}
                >
                  <span className="module-emoji">{mod.emoji}</span>
                  <div className="module-age" style={{ color: mod.color }}>{mod.ageGroup}</div>
                  <h3>{mod.title}</h3>
                  <p>{mod.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "child" && selectedModule?.type === "child" && (
          <div className="module-detail">
            <button className="back-btn" onClick={() => setSelectedModule(null)}>← Back to modules</button>
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{selectedModule.emoji}</div>
            <h2>{selectedModule.title}</h2>
            <div className="module-age" style={{ color: selectedModule.color, marginBottom: 16 }}>{selectedModule.ageGroup}</div>
            <div className="detail-content">{formatContent(selectedModule.content)}</div>
            {selectedModule.funFact && (
              <div className="fun-fact-box">
                <div className="box-label" style={{ color: COLORS.mint }}>✨ Fun Fact</div>
                <div>{selectedModule.funFact}</div>
              </div>
            )}
            {selectedModule.activity && (
              <div className="activity-box">
                <div className="box-label" style={{ color: COLORS.coral }}>🎨 Activity</div>
                <div style={{ fontWeight: 600 }}>{selectedModule.activity}</div>
              </div>
            )}
          </div>
        )}

        {/* PARENT MODULES */}
        {activeTab === "parent" && !selectedModule && (
          <>
            <div className="section-header">
              <h2>❤️ For Parents</h2>
              <p>Evidence-based, compassionate guides to help you become your child's strongest, most informed advocate — without the fear.</p>
            </div>
            <div className="modules-grid">
              {parentModules.map(mod => (
                <div
                  key={mod.id}
                  className="module-card"
                  style={{ "--card-color": mod.color }}
                  onClick={() => setSelectedModule({ ...mod, type: "parent" })}
                >
                  <span className="module-emoji">{mod.icon}</span>
                  <h3>{mod.title}</h3>
                  <p>{mod.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "parent" && selectedModule?.type === "parent" && (
          <div className="module-detail">
            <button className="back-btn" onClick={() => setSelectedModule(null)}>← Back to modules</button>
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{selectedModule.icon}</div>
            <h2>{selectedModule.title}</h2>
            <div className="detail-content">{formatContent(selectedModule.content)}</div>
            {selectedModule.keyTakeaway && (
              <div className="key-takeaway">
                <span style={{ fontSize: "1.4rem" }}>💡</span>
                <span>{selectedModule.keyTakeaway}</span>
              </div>
            )}
          </div>
        )}

        {/* INSPIRING PEOPLE */}
        {activeTab === "inspiring" && (
          <>
            <div className="section-header">
              <h2>✨ Living brilliantly with T1D</h2>
              <p>These musicians, athletes, leaders, and artists all share one thing with your child — and it has never defined their ceiling.</p>
            </div>
            <div className="people-grid">
              {inspiringPeople.map(person => (
                <div key={person.name} className="person-card" style={{ "--person-color": person.color }}>
                  <span className="person-emoji">{person.emoji}</span>
                  <div className="person-name">{person.name}</div>
                  <div className="person-field" style={{ color: person.color }}>{person.field}</div>
                  <div className="person-diagnosed">Diagnosed: {person.diagnosed}</div>
                  <div className="person-quote" style={{ borderLeftColor: person.color }}>{person.quote}</div>
                </div>
              ))}
            </div>
            <div className="info-banner">
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>🌍</div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1A3A4A", marginBottom: 8 }}>T1D doesn't choose ordinary people</div>
              <div style={{ color: "#4A6070", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
                The list of people thriving with T1D spans every field: the arts, sciences, sport, law, politics, and business. Your child joins a remarkable community of people who prove, every single day, that T1D is a companion — not a ceiling.
              </div>
            </div>
          </>
        )}

        {/* RESOURCES */}
        {activeTab === "resources" && (
          <>
            <div className="section-header">
              <h2>📚 Support & Resources</h2>
              <p>Trusted charities, research organisations, and peer communities — vetted for quality, accuracy, and family-friendliness.</p>
            </div>
            <div className="featured-resource">
              <span style={{ fontSize: "2rem" }}>🔬</span>
              <div>
                <div className="featured-label">Featured Partner</div>
                <div className="featured-name">Breakthrough T1D (formerly JDRF)</div>
                <div className="featured-desc">The world's leading T1D research funder. They've invested over $3 billion toward a cure. Find clinical trials, family resources, and local chapters at breakthrought1d.org</div>
              </div>
            </div>
            <div className="resources-grid">
              {resources.map(r => (
                <a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card"
                  style={{ "--res-color": r.color }}
                >
                  <span className="resource-emoji">{r.emoji}</span>
                  <div className="resource-type" style={{ color: r.color }}>{r.type}</div>
                  <div className="resource-name">{r.name}</div>
                  <div className="resource-desc">{r.description}</div>
                  <div className="resource-link" style={{ color: r.color }}>Visit website →</div>
                </a>
              ))}
            </div>
            <div className="stay-current">
              <div style={{ fontWeight: 800, marginBottom: 6, color: "#1A3A4A" }}>🔔 Stay current</div>
              <div style={{ fontSize: "0.9rem", color: "#4A6070", lineHeight: 1.6 }}>
                T1D research is advancing rapidly. Breakthrough T1D and Diabetes Australia both publish regular updates on clinical trials, new therapies, and technology approvals. Bookmark their news pages and sign up for their newsletters to stay informed with trusted, up-to-date information.
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="footer">
        <p>💙 Built with love for T1D families everywhere</p>
        <p style={{ fontSize: "0.8rem", marginTop: 4, opacity: 0.7 }}>Always consult your endocrinology team for personalised medical advice.</p>
      </div>
    </div>
  );
}
