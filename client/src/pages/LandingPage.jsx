import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  FilePlus, Send, Clock, CheckCircle2, ShieldCheck,
  ArrowRight, BookOpen, Users, BarChart3, Bell,
  GraduationCap, Star, Award, Layers,
} from 'lucide-react';

/* ── Mini Dashboard Preview ─────────────────────────────── */
const DashboardPreview = () => (
  <div style={{
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 20px 60px rgba(0,0,0,.12)',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '600px',
    userSelect: 'none',
  }}>
    {/* Window chrome */}
    <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f87171' }} />
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24' }} />
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80' }} />
      <div style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.03em' }}>
        EduAssign — Admin Dashboard
      </div>
    </div>

    {/* Dashboard body */}
    <div style={{ display: 'flex', height: '280px' }}>
      {/* Sidebar strip */}
      <div style={{ width: '120px', background: '#fff', borderRight: '1px solid #f1f5f9', padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
        {[
          { label: 'Dashboard', active: true },
          { label: 'Assignments', active: false },
          { label: 'Submissions', active: false },
          { label: 'Profile', active: false },
        ].map(item => (
          <div key={item.label} style={{
            padding: '0.4rem 0.6rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: item.active ? '700' : '500',
            color: item.active ? '#2563eb' : '#94a3b8',
            background: item.active ? '#eff6ff' : 'transparent',
          }}>{item.label}</div>
        ))}
      </div>

      {/* Main area */}
      <div style={{ flex: 1, padding: '0.875rem', background: '#f8fafc', overflow: 'hidden' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>Overview</div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.875rem' }}>
          {[
            { n: '12', l: 'Assignments', c: '#2563eb', bg: '#eff6ff' },
            { n: '48', l: 'Submissions', c: '#16a34a', bg: '#f0fdf4' },
            { n: '6',  l: 'Pending',     c: '#d97706', bg: '#fffbeb' },
          ].map(s => (
            <div key={s.l} style={{ background: '#fff', borderRadius: '8px', padding: '0.6rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: s.c }}>{s.n}</div>
              <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: '500' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Assignment list */}
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.68rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recent Assignments
          </div>
          {[
            { title: 'Database Normalization', due: '7 days', status: 'Active', sc: '#2563eb', sb: '#eff6ff' },
            { title: 'REST API Security',      due: '14 days', status: 'Active', sc: '#2563eb', sb: '#eff6ff' },
            { title: 'DS Lab: BFS & DFS',      due: 'Closed',  status: 'Closed', sc: '#64748b', sb: '#f1f5f9' },
          ].map(a => (
            <div key={a.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 0.75rem', borderBottom: '1px solid #f8fafc' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: '600', color: '#334155' }}>{a.title}</div>
              <span style={{ fontSize: '0.58rem', fontWeight: '700', padding: '0.15rem 0.45rem', borderRadius: '999px', background: a.sb, color: a.sc }}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ── Feature Card ──────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, color, bg }) => (
  <div style={{
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '1.5rem',
    boxShadow: '0 1px 4px rgba(0,0,0,.05)',
    transition: 'all 0.2s',
  }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none'; }}
  >
    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', flexShrink: 0 }}>
      <Icon size={22} />
    </div>
    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.4rem' }}>{title}</h3>
    <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
  </div>
);

/* ── Landing Page ─────────────────────────────────────── */
const LandingPage = () => {
  const features = [
    { icon: FilePlus,     title: 'Easy Assignment Creation',  desc: 'Professors create assignments with rich descriptions, exact deadlines, and custom max marks in seconds.', color: '#2563eb', bg: '#eff6ff' },
    { icon: Send,         title: 'Student Submissions',       desc: 'Students submit text solutions or GitHub/Drive links directly from their personalized dashboard.', color: '#16a34a', bg: '#f0fdf4' },
    { icon: Clock,        title: 'Deadline Tracking',         desc: 'Server-side timestamp verification ensures accurate ON TIME / LATE classification every time.', color: '#d97706', bg: '#fffbeb' },
    { icon: CheckCircle2, title: 'Grading & Feedback',        desc: 'Professors review, assign marks, and give detailed written feedback. Students see results instantly.', color: '#7c3aed', bg: '#f5f3ff' },
    { icon: ShieldCheck,  title: 'Role-Based Access',         desc: 'Secure JWT-based login with separate portals for admins and students — strict authorization enforced.', color: '#0891b2', bg: '#ecfeff' },
    { icon: Layers,       title: 'Resubmission History',      desc: 'Students can resubmit revised work. Full version history is tracked and visible to both parties.', color: '#f97316', bg: '#fff7ed' },
  ];

  const stats = [
    { n: '100%', l: 'Free to Use',      icon: Star },
    { n: '2',    l: 'Role Dashboards',  icon: Users },
    { n: '∞',    l: 'Assignments',      icon: BarChart3 },
    { n: 'JWT',  l: 'Secure Auth',      icon: ShieldCheck },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      {/* ── Hero ────────────────────────────────────────── */}
      <section id="home" style={{ background: 'linear-gradient(180deg, #eff6ff 0%, #fff 100%)', padding: '5rem 2rem 4rem', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
          className="hero-grid">

          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.35rem 0.875rem',
              background: '#eff6ff', border: '1px solid #bfdbfe',
              borderRadius: '999px', color: '#1d4ed8',
              fontSize: '0.8rem', fontWeight: '700',
              marginBottom: '1.5rem',
            }}>
              <GraduationCap size={14} /> Academic Assignment Management Platform
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: '800', color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: '1.25rem' }}>
              Manage University Assignments{' '}
              <span style={{ color: '#2563eb' }}>Simply & Professionally</span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.75, marginBottom: '2rem', maxWidth: '480px' }}>
              Empower professors to publish assignments and enable students to submit work on time — with grading, feedback, and resubmission all in one clean platform.
            </p>

            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              <Link to="/student/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.75rem',
                background: '#2563eb', color: '#fff',
                borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem',
                boxShadow: '0 4px 14px rgba(37,99,235,.35)',
                transition: 'all 0.2s', textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.transform = 'none'; }}
              >
                Get Started <ArrowRight size={17} />
              </Link>

              <Link to="/admin/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#fff', color: '#374151',
                border: '1px solid #d1d5db', borderRadius: '10px',
                fontWeight: '600', fontSize: '0.95rem',
                boxShadow: '0 1px 3px rgba(0,0,0,.07)',
                transition: 'all 0.2s', textDecoration: 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#374151'; }}
              >
                Admin Portal
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              {['Role-Based Auth', 'Deadline Tracking', 'Version History'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#475569', fontWeight: '500' }}>
                  <CheckCircle2 size={14} color="#22c55e" /> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Dashboard preview */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────── */}
      <section style={{ background: '#1e40af', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.l}>
                <Icon size={24} color="rgba(255,255,255,.6)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>{s.n}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,.7)', fontWeight: '500' }}>{s.l}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── About / Key Features ─────────────────────────── */}
      <section id="about" style={{ padding: '5rem 2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.875rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '999px', color: '#1d4ed8', fontSize: '0.78rem', fontWeight: '700', marginBottom: '1rem' }}>
              <BookOpen size={13} /> Built for Academic Excellence
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
              How EduAssign Works
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              A streamlined three-step workflow connecting professors and students.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { num: '01', title: 'Professor Creates Assignment', desc: 'Professors log into their secure portal, fill in assignment details, set a deadline and max marks, then publish. Students are notified instantly.', icon: FilePlus, color: '#2563eb', bg: '#eff6ff' },
              { num: '02', title: 'Student Submits Work', desc: 'Students view all active assignments on their dashboard, submit text answers or external repository links before the deadline.', icon: Send, color: '#16a34a', bg: '#f0fdf4' },
              { num: '03', title: 'Review & Grade', desc: 'Professors review each submission, assign marks out of the max, leave feedback, and approve or request changes. Students see results live.', icon: Award, color: '#7c3aed', bg: '#f5f3ff' },
            ].map(s => (
              <div key={s.num} style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,.05)',
              }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <s.icon size={24} />
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>STEP {s.num}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────────── */}
      <section id="features" style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
              Everything You Need
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
              All the tools for a complete academic assignment management cycle.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {features.map((feat, i) => <FeatureCard key={i} {...feat} />)}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(255,255,255,.2)' }}>
            <GraduationCap size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: '800', color: '#fff', marginBottom: '1rem' }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            Join the platform and streamline your university's assignment workflow today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/student/register" style={{
              padding: '0.85rem 2rem', background: '#fff', color: '#1e40af',
              borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem',
              textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,.15)',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              Student Register
            </Link>
            <Link to="/admin/register" style={{
              padding: '0.85rem 2rem', background: 'rgba(255,255,255,.15)',
              color: '#fff', border: '1px solid rgba(255,255,255,.3)',
              borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem',
              textDecoration: 'none', transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.15)'}
            >
              Admin Register
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer style={{ background: '#0f172a', padding: '2.5rem 2rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: '800', color: '#fff', fontSize: '1.05rem' }}>EduAssign</span>
            <span style={{ color: '#475569', fontSize: '0.8rem', marginLeft: '0.5rem' }}>Assignment Management System</span>
          </div>
          <p style={{ color: '#475569', fontSize: '0.82rem' }}>
            © 2026 EduAssign · Designed for College Project & Internship Demonstration
          </p>
        </div>
      </footer>

      {/* Responsive hero grid fix */}
      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:last-child { display: none; }
        }
        @media (max-width: 640px) {
          section div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          section div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
