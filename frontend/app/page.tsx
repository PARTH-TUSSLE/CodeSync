"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Home, User, BookOpen, Star, DollarSign, LogIn, ArrowRight, Menu } from "lucide-react";

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const slides = ["/dashboard.png", "/dashboard2.png", "/dashboard3.png"];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="lp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          background-color: #0c1222;
          color: #fafafa;
          font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ──────────────────── GRID BACKGROUND ──────────────────── */
        .grid-bg {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image:
            linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
          z-index: 0;
        }

        /* Top glow – rich cyan/indigo blend */
        .glow-top {
          position: fixed;
          top: -350px; left: 50%;
          transform: translateX(-50%);
          width: 1400px; height: 900px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(56,189,248,0.10) 0%, rgba(99,102,241,0.08) 30%, rgba(139,92,246,0.04) 60%, transparent 80%);
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }

        .lp-content {
          position: relative;
          z-index: 1;
        }

        /* Navbar is rendered with Tailwind (matching dashboard Navbar) */

        /* ──────────────────── HERO ──────────────────── */
        .hero {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 120px 24px 80px;
          position: relative;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.6);
          background: rgba(15,23,42,0.6);
          border: 1px solid rgba(148,163,184,0.18);
          border-radius: 100px;
          padding: 5px 14px 5px 8px;
          margin-bottom: 28px;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px rgba(34,197,94,0.4);
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .hero-title {
          font-size: clamp(44px, 6.5vw, 72px); font-weight: 750;
          line-height: 1.05; letter-spacing: -2.5px; color: #fafafa;
          max-width: 720px; margin-bottom: 0;
        }
        .hero-title-accent {
          background: linear-gradient(135deg, #818cf8 0%, #a78bfa 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 16px; font-weight: 400; line-height: 1.65;
          color: rgba(255,255,255,0.5); max-width: 460px;
          margin: 28px auto 48px;
          letter-spacing: -0.1px;
        }
        .hero-ctas {
          display: flex; gap: 10px; align-items: center;
          justify-content: center; flex-wrap: wrap;
        }
        .cta-primary {
          padding: 10px 24px; background: #fff; color: #09090b;
          font-size: 13px; font-weight: 600; border-radius: 8px;
          text-decoration: none; border: none;
          transition: all 0.15s;
        }
        .cta-primary:hover {
          background: rgba(255,255,255,0.9); transform: translateY(-1px);
        }
        .cta-secondary {
          padding: 10px 24px;
          background: transparent;
          border: 1px solid rgba(148,163,184,0.18);
          color: rgba(255,255,255,0.65); font-size: 13px; font-weight: 500;
          border-radius: 8px; text-decoration: none;
          transition: all 0.15s;
        }
        .cta-secondary:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.2); color: #fff;
        }

        /* ──────────────────── CODE WINDOW ──────────────────── */
        .code-window-wrap {
          width: 100%; max-width: 720px; margin: 64px auto 0;
          padding: 0 24px; position: relative;
        }
        .code-window {
          background: rgba(15,23,42,0.6);
          border: 1px solid rgba(148,163,184,0.15);
          border-radius: 12px; overflow: hidden;
        }
        .code-titlebar {
          display: flex; align-items: center; gap: 6px; padding: 12px 16px;
          background: rgba(15,23,42,0.4);
          border-bottom: 1px solid rgba(148,163,184,0.12);
        }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot-red { background: #ff5f57; } .dot-yellow { background: #febc2e; } .dot-green { background: #28c840; }
        .code-filename {
          margin-left: 10px; font-size: 11.5px; font-weight: 500;
          color: rgba(255,255,255,0.3);
          font-family: 'JetBrains Mono', monospace;
        }
        .code-body {
          padding: 24px 28px 28px;
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
          font-size: 13px; line-height: 1.85; color: rgba(255,255,255,0.6);
          overflow-x: auto;
        }
        .code-kw { color: #ff7b72; } .code-fn { color: #d2a8ff; }
        .code-str { color: #a5d6ff; } .code-comment { color: rgba(255,255,255,0.2); font-style: italic; }
        .code-var { color: #ffa657; } .code-prop { color: #79c0ff; }

        /* ──────────────────── STATS BAR ──────────────────── */
        .stats-bar {
          display: grid; grid-template-columns: repeat(3, 1fr);
          margin: 88px auto 0; max-width: 720px;
          padding: 0 24px;
          border: 1px solid rgba(148,163,184,0.15);
          border-radius: 12px;
          overflow: hidden;
          background: rgba(15,23,42,0.4);
        }
        .stat-item {
          padding: 32px 24px; text-align: center;
          position: relative;
        }
        .stat-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0; top: 20%; height: 60%;
          width: 1px;
          background: rgba(255,255,255,0.10);
        }
        .stat-number {
          font-size: 28px; font-weight: 800; color: #fff;
          letter-spacing: -1px; margin-bottom: 4px;
          font-variant-numeric: tabular-nums;
        }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.45); font-weight: 450; letter-spacing: 0.2px; }

        /* ──────────────────── SECTION COMMON ──────────────────── */
        .section-pad { padding: 112px 48px 88px; }
        .section-tag {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 16px;
        }
        .section-tag-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #6366f1;
        }
        .section-title {
          font-size: clamp(32px, 4vw, 48px); font-weight: 750;
          letter-spacing: -1.5px; color: #fafafa; margin-bottom: 14px; line-height: 1.1;
        }
        .section-subtitle {
          font-size: 15px; color: rgba(255,255,255,0.5); line-height: 1.6;
          max-width: 440px; margin: 0 auto 56px;
          letter-spacing: -0.1px;
        }

        /* ──────────────────── FEATURES ──────────────────── */
        .features-section { text-align: center; }
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          max-width: 1000px; margin: 0 auto;
          border: 1px solid rgba(148,163,184,0.15);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(15,23,42,0.3);
        }
        .feature-card {
          padding: 40px 32px;
          display: flex; flex-direction: column; gap: 0;
          transition: all 0.3s ease;
          position: relative;
          border-right: 1px solid rgba(148,163,184,0.12);
          border-bottom: 1px solid rgba(148,163,184,0.12);
        }
        .feature-card:nth-child(3n) { border-right: none; }
        .feature-card:nth-child(n+4) { border-bottom: none; }
        .feature-card:hover {
          background: rgba(255, 165, 0, 0.03);
          border-color: rgba(255, 165, 0, 0.2);
        }
        .feature-card:hover::after {
          content: '';
          position: absolute;
          bottom: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 165, 0, 0.5), transparent);
        }
        .feature-icon-wrap {
          width: 40px; height: 40px; margin-bottom: 24px;
          background: rgba(148,163,184,0.08);
          border: 1px solid rgba(148,163,184,0.15);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
        }
        .feature-icon { width: 18px; height: 18px; color: rgba(255,255,255,0.5); }
        .feature-title { font-size: 14px; font-weight: 650; color: #fafafa; margin-bottom: 8px; text-align: left; letter-spacing: -0.2px; }
        .feature-desc { font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.45); text-align: left; }
        .feature-desc .hl { color: rgba(255,255,255,0.55); font-weight: 500; }

        /* ──────────────────── HOW IT WORKS ──────────────────── */
        .how-section { text-align: center; }
        .how-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0; max-width: 860px; margin: 0 auto;
          border: 1px solid rgba(148,163,184,0.15);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(15,23,42,0.3);
        }
        .how-step {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 48px 32px; position: relative;
          border-right: 1px solid rgba(148,163,184,0.12);
        }
        .how-step:last-child { border-right: none; }
        .how-number {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(148,163,184,0.08);
          border: 1px solid rgba(148,163,184,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.6);
          margin-bottom: 20px;
          font-variant-numeric: tabular-nums;
        }
        .how-step-title {
          font-size: 15px; font-weight: 650; color: #fafafa;
          margin-bottom: 8px; letter-spacing: -0.2px;
        }
        .how-step-desc {
          font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.45);
          max-width: 220px;
        }

        /* ──────────────────── SHOWCASE ──────────────────── */
        .showcase-outer {
          padding: 32px 48px 100px; max-width: 1200px; margin: 0 auto;
        }
        .showcase-section {
          display: grid; grid-template-columns: 1fr 1.6fr; gap: 48px;
          align-items: center;
          border: 1px solid rgba(148,163,184,0.15);
          border-radius: 16px; padding: 56px 56px; position: relative; overflow: hidden;
          background: rgba(15,23,42,0.3);
        }
        .showcase-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 0.8px;
          color: rgba(255,255,255,0.4); margin-bottom: 12px;
          text-transform: uppercase;
        }
        .showcase-title {
          font-size: clamp(28px, 3vw, 40px); font-weight: 750;
          letter-spacing: -1.2px; color: #fafafa; line-height: 1.1; margin-bottom: 16px;
        }
        .showcase-desc {
          font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.5);
          margin-bottom: 28px;
        }
        .showcase-desc .accent { color: rgba(255,255,255,0.6); font-weight: 500; }
        .showcase-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .showcase-list li {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.55);
        }
        .list-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: rgba(255,255,255,0.3); flex-shrink: 0;
        }
        .showcase-slider {
          position: relative; width: 100%; aspect-ratio: 16/10;
          border-radius: 10px; overflow: hidden;
          border: 1px solid rgba(148,163,184,0.15);
          cursor: zoom-in;
        }
        .showcase-slider-track {
          display: flex; width: 100%; height: 100%;
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .showcase-slider-slide {
          min-width: 100%; height: 100%; position: relative;
        }
        .showcase-slider-slide img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .slider-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 32px; height: 32px; border-radius: 6px;
          background: rgba(9, 9, 11, 0.8); backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10; transition: all 0.15s;
        }
        .slider-arrow:hover {
          background: rgba(9, 9, 11, 0.95); color: #fff;
          border-color: rgba(255,255,255,0.2);
        }
        .slider-arrow.prev { left: 10px; }
        .slider-arrow.next { right: 10px; }
        .slider-dots {
          position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 4px; z-index: 10;
          background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 100px;
          backdrop-filter: blur(4px);
        }
        .slider-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.2); transition: all 0.2s;
          cursor: pointer;
        }
        .slider-dot.active {
          background: #fff; transform: scale(1.2);
        }

        /* ──────────────────── TESTIMONIALS ──────────────────── */
        .testimonials-section { text-align: center; }
        .testimonials-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          max-width: 1000px; margin: 0 auto;
          border: 1px solid rgba(148,163,184,0.15);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(15,23,42,0.3);
        }
        .testimonial-card {
          padding: 36px 28px;
          text-align: left;
          transition: all 0.3s ease;
          border-right: 1px solid rgba(148,163,184,0.12);
        }
        .testimonial-card:last-child { border-right: none; }
        .testimonial-card:hover {
          background: rgba(56,189,248,0.04);
        }
        .testimonial-quote {
          font-size: 13px; line-height: 1.65; color: rgba(255,255,255,0.5);
          margin-bottom: 24px;
        }
        .testimonial-author {
          display: flex; align-items: center; gap: 10px;
        }
        .testimonial-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.5);
        }
        .testimonial-name {
          font-size: 12.5px; font-weight: 600; color: #fafafa;
        }
        .testimonial-role {
          font-size: 11.5px; color: rgba(255,255,255,0.25); margin-top: 1px;
        }

        /* ──────────────────── CTA BANNER ──────────────────── */
        .cta-banner {
          text-align: center; padding: 96px 24px;
          position: relative;
        }
        .cta-banner-inner {
          max-width: 640px; margin: 0 auto;
          border: 1px solid rgba(148,163,184,0.15);
          border-radius: 16px;
          padding: 64px 48px;
          position: relative;
          overflow: hidden;
          background: rgba(15,23,42,0.4);
        }
        .cta-banner-title {
          font-size: clamp(28px, 3.5vw, 40px); font-weight: 750;
          letter-spacing: -1.2px; color: #fafafa;
          margin-bottom: 12px; line-height: 1.1;
          position: relative;
        }
        .cta-banner-desc {
          font-size: 14px; color: rgba(255,255,255,0.5);
          margin-bottom: 32px; line-height: 1.6;
          position: relative;
        }
        .cta-banner-actions {
          display: flex; gap: 10px; justify-content: center;
          flex-wrap: wrap; position: relative;
        }

        /* ──────────────────── LIGHTBOX ──────────────────── */
        .lightbox-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(8px);
          z-index: 9999; display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none; transition: opacity 0.25s;
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
          border-radius: 8px;
        }
        .lightbox-close {
          position: absolute; top: -36px; right: 0;
          background: none; border: none; color: white;
          cursor: pointer; opacity: 0.4; transition: opacity 0.15s;
        }
        .lightbox-close:hover { opacity: 1; }

        /* ──────────────────── FOOTER ──────────────────── */
        .footer {
          position: relative;
          margin-top: 40px;
          padding: 64px 48px 0;
          background: rgba(12, 18, 34, 0.9);
          border-top: 1px solid rgba(148,163,184,0.18);
        }
        .footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 5%, rgba(99,102,241,0.5) 30%, rgba(251,146,60,0.4) 70%, transparent 95%);
        }
        .footer::after {
          content: '';
          position: absolute;
          top: -60px; left: 10%; right: 10%;
          height: 120px;
          background: radial-gradient(ellipse at center, rgba(99,102,241,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .footer-grid {
          display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 40px; margin-bottom: 56px;
          position: relative;
        }
        .footer-brand-name {
          font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 10px;
          letter-spacing: -0.2px;
        }
        .footer-brand-desc {
          font-size: 12.5px; line-height: 1.6; color: rgba(255,255,255,0.45); max-width: 200px;
        }
        .footer-col-label {
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.55); margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-links a {
          font-size: 12.5px; color: rgba(255,255,255,0.45); text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: rgba(255,255,255,0.75); }
        .footer-bottom {
          border-top: 1px solid rgba(148,163,184,0.12);
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 0;
          position: relative;
        }
        .footer-copy {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
        }
        .github-icon { color: rgba(255,255,255,0.3); transition: color 0.2s; cursor: pointer; }
        .github-icon:hover { color: rgba(255,255,255,0.7); }

        /* ──────────────────── ANIMATIONS ──────────────────── */
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-1 { animation-delay: 0.08s; opacity: 0; }
        .delay-2 { animation-delay: 0.16s; opacity: 0; }
        .delay-3 { animation-delay: 0.24s; opacity: 0; }
        .delay-4 { animation-delay: 0.32s; opacity: 0; }

        /* ──────────────────── RESPONSIVE ──────────────────── */
        @media (max-width: 1024px) {
          .section-pad { padding: 88px 28px 72px; }
          .showcase-outer { padding: 24px 28px 80px; }
          .showcase-section { grid-template-columns: 1fr; gap: 40px; padding: 40px 36px; }
          .footer { padding: 48px 28px 0; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
        }

        @media (max-width: 768px) {

          /* Hero - tighter, bolder on mobile */
          .hero { padding: 72px 20px 48px; }
          .hero-badge { font-size: 11px; padding: 4px 12px 4px 7px; margin-bottom: 24px; }
          .hero-title { font-size: 36px; letter-spacing: -1.5px; max-width: 100%; }
          .hero-subtitle { font-size: 14px; max-width: 320px; margin: 20px auto 36px; }
          .hero-ctas { gap: 10px; }
          .cta-primary, .cta-secondary { padding: 10px 20px; font-size: 13px; }

          /* Code window */
          .code-window-wrap { padding: 0 16px; max-width: 100%; margin-top: 40px; }
          .code-body { padding: 16px 20px 20px; font-size: 11.5px; line-height: 1.7; }
          .code-titlebar { padding: 10px 14px; }
          .dot { width: 8px; height: 8px; }
          .code-filename { font-size: 10.5px; }

          /* Stats - compact 3-column on mobile */
          .stats-bar {
            margin: 44px 16px 0;
            grid-template-columns: repeat(3, 1fr);
            max-width: 100%;
            border-radius: 10px;
          }
          .stat-item { padding: 24px 10px; }
          .stat-number { font-size: 20px; }
          .stat-label { font-size: 10px; }

          /* Section general */
          .section-pad { padding: 72px 20px 52px; }
          .section-title { font-size: 28px; letter-spacing: -1px; }
          .section-subtitle { font-size: 13px; margin-bottom: 40px; }
          .section-tag { font-size: 10px; margin-bottom: 14px; }

          /* Features - 2-column grid on tablet, better than 1-col */
          .features-grid {
            grid-template-columns: 1fr 1fr;
            border-radius: 12px;
          }
          .feature-card { padding: 32px 22px; }
          .feature-card:nth-child(2n) { border-right: none; }
          .feature-icon-wrap { width: 34px; height: 34px; margin-bottom: 16px; border-radius: 8px; }
          .feature-icon { width: 15px; height: 15px; }
          .feature-title { font-size: 13px; }
          .feature-desc { font-size: 12px; }

          /* How it works */
          .how-grid { grid-template-columns: 1fr; border-radius: 12px; }
          .how-step {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 32px 24px;
            flex-direction: row;
            text-align: left;
            gap: 16px;
          }
          .how-step:last-child { border-bottom: none; }
          .how-number { margin-bottom: 0; flex-shrink: 0; }
          .how-step-title { font-size: 14px; margin-bottom: 4px; }
          .how-step-desc { font-size: 12px; max-width: 100%; }

          /* Testimonials */
          .testimonials-grid { grid-template-columns: 1fr; border-radius: 12px; }
          .testimonial-card {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 28px 24px;
          }
          .testimonial-card:last-child { border-bottom: none; }
          .testimonial-quote { font-size: 12.5px; margin-bottom: 16px; }

          /* Showcase */
          .showcase-outer { padding: 16px 20px 56px; }
          .showcase-section { padding: 28px 20px; gap: 28px; border-radius: 12px; }
          .showcase-eyebrow { font-size: 10px; }
          .showcase-title { font-size: 24px; letter-spacing: -0.8px; }
          .showcase-desc { font-size: 13px; margin-bottom: 20px; }
          .showcase-list li { font-size: 12px; }

          /* CTA */
          .cta-banner { padding: 56px 20px; }
          .cta-banner-inner { padding: 48px 28px; border-radius: 12px; }
          .cta-banner-title { font-size: 24px; letter-spacing: -0.8px; }
          .cta-banner-desc { font-size: 13px; margin-bottom: 28px; }

          /* Footer */
          .footer { padding: 36px 20px 0; margin-top: 20px; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 36px; }
          .footer-brand-name { font-size: 14px; }
          .footer-brand-desc { font-size: 12px; }
          .footer-col-label { font-size: 10px; margin-bottom: 12px; }
          .footer-links a { font-size: 12px; }
          .footer-bottom {
            flex-direction: column; gap: 10px;
            align-items: center; padding: 16px 0;
          }
        }

        @media (max-width: 480px) {
          .lp-nav { padding: 0 14px; height: 48px; }
          .lp-logo { font-size: 14px; gap: 7px; }
          .lp-logo-icon { width: 20px; height: 20px; }

          .hero { padding: 56px 16px 40px; }
          .hero-title { font-size: 30px; letter-spacing: -1.2px; }
          .hero-subtitle { font-size: 13px; max-width: 280px; margin: 16px auto 28px; }

          .code-window-wrap { padding: 0 12px; margin-top: 36px; }
          .code-body { padding: 16px 18px 18px; font-size: 10.5px; }

          .stats-bar { margin: 36px 12px 0; }
          .stat-item { padding: 20px 8px; }
          .stat-number { font-size: 18px; }
          .stat-label { font-size: 9px; }

          .section-pad { padding: 56px 16px 40px; }
          .section-title { font-size: 24px; }

          /* Features single column on very small screens */
          .features-grid { grid-template-columns: 1fr; }
          .feature-card { border-right: none !important; }
          .feature-card:last-child { border-bottom: none; }

          .showcase-outer { padding: 16px 16px 48px; }
          .showcase-section { padding: 28px 18px; }

          .cta-banner { padding: 40px 16px; }
          .cta-banner-inner { padding: 36px 22px; }

          .footer { padding: 32px 16px 0; }
          .footer-grid { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>

      {/* ────── BACKGROUND ────── */}
      <div className="grid-bg" />
      <div className="glow-top" />
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.15) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '-200px', left: '50%', transform: 'translateX(-50%)',
        width: '1200px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,146,60,0.06) 0%, rgba(99,102,241,0.03) 50%, transparent 80%)',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
      }} />

      <div className="lp-content">
        {/* ────── NAVBAR ────── */}
        <NavbarLanding />


        {/* ────── HERO ────── */}
        <section className="hero">
          <div className="hero-badge animate-in delay-1">
            <span className="hero-badge-dot" />
            Now in Public Beta
          </div>
          <h1 className="hero-title animate-in delay-2">
            Version control,<br />
            <span className="hero-title-accent">reimagined.</span>
          </h1>
          <p className="hero-subtitle animate-in delay-3">
            Real-time collaboration, instant sync, and powerful
            branching — built for teams that ship fast.
          </p>
          <div className="hero-ctas animate-in delay-4">
            <Link href="/auth/signup" className="cta-primary">Get Started Free</Link>
            <a href="#features" className="cta-secondary">Explore Features</a>
          </div>

          {/* Code Window */}
          <div className="code-window-wrap animate-in delay-4">
            <div className="code-window">
              <div className="code-titlebar">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="code-filename">sync.config.ts</span>
              </div>
              <div className="code-body">
                <div>
                  <span className="code-kw">import</span>
                  {" { "}<span className="code-fn">CodeSync</span>{" } "}
                  <span className="code-kw">from</span>
                  {" "}<span className="code-str">&quot;@codesync/sdk&quot;</span>;
                </div>
                <br />
                <div><span className="code-comment">// Initialize your workspace</span></div>
                <div>
                  <span className="code-kw">const</span> <span className="code-var">workspace</span> = <span className="code-kw">new</span> <span className="code-fn">CodeSync</span>{"({"}
                </div>
                <div style={{ paddingLeft: 24 }}>
                  <span className="code-prop">team</span>: <span className="code-str">&quot;engineering&quot;</span>,
                </div>
                <div style={{ paddingLeft: 24 }}>
                  <span className="code-prop">sync</span>: <span className="code-str">&quot;realtime&quot;</span>,
                </div>
                <div style={{ paddingLeft: 24 }}>
                  <span className="code-prop">branches</span>: <span className="code-str">&quot;auto&quot;</span>
                </div>
                <div>{"});"}</div>
                <br />
                <div>
                  <span className="code-kw">await</span> <span className="code-var">workspace</span>.<span className="code-fn">connect</span>();
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────── STATS BAR ────── */}
        <div className="stats-bar">
          {[
            { num: "50K+", label: "Developers" },
            { num: "99.9%", label: "Uptime" },
            { num: "<5ms", label: "Sync Latency" },
          ].map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-number">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ────── FEATURES ────── */}
        <section className="features-section section-pad" id="features">
          <span className="section-tag"><span className="section-tag-dot" /> Features</span>
          <h2 className="section-title">Built for developers.</h2>
          <p className="section-subtitle">
            Everything you need to manage code, collaborate with your team, and ship with confidence.
          </p>
          <div className="features-grid">
            {[
              {
                icon: (
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "Real-time Collaboration",
                desc: <>Edit together with zero latency. <span className="hl">Built for distributed teams</span> working across time zones.</>,
              },
              {
                icon: (
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: "Version History",
                desc: <>Complete snapshots with <span className="hl">branch management</span> built directly into your workflow.</>,
              },
              {
                icon: (
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
                title: "Minimal Interface",
                desc: <>A clean UI that stays out of your way. Focus on your code, not your tools.</>,
              },
              {
                icon: (
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                title: "Enterprise Security",
                desc: <>End-to-end encryption with <span className="hl">SOC 2 compliance</span>. Your code stays secure.</>,
              },
              {
                icon: (
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                ),
                title: "API First",
                desc: <>Full REST & GraphQL APIs. <span className="hl">Webhooks and integrations</span> for every workflow.</>,
              },
              {
                icon: (
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
                title: "Low Latency Sync",
                desc: <>Sub-5ms sync powered by edge computing. Fast everywhere, for every team member.</>,
              },
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ────── HOW IT WORKS ────── */}
        <section className="how-section section-pad" id="how-it-works">
          <span className="section-tag"><span className="section-tag-dot" /> How It Works</span>
          <h2 className="section-title">Three steps to start.</h2>
          <p className="section-subtitle">
            Get your team up and running in minutes.
          </p>
          <div className="how-grid">
            {[
              { num: "1", title: "Connect", desc: "Link your repositories and invite your team in one step." },
              { num: "2", title: "Code", desc: "Write, branch, and review with built-in real-time sync." },
              { num: "3", title: "Deploy", desc: "Ship to production with zero-downtime deployments." },
            ].map((step, i) => (
              <div className="how-step" key={i}>
                <div className="how-number">{step.num}</div>
                <h3 className="how-step-title">{step.title}</h3>
                <p className="how-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ────── DASHBOARD SHOWCASE ────── */}
        <div className="showcase-outer">
          <div className="showcase-section">
            <div>
              <p className="showcase-eyebrow">Product</p>
              <h2 className="showcase-title">
                Your dashboard,<br />redesigned.
              </h2>
              <p className="showcase-desc">
                A <span className="accent">unified view</span> of your
                repositories, team activity, and deployment status — all in one place.
              </p>
              <ul className="showcase-list">
                <li><span className="list-dot" /> Integrated monitoring</li>
                <li><span className="list-dot" /> Resource analytics</li>
                <li><span className="list-dot" /> Team activity feed</li>
              </ul>
            </div>
            <div className="showcase-slider" onClick={() => setLightboxOpen(true)}>
              <button className="slider-arrow prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }} aria-label="Previous image">
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button className="slider-arrow next" onClick={(e) => { e.stopPropagation(); nextSlide(); }} aria-label="Next image">
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
              <div
                className="showcase-slider-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((src, index) => (
                  <div key={index} className="showcase-slider-slide">
                    <Image
                      src={src}
                      alt={`CodeSync Dashboard ${index + 1}`}
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

        {/* ────── TESTIMONIALS ────── */}
        <section className="testimonials-section section-pad" id="testimonials">
          <span className="section-tag"><span className="section-tag-dot" /> Testimonials</span>
          <h2 className="section-title">Trusted by teams.</h2>
          <p className="section-subtitle">
            Engineers who made the switch.
          </p>
          <div className="testimonials-grid">
            {[
              { quote: "CodeSync completely transformed how we collaborate. The real-time sync is faster than anything we've tried.", name: "Sarah Chen", role: "Staff Engineer, Vercel", initial: "S" },
              { quote: "We cut our merge conflicts by 80% in the first month. The branch management is best in class.", name: "Alex Rivera", role: "CTO, Stackblitz", initial: "A" },
              { quote: "A tool that actually stays out of your way. Clean interface, fast sync, exactly what we needed.", name: "Priya Sharma", role: "Lead Dev, Linear", initial: "P" },
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initial}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ────── CTA BANNER ────── */}
        <section className="cta-banner">
          <div className="cta-banner-inner">
            <h2 className="cta-banner-title">
              Ready to get started?
            </h2>
            <p className="cta-banner-desc">
              Join 50,000+ developers shipping faster with CodeSync.
              Free to start — no credit card required.
            </p>
            <div className="cta-banner-actions">
              <Link href="/auth/signup" className="cta-primary">Get Started Free</Link>
              <Link href="/pricing" className="cta-secondary">View Pricing</Link>
            </div>
          </div>
        </section>

        {/* ────── LIGHTBOX ────── */}
        <div className={`lightbox-overlay ${lightboxOpen ? 'open' : ''}`} onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>
              <X size={24} strokeWidth={1.5} />
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
                Modern version control<br />
                for engineering teams.
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
            <p className="footer-copy">&copy; 2026 CodeSync. All rights reserved.</p>
            <svg className="github-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ────── LANDING NAV COMPONENT ────── */
function NavbarLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features', icon: Star },
    { href: '/pricing', label: 'Pricing', icon: DollarSign },
    { href: '#docs', label: 'Docs', icon: BookOpen },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 500px; }
        }
        .dropdown-enter { animation: fadeInDown 0.18s cubic-bezier(0.16,1,0.3,1) forwards; }
        .mobile-enter   { animation: slideDown  0.22s cubic-bezier(0.16,1,0.3,1) forwards; }

        .nav-link-hover::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 60%;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
          border-radius: 9999px;
        }
        .nav-link-hover:hover::after { transform: translateX(-50%) scaleX(1); }

        .lp-logo-text {
          background: linear-gradient(135deg, #ffffff 0%, #d4d4d4 40%, #737373 70%, #ffffff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: logoShimmer 4s ease-in-out infinite;
        }
        @keyframes logoShimmer {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        .active-pill {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%);
          border: 1px solid rgba(255,255,255,0.12);
        }

        .avatar-ring:hover { box-shadow: 0 0 0 2px rgba(255,255,255,0.15), 0 0 16px rgba(255,255,255,0.08); }
      `}</style>

      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0f1d]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_40px_rgba(0,0,0,0.5)]'
            : 'bg-[#0a0f1d]/70 backdrop-blur-lg border-b border-white/[0.04]'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[80px]">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group select-none"
            >
              <div className="relative w-7 h-7 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-md group-hover:bg-white/20 transition-all duration-500" />
                <Image
                  src="/codeSyncLogo.svg"
                  alt="CodeSync"
                  width={28}
                  height={28}
                  className="relative brightness-0 invert opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 ease-out"
                />
              </div>
              <span className="lp-logo-text text-[1.25rem] font-extrabold tracking-tight">
                CodeSync
              </span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-3">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="
                    relative nav-link-hover flex items-center gap-2.5 px-5 py-3 rounded-xl text-[15px] font-medium
                    transition-all duration-200 ease-out group
                    text-gray-400 hover:text-gray-100 hover:bg-white/[0.06]
                  "
                >
                  <Icon className="w-[18px] h-[18px] text-gray-500 transition-colors duration-200 group-hover:text-gray-300" />
                  <span className="tracking-wide">{label}</span>
                </Link>
              ))}
            </div>

            {/* ── Desktop Sign In (pill style matching dashboard's user button) ── */}
            <div className="hidden md:flex items-center ml-6">
              <Link
                href="/auth/login"
                className="
                  avatar-ring flex items-center gap-3 pl-2 pr-6 py-2 rounded-full
                  bg-white/[0.05] border border-white/[0.1]
                  hover:bg-white/[0.09] hover:border-white/[0.18]
                  transition-all duration-200 ease-out group
                "
              >
                <div className="
                  w-9 h-9 rounded-full flex items-center justify-center
                  text-[13px] font-bold text-white tracking-wider
                  bg-gradient-to-br from-neutral-600 to-neutral-800
                  border border-white/20 shadow-inner
                ">
                  <LogIn className="w-[18px] h-[18px] ml-0.5" />
                </div>
                <span className="text-[15px] font-medium text-gray-300 group-hover:text-white transition-colors duration-150">
                  Sign In
                </span>
              </Link>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="
                md:hidden p-3 rounded-xl text-gray-400
                hover:text-white hover:bg-white/[0.08]
                transition-all duration-200
              "
              aria-label="Toggle menu"
            >
              <div className={`transition-all duration-200 ${isMenuOpen ? 'rotate-90 opacity-100' : 'rotate-0 opacity-100'}`}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </div>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isMenuOpen && (
          <div className="mobile-enter md:hidden border-t border-white/[0.06] bg-[#0c1222]/98 backdrop-blur-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-6 flex flex-col gap-3">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="
                    flex items-center gap-4 px-5 py-4 rounded-2xl text-[16px] font-medium
                    transition-all duration-150 group
                    text-gray-400 hover:text-white hover:bg-white/[0.06]
                  "
                >
                  <Icon className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                  <span className="tracking-wide">{label}</span>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="mx-8 h-px bg-white/[0.06]" />

            {/* Mobile Auth Section */}
            <div className="px-6 py-8 flex flex-col gap-4 mb-4">
              <Link
                href="/auth/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-[16px] font-medium
                  text-gray-300 bg-white/[0.05] border border-white/[0.10]
                  hover:bg-white/[0.08] hover:border-white/[0.16] hover:text-white
                  transition-all duration-200"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-[16px] font-semibold
                  text-[#0c1222] bg-white hover:scale-[1.02]
                  hover:bg-gray-100
                  transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
