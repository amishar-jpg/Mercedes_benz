"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete,
    });

    // Logo fade in
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
    );

    // Progress bar fills
    const proxy = { p: 0 };
    tl.to(proxy, {
      p: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        if (barRef.current) {
          barRef.current.style.width = `${proxy.p}%`;
        }
        if (percentRef.current) {
          percentRef.current.textContent = `${Math.round(proxy.p)}`;
        }
      },
    }, 0.3);

    // Exit: slide up
    tl.to(overlayRef.current, {
      y: "-100%",
      duration: 0.8,
      ease: "power3.inOut",
    }, 2.0);
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="loader-overlay"
      style={{ zIndex: 10000 }}
    >
      {/* Mercedes star */}
      <div ref={logoRef} className="flex flex-col items-center gap-8">
        <svg width="64" height="64" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="17" stroke="#b8962e" strokeWidth="0.8" />
          <path
            d="M18 2 L18 18 L30.5 26.5 M18 18 L5.5 26.5"
            stroke="#b8962e"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "rgba(245,245,245,0.5)",
            fontWeight: 300,
          }}
        >
          Mercedes-Benz
        </span>
      </div>

      {/* Progress */}
      <div className="flex flex-col items-center gap-3 w-48">
        <div
          className="w-full h-px overflow-hidden"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <div
            ref={barRef}
            className="h-full"
            style={{
              width: "0%",
              background: "linear-gradient(90deg, #b8962e, #f5d78e)",
              transition: "width 0.05s linear",
            }}
          />
        </div>
        <span
          ref={percentRef}
          style={{
            fontSize: "9px",
            letterSpacing: "0.4em",
            color: "rgba(184,150,46,0.6)",
            fontFamily: "monospace",
          }}
        >
          0
        </span>
      </div>
    </div>
  );
}
