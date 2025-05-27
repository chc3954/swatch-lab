import { WandSparkles } from 'lucide-react';

export const AIRecommendationForm = () => {
  return (
    <form className="mt-4">
      <textarea
        className="w-full rounded-md border p-2 focus:border-[var(--primary)] focus:ring-[var(--primary)]"
        placeholder="Describe your vibe! (e.g. cozy autumn, sleek modern, playful pastel)"
        rows={4}
      />
      <button
        type="button"
        className="w-full rounded-md bg-[var(--primary)] p-2 text-sm font-medium text-[var(--textOnPrimary)] hover:bg-[var(--primaryHover)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
        aria-label="Get color suggestions from AI"
        onClick={() => alert('AI color suggestions coming soon!')}
      >
        <WandSparkles className="inline-block" />
        <span className="ml-2">Ask AI for color ideas</span>
      </button>
    </form>
  );
};
