import React, { useState } from 'react';
import { WandSparkles } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import axios from 'axios';
import type { ThemeColors } from '../types'; 

export const AIRecommendationForm = () => {
  const updateTheme = useThemeStore((state) => state.updateTheme); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTheme = async (description: string) => {
    setError(null);
    setLoading(true);

    if (!description.trim()) {
      setError('Please enter a description for the color theme.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post<ThemeColors>('/generate-theme', 
        { description },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Received theme from AI:', response.data);
      
      updateTheme(response.data); 
      console.log('AI Generated Theme:', response.data);

    } catch (err) {
      console.error('Error fetching theme:', err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Error: ${err.response.status} - ${err.response.data.error || err.response.statusText}`);
      } else {
        setError('Failed to connect to the backend server. Please ensure the Go server is running.');
      }

    } finally {
      setLoading(false);
    }
  };

  const [textareaValue, setTextareaValue] = React.useState('');

  return (
    <form className="mt-4">
      <textarea
        className="w-full rounded-md border p-2 focus:border-[var(--primary)] focus:ring-[var(--primary)]"
        placeholder="Describe your vibe! (e.g. cozy autumn, sleek modern, playful pastel)"
        rows={4}
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
      />
      <button
        type="button"
        className={`w-full rounded-md bg-[var(--primary)] p-2 text-sm font-medium text-[var(--textOnPrimary)] hover:bg-[var(--primaryHover)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Get color suggestions from AI"
        onClick={() => handleGenerateTheme(textareaValue)}
        disabled={loading}
      >
        <WandSparkles className="inline-block" />
        <span className="ml-2">{loading ? 'Generating...' : 'Ask AI for color ideas'}</span>
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  );
};