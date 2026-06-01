// screen-search.jsx — search overlay (recents, suggestions, trending, taste tags)
const { useState: useStateSr, useRef: useRefSr, useEffect: useEffectSr } = React;

function ScreenSearch({ query, setQuery, openDetail }) {
  const recents = ['소금빵', '성수 베이커리', '르 파베', '캄파뉴', '조용한 카페'];
  const trending = [
    { rank: 1, label: '월간 페이스트리', up: true },
    { rank: 2, label: '성수 소금빵', up: true },
    { rank: 3, label: '한남 디저트', up: false },
    { rank: 4, label: '에그타르트', up: true },
    { rank: 5, label: '연남 베이커리', up: false },
    { rank: 6, label: '바스크 치즈케이크', up: true },
    { rank: 7, label: '브런치 빵', up: false },
    { rank: 8, label: '캄파뉴', up: false },
  ];
  const tasteTags = ['#소금빵', '#캄파뉴', '#우드톤', '#조용한', '#햇살', '#성수', '#연남', '#혼자', '#오래 머물기'];

  const filtered = query
    ? BAKERIES.filter(b =>
        b.name.includes(query) ||
        b.region.includes(query) ||
        b.signature.includes(query) ||
        b.mood.some(m => m.includes(query))
      )
    : [];

  return (
    <div className="fade-enter" style={{
      position: 'absolute', inset: 0, zIndex: 110,
      background: 'var(--color-background-normal)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header title */}
      <div style={{ padding: '24px 20px 8px' }}>
        <h2 style={{
          margin: 0, fontFamily: 'var(--font-display)',
          fontSize: 24, fontWeight: 800, letterSpacing: '-0.022em',
          color: 'var(--color-text-strong)',
        }}>검색</h2>
      </div>

      {/* Body */}
      <div className="scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        {/* Results when typing */}
        {query && (
          <div style={{ padding: '8px 0 16px' }}>
            {filtered.length === 0 ? (
              <div style={{
                padding: '60px 24px', textAlign: 'center',
                color: 'var(--color-text-alternative)', fontSize: 13.5,
              }}>'{query}'에 대한 결과가 없어요</div>
            ) : (
              <>
                <div style={{
                  padding: '12px 20px 6px',
                  fontSize: 11, letterSpacing: '0.04em',
                  color: 'var(--color-text-alternative)', fontWeight: 700,
                }}>결과 {filtered.length}</div>
                {filtered.map(b => (
                  <div key={b.id} onClick={() => openDetail(b.id)} className="lift" style={{
                    padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
                    cursor: 'pointer',
                  }}>
                    <Placeholder tone={b.ph} style={{
                      width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                    }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.012em',
                        color: 'var(--color-text-strong)',
                      }}>{highlight(b.name, query)}</div>
                      <div style={{
                        marginTop: 2, fontSize: 12, color: 'var(--color-text-alternative)',
                      }}>{b.region} · {b.signature}</div>
                    </div>
                    <span style={{ color: 'var(--color-text-alternative)' }}>
                      <Icon.chevR/>
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Default state — recents/trending/taste */}
        {!query && (
          <>
            {/* Recents */}
            <div style={{ padding: '8px 0 12px' }}>
              <div style={{
                padding: '8px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)',
                  letterSpacing: '-0.008em',
                }}>최근 검색어</div>
                <button style={{
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  fontSize: 12, color: 'var(--color-text-alternative)', fontFamily: 'inherit',
                  fontWeight: 600,
                }}>전체 삭제</button>
              </div>
              <div style={{ padding: '4px 12px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {recents.map(r => (
                  <button key={r} onClick={() => setQuery(r)} className="lift" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 12px 8px 14px', borderRadius: 99, border: '1px solid var(--color-line-normal)',
                    background: '#fff', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, color: 'var(--color-text-normal)',
                    fontFamily: 'inherit',
                  }}>
                    <span style={{ color: 'var(--color-text-alternative)' }}><Icon.clock/></span>
                    {r}
                    <span style={{ color: 'var(--color-text-alternative)', marginLeft: 2 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Taste tags */}
            <div style={{ padding: '16px 0 12px' }}>
              <div style={{
                padding: '8px 20px',
                fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)',
                letterSpacing: '-0.008em',
              }}>내 취향으로 찾기</div>
              <div className="scroll" style={{
                padding: '8px 20px', display: 'flex', gap: 6, flexWrap: 'wrap',
              }}>
                {tasteTags.map(t => (
                  <Chip
                    key={t}
                    label={t}
                    active={false}
                    onClick={() => setQuery(t.replace('#', ''))}
                    variant="solid"
                    size="small"
                  />
                ))}
              </div>
            </div>

            {/* Trending — two-column rank */}
            <div style={{ padding: '20px 0 12px' }}>
              <div style={{
                padding: '0 20px 16px',
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              }}>
                <h3 style={{
                  margin: 0, fontFamily: 'var(--font-display)',
                  fontSize: 18, fontWeight: 700, letterSpacing: '-0.014em',
                  color: 'var(--color-text-strong)',
                }}>지금 떠오르는 탐험</h3>
                <span style={{
                  fontSize: 11, color: 'var(--color-text-alternative)', fontWeight: 600,
                }}>15분 전 업데이트</span>
              </div>
              <div style={{
                padding: '0 20px',
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '0 24px',
              }}>
                {trending.map(t => (
                  <button key={t.rank} onClick={() => setQuery(t.label)} className="lift" style={{
                    padding: '10px 0', border: 'none', background: 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                    fontFamily: 'inherit',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 16, fontWeight: 700,
                      color: t.rank <= 3 ? 'var(--color-primary-normal)' : 'var(--color-text-alternative)',
                      width: 18,
                    }}>{t.rank}</span>
                    <span style={{
                      flex: 1, textAlign: 'left',
                      fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-strong)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{t.label}</span>
                    <span style={{
                      fontSize: 10, color: t.up ? '#E52222' : 'var(--color-text-alternative)',
                    }}>
                      {t.up ? '▲' : '▽'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Spotlight */}
            <div style={{ padding: '20px 16px 0' }}>
              <Placeholder tone="ph-amber" style={{
                height: 140, borderRadius: 22, overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, padding: 20, zIndex: 3,
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  color: '#fff',
                  background: 'linear-gradient(95deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                }}>
                  <div style={{
                    fontSize: 11, letterSpacing: '0.04em',
                    fontWeight: 700, opacity: 0.9,
                  }}>이번 달 픽</div>
                  <div style={{
                    marginTop: 6, fontFamily: 'var(--font-display)',
                    fontSize: 22, lineHeight: '28px', fontWeight: 700, letterSpacing: '-0.018em',
                    textShadow: '0 1px 12px rgba(0,0,0,0.25)',
                  }}>겨울의 시즌 빵 8선</div>
                </div>
              </Placeholder>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function highlight(text, q) {
  if (!q) return text;
  const idx = text.indexOf(q);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: 'var(--color-primary-normal)' }}>{q}</span>
      {text.slice(idx + q.length)}
    </>
  );
}

window.ScreenSearch = ScreenSearch;
