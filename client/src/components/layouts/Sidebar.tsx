import { useThemeStore } from '../../store/themeStore';
import { ColorInput } from '../ColorInput';
import { AIRecommendationForm } from '../AIRecommendationForm';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, updateTheme } = useThemeStore();

  const handleColorChange = (key: string, newColor: string) => {
    updateTheme({ ...theme, [key]: newColor });
  };

  return (
    <>
      <button
        className={`absolute top-3 left-3 z-20 cursor-pointer rounded-full p-2 focus:outline-none ${!isOpen ? 'bg-[var(--accent)] hover:bg-[var(--accentHover)]' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {!isOpen ? (
          <Menu className="size-6 text-[var(--textOnPrimary)]" strokeWidth={3} />
        ) : (
          <X className="size-6 text-[var(--textBase)]" strokeWidth={3} />
        )}
      </button>
      <aside
        className={`absolute top-0 left-0 z-10 size-full w-96 overflow-y-scroll border-r border-[var(--border)] bg-[var(--foreground)] p-4 pt-16 transition-transform duration-300 ${isOpen ? '-translate-x-0' : '-translate-x-full'}`}
      >
        <h3 className="mb-4 text-lg font-semibold">Sidebar</h3>
        <div className="flex flex-col space-y-2">
          {Object.entries(theme).map(([key, value]) => (
            <ColorInput key={key} colorName={key} value={value} onChange={handleColorChange} />
          ))}
          <AIRecommendationForm />
        </div>
      </aside>
    </>
  );
};
