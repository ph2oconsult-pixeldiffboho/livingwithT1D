import { useState } from "react";
import "./App.css";
import GlucoseExplainer from "./features/GlucoseExplainer";
import ScenarioSimulator from "./features/ScenarioSimulator";
import LearningPath from "./features/LearningPath";
import IsThisNormal from "./features/IsThisNormal";
import SchoolActivityCompanion from "./features/SchoolActivity";
import GlucosePatterns from "./features/GlucosePatterns";
import ExplainMyGlucose from "./features/ExplainMyGlucose";
import Onboarding from "./features/Onboarding";
import Dashboard from "./features/Dashboard";

const COLORS = {
  ocean: "#2E86AB",
  coral: "#F46036",
  mint: "#56C596",
  sunshine: "#FFD166",
  lavender: "#9B8EC4",
  deep: "#1A3A4A",
  soft: "#F7F3EE",
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
    id: "what-is-t1d", title: "What's happening in my body?", emoji: "🫀", color: COLORS.ocean, ageGroup: "All ages",
    description: "A friendly journey through how insulin works — with simple words.",
    content: `Your body has a special organ called the **pancreas**. In most people, it makes a helpful molecule called **insulin** — like a tiny key 🔑 that lets sugar into your cells for energy.\n\nWith Type 1 Diabetes, the body's own defense system accidentally attacks the cells that make insulin. It's not anyone's fault — not yours, not your parents'. It just happens.\n\nNow you get to be your own superhero — checking your blood sugar and giving your body the insulin it needs! 💪`,
    activity: "Draw your pancreas and give it a superhero cape!",
    funFact: "Your pancreas is about the size of your hand — pretty small for such an important job! 🖐️",
  },
  {
    id: "blood-sugar", title: "Understanding my blood sugar", emoji: "📊", color: COLORS.coral, ageGroup: "Ages 6+",
    description: "Learn what blood sugar is, why it matters, and what the numbers mean.",
    content: `**Blood sugar** (also called blood glucose) is the amount of sugar floating in your blood. You need just the right amount — not too much, not too little!\n\n🟢 **In range** (about 70–180 mg/dL): Feels great! You have energy to play, think and laugh.\n\n🔴 **Too low (Hypo)**: You might feel shaky, hungry, or dizzy. Quick fix: eat some fast sugar like juice or glucose tablets!\n\n🟡 **Too high (Hyper)**: You might feel tired or need to go to the bathroom a lot. Insulin helps bring it back down.`,
    activity: "Keep a 3-day 'mood and blood sugar' journal. Do you notice any patterns?",
    funFact: "Your brain uses 20% of all the sugar in your blood — it's a super hungry organ! 🧠",
  },
  {
    id: "coping", title: "It's okay to feel big feelings", emoji: "💙", color: COLORS.lavender, ageGroup: "All ages",
    description: "T1D can bring up lots of emotions. All of them are completely normal.",
    content: `Finding out you have T1D can feel overwhelming. You might feel:\n\n😢 **Sad** — It's okay to grieve. This is a big change.\n😡 **Angry** — "Why me?" is a completely fair question.\n😰 **Scared** — New things can feel scary, but you'll learn to manage them.\n😌 **Hopeful** — Millions of people live amazing lives with T1D!\n\nTalk to your parents, a counselor, or another T1D kid. You are **never** alone in this. There are whole communities of T1D families who understand exactly what you're going through. 🤝`,
    activity: "Write a letter to your future self — a version of you who has learned to live brilliantly with T1D.",
    funFact: "Over 8.4 million people worldwide live with T1D. That's a huge community rooting for you! 🌍",
  },
  {
    id: "daily-life", title: "T1D in my daily life", emoji: "☀️", color: COLORS.mint, ageGroup: "Ages 8+",
    description: "How to handle school, sports, sleepovers and everything in between.",
    content: `T1D comes with you everywhere — and that's actually okay! Here's how to handle some common situations:\n\n🏫 **At school**: Tell a trusted teacher. Keep snacks and your kit nearby. You have the right to check your blood sugar anytime.\n\n⚽ **Playing sports**: Exercise can lower blood sugar — have snacks ready, let your coach know, and wear your medical ID.\n\n🌙 **Sleepovers**: Talk to your parents and your friend's parents beforehand. Set a nighttime alarm to check your levels.\n\n🎂 **Parties & treats**: You can still eat birthday cake! You'll just learn how to balance it with insulin. Nothing is fully off limits.`,
    activity: "Create a 'T1D Kit' checklist for your school bag — what do you need every day?",
    funFact: "Many T1D athletes have competed in the Olympics and professional sports! 🏅",
  },
];

const parentModules = [
  {
    id: "parent-understanding", title: "Understanding T1D: The Science", icon: "🔬", color: COLORS.ocean,
    description: "What T1D actually is — and crucially, what it isn't.",
    content: `Type 1 Diabetes is an **autoimmune condition** where the body's immune system mistakenly destroys the beta cells in the pancreas that produce insulin. Without insulin, glucose cannot enter cells and accumulates in the bloodstream.\n\n**This is NOT:**\n• Caused by eating too much sugar\n• A lifestyle disease (that is Type 2)\n• Something your child or you caused\n• Curable through diet alone\n\n**This IS:**\n• Manageable with insulin therapy, monitoring, and lifestyle awareness\n• A condition thousands of children thrive with every single day\n• Something your whole family will adapt to — and you will adapt.\n\nCurrent treatment involves insulin delivery (via injections or pump) and continuous blood glucose monitoring. Technology has made this more manageable than ever before.`,
    keyTakeaway: "T1D is manageable. Your child can live a full, extraordinary life.",
  },
  {
    id: "parent-emotional", title: "Supporting your child emotionally", icon: "❤️", color: COLORS.coral,
    description: "How to be present without increasing fear or anxiety.",
    content: `The diagnosis is a grief process — for you AND your child. Research shows that parental anxiety directly affects a child's adaptation to T1D. Here's how to help:\n\n**DO:**\n✅ Acknowledge their feelings without minimizing them\n✅ Use calm, factual language about T1D management\n✅ Celebrate their resilience and small wins\n✅ Involve them in age-appropriate decisions about their care\n✅ Connect with other T1D families — peer support is invaluable\n\n**AVOID:**\n❌ Projecting your own fears onto them\n❌ Over-monitoring to the point of anxiety\n❌ Making T1D the center of every family conversation\n❌ Treating them as fragile — they are strong!\n\nPsychological support for both child and parent is a legitimate and important part of T1D care.`,
    keyTakeaway: "Your calm is their calm. Your resilience models theirs.",
  },
  {
    id: "parent-school", title: "Navigating school & social life", icon: "🏫", color: COLORS.mint,
    description: "Advocating for your child while fostering independence.",
    content: `**At School:**\nWork with the school to create a **Diabetes Medical Management Plan (DMMP)**. This legally ensures your child gets appropriate support. Key inclusions:\n• Freedom to check blood sugar and treat lows immediately\n• Access to snacks without permission delays\n• A trained staff member for emergencies\n• Clear communication protocols with you\n\n**Building Independence:**\nAge-appropriate independence in diabetes management is a health outcome in itself. Children who have ownership over their care tend to have better long-term outcomes. Start small:\n• Ages 6–8: Recognize symptoms, tell adults\n• Ages 8–12: Participate in carb counting, understand their kit\n• Ages 12+: Growing autonomy with parental oversight\n\n**Social situations:**\nCoach your child on how to briefly explain T1D to peers. Most children are curious, not unkind. Normalizing it early makes social life much easier.`,
    keyTakeaway: "Advocate fiercely AND foster independence — both are acts of love.",
  },
  {
    id: "parent-tech", title: "Technology & Management Tools", icon: "📱", color: COLORS.lavender,
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

const mentalHealthLinks = [
  { name: "Diabetes Australia – Mental Health", url: "https://www.diabetesaustralia.com.au/living-with-diabetes/mental-health/", desc: "Practical resources for emotional wellbeing when living with or caring for someone with diabetes.", emoji: "🧠", color: COLORS.lavender },
  { name: "Beyond Blue", url: "https://www.beyondblue.org.au", desc: "Australia's leading mental health support service — accessible 24/7 for anxiety, depression, and crisis support.", emoji: "💙", color: COLORS.ocean },
  { name: "Headspace (for young people)", url: "https://headspace.org.au", desc: "Mental health support specifically for children and young people aged 12–25. Online and in-person options.", emoji: "🌿", color: COLORS.mint },
  { name: "Lifeline", url: "https://www.lifeline.org.au", desc: "24/7 crisis support and suicide prevention. Call 13 11 14 anytime.", emoji: "📞", color: COLORS.coral },
  { name: "DiabetesSisters – Diabetes Distress", url: "https://diabetessisters.org/mental-health", desc: "Guidance specifically on 'diabetes distress' — the emotional burden unique to managing a chronic condition.", emoji: "❤️‍🩹", color: COLORS.sunshine },
  { name: "Kids Helpline", url: "https://kidshelpline.com.au", desc: "Free, private counselling for young people aged 5–25, available by phone, webchat or video.", emoji: "🌟", color: COLORS.lavender },
];

const treatments = [
  {
    title: "Insulin Therapy", emoji: "💉", color: COLORS.ocean,
    summary: "The foundation of all T1D management. Everyone with T1D requires insulin to survive.",
    detail: `**Multiple Daily Injections (MDI)**\nThe traditional approach: fast-acting insulin with meals, plus long-acting background insulin once or twice daily. Affordable, widely available, and effective.\n\n**Insulin Pumps**\nA small wearable device delivering a continuous low dose of insulin, with extra doses for meals. Removes the need for multiple daily injections. Leading brands: Omnipod (tubeless) and Medtronic.\n\n**Common insulins**\nRapid-acting: Novorapid, Humalog, Fiasp. Long-acting: Lantus, Levemir, Tresiba.\n\n**Accessibility in Australia**\nThe National Diabetes Services Scheme (NDSS) subsidises insulin and consumables significantly. Speak to your endocrinologist and diabetes educator about accessing these subsidies from the point of diagnosis.`,
  },
  {
    title: "Continuous Glucose Monitors (CGMs)", emoji: "📡", color: COLORS.coral,
    summary: "Small wearable sensors that check blood glucose every few minutes — day and night.",
    detail: `CGMs have transformed T1D management by providing real-time glucose data, trend arrows, and alerts.\n\n**Dexcom G7**: Worn on the arm, lasts 10 days, streams to phone and smartwatch. Highly accurate.\n\n**Abbott FreeStyle Libre 3**: Smaller sensor, 14-day wear, real-time alerts. Very popular in Australia.\n\n**Medtronic Guardian**: Integrates with Medtronic pumps for closed-loop systems.\n\n**Accessibility in Australia**\nFrom July 2022, CGMs are **fully subsidised** under the NDSS for all Australians with T1D under 21. Adults with T1D may also access subsidised CGMs — check ndss.com.au for current eligibility criteria, as this is expanding.`,
  },
  {
    title: "Closed-Loop Systems ('Artificial Pancreas')", emoji: "🤖", color: COLORS.mint,
    summary: "CGM and pump communicate automatically to adjust insulin — the closest thing to a functioning pancreas.",
    detail: `Hybrid closed-loop systems represent the biggest leap forward in T1D technology in decades.\n\n**How it works**: The CGM reads glucose every few minutes and sends data to the pump, which automatically adjusts insulin — increasing if glucose is rising, reducing if falling.\n\n**Leading systems available in Australia**\n• **Tandem t:slim X2 with Control-IQ**: Automatically adjusts and corrects. TGA approved.\n• **Medtronic MiniMed 780G**: Advanced algorithm with auto-correction boluses.\n• **Omnipod 5**: Tubeless pump with closed-loop capability via Dexcom G6.\n\n**DIY Looping**: Some families use open-source systems (Loop, AndroidAPS). Not officially approved but widely used — discuss with your care team.\n\n**Accessibility**: Pumps are subsidised through the NDSS Insulin Pump Program for eligible Australians. Ask your endocrinologist about the application process.`,
  },
  {
    title: "Emerging & Future Treatments", emoji: "🔭", color: COLORS.lavender,
    summary: "Exciting therapies in development that could transform — or even cure — T1D.",
    detail: `**Teplizumab (Tzield)**\nThe first drug approved to **delay the onset** of T1D in at-risk individuals — a landmark milestone in modifying the disease course. Approved by the FDA in 2022; under review in Australia.\n\n**Stem Cell Therapies**\nResearchers are working to grow new insulin-producing beta cells from stem cells. Vertex Pharmaceuticals has reported promising early clinical results.\n\n**Beta Cell Encapsulation**\nTransplanting beta cells in a protective capsule that shields them from the immune system — potentially removing the need for daily insulin.\n\n**Islet Cell Transplantation**\nAlready available at some centres in Australia for severe cases. Replaces destroyed beta cells, though immune suppression is currently required.\n\n**Smart Insulin**\nInsulin molecules that only activate when blood sugar is high. Still in clinical trials but could be game-changing.\n\nFollow Breakthrough T1D (breakthrought1d.org) for the latest updates on all these therapies.`,
  },
];

const researchOpportunities = [
  { name: "Breakthrough T1D Clinical Trials", url: "https://www.breakthrought1d.org/t1d-resources/clinical-trials/", desc: "Search for open trials specifically funded and vetted by Breakthrough T1D. Includes prevention, cure, and management studies.", emoji: "🧬", color: COLORS.ocean, who: "Children & Adults" },
  { name: "ANZCTR – Australian Clinical Trials", url: "https://www.anzctr.org.au", desc: "The Australian New Zealand Clinical Trials Registry. Search 'Type 1 Diabetes' for all open studies across Australia.", emoji: "🇦🇺", color: COLORS.mint, who: "All ages, Australia" },
  { name: "T1D Exchange Registry", url: "https://t1dexchange.org/registry/", desc: "Join the world's largest T1D research registry. Your data helps researchers understand real-world outcomes.", emoji: "📊", color: COLORS.coral, who: "Children & Adults" },
  { name: "TrialNet – Prevention Studies", url: "https://www.trialnet.org", desc: "International network studying T1D prevention and delay. Offers free screening for relatives of people with T1D — important for siblings.", emoji: "🔍", color: COLORS.lavender, who: "Relatives of T1D patients" },
  { name: "Diabetes Australia Research", url: "https://www.diabetesaustralia.com.au/research/", desc: "Australian-specific research opportunities and grants. Supports both patient participation and community-based studies.", emoji: "🏥", color: COLORS.sunshine, who: "Australian families" },
  { name: "ClinicalTrials.gov", url: "https://clinicaltrials.gov/search?cond=Type+1+Diabetes", desc: "The world's most comprehensive clinical trials database. Filter by age, location, and phase to find opportunities near you.", emoji: "🌐", color: COLORS.ocean, who: "Global — all ages" },
];

const seedMessages = [
  { id: 1, author: "Sarah M.", avatar: "👩", role: "Parent", time: "2 days ago", text: "Just joined this community after my 8-year-old was diagnosed last month. Still processing everything but finding so much comfort reading through these posts. Thank you all. 💙" },
  { id: 2, author: "James T.", avatar: "👨", role: "Parent", time: "2 days ago", text: "Welcome Sarah. We were exactly where you are 18 months ago. It gets so much easier. The first few weeks are the hardest — reach out anytime." },
  { id: 3, author: "Lily (age 14)", avatar: "👧", role: "T1D Warrior", time: "1 day ago", text: "Hi! I've had T1D since I was 6. I want any newly diagnosed kids reading this to know — you will be absolutely fine. I play netball, go to sleepovers, eat birthday cake. It becomes normal. 🎉" },
  { id: 4, author: "Rachel K.", avatar: "👩‍⚕️", role: "Diabetes Educator", time: "1 day ago", text: "Such a wonderful thread. For any parents feeling overwhelmed by the numbers and technology — please remember, no one expects perfection. We aim for 'good enough' most days, not perfect. That's genuinely the clinical advice! 😊" },
  { id: 5, author: "Tom B.", avatar: "👦", role: "Parent", time: "20 hours ago", text: "Quick question for the group — how do you handle the school canteen situation? My son (10) feels embarrassed counting carbs in front of friends." },
  { id: 6, author: "Maria S.", avatar: "👩", role: "Parent", time: "18 hours ago", text: "Tom — we pre-loaded his most common lunch choices into the app so he can just tap and go. Looks exactly like what his friends are doing on their phones! Made a huge difference to his confidence." },
];

function formatContent(text) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        <br />
      </span>
    );
  });
}

function ForumTab() {
  const [messages, setMessages] = useState(seedMessages);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Parent");
  const [text, setText] = useState("");
  const [posted, setPosted] = useState(false);

  const handlePost = () => {
    if (!text.trim() || !name.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1,
      author: name.trim(),
      avatar: role === "T1D Warrior" ? "🌟" : "💬",
      role, time: "Just now", text: text.trim(),
    }]);
    setText(""); setName(""); setPosted(true);
    setTimeout(() => setPosted(false), 3000);
  };

  return (
    <>
      <div className="section-header">
        <h2>💬 Community Forum</h2>
        <p>A safe, warm space for T1D families to connect, share experiences, ask questions, and support one another. You are never alone.</p>
      </div>
      <div className="forum-disclaimer">
        <strong>Community guidelines:</strong> This forum is a peer support space. Please be kind and respectful. For medical advice, always consult your endocrinology team.
      </div>
      <div className="forum-messages">
        {messages.map(msg => (
          <div key={msg.id} className="forum-message">
            <div className="forum-avatar">{msg.avatar}</div>
            <div className="forum-body">
              <div className="forum-meta">
                <span className="forum-author">{msg.author}</span>
                <span className="forum-role">{msg.role}</span>
                <span className="forum-time">{msg.time}</span>
              </div>
              <div className="forum-text">{msg.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="forum-compose">
        <h3 style={{ marginBottom: 16, fontSize: "1rem", fontWeight: 800, color: COLORS.deep }}>Share your thoughts or ask a question</h3>
        <div className="forum-fields">
          <input className="forum-input" placeholder="Your name or first name" value={name} onChange={e => setName(e.target.value)} />
          <select className="forum-select" value={role} onChange={e => setRole(e.target.value)}>
            <option>Parent</option>
            <option>T1D Warrior</option>
            <option>Family Member</option>
            <option>Healthcare Professional</option>
            <option>Other</option>
          </select>
        </div>
        <textarea className="forum-textarea" placeholder="Write your message here — a question, a story, some encouragement..." value={text} onChange={e => setText(e.target.value)} rows={4} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="forum-post-btn" onClick={handlePost}>Post to community →</button>
          {posted && <span style={{ color: COLORS.mint, fontWeight: 700, fontSize: "0.9rem" }}>✓ Posted! Thank you.</span>}
        </div>
      </div>
    </>
  );
}

function MentalHealthTab() {
  return (
    <>
      <div className="section-header">
        <h2>🧠 Mental Health & Wellbeing</h2>
        <p>T1D affects the whole family emotionally — not just physically. Seeking support is a sign of strength, not struggle.</p>
      </div>
      <div className="mh-banner">
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>💙</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: 8 }}>Diabetes Distress is real — and common</div>
        <div style={{ fontSize: "0.9rem", lineHeight: 1.7, opacity: 0.9 }}>
          Research shows that up to 45% of people with T1D experience significant diabetes-related distress — and parents face their own significant emotional burden. Feeling anxious, exhausted, or overwhelmed is a normal response to a genuinely demanding situation. The resources below are here for you.
        </div>
      </div>
      <div className="resources-grid" style={{ marginBottom: 32 }}>
        {mentalHealthLinks.map(r => (
          <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-card" style={{ "--res-color": r.color }}>
            <span className="resource-emoji">{r.emoji}</span>
            <div className="resource-name">{r.name}</div>
            <div className="resource-desc">{r.desc}</div>
            <div className="resource-link" style={{ color: r.color }}>Visit →</div>
          </a>
        ))}
      </div>
      <div className="mh-tips">
        <div style={{ fontWeight: 800, fontSize: "1rem", color: COLORS.deep, marginBottom: 16 }}>🌿 Evidence-based coping strategies</div>
        {[
          { emoji: "🤝", tip: "Connect with other T1D families", detail: "Peer support consistently shows better emotional outcomes than professional support alone. Online and in-person communities make a profound difference." },
          { emoji: "📓", tip: "Don't aim for perfect diabetes management", detail: "Aiming for perfection causes burnout. Most endocrinologists are happy with 70% time-in-range — 'good enough' is genuinely the clinical goal." },
          { emoji: "🧘", tip: "Mindfulness & breathing techniques", detail: "Short daily mindfulness practices reduce diabetes distress. Apps like Headspace and Smiling Mind offer free programs specifically for families." },
          { emoji: "💬", tip: "Talk to a psychologist who understands chronic illness", detail: "Seek one via your diabetes care team, or ask Diabetes Australia for a referral to someone with chronic illness experience." },
        ].map(item => (
          <div key={item.tip} className="mh-tip-card">
            <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{item.emoji}</div>
            <div style={{ fontWeight: 800, marginBottom: 6, color: COLORS.deep }}>{item.tip}</div>
            <div style={{ fontSize: "0.875rem", color: "#4A6070", lineHeight: 1.5 }}>{item.detail}</div>
          </div>
        ))}
      </div>
      <div className="crisis-box">
        <div style={{ fontWeight: 800, marginBottom: 8 }}>🆘 If you or your child needs urgent support</div>
        <div style={{ fontSize: "0.9rem", lineHeight: 1.9 }}>
          <strong>Lifeline (Australia):</strong> 13 11 14 — available 24/7<br />
          <strong>Kids Helpline:</strong> 1800 55 1800 — for young people up to 25<br />
          <strong>Beyond Blue:</strong> 1300 22 4636<br />
          <strong>Emergency:</strong> 000
        </div>
      </div>
    </>
  );
}

function TreatmentsTab() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="section-header">
        <h2>💊 Treatments & Accessibility</h2>
        <p>A clear guide to current T1D treatments, what's available in Australia, and how to access subsidies and support.</p>
      </div>
      <div className="ndss-banner">
        <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>🇦🇺</div>
        <div style={{ fontWeight: 800, fontSize: "1.05rem", marginBottom: 6 }}>National Diabetes Services Scheme (NDSS)</div>
        <div style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
          The NDSS is an Australian Government initiative that subsidises insulin, CGMs, pump consumables, and blood glucose test strips. Register at <strong>ndss.com.au</strong> through your GP or endocrinologist as early as possible — most families are eligible from the point of diagnosis.
        </div>
      </div>
      <div style={{ display: "grid", gap: 16, marginBottom: 32 }}>
        {treatments.map(t => (
          <div key={t.title} className="treatment-card" style={{ "--t-color": t.color }}>
            <div className="treatment-header" onClick={() => setOpen(open === t.title ? null : t.title)}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>{t.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1rem", color: COLORS.deep }}>{t.title}</div>
                  <div style={{ fontSize: "0.85rem", color: "#4A6070", marginTop: 2 }}>{t.summary}</div>
                </div>
              </div>
              <span className="treatment-chevron">{open === t.title ? "▲" : "▼"}</span>
            </div>
            {open === t.title && (
              <div className="treatment-detail">{formatContent(t.detail)}</div>
            )}
          </div>
        ))}
      </div>
      <div className="stay-current">
        <div style={{ fontWeight: 800, marginBottom: 8, color: COLORS.deep }}>📋 Questions to ask your endocrinologist</div>
        <div style={{ fontSize: "0.9rem", color: "#4A6070", lineHeight: 1.9 }}>
          • Is my child eligible for a subsidised CGM through the NDSS?<br />
          • Would an insulin pump be appropriate for my child's age and lifestyle?<br />
          • Is a closed-loop system suitable for us right now?<br />
          • What financial assistance is available for pump consumables?<br />
          • Are there any clinical trials we should know about?
        </div>
      </div>
    </>
  );
}

function ResearchTab() {
  return (
    <>
      <div className="section-header">
        <h2>🔬 Participating in Research</h2>
        <p>Every family who participates in T1D research helps bring a cure closer. Here's how to get involved — safely and confidently.</p>
      </div>
      <div className="research-why">
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", marginBottom: 16, color: COLORS.deep }}>Why participate?</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 16, marginBottom: 8 }}>
          {[
            { emoji: "🧬", text: "Help scientists understand T1D — potentially accelerating a cure" },
            { emoji: "💊", text: "Access cutting-edge treatments before they're widely available" },
            { emoji: "📊", text: "Contribute real-world data that changes clinical guidelines" },
            { emoji: "🤝", text: "Join a global community working toward the same goal" },
          ].map(item => (
            <div key={item.text} className="research-why-card">
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{item.emoji}</div>
              <div style={{ fontSize: "0.875rem", color: "#4A6070", lineHeight: 1.5 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="resources-grid" style={{ marginBottom: 28 }}>
        {researchOpportunities.map(r => (
          <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-card" style={{ "--res-color": r.color }}>
            <span className="resource-emoji">{r.emoji}</span>
            <div className="resource-type" style={{ color: r.color }}>{r.who}</div>
            <div className="resource-name">{r.name}</div>
            <div className="resource-desc">{r.desc}</div>
            <div className="resource-link" style={{ color: r.color }}>Explore →</div>
          </a>
        ))}
      </div>
      <div className="research-safe">
        <div style={{ fontWeight: 800, marginBottom: 10, fontSize: "1rem", color: COLORS.deep }}>✅ Participating safely — what to know</div>
        <div style={{ fontSize: "0.9rem", color: "#4A6070", lineHeight: 1.9 }}>
          • All legitimate trials are registered on a national or international registry<br />
          • Participation must be fully informed and voluntary — you can withdraw at any time<br />
          • Ethical review boards (HRECs in Australia) must approve all trials involving children<br />
          • You will never be charged to participate in a clinical trial<br />
          • Ask your endocrinologist before enrolling — they can help you assess suitability<br />
          • TrialNet screening for siblings and relatives is <strong>free</strong> and non-invasive
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedModule, setSelectedModule] = useState(null);
  const [profile, setProfile] = useState(null);      // null = not onboarded yet
  const [onboarding, setOnboarding] = useState(true); // show onboarding first visit

  // Two nav tiers: primary (always visible) + secondary (overflow)
  const primaryTabs = [
    { id: "home",       label: "Home",       emoji: "🏠" },
    { id: "explainer",  label: "Explain",    emoji: "🔎" },
    { id: "isnormal",   label: "Normal?",    emoji: "🤔" },
    { id: "activity",   label: "Life Guide", emoji: "🏫" },
    { id: "learning",   label: "90 Days",    emoji: "🗓️" },
    { id: "patterns",   label: "Patterns",   emoji: "📈" },
  ];
  const secondaryTabs = [
    { id: "letter",     label: "Our Story",  emoji: "💌" },
    { id: "simulator",  label: "What If?",   emoji: "🎮" },
    { id: "child",      label: "For Kids",   emoji: "🌟" },
    { id: "parent",     label: "For Parents",emoji: "❤️" },
    { id: "treatments", label: "Treatments", emoji: "💊" },
    { id: "inspiring",  label: "Inspiring",  emoji: "✨" },
    { id: "mental",     label: "Wellbeing",  emoji: "🧠" },
    { id: "research",   label: "Research",   emoji: "🔬" },
    { id: "forum",      label: "Community",  emoji: "💬" },
    { id: "resources",  label: "Resources",  emoji: "📚" },
  ];
  const [moreOpen, setMoreOpen] = useState(false);
  const allTabs = [...primaryTabs, ...secondaryTabs];

  const switchTab = (id) => {
    setActiveTab(id);
    setSelectedModule(null);
    setMoreOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeOnboarding = (prof) => {
    setProfile(prof);
    setOnboarding(false);
  };

  // Show onboarding on first load
  if (onboarding) return <Onboarding onComplete={completeOnboarding} />;

  return (
    <div className="app">
      <div className="hero">
        <div className="hero-badge">Built from a family's journey</div>
        <h1>A learning companion for families<br />navigating life with <span>Type 1 Diabetes</span></h1>
        <p className="hero-sub">Helping parents understand glucose behaviour, everyday situations, and the decisions of T1D — with confidence.</p>
        <div className="hero-ctas">
          <button className="hero-cta-primary" onClick={() => switchTab("explainer")}>Explain My Glucose →</button>
          <button className="hero-letter-btn" onClick={() => switchTab("letter")}>Our story</button>
        </div>
      </div>

      {/* Primary nav */}
      <div className="nav-container">
        <div className="nav-tabs">
          {primaryTabs.map(t => (
            <button key={t.id} className={`nav-tab ${activeTab === t.id ? "active" : ""}`} onClick={() => switchTab(t.id)}>
              <span className="tab-emoji">{t.emoji}</span>
              {t.label}
            </button>
          ))}
          {/* More dropdown */}
          <div style={{ position: "relative" }}>
            <button className={`nav-tab ${moreOpen ? "active" : ""}`} onClick={() => setMoreOpen(o => !o)}>
              ☰ More
            </button>
            {moreOpen && (
              <div className="more-dropdown">
                {secondaryTabs.map(t => (
                  <button key={t.id} className="more-item" onClick={() => switchTab(t.id)}>
                    <span>{t.emoji}</span> {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="content">

        {activeTab === "home" && (
          <Dashboard profile={profile} onNavigate={switchTab} />
        )}



        {activeTab === "child" && !selectedModule && (
          <>
            <div className="section-header">
              <h2>🌟 Learning together</h2>
              <p>Fun, honest, and age-appropriate modules to help your child understand T1D — and feel truly empowered.</p>
            </div>
            <div className="modules-grid">
              {childModules.map(mod => (
                <div key={mod.id} className="module-card" style={{ "--card-color": mod.color }} onClick={() => setSelectedModule({ ...mod, type: "child" })}>
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
            {selectedModule.funFact && <div className="fun-fact-box"><div className="box-label" style={{ color: COLORS.mint }}>✨ Fun Fact</div><div>{selectedModule.funFact}</div></div>}
            {selectedModule.activity && <div className="activity-box"><div className="box-label" style={{ color: COLORS.coral }}>🎨 Activity</div><div style={{ fontWeight: 600 }}>{selectedModule.activity}</div></div>}
          </div>
        )}

        {activeTab === "parent" && !selectedModule && (
          <>
            <div className="section-header">
              <h2>❤️ For Parents</h2>
              <p>Evidence-based, compassionate guides to help you become your child's strongest, most informed advocate — without the fear.</p>
            </div>
            <div className="modules-grid">
              {parentModules.map(mod => (
                <div key={mod.id} className="module-card" style={{ "--card-color": mod.color }} onClick={() => setSelectedModule({ ...mod, type: "parent" })}>
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
            {selectedModule.keyTakeaway && <div className="key-takeaway"><span style={{ fontSize: "1.4rem" }}>💡</span><span>{selectedModule.keyTakeaway}</span></div>}
          </div>
        )}

        {activeTab === "treatments" && <TreatmentsTab />}

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
              <div style={{ fontWeight: 800, fontSize: "1rem", color: COLORS.deep, marginBottom: 8 }}>T1D doesn't choose ordinary people</div>
              <div style={{ color: "#4A6070", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
                The list of people thriving with T1D spans every field. Your child joins a remarkable community who prove every day that T1D is a companion — not a ceiling.
              </div>
            </div>
          </>
        )}

        {activeTab === "patterns"  && <GlucosePatterns />}
        {activeTab === "learning"  && <LearningPath />}
        {activeTab === "letter" && (
          <div className="open-letter">
            <div className="letter-header">
              <div className="letter-eyebrow">💌 An open letter</div>
              <h2>To parents of a child newly diagnosed with Type 1 Diabetes</h2>
            </div>
            <div className="letter-body">
              <p className="letter-lead">If your child has just been diagnosed with Type 1 Diabetes, your world may feel like it has changed overnight.</p>
              <p>Suddenly there are new words, new routines, and more decisions than you ever imagined.</p>
              <div className="letter-list">
                <span>Carb counting.</span>
                <span>Insulin doses.</span>
                <span>Glucose numbers.</span>
                <span>Highs. Lows. Alarms in the middle of the night.</span>
              </div>
              <p>It can feel overwhelming.</p>
              <p>Many parents describe the first months as a blur of information and worry — trying to learn quickly while also helping their child adjust to something none of you asked for.</p>
              <div className="letter-callout">If that is where you are right now, please know something important:<br /><strong>You will learn this.</strong></div>
              <p>Not all at once. Not perfectly. But step by step.</p>
              <p>Over time, the things that seem impossible today will slowly become part of your family's rhythm.</p>
              <p>You will learn how food affects glucose. You will learn how exercise changes things. You will learn how to manage the unexpected highs and lows.</p>
              <p>And your child will learn too.</p>
              <p>Children living with Type 1 Diabetes develop an extraordinary awareness of their own bodies. They grow in resilience, independence, and strength.</p>
              <div className="letter-divider">— ✦ —</div>
              <p>I know this because our family has walked this path.</p>
              <p>When my daughter was diagnosed, we had to learn everything from the beginning — just like you may be doing now. We experienced the same uncertainty, the same late nights checking glucose, the same constant questions about whether we were doing the right thing.</p>
              <p>But we also watched something remarkable happen.</p>
              <p>Our daughter grew stronger through the experience. Instead of defining her, Type 1 Diabetes became part of what shaped her determination and purpose.</p>
              <p><strong>Today she works with Breakthrough T1D</strong>, helping advance research and support for people living with T1D.</p>
              <div className="letter-divider">— ✦ —</div>
              <p>This project was created because we remember how difficult those early months were.</p>
              <p>The goal is simple: to help families understand the everyday decisions that come with Type 1 Diabetes — and to feel more confident navigating them.</p>
              <p>No tool or guide will ever remove the condition entirely. But knowledge, experience, and support can make the journey much easier.</p>
              <div className="letter-closing">
                <p>If you are at the beginning of this path, please remember:</p>
                <p><strong>You are not alone.</strong><br /><strong>You will learn this.</strong><br /><strong>And your child can grow up to live an extraordinary life.</strong></p>
              </div>
            </div>
            <div className="letter-footer">
              <div className="letter-sig">With love and solidarity,</div>
              <div className="letter-sig-name">A T1D family, for T1D families</div>
              <button className="explain-btn" style={{ marginTop: 24 }} onClick={() => { setActiveTab("home"); window.scrollTo(0,0); }}>Explore the app →</button>
            </div>
          </div>
        )}
        {activeTab === "explainer" && <ExplainMyGlucose />}
        {activeTab === "simulator" && <ScenarioSimulator />}
        {activeTab === "isnormal"  && <IsThisNormal />}
        {activeTab === "activity"  && <SchoolActivityCompanion />}

        {activeTab === "mental" && <MentalHealthTab />}
        {activeTab === "research" && <ResearchTab />}
        {activeTab === "forum" && <ForumTab />}

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
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-card" style={{ "--res-color": r.color }}>
                  <span className="resource-emoji">{r.emoji}</span>
                  <div className="resource-type" style={{ color: r.color }}>{r.type}</div>
                  <div className="resource-name">{r.name}</div>
                  <div className="resource-desc">{r.description}</div>
                  <div className="resource-link" style={{ color: r.color }}>Visit website →</div>
                </a>
              ))}
            </div>
            <div className="stay-current">
              <div style={{ fontWeight: 800, marginBottom: 6, color: COLORS.deep }}>🔔 Stay current</div>
              <div style={{ fontSize: "0.9rem", color: "#4A6070", lineHeight: 1.6 }}>
                T1D research is advancing rapidly. Breakthrough T1D and Diabetes Australia both publish regular updates on clinical trials, new therapies, and technology approvals. Bookmark their news pages and sign up for newsletters to stay informed.
              </div>
            </div>
          </>
        )}

      </div>

      <div className="disclaimer-section">
        <div className="disclaimer-box">
          <div className="disclaimer-title">⚕️ Medical Disclaimer</div>
          <div className="disclaimer-text">
            The information provided in this application is intended for general educational and informational purposes only. It does not constitute medical advice, diagnosis, or treatment, and should not be relied upon as a substitute for professional medical consultation.
          </div>
          <div className="disclaimer-text">
            Always seek the guidance of your qualified healthcare provider — including your endocrinologist, diabetes educator, or GP — with any questions you may have regarding your child's medical condition, treatment plan, medications, or devices. Never disregard professional medical advice or delay seeking it because of something you have read in this application.
          </div>
          <div className="disclaimer-text">
            In the event of a medical emergency, call <strong>000</strong> (Australia) immediately.
          </div>
          <div className="disclaimer-text" style={{ opacity: 0.75 }}>
            Information about treatments, subsidies, and clinical trials is accurate to the best of our knowledge at time of publication but may change. Always verify current eligibility and availability with your healthcare team or the relevant organisation directly.
          </div>
        </div>
      </div>

      <div className="footer">
        <p>💙 Built with love for T1D families everywhere</p>
        <p style={{ fontSize: "0.8rem", marginTop: 4, opacity: 0.7 }}>© 2025 Living Brilliantly with T1D. For educational purposes only.</p>
      </div>
    </div>
  );
}
