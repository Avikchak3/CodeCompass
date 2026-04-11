import React, { useState } from 'react';
import axios from 'axios';

const getExtColor = (ext) => {
  const colors = {
    js:   { bg: 'rgba(255,217,61,0.1)',  color: '#ffd93d', border: 'rgba(255,217,61,0.2)'  },
    ts:   { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6', border: 'rgba(59,130,246,0.2)'  },
    jsx:  { bg: 'rgba(255,217,61,0.1)',  color: '#ffd93d', border: 'rgba(255,217,61,0.2)'  },
    tsx:  { bg: 'rgba(59,130,246,0.1)',  color: '#3b82f6', border: 'rgba(59,130,246,0.2)'  },
    py:   { bg: 'rgba(59,130,246,0.1)',  color: '#60a5fa', border: 'rgba(59,130,246,0.2)'  },
    java: { bg: 'rgba(249,115,22,0.1)',  color: '#fb923c', border: 'rgba(249,115,22,0.2)'  },
    md:   { bg: 'rgba(168,85,247,0.1)',  color: '#c084fc', border: 'rgba(168,85,247,0.2)'  },
    json: { bg: 'rgba(16,185,129,0.1)',  color: '#34d399', border: 'rgba(16,185,129,0.2)'  },
    env:  { bg: 'rgba(0,212,170,0.1)',   color: '#00d4aa', border: 'rgba(0,212,170,0.2)'   },
    css:  { bg: 'rgba(96,165,250,0.1)',  color: '#60a5fa', border: 'rgba(96,165,250,0.2)'  },
    html: { bg: 'rgba(251,146,60,0.1)',  color: '#fb923c', border: 'rgba(251,146,60,0.2)'  },
  };
  return colors[ext] || { bg: 'rgba(255,255,255,0.05)', color: '#a0a0a0', border: 'rgba(255,255,255,0.1)' };
};

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

const LOADING_STEPS = [
  { text: 'Reading your files...', icon: '📖' },
  { text: 'Detecting tech stack...', icon: '🔍' },
  { text: 'Finding entry points...', icon: '🎯' },
  { text: 'Building your roadmap...', icon: '🗺️' },
  { text: 'Almost ready...', icon: '✨' },
];

const FileUpload = ({ onAnalysisComplete }) => {
  const [files, setFiles]       = useState([]);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [error, setError]       = useState('');

  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles);
    setFiles(prev => {
      const existing = prev.map(f => f.name);
      return [...prev, ...arr.filter(f => !existing.includes(f.name))];
    });
    setError('');
  };

  const removeFile = (name) => setFiles(prev => prev.filter(f => f.name !== name));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const analyze = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError('');
    setLoadStep(0);

    const interval = setInterval(() => {
      setLoadStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 1500);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));

      const uploadRes = await axios.post(
        'http://localhost:5000/api/upload', formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const analyzeRes = await axios.post(
        'http://localhost:5000/api/analyze',
        { files: uploadRes.data.files }
      );

      clearInterval(interval);
      setLoading(false);
      onAnalysisComplete(analyzeRes.data.analysis, uploadRes.data.files);

    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 65px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>

      {/* Hero */}
      <div style={{
        textAlign: 'center', marginBottom: '48px',
        animation: 'fadeUp 0.6s ease both',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 14px', borderRadius: '20px',
          background: 'var(--accent-glow)',
          border: '1px solid rgba(0,212,170,0.2)',
          marginBottom: '20px',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse-glow 2s infinite' }} />
          <span style={{ fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--accent)', letterSpacing: '1px' }}>
            AI-POWERED ONBOARDING
          </span>
        </div>

        <h1 style={{
          fontSize: '48px', fontWeight: '600', letterSpacing: '-1.5px',
          lineHeight: '1.1', marginBottom: '16px',
          background: 'linear-gradient(180deg, #f0f0f0 0%, #808080 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Understand any codebase<br />in minutes
        </h1>

        <p style={{
          fontSize: '16px', color: 'var(--text2)',
          maxWidth: '440px', lineHeight: '1.6',
        }}>
          Drop your project files and get an instant roadmap,
          architecture diagram, and AI assistant to guide you.
        </p>
      </div>

      {/* Upload Card */}
      <div style={{
        width: '100%', maxWidth: '600px',
        animation: 'fadeUp 0.6s ease 0.1s both',
      }}>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            position: 'relative',
            border: dragging ? '1px solid rgba(0,212,170,0.5)' : '1px solid var(--border2)',
            borderRadius: 'var(--radius-xl)',
            padding: '48px 32px',
            textAlign: 'center',
            background: dragging ? 'rgba(0,212,170,0.03)' : 'var(--bg2)',
            transition: 'var(--transition)',
            cursor: 'pointer',
            marginBottom: '12px',
            animation: dragging ? 'borderGlow 1s ease infinite' : 'none',
          }}
        >
                  <input
          type="file"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          style={{
            position: 'absolute', inset: 0,
            opacity: 0, cursor: 'pointer',
            width: '100%', height: '100%',
            zIndex: 10,
          }}
        />

          <div style={{
            width: '52px', height: '52px', borderRadius: '16px',
            background: 'var(--bg3)', border: '1px solid var(--border2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', margin: '0 auto 16px',
            transition: 'var(--transition)',
            transform: dragging ? 'scale(1.1)' : 'none',
            animation: 'float 3s ease-in-out infinite',
          }}>
            📁
          </div>

          <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
            {dragging ? 'Release to upload' : 'Drop your project files here'}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '20px' }}>
            or click to browse — any file type accepted
          </div>

          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['.js', '.py', '.java', '.ts', '.md', '.json', '.env', '+ more'].map(t => (
              <span key={t} style={{
                fontFamily: 'var(--mono)', fontSize: '11px',
                padding: '4px 10px', borderRadius: '6px',
                background: 'var(--bg3)', border: '1px solid var(--border)',
                color: 'var(--text3)',
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            {files.map((f, i) => {
              const ext = f.name.split('.').pop().toLowerCase();
              const c = getExtColor(ext);
              return (
                <div key={f.name} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: 'var(--radius)',
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  fontSize: '13px',
                  animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
                  transition: 'var(--transition)',
                }}>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '10px', fontWeight: '500',
                    padding: '2px 7px', borderRadius: '5px',
                    background: c.bg, color: c.color, border: `1px solid ${c.border}`,
                    minWidth: '38px', textAlign: 'center',
                  }}>.{ext}</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text)' }}>
                    {f.name}
                  </span>
                  <span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: '11px' }}>
                    {formatSize(f.size)}
                  </span>
                  <button onClick={() => removeFile(f.name)} style={{
                    background: 'none', border: 'none', color: 'var(--text3)',
                    cursor: 'pointer', fontSize: '14px', padding: '2px 4px',
                    borderRadius: '4px', transition: 'var(--transition)',
                    fontFamily: 'var(--sans)',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
                  >✕</button>
                </div>
              );
            })}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: 'var(--radius)',
            background: 'rgba(255,107,107,0.08)',
            border: '1px solid rgba(255,107,107,0.2)',
            color: '#ff6b6b', fontSize: '13px', marginBottom: '12px',
            animation: 'fadeIn 0.3s ease both',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{
            padding: '24px', borderRadius: 'var(--radius-lg)',
            background: 'var(--bg2)', border: '1px solid var(--border)',
            textAlign: 'center', marginBottom: '12px',
            animation: 'fadeIn 0.3s ease both',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px', animation: 'float 1.5s ease-in-out infinite' }}>
              {LOADING_STEPS[loadStep].icon}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: '16px' }}>
              {LOADING_STEPS[loadStep].text}
            </div>
            <div style={{ height: '2px', background: 'var(--bg4)', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                borderRadius: '1px',
                animation: 'shimmer 1.5s linear infinite',
                backgroundSize: '200% auto',
              }} />
            </div>
          </div>
        )}

        {/* Analyze Button */}
        {files.length > 0 && !loading && (
          <button onClick={analyze} style={{
            width: '100%', padding: '14px',
            background: 'linear-gradient(135deg, #00d4aa, #0099ff)',
            border: 'none', borderRadius: 'var(--radius-lg)',
            color: 'white', fontSize: '15px', fontWeight: '500',
            fontFamily: 'var(--sans)', cursor: 'pointer',
            transition: 'var(--transition)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            animation: 'fadeUp 0.3s ease both',
            letterSpacing: '-0.2px',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,212,170,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            🧭 Analyze Project & Generate Roadmap
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;