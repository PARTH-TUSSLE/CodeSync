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
          background-color: #09090b;
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
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 100%);
          pointer-events: none;
          z-index: 0;
        }

        /* Subtle top glow */
        .glow-top {
          position: fixed;
          top: -300px; left: 50%;
          transform: translateX(-50%);
          width: 900px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
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
          padding: 0 48px;
          height: 56px;
          background: rgba(9, 9, 11, 0.8);
          backdrop-filter: blur(16px) saturate(1.6);
          -webkit-backdrop-filter: blur(16px) saturate(1.6);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          letter-spacing: -0.3px;
        }
        .lp-logo-icon {
          width: 24px; height: 24px;
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
          font-weight: 450;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          transition: color 0.15s;
          letter-spacing: 0;
        }
        .lp-nav-links a:hover { color: #fff; }
        .lp-nav-actions { display: flex; align-items: center; gap: 6px; }
        .btn-signin {
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.5); text-decoration: none;
          padding: 6px 14px; border-radius: 6px; transition: color 0.15s;
        }
        .btn-signin:hover { color: #fff; }
        .btn-signup {
          font-size: 13px; font-weight: 600; color: #fff; text-decoration: none;
          padding: 6px 16px; background: #fff; color: #09090b; border-radius: 6px;
          border: none;
          transition: all 0.15s;
        }
        .btn-signup:hover {
          background: rgba(255,255,255,0.9);
        }

        /* ──────────────────── HERO ──────────────────── */
        .hero {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 100px 24px 72px;
          position: relative;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
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
          color: rgba(255,255,255,0.4); max-width: 460px;
          margin: 24px auto 40px;
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
          border: 1px solid rgba(255,255,255,0.12);
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
          width: 100%; max-width: 720px; margin: 56px auto 0;
          padding: 0 24px; position: relative;
        }
        .code-window {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; overflow: hidden;
        }
        .code-titlebar {
          display: flex; align-items: center; gap: 6px; padding: 12px 16px;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
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
          margin: 80px auto 0; max-width: 720px;
          padding: 0 24px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          overflow: hidden;
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
          background: rgba(255,255,255,0.08);
        }
        .stat-number {
          font-size: 28px; font-weight: 800; color: #fff;
          letter-spacing: -1px; margin-bottom: 4px;
          font-variant-numeric: tabular-nums;
        }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.3); font-weight: 450; letter-spacing: 0.2px; }

        /* ──────────────────── SECTION COMMON ──────────────────── */
        .section-pad { padding: 100px 48px 80px; }
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
          font-size: 15px; color: rgba(255,255,255,0.35); line-height: 1.6;
          max-width: 440px; margin: 0 auto 56px;
          letter-spacing: -0.1px;
        }

        /* ──────────────────── FEATURES ──────────────────── */
        .features-section { text-align: center; }
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          max-width: 1000px; margin: 0 auto;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
        }
        .feature-card {
          padding: 40px 32px;
          display: flex; flex-direction: column; gap: 0;
          transition: background 0.2s;
          position: relative;
          border-right: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .feature-card:nth-child(3n) { border-right: none; }
        .feature-card:nth-child(n+4) { border-bottom: none; }
        .feature-card:hover {
          background: rgba(255,255,255,0.02);
        }
        .feature-icon-wrap {
          width: 40px; height: 40px; margin-bottom: 24px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
        }
        .feature-icon { width: 18px; height: 18px; color: rgba(255,255,255,0.5); }
        .feature-title { font-size: 14px; font-weight: 650; color: #fafafa; margin-bottom: 8px; text-align: left; letter-spacing: -0.2px; }
        .feature-desc { font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.3); text-align: left; }
        .feature-desc .hl { color: rgba(255,255,255,0.55); font-weight: 500; }

        /* ──────────────────── HOW IT WORKS ──────────────────── */
        .how-section { text-align: center; }
        .how-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0; max-width: 860px; margin: 0 auto;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
        }
        .how-step {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 48px 32px; position: relative;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .how-step:last-child { border-right: none; }
        .how-number {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
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
          font-size: 13px; line-height: 1.6; color: rgba(255,255,255,0.3);
          max-width: 220px;
        }

        /* ──────────────────── SHOWCASE ──────────────────── */
        .showcase-outer {
          padding: 20px 48px 100px; max-width: 1200px; margin: 0 auto;
        }
        .showcase-section {
          display: grid; grid-template-columns: 1fr 1.6fr; gap: 48px;
          align-items: center;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 56px 56px; position: relative; overflow: hidden;
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
          font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.35);
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
          border: 1px solid rgba(255,255,255,0.08);
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
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
        }
        .testimonial-card {
          padding: 36px 28px;
          text-align: left;
          transition: background 0.2s;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .testimonial-card:last-child { border-right: none; }
        .testimonial-card:hover {
          background: rgba(255,255,255,0.02);
        }
        .testimonial-quote {
          font-size: 13px; line-height: 1.65; color: rgba(255,255,255,0.4);
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
          text-align: center; padding: 80px 24px;
          position: relative;
        }
        .cta-banner-inner {
          max-width: 640px; margin: 0 auto;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 64px 48px;
          position: relative;
          overflow: hidden;
        }
        .cta-banner-title {
          font-size: clamp(28px, 3.5vw, 40px); font-weight: 750;
          letter-spacing: -1.2px; color: #fafafa;
          margin-bottom: 12px; line-height: 1.1;
          position: relative;
        }
        .cta-banner-desc {
          font-size: 14px; color: rgba(255,255,255,0.35);
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
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 56px 48px 0;
        }
        .footer-grid {
          display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 40px; margin-bottom: 56px;
        }
        .footer-brand-name {
          font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 10px;
          letter-spacing: -0.2px;
        }
        .footer-brand-desc {
          font-size: 12.5px; line-height: 1.6; color: rgba(255,255,255,0.2); max-width: 200px;
        }
        .footer-col-label {
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.45); margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-links a {
          font-size: 12.5px; color: rgba(255,255,255,0.25); text-decoration: none;
          transition: color 0.15s;
        }
        .footer-links a:hover { color: rgba(255,255,255,0.6); }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 0;
        }
        .footer-copy {
          font-size: 12px;
          color: rgba(255,255,255,0.15);
        }
        .github-icon { color: rgba(255,255,255,0.2); transition: color 0.15s; cursor: pointer; }
        .github-icon:hover { color: rgba(255,255,255,0.5); }

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
          .lp-nav { padding: 0 28px; }
          .section-pad { padding: 80px 28px 64px; }
          .showcase-outer { padding: 20px 28px 80px; }
          .showcase-section { grid-template-columns: 1fr; gap: 40px; padding: 40px 36px; }
          .footer { padding: 48px 28px 0; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
        }

        @media (max-width: 768px) {
          .lp-nav { padding: 0 20px; }
          .lp-nav-links { display: none; }
          .btn-signin { display: none; }

          .hero { padding: 64px 20px 48px; }
          .hero-subtitle { font-size: 14px; }

          .code-window-wrap { padding: 0 16px; max-width: 100%; }
          .code-body { padding: 20px; font-size: 12px; }

          .stats-bar {
            margin: 48px 16px 0; grid-template-columns: 1fr;
            max-width: 100%;
          }
          .stat-item:not(:last-child)::after {
            right: 20%; top: auto; bottom: 0; height: 1px;
            width: 60%;
          }
          .stat-number { font-size: 24px; }

          .section-pad { padding: 64px 20px 48px; }
          .features-grid { grid-template-columns: 1fr; }
          .feature-card { border-right: none !important; }
          .feature-card:last-child { border-bottom: none; }

          .how-grid { grid-template-columns: 1fr; }
          .how-step { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .how-step:last-child { border-bottom: none; }

          .testimonials-grid { grid-template-columns: 1fr; }
          .testimonial-card { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .testimonial-card:last-child { border-bottom: none; }

          .showcase-outer { padding: 16px 20px 64px; }
          .showcase-section { padding: 32px 24px; gap: 32px; }

          .cta-banner { padding: 48px 20px; }
          .cta-banner-inner { padding: 48px 24px; }

          .footer { padding: 40px 20px 0; }
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
          .footer-bottom { flex-direction: column; gap: 10px; align-items: center; }
        }

        @media (max-width: 500px) {
          .hero-title { letter-spacing: -1.5px; }
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ────── BACKGROUND ────── */}
      <div className="grid-bg" />
      <div className="glow-top" />

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
  return (
    <nav className="lp-nav">
      <Link href="/" className="lp-logo">
        <Image src="/codeSyncLogo.svg" alt="CodeSync" width={24} height={24} className="lp-logo-icon" />
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
