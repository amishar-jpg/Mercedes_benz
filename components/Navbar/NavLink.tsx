"use client";

import { motion } from "framer-motion";

interface NavLinkProps {
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
  index: number;
}

export default function NavLink({ label, isActive = false, onClick }: NavLinkProps) {
  return (
    <motion.button
      onClick={(e) => { e.preventDefault(); onClick?.(); }}
      className="relative flex flex-col items-center bg-transparent border-none outline-none cursor-pointer py-2 px-1 gap-[4px]"
      initial="rest"
      animate="rest"
      whileHover="hover"
    >
      {/* Label */}
      <motion.span
        className="block uppercase font-medium select-none pointer-events-none"
        style={{
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: "10.5px",
          color: isActive ? "#C9A84C" : "rgba(245,245,240,0.5)",
        }}
        variants={{
          rest:  { letterSpacing: "0.2em" },
          hover: { letterSpacing: "0.26em", color: "#C9A84C", transition: { duration: 0.28, ease: "easeOut" } },
        }}
      >
        {label}
      </motion.span>

      {/* Gold underline — grows from left on hover, stays visible when active */}
      <motion.span
        className="block h-px w-full pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, #C9A84C 40%, #F5D07A 55%, #C9A84C 70%, transparent)",
          transformOrigin: "left center",
        }}
        variants={{
          rest:  { scaleX: isActive ? 1 : 0 },
          hover: { scaleX: 1, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
        }}
      />
    </motion.button>
  );
}
