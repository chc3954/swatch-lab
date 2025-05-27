import { useThemeStore } from '../../store/themeStore';
import { ColorInput } from '../ColorInput';
import { AIRecommendationForm } from '../AIRecommendationForm';

export const Sidebar = () => {
  const { theme, updateTheme } = useThemeStore();

  const handleColorChange = (key: string, newColor: string) => {
    updateTheme({ ...theme, [key]: newColor });
  };

  return (
    <aside className="size-full border-r border-[var(--border)] bg-[var(--foreground)] p-4">
      <h3 className="mb-4 text-lg font-semibold">Sidebar</h3>
      <div className="flex flex-col space-y-2">
        {Object.entries(theme).map(([key, value]) => (
          <ColorInput key={key} colorName={key} value={value} onChange={handleColorChange} />
        ))}
        <AIRecommendationForm />
      </div>
    </aside>
  );
};
