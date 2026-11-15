/**
 * @fileoverview Renders a Mermaid diagram from a fenced ```mermaid code block.
 * Mermaid is loaded on demand, so pages without diagrams never download it.
 */

import React, { useEffect, useState } from 'react';

let mermaidPromise = null;

const loadMermaid = () => {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then((module) => {
      const mermaid = module.default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'neutral',
        fontFamily: 'inherit'
      });
      return mermaid;
    });
  }
  return mermaidPromise;
};

let diagramCounter = 0;

/**
 * @component MermaidDiagram
 * @param {Object} props
 * @param {string} props.chart - Mermaid source
 */
const MermaidDiagram = ({ chart }) => {
  const [id] = useState(() => {
    diagramCounter += 1;
    return `mermaid-diagram-${diagramCounter}`;
  });
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadMermaid()
      .then((mermaid) => mermaid.render(id, chart))
      .then(({ svg: rendered }) => {
        if (!cancelled) setSvg(rendered);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="text-sm text-red-500 whitespace-pre-wrap">
        Diagram could not be rendered: {error.message}
      </pre>
    );
  }

  if (!svg) {
    return <div className="text-sm text-edex-light/50 my-6">Loading diagram…</div>;
  }

  return (
    <div
      className="mermaid-diagram my-8 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default MermaidDiagram;
