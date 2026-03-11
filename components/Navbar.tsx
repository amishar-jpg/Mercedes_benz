"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = ["Models", "Performance", "Technology", "Experience", "Configure"];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial entrance animation
      const tl = gsap.timeline({ delay: 2.4 });

      tl.fromTo(
        logoRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      ).fromTo(
        linksRef.current?.children ? Array.from(linksRef.current.children) : [],
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.07, ease: "power3.out" },
        "-=0.4"
      );

      // Scroll-based navbar style change
      ScrollTrigger.create({
        start: "top+=80px top",
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
          ? "linear-gradient(180deg, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.0) 100%)"
          : "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(184,150,46,0.1)" : "none",
      }}
    >
      <div className="flex items-center justify-between px-8 md:px-16 py-6">
        {/* Logo */}
        <div ref={logoRef} className="flex items-center gap-3 opacity-0">
          {/* Mercedes star SVG */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="18" cy="18" r="17" stroke="#b8962e" strokeWidth="1" />
            <path
              d="M18 2 L18 18 L30.5 26.5 M18 18 L5.5 26.5"
              stroke="#b8962e"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-inter)",
              letterSpacing: "0.22em",
              fontSize: "13px",
              fontWeight: 300,
              color: "#f5f5f5",
              textTransform: "uppercase",
            }}
          >
            Mercedes-Benz
          </span>
        </div>

        {/* Desktop nav links */}
        <ul
          ref={linksRef}
          className="hidden md:flex items-center gap-10"
        >
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="group relative text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors duration-300"
              >
                {link}
                <span
                  className="absolute -bottom-1 left-0 h-px bg-[#b8962e] transition-all duration-300 w-0 group-hover:w-full"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Configure CTA */}
        <a
          href="#configure"
          className="hidden md:flex items-center gap-2 px-6 py-2.5 text-xs tracking-widest uppercase border border-[#b8962e]/60 text-[#b8962e] hover:bg-[#b8962e] hover:text-black transition-all duration-300"
          style={{ letterSpacing: "0.2em" }}
        >
          Configure
        </a>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-px bg-white transition-all duration-300"
            style={{
              transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none",
            }}
          />
          <span
            className="block w-4 h-px bg-white/60 transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-px bg-white transition-all duration-300"
            style={{
              transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500"
        style={{ maxHeight: menuOpen ? "400px" : "0" }}
      >
        <div
          className="px-8 pb-8 pt-2 border-t border-white/10"
          style={{ background: "rgba(8,8,8,0.98)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="flex py-4 text-sm tracking-widest uppercase text-white/60 hover:text-white border-b border-white/5 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
