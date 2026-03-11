"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const [frameLoaded, setFrameLoaded] = useState(false);

  // Extract first frame from video to canvas for a sharp hero still
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const captureFrame = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setFrameLoaded(true);
    };
    if (video.readyState >= 2) captureFrame();
    else video.addEventListener("loadeddata", captureFrame, { once: true });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.2 });

      tl.fromTo(
        videoRef.current,
        { opacity: 0, scale: 1.12 },
        { opacity: 1, scale: 1, duration: 2.5, ease: "power2.out" },
        0
      );

      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.8, ease: "power2.inOut" },
        0.3
      );

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 24, letterSpacing: "0.05em" },
        { opacity: 1, y: 0, letterSpacing: "0.42em", duration: 1.2, ease: "power3.out" },
        0.9
      );

      tl.fromTo(
        titleLine1Ref.current,
        { clipPath: "inset(100% 0% 0% 0%)", y: 60, skewY: 4 },
        { clipPath: "inset(0% 0% 0% 0%)", y: 0, skewY: 0, duration: 1.2, ease: "power4.out" },
        1.1
      );

      tl.fromTo(
        titleLine2Ref.current,
        { clipPath: "inset(100% 0% 0% 0%)", y: 60, skewY: 4 },
        { clipPath: "inset(0% 0% 0% 0%)", y: 0, skewY: 0, duration: 1.2, ease: "power4.out" },
        1.28
      );

      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        1.65
      );

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        1.85
      );

      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        2.05
      );

      tl.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        2.4
      );

      const scrollDot = scrollIndicatorRef.current?.querySelector(".scroll-dot") ?? null;
      gsap.to(scrollDot, {
        y: 12,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 3.4,
      });

      // Parallax on scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.to(videoRef.current, {
            y: self.progress * 140,
            scale: 1 + self.progress * 0.08,
            duration: 0,
          });
          gsap.to(overlayRef.current, {
            opacity: 0.5 + self.progress * 0.5,
            duration: 0,
          });
        },
      });

      // Glow that follows mouse
      const onMouseMove = (e: MouseEvent) => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect || !glowRef.current) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gsap.to(glowRef.current, {
          x: x - 300,
          y: y - 300,
          duration: 0.8,
          ease: "power2.out",
        });
        mouseX.set((e.clientX / window.innerWidth - 0.5));
        mouseY.set((e.clientY / window.innerHeight - 0.5));
      };

      sectionRef.current?.addEventListener("mousemove", onMouseMove);
      return () => sectionRef.current?.removeEventListener("mousemove", onMouseMove);
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
      style={{ perspective: "1200px" }}
    >
      {/* Mouse-following glow orb */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none z-20"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,150,46,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          willChange: "transform",
        }}
      />

      {/* Background video with 3D tilt */}
      <motion.div
        className="absolute inset-0"
        style={{ rotateX, rotateY, scale: 1.04 }}
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
        />
      </motion.div>

      {/* Canvas frame snapshot — hidden, used for 3D scene */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Cinematic gradient overlays */}
      <div
        ref={overlayRef}
        className="absolute inset-0 opacity-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,8,0.8) 0%, rgba(8,8,8,0.15) 35%, rgba(8,8,8,0.15) 60%, rgba(8,8,8,0.92) 100%)",
        }}
      />
      {/* Side vignettes */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,8,8,0.7) 0%, transparent 35%, transparent 65%, rgba(8,8,8,0.4) 100%)",
        }}
      />

      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
        }}
      />

      {/* 3D floating content */}
      <motion.div
        className="relative z-40 flex h-full flex-col justify-end pb-20 px-8 md:px-16 lg:px-24"
        style={{ rotateX: useTransform(springY, [-0.5, 0.5], [2, -2]), rotateY: useTransform(springX, [-0.5, 0.5], [-2, 2]) }}
      >
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="opacity-0 mb-6 flex items-center gap-4"
        >
          <span
            className="text-[#b8962e]"
            style={{ fontSize: "10px", letterSpacing: "0.42em", fontWeight: 400, textTransform: "uppercase" }}
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
              fontSize: "clamp(54px, 9.5vw, 148px)",
              fontWeight: 200,
              letterSpacing: "-0.025em",
              lineHeight: 0.93,
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
              fontSize: "clamp(54px, 9.5vw, 148px)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 0.93,
              clipPath: "inset(100% 0% 0% 0%)",
              background: "linear-gradient(135deg, #ffffff 0%, #d4a843 40%, #f5d78e 70%, #b8962e 100%)",
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
          style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.85, letterSpacing: "0.025em" }}
        >
          Where engineering transcends art. Every detail sculpted for those
          who demand nothing short of perfection.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="opacity-0 flex flex-wrap items-center gap-5 mb-16">
          <motion.a
            href="#configure"
            className="group relative flex items-center gap-3 px-9 py-4 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #b8962e, #d4a843)",
              color: "#080808",
              fontSize: "11px",
              letterSpacing: "0.25em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="relative z-10">Configure Now</span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
            <span
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
              style={{ background: "linear-gradient(135deg, #d4a843, #f5d78e)" }}
            />
          </motion.a>

          <motion.a
            href="#discover"
            className="flex items-center gap-3 px-9 py-4 border border-white/20 hover:border-white/60 transition-all duration-400 backdrop-blur-sm"
            style={{
              color: "#f5f5f5",
              fontSize: "11px",
              letterSpacing: "0.25em",
              fontWeight: 400,
              textTransform: "uppercase",
            }}
            whileHover={{ scale: 1.03, borderColor: "rgba(184,150,46,0.6)" }}
            whileTap={{ scale: 0.97 }}
          >
            Discover More
          </motion.a>
        </div>

        {/* Stats bar */}
        <div
          ref={statsRef}
          className="opacity-0 flex items-center gap-0 border-t border-white/10 pt-8"
        >
          {heroStats.map((stat) => (
            <motion.div
              key={stat.label}
              className="flex-1 border-r border-white/10 last:border-r-0 pr-8 mr-8 last:pr-0 last:mr-0"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="stat-number"
                style={{
                  fontSize: "clamp(22px, 3vw, 40px)",
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
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute right-8 bottom-24 opacity-0 flex flex-col items-center gap-3 z-40"
      >
        <div
          className="text-white/30 uppercase"
          style={{ fontSize: "9px", letterSpacing: "0.35em", writingMode: "vertical-rl" }}
        >
          Scroll
        </div>
        <div className="w-px h-16 bg-white/10 relative overflow-hidden">
          <div
            className="scroll-dot absolute top-0 left-0 w-full h-5 bg-gradient-to-b from-[#b8962e] to-transparent"
          />
        </div>
      </div>

      {/* Corner decoration */}
      <motion.div
        className="absolute top-24 right-8 md:right-16 z-40"
        animate={{ opacity: [0.2, 0.5, 0.2], rotate: [0, 90, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M60 0 L60 60 L0 60" stroke="#b8962e" strokeWidth="0.5" fill="none" />
          <path d="M50 0 L50 50 L0 50" stroke="#b8962e" strokeWidth="0.3" fill="none" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Floating gold particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none z-30"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            borderRadius: "50%",
            background: "#b8962e",
            left: `${10 + i * 12}%`,
            bottom: `${20 + (i % 3) * 15}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </section>
  );
}
