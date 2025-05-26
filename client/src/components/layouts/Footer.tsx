export const Footer = () => {
  return (
    <footer className="h-footer-height bg-[var(--primary)] p-4 text-[var(--textOnPrimary)]">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} SwatchLab. All rights reserved.</p>
      </div>
    </footer>
  );
};
