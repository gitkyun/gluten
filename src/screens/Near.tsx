// screen-near.jsx — Naver Map-inspired: weather/category chips, star markers, exploration sheet
// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { Glass, Placeholder, MediaSlot, Chip, Icon, SaveStar, getMoodColor, MagazineKicker } from '@/components/shared';
import { BAKERIES, BAKERY_BY_ID, MAP_MARKERS } from '@/data/bakeries';

function ScreenNear({ openDetail }) {
  const [sheetMode, setSheetMode] = useState('mid'); // 'low' | 'mid' | 'high'
  const [filter, setFilter] = useState('전체');
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Sheet snap heights track the dynamic viewport so the map + sheet split
  // stays balanced on any screen height (clamped so it never collapses or
  // overruns the bottom nav). dvh ≈ frame height since the frame fills it.
  const heights = {
    low:  'clamp(84px, 12dvh, 132px)',
    mid:  'clamp(300px, 46dvh, 560px)',
    high: 'clamp(460px, 76dvh, 820px)',
  };
  const sheetHeight = heights[sheetMode];

  // Filter change resets marker selection
  useEffect(() => {
    setSelectedMarker(null);
  }, [filter]);

  const filteredBakeries = BAKERIES.filter(b => {
    if (filter === '전체') return true;
    if (filter === '소금빵') {
      return b.signature.includes('소금빵') || b.id === 'b1' || b.id === 'b4';
    }
    if (filter === '크루아상') {
      return b.signature.includes('크루아상') || b.id === 'b8';
    }
    if (filter === '한가') {
      return b.crowded === 'quiet';
    }
    if (filter === '곧 매진') {
      return b.soldOut && b.soldOut.length > 0;
    }
    if (filter === '혼자') {
      return b.mood.includes('조용한') || b.mood.includes('미니멀');
    }
    if (filter === '오래') {
      return b.mood.includes('조용한') || b.mood.includes('아늑함') || b.keywords.some(k => k.label.includes('오래'));
    }
    return true;
  });

  const filteredMarkers = MAP_MARKERS.filter(m => filteredBakeries.some(b => b.id === m.id));

  return (
    <div className="fade-enter" style={{
      height: '100%', position: 'relative', overflow: 'hidden',
    }}>
      {/* Map background */}
      <div className="map-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Hint x="20%" y="42%" text="성수동" big/>
        <Hint x="58%" y="20%" text="한강"/>
        <Hint x="78%" y="52%" text="청담동"/>
        <Hint x="14%" y="68%" text="망원동"/>
        <Hint x="42%" y="78%" text="강남구청"/>

        {/* Markers — green star style */}
        {filteredMarkers.map(m => {
          const b = BAKERY_BY_ID[m.id];
          const selected = selectedMarker === m.id;
          return (
            <StarMarker key={m.id} marker={m} bakery={b} selected={selected}
              onClick={() => setSelectedMarker(selectedMarker === m.id ? null : m.id)}/>
          );
        })}
      </div>

      {/* Top floating bar: search + weather */}
      <div style={{
        position: 'absolute', top: 20, left: 14, right: 14, zIndex: 30,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <Glass radius={28} style={{
          boxShadow: '0 6px 18px rgba(20,15,8,0.12)',
        }}>
          <div style={{
            padding: '11px 12px 11px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            {/* Gluten logo dot */}
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(145deg, #2A2520, #111827)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: 14, lineHeight: 1 }}>🥐</span>
            </div>
            <div style={{
              flex: 1, fontSize: 14.5, fontWeight: 500,
              color: 'var(--color-text-alternative)',
            }}>
              동네 리포트에서 빵집을 고르세요
            </div>
            <button style={{
              width: 32, height: 32, borderRadius: 99, border: 'none',
              background: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-normal)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
              </svg>
            </button>
            <Placeholder tone="ph-rose" style={{
              width: 32, height: 32, borderRadius: 99, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                position: 'relative', zIndex: 3, fontSize: 11, fontWeight: 700, color: '#fff',
                textShadow: '0 1px 2px rgba(0,0,0,0.25)',
              }}>K</span>
            </Placeholder>
          </div>
        </Glass>

        {/* Category chips */}
        <div className="scroll" style={{
          display: 'flex', gap: 8, overflowX: 'auto', paddingRight: 2,
        }}>
          {[
            { id: '전체', label: '전체' },
            { id: '소금빵', label: '소금빵' },
            { id: '크루아상', label: '크루아상' },
            { id: '한가', label: '지금 한가', tone: 'positive' },
            { id: '곧 매진', label: '곧 매진', tone: 'warning' },
            { id: '혼자', label: '혼자 좋은' },
            { id: '오래', label: '오래 머물기' },
          ].map(f => {
            const active = filter === f.id;
            const leading = f.tone ? (
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: f.tone === 'positive' ? 'var(--color-status-positive, #00BF40)' : 'var(--color-status-cautionary, #FF9200)'
              }} />
            ) : null;
            return (
              <div key={f.id} style={{ flexShrink: 0 }}>
                <Chip
                  label={f.label}
                  active={active}
                  onClick={() => setFilter(f.id)}
                  size="medium"
                  variant={active ? 'solid' : 'outlined'}
                  leading={leading}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating left: weather */}
      <div style={{ position: 'absolute', left: 14, top: 198, zIndex: 25 }}>
        <Glass radius={20} style={{
          padding: '10px 12px', display: 'inline-block',
          boxShadow: '0 4px 12px rgba(20,15,8,0.10)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              color: 'var(--color-text-strong)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFC93B">
                <circle cx="12" cy="12" r="5"/>
                <g stroke="#FFC93B" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="2" x2="12" y2="4"/>
                  <line x1="12" y1="20" x2="12" y2="22"/>
                  <line x1="2" y1="12" x2="4" y2="12"/>
                  <line x1="20" y1="12" x2="22" y2="12"/>
                </g>
              </svg>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 16,
                fontWeight: 700, letterSpacing: '-0.012em',
              }}>14°</span>
            </div>
            <div style={{
              marginTop: 2, fontSize: 10, fontWeight: 600,
              color: 'var(--color-text-alternative)',
            }}>좋음</div>
          </div>
        </Glass>
      </div>

      {/* Floating right controls */}
      <div style={{
        position: 'absolute', right: 14, top: 198, zIndex: 25,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <Glass radius={20} style={{
          width: 44, height: 44, boxShadow: '0 4px 12px rgba(20,15,8,0.10)',
        }}>
          <button style={{
            width: 44, height: 44, borderRadius: 20, border: 'none', cursor: 'pointer',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-normal)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 5l3-2 6 4 6-4 3 2v14l-3 2-6-4-6 4-3-2V5zM9 7v14M15 5v14" strokeLinejoin="round"/>
            </svg>
          </button>
        </Glass>
        <Glass radius={20} style={{
          width: 44, height: 44, boxShadow: '0 4px 12px rgba(20,15,8,0.10)',
        }}>
          <button style={{
            width: 44, height: 44, borderRadius: 20, border: 'none', cursor: 'pointer',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-status-positive)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z"/>
            </svg>
          </button>
        </Glass>
        <Glass radius={20} style={{
          width: 44, height: 44, boxShadow: '0 4px 12px rgba(20,15,8,0.10)',
        }}>
          <button style={{
            width: 44, height: 44, borderRadius: 20, border: 'none', cursor: 'pointer',
            background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-primary-normal)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 1v3M12 20v3M1 12h3M20 12h3"/>
            </svg>
          </button>
        </Glass>
      </div>

      {/* Selected marker callout */}
      {selectedMarker && (
        <MarkerCallout
          bakery={BAKERY_BY_ID[selectedMarker]}
          marker={MAP_MARKERS.find(m => m.id === selectedMarker)}
          onClose={() => setSelectedMarker(null)}
          onOpen={() => openDetail(selectedMarker)}/>
      )}

      {/* Bottom Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: `calc(${sheetHeight} + 92px)`, zIndex: 50,
        transition: 'height 360ms cubic-bezier(0.2,0,0,1)',
        pointerEvents: 'none',
      }}>
        <Glass radius={32} intensity="strong" style={{
          margin: '0 8px 92px',
          height: sheetHeight,
          pointerEvents: 'auto',
          boxShadow: '0 -10px 28px rgba(20,15,8,0.14)',
        }}>
          <div onClick={() => {
            setSheetMode(sheetMode === 'low' ? 'mid' : sheetMode === 'mid' ? 'high' : 'low');
          }} style={{ cursor: 'pointer', padding: '6px 0' }}>
            <div className="sheet-handle"/>
          </div>

          {/* Region/Trend toggle */}
          <div style={{ padding: '4px 14px 12px', display: 'flex', gap: 8 }}>
            <button className="lift" style={{
              flex: 1, padding: '12px 14px', borderRadius: 16, border: 'none',
              background: '#fff', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 1px 2px rgba(20,15,8,0.06)',
              fontFamily: 'inherit',
            }}>
              <span style={{ color: 'var(--color-primary-normal)' }}><Icon.loc/></span>
              <span style={{
                fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)',
                letterSpacing: '-0.008em',
              }}>성동구 성수동</span>
            </button>
            <button className="lift" style={{
              flex: 1, padding: '12px 14px', borderRadius: 16, border: 'none',
              background: 'transparent', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: 'inherit',
            }}>
              <span style={{ color: '#FF7B2E' }}><Icon.flame/></span>
              <span style={{
                fontSize: 14, fontWeight: 600, color: 'var(--color-text-normal)',
              }}>전국 트렌드</span>
            </button>
          </div>

          {/* Heading */}
          <div style={{
            padding: '4px 22px 12px',
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          }}>
            <h2 style={{
              margin: 0, fontFamily: 'var(--font-display)',
              fontSize: 20, lineHeight: '26px', letterSpacing: '-0.018em',
              fontWeight: 700, color: 'var(--color-text-strong)',
              display: 'flex', alignItems: 'baseline', gap: 6,
            }}>
              {filter === '전체' ? (
              <>성수동 리포트 <span style={{ color: 'var(--color-primary-normal)' }}>{filteredBakeries.length}곳</span></>
            ) : (
                <>{filter} 큐레이션 <span style={{ color: 'var(--color-primary-normal)' }}>{filteredBakeries.length}곳</span></>
              )}
            </h2>
            <div style={{
              fontSize: 11, fontWeight: 600, color: 'var(--color-text-alternative)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--color-primary-normal)' }}/>
              editor updated
            </div>
          </div>

          {/* List */}
          <div className="scroll" style={{
            overflowY: sheetMode === 'low' ? 'hidden' : 'auto',
            padding: '4px 0 16px',
            height: 'calc(100% - 130px)',
          }}>
            <SheetList openDetail={openDetail} list={filteredBakeries}/>
          </div>
        </Glass>
      </div>
    </div>
  );
}

function Hint({ x, y, text, big }) {
  return <div style={{
    position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)',
    fontSize: big ? 13 : 11, letterSpacing: '0.02em', fontWeight: 700,
    color: big ? 'rgba(70,60,40,0.55)' : 'rgba(70,60,40,0.42)',
    textShadow: '0 0 4px rgba(255,255,255,0.9)',
  }}>{text}</div>;
}

function StarMarker({ marker, bakery, selected, onClick }) {
  const moodColor = getMoodColor(bakery.moodKey);
  return (
    <button onClick={onClick} className="lift" style={{
      position: 'absolute', left: `${marker.x}%`, top: `${marker.y}%`,
      transform: 'translate(-50%, -100%)', zIndex: selected ? 20 : (marker.hot ? 10 : 5),
      border: 'none', background: 'transparent', cursor: 'pointer',
      padding: 0,
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))',
      }}>
        {selected ? (
          <div style={{
            padding: '6px 12px', borderRadius: 99,
            background: 'var(--color-text-strong)', color: '#fff',
            fontSize: 12.5, fontWeight: 700, letterSpacing: '-0.008em',
            whiteSpace: 'nowrap',
            border: '1.5px solid #fff',
            display: 'inline-flex', alignItems: 'center', gap: 5,
            transform: 'scale(1.05)',
            transition: 'transform 200ms',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill={moodColor}>
              <path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z"/>
            </svg>
            {bakery.name}
          </div>
        ) : (
          <>
            <div style={{
              position: 'relative',
              width: marker.hot ? 32 : 28, height: marker.hot ? 32 : 28,
              borderRadius: 99,
              background: moodColor,
              border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width={marker.hot ? 16 : 14} height={marker.hot ? 16 : 14} viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z"/>
              </svg>
              {marker.hot && (
                <div style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 14, height: 14, borderRadius: 99,
                  background: '#FF5E00', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, fontWeight: 700,
                  border: '1.5px solid #fff',
                }}>HOT</div>
              )}
            </div>
          </>
        )}
        {selected && (
          <div style={{
            width: 0, height: 0,
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderTop: '7px solid var(--color-text-strong)', marginTop: -1,
          }}/>
        )}
      </div>
    </button>
  );
}

function MarkerCallout({ bakery, marker, onClose, onOpen }) {
  return (
    <div style={{
      position: 'absolute', left: 14, right: 14,
      top: `min(${marker.y - 6}%, 50%)`,
      zIndex: 25, pointerEvents: 'none',
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        <Glass radius={20} intensity="strong" style={{
          boxShadow: '0 12px 28px rgba(20,15,8,0.18)',
        }}>
          <div onClick={onOpen} className="lift" style={{
            padding: 12, display: 'flex', gap: 12, cursor: 'pointer',
          }}>
            <MediaSlot imageUrl={bakery.coverImage} tone={bakery.ph} overlay="none" style={{
              width: 68, height: 68, borderRadius: 14, flexShrink: 0,
            }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 15, fontWeight: 700, letterSpacing: '-0.014em',
                color: 'var(--color-text-strong)',
              }}>{bakery.name}</div>
              <div style={{
                marginTop: 2, fontSize: 12, color: 'var(--color-text-alternative)',
              }}>
                베이커리 · {bakery.region} · <b style={{ color: 'var(--color-text-normal)' }}>{bakery.distance}</b>
              </div>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  fontSize: 11, fontWeight: 700,
                  color: '#0E7C3A',
                  padding: '2px 8px', borderRadius: 99,
                  background: 'rgba(0,191,64,0.10)',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: 99, background: '#00BF40' }}/>
                  지금 한가
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: 'var(--color-primary-normal)',
                }}>
                  취향 {bakery.tasteFit}%
                </span>
              </div>
            </div>
            <SaveStar bakeryId={bakery.id} size={34}/>
          </div>
        </Glass>
      </div>
    </div>
  );
}

function SheetList({ openDetail, list }) {
  const getTag = (b) => {
    if (b.crowded === 'quiet') return ['지금 한가', 'positive'];
    if (b.soldOut && b.soldOut.length > 0) return [`대표메뉴 품절`, 'warning'];
    if (b.mood.includes('조용한')) return ['혼자 오기 좋은', 'neutral'];
    if (b.saves > 1500) return [`저장 +${b.saves}`, 'warning'];
    return ['새로 열림', 'info'];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {list.map((b, i) => {
        const [tagText, tagTone] = getTag(b);
        return (
          <div key={b.id} className="lift" onClick={() => openDetail(b.id)} style={{
            padding: '14px 20px', display: 'flex', gap: 12,
            cursor: 'pointer', alignItems: 'center',
            borderBottom: i < list.length - 1 ? '1px solid var(--color-line-alternative)' : 'none',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 18,
              fontWeight: 700, color: 'var(--color-text-alternative)',
              width: 22, textAlign: 'center', letterSpacing: '-0.014em',
            }}>{i + 1}</span>
            <MediaSlot imageUrl={b.coverImage} tone={b.ph} overlay="none" style={{
              width: 72, height: 72, borderRadius: 16, flexShrink: 0,
            }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              {i === 0 && <MagazineKicker style={{ marginBottom: 3 }}>Neighborhood pick</MagazineKicker>}
              <div style={{
                fontSize: 15, fontWeight: 700, letterSpacing: '-0.014em',
                color: 'var(--color-text-strong)',
              }}>{b.name}</div>
              <div style={{
                marginTop: 2, fontSize: 12, color: 'var(--color-text-alternative)',
              }}>{b.distance} · {b.signature}</div>
              <div style={{ marginTop: 6, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <StatusPill text={tagText} tone={tagTone}/>
              </div>
            </div>
            <SaveStar bakeryId={b.id}/>
          </div>
        );
      })}
    </div>
  );
}

function StatusPill({ text, tone }) {
  const colors = {
    positive: { bg: 'var(--color-status-positive-soft, rgba(30,212,90,0.10))', fg: 'var(--color-status-positive, #00BF40)', dot: 'var(--color-status-positive, #00BF40)' },
    warning:  { bg: 'var(--color-status-cautionary-soft, rgba(255,146,0,0.12))', fg: 'var(--color-status-cautionary, #FF9200)', dot: 'var(--color-status-cautionary, #FF9200)' },
    info:     { bg: 'var(--color-status-information-soft, rgba(37,99,235,0.10))', fg: 'var(--color-status-information, #2563EB)', dot: 'var(--color-status-information, #2563EB)' },
    neutral:  { bg: 'var(--color-fill-surface-subtle, rgba(0,0,0,0.05))', fg: 'var(--color-text-secondary, rgba(0,0,0,0.6))', dot: 'var(--color-border-default, rgba(0,0,0,0.1))' },
  }[tone] || { bg: 'var(--color-fill-surface-subtle)', fg: 'var(--color-text-secondary)', dot: 'var(--color-border-default)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, fontWeight: 700, color: colors.fg,
      padding: '2px 8px', borderRadius: 99, background: colors.bg,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: colors.dot }}/>
      {text}
    </span>
  );
}

export { ScreenNear };
