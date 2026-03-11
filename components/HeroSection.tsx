"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLHeadingElement>(null);
  const titleLine2Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt — small values so video stays crisp
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 18 });
  const videoRotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const videoRotateY = useTransform(springX, [-0.5, 0.5], [-3, 3]);
  const contentRotateX = useTransform(springY, [-0.5, 0.5], [1.5, -1.5]);
  const contentRotateY = useTransform(springX, [-0.5, 0.5], [-1.5, 1.5]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.3 });

      // Video fade in without scale — preserves HD quality
      tl.fromTo(
        videoRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2.8, ease: "power2.out" },
        0
      );

      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: "power2.inOut" },
        0.2
      );

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20, letterSpacing: "0.08em" },
        { opacity: 1, y: 0, letterSpacing: "0.42em", duration: 1.3, ease: "power3.out" },
        1.0
      );

      tl.fromTo(
        titleLine1Ref.current,
        { clipPath: "inset(100% 0% 0% 0%)", y: 70 },
        { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.4, ease: "expo.out" },
        1.15
      );

      tl.fromTo(
        titleLine2Ref.current,
        { clipPath: "inset(100% 0% 0% 0%)", y: 70 },
        { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.4, ease: "expo.out" },
        1.35
      );

      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
        1.75
      );

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        1.95
      );

      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        2.18
      );

      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        2.5
      );

      const scrollDot = scrollIndicatorRef.current?.querySelector(".scroll-dot") ?? null;
      gsap.to(scrollDot, {
        y: 14,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 3.5,
      });

      // Subtle parallax on scroll — no scale, just translate
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        onUpdate: (self) => {
          gsap.to(videoRef.current, {
            y: self.progress * 100,
            duration: 0,
          });
          gsap.to(overlayRef.current, {
            opacity: 0.4 + self.progress * 0.6,
            duration: 0,
          });
        },
      });

      // Mouse-following glow
      const onMouseMove = (e: MouseEvent) => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect || !glowRef.current) return;
        gsap.to(glowRef.current, {
          x: e.clientX - rect.left - 250,
          y: e.clientY - rect.top - 250,
          duration: 1.2,
          ease: "power2.out",
        });
        mouseX.set(e.clientX / window.innerWidth - 0.5);
        mouseY.set(e.clientY / window.innerHeight - 0.5);
      };

      const el = sectionRef.current;
      el?.addEventListener("mousemove", onMouseMove);
      return () => el?.removeEventListener("mousemove", onMouseMove);
    }, sectionRef);

    return () => ctx.revert();
  }, [mouseX, mouseY]);

  const heroStats = [
    { value: "3.5s", label: "0–100 km/h" },
    { value: "V8", label: "AMG Biturbo" },
    { value: "510", label: "Horsepower" },
    { value: "700", label: "Nm Torque" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Mouse glow */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none z-20"
        style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,150,46,0.10) 0%, transparent 65%)",
          filter: "blur(60px)",
          willChange: "transform",
          top: 0,
          left: 0,
        }}
      />

      {/* Video — HD quality preserved: no scale transform */}
      <motion.div
        className="absolute inset-0"
        style={{ rotateX: videoRotateX, rotateY: videoRotateY, scale: 1.0 }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ imageRendering: "auto" }}
        />
      </motion.div>

      {/* Gradient overlays */}
      <div
        ref={overlayRef}
        className="absolute inset-0 opacity-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(7,7,7,0.72) 0%, rgba(7,7,7,0.10) 30%, rgba(7,7,7,0.08) 55%, rgba(7,7,7,0.94) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(7,7,7,0.65) 0%, transparent 38%, transparent 62%, rgba(7,7,7,0.35) 100%)",
        }}
      />

      {/* Content wrapper with subtle 3D tilt */}
      <motion.div
        className="relative z-40 flex h-full flex-col justify-end"
        style={{
          paddingBottom: "clamp(60px, 8vh, 100px)",
          paddingLeft: "clamp(28px, 6vw, 96px)",
          paddingRight: "clamp(28px, 6vw, 96px)",
          rotateX: contentRotateX,
          rotateY: contentRotateY,
        }}
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="opacity-0 mb-8 flex items-center gap-5"
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.42em",
              color: "#b8962e",
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            The New Generation
          </span>
          <span className="inline-block w-10 h-px bg-[#b8962e] opacity-70" />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.3em",
              color: "rgba(240,237,232,0.35)",
              fontWeight: 300,
              textTransform: "uppercase",
            }}
          >
            2026
          </span>
        </div>

        {/* Headline */}
        <div className="mb-4 overflow-hidden">
          <h1
            ref={titleLine1Ref}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(60px, 10vw, 156px)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 0.92,
              clipPath: "inset(100% 0% 0% 0%)",
              color: "#f0ede8",
            }}
          >
            Mercedes
          </h1>
        </div>
        <div className="mb-10 overflow-hidden">
          <h1
            ref={titleLine2Ref}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(60px, 10vw, 156px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 0.92,
              clipPath: "inset(100% 0% 0% 0%)",
              background: "linear-gradient(110deg, #f0ede8 0%, #e8c86a 38%, #b8962e 65%, #c8a030 100%)",
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
          className="opacity-0 mb-12 max-w-lg"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "16px",
            fontWeight: 300,
            lineHeight: 1.9,
            letterSpacing: "0.02em",
            color: "rgba(240,237,232,0.50)",
          }}
        >
          Where engineering transcends art. Every detail sculpted for those
          who demand nothing short of perfection.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="opacity-0 flex flex-wrap items-center gap-6 mb-20">
          {/* Primary — no overflow:hidden on motion.a, use inner wrapper instead */}
          <motion.a
            href="#configure"
            className="group relative flex items-center gap-4"
            style={{
              background: "linear-gradient(110deg, #b8962e, #d4a843)",
              color: "#070707",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              letterSpacing: "0.1em",
              fontWeight: 600,
              textTransform: "uppercase",
              overflow: "hidden",
              padding: "16px 36px",
              borderRadius: "4px",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative z-10 whitespace-nowrap" style={{ color: "#070707" }}>
              Configure Now
            </span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: "#070707" }}
            >
              →
            </motion.span>
            {/* Fill on hover — ensure z-index is below text */}
            <span
              className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out"
              style={{ background: "linear-gradient(110deg, #d4a843, #e8c86a)", zIndex: 0 }}
            />
          </motion.a>

          {/* Secondary */}
          <motion.a
            href="#models"
            className="flex items-center gap-4"
            style={{
              border: "1px solid rgba(240,237,232,0.20)",
              color: "rgba(240,237,232,0.85)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              letterSpacing: "0.1em",
              fontWeight: 500,
              textTransform: "uppercase",
              backdropFilter: "blur(10px)",
              padding: "16px 36px",
              borderRadius: "4px",
            }}
            whileHover={{
              scale: 1.02,
              borderColor: "rgba(184,150,46,0.55)",
              color: "#f0ede8",
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Discover More
          </motion.a>
        </div>

        {/* Stats bar */}
        <div
          ref={statsRef}
          className="opacity-0 flex items-center border-t pt-8"
          style={{ borderColor: "rgba(240,237,232,0.08)" }}
        >
          {heroStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex-1 border-r last:border-r-0 pr-8 mr-8 last:pr-0 last:mr-0"
              style={{ borderColor: "rgba(240,237,232,0.08)" }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="stat-number"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 3.2vw, 42px)",
                  fontWeight: 300,
                  color: "#f0ede8",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                className="mt-1.5 uppercase"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "9px",
                  letterSpacing: "0.32em",
                  fontWeight: 400,
                  color: "rgba(240,237,232,0.35)",
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute right-10 bottom-28 opacity-0 flex flex-col items-center gap-4 z-40"
      >
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "8px",
            letterSpacing: "0.4em",
            writingMode: "vertical-rl",
            color: "rgba(240,237,232,0.28)",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </div>
        <div className="w-px h-20 relative overflow-hidden" style={{ background: "rgba(240,237,232,0.08)" }}>
          <div
            className="scroll-dot absolute top-0 left-0 w-full h-6"
            style={{ background: "linear-gradient(180deg, #b8962e, transparent)" }}
          />
        </div>
      </div>

      {/* Corner accent — top right */}
      <motion.div
        className="absolute top-28 right-10 md:right-20 z-40"
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M48 0 L48 48 L0 48" stroke="#b8962e" strokeWidth="0.6" fill="none" />
          <path d="M40 0 L40 40 L0 40" stroke="#b8962e" strokeWidth="0.3" fill="none" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Subtle floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-20"
          style={{
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "#b8962e",
            left: `${15 + i * 14}%`,
            bottom: `${25 + (i % 3) * 12}%`,
            opacity: 0.4,
          }}
          animate={{
            y: [0, -28, 0],
            opacity: [0.15, 0.55, 0.15],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
        />
      ))}
    </section>
  );
}
