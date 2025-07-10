'use client';

import { useEffect, useState } from 'react';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-8 w-8 bg-blue-600 mx-auto mb-4"></div>
          <p>Loading Project Structure Visualizer...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}