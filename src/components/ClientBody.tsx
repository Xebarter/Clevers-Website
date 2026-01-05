'use client';

import { useEffect } from 'react';

export default function ClientBody({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Pesapal initialization moved to server-side API routes to avoid client-side issues
    // The IPN registration happens server-side when needed
  }, []);

  return <>{children}</>;
}