'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) {
    return <span className="docs-icon-button docs-theme-placeholder" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="docs-icon-button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >
      {isDark ? (
        <Sun aria-hidden="true" strokeWidth={1.5} />
      ) : (
        <Moon aria-hidden="true" strokeWidth={1.5} />
      )}
    </button>
  );
}
