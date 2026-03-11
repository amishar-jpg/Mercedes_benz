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
        statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        2.18
      );

      // Animated rotation, scroll down into next page
      gsap.to(videoRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          pin: false,
        },
        y: () => window.innerHeight,
        rotationZ: 720,
        scale: 0.15,
        opacity: 0,
        borderRadius: "40px",
        ease: "power2.inOut",
      });

      gsap.to(overlayRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        opacity: 1,
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
      className="relative h-screen w-full"
      style={{ zIndex: 10 }}
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
          src="/firefly.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ imageRendering: "auto", willChange: "transform, opacity, border-radius" }}
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
              fontSize: "clamp(48px, 8vw, 120px)",
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
              fontSize: "clamp(48px, 8vw, 120px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 0.92,
              clipPath: "inset(100% 0% 0% 0%)",
              color: "#b8962e",
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

        {/* Stats bar */}
        <div
          ref={statsRef}
          className="opacity-0 flex items-center border-t pt-8"
          style={{ borderColor: "rgba(240,237,232,0.08)", marginTop: "40px" }}
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
