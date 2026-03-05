const COLORS = { ocean: "#2E86AB", coral: "#F46036", mint: "#56C596", deep: "#1A3A4A", muted: "#8A9BB0" };

const Section = ({ emoji, title, color, children }) => (
  <div className="disc-section" style={{ borderLeftColor: color }}>
    <div className="disc-section-title" style={{ color }}>
      {emoji} {title}
    </div>
    {children}
  </div>
);

export default function DisclaimerPage({ onNavigate }) {
  return (
    <div>
      <div className="section-header">
        <h2>🔒 Disclaimer, Privacy & Safety</h2>
        <p>Please read this before using any feature of this app. It matters.</p>
      </div>

      {/* Medical Disclaimer */}
      <Section emoji="⚕️" title="Medical Disclaimer" color={COLORS.coral}>
        <p>This application is designed for <strong>educational and informational purposes only</strong>. It does not constitute medical advice, diagnosis, or treatment.</p>
        <p>Nothing in this app should be used to make decisions about insulin doses, medication changes, or medical treatment. All such decisions must be made with your qualified diabetes care team — including your endocrinologist, credentialled diabetes educator, and GP.</p>
        <p>Never disregard professional medical advice or delay seeking it because of something you have read or seen in this application.</p>
        <div className="disc-callout" style={{ background: COLORS.coral + "12", borderColor: COLORS.coral }}>
          <strong>In a medical emergency in Australia: call 000 immediately.</strong><br />
          For urgent diabetes concerns (severe hypoglycaemia, DKA symptoms, loss of consciousness), call emergency services — do not use this app.
        </div>
      </Section>

      {/* Education-only framing */}
      <Section emoji="📖" title="This is an educational tool — not a clinical tool" color={COLORS.ocean}>
        <p>Every feature in this app — including pattern explanations, scenario guides, AI-generated explanations, and "Is This Normal?" responses — is designed to <strong>help families learn and understand</strong>, not to guide treatment.</p>
        <p>When the app identifies a "possible reason" for a glucose pattern, this is an educational explanation based on common physiology. It is not a diagnosis. Many factors affect glucose — your diabetes care team knows your child's specific situation in a way this app cannot.</p>
        <p>The AI-powered explanation feature uses pattern detection and a language model to generate educational explanations. These explanations are not reviewed by a medical professional and should never be used as the basis for clinical decisions.</p>
      </Section>

      {/* Privacy */}
      <Section emoji="🛡️" title="Privacy" color={COLORS.mint}>
        <p>This app is currently a <strong>prototype / educational resource</strong>. It does not collect, store, or transmit any personal health information.</p>
        <p>No CGM data entered into this app is sent to any third party except the Anthropic API (which powers the AI explanation feature). Anthropic's privacy policy applies to that processing. No data is stored beyond your browser session.</p>
        <p>We do not collect names, email addresses, or identifiable health data. The optional onboarding questions (diagnosis timing, child's age, treatment type) are stored only in your browser's memory for the current session and are not transmitted anywhere.</p>
        <div className="disc-callout" style={{ background: COLORS.mint + "15", borderColor: COLORS.mint }}>
          Questions about privacy? Contact us via the Community tab or email directly. We will always be transparent about what this app does with data.
        </div>
      </Section>

      {/* Accuracy */}
      <Section emoji="📊" title="Accuracy of information" color={COLORS.ocean}>
        <p>We take care to ensure all educational content in this app is accurate, evidence-based, and appropriate for families living with Type 1 Diabetes in Australia.</p>
        <p>Information about treatments, subsidies (NDSS), clinical trials, and devices is accurate to the best of our knowledge at time of publication — but this area changes rapidly. Always verify current eligibility, availability, and pricing with your healthcare team or the relevant organisation directly.</p>
        <p>If you notice an error or outdated information, please let us know via the Community tab. We want this resource to be as accurate as possible.</p>
      </Section>

      {/* Who built this */}
      <Section emoji="👨‍👧" title="Who built this" color={COLORS.coral}>
        <p>This app was built by a parent whose daughter was diagnosed with Type 1 Diabetes. It grew from our family's experience of navigating T1D — the confusion, the learning, and eventually the confidence that comes with understanding.</p>
        <p>Our daughter now works with <strong>Breakthrough T1D</strong> (formerly JDRF), supporting the search for better treatments and ultimately a cure. This project exists because we wish a resource like this had existed when we were first diagnosed.</p>
        <p>We are not medical professionals. We are a family, sharing what we learned — and connecting families with the best available educational resources. We build this alongside the T1D community, not in place of the expertise of diabetes care teams.</p>
      </Section>

      {/* Contact */}
      <Section emoji="✉️" title="Contact & feedback" color={COLORS.mint}>
        <p>This is a living project and we genuinely want your feedback — what helps, what's missing, what could be clearer.</p>
        <p>If you find an error, have a question, or want to share your experience, please use the Community forum tab or reach out directly. Every message is read by a real person.</p>
        <button
          className="hero-cta-primary"
          style={{ marginTop: 8, display: "inline-block" }}
          onClick={() => onNavigate("forum")}
        >
          Go to Community & Feedback →
        </button>
      </Section>

      <div className="disc-final">
        <div style={{ fontSize: "2rem", marginBottom: 10 }}>💙</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: COLORS.deep, marginBottom: 8 }}>
          We built this for families like ours.
        </div>
        <div style={{ fontSize: "0.88rem", color: COLORS.muted, lineHeight: 1.7 }}>
          Everything here is offered in the spirit of shared experience and community learning. It is not a substitute for your diabetes care team — it is a companion to your journey alongside them.
        </div>
      </div>
    </div>
  );
}
