import { WandSparkles } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import { ColorInput } from '../ColorInput';

export const Sidebar = () => {
  const { theme, updateTheme } = useThemeStore();

  const handleColorChange = (key: string, newColor: string) => {
    updateTheme({ ...theme, [key]: newColor });
  };

  return (
    <aside className="size-full border-r border-[var(--border)] bg-[var(--foreground)] p-4">
      <h3 className="mb-4 text-lg font-semibold">Sidebar</h3>
      <form className="flex flex-col space-y-2">
        {Object.entries(theme).map(([key, value]) => (
          <ColorInput key={key} colorName={key} value={value} onChange={handleColorChange} />
        ))}
        <div className="mt-4">
          <button
            type="button"
            className="w-full rounded-md bg-[var(--primary)] p-2 text-sm font-medium text-[var(--textOnPrimary)] hover:bg-[var(--primaryHover)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
            aria-label="AI Color Suggestions"
            onClick={() => alert('AI Color Suggestions feature coming soon!')}
          >
            <WandSparkles className="inline-block" />{' '}
            <span className="ml-2">AI Color Suggestions</span>
          </button>
        </div>
      </form>
    </aside>
  );
};
