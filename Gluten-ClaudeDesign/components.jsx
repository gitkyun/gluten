// components.jsx — shared Gluten components

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Save (taste accumulation) context
const SaveContext = React.createContext(null);

// ── Mood color system (5 keys) ─────────────────────────────────────────────
const MOOD_COLORS = {
  sweet:     '#FF602E',
  savory:    '#7A2E2E',
  healthy:   '#6B8F2E',
  specialty: '#D9A11A',
  pixel:     '#6B5BD9',
};
const MOOD_SOFT = {
  sweet:     'rgba(255,96,46,0.10)',
  savory:    'rgba(122,46,46,0.10)',
  healthy:   'rgba(107,143,46,0.10)',
  specialty: 'rgba(217,161,26,0.12)',
  pixel:     'rgba(107,91,217,0.10)',
};
const getMoodColor = (k) => MOOD_COLORS[k] || '#7A4A1A';
const getMoodSoft  = (k) => MOOD_SOFT[k]  || 'rgba(217,185,136,0.18)';

// ── Keyword → emoji mapping ────────────────────────────────────────────────
const KEYWORD_EMOJIS = {
  '버터향이 진해요': '🧈',
  '오래 머물기 좋아요': '☕',
  '혼자 오기 좋아요': '🧘',
  '햇살이 따뜻해요': '☀️',
  '재료가 신선해요': '🌿',
  '발효 향이 진해요': '🍞',
  '식사빵 퀄리티 최고': '⭐',
  '조용하고 집중하기 좋아요': '📚',
  '소금빵이 최고예요': '🧂',
  '청결하고 쾌적해요': '✨',
  '모던하고 세련된 분위기': '🏛️',
  '포장 빠르게 해줘요': '📦',
};
const getKeywordEmoji = (k) => KEYWORD_EMOJIS[k] || '·';

function SaveProvider({ children }) {
  const [saved, setSaved] = useState(() => new Set(['b8', 'b1']));
  const [recent, setRecent] = useState([]);
  const [savedFolders, setSavedFolders] = useState(() => ({
    b8: 'c1', b1: 'c2',
  }));
  // Bakery → folder id map; folder sheet trigger
  const [pendingSave, setPendingSave] = useState(null); // bakeryId or null
  const [saveToast, setSaveToast] = useState(null); // { bakeryId, folderId } or null

  const requestSave = useCallback((id) => {
    setPendingSave(id);
  }, []);

  const confirmSave = useCallback((bakeryId, folderId) => {
    setSaved(prev => new Set(prev).add(bakeryId));
    setSavedFolders(prev => ({ ...prev, [bakeryId]: folderId }));
    setRecent(r => [bakeryId, ...r.filter(x => x !== bakeryId)].slice(0, 6));
    setPendingSave(null);
  }, []);

  const unsave = useCallback((id) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setSavedFolders(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Quick toggle (used in lists for instant save). New saves go to default folder.
  const toggle = useCallback((id) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setSavedFolders(p => { const { [id]: _, ...rest } = p; return rest; });
        setSaveToast(null);
      } else {
        // Quick Save: instantly save to default folder 'c1' and trigger toast
        const defaultFolder = 'c1';
        next.add(id);
        setSavedFolders(p => ({ ...p, [id]: defaultFolder }));
        setRecent(r => [id, ...r.filter(x => x !== id)].slice(0, 6));
        setSaveToast({ bakeryId: id, folderId: defaultFolder });
      }
      return next;
    });
  }, []);

  return (
    <SaveContext.Provider value={{
      saved, savedFolders, recent,
      toggle, unsave,
      requestSave, confirmSave,
      pendingSave, setPendingSave,
      saveToast, setSaveToast,
    }}>{children}</SaveContext.Provider>
  );
}
const useSave = () => React.useContext(SaveContext);

// ── Inline icons (24x24, currentColor) ────────────────────────────────────
const Icon = {
  search: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8"/><path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  bookmark: (filled) => filled
    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9-9c-1.5-3.5 1-7 4.5-7 2 0 3.5 1 4.5 2.5C13 6 14.5 5 16.5 5c3.5 0 6 3.5 4.5 7-2 4.5-9 9-9 9z"/></svg>
    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-9-9c-1.5-3.5 1-7 4.5-7 2 0 3.5 1 4.5 2.5C13 6 14.5 5 16.5 5c3.5 0 6 3.5 4.5 7-2 4.5-9 9-9 9z" stroke="currentColor" strokeWidth="1.8"/></svg>,
  bell: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 17V11a6 6 0 1112 0v6l1.5 2H4.5L6 17z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 22a2 2 0 004 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  chevR: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevL: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevD: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 9l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  share: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v13M12 3l-4 4M12 3l4 4M5 13v6a1 1 0 001 1h12a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  loc: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>,
  sparkle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/></svg>,
  clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  tune: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="16" cy="6" r="2" fill="currentColor"/><circle cx="8" cy="12" r="2" fill="currentColor"/><circle cx="18" cy="18" r="2" fill="currentColor"/></svg>,
  plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  pin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5" fill="#fff"/></svg>,
  flame: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 4 5 5 5 11a5 5 0 11-10 0c0-3 2-4 2-7 0 0 2 1 3-4z"/></svg>,
  heart: (filled) => filled
    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9-9c-1.5-3.5 1-7 4.5-7 2 0 3.5 1 4.5 2.5C13 6 14.5 5 16.5 5c3.5 0 6 3.5 4.5 7-2 4.5-9 9-9 9z"/></svg>
    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-9-9c-1.5-3.5 1-7 4.5-7 2 0 3.5 1 4.5 2.5C13 6 14.5 5 16.5 5c3.5 0 6 3.5 4.5 7-2 4.5-9 9-9 9z" stroke="currentColor" strokeWidth="1.8"/></svg>,
  bubble: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1h-9l-5 4v-4H4a1 1 0 01-1-1V6a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  // Tab icons (robust check to handle both boolean and React props object)
  tabExplore: (filled) => {
    const f = filled && typeof filled === 'object' ? (filled.active || filled.filled) : !!filled;
    return <svg width="24" height="24" viewBox="0 0 24 24" fill={f ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" fill={f ? '#fff' : 'currentColor'} fillOpacity={f ? 1 : 0.001}/></svg>;
  },
  tabNear: (filled) => {
    const f = filled && typeof filled === 'object' ? (filled.active || filled.filled) : !!filled;
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" fill={f ? 'currentColor' : 'none'}/><circle cx="12" cy="10" r="2.5" fill={f ? '#fff' : 'none'} stroke={f ? '#fff' : 'currentColor'} strokeWidth={f ? 0 : 1.8}/></svg>;
  },
  tabSocial: (filled) => {
    const f = filled && typeof filled === 'object' ? (filled.active || filled.filled) : !!filled;
    return <svg width="24" height="24" viewBox="0 0 24 24" fill={f ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="10" r="3.5"/><circle cx="16" cy="8" r="2.5"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5M14 18c0-2 2-3.5 4-3.5s3 1 3 2.5" strokeLinecap="round"/></svg>;
  },
  tabProfile: (filled) => {
    const f = filled && typeof filled === 'object' ? (filled.active || filled.filled) : !!filled;
    return <svg width="24" height="24" viewBox="0 0 24 24" fill={f ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>;
  },
};

// ── Liquid Glass layer (responsive to [data-theme="dark"] via CSS variables) ──
function Glass({ children, style = {}, radius = 24, intensity = 'normal', dark, onClick }) {
  const blur = intensity === 'strong' ? 26 : intensity === 'soft' ? 14 : 20;
  
  // If dark is explicitly provided, use it. Otherwise, let CSS variables respond to dark theme dynamically!
  const hasDarkOverride = dark !== undefined;
  const isDarkOverride = dark === true;

  return (
    <div onClick={onClick} className={hasDarkOverride ? (isDarkOverride ? 'glass-dark' : 'glass-light') : ''} style={{ position: 'relative', borderRadius: radius, ...style }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: radius,
        backdropFilter: `blur(${blur}px) saturate(180%)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
        background: hasDarkOverride 
          ? (isDarkOverride ? 'rgba(28,28,32,0.42)' : (intensity === 'strong' ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.55)'))
          : (intensity === 'strong' ? 'var(--color-fill-overlay-glass)' : 'var(--color-fill-overlay-glass)'),
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: radius,
        boxShadow: hasDarkOverride
          ? (isDarkOverride ? 'inset 1px 1px 1px rgba(255,255,255,0.12), inset -1px -1px 1px rgba(255,255,255,0.05)' : 'inset 1.2px 1.2px 0.5px rgba(255,255,255,0.85), inset -1px -1px 1px rgba(255,255,255,0.4)')
          : 'var(--elevation-shadow-1)',
        border: hasDarkOverride
          ? (isDarkOverride ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(255,255,255,0.6)')
          : '1px solid var(--color-border-subtle)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ── Image placeholder w/ optional subject hint ────────────────────────────
function Placeholder({ tone = 'ph-wheat', style = {}, children, hint }) {
  return (
    <div className={`ph ${tone}`} style={{ borderRadius: 'var(--radius-xs, 8px)', ...style }}>
      {hint && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'flex-end', padding: 12, zIndex: 2,
        }}>
          <span style={{
            fontSize: 11, color: 'rgba(255,255,255,0.85)',
            letterSpacing: '0.03em', textTransform: 'lowercase',
            mixBlendMode: 'screen', fontWeight: 600,
          }}>{hint}</span>
        </div>
      )}
      {children && <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>}
    </div>
  );
}

// ── Save star button ──────────────────────────────────────────────────────
function SaveStar({ bakeryId, size = 36, dark = false }) {
  const { saved, toggle } = useSave();
  const isSaved = saved.has(bakeryId);
  const [pulse, setPulse] = useState(false);
  const onClick = (e) => {
    e.stopPropagation();
    if (!isSaved) { setPulse(true); setTimeout(() => setPulse(false), 380); }
    toggle(bakeryId);
  };
  return (
    <button onClick={onClick} className="lift" style={{
      width: size, height: size, borderRadius: '50%',
      border: 'none', cursor: 'pointer',
      background: 'transparent', padding: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span className={pulse ? 'saved-pulse' : ''} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isSaved ? (
          <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="var(--color-fill-brand-default)">
            <path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z" stroke="var(--color-fill-brand-hover)" strokeWidth="0.5"/>
          </svg>
        ) : (
          <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
            <path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z"
              stroke={dark ? 'rgba(255,255,255,0.9)' : 'var(--color-icon-muted)'} strokeWidth="1.6" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
    </button>
  );
}

// ── Pill chip / tag ───────────────────────────────────────────────────────
function Chip({ label, active = false, variant = 'solid', size = 'medium', disabled = false, onClick, style = {}, leading }) {
  let padding = '8px 14px';
  let fontSize = 13;
  let borderRadius = 8;
  
  if (size === 'xsmall') {
    padding = '4px 8px';
    fontSize = 11;
  } else if (size === 'small') {
    padding = '6px 12px';
    fontSize = 12;
  } else if (size === 'large') {
    padding = '10px 18px';
    fontSize = 15;
  }
  
  const isOutlined = variant === 'outlined';
  
  let background = 'var(--color-fill-neutral-default)';
  let color = 'var(--color-text-secondary)';
  let border = 'none';
  
  if (active) {
    if (isOutlined) {
      background = 'var(--color-fill-surface-default)';
      color = 'var(--color-fill-brand-default)';
      border = '1.5px solid var(--color-fill-brand-default)';
    } else {
      background = 'var(--color-fill-brand-default)';
      color = 'var(--color-common-0)';
    }
  } else {
    if (isOutlined) {
      background = 'var(--color-fill-surface-default)';
      color = 'var(--color-text-secondary)';
      border = '1px solid var(--color-border-default)';
    } else {
      background = 'var(--color-fill-neutral-default)';
      color = 'var(--color-text-secondary)';
    }
  }
  
  if (disabled) {
    background = 'var(--color-fill-disabled)';
    color = 'var(--color-text-disabled)';
    border = isOutlined ? '1px solid var(--color-border-disabled)' : 'none';
  }

  return (
    <button 
      onClick={disabled ? null : onClick} 
      className="lift" 
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding, borderRadius,
        background,
        color,
        border,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize, 
        fontWeight: active ? 700 : 600, 
        letterSpacing: 0,
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
        opacity: disabled ? 0.5 : 1,
        boxShadow: active && !isOutlined ? '0 1px 2px rgba(15,23,42,0.12)' : 'none',
        transition: 'all 160ms ease',
        ...style,
      }}
    >
      {leading}
      {label}
    </button>
  );
}


// ── Product bottom navigation ─────────────────────────────────────────────
function BottomNav({ tab, setTab, onSearch }) {
  const tabs = [
    { id: 'explore', label: '탐색', icon: Icon.tabExplore },
    { id: 'near', label: '주변', icon: Icon.tabNear },
    { id: 'social', label: '소셜', icon: Icon.tabSocial },
    { id: 'profile', label: '마이', icon: Icon.tabProfile },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 16, left: 14, right: 14,
      zIndex: 120, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <div style={{
        flex: 1, height: 62, borderRadius: 16,
        background: 'rgba(255,254,252,0.97)',
        border: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 8px 24px rgba(19,15,13,0.09), inset 0 1px 0 rgba(255,255,255,0.9)',
        display: 'flex', alignItems: 'center', padding: '0 6px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        {tabs.map(t => {
          const active = tab === t.id;
          const onClick = () => setTab(t.id);
          return (
            <button key={t.id} onClick={onClick} className="lift" style={{
              flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '7px 2px', borderRadius: 12,
              color: active ? 'var(--color-primary-normal)' : 'var(--color-text-secondary)',
              fontFamily: 'inherit',
            }}>
              {t.icon(active)}
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 600,
                letterSpacing: 0,
                marginTop: 1,
              }}>{t.label}</span>
              <div style={{
                width: active ? 4 : 0, height: 4, borderRadius: 99, marginTop: 1,
                background: 'var(--color-primary-normal)',
                transition: 'width 200ms cubic-bezier(0.2,0,0,1)',
              }}/>
            </button>
          );
        })}
      </div>

      <button onClick={onSearch} className="lift" style={{
        width: 62, height: 62, borderRadius: 16, border: 'none',
        background: 'var(--color-fill-brand-default)',
        boxShadow: '0 8px 20px rgba(17,24,39,0.22), 0 2px 6px rgba(17,24,39,0.14)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#fff',
        flexShrink: 0,
      }}>
        <Icon.search />
      </button>
    </div>
  );
}

// ── Search bottom bar ─────────────────────────────────────────────────────
function SearchBottomBar({ query, setQuery, onBack }) {
  return (
    <div style={{
      position: 'absolute', bottom: 16, left: 14, right: 14,
      zIndex: 120, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {/* Circle back button to Explore */}
      <button onClick={onBack} className="lift" style={{
        width: 56, height: 56, borderRadius: 14, border: '1px solid var(--color-border-subtle)',
        background: '#fff',
        boxShadow: '0 10px 28px rgba(15,23,42,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--color-text-secondary)',
        flexShrink: 0,
        padding: 0,
      }}>
        <Icon.chevL />
      </button>

      {/* Capsule input field */}
      <div style={{
        flex: 1, height: 56, borderRadius: 14,
        background: '#fff',
        border: '1px solid var(--color-border-subtle)',
        boxShadow: '0 10px 28px rgba(15,23,42,0.10)',
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
      }}>
        <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>
          <Icon.search />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="지역, 빵 종류, 분위기 검색..."
          autoFocus
          style={{
            flex: 1, border: 'none', background: 'transparent',
            outline: 'none', fontSize: 15, fontWeight: 500,
            color: 'var(--color-text-primary)',
            fontFamily: 'inherit',
            padding: 0,
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            padding: 4, display: 'flex', alignItems: 'center',
            color: 'var(--color-text-secondary)',
          }}>
            <Icon.close />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Gluten Logo ─────────────────────────────────────────────────────────────
const GlutenLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
    <div style={{
      width: 34, height: 34, borderRadius: 11,
      background: 'linear-gradient(145deg, #2A2520 0%, #111827 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(17,24,39,0.20), inset 0 1px 0 rgba(255,255,255,0.08)',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 18, lineHeight: 1 }}>🥐</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 18, fontWeight: 800,
        color: 'var(--color-text-primary)',
        letterSpacing: '-0.02em',
      }}>Gluten</span>
      <span style={{
        marginTop: 3,
        fontSize: 10, fontWeight: 600,
        color: 'var(--color-text-alternative)',
        letterSpacing: '0.04em',
      }}>bakery guide</span>
    </div>
  </div>
);

// ── Top Bar — service shell pattern ───────────────────────────────────────
function TopBar({ variant = 'default', title, leftAction, rightActions = [], activeTab, onTabChange, tabs = [], style = {} }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 92, boxSizing: 'border-box', paddingTop: 18,
      paddingLeft: 20, paddingRight: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(250,249,247,0.96)',
      borderBottom: '1px solid rgba(112,110,105,0.08)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      zIndex: 100,
      ...style,
    }}>
      {/* Left section */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        {variant === 'logo' && <GlutenLogo />}
        {variant === 'default' && leftAction && (
          <button onClick={leftAction} className="lift" style={{
            width: 40, height: 40, borderRadius: 10,
            border: 'none', background: 'var(--color-fill-neutral-default)', cursor: 'pointer',
            padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-normal)', marginLeft: -4,
          }}>
            <Icon.chevL />
          </button>
        )}
        {variant === 'default' && title && (
          <span style={{
            marginLeft: leftAction ? 10 : 0,
            fontSize: 18, fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{title}</span>
        )}
      </div>

      {/* Center section (for Tab variant) */}
      {variant === 'tab' && tabs.length > 0 && (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flex: 2, background: 'var(--color-fill-surface-subtle)', borderRadius: 10, padding: 4 }}>
          {tabs.map(t => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => onTabChange(t.id)} style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 13, fontWeight: active ? 800 : 600,
                color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                padding: '8px 12px', position: 'relative', fontFamily: 'inherit',
                borderRadius: 8,
                background: active ? '#fff' : 'transparent',
              }}>
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', flex: 1 }}>
        {rightActions.map((action, i) => (
          <button key={i} onClick={action.onClick} className="lift" style={{
            width: 40, height: 40, borderRadius: 10,
            border: 'none', background: 'var(--color-fill-neutral-default)', cursor: 'pointer',
            padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-normal)', position: 'relative',
          }}>
            {action.icon}
            {action.badge && (
              <span style={{
                position: 'absolute', top: 2, right: 2, width: 6, height: 6,
                borderRadius: 99, background: 'var(--color-primary-normal)',
                border: '1.5px solid #fff',
              }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Section heading ──────────────────────────────────────────────────────
function SectionHead({ overline, title, action, dark }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '0 20px', marginBottom: 14,
      color: dark ? '#fff' : 'var(--color-text-strong)',
    }}>
      <div>
        {overline && <div style={{
          fontSize: 11, letterSpacing: '0.05em',
          color: dark ? 'rgba(255,255,255,0.55)' : 'var(--color-text-alternative)',
          fontWeight: 600, marginBottom: 6,
        }}>{overline}</div>}
        <h2 style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontSize: 22, lineHeight: '28px', fontWeight: 700, letterSpacing: '-0.02em',
        }}>{title}</h2>
      </div>
      {action && <button style={{
        border: 'none', background: 'transparent', cursor: 'pointer',
        color: dark ? 'rgba(255,255,255,0.7)' : 'var(--color-text-alternative)',
        fontSize: 13, fontWeight: 500, padding: 0,
        display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'inherit',
      }}>{action} <Icon.chevR /></button>}
    </div>
  );
}

// ── Mood lozenge — used as a soft tag in cards / detail ──────────────────
function MoodLoz({ label, dark }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 10px', borderRadius: 99,
      background: dark ? 'rgba(255,255,255,0.16)' : 'rgba(40,30,20,0.06)',
      color: dark ? 'rgba(255,255,255,0.9)' : 'var(--color-text-normal)',
      fontSize: 12, fontWeight: 600, letterSpacing: '0.01em',
      backdropFilter: dark ? 'blur(8px)' : undefined,
    }}>{label}</span>
  );
}

// ── Save Toast component (quick save notification) ───────────────────────
function SaveToast() {
  const { saveToast, setSaveToast, requestSave } = useSave();
  
  React.useEffect(() => {
    if (saveToast) {
      const timer = setTimeout(() => {
        setSaveToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveToast]);

  if (!saveToast) return null;

  const bakery = BAKERY_BY_ID[saveToast.bakeryId];
  if (!bakery) return null;

  return (
    <div style={{
      position: 'absolute', bottom: 90, left: 16, right: 16, zIndex: 190,
      animation: 'slideUpToast 300ms cubic-bezier(0.2,0,0,1)',
    }}>
      <style>{`
        @keyframes slideUpToast {
          from { transform: translateY(80px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <Glass radius={16} style={{ padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>⭐</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)' }}>
                {bakery.name}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-alternative)', marginTop: 1 }}>
                컬렉션에 저장되었습니다
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setSaveToast(null);
              requestSave(saveToast.bakeryId); // Opens the folder selection sheet!
            }}
            style={{
              background: 'var(--color-primary-light)', border: 'none',
              padding: '6px 12px', borderRadius: 20, color: 'var(--color-text-brand)',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            폴더 변경
          </button>
        </div>
      </Glass>
    </div>
  );
}

// ── Figma Design System Components (이식용 컴포넌트군) ───────────────────

// 1. Avatar (Figma: Avatar/Avatar)
function Avatar({ size = 'medium', tone, label, onClick, style = {} }) {
  let diameter = 32;
  if (size === 'small') diameter = 24;
  else if (size === 'large') diameter = 48;
  else if (size === 'xlarge') diameter = 64;
  
  return (
    <div 
      onClick={onClick}
      style={{
        width: diameter,
        height: diameter,
        borderRadius: '50%',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-fill-neutral-default)',
        color: 'var(--color-text-primary)',
        fontWeight: 700,
        fontSize: diameter * 0.4,
        userSelect: 'none',
        flexShrink: 0,
        ...style
      }}
      className={`ph ${tone || 'ph-wheat'} ${onClick ? 'lift' : ''}`}
    >
      {label && <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{label}</span>}
    </div>
  );
}

// 2. Thumbnail (Figma: Thumbnail/Thumbnail)
function Thumbnail({ size = 'medium', tone, style = {}, children }) {
  let width = 56;
  let height = 56;
  if (size === 'small') {
    width = 40; height = 40;
  } else if (size === 'large') {
    width = 100; height = 100;
  } else if (size === 'card') {
    width = '100%'; height = 180;
  } else if (size === 'hero') {
    width = '100%'; height = 280;
  }
  
  return (
    <div 
      className={`ph ${tone || 'ph-wheat'}`}
      style={{
        width,
        height,
        borderRadius: 'var(--radius-xs, 8px)',
        overflow: 'hidden',
        position: 'relative',
        ...style
      }}
    >
      {children}
    </div>
  );
}

// 3. Divider (Figma: Divider/Divider)
function Divider({ variant = 'normal', vertical = false, style = {} }) {
  const isThick = variant === 'thick';
  const size = isThick ? '8px' : '1px';
  const color = isThick ? 'var(--color-fill-neutral-default)' : 'var(--color-border-disabled)';
  
  return (
    <div 
      style={{
        background: color,
        width: vertical ? size : '100%',
        height: vertical ? '100%' : size,
        flexShrink: 0,
        margin: isThick ? 0 : '8px 0',
        ...style
      }}
    />
  );
}

// 4. Button (Figma: Button/Button)
function Button({ 
  label, 
  onClick, 
  variant = 'solid',    // solid, outlined
  color = 'primary',     // primary, assistive
  size = 'large',        // large, medium, small
  disabled = false, 
  iconOnly = false,
  leadingIcon, 
  trailingIcon, 
  style = {} 
}) {
  let background = 'transparent';
  let textColor = 'var(--color-text-primary)';
  let border = 'none';
  
  const variantStr = (variant || '').toLowerCase();
  const colorStr = (color || '').toLowerCase();
  
  const isSolid = variantStr === 'solid';
  const isOutlined = variantStr === 'outlined';
  const isPrimary = colorStr === 'primary';
  const isAssistive = colorStr === 'assistive';
  
  if (isSolid) {
    if (isPrimary) {
      if (disabled) {
        background = 'var(--color-fill-brand-disabled)';
        textColor = 'var(--color-text-brand-disabled)';
      } else {
        background = 'var(--color-fill-surface-brand, var(--color-fill-brand-default))';
        textColor = 'var(--color-common-0)';
      }
    } else if (isAssistive) {
      if (disabled) {
        background = 'var(--color-fill-surface-subtle)';
        textColor = 'var(--color-text-disabled)';
      } else {
        background = 'var(--color-fill-surface-subtle)';
        textColor = 'var(--color-text-primary)';
      }
    }
  } else if (isOutlined) {
    background = 'transparent';
    if (isPrimary) {
      if (disabled) {
        border = '1.5px solid var(--color-border-brand-disabled, var(--color-border-disabled))';
        textColor = 'var(--color-text-branddisabled, var(--color-text-disabled))';
      } else {
        border = '1.5px solid var(--color-border-brand)';
        textColor = 'var(--color-text-brand)';
      }
    } else if (isAssistive) {
      if (disabled) {
        border = '1px solid var(--color-border-disabled)';
        textColor = 'var(--color-text-disabled)';
      } else {
        border = '1px solid var(--color-border-default)';
        textColor = 'var(--color-text-primary)';
      }
    }
  }
  
  // Size specifications (Heights and paddings based on Figma specs)
  let padding = '12px 24px';
  let fontSize = 16;
  let height = 48;
  let borderRadius = 'var(--radius-control, 8px)';
  
  if (size.toLowerCase() === 'small') {
    padding = '6px 12px';
    fontSize = 12;
    height = 36;
  } else if (size.toLowerCase() === 'medium') {
    padding = '10px 18px';
    fontSize = 14;
    height = 44;
  }
  
  if (iconOnly) {
    padding = '0';
    height = size.toLowerCase() === 'small' ? 36 : size.toLowerCase() === 'medium' ? 44 : 48;
    style = { width: height, ...style };
  }
  
  return (
    <button
      onClick={disabled ? null : onClick}
      disabled={disabled}
      className={disabled ? '' : 'lift'}
      style={{
        height,
        padding,
        background,
        color: textColor,
        border,
        borderRadius,
        fontSize,
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        fontFamily: 'inherit',
        boxShadow: isSolid && isPrimary && !disabled ? '0 8px 18px rgba(17,24,39,0.16)' : 'none',
        transition: 'all 160ms ease',
        userSelect: 'none',
        ...style
      }}
    >
      {!iconOnly && leadingIcon}
      {iconOnly ? (leadingIcon || trailingIcon) : label}
      {!iconOnly && trailingIcon}
    </button>
  );
}

// 5. Content Badge (Figma: Content Badge/Content Badge)
function ContentBadge({ 
  label, 
  variant = 'solid',    // solid, outlined
  size = 'xsmall',       // medium, small, xsmall
  color = 'neutral',     // neutral, accent, or specific mood keys (sweet, savory, etc.)
  style = {} 
}) {
  let background = 'transparent';
  let textColor = 'var(--color-text-primary)';
  let border = 'none';
  
  const variantStr = (variant || '').toLowerCase();
  const isSolid = variantStr === 'solid';
  const isOutlined = variantStr === 'outlined';
  
  // Specific mood check
  const moodKey = (color || '').toLowerCase();
  const isMood = ['sweet', 'savory', 'healthy', 'specialty', 'pixel'].includes(moodKey);
  const isAccent = moodKey === 'accent';
  
  if (isSolid) {
    if (isMood) {
      background = `var(--color-mood-${moodKey}-soft, rgba(254, 81, 2, 0.1))`;
      textColor = `var(--color-mood-${moodKey}, #fe5102)`;
    } else if (isAccent) {
      background = 'var(--color-fill-surface-brandsubtle, var(--color-fill-brand-subtle))';
      textColor = 'var(--color-text-brand)';
    } else {
      // Neutral
      background = 'var(--color-fill-surface-subtle)';
      textColor = 'var(--color-text-primary)';
    }
  } else if (isOutlined) {
    background = 'transparent';
    if (isMood) {
      border = `1px solid var(--color-mood-${moodKey}, #fe5102)`;
      textColor = `var(--color-mood-${moodKey}, #fe5102)`;
    } else if (isAccent) {
      border = '1.5px solid var(--color-border-brand)';
      textColor = 'var(--color-text-brand)';
    } else {
      // Neutral
      border = '1px solid var(--color-border-default)';
      textColor = 'var(--color-text-primary)';
    }
  }
  
  // Size specifications
  let padding = '2px 6px';
  let fontSize = 11;
  
  if (size.toLowerCase() === 'medium') {
    padding = '6px 12px';
    fontSize = 13;
  } else if (size.toLowerCase() === 'small') {
    padding = '4px 8px';
    fontSize = 12;
  }
  
  return (
    <div 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding,
        borderRadius: 'var(--radius-xxs, 4px)',
        background,
        color: textColor,
        border,
        fontSize,
        fontWeight: 700,
        letterSpacing: '-0.02em',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...style
      }}
    >
      {label}
    </div>
  );
}

// 6. List Cell (Figma: List Cell/List Cell)
function ListCell({ title, subtitle, thumbnail, action, onClick, style = {} }) {
  return (
    <div 
      onClick={onClick}
      className={onClick ? 'lift' : ''}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px var(--gap-s, 16px)',
        gap: 12,
        borderBottom: '1px solid var(--color-border-subtle)',
        background: 'var(--color-fill-surface-default)',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {thumbnail && (
        <div style={{ flexShrink: 0 }}>
          {thumbnail}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {subtitle}
          </div>
        )}
      </div>
      {action && (
        <div style={{ flexShrink: 0 }}>
          {action}
        </div>
      )}
    </div>
  );
}


// 7. IconButton (Figma: Button/Icon/Background, Normal, Outlined)
function IconButton({
  icon,
  onClick,
  variant = 'normal',   // normal, background, outlined
  size = 'medium',       // large, medium, small
  disabled = false,
  style = {}
}) {
  let background = 'transparent';
  let border = 'none';
  let color = 'var(--color-text-primary)';
  
  const variantStr = (variant || '').toLowerCase();
  const isBackground = variantStr === 'background';
  const isOutlined = variantStr === 'outlined';
  
  if (isBackground) {
    background = 'var(--color-fill-neutral-default)';
  } else if (isOutlined) {
    border = '1px solid var(--color-border-default)';
  }
  
  if (disabled) {
    background = isBackground ? 'var(--color-fill-disabled)' : 'transparent';
    border = isOutlined ? '1px solid var(--color-border-disabled)' : 'none';
    color = 'var(--color-text-disabled)';
  }

  let diameter = 40;
  if (size.toLowerCase() === 'small') diameter = 32;
  else if (size.toLowerCase() === 'large') diameter = 48;

  return (
    <button
      onClick={disabled ? null : onClick}
      disabled={disabled}
      className={disabled ? '' : 'lift'}
      style={{
        width: diameter,
        height: diameter,
        borderRadius: '50%',
        background,
        color,
        border,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        padding: 0,
        transition: 'all 200ms ease',
        ...style
      }}
    >
      {icon}
    </button>
  );
}

// 8. AvatarGroup (Figma: Avatar/Avatar Group)
function AvatarGroup({ avatars = [], max = 4, size = 'medium', style = {} }) {
  const visibleAvatars = avatars.slice(0, max);
  const extraCount = avatars.length - max;
  
  let marginSpacing = -8;
  if (size === 'small') marginSpacing = -6;
  else if (size === 'large') marginSpacing = -12;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', ...style }}>
      {visibleAvatars.map((av, idx) => (
        <Avatar
          key={idx}
          size={size}
          tone={av.tone}
          label={av.label}
          style={{
            marginLeft: idx > 0 ? marginSpacing : 0,
            border: '2px solid var(--color-fill-surface-default)',
            zIndex: idx,
          }}
        />
      ))}
      {extraCount > 0 && (
        <div
          style={{
            marginLeft: marginSpacing,
            zIndex: max,
            border: '2px solid var(--color-fill-surface-default)',
          }}
        >
          <Avatar
            size={size}
            tone="ph-stone"
            label={`+${extraCount}`}
          />
        </div>
      )}
    </div>
  );
}

// 9. Card (Figma: Card/Card)
function Card({
  title,
  subtitle,
  imageTone,
  rating,
  tags = [],
  saved = false,
  onSaveToggle,
  onClick,
  style = {}
}) {
  return (
    <div
      onClick={onClick}
      className="lift"
      style={{
        width: '100%',
        borderRadius: 'var(--radius-m, 24px)',
        border: 'none',
        background: 'var(--color-fill-surface-default)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 2px 8px rgba(19,15,13,0.06), 0 12px 28px rgba(19,15,13,0.08)',
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
      {/* Card Image Cover */}
      <div style={{ position: 'relative', width: '100%', height: 160 }}>
        <Thumbnail size="card" tone={imageTone} style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, height: '100%' }} />
        {onSaveToggle && (
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(255,255,255,0.85)', borderRadius: '50%' }}>
            <SaveStar size={36} bakeryId={title} />
          </div>
        )}
      </div>
      
      {/* Card Body */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</span>
          {rating !== undefined && (
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-fill-brand-default)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              ★ {rating}
            </span>
          )}
        </div>
        {subtitle && <span style={{ fontSize: 12.5, color: 'var(--color-text-secondary)' }}>{subtitle}</span>}
        {tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            {tags.map((t, idx) => (
              <ContentBadge key={idx} label={t} variant="solid" size="xsmall" color="neutral" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 10. ListCard (Figma: Card/List Card)
function ListCard({
  title,
  subtitle,
  imageTone,
  meta = [],
  onClick,
  style = {}
}) {
  return (
    <div
      onClick={onClick}
      className="lift"
      style={{
        display: 'flex',
        padding: 12,
        borderRadius: 'var(--radius-s, 16px)',
        border: 'none',
        background: 'var(--color-fill-surface-default)',
        cursor: onClick ? 'pointer' : 'default',
        gap: 12,
        alignItems: 'center',
        boxShadow: '0 1px 4px rgba(19,15,13,0.06), 0 6px 16px rgba(19,15,13,0.07)',
        ...style
      }}
    >
      <Thumbnail size="large" tone={imageTone} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
        {subtitle && <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</span>}
        {meta.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
            {meta.map((m, idx) => (
              <ContentBadge key={idx} label={m} variant="solid" size="xsmall" color="neutral" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 11. Checkbox (Figma: Control/Checkbox)
function Checkbox({
  checked = false,
  disabled = false,
  label,
  onChange,
  style = {}
}) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        opacity: disabled ? 0.6 : 1,
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--color-text-primary)',
        ...style
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked)}
        style={{ display: 'none' }}
      />
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          border: checked ? 'none' : '2px solid var(--color-border-default)',
          background: checked ? 'var(--color-fill-brand-default)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms ease',
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        )}
      </div>
      {label && <span>{label}</span>}
    </label>
  );
}

// 12. Radio (Figma: Control/Radio)
function Radio({
  checked = false,
  disabled = false,
  label,
  onChange,
  style = {}
}) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        opacity: disabled ? 0.6 : 1,
        fontSize: 14,
        fontWeight: 500,
        color: 'var(--color-text-primary)',
        ...style
      }}
    >
      <input
        type="radio"
        checked={checked}
        disabled={disabled}
        onChange={() => onChange && onChange(true)}
        style={{ display: 'none' }}
      />
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: checked ? 'none' : '2px solid var(--color-border-default)',
          background: checked ? 'var(--color-fill-brand-default)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms ease',
        }}
      >
        {checked && (
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
        )}
      </div>
      {label && <span>{label}</span>}
    </label>
  );
}

// 13. Switch (Figma: Switch/Switch)
function Switch({
  checked = false,
  disabled = false,
  onChange,
  style = {}
}) {
  return (
    <label
      style={{
        display: 'inline-flex',
        position: 'relative',
        width: 44,
        height: 24,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked)}
        style={{ display: 'none' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 99,
          background: checked ? 'var(--color-fill-brand-default)' : 'var(--color-fill-neutral-pressed, #dcdcdc)',
          transition: 'background 200ms ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 22 : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 200ms cubic-bezier(0.2,0,0,1)',
        }}
      />
    </label>
  );
}

// 14. Tab (Figma: Tab/Tab)
function Tab({
  label,
  active = false,
  onClick,
  style = {}
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: 14.5,
        fontWeight: active ? 700 : 500,
        color: active ? 'var(--color-text-primary)' : 'var(--color-text-disabled)',
        padding: '10px 4px',
        position: 'relative',
        fontFamily: 'inherit',
        outline: 'none',
        ...style
      }}
    >
      {label}
      {active && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'var(--color-fill-brand-default)',
            borderRadius: 99,
          }}
        />
      )}
    </button>
  );
}

// 14b. Tabs (Figma: Tab Group equivalent)
function Tabs({
  tabs = [],
  activeTab,
  onChange,
  style = {}
}) {
  return (
    <div 
      className="scroll" 
      style={{
        display: 'flex', 
        gap: 0, 
        overflowX: 'auto', 
        padding: '0 8px',
        borderBottom: '1px solid var(--color-border-subtle, var(--color-line-alternative))',
        background: 'var(--color-fill-surface-default, #fff)',
        ...style
      }}
    >
      {tabs.map(t => (
        <Tab
          key={t.id}
          label={t.label}
          active={activeTab === t.id}
          onClick={() => onChange && onChange(t.id)}
          style={{ flexShrink: 0, padding: '13px 14px' }}
        />
      ))}
    </div>
  );
}

// 15. SegmentedControl (Figma: Segmented Control/Segmented Control)
function SegmentedControl({
  options = [],
  selected,
  onChange,
  style = {}
}) {
  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--color-fill-surface-subtle, #f5f5f5)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 12,
        padding: 4,
        gap: 4,
        ...style
      }}
    >
      {options.map((opt) => {
        const active = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange && onChange(opt.value)}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: 8,
              minHeight: 36,
              background: active ? 'var(--color-fill-surface-default, #fff)' : 'transparent',
              color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontSize: 13.5,
              fontWeight: active ? 800 : 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: active ? '0 1px 2px rgba(15,23,42,0.08)' : 'none',
              transition: 'all 160ms ease',
              padding: '7px 12px',
              outline: 'none',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// 16. Select (Figma: Select/Select)
function Select({
  options = [],
  value,
  placeholder = '선택하세요...',
  disabled = false,
  onChange,
  style = {}
}) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);
  
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOpt = options.find(o => o.value === value);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%', ...style }}>
      <div
        onClick={() => !disabled && setOpen(!open)}
        style={{
          height: 48,
          borderRadius: 'var(--radius-control, 12px)',
          border: '1px solid var(--color-border-default)',
          background: 'var(--color-fill-surface-default)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          fontSize: 14.5,
          color: selectedOpt ? 'var(--color-text-primary)' : 'var(--color-text-disabled)',
        }}
      >
        <span>{selectedOpt ? selectedOpt.label : placeholder}</span>
        <span style={{ transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
      </div>
      
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 52,
            left: 0,
            right: 0,
            borderRadius: 'var(--radius-control, 12px)',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-fill-surface-default)',
            boxShadow: 'var(--elevation-shadow-2)',
            zIndex: 1000,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange && onChange(opt.value);
                setOpen(false);
              }}
              style={{
                padding: '12px 16px',
                fontSize: 14,
                cursor: 'pointer',
                background: value === opt.value ? 'var(--color-fill-neutral-default)' : 'transparent',
                color: 'var(--color-text-primary)',
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 17. Textfield (Figma: Textinput/Textfield)
function Textfield({
  value,
  placeholder,
  disabled = false,
  error = false,
  helperText,
  leadingIcon,
  trailingIcon,
  onChange,
  style = {}
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', ...style }}>
      <div
        style={{
          height: 48,
          borderRadius: 'var(--radius-input, 10px)',
          border: error ? '1.5px solid var(--color-border-status-danger)' : '1px solid var(--color-border-default)',
          background: 'var(--color-fill-surface-default)',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {leadingIcon && <span style={{ color: 'var(--color-text-disabled)' }}>{leadingIcon}</span>}
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 14.5,
            color: 'var(--color-text-primary)',
            fontFamily: 'inherit',
            padding: 0,
          }}
        />
        {trailingIcon && <span style={{ color: 'var(--color-text-disabled)' }}>{trailingIcon}</span>}
      </div>
      {helperText && (
        <span style={{ fontSize: 11, color: error ? 'var(--color-text-status-danger)' : 'var(--color-text-disabled)', paddingLeft: 4 }}>
          {helperText}
        </span>
      )}
    </div>
  );
}

// 18. Textarea (Figma: Textinput/Textarea)
function Textarea({
  value,
  placeholder,
  disabled = false,
  error = false,
  helperText,
  rows = 4,
  onChange,
  style = {}
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', ...style }}>
      <textarea
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        onChange={(e) => onChange && onChange(e.target.value)}
        style={{
          borderRadius: 'var(--radius-input, 10px)',
          border: error ? '1.5px solid var(--color-border-status-danger)' : '1px solid var(--color-border-default)',
          background: 'var(--color-fill-surface-default)',
          padding: 12,
          outline: 'none',
          fontSize: 14.5,
          color: 'var(--color-text-primary)',
          fontFamily: 'inherit',
          resize: 'none',
          opacity: disabled ? 0.6 : 1,
        }}
      />
      {helperText && (
        <span style={{ fontSize: 11, color: error ? 'var(--color-text-status-danger)' : 'var(--color-text-disabled)', paddingLeft: 4 }}>
          {helperText}
        </span>
      )}
    </div>
  );
}

// 19. Alert (Figma: Alert/Alert)
function Alert({
  open = false,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'rgba(0,0,0,0.4)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 320,
          background: 'var(--color-fill-surface-default)',
          borderRadius: 'var(--radius-m, 24px)',
          padding: 20,
          boxShadow: 'var(--elevation-shadow-3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {title && <span style={{ fontSize: 16.5, fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</span>}
          {message && <span style={{ fontSize: 13.5, color: 'var(--color-text-secondary)', lineHeight: '18px' }}>{message}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button label={cancelLabel} variant="outlined" color="assistive" size="medium" onClick={onCancel} />
          )}
          <Button label={confirmLabel} variant="solid" color="primary" size="medium" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}

// 20. Menu (Figma: Menu/Menu)
function Menu({
  open = false,
  items = [],
  onClose,
  style = {}
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: 'var(--radius-control, 12px)',
        border: '1px solid var(--color-border-default)',
        background: 'var(--color-fill-surface-default)',
        boxShadow: 'var(--elevation-shadow-2)',
        padding: '6px 0',
        zIndex: 1000,
        minWidth: 140,
        ...style
      }}
    >
      {items.map((it, idx) => (
        <div
          key={idx}
          onClick={() => {
            it.onClick && it.onClick();
            onClose && onClose();
          }}
          style={{
            padding: '10px 16px',
            fontSize: 13.5,
            cursor: 'pointer',
            color: 'var(--color-text-primary)',
            transition: 'background 200ms',
          }}
          className="lift"
        >
          {it.label}
        </div>
      ))}
    </div>
  );
}

// 21. Tooltip (Figma: Tooltip/Tooltip)
function Tooltip({
  text,
  children,
  style = {}
}) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {visible && (
        <div
          style={{
            position: 'absolute',
            bottom: '120%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-fill-surface-inverse, #111111)',
            color: 'var(--color-fill-surface-default, #ffffff)',
            padding: '6px 10px',
            borderRadius: 6,
            fontSize: 11.5,
            whiteSpace: 'nowrap',
            zIndex: 10000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            ...style
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

// 22. PaginationDots (Figma: Pagination/Dots)
function PaginationDots({
  total = 3,
  current = 0,
  onChange,
  style = {}
}) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center', ...style }}>
      {Array.from({ length: total }).map((_, idx) => {
        const active = current === idx;
        return (
          <div
            key={idx}
            onClick={() => onChange && onChange(idx)}
            style={{
              width: active ? 16 : 6,
              height: 6,
              borderRadius: 99,
              background: active ? 'var(--color-fill-brand-default)' : 'var(--color-border-default)',
              cursor: onChange ? 'pointer' : 'default',
              transition: 'all 200ms cubic-bezier(0.2,0,0,1)',
            }}
          />
        );
      })}
    </div>
  );
}

// 23. PageCounter (Figma: Page Indicator/Counter)
function PageCounter({
  total = 1,
  current = 1,
  style = {}
}) {
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: '4px 8px',
        borderRadius: 99,
        background: 'rgba(0,0,0,0.5)',
        color: '#fff',
        fontSize: 11,
        fontWeight: 700,
        ...style
      }}
    >
      {current} / {total}
    </div>
  );
}

// 24. SnackBar (Figma: Snack Bar)
function SnackBar({
  message,
  open = false,
  onClose,
  actionLabel,
  onAction,
  style = {}
}) {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        zIndex: 5000,
        animation: 'slideUpToast 300ms cubic-bezier(0.2,0,0,1)',
        ...style
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--color-fill-surface-inverse, #111111)',
          color: 'var(--color-fill-surface-default, #ffffff)',
          borderRadius: 'var(--radius-s, 16px)',
          padding: '12px 16px',
          boxShadow: 'var(--elevation-shadow-3)',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13.5 }}>{message}</span>
        {actionLabel && onAction && (
          <button
            onClick={() => {
              onAction();
              onClose && onClose();
            }}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--color-fill-brand-default)',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit',
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  SaveProvider, useSave, Icon, Glass, Placeholder, SaveStar, Chip,
  BottomNav, SearchBottomBar, TopBar, SectionHead, MoodLoz, SaveContext,
  SaveToast,
  // Figma Design System Components
  Avatar, Thumbnail, Divider, Button, ContentBadge, ListCell, IconButton, AvatarGroup, Card, ListCard, Checkbox, Radio, Switch, Tab, Tabs, SegmentedControl, Select, Textfield, Textarea, Alert, Menu, Tooltip, PaginationDots, PageCounter, SnackBar,
  // Mood color system
  MOOD_COLORS, MOOD_SOFT, getMoodColor, getMoodSoft,
  // Keyword emoji
  KEYWORD_EMOJIS, getKeywordEmoji,
});
