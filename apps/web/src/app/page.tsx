"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { WordsPullUp } from "@/components/animations/words-pull-up";
import { WordsPullUpMultiStyle } from "@/components/animations/words-pull-up-multi-style";
import { ScrollRevealedText } from "@/components/animations/scroll-revealed-text";
import { APP_NAME } from "@codexa/shared";

export default function LandingPage() {
  const featuresRef = React.useRef<HTMLDivElement>(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen w-full bg-black text-[#E1E0CC] selection:bg-[#DEDBC8] selection:text-black">
      {/* ── SECTION 1: HERO (Inset Container) ── */}
      <section className="h-screen w-full p-3 sm:p-4 md:p-6 flex flex-col">
        <div className="relative h-full w-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-black flex flex-col justify-between border border-white/[0.06]">
          {/* Fullscreen Looping Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          />

          {/* SVG Fractal Noise Overlay */}
          <div className="noise-overlay absolute inset-0 opacity-[0.7] mix-blend-overlay pointer-events-none z-[1]" />

          {/* Cinematic Vertical Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75 z-[2] pointer-events-none" />

          {/* Navbar: Black Pill Hanging from Top Edge */}
          <header className="relative z-10 w-full flex justify-center pt-0 px-4">
            <nav className="bg-black border-x border-b border-white/[0.08] rounded-b-2xl md:rounded-b-3xl px-5 py-2.5 sm:px-8 sm:py-3 flex items-center justify-between gap-4 sm:gap-8 md:gap-12 lg:gap-14 shadow-2xl">
              {/* Logo */}
              <Link
                href="/"
                className="text-xl sm:text-2xl tracking-tight text-white font-normal hover:opacity-90 transition-opacity"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {APP_NAME}<sup className="text-[10px] ml-0.5">®</sup>
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-3 sm:gap-6 md:gap-8 text-[11px] sm:text-xs md:text-sm">
                <Link
                  href="/study-hub"
                  className="text-white/80 hover:text-[#E1E0CC] transition-colors"
                >
                  Study Hub
                </Link>
                <Link
                  href="/practice"
                  className="text-white/80 hover:text-[#E1E0CC] transition-colors"
                >
                  DSA Practice
                </Link>
                <Link
                  href="/dashboard"
                  className="text-white/80 hover:text-[#E1E0CC] transition-colors hidden sm:inline-block"
                >
                  Dashboard
                </Link>
                <Link
                  href="/auth/login"
                  className="text-white/80 hover:text-[#E1E0CC] transition-colors"
                >
                  Sign In
                </Link>
              </div>

              {/* Navbar Mini CTA */}
              <Link
                href="/study-hub"
                className="hidden md:inline-flex text-[11px] font-medium px-3 py-1 rounded-full bg-[#DEDBC8] text-black hover:bg-white transition-colors"
              >
                Explore Hub
              </Link>
            </nav>
          </header>

          {/* Hero Bottom Content: 12-Column Responsive Grid */}
          <div className="relative z-10 w-full p-6 sm:p-8 md:p-12 lg:p-14 pb-8 md:pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
              {/* Left 8 Columns: Giant Pull-Up Heading with Asterisk */}
              <div className="lg:col-span-8 overflow-hidden">
                <WordsPullUp
                  text="Codexa"
                  showAsterisk={true}
                  className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
                />
              </div>

              {/* Right 4 Columns: Description + Pill Action Button */}
              <div className="lg:col-span-4 flex flex-col gap-6 items-start pb-2">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-[#DEDBC8]/80 text-xs sm:text-sm md:text-base leading-[1.25] font-normal"
                >
                  CODEXA is an open-source learning hub for IT and Computer
                  Engineering students. Connecting curriculum notes, in-browser
                  coding practice, and syllabus AI in one unified terminal.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link href="/study-hub">
                    <button
                      type="button"
                      className="group flex items-center justify-between gap-3 bg-[#DEDBC8] text-black font-medium text-sm sm:text-base pl-6 pr-2 py-2 rounded-full hover:bg-white transition-all duration-200 cursor-pointer shadow-lg hover:gap-4"
                    >
                      <span>Explore the Hub</span>
                      <div className="bg-black text-[#DEDBC8] rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: ABOUT (Cinematic Editorial Card) ── */}
      <section className="bg-black py-24 sm:py-32 px-4 sm:px-6 md:px-8 flex justify-center">
        <div className="bg-[#101010] border border-white/[0.06] rounded-2xl md:rounded-3xl p-8 sm:p-14 md:p-20 max-w-6xl w-full text-center flex flex-col items-center gap-8 shadow-2xl">
          {/* Section Tag */}
          <span className="text-[#DEDBC8] text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium">
            Open-Source Academic Ecosystem
          </span>

          {/* Multi-Style Pull-Up Heading with Serif Accent */}
          <WordsPullUpMultiStyle
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-4xl mx-auto"
            segments={[
              { text: "Built for engineers,", className: "text-[#E1E0CC] font-normal" },
              {
                text: "by students.",
                className: "text-[#DEDBC8] italic font-serif mx-2",
              },
              {
                text: "One unified platform for semester notes, DSA sandboxes, and grounded syllabus AI.",
                className: "text-[#E1E0CC] font-normal",
              },
            ]}
          />

          {/* Scroll-Linked Progressive Character Opacity Reveal */}
          <div className="max-w-3xl mx-auto mt-4 pt-8 border-t border-white/[0.06]">
            <ScrollRevealedText
              className="text-xs sm:text-sm md:text-base leading-relaxed text-center"
              text="Over the semesters, IT and Computer Engineering students lose countless hours searching fragmented WhatsApp groups, random question papers, and disconnected coding sites. CODEXA unifies verified semester notes, practical lab files, and in-browser DSA problem solving into one community-maintained ecosystem. Zero paywalls, zero distraction, 100% open-source."
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FEATURES (4-Column Bento Grid with Video Card) ── */}
      <section
        ref={featuresRef}
        className="min-h-screen bg-black py-24 sm:py-32 px-4 sm:px-6 md:px-8 relative overflow-hidden"
      >
        {/* Subtle Background Noise Overlay */}
        <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-12 sm:gap-16">
          {/* Section Header */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <WordsPullUpMultiStyle
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl justify-start font-normal"
              segments={[
                {
                  text: "Curriculum-grade workflows for ambitious engineers.",
                  className: "text-[#E1E0CC] block w-full text-left",
                },
                {
                  text: "Built for pure focus. Powered by open code.",
                  className: "text-gray-500 block w-full text-left mt-1",
                },
              ]}
            />
          </div>

          {/* 4-Card Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3 lg:gap-2">
            {/* CARD 1: Video Showcase Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isFeaturesInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[440px] lg:h-[490px] rounded-2xl overflow-hidden bg-[#212121] border border-white/[0.06] flex flex-col justify-end p-6 group"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover object-center z-0 group-hover:scale-105 transition-transform duration-700"
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-[1]" />
              <div className="relative z-10">
                <span className="text-[10px] uppercase font-mono text-[#DEDBC8] tracking-widest block mb-1">
                  Interactive Learning
                </span>
                <h3
                  className="text-2xl text-[#E1E0CC] font-normal"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Your open learning canvas.
                </h3>
              </div>
            </motion.div>

            {/* CARD 2: Centralized Study Hub (01) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isFeaturesInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="h-[440px] lg:h-[490px] rounded-2xl bg-[#212121] border border-white/[0.06] p-6 sm:p-7 flex flex-col justify-between hover:border-white/[0.12] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-black/80 border border-white/[0.12] flex items-center justify-center overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=95"
                      alt="Study Hub Icon"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-500">01</span>
                </div>

                <h3 className="text-xl font-medium text-[#E1E0CC] mb-4">
                  Study Hub.
                </h3>

                <div className="flex flex-col gap-2.5">
                  {[
                    "GTU Semester 1 to 8 taxonomy",
                    "Handwritten & verified lecture notes",
                    "Previous year question papers (PYQ)",
                    "Zero-egress PDF downloads via R2",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-400">
                      <Check className="h-3.5 w-3.5 text-[#DEDBC8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/study-hub"
                className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#DEDBC8] hover:text-white group"
              >
                <span>Browse Materials</span>
                <ArrowRight className="h-3.5 w-3.5 -rotate-45 group-hover:rotate-0 transition-transform duration-200" />
              </Link>
            </motion.div>

            {/* CARD 3: In-Browser DSA Practice (02) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isFeaturesInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-[440px] lg:h-[490px] rounded-2xl bg-[#212121] border border-white/[0.06] p-6 sm:p-7 flex flex-col justify-between hover:border-white/[0.12] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-black/80 border border-white/[0.12] flex items-center justify-center overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=95"
                      alt="DSA Practice Icon"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-500">02</span>
                </div>

                <h3 className="text-xl font-medium text-[#E1E0CC] mb-4">
                  DSA Sandbox.
                </h3>

                <div className="flex flex-col gap-2.5">
                  {[
                    "Monaco Code Editor with CRT mode",
                    "Hidden test-case grading & verdicts",
                    "Python, C++, Java, and JS runtimes",
                    "Topic tracks: Trees, DP, Graphs, SQL",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-400">
                      <Check className="h-3.5 w-3.5 text-[#DEDBC8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/practice"
                className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#DEDBC8] hover:text-white group"
              >
                <span>Start Practice</span>
                <ArrowRight className="h-3.5 w-3.5 -rotate-45 group-hover:rotate-0 transition-transform duration-200" />
              </Link>
            </motion.div>

            {/* CARD 4: Grounded AI Assistant (03) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={isFeaturesInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="h-[440px] lg:h-[490px] rounded-2xl bg-[#212121] border border-white/[0.06] p-6 sm:p-7 flex flex-col justify-between hover:border-white/[0.12] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-black/80 border border-white/[0.12] flex items-center justify-center overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=95"
                      alt="AI Assistant Icon"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-500">03</span>
                </div>

                <h3 className="text-xl font-medium text-[#E1E0CC] mb-4">
                  Grounded AI.
                </h3>

                <div className="flex flex-col gap-2.5">
                  {[
                    "Syllabus-grounded RAG answers",
                    "Exact citations to uploaded notes",
                    "Viva & exam question simulations",
                    "Custom PDF quiz & summary mode",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-400">
                      <Check className="h-3.5 w-3.5 text-[#DEDBC8] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/ai-assistant"
                className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#DEDBC8] hover:text-white group"
              >
                <span>Launch Assistant</span>
                <ArrowRight className="h-3.5 w-3.5 -rotate-45 group-hover:rotate-0 transition-transform duration-200" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black border-t border-white/[0.06] py-12 px-6 sm:px-8 text-center text-xs font-mono text-gray-400 flex flex-col items-center gap-2">
        <p className="text-white">
          &copy; 2026 CODEXA &bull; Designed &amp; Developed by <span className="text-[#DEDBC8] font-semibold">Raj Prajapati</span>
        </p>
        <p className="text-[11px] text-gray-500">
          Open-Source Education Hub for IT &amp; Computer Engineering Students.
        </p>
      </footer>
    </div>
  );
}
