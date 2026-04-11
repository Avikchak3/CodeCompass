import React from 'react';

const Roadmap = ({ analysis }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Project Header */}
      <div style={{
        padding: '28px 32px',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        animation: 'fadeUp 0.5s ease both',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '200px', height: '200px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          fontSize: '11px', fontFamily: 'var(--mono)',
          color: 'var(--accent)', letterSpacing: '2px',
          textTransform: 'uppercase', marginBottom: '10px',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }} />
          {analysis.projectType}
        </div>

        <h2 style={{
          fontSize: '28px', fontWeight: '600',
          letterSpacing: '-0.8px', marginBottom: '10px',
          color: 'var(--text)',
        }}>
          {analysis.projectName}
        </h2>

        <p style={{
          fontSize: '14px', color: 'var(--text2)',
          lineHeight: '1.7', maxWidth: '560px',
        }}>
          {analysis.summary}
        </p>
      </div>

      {/* Roadmap */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{
          fontSize: '11px', fontFamily: 'var(--mono)',
          color: 'var(--text3)', letterSpacing: '2px',
          textTransform: 'uppercase', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          Your Onboarding Roadmap
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {analysis.roadmap.map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: '0',
              animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
            }}>
              {/* Timeline */}
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', width: '48px', flexShrink: 0,
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: `${step.color}15`,
                  border: `1.5px solid ${step.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--mono)', fontSize: '12px', fontWeight: '500',
                  color: step.color, flexShrink: 0, zIndex: 1,
                  transition: 'var(--transition)',
                }}>
                  {step.step}
                </div>
                {i < analysis.roadmap.length - 1 && (
                  <div style={{
                    width: '1px', flex: 1, minHeight: '24px',
                    background: `linear-gradient(to bottom, ${step.color}30, transparent)`,
                    margin: '4px 0',
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{
                flex: 1, paddingLeft: '16px',
                paddingBottom: i < analysis.roadmap.length - 1 ? '20px' : '0',
              }}>
                <div style={{
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  transition: 'var(--transition)',
                  cursor: 'default',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = `1px solid ${step.color}30`;
                    e.currentTarget.style.background = 'var(--bg3)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = '1px solid var(--border)';
                    e.currentTarget.style.background = 'var(--bg2)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: '8px',
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
                      {step.title}
                    </div>
                    <span style={{
                      fontFamily: 'var(--mono)', fontSize: '10px',
                      padding: '3px 9px', borderRadius: '6px',
                      background: `${step.color}12`,
                      color: step.color,
                      border: `1px solid ${step.color}25`,
                      flexShrink: 0, marginLeft: '12px',
                    }}>
                      {step.tag}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '13px', color: 'var(--text2)',
                    lineHeight: '1.7',
                  }}>
                    {step.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;