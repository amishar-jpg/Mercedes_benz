"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoScrubSection from "@/components/VideoScrubSection";
import PerformanceSection from "@/components/PerformanceSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.08, ease: "none" });
    };

    const raf = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      gsap.set(follower, { x: followerX, y: followerY });
      requestAnimationFrame(raf);
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
    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("mousemove", onMove);
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
        <PerformanceSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </>
  );
}
