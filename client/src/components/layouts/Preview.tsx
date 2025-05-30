import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const slides = [
  {
    title: 'Hero Section',
    content: (
      <section className="rounded-xl bg-[var(--foreground)] p-6 text-[var(--textBase)] shadow">
        <h1 className="text-3xl font-bold text-[var(--textBase)]">Welcome to Your Theme Preview</h1>
        <p className="mt-2 text-[var(--textMuted)]">
          Experience how your selected colors look on real UI components. Adjust your theme to your
          needs.
        </p>
        <div className="flex justify-center">
          <button className="mt-4 rounded-lg bg-[var(--accent)] px-4 py-2 text-[var(--textOnPrimary)] hover:bg-[var(--accentHover)]">
            Get Started
          </button>
        </div>
      </section>
    ),
  },
  {
    title: 'Signup Form',
    content: (
      <form className="space-y-4 rounded-xl border border-[var(--border)] bg-white p-6 shadow">
        <h2 className="text-center text-xl font-semibold text-[var(--textBase)]">
          Create an Account
        </h2>
        <div>
          <label className="block text-sm text-[var(--textMuted)]">Email</label>
          <input
            type="email"
            readOnly
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] p-2 text-sm focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--textMuted)]">Password</label>
          <input
            type="password"
            readOnly
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] p-2 text-sm"
            placeholder="••••••••"
          />
        </div>
        <button
          type="button"
          className="w-full rounded bg-[var(--primary)] px-4 py-2 font-medium text-[var(--textOnPrimary)] hover:bg-[var(--primaryHover)]"
        >
          Sign Up
        </button>
      </form>
    ),
  },
  {
    title: 'Blog Cards',
    content: (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((id) => (
          <article
            key={id}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 shadow-sm hover:shadow-md"
          >
            <h3 className="text-lg font-bold text-[var(--textBase)]">Blog Post #{id}</h3>
            <p className="mt-1 text-sm text-[var(--textMuted)]">
              This is a preview of what a blog post might look like using your theme.
            </p>
            <button className="mt-3 text-sm font-medium text-[var(--primary)] hover:underline">
              Read more →
            </button>
          </article>
        ))}
      </div>
    ),
  },
  {
    title: 'Notifications',
    content: (
      <div className="space-y-3 text-sm">
        <div className="rounded border-l-4 border-[var(--success)] bg-[var(--success)]/10 p-3">
          ✅ Your changes have been saved successfully.
        </div>
        <div className="rounded border-l-4 border-[var(--warning)] bg-[var(--warning)]/10 p-3">
          ⚠️ Password is too weak.
        </div>
        <div className="rounded border-l-4 border-[var(--info)] bg-[var(--info)]/10 p-3">
          ℹ️ New version available.
        </div>
      </div>
    ),
  },
  {
    title: 'Pricing Table',
    content: (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-5 shadow">
          <h4 className="text-xl font-bold text-[var(--primary)]">Basic</h4>
          <p className="mt-1 text-sm text-[var(--textMuted)]">For individuals starting out.</p>
          <p className="mt-3 text-3xl font-bold text-[var(--textBase)]">
            $9<span className="text-sm">/mo</span>
          </p>
          <button className="mt-4 w-full rounded bg-[var(--primary)] px-4 py-2 text-white hover:bg-[var(--primaryHover)]">
            Choose Plan
          </button>
        </div>
        <div className="rounded-lg border-2 border-[var(--accent)] bg-[var(--foreground)] p-5 shadow">
          <h4 className="text-xl font-bold text-[var(--accent)]">Pro</h4>
          <p className="mt-1 text-sm text-[var(--textMuted)]">
            For professionals who need more features.
          </p>
          <p className="mt-3 text-3xl font-bold text-[var(--textBase)]">
            $29<span className="text-sm">/mo</span>
          </p>
          <button className="mt-4 w-full rounded bg-[var(--accent)] px-4 py-2 text-white hover:bg-[var(--accentHover)]">
            Choose Plan
          </button>
        </div>
      </div>
    ),
  },
  {
    title: 'Data Table',
    content: (
      <table className="w-full border text-sm text-[var(--textBase)]">
        <thead className="bg-[var(--foreground)] text-left text-[var(--textMuted)]">
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-[var(--border)]">
            <td className="px-4 py-2">Jane Doe</td>
            <td className="px-4 py-2">jane@example.com</td>
            <td className="px-4 py-2 text-[var(--success)]">Active</td>
          </tr>
          <tr className="border-t border-[var(--border)]">
            <td className="px-4 py-2">Mark Smith</td>
            <td className="px-4 py-2">mark@example.com</td>
            <td className="px-4 py-2 text-[var(--warning)]">Pending</td>
          </tr>
        </tbody>
      </table>
    ),
  },
  {
    title: 'Total Sample Page',
    content: (
      <div className="space-y-6 rounded-lg bg-[var(--foreground)] p-6 text-[var(--textBase)] shadow-md">
        <header className="mb-4 border-b border-[var(--border)] pb-4">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-[var(--textMuted)]">Welcome back! Here's your overview.</p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-[var(--success)] p-4 text-[var(--textOnPrimary)] shadow">
            <h2 className="text-xl font-semibold">All Systems Operational</h2>
            <p>Last checked: 2 mins ago</p>
          </div>

          <div className="rounded-lg bg-[var(--warning)] p-4 text-[var(--textOnPrimary)] shadow">
            <h2 className="text-xl font-semibold">Storage Near Limit</h2>
            <p>92% used</p>
          </div>

          <div className="rounded-lg bg-[var(--info)] p-4 text-[var(--textOnPrimary)] shadow">
            <h2 className="text-xl font-semibold">New Feature Available</h2>
            <p>Try dark mode settings!</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--textOnPrimary)] hover:bg-[var(--primaryHover)]">
              Save Changes
            </button>
            <button className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--textOnPrimary)] hover:bg-[var(--accentHover)]">
              Add New Item
            </button>
          </div>
        </section>

        <article className="mt-6 rounded-md border border-[var(--border)] bg-[var(--background)] p-4">
          <h3 className="text-lg font-semibold">System Log</h3>
          <ul className="mt-2 space-y-1 text-sm text-[var(--textMuted)]">
            <li>🟢 System started successfully</li>
            <li>🟡 Storage warning issued</li>
            <li>🔵 Feature deployed</li>
          </ul>
        </article>
      </div>
    ),
  },
];

export const Preview = () => {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const prev = () => setIndex((prev) => (prev - 1 + total) % total);
  const next = () => setIndex((prev) => (prev + 1) % total);

  return (
    <div className="mx-auto flex size-full max-w-screen-md flex-col items-center justify-center bg-[var(--background)] px-4 py-6 text-[var(--textBase)]">
      <div className="mb-4 flex w-full max-w-3xl items-center justify-between">
        <button onClick={prev} className="rounded p-2 hover:bg-[var(--foreground)]">
          <ArrowLeft className="size-6" />
        </button>
        <h2 className="text-lg font-semibold">{slides[index].title}</h2>
        <button onClick={next} className="rounded p-2 hover:bg-[var(--foreground)]">
          <ArrowRight className="size-6" />
        </button>
      </div>
      <div className="mt-6 w-full max-w-3xl">{slides[index].content}</div>
      <p className="mt-4 text-sm text-[var(--textMuted)]">
        Slide {index + 1} of {total}
      </p>
    </div>
  );
};
