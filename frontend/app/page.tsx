"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const slides = ["/dashboard.png", "/dashboard2.png", "/dashboard3.png"];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="lp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
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

        /* Glow orbs */
        .glow-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .glow-orb-1 {
          width: 600px; height: 600px;
          top: -200px; left: 50%;
          transform: translateX(-50%);
          background: rgba(99,102,241,0.08);
        }
        .glow-orb-2 {
          width: 400px; height: 400px;
          top: 60%; right: -100px;
          background: rgba(139,92,246,0.05);
        }
        .glow-orb-3 {
          width: 500px; height: 500px;
          top: 40%; left: -150px;
          background: rgba(59,130,246,0.04);
        }

        .lp-content {
          position: relative;
          z-index: 1;
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
          height: 60px;
          background: rgba(9, 9, 11, 0.7);
          backdrop-filter: blur(20px) saturate(1.8);
          -webkit-backdrop-filter: blur(20px) saturate(1.8);
          border-bottom: 1px solid rgba(255,255,255,0.06);
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
          width: 26px; height: 26px;
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }
        .lp-nav-links {
          display: flex;
          gap: 32px;
          align-items: center;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .lp-nav-links a {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.2s;
          letter-spacing: 0;
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
        .hero {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 120px 24px 80px;
          position: relative;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          padding: 6px 16px 6px 8px;
          margin-bottom: 32px;
          transition: border-color 0.3s;
        }
        .hero-badge:hover { border-color: rgba(99,102,241,0.3); }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34,197,94,0.5);
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .hero-title {
          font-size: clamp(48px, 7.5vw, 80px); font-weight: 800;
          line-height: 1.05; letter-spacing: -2.5px; color: #fafafa;
          max-width: 780px; margin-bottom: 0;
        }
        .hero-title-accent {
          background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 17px; font-weight: 400; line-height: 1.7;
          color: rgba(255,255,255,0.4); max-width: 500px;
          margin: 28px auto 44px;
        }
        .hero-ctas {
          display: flex; gap: 12px; align-items: center;
          justify-content: center; flex-wrap: wrap;
        }
        .cta-primary {
          padding: 13px 32px; background: #6366f1; color: #fff;
          font-size: 14px; font-weight: 600; border-radius: 10px;
          text-decoration: none; border: 1px solid rgba(129,140,248,0.3);
          transition: all 0.2s;
          box-shadow: 0 0 24px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .cta-primary:hover {
          background: #5558e6; transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .cta-secondary {
          padding: 13px 32px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 600;
          border-radius: 10px; text-decoration: none;
          transition: all 0.2s;
        }
        .cta-secondary:hover {
          background: rgba(255,255,255,0.05); transform: translateY(-2px);
          border-color: rgba(255,255,255,0.2); color: #fff;
        }

        /* ──────────────────── CODE WINDOW ──────────────────── */
        .code-window-wrap {
          width: 100%; max-width: 820px; margin: 64px auto 0;
          padding: 0 24px; position: relative;
        }
        .code-window {
          background: #0c0c0f; border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03),
                      0 0 60px rgba(99,102,241,0.05);
        }
        .code-titlebar {
          display: flex; align-items: center; gap: 7px; padding: 14px 18px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .dot { width: 11px; height: 11px; border-radius: 50%; }
        .dot-red { background: #ef4444; } .dot-yellow { background: #eab308; } .dot-green { background: #22c55e; }
        .code-filename {
          margin-left: 12px; font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.3);
        }
        .code-body {
          padding: 28px 32px 32px;
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
          font-size: 13.5px; line-height: 1.85; color: #c9d1d9; background: #0c0c0f;
          overflow-x: auto;
        }
        .code-kw { color: #ff7b72; } .code-fn { color: #d2a8ff; }
        .code-str { color: #a5d6ff; } .code-comment { color: #6e7681; font-style: italic; }
        .code-var { color: #ffa657; } .code-prop { color: #79c0ff; }

        /* ──────────────────── DIVIDER ──────────────────── */
        .section-divider {
          width: 100%; max-width: 800px; height: 1px; margin: 0 auto;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
        }

        /* ──────────────────── STATS BAR ──────────────────── */
        .stats-bar {
          display: flex; align-items: stretch; justify-content: center;
          gap: 2px; margin: 80px auto 0; max-width: 680px;
          flex-wrap: wrap; padding: 0 24px;
        }
        .stat-item {
          flex: 1; min-width: 140px; padding: 36px 24px; text-align: center;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s ease;
        }
        .stat-item:first-child { border-radius: 16px 0 0 16px; }
        .stat-item:last-child { border-radius: 0 16px 16px 0; }
        .stat-item:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(99,102,241,0.2);
        }
        .stat-number {
          font-size: 32px; font-weight: 800; color: #fff;
          letter-spacing: -1.5px; margin-bottom: 6px;
          font-variant-numeric: tabular-nums;
        }
        .stat-label { font-size: 13px; color: rgba(255,255,255,0.3); font-weight: 400; }

        /* ──────────────────── SECTION COMMON ──────────────────── */
        .section-pad { padding: 120px 48px 100px; }
        .section-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 500;
          color: #818cf8;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 100px;
          padding: 5px 14px;
          margin-bottom: 20px;
        }
        .section-title {
          font-size: clamp(36px, 5vw, 56px); font-weight: 800;
          letter-spacing: -2px; color: #fafafa; margin-bottom: 18px; line-height: 1.08;
        }
        .section-subtitle {
          font-size: 16px; color: rgba(255,255,255,0.38); line-height: 1.7;
          max-width: 480px; margin: 0 auto 64px;
        }

        /* ──────────────────── FEATURES ──────────────────── */
        .features-section { text-align: center; }
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; max-width: 1060px; margin: 0 auto;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
        }
        .feature-card {
          background: #0c0c0f; padding: 48px 36px;
          display: flex; flex-direction: column; gap: 0;
          transition: all 0.3s ease;
          position: relative;
        }
        .feature-card:hover {
          background: rgba(99,102,241,0.03);
        }
        .feature-icon-wrap {
          width: 44px; height: 44px; margin-bottom: 28px;
          background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.12);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
        }
        .feature-icon { width: 20px; height: 20px; color: #818cf8; }
        .feature-title { font-size: 16px; font-weight: 700; color: #fafafa; margin-bottom: 10px; text-align: left; }
        .feature-desc { font-size: 14px; line-height: 1.65; color: rgba(255,255,255,0.35); text-align: left; }
        .feature-desc .hl { color: #a78bfa; font-weight: 500; }

        /* ──────────────────── HOW IT WORKS ──────────────────── */
        .how-section { text-align: center; }
        .how-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0; max-width: 900px; margin: 0 auto;
          position: relative;
        }
        .how-grid::before {
          content: '';
          position: absolute; top: 40px; left: 16.6%; right: 16.6%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(99,102,241,0.3), transparent);
        }
        .how-step {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 0 32px; position: relative;
        }
        .how-number {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 800; color: #818cf8;
          margin-bottom: 24px; position: relative; z-index: 1;
          box-shadow: 0 0 20px rgba(99,102,241,0.1);
        }
        .how-step-title {
          font-size: 18px; font-weight: 700; color: #fafafa;
          margin-bottom: 10px;
        }
        .how-step-desc {
          font-size: 14px; line-height: 1.65; color: rgba(255,255,255,0.35);
          max-width: 240px;
        }

        /* ──────────────────── SHOWCASE ──────────────────── */
        .showcase-outer {
          padding: 40px 48px 120px; max-width: 1320px; margin: 0 auto;
        }
        .showcase-section {
          display: grid; grid-template-columns: 1fr 1.8fr; gap: 56px;
          align-items: center;
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px; padding: 64px 72px; position: relative; overflow: hidden;
        }
        .showcase-section::before {
          content: ''; position: absolute; right: -100px; top: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .showcase-eyebrow {
          font-size: 12px; font-weight: 500; letter-spacing: 0;
          color: #818cf8; margin-bottom: 16px;
        }
        .showcase-title {
          font-size: clamp(30px, 3.5vw, 44px); font-weight: 800;
          letter-spacing: -1.5px; color: #fafafa; line-height: 1.1; margin-bottom: 20px;
        }
        .showcase-desc {
          font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.38);
          margin-bottom: 36px;
        }
        .showcase-desc .accent { color: rgba(255,255,255,0.7); font-weight: 500; }
        .showcase-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .showcase-list li {
          display: flex; align-items: center; gap: 12px;
          font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.65);
        }
        .list-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6366f1; flex-shrink: 0;
          box-shadow: 0 0 8px rgba(99,102,241,0.5);
        }
        .showcase-slider {
          position: relative; width: 100%; aspect-ratio: 16/10;
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03);
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
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(9, 9, 11, 0.7); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6); display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10; transition: all 0.2s ease;
        }
        .slider-arrow:hover {
          background: rgba(9, 9, 11, 0.9); color: #fff;
          border-color: rgba(255,255,255,0.2);
        }
        .slider-arrow.prev { left: 14px; }
        .slider-arrow.next { right: 14px; }
        .slider-dots {
          position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 6px; z-index: 10;
          background: rgba(0,0,0,0.5); padding: 5px 10px; border-radius: 20px;
          backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.05);
        }
        .slider-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(255,255,255,0.25); transition: all 0.3s ease;
          cursor: pointer;
        }
        .slider-dot.active {
          background: #818cf8; transform: scale(1.4);
          box-shadow: 0 0 8px rgba(129,140,248,0.5);
        }

        /* ──────────────────── TESTIMONIALS ──────────────────── */
        .testimonials-section { text-align: center; }
        .testimonials-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; max-width: 1060px; margin: 0 auto;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          overflow: hidden;
        }
        .testimonial-card {
          background: #0c0c0f;
          padding: 40px 32px;
          text-align: left;
          transition: all 0.3s ease;
        }
        .testimonial-card:hover {
          background: rgba(255,255,255,0.02);
        }
        .testimonial-quote {
          font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.45);
          margin-bottom: 24px; font-style: italic;
        }
        .testimonial-author {
          display: flex; align-items: center; gap: 12px;
        }
        .testimonial-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a78bfa);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: #fff;
        }
        .testimonial-name {
          font-size: 13px; font-weight: 600; color: #fafafa;
        }
        .testimonial-role {
          font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 2px;
        }

        /* ──────────────────── CTA BANNER ──────────────────── */
        .cta-banner {
          text-align: center; padding: 100px 24px;
          position: relative;
        }
        .cta-banner-inner {
          max-width: 720px; margin: 0 auto;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 72px 64px;
          position: relative;
          overflow: hidden;
        }
        .cta-banner-inner::before {
          content: ''; position: absolute;
          top: -50%; left: 50%; transform: translateX(-50%);
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-banner-title {
          font-size: clamp(30px, 4vw, 44px); font-weight: 800;
          letter-spacing: -1.5px; color: #fafafa;
          margin-bottom: 16px; line-height: 1.1;
          position: relative;
        }
        .cta-banner-desc {
          font-size: 16px; color: rgba(255,255,255,0.38);
          margin-bottom: 36px; line-height: 1.7;
          position: relative;
        }
        .cta-banner-actions {
          display: flex; gap: 12px; justify-content: center;
          flex-wrap: wrap; position: relative;
        }

        /* ──────────────────── LIGHTBOX ──────────────────── */
        .lightbox-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.92); backdrop-filter: blur(12px);
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
          cursor: pointer; opacity: 0.5; transition: opacity 0.2s;
        }
        .lightbox-close:hover { opacity: 1; }

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
        .footer-copy {
          font-size: 13px;
          color: rgba(255,255,255,0.2);
        }
        .github-icon { color: rgba(255,255,255,0.25); transition: color 0.2s; cursor: pointer; }
        .github-icon:hover { color: rgba(255,255,255,0.6); }

        /* ──────────────────── ANIMATIONS ──────────────────── */
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.2s; opacity: 0; }
        .delay-3 { animation-delay: 0.3s; opacity: 0; }
        .delay-4 { animation-delay: 0.4s; opacity: 0; }

        /* ──────────────────── RESPONSIVE ──────────────────── */
        @media (max-width: 1024px) {
          .lp-nav { padding: 0 32px; }
          .section-pad { padding: 100px 32px 80px; }
          .showcase-outer { padding: 40px 32px 100px; }
          .showcase-section { grid-template-columns: 1fr; gap: 48px; padding: 48px 44px; }
          .footer { padding: 56px 32px 0; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
          .how-grid { gap: 24px; }
        }

        @media (max-width: 768px) {
          .lp-nav { padding: 0 20px; }
          .lp-nav-links { display: none; }
          .btn-signin { display: none; }

          .hero { padding: 80px 20px 60px; }
          .hero-subtitle { font-size: 15px; }
          .cta-primary, .cta-secondary { padding: 12px 24px; font-size: 13px; }

          .code-window-wrap { padding: 0 16px; max-width: 100%; }
          .code-body { padding: 20px; font-size: 12px; }

          .stats-bar { margin: 48px 16px 0; gap: 1px; padding: 0 16px; flex-direction: column; }
          .stat-item { min-width: 100%; padding: 24px 16px; }
          .stat-item:first-child { border-radius: 16px 16px 0 0; }
          .stat-item:last-child { border-radius: 0 0 16px 16px; }
          .stat-number { font-size: 26px; }

          .section-pad { padding: 80px 20px 60px; }
          .features-grid { grid-template-columns: 1fr; }
          .feature-card { padding: 36px 28px; }

          .how-grid { grid-template-columns: 1fr; gap: 40px; }
          .how-grid::before { display: none; }

          .testimonials-grid { grid-template-columns: 1fr; }

          .showcase-outer { padding: 32px 20px 80px; }
          .showcase-section { padding: 36px 24px; gap: 36px; }

          .cta-banner { padding: 60px 20px; }
          .cta-banner-inner { padding: 48px 28px; }

          .footer { padding: 48px 20px 0; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
          .footer-bottom { flex-direction: column; gap: 12px; align-items: center; }
        }

        @media (max-width: 500px) {
          .hero-title { letter-spacing: -1.5px; }
          .showcase-section { border-radius: 16px; }
          .footer-grid { grid-template-columns: 1fr; }
          .features-grid { border-radius: 16px; }
          .testimonials-grid { border-radius: 16px; }
        }
      `}</style>

      {/* ────── GRID BACKGROUND ────── */}
      <div className="grid-bg" />
      <div className="grid-bg-accent" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />

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
            Sync Your Code<br />
            with <span className="hero-title-accent">Precision.</span>
          </h1>
          <p className="hero-subtitle animate-in delay-3">
            A monolithic ecosystem for deep work. Engineering
            high-performance workflows with atmospheric clarity
            and pixel-perfect execution.
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
        <section className="features-section section-pad" id="features">
          <span className="section-tag">Features</span>
          <h2 className="section-title">Engineered for Flow.</h2>
          <p className="section-subtitle">
            Rejecting noise in favor of atmospheric depth and functional clarity.
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
                desc: <>Multiplayer editing with zero latency. <span className="hl">Built for distributed teams</span> across the globe.</>,
              },
              {
                icon: (
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: "Version Control",
                desc: <>Precise snapshotting and <span className="hl">branch management</span> integrated directly into your workflow.</>,
              },
              {
                icon: (
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ),
                title: "Simplicity First",
                desc: <>A minimal interface that disappears when you&apos;re in the zone. Deep work by design.</>,
              },
              {
                icon: (
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                title: "Enterprise Security",
                desc: <>End-to-end encryption with <span className="hl">SOC 2 compliance</span>. Your code never leaves your control.</>,
              },
              {
                icon: (
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                ),
                title: "API First",
                desc: <>Full REST & GraphQL APIs. Automate everything with <span className="hl">webhooks and integrations</span>.</>,
              },
              {
                icon: (
                  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
                title: "Blazing Fast",
                desc: <>Optimized for speed with edge computing. Sub-5ms sync latency across all regions.</>,
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
          <span className="section-tag">How It Works</span>
          <h2 className="section-title">Three Steps to Flow.</h2>
          <p className="section-subtitle">
            Get up and running in minutes. No complex configuration required.
          </p>
          <div className="how-grid">
            {[
              { num: "1", title: "Connect", desc: "Link your repositories and invite your team with a single command." },
              { num: "2", title: "Code", desc: "Write code with real-time sync, branching, and instant previews." },
              { num: "3", title: "Deploy", desc: "Push to production with zero-downtime deployments and rollback." },
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
              <p className="showcase-eyebrow">Product Showcase</p>
              <h2 className="showcase-title">
                Your Dashboard.<br />Redefined.
              </h2>
              <p className="showcase-desc">
                A <span className="accent">seamless transition</span> from code to
                orchestration. Our dashboard leverages{" "}
                <span className="accent">tonal layering</span> to ensure your data is
                always at the forefront.
              </p>
              <ul className="showcase-list">
                <li><span className="list-dot" /> Integrated Monitoring</li>
                <li><span className="list-dot" /> Resource Optimization</li>
                <li><span className="list-dot" /> AI-Assisted Diagnostics</li>
              </ul>
            </div>
            <div className="showcase-slider" onClick={() => setLightboxOpen(true)}>
              <button className="slider-arrow prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }} aria-label="Previous image">
                <ChevronLeft size={22} strokeWidth={1.5} />
              </button>
              <button className="slider-arrow next" onClick={(e) => { e.stopPropagation(); nextSlide(); }} aria-label="Next image">
                <ChevronRight size={22} strokeWidth={1.5} />
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

        {/* ────── TESTIMONIALS ────── */}
        <section className="testimonials-section section-pad" id="testimonials">
          <span className="section-tag">Trusted by Developers</span>
          <h2 className="section-title">Loved by Teams.</h2>
          <p className="section-subtitle">
            Hear from engineers who&apos;ve made the switch.
          </p>
          <div className="testimonials-grid">
            {[
              { quote: "CodeSync completely transformed our workflow. The real-time sync is genuinely faster than anything we've used before.", name: "Sarah Chen", role: "Staff Engineer, Vercel", initial: "S" },
              { quote: "The branch management alone is worth it. We cut our merge conflicts by 80% in the first month.", name: "Alex Rivera", role: "CTO, Stackblitz", initial: "A" },
              { quote: "Finally, a tool that stays out of your way. The interface is so clean it almost doesn't feel like it's there.", name: "Priya Sharma", role: "Lead Dev, Linear", initial: "P" },
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
              Ready to sync your code?
            </h2>
            <p className="cta-banner-desc">
              Join 50,000+ developers who ship faster with CodeSync.
              Free to start, no credit card required.
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
              <X size={28} strokeWidth={1.5} />
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

/* ────── LANDING NAV COMPONENT ────── */
function NavbarLanding() {
  return (
    <nav className="lp-nav">
      <Link href="/" className="lp-logo">
        <Image src="/codeSyncLogo.svg" alt="CodeSync" width={26} height={26} className="lp-logo-icon" />
        CodeSync
      </Link>
      <div className="lp-nav-links">
        <a href="#features">Features</a>
        <Link href="/pricing">Pricing</Link>
        <a href="#docs">Docs</a>
      </div>
      <div className="lp-nav-actions">
        <Link href="/auth/login" className="btn-signin">Sign In</Link>
        <Link href="/auth/signup" className="btn-signup">Get Started</Link>
      </div>
    </nav>
  );
}
