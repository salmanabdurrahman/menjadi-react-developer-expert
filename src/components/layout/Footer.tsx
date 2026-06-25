export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container-responsive flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted-foreground md:flex-row">
        <span>Forum Diskusi</span>
        <span className="text-xs">Dibangun dengan React, Redux, Vite, dan shadcn/ui.</span>
      </div>
    </footer>
  );
}
