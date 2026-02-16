import React, { useState } from 'react';

export default function ThemeSelector({ theme, onThemeChange, themes }){
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div style={{position:'relative'}}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          padding:'6px 10px',
          borderRadius:6,
          border:'1px solid rgba(255,255,255,0.3)',
          background:'rgba(255,255,255,0.1)',
          color:'#fff',
          cursor:'pointer',
          fontWeight:600,
          fontSize:12,
          display:'flex',
          alignItems:'center',
          gap:6
        }}
        title="Change theme"
      >
        <span>🎨 Theme</span>
        <span>{showDropdown ? '▲' : '▼'}</span>
      </button>

      {showDropdown && (
        <div 
          style={{
            position:'absolute',
            top:'100%',
            right:0,
            marginTop:8,
            background:'#fff',
            borderRadius:10,
            boxShadow:'0 10px 30px rgba(0,0,0,0.2)',
            zIndex:1000,
            minWidth:280,
            padding:12
          }}
          onClick={() => setShowDropdown(false)}
        >
          <div style={{fontSize:12, fontWeight:700, color:'#0f172a', marginBottom:10}}>Select Theme</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            {Object.entries(themes).map(([key, t]) => (
              <button
                key={key}
                onClick={() => {
                  onThemeChange(key);
                  setShowDropdown(false);
                }}
                style={{
                  display:'flex',
                  alignItems:'center',
                  gap:8,
                  padding:10,
                  background: theme === key ? 'rgba(14,165,233,0.1)' : '#f8fafc',
                  border: theme === key ? '2px solid #0ea5e9' : '1px solid #e0f2fe',
                  borderRadius:8,
                  cursor:'pointer',
                  transition:'all .2s ease',
                  fontSize:12,
                  fontWeight:600,
                  color:'#0f172a'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = theme === key ? 'rgba(14,165,233,0.15)' : '#f0f9ff';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = theme === key ? 'rgba(14,165,233,0.1)' : '#f8fafc';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <div style={{display:'flex', gap:4}}>
                  <div 
                    style={{
                      width:16,
                      height:16,
                      borderRadius:4,
                      background:t.accent1,
                      border:'1px solid rgba(0,0,0,0.1)'
                    }}
                  ></div>
                  <div 
                    style={{
                      width:16,
                      height:16,
                      borderRadius:4,
                      background:t.accent2,
                      border:'1px solid rgba(0,0,0,0.1)'
                    }}
                  ></div>
                </div>
                <span>{t.name}</span>
                {theme === key && <span style={{marginLeft:'auto'}}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
