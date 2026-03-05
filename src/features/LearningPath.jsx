import { useState } from "react";

const COLORS = { ocean: "#2E86AB", coral: "#F46036", mint: "#56C596", sunshine: "#FFD166", lavender: "#9B8EC4", deep: "#1A3A4A" };

const learningPath = [
  {
    week: 1,
    title: "Understanding Insulin",
    emoji: "💉",
    color: COLORS.ocean,
    tagline: "Your most important foundation",
    topics: [
      { title: "What insulin actually does", content: "Insulin is a hormone that acts like a key — unlocking cells so glucose can enter and be used for energy. Without it, glucose builds up in the bloodstream (hyperglycaemia) and cells go without fuel.\n\nIn Type 1, the immune system has destroyed the cells that produce insulin. This means your child's body cannot make any insulin at all — which is why insulin therapy is not optional; it's life-sustaining.\n\nThis is completely different from Type 2 diabetes, where the body still produces some insulin but uses it poorly." },
      { title: "The two types of insulin your child uses", content: "Most children with T1D use two types of insulin:\n\n**Rapid-acting insulin** (e.g., Novorapid, Humalog, Fiasp)\nGiven at mealtimes to 'cover' the glucose from food. Starts working in 10–15 minutes, peaks at 60–90 minutes, lasts 3–4 hours.\n\n**Long-acting (basal) insulin** (e.g., Lantus, Levemir, Tresiba)\nGiven once or twice daily to provide a steady background level. Works slowly over 12–24 hours, keeping glucose stable between meals and overnight.\n\nThink of it this way: basal insulin is the baseline, and rapid-acting insulin is the response to food." },
      { title: "Why insulin doses change", content: "You will notice that the same meal can produce different glucose outcomes on different days. This is normal — and expected.\n\nInsulin needs change based on:\n• Growth and puberty (increasing insulin resistance)\n• Physical activity (increases insulin sensitivity)\n• Illness (increases insulin resistance)\n• Stress (increases insulin resistance)\n• Sleep patterns\n• Hormonal cycles in older children\n\nThis is why diabetes management is not a fixed formula — it is an ongoing adjustment. Your diabetes team will help you review and update doses regularly." },
    ],
  },
  {
    week: 2,
    title: "Carb Counting Basics",
    emoji: "🥗",
    color: COLORS.coral,
    tagline: "The skill that transforms meal management",
    topics: [
      { title: "Why carbs are the focus (not all food)", content: "Carbohydrates are the main nutrient that raises blood glucose. Protein and fat have much smaller and more gradual effects.\n\nThis is why carb counting is the foundation of meal management in T1D. When you know how many grams of carbohydrate are in a meal, you can calculate how much rapid-acting insulin is needed to keep glucose in range.\n\n**Foods that are mainly carbohydrate:**\nBread, rice, pasta, potato, cereal, fruit, milk, yoghurt, sugar, juice, most snack foods.\n\n**Foods with very few carbs:**\nMeat, fish, chicken, eggs, cheese, most vegetables (except starchy ones), nuts, oils." },
      { title: "How to count carbs practically", content: "You don't need to be exact — you need to be reasonably accurate.\n\n**Using food labels:** Look for 'Total Carbohydrates' per serve. Use the serve size on the label or weigh portions until you develop an eye for it.\n\n**Using apps:** Apps like 'Carbs & Cals', 'CalorieKing' (popular in Australia), and 'MyFitnessPal' have extensive food databases with carb counts.\n\n**Common reference points to memorise:**\n• 1 slice of bread ≈ 15g carbs\n• 1/2 cup cooked rice ≈ 20–25g carbs\n• 1 medium apple ≈ 15–20g carbs\n• 1 cup of milk ≈ 12g carbs\n• 1 tablespoon of jam ≈ 10g carbs\n\nOver time, estimating becomes intuitive. New families often say that within 6–8 weeks, they can estimate common meals without looking anything up." },
      { title: "The insulin-to-carb ratio explained", content: "Your diabetes team will give your child a personalised **insulin-to-carb ratio (ICR)** — for example, 1 unit of insulin for every 15g of carbohydrate.\n\nThis ratio tells you how much rapid-acting insulin to give for each meal.\n\n**Example:**\nICR = 1:15\nMeal contains 60g carbs\nDose = 60 ÷ 15 = 4 units\n\nDifferent times of day may have different ratios — many children need more insulin per gram of carb at breakfast due to morning hormones.\n\n**Important:** Do not change insulin-to-carb ratios without consulting your diabetes team. If the ratio seems wrong, discuss it at your next appointment or call your team." },
    ],
  },
  {
    week: 3,
    title: "Exercise & Glucose",
    emoji: "⚽",
    color: COLORS.mint,
    tagline: "Sport is wonderful — and manageable",
    topics: [
      { title: "Why exercise affects glucose so dramatically", content: "Exercise changes glucose in ways that surprise many families — and understanding the mechanism makes it much less frightening.\n\n**During aerobic exercise (running, swimming, cycling, soccer):**\nMuscles can absorb glucose directly without insulin during activity. Glucose typically falls during and after exercise.\n\n**During anaerobic/intense exercise (sprinting, weightlifting, competitive racing):**\nThe body releases adrenaline and stress hormones, which cause the liver to release stored glucose. This can temporarily RAISE glucose during very intense short bursts.\n\n**After exercise (delayed effect):**\nThe body continues to replenish muscle glycogen stores for up to 12 hours. This ongoing glucose absorption creates an extended hypoglycaemia risk — often most pronounced overnight." },
      { title: "Practical strategies for sport days", content: "There is no single correct approach — every child, every sport, and every intensity level is different. Here are the most common strategies, to discuss with your diabetes team:\n\n**Before exercise:**\n• Check glucose — target above 7–8 mmol/L before starting\n• Have fast-acting carbs available\n• Inform the coach\n\n**Reducing hypoglycaemia risk during sport:**\n• Reduce the insulin dose for the meal before sport (if planned in advance)\n• Have a small carb snack before and/or during activity\n• For pump users — discuss a temporary reduced basal rate with your team\n\n**After exercise:**\n• Check glucose before bed on sport days\n• Consider a protein/carb bedtime snack\n• Set CGM alerts at a higher threshold overnight\n\n**Important:** These are general strategies. Your diabetes team will help you develop a personalised sport protocol." },
      { title: "Getting active builds confidence — not just fitness", content: "One of the most important things to communicate to your child is this: T1D does not mean they can't do sport.\n\nSome of the world's greatest athletes have T1D:\n• Jay Cutler — NFL quarterback\n• Alexander Zverev — top-10 professional tennis player\n• Numerous Olympic athletes\n\nRegular physical activity is not just allowed with T1D — it is actively encouraged. Exercise improves insulin sensitivity, cardiovascular health, and mental wellbeing.\n\nThe goal is not to avoid exercise because of glucose management. The goal is to learn to manage glucose so that exercise is always possible." },
    ],
  },
  {
    week: 4,
    title: "Overnight Glucose Patterns",
    emoji: "🌙",
    color: COLORS.lavender,
    tagline: "When to watch, when to act, when to sleep",
    topics: [
      { title: "Why overnight glucose is uniquely challenging", content: "The overnight period presents unique challenges in T1D management — and is often the source of the most parental anxiety.\n\n**Several factors affect glucose during sleep:**\n\n**Growth hormone** — Released in pulses during deep sleep, especially in children and adolescents. Causes temporary insulin resistance and glucose rises, typically between 2–8 AM. This is often called the 'dawn phenomenon'.\n\n**Delayed exercise effect** — Activity during the day continues to lower glucose overnight as muscles replenish glycogen.\n\n**Long-acting insulin activity** — Depending on when basal insulin is given, its activity may peak or wane during sleep.\n\n**Fasting state** — The liver releases small amounts of stored glucose during the overnight fast to maintain brain function." },
      { title: "How CGM technology transforms overnight management", content: "Before continuous glucose monitors (CGMs), overnight management required parents to set alarms and do manual glucose checks — sometimes every 2 hours.\n\nCGMs have transformed this completely.\n\n**What CGMs do overnight:**\n• Check glucose every 5 minutes, 24/7\n• Alert your phone if glucose falls below your set threshold\n• Alert if glucose is rising rapidly (early warning of a high)\n• Allow you to see the overnight graph in the morning and identify patterns\n\n**For parents:**\nMany families set their low alert at a slightly higher threshold overnight (e.g., 5.5 mmol/L instead of 4.0) to give earlier warning.\n\n**Remote monitoring:**\nApps like Dexcom Follow and LibreLinkUp allow parents to view their child's glucose remotely — including from a different bedroom." },
      { title: "When overnight glucose needs a plan adjustment", content: "If you notice a consistent overnight pattern lasting more than 2–3 nights, bring it to your diabetes team. Common adjustable patterns:\n\n**Consistent overnight highs:**\nMay indicate the long-acting basal insulin dose needs adjustment, or growth hormone effect needs management.\n\n**Consistent overnight lows:**\nMay indicate the long-acting dose is too high, or exercise from the previous day is having a sustained effect.\n\n**The 'roller coaster' overnight:**\nSometimes glucose drops, triggers an alarm, gets treated with fast sugar, then rebounds high. This cycle is frustrating — discuss with your team a strategy to prevent it before it starts.\n\n**Important:** Do not adjust basal insulin doses on your own without guidance. A small change to long-acting insulin has significant overnight effects." },
    ],
  },
  {
    week: 5,
    title: "School & Social Life",
    emoji: "🏫",
    color: COLORS.sunshine,
    tagline: "Building your child's independence",
    topics: [
      { title: "What schools are required to provide (Australia)", content: "In Australia, schools have a duty of care for students with medical conditions including T1D. Your child has the right to:\n\n• Check blood glucose or CGM at any time during the school day, including during class\n• Treat a hypoglycaemia immediately, without waiting for permission\n• Access snacks and food when needed for medical reasons\n• Have a trained staff member available for emergencies\n• Carry their diabetes supplies on their person (not locked away)\n\n**What you should do:**\nWork with the school to create a **Diabetes Medical Management Plan (DMMP)** — a written document outlining your child's needs, emergency procedures, and contact details. Your diabetes educator can help you prepare this document.\n\nRefer to Diabetes Australia's School Support resources for state-specific guidance." },
      { title: "Talking to your child about telling friends", content: "Whether and how to tell friends about T1D is a deeply personal decision — and your child's preference should be respected.\n\n**Younger children (5–9):**\nSimple, matter-of-fact explanations work best. 'My body doesn't make insulin, so I need to give it to myself.' Most young children accept this without difficulty.\n\n**Older children and teens:**\nSome want their diagnosis known; others prefer privacy. Both are valid. What matters is that a trusted adult at school and a trusted friend knows the basics — in case of an emergency.\n\n**Script for your child:**\n'I have Type 1 Diabetes. It means my body can't make a hormone called insulin, so I take it myself. It's not contagious and I can do everything you can do.'\n\nChildren who feel open about T1D typically report better social outcomes and less anxiety than those who feel they must hide it." },
      { title: "Building age-appropriate independence", content: "The goal of T1D management is not to remain dependent on parents forever. Gradually building your child's independence in their own care is one of the most important — and health-improving — things you can do.\n\n**Research shows:**\nChildren who have age-appropriate ownership of their diabetes management have better long-term outcomes than those for whom parents manage everything.\n\n**Suggested milestones:**\n\n**Ages 5–8:** Recognise hypo/hyper symptoms and tell an adult. Know where their kit is.\n\n**Ages 8–12:** Understand carb counting basics. Participate in checking glucose. Know how to treat a low independently.\n\n**Ages 12–15:** Growing independence in dosing, with parental oversight. Check own glucose. Know sick day rules.\n\n**Ages 15+:** Near-full management with regular family check-ins. Understand when to seek help.\n\nThis progression looks different for every child — base it on your child's maturity and confidence, not just age." },
    ],
  },
  {
    week: 6,
    title: "Recognising & Managing Emergencies",
    emoji: "🚨",
    color: COLORS.coral,
    tagline: "Confidence in the moments that matter most",
    topics: [
      { title: "Recognising and treating hypoglycaemia", content: "Hypoglycaemia (low blood glucose, typically below 4.0 mmol/L) is the most common emergency in T1D — and with the right knowledge, it is very manageable.\n\n**Common symptoms:**\nShakiness, sweating, paleness, hunger, irritability, difficulty concentrating, glazed expression, confusion.\n\n**Important:** Symptoms vary between children and can change over time. Some children develop 'hypoglycaemia unawareness' — they don't feel the symptoms until glucose is very low. CGMs significantly improve safety for these children.\n\n**The 15-15 Rule:**\n1. Give 15g of fast-acting carbohydrate (4 glucose tablets, 150ml of fruit juice, or 6–7 jellybeans)\n2. Wait 15 minutes\n3. Recheck glucose\n4. If still below 4 mmol/L, repeat\n5. Once above 4 mmol/L, have a small snack with protein if the next meal is more than 30 minutes away\n\n**Never give food to a child who is unconscious or unable to swallow safely.**" },
      { title: "When to use a glucagon kit", content: "Glucagon is a hormone that rapidly raises blood glucose. A glucagon emergency kit should be available at all times for children with T1D.\n\n**Use glucagon when:**\n• The child is unconscious or having a seizure due to low glucose\n• The child cannot swallow safely\n• Fast-acting glucose by mouth has not worked\n\n**Modern glucagon options available in Australia:**\n• **Baqsimi** — Nasal powder glucagon. No injection required. Simply insert into one nostril and press. Available on the PBS.\n• **GlucaGen** — Traditional injection kit. Requires reconstitution before use.\n\n**After glucagon:**\nCall 000. Glucagon is an emergency treatment — medical assessment is always required afterwards.\n\n**Ensure:**\nGlucagon is available at school, with carers, and at home. Check expiry dates every 6 months. Ensure teachers and carers are trained to use it." },
      { title: "Recognising DKA — a medical emergency", content: "Diabetic Ketoacidosis (DKA) is a serious medical emergency that occurs when the body has no insulin and begins breaking down fat for energy, producing acidic ketones.\n\n**DKA warning signs:**\n• Persistent high glucose (above 14–15 mmol/L) that is not coming down\n• Vomiting or abdominal pain\n• Deep, rapid breathing\n• Fruity or acetone-like breath\n• Extreme fatigue or confusion\n• Moderate or large ketones on a ketone meter\n\n**Action:**\nCall 000 or go to your nearest emergency department immediately. Do not wait.\n\n**Prevention:**\n• Never skip insulin — even if the child is unwell and not eating\n• Check ketones any time glucose is above 14 mmol/L for more than 2 hours\n• Have a sick day plan from your diabetes team\n• Check pump infusion sites regularly if using a pump\n\n**Important:** DKA can develop in hours. When in doubt, seek help early." },
    ],
  },
];

export default function LearningPath() {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [completedWeeks, setCompletedWeeks] = useState([]);
  const [completedTopics, setCompletedTopics] = useState([]);

  const markTopicDone = (weekNum, topicTitle) => {
    const key = `${weekNum}-${topicTitle}`;
    if (!completedTopics.includes(key)) {
      const newCompleted = [...completedTopics, key];
      setCompletedTopics(newCompleted);
      const weekTopics = learningPath.find(w => w.week === weekNum).topics;
      const allDone = weekTopics.every(t => newCompleted.includes(`${weekNum}-${t.title}`));
      if (allDone && !completedWeeks.includes(weekNum)) {
        setCompletedWeeks([...completedWeeks, weekNum]);
      }
    }
  };

  const totalTopics = learningPath.reduce((sum, w) => sum + w.topics.length, 0);
  const progress = Math.round((completedTopics.length / totalTopics) * 100);

  if (selectedTopic && selectedWeek) {
    const week = learningPath.find(w => w.week === selectedWeek);
    const topic = week.topics.find(t => t.title === selectedTopic);
    const key = `${selectedWeek}-${selectedTopic}`;
    const done = completedTopics.includes(key);
    return (
      <div className="module-detail">
        <button className="back-btn" onClick={() => setSelectedTopic(null)}>← Back to Week {selectedWeek}</button>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>{week.emoji}</div>
        <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: week.color, marginBottom: 8 }}>Week {week.week} — {week.title}</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#1A3A4A", marginBottom: 20 }}>{topic.title}</h2>
        <div className="detail-content">
          {topic.content.split("\n").map((line, i) => {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return <span key={i}>{parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}<br /></span>;
          })}
        </div>
        {!done && (
          <button className="mark-done-btn" style={{ background: week.color }} onClick={() => { markTopicDone(selectedWeek, selectedTopic); }}>
            ✓ Mark as read
          </button>
        )}
        {done && <div className="done-badge">✓ Completed</div>}
      </div>
    );
  }

  if (selectedWeek) {
    const week = learningPath.find(w => w.week === selectedWeek);
    return (
      <div>
        <button className="back-btn" onClick={() => setSelectedWeek(null)}>← Back to learning path</button>
        <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{week.emoji}</div>
        <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: week.color, marginBottom: 4 }}>Week {week.week}</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "#1A3A4A", marginBottom: 4 }}>{week.title}</h2>
        <p style={{ color: "#8A9BB0", marginBottom: 28 }}>{week.tagline}</p>
        <div style={{ display: "grid", gap: 14 }}>
          {week.topics.map(topic => {
            const key = `${week.week}-${topic.title}`;
            const done = completedTopics.includes(key);
            return (
              <div key={topic.title} className="topic-card" style={{ "--w-color": week.color, opacity: done ? 0.75 : 1 }}
                onClick={() => setSelectedTopic(topic.title)}>
                <div style={{ flex: 1 }}>
                  <div className="topic-title">{topic.title}</div>
                  {done && <div style={{ fontSize: "0.75rem", color: "#56C596", fontWeight: 800, marginTop: 4 }}>✓ Read</div>}
                </div>
                <span style={{ color: week.color, fontSize: "1.2rem" }}>→</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2>🗓️ Your First 90 Days</h2>
        <p>A structured learning journey for newly diagnosed families. Build knowledge week by week — reducing anxiety as your confidence grows.</p>
      </div>

      <div className="progress-panel">
        <div className="progress-header">
          <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#1A3A4A" }}>Your progress</span>
          <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "#2E86AB" }}>{completedTopics.length}/{totalTopics} topics read</span>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        {progress === 100 && (
          <div style={{ textAlign: "center", marginTop: 12, fontWeight: 800, color: "#56C596" }}>
            🎉 You've completed the First 90 Days learning path!
          </div>
        )}
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {learningPath.map(week => {
          const weekDone = completedWeeks.includes(week.week);
          const weekProgress = week.topics.filter(t => completedTopics.includes(`${week.week}-${t.title}`)).length;
          return (
            <div key={week.week} className="week-card" style={{ "--wk-color": week.color }}
              onClick={() => setSelectedWeek(week.week)}>
              <div className="week-number" style={{ background: week.color }}>W{week.week}</div>
              <div style={{ flex: 1 }}>
                <div className="week-title">{week.emoji} {week.title}</div>
                <div className="week-tagline">{week.tagline}</div>
                <div style={{ fontSize: "0.75rem", color: "#8A9BB0", marginTop: 6 }}>
                  {weekProgress}/{week.topics.length} topics · {week.topics.map(t => t.title).join(" · ")}
                </div>
              </div>
              {weekDone ? <span style={{ color: "#56C596", fontWeight: 800, fontSize: "0.8rem", flexShrink: 0 }}>✓ Done</span>
                : <span style={{ color: week.color, fontSize: "1.2rem", flexShrink: 0 }}>→</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
