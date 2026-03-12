"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoScrubSection from "@/components/VideoScrubSection";
import HorizontalTextSection from "@/components/HorizontalTextSection";
import PerformanceSection from "@/components/PerformanceSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top on refresh
    window.scrollTo(0, 0);
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Named reference so gsap.ticker.remove correctly removes this exact fn
    const onLenisTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onLenisTick);
    gsap.ticker.lagSmoothing(0, 0);

    // Let ScrollTrigger recalculate positions after Lenis is bound
    ScrollTrigger.refresh();

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) {
      return () => {
        gsap.ticker.remove(onLenisTick);
        lenis.destroy();
      };
    }

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08, ease: "none" });
    };

    const raf = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      gsap.set(follower, { x: followerX, y: followerY });
      rafId = requestAnimationFrame(raf);
    };

    const onEnterLink = () => {
      gsap.to(cursor, { scale: 3, duration: 0.3 });
      gsap.to(follower, { scale: 0, duration: 0.3 });
    };
    const onLeaveLink = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1, duration: 0.3 });
    };

    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });
    rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      gsap.ticker.remove(onLenisTick);
      lenis.destroy();
    };
  }, [loaded]);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
      <div className="noise-overlay" aria-hidden="true" />
      {!loaded && (
        <Loader onComplete={() => setLoaded(true)} />
      )}
      <main>
        <Navbar />
        <HeroSection />
        <VideoScrubSection />
        <HorizontalTextSection />
        <PerformanceSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </>
  );
}
