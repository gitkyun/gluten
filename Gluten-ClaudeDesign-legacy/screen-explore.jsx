// screen-explore.jsx — Explore v5: Curation & Trend pivot
const { useState: useStateE } = React;

function ScreenExplore({ openDetail, openOverlay, onSearch }) {
  const [exploreTab, setExploreTab] = useStateE('curation');

  return (
    <div className="scroll fade-enter" style={{
      height: '100%', overflowY: 'auto',
      background: 'var(--color-fill-surface-canvas)',
      paddingBottom: 120,
    }}>
      <TopBar
        variant="logo"
        rightActions={[
          { icon: <Icon.search />, onClick: () => onSearch && onSearch() },
          { icon: <Icon.bell />, onClick: () => openOverlay && openOverlay('notifications') },
        ]}
      />
      <div style={{ paddingTop: 92 }}/>

      {/* ── Content Type Toggle ── */}
      <div style={{ padding: '2px 16px 18px' }}>
        <SegmentedControl
          options={[
            { value: 'curation', label: '✍️ 에디터 픽' },
            { value: 'trend', label: '📊 실시간 랭킹' },
          ]}
          selected={exploreTab}
          onChange={setExploreTab}
        />
      </div>

      {exploreTab === 'curation' ? (
        <CurationView openDetail={openDetail} openOverlay={openOverlay} onSearch={onSearch}/>
      ) : (
        <TrendView openDetail={openDetail} openOverlay={openOverlay} onSearch={onSearch}/>
      )}
      <div style={{ height: 16 }}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CURATION VIEW (Formerly LocalView)
// ════════════════════════════════════════════════════════════════════════════
function CurationView({ openDetail, openOverlay, onSearch }) {
  const [topExpanded, setTopExpanded] = useStateE(false);

  // ── BLOCK 1: Editorial hero ───────────────────────────────────────────────
  const hero = BAKERIES[7];
  const Block1 = () => (
    <div style={{ padding: '0 16px 44px' }}>
      <div onClick={() => openDetail(hero.id)} className="lift" style={{
        borderRadius: 22, overflow: 'hidden', cursor: 'pointer', position: 'relative',
        boxShadow: '0 6px 20px rgba(20,15,8,0.12)',
      }}>
        <Placeholder tone={hero.ph} style={{ aspectRatio: '37 / 38', minHeight: 300, position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.06) 0%, transparent 30%, transparent 50%, rgba(0,0,0,0.72) 100%)',
          }}/>
          {/* top badges */}
          <div style={{
            position: 'absolute', top: 14, left: 14, right: 14, zIndex: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 99,
              background: 'rgba(255,255,255,0.95)',
              fontSize: 11, fontWeight: 800, color: 'var(--color-text-strong)',
              letterSpacing: '-0.005em',
            }}>
              <span style={{
                padding: '1px 5px', borderRadius: 4, background: '#1B1C1E', color: '#fff',
                fontSize: 9, fontWeight: 800, letterSpacing: '0.04em',
              }}>빵슐랭</span>
              5월의 픽
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '5px 10px', borderRadius: 99,
              background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
              color: '#fff', fontSize: 11, fontWeight: 700,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: '#00BF40' }}/>
              지금 영업 중
            </div>
          </div>
          {/* save */}
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 4 }}>
            <Glass radius={99} dark style={{ width: 38, height: 38 }}>
              <SaveStar bakeryId={hero.id} size={38} dark/>
            </Glass>
          </div>
          {/* bottom content */}
          <div style={{
            position: 'absolute', left: 18, right: 18, bottom: 20, zIndex: 3, color: '#fff',
          }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {hero.mood.slice(0, 2).map(m => (
                <span key={m} style={{
                  padding: '4px 9px', borderRadius: 99,
                  background: `${getMoodColor(hero.moodKey)}CC`,
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.01em',
                }}>{m}</span>
              ))}
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30, lineHeight: '38px', fontWeight: 800, letterSpacing: '-0.026em',
              textShadow: '0 2px 16px rgba(0,0,0,0.3)',
            }}>{hero.name}</div>
            <div style={{
              marginTop: 5, fontSize: 13, fontWeight: 500, opacity: 0.9,
            }}>{hero.region} · {hero.distance} · {hero.signature}</div>
            <div style={{
              marginTop: 10, fontSize: 13, lineHeight: '20px', opacity: 0.85,
              fontStyle: 'italic', maxWidth: 280,
            }}>"{hero.summary}"</div>
          </div>
        </Placeholder>
      </div>
    </div>
  );

  // ── BLOCK 2: Quick category circles ──────────────────────────────────────
  const Block2 = () => {
    const cats = [
      { icon: '🌤', label: '오늘의 픽', sub: '에디터', tone: 'ph-butter', color: '#D9A11A' },
      { icon: '🧈', label: '소금빵', sub: '324곳', tone: 'ph-amber', color: '#FF602E' },
      { icon: '🥐', label: '크루아상', sub: '198곳', tone: 'ph-cream', color: '#7A2E2E' },
      { icon: '☕', label: '오래 머물기', sub: '8곳 한가', tone: 'ph-stone', color: '#6B5BD9' },
      { icon: '🌿', label: '미니멀', sub: '조용한', tone: 'ph-sage', color: '#6B8F2E' },
      { icon: '🍞', label: '발효빵', sub: '신착', tone: 'ph-toast', color: '#7A2E2E' },
    ];
    return (
      <div style={{ marginBottom: 44 }}>
        <div className="scroll" style={{
          display: 'flex', gap: 20, padding: '0 18px 4px', overflowX: 'auto',
        }}>
          {cats.map((c, i) => (
            <div key={i} onClick={() => onSearch && onSearch(c.label)} className="lift" style={{
              flexShrink: 0, textAlign: 'center', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{
                width: 68, height: 68, borderRadius: 99,
                background: `${c.color}18`,
                border: `2px solid ${c.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
                boxShadow: '0 2px 8px rgba(20,15,8,0.08)',
              }}>{c.icon}</div>
              <div style={{
                marginTop: 9, fontSize: 12.5, fontWeight: 700, letterSpacing: '-0.008em',
                color: 'var(--color-text-strong)',
              }}>{c.label}</div>
              <div style={{
                marginTop: 2, fontSize: 11, fontWeight: 500,
                color: 'var(--color-text-alternative)',
              }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── BLOCK 3: TOP 8 — 1st full-width + 2-3 side by side ───────────────────
  const Block3 = () => {
    const top = BAKERIES;
    return (
      <div style={{ marginBottom: 28 }}>
        {/* Section label */}
        <div style={{ padding: '0 18px 18px', display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <h2 style={{
            margin: 0, fontFamily: 'var(--font-display)',
            fontSize: 20, fontWeight: 800, letterSpacing: '-0.018em',
            color: 'var(--color-text-strong)',
          }}>지금 주변 인기</h2>
          <span style={{
            fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)',
            color: 'var(--color-primary-normal)', letterSpacing: '-0.018em',
          }}>TOP 8</span>
          <div style={{ flex: 1 }}/>
          <span style={{
            fontSize: 11, color: 'var(--color-text-alternative)', fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 99, background: 'var(--color-primary-normal)', display: 'inline-block' }}/>
            18분 전
          </span>
        </div>

        {/* Rank 1 — full width tall */}
        <div style={{ padding: '0 16px 12px' }}>
          <div onClick={() => openDetail(top[0].id)} className="lift" style={{
            cursor: 'pointer', borderRadius: 18, overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 2px 10px rgba(19,15,13,0.10), 0 8px 24px rgba(19,15,13,0.10)',
          }}>
            <Placeholder tone={top[0].ph} style={{ aspectRatio: '17 / 10', minHeight: 180, position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
              }}/>
              {/* Giant rank number */}
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                display: 'flex', alignItems: 'center', padding: '0 20px', zIndex: 3,
              }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 80, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em',
                    color: '#fff', opacity: 0.95,
                    textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                  }}>1</div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20, fontWeight: 800, letterSpacing: '-0.016em',
                    color: '#fff', marginTop: -4,
                    textShadow: '0 1px 8px rgba(0,0,0,0.3)',
                  }}>{top[0].name}</div>
                  <div style={{
                    marginTop: 4, fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500,
                  }}>{top[0].region} · {top[0].distance}</div>
                </div>
              </div>
              {/* Save */}
              <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 4 }}>
                <SaveStar bakeryId={top[0].id} size={34} dark/>
              </div>
              {/* Trending badge */}
              <div style={{
                position: 'absolute', bottom: 14, right: 14, zIndex: 3,
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '5px 10px', borderRadius: 99,
                background: 'rgba(255,94,0,0.90)', color: '#fff',
                fontSize: 11, fontWeight: 700,
              }}>🔥 저장 +{Math.floor(Math.random() * 100 + 180)}회</div>
            </Placeholder>
          </div>
        </div>

        {/* Rank 2–3 side by side */}
        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 12 }}>
          {top.slice(1, 3).map((b, i) => (
            <div key={b.id} onClick={() => openDetail(b.id)} className="lift" style={{
              flex: 1, cursor: 'pointer', borderRadius: 16, overflow: 'hidden',
              background: '#fff',
              boxShadow: '0 2px 8px rgba(19,15,13,0.08), 0 6px 18px rgba(19,15,13,0.09)',
            }}>
              <Placeholder tone={b.ph} style={{ aspectRatio: '7 / 6', minHeight: 120, position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 8, left: 10, zIndex: 3,
                  fontFamily: 'var(--font-display)',
                  fontSize: 42, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em',
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 1px 10px rgba(0,0,0,0.35)',
                }}>{i + 2}</div>
                <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 4 }}>
                  <SaveStar bakeryId={b.id} size={30} dark/>
                </div>
              </Placeholder>
              <div style={{ padding: '10px 12px' }}>
                <div style={{
                  fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.010em',
                  color: 'var(--color-text-strong)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{b.name}</div>
                <div style={{
                  marginTop: 2, fontSize: 11.5, color: 'var(--color-text-alternative)',
                }}>{b.region} · {b.distance}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Rank 4–8 expand */}
        {topExpanded && (
          <div style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {top.slice(3, 8).map((b, i) => (
              <div key={b.id} onClick={() => openDetail(b.id)} className="lift" style={{
                cursor: 'pointer', borderRadius: 14, overflow: 'hidden', background: '#fff',
                boxShadow: '0 1px 6px rgba(19,15,13,0.07), 0 4px 14px rgba(19,15,13,0.08)',
              }}>
                <Placeholder tone={b.ph} style={{ aspectRatio: '4 / 3', minHeight: 110, position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: 8, left: 10, zIndex: 3,
                    fontFamily: 'var(--font-display)',
                    fontSize: 32, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em',
                    color: 'rgba(255,255,255,0.85)',
                    textShadow: '0 1px 8px rgba(0,0,0,0.3)',
                  }}>{i + 4}</div>
                  <div style={{ position: 'absolute', top: 6, right: 6, zIndex: 4 }}>
                    <SaveStar bakeryId={b.id} size={28} dark/>
                  </div>
                </Placeholder>
                <div style={{ padding: '9px 11px' }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    letterSpacing: '-0.010em',
                  }}>{b.name}</div>
                  <div style={{
                    marginTop: 1, fontSize: 11, color: 'var(--color-text-alternative)',
                  }}>{b.region}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ padding: '0 16px' }}>
          <Button
            label={topExpanded ? '접기' : '4~8위 더보기'}
            onClick={() => setTopExpanded(!topExpanded)}
            variant="solid"
            color="assistive"
            trailingIcon={
              <span style={{ transform: topExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms', display: 'flex' }}>
                <Icon.chevD/>
              </span>
            }
            style={{ width: '100%' }}
          />
        </div>
      </div>
    );
  };

    // ── BLOCK 4: AI 취향 추천 — asymmetric 2/3 + 1/3 stack ──────────────────
  const Block4 = () => {
    const recs = [BAKERIES[6], BAKERIES[4], BAKERIES[1]];
    return (
      <div style={{ marginBottom: 48 }}>
        {/* Dark editorial header */}
        <div style={{
          margin: '0 16px 16px',
          padding: '20px 20px',
          borderRadius: 18,
          background: 'linear-gradient(135deg, #1B1C1E 0%, #2E2F33 100%)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.5)', marginBottom: 5,
            }}>AI 취향 추천</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 17, fontWeight: 800, letterSpacing: '-0.014em',
              color: '#fff', lineHeight: '24px', textWrap: 'pretty',
            }}>
              <span style={{
                background: 'linear-gradient(90deg, #FFD479, #FF7B2E)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>기현</span>님의 저장 패턴 분석 완료 — 비슷한 곳 찾았어요
            </div>
          </div>
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: 'rgba(255,255,255,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" fill="#FFD479"/>
              <path d="M5 20l1 2M19 20l1 2M5 2L4 0M19 2l1-2" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Asymmetric: large left + stacked right */}
        <div style={{ padding: '0 16px', display: 'flex', gap: 12 }}>
          {/* Large left */}
          <div onClick={() => openDetail(recs[0].id)} className="lift" style={{
            flex: 2, cursor: 'pointer',
          }}>
            <Placeholder tone={recs[0].ph} style={{
              height: 280, borderRadius: 18, overflow: 'hidden', position: 'relative',
            }}>
              {/* taste % badge */}
              <div style={{
                position: 'absolute', top: 10, left: 10, zIndex: 3,
                padding: '5px 9px', borderRadius: 99,
                background: 'rgba(255,255,255,0.95)',
                fontSize: 11, fontWeight: 800, color: getMoodColor(recs[0].moodKey),
              }}>{recs[0].tasteFit}% 일치</div>
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 4 }}>
                <SaveStar bakeryId={recs[0].id} size={32} dark/>
              </div>
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3, padding: '28px 12px 14px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
                color: '#fff',
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, opacity: 0.85, marginBottom: 4,
                }}>르 파베와 비슷한 분위기</div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 17,
                  fontWeight: 800, letterSpacing: '-0.014em',
                }}>{recs[0].name}</div>
                <div style={{ fontSize: 11.5, marginTop: 3, opacity: 0.88 }}>
                  {recs[0].region} · {recs[0].distance}
                </div>
              </div>
            </Placeholder>
          </div>
          {/* Stacked right */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recs.slice(1).map((b, i) => (
              <div key={b.id} onClick={() => openDetail(b.id)} className="lift" style={{
                flex: 1, cursor: 'pointer',
              }}>
                <Placeholder tone={b.ph} style={{
                  height: 135, borderRadius: 14, overflow: 'hidden', position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', top: 6, left: 8, zIndex: 3,
                    padding: '3px 7px', borderRadius: 99,
                    background: 'rgba(255,255,255,0.92)',
                    fontSize: 10, fontWeight: 800, color: getMoodColor(b.moodKey),
                  }}>{b.tasteFit}%</div>
                  <div style={{
                    position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3,
                    padding: '20px 9px 10px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                    color: '#fff',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 13,
                      fontWeight: 800, letterSpacing: '-0.010em',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{b.name}</div>
                    <div style={{ fontSize: 10.5, marginTop: 2, opacity: 0.88 }}>{b.region}</div>
                  </div>
                </Placeholder>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── BLOCK 5: 저장리스트 horizontal scroll ────────────────────────────────
  const Block5 = () => {
    const lists = [
      { id: 'l1', collectionId: 'c1', tone: 'ph-wheat', curator: '성수에디터', curatorChar: '성', curatorPh: 'ph-rose',
        title: '성수에서 빵 산책하는\n주말 모음집', places: 12, views: '2.3만', width: 266 },
      { id: 'l2', collectionId: 'c2', tone: 'ph-stone', curator: '브런치홀릭', curatorChar: '브', curatorPh: 'ph-stone',
        title: '햇살 좋은 코너자리\n베이커리 14곳', places: 14, views: '1.8만', width: 228 },
      { id: 'l3', collectionId: 'c3', tone: 'ph-cream', curator: '캄파뉴마니아', curatorChar: '캄', curatorPh: 'ph-crust',
        title: '발효빵 깊이있게\n비교해봤어요', places: 8, views: '9.1천', width: 246 },
    ];
    return (
      <div style={{ marginBottom: 48 }}>
        <div style={{ padding: '0 18px 18px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h2 style={{
            margin: 0, fontFamily: 'var(--font-display)',
            fontSize: 20, fontWeight: 800, letterSpacing: '-0.018em',
            color: 'var(--color-text-strong)',
          }}>주목할 저장리스트</h2>
          <button onClick={() => onSearch && onSearch('성수')} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 12, fontWeight: 700, color: 'var(--color-primary-normal)',
            fontFamily: 'inherit',
          }}>전체보기</button>
        </div>
        <div className="scroll" style={{
          display: 'flex', gap: 14, padding: '0 16px', overflowX: 'auto',
        }}>
          {lists.map(c => (
            <div key={c.id} onClick={() => openOverlay && openOverlay('collection', c.collectionId)} className="lift" style={{
              flexShrink: 0, width: c.width, borderRadius: 18, overflow: 'hidden',
              background: '#fff', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(19,15,13,0.06), 0 8px 22px rgba(19,15,13,0.07)',
            }}>
              <Placeholder tone={c.tone} style={{ height: 180 }}/>
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Placeholder tone={c.curatorPh} style={{
                    width: 18, height: 18, borderRadius: 99,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ position: 'relative', zIndex: 3, fontSize: 9, fontWeight: 700, color: '#fff' }}>{c.curatorChar}</span>
                  </Placeholder>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--color-text-alternative)' }}>{c.curator}</span>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15.5, lineHeight: '22px', fontWeight: 700, letterSpacing: '-0.010em',
                  color: 'var(--color-text-strong)', whiteSpace: 'pre-line',
                }}>{c.title}</div>
                <div style={{
                  marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{
                    display: 'flex', gap: 10, fontSize: 11.5, fontWeight: 600,
                    color: 'var(--color-text-alternative)',
                  }}>
                    <span>📍 {c.places}</span>
                    <span>👁 {c.views}</span>
                  </div>
                  <Button
                    label="보기"
                    onClick={(e) => { e.stopPropagation(); openOverlay && openOverlay('collection', c.collectionId); }}
                    variant="outlined"
                    color="assistive"
                    size="small"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── BLOCK 6: 빵 종류 — 해시태그 magazine grid (3-col varying heights) ──────
  const Block6 = () => {
    const items = [
      { label: '#소금빵', tone: 'ph-butter', count: '643곳', tall: true },
      { label: '#크루아상', tone: 'ph-amber', count: '198곳' },
      { label: '#베이글', tone: 'ph-toast', count: '122곳' },
      { label: '#캄파뉴', tone: 'ph-crust', count: '412곳', tall: true },
      { label: '#타르트', tone: 'ph-rose', count: '276곳' },
      { label: '#브리오슈', tone: 'ph-cream', count: '89곳' },
    ];
    return (
      <div style={{ marginBottom: 48, containerType: 'inline-size' }}>
        <div style={{ padding: '0 18px 18px' }}>
          <h2 style={{
            margin: 0, fontFamily: 'var(--font-display)',
            fontSize: 20, fontWeight: 800, letterSpacing: '-0.018em',
            color: 'var(--color-text-strong)',
          }}>빵 종류별 탐험</h2>
          <div style={{
            marginTop: 5, fontSize: 13, color: 'var(--color-text-alternative)',
          }}>어떤 빵이 끌려요?</div>
        </div>
        {/* 3-col masonry — row height tracks column width (cqw) so cells stay proportional */}
        <div style={{
          padding: '0 16px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridAutoRows: 'clamp(72px, 22cqw, 116px)',
          gap: 10,
        }}>
          {items.map((it, i) => {
            const rowSpan = it.tall ? 2 : 1;
            return (
              <div key={it.label} onClick={() => onSearch && onSearch(it.label.replace('#', ''))} className="lift" style={{
                cursor: 'pointer',
                gridRow: `span ${rowSpan}`,
              }}>
                <Placeholder tone={it.tone} style={{
                  height: '100%', borderRadius: 14, overflow: 'hidden', position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6))',
                  }}/>
                  <div style={{
                    position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3,
                    padding: rowSpan === 2 ? '24px 10px 12px' : '16px 10px 10px',
                    color: '#fff',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: rowSpan === 2 ? 14 : 12, fontWeight: 800,
                      letterSpacing: '-0.008em',
                    }}>{it.label}</div>
                    <div style={{
                      marginTop: 2, fontSize: 10, opacity: 0.85, fontWeight: 600,
                    }}>{it.count}</div>
                  </div>
                </Placeholder>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── BLOCK 7: 핫플 동네 — bubble + varied egg shapes ────────────────────────
  const Block7 = () => {
    const hotplaces = [
      { region: '성수', tone: 'ph-wheat', count: 86, size: 'lg' },
      { region: '연남', tone: 'ph-sage', count: 64, size: 'md' },
      { region: '망원', tone: 'ph-toast', count: 41, size: 'sm' },
      { region: '한남', tone: 'ph-rose', count: 38, size: 'md' },
    ];
    const sizes = { lg: { w: 138, h: 156 }, md: { w: 116, h: 132 }, sm: { w: 100, h: 114 } };
    return (
      <div style={{ marginBottom: 48 }}>
        <div style={{ padding: '0 18px 8px' }}>
          <h2 style={{
            margin: 0, fontFamily: 'var(--font-display)',
            fontSize: 20, fontWeight: 800, letterSpacing: '-0.018em',
            color: 'var(--color-text-strong)',
          }}>빵 탐험 핫플 동네</h2>
        </div>
        <div className="scroll" style={{
          display: 'flex', gap: 16, padding: '20px 18px 4px',
          overflowX: 'auto', alignItems: 'flex-end',
        }}>
          {hotplaces.map((h, i) => {
            const sz = sizes[h.size];
            return (
              <div key={h.region} onClick={() => onSearch && onSearch(h.region)} style={{
                flexShrink: 0, textAlign: 'center', cursor: 'pointer',
              }} className="lift">
                {/* Speech bubble */}
                <div style={{
                  position: 'relative', display: 'inline-block',
                  padding: '5px 10px', borderRadius: 99,
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(20,15,8,0.12)',
                  marginBottom: -4, zIndex: 2,
                  fontSize: 11, fontWeight: 700, color: 'var(--color-text-strong)',
                }}>
                  {h.count}곳 탐험 중
                  <div style={{
                    position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
                    width: 0, height: 0,
                    borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                    borderTop: '6px solid #fff',
                  }}/>
                </div>
                {/* Egg-shaped region card */}
                <Placeholder tone={h.tone} style={{
                  width: sz.w, height: sz.h,
                  borderRadius: `${sz.w * 0.5}px ${sz.w * 0.5}px 14px 14px`,
                  overflow: 'hidden', position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.55))',
                  }}/>
                  <div style={{
                    position: 'absolute', bottom: 12, left: 0, right: 0, zIndex: 3,
                    textAlign: 'center', color: '#fff',
                    fontFamily: 'var(--font-display)',
                    fontSize: h.size === 'lg' ? 22 : h.size === 'md' ? 19 : 16,
                    fontWeight: 800, letterSpacing: '-0.02em',
                    textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                  }}>{h.region}</div>
                </Placeholder>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── BLOCK 8: 지금 이 순간 — live activity strip ───────────────────────────
  const Block8 = () => {
    const activity = [
      { user: '지수', avatarPh: 'ph-rose', char: '지', action: '저장함', bakeryName: '먼슬리 페이스트리', bakeryId: 'b4', time: '방금', tone: 'ph-butter' },
      { user: '도윤', avatarPh: 'ph-stone', char: '도', action: '리뷰 남김', bakeryName: '르 파베', bakeryId: 'b1', time: '3분 전', tone: 'ph-wheat' },
      { user: '서연', avatarPh: 'ph-cream', char: '서', action: '다녀옴', bakeryName: '슬로우브레드', bakeryId: 'b3', time: '12분 전', tone: 'ph-toast' },
    ];
    return (
      <div style={{ marginBottom: 48 }}>
        <div style={{
          margin: '0 16px 16px', padding: '18px 18px',
          borderRadius: 20, background: '#fff',
          boxShadow: '0 2px 8px rgba(19,15,13,0.05), 0 8px 20px rgba(19,15,13,0.06)',
          display: 'flex', alignItems: 'flex-start', flexDirection: 'column', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(255,0,0,0.07)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: '#FF3B30' }}/>
              <span style={{
                fontSize: 11, fontWeight: 800, color: '#CC2200',
                letterSpacing: '0.04em',
              }}>LIVE</span>
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800,
              letterSpacing: '-0.010em', color: 'var(--color-text-strong)',
            }}>지금 이 순간</span>
          </div>

          {activity.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              paddingTop: i > 0 ? 14 : 0,
              borderTop: i > 0 ? '1px solid var(--color-line-alternative)' : 'none',
            }}>
              {/* Avatar clicks to user profile */}
              <Avatar 
                tone={a.avatarPh} 
                label={a.char} 
                onClick={() => openOverlay && openOverlay('userProfile', a.user)} 
                style={{ width: 34, height: 34 }} 
              />
              
              {/* Text clicks to bakery details */}
              <div onClick={() => openDetail && openDetail(a.bakeryId)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)',
                  }}>{a.user}</span>
                  <span style={{
                    fontSize: 12, color: 'var(--color-text-alternative)',
                  }}>님이</span>
                  <span style={{
                    fontSize: 12.5, fontWeight: 700,
                    color: 'var(--color-text-strong)',
                    textDecoration: 'underline',
                  }}>{a.bakeryName}</span>
                  <span style={{
                    fontSize: 12, color: 'var(--color-text-alternative)',
                  }}>을 {a.action}</span>
                </div>
                <div style={{
                  marginTop: 3, fontSize: 10.5, color: 'var(--color-text-alternative)',
                }}>{a.time}</div>
              </div>
              
              {/* Thumbnail clicks to bakery details */}
              <Placeholder tone={a.tone} onClick={() => openDetail && openDetail(a.bakeryId)} style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0, cursor: 'pointer',
                border: '1px solid var(--color-line-alternative)',
              }}/>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ── BLOCK 9: 시즌 팝업 ──────────────────────────────────────────────────
  const Block9 = () => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ padding: '0 18px 18px' }}>
        <h2 style={{
          margin: 0, fontFamily: 'var(--font-display)',
          fontSize: 20, fontWeight: 800, letterSpacing: '-0.018em',
          color: 'var(--color-text-strong)',
        }}>지금 하는 시즌 팝업</h2>
      </div>
      
      {/* Big Pop-up Card */}
      <div style={{ padding: '0 16px 12px' }}>
        <div 
          onClick={() => openDetail && openDetail('b4')} 
          className="lift" 
          style={{
            borderRadius: 18, overflow: 'hidden', cursor: 'pointer', background: '#fff',
            boxShadow: '0 2px 8px rgba(19,15,13,0.06), 0 10px 24px rgba(19,15,13,0.08)',
          }}
        >
          <Placeholder tone="ph-amber" style={{ aspectRatio: '23 / 10', minHeight: 130, position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
            }}/>
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 3,
              padding: '0 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
              color: '#fff',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3.5px 10px', borderRadius: 99,
                background: '#FE5102',
                fontSize: 10, fontWeight: 800, marginBottom: 8, alignSelf: 'flex-start',
                letterSpacing: '0.04em',
              }}>POP-UP 진행중</div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 21,
                fontWeight: 800, letterSpacing: '-0.018em',
                lineHeight: '27px',
                textShadow: '0 1px 10px rgba(0,0,0,0.2)',
              }}>먼슬리 페이스트리<br/>5월 살구 에디션</div>
              <div style={{ marginTop: 6, fontSize: 11, opacity: 0.9, fontWeight: 600 }}>
                26.05.18 — 06.30 · 성수동 · 대기 보통
              </div>
            </div>
          </Placeholder>
        </div>
      </div>
      
      {/* Grid Pop-up Cards */}
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { id: 'b6', tone: 'ph-rose', title: '5월의 시즌 타르트', status: '신규 팝업', sub: '1.4km · 한남', range: '05.25 — 06.07' },
          { id: 'b5', tone: 'ph-sage', title: '오트밀 한정 식빵', status: '마감 임박', sub: '5.1km · 안국', range: '05.20 — 05.31' },
        ].map((p, i) => (
          <div 
            key={i} 
            onClick={() => openDetail && openDetail(p.id)} 
            className="lift" 
            style={{
              borderRadius: 14, overflow: 'hidden', background: '#fff', cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(19,15,13,0.06), 0 6px 16px rgba(19,15,13,0.07)',
            }}
          >
            <Placeholder tone={p.tone} style={{ aspectRatio: '3 / 2', minHeight: 104 }}/>
            <div style={{ padding: '12px 14px 14px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                padding: '2.5px 7px', borderRadius: 4,
                background: p.status === '마감 임박' ? 'rgba(255,60,0,0.10)' : 'rgba(254,81,2,0.08)',
                color: p.status === '마감 임박' ? '#CC2200' : '#C63B14',
                fontSize: 10, fontWeight: 800, marginBottom: 5,
              }}>{p.status}</div>
              <div style={{
                fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)',
                letterSpacing: '-0.010em',
              }}>{p.title}</div>
              <div style={{
                marginTop: 3, fontSize: 10.5, color: 'var(--color-text-alternative)',
                fontWeight: 500,
              }}>{p.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── BLOCK AI Rec: Premium AI Taste Recommendation ─────────────────────────
  const BlockAIRec = () => {
    return (
      <div style={{ padding: '0 16px 36px' }}>
        <div 
          onClick={() => openOverlay && openOverlay('tasteReport')} 
          className="lift" 
          style={{
            padding: '20px 22px', 
            borderRadius: 24, 
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #FF7B47 0%, #FE5102 50%, #9C1F00 100%)',
            position: 'relative', 
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(254, 81, 2, 0.25)',
          }}
        >
          {/* Subtle glowing elements */}
          <div style={{
            position: 'absolute', right: -20, bottom: -20, 
            width: 120, height: 120, borderRadius: 99,
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            filter: 'blur(10px)',
          }}/>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 13, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>✨</span>
            <span style={{
              fontSize: 11, 
              fontWeight: 800, 
              letterSpacing: '0.04em',
              color: 'rgba(255, 255, 255, 0.9)',
            }}>김기현님을 위한 AI 취향 저격</span>
          </div>

          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20, 
            fontWeight: 800, 
            lineHeight: '27px', 
            color: '#fff',
            letterSpacing: '-0.02em',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            오늘 기현님의 취향과 <br/>
            <span style={{ color: '#FFE600', fontWeight: 900 }}>98% 일치하는</span> 베이커리 4곳
          </div>

          <div style={{
            marginTop: 12, 
            fontSize: 12, 
            color: 'rgba(255, 255, 255, 0.85)', 
            lineHeight: '18px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '2px 8px',
              borderRadius: 99,
              fontSize: 10,
              fontWeight: 700,
            }}>조용한 호밀빵 탐험가</span>
            <span>분석 리포트 확인하기 →</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Block1/>
      <BlockAIRec/>
      <Block2/>
      <Block4/>
      <Block5/>
      <Block6/>
      <Block7/>
      <Block8/>
      <Block9/>
      <div style={{ height: 24 }}/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TREND VIEW
// ════════════════════════════════════════════════════════════════════════════
function TrendView({ openDetail, openOverlay, onSearch }) {
  const trendBakeries = BAKERIES.slice(0, 8);
  
  const risingReviews = [
    { id: 'b4', name: '먼슬리 페이스트리', region: '성수', score: '4.9', ph: 'ph-amber', review: '🥐 "살구 페이스트리가 한정이라 서둘렀는데, 상큼하고 결이 살아있어 아깝지 않아요!"' },
    { id: 'b2', name: '밀리언즈', region: '연남', score: '4.8', ph: 'ph-butter', review: '🧈 "인생 소금빵 등극. 버터 동굴이 엄청 크고 바닥이 누룽지처럼 바삭해요."' },
    { id: 'b7', name: '코른블루멘', region: '망원', score: '4.8', ph: 'ph-stone', review: '🌾 "호밀빵 씹을수록 구수하고 속이 편해요. 에디터 픽인 이유가 있네요."' },
  ];

  const keywords = [
    { rank: 1, text: '버터향이 진해요', emoji: '🧈', count: '412회', trend: '+15%' },
    { rank: 2, text: '오래 머물기 좋아요', emoji: '☕', count: '345회', trend: '+8%' },
    { rank: 3, text: '식사빵 퀄리티 최고', emoji: '🍞', count: '290회', trend: '+12%' },
    { rank: 4, text: '햇살이 따뜻해요', emoji: '☀️', count: '214회', trend: '+4%' },
    { rank: 5, text: '재료가 신선해요', emoji: '🌿', count: '198회', trend: '+2%' },
  ];

  const searchKeywords = [
    '소금빵', '작업하기좋은', '성수동 핫플', '천연발효종', '바게트', '비건 베이커리', '잠봉뵈르'
  ];

  return (
    <div style={{ padding: '0 14px 24px' }}>
      
      {/* 1. 실시간 인기 TOP 8 */}
      <div style={{ padding: '0 4px 16px', display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <h2 style={{
          margin: 0, fontFamily: 'var(--font-display)',
          fontSize: 18, fontWeight: 800, letterSpacing: '-0.018em',
          color: 'var(--color-text-strong)',
        }}>실시간 인기</h2>
        <span style={{
          fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)',
          color: 'var(--color-primary-normal)', letterSpacing: '-0.018em',
        }}>TOP 8</span>
        <button 
          onClick={() => openOverlay && openOverlay('rankDetail', { category: 'all' })} 
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 11.5, fontWeight: 700, color: 'var(--color-primary-normal)',
            padding: '2px 6px', display: 'inline-flex', alignItems: 'center',
            marginLeft: 4, fontFamily: 'inherit',
          }}
        >
          더보기 ➡️
        </button>
        <div style={{ flex: 1 }}/>
        <span style={{
          fontSize: 11, color: 'var(--color-text-alternative)', fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: 99, background: '#FE5102', display: 'inline-block' }}/>
          실시간 집계중
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 36 }}>
        {trendBakeries.map((b, i) => (
          <div key={b.id} onClick={() => openDetail(b.id)} className="lift" style={{
            cursor: 'pointer', borderRadius: 14, overflow: 'hidden', background: '#fff',
            boxShadow: '0 1px 3px rgba(19,15,13,0.06), 0 5px 14px rgba(19,15,13,0.07)',
          }}>
            <Placeholder tone={b.ph} style={{ aspectRatio: '4 / 3', minHeight: 110, position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 6, left: 10, zIndex: 3,
                fontFamily: 'var(--font-display)',
                fontSize: 32, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em',
                color: 'rgba(255,255,255,0.95)',
                textShadow: '0 1px 6px rgba(0,0,0,0.4)',
              }}>{i + 1}</div>
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 4 }}>
                <SaveStar bakeryId={b.id} size={30} dark/>
              </div>
            </Placeholder>
            <div style={{ padding: '10px 12px' }}>
              <div style={{
                fontSize: 13, fontWeight: 700, letterSpacing: '-0.010em',
                color: 'var(--color-text-strong)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{b.name}</div>
              <div style={{
                marginTop: 2, fontSize: 11, color: 'var(--color-text-alternative)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{b.region} · {b.signature}</div>
              <div style={{
                marginTop: 6, display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 11, fontWeight: 700, color: 'var(--color-primary-normal)',
              }}>
                <span>★ {b.rating || '4.7'}</span>
                <span style={{ color: 'var(--color-text-alternative)', fontWeight: 500 }}>({b.reviewsCount || '82'})</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. 리뷰 평점 급상승 베스트 3 */}
      <div style={{ padding: '0 4px 16px' }}>
        <h2 style={{
          margin: 0, fontFamily: 'var(--font-display)',
          fontSize: 18, fontWeight: 800, letterSpacing: '-0.018em',
          color: 'var(--color-text-strong)',
        }}>리뷰 급상승 베스트 🌟</h2>
        <p style={{
          margin: '4px 0 0', fontSize: 11.5, color: 'var(--color-text-alternative)',
          fontWeight: 500,
        }}>이번 주 리뷰 평점과 호평 언급량이 크게 늘어난 매장입니다.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
        {risingReviews.map((b) => (
          <div 
            key={b.id} 
            onClick={() => openDetail(b.id)} 
            className="lift" 
            style={{
              padding: 14, borderRadius: 16, background: '#fff',
              boxShadow: '0 1px 4px rgba(19,15,13,0.05), 0 6px 14px rgba(19,15,13,0.06)',
              display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'center',
            }}
          >
            <Placeholder tone={b.ph} style={{ width: 56, height: 56, borderRadius: 12, flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)' }}>{b.name}</span>
                <span style={{ fontSize: 11.5, color: 'var(--color-text-alternative)' }}>{b.region}</span>
                <span style={{
                  background: 'rgba(255, 191, 0, 0.08)', color: '#D9A11A',
                  padding: '1px 6px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                  marginLeft: 'auto',
                }}>★ {b.score}</span>
              </div>
              <div style={{
                marginTop: 6, fontSize: 11.5, color: 'var(--color-text-normal)',
                lineHeight: '16px', fontStyle: 'italic', fontWeight: 500,
                background: 'var(--color-background-alternative)', padding: '6px 10px', borderRadius: 8,
              }}>
                {b.review}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. 리뷰 속 최다 언급 키워드 랭킹 */}
      <div style={{ padding: '0 4px 16px' }}>
        <h2 style={{
          margin: 0, fontFamily: 'var(--font-display)',
          fontSize: 18, fontWeight: 800, letterSpacing: '-0.018em',
          color: 'var(--color-text-strong)',
        }}>리뷰 키워드 트렌드</h2>
        <p style={{
          margin: '4px 0 0', fontSize: 11.5, color: 'var(--color-text-alternative)',
          fontWeight: 500,
        }}>이번 주 누적 리뷰 언급수가 가장 많은 맛/분위기 키워드입니다.</p>
      </div>

      <div style={{ 
        background: '#fff', borderRadius: 20, padding: '8px 16px',
        boxShadow: '0 1px 4px rgba(19,15,13,0.05), 0 6px 16px rgba(19,15,13,0.06)',
        marginBottom: 36,
      }}>
        {keywords.map((k, idx) => (
          <div 
            key={k.rank} 
            onClick={() => onSearch && onSearch(k.text.replace(/ /g, ''))}
            className="lift"
            style={{
              display: 'flex', alignItems: 'center', padding: '12px 0',
              borderBottom: idx < keywords.length - 1 ? '1px solid var(--color-line-alternative)' : 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{
              width: 22, fontSize: 14, fontWeight: 800,
              color: k.rank <= 3 ? 'var(--color-primary-normal)' : 'var(--color-text-alternative)',
            }}>{k.rank}</span>
            <span style={{ fontSize: 15, marginRight: 6 }}>{k.emoji}</span>
            <span style={{
              fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)',
            }}>{k.text}</span>
            <span style={{
              marginLeft: 'auto', fontSize: 11.5, color: 'var(--color-text-alternative)',
              fontWeight: 500,
            }}>{k.count}</span>
            <span style={{
              marginLeft: 8, fontSize: 11, fontWeight: 700, color: '#0E7C3A',
            }}>{k.trend}</span>
          </div>
        ))}
      </div>

      {/* 4. 실시간 급상승 태그 */}
      <div style={{ padding: '0 4px 14px' }}>
        <h2 style={{
          margin: 0, fontFamily: 'var(--font-display)',
          fontSize: 16, fontWeight: 800, letterSpacing: '-0.018em',
          color: 'var(--color-text-strong)',
        }}>지금 많이 찾는 키워드 🔥</h2>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 4px' }}>
        {searchKeywords.map(k => (
          <Chip
            key={k}
            label={`#${k}`}
            active={false}
            onClick={() => onSearch && onSearch(k)}
            variant="outlined"
            size="small"
          />
        ))}
      </div>

    </div>
  );
}

window.ScreenExplore = ScreenExplore;
