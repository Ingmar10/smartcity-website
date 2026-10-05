"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Cinematic scroll hero. One pinned screen: headline -> card rises and fills ->
// the real QuoteSmart app flies in on an iPhone and swaps screens -> CTA.
// Content is real DOM (not canvas) so crawlers and screen readers get the H1
// and copy. Reduced-motion users get the finished layout, no pin.

const SCROLL_LENGTH = 6000;

export default function HomeHero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const el = root.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>(".sch-card");
    const phone = el.querySelector<HTMLElement>(".sch-phone");
    const shots = Array.from(el.querySelectorAll<HTMLElement>(".sch-shot"));
    const revealSel = [".sch-copy-col", ".sch-brand-col", ".sch-mock-scroll", ".sch-badge"];

    let raf = 0;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2 + SCROLL_LENGTH) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!card || !phone) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - r.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - r.top}px`);
        gsap.to(phone, {
          rotationY: (e.clientX / innerWidth - 0.5) * 24,
          rotationX: -(e.clientY / innerHeight - 0.5) * 24,
          ease: "power3.out",
          duration: 1.2,
        });
      });
    };
    if (finePointer && !reduced) window.addEventListener("mousemove", onMove);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          full: "(prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px)",
        },
        (c) => {
          if (c.conditions?.reduce) {
            gsap.set(".sch-hero-text, .sch-cta", { autoAlpha: 0 });
            gsap.set(".sch-card", { y: 0, autoAlpha: 1 });
            gsap.set(revealSel, { autoAlpha: 1 });
            return;
          }
          // Phones get a tighter cut: shorter pin, no dead holds, and no pullback
          // (on a phone the card is already ~full-screen, so the pullback reads as
          // a frozen blank card). Desktop timing is unchanged.
          const isMobile = !!c.conditions?.mobile;
          const scrollLength = isMobile ? () => Math.round(innerHeight * 4.6) : () => SCROLL_LENGTH;

          gsap.set(".sch-line1", { autoAlpha: 0, y: 60, scale: 0.88, filter: "blur(18px)" });
          gsap.set(".sch-eyebrow, .sch-sub, .sch-scrollcue", { autoAlpha: 0, y: 20 });
          gsap.set(".sch-line2", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
          gsap.set(".sch-card", { y: () => innerHeight + 200, autoAlpha: 1 });
          gsap.set(revealSel, { autoAlpha: 0 });
          gsap.set(".sch-cta", { autoAlpha: 0, scale: 0.85, filter: "blur(24px)" });

          gsap
            .timeline({ delay: 0.25 })
            .to(".sch-eyebrow", { duration: 0.9, autoAlpha: 1, y: 0, ease: "power3.out" })
            .to(".sch-line1", { duration: 1.6, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", ease: "expo.out" }, "-=0.6")
            .to(".sch-line2", { duration: 1.3, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=0.9")
            .to(".sch-sub, .sch-scrollcue", { duration: 1, autoAlpha: 1, y: 0, stagger: 0.15, ease: "power3.out" }, "-=0.5");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: () => `+=${scrollLength()}`,
              pin: true,
              scrub: isMobile ? 0.6 : 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          const rise = isMobile ? 1.6 : 2;
          tl.to([".sch-hero-text", ".sch-grid"], { scale: 1.12, filter: "blur(18px)", opacity: 0.15, ease: "power2.inOut", duration: rise }, 0)
            .to(".sch-card", { y: 0, ease: "power3.inOut", duration: rise }, 0)
            .to(".sch-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: isMobile ? 0.5 : 1.5 })
            .fromTo(".sch-mock-scroll", { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 }, { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: isMobile ? 2 : 2.5 }, "-=0.8")
            .fromTo(".sch-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.5)", duration: 1.5, stagger: 0.2 }, "-=1.2")
            .fromTo(".sch-copy-col", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5")
            .fromTo(".sch-brand-col", { x: 50, autoAlpha: 0, scale: 0.85 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<")
            .to(".sch-mock-scroll", { rotationY: 10, rotationX: 3, duration: 1.4, ease: "sine.inOut" }, "+=0.3")
            .to(shots[0], { opacity: 0, duration: 0.8 }, "<0.4")
            .to(shots[1], { opacity: 1, duration: 0.8 }, "<")
            .to(".sch-mock-scroll", { rotationY: -10, rotationX: 3, duration: 1.4, ease: "sine.inOut" })
            .to(shots[1], { opacity: 0, duration: 0.8 }, "<0.4")
            .to(shots[2], { opacity: 1, duration: 0.8 }, "<")
            .to(".sch-mock-scroll", { rotationY: 0, rotationX: 0, duration: 1.2, ease: "sine.inOut" });

          if (isMobile) {
            // Short beat on the last screen, then the card lifts away while its
            // contents fade, and the CTA sharpens in behind it. No empty card.
            tl.to({}, { duration: 0.4 })
              .set(".sch-hero-text", { autoAlpha: 0 })
              .set(".sch-cta", { autoAlpha: 1 })
              .to([".sch-mock-scroll", ".sch-badge", ".sch-copy-col", ".sch-brand-col"], { y: -40, autoAlpha: 0, ease: "power2.in", duration: 0.8, stagger: 0.04 }, "exit")
              .to(".sch-card", { y: () => -innerHeight - 300, ease: "power3.in", duration: 1.4 }, "exit+=0.2")
              .to(".sch-cta", { scale: 1, filter: "blur(0px)", ease: "expo.out", duration: 1.2 }, "exit+=0.6");
            return;
          }

          tl.to({}, { duration: 1 })
            .set(".sch-hero-text", { autoAlpha: 0 })
            .set(".sch-cta", { autoAlpha: 1 })
            .to({}, { duration: 1.2 })
            .to([".sch-mock-scroll", ".sch-badge", ".sch-copy-col", ".sch-brand-col"], { scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05 })
            .to(".sch-card", { width: "85vw", height: "85svh", borderRadius: "40px", ease: "expo.inOut", duration: 1.8 }, "pullback")
            .to(".sch-cta", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback")
            .to(".sch-card", { y: () => -innerHeight - 300, ease: "power3.in", duration: 1.5 });
        },
      );
    }, el);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <div className="sc2">
      <div className="sch-root" ref={root}>
        <div className="sch-grid" aria-hidden="true" />

        <div className="sch-hero-text">
          <p className="sch-eyebrow">SmartCity Contractors</p>
          <h1 className="sch-h1-wrap">
            <span className="sch-h1 sch-line1">One rail.</span>
            <span className="sch-h1 sch-h1-grad sch-line2">Any business.</span>
          </h1>
          <p className="sch-sub">
            QuoteSmart quoting software, GoHighLevel automations, and custom websites for contractors and local
            businesses, on one stack. Built by an operator who ran the jobs first.
          </p>
          <p className="sch-scrollcue" aria-hidden="true">Scroll</p>
        </div>

        <div className="sch-cta">
          <h2 className="sch-h2">See it run on your business.</h2>
          <p className="sch-lede">Twenty minutes, your numbers, your leads. We&apos;ll show you the rail with your business in it.</p>
          <div className="sch-btn-row">
            <Link href="/contact" className="btn btn-p">Book a demo</Link>
            <Link href="/quotesmart" className="btn btn-g">See QuoteSmart</Link>
          </div>
        </div>

        <div className="sch-stage">
          <div className="sch-card">
            <div className="sch-sheen" aria-hidden="true" />
            <div className="sch-inner">
              <div className="sch-brand-col">
                <p className="sch-brand" aria-hidden="true"><span>Quote</span><span>Smart</span></p>
              </div>

              <div className="sch-mock-col">
                <div className="sch-mock-scale">
                  <div className="sch-mock-scroll" style={{ perspective: 1000 }}>
                    <div className="sch-phone">
                      <Image className="sch-shot" src="/screenshots/phone-dashboard.webp" alt="QuoteSmart dashboard on iPhone: pipeline value, win rate, margin, quotes sent" width={640} height={1221} priority />
                      <Image className="sch-shot" src="/screenshots/phone-bolt.webp" alt="Bolt AI panel open over the QuoteSmart dashboard" width={640} height={1221} style={{ opacity: 0 }} />
                      <Image className="sch-shot" src="/screenshots/phone-nav.webp" alt="QuoteSmart navigation menu" width={640} height={1221} style={{ opacity: 0 }} />
                    </div>
                    <div className="sch-badge a">
                      <div className="sch-badge-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg></div>
                      <div><p className="sch-badge-t">Quote approved</p><p className="sch-badge-s">Floor price held</p></div>
                    </div>
                    <div className="sch-badge b">
                      <div className="sch-badge-ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 2 5 13h5.2L9 22l8.5-11H12l1.5-9Z" /></svg></div>
                      <div><p className="sch-badge-t">Lead followed up</p><p className="sch-badge-s">DialBolt · 2 min ago</p></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sch-copy-col">
                <h2 className="sch-copy-h">The business changes. The stack doesn&apos;t.</h2>
                <p className="sch-copy-p">QuoteSmart, your automations, and an AI assistant on one rail: the same system whether you run a roofing crew or a barbershop.</p>
                <div className="sch-copy-cta"><Link href="/contact" className="btn btn-p">Book a demo</Link></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
