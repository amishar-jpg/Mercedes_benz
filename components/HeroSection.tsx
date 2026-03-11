"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLDivElement>(null);
  const titleLine2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.2 });

      // Video fade in
      tl.fromTo(
        videoRef.current,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" },
        0
      );

      // Overlay dark gradient fade in
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power2.inOut" },
        0.3
      );

      // Eyebrow line
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20, letterSpacing: "0.1em" },
        { opacity: 1, y: 0, letterSpacing: "0.4em", duration: 1, ease: "power3.out" },
        0.8
      );

      // Title line 1 — clip up
      tl.fromTo(
        titleLine1Ref.current,
        { clipPath: "inset(100% 0% 0% 0%)", y: 40 },
        { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.1, ease: "power4.out" },
        1.0
      );

      // Title line 2 — clip up with slight delay
      tl.fromTo(
        titleLine2Ref.current,
        { clipPath: "inset(100% 0% 0% 0%)", y: 40 },
        { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.1, ease: "power4.out" },
        1.15
      );

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        1.5
      );

      // CTA buttons
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        1.7
      );

      // Stats bar
      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        1.9
      );

      // Scroll indicator bounce
      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        2.2
      );

      const scrollDot = scrollIndicatorRef.current?.querySelector(".scroll-dot") ?? null;
      gsap.to(scrollDot, {
        y: 10,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 3.2,
      });

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.to(videoRef.current, {
            y: self.progress * 120,
            scale: 1 + self.progress * 0.06,
            duration: 0,
          });
          gsap.to(overlayRef.current, {
            opacity: 0.6 + self.progress * 0.4,
            duration: 0,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const heroStats = [
    { value: "3.5s", label: "0-100 km/h" },
    { value: "V8", label: "AMG Biturbo" },
    { value: "510", label: "Horsepower" },
    { value: "700", label: "Nm Torque" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Cinematic gradient overlays */}
      <div
        ref={overlayRef}
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,8,0.75) 0%, rgba(8,8,8,0.2) 40%, rgba(8,8,8,0.2) 60%, rgba(8,8,8,0.85) 100%)",
        }}
      />
      {/* Left vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,8,8,0.6) 0%, transparent 40%, transparent 60%, rgba(8,8,8,0.3) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-20 px-8 md:px-16 lg:px-24">
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="opacity-0 mb-6 flex items-center gap-4"
        >
          <span
            className="text-[#b8962e]"
            style={{ fontSize: "10px", letterSpacing: "0.4em", fontWeight: 400, textTransform: "uppercase" }}
          >
            The New Generation
          </span>
          <span className="inline-block w-12 h-px bg-[#b8962e]" />
          <span
            className="text-white/40"
            style={{ fontSize: "10px", letterSpacing: "0.3em", fontWeight: 300, textTransform: "uppercase" }}
          >
            2026
          </span>
        </div>

        {/* Big headline */}
        <div className="mb-4 overflow-hidden">
          <h1
            ref={titleLine1Ref}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(52px, 9vw, 140px)",
              fontWeight: 200,
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              clipPath: "inset(100% 0% 0% 0%)",
              color: "#f5f5f5",
            }}
          >
            Mercedes
          </h1>
        </div>
        <div className="mb-8 overflow-hidden">
          <h1
            ref={titleLine2Ref}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(52px, 9vw, 140px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              clipPath: "inset(100% 0% 0% 0%)",
              background: "linear-gradient(135deg, #ffffff 0%, #b8962e 60%, #f5d78e 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            -Benz AMG
          </h1>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="opacity-0 mb-10 text-white/50 max-w-md"
          style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.8, letterSpacing: "0.02em" }}
        >
          Where engineering transcends art. Every detail sculpted for those
          who demand nothing short of perfection.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="opacity-0 flex flex-wrap items-center gap-5 mb-16">
          <a
            href="#configure"
            className="group relative flex items-center gap-3 px-9 py-4 overflow-hidden"
            style={{
              background: "#b8962e",
              color: "#080808",
              fontSize: "11px",
              letterSpacing: "0.25em",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            <span className="relative z-10">Configure Now</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
            <span
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
              style={{ background: "#c9a93f" }}
            />
          </a>
          <a
            href="#discover"
            className="flex items-center gap-3 px-9 py-4 border border-white/20 hover:border-white/60 transition-colors duration-300"
            style={{
              color: "#f5f5f5",
              fontSize: "11px",
              letterSpacing: "0.25em",
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            Discover More
          </a>
        </div>

        {/* Stats bar */}
        <div
          ref={statsRef}
          className="opacity-0 flex items-center gap-0 border-t border-white/10 pt-8"
        >
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="flex-1 border-r border-white/10 last:border-r-0 pr-8 mr-8 last:pr-0 last:mr-0"
            >
              <div
                className="stat-number"
                style={{
                  fontSize: "clamp(22px, 3vw, 38px)",
                  fontWeight: 200,
                  color: "#f5f5f5",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                className="mt-1 text-white/40 uppercase"
                style={{ fontSize: "9px", letterSpacing: "0.3em", fontWeight: 400 }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator — right side */}
      <div
        ref={scrollIndicatorRef}
        className="absolute right-8 bottom-24 opacity-0 flex flex-col items-center gap-3"
      >
        <div
          className="text-white/30 uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.35em", writingMode: "vertical-rl" }}
        >
          Scroll
        </div>
        <div className="w-px h-16 bg-white/10 relative overflow-hidden">
          <div
            className="scroll-dot absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#b8962e] to-transparent"
          />
        </div>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-24 right-8 md:right-16 opacity-30">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M60 0 L60 60 L0 60" stroke="#b8962e" strokeWidth="0.5" fill="none" />
        </svg>
      </div>
    </section>
  );
}
