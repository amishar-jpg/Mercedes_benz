"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavLink from "./NavLink";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
  activeHref: string;
  onNavigate: (href: string) => void;
}

// Menu overlay variants
const overlayVariants = {
  closed: {
    x: "101%",
    transition: {
      duration: 0.65,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  open: {
    x: "0%",
    transition: {
      duration: 0.7,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

// Stagger container for menu items
const itemContainerVariants = {
  closed: {},
  open: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.25,
    },
  },
};

// Individual item animation
const itemVariants = {
  closed: { x: 40, opacity: 0 },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// CTA fade in
const ctaVariants = {
  closed: { opacity: 0, y: 20 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.55, ease: "easeOut" },
  },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.4 } },
};

export default function MobileMenu({
  isOpen,
  onClose,
  links,
  activeHref,
  onNavigate,
}: MobileMenuProps) {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — click to close */}
          <motion.div
            className="fixed inset-0 z-[8800]"
            style={{ background: "rgba(0,0,0,0.5)" }}
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />

          {/* Slide-in panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[8900] flex flex-col"
            style={{
              width: "min(400px, 100vw)",
              background: "#0A0A0A",
              borderLeft: "1px solid rgba(255,255,255,0.04)",
            }}
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Diagonal noise texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Diagonal grid accent */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(201,168,76,0.025) 0px, rgba(201,168,76,0.025) 1px, transparent 1px, transparent 60px)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full px-10 pt-28 pb-12">
              {/* Nav links */}
              <motion.nav
                className="flex flex-col gap-1 flex-1"
                variants={itemContainerVariants}
                initial="closed"
                animate="open"
              >
                {links.map((link, i) => (
                  <motion.div key={link.label} variants={itemVariants}>
                    <button
                      onClick={() => {
                        onNavigate(link.href);
                        onClose();
                      }}
                      className="flex items-baseline gap-4 w-full text-left py-4 bg-transparent border-none cursor-pointer group border-b"
                      style={{ borderColor: "rgba(255,255,255,0.04)" }}
                    >
                      <span
                        className="font-medium tabular-nums"
                        style={{
                          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                          fontSize: "10px",
                          letterSpacing: "0.15em",
                          color: "#C9A84C",
                          opacity: 0.6,
                        }}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className="font-light tracking-wide group-hover:text-[#C9A84C] transition-colors duration-300"
                        style={{
                          fontFamily:
                            "var(--font-cormorant), 'Times New Roman', serif",
                          fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
                          color:
                            activeHref === link.href
                              ? "#C9A84C"
                              : "rgba(245,245,240,0.88)",
                          letterSpacing: "0.04em",
                          fontStyle: "italic",
                        }}
                      >
                        {link.label}
                      </span>
                    </button>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Bottom CTA */}
              <motion.div
                variants={ctaVariants}
                initial="closed"
                animate="open"
                className="mt-12"
              >
                <div
                  className="h-px w-12 mb-8"
                  style={{
                    background:
                      "linear-gradient(90deg, #C9A84C, transparent)",
                  }}
                />
                <button
                  className="w-full border py-4 uppercase text-center bg-transparent cursor-pointer hover:bg-[#C9A84C] hover:text-black transition-all duration-300 group"
                  style={{
                    borderColor: "rgba(201,168,76,0.3)",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "0.35em",
                    color: "#C9A84C",
                  }}
                  onClick={onClose}
                >
                  Book a Test Drive
                </button>

                <p
                  className="mt-8 opacity-30 uppercase"
                  style={{
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.4em",
                    color: "#F5F5F0",
                  }}
                >
                  Mercedes-Benz &copy; 2026
                </p>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
