import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  FilePlus,
  Send,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: FilePlus,
      title: 'Easy Assignment Creation',
      desc: 'Professors can compose assignments with rich descriptions and exact target deadlines in seconds.',
    },
    {
      icon: Send,
      title: 'Student Submissions',
      desc: 'Students can upload text solutions or GitHub/Drive project repository links directly.',
    },
    {
      icon: Clock,
      title: 'Deadline Tracking',
      desc: 'Automated server-side timestamp verification ensuring accuracy across all submissions.',
    },
    {
      icon: CheckCircle2,
      title: 'On-Time / Late Status',
      desc: 'Instant automatic classification with clear status badges for both students and professors.',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Dashboards',
      desc: 'Tailored administrative and student dashboards with strict authorization security.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <Navbar />

      {/* Hero Section */}
      <section
        id="home"
        style={{
          padding: '6rem 2rem',
          textAlign: 'center',
          maxWidth: '1100px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-full)',
            color: '#818cf8',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
          }}
        >
          <Sparkles size={16} /> Academic Assignment Management System
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            color: '#ffffff',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Create, Manage & Submit Assignments Through One{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #818cf8, #c084fc, #2dd4bf)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Simple Platform
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-muted)',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.6',
          }}
        >
          Streamline university assignment workflows. Empower professors to publish tasks with exact deadlines and enable students to submit work on time.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Link to="/student/login" className="btn btn-primary" style={{ padding: '0.9rem 2rem' }}>
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/admin/login" className="btn btn-secondary" style={{ padding: '0.9rem 2rem' }}>
            Admin Login
          </Link>
          <Link to="/student/login" className="btn btn-secondary" style={{ padding: '0.9rem 2rem' }}>
            Student Login
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        style={{
          padding: '4rem 2rem',
          background: 'rgba(30, 41, 59, 0.4)',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginBottom: '1rem' }}>
            Built For College & Internship Standards
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 3rem' }}>
            Designed to solve core academic evaluation challenges cleanly with secure JWT authentication, Mongoose relational schemas, and precise server-time deadline checking.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            <div className="card" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-500)', marginBottom: '0.5rem' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Separate Portals</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Dedicated registration and login pages for Admin Professors and Students with distinct JWT role claims.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Automated Status</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Server timestamps rigorously calculate whether a submission was ON TIME or LATE automatically.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-teal)', marginBottom: '0.5rem' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '0.5rem' }}>Submission Inspection</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
                Professors can inspect text responses and click external repository links safely in one view.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', marginBottom: '0.75rem' }}>
            Core Application Features
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Everything you need for clean academic assignment workflow management.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(79, 70, 229, 0.15)',
                    color: '#818cf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '0.4rem' }}>
                    {feat.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '2.5rem 2rem',
          background: '#090d16',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <BookOpen size={20} color="var(--primary-500)" />
          <span style={{ fontWeight: '800', color: '#fff', fontSize: '1.1rem' }}>EduAssign System</span>
        </div>
        <p>© 2026 EduAssign. Assignment Management System. Designed for College Project & Internship Demonstration.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
