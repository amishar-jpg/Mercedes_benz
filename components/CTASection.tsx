"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBottomRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lines draw in
      gsap.fromTo(
        [lineTopRef.current, lineBottomRef.current],
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.6,
          ease: "power3.inOut",
          transformOrigin: "left center",
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Heading words fall in
      const words = wordRefs.current.filter(Boolean);
      gsap.fromTo(
        words,
        { opacity: 0, y: 80, rotateX: 40 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
          },
        }
      );

      // Subtitle
      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: subRef.current,
            start: "top 85%",
          },
        }
      );

      // Buttons
      gsap.fromTo(
        btnRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: btnRef.current,
            start: "top 88%",
          },
        }
      );

      // Background video subtle parallax
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (bgVideoRef.current) {
            gsap.set(bgVideoRef.current, { y: self.progress * 80 });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headline = ["Configure", "Your", "Mercedes"];
  const footerLinks = [
    ["Models", "AMG", "EQ", "G-Class", "S-Class"],
    ["Ownership", "Finance", "Insurance", "Test Drive", "Roadside"],
    ["Company", "Innovation", "Sustainability", "Careers", "Press"],
    ["Legal", "Privacy", "Cookies", "Terms", "Contact"],
  ];

  return (
    <>
      {/* ── CTA Hero ── */}
      <section
        ref={sectionRef}
        id="configure"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "#080808" }}
      >
        {/* Background video (blurred, dark overlay) */}
        <video
          ref={bgVideoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110"
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ filter: "blur(8px)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.95) 100%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-8 md:px-16 max-w-5xl mx-auto">
          {/* Label */}
          <div className="flex items-center gap-4 mb-10">
            <span className="inline-block w-8 h-px bg-[#b8962e]/60" />
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.42em",
                color: "#b8962e",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              04 — Build Your Dream
            </span>
            <span className="inline-block w-8 h-px bg-[#b8962e]/60" />
          </div>

          {/* Gold line top */}
          <div
            ref={lineTopRef}
            className="w-full mb-10 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #b8962e, transparent)", transformOrigin: "left center" }}
          />

          {/* Big headline */}
          <div
            ref={headingRef}
            className="overflow-visible mb-8"
            style={{ perspective: "800px" }}
          >
            <h2
              style={{
                fontSize: "clamp(48px, 10vw, 160px)",
                fontWeight: 200,
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
                color: "#f5f5f5",
              }}
            >
              {headline.map((word, i) => (
                <span
                  key={word}
                  ref={(el) => { wordRefs.current[i] = el; }}
                  className="opacity-0 inline-block mr-[0.2em]"
                  style={
                    i === 2
                      ? {
                          background: "linear-gradient(135deg, #b8962e 0%, #f5d78e 50%, #b8962e 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          fontWeight: 700,
                        }
                      : {}
                  }
                >
                  {word}
                </span>
              ))}
            </h2>
          </div>

          {/* Gold line bottom */}
          <div
            ref={lineBottomRef}
            className="w-full mb-10 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #b8962e, transparent)", transformOrigin: "left center" }}
          />

          {/* Subtitle */}
          <p
            ref={subRef}
            className="opacity-0 max-w-xl mb-12"
            style={{
              fontSize: "15px",
              fontWeight: 300,
              lineHeight: 1.9,
              color: "rgba(245,245,245,0.45)",
              letterSpacing: "0.02em",
            }}
          >
            Every Mercedes begins as a vision. Select your model, personalise
            your exterior, choose your interior sanctuary. Start your journey
            toward perfection today.
          </p>

          {/* CTA Buttons */}
          <div
            ref={btnRef}
            className="opacity-0 flex flex-col sm:flex-row gap-5 items-center"
          >
            <a
              href="#"
              className="group relative flex items-center gap-4 px-12 py-5 overflow-hidden text-center"
              style={{
                background: "#b8962e",
                color: "#080808",
                fontSize: "11px",
                letterSpacing: "0.28em",
                fontWeight: 700,
                textTransform: "uppercase",
                minWidth: "220px",
                justifyContent: "center",
              }}
            >
              <span className="relative z-10">Start Configuring</span>
              <span
                className="absolute inset-0 bg-[#f5d78e] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
              />
            </a>
            <a
              href="#"
              className="flex items-center gap-4 px-12 py-5 hover:bg-white/5 transition-colors duration-300 text-center"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(245,245,245,0.7)",
                fontSize: "11px",
                letterSpacing: "0.28em",
                fontWeight: 400,
                textTransform: "uppercase",
                minWidth: "220px",
                justifyContent: "center",
              }}
            >
              Book Test Drive
            </a>
          </div>
        </div>

        {/* Floating spec badge */}
        <div
          className="absolute bottom-16 right-8 md:right-16 flex flex-col items-end gap-1 opacity-30"
        >
          <span style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#b8962e" }}>
            The Best
          </span>
          <span style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "white" }}>
            Or Nothing
          </span>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          background: "#050505",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
        className="px-8 md:px-16 lg:px-24 py-20"
      >
        <div className="flex flex-col md:flex-row gap-16 mb-16">
          {/* Brand */}
          <div className="flex-shrink-0 max-w-xs">
            <div className="flex items-center gap-3 mb-6">
              <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" stroke="#b8962e" strokeWidth="1" />
                <path d="M18 2 L18 18 L30.5 26.5 M18 18 L5.5 26.5" stroke="#b8962e" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
              <span style={{ fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 300, color: "#f5f5f5" }}>
                Mercedes-Benz
              </span>
            </div>
            <p style={{ fontSize: "12px", fontWeight: 300, lineHeight: 1.9, color: "rgba(245,245,245,0.3)" }}>
              Since 1926. The pioneers of the automobile. Engineering excellence
              through every generation.
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 flex-1">
            {footerLinks.map((col) => (
              <div key={col[0]} className="flex flex-col gap-4">
                <span style={{ fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#b8962e", fontWeight: 500 }}>
                  {col[0]}
                </span>
                {col.slice(1).map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{ fontSize: "12px", fontWeight: 300, color: "rgba(245,245,245,0.35)", letterSpacing: "0.04em" }}
                    className="hover:text-white/70 transition-colors duration-200"
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Footer bottom */}
        <div
          className="flex flex-col md:flex-row gap-4 items-center justify-between pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p style={{ fontSize: "11px", fontWeight: 300, color: "rgba(245,245,245,0.2)", letterSpacing: "0.04em" }}>
            © 2026 Mercedes-Benz AG. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-px bg-[#b8962e]/40" />
            <span style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(184,150,46,0.4)" }}>
              The Best Or Nothing
            </span>
            <span className="inline-block w-4 h-px bg-[#b8962e]/40" />
          </div>
        </div>
      </footer>
    </>
  );
}
