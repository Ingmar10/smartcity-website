import ScrollReveal from "@/components/ScrollReveal";

// What SmartCity builds around QuoteSmart. Prices are intentionally not shown:
// scope is quoted per business.
export default function ServicesSection() {
  return (
    <div className="sc2">
      <ScrollReveal>
<section className="svc" id="services" aria-labelledby="services-h">
  <div className="container-content">
    <div style={{ maxWidth: 660 }}>
      <p className="eyebrow">What we build around it</p>
      <h2 className="h2" id="services-h">QuoteSmart is the hub. Everything else plugs into it.</h2>
      <p className="lede">We run the trades ourselves, so we build the whole path: the app, the automations behind it, and the site that feeds it. Start with the core, add what your business needs.</p>
    </div>

    <div className="svc-grid">
      <div className="hub">
        <span className="tag">The core</span>
        <h3>QuoteSmart</h3>
        <p>The quoting platform every lead lands in. Contractors go live on it first, then we connect the rest.</p>
        <ul>
          <li>Price, brand and send proposals, with your floor price enforced</li>
          <li>Dealer logins that never see your cost or margin</li>
          <li>Financing attached to the proposal, branded PDF proposal</li>
          <li>Bolt, the AI assistant, inside the app</li>
          <li>Connected to your CRM so no lead sits outside the rail</li>
        </ul>
      </div>

      <div className="addons">
        <div className="addon"><div className="top"><b>GHL automations</b><span className="pill core"><i></i>Core</span></div>
          <p>The CRM and follow-up engine behind QuoteSmart, built and maintained for you.</p>
          <ul><li>Pipeline, tags and lead routing</li><li>Missed-call text-back and appointment confirmations</li><li>No-close follow-up and review requests</li><li>Text registration (A2P 10DLC) started week one</li></ul></div>

        <div className="addon"><div className="top"><b>Website build</b><span className="pill add"><i></i>Add-on</span></div>
          <p>A fast custom site, off Wix or Squarespace, built to feed the rail.</p>
          <ul><li>Next.js on Vercel, local SEO and schema</li><li>Booking and quote forms land in your CRM</li><li>Old links redirected, domain stays yours</li></ul></div>

        <div className="addon"><div className="top"><b>DialBolt</b><span className="pill add"><i></i>Add-on</span></div>
          <p>Done-for-you SMS and email reactivation for the leads you already paid for.</p>
          <ul><li>TCPA-compliant, STOP and HELP built in</li><li>Booked appointments flow into QuoteSmart</li><li>Every close attributed to a rep</li></ul></div>

        <div className="addon"><div className="top"><b>AI voice</b><span className="pill live"><i></i>Live</span></div>
          <p>An inbound agent that answers, qualifies and books, day and night.</p>
          <ul><li>Routes by service and urgency</li><li>Books straight into your calendar</li><li>Hands off to your team with the full record</li></ul></div>

        <div className="addon"><div className="top"><b>Customer portal</b><span className="pill soon"><i></i>Coming soon</span></div>
          <p>Monthly monitoring plans for homeowners, including customers whose installer went out of business.</p>
          <ul><li>Customer sign-in and plan billing</li><li>Free service visits tracked automatically</li><li>Book service from their phone</li></ul></div>

        <div className="addon"><div className="top"><b>AI seats for owners</b><span className="pill add"><i></i>Add-on</span></div>
          <p>Claude Team seats for you and your number two, connected to your CRM.</p>
          <ul><li>&quot;Which no-closes haven&apos;t been followed up?&quot;</li><li>Setter and rep numbers on demand</li><li>We set it up and manage it</li></ul></div>
      </div>
    </div>

    <div className="ladder">
      <div>
        <h4>Not a contractor? Same discipline, lighter stack.</h4>
        <p>Barbershops, salons, gyms and restaurants run the booking stack: a custom site plus CRM, no quoting layer. Upgrades are switches, not rebuilds.</p>
      </div>
      <div className="steps" aria-label="Booking stack upgrade path"><span>Website</span><em>→</em><span>Walk-in kiosk + TV board</span><em>→</em><span>Online booking</span><em>→</em><span>AI voice + winback</span></div>
    </div>

    <div className="run">
      <div><small>01</small><h4>Scope your rail</h4><p>Twenty minutes on your jobs, leads and numbers. We tell you straight what fits.</p></div>
      <div><small>02</small><h4>Registrations first</h4><p>Text registration has the longest lead time, so it starts the week you say yes.</p></div>
      <div><small>03</small><h4>QuoteSmart live, then the rest</h4><p>Quoting goes live first. Automations, site and add-ons stack on in phases.</p></div>
      <div><small>04</small><h4>Run and review monthly</h4><p>Monitoring, changes and a monthly numbers review, so the rail keeps earning.</p></div>
    </div>
  </div>
</section>
      </ScrollReveal>
    </div>
  );
}
