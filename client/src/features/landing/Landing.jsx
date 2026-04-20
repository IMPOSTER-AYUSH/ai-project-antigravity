import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiCpu, FiUsers, FiAward, FiStar } from 'react-icons/fi';
import Button from '../../components/UI/Button';
import Logo from '../../components/UI/Logo';
import DarkVeil from '../../components/UI/DarkVeil';
import './Landing.css';

const features = [
  {
    icon: <FiCpu />,
    title: 'AI-Powered Tutoring',
    desc: 'Get instant, personalized help from our advanced AI tutor that adapts to your learning style and pace.',
  },
  {
    icon: <FiBookOpen />,
    title: 'Structured Courses',
    desc: 'Access curated courses designed by industry experts, with hands-on projects and real-world applications.',
  },
  {
    icon: <FiUsers />,
    title: 'Community Driven',
    desc: 'Join thousands of learners, collaborate on projects, and grow your network with like-minded peers.',
  },
  {
    icon: <FiAward />,
    title: 'Earn Certificates',
    desc: 'Complete courses and earn industry-recognized certificates to boost your career portfolio.',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Full Stack Developer',
    text: '"Human AI completely transformed how I learn. The AI tutor felt like having a personal mentor available 24/7. I landed my dream job within 3 months!"',
    avatar: '👩‍💻',
  },
  {
    name: 'Alex Chen',
    role: 'Data Scientist',
    text: '"The personalized learning paths are incredible. The platform identified my weak areas and helped me strengthen them systematically. Highly recommend!"',
    avatar: '👨‍🔬',
  },
  {
    name: 'Sarah Johnson',
    role: 'UX Designer',
    text: '"I have tried many platforms but Human AI stands out. The course quality is exceptional and the AI chat feature saves me hours of searching for answers."',
    avatar: '👩‍🎨',
  },
];

export default function Landing() {
  return (
    <div className="landing-page">
      {/* DarkVeil WebGL Background */}
      <div className="darkveil-bg">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>

      {/* Floating Pill Navbar */}
      <header className="landing-nav">
        <Link to="/" className="brand-logo">
          <Logo size={28} color="white" />
          <span className="brand-text">Human AI</span>
        </Link>
        <nav className="nav-links">
          <a href="#home" className="nav-link">Home</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#features" className="nav-link">Features</a>
          <Link to="/login" className="nav-link">Log in</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="hero-content">
            <h1>Master any skill with your personal <span className="highlight-text">AI Tutor</span></h1>
            <p>Interactive courses, real-time AI assistance, and personalized learning paths designed to help you reach your goals faster.</p>
            <div className="hero-actions">
              <Link to="/signup">
                <Button size="lg" className="pulse-btn">Start Learning for Free <FiArrowRight style={{ marginLeft: 8 }} /></Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section id="about" className="showcase-section">
          <div className="showcase-container">
            <div className="showcase-text">
              <div className="section-badge">About Human AI</div>
              <h2>An intelligent learning companion built for the modern learner</h2>
              <p>Human AI combines cutting-edge artificial intelligence with expert-curated curriculum. Whether you're a beginner or advanced, our platform adapts to deliver the most effective learning experience.</p>
            </div>
            <div className="showcase-image">
              <img src="/dashboard-full.png" alt="Human AI Dashboard Preview" />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="features-section">
          <div className="section-header">
            <div className="section-badge">Why Human AI?</div>
            <h2>Everything you need to learn smarter</h2>
            <p>Our platform is packed with features designed to accelerate your learning journey.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Tutor Preview */}
        <section className="showcase-section reverse">
          <div className="showcase-container">
            <div className="showcase-image">
              <img src="/tutor-full.jpg" alt="AI Tutor Preview" />
            </div>
            <div className="showcase-text">
              <div className="section-badge">AI Tutor</div>
              <h2>Ask anything. Get instant, expert-level answers.</h2>
              <p>Our AI tutor, powered by advanced language models, provides real-time explanations, code reviews, concept breakdowns, and step-by-step guidance — just like a personal mentor.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="section-header">
            <div className="section-badge">Testimonials</div>
            <h2>Loved by learners worldwide</h2>
            <p>See what our students have to say about their experience.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, j) => <FiStar key={j} className="star-filled" />)}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <span className="testimonial-avatar">{t.avatar}</span>
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2>Ready to transform your learning?</h2>
          <p>Join thousands of students already learning smarter with Human AI.</p>
          <Link to="/signup">
            <Button size="lg" className="pulse-btn">Get Started — It's Free <FiArrowRight style={{ marginLeft: 8 }} /></Button>
          </Link>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="footer-brand">
            <Logo size={24} color="white" />
            <span>Human AI</span>
          </div>
          <p>© 2026 Human AI. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
