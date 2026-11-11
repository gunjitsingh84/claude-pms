import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CircleCheck, ClipboardList, Clock3, Eye, EyeOff, FolderKanban, Layers3, LayoutDashboard, ListTodo, LogOut, Plus, ShieldCheck, Target, Users } from 'lucide-react';

type Project = { id: string; project_code: string | null; name: string; client_name: string | null; description: string | null; status: string; priority: string; start_date: string | null; target_end_date: string | null; actual_completion_date: string | null; budget: number | null; currency: string; project_manager: string | null; notes: string | null; created_at: string; };
type ProjectForm = { project_code: string; name: string; client_name: string; description: string; status: string; priority: string; start_date: string; target_end_date: string; budget: string; currency: string; project_manager: string; notes: string; };
const blankProject: ProjectForm = { project_code: '', name: '', client_name: '', description: '', status: 'Not Started', priority: 'Medium', start_date: '', target_end_date: '', budget: '', currency: 'INR', project_manager: '', notes: '' };

function App() {
  const [screen, setScreen] = useState<'landing' | 'signin' | 'dashboard'>('landing');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [message, setMessage] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [activeView, setActiveView] = useState<'overview' | 'projects' | 'new-project'>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectForm, setProjectForm] = useState<ProjectForm>(blankProject);
  const [projectMessage, setProjectMessage] = useState('');
  const [isSavingProject, setIsSavingProject] = useState(false);

  // Automatically end an authenticated session after 60 seconds without activity.
  useEffect(() => {
    if (!authenticated || screen !== 'dashboard') return;

    const inactivityLimit = 60_000;
    let lastActivityAt = Date.now();
    let timeoutId: number;

    const expireSession = () => {
      window.clearTimeout(timeoutId);
      setAuthenticated(false);
      setSessionToken('');
      setProjects([]);
      setOtp('');
      setActiveView('overview');
      setMessage('You were signed out after 60 seconds of inactivity. Please sign in again.');
      setScreen('signin');
    };

    const scheduleExpiry = () => {
      window.clearTimeout(timeoutId);
      const remaining = inactivityLimit - (Date.now() - lastActivityAt);
      if (remaining <= 0) {
        expireSession();
        return;
      }
      timeoutId = window.setTimeout(scheduleExpiry, remaining);
    };

    const recordActivity = () => {
      if (Date.now() - lastActivityAt >= inactivityLimit) {
        expireSession();
        return;
      }
      lastActivityAt = Date.now();
      scheduleExpiry();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (Date.now() - lastActivityAt >= inactivityLimit) {
          expireSession();
        } else {
          scheduleExpiry();
        }
      }
    };

    const activityEvents = ['mousemove', 'mousedown', 'pointerdown', 'keydown', 'touchstart', 'scroll', 'wheel', 'click'] as const;
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, recordActivity, { passive: true });
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    scheduleExpiry();

    return () => {
      window.clearTimeout(timeoutId);
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, recordActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authenticated, screen]);


  const openSignIn = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMessage('');
    setOtp('');
    setScreen('signin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadProjects = async (token: string) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { data, error } = await supabase.functions.invoke('gpms-projects', { body: { action: 'list' }, headers: { Authorization: 'Bearer ' + token } });
    if (error || !data?.projects) throw new Error(data?.error || 'Unable to load projects.');
    setProjects(data.projects as Project[]);
  };
  const verifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setMessage('Login service is not configured. Please try again later.');
      return;
    }

    setIsVerifying(true);
    setMessage('');
    try {
      const { data, error } = await supabase.functions.invoke('gpms-login', {
        body: { phone, pin: otp },
      });

      if (error || !data?.user) {
        setAuthenticated(false);
        setMessage(data?.error || 'Phone number or PIN is incorrect. Please try again.');
        return;
      }

      setFullName(data.user.full_name);
      setPhone(data.user.phone_number);
      setSessionToken(data.session_token);
      setAuthenticated(true);
      setActiveView('overview');
      setProjectMessage('');
      try {
        await loadProjects(data.session_token);
      } catch (loadError) {
        setProjects([]);
        setProjectMessage(loadError instanceof Error ? loadError.message : 'Projects could not be loaded yet.');
      }
      setOtp('');
      setScreen('dashboard');
    } catch (error) {
      setAuthenticated(false);
      setMessage(error instanceof Error ? error.message : 'Unable to verify your login. Please check your connection and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const createProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !sessionToken) { setProjectMessage('Your session has expired. Please sign in again.'); return; }
    setIsSavingProject(true); setProjectMessage('');
    try {
      const { data, error } = await supabase.functions.invoke('gpms-projects', {
        body: { action: 'create', project: { ...projectForm, budget: projectForm.budget.trim() ? Number(projectForm.budget) : null } },
        headers: { Authorization: 'Bearer ' + sessionToken },
      });
      if (error || !data?.project) { setProjectMessage(data?.error || 'Could not save this project. Please try again.'); return; }
      setProjects((current) => [data.project as Project, ...current]);
      setProjectForm(blankProject); setActiveView('projects'); setProjectMessage('Project created successfully.');
    } catch { setProjectMessage('Unable to save the project. Please check your connection and try again.'); }
    finally { setIsSavingProject(false); }
  };
  const updateProjectField = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setProjectForm((current) => ({ ...current, [name]: value }));
  };
  if (screen === 'dashboard') {
    return (
      <div className="dashboard-page">
        <aside className="dashboard-sidebar">
          <a className="landing-brand dashboard-brand" href="#dashboard" onClick={(event) => event.preventDefault()}>
            <span className="landing-brand-mark"><Layers3 size={21} strokeWidth={2.2} /></span>
            <span>gunjit<span className="brand-period">.</span><small>PROJECT MANAGEMENT</small></span>
          </a>
          <div className="dashboard-workspace"><span className="workspace-avatar">G</span><span><strong>My Workspace</strong><small>Personal workspace</small></span></div>
          <span className="dashboard-nav-label">WORKSPACE</span>
          <nav className="dashboard-nav">
            <a className={activeView === "overview" ? "dashboard-nav-active" : ""} href="#overview" onClick={(event) => { event.preventDefault(); setActiveView("overview"); }}><LayoutDashboard size={17} /> Overview</a>
            <a className={activeView !== "overview" ? "dashboard-nav-active" : ""} href="#projects" onClick={(event) => { event.preventDefault(); setActiveView("projects"); setProjectMessage(""); }}><FolderKanban size={17} /> Projects</a>
            <a href="#tasks"><ClipboardList size={17} /> Tasks</a>
          </nav>
          <button className="dashboard-logout" type="button" onClick={() => { setScreen('signin'); setAuthenticated(false); setSessionToken(''); setProjects([]); setOtp(''); setMessage(''); }}><LogOut size={17} /> Sign out</button>
        </aside>
        <main className="dashboard-main">
          <header className="dashboard-topbar"><div><span className="dashboard-breadcrumb">WORKSPACE / {activeView === "overview" ? "OVERVIEW" : activeView === "projects" ? "PROJECTS" : "NEW PROJECT"}</span><h1>{activeView === "overview" ? "Dashboard" : activeView === "projects" ? "Projects" : "New Project"}</h1></div><div className="dashboard-user"><span className="dashboard-user-avatar">{fullName.slice(0, 1).toUpperCase()}</span><span><strong>Welcome, {fullName || "User"}</strong><small>+91 {phone}</small></span></div></header>
          {activeView === "overview" && <>
            <section className="dashboard-welcome"><div><span className="section-kicker">YOUR WORK AT A GLANCE</span><h2>Good to see you.</h2><p>Here is an overview of your projects and tasks.</p></div><button className="project-primary-button" type="button" onClick={() => { setProjectForm(blankProject); setProjectMessage(""); setActiveView("new-project"); }}><Plus size={16} /> New Project</button></section>
            <section className="dashboard-metrics" aria-label="Project and task summary">
              <article className="dashboard-metric metric-projects"><span className="metric-icon"><FolderKanban size={20} /></span><span className="metric-label">Total Projects</span><strong>{projects.length}</strong><small>{projects.length} projects in your workspace</small></article>
              <article className="dashboard-metric metric-tasks"><span className="metric-icon"><ClipboardList size={20} /></span><span className="metric-label">Total Tasks</span><strong>0</strong><small>Tasks will appear here</small></article>
              <article className="dashboard-metric metric-pending"><span className="metric-icon"><Clock3 size={20} /></span><span className="metric-label">Pending Tasks</span><strong>0</strong><small>Tasks awaiting completion</small></article>
              <article className="dashboard-metric metric-overdue"><span className="metric-icon"><AlertTriangle size={20} /></span><span className="metric-label">Overdue Tasks</span><strong>0</strong><small>Tasks past their due date</small></article>
            </section>
            {projects.length === 0 ? <section className="dashboard-empty-panel"><div className="dashboard-empty-icon"><Target size={24} /></div><h3>Your workspace is ready</h3><p>Create your first project to start organising the work, milestones and tasks in your workspace.</p><button className="project-text-button" type="button" onClick={() => { setProjectForm(blankProject); setActiveView("new-project"); }}>Create your first project <ArrowRight size={14} /></button></section> : <section className="dashboard-recent-projects"><div className="project-section-heading"><div><span className="section-kicker">KEEP THINGS MOVING</span><h3>Recent projects</h3></div><button className="project-text-button" type="button" onClick={() => setActiveView("projects")}>View all <ArrowRight size={14} /></button></div>{projects.slice(0, 3).map((project) => <button className="project-list-row" type="button" key={project.id} onClick={() => setActiveView("projects")}><span className="project-row-mark">{project.name.slice(0, 1).toUpperCase()}</span><span className="project-row-main"><strong>{project.name}</strong><small>{project.client_name || "No client specified"}</small></span><span className={"project-status status-" + project.status.toLowerCase().replaceAll(" ", "-")}>{project.status}</span><span className="project-priority">{project.priority}</span></button>)}</section>}
          </>}
          {activeView === "projects" && <section className="projects-page-section">
            <div className="projects-page-heading"><div><span className="section-kicker">YOUR WORKSPACE</span><h2>All projects</h2><p>Manage the projects you are currently working on.</p></div><button className="project-primary-button" type="button" onClick={() => { setProjectForm(blankProject); setProjectMessage(""); setActiveView("new-project"); }}><Plus size={16} /> New Project</button></div>
            {projectMessage && <p className="project-success-message" role="status">{projectMessage}</p>}
            {projects.length === 0 ? <div className="dashboard-empty-panel projects-empty"><div className="dashboard-empty-icon"><FolderKanban size={24} /></div><h3>No projects yet</h3><p>Create a project to keep its details, ownership, dates and progress together.</p><button className="project-primary-button" type="button" onClick={() => { setProjectForm(blankProject); setProjectMessage(""); setActiveView("new-project"); }}><Plus size={16} /> Create first project</button></div> : <div className="projects-table-wrap"><div className="projects-table-heading"><span>PROJECT</span><span>STATUS</span><span>PRIORITY</span><span>TARGET DATE</span></div>{projects.map((project) => <div className="projects-table-row" key={project.id}><div className="projects-table-name"><span className="project-row-mark">{project.name.slice(0, 1).toUpperCase()}</span><span><strong>{project.name}</strong><small>{project.project_code || project.client_name || "No code or client"}</small></span></div><span className={"project-status status-" + project.status.toLowerCase().replaceAll(" ", "-")}>{project.status}</span><span className={"project-priority priority-" + project.priority.toLowerCase()}>{project.priority}</span><span className="project-date">{project.target_end_date || "Not set"}</span></div>)}</div>}
          </section>}
          {activeView === "new-project" && <section className="new-project-section">
            <button className="project-back-button" type="button" onClick={() => setActiveView("projects")}><ArrowLeft size={15} /> Back to projects</button>
            <div className="new-project-heading"><span className="section-kicker">PROJECT DETAILS</span><h2>Create a new project</h2><p>Add the essentials now. You can update the details later.</p></div>
            <form className="new-project-form" onSubmit={createProject}><div className="project-form-grid">
              <label className="project-form-field project-field-wide">Project name <span>*</span><input name="name" value={projectForm.name} onChange={updateProjectField} placeholder="e.g. Website redesign" required maxLength={120} /></label>
              <label className="project-form-field">Project code<input name="project_code" value={projectForm.project_code} onChange={updateProjectField} placeholder="e.g. GPMS-001" maxLength={40} /></label>
              <label className="project-form-field">Client name<input name="client_name" value={projectForm.client_name} onChange={updateProjectField} placeholder="Enter client or organisation" /></label>
              <label className="project-form-field project-field-wide">Description<textarea name="description" value={projectForm.description} onChange={updateProjectField} placeholder="What is this project about?" rows={3} /></label>
              <label className="project-form-field">Status<select name="status" value={projectForm.status} onChange={updateProjectField}><option>Not Started</option><option>Active</option><option>On Hold</option><option>Completed</option><option>Cancelled</option></select></label>
              <label className="project-form-field">Priority<select name="priority" value={projectForm.priority} onChange={updateProjectField}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
              <label className="project-form-field">Start date<input type="date" name="start_date" value={projectForm.start_date} onChange={updateProjectField} /></label>
              <label className="project-form-field">Target end date<input type="date" name="target_end_date" value={projectForm.target_end_date} onChange={updateProjectField} /></label>
              <label className="project-form-field">Project budget<input type="number" name="budget" value={projectForm.budget} onChange={updateProjectField} placeholder="0.00" min="0" step="0.01" /></label>
              <label className="project-form-field">Currency<select name="currency" value={projectForm.currency} onChange={updateProjectField}><option value="INR">INR — Indian Rupee</option><option value="USD">USD — US Dollar</option><option value="AUD">AUD — Australian Dollar</option><option value="GBP">GBP — British Pound</option><option value="EUR">EUR — Euro</option></select></label>
              <label className="project-form-field project-field-wide">Project manager<input name="project_manager" value={projectForm.project_manager} onChange={updateProjectField} placeholder="Name of project manager" /></label>
              <label className="project-form-field project-field-wide">Notes<textarea name="notes" value={projectForm.notes} onChange={updateProjectField} placeholder="Additional details or internal notes" rows={3} /></label>
            </div>{projectMessage && <p className="auth-error" role="alert">{projectMessage}</p>}<div className="new-project-actions"><button className="project-cancel-button" type="button" onClick={() => setActiveView("projects")}>Cancel</button><button className="project-primary-button" type="submit" disabled={isSavingProject}>{isSavingProject ? "Saving…" : "Save Project"} <ArrowRight size={16} /></button></div></form>
          </section>}
        </main>
      </div>
    );
  }

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
                <p className="auth-intro">Enter your phone number and 6-digit PIN to continue.</p>
                <form className="auth-form" onSubmit={verifyOtp}>
                  <label htmlFor="phone">Phone number</label>
                  <div className="auth-input-wrap phone-input-wrap">
                    <span className="country-code">+91</span>
                    <input id="phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="Enter 10-digit number" value={phone} onChange={(event) => { setPhone(event.target.value.replace(/\D/g, '').slice(0, 10)); setMessage(''); }} required pattern="[0-9]{10}" aria-describedby="phone-help" />
                  </div>
                  <small className="auth-field-help" id="phone-help">Use your registered phone number.</small>
                  <label htmlFor="otp">6-digit PIN</label>
                  <div className="otp-input-wrap">
                    <input className="auth-input otp-input" id="otp" type={showOtp ? "text" : "password"} inputMode="numeric" autoComplete="off" maxLength={6} placeholder="Enter your 6-digit PIN" value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, '').slice(0, 6)); setMessage(''); }} required pattern="[0-9]{6}" />
                    <button className="otp-visibility-toggle" type="button" onClick={() => setShowOtp((visible) => !visible)} aria-label={showOtp ? "Hide OTP" : "Show OTP"} title={showOtp ? "Hide OTP" : "Show OTP"}>{showOtp ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                  <p className="auth-demo-note"><ShieldCheck size={15} /> Enter the 6-digit PIN saved with your account. No SMS is sent.</p>
                  {message && <p className="auth-error" role="alert">{message}</p>}
                  <button className="auth-submit" type="submit" disabled={isVerifying}>{isVerifying ? 'Verifying…' : 'Verify & sign in'} <ArrowRight size={17} /></button>
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
