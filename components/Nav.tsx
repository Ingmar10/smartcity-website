"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Logo from "./Logo";

const links = [
  { href: "/quotesmart", label: "QuoteSmart" },
  { href: "/dialbolt", label: "DialBolt" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
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

      {open && (
        <div className="border-t border-black/5 bg-white md:hidden">
          <div className="container-content flex flex-col gap-1 py-4">
            {links.map((l) => (
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
