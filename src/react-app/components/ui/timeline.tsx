import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export interface TimelineProps {
  data: TimelineEntry[];
  title?: string;
  description?: string;
  className?: string;
  /** When true, uses dark text for light section backgrounds */
  lightBg?: boolean;
}

function Timeline({ data, title, description, className = "", lightBg = false }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const updateHeight = () => {
      setHeight(el.getBoundingClientRect().height);
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const startY = 0.1 * vh;
      const endY = 0.5 * vh - rect.height;
      const range = startY - endY;
      const p = range <= 0 ? 0 : Math.min(1, Math.max(0, (startY - rect.top) / range));
      setProgress(p);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [data]);

  return (
    <div
      className={`w-full font-sans px-4 md:px-10 ${className}`}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-8 md:py-14 px-0 md:px-8 lg:px-10">
        {title && (
          <h2 className={`font-serif text-lg md:text-3xl mb-0.5 md:mb-1 font-normal max-w-4xl ${lightBg ? "text-[#0F2235]" : "text-white"}`}>
            {title}
          </h2>
        )}
        {description && (
          <p className={`text-sm md:text-base max-w-2xl leading-relaxed ${lightBg ? "text-[#475569]" : "text-muted-foreground"}`}>
            {description}
          </p>
        )}
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-8 md:pb-16">
        {/* Line track — z-0 so it sits behind circles; line disappears under each number */}
        <div
          style={{ height: height + "px" }}
          className={`absolute left-8 top-0 w-[2px] z-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] ${lightBg ? "bg-gradient-to-b from-transparent via-[#0F2235]/15 to-transparent" : "bg-gradient-to-b from-transparent via-white/15 to-transparent"}`}
        >
          <div
            style={{
              height: `${progress * 100}%`,
              opacity: progress < 0.1 ? progress / 0.1 : 1,
              transition: "height 0.05s linear, opacity 0.1s ease-out",
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[#E67451] via-[#d4633e] to-transparent from-[0%] via-[10%]"
          />
        </div>
        {data.map((item, index) => (
          <div
            key={index}
            className="relative z-10 flex justify-start pt-5 first:pt-5 md:pt-20 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-20 items-center top-24 md:top-40 self-start w-14 md:max-w-xs lg:max-w-sm md:w-full shrink-0">
              {/* Opaque circle so the line stops behind the number (no line through digits) */}
              <div className={`h-10 w-10 absolute left-3 shrink-0 rounded-full flex items-center justify-center border-2 font-bold text-sm ${lightBg ? "bg-[#f9f7f4] border-[#E67451]/40 text-[#E67451]" : "bg-[#1a2634] border-[#E67451]/50 text-[#E67451]"}`}>
                {index + 1}
              </div>
              <h3 className={`hidden md:block text-lg md:pl-20 md:text-2xl font-semibold ${lightBg ? "text-[#334155]" : "text-muted-foreground"}`}>
                {item.title}
              </h3>
            </div>

            <div className="relative pl-4 md:pl-4 pt-0.5 md:pt-0 pr-0 md:pr-4 w-full space-y-2 md:space-y-3 min-w-0">
              <h3 className={`md:hidden block text-base md:text-lg font-semibold leading-snug ${lightBg ? "text-[#0F2235]" : "text-white"}`}>
                {item.title}
              </h3>
              <div className={`text-sm md:text-base leading-relaxed ${lightBg ? "text-[#475569]" : "text-muted-foreground"}`}>
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Timeline };
export default Timeline;
