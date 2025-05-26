export const Header = () => {
  return (
    <header className="h-header-height flex items-center bg-[var(--primary)] p-4 text-[var(--textOnPrimary)]">
      <img src="/art-palette.svg" alt="SwatchLab Logo" className="mr-2 inline-block size-6" />
      <h1 className="text-2xl font-bold">SwatchLab</h1>
    </header>
  );
};
