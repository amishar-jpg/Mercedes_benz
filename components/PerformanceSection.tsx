"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M4 16 L16 4 L28 16 L16 28 Z" stroke="#b8962e" strokeWidth="1.2" fill="none" />
        <circle cx="16" cy="16" r="4" stroke="#b8962e" strokeWidth="1" fill="none" />
      </svg>
    ),
    title: "Aerodynamic Excellence",
    body: "Drag coefficient of 0.20 Cd — the most aerodynamic production saloon ever.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="16" rx="2" stroke="#b8962e" strokeWidth="1.2" fill="none" />
        <path d="M10 16 H22" stroke="#b8962e" strokeWidth="1" />
        <circle cx="16" cy="16" r="3" stroke="#b8962e" strokeWidth="1" fill="none" />
      </svg>
    ),
    title: "MBUX Hyperscreen",
    body: "56-inch glass-curved instrument combining three integrated displays into one.",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4 L18 12 L26 12 L20 17 L22 26 L16 21 L10 26 L12 17 L6 12 L14 12 Z" stroke="#b8962e" strokeWidth="1.2" fill="none" />
      </svg>
    ),
    title: "Premium Nappa Leather",
    body: "Hand-stitched AMG Performance seats with 10-zone massage and climate control.",
  },
];

export default function PerformanceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
          },
        }
      );

      // Divider line draw
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.inOut",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: dividerRef.current,
            start: "top 88%",
          },
        }
      );

      // Stat count-up animations
      const statEls = statsContainerRef.current?.querySelectorAll(".stat-val");
      statEls?.forEach((el) => {
        const target = parseFloat(el.getAttribute("data-target") ?? "0");
        const isDecimal = target % 1 !== 0;

        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = isDecimal ? proxy.val.toFixed(1) : Math.round(proxy.val).toString();
          },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });

      // Stat cards stagger
      const statCards = statsContainerRef.current?.querySelectorAll(".stat-card");
      gsap.fromTo(
        statCards ? Array.from(statCards) : [],
        { opacity: 0, y: 50, rotateX: 15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsContainerRef.current,
            start: "top 80%",
          },
        }
      );

      // Pillars stagger
      const pillarCards = pillarsRef.current?.querySelectorAll(".pillar-card");
      gsap.fromTo(
        pillarCards ? Array.from(pillarCards) : [],
        { opacity: 0, y: 40, x: -20 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: "top 82%",
          },
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
        background: "linear-gradient(180deg, #080808 0%, #0d0d0d 50%, #080808 100%)",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(184,150,46,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="px-8 md:px-16 lg:px-24 relative z-10">
        {/* Section heading */}
        <div ref={headingRef} className="opacity-0 mb-6">
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
              02 — Performance
            </span>
            <span className="inline-block w-12 h-px bg-[#b8962e]/40" />
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
                background: "linear-gradient(135deg, #b8962e, #f5d78e, #b8962e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 700,
              }}
            >
              Beyond Limits
            </span>
          </h2>
        </div>

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
          ref={statsContainerRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-24"
          style={{
            borderLeft: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="stat-card opacity-0 py-10 px-8 flex flex-col gap-2 group"
              style={{
                borderRight: "1px solid rgba(255,255,255,0.06)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(184,150,46,0.03)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
              }}
            >
              <div className="flex items-end gap-1">
                <span
                  className="stat-val stat-number"
                  data-target={s.value}
                  style={{
                    fontSize: "clamp(36px, 5vw, 64px)",
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
                    fontSize: "clamp(14px, 1.8vw, 20px)",
                    fontWeight: 300,
                    color: "#b8962e",
                    paddingBottom: "4px",
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
              {/* hover accent line */}
              <div
                className="w-0 group-hover:w-8 h-px bg-[#b8962e] transition-all duration-500 mt-2"
              />
            </div>
          ))}
        </div>

        {/* Feature pillars */}
        <div
          ref={pillarsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="pillar-card opacity-0 group flex flex-col gap-5 p-8"
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "border-color 0.4s, transform 0.4s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(184,150,46,0.3)";
                gsap.to(e.currentTarget, { y: -6, duration: 0.35, ease: "power2.out" });
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                gsap.to(e.currentTarget, { y: 0, duration: 0.35, ease: "power2.out" });
              }}
            >
              <div className="text-[#b8962e]">{p.icon}</div>
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
              <div className="w-6 h-px bg-[#b8962e]/40 group-hover:w-full transition-all duration-700 mt-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
