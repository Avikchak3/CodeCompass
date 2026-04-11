import React, { useState } from 'react';

const getFileIcon = (path) => {
  const ext = path.split('.').pop().toLowerCase();
  const icons = {
    js: '📜', ts: '📘', jsx: '⚛️', tsx: '⚛️',
    py: '🐍', java: '☕', md: '📝', json: '🔧',
    env: '🔑', yml: '⚙️', yaml: '⚙️', html: '🌐',
    css: '🎨', sh: '💻', sql: '🗄️', go: '🐹',
    rs: '🦀', rb: '💎', php: '🐘',
  };
  return icons[ext] || '📄';
};

const getImportanceConfig = (importance) => {
  const config = {
    Critical: {
      bg: 'rgba(255,107,107,0.08)',
      color: '#ff6b6b',
      border: 'rgba(255,107,107,0.2)',
      dot: '#ff6b6b',
      label: 'Critical',
    },
    Important: {
      bg: 'rgba(255,217,61,0.08)',
      color: '#ffd93d',
      border: 'rgba(255,217,61,0.2)',
      dot: '#ffd93d',
      label: 'Important',
    },
    Reference: {
      bg: 'rgba(0,212,170,0.08)',
      color: '#00d4aa',
      border: 'rgba(0,212,170,0.2)',
      dot: '#00d4aa',
      label: 'Reference',
    },
  };
  return config[importance] || config.Reference;
};

const KeyFiles = ({ analysis }) => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', animation: 'fadeUp 0.5s ease both' }}>
        <div style={{
          fontSize: '11px', fontFamily: 'var(--mono)',
          color: 'var(--text3)', letterSpacing: '2px',
          textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          Key Files
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>
        <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.5px' }}>
          Start reading here
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text2)' }}>
          These are the most important files to understand first
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: '16px', flexWrap: 'wrap',
        animation: 'fadeUp 0.5s ease 0.1s both',
      }}>
        {['Critical', 'Important', 'Reference'].map(imp => {
          const c = getImportanceConfig(imp);
          return (
            <div key={imp} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '12px', color: 'var(--text2)',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot }} />
              {imp}
            </div>
          );
        })}
      </div>

      {/* File Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {analysis.keyFiles.map((file, i) => {
          const c = getImportanceConfig(file.importance);
          const isExpanded = expanded === i;

          return (
            <div key={i} style={{
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg2)',
              border: `1px solid ${isExpanded ? c.border : 'var(--border)'}`,
              overflow: 'hidden',
              transition: 'var(--transition)',
              animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
              cursor: 'pointer',
            }}
              onClick={() => setExpanded(isExpanded ? null : i)}
              onMouseEnter={e => {
                if (!isExpanded) e.currentTarget.style.border = `1px solid ${c.border}`;
                e.currentTarget.style.background = 'var(--bg3)';
              }}
              onMouseLeave={e => {
                if (!isExpanded) e.currentTarget.style.border = '1px solid var(--border)';
                e.currentTarget.style.background = isExpanded ? 'var(--bg3)' : 'var(--bg2)';
              }}
            >
              {/* Header Row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '16px 20px',
              }}>
                {/* Importance dot */}
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: c.dot, flexShrink: 0,
                  boxShadow: `0 0 8px ${c.dot}60`,
                }} />

                {/* Icon */}
                <span style={{ fontSize: '18px', flexShrink: 0 }}>
                  {getFileIcon(file.path)}
                </span>

                {/* File path */}
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: '13px',
                  flex: 1, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  color: 'var(--text)',
                }}>
                  {file.path}
                </span>

                {/* Badge */}
                <span style={{
                  fontSize: '10px', fontFamily: 'var(--mono)',
                  padding: '3px 9px', borderRadius: '6px',
                  background: c.bg, color: c.color,
                  border: `1px solid ${c.border}`,
                  flexShrink: 0,
                }}>
                  {file.importance}
                </span>

                {/* Expand arrow */}
                <span style={{
                  color: 'var(--text3)', fontSize: '12px', flexShrink: 0,
                  transition: 'var(--transition)',
                  transform: isExpanded ? 'rotate(180deg)' : 'none',
                }}>
                  ▼
                </span>
              </div>

              {/* Why line (always visible) */}
              <div style={{
                padding: '0 20px 14px 44px',
                fontSize: '12px', color: 'var(--text2)',
              }}>
                {file.why}
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{
                  padding: '16px 20px',
                  borderTop: '1px solid var(--border)',
                  background: 'var(--bg)',
                  animation: 'fadeIn 0.2s ease both',
                }}>
                  <div style={{
                    fontSize: '13px', color: 'var(--text2)',
                    lineHeight: '1.7',
                  }}>
                    {file.description}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyFiles;