"use client";

import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* soft brand glow, restrained — purple as accent, not background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center"
      >
        <div className="h-[520px] w-[820px] rounded-full bg-[radial-gradient(closest-side,rgba(107,63,208,0.16),transparent)]" />
      </div>

      <div className="container-content pt-24 pb-20 md:pt-36 md:pb-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            SmartCity Contractors
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06 }}
            className="mt-5 display-1"
          >
            The quoting rail for
            <br className="hidden sm:block" /> the{" "}
            <span className="text-gradient">trades</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mx-auto mt-7 max-w-2xl lede"
          >
            Built by an operator who ran the jobs first. QuoteSmart prices,
            proposes, and closes — and DialBolt fills the top of the funnel by
            reviving the leads you already paid for. Every one of them runs
            through QuoteSmart.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <CTAButton href="/quotesmart">See QuoteSmart</CTAButton>
            <CTAButton href="/contact" variant="secondary">
              Book a demo
            </CTAButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
