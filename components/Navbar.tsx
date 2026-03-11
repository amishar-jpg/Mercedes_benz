"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const navLinks = ["Models", "Performance", "Technology", "Experience", "Configure"];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.4 });

      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
      ).fromTo(
        linksRef.current?.children ? Array.from(linksRef.current.children) : [],
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.07, ease: "power3.out" },
        "-=0.5"
      );

      ScrollTrigger.create({
        start: "top+=60px top",
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? "rgba(6,6,6,0.92)"
          : "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "none",
        borderBottom: scrolled ? "1px solid rgba(184,150,46,0.12)" : "none",
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="flex items-center justify-between px-8 md:px-16 py-5">
        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-3 opacity-0">
          <motion.svg
            width="34"
            height="34"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <circle cx="18" cy="18" r="17" stroke="#b8962e" strokeWidth="1" />
            <path
              d="M18 2 L18 18 L30.5 26.5 M18 18 L5.5 26.5"
              stroke="#b8962e"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </motion.svg>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              letterSpacing: "0.22em",
              fontSize: "12px",
              fontWeight: 300,
              color: "#f5f5f5",
              textTransform: "uppercase",
            }}
          >
            Mercedes-Benz
          </span>
        </div>

        {/* Desktop nav links */}
        <ul ref={linksRef} className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link}>
              <motion.a
                href="#"
                className="relative text-[11px] tracking-widest uppercase"
                style={{ color: activeLink === link ? "#b8962e" : "rgba(245,245,245,0.6)" }}
                onHoverStart={() => setActiveLink(link)}
                onHoverEnd={() => setActiveLink(null)}
                whileHover={{ color: "#f5f5f5" }}
              >
                {link}
                <motion.span
                  className="absolute -bottom-1 left-0 h-px bg-[#b8962e]"
                  initial={{ width: 0 }}
                  animate={{ width: activeLink === link ? "100%" : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </li>
          ))}
        </ul>

        {/* Configure CTA */}
        <motion.a
          href="#configure"
          className="hidden md:flex items-center gap-2 px-6 py-2.5 text-[11px] tracking-widest uppercase relative overflow-hidden"
          style={{
            border: "1px solid rgba(184,150,46,0.5)",
            color: "#b8962e",
            letterSpacing: "0.22em",
          }}
          whileHover={{ color: "#080808", scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.span
            className="absolute inset-0 bg-[#b8962e]"
            initial={{ x: "-100%" }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.4 }}
          />
          <span className="relative z-10">Configure</span>
        </motion.a>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-6 h-px bg-white"
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 4 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block w-4 h-px bg-white/60"
            animate={{ opacity: menuOpen ? 0 : 1, x: menuOpen ? 10 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block w-6 h-px bg-white"
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -4 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div
              className="px-8 pb-8 pt-2 border-t border-white/10"
              style={{ background: "rgba(6,6,6,0.98)", backdropFilter: "blur(20px)" }}
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link}
                  href="#"
                  className="flex py-4 text-sm tracking-widest uppercase text-white/60 hover:text-white border-b border-white/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
