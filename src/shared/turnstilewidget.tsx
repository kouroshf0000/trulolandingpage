import { useEffect, useRef } from "react";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();

export interface TurnstileWidgetProps {
  callback: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
  onSuccess?: (token: string) => void;
}

export function TurnstileWidget({ callback, theme = "light", size = "normal" }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !TURNSTILE_SITE_KEY) return;
    const render = () => {
      const w = (window as unknown as { turnstile?: { render: (el: HTMLElement, o: object) => string } }).turnstile;
      if (w && el && !widgetIdRef.current) {
        widgetIdRef.current = w.render(el, {
          sitekey: TURNSTILE_SITE_KEY,
          callback,
          theme,
          size,
        });
      }
    };
    if ((window as unknown as { turnstile?: unknown }).turnstile) {
      render();
    } else {
      const id = setInterval(() => {
        if ((window as unknown as { turnstile?: unknown }).turnstile) {
          clearInterval(id);
          render();
        }
      }, 50);
      return () => clearInterval(id);
    }
    return () => {
      const w = (window as unknown as { turnstile?: { remove?: (id: string) => void } }).turnstile;
      if (widgetIdRef.current && w?.remove) {
        w.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [callback, theme, size]);

  return <div ref={containerRef} />;
}
