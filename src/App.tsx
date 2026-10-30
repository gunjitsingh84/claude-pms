import { useState } from 'react';
import { ArrowRight, Check, CircleCheck, Layers3, ListTodo, ShieldCheck,  Target, Users } from 'lucide-react';

function App() {
  const [screen, setScreen] = useState<'landing' | 'signin'>('landing');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const openSignIn = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMessage('');
    setOtp('');
    setScreen('signin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const verifyOtp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allowedAccounts: Record<string, string> = {
      '9890227921': '300384',
      '9815889156': '300384',
    };
    if (allowedAccounts[phone] && allowedAccounts[phone] === otp) {
      setAuthenticated(true);
      setMessage('');
    } else {
      setAuthenticated(false);
      setMessage('Phone number or OTP is incorrect. Please try again.');
    }
  };

  if (screen === 'signin') {
    return (
      <div className="auth-page">
        <div className="auth-decoration auth-decoration-one" />
        <div className="auth-decoration auth-decoration-two" />
        <header className="auth-header">
          <a className="landing-brand" href="/" onClick={(event) => { event.preventDefault(); setScreen('landing'); setAuthenticated(false); }}>
            <span className="landing-brand-mark"><Layers3 size={21} strokeWidth={2.2} /></span>
            <span>gunjit<span className="brand-period">.</span><small>PROJECT MANAGEMENT</small></span>
          </a>
          <span className="auth-header-note">YOUR WORKSPACE, IN ONE PLACE</span>
        </header>
        <main className="auth-main">
          <section className="auth-card">
            {authenticated ? (
              <div className="auth-success">
                <span className="auth-success-icon"><CircleCheck size={30} /></span>
                <span className="section-kicker">VERIFIED SUCCESSFULLY</span>
                <h1>You're signed in.</h1>
                <p>Phone number <strong>+91 {phone}</strong> has been verified.</p>
                <button className="auth-submit" type="button" onClick={() => { setScreen('landing'); setAuthenticated(false); }}>Continue to workspace <ArrowRight size={17} /></button>
              </div>
            ) : (
              <>
                <div className="auth-card-mark"><Layers3 size={23} /></div>
                <span className="section-kicker">WELCOME BACK</span>
                <h1>Sign in to your<br /><span>workspace.</span></h1>
                <p className="auth-intro">Enter your phone number and 6-digit OTP to continue.</p>
                <form className="auth-form" onSubmit={verifyOtp}>
                  <label htmlFor="phone">Phone number</label>
                  <div className="auth-input-wrap phone-input-wrap">
                    <span className="country-code">+91</span>
                    <input id="phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="Enter 10-digit number" value={phone} onChange={(event) => { setPhone(event.target.value.replace(/\D/g, '').slice(0, 10)); setMessage(''); }} required pattern="[0-9]{10}" aria-describedby="phone-help" />
                  </div>
                  <small className="auth-field-help" id="phone-help">Use your registered phone number.</small>
                  <label htmlFor="otp">6-digit OTP</label>
                  <input className="auth-input otp-input" id="otp" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="• • • • • •" value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, '').slice(0, 6)); setMessage(''); }} required pattern="[0-9]{6}" />
                  <p className="auth-demo-note"><ShieldCheck size={15} /> Demo sign-in: no SMS is sent. Use your assigned OTP.</p>
                  {message && <p className="auth-error" role="alert">{message}</p>}
                  <button className="auth-submit" type="submit">Verify &amp; sign in <ArrowRight size={17} /></button>
                </form>
                <button className="auth-back" type="button" onClick={() => setScreen('landing')}><ArrowRight size={14} className="auth-back-arrow" /> Back to home</button>
              </>
            )}
          </section>
          <p className="auth-footer-note"><ShieldCheck size={14} /> Simple, secure access to your work.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <a className="landing-brand" href="/" aria-label="Gunjit PMS home">
          <span className="landing-brand-mark"><Layers3 size={21} strokeWidth={2.2} /></span>
          <span>gunjit<span className="brand-period">.</span><small>PROJECT MANAGEMENT</small></span>
        </a>
        <nav className="landing-nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <a className="signin-button" href="#signin" onClick={openSignIn}>Sign in <ArrowRight size={16} /></a>
      </header>

      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <div className="hero-eyebrow"><span className="eyebrow-pulse" /> A CLEARER WAY TO WORK</div>
            <h1>Bring your work<br />into <span>focus.</span></h1>
            <p className="hero-description">A simpler way to manage projects, organise tasks, and keep every important detail moving forward.</p>
            <div className="hero-actions">
              <a className="hero-primary" href="#signin" onClick={openSignIn}>Get started <ArrowRight size={17} /></a>
              <a className="hero-secondary" href="#features">Explore features <span>↓</span></a>
            </div>
            <div className="hero-proof"><span className="proof-check"><Check size={13} /></span> Made for the way you work <i /> Simple by design</div>
          </div>

          <div className="hero-visual" aria-label="Project management dashboard preview">
            <div className="visual-glow" />
            <div className="floating-chip chip-top"><span className="chip-dot green-dot" /> Everything in one place</div>
            <div className="preview-window">
              <div className="preview-topbar"><div className="preview-brand"><span className="preview-brand-mark"><Layers3 size={13} /></span><strong>Workspace</strong></div><div className="preview-dots"><i /><i /><i /></div></div>
              <div className="preview-body">
                <div className="preview-sidebar"><span className="preview-side-active"><span /> Overview</span><span><i className="side-icon projects-icon" /> Projects</span><span><i className="side-icon tasks-icon" /> My tasks</span><span><i className="side-icon team-icon" /> Team</span><div className="preview-side-line" /><small>YOUR PROJECTS</small><span><i className="tiny-project green-project" /> Website refresh</span><span><i className="tiny-project coral-project" /> Product launch</span><span><i className="tiny-project gold-project" /> Client portal</span></div>
                <div className="preview-main"><div className="preview-greeting"><small>YOUR WORKSPACE</small><h3>Good things are in motion.</h3><p>A little progress adds up.</p></div>
                  <div className="preview-stat-row"><div className="preview-stat"><span className="stat-symbol mint-symbol"><Layers3 size={14} /></span><small>Projects</small><strong>08</strong><i className="stat-line mint-line" /></div><div className="preview-stat"><span className="stat-symbol coral-symbol"><ListTodo size={14} /></span><small>Tasks done</small><strong>24 <em>/ 32</em></strong><i className="stat-line coral-line" /></div><div className="preview-stat"><span className="stat-symbol gold-symbol"><Target size={14} /></span><small>On track</small><strong>92%</strong><i className="stat-line gold-line" /></div></div>
                  <div className="preview-projects"><div className="preview-section-heading"><strong>Projects at a glance</strong><span>View all →</span></div><div className="preview-project-row"><span className="preview-project-badge badge-mint">W</span><div className="preview-project-info"><strong>Website refresh</strong><small>8 of 10 tasks</small></div><div className="preview-progress"><i style={{width:'78%'}} /></div><b>78%</b></div><div className="preview-project-row"><span className="preview-project-badge badge-coral">P</span><div className="preview-project-info"><strong>Product launch</strong><small>12 of 16 tasks</small></div><div className="preview-progress"><i style={{width:'64%'}} /></div><b>64%</b></div><div className="preview-project-row"><span className="preview-project-badge badge-gold">C</span><div className="preview-project-info"><strong>Client portal</strong><small>6 of 8 tasks</small></div><div className="preview-progress"><i style={{width:'86%'}} /></div><b>86%</b></div></div>
                </div>
              </div>
            </div>
            <div className="floating-chip chip-bottom"><span className="chip-check"><CircleCheck size={15} /></span><span><strong>Progress, made visible</strong><small>One step at a time</small></span></div>
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          </div>
          <div className="hero-bottom-note"><span>01</span><i /> Less juggling. More doing.</div>
        </section>

        <section className="landing-features" id="features">
          <div className="features-intro"><span className="section-kicker">THE ESSENTIALS, DONE WELL</span><h2>Everything you need.<br /><span>Nothing you don't.</span></h2><p>Keep your day organised with tools that make sense from the very first click.</p></div>
          <div className="feature-cards">
            <article className="feature-card feature-mint"><span className="feature-icon"><Layers3 size={20} /></span><h3>Projects, made clear</h3><p>See priorities, progress, and next steps without digging through endless updates.</p><span className="feature-number">01</span></article>
            <article className="feature-card feature-coral"><span className="feature-icon"><ListTodo size={20} /></span><h3>Tasks that move</h3><p>Turn plans into manageable actions and keep the important work in view.</p><span className="feature-number">02</span></article>
            <article className="feature-card feature-gold"><span className="feature-icon"><Users size={20} /></span><h3>One shared view</h3><p>Bring project details and team context together in one calm workspace.</p><span className="feature-number">03</span></article>
          </div>
        </section>

        <section className="landing-cta" id="how-it-works"><div className="cta-decoration cta-decoration-one" /><div className="cta-decoration cta-decoration-two" /><span className="section-kicker">YOUR NEXT STEP STARTS HERE</span><h2>Make room for meaningful work.</h2><p>Start with a clear view of what matters and build from there.</p><a className="cta-button" href="#signin" onClick={openSignIn}>Sign in to your workspace <ArrowRight size={16} /></a></section>
      </main>
      <footer className="landing-footer"><a className="landing-brand footer-brand" href="/"><span className="landing-brand-mark"><Layers3 size={18} /></span><span>gunjit<span className="brand-period">.</span><small>PROJECT MANAGEMENT</small></span></a><span>© 2026 Gunjit Project Management System</span><span className="footer-security"><ShieldCheck size={14} /> Built for focused work</span></footer>
    </div>
  );
}

export default App;
