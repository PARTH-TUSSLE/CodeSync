"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const slides = ["/dashboard.png", "/dashboard2.png", "/dashboard3.png"];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  return (
    <div className="lp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          background-color: #0c0e14;
          color: #fff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ──────────────────── NAVBAR ──────────────────── */
        .lp-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 56px;
          height: 62px;
          background: rgba(12, 14, 20, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.055);
        }
        .lp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 17px;
          font-weight: 800;
          color: #fff;
          text-decoration: none;
          letter-spacing: -0.4px;
        }
        .lp-logo-icon {
          width: 28px; height: 28px;
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }
        .lp-nav-links {
          display: flex;
          gap: 36px;
          align-items: center;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .lp-nav-links a {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.2s;
        }
        .lp-nav-links a:hover, .lp-nav-links a.active { color: #fff; }
        .lp-nav-actions { display: flex; align-items: center; gap: 10px; }
        .btn-signin {
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.65); text-decoration: none;
          padding: 8px 18px; border-radius: 8px; transition: color 0.2s;
        }
        .btn-signin:hover { color: #fff; }
        .btn-signup {
          font-size: 13px; font-weight: 600; color: #fff; text-decoration: none;
          padding: 8px 22px; background: #6366f1; border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.15);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 20px rgba(99,102,241,0.3);
        }
        .btn-signup:hover {
          background: #4f46e5; transform: translateY(-1px);
          box-shadow: 0 4px 28px rgba(99,102,241,0.45);
        }
        /* Mobile nav toggle */
        .nav-hamburger {
          display: none; background: none; border: none;
          color: rgba(255,255,255,0.6); cursor: pointer; padding: 4px;
        }
        .nav-mobile-menu {
          display: none; position: fixed; top: 62px; left: 0; right: 0;
          background: #0c0e14; border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 20px 24px 24px; flex-direction: column; gap: 18px; z-index: 99;
        }
        .nav-mobile-menu.open { display: flex; }
        .nav-mobile-menu a {
          font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.6);
          text-decoration: none; padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-mobile-menu a:last-child { border: none; }
        .nav-mobile-menu a:hover { color: #fff; }

        /* ──────────────────── HERO ──────────────────── */
        .hero {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 110px 24px 80px;
          position: relative; overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; top: -120px; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-eyebrow {
          font-size: 10.5px; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
          margin-bottom: 28px; position: relative;
        }
        .hero-title {
          font-size: clamp(52px, 8.5vw, 88px); font-weight: 900;
          line-height: 1.03; letter-spacing: -3px; color: #fff;
          max-width: 820px; margin-bottom: 0; position: relative;
        }
        .hero-title-accent {
          background: linear-gradient(135deg, #818cf8 0%, #a78bfa 60%, #818cf8 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 17px; font-weight: 400; line-height: 1.7;
          color: rgba(255,255,255,0.42); max-width: 520px;
          margin: 30px auto 48px; position: relative;
        }
        .hero-ctas {
          display: flex; gap: 12px; align-items: center;
          justify-content: center; flex-wrap: wrap; position: relative;
        }
        .cta-primary {
          padding: 14px 36px; background: #6366f1; color: #fff;
          font-size: 14px; font-weight: 700; border-radius: 10px;
          text-decoration: none; border: 1px solid rgba(255,255,255,0.15);
          transition: all 0.2s; box-shadow: 0 0 30px rgba(99,102,241,0.35);
          letter-spacing: 0.2px;
        }
        .cta-primary:hover {
          background: #4f46e5; transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(99,102,241,0.5);
        }
        .cta-secondary {
          padding: 14px 36px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 700;
          border-radius: 10px; text-decoration: none;
          transition: all 0.2s; letter-spacing: 0.2px;
        }
        .cta-secondary:hover {
          background: rgba(255,255,255,0.09); transform: translateY(-2px);
          border-color: rgba(255,255,255,0.2);
        }

        /* ──────────────────── CODE WINDOW ──────────────────── */
        .code-window-wrap {
          width: 100%; max-width: 860px; margin: 68px auto 0;
          padding: 0 24px; position: relative;
        }
        .code-window-wrap::before {
          content: ''; position: absolute; top: -30px; left: 50%;
          transform: translateX(-50%);
          width: 80%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent);
        }
        .code-window {
          background: #0d1117; border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
        }
        .code-titlebar {
          display: flex; align-items: center; gap: 7px; padding: 13px 18px;
          background: #161b22; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot-red { background: #ff5f57; } .dot-yellow { background: #febc2e; } .dot-green { background: #28c840; }
        .code-filename {
          margin-left: 10px; font-size: 11px; font-weight: 600;
          letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.25);
        }
        .code-body {
          padding: 28px 32px 32px;
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
          font-size: 13.5px; line-height: 1.82; color: #c9d1d9; background: #0d1117;
          overflow-x: auto;
        }
        .code-kw { color: #ff7b72; } .code-fn { color: #d2a8ff; }
        .code-str { color: #a5d6ff; } .code-comment { color: #8b949e; font-style: italic; }
        .code-var { color: #ffa657; } .code-prop { color: #79c0ff; }

        /* ──────────────────── STATS BAR ──────────────────── */
        .stats-bar {
          display: flex; align-items: stretch; justify-content: center;
          gap: 20px; margin: 72px auto 0; max-width: 760px;
          flex-wrap: wrap; padding: 0 24px;
        }
        .stat-item {
          flex: 1; min-width: 150px; padding: 32px 24px; text-align: center;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          transition: background 0.3s, border-color 0.3s, transform 0.3s;
        }
        .stat-item:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-2px);
        }
        .stat-number {
          font-size: 30px; font-weight: 800; color: #fff;
          letter-spacing: -1px; margin-bottom: 4px;
        }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.35); font-weight: 500; }

        /* ──────────────────── FEATURES ──────────────────── */
        .features-section { padding: 130px 48px 100px; text-align: center; }
        .section-tag {
          display: inline-block; font-size: 10.5px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: #818cf8; background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2); border-radius: 20px;
          padding: 5px 14px; margin-bottom: 22px;
        }
        .section-title {
          font-size: clamp(38px, 5.5vw, 62px); font-weight: 900;
          letter-spacing: -2px; color: #fff; margin-bottom: 20px; line-height: 1.05;
        }
        .section-subtitle {
          font-size: 16px; color: rgba(255,255,255,0.4); line-height: 1.7;
          max-width: 460px; margin: 0 auto 72px;
        }
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 24px; max-width: 1100px; margin: 0 auto;
        }
        .feature-card {
          background: #111520; padding: 52px 40px 48px;
          display: flex; flex-direction: column; gap: 0;
          transition: background 0.3s, border-color 0.3s, transform 0.3s;
          position: relative;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          overflow: hidden;
        }
        .feature-card::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(99,102,241,0.05) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s; pointer-events: none;
        }
        .feature-card:hover {
          background: #141929;
          border-color: rgba(99,102,241,0.3);
          transform: translateY(-3px);
        }
        .feature-card:hover::after { opacity: 1; }
        .feature-icon-wrap {
          width: 48px; height: 48px; margin-bottom: 56px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.15);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
        }
        .feature-icon { width: 22px; height: 22px; color: #818cf8; }
        .feature-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 12px; }
        .feature-desc { font-size: 13.5px; line-height: 1.7; color: rgba(255,255,255,0.38); }
        .feature-desc .hl { color: #818cf8; }

        /* ──────────────────── SHOWCASE ──────────────────── */
        .showcase-outer {
          padding: 40px 48px 120px; max-width: 1400px; margin: 0 auto;
        }
        .showcase-section {
          display: grid; grid-template-columns: 1fr 2fr; gap: 64px;
          align-items: center;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 72px 80px; position: relative; overflow: hidden;
        }
        .showcase-section::before {
          content: ''; position: absolute; right: -100px; top: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .showcase-eyebrow {
          font-size: 10.5px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: #818cf8; margin-bottom: 18px;
        }
        .showcase-title {
          font-size: clamp(32px, 4vw, 50px); font-weight: 900;
          letter-spacing: -1.8px; color: #fff; line-height: 1.08; margin-bottom: 24px;
        }
        .showcase-desc {
          font-size: 14.5px; line-height: 1.75; color: rgba(255,255,255,0.42);
          margin-bottom: 40px;
        }
        .showcase-desc .accent { color: rgba(255,255,255,0.75); font-weight: 500; }
        .showcase-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
        .showcase-list li {
          display: flex; align-items: center; gap: 12px;
          font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.75);
        }
        .list-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #6366f1; flex-shrink: 0;
          box-shadow: 0 0 8px rgba(99,102,241,0.6);
        }
        .showcase-slider {
          position: relative; width: 100%; aspect-ratio: 16/10;
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
          cursor: zoom-in;
        }
        .showcase-slider-track {
          display: flex; width: 100%; height: 100%;
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .showcase-slider-slide {
          min-width: 100%; height: 100%; position: relative;
        }
        .showcase-slider-slide img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        
        .slider-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(15, 17, 26, 0.6); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10; transition: all 0.2s ease;
        }
        .slider-arrow:hover {
          background: rgba(15, 17, 26, 0.9); color: #fff;
          border-color: rgba(255,255,255,0.2); transform: translateY(-50%) scale(1.05);
        }
        .slider-arrow.prev { left: 16px; }
        .slider-arrow.next { right: 16px; }
        
        .slider-dots {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 8px; z-index: 10;
          background: rgba(0,0,0,0.4); padding: 6px 10px; border-radius: 20px;
          backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.05);
        }
        .slider-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(255,255,255,0.3); transition: all 0.3s ease;
          cursor: pointer;
        }
        .slider-dot.active {
          background: #818cf8; transform: scale(1.3);
          box-shadow: 0 0 8px rgba(129,140,248,0.5);
        }

        /* ──────────────────── LIGHTBOX ──────────────────── */
        .lightbox-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(10px);
          z-index: 9999; display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
        }
        .lightbox-overlay.open {
          opacity: 1; pointer-events: all;
        }
        .lightbox-content {
          position: relative; width: 90vw; height: 90vh;
          display: flex; align-items: center; justify-content: center;
        }
        .lightbox-img {
          max-width: 100%; max-height: 100%; object-fit: contain;
          border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.8);
        }
        .lightbox-close {
          position: absolute; top: -40px; right: 0;
          background: none; border: none; color: white;
          cursor: pointer; opacity: 0.7; transition: opacity 0.2s;
        }
        .lightbox-close:hover { opacity: 1; }
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 40px rgba(99,102,241,0.1);
        }
        .showcase-img-wrap img { display: block; width: 100%; height: auto; }

        /* ──────────────────── FOOTER ──────────────────── */
        .footer {
          border-top: 1px solid rgba(255,255,255,0.055);
          padding: 80px 64px 0;
          background: #0a0c11;
        }
        .footer-grid {
          display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px; margin-bottom: 72px;
        }
        .footer-brand-name { font-size: 16px; font-weight: 800; color: #fff; margin-bottom: 14px; }
        .footer-brand-desc {
          font-size: 13px; line-height: 1.75; color: rgba(255,255,255,0.24); max-width: 190px;
        }
        .footer-col-label {
          font-size: 10px; font-weight: 700; letter-spacing: 2.2px;
          text-transform: uppercase; color: #6366f1; margin-bottom: 20px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 13px; }
        .footer-links a {
          font-size: 13px; color: rgba(255,255,255,0.38); text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: rgba(255,255,255,0.8); }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.055);
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 0;
        }
        .footer-copy {
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255,255,255,0.18);
        }
        .github-icon { color: rgba(255,255,255,0.28); transition: color 0.2s; cursor: pointer; }
        .github-icon:hover { color: rgba(255,255,255,0.75); }

        /* ──────────────────── RESPONSIVE ──────────────────── */
        @media (max-width: 1024px) {
          .lp-nav { padding: 0 32px; }
          .features-section { padding: 100px 32px 80px; }
          .showcase-outer { padding: 40px 32px 100px; }
          .showcase-section { grid-template-columns: 1fr; gap: 48px; padding: 52px 48px; }
          .footer { padding: 64px 32px 0; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
        }

        @media (max-width: 768px) {
          .lp-nav { padding: 0 20px; }
          .lp-nav-links { display: none; }
          .nav-hamburger { display: flex; align-items: center; }
          .btn-signin { display: none; }

          .hero { padding: 80px 20px 60px; }
          .hero::before { width: 400px; height: 400px; }
          .hero-subtitle { font-size: 15.5px; }
          .cta-primary, .cta-secondary { padding: 13px 28px; font-size: 13.5px; }

          .code-window-wrap { padding: 0 16px; }
          .code-body { padding: 20px 20px 24px; font-size: 12px; }

          .stats-bar { margin: 48px 16px 0; gap: 12px; padding: 0 16px; }
          .stat-item { min-width: 120px; padding: 22px 16px; }
          .stat-number { font-size: 24px; }

          .features-section { padding: 80px 20px 64px; }
          .features-grid { grid-template-columns: 1fr; gap: 16px; }
          .feature-card { padding: 40px 28px; }
          .feature-icon-wrap { margin-bottom: 32px; }

          .showcase-outer { padding: 32px 20px 80px; }
          .showcase-section { padding: 40px 28px; gap: 40px; }

          .footer { padding: 52px 20px 0; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer-bottom { flex-direction: column; gap: 12px; align-items: center; }
        }

        @media (max-width: 500px) {
          .hero-title { letter-spacing: -2px; }
          .showcase-section { border-radius: 16px; }
          .footer-grid { grid-template-columns: 1fr; }
          .stats-bar { flex-direction: column; gap: 12px; }
          .stat-item { width: 100%; }
        }
      `}</style>

      {/* ────── NAVBAR ────── */}
      <NavbarLanding />

      {/* ────── HERO ────── */}
      <section className="hero">
        <p className="hero-eyebrow">The Digital Obsidian</p>
        <h1 className="hero-title">
          Sync Your Code with{" "}
          <span className="hero-title-accent">Precision.</span>
        </h1>
        <p className="hero-subtitle">
          A monolithic ecosystem for deep work. Engineering high-performance
          workflows with atmospheric clarity and pixel-perfect execution.
        </p>
        <div className="hero-ctas">
          <Link href="/auth/signup" className="cta-primary">Get Started</Link>
          <a href="#docs" className="cta-secondary">Explore Docs</a>
        </div>

        {/* Code Window */}
        <div className="code-window-wrap">
          <div className="code-window">
            <div className="code-titlebar">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
              <span className="code-filename">sync_engine.ts</span>
            </div>
            <div className="code-body">
              <div>
                <span className="code-kw">import</span>
                {" { "}<span className="code-fn">Sync</span>{" } "}
                <span className="code-kw">from</span>
                {" "}<span className="code-str">&quot;@codesync/core&quot;</span>;
              </div>
              <br />
              <div><span className="code-comment">/* Initialize deep synchronization engine */</span></div>
              <div>
                <span className="code-kw">const</span> <span className="code-var">obsidian</span> = <span className="code-kw">new</span> <span className="code-fn">Sync</span>{"({"}
              </div>
              <div style={{ paddingLeft: 24 }}>
                <span className="code-prop">strategy</span>: <span className="code-str">&quot;precision&quot;</span>,
              </div>
              <div style={{ paddingLeft: 24 }}>
                <span className="code-prop">latency</span>: <span className="code-str">&quot;minimal&quot;</span>,
              </div>
              <div style={{ paddingLeft: 24 }}>
                <span className="code-prop">theme</span>: <span className="code-str">&quot;obsidian&quot;</span>
              </div>
              <div>{"});"}</div>
              <br />
              <div>
                <span className="code-kw">await</span> <span className="code-var">obsidian</span>.<span className="code-fn">connect</span>();
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────── STATS BAR ────── */}
      <div className="stats-bar">
        {[
          { num: "50K+", label: "Developers" },
          { num: "99.9%", label: "Uptime SLA" },
          { num: "<5ms", label: "Sync Latency" },
        ].map((s) => (
          <div className="stat-item" key={s.label}>
            <div className="stat-number">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ────── FEATURES ────── */}
      <section className="features-section" id="features">
        <span className="section-tag">Core Features</span>
        <h2 className="section-title">Engineered for Flow.</h2>
        <p className="section-subtitle">
          Rejecting noise in favor of atmospheric depth and high-end functional clarity.
        </p>
        <div className="features-grid">
          {/* Collaboration */}
          <div className="feature-card">
            <div className="feature-icon-wrap">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="feature-title">Collaboration</h3>
            <p className="feature-desc">
              Real-time multiplayer editing with zero latency overhead.{" "}
              <span className="hl">Built for global distributed teams.</span>
            </p>
          </div>
          {/* Version Control */}
          <div className="feature-card">
            <div className="feature-icon-wrap">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="feature-title">Version Control</h3>
            <p className="feature-desc">
              Precise snapshotting and <span className="hl">branch management</span>{" "}
              integrated directly into your workflow.
            </p>
          </div>
          {/* Simplicity */}
          <div className="feature-card">
            <div className="feature-icon-wrap">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <h3 className="feature-title">Simplicity</h3>
            <p className="feature-desc">
              A minimal interface that disappears when you&apos;re in the zone.{" "}
              Deep work by design.
            </p>
          </div>
        </div>
      </section>

      {/* ────── DASHBOARD SHOWCASE ────── */}
      <div className="showcase-outer">
        <div className="showcase-section">
          <div>
            <p className="showcase-eyebrow">Product Showcase</p>
            <h2 className="showcase-title">
              Your Dashboard.<br />Redefined.
            </h2>
            <p className="showcase-desc">
              A <span className="accent">seamless transition</span> from code to
              orchestration. Our dashboard leverages{" "}
              <span className="accent">tonal layering</span> to ensure your data is
              always at the forefront without visual distraction.
            </p>
            <ul className="showcase-list">
              <li><span className="list-dot" /> Integrated Monitoring</li>
              <li><span className="list-dot" /> Resource Optimization</li>
              <li><span className="list-dot" /> AI-Assisted Diagnostics</li>
            </ul>
          </div>
          <div className="showcase-slider" onClick={() => setLightboxOpen(true)}>
            <button className="slider-arrow prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }} aria-label="Previous image">
              <ChevronLeft size={24} strokeWidth={1.5} />
            </button>
            <button className="slider-arrow next" onClick={(e) => { e.stopPropagation(); nextSlide(); }} aria-label="Next image">
              <ChevronRight size={24} strokeWidth={1.5} />
            </button>
            
            <div 
              className="showcase-slider-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((src, index) => (
                <div key={index} className="showcase-slider-slide">
                  <Image
                    src={src}
                    alt={`CodeSync Platform View ${index + 1}`}
                    width={1100}
                    height={687}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            <div className="slider-dots" onClick={(e) => e.stopPropagation()}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`slider-dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ────── LIGHTBOX ────── */}
      <div className={`lightbox-overlay ${lightboxOpen ? 'open' : ''}`} onClick={() => setLightboxOpen(false)}>
        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
            <X size={32} strokeWidth={1.5} />
          </button>
          {lightboxOpen && (
            <img 
              src={slides[currentSlide]} 
              alt="Dashboard zoomed" 
              className="lightbox-img" 
            />
          )}
        </div>
      </div>

      {/* ────── FOOTER ────── */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand-name">CodeSync</p>
            <p className="footer-brand-desc">
              Engineered for deep work.<br />
              The Obsidian standard for<br />
              modern engineering.
            </p>
          </div>
          <div>
            <p className="footer-col-label">Product</p>
            <ul className="footer-links">
              <li><a href="#">Changelog</a></li>
              <li><a href="#">Security</a></li>
              <li><a href="#">Beta Access</a></li>
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
          <p className="footer-copy">© 2024 CodeSync. Engineered for deep work.</p>
          <svg className="github-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </div>
      </footer>
    </div>
  );
}

/* ────── LANDING NAV COMPONENT ────── */
function NavbarLanding() {
  return (
    <nav className="lp-nav">
      <Link href="/" className="lp-logo">
        <Image src="/codeSyncLogo.svg" alt="CodeSync" width={28} height={28} className="lp-logo-icon" />
        CodeSync
      </Link>
      <div className="lp-nav-links">
        <a href="#features" className="active">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#docs">Docs</a>
      </div>
      <div className="lp-nav-actions">
        <Link href="/auth/login" className="btn-signin">Sign In</Link>
        <Link href="/auth/signup" className="btn-signup">Sign Up</Link>
      </div>
    </nav>
  );
}
