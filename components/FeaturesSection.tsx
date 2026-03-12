"use client";

import { useEffect, useRef, MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MODELS = [
  {
    tag: "AMG GT",
    name: "C63\nAMG",
    spec: "510 hp · V8 Biturbo",
    badge: "Most Wanted",
    detail: "Race-bred performance meets unexpected luxury. Built for those who blur the line.",
    color: "#1a1a1a",
    accent: "#b8962e",
  },
  {
    tag: "S-Class",
    name: "S 580\nMaybach",
    spec: "503 hp · V8 Biturbo",
    badge: "Icon",
    detail: "The ultimate expression of Mercedes luxury. Rear suite comfort, front-row power.",
    color: "#141414",
    accent: "#a0a0a0",
  },
  {
    tag: "EQS",
    name: "EQS\n580+",
    spec: "523 hp · All-Electric",
    badge: "Future",
    detail: "770 km range. Zero emissions. The electric flagship that redefines everything.",
    color: "#0e0e14",
    accent: "#5c8de8",
  },
  {
    tag: "G-Class",
    name: "G 63\nAMG",
    spec: "577 hp · V8 Biturbo",
    badge: "Legend",
    detail: "50 years of unstoppable. Iconic silhouette, modern AMG heart. No terrain refused.",
    color: "#101010",
    accent: "#b8962e",
  },
  {
    tag: "GLE",
    name: "GLE 53\nCoupé",
    spec: "435 hp · Inline-6",
    badge: "Dynamism",
    detail: "SUV body language. Sports car heart. The coupé that redefines the segment.",
    color: "#131313",
    accent: "#c87850",
  },
  {
    tag: "CLA",
    name: "CLA\nClass",
    spec: "221 hp · AMG Line",
    badge: "Entry Icon",
    detail: "The most aerodynamic production car ever built. Art meets entry-level ambition.",
    color: "#0f0f0f",
    accent: "#88c0d0",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
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

      // Cards stagger reveal
      const cards = gridRef.current?.querySelectorAll(".model-card");
      gsap.fromTo(
        cards ? Array.from(cards) : [],
        {
          opacity: 0,
          y: 80,
          rotateY: 12,
          scale: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          scale: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 78%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* 3D tilt on mouse move */
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, cardEl: HTMLDivElement) => {
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardEl, {
      rotateY: x * 14,
      rotateX: -y * 10,
      transformPerspective: 900,
      duration: 0.4,
      ease: "power2.out",
    });

    // Shine layer
    const shine = cardEl.querySelector<HTMLDivElement>(".card-shine");
    if (shine) {
      gsap.to(shine, {
        opacity: 0.15,
        x: `${x * 60}%`,
        y: `${y * 60}%`,
        duration: 0.4,
      });
    }
  };

  const handleMouseLeave = (cardEl: HTMLDivElement) => {
    gsap.to(cardEl, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
    });
    const shine = cardEl.querySelector<HTMLDivElement>(".card-shine");
    if (shine) {
      gsap.to(shine, { opacity: 0, duration: 0.5 });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="models"
      className="relative py-40 md:py-60"
      style={{ background: "#080808", overflow: "hidden" }}
    >
      {/* BG gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(184,150,46,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36 relative z-10">
        {/* Heading */}
        <div ref={headingRef} className="opacity-0 mb-20 md:mb-28">
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
            <span className="inline-block w-12 h-px bg-[#b8962e]/40" />
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
                  background: "linear-gradient(135deg, #b8962e, #f5d78e, #b8962e)",
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
        </div>

        {/* Model cards grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7"
          style={{ perspective: "1200px" }}
        >
          {MODELS.map((model, i) => {
            const cardElRef = { current: null as HTMLDivElement | null };
            return (
              <div
                key={model.name}
                ref={(el) => { cardElRef.current = el; }}
                className="model-card card-3d relative opacity-0 flex flex-col overflow-hidden cursor-pointer group"
                style={{
                  background: model.color,
                  border: "1px solid rgba(255,255,255,0.1)",
                  height: i === 0 || i === 3 ? "460px" : "400px",
                  transformStyle: "preserve-3d",
                }}
                onMouseMove={(e) => cardElRef.current && handleMouseMove(e, cardElRef.current)}
                onMouseLeave={() => cardElRef.current && handleMouseLeave(cardElRef.current)}
              >
                {/* Shine overlay */}
                <div
                  className="card-shine absolute w-[200%] h-[200%] pointer-events-none opacity-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, white 0%, transparent 60%)`,
                    top: "-50%",
                    left: "-50%",
                  }}
                />

                {/* Top badges */}
                <div className="flex items-center justify-between p-7 pb-0 relative z-10">
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.4em",
                      textTransform: "uppercase",
                      color: model.accent,
                      fontWeight: 500,
                    }}
                  >
                    {model.tag}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      padding: "4px 11px",
                    }}
                  >
                    {model.badge}
                  </span>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col justify-end p-7 relative z-10 gap-4">
                  <h3
                    style={{
                      fontSize: "clamp(28px, 4vw, 48px)",
                      fontWeight: 200,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.0,
                      color: "#f5f5f5",
                      whiteSpace: "pre-line",
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

                  {/* Detail — reveals on hover */}
                  <p
                    className="max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-500"
                    style={{
                      fontSize: "12px",
                      fontWeight: 300,
                      lineHeight: 1.7,
                      color: "rgba(245,245,245,0.45)",
                    }}
                  >
                    {model.detail}
                  </p>

                  {/* Bottom line */}
                  <div
                    className="flex items-center gap-3 mt-2 pt-5"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.09)" }}
                  >
                    <span
                      className="w-0 group-hover:w-6 transition-all duration-500 h-px"
                      style={{ background: model.accent }}
                    />
                    <span
                      className="text-white/30 group-hover:text-white/70 transition-colors duration-300 uppercase"
                      style={{ fontSize: "10px", letterSpacing: "0.3em" }}
                    >
                      Explore
                    </span>
                  </div>
                </div>

                {/* Bottom accent gradient */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                  style={{
                    background: `linear-gradient(0deg, ${model.color} 0%, transparent 100%)`,
                  }}
                />

                {/* Corner accent */}
                <div
                  className="absolute top-0 right-0 w-16 h-16"
                  style={{
                    background: `linear-gradient(225deg, ${model.accent}22 0%, transparent 60%)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
