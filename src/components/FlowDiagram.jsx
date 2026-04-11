import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

const FlowDiagram = ({ analysis }) => {
  const diagramRef = useRef(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const render = async () => {
      if (!analysis.mermaidDiagram || !diagramRef.current) return;
      try {
        setLoading(true);
        setError('');

        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor:       '#1a1a1a',
            primaryTextColor:   '#f0f0f0',
            primaryBorderColor: '#2a2a2a',
            lineColor:          '#00d4aa',
            secondaryColor:     '#141414',
            tertiaryColor:      '#0f0f0f',
            edgeLabelBackground:'#0f0f0f',
            nodeTextColor:      '#f0f0f0',
            fontSize:           '14px',
          },
          flowchart: { borderRadius: 8, padding: 20, curve: 'basis' },
        });

        const id = 'diagram-' + Date.now();
        const { svg } = await mermaid.render(id, analysis.mermaidDiagram);
        diagramRef.current.innerHTML = svg;

        const svgEl = diagramRef.current.querySelector('svg');
        if (svgEl) {
          svgEl.style.maxWidth = '100%';
          svgEl.style.height = 'auto';
          svgEl.style.borderRadius = '8px';
        }
        setLoading(false);
      } catch (err) {
        setError('Could not render diagram.');
        setLoading(false);
      }
    };
    render();
  }, [analysis.mermaidDiagram]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Header */}
      <div style={{ animation: 'fadeUp 0.5s ease both' }}>
        <div style={{
          fontSize: '11px', fontFamily: 'var(--mono)',
          color: 'var(--text3)', letterSpacing: '2px',
          textTransform: 'uppercase', marginBottom: '12px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          Architecture
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
        <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Project Flow Diagram
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
          Visual map of how different parts connect
        </div>
      </div>

      {/* Diagram Card */}
      <div style={{
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        animation: 'fadeUp 0.5s ease 0.1s both',
      }}>
        {/* Card Header */}
        <div style={{
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'var(--bg3)',
        }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff6b6b' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffd93d' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00d4aa' }} />
          <span style={{
            fontFamily: 'var(--mono)', fontSize: '11px',
            color: 'var(--text3)', marginLeft: '8px',
          }}>
            architecture.mermaid
          </span>
        </div>

        {/* Diagram Content */}
        <div style={{ padding: '32px', minHeight: '200px', position: 'relative' }}>
          {loading && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '12px',
            }}>
              <div style={{
                width: '24px', height: '24px',
                border: '2px solid var(--border)',
                borderTop: '2px solid var(--accent)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <div style={{ fontSize: '13px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                Rendering diagram...
              </div>
            </div>
          )}

          {error && (
            <div style={{
              padding: '16px', borderRadius: 'var(--radius)',
              background: 'rgba(255,107,107,0.08)',
              border: '1px solid rgba(255,107,107,0.2)',
              color: '#ff6b6b', fontSize: '13px',
            }}>
              ⚠️ {error}
              <pre style={{
                marginTop: '12px', fontSize: '11px',
                opacity: 0.6, whiteSpace: 'pre-wrap',
                fontFamily: 'var(--mono)',
              }}>
                {analysis.mermaidDiagram}
              </pre>
            </div>
          )}

          <div ref={diagramRef} style={{ display: loading ? 'none' : 'block' }} />
        </div>
      </div>

      {/* Info Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
        animation: 'fadeUp 0.5s ease 0.2s both',
      }}>
        {[
          { icon: '→', title: 'Follow the arrows', desc: 'Arrows show how data and control flow between components' },
          { icon: '◉', title: 'Start from the top', desc: 'The entry point is usually at the top of the diagram' },
        ].map((tip, i) => (
          <div key={i} style={{
            padding: '16px 18px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              fontSize: '18px', marginBottom: '8px',
              color: 'var(--accent)',
              fontFamily: 'var(--mono)',
            }}>
              {tip.icon}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
              {tip.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.6' }}>
              {tip.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowDiagram;