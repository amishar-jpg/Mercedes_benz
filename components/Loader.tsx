"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ onComplete });

    // Logo 3D entrance
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.65, rotateY: -60, y: 12 },
      { opacity: 1, scale: 1, rotateY: 0, y: 0, duration: 1.4, ease: "expo.out" }
    );

    // Ring stroke animation
    if (ringRef.current) {
      const circumference = 2 * Math.PI * 17;
      ringRef.current.style.strokeDasharray = `${circumference}`;
      ringRef.current.style.strokeDashoffset = `${circumference}`;
      tl.to(
        ringRef.current,
        {
          strokeDashoffset: 0,
          duration: 2.6,
          ease: "power2.inOut",
        },
        0.4
      );
    }

    // Progress counter
    const proxy = { p: 0 };
    tl.to(proxy, {
      p: 100,
      duration: 2.6,
      ease: "power2.inOut",
      onUpdate: () => {
        if (barRef.current) {
          barRef.current.style.width = `${proxy.p}%`;
        }
        if (percentRef.current) {
          percentRef.current.textContent = `${Math.round(proxy.p)}%`;
        }
      },
    }, 0.4);

    // Exit: smooth curtain wipe upward
    tl.to(
      overlayRef.current,
      {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.3,
        ease: "expo.inOut",
      },
      3.3
    );
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="loader-overlay"
      style={{
        zIndex: 10000,
        clipPath: "inset(0% 0% 0% 0%)",
        background: "linear-gradient(135deg, #060606 0%, #0a0a0a 100%)",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(184,150,46,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,150,46,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,150,46,0.08) 0%, transparent 70%)",
          left: "50%", top: "50%",
          x: "-50%", y: "-50%",
        }}
        animate={{ scale: [1, 1.35, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mercedes star with animated ring */}
      <div
        ref={logoRef}
        className="flex flex-col items-center gap-8"
        style={{ perspective: 600, opacity: 0 }}
      >
        <div className="relative">
          <svg width="80" height="80" viewBox="0 0 36 36" fill="none">
            {/* Glowing background circle */}
            <circle cx="18" cy="18" r="17" fill="rgba(184,150,46,0.04)" />
            {/* Static outer ring */}
            <circle cx="18" cy="18" r="17" stroke="rgba(184,150,46,0.2)" strokeWidth="0.5" />
            {/* Animated progress ring */}
            <circle
              ref={ringRef}
              cx="18" cy="18" r="17"
              stroke="url(#loaderGrad)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              transform="rotate(-90, 18, 18)"
            />
            {/* Mercedes star */}
            <path
              d="M18 2 L18 18 L30.5 26.5 M18 18 L5.5 26.5"
              stroke="#b8962e"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <defs>
              <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b8962e" />
                <stop offset="100%" stopColor="#f5d78e" />
              </linearGradient>
            </defs>
          </svg>

          {/* Pulsing glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(184,150,46,0.2) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "0.55em",
              textTransform: "uppercase",
              color: "rgba(245,245,245,0.5)",
              fontWeight: 300,
            }}
          >
            Mercedes-Benz
          </span>
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(184,150,46,0.4)",
              fontWeight: 300,
            }}
          >
            The Best Or Nothing
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col items-center gap-3 w-56">
        <div
          className="w-full overflow-hidden relative"
          style={{ height: "1px", background: "rgba(255,255,255,0.06)" }}
        >
          <div
            ref={barRef}
            className="h-full absolute left-0 top-0"
            style={{
              width: "0%",
              background: "linear-gradient(90deg, #b8962e, #f5d78e)",
              boxShadow: "0 0 8px rgba(184,150,46,0.6)",
            }}
          />
          {/* Shimmer */}
          <motion.div
            className="absolute top-0 bottom-0 w-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(245,215,142,0.4), transparent)" }}
            animate={{ left: ["-10%", "110%"] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
        </div>
        <span
          ref={percentRef}
          style={{
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "rgba(184,150,46,0.7)",
            fontFamily: "monospace",
          }}
        >
          0%
        </span>
      </div>
    </div>
  );
}
