import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bell, CalendarDays,
  CheckCircle2, ChevronDown, CircleHelp, Clock3, Command, FolderKanban,
  LayoutDashboard, ListTodo, Plus, Search, Settings2, ShieldCheck,
  Sparkles, Users, Zap,
} from 'lucide-react';
import { isSupabaseConfigured } from './lib/supabase';

const projects = [
  { name: 'Website Redesign', initials: 'WR', color: 'violet', progress: 72, tasks: '18/25', due: 'Nov 12', status: 'On track' },
  { name: 'Mobile App v2.0', initials: 'MA', color: 'blue', progress: 48, tasks: '12/28', due: 'Nov 18', status: 'In progress' },
  { name: 'Customer Portal', initials: 'CP', color: 'amber', progress: 86, tasks: '24/28', due: 'Nov 05', status: 'At risk' },
];

const tasks = [
  { title: 'Review homepage wireframes', project: 'Website Redesign', due: 'Today', priority: 'High', initials: 'AS', color: 'rose' },
  { title: 'Finalize API requirements', project: 'Mobile App v2.0', due: 'Today', priority: 'High', initials: 'MK', color: 'blue' },
  { title: 'Prepare stakeholder update', project: 'Customer Portal', due: 'Tomorrow', priority: 'Medium', initials: 'JD', color: 'green' },
  { title: 'QA testing checklist', project: 'Mobile App v2.0', due: 'Oct 31', priority: 'Low', initials: 'RL', color: 'amber' },
];

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Gunjit PMS home">
          <span className="brand-mark"><Command size={19} strokeWidth={2.5} /></span>
          <span className="brand-copy"><strong>gunjit<span>.</span></strong><small>PROJECT MANAGEMENT</small></span>
        </a>
        <button className="workspace-switcher">
          <span className="workspace-avatar">G</span>
          <span className="workspace-copy"><strong>Gunjit Workspace</strong><small>Free workspace</small></span>
          <ChevronDown size={15} />
        </button>
        <div className="nav-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          <a className="nav-item active" href="#overview"><LayoutDashboard size={18} /><span>Overview</span></a>
          <a className="nav-item" href="#projects"><FolderKanban size={18} /><span>Projects</span><span className="nav-count">8</span></a>
          <a className="nav-item" href="#tasks"><ListTodo size={18} /><span>My tasks</span><span className="nav-count">6</span></a>
          <a className="nav-item" href="#team"><Users size={18} /><span>Team</span></a>
          <a className="nav-item" href="#activity"><Activity size={18} /><span>Activity</span></a>
        </nav>
        <div className="nav-label projects-label">YOUR PROJECTS <button aria-label="Add project"><Plus size={14} /></button></div>
        <div className="project-nav">
          <a href="#website"><i className="project-dot violet-dot" />Website Redesign</a>
          <a href="#mobile"><i className="project-dot blue-dot" />Mobile App v2.0</a>
          <a href="#portal"><i className="project-dot amber-dot" />Customer Portal</a>
          <a href="#all-projects" className="muted-link">+ 5 more projects</a>
        </div>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><span className="upgrade-icon"><Sparkles size={16} /></span><strong>Make work flow.</strong><p>Bring your team and projects together.</p><button>Explore workspace <ArrowRight size={13} /></button></div>
          <a className="nav-item" href="#help"><CircleHelp size={18} /><span>Help & support</span></a>
          <a className="nav-item" href="#settings"><Settings2 size={18} /><span>Settings</span></a>
          <div className="profile-row"><div className="profile-avatar">GS</div><div className="profile-copy"><strong>Gunjit Singh</strong><small>Workspace owner</small></div><button aria-label="Profile options"><ChevronDown size={15} /></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-separator">/</span><strong>Overview</strong></div>
          <div className="topbar-actions"><div className="connection-pill"><span className={isSupabaseConfigured ? 'connection-dot connected' : 'connection-dot'} />{isSupabaseConfigured ? 'Supabase configured' : 'Demo workspace'}</div><button className="icon-button" aria-label="Search"><Search size={18} /></button><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="topbar-divider" /><button className="help-button"><CircleHelp size={16} /> Help</button></div>
        </header>

        <div className="page-content" id="overview">
          <section className="welcome-row">
            <div><div className="eyebrow"><span className="eyebrow-line" /> FRIDAY, OCTOBER 30, 2026</div><h1>Good morning, Gunjit <span className="wave">✳</span></h1><p className="welcome-subtitle">Here’s what’s happening across your workspace today.</p></div>
            <button className="primary-button" onClick={() => window.alert('Project creation will be enabled in the Projects milestone.')}><Plus size={17} /> New project</button>
          </section>

          <section className="stats-grid" aria-label="Workspace summary">
            <article className="stat-card"><div className="stat-heading"><span>Active projects</span><span className="stat-icon purple"><FolderKanban size={17} /></span></div><div className="stat-value">8 <span className="stat-trend positive"><ArrowUpRight size={14} /> 2</span></div><div className="stat-foot">vs. last month</div><div className="mini-bars bars-purple"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article>
            <article className="stat-card"><div className="stat-heading"><span>Tasks completed</span><span className="stat-icon green"><CheckCircle2 size={17} /></span></div><div className="stat-value">124 <span className="stat-trend positive"><ArrowUpRight size={14} /> 12%</span></div><div className="stat-foot">of 168 total tasks</div><div className="progress-track"><span style={{ width: '74%' }} /></div><div className="progress-caption"><span>Overall progress</span><strong>74%</strong></div></article>
            <article className="stat-card"><div className="stat-heading"><span>Due this week</span><span className="stat-icon amber"><CalendarDays size={17} /></span></div><div className="stat-value">14 <span className="stat-trend neutral"><ArrowDownRight size={14} /> 3</span></div><div className="stat-foot">tasks across 5 projects</div><div className="deadline-dots"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></article>
            <article className="stat-card"><div className="stat-heading"><span>Team capacity</span><span className="stat-icon blue"><Users size={17} /></span></div><div className="stat-value">82<span className="stat-unit">%</span><span className="capacity-label">healthy</span></div><div className="stat-foot">12 team members</div><div className="capacity-track"><span style={{ width: '82%' }} /></div><div className="progress-caption"><span>Weekly utilization</span><strong>82%</strong></div></article>
          </section>

          <section className="content-grid">
            <article className="panel projects-panel" id="projects">
              <div className="panel-header"><div><h2>Projects at a glance</h2><p>Keep your most important work moving.</p></div><button className="text-button">View all <ArrowRight size={15} /></button></div>
              <div className="project-table"><div className="table-head"><span>PROJECT</span><span>PROGRESS</span><span>TASKS</span><span>DUE DATE</span><span>STATUS</span></div>{projects.map((project) => <div className="project-row" key={project.name}><div className="project-name-cell"><span className={'project-avatar ' + project.color}>{project.initials}</span><strong>{project.name}</strong></div><div className="project-progress-cell"><div className="progress-track"><span style={{ width: project.progress + '%' }} /></div><small>{project.progress}%</small></div><span className="task-count">{project.tasks}</span><span className="due-date">{project.due}</span><span className={'status-badge ' + (project.status === 'On track' ? 'status-good' : project.status === 'At risk' ? 'status-risk' : 'status-progress')}><i />{project.status}</span></div>)}</div>
              <div className="panel-footer"><span><span className="footer-dot" /> Showing 3 of 8 projects</span><button className="text-button">See all projects <ArrowRight size={14} /></button></div>
            </article>

            <article className="panel tasks-panel" id="tasks">
              <div className="panel-header"><div><h2>My tasks</h2><p>Your next steps, all in one place.</p></div><button className="more-button" aria-label="Task options">···</button></div>
              <div className="task-tabs"><button className="task-tab active">Upcoming <span>6</span></button><button className="task-tab">Completed</button></div>
              <div className="task-list">{tasks.map((task) => <div className="task-row" key={task.title}><button className="task-checkbox" aria-label={'Mark ' + task.title + ' complete'} /><div className="task-details"><strong>{task.title}</strong><small>{task.project}</small><div className="task-meta"><span className={'priority priority-' + task.priority.toLowerCase()}>{task.priority}</span><span className="task-due"><Clock3 size={12} />{task.due}</span></div></div><span className={'assignee-avatar ' + task.color}>{task.initials}</span></div>)}</div>
              <div className="panel-footer"><span>4 of 6 upcoming tasks</span><button className="text-button">View my tasks <ArrowRight size={14} /></button></div>
            </article>
          </section>

          <section className="bottom-grid">
            <article className="panel activity-panel" id="activity"><div className="panel-header"><div><h2>Recent activity</h2><p>The latest updates from your team.</p></div><button className="text-button">Activity log <ArrowRight size={14} /></button></div><div className="activity-list"><div className="activity-item"><span className="activity-avatar activity-blue">MK</span><p><strong>Manpreet Kaur</strong> completed <b>API integration review</b><small>Mobile App v2.0 <span>·</span> 18 min ago</small></p><span className="activity-type completed"><CheckCircle2 size={14} /></span></div><div className="activity-item"><span className="activity-avatar activity-purple">AS</span><p><strong>Amrit Singh</strong> added 3 comments to <b>Homepage wireframes</b><small>Website Redesign <span>·</span> 42 min ago</small></p><span className="activity-type comment">↗</span></div><div className="activity-item"><span className="activity-avatar activity-amber">JD</span><p><strong>Jaspreet Dhillon</strong> moved <b>UAT preparation</b> to In review<small>Customer Portal <span>·</span> 1 hour ago</small></p><span className="activity-type review"><ShieldCheck size={14} /></span></div></div></article>
            <article className="focus-card"><div className="focus-decoration focus-decoration-one" /><div className="focus-decoration focus-decoration-two" /><span className="focus-kicker"><Zap size={14} /> YOUR WEEKLY FOCUS</span><h2>Make space for<br />deep work.</h2><p>You’ve got 14 tasks due this week. Block time for the work that matters most.</p><div className="focus-metric"><div><strong>6.5 hrs</strong><span>Focus time this week</span></div><div className="focus-metric-icon"><Clock3 size={20} /></div></div><button className="focus-button">Plan my week <ArrowRight size={15} /></button></article>
          </section>
          <footer className="app-footer"><span>© 2026 Gunjit Project Management System</span><span><span className="footer-live-dot" /> All systems operational</span><span>Built for better work <span className="footer-heart">♥</span></span></footer>
        </div>
      </main>
    </div>
  );
}

export default App;
