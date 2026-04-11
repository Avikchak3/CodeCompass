import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Roadmap from './components/Roadmap';
import KeyFiles from './components/KeyFiles';
import FlowDiagram from './components/FlowDiagram';
import ChatPanel from './components/ChatPanel';

const TABS = [
  { id: 'roadmap', label: 'Roadmap', icon: '🗺️', color: '#00d4aa' },
  { id: 'files', label: 'Key Files', icon: '📂', color: '#ffd93d' },
  { id: 'diagram', label: 'Flow', icon: '🔀', color: '#ff6b6b' },
  { id: 'stack', label: 'Stack', icon: '🧱', color: '#0099ff' },
  { id: 'chat', label: 'Ask AI', icon: '💬', color: '#a855f7' },
];

const StackPanel = ({ analysis }) => {
  const colors = ['#00d4aa', '#0099ff', '#ffd93d', '#ff6b6b', '#a855f7'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeUp 0.5s ease both' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Detected Stack
        </div>
        <div style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text)' }}>
          Technologies Used
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {analysis.stack.map((s, i) => (
          <div key={i} style={{
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            transition: 'var(--transition)',
            animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
            cursor: 'default',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.border = `1px solid ${colors[i % colors.length]}44`;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = '1px solid var(--border)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '15px', fontWeight: '500' }}>{s.name}</div>
              <div style={{
                fontSize: '11px', fontFamily: 'var(--mono)',
                padding: '3px 8px', borderRadius: '6px',
                background: `${colors[i % colors.length]}15`,
                color: colors[i % colors.length],
                border: `1px solid ${colors[i % colors.length]}30`,
              }}>
                v{s.version}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{s.role}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Usage</div>
                <div style={{ fontSize: '11px', color: colors[i % colors.length], fontFamily: 'var(--mono)' }}>{s.usage}%</div>
              </div>
              <div style={{ height: '3px', background: 'var(--bg4)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  borderRadius: '2px',
                  background: `linear-gradient(90deg, ${colors[i % colors.length]}, ${colors[i % colors.length]}88)`,
                  width: `${s.usage}%`,
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeIn 1s ease ${i * 0.1 + 0.3}s both`,
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [analysis, setAnalysis] = useState(null);
  const [context, setContext] = useState('');
  const [activeTab, setActiveTab] = useState('roadmap');

  const handleAnalysisComplete = (analysisData, files) => {
    setAnalysis(analysisData);
    const ctx = files.map(f => `File: ${f.originalName}`).join('\n');
    setContext(ctx);
    setActiveTab('roadmap');
  };

  const handleReset = () => {
    setAnalysis(null);
    setContext('');
    setActiveTab('roadmap');
  };

  if (!analysis) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 32px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(8,8,8,0.8)',
          backdropFilter: 'blur(20px)',
          position: 'sticky', top: 0, zIndex: 100,
          animation: 'fadeIn 0.4s ease both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #00d4aa22, #0099ff22)',
              border: '1px solid rgba(0,212,170,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px',
            }}>🧭</div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '15px', fontWeight: '500', letterSpacing: '-0.3px' }}>
              Code<span style={{ color: 'var(--accent)' }}>Compass</span>
            </span>
          </div>
          <div style={{
            fontSize: '11px', fontFamily: 'var(--mono)',
            padding: '5px 12px', borderRadius: '20px',
            background: 'var(--accent-glow)',
            border: '1px solid rgba(0,212,170,0.2)',
            color: 'var(--accent)',
            letterSpacing: '0.5px',
          }}>
            AI-Powered Onboarding
          </div>
        </div>
        <FileUpload onAnalysisComplete={handleAnalysisComplete} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 32px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 100,
        animation: 'fadeIn 0.3s ease both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #00d4aa22, #0099ff22)',
            border: '1px solid rgba(0,212,170,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px',
          }}>🧭</div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: '500' }}>
            Code<span style={{ color: 'var(--accent)' }}>Compass</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            fontSize: '12px', fontFamily: 'var(--mono)',
            padding: '5px 12px', borderRadius: '20px',
            background: 'var(--bg3)',
            border: '1px solid var(--border2)',
            color: 'var(--text2)',
          }}>
            {analysis.projectName}
          </div>
          <button onClick={handleReset} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--bg3)',
            color: 'var(--text2)',
            fontSize: '12px', cursor: 'pointer',
            fontFamily: 'var(--sans)',
            transition: 'var(--transition)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg4)'; e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--text2)'; }}
          >
            ↩ New Analysis
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', padding: '0 32px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,8,8,0.6)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: '57px', zIndex: 99,
        overflowX: 'auto',
        animation: 'fadeIn 0.4s ease 0.1s both',
      }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '14px 18px',
            fontSize: '13px', fontWeight: activeTab === tab.id ? '500' : '400',
            cursor: 'pointer',
            borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
            color: activeTab === tab.id ? 'var(--text)' : 'var(--text2)',
            fontFamily: 'var(--sans)',
            transition: 'var(--transition)',
            whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text2)'; }}
          >
            <span style={{ fontSize: '14px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '880px', margin: '0 auto',
        padding: '36px 24px',
        animation: 'fadeUp 0.4s ease both',
      }}>
        {activeTab === 'roadmap' && <Roadmap analysis={analysis} />}
        {activeTab === 'files' && <KeyFiles analysis={analysis} />}
        {activeTab === 'diagram' && <FlowDiagram analysis={analysis} />}
        {activeTab === 'stack' && <StackPanel analysis={analysis} />}
        {activeTab === 'chat' && <ChatPanel analysis={analysis} context={context} />}
      </div>
    </div>
  );
};

export default App;
