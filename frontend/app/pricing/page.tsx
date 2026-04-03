"use client";

import Link from "next/link";
import Image from "next/image";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      desc: "Perfect for personal projects and getting started.",
      features: [
        "Up to 5 repositories",
        "500MB storage",
        "Basic version control",
        "Community support",
        "Public repositories",
        "Single user",
      ],
      cta: "Get Started",
      href: "/auth/signup",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "/month",
      desc: "For professional developers who need more power.",
      features: [
        "Unlimited repositories",
        "50GB storage",
        "Advanced branching",
        "Priority support",
        "Private repositories",
        "Real-time collaboration",
        "API access",
        "Custom integrations",
      ],
      cta: "Start Free Trial",
      href: "/auth/signup",
      highlighted: true,
    },
    {
      name: "Team",
      price: "$39",
      period: "/user/mo",
      desc: "For teams building at scale with advanced needs.",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "SSO & SAML",
        "Audit logs",
        "Dedicated support",
        "Custom SLA",
        "Advanced permissions",
        "On-premise option",
      ],
      cta: "Contact Sales",
      href: "/auth/signup",
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: "Can I switch plans at any time?",
      a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.",
    },
    {
      q: "Is there a free trial for Pro?",
      a: "Yes, every Pro plan comes with a 14-day free trial. No credit card required to get started.",
    },
    {
      q: "What happens when I exceed my storage limit?",
      a: "We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional storage as needed.",
    },
    {
      q: "Do you offer discounts for open source?",
      a: "Absolutely. Open source projects get Pro features for free. Reach out to our team to get set up.",
    },
    {
      q: "Can I self-host CodeSync?",
      a: "Self-hosting is available on the Team plan. We provide full documentation and support for on-premise deployments.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, PayPal, and wire transfers for annual Team plans.",
    },
  ];

  return (
    <div className="pricing-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pricing-root {
          background-color: #09090b;
          color: #fafafa;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }

        /* ──────────────────── GRID BACKGROUND ──────────────────── */
        .grid-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 100%);
          pointer-events: none;
          z-index: 0;
        }
        .grid-bg-accent {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 50% 40% at 50% 20%, black 0%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 50% 40% at 50% 20%, black 0%, transparent 100%);
          pointer-events: none;
          z-index: 0;
        }
        .glow-orb {
          position: fixed; border-radius: 50%;
          filter: blur(120px); pointer-events: none; z-index: 0;
        }
        .glow-orb-1 {
          width: 500px; height: 500px;
          top: -150px; left: 50%; transform: translateX(-50%);
          background: rgba(99,102,241,0.08);
        }

        .pricing-content {
          position: relative; z-index: 1;
        }

        /* ──────────────────── NAVBAR ──────────────────── */
        .lp-nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 56px; height: 60px;
          background: rgba(9, 9, 11, 0.7);
          backdrop-filter: blur(20px) saturate(1.8);
          -webkit-backdrop-filter: blur(20px) saturate(1.8);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lp-logo {
          display: flex; align-items: center; gap: 10px;
          font-size: 17px; font-weight: 800; color: #fff;
          text-decoration: none; letter-spacing: -0.4px;
        }
        .lp-logo-icon {
          width: 26px; height: 26px;
          filter: brightness(0) invert(1); opacity: 0.9;
        }
        .lp-nav-links {
          display: flex; gap: 32px; align-items: center;
          position: absolute; left: 50%; transform: translateX(-50%);
        }
        .lp-nav-links a {
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.4); text-decoration: none;
          transition: color 0.2s;
        }
        .lp-nav-links a:hover, .lp-nav-links a.active { color: #fff; }
        .lp-nav-actions { display: flex; align-items: center; gap: 8px; }
        .btn-signin {
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.5); text-decoration: none;
          padding: 7px 16px; border-radius: 8px; transition: color 0.2s;
        }
        .btn-signin:hover { color: #fff; }
        .btn-signup {
          font-size: 13px; font-weight: 600; color: #fff; text-decoration: none;
          padding: 7px 20px; background: #6366f1; border-radius: 8px;
          border: 1px solid rgba(129,140,248,0.3);
          transition: all 0.2s;
          box-shadow: 0 0 20px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .btn-signup:hover {
          background: #5558e6; transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        /* ──────────────────── HERO ──────────────────── */
        .pricing-hero {
          text-align: center; padding: 100px 24px 60px;
        }
        .pricing-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 500; color: #818cf8;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 100px; padding: 5px 14px;
          margin-bottom: 20px;
        }
        .pricing-hero h1 {
          font-size: clamp(40px, 6vw, 64px); font-weight: 800;
          letter-spacing: -2px; color: #fafafa; margin-bottom: 16px;
          line-height: 1.08;
        }
        .pricing-hero p {
          font-size: 17px; color: rgba(255,255,255,0.38);
          max-width: 480px; margin: 0 auto; line-height: 1.7;
        }

        /* ──────────────────── PLANS ──────────────────── */
        .plans-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 20px; max-width: 1060px; margin: 0 auto 100px;
          padding: 0 24px;
          align-items: start;
        }
        .plan-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 44px 36px;
          display: flex; flex-direction: column;
          transition: all 0.3s ease;
          position: relative;
        }
        .plan-card:hover {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-4px);
        }
        .plan-card.highlighted {
          background: rgba(99,102,241,0.04);
          border-color: rgba(99,102,241,0.3);
          box-shadow: 0 0 40px rgba(99,102,241,0.1), 0 20px 60px rgba(0,0,0,0.3);
          transform: scale(1.03);
        }
        .plan-card.highlighted:hover {
          transform: scale(1.03) translateY(-4px);
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 0 50px rgba(99,102,241,0.15), 0 24px 70px rgba(0,0,0,0.35);
        }
        .plan-card.highlighted::before {
          content: 'Most Popular';
          position: absolute; top: 16px; right: 20px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
          color: #818cf8; background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 100px; padding: 3px 10px;
        }
        .plan-name {
          font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.5);
          margin-bottom: 16px;
        }
        .plan-price {
          display: flex; align-items: baseline; gap: 4px;
          margin-bottom: 8px;
        }
        .plan-price-value {
          font-size: 48px; font-weight: 800; color: #fafafa;
          letter-spacing: -2px; line-height: 1;
        }
        .plan-price-period {
          font-size: 14px; color: rgba(255,255,255,0.3); font-weight: 400;
        }
        .plan-desc {
          font-size: 14px; color: rgba(255,255,255,0.3);
          line-height: 1.6; margin-bottom: 32px;
        }
        .plan-features {
          list-style: none; display: flex; flex-direction: column;
          gap: 14px; margin-bottom: 36px; flex: 1;
        }
        .plan-features li {
          display: flex; align-items: center; gap: 10px;
          font-size: 13.5px; color: rgba(255,255,255,0.55);
        }
        .plan-check {
          width: 16px; height: 16px; border-radius: 50%;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .plan-check svg {
          width: 10px; height: 10px; color: #818cf8;
        }
        .plan-cta {
          display: block; text-align: center;
          padding: 12px 24px; border-radius: 10px;
          font-size: 14px; font-weight: 600;
          text-decoration: none; transition: all 0.2s;
        }
        .plan-cta-default {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.8);
        }
        .plan-cta-default:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          color: #fff; transform: translateY(-1px);
        }
        .plan-cta-primary {
          background: #6366f1;
          border: 1px solid rgba(129,140,248,0.3);
          color: #fff;
          box-shadow: 0 0 20px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .plan-cta-primary:hover {
          background: #5558e6; transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }

        /* ──────────────────── FAQ ──────────────────── */
        .faq-section {
          max-width: 720px; margin: 0 auto;
          padding: 0 24px 120px;
        }
        .faq-title {
          font-size: clamp(28px, 4vw, 40px); font-weight: 800;
          letter-spacing: -1.5px; color: #fafafa;
          text-align: center; margin-bottom: 48px;
        }
        .faq-grid {
          display: grid; grid-template-columns: 1fr;
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          overflow: hidden;
        }
        .faq-item {
          background: #0c0c0f; padding: 24px 28px;
          transition: background 0.3s;
        }
        .faq-item:hover { background: rgba(255,255,255,0.015); }
        .faq-question {
          font-size: 15px; font-weight: 600; color: #fafafa;
          margin-bottom: 8px;
        }
        .faq-answer {
          font-size: 14px; color: rgba(255,255,255,0.35);
          line-height: 1.65;
        }

        /* ──────────────────── FOOTER ──────────────────── */
        .footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 72px 64px 0;
          background: rgba(0,0,0,0.3);
        }
        .footer-grid {
          display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px; margin-bottom: 64px;
        }
        .footer-brand-name { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 12px; }
        .footer-brand-desc {
          font-size: 13px; line-height: 1.7; color: rgba(255,255,255,0.22); max-width: 200px;
        }
        .footer-col-label {
          font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.5); margin-bottom: 18px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .footer-links a {
          font-size: 13px; color: rgba(255,255,255,0.3); text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: rgba(255,255,255,0.7); }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 0;
        }
        .footer-copy { font-size: 13px; color: rgba(255,255,255,0.2); }
        .github-icon { color: rgba(255,255,255,0.25); transition: color 0.2s; cursor: pointer; }
        .github-icon:hover { color: rgba(255,255,255,0.6); }

        /* ──────────────────── RESPONSIVE ──────────────────── */
        @media (max-width: 1024px) {
          .lp-nav { padding: 0 32px; }
          .plans-grid { max-width: 100%; padding: 0 24px; gap: 16px; }
          .footer { padding: 56px 32px 0; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
        }

        @media (max-width: 768px) {
          .lp-nav { padding: 0 20px; }
          .lp-nav-links { display: none; }
          .btn-signin { display: none; }

          .pricing-hero { padding: 72px 20px 48px; }

          .plans-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
            padding: 0 20px;
            gap: 16px;
            margin-bottom: 80px;
          }
          .plan-card { padding: 36px 28px; }
          .plan-card.highlighted { transform: none; }
          .plan-card.highlighted:hover { transform: translateY(-4px); }

          .faq-section { padding: 0 20px 80px; }

          .footer { padding: 48px 20px 0; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .footer-bottom { flex-direction: column; gap: 12px; align-items: center; }
        }

        @media (max-width: 500px) {
          .footer-grid { grid-template-columns: 1fr; }
          .faq-grid { border-radius: 12px; }
        }
      `}</style>

      {/* ────── GRID BACKGROUND ────── */}
      <div className="grid-bg" />
      <div className="grid-bg-accent" />
      <div className="glow-orb glow-orb-1" />

      <div className="pricing-content">
        {/* ────── NAVBAR ────── */}
        <nav className="lp-nav">
          <Link href="/" className="lp-logo">
            <Image src="/codeSyncLogo.svg" alt="CodeSync" width={26} height={26} className="lp-logo-icon" />
            CodeSync
          </Link>
          <div className="lp-nav-links">
            <Link href="/#features">Features</Link>
            <Link href="/pricing" className="active">Pricing</Link>
            <a href="#docs">Docs</a>
          </div>
          <div className="lp-nav-actions">
            <Link href="/auth/login" className="btn-signin">Sign In</Link>
            <Link href="/auth/signup" className="btn-signup">Get Started</Link>
          </div>
        </nav>

        {/* ────── HERO ────── */}
        <section className="pricing-hero">
          <span className="pricing-tag">Pricing</span>
          <h1>Simple, Transparent Pricing.</h1>
          <p>Start free and scale as you grow. No hidden fees, no surprises.</p>
        </section>

        {/* ────── PLANS ────── */}
        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              className={`plan-card ${plan.highlighted ? "highlighted" : ""}`}
              key={plan.name}
            >
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">
                <span className="plan-price-value">{plan.price}</span>
                <span className="plan-price-period">{plan.period}</span>
              </div>
              <p className="plan-desc">{plan.desc}</p>
              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className="plan-check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`plan-cta ${plan.highlighted ? "plan-cta-primary" : "plan-cta-default"}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* ────── FAQ ────── */}
        <section className="faq-section">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <div className="faq-item" key={i}>
                <h3 className="faq-question">{faq.q}</h3>
                <p className="faq-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ────── FOOTER ────── */}
        <footer className="footer">
          <div className="footer-grid">
            <div>
              <p className="footer-brand-name">CodeSync</p>
              <p className="footer-brand-desc">
                Engineered for deep work.<br />
                The standard for modern<br />
                engineering teams.
              </p>
            </div>
            <div>
              <p className="footer-col-label">Product</p>
              <ul className="footer-links">
                <li><a href="#">Changelog</a></li>
                <li><a href="#">Security</a></li>
                <li><Link href="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <p className="footer-col-label">Resources</p>
              <ul className="footer-links">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </div>
            <div>
              <p className="footer-col-label">Legal</p>
              <ul className="footer-links">
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">© 2026 CodeSync. All rights reserved.</p>
            <svg className="github-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </div>
        </footer>
      </div>
    </div>
  );
}
