export function Footer({ isAdmin }: { isAdmin?: boolean }) {
  return (
    <footer className="border-t p-6 md:py-0">
      <div
        className={`${isAdmin ? 'mx-auto' : ''} container flex flex-col items-center justify-center gap-4 md:h-14 md:flex-row`}
      >
        <p className="text-center text-sm leading-loose text-muted-foreground">
          MATHEVOLVE - Grade 10 Mathematics Learning Tool
        </p>
      </div>
    </footer>
  );
}
