"use client";

import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Logo from "./Logo";
import NavLink from "./NavLink";
import CTAButton from "./CTAButton";
import MobileMenu from "./MobileMenu";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NAV_LINKS = [
  { label: "Models",      href: "#models"      },
  { label: "Performance", href: "#performance" },
  { label: "Technology",  href: "#technology"  },
  { label: "Experience",  href: "#experience"  },
  { label: "Configure",   href: "#configure"   },
];

const EASE_MENU = [0.76, 0, 0.24, 1] as const;

const lineTopVariants = {
  closed: { rotate: 0,  y: 0, transition: { duration: 0.35, ease: EASE_MENU } },
  open:   { rotate: 45, y: 8, transition: { duration: 0.35, ease: EASE_MENU } },
};
const lineMidVariants = {
  closed: { scaleX: 1, opacity: 1, transition: { duration: 0.2 } },
  open:   { scaleX: 0, opacity: 0, transition: { duration: 0.2 } },
};
const lineBotVariants = {
  closed: { rotate: 0,   y: 0,  transition: { duration: 0.35, ease: EASE_MENU } },
  open:   { rotate: -45, y: -8, transition: { duration: 0.35, ease: EASE_MENU } },
};

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeHref, setActiveHref] = useState("");

  const navRef      = useRef<HTMLElement>(null);
  const pillRef     = useRef<HTMLDivElement>(null);
  const glowRef     = useRef<HTMLDivElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);
  const linksRef    = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const pill      = pillRef.current;
      const glow      = glowRef.current;
      const logo      = logoRef.current;
      const linksArr  = linksRef.current ? Array.from(linksRef.current.children) : [];
      const cta       = ctaRef.current;
      const progress  = progressRef.current;

      // ── 1. Initial hidden states ──────────────────────────────
      gsap.set(pill,     { yPercent: -130, opacity: 0 });
      gsap.set(glow,     { opacity: 0 });
      gsap.set(logo,     { opacity: 0, x: -22 });
      gsap.set(linksArr, { opacity: 0, y: -12 });
      gsap.set(cta,      { opacity: 0, x: 18 });

      // ── 2. Entrance timeline ──────────────────────────────────
      gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 })
        .to(pill,     { yPercent: 0, opacity: 1, duration: 1.0 })
        .to(logo,     { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" }, "-=0.65")
        .to(linksArr, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" }, "-=0.5")
        .to(cta,      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, "-=0.3");

      // ── 3. Scroll → floating pill morph ──────────────────────
      ScrollTrigger.create({
        start: "top+=80 top",
        onEnter: () => {
          gsap.to(pill, {
            left: "40px",
            right: "40px",
            height: "62px",
            borderRadius: "80px",
            duration: 0.58,
            ease: "power3.inOut",
            background: "rgba(7,7,7,0.88)",
            boxShadow:
              "0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.13), inset 0 1px 0 rgba(255,255,255,0.04)",
          });
          gsap.to(glow, { opacity: 1, duration: 0.5, ease: "power2.out" });
        },
        onLeaveBack: () => {
          gsap.to(pill, {
            left: "0px",
            right: "0px",
            height: "80px",
            borderRadius: "0px",
            duration: 0.55,
            ease: "power3.inOut",
            background: "transparent",
            boxShadow: "none",
          });
          gsap.to(glow, { opacity: 0, duration: 0.35 });
        },
      });

      // ── 4. Scroll progress bar ────────────────────────────────
      const onScroll = () => {
        if (!progress) return;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct   = total > 0 ? window.scrollY / total : 0;
        gsap.to(progress, { scaleX: pct, duration: 0.1, ease: "none" });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, navRef);

    return () => ctx.revert();
  }, []);

  const handleNavigate = useCallback((href: string) => {
    setActiveHref(href);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      {/* ── Fixed nav shell — full-width, transparent, pointer-events: none ── */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[9000]"
        style={{ height: "96px", overflow: "visible", pointerEvents: "none" }}
      >
        {/* Ambient halo glow — fades in under pill after scroll */}
        <div
          ref={glowRef}
          className="absolute pointer-events-none"
          style={{
            top: "64px",
            left: "10%",
            right: "10%",
            height: "60px",
            background:
              "radial-gradient(ellipse at center top, rgba(201,168,76,0.07) 0%, transparent 75%)",
            filter: "blur(14px)",
          }}
        />

        {/* ── Morphing pill — starts full-width bar, floats on scroll ── */}
        <div
          ref={pillRef}
          className="absolute flex items-center overflow-hidden"
          style={{
            top: "10px",
            left: "0px",
            right: "0px",
            height: "80px",
            background: "transparent",
            borderRadius: "0px",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            pointerEvents: "all",
          }}
        >
          {/* Top gold shimmer accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.25) 20%, rgba(245,208,122,0.5) 50%, rgba(201,168,76,0.25) 80%, transparent 100%)",
            }}
          />

          {/* Scroll progress bar */}
          <div
            ref={progressRef}
            className="absolute bottom-0 left-0 right-0 h-[1.5px] origin-left pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, #C9A84C 30%, #F5D07A 50%, #C9A84C 70%, transparent)",
              transform: "scaleX(0)",
            }}
          />

          {/* Content row */}
          <div className="relative flex items-center w-full h-full px-8 md:px-12 lg:px-16 xl:px-20">
            {/* LEFT — Logo */}
            <div ref={logoRef} className="flex-1" style={{ opacity: 0 }}>
              <Logo />
            </div>

            {/* CENTER — Nav links */}
            <nav ref={linksRef} className="hidden md:flex items-center gap-5">
              {NAV_LINKS.map((link, i) => (
                <NavLink
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  isActive={activeHref === link.href}
                  index={i}
                  onClick={() => handleNavigate(link.href)}
                />
              ))}
            </nav>

            {/* RIGHT — CTA + Hamburger */}
            <div className="flex-1 flex items-center justify-end gap-4">
              {/* Thin vertical separator */}
              <div
                className="hidden md:block self-stretch my-[18px] w-px"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
              <div ref={ctaRef} className="ml-4 md:ml-5" style={{ opacity: 0 }}>
                <CTAButton />
              </div>

              {/* Hamburger */}
              <motion.button
                className="md:hidden flex flex-col justify-center items-end gap-[6px] w-8 h-8 bg-transparent border-none cursor-pointer focus:outline-none"
                onClick={() => setMenuOpen(v => !v)}
                animate={menuOpen ? "open" : "closed"}
                aria-label="Toggle navigation menu"
              >
                <motion.span
                  className="block h-px origin-center"
                  style={{ background: "#C9A84C", width: "28px" }}
                  variants={lineTopVariants}
                />
                <motion.span
                  className="block h-px origin-center"
                  style={{ background: "#C9A84C", width: "18px" }}
                  variants={lineMidVariants}
                />
                <motion.span
                  className="block h-px origin-center"
                  style={{ background: "#C9A84C", width: "28px" }}
                  variants={lineBotVariants}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
        activeHref={activeHref}
        onNavigate={handleNavigate}
      />
    </>
  );
}
