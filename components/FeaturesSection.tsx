"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const MODELS = [
  {
    tag: "AMG GT",
    name: "C63\nAMG",
    spec: "510 hp · V8 Biturbo",
    badge: "Most Wanted",
    detail: "Race-bred performance meets unexpected luxury. Built for those who blur the line between track and road.",
    color: "#0c0c0c",
    accent: "#b8962e",
    glow: "rgba(184,150,46,0.14)",
  },
  {
    tag: "S-Class",
    name: "S 580\nMaybach",
    spec: "503 hp · V8 Biturbo",
    badge: "Icon",
    detail: "The ultimate expression of Mercedes luxury. A rear suite of calm and power in equal measure.",
    color: "#0f0f0f",
    accent: "#d0d0d0",
    glow: "rgba(210,210,210,0.08)",
  },
  {
    tag: "EQS",
    name: "EQS\n580+",
    spec: "523 hp · All-Electric",
    badge: "Future",
    detail: "770 km range. Zero emissions. The electric flagship that redefines everything you knew about luxury.",
    color: "#08080f",
    accent: "#6aa3e8",
    glow: "rgba(106,163,232,0.13)",
  },
  {
    tag: "G-Class",
    name: "G 63\nAMG",
    spec: "577 hp · V8 Biturbo",
    badge: "Legend",
    detail: "50 years of unstoppable. Iconic silhouette, modern AMG heart. No terrain ever refused.",
    color: "#0a0a0a",
    accent: "#b8962e",
    glow: "rgba(184,150,46,0.11)",
  },
  {
    tag: "GLE",
    name: "GLE 53\nCoupé",
    spec: "435 hp · Inline-6",
    badge: "Dynamism",
    detail: "SUV body language. Sports car soul. The coupé silhouette that redefined an entire segment.",
    color: "#0d0905",
    accent: "#c87850",
    glow: "rgba(200,120,80,0.11)",
  },
  {
    tag: "CLA",
    name: "CLA\nClass",
    spec: "221 hp · AMG Line",
    badge: "Entry Icon",
    detail: "The most aerodynamic production car ever built. Ambition at its most attainable.",
    color: "#07090f",
    accent: "#7bbcd0",
    glow: "rgba(123,188,208,0.11)",
  },
];

function ModelCard({ model, index }: { model: typeof MODELS[0]; index: number }) {
  const shineRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const shadowColor = model.glow;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);

    if (shineRef.current) {
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      shineRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.06) 0%, transparent 55%)`;
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
      className="model-card relative overflow-hidden cursor-pointer group flex flex-col"
      style={{
        background: model.color,
        border: "1px solid rgba(240,237,232,0.055)",
        height: index === 0 || index === 3 ? 440 : 380,
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 70, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.1, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        boxShadow: `0 40px 80px rgba(0,0,0,0.6), 0 0 50px ${shadowColor}`,
        borderColor: `${model.accent}25`,
      }}
    >
      {/* Shine */}
      <div
        ref={shineRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 z-20"
      />

      {/* Ambient glow orb */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${model.glow} 0%, transparent 70%)`,
          filter: "blur(30px)",
          top: "8px",
          right: "16px",
        }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: index * 0.35 }}
      />

      {/* Top badges */}
      <div className="flex items-center justify-between relative z-10" style={{ padding: "24px 24px 0" }}>
        <motion.span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "9px",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: model.accent,
            fontWeight: 500,
          }}
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          {model.tag}
        </motion.span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "8px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(240,237,232,0.22)",
            border: `1px solid ${model.accent}25`,
            padding: "3px 10px",
          }}
        >
          {model.badge}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col justify-end flex-1 relative z-10 gap-3" style={{ padding: "0 24px 28px" }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(30px, 4.5vw, 52px)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 0.95,
            color: "#f0ede8",
            whiteSpace: "pre-line",
            fontStyle: "italic",
          }}
        >
          {model.name}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            fontWeight: 400,
            color: model.accent,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {model.spec}
        </p>

        <p
          className="max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-700"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12.5px",
            fontWeight: 300,
            lineHeight: 1.8,
            color: "rgba(240,237,232,0.40)",
            letterSpacing: "0.01em",
          }}
        >
          {model.detail}
        </p>

        <div
          className="flex items-center gap-3 mt-3 pt-5"
          style={{ borderTop: `1px solid ${model.accent}12` }}
        >
          <motion.span
            className="h-px"
            style={{ background: model.accent, width: 0 }}
            whileHover={{ width: 24 }}
            animate={{ width: 0 }}
            transition={{ duration: 0.4 }}
          />
          <span
            className="text-white/25 group-hover:text-white/65 transition-colors duration-400 uppercase"
            style={{ fontFamily: "var(--font-body)", fontSize: "9px", letterSpacing: "0.32em" }}
          >
            Explore
          </span>
          <motion.span
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ color: model.accent, fontSize: "13px" }}
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            →
          </motion.span>
        </div>
      </div>

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: `linear-gradient(0deg, ${model.color} 0%, transparent 100%)` }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none"
        style={{ borderTop: `1px solid ${model.accent}35`, borderLeft: `1px solid ${model.accent}35` }} />
      <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none"
        style={{ borderBottom: `1px solid ${model.accent}30`, borderRight: `1px solid ${model.accent}30` }} />
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="models"
      className="relative"
      style={{
        background: "#070707",
        overflow: "hidden",
        paddingTop: "clamp(100px, 16vh, 180px)",
        paddingBottom: "clamp(100px, 16vh, 180px)",
        marginTop: "40px",
        marginBottom: "40px",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 100% 55% at 50% 100%, rgba(184,150,46,0.035) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10"
        style={{ paddingLeft: "clamp(28px, 6vw, 96px)", paddingRight: "clamp(28px, 6vw, 96px)" }}
      >
        {/* Heading */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-5 mb-7">
            <span className="eyebrow">03 — The Lineup</span>
            <motion.span
              className="inline-block h-px bg-[#b8962e]/35"
              initial={{ width: 0 }}
              whileInView={{ width: 44 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.9 }}
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 7vw, 100px)",
                fontWeight: 300,
                letterSpacing: "-0.025em",
                lineHeight: 1.0,
                color: "#f0ede8",
                fontStyle: "italic",
              }}
            >
              Choose Your
              <br />
              <span
                style={{
                  background: "linear-gradient(110deg, #b8962e, #e8c86a, #c8a030)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontWeight: 700,
                  fontStyle: "normal",
                }}
              >
                Excellence
              </span>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 300,
                lineHeight: 1.9,
                color: "rgba(240,237,232,0.38)",
                maxWidth: "340px",
                letterSpacing: "0.01em",
              }}
            >
              From 221 to 577 horsepower, every model in the Mercedes-Benz
              family embodies one principle: the best or nothing.
            </p>
          </div>
        </motion.div>

        {/* Model cards grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
