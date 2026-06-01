// screen-profile.jsx — taste archive with Korean tab structure
const { useState: useStateP } = React;

function ScreenProfile({ openDetail, openOverlay }) {
  const [tab, setTab] = useStateP('profile');
  const { saved } = useSave();

  return (
    <div className="scroll fade-enter" style={{
      height: '100%', overflowY: 'auto',
      background: 'var(--color-background-normal)',
      paddingBottom: 120,
    }}>
      <TopBar
        title="마이"
        rightActions={[
          {
            icon: (
              <>
                <Icon.bell />
                <span style={{
                  position: 'absolute', top: 0, right: 0,
                  width: 7, height: 7, borderRadius: 99, background: '#FF5E00',
                  border: '1.5px solid #fff',
                }}/>
              </>
            ),
            onClick: () => openOverlay && openOverlay('notifications')
          },
          {
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>
              </svg>
            ),
            onClick: () => openOverlay && openOverlay('settings')
          }
        ]}
      />
      <div style={{ paddingTop: 92 }} />

      {/* Identity card */}
      <div style={{ padding: '0 20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Placeholder tone="ph-rose" style={{
            width: 64, height: 64, borderRadius: 99,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              position: 'relative', zIndex: 3, fontSize: 24, fontWeight: 700, color: '#fff',
              fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
              textShadow: '0 1px 4px rgba(0,0,0,0.25)',
            }}>K</span>
          </Placeholder>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 19, fontWeight: 700, letterSpacing: '-0.018em',
              color: 'var(--color-text-strong)',
            }}>김기현</div>
            <div style={{
              marginTop: 4, fontSize: 12.5,
              color: 'var(--color-text-alternative)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span>탐험가 · 디자인</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: 'var(--color-primary-normal)', fontWeight: 700 }}>Lv. 빵수저</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          marginTop: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 0',
          borderTop: '1px solid var(--color-line-alternative)',
          borderBottom: '1px solid var(--color-line-alternative)',
        }}>
          <Stat n={saved.size} label="저장"/>
          <Divider/>
          <Stat n="12" label="다녀온 곳"/>
          <Divider/>
          <Stat n="4" label="컬렉션"/>
          <Divider/>
          <Stat n="86" label="팔로워"/>
        </div>

        {/* Top action buttons */}
        <div style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button
            label="프로필 편집"
            variant="outlined"
            color="assistive"
            style={{ flex: 1 }}
          />
          <IconButton
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>
              </svg>
            }
            variant="outlined"
            size="large"
            onClick={() => openOverlay && openOverlay('settings')}
            style={{ width: 48, height: 48, borderRadius: 'var(--radius-control, 12px)' }}
          />
        </div>
      </div>

      {/* Tab strip */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        background: 'var(--color-fill-surface-default)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}>
        <Tabs
          tabs={[
            { id: 'profile', label: '프로필' },
            { id: 'collection', label: '컬렉션' },
            { id: 'activity', label: '활동' },
            { id: 'review', label: '리뷰' },
          ]}
          activeTab={tab}
          onChange={setTab}
        />
      </div>

      {/* Tab content */}
      <div key={tab} className="fade-enter" style={{ paddingTop: 4 }}>
        {tab === 'profile'    && <TabProfileInfo openDetail={openDetail} openOverlay={openOverlay}/>}
        {tab === 'collection' && <TabCollections openCollection={(id) => openOverlay && openOverlay('collection', id)}/>}
        {tab === 'activity'   && <TabActivity/>}
        {tab === 'review'     && <TabMyReviews/>}
      </div>
      <div style={{ height: 24 }}/>
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 19, lineHeight: 1, letterSpacing: '-0.02em',
        fontWeight: 700, color: 'var(--color-text-strong)',
      }}>{n}</div>
      <div style={{
        marginTop: 4, fontSize: 10.5, fontWeight: 600,
        color: 'var(--color-text-alternative)',
      }}>{label}</div>
    </div>
  );
}
function Divider() {
  return <span style={{ width: 1, height: 24, background: 'var(--color-line-alternative)' }}/>;
}

// ─ Tab: Profile (bio, taste tags, taste report) ──────────────────────────
function TabProfileInfo({ openDetail, openOverlay }) {
  return (
    <div>

        <div onClick={() => openOverlay && openOverlay('tasteReport')} className="lift" style={{
          padding: 22, borderRadius: 24, cursor: 'pointer',
          background: 'linear-gradient(160deg, #F4EDE0 0%, #E2C9A0 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            fontSize: 11, letterSpacing: '0.04em',
            color: 'rgba(70,60,40,0.55)', fontWeight: 700,
          }}>이번 달 취향 리포트</div>
          <div style={{
            marginTop: 8,
            fontFamily: 'var(--font-display)',
            fontSize: 22, lineHeight: '30px', letterSpacing: '-0.02em',
            fontWeight: 700, color: 'var(--color-text-strong)',
            textWrap: 'pretty',
          }}>
            묵직한 호밀이 <br/>
            <span style={{ color: '#9C5800' }}>3주째 늘고 있어요.</span>
          </div>
          <div style={{
            marginTop: 14, fontSize: 12.5, lineHeight: '18px',
            color: 'rgba(70,60,40,0.7)', fontWeight: 500,
          }}>
            우드톤 공간 7곳 · 조용한 오후 9곳 · 소금빵 4곳을 저장
          </div>
          <div style={{
            marginTop: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px 8px 12px', borderRadius: 99,
            background: 'rgba(255,255,255,0.65)',
            color: 'var(--color-text-strong)',
            fontSize: 12.5, fontWeight: 700,
          }}>
            <Icon.sparkle/>
            리포트 자세히 보기
          </div>
          {/* decorative orb */}
          <div style={{
            position: 'absolute', right: -36, top: -36, width: 160, height: 160,
            borderRadius: 99,
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.7), transparent 65%)',
            pointerEvents: 'none',
          }}/>
        </div>

      {/* Taste tags */}
      <div style={{ padding: '16px 20px 12px' }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)',
          letterSpacing: '-0.008em', marginBottom: 10,
        }}>나의 취향 태그</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['#성수', '#연남', '#소금빵', '#캄파뉴', '#우드톤', '#조용한', '#햇살', '#혼자', '#오래 머물기'].map(t => (
            <span key={t} style={{
              padding: '6px 12px', borderRadius: 99,
              background: 'rgba(40,30,20,0.06)',
              color: 'var(--color-text-normal)',
              fontSize: 12.5, fontWeight: 600,
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div style={{
        padding: '20px 22px',
        margin: '12px 16px 20px', borderRadius: 16,
        background: 'var(--color-background-alternative)',
      }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.04em',
          color: 'var(--color-text-alternative)', fontWeight: 700, marginBottom: 8,
        }}>나의 한 줄</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16, lineHeight: '24px', letterSpacing: '-0.012em',
          fontWeight: 600, color: 'var(--color-text-strong)',
          textWrap: 'pretty',
        }}>
          조용한 오후의 우드톤, 묵직한 호밀, <br/>햇살이 비치는 코너 자리를 좋아함.
        </div>
      </div>

      {/* 다음 탐험 — Not yet visited saves */}
      <SectionHead overline="다음 탐험" title="아직 안 가본 저장"/>
      <SavedList openDetail={openDetail}/>
    </div>
  );
}

function SavedList({ openDetail }) {
  const { saved } = useSave();
  const savedList = BAKERIES.filter(b => saved.has(b.id));
  return (
    <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {savedList.length > 0 ? savedList.map(b => (
        <div key={b.id} className="lift" onClick={() => openDetail(b.id)} style={{
          display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'center',
        }}>
          <Placeholder tone={b.ph} style={{
            width: 64, height: 64, borderRadius: 14, flexShrink: 0,
          }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 15, fontWeight: 700, letterSpacing: '-0.012em',
              color: 'var(--color-text-strong)',
            }}>{b.name}</div>
            <div style={{ marginTop: 2, fontSize: 12, color: 'var(--color-text-alternative)' }}>
              {b.region} · 저장 4일 전 · 아직 안 다녀옴
            </div>
          </div>
          <SaveStar bakeryId={b.id}/>
        </div>
      )) : (
        <div style={{
          padding: 20, textAlign: 'center', color: 'var(--color-text-alternative)',
          fontSize: 13,
        }}>저장한 곳이 아직 없어요.</div>
      )}
    </div>
  );
}

// ─ Tab: Collection ───────────────────────────────────────────────────────
function TabCollections({ openCollection }) {
  return (
    <div style={{ padding: '20px 0 8px' }}>
      {/* New collection button */}
      <div style={{ padding: '0 20px 16px' }}>
        <button className="lift" style={{
          width: '100%', padding: '14px 16px', borderRadius: 16,
          border: '1.5px dashed var(--color-line-strong)',
          background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontFamily: 'inherit',
          color: 'var(--color-text-normal)', fontSize: 14, fontWeight: 700,
        }}>
          <Icon.plus/>
          새 컬렉션 만들기
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 20px 16px' }}>
        {COLLECTIONS.map(c => (
          <div key={c.id} onClick={() => openCollection && openCollection(c.id)} className="lift" style={{ cursor: 'pointer' }}>
            <Placeholder tone={c.ph} style={{
              aspectRatio: '1/0.92', borderRadius: 20, overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', right: 12, bottom: 12, zIndex: 3,
                display: 'flex',
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 22, height: 22, borderRadius: 99,
                    background: `linear-gradient(135deg, ${c.accent}, #fff)`,
                    border: '1.5px solid #fff',
                    marginLeft: i === 0 ? 0 : -8,
                  }}/>
                ))}
              </div>
              <div style={{ position: 'absolute', top: 10, left: 12, zIndex: 3 }}>
                <span style={{
                  fontSize: 10.5, color: '#fff', fontWeight: 700, letterSpacing: '0.02em',
                  padding: '3px 8px', borderRadius: 99,
                  background: 'rgba(0,0,0,0.32)', backdropFilter: 'blur(8px)',
                }}>{c.count}곳</span>
              </div>
            </Placeholder>
            <div style={{
              marginTop: 11, fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.012em',
              color: 'var(--color-text-strong)',
            }}>{c.name}</div>
            <div style={{
              marginTop: 3, fontSize: 11.5, color: 'var(--color-text-alternative)',
            }}>업데이트 2일 전</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─ Tab: Activity ─────────────────────────────────────────────────────────
function TabActivity() {
  const days = [
    { date: '11.15 토', items: [
      { bakery: '르 파베', action: '다녀옴', tone: 'ph-wheat', detail: '오전 9:42 · 솔티드 버터 크루아상' },
    ]},
    { date: '11.12 수', items: [
      { bakery: '먼슬리 페이스트리', action: '저장', tone: 'ph-butter', detail: '에디터 픽에서' },
      { bakery: '코른블루멘', action: '저장', tone: 'ph-stone', detail: '취향 탐험에서' },
    ]},
    { date: '11.09 일', items: [
      { bakery: '슬로우브레드', action: '리뷰 작성', tone: 'ph-toast', detail: '"오후 3시쯤 가니까 손님이..."' },
    ]},
    { date: '11.06 목', items: [
      { bakery: '베이크하우스 청담', action: '다녀옴', tone: 'ph-cream', detail: '오후 1:18 · 소금빵 2개' },
    ]},
  ];

  return (
    <div style={{ padding: '20px 20px 16px' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 18,
      }}>
        <h3 style={{
          margin: 0, fontFamily: 'var(--font-display)',
          fontSize: 19, fontWeight: 700, letterSpacing: '-0.016em',
          color: 'var(--color-text-strong)',
        }}>이번 달 탐험</h3>
        <button style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          fontSize: 12.5, fontWeight: 700, color: 'var(--color-primary-normal)',
          display: 'inline-flex', alignItems: 'center', gap: 2,
          fontFamily: 'inherit',
        }}>
          11월 <Icon.chevD/>
        </button>
      </div>

      {days.map((d, i) => (
        <div key={d.date} style={{
          display: 'flex', gap: 14, marginBottom: 22,
        }}>
          {/* Timeline rail */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            width: 50, flexShrink: 0,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              color: 'var(--color-text-alternative)', letterSpacing: 0.4,
              textAlign: 'center', lineHeight: '14px',
            }}>{d.date}</div>
            <div style={{
              marginTop: 8, width: 10, height: 10, borderRadius: 99,
              background: 'var(--color-primary-normal)',
              border: '2px solid #fff',
              boxShadow: '0 0 0 1.5px var(--color-primary-normal)',
            }}/>
            {i < days.length - 1 && <div style={{
              width: 1.5, flex: 1, marginTop: 4,
              background: 'var(--color-line-alternative)', minHeight: 60,
            }}/>}
          </div>

          {/* Content */}
          <div style={{ flex: 1, paddingTop: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {d.items.map((it, j) => (
              <div key={j} style={{
                padding: 14, borderRadius: 16,
                background: 'var(--color-background-alternative)',
                display: 'flex', gap: 12, alignItems: 'center',
              }}>
                <Placeholder tone={it.tone} style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)',
                      letterSpacing: '-0.012em',
                    }}>{it.bakery}</span>
                    <span style={{
                      fontSize: 10.5, fontWeight: 700,
                      padding: '2px 7px', borderRadius: 99,
                      color: it.action === '다녀옴' ? '#0E7C3A' :
                             it.action === '저장'   ? 'var(--color-text-brand)' : '#9C5800',
                      background: it.action === '다녀옴' ? 'rgba(0,191,64,0.10)' :
                                  it.action === '저장'   ? 'var(--color-primary-light)' :
                                  'rgba(255,146,0,0.10)',
                    }}>{it.action}</span>
                  </div>
                  <div style={{
                    marginTop: 4, fontSize: 12, color: 'var(--color-text-alternative)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{it.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─ Tab: My Reviews ────────────────────────────────────────────────────────
function TabMyReviews() {
  const reviews = [
    {
      bakery: '슬로우브레드', region: '연남',
      mood: ['조용한', '오후'], visits: '재방문',
      time: '1주 전',
      text: '오후 3시쯤 가니까 손님이 거의 없어서 좋았습니다. 캄파뉴 사 왔는데 다음 날까지 촉촉해요.',
      images: ['ph-toast', 'ph-cream'],
    },
    {
      bakery: '먼슬리 페이스트리', region: '성수',
      mood: ['시즈널'], visits: '첫방문',
      time: '3주 전',
      text: '이번 달은 살구 페이스트리. 살구 다 떨어지면 못 먹어요. 11시 전에 추천.',
      images: ['ph-amber'],
    },
  ];
  return (
    <div style={{ padding: '20px 20px 8px' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <h3 style={{
          margin: 0, fontFamily: 'var(--font-display)',
          fontSize: 19, fontWeight: 700, letterSpacing: '-0.016em',
          color: 'var(--color-text-strong)',
        }}>내 리뷰 7</h3>
        <button style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          fontSize: 12.5, fontWeight: 700, color: 'var(--color-primary-normal)',
          fontFamily: 'inherit',
        }}>최신순 ▾</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {reviews.map((r, i) => (
          <article key={i} style={{
            paddingBottom: 16,
            borderBottom: i < reviews.length - 1 ? '1px solid var(--color-line-alternative)' : 'none',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
            }}>
              <span style={{
                fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)',
                letterSpacing: '-0.012em',
              }}>{r.bakery}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-alternative)' }}>
                · {r.region} · {r.time}
              </span>
              <span style={{ marginLeft: 'auto', color: 'var(--color-text-alternative)' }}>
                <Icon.chevR/>
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {r.mood.map(m => (
                <span key={m} style={{
                  padding: '3px 9px', borderRadius: 99,
                  background: 'rgba(0,189,222,0.10)',
                  color: '#0098B2',
                  fontSize: 11, fontWeight: 700,
                }}>#{m}</span>
              ))}
            </div>
            {r.images && (
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                {r.images.map((tone, i) => (
                  <Placeholder key={i} tone={tone} style={{
                    width: 88, height: 88, borderRadius: 12, overflow: 'hidden',
                  }}/>
                ))}
              </div>
            )}
            <p style={{
              margin: 0, fontSize: 14, lineHeight: '22px',
              color: 'var(--color-text-normal)', textWrap: 'pretty',
            }}>{r.text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

window.ScreenProfile = ScreenProfile;
