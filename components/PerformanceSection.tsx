"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 510, unit: "hp", label: "Peak Horsepower", sub: "AMG V8 Biturbo" },
  { value: 700, unit: "Nm", label: "Maximum Torque", sub: "At 2,500–4,500 rpm" },
  { value: 3.5, unit: "s", label: "0–100 km/h", sub: "With Launch Control" },
  { value: 299, unit: "km/h", label: "Top Speed", sub: "Electronically limited" },
];

const PILLARS = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
        <path d="M4 16 L16 4 L28 16 L16 28 Z" stroke="#b8962e" strokeWidth="1" fill="none" />
        <circle cx="16" cy="16" r="3.5" stroke="#b8962e" strokeWidth="0.8" fill="none" />
        <path d="M16 4 L16 12.5 M16 19.5 L16 28 M4 16 L12.5 16 M19.5 16 L28 16" stroke="#b8962e" strokeWidth="0.5" opacity="0.35" />
      </svg>
    ),
    title: "Aerodynamic Excellence",
    body: "Drag coefficient of 0.20 Cd — the most aerodynamic production saloon ever built.",
    accent: "#b8962e",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="16" rx="2" stroke="#b8962e" strokeWidth="1" fill="none" />
        <path d="M10 16 H22" stroke="#b8962e" strokeWidth="0.8" />
        <circle cx="16" cy="16" r="2.5" stroke="#b8962e" strokeWidth="0.8" fill="none" />
        <rect x="8" y="12" width="2.5" height="1.5" rx="0.5" fill="#b8962e" opacity="0.35" />
        <rect x="21.5" y="12" width="2.5" height="1.5" rx="0.5" fill="#b8962e" opacity="0.35" />
      </svg>
    ),
    title: "MBUX Hyperscreen",
    body: "56-inch curved glass instrument panel combining three integrated displays seamlessly.",
    accent: "#6aa3e8",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
        <path d="M16 3 L18.5 11.5 L27 11.5 L20.5 17 L23 26 L16 21 L9 26 L11.5 17 L5 11.5 L13.5 11.5 Z" stroke="#b8962e" strokeWidth="1" fill="none" />
        <circle cx="16" cy="16" r="2" fill="#b8962e" opacity="0.4" />
      </svg>
    ),
    title: "Premium Nappa Leather",
    body: "Hand-stitched AMG Performance seats with 10-zone massage and climate control.",
    accent: "#c87850",
  },
];

function StatCard({ s, index }: { s: typeof STATS[0]; index: number }) {
  const valRef = useRef<HTMLSpanElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(useSpring(mouseY, { stiffness: 180, damping: 28 }), [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(useSpring(mouseX, { stiffness: 180, damping: 28 }), [-0.5, 0.5], [-5, 5]);

  useEffect(() => {
    const el = valRef.current;
    if (!el) return;
    const isDecimal = s.value % 1 !== 0;
    const proxy = { val: 0 };
    gsap.to(proxy, {
      val: s.value,
      duration: 2.4,
      ease: "power2.out",
      onUpdate: () => {
        if (el) el.textContent = isDecimal ? proxy.val.toFixed(1) : Math.round(proxy.val).toString();
      },
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
  }, [s.value]);

  return (
    <motion.div
      className="group py-14 px-9 flex flex-col gap-3 relative overflow-hidden"
      style={{
        border: "1px solid rgba(240,237,232,0.1)",
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      {/* Hover fill */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{ background: "rgba(184,150,46,0.025)" }}
        transition={{ duration: 0.4 }}
      />
      {/* Top shine bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, #b8962e, transparent)", scaleX: 0, transformOrigin: "left" }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.9 }}
      />

      <div className="flex items-end gap-2">
        <span
          ref={valRef}
          className="stat-number"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(40px, 5.5vw, 72px)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "#f0ede8",
          }}
        >
          0
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(14px, 1.8vw, 20px)",
            fontWeight: 300,
            color: "#b8962e",
            paddingBottom: "6px",
            letterSpacing: "0.05em",
          }}
        >
          {s.unit}
        </span>
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(240,237,232,0.72)",
        }}
      >
        {s.label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "11px",
          fontWeight: 300,
          color: "rgba(240,237,232,0.28)",
          letterSpacing: "0.04em",
        }}
      >
        {s.sub}
      </div>
      <motion.div
        className="h-px bg-[#b8962e] mt-2"
        style={{ width: 0 }}
        whileHover={{ width: 36 }}
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
          duration: 1.8,
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
      className="relative"
      style={{
        background: "linear-gradient(180deg, #070707 0%, #0a0a0a 50%, #070707 100%)",
        overflow: "hidden",
        paddingTop: "clamp(100px, 16vh, 180px)",
        paddingBottom: "clamp(100px, 16vh, 180px)",
        marginTop: "40px",
        marginBottom: "40px",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(184,150,46,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,150,46,1) 1px, transparent 1px)
          `,
          backgroundSize: "90px 90px",
          opacity: 0.022,
        }}
      />

      {/* Gold ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(184,150,46,0.04) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10"
        style={{
          paddingLeft: "clamp(32px, 7vw, 112px)",
          paddingRight: "clamp(32px, 7vw, 112px)",
        }}
      >
        {/* Heading */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-5 mb-7">
            <span className="eyebrow">02 — Performance</span>
            <motion.span
              className="inline-block h-px bg-[#b8962e]/35"
              initial={{ width: 0 }}
              whileInView={{ width: 44 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.9 }}
            />
          </div>
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
            Engineering
            <br />
            <span
              style={{
                color: "#b8962e",
                fontWeight: 700,
                fontStyle: "normal",
              }}
            >
              Beyond Limits
            </span>
          </h2>
        </motion.div>

        {/* Divider */}
        <div
          ref={dividerRef}
          className="mb-20 h-px"
          style={{
            background: "linear-gradient(90deg, #b8962e, rgba(184,150,46,0.15), transparent)",
            transformOrigin: "left center",
          }}
        />

        {/* Stats grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-32"
          style={{ perspective: "900px" }}
        >
          {STATS.map((s, i) => <StatCard key={s.label} s={s} index={i} />)}
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              className="group flex flex-col gap-6 relative overflow-hidden"
              style={{
                border: "1px solid rgba(240,237,232,0.1)",
                padding: "clamp(32px, 4.5vw, 52px)",
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.16, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, borderColor: `${p.accent}35` }}
            >
              {/* BG glow on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(ellipse 80% 80% at 50% 0%, ${p.accent}07 0%, transparent 65%)`,
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Icon */}
              <motion.div
                className="relative w-fit"
                animate={{
                  filter: [
                    "drop-shadow(0 0 0px transparent)",
                    `drop-shadow(0 0 10px ${p.accent}55)`,
                    "drop-shadow(0 0 0px transparent)",
                  ],
                }}
                transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.6 }}
              >
                {p.icon}
              </motion.div>

              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    color: "#f0ede8",
                    marginBottom: "14px",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    lineHeight: 1.9,
                    color: "rgba(240,237,232,0.42)",
                    letterSpacing: "0.01em",
                  }}
                >
                  {p.body}
                </p>
              </div>

              {/* Animated bottom line */}
              <motion.div
                className="h-px mt-auto"
                style={{
                  background: `linear-gradient(90deg, ${p.accent}, transparent)`,
                  transformOrigin: "left",
                }}
                initial={{ scaleX: 0.1 }}
                whileHover={{ scaleX: 1 }}
                whileInView={{ scaleX: 0.15 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              />

              {/* Corner accent */}
              <div
                className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
                style={{ borderTop: `1px solid ${p.accent}45`, borderLeft: `1px solid ${p.accent}45` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
