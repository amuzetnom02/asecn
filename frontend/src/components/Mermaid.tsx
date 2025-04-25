"use client";

import React, { useEffect } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
  className?: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart, className }) => {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      themeVariables: {
        primaryColor: '#2563eb',
        primaryTextColor: '#fff',
        primaryBorderColor: '#3b82f6',
        lineColor: '#64748b',
        secondaryColor: '#475569',
        tertiaryColor: '#1e293b',
      },
    });
  }, []);

  useEffect(() => {
    mermaid.contentLoaded();
  }, [chart]);

  return (
    <div className={className}>
      <pre className="mermaid">{chart}</pre>
    </div>
  );
};

export default Mermaid; 