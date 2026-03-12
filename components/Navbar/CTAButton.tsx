"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

// Framer variants — defined outside for perf
const shimmerVariants = {
  rest: { x: "-110%", opacity: 0 },
  hover: {
    x: "110%",
    opacity: [0, 0.6, 0.6, 0],
    transition: {
      duration: 0.75,
      ease: "easeInOut",
      times: [0, 0.15, 0.85, 1],
    },
  },
};

const borderVariants = {
  rest: { borderColor: "rgba(201,168,76,0.3)", backgroundColor: "rgba(201,168,76,0)" },
  hover: {
    borderColor: "rgba(201,168,76,0.8)",
    backgroundColor: "rgba(201,168,76,0.06)",
    transition: { duration: 0.3 },
  },
};

const textVariants = {
  rest: { color: "#C9A84C" },
  hover: {
    color: "#F5D07A",
    transition: { duration: 0.25 },
  },
};

export default function CTAButton() {
  const controls = useAnimation();

  return (
    <motion.button
      className="relative hidden md:flex items-center justify-center overflow-hidden cursor-pointer border bg-transparent outline-none"
      style={{
        borderColor: "rgba(201,168,76,0.3)",
        padding: "10px 26px",
        borderRadius: "2px",
      }}
      initial="rest"
      whileHover="hover"
      animate={controls}
      variants={borderVariants}
      onHoverStart={() => controls.start("hover")}
      onHoverEnd={() => controls.start("rest")}
    >
      {/* Traveling shimmer */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 35%, rgba(201,168,76,0.55) 50%, transparent 65%)",
          zIndex: 1,
        }}
        variants={shimmerVariants}
      />

      {/* Button label + arrow */}
      <motion.span
        className="relative z-10 uppercase tracking-widest font-medium flex items-center gap-2"
        style={{
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.3em",
          color: "#C9A84C",
        }}
        variants={textVariants}
      >
        Book a Test Drive
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          style={{ opacity: 0.75, flexShrink: 0 }}
        >
          <path
            d="M2 6h8M7.5 3l3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.span>
    </motion.button>
  );
}
