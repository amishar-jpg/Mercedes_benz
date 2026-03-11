"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 510, unit: "hp", label: "Peak Horsepower", sub: "AMG V8 Biturbo" },
  { value: 700, unit: "Nm", label: "Maximum Torque", sub: "At 2,500 – 4,500 rpm" },
  { value: 3.5, unit: "s", label: "0 – 100 km/h", sub: "With Launch Control" },
  { value: 299, unit: "km/h", label: "Top Speed", sub: "Electronically limited" },
];

const PILLARS = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
        <path d="M4 16 L16 4 L28 16 L16 28 Z" stroke="#b8962e" strokeWidth="1.2" fill="none" />
        <circle cx="16" cy="16" r="4" stroke="#b8962e" strokeWidth="1" fill="none" />
        <path d="M16 4 L16 12 M16 20 L16 28 M4 16 L12 16 M20 16 L28 16" stroke="#b8962e" strokeWidth="0.5" opacity="0.4" />
      </svg>
    ),
    title: "Aerodynamic Excellence",
    body: "Drag coefficient of 0.20 Cd — the most aerodynamic production saloon ever.",
    accent: "#b8962e",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="16" rx="2" stroke="#b8962e" strokeWidth="1.2" fill="none" />
        <path d="M10 16 H22" stroke="#b8962e" strokeWidth="1" />
        <circle cx="16" cy="16" r="3" stroke="#b8962e" strokeWidth="1" fill="none" />
        <rect x="8" y="12" width="3" height="2" rx="0.5" fill="#b8962e" opacity="0.4" />
        <rect x="21" y="12" width="3" height="2" rx="0.5" fill="#b8962e" opacity="0.4" />
      </svg>
    ),
    title: "MBUX Hyperscreen",
    body: "56-inch glass-curved instrument combining three integrated displays into one.",
    accent: "#5c8de8",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
        <path d="M16 4 L18 12 L26 12 L20 17 L22 26 L16 21 L10 26 L12 17 L6 12 L14 12 Z" stroke="#b8962e" strokeWidth="1.2" fill="none" />
        <circle cx="16" cy="16" r="2" fill="#b8962e" opacity="0.5" />
      </svg>
    ),
    title: "Premium Nappa Leather",
    body: "Hand-stitched AMG Performance seats with 10-zone massage and climate control.",
    accent: "#c87850",
  },
];

function StatCard({ s, index }: { s: typeof STATS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = valRef.current;
    if (!el) return;
    const isDecimal = s.value % 1 !== 0;
    const proxy = { val: 0 };
    const tween = gsap.to(proxy, {
      val: s.value,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = isDecimal ? proxy.val.toFixed(1) : Math.round(proxy.val).toString();
      },
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
      },
    });
    return () => { tween.kill(); };
  }, [s.value]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(useSpring(mouseY, { stiffness: 200, damping: 30 }), [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(useSpring(mouseX, { stiffness: 200, damping: 30 }), [-0.5, 0.5], [-6, 6]);

  return (
    <motion.div
      ref={cardRef}
      className="stat-card group py-10 px-8 flex flex-col gap-2 relative overflow-hidden"
      style={{
        borderRight: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{ background: "rgba(184,150,46,0.03)" }}
        transition={{ duration: 0.3 }}
      />

      {/* Animated accent bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, #b8962e, transparent)", scaleX: 0, transformOrigin: "left" }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
      />

      <div className="flex items-end gap-1">
        <span
          ref={valRef}
          className="stat-number"
          style={{
            fontSize: "clamp(36px, 5vw, 68px)",
            fontWeight: 200,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "#f5f5f5",
          }}
        >
          0
        </span>
        <span
          style={{
            fontSize: "clamp(14px, 1.8vw, 22px)",
            fontWeight: 300,
            color: "#b8962e",
            paddingBottom: "5px",
          }}
        >
          {s.unit}
        </span>
      </div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(245,245,245,0.75)",
        }}
      >
        {s.label}
      </div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 300,
          color: "rgba(245,245,245,0.3)",
          letterSpacing: "0.04em",
        }}
      >
        {s.sub}
      </div>
      <motion.div
        className="h-px bg-[#b8962e] mt-2"
        initial={{ width: 0 }}
        whileHover={{ width: 32 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

export default function PerformanceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.6,
          ease: "power3.inOut",
          transformOrigin: "left center",
          scrollTrigger: { trigger: dividerRef.current, start: "top 88%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="performance"
      className="relative py-32 md:py-48"
      style={{
        background: "linear-gradient(180deg, #080808 0%, #0c0c0c 50%, #080808 100%)",
        overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(184,150,46,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,150,46,1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,150,46,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="px-8 md:px-16 lg:px-24 relative z-10">
        {/* Section heading */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-center gap-4 mb-5">
            <span style={{ fontSize: "10px", letterSpacing: "0.42em", color: "#b8962e", textTransform: "uppercase", fontWeight: 400 }}>
              02 — Performance
            </span>
            <motion.span
              className="inline-block h-px bg-[#b8962e]/40"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </div>
          <h2
            style={{
              fontSize: "clamp(36px, 6vw, 88px)",
              fontWeight: 200,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: "#f5f5f5",
            }}
          >
            Engineering
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
              Beyond Limits
            </span>
          </h2>
        </motion.div>

        {/* Divider */}
        <div
          ref={dividerRef}
          className="mb-16 h-px"
          style={{
            background: "linear-gradient(90deg, #b8962e, rgba(184,150,46,0.2), transparent)",
            transformOrigin: "left center",
          }}
        />

        {/* Stats grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-24"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", perspective: "800px" }}
        >
          {STATS.map((s, i) => (
            <StatCard key={s.label} s={s} index={i} />
          ))}
        </div>

        {/* Feature pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              className="group flex flex-col gap-5 p-8 relative overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              initial={{ opacity: 0, y: 40, x: -20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ y: -8, borderColor: `${p.accent}40` }}
            >
              {/* Hover background */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(ellipse 80% 80% at 50% 0%, ${p.accent}08 0%, transparent 70%)`,
                }}
                transition={{ duration: 0.4 }}
              />

              {/* Icon with glow */}
              <motion.div
                className="relative w-fit"
                animate={{ filter: ["drop-shadow(0 0 0px transparent)", `drop-shadow(0 0 8px ${p.accent}60)`, "drop-shadow(0 0 0px transparent)"] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              >
                {p.icon}
              </motion.div>

              <div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    color: "#f5f5f5",
                    marginBottom: "10px",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: "rgba(245,245,245,0.45)",
                  }}
                >
                  {p.body}
                </p>
              </div>

              <motion.div
                className="h-px mt-auto"
                style={{ background: `linear-gradient(90deg, ${p.accent}, transparent)` }}
                initial={{ scaleX: 0.1, transformOrigin: "left" }}
                whileHover={{ scaleX: 1 }}
                whileInView={{ scaleX: 0.15 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              />

              {/* Corner accent */}
              <div
                className="absolute top-0 left-0 w-6 h-6 pointer-events-none"
                style={{ borderTop: `1px solid ${p.accent}50`, borderLeft: `1px solid ${p.accent}50` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
