"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { VERTICALS, type Vertical } from "@/lib/verticals";

// "One rail, five businesses": pick a business and the phone, the text-back
// thread, the Bolt prompt and the five stages re-skin around it.

const EASE = "cubic-bezier(.21,.47,.32,.98)";
const usd = (n: number) => (n < 0 ? "−$" : "$") + Math.abs(Math.round(n)).toLocaleString("en-US");

function target(v: Vertical, n: number) {
  return v.rows.slice(0, n).reduce((sum, r) => {
    if (r[3]) return sum;
    if (v.stack === "qs") return r[2] === "usd" ? sum + (r[1] as number) : sum;
    return sum + 1;
  }, 0);
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(mq.matches);
    const on = () => setR(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return r;
}

export default function RailSwitcher() {
  const [cur, setCur] = useState(0);
  const [shown, setShown] = useState(0); // rows revealed
  const [big, setBig] = useState(0);
  const [done, setDone] = useState(false);
  const [hot, setHot] = useState(0);
  const [swap, setSwap] = useState(0);
  const reduced = useReducedMotion();
  const raf = useRef(0);
  const bigRef = useRef(0);
  const v = VERTICALS[cur];

  const countUp = useCallback((from: number, to: number) => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const f = (t: number) => {
      const p = Math.min(1, (t - t0) / 620);
      const e = 1 - Math.pow(1 - p, 3);
      bigRef.current = from + (to - from) * e;
      setBig(bigRef.current);
      if (p < 1) raf.current = requestAnimationFrame(f);
    };
    raf.current = requestAnimationFrame(f);
  }, []);

  // build the quote / queue row by row whenever the vertical changes
  useEffect(() => {
    const vert = VERTICALS[cur];
    let timer: ReturnType<typeof setTimeout>;
    cancelAnimationFrame(raf.current);
    if (reduced) {
      setShown(vert.rows.length);
      setBig(target(vert, vert.rows.length));
      setDone(true);
      return;
    }
    setShown(0);
    setBig(0);
    bigRef.current = 0;
    setDone(false);
    let n = 0;
    const tick = () => {
      n += 1;
      setShown(n);
      countUp(bigRef.current, target(vert, n));
      if (n < vert.rows.length) timer = setTimeout(tick, 400);
      else timer = setTimeout(() => setDone(true), 280);
    };
    timer = setTimeout(tick, 300);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
  }, [cur, reduced, countUp]);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setHot((h) => (h + 1) % 5), 1500);
    return () => clearInterval(id);
  }, [reduced]);

  const pick = (i: number) => {
    if (i === cur) return;
    setCur(i);
    setSwap((s) => s + 1);
  };

  const tabs = (stack: "qs" | "book", label: string, aria: string) => (
    <div>
      <p className="tabs-lab">{label}</p>
      <div className="tabs" role="tablist" aria-label={aria}>
        {VERTICALS.map((x, i) =>
          x.stack !== stack ? null : (
            <button key={x.key} type="button" role="tab" aria-selected={i === cur} className="tab" onClick={() => pick(i)}>
              <i style={{ background: x.dot }} />
              {x.label}
            </button>
          ),
        )}
      </div>
    </div>
  );

  const anim = swap > 0 ? "go" : "";
  const revealed = v.rows.slice(0, shown);
  const bigText = v.stack === "qs" ? usd(big) : String(Math.round(big));

  return (
    <div className="sc2">
      <section className="rail-sec" id="rail">
        <div className="glow" aria-hidden="true" />
        <div className="container-content" style={{ position: "relative" }}>
          <div className="rail-head">
            <p className="eyebrow">One rail, five businesses</p>
            <h2 className="h2">Pick yours. Watch the rail run.</h2>
            <p className="lede">
              Same stack underneath either way. Choose a business and the quote, the text-back, and the stages change
              with it.
            </p>
            <div className="tabs-row">
              {tabs("qs", "Quotes a job · QuoteSmart", "Businesses that quote on QuoteSmart")}
              <span className="tabs-sep" aria-hidden="true" />
              {tabs("book", "Books a seat · Booking stack", "Businesses that run the booking stack")}
            </div>
            <p className="rail-note">Live today in roofing, solar, and barbershops. Same rail underneath either way.</p>
          </div>

          <div className="rail-grid">
            <div className="dev">
              <div className="halo" aria-hidden="true" />
              <div className="dev-frame">
                <div className="screen" style={{ background: v.stack === "qs" ? "#fff" : "#0A0A0A", color: v.stack === "qs" ? "#141019" : "#F3F3F3" }}>
                  <div className="notch" aria-hidden="true" />
                  <div key={swap} className={`swap ${anim}`} style={{ flex: 1 }}>
                    {v.stack === "qs" ? <QsScreen v={v} rows={revealed} bigText={bigText} done={done} /> : <BookScreen v={v} rows={revealed} bigText={bigText} done={done} />}
                  </div>
                </div>
              </div>
            </div>

            <div className="side">
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
                  <b style={{ fontSize: 13, letterSpacing: "-.01em" }}>DialBolt</b>
                  <span className="pill live"><i />Live</span>
                </div>
                <div key={`sms${swap}`} className={`swap ${anim}`}>
                  <p className="sms out">{v.out}</p>
                  <p className="sms in">{v.inn}</p>
                </div>
                <p style={{ margin: "14px 0 0", fontSize: 11.5, lineHeight: 1.5, color: "var(--subtle)" }}>
                  TCPA-compliant. STOP and HELP handled. Booked straight into the rail.
                </p>
              </div>
              <div className="card bolt-strip">
                <span className="bolt-ic"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M13.5 2 5 13h5.2L9 22l8.5-11H12l1.5-9Z" /></svg></span>
                <p>{v.bolt}</p>
                <Link href="/contact" className="btn btn-p">Ask Bolt</Link>
              </div>
              <div className="cta-row">
                <Link href={v.stack === "qs" ? "/quotesmart" : "/contact"} className="btn btn-p">{v.primary}</Link>
                <Link href="/contact" className="btn btn-g">Book a demo</Link>
              </div>
            </div>
          </div>

          <div className="stages-wrap">
            <p className="stages-lab">Same rail. Different business.</p>
            <div className="stages-scroll">
              <div className="stages-in">
                <div className="conductor" aria-hidden="true" />
                <div className="charge" aria-hidden="true" />
                <ol className="stages">
                  {v.stages.map((s, i) => (
                    <li key={s[0]} className={i === hot ? "hot" : ""} onMouseEnter={() => setHot(i)}>
                      <span className="node"><s /><b /></span>
                      <span className="n">0{i + 1}</span>
                      <h3>{s[0]}</h3>
                      <p>{s[1]}</p>
                      <span className="owner">{s[2]}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

type ScreenProps = { v: Vertical; rows: Vertical["rows"]; bigText: string; done: boolean };

function QsScreen({ v, rows, bigText, done }: ScreenProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "38px 14px 10px" }}>
        <span aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 3.5, padding: 3 }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ display: "block", height: 1.5, width: 15, borderRadius: 2, background: "#141019" }} />)}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
          <span style={{ display: "grid", placeItems: "center", flex: "none", height: 22, width: 22, borderRadius: 6, fontSize: 10.5, fontWeight: 800, background: v.accent, color: v.onAccent }}>{v.ini}</span>
          <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.brand}</span>
        </span>
        <span aria-hidden="true" style={{ position: "relative", display: "grid", placeItems: "center", height: 24, width: 24, borderRadius: "50%", border: "1px solid rgba(20,16,25,.08)", background: "#fff" }}>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#141019" strokeWidth="2" strokeLinecap="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
          <span style={{ position: "absolute", right: 2, top: 2, height: 5, width: 5, borderRadius: "50%", background: "#6B3FD0" }} />
        </span>
      </div>

      <div style={{ position: "relative", overflow: "hidden", margin: "0 14px", borderRadius: 16, background: "#141019", padding: "15px 15px 13px" }}>
        <div aria-hidden="true" style={{ position: "absolute", right: -34, top: -46, height: 158, width: 158, borderRadius: "50%", background: "radial-gradient(closest-side,rgba(124,58,237,.62),transparent)" }} />
        <p style={{ position: "relative", margin: 0, fontSize: 8.5, fontWeight: 700, letterSpacing: ".16em", color: "rgba(255,255,255,.55)" }}>QUOTE TOTAL</p>
        <p style={{ position: "relative", margin: "5px 0 0", fontSize: 29, fontWeight: 800, lineHeight: 1, letterSpacing: "-.03em", color: "#fff", fontVariantNumeric: "tabular-nums" }}>{bigText}</p>
        <div aria-hidden="true" style={{ position: "relative", marginTop: 13, display: "flex", alignItems: "flex-end", gap: 5, height: 30 }}>
          {[2, 2, 2, 30, 20, 3].map((h, i) => <span key={i} style={{ flex: 1, height: h, borderRadius: h > 4 ? 4 : 2, background: i === 5 ? "#7C3AED" : h > 4 ? `rgba(255,255,255,${i === 3 ? 0.14 : 0.11})` : "rgba(255,255,255,.16)" }} />)}
        </div>
        <div style={{ position: "relative", marginTop: 12, borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 11, display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 6 }}>
          {(v.stats ?? []).map((s) => (
            <span key={s[0]} style={{ display: "block", minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 7.5, fontWeight: 700, letterSpacing: ".14em", color: "rgba(255,255,255,.5)" }}>{s[0]}</span>
              <span style={{ display: "block", marginTop: 3, fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#fff" }}>{s[1]}</span>
            </span>
          ))}
        </div>
      </div>

      <p style={{ margin: "14px 14px 0", fontSize: 8.5, fontWeight: 700, letterSpacing: ".14em", color: "#605A6E" }}>{v.kicker}</p>
      <ul style={{ margin: 0, padding: "6px 14px 0", listStyle: "none", flex: 1 }}>
        {rows.map((r, i) => {
          const strong = !!r[3];
          const val = r[2] === "usd" ? usd(r[1] as number) : r[2] === "mo" ? `$${r[1]}/mo` : String(r[1]);
          return (
            <li key={r[0]} className="row" style={{ padding: strong ? "12px 0" : "9px 0", borderTop: strong ? "1px solid rgba(20,16,25,.10)" : undefined, borderBottom: !strong && i !== v.rows.length - 1 ? "1px solid rgba(20,16,25,.055)" : undefined }}>
              <span style={{ fontSize: strong ? 12.5 : 11.5, fontWeight: strong ? 700 : 500, color: strong ? "#141019" : "#605A6E" }}>{r[0]}</span>
              <span style={{ fontSize: strong ? 15 : 11.5, fontWeight: strong ? 800 : 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: strong ? v.ink : "#141019" }}>{val}</span>
            </li>
          );
        })}
      </ul>

      {done && (
        <div style={{ margin: "12px 14px 0", borderRadius: 14, border: "1px solid rgba(107,63,208,.18)", background: "rgba(107,63,208,.06)", padding: 12, animation: `popIn .34s ${EASE} both` }}>
          <p style={{ margin: 0, fontSize: 8.5, fontWeight: 700, letterSpacing: ".16em", color: "#6B3FD0" }}>READY TO SEND</p>
          <p style={{ margin: "6px 0 0", fontSize: 10.5, lineHeight: 1.5, color: "#605A6E" }}>{v.footer}</p>
          <div style={{ marginTop: 10, borderRadius: 999, background: "linear-gradient(135deg,#5B5FDD,#9F3FD8)", padding: 10, textAlign: "center", fontSize: 12.5, fontWeight: 700, color: "#fff" }}>{v.cta}</div>
        </div>
      )}

      <div style={{ position: "relative", marginTop: 14, borderTop: "1px solid rgba(20,16,25,.07)", background: "#fff", padding: "8px 12px 13px", display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 4 }}>
        <span aria-hidden="true" style={{ position: "absolute", left: "50%", top: -15, display: "grid", placeItems: "center", height: 34, width: 34, transform: "translateX(-50%)", borderRadius: "50%", background: "#6B3FD0", color: "#fff", fontSize: 19, lineHeight: 1, boxShadow: "0 6px 16px -4px rgba(107,63,208,.6)" }}>+</span>
        {[["Home", "#6B3FD0"], ["Quotes", "#9A94A6"], ["People", "#9A94A6"], ["More", "#9A94A6"]].map((t) => (
          <span key={t[0]} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: t[1] }}>
            <span style={{ height: 13, width: 13, borderRadius: 4, border: "1.6px solid currentColor" }} />
            <span style={{ fontSize: 8, fontWeight: 600 }}>{t[0]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function BookScreen({ v, rows, bigText, done }: ScreenProps) {
  const k = v.k!;
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: k.bg, color: k.text }}>
      <div style={{ padding: "38px 18px 14px", borderBottom: `1px solid ${k.headRule}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ display: "grid", placeItems: "center", flex: "none", height: 26, width: 26, borderRadius: 6, fontSize: 12, fontWeight: 800, background: k.markBg, color: k.markInk }}>{v.ini}</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: ".1em" }}>{v.brand.toUpperCase()}</span>
        </div>
        <p style={{ margin: "11px 0 0", fontSize: 8.5, fontWeight: 700, letterSpacing: ".16em", color: k.meta }}>{v.kicker}</p>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, padding: "20px 18px 18px" }}>
        <span style={{ display: "block", minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 8.5, fontWeight: 700, letterSpacing: ".16em", color: k.muted }}>{k.bigLabel}</span>
          <span style={{ display: "block", marginTop: 6, fontSize: 46, fontWeight: 800, lineHeight: 0.9, letterSpacing: "-.04em", color: k.num, fontVariantNumeric: "tabular-nums" }}>{bigText}</span>
        </span>
        {k.pole && (
          <span aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: 4, paddingBottom: 5 }}>
            {["#C41E3A", "#F3F3F3", "#1F3A5F", "#C41E3A"].map((c, i) => <span key={i} style={{ display: "block", height: 5, width: 34, borderRadius: 2, background: c }} />)}
          </span>
        )}
        {k.cover && (
          <span aria-hidden="true" style={{ display: "grid", gridTemplateColumns: "repeat(3,10px)", gap: 5, paddingBottom: 7 }}>
            {[1, 1, 0, 1, 0, 1].map((on, i) => <span key={i} style={{ display: "block", height: 10, width: 10, borderRadius: 2, background: on ? k.num : "rgba(154,52,18,.22)" }} />)}
          </span>
        )}
      </div>
      <p style={{ margin: "0 18px", fontSize: 8.5, fontWeight: 700, letterSpacing: ".16em", color: k.muted }}>{k.listLabel}</p>
      <ul style={{ margin: 0, padding: "8px 18px 0", listStyle: "none", flex: 1 }}>
        {rows.filter((r) => !r[3]).map((r) => (
          <li key={r[0]} className="row" style={{ alignItems: "center", padding: "11px 0", borderBottom: `1px solid ${k.rule}` }}>
            <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <span style={{ height: 6, width: 6, flex: "none", borderRadius: "50%", background: k.num }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: k.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r[0]}</span>
            </span>
            <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".02em", color: k.num, whiteSpace: "nowrap" }}>{String(r[1])}</span>
          </li>
        ))}
      </ul>
      {done && (
        <div style={{ padding: "14px 18px 20px", animation: `popIn .34s ${EASE} both` }}>
          <div style={{ borderRadius: 999, padding: 12, textAlign: "center", fontSize: 13, fontWeight: 700, letterSpacing: ".02em", background: k.primary, color: k.onPrimary }}>{v.cta}</div>
          <p style={{ margin: "11px 0 0", textAlign: "center", fontSize: 9.5, lineHeight: 1.5, color: k.muted }}>{v.footer}</p>
        </div>
      )}
    </div>
  );
}
