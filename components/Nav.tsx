"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import StatusTag from "./StatusTag";
import { ECOSYSTEM } from "@/lib/ecosystem";

const topLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // mobile menu
  const [ecoOpen, setEcoOpen] = useState(false); // desktop dropdown
  const ecoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the desktop dropdown on outside click / Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ecoRef.current && !ecoRef.current.contains(e.target as Node)) {
        setEcoOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setEcoOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-black/5 bg-white/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="container-content flex h-16 items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-7 md:flex">
          {/* Ecosystem dropdown */}
          <div
            ref={ecoRef}
            className="relative"
            onMouseEnter={() => setEcoOpen(true)}
            onMouseLeave={() => setEcoOpen(false)}
          >
            <button
              onClick={() => setEcoOpen((v) => !v)}
              aria-expanded={ecoOpen}
              className="flex items-center gap-1 text-[0.95rem] font-medium text-ink/80 transition-colors hover:text-brand"
            >
              Ecosystem
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform ${ecoOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {ecoOpen && (
              <div className="absolute left-1/2 top-full w-[360px] -translate-x-1/2 pt-3">
                <div className="overflow-hidden rounded-2xl border border-black/5 bg-white p-2 shadow-[0_20px_60px_-16px_rgba(20,16,25,0.28)]">
                  {ECOSYSTEM.map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      onClick={() => setEcoOpen(false)}
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-canvas"
                    >
                      <div>
                        <p className="text-[0.95rem] font-semibold text-ink">
                          {p.name}
                        </p>
                        <p className="text-[0.8rem] text-subtle">{p.tagline}</p>
                      </div>
                      <StatusTag status={p.status} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {topLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.95rem] font-medium text-ink/80 transition-colors hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-full bg-brand px-5 py-2 text-[0.95rem] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            Book a demo
          </Link>
        </div>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex h-10 w-10 items-center justify-center">
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-ink transition-transform ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-ink transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-ink transition-transform ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-black/5 bg-white md:hidden">
          <div className="container-content flex flex-col gap-1 py-4">
            <p className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-subtle">
              Ecosystem
            </p>
            {ECOSYSTEM.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-lg px-2 py-3 text-base font-medium text-ink hover:bg-canvas"
              >
                {l.name}
                <StatusTag status={l.status} />
              </Link>
            ))}
            <div className="my-2 h-px bg-black/5" />
            {topLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-ink hover:bg-canvas"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand px-5 py-3 text-center text-base font-semibold text-white"
            >
              Book a demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
