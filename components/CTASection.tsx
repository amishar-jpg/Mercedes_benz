"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBottomRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [lineTopRef.current, lineBottomRef.current],
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.8,
          ease: "power3.inOut",
          transformOrigin: "left center",
          stagger: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      const words = wordRefs.current.filter(Boolean);
      gsap.fromTo(
        words,
        { opacity: 0, y: 90, rotateX: 40 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1.2, stagger: 0.1, ease: "power4.out",
          scrollTrigger: { trigger: words[0], start: "top 80%" },
        }
      );

      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: subRef.current, start: "top 86%" },
        }
      );

      gsap.fromTo(
        btnRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: btnRef.current, start: "top 88%" },
        }
      );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (bgVideoRef.current) gsap.set(bgVideoRef.current, { y: self.progress * 90 });
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
        style={{ background: "#060606" }}
      >
        {/* Blurred bg video */}
        <video
          ref={bgVideoRef}
          className="absolute inset-0 w-full h-full object-cover scale-110"
          src="/hero.mp4"
          autoPlay muted loop playsInline
          style={{ opacity: 0.12, filter: "blur(14px)" }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 90% 90% at 50% 55%, rgba(6,6,6,0.22) 0%, rgba(6,6,6,0.97) 100%)",
          }}
        />

        {/* 3D perspective floor grid */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(184,150,46,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(184,150,46,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "55px 55px",
            maskImage: "linear-gradient(0deg, transparent 0%, rgba(0,0,0,0.7) 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(0deg, transparent 0%, rgba(0,0,0,0.7) 70%, transparent 100%)",
            transform: "perspective(700px) rotateX(58deg)",
            transformOrigin: "bottom center",
          }}
        />

        {/* Orbiting rings */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{ width: 640, height: 640, border: "1px solid rgba(184,150,46,0.055)", left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{ width: 860, height: 860, border: "1px solid rgba(184,150,46,0.03)", left: "50%", top: "50%", x: "-50%", y: "-50%" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
        />

        <div
          className="relative z-10 flex flex-col items-center text-center"
          style={{
            maxWidth: "1100px",
            width: "100%",
            paddingLeft: "clamp(28px, 6vw, 80px)",
            paddingRight: "clamp(28px, 6vw, 80px)",
          }}
        >
          {/* Label */}
          <motion.div
            className="flex items-center gap-5 mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block w-8 h-px bg-[#b8962e]/55" />
            <span className="eyebrow">04 — Build Your Dream</span>
            <span className="inline-block w-8 h-px bg-[#b8962e]/55" />
          </motion.div>

          {/* Gold line top */}
          <div
            ref={lineTopRef}
            className="w-full mb-12 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #b8962e, transparent)", transformOrigin: "left center" }}
          />

          {/* Big headline */}
          <div className="overflow-visible mb-8" style={{ perspective: "900px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(52px, 11vw, 170px)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 0.88,
                color: "#f0ede8",
                fontStyle: "italic",
              }}
            >
              {headline.map((word, i) => (
                <span
                  key={word}
                  ref={(el) => { wordRefs.current[i] = el; }}
                  className="opacity-0 inline-block mr-[0.18em]"
                  style={
                    i === 2
                      ? {
                          background: "linear-gradient(110deg, #b8962e 0%, #e8c86a 50%, #c8a030 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          fontWeight: 700,
                          fontStyle: "normal",
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
            className="w-full mb-12 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #b8962e, transparent)", transformOrigin: "left center" }}
          />

          {/* Subtitle */}
          <p
            ref={subRef}
            className="opacity-0 mb-14"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 300,
              lineHeight: 1.95,
              color: "rgba(240,237,232,0.42)",
              letterSpacing: "0.02em",
              maxWidth: "540px",
            }}
          >
            Every Mercedes begins as a vision. Select your model, personalise
            your exterior, choose your interior sanctuary. Start your journey
            toward perfection today.
          </p>

          {/* CTA Buttons — fixed hover disappear */}
          <div ref={btnRef} className="opacity-0 flex flex-col sm:flex-row gap-6 items-center">
            {/* Primary */}
            <motion.a
              href="#"
              className="group relative flex items-center justify-center gap-4"
              style={{
                background: "linear-gradient(110deg, #b8962e, #d4a843)",
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                letterSpacing: "0.1em",
                fontWeight: 600,
                textTransform: "uppercase",
                minWidth: "240px",
                overflow: "hidden",
                padding: "20px 48px",
                borderRadius: "4px",
              }}
              whileHover={{ scale: 1.03, boxShadow: "0 16px 55px rgba(184,150,46,0.38)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22 }}
            >
              {/* Fill overlay — z:0, below text */}
              <span
                className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out"
                style={{ background: "linear-gradient(110deg, #d4a843, #e8c86a)", zIndex: 0 }}
              />
              {/* Text always on top */}
              <span className="relative z-10 whitespace-nowrap" style={{ color: "#070707" }}>
                Start Configuring
              </span>
              <motion.span
                className="relative z-10"
                style={{ color: "#070707" }}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.a>

            {/* Secondary */}
            <motion.a
              href="#"
              className="flex items-center justify-center gap-3"
              style={{
                border: "1px solid rgba(240,237,232,0.25)",
                color: "rgba(240,237,232,0.85)",
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                letterSpacing: "0.1em",
                fontWeight: 500,
                textTransform: "uppercase",
                minWidth: "240px",
                backdropFilter: "blur(12px)",
                padding: "20px 48px",
                borderRadius: "4px",
              }}
              whileHover={{
                scale: 1.03,
                borderColor: "rgba(184,150,46,0.45)",
                color: "#f0ede8",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22 }}
            >
              Book Test Drive
            </motion.a>
          </div>

          {/* Stats trio */}
          <motion.div
            className="flex items-center gap-16 mt-24 pt-10"
            style={{ borderTop: "1px solid rgba(240,237,232,0.055)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1.2 }}
          >
            {[
              { v: "100+", l: "Years of Innovation" },
              { v: "3M+", l: "Cars Worldwide" },
              { v: "50+", l: "Countries Served" },
            ].map((item) => (
              <div key={item.l} className="flex flex-col items-center gap-2">
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(22px, 3.5vw, 40px)",
                    fontWeight: 300,
                    color: "#f0ede8",
                    letterSpacing: "-0.02em",
                    fontStyle: "italic",
                  }}
                >
                  {item.v}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "9px",
                    letterSpacing: "0.32em",
                    color: "rgba(240,237,232,0.28)",
                    textTransform: "uppercase",
                  }}
                >
                  {item.l}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating badge */}
        <motion.div
          className="absolute bottom-16 right-10 md:right-20 flex flex-col items-end gap-1.5"
          animate={{ y: [0, -9, 0], opacity: [0.28, 0.55, 0.28] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "8px",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "#b8962e",
            }}
          >
            The Best
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "8px",
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "rgba(240,237,232,0.4)",
            }}
          >
            Or Nothing
          </span>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="relative"
        style={{ background: "#030303", borderTop: "1px solid rgba(240,237,232,0.05)", paddingTop: "80px", paddingBottom: "60px" }}
      >
        <div
          style={{
            paddingLeft: "clamp(28px, 6vw, 96px)",
            paddingRight: "clamp(28px, 6vw, 96px)",
            paddingTop: "80px",
            paddingBottom: "60px",
          }}
        >
          <div className="flex flex-col md:flex-row gap-16 mb-16">
            {/* Brand */}
            <div className="flex-shrink-0" style={{ maxWidth: "280px" }}>
              <div className="flex items-center gap-4 mb-7">
                <motion.svg
                  width="36" height="36" viewBox="0 0 36 36" fill="none"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx="18" cy="18" r="17" stroke="#b8962e" strokeWidth="0.8" />
                  <path d="M18 2 L18 18 L30.5 26.5 M18 18 L5.5 26.5" stroke="#b8962e" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                </motion.svg>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    fontWeight: 300,
                    color: "#f0ede8",
                  }}
                >
                  Mercedes-Benz
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 300,
                  lineHeight: 1.95,
                  color: "rgba(240,237,232,0.28)",
                }}
              >
                Since 1926. The pioneers of the automobile. Engineering
                excellence through every generation.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-1">
              {footerLinks.map((col) => (
                <div key={col[0]} className="flex flex-col gap-5">
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "9px",
                      letterSpacing: "0.38em",
                      textTransform: "uppercase",
                      color: "#b8962e",
                      fontWeight: 500,
                    }}
                  >
                    {col[0]}
                  </span>
                  {col.slice(1).map((link) => (
                    <motion.a
                      key={link}
                      href="#"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        fontWeight: 300,
                        color: "rgba(240,237,232,0.30)",
                        letterSpacing: "0.03em",
                      }}
                      whileHover={{ color: "#f0ede8", x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link}
                    </motion.a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col md:flex-row gap-4 items-center justify-between pt-8"
            style={{ borderTop: "1px solid rgba(240,237,232,0.05)" }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 300,
                color: "rgba(240,237,232,0.18)",
                letterSpacing: "0.04em",
              }}
            >
              © 2026 Mercedes-Benz AG. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-block w-4 h-px bg-[#b8962e]/35" />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "8px",
                  letterSpacing: "0.42em",
                  textTransform: "uppercase",
                  color: "rgba(184,150,46,0.35)",
                }}
              >
                The Best Or Nothing
              </span>
              <span className="inline-block w-4 h-px bg-[#b8962e]/35" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
