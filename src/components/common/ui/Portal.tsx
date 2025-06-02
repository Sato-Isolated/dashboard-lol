'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  containerId?: string;
}

export default function Portal({
  children,
  containerId = 'portal-root',
}: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Create portal container if it doesn't exist
    if (!document.getElementById(containerId)) {
      const portalDiv = document.createElement('div');
      portalDiv.id = containerId;
      document.body.appendChild(portalDiv);
    }

    return () => setMounted(false);
  }, [containerId]);

  if (!mounted) return null;

  const container = document.getElementById(containerId);
  if (!container) return null;

  return createPortal(children, container);
}
