import { useState } from "react";
import { cn } from "@/react-app/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  darkBg?: boolean;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

function LogoItem({ logo }: { logo: Logo }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
        <span className="text-xs md:text-sm font-medium text-[#475569] whitespace-nowrap">
        {logo.alt}
      </span>
    );
  }
  const isStorefront = logo.alt === "The Storefront";
  const isPeerspace = logo.alt === "Peerspace";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center self-center opacity-90",
        isStorefront && "ml-4 -mr-4 size-16 md:ml-5 md:-mr-5 md:size-20",
        isPeerspace && "-mr-5 size-16 md:-mr-6 md:size-20",
        !isStorefront && !isPeerspace && "size-16 md:size-20"
      )}
    >
      <img
        alt={logo.alt}
        className={cn(
          "pointer-events-none size-full select-none object-contain",
          isStorefront && "scale-[1.4] object-left",
          isPeerspace && "scale-125 object-right",
          !isStorefront && !isPeerspace && "scale-125 object-center"
        )}
        loading="eager"
        onError={() => setError(true)}
        src={logo.src}
      />
    </div>
  );
}

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  const allLogos = [...logos, ...logos, ...logos, ...logos];
  return (
    <div
      {...props}
      className={cn(
        "flex items-center overflow-hidden py-2 rounded-lg bg-slate-100/80 border border-slate-200 md:py-2.5",
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div className="flex w-max animate-logo-ticker items-center self-center gap-x-12 gap-y-0" style={{ width: "max-content" }}>
        {allLogos.map((logo, i) => (
          <LogoItem logo={logo} key={`${logo.alt}-${i}`} />
        ))}
      </div>
    </div>
  );
}
