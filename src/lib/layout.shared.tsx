import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 text-fd-foreground">
          <svg
            width="20"
            height="20"
            viewBox="0 0 32 32"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M16.0002 26.6667L10.667 32L0 21.3335L5.33326 15.9998L16.0002 26.6667ZM32.0005 21.3335L21.3335 32L16.0002 26.6667L26.6667 15.9998L32.0005 21.3335ZM16.0002 5.33326L5.33326 15.9998L0.000460359 10.667L10.667 0L16.0002 5.33326ZM32.0005 10.6665L26.6667 15.9998L16.0002 5.33326L21.3335 0L32.0005 10.6665Z" />
          </svg>
          <span className="font-medium tracking-tight">{appName}</span>
        </span>
      ),
    },
    // Disable the default Fumadocs theme switch since we render our own in the sidebar footer
    themeSwitch: {
      enabled: false,
    },
  };
}
