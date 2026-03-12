"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const CX = 50;
const CY = 50;
const RING_R = 44;
const ARM_R  = 40;

function polar(deg: number, r: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: +(CX + r * Math.cos(rad)).toFixed(3),
    y: +(CY + r * Math.sin(rad)).toFixed(3),
  };
}

const ARMS = [0, 120, 240].map((a) => ({
  x1: CX, y1: CY,
  x2: polar(a, ARM_R).x,
  y2: polar(a, ARM_R).y,
}));

const CIRC = 2 * Math.PI * RING_R;

export default function Logo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef   = useRef<SVGCircleElement>(null);
  const armsRef     = useRef<SVGGElement>(null);
  const spinRef     = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const circle = circleRef.current;
    const arms   = armsRef.current;
    if (!container || !circle || !arms) return;

    gsap.set(circle, { strokeDasharray: CIRC, strokeDashoffset: CIRC, opacity: 0 });
    gsap.set(arms,   { opacity: 0 });
    gsap.set(container, { opacity: 0, scale: 0.8 });

    const tl = gsap.timeline({ delay: 0.7 });

    tl.to(container, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" });
    tl.to(circle, { strokeDashoffset: 0, opacity: 1, duration: 1.0, ease: "power3.inOut" }, "-=0.4");
    tl.to(arms, { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2");

    tl.call(() => {
      spinRef.current = gsap.to(container, {
        rotation: 360,
        duration: 12,
        ease: "none",
        repeat: -1,
        // Using string "50% 50%" guarantees it rotates around its own center
        transformOrigin: "50% 50%",
      });
    });

    return () => {
      tl.kill();
      spinRef.current?.kill();
    };
  }, []);

  return (
    <div className="flex items-center gap-6 cursor-pointer select-none group">
      {/* Wrapper that acts as the square boundary, preventing any flex box distortion */}
      <div 
        className="relative flex items-center justify-center shrink-0" 
        style={{ width: "52px", height: "52px", minWidth: "52px" }}
      >
        {/* The purely rotating element */}
        <div 
          ref={containerRef} 
          style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", overflow: "visible" }}
          >
            <circle
              ref={circleRef}
              cx={CX} cy={CY} r={RING_R}
              stroke="#C9A84C"
              strokeWidth="2"
              fill="none"
            />
            <g ref={armsRef}>
              {ARMS.map((arm, i) => (
                <line
                  key={i}
                  x1={arm.x1} y1={arm.y1}
                  x2={arm.x2} y2={arm.y2}
                  stroke="#C9A84C"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ))}
              <circle cx={CX} cy={CY} r="2.5" fill="#C9A84C" />
            </g>
          </svg>
        </div>
        
        {/* Glow behind the logo */}
        <motion.div
           className="absolute inset-[-10%] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{
             background: "radial-gradient(circle at 50% 50%, rgba(201,168,76,0.2) 0%, transparent 60%)",
             zIndex: -1
           }}
        />
      </div>

      <div className="flex flex-col leading-none gap-1.5 overflow-hidden justify-center h-full">
        <motion.span
          className="block whitespace-nowrap text-[#F5F5F0]"
          style={{
            fontFamily: "var(--font-cormorant), 'Georgia', serif",
            fontSize: "1.3rem",
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "0.25em",
            transformOrigin: "left center"
          }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Mercedes‑Benz
        </motion.span>
        <motion.span
          className="block whitespace-nowrap uppercase text-[#C9A84C]"
          style={{
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: "0.55rem",
            fontWeight: 400,
            letterSpacing: "0.6em",
            opacity: 0.8,
            paddingLeft: "2px"
          }}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
        >
          The Best or Nothing
        </motion.span>
      </div>
    </div>
  );
}
