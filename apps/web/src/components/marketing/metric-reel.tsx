"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export default function MetricReel({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const digits = String(value).split("");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    const activate = () => {
      frame = requestAnimationFrame(() => element.classList.add("is-active"));
    };

    if (!("IntersectionObserver" in window)) {
      activate();
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        activate();
        observer.disconnect();
      }
    }, { threshold: 0.6 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="metric-reel">
      <span className="sr-only">{`${value} ${suffix} — ${label}`}</span>
      <span ref={ref} className="metric-reel-number" aria-hidden="true">
        {digits.map((digit, index) => {
          const style = {
            "--digit-position": `-${Number(digit)}em`,
            "--digit-delay": `${index * 90}ms`,
          } as CSSProperties;
          return (
            <span key={`${index}-${digit}`} className="metric-reel-window">
              <span className="metric-reel-column" style={style}>
                {"0123456789".split("").map((number) => <i key={number}>{number}</i>)}
              </span>
            </span>
          );
        })}
      </span>
      <span className="metric-reel-suffix">{suffix}</span>
      <span className="metric-reel-label">{label}</span>
    </div>
  );
}
