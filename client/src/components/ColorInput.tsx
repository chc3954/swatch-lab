import { Hash } from 'lucide-react';
import { formatCamelCaseToSpaced } from '../utils/formatters';

interface ColorInputProps {
  colorName: string;
  value: string;
  onChange: (colorName: string, value: string) => void;
}

export const ColorInput = ({ colorName, value, onChange }: ColorInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim();
    onChange(colorName, `#${input}`);
  };

  return (
    <div className="mb-2 grid grid-cols-2 items-center">
      <label htmlFor={colorName} className="p-2 text-sm font-medium text-[var(--textMuted)]">
        {formatCamelCaseToSpaced(colorName)}
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-2">
          <Hash size={16} className="size-3 text-[var(--textMuted)]" />
        </div>
        <input
          type="text"
          id={colorName}
          name={colorName}
          value={value.split('#')[1].toUpperCase()}
          className="w-full rounded-md border p-2 pl-6 focus:border-[var(--primary)] focus:ring-[var(--primary)] sm:text-sm"
          placeholder={formatCamelCaseToSpaced(colorName)}
          onChange={handleChange}
        />
        <div
          className="absolute top-1/2 right-2 size-4 -translate-y-1/2 rounded-full shadow-md"
          style={{ backgroundColor: value }}
        ></div>
      </div>
    </div>
  );
};
