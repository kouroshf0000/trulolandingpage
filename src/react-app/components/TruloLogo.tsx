export default function TruloLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif text-2xl sm:text-3xl font-medium tracking-tight text-foreground ${className}`}>
      Trulo
    </span>
  );
}
