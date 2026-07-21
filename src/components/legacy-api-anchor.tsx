'use client';

import { useEffect } from 'react';
import { resolveLegacyApiLocation } from '@/lib/legacy-api-redirect.mjs';

export function LegacyApiAnchor() {
  useEffect(() => {
    const destination = resolveLegacyApiLocation(window.location.href);
    if (!destination) return;

    window.history.replaceState(
      window.history.state,
      '',
      destination.href,
    );

    document.getElementById(destination.anchor)?.scrollIntoView();
  }, []);

  return null;
}
