"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const MODELS = [
  {
    tag: "AMG GT",
    name: "C63\nAMG",
    spec: "510 hp · V8 Biturbo",
    badge: "Most Wanted",
    detail: "Race-bred performance meets unexpected luxury. Built for those who blur the line.",
    color: "#0e0e0e",
    accent: "#b8962e",
    glow: "rgba(184,150,46,0.15)",
  },
  {
    tag: "S-Class",
    name: "S 580\nMaybach",
    spec: "503 hp · V8 Biturbo",
    badge: "Icon",
    detail: "The ultimate expression of Mercedes luxury. Rear suite comfort, front-row power.",
    color: "#111111",
    accent: "#d4d4d4",
    glow: "rgba(212,212,212,0.1)",
  },
  {
    tag: "EQS",
    name: "EQS\n580+",
    spec: "523 hp · All-Electric",
    badge: "Future",
    detail: "770 km range. Zero emissions. The electric flagship that redefines everything.",
    color: "#090912",
    accent: "#5c8de8",
    glow: "rgba(92,141,232,0.15)",
  },
  {
    tag: "G-Class",
    name: "G 63\nAMG",
    spec: "577 hp · V8 Biturbo",
    badge: "Legend",
    detail: "50 years of unstoppable. Iconic silhouette, modern AMG heart. No terrain refused.",
    color: "#0a0a0a",
    accent: "#b8962e",
    glow: "rgba(184,150,46,0.12)",
  },
  {
    tag: "GLE",
    name: "GLE 53\nCoupé",
    spec: "435 hp · Inline-6",
    badge: "Dynamism",
    detail: "SUV body language. Sports car heart. The coupé that redefines the segment.",
    color: "#0d0905",
    accent: "#c87850",
    glow: "rgba(200,120,80,0.12)",
  },
  {
    tag: "CLA",
    name: "CLA\nClass",
    spec: "221 hp · AMG Line",
    badge: "Entry Icon",
    detail: "The most aerodynamic production car ever built. Art meets entry-level ambition.",
    color: "#080e0f",
    accent: "#88c0d0",
    glow: "rgba(136,192,208,0.12)",
  },
];

function ModelCard({ model, index }: { model: typeof MODELS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const shadowX = useTransform(springX, [-0.5, 0.5], ["-20px", "20px"]);
  const shadowY = useTransform(springY, [-0.5, 0.5], ["20px", "-20px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);

    if (shineRef.current) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      shineRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
      shineRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    if (shineRef.current) shineRef.current.style.opacity = "0";
  };

  return (
    <motion.div
      ref={cardRef}
      className="model-card relative overflow-hidden cursor-pointer group"
      style={{
        background: model.color,
        border: "1px solid rgba(255,255,255,0.06)",
        height: index === 0 || index === 3 ? 420 : 360,
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
        boxShadow: useTransform(
          [springX, springY] as Parameters<typeof useTransform>[0],
          ([x, y]: number[]) =>
            `${-x * 30}px ${-y * 30}px 60px rgba(0,0,0,0.5), 0 0 40px ${model.glow}`
        ),
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ z: 30 }}
      initial={{ opacity: 0, y: 80, rotateY: 12, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Shine overlay */}
      <div
        ref={shineRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 z-20"
        style={{ background: "transparent" }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse 100% 100% at 50% 0%, ${model.glow} 0%, transparent 60%)` }}
      />

      {/* Top badges */}
      <div className="flex items-center justify-between p-6 pb-0 relative z-10">
        <motion.span
          style={{
            fontSize: "9px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: model.accent,
            fontWeight: 500,
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {model.tag}
        </motion.span>
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            border: `1px solid ${model.accent}30`,
            padding: "3px 10px",
          }}
        >
          {model.badge}
        </span>
      </div>

      {/* 3D accent orb */}
      <motion.div
        className="absolute top-12 right-4 pointer-events-none"
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${model.accent}20 0%, transparent 70%)`,
          filter: "blur(20px)",
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
      />

      {/* Body */}
      <div className="flex-1 flex flex-col justify-end p-6 relative z-10 gap-3 h-full">
        <h3
          style={{
            fontSize: "clamp(28px, 4vw, 50px)",
            fontWeight: 200,
            letterSpacing: "-0.02em",
            lineHeight: 1.0,
            color: "#f5f5f5",
            whiteSpace: "pre-line",
            marginTop: "auto",
          }}
        >
          {model.name}
        </h3>

        <p
          style={{
            fontSize: "11px",
            fontWeight: 400,
            color: model.accent,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {model.spec}
        </p>

        <p
          className="max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-600"
          style={{
            fontSize: "12px",
            fontWeight: 300,
            lineHeight: 1.75,
            color: "rgba(245,245,245,0.45)",
          }}
        >
          {model.detail}
        </p>

        <div
          className="flex items-center gap-3 mt-2 pt-4"
          style={{ borderTop: `1px solid ${model.accent}15` }}
        >
          <motion.span
            className="h-px"
            style={{ background: model.accent }}
            initial={{ width: 0 }}
            whileHover={{ width: 24 }}
            transition={{ duration: 0.4 }}
            animate={{ width: 0 }}
          />
          <span
            className="text-white/30 group-hover:text-white/70 transition-colors duration-300 uppercase"
            style={{ fontSize: "10px", letterSpacing: "0.3em" }}
          >
            Explore
          </span>
          <motion.span
            className="ml-auto opacity-0 group-hover:opacity-100"
            style={{ color: model.accent, fontSize: "12px" }}
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            →
          </motion.span>
        </div>
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
        style={{ background: `linear-gradient(0deg, ${model.color} 0%, transparent 100%)` }}
      />

      {/* Corner accent lines */}
      <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none"
        style={{ borderTop: `1px solid ${model.accent}40`, borderLeft: `1px solid ${model.accent}40` }}
      />
      <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none"
        style={{ borderBottom: `1px solid ${model.accent}40`, borderRight: `1px solid ${model.accent}40` }}
      />
    </motion.div>
  );
}

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="models"
      className="relative py-32 md:py-48"
      style={{ background: "#080808", overflow: "hidden" }}
    >
      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(184,150,46,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="px-8 md:px-16 lg:px-24 relative z-10">
        {/* Heading */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-center gap-4 mb-5">
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.42em",
                color: "#b8962e",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              03 — The Lineup
            </span>
            <motion.span
              className="inline-block h-px bg-[#b8962e]/40"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2
              style={{
                fontSize: "clamp(36px, 6vw, 88px)",
                fontWeight: 200,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: "#f5f5f5",
              }}
            >
              Choose Your
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #b8962e, #f5d78e, #d4a843)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 700,
                }}
              >
                Excellence
              </span>
            </h2>
            <p
              className="max-w-sm"
              style={{
                fontSize: "13px",
                fontWeight: 300,
                lineHeight: 1.8,
                color: "rgba(245,245,245,0.4)",
              }}
            >
              From 221 to 577 horsepower, every model in the Mercedes-Benz
              family embodies one principle: the best or nothing.
            </p>
          </div>
        </motion.div>

        {/* Model cards grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          style={{ perspective: "1400px" }}
        >
          {MODELS.map((model, i) => (
            <ModelCard key={model.name} model={model} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
