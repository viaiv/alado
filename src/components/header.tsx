function HermesSandal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sandal sole */}
      <path
        d="M7 18.5c0-1 .5-2 1.5-2.5l2-1c1-.5 2.5-.5 3.5 0l2 1c1 .5 1.5 1.5 1.5 2.5v.5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-.5Z"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Sandal straps */}
      <path
        d="M9 16l1.5-3M15 16l-1.5-3M12 13v3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Left wing */}
      <path
        d="M7.5 14C5 13 3.5 11 2.5 8.5c-.3-.8.4-1.2 1-.7C5 9 6.5 10.5 7.5 12"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M6.5 12.5C4.5 11 3 8.5 2.8 6c0-.8.6-1 1-.4 1.2 1.5 2.5 3.5 3.2 5.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* Right wing */}
      <path
        d="M16.5 14c2.5-1 4-3 5-5.5.3-.8-.4-1.2-1-.7C19 9 17.5 10.5 16.5 12"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M17.5 12.5c2-1.5 3.5-4 3.7-6.5 0-.8-.6-1-1-.4-1.2 1.5-2.5 3.5-3.2 5.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="currentColor"
        fillOpacity="0.1"
      />
    </svg>
  )
}

export function Header() {
  return (
    <header className="relative border-b border-border/40 bg-card/60 backdrop-blur-md">
      {/* Amber accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent" />

      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber to-amber-dim opacity-20" />
            <HermesSandal className="relative h-6 w-6 text-amber" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold tracking-tight text-foreground">
              alado
            </h1>
            <p className="text-xs text-muted-foreground">
              Disparo de emails em massa
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
            AWS SES
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-amber/40 animate-dot-pulse" />
        </div>
      </div>
    </header>
  )
}
