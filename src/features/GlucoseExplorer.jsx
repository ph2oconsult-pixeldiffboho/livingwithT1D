import { useState } from "react";

const COLORS = {
  ocean: "#2E86AB", coral: "#F46036", mint: "#56C596",
  sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A", soft: "#F7F3EE",
};

// ── Badge definitions ─────────────────────────────────────────────────────────
const BADGES = {
  "pattern-detective":  { emoji: "🔍", name: "Pattern Detective",  desc: "You spotted a delayed spike after pizza!" },
  "sport-scientist":    { emoji: "⚽", name: "Sport Scientist",     desc: "You noticed how exercise changes glucose!" },
  "night-explorer":     { emoji: "🌙", name: "Night Explorer",      desc: "You learned why glucose rises overnight!" },
  "sugar-detective":    { emoji: "🍰", name: "Sugar Detective",     desc: "You discovered how sweet food affects glucose!" },
  "body-expert":        { emoji: "🧠", name: "Body Expert",         desc: "You understand how insulin works!" },
  "engine-master":      { emoji: "🔋", name: "Energy Engine Master", desc: "You learned how your body uses food for fuel!" },
};

// ── Story scenarios ───────────────────────────────────────────────────────────
const STORIES = [
  {
    id: "pizza-night",
    emoji: "🍕",
    title: "The Pizza Night Mystery",
    color: COLORS.coral,
    childStory: "After dinner your glucose stayed steady for a while… then it started to rise — later than expected. Your body took longer to use the energy from that meal.",
    parentNote: "Delayed spike likely caused by a high-fat meal slowing gastric emptying — the 'pizza effect'. Fat delays carbohydrate absorption by 2–4 hours.",
    question: "What do you think caused the slow rise?",
    options: [
      { id: "pizza",    emoji: "🍕", label: "Pizza night",       correct: true,  explanation: "Yes! Pizza has lots of fat and cheese. Fat slows down how fast your body absorbs the carbs — so glucose rises slowly, much later than usual." },
      { id: "soccer",   emoji: "⚽", label: "Soccer practice",   correct: false, explanation: "Exercise usually makes glucose go DOWN, not up slowly. Good thinking though!" },
      { id: "cake",     emoji: "🍰", label: "Birthday cake",     correct: false, explanation: "Cake usually causes a quick spike, not a slow one. But pizza is sneaky — it rises slowly and later!" },
      { id: "sleep",    emoji: "😴", label: "Growing overnight", correct: false, explanation: "Overnight rises do happen — but this rise happened after dinner, not during sleep. Pizza was the culprit!" },
    ],
    badge: "pattern-detective",
    metaphor: { title: "The Slow Fuel Pump", body: "Imagine filling a car with thick honey instead of normal fuel. It takes much longer to get in the tank! That's what fat does to food — it slows everything down." },
  },
  {
    id: "sport-drop",
    emoji: "⚽",
    title: "The Soccer Surprise",
    color: COLORS.mint,
    childStory: "During soccer practice your glucose was steady. But hours later — even after you finished playing — your glucose started to drop. Your muscles were still using energy long after the game!",
    parentNote: "Delayed post-exercise hypoglycaemia: muscles continue absorbing glucose to replenish glycogen stores for up to 12 hours after exercise.",
    question: "Why did glucose drop so much later?",
    options: [
      { id: "muscles",  emoji: "💪", label: "Muscles still working",   correct: true,  explanation: "Exactly! Even after you stop running, your muscles keep 'drinking' glucose to refill their energy stores. It can take up to 12 hours!" },
      { id: "dinner",   emoji: "🍽️", label: "Didn't eat enough dinner", correct: false, explanation: "That could make it worse — but the main reason is your muscles quietly using glucose even while you rest!" },
      { id: "insulin",  emoji: "💉", label: "Too much insulin",         correct: false, explanation: "Sometimes — but the special thing here is that exercise itself makes muscles absorb glucose directly, even without insulin!" },
      { id: "sleep",    emoji: "😴", label: "Sleeping too much",         correct: false, explanation: "Sleep doesn't cause drops like this. It's your hard-working muscles that are the real cause!" },
    ],
    badge: "sport-scientist",
    metaphor: { title: "The Sponge Effect", body: "After sport, your muscles are like a dry sponge — they soak up glucose from your blood to refill. Even hours later, that sponge is still quietly absorbing!" },
  },
  {
    id: "dawn-rise",
    emoji: "🌙",
    title: "The Night-time Mystery",
    color: COLORS.lavender,
    childStory: "While you were fast asleep and dreaming, your glucose started to rise slowly — all on its own. Nobody gave you any food. But your body was quietly getting ready for a new day.",
    parentNote: "Dawn phenomenon: growth hormone released during deep sleep (typically 2–8 AM) causes temporary insulin resistance. Very common in children and adolescents.",
    question: "What made glucose rise while sleeping?",
    options: [
      { id: "growth",   emoji: "📈", label: "Body getting ready to grow", correct: true,  explanation: "Yes! Your body releases a special hormone while you sleep — it helps you grow! But it also makes glucose rise a little. It's completely normal." },
      { id: "food",     emoji: "🍪", label: "Midnight snack",             correct: false, explanation: "You were asleep — no midnight snacking! Your own body caused this rise all by itself." },
      { id: "dreams",   emoji: "💭", label: "Exciting dreams",            correct: false, explanation: "Ha! Dreams can feel exciting, but they don't change glucose. It's the growth hormones that do this." },
      { id: "cold",     emoji: "🥶", label: "Being too cold",             correct: false, explanation: "Temperature doesn't cause this pattern. Your body's own chemistry is the sneaky culprit!" },
    ],
    badge: "night-explorer",
    metaphor: { title: "The Body Clock", body: "Your body has a built-in clock. In the early morning hours, it starts getting ready for your day — releasing hormones that give you energy. One side effect is that glucose rises a little. It's your body saying 'good morning'!" },
  },
  {
    id: "cake-spike",
    emoji: "🍰",
    title: "The Birthday Cake Spike",
    color: COLORS.sunshine,
    childStory: "After birthday cake, your glucose zoomed up quickly — much faster than after a normal meal. Then it came back down. Sugar moves into the blood very fast!",
    parentNote: "Rapid-acting carbohydrates (sugar, juice, white flour) absorb quickly, causing a sharp glucose spike within 30–60 minutes. High glycaemic index foods.",
    question: "Why did glucose rise so fast after cake?",
    options: [
      { id: "sugar",    emoji: "🍬", label: "Sugar moves fast",          correct: true,  explanation: "Exactly right! Sugar and sweet foods are already in a simple form — your body absorbs them in minutes. That's why glucose zooms up so quickly." },
      { id: "fat",      emoji: "🧈", label: "Butter in the cake",        correct: false, explanation: "Fat actually SLOWS glucose down — that's the pizza effect! Sugar is what makes it zoom up fast." },
      { id: "candles",  emoji: "🕯️", label: "Blowing out candles",       correct: false, explanation: "Ha! Candles don't affect glucose — but sugar definitely does!" },
      { id: "excited",  emoji: "🎉", label: "Excitement and adrenaline", correct: false, explanation: "Being excited can raise glucose a tiny bit — but cake has so much sugar that it's the main reason here." },
    ],
    badge: "sugar-detective",
    metaphor: { title: "Fast Fuel vs Slow Fuel", body: "Think of glucose like different types of fire starters. Sugar is like paper — it catches fire instantly and burns fast. Bread and pasta are like logs — they burn slower and longer. Both give energy, just at different speeds!" },
  },
  {
    id: "insulin-key",
    emoji: "🔑",
    title: "How Insulin Works",
    color: COLORS.ocean,
    childStory: "After eating, glucose entered your blood. Then insulin arrived — like a key unlocking a door — letting the glucose into your cells. That's how your body gets energy from food.",
    parentNote: "Basic insulin mechanism: insulin binds to cell receptors, enabling glucose uptake. In T1D, exogenous insulin replaces what the pancreas can no longer produce.",
    question: "What does insulin do in your body?",
    options: [
      { id: "key",      emoji: "🔑", label: "Acts like a key to unlock cells", correct: true,  explanation: "Perfect! Insulin is like a key that unlocks your cells so glucose can get inside and give you energy. Without that key, glucose just floats around in the blood." },
      { id: "eats",     emoji: "😋", label: "Eats the glucose up",             correct: false, explanation: "Insulin doesn't eat glucose — it opens doors! The cells are the ones that use glucose for energy." },
      { id: "stops",    emoji: "🛑", label: "Stops glucose entering the body", correct: false, explanation: "It's the opposite! Insulin helps glucose get INTO cells, not stay out." },
      { id: "sleep",    emoji: "😴", label: "Makes you sleepy",                correct: false, explanation: "That's not insulin's job. Its main role is to be the key that lets glucose into cells for energy!" },
    ],
    badge: "body-expert",
    metaphor: { title: "The Key and Lock", body: "Imagine each of your cells is a little house. Glucose wants to get inside to give energy. But the door is locked! Insulin is the key. Without a key, glucose has to wait outside — and that's what causes high glucose." },
  },
  {
    id: "energy-engine",
    emoji: "🔋",
    title: "Your Body's Energy Engine",
    color: COLORS.mint,
    childStory: "Your body is like an amazing engine. Food is the fuel, insulin is the key that gets fuel into the engine, and exercise burns through the fuel. Every part of your day affects how the engine runs!",
    parentNote: "Systems-level understanding of glucose metabolism: food raises glucose, insulin enables cellular uptake, exercise increases glucose consumption both during and after activity.",
    question: "In your body's energy engine, what does food do?",
    options: [
      { id: "fuel",     emoji: "⛽", label: "It's the fuel",              correct: true,  explanation: "Yes! Food — especially carbohydrates — is the fuel that powers everything you do: running, thinking, growing, even sleeping!" },
      { id: "key",      emoji: "🔑", label: "It's the key",               correct: false, explanation: "Insulin is the key! Food is more like the fuel that goes in the tank." },
      { id: "engine",   emoji: "⚙️", label: "It is the engine",           correct: false, explanation: "Your body is the engine! Food is what powers it — like petrol in a car." },
      { id: "exhaust",  emoji: "💨", label: "It's the exhaust",           correct: false, explanation: "Ha! Food is the fuel that goes IN, not the exhaust that comes out. Your body uses it for energy." },
    ],
    badge: "engine-master",
    metaphor: { title: "The Amazing Engine", body: "Food = fuel ⛽  |  Insulin = key 🔑  |  Exercise = burning fuel 🔥\n\nWhen everything works together, your engine runs beautifully. With T1D, you just help by providing the key (insulin) yourself — which actually makes you a really amazing engineer!" },
  },
];

// ── Mini CGM chart ────────────────────────────────────────────────────────────
function StoryChart({ storyId, color }) {
  const paths = {
    "pizza-night":   "M10,60 Q40,58 70,55 Q100,52 130,50 Q160,48 190,45 Q220,50 250,65 Q270,78 290,85",
    "sport-drop":    "M10,50 Q50,48 90,52 Q130,55 160,60 Q190,65 220,72 Q250,80 290,88",
    "dawn-rise":     "M10,80 Q50,78 90,74 Q130,68 170,60 Q210,52 250,44 Q270,40 290,38",
    "cake-spike":    "M10,65 Q30,60 50,40 Q60,25 80,22 Q100,28 120,42 Q150,58 190,64 Q240,66 290,65",
    "insulin-key":   "M10,35 Q40,38 70,55 Q100,68 130,72 Q160,70 190,62 Q230,55 290,58",
    "energy-engine": "M10,60 Q50,55 80,40 Q110,30 130,35 Q150,42 170,58 Q200,68 230,65 Q260,62 290,60",
  };
  const rangeFill = "M10,40 Q150,38 290,40 L290,75 Q150,77 10,75 Z";

  return (
    <svg viewBox="0 0 300 100" style={{ width: "100%", height: 80, display: "block" }}>
      <path d={rangeFill} fill={COLORS.mint} fillOpacity={0.12} />
      <line x1="10" y1="40" x2="290" y2="40" stroke={COLORS.mint} strokeWidth="0.5" strokeDasharray="4,3" />
      <line x1="10" y1="75" x2="290" y2="75" stroke={COLORS.coral} strokeWidth="0.5" strokeDasharray="4,3" />
      <path d={paths[storyId] || paths["pizza-night"]} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <text x="292" y="43" fontSize="7" fill={COLORS.mint}>10</text>
      <text x="292" y="78" fontSize="7" fill={COLORS.coral}>4</text>
    </svg>
  );
}

// ── Badge display ─────────────────────────────────────────────────────────────
function BadgeShelf({ earned }) {
  if (earned.length === 0) return null;
  return (
    <div className="ge-badge-shelf">
      <div className="ge-shelf-label">🏆 Your badges</div>
      <div className="ge-badges-row">
        {earned.map(id => {
          const b = BADGES[id];
          return (
            <div key={id} className="ge-badge">
              <div className="ge-badge-emoji">{b.emoji}</div>
              <div className="ge-badge-name">{b.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Single story card ─────────────────────────────────────────────────────────
function StoryCard({ story, onEarnBadge, earnedBadges, onBack }) {
  const [phase, setPhase] = useState("story"); // story → guess → result → metaphor
  const [chosen, setChosen] = useState(null);

  const correct = story.options.find(o => o.correct);
  const selected = story.options.find(o => o.id === chosen);

  const handleGuess = (id) => {
    setChosen(id);
    setPhase("result");
    const opt = story.options.find(o => o.id === id);
    if (opt?.correct && !earnedBadges.includes(story.badge)) {
      onEarnBadge(story.badge);
    }
  };

  return (
    <div className="ge-story-card" style={{ "--s-color": story.color }}>
      <button className="back-btn" onClick={onBack}>← Back to stories</button>

      {/* Header */}
      <div className="ge-story-header" style={{ background: story.color }}>
        <div className="ge-story-emoji">{story.emoji}</div>
        <h2 className="ge-story-title">{story.title}</h2>
      </div>

      {/* Chart */}
      <div className="ge-chart-wrap">
        <div className="ge-chart-label">Glucose pattern</div>
        <StoryChart storyId={story.id} color={story.color} />
      </div>

      {/* Story phase */}
      {phase === "story" && (
        <>
          <div className="ge-story-bubble">
            <div className="ge-bubble-label">📖 What happened</div>
            <p className="ge-story-text">{story.childStory}</p>
          </div>
          <button className="ge-btn" style={{ background: story.color }}
            onClick={() => setPhase("guess")}>
            Can you guess why? →
          </button>
        </>
      )}

      {/* Guess phase */}
      {phase === "guess" && (
        <>
          <div className="ge-question">{story.question}</div>
          <div className="ge-options">
            {story.options.map(opt => (
              <button key={opt.id} className="ge-option" onClick={() => handleGuess(opt.id)}>
                <span className="ge-opt-emoji">{opt.emoji}</span>
                <span className="ge-opt-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Result phase */}
      {phase === "result" && selected && (
        <>
          <div className={`ge-result ${selected.correct ? "correct" : "incorrect"}`}>
            <div className="ge-result-icon">{selected.correct ? "🎉" : "💡"}</div>
            <div className="ge-result-text">{selected.explanation}</div>
            {!selected.correct && (
              <div className="ge-correct-hint">
                The answer was: {correct.emoji} {correct.label}
              </div>
            )}
          </div>
          {selected.correct && (
            <div className="ge-badge-earned">
              <div className="ge-badge-earned-emoji">{BADGES[story.badge].emoji}</div>
              <div>
                <div className="ge-badge-earned-name">Badge earned: {BADGES[story.badge].name}</div>
                <div className="ge-badge-earned-desc">{BADGES[story.badge].desc}</div>
              </div>
            </div>
          )}
          <button className="ge-btn" style={{ background: story.color }}
            onClick={() => setPhase("metaphor")}>
            Learn more →
          </button>
        </>
      )}

      {/* Metaphor phase */}
      {phase === "metaphor" && (
        <>
          <div className="ge-metaphor">
            <div className="ge-metaphor-title">💡 {story.metaphor.title}</div>
            <p className="ge-metaphor-body">{story.metaphor.body}</p>
          </div>
          <div className="ge-parent-note">
            <div className="ge-parent-label">👨‍👩‍👧 Parent note</div>
            <p className="ge-parent-text">{story.parentNote}</p>
          </div>
          <button className="ge-btn-outline" style={{ borderColor: story.color, color: story.color }}
            onClick={onBack}>
            ← Explore another story
          </button>
        </>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GlucoseExplorer() {
  const [activeStory, setActiveStory] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [newBadge, setNewBadge] = useState(null);

  const earnBadge = (id) => {
    setEarnedBadges(prev => [...prev, id]);
    setNewBadge(id);
    setTimeout(() => setNewBadge(null), 3000);
  };

  if (activeStory) {
    return (
      <div>
        {newBadge && (
          <div className="ge-toast">
            {BADGES[newBadge].emoji} Badge earned: {BADGES[newBadge].name}!
          </div>
        )}
        <StoryCard
          story={activeStory}
          onEarnBadge={earnBadge}
          earnedBadges={earnedBadges}
          onBack={() => setActiveStory(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2>🔍 Glucose Explorer</h2>
        <p>For kids and curious families. Explore why glucose behaves the way it does — through stories, guessing games, and discoveries. No wrong answers. Just learning!</p>
      </div>

      <BadgeShelf earned={earnedBadges} />

      <div className="ge-progress-row">
        <span className="ge-progress-text">{earnedBadges.length} of {STORIES.length} stories explored</span>
        <div className="ge-progress-track">
          <div className="ge-progress-fill" style={{ width: `${(earnedBadges.length / STORIES.length) * 100}%` }} />
        </div>
      </div>

      <div className="ge-stories-grid">
        {STORIES.map(story => {
          const done = earnedBadges.includes(story.badge);
          return (
            <div key={story.id} className={`ge-story-tile ${done ? "done" : ""}`}
              style={{ "--s-color": story.color }}
              onClick={() => setActiveStory(story)}>
              <div className="ge-tile-emoji">{story.emoji}</div>
              <div className="ge-tile-title">{story.title}</div>
              <div className="ge-tile-badge">
                {done
                  ? <span className="ge-tile-done">✓ {BADGES[story.badge].emoji} earned</span>
                  : <span className="ge-tile-prompt">Explore →</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ge-about">
        <div className="ge-about-title">🌟 How it works</div>
        <div className="ge-about-steps">
          <div className="ge-about-step"><span>1</span> Read a short glucose story</div>
          <div className="ge-about-step"><span>2</span> Guess what caused the pattern</div>
          <div className="ge-about-step"><span>3</span> Discover how your body works</div>
          <div className="ge-about-step"><span>4</span> Earn a badge for each discovery</div>
        </div>
        <p className="ge-about-note">There are no wrong answers — only discoveries. Every guess teaches you something new about how your amazing body works.</p>
      </div>
    </div>
  );
}
