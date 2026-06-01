// screen-detail.jsx — Bakery Detail v4: Real-app density + Naver-style Korean UI
const { useState: useStateD, useRef: useRefD, useEffect: useEffectD } = React;

const DETAIL_TABS = [
  { id: 'home', label: '홈' },
  { id: 'menu', label: '메뉴' },
  { id: 'review', label: '리뷰' },
  { id: 'photo', label: '사진' },
  { id: 'near', label: '주변' },
  { id: 'info', label: '정보' },
];

function ScreenDetail({ bakeryId, onClose, openDetail, openReviewWrite, openOverlay }) {
  const b = BAKERY_BY_ID[bakeryId];
  const [scrollY, setScrollY] = useStateD(0);
  const [tab, setTab] = useStateD('home');
  const scrollerRef = useRefD(null);
  const tabRailRef = useRefD(null);

  useEffectD(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = 0;
    setScrollY(0);
    const onScroll = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [bakeryId]);

  useEffectD(() => { setTab('home'); }, [bakeryId]);

  const HERO_H = 260;
  const headerBlend = Math.min(1, scrollY / 80);
  const tabSticky = scrollY > HERO_H + 130;

  return (
    <div className="fade-enter" style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: '#fff', display: 'flex', flexDirection: 'column',
    }}>
      {/* ── Top chrome ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40,
        paddingTop: 14,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `rgba(255,255,255,${headerBlend})`,
          backdropFilter: headerBlend > 0.5 ? 'blur(16px) saturate(180%)' : undefined,
          borderBottom: headerBlend > 0.5 ? '1px solid var(--color-line-alternative)' : 'none',
        }}/>
        <div style={{
          position: 'relative',
          padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <IconButton
            icon={<Icon.chevL/>}
            onClick={onClose}
            variant="normal"
            size="medium"
            style={{
              width: 36,
              height: 36,
              background: headerBlend > 0.5 ? 'var(--color-fill-neutral-default)' : 'rgba(28,28,32,0.45)',
              backdropFilter: headerBlend > 0.5 ? undefined : 'blur(8px)',
              color: '#fff',
            }}
          />
          <div style={{
            flex: 1, overflow: 'hidden',
            opacity: headerBlend,
            transition: 'opacity 120ms',
          }}>
            <div style={{
              fontSize: 16, fontWeight: 700, letterSpacing: '-0.014em',
              color: 'var(--color-text-strong)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{b.name}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <IconButton
              icon={<Icon.share/>}
              variant="normal"
              size="medium"
              style={{
                width: 36,
                height: 36,
                background: headerBlend > 0.5 ? 'var(--color-fill-neutral-default)' : 'rgba(28,28,32,0.45)',
                backdropFilter: headerBlend > 0.5 ? undefined : 'blur(8px)',
                color: '#fff',
              }}
            />
            <div style={{
              width: 36, height: 36, borderRadius: 99,
              background: headerBlend > 0.5 ? 'var(--color-fill-normal)' : 'rgba(28,28,32,0.45)',
              backdropFilter: headerBlend > 0.5 ? undefined : 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SaveStar bakeryId={b.id} size={36} dark={headerBlend <= 0.5}/>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky tab strip ── */}
      {tabSticky && (
        <div style={{
          position: 'absolute', top: 58, left: 0, right: 0, zIndex: 35,
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-line-alternative)',
        }}>
          <DetailTabStrip tab={tab} setTab={setTab}/>
        </div>
      )}

      {/* ── Scroll body ── */}
      <div ref={scrollerRef} className="scroll" style={{ flex: 1, overflowY: 'auto' }}>

        {/* HERO — fluid: height tracks column width via aspect-ratio */}
        <Placeholder tone={b.ph} style={{
          aspectRatio: '62 / 40', minHeight: 200, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 35%, transparent 60%, rgba(0,0,0,0.38) 100%)',
          }}/>
          {/* Badge top-left */}
          <div style={{
            position: 'absolute', left: 16, bottom: 20, zIndex: 3,
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 10px', borderRadius: 99,
            background: 'rgba(255,255,255,0.95)',
            fontSize: 11.5, fontWeight: 700, color: 'var(--color-text-strong)',
          }}>
            <span style={{
              padding: '2px 5px', borderRadius: 4, background: '#1B1C1E',
              color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '0.04em',
            }}>빵슐랭</span>
            5월의 추천
          </div>
          {/* Photo count */}
          <div style={{
            position: 'absolute', right: 14, bottom: 20, zIndex: 3,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '5px 10px', borderRadius: 99,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            color: '#fff', fontSize: 11.5, fontWeight: 600,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="6" width="18" height="14" rx="2"/>
              <circle cx="12" cy="13" r="3"/>
              <path d="M3 6l4-3h10l4 3"/>
            </svg>
            사진 45장
          </div>
        </Placeholder>

        {/* ── META BLOCK ── */}
        <div style={{ padding: '16px 18px 0', background: '#fff' }}>
          {/* Name row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{
                margin: 0, fontFamily: 'var(--font-display)',
                fontSize: 26, lineHeight: '33px', letterSpacing: '-0.022em',
                fontWeight: 800, color: 'var(--color-text-strong)',
              }}>{b.name}</h1>
              <div style={{
                marginTop: 5, display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 13, fontWeight: 500, color: 'var(--color-text-alternative)',
                flexWrap: 'wrap',
              }}>
                <span>베이커리</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span style={{ color: '#0E7C3A', fontWeight: 700 }}>영업 중</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>{b.hours} 종료</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>{b.distance}</span>
              </div>
            </div>
            {/* Rating circle */}
            <div style={{
              flexShrink: 0, width: 52, height: 52, borderRadius: 16,
              background: `${getMoodColor(b.moodKey)}18`,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 1,
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 17, fontWeight: 800, letterSpacing: '-0.014em',
                color: getMoodColor(b.moodKey),
                lineHeight: 1,
              }}>{b.tasteFit}%</div>
              <div style={{
                fontSize: 9, fontWeight: 700,
                color: getMoodColor(b.moodKey),
                letterSpacing: '-0.005em',
              }}>취향적합</div>
            </div>
          </div>

          {/* Mood + review row */}
          <div style={{
            marginTop: 14,
            display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
          }}>
            {b.mood.map(m => (
              <span key={m} style={{
                padding: '4px 9px', borderRadius: 99,
                background: getMoodSoft(b.moodKey),
                color: getMoodColor(b.moodKey),
                fontSize: 11.5, fontWeight: 700, letterSpacing: '-0.005em',
              }}>{m}</span>
            ))}
            <span style={{
              padding: '4px 9px', borderRadius: 99,
              background: 'var(--color-fill-normal)',
              color: 'var(--color-text-alternative)',
              fontSize: 11.5, fontWeight: 600,
            }}>방문자 리뷰 {b.saves.toLocaleString()}</span>
          </div>

          {/* Action chips row */}
          <div className="scroll" style={{
            display: 'flex', gap: 8, marginTop: 20, marginBottom: 6,
            overflowX: 'auto', paddingBottom: 4,
          }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: '길찾기', primary: true },
              { icon: <Icon.share/>, label: '공유' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z"/></svg>, label: '전화' },
              { icon: <Icon.bell/>, label: '알림' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M8 4v4M16 4v4"/></svg>, label: '예약' },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 4l6 6-11 11H3v-6L14 4z" strokeLinejoin="round"/></svg>, label: '리뷰' },
            ].map(a => <ActionChip key={a.label} {...a}/>)}
          </div>
        </div>

        {/* ── TAB RAIL ── */}
        <div style={{ position: 'relative', background: '#fff' }}>
          <DetailTabStrip tab={tab} setTab={setTab}/>
        </div>

        {/* ── TAB CONTENT ── */}
        <div key={tab} className="fade-enter" style={{ background: 'var(--color-fill-surface-canvas)' }}>
          {tab === 'home'   && <TabHome b={b} setTab={setTab} openOverlay={openOverlay}/>}
          {tab === 'menu'   && <TabMenu b={b}/>}
          {tab === 'review' && <TabReview b={b} openReviewWrite={openReviewWrite} openOverlay={openOverlay}/>}
          {tab === 'photo'  && <TabPhoto b={b}/>}
          {tab === 'near'   && <TabNear  b={b} openDetail={openDetail}/>}
          {tab === 'info'   && <TabInfo  b={b}/>}
        </div>

        <div style={{ height: 120 }}/>
      </div>

      {/* ── Floating CTA ── */}
      <FloatingCTA bakery={b}/>
    </div>
  );
}

// ─ Tab Strip ──────────────────────────────────────────────────────────────
function DetailTabStrip({ tab, setTab }) {
  return (
    <Tabs
      tabs={DETAIL_TABS}
      activeTab={tab}
      onChange={setTab}
    />
  );
}

// ─ Action Chip ────────────────────────────────────────────────────────────
function ActionChip({ icon, label, primary, onClick }) {
  return (
    <Chip
      label={label}
      active={primary}
      onClick={onClick}
      variant={primary ? 'solid' : 'outlined'}
      size="medium"
      leading={icon}
      style={{ flexShrink: 0 }}
    />
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB: HOME
// ════════════════════════════════════════════════════════════════════════════
function TabHome({ b, setTab, openOverlay }) {
  const { saved } = useSave();
  const isSaved = saved.has(b.id);

  return (
    <div style={{ paddingTop: 8 }}>

      {/* Saved banner */}
      {isSaved && (
        <div style={{
          margin: '12px 16px', padding: '13px 16px', borderRadius: 14,
          background: 'rgba(0,191,64,0.07)',
          border: '1px solid rgba(0,191,64,0.2)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 99, background: '#00BF40',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z"/>
            </svg>
          </span>
          <div style={{ flex: 1 }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)',
            }}>내 탐험에 저장됨</span>
            <span style={{
              marginLeft: 6, fontSize: 12, color: 'var(--color-text-alternative)',
            }}>성수 빵 산책</span>
          </div>
          <button style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 12, fontWeight: 700, color: 'var(--color-primary-normal)',
            fontFamily: 'inherit', padding: 0,
          }}>정리하기</button>
        </div>
      )}

      {/* ── Info card ── */}
      <div style={{
        margin: '12px 16px', borderRadius: 16,
        background: '#fff', overflow: 'hidden',
      }}>
        <InfoRow
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>}
          label={b.address}
          sub={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 16, height: 16, borderRadius: 99,
                background: '#FF6829',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 9, fontWeight: 800,
              }}>2</span>
              성수역 4번 출구 · {b.distance}
            </span>
          }
          action={<span style={{ color: 'var(--color-primary-normal)', fontSize: 12, fontWeight: 700 }}>지도 · 거리뷰</span>}
        />
        <InfoRow
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" strokeLinecap="round"/></svg>}
          label={
            <span>
              <span style={{ color: '#0E7C3A', fontWeight: 700 }}>영업 중</span>
              <span style={{ color: 'var(--color-text-alternative)', fontWeight: 500 }}> · {b.hours}</span>
            </span>
          }
          expandable
        />
        <InfoRow
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z"/></svg>}
          label="0507-1416-7173"
          action={<span style={{ color: 'var(--color-primary-normal)', fontSize: 12, fontWeight: 700 }}>복사</span>}
          last
        />
      </div>

      {/* ── Social proof bar ── */}
      <div style={{
        margin: '0 16px 12px', padding: '14px 16px', borderRadius: 14,
        background: '#fff',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ display: 'flex' }}>
          {['ph-rose', 'ph-stone', 'ph-cream', 'ph-sage'].map((tone, i) => (
            <Placeholder key={i} tone={tone} style={{
              width: 26, height: 26, borderRadius: 99,
              border: '1.5px solid #fff',
              marginLeft: i === 0 ? 0 : -7,
            }}/>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)',
          }}>지수, 도윤 외 14명이 저장</span>
        </div>
        <Icon.chevR/>
      </div>

      {/* ── Keyword chart ── */}
      {b.keywords.length > 0 && (
        <div style={{ margin: '0 16px 12px', borderRadius: 16, background: '#fff', padding: '18px 18px 10px' }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14,
          }}>
            <div>
              <span style={{
                fontSize: 15, fontWeight: 800, color: 'var(--color-text-strong)',
                fontFamily: 'var(--font-display)', letterSpacing: '-0.012em',
              }}>이런 점이 좋았어요</span>
              <span style={{
                marginLeft: 8, fontSize: 12.5, color: 'var(--color-text-alternative)',
              }}>
                <span style={{ color: '#00BF40', fontWeight: 700 }}>✓ </span>
                {b.saves.toLocaleString()}명 참여
              </span>
            </div>
            <button onClick={() => {}} style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, color: 'var(--color-primary-normal)',
              fontFamily: 'inherit',
            }}>전체</button>
          </div>
          {b.keywords.map((k, i) => {
            const pct = Math.min(100, (k.count / b.keywords[0].count) * 100);
            return (
              <div key={k.label} style={{ marginBottom: 8 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 5,
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 600, color: 'var(--color-text-strong)',
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ fontSize: 15 }}>{getKeywordEmoji(k.label)}</span>
                    {k.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)',
                  }}>{k.count}</span>
                </div>
                <div style={{
                  height: 7, borderRadius: 99,
                  background: 'var(--color-fill-normal)', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: getMoodColor(b.moodKey),
                    opacity: 0.7 + (i === 0 ? 0.3 : 0),
                  }}/>
                </div>
              </div>
            );
          })}
          <div style={{ height: 8 }}/>
        </div>
      )}

      {/* ── Atmosphere summary ── */}
      <div style={{ margin: '0 16px 12px', borderRadius: 16, background: '#fff', padding: '18px 18px' }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
          color: 'var(--color-text-alternative)', marginBottom: 10,
        }}>탐험자 271명이 남긴 한 줄</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18, lineHeight: '28px', letterSpacing: '-0.016em',
          fontWeight: 700, color: 'var(--color-text-strong)',
          textWrap: 'pretty',
        }}>"{b.summary}"</div>
      </div>

      {/* ── Gallery strip ── */}
      <div style={{ margin: '0 0 12px' }}>
        <div style={{
          padding: '0 18px 14px',
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: 15, fontWeight: 800, color: 'var(--color-text-strong)',
            fontFamily: 'var(--font-display)', letterSpacing: '-0.012em',
          }}>사진</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary-normal)' }}>
            45장 전체보기
          </span>
        </div>
        <div className="scroll" style={{
          display: 'flex', gap: 6, padding: '0 16px', overflowX: 'auto',
        }}>
          {[b.ph, b.phAlt, b.phPerson, 'ph-wheat', 'ph-cream'].map((tone, i) => (
            <Placeholder key={i} tone={tone} style={{
              width: i === 0 ? 230 : 188, height: 252,
              borderRadius: 14, flexShrink: 0, overflow: 'hidden',
            }}>
              {i === 0 && (
                <div style={{
                  position: 'absolute', left: 10, top: 10, zIndex: 3,
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                  padding: '4px 8px', borderRadius: 99,
                  background: 'rgba(255,255,255,0.92)',
                  fontSize: 10.5, fontWeight: 700, color: 'var(--color-text-strong)',
                }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/></svg>
                  공간
                </div>
              )}
            </Placeholder>
          ))}
        </div>
      </div>

      {/* ── Menu preview ── */}
      {b.breads.length > 0 && (
        <div style={{ margin: '0 16px 12px', borderRadius: 16, background: '#fff', overflow: 'hidden' }}>
          <div style={{
            padding: '18px 18px 14px',
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: 15, fontWeight: 800, color: 'var(--color-text-strong)',
              fontFamily: 'var(--font-display)', letterSpacing: '-0.012em',
            }}>메뉴</span>
            <button onClick={() => setTab('menu')} style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, color: 'var(--color-primary-normal)',
              fontFamily: 'inherit',
            }}>메뉴판 이미지로 보기</button>
          </div>
          {b.breads.slice(0, 3).map((m, i) => (
            <div key={m.name} style={{
              padding: '14px 18px',
              borderTop: '1px solid var(--color-line-alternative)',
              display: 'flex', gap: 14, alignItems: 'center',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
                }}>
                  {m.popular && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '1px 6px',
                      borderRadius: 4, border: '1px solid var(--color-line-normal)',
                      color: 'var(--color-text-alternative)',
                    }}>대표</span>
                  )}
                  <span style={{
                    fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.012em',
                    color: m.soldOut ? 'var(--color-text-alternative)' : 'var(--color-text-strong)',
                    textDecoration: m.soldOut ? 'line-through' : 'none',
                  }}>{m.name}</span>
                  {m.soldOut && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: '#A85C00',
                      background: 'rgba(255,146,0,0.12)',
                      padding: '1px 6px', borderRadius: 4,
                    }}>매진</span>
                  )}
                </div>
                <div style={{
                  fontSize: 12, color: 'var(--color-text-alternative)', marginBottom: 4,
                }}>매일 아침 직접 발효한 도우</div>
                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: m.soldOut ? 'var(--color-text-alternative)' : 'var(--color-text-strong)',
                }}>{m.price}</div>
              </div>
              <Placeholder tone={m.ph} style={{
                width: 80, height: 80, borderRadius: 10, flexShrink: 0,
              }}/>
            </div>
          ))}
          <div style={{
            padding: '14px 18px',
            borderTop: '1px solid var(--color-line-alternative)',
          }}>
            <button onClick={() => setTab('menu')} className="lift" style={{
              width: '100%', padding: '12px', borderRadius: 11,
              border: 'none', background: 'var(--color-fill-normal)', cursor: 'pointer',
              fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-normal)',
              fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 3,
            }}>전체 메뉴 보기 <Icon.chevD/></button>
          </div>
        </div>
      )}

      {/* ── Review preview ── */}
      <ReviewPreview b={b} setTab={setTab} openOverlay={openOverlay}/>

      {/* ── Similar ── */}
      <div style={{ margin: '8px 0 0' }}>
        <div style={{ padding: '16px 18px 12px' }}>
          <span style={{
            fontSize: 15, fontWeight: 800, color: 'var(--color-text-strong)',
            fontFamily: 'var(--font-display)', letterSpacing: '-0.012em',
          }}>비슷한 분위기</span>
        </div>
      </div>
    </div>
  );
}

// Info row — in info card
function InfoRow({ icon, label, sub, action, expandable, last }) {
  return (
    <div style={{
      padding: '14px 18px',
      borderBottom: last ? 'none' : '1px solid var(--color-line-alternative)',
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      <div style={{
        flexShrink: 0, width: 18, marginTop: 1,
        color: 'var(--color-text-alternative)',
        display: 'flex', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 500, color: 'var(--color-text-normal)',
          letterSpacing: '-0.005em',
        }}>{label}</div>
        {sub && <div style={{
          marginTop: 4, fontSize: 12.5, color: 'var(--color-text-alternative)',
        }}>{sub}</div>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      {expandable && <span style={{ color: 'var(--color-text-alternative)' }}><Icon.chevD/></span>}
    </div>
  );
}

// Review preview block
function ReviewPreview({ b, setTab, openOverlay }) {
  if (!b.keywords.length) return null;
  const reviews = [
    { user: '지수', avatarPh: 'ph-rose', avatarChar: '지', time: '3일 전',
      mood: ['혼자', '햇살'], visits: '재방문',
      text: '버터 향이 진해서 한 시간 더 머물렀어요. 11시 전에 가야 솔티드 버터 크루아상이 남아요.',
      images: ['ph-wheat', 'ph-cream'], helpful: 18,
    },
  ];
  return (
    <div style={{ margin: '8px 14px', borderRadius: 16, background: '#fff', overflow: 'hidden' }}>
      <div style={{
        padding: '16px 16px 12px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-line-alternative)',
      }}>
        <div>
          <span style={{
            fontSize: 15, fontWeight: 800, color: 'var(--color-text-strong)',
            fontFamily: 'var(--font-display)', letterSpacing: '-0.012em',
          }}>리뷰</span>
          <span style={{
            marginLeft: 8, fontSize: 12.5, color: 'var(--color-text-alternative)',
          }}>방문자 {b.saves.toLocaleString()}</span>
        </div>
        <button onClick={() => setTab && setTab('review')} style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          fontSize: 12, fontWeight: 700, color: 'var(--color-primary-normal)',
          fontFamily: 'inherit',
        }}>전체</button>
      </div>
      {reviews.map((r, i) => (
        <div key={i} onClick={() => openOverlay && openOverlay('reviewDetail', { bakeryId: b.id, reviewIndex: i })} className="lift" style={{ padding: '14px 16px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Avatar size="small" tone={r.avatarPh} label={r.avatarChar} style={{ width: 32, height: 32 }} />
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{
                  fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)',
                }}>{r.user}</span>
                <span style={{
                  fontSize: 11, color: 'var(--color-text-alternative)',
                }}>· 리뷰 28 · {r.visits}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="10" height="10" viewBox="0 0 24 24"
                    fill={s <= 5 ? getMoodColor(b.moodKey) : 'none'}
                    stroke={s <= 5 ? getMoodColor(b.moodKey) : 'var(--color-line-normal)'}
                    strokeWidth="1.5">
                    <path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z"/>
                  </svg>
                ))}
                <span style={{
                  marginLeft: 4, fontSize: 11, color: 'var(--color-text-alternative)',
                }}>{r.time}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
            {r.mood.map(m => (
              <span key={m} style={{
                padding: '3px 8px', borderRadius: 99,
                background: 'rgba(0,174,255,0.10)', color: '#0098B2',
                fontSize: 11, fontWeight: 700,
              }}>#{m}</span>
            ))}
          </div>
          {r.images && (
            <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
              {r.images.map((tone, j) => (
                <Placeholder key={j} tone={tone} style={{
                  width: 88, height: 88, borderRadius: 8, overflow: 'hidden',
                }}/>
              ))}
            </div>
          )}
          <p style={{
            margin: 0, fontSize: 13.5, lineHeight: '21px',
            color: 'var(--color-text-normal)', textWrap: 'pretty',
          }}>{r.text}</p>
          <div style={{
            marginTop: 12, display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <button onClick={(e) => e.stopPropagation()} style={{
              border: '1px solid var(--color-line-normal)', background: '#fff',
              padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
              fontSize: 11.5, fontWeight: 700, color: 'var(--color-text-normal)',
              fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
                <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
              </svg>
              도움됨 {r.helpful}
            </button>
            <span onClick={(e) => e.stopPropagation()} style={{ fontSize: 11.5, color: 'var(--color-text-alternative)', cursor: 'pointer' }}>
              신고
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB: MENU
// ════════════════════════════════════════════════════════════════════════════
function TabMenu({ b }) {
  const [cat, setCat] = useStateD('전체');
  const cats = ['전체', '대표', '시즌', '식사빵', '디저트', '음료'];
  return (
    <div style={{ paddingTop: 8 }}>
      {/* Category chips */}
      <div style={{ margin: '0 14px 12px' }}>
        <SegmentedControl
          options={cats.map(c => ({ value: c, label: c }))}
          selected={cat}
          onChange={setCat}
        />
      </div>

      <div style={{ margin: '0 14px' }}>
        {b.breads.length > 0 ? (
          <div style={{ borderRadius: 16, background: '#fff', overflow: 'hidden' }}>
            {b.breads.map((m, i) => (
              <div key={m.name} style={{
                padding: '14px 16px',
                borderBottom: i < b.breads.length - 1 ? '1px solid var(--color-line-alternative)' : 'none',
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    {m.popular && (
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                        border: '1px solid var(--color-line-normal)',
                        color: 'var(--color-text-alternative)',
                      }}>대표</span>
                    )}
                    <span style={{
                      fontSize: 15, fontWeight: 700, letterSpacing: '-0.012em',
                      color: m.soldOut ? 'var(--color-text-alternative)' : 'var(--color-text-strong)',
                      textDecoration: m.soldOut ? 'line-through' : 'none',
                    }}>{m.name}</span>
                    {m.soldOut && (
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: '#A85C00',
                        background: 'rgba(255,146,0,0.12)',
                        padding: '1px 6px', borderRadius: 4,
                      }}>오늘 매진</span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 12.5, color: 'var(--color-text-alternative)', marginBottom: 6,
                    lineHeight: '18px',
                  }}>매일 아침 직접 발효한 도우로 구워내는 시그니처 메뉴</div>
                  <div style={{
                    fontSize: 15, fontWeight: 700,
                    color: m.soldOut ? 'var(--color-text-alternative)' : 'var(--color-text-strong)',
                  }}>{m.price}</div>
                </div>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Placeholder tone={m.ph} style={{
                    width: 96, height: 96, borderRadius: 10, overflow: 'hidden',
                  }}/>
                  {/* Save button on image */}
                  <button className="lift" style={{
                    position: 'absolute', bottom: 6, right: 6,
                    width: 28, height: 28, borderRadius: 99,
                    background: 'rgba(255,255,255,0.9)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-text-normal)',
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            borderRadius: 16, background: '#fff', padding: '40px 20px', textAlign: 'center',
            color: 'var(--color-text-alternative)', fontSize: 13,
          }}>메뉴 정보를 준비 중이에요</div>
        )}
      </div>
      <div style={{ height: 16 }}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB: REVIEW
// ════════════════════════════════════════════════════════════════════════════
function TabReview({ b, openReviewWrite, openOverlay }) {
  const [view, setView] = useStateD('visitor');
  const reviews = [
    { user: '지수', avatarPh: 'ph-rose', avatarChar: '지', time: '3일 전',
      mood: ['혼자', '햇살'], visits: '재방문', helpful: 18,
      text: '버터 향이 진해서 한 시간 더 머물렀어요. 11시 전에 가야 솔티드 버터 크루아상이 남아요.',
      images: ['ph-wheat', 'ph-cream'],
    },
    { user: '도윤', avatarPh: 'ph-stone', avatarChar: '도', time: '1주 전',
      mood: ['조용한', '오후'], visits: '첫방문', helpful: 9,
      text: '오후 3시쯤 가니까 손님이 거의 없어서 좋았습니다. 캄파뉴 사 왔는데 다음 날까지 촉촉해요.',
      images: ['ph-toast'],
    },
  ];

  return (
    <div style={{ paddingTop: 8 }}>
      {/* Toggle bar */}
      <div style={{ margin: '0 14px 12px', background: '#fff', borderRadius: 14, padding: 4, display: 'flex' }}>
        {[
          { id: 'visitor', label: '방문자 리뷰', count: b.saves },
          { id: 'blog', label: '블로그 리뷰', count: 248 },
        ].map(o => {
          const active = view === o.id;
          return (
            <button key={o.id} onClick={() => setView(o.id)} className="lift" style={{
              flex: 1, padding: '10px 14px', border: 'none', cursor: 'pointer',
              borderRadius: 12,
              background: active ? '#1B1C1E' : 'transparent',
              color: active ? '#fff' : 'var(--color-text-normal)',
              fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.008em',
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}>
              {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00BF40" strokeWidth="2.5"><path d="M5 12l5 5 9-9" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              {o.label}
            </button>
          );
        })}
      </div>

      {/* Write CTA */}
      {openReviewWrite && (
        <div style={{ margin: '0 14px 12px' }}>
          <button onClick={() => openReviewWrite(b.id)} className="lift" style={{
            width: '100%', padding: '12px 16px', borderRadius: 12,
            border: '1px solid var(--color-line-normal)', background: '#fff',
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)',
            fontFamily: 'inherit',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M14 4l6 6-11 11H3v-6L14 4z" strokeLinejoin="round"/>
            </svg>
            방문 후 리뷰 작성하기
          </button>
        </div>
      )}

      {/* Keyword bars */}
      {b.keywords.length > 0 && (
        <div style={{ margin: '0 14px 12px', borderRadius: 16, background: '#fff', padding: '16px 16px 12px' }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14,
          }}>
            <span style={{
              fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)',
            }}>이런 점이 좋았어요</span>
            <span style={{
              fontSize: 12, color: '#00BF40', fontWeight: 700,
            }}>✓ {b.saves.toLocaleString()}명 참여</span>
          </div>
          {b.keywords.map((k, i) => {
            const pct = Math.min(100, (k.count / b.keywords[0].count) * 100);
            return (
              <div key={k.label} style={{ marginBottom: 10 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5,
                }}>
                  <span style={{
                    fontSize: 13, fontWeight: 600, color: 'var(--color-text-strong)',
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                  }}>
                    <span style={{ fontSize: 15 }}>{getKeywordEmoji(k.label)}</span>
                    {k.label}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                    color: 'var(--color-text-alternative)',
                  }}>{k.count}</span>
                </div>
                <div style={{
                  height: 7, borderRadius: 99, background: 'var(--color-fill-normal)', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: getMoodColor(b.moodKey), opacity: 0.65 + (i === 0 ? 0.35 : 0),
                  }}/>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review list */}
      <div style={{ margin: '0 14px' }}>
        <div style={{ borderRadius: 16, background: '#fff', overflow: 'hidden' }}>
          {reviews.map((r, i) => (
            <div key={i} onClick={() => openOverlay && openOverlay('reviewDetail', { bakeryId: b.id, reviewIndex: i })} className="lift" style={{
              padding: '16px 16px',
              borderBottom: i < reviews.length - 1 ? '1px solid var(--color-line-alternative)' : 'none',
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Avatar size="medium" tone={r.avatarPh} label={r.avatarChar} style={{ width: 34, height: 34 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)' }}>{r.user}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-alternative)' }}>리뷰 28 · {r.visits}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="10" height="10" viewBox="0 0 24 24"
                        fill={getMoodColor(b.moodKey)}
                        stroke={getMoodColor(b.moodKey)} strokeWidth="1.2">
                        <path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z"/>
                      </svg>
                    ))}
                    <span style={{ marginLeft: 4, fontSize: 11, color: 'var(--color-text-alternative)' }}>{r.time}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                {r.mood.map(m => (
                  <span key={m} style={{
                    padding: '3px 8px', borderRadius: 99,
                    background: 'rgba(0,174,255,0.10)', color: '#0098B2',
                    fontSize: 11, fontWeight: 700,
                  }}>#{m}</span>
                ))}
              </div>
              {r.images && (
                <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                  {r.images.map((tone, j) => (
                    <Placeholder key={j} tone={tone} style={{
                      width: 88, height: 88, borderRadius: 8, overflow: 'hidden',
                    }}/>
                  ))}
                </div>
              )}
              <p style={{
                margin: '0 0 10px', fontSize: 13.5, lineHeight: '21px',
                color: 'var(--color-text-normal)', textWrap: 'pretty',
              }}>{r.text}</p>
              <button onClick={(e) => e.stopPropagation()} style={{
                border: '1px solid var(--color-line-normal)', background: '#fff',
                padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                fontSize: 11.5, fontWeight: 700, color: 'var(--color-text-normal)',
                fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
                  <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
                </svg>
                도움됨 {r.helpful}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 16 }}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB: PHOTO
// ════════════════════════════════════════════════════════════════════════════
function TabPhoto({ b }) {
  const [cat, setCat] = useStateD('전체 248');
  const cats = ['전체 248', '대표', '공간', '빵', '음료', '메뉴판'];
  const photos = [b.ph, b.phAlt, b.phPerson, 'ph-wheat', 'ph-cream', 'ph-toast',
    'ph-stone', 'ph-amber', 'ph-rose', 'ph-butter', 'ph-crust', 'ph-sage'];
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ margin: '0 14px 12px', background: '#fff', borderRadius: 14, padding: 4 }}>
        <div className="scroll" style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} className="lift" style={{
              flexShrink: 0, padding: '9px 14px', borderRadius: 11, border: 'none',
              background: cat === c ? '#1B1C1E' : 'transparent',
              color: cat === c ? '#fff' : 'var(--color-text-alternative)',
              cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13.5, fontWeight: 700,
            }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{
        padding: '0 14px',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3,
      }}>
        {photos.map((p, i) => (
          <Placeholder key={i} tone={p} style={{ aspectRatio: '1/1', borderRadius: 4 }}/>
        ))}
      </div>
      <div style={{ height: 16 }}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB: NEAR
// ════════════════════════════════════════════════════════════════════════════
function TabNear({ b, openDetail }) {
  const similar = BAKERIES.filter(x => x.id !== b.id);
  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ padding: '0 18px 10px' }}>
        <span style={{
          fontSize: 15, fontWeight: 800, color: 'var(--color-text-strong)',
          fontFamily: 'var(--font-display)', letterSpacing: '-0.012em',
        }}>비슷한 분위기</span>
      </div>
      <div style={{ margin: '0 14px', borderRadius: 16, background: '#fff', overflow: 'hidden' }}>
        {similar.slice(0, 4).map((s, i) => (
          <div key={s.id} onClick={() => openDetail(s.id)} className="lift" style={{
            padding: '12px 16px', display: 'flex', gap: 12,
            borderBottom: i < 3 ? '1px solid var(--color-line-alternative)' : 'none',
            cursor: 'pointer', alignItems: 'center',
          }}>
            <Placeholder tone={s.ph} style={{
              width: 68, height: 68, borderRadius: 12, flexShrink: 0,
            }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 11, fontWeight: 700,
                color: getMoodColor(s.moodKey),
                marginBottom: 3, letterSpacing: '0.02em',
              }}>취향 적합 {s.tasteFit}%</div>
              <div style={{
                fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.012em',
                color: 'var(--color-text-strong)',
              }}>{s.name}</div>
              <div style={{
                marginTop: 2, fontSize: 12, color: 'var(--color-text-alternative)',
              }}>{s.region} · {s.distance} · {s.signature}</div>
            </div>
            <SaveStar bakeryId={s.id} size={30}/>
          </div>
        ))}
      </div>
      <div style={{ height: 16 }}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TAB: INFO
// ════════════════════════════════════════════════════════════════════════════
function TabInfo({ b }) {
  const rows = [
    { label: '주소', value: b.address },
    { label: '교통', value: '성수역 4번 출구에서 ' + b.distance },
    { label: '영업시간', value: b.hours, sub: '월 휴무 · 공휴일 정상 영업' },
    { label: '전화', value: '0507-1416-7173' },
    { label: '편의', value: '포장 가능 · 카드/현금 · 좌석 12석' },
    { label: '특징', value: b.mood.join(' · ') },
  ];
  return (
    <div style={{ padding: '8px 14px 16px' }}>
      <div style={{ borderRadius: 16, background: '#fff', overflow: 'hidden' }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{
            padding: '14px 16px',
            borderBottom: i < rows.length - 1 ? '1px solid var(--color-line-alternative)' : 'none',
            display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <div style={{
              flexShrink: 0, width: 60, fontSize: 13, fontWeight: 700,
              color: 'var(--color-text-alternative)', letterSpacing: '-0.005em', paddingTop: 1,
            }}>{r.label}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 14, fontWeight: 500, color: 'var(--color-text-strong)',
              }}>{r.value}</div>
              {r.sub && <div style={{
                marginTop: 4, fontSize: 12, color: 'var(--color-text-alternative)',
              }}>{r.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─ Floating CTA ──────────────────────────────────────────────────────────
function FloatingCTA({ bakery }) {
  const { saved } = useSave();
  const isSaved = saved.has(bakery.id);
  return (
    <div style={{
      position: 'absolute', left: 14, right: 14, bottom: 22, zIndex: 90,
    }}>
      <Glass radius={24} intensity="strong" style={{
        boxShadow: '0 10px 30px rgba(20,15,8,0.18)',
      }}>
        <div style={{ padding: 8, display: 'flex', gap: 8 }}>
          <button className="lift" style={{
            width: 54, height: 54, borderRadius: 16, border: 'none',
            background: 'rgba(255,255,255,0.75)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--color-text-strong)',
            gap: 2, fontFamily: 'inherit',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/>
              <circle cx="12" cy="10" r="2.5"/>
            </svg>
            <span style={{ fontSize: 9.5, fontWeight: 700 }}>길찾기</span>
          </button>
          <button className="lift" style={{
            flex: 1, height: 54, borderRadius: 16, border: 'none',
            background: 'var(--color-text-strong)', color: '#fff',
            cursor: 'pointer',
            fontSize: 15, fontWeight: 700, letterSpacing: '-0.012em',
            fontFamily: 'inherit',
          }}>
            {isSaved ? '컬렉션에 정리하기' : '내 탐험에 저장'}
          </button>
        </div>
      </Glass>
    </div>
  );
}

window.ScreenDetail = ScreenDetail;
