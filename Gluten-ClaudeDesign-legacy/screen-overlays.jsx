// screen-overlays.jsx — Save Folder Sheet, Notifications, Settings, Taste Report,
// Post Write, Review Write, Location Permission, Collection Detail
const { useState: useStateOv, useEffect: useEffectOv } = React;

// ═══════════════════════════════════════════════════════════════════════════
// SAVE FOLDER SHEET — bottom sheet, slides up when pendingSave is set
// ═══════════════════════════════════════════════════════════════════════════
function SaveFolderSheet() {
  const { pendingSave, setPendingSave, confirmSave } = useSave();
  const [creating, setCreating] = useStateOv(false);
  const [newName, setNewName] = useStateOv('');
  const [localCollections, setLocalCollections] = useStateOv(COLLECTIONS);

  useEffectOv(() => {
    if (!pendingSave) {
      setCreating(false);
      setNewName('');
    }
  }, [pendingSave]);

  if (!pendingSave) return null;
  const bakery = BAKERY_BY_ID[pendingSave];
  const close = () => setPendingSave(null);

  const onPickFolder = (folderId) => {
    confirmSave(pendingSave, folderId);
  };
  const onCreate = () => {
    if (!newName.trim()) return;
    const id = 'cnew_' + Date.now();
    setLocalCollections(prev => [
      ...prev,
      { id, name: newName.trim(), count: 0, ph: 'ph-sage', accent: '#97A578' },
    ]);
    confirmSave(pendingSave, id);
  };

  return (
    <>
      {/* backdrop */}
      <div onClick={close} style={{
        position: 'absolute', inset: 0, zIndex: 200,
        background: 'rgba(20,15,8,0.4)',
        animation: 'fadeBg 250ms ease',
      }}/>
      <style>{`
        @keyframes fadeBg { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 210,
        background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        animation: 'slideUp 320ms cubic-bezier(0.2,0,0,1)',
        maxHeight: '78%',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 32px rgba(20,15,8,0.18)',
      }}>
        <div className="sheet-handle" style={{ marginTop: 10 }}/>

        {/* Header — bakery context */}
        <div style={{
          padding: '12px 22px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: '1px solid var(--color-line-alternative)',
        }}>
          <Placeholder tone={bakery.ph} style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0E7C3A', marginBottom: 2 }}>
              내 탐험에 저장
            </div>
            <div style={{
              fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)',
              letterSpacing: '-0.012em',
            }}>{bakery.name}</div>
          </div>
          <button onClick={close} style={{
            width: 32, height: 32, borderRadius: 99, border: 'none', cursor: 'pointer',
            background: 'var(--color-fill-normal)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-normal)',
          }}>
            <Icon.close/>
          </button>
        </div>

        {/* Body */}
        <div className="scroll" style={{
          flex: 1, overflowY: 'auto', padding: '12px 16px 8px',
        }}>
          {!creating ? (
            <>
              <div style={{
                padding: '8px 6px',
                fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)',
                letterSpacing: '-0.005em',
              }}>컬렉션 선택</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {localCollections.map(c => (
                  <button key={c.id} onClick={() => onPickFolder(c.id)} className="lift" style={{
                    padding: '12px 12px', border: 'none', background: 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                    borderRadius: 12, fontFamily: 'inherit', textAlign: 'left',
                  }}>
                    <Placeholder tone={c.ph} style={{
                      width: 44, height: 44, borderRadius: 11, flexShrink: 0,
                    }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 15, fontWeight: 700, color: 'var(--color-text-strong)',
                        letterSpacing: '-0.012em',
                      }}>{c.name}</div>
                      <div style={{
                        marginTop: 2, fontSize: 12, color: 'var(--color-text-alternative)',
                      }}>{c.count}곳 저장됨</div>
                    </div>
                    <Icon.chevR/>
                  </button>
                ))}
              </div>
              <button onClick={() => setCreating(true)} className="lift" style={{
                marginTop: 8, width: '100%', padding: '14px',
                border: '1.5px dashed var(--color-line-strong)',
                borderRadius: 14, background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 14, fontWeight: 700, color: 'var(--color-text-normal)',
                fontFamily: 'inherit',
              }}>
                <Icon.plus/>
                새 컬렉션 만들기
              </button>
            </>
          ) : (
            <div style={{ padding: 8 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)',
                marginBottom: 8,
              }}>새 컬렉션 이름</div>
              <input
                autoFocus value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="예: 주말 빵 산책"
                style={{
                  width: '100%', height: 52, padding: '0 16px', borderRadius: 14,
                  border: '1px solid var(--color-line-normal)', background: '#fff',
                  fontSize: 15, fontWeight: 500, fontFamily: 'inherit', outline: 'none',
                  color: 'var(--color-text-strong)',
                  marginBottom: 12,
                }}/>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setCreating(false)} style={{
                  flex: 1, height: 50, borderRadius: 14, border: '1px solid var(--color-line-normal)',
                  background: '#fff', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700, color: 'var(--color-text-normal)',
                  fontFamily: 'inherit',
                }}>취소</button>
                <button onClick={onCreate} disabled={!newName.trim()} style={{
                  flex: 2, height: 50, borderRadius: 14, border: 'none',
                  background: newName.trim() ? 'var(--color-text-strong)' : 'var(--color-interaction-disable)',
                  color: newName.trim() ? '#fff' : 'var(--color-text-alternative)',
                  cursor: newName.trim() ? 'pointer' : 'default',
                  fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                }}>만들고 저장</button>
              </div>
            </div>
          )}

          <div style={{ height: 8 }}/>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// OVERLAY SHELL — sliding modal with back chevron + title
// ═══════════════════════════════════════════════════════════════════════════
function OverlayShell({ title, onClose, children, action, zIndex = 130 }) {
  return (
    <div className="fade-enter" style={{
      position: 'absolute', inset: 0, zIndex,
      background: 'var(--color-background-normal)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        minHeight: 56, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#fff',
        borderBottom: '1px solid var(--color-line-alternative)',
      }}>
        <IconButton
          icon={<Icon.chevL/>}
          onClick={onClose}
          variant="normal"
          size="medium"
          style={{
            borderRadius: 10, background: '#fff',
            border: '1px solid var(--color-border-subtle)',
            color: 'var(--color-text-normal)', flexShrink: 0,
          }}
        />
        <h1 style={{
          margin: 0, flex: 1,
          fontFamily: 'var(--font-display)',
          fontSize: 17, fontWeight: 700, letterSpacing: '-0.014em',
          color: 'var(--color-text-strong)',
        }}>{title}</h1>
        {action}
      </div>
      <div className="scroll" style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════
function ScreenNotifications({ onClose, openDetail }) {
  const items = [
    { kind: 'soldOut', bakeryId: 'b1', text: '내일 매진 임박', sub: '솔티드 버터 크루아상은 보통 11시 전 매진돼요', time: '방금', tone: 'ph-butter' },
    { kind: 'review',  bakeryId: 'b5', text: '새 리뷰가 등록됐어요', sub: '도윤님이 코른블루멘에 리뷰를 남겼어요', time: '2시간 전', tone: 'ph-stone' },
    { kind: 'community', bakeryId: 'b3', text: '소금빵 마니아 새 게시물', sub: '지수님이 새 베이커리를 공유했어요', time: '5시간 전', tone: 'ph-rose' },
    { kind: 'taste', bakeryId: 'b7', text: '취향에 맞는 곳을 찾았어요', sub: '노티드 베이커리 · 적합도 90%', time: '어제', tone: 'ph-sage' },
    { kind: 'taste', bakeryId: 'b4', text: '저장한 곳과 비슷한', sub: '베이크하우스 청담을 둘러보세요', time: '2일 전', tone: 'ph-cream' },
  ];
  const iconFor = (kind) => {
    if (kind === 'soldOut') return { c: '#FF7B2E', i: '⏰' };
    if (kind === 'review')  return { c: 'var(--color-text-brand)', i: '💬' };
    if (kind === 'community') return { c: '#6B5BD9', i: '🥐' };
    return { c: '#00BF40', i: '✨' };
  };
  return (
    <OverlayShell title="알림" onClose={onClose}>
      <div>
        {items.map((it, i) => {
          const ic = iconFor(it.kind);
          return (
            <div key={i} onClick={() => { onClose(); setTimeout(() => openDetail(it.bakeryId), 100); }}
              className="lift" style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--color-line-alternative)',
              display: 'flex', gap: 12, cursor: 'pointer', alignItems: 'center',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 99, flexShrink: 0,
                background: `${ic.c}1A`, fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{ic.i}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)',
                  letterSpacing: '-0.008em',
                }}>{it.text}</div>
                <div style={{
                  marginTop: 2, fontSize: 12.5, lineHeight: '18px',
                  color: 'var(--color-text-alternative)',
                  overflow: 'hidden', textOverflow: 'ellipsis',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }}>{it.sub}</div>
              </div>
              <Placeholder tone={it.tone} style={{
                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              }}/>
              <div style={{
                position: 'absolute', /* time pin — replaced below */
              }}/>
            </div>
          );
        })}
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-alternative)', fontSize: 13 }}>
          더 이상 알림이 없어요
        </div>
      </div>
    </OverlayShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
function ScreenSettings({ onClose, onLogout, openOverlay }) {
  const [push, setPush] = useStateOv(true);
  const [marketing, setMarketing] = useStateOv(false);
  const [dark, setDark] = useStateOv(document.documentElement.getAttribute('data-theme') === 'dark');

  useEffectOv(() => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [dark]);

  const Section = ({ title, children }) => (
    <div style={{
      marginTop: 22, padding: '0 20px',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        color: 'var(--color-text-alternative)', marginBottom: 10, paddingLeft: 2,
      }}>{title}</div>
      <div style={{
        borderRadius: 16, background: 'var(--color-background-alternative)',
        overflow: 'hidden',
      }}>{children}</div>
    </div>
  );

  return (
    <OverlayShell title="설정" onClose={onClose}>
      <Section title="계정">
        <Row label="이메일" value="hello@gluten.kr"/>
        <Row label="비밀번호 변경" chev onClick={() => {}}/>
        <Row label="취향 다시 설정하기" chev onClick={() => openOverlay && openOverlay('tasteQuiz')}/>
      </Section>
      <Section title="알림">
        <Row label="푸시 알림" toggle value={push} onToggle={() => setPush(!push)}/>
        <Row label="새 리뷰·매진 알림" toggle value={push} onToggle={() => setPush(!push)}/>
        <Row label="마케팅 정보 수신" toggle value={marketing} onToggle={() => setMarketing(!marketing)}/>
      </Section>
      <Section title="표시">
        <Row label="다크 모드" toggle value={dark} onToggle={() => setDark(!dark)}/>
        <Row label="언어" value="한국어"/>
      </Section>
      <Section title="정보">
        <Row label="이용약관" chev/>
        <Row label="개인정보 처리방침" chev/>
        <Row label="버전" value="1.0.2"/>
      </Section>
      <div style={{ padding: '32px 20px 24px' }}>
        <button onClick={onLogout} style={{
          width: '100%', padding: '14px', borderRadius: 14, border: '1px solid var(--color-line-normal)',
          background: '#fff', color: '#E52222',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>로그아웃</button>
        <button style={{
          width: '100%', marginTop: 8, padding: 12, border: 'none', background: 'transparent',
          color: 'var(--color-text-alternative)', fontSize: 12, cursor: 'pointer',
          fontFamily: 'inherit',
        }}>계정 탈퇴</button>
      </div>
    </OverlayShell>
  );
}
function Row({ label, value, chev, toggle, onToggle, onClick }) {
  const isClickable = !!onClick;
  return (
    <div
      onClick={onClick}
      className={isClickable ? 'lift' : ''}
      style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--color-line-alternative)',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: isClickable ? 'pointer' : 'default',
      }}
    >
      <span style={{
        flex: 1, fontSize: 14.5, fontWeight: 500,
        color: 'var(--color-text-strong)', letterSpacing: '-0.008em',
      }}>{label}</span>
      {value && !toggle && <span style={{
        fontSize: 13, color: 'var(--color-text-alternative)', fontWeight: 500,
      }}>{value}</span>}
      {chev && <span style={{ color: 'var(--color-text-alternative)' }}><Icon.chevR/></span>}
      {toggle && (
        <Switch checked={value} onChange={onToggle} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TASTE REPORT
// ═══════════════════════════════════════════════════════════════════════════
function ScreenTasteReport({ onClose, openDetail, openOverlay }) {
  const [toast, setToast] = useStateOv(false);
  const [activeIndex, setActiveIndex] = useStateOv(0);

  const stats = [
    { mood: 'savory', label: '묵직한 호밀', pct: 38, trend: '+12' },
    { mood: 'sweet',  label: '햇살 좋은',   pct: 28, trend: '+4' },
    { mood: 'healthy',label: '조용한 미니멀', pct: 22, trend: '0' },
    { mood: 'specialty', label: '모던/시즈널', pct: 12, trend: '-2' },
  ];

  const axes = [
    { name: '담백함', val: 95, color: '#7A2E2E', desc: '🌾 담백함 (95%): 호밀빵, 사워도우, 바게트 등 발효향이 진하고 단맛이 적은 식사빵을 선호합니다.' },
    { name: '달콤함', val: 35, color: '#FF602E', desc: '🍰 달콤함 (35%): 무거운 크림이나 과일 타르트보다는 담백함이 가미된 디저트를 선호합니다.' },
    { name: '든든함', val: 75, color: '#D9A11A', desc: '🥪 든든함 (75%): 식사 대용으로 먹기 좋은 샌드위치나 크로크무슈, 포카치아를 선호합니다.' },
    { name: '모던함', val: 60, color: '#6B5BD9', desc: '🏛️ 모던함 (60%): 트렌디한 신상 매장이나 세련된 인테리어의 베이커리도 가끔 방문합니다.' },
    { name: '아늑함', val: 85, color: '#6B8F2E', desc: '🪵 아늑함 (85%): 대화 소리가 잔잔하고 가만히 앉아 작업하기 좋은 우드톤 공간을 아낍니다.' },
  ];

  const getPoint = (cx, cy, r, angleDegrees) => {
    const angleRadians = (angleDegrees - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(angleRadians),
      y: cy + r * Math.sin(angleRadians)
    };
  };

  return (
    <OverlayShell title="취향 리포트" onClose={onClose}>
      {/* Curator ID Card */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{
          padding: 22, borderRadius: 24,
          background: 'linear-gradient(160deg, #2D271E 0%, #1A150E 100%)',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 12px 28px rgba(26,21,14,0.15)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Hologram-like circle glow */}
          <div style={{
            position: 'absolute', right: -30, top: -30, width: 150, height: 150,
            borderRadius: 99,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,191,0,0.18), transparent 70%)',
            filter: 'blur(15px)',
          }}/>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#FFE600', fontSize: 10, fontWeight: 800,
                padding: '3px 8px', borderRadius: 99,
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>Curator Identity</span>
              <h2 style={{
                margin: '10px 0 4px', fontSize: 22, fontWeight: 800,
                color: '#fff', fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
              }}>우디-사워도우 러버</h2>
              <div style={{
                fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500,
              }}>Woody Sourdough Lover</div>
            </div>
            
            {/* Avatar representation inside card */}
            <div style={{
              width: 44, height: 44, borderRadius: 99, 
              background: 'linear-gradient(135deg, #FF602E 0%, #7A2E2E 100%)',
              border: '2px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: '#fff',
            }}>K</div>
          </div>

          <div style={{
            margin: '18px 0', height: 1, background: 'rgba(255,255,255,0.08)',
          }}/>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
              <div>분석 기간 : 5월 1일 ~ 5월 28일</div>
              <div style={{ marginTop: 2 }}>취향 적합도 : 상위 2%</div>
            </div>
            <button 
              onClick={() => {
                setToast(true);
                setTimeout(() => setToast(false), 2000);
              }}
              className="lift" 
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: 'none', borderRadius: 12, padding: '8px 14px',
                color: '#fff', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                backdropFilter: 'blur(5px)',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
              카드 저장
            </button>
          </div>
        </div>
      </div>

      {/* Quiz entry button */}
      <div style={{ padding: '12px 20px 0' }}>
        <button 
          onClick={() => openOverlay && openOverlay('tasteQuiz')}
          className="lift"
          style={{
            width: '100%', padding: '14px', borderRadius: 16,
            background: 'rgba(254, 81, 2, 0.08)',
            border: '1px dashed var(--color-primary-normal)',
            color: 'var(--color-primary-normal)',
            fontSize: 13.5, fontWeight: 800, cursor: 'pointer',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 6,
          }}
        >
          <span>✨</span> 내 취향 재분석 퀴즈 풀기 <span>➡️</span>
        </button>
      </div>

      {/* Interactive Radar Chart */}
      <div style={{ padding: '28px 20px 8px' }}>
        <h3 style={{
          margin: '0 0 4px', fontFamily: 'var(--font-display)',
          fontSize: 18, fontWeight: 700, letterSpacing: '-0.014em',
          color: 'var(--color-text-strong)',
        }}>5차원 취향 분석</h3>
        <p style={{
          margin: '0 0 16px', fontSize: 12, color: 'var(--color-text-alternative)',
          fontWeight: 500,
        }}>각 능력치 또는 라벨을 탭하여 취향 분석 세부정보를 확인하세요.</p>
        
        <div style={{
          display: 'flex', justifyContent: 'center', background: 'var(--color-background-alternative)',
          padding: '20px 0', borderRadius: 20, border: '1px solid var(--color-line-alternative)',
        }}>
          <svg width="320" height="280">
            {/* Pentagon Grid lines */}
            {[20, 40, 60, 80, 100].map(level => {
              const pts = axes.map((_, idx) => {
                const p = getPoint(160, 140, level, idx * 72);
                return `${p.x},${p.y}`;
              }).join(' ');
              return (
                <polygon 
                  key={level} 
                  points={pts} 
                  fill="none" 
                  stroke="var(--color-line-alternative)" 
                  strokeWidth="1.2"
                />
              );
            })}

            {/* Axis Lines */}
            {axes.map((_, idx) => {
              const p = getPoint(160, 140, 100, idx * 72);
              return (
                <line 
                  key={idx} 
                  x1="160" y1="140" 
                  x2={p.x} y2={p.y} 
                  stroke="var(--color-line-alternative)"
                  strokeWidth="1.2"
                />
              );
            })}

            {/* Filled data polygon */}
            <polygon 
              points={axes.map((axis, idx) => {
                const p = getPoint(160, 140, axis.val, idx * 72);
                return `${p.x},${p.y}`;
              }).join(' ')} 
              fill="rgba(254, 81, 2, 0.16)" 
              stroke="var(--color-primary-normal)" 
              strokeWidth="2.5"
            />

            {/* Clickable vertices & handles */}
            {axes.map((axis, idx) => {
              const pVal = getPoint(160, 140, axis.val, idx * 72);
              const pLabel = getPoint(160, 140, 122, idx * 72);
              const active = activeIndex === idx;

              // Dynamic offsets and text anchors to prevent vertex/line overlaps
              let textAnchor = 'middle';
              let offsetX = 0;
              let offsetY = 0;
              if (idx === 0) {
                textAnchor = 'middle';
                offsetY = -8;
              } else if (idx === 1) {
                textAnchor = 'start';
                offsetX = 6;
                offsetY = -2;
              } else if (idx === 2) {
                textAnchor = 'start';
                offsetX = 6;
                offsetY = 4;
              } else if (idx === 3) {
                textAnchor = 'end';
                offsetX = -6;
                offsetY = 4;
              } else if (idx === 4) {
                textAnchor = 'end';
                offsetX = -6;
                offsetY = -2;
              }

              return (
                <g key={idx}>
                  {/* Outer Label text */}
                  <text 
                    x={pLabel.x + offsetX} 
                    y={pLabel.y + offsetY} 
                    textAnchor={textAnchor} 
                    dominantBaseline="middle" 
                    style={{ 
                      fontSize: 12, 
                      fontWeight: 800, 
                      fill: active ? 'var(--color-primary-normal)' : 'var(--color-text-strong)',
                      transition: 'fill 200ms',
                    }} 
                    onClick={() => setActiveIndex(idx)} 
                    cursor="pointer"
                  >
                    {axis.name}
                  </text>
                  {/* Point circle */}
                  <circle 
                    cx={pVal.x} 
                    cy={pVal.y} 
                    r={active ? 7 : 4.5} 
                    fill={active ? 'var(--color-primary-normal)' : axis.color} 
                    stroke="#fff" 
                    strokeWidth="2" 
                    style={{ transition: 'all 200ms' }}
                    onClick={() => setActiveIndex(idx)}
                    cursor="pointer"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Axis Description Box */}
        <div style={{
          marginTop: 14, padding: 16, borderRadius: 16,
          background: 'var(--color-background-alternative)',
          borderLeft: `4px solid ${axes[activeIndex].color}`,
          transition: 'all 200ms',
        }}>
          <div style={{
            fontSize: 13, lineHeight: '19px', fontWeight: 600,
            color: 'var(--color-text-strong)',
          }}>
            {axes[activeIndex].desc}
          </div>
        </div>
      </div>

      {/* Mood breakdown */}
      <div style={{ padding: '20px 20px 8px' }}>
        <h3 style={{
          margin: '0 0 14px', fontFamily: 'var(--font-display)',
          fontSize: 18, fontWeight: 700, letterSpacing: '-0.014em',
          color: 'var(--color-text-strong)',
        }}>분위기 분포</h3>
        {stats.map(s => (
          <div key={s.label} style={{ marginBottom: 14 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: 6,
            }}>
              <span style={{
                fontSize: 13.5, fontWeight: 600,
                color: 'var(--color-text-strong)',
              }}>{s.label}</span>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 15,
                  fontWeight: 700, color: 'var(--color-text-strong)',
                  letterSpacing: '-0.01em',
                }}>{s.pct}%</span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: s.trend.startsWith('+') ? '#0E7C3A' :
                         s.trend.startsWith('-') ? '#E52222' :
                         'var(--color-text-alternative)',
                }}>{s.trend}</span>
              </span>
            </div>
            <div style={{
              height: 10, borderRadius: 99,
              background: 'var(--color-fill-normal)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${s.pct}%`,
                background: MOOD_COLORS[s.mood],
                transition: 'width 600ms',
              }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Regions */}
      <div style={{ padding: '20px 20px 8px' }}>
        <h3 style={{
          margin: '0 0 14px', fontFamily: 'var(--font-display)',
          fontSize: 18, fontWeight: 700, letterSpacing: '-0.014em',
          color: 'var(--color-text-strong)',
        }}>자주 가는 동네</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[['성수', 14], ['연남', 8], ['망원', 5], ['한남', 3], ['안국', 2]].map(([r, n]) => (
            <span key={r} style={{
              padding: '8px 14px', borderRadius: 99,
              background: 'var(--color-background-alternative)',
              fontSize: 13, fontWeight: 600, color: 'var(--color-text-strong)',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 99,
                background: 'var(--color-text-strong)', color: '#fff',
                fontSize: 10, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{n}</span>
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <SectionHead overline="AI 큐레이션 추천" title="기현님을 위한 맞춤 베이커리"/>
      <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { ...BAKERIES[0], match: 98, reason: '선호 분위기인 "우드톤" 해시태그 일치율이 96%로 가장 높아요.' },
          { ...BAKERIES[1], match: 94, reason: '즐겨찾는 빵 "사워도우"를 전문으로 다루며 오후 시간에 혼잡도가 낮아요.' },
          { ...BAKERIES[2], match: 91, reason: '저장하신 "슬로우브레드"와 맛 특징(버터풍미, 천연발효)이 88% 유사합니다.' },
          { ...BAKERIES[3], match: 89, reason: '지역 취향인 "성수동" 트렌드 피드에서 큐레이터 반응이 가장 좋은 곳이에요.' },
        ].map(b => (
          <div 
            key={b.id} 
            className="lift" 
            onClick={() => { onClose(); setTimeout(() => openDetail(b.id), 100); }} 
            style={{
              padding: 16, borderRadius: 20,
              border: '1px solid var(--color-line-alternative)',
              background: '#fff',
              display: 'flex', gap: 14, cursor: 'pointer', alignItems: 'center',
            }}
          >
            <Placeholder tone={b.ph} style={{
              width: 72, height: 72, borderRadius: 16, flexShrink: 0,
            }}/>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{
                  fontSize: 14.5, fontWeight: 700, color: 'var(--color-text-strong)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{b.name}</span>
                
                <span style={{
                  background: 'rgba(254, 81, 2, 0.08)',
                  color: 'var(--color-primary-normal)',
                  padding: '2px 8px', borderRadius: 99,
                  fontSize: 10.5, fontWeight: 800,
                  flexShrink: 0, marginLeft: 'auto',
                }}>{b.match}% 매치</span>
              </div>

              <div style={{
                marginTop: 2, fontSize: 11, color: 'var(--color-text-alternative)',
                display: 'flex', gap: 6,
              }}>
                <span>{b.region}</span>
                <span>·</span>
                <span>{b.kind === 'cafe' ? '카페' : '베이커리'}</span>
              </div>
              
              <div style={{
                marginTop: 6, fontSize: 11.5, color: 'var(--color-text-normal)',
                lineHeight: '16px', fontWeight: 500,
                background: 'var(--color-background-alternative)',
                padding: '6px 10px', borderRadius: 8,
              }}>
                💡 {b.reason}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div style={{
          position: 'absolute', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          zIndex: 300, background: 'rgba(28,28,32,0.92)',
          backdropFilter: 'blur(8px)',
          color: '#fff', padding: '12px 20px', borderRadius: 16,
          fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          animation: 'fadeIn 250ms var(--easing-emphasized)',
        }}>
          <span>💾</span>
          <span>취향 카드가 갤러리에 저장되었습니다!</span>
        </div>
      )}
    </OverlayShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// POST WRITE
// ═══════════════════════════════════════════════════════════════════════════
function ScreenPostWrite({ onClose }) {
  const [text, setText] = useStateOv('');
  const [bakery, setBakery] = useStateOv(null);
  const [photos, setPhotos] = useStateOv(['ph-wheat']);
  const [picker, setPicker] = useStateOv(false);

  return (
    <OverlayShell title="새 탐험 공유" onClose={onClose}
      action={
        <Button
          label="게시"
          onClick={onClose}
          disabled={!text.trim() || !bakery}
          variant="solid"
          color="primary"
          size="small"
        />
      }
    >
      {/* Bakery picker */}
      <div style={{ padding: '20px 20px 8px' }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)',
          marginBottom: 8,
        }}>어느 베이커리에 다녀왔나요?</div>
        {bakery ? (
          <div onClick={() => setPicker(true)} className="lift" style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: 12,
            border: '1px solid var(--color-line-normal)', borderRadius: 14,
            cursor: 'pointer', background: '#fff',
          }}>
            <Placeholder tone={bakery.ph} style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)' }}>
                {bakery.name}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--color-text-alternative)', marginTop: 2 }}>
                {bakery.region}
              </div>
            </div>
            <Icon.chevR/>
          </div>
        ) : (
          <button onClick={() => setPicker(true)} className="lift" style={{
            width: '100%', padding: '14px 16px',
            border: '1.5px dashed var(--color-line-strong)',
            borderRadius: 14, background: 'transparent', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontSize: 14, fontWeight: 700, color: 'var(--color-text-normal)',
            fontFamily: 'inherit',
          }}>
            <Icon.plus/>
            베이커리 선택
          </button>
        )}
      </div>

      {/* picker inline */}
      {picker && (
        <div style={{ padding: '0 20px 16px' }}>
          <div className="scroll" style={{
            display: 'flex', gap: 8, overflowX: 'auto', padding: '8px 0',
          }}>
            {BAKERIES.map(b => (
              <button key={b.id} onClick={() => { setBakery(b); setPicker(false); }} className="lift" style={{
                flexShrink: 0, border: 'none', background: 'transparent', cursor: 'pointer',
                padding: 0, width: 90, fontFamily: 'inherit', textAlign: 'left',
              }}>
                <Placeholder tone={b.ph} style={{
                  width: 90, height: 90, borderRadius: 12, overflow: 'hidden',
                }}/>
                <div style={{
                  marginTop: 6, fontSize: 12, fontWeight: 600,
                  color: 'var(--color-text-strong)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{b.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Photo grid */}
      <div style={{ padding: '12px 20px 8px' }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)',
          marginBottom: 8,
        }}>사진 {photos.length}/9</div>
        <div className="scroll" style={{
          display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
        }}>
          <button onClick={() => {
            const tones = ['ph-toast', 'ph-cream', 'ph-stone', 'ph-amber', 'ph-rose'];
            setPhotos([...photos, tones[photos.length % tones.length]]);
          }} className="lift" style={{
            width: 84, height: 84, borderRadius: 14, flexShrink: 0,
            border: '1.5px dashed var(--color-line-strong)',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-normal)', gap: 2, fontFamily: 'inherit',
            fontSize: 10, fontWeight: 600,
          }}>
            <Icon.plus/>
            추가
          </button>
          {photos.map((p, i) => (
            <Placeholder key={i} tone={p} style={{
              width: 84, height: 84, borderRadius: 14, overflow: 'hidden', flexShrink: 0,
            }}/>
          ))}
        </div>
      </div>

      {/* Text */}
      <div style={{ padding: '12px 20px' }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)',
          marginBottom: 8,
        }}>탐험을 짧게 적어주세요</div>
        <Textarea
          value={text}
          onChange={setText}
          placeholder="어떤 분위기였나요? 어떤 빵이 좋았어요?"
          style={{ minHeight: 160 }}
        />
      </div>

      {/* Mood tag */}
      <div style={{ padding: '8px 20px 24px' }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)',
          marginBottom: 8,
        }}>분위기</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['#햇살좋은', '#조용한', '#우드톤', '#혼자좋은', '#오래머물기'].map(t => (
            <Chip
              key={t}
              label={t}
              active={false}
              onClick={() => {}}
              variant="outlined"
              size="small"
            />
          ))}
        </div>
      </div>
    </OverlayShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// REVIEW WRITE
// ═══════════════════════════════════════════════════════════════════════════
function ScreenReviewWrite({ bakeryId, onClose }) {
  const b = BAKERY_BY_ID[bakeryId];
  const [rating, setRating] = useStateOv(0);
  const [mood, setMood] = useStateOv(new Set());
  const [visit, setVisit] = useStateOv('first');
  const [text, setText] = useStateOv('');

  const toggleMood = (m) => {
    setMood(prev => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });
  };

  return (
    <OverlayShell title="리뷰 작성" onClose={onClose}
      action={
        <Button
          label="등록"
          onClick={onClose}
          disabled={!rating || !text.trim()}
          variant="solid"
          color="primary"
          size="small"
        />
      }
    >
      {/* Bakery context */}
      <div style={{
        padding: '20px 20px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--color-line-alternative)',
      }}>
        <Placeholder tone={b.ph} style={{
          width: 44, height: 44, borderRadius: 11, flexShrink: 0,
        }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)' }}>{b.name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--color-text-alternative)', marginTop: 2 }}>
            {b.region} · {b.address}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div style={{ padding: '24px 20px 12px', textAlign: 'center' }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)', marginBottom: 12,
        }}>이번 탐험은 어땠나요?</div>
        <div style={{ display: 'inline-flex', gap: 4 }}>
          {[1,2,3,4,5].map(i => (
            <button key={i} onClick={() => setRating(i)} className="lift" style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              padding: 6,
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24"
                fill={i <= rating ? '#00BF40' : 'none'}
                stroke={i <= rating ? '#00BF40' : 'var(--color-line-strong)'}
                strokeWidth="1.6" strokeLinejoin="round">
                <path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z"/>
              </svg>
            </button>
          ))}
        </div>
        {rating > 0 && (
          <div style={{
            marginTop: 8, fontSize: 13, fontWeight: 700,
            color: 'var(--color-text-strong)',
          }}>{['','별로였어요','보통이에요','좋았어요','정말 좋았어요','최고예요!'][rating]}</div>
        )}
      </div>

      {/* Visit context */}
      <div style={{ padding: '12px 20px' }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)', marginBottom: 8,
        }}>방문 컨텍스트</div>
        <div style={{ display: 'flex' }}>
          <SegmentedControl
            options={[{ value: 'first', label: '첫 방문' }, { value: 'revisit', label: '재방문' }]}
            selected={visit}
            onChange={setVisit}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Mood tags */}
      <div style={{ padding: '12px 20px' }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)', marginBottom: 8,
        }}>어떤 점이 좋았어요?</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['🧈 버터향', '☕ 오래 머물기', '🧘 혼자 좋아요', '☀️ 햇살', '🌿 신선해요', '🍞 발효향', '🧂 소금빵 최고', '📚 조용해요'].map(m => {
            const active = mood.has(m);
            return (
              <Chip
                key={m}
                label={m}
                active={active}
                onClick={() => toggleMood(m)}
                variant="outlined"
                size="medium"
              />
            );
          })}
        </div>
      </div>

      {/* Text */}
      <div style={{ padding: '12px 20px 24px' }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)', marginBottom: 8,
        }}>리뷰 내용</div>
        <Textarea
          value={text}
          onChange={setText}
          placeholder="다음 탐험가에게 도움이 될 한 마디를 남겨주세요."
          style={{ minHeight: 140 }}
        />
      </div>
    </OverlayShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOCATION PERMISSION (sheet style)
// ═══════════════════════════════════════════════════════════════════════════
function ScreenLocationPermission({ onAllow, onDeny }) {
  return (
    <div className="fade-enter" style={{
      position: 'absolute', inset: 0, zIndex: 160,
      background: 'rgba(20,15,8,0.4)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div style={{
        background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '32px 24px 32px',
        animation: 'slideUp 320ms cubic-bezier(0.2,0,0,1)',
      }}>
        <div style={{
          margin: '0 auto 18px',
          width: 64, height: 64, borderRadius: 99,
          background: 'var(--color-primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-primary-normal)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z"/>
            <circle cx="12" cy="10" r="2.5"/>
          </svg>
        </div>
        <h2 style={{
          margin: 0, textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 20, fontWeight: 700, letterSpacing: '-0.016em',
          color: 'var(--color-text-strong)',
        }}>위치 정보를 허용해주세요</h2>
        <p style={{
          margin: '8px auto 24px', textAlign: 'center', maxWidth: 280,
          fontSize: 13.5, lineHeight: '20px', color: 'var(--color-text-alternative)',
          textWrap: 'pretty',
        }}>
          내 주변의 베이커리, 지금 한가한 곳, 곧 매진될 곳을 찾으려면
          위치 권한이 필요해요.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            label="다음에"
            onClick={onDeny}
            variant="outlined"
            color="assistive"
            style={{ flex: 1 }}
          />
          <Button
            label="허용"
            onClick={onAllow}
            variant="solid"
            color="primary"
            style={{ flex: 2 }}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COLLECTION DETAIL
// ═══════════════════════════════════════════════════════════════════════════
function ScreenCollectionDetail({ collectionId, onClose, openDetail }) {
  const c = COLLECTIONS.find(c => c.id === collectionId) || COLLECTIONS[0];
  const items = BAKERIES.slice(0, c.count || 4);
  return (
    <OverlayShell title={c.name} onClose={onClose}>
      <div style={{ padding: '0 0 24px' }}>
        {/* Hero header */}
        <Placeholder tone={c.ph} style={{
          height: 200, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45) 100%)',
          }}/>
          <div style={{
            position: 'absolute', left: 20, bottom: 20, zIndex: 3, color: '#fff',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 26,
              fontWeight: 700, letterSpacing: '-0.02em',
              textShadow: '0 1px 12px rgba(0,0,0,0.3)',
            }}>{c.name}</div>
            <div style={{
              marginTop: 4, fontSize: 13, opacity: 0.92, fontWeight: 500,
            }}>{c.count}곳 · 업데이트 2일 전</div>
          </div>
        </Placeholder>

        {/* Action row */}
        <div style={{
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: '1px solid var(--color-line-alternative)',
        }}>
          <button style={{
            flex: 1, height: 44, borderRadius: 12, border: '1px solid var(--color-line-normal)',
            background: '#fff', cursor: 'pointer',
            fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)',
            fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Icon.share/> 공유
          </button>
          <button style={{
            flex: 1, height: 44, borderRadius: 12, border: '1px solid var(--color-line-normal)',
            background: '#fff', cursor: 'pointer',
            fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)',
            fontFamily: 'inherit',
          }}>편집</button>
        </div>

        <div style={{ padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
          {items.map((b, i) => (
            <div key={b.id} onClick={() => { onClose(); setTimeout(() => openDetail(b.id), 100); }}
              className="lift" style={{
              padding: '14px 20px', display: 'flex', gap: 14, cursor: 'pointer',
              alignItems: 'center',
              borderBottom: i < items.length - 1 ? '1px solid var(--color-line-alternative)' : 'none',
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
                  {b.region} · {b.signature}
                </div>
              </div>
              <SaveStar bakeryId={b.id}/>
            </div>
          ))}
        </div>
      </div>
    </OverlayShell>
  );
}

window.SaveFolderSheet = SaveFolderSheet;
window.ScreenNotifications = ScreenNotifications;
window.ScreenSettings = ScreenSettings;
window.ScreenTasteReport = ScreenTasteReport;
window.ScreenPostWrite = ScreenPostWrite;
window.ScreenReviewWrite = ScreenReviewWrite;
window.ScreenLocationPermission = ScreenLocationPermission;
window.ScreenCollectionDetail = ScreenCollectionDetail;

// ── User Profile (OV-14) ───────────────────────────────────────────────────
function ScreenUserProfile({ username, onClose, openDetail, openOverlay }) {
  const userPosts = SOCIAL_POSTS.filter(p => p.user === username);
  const user = userPosts[0] || { user: username, handle: `@${username}.bake`, avatarPh: 'ph-wheat', avatarChar: username ? username[0] : '유' };
  
  const [tab, setTab] = useStateOv('collection');
  const [following, setFollowing] = useStateOv(false);

  const collections = COLLECTIONS.slice(0, 2); 
  const activities = [
    { type: 'review', bakeryId: 'b1', title: '르 파베', text: '크루아상이 정말 맛있어요! 인생 빵집 등극. 🥐', rating: 5, time: '3일 전' },
    { type: 'save', bakeryId: 'b5', title: '코른블루멘', text: '매장 저장함', time: '5일 전' },
  ];

  return (
    <OverlayShell title="프로필" onClose={onClose}>
      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Glass radius={24} style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
          <Placeholder tone={user.avatarPh} style={{ width: 64, height: 64, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>{user.avatarChar}</span>
          </Placeholder>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-strong)' }}>{user.user}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-alternative)', marginTop: 2 }}>{user.handle}</div>
          </div>
          <button onClick={() => setFollowing(!following)} className="lift" style={{
            padding: '8px 16px', borderRadius: 99, border: 'none',
            background: following ? 'var(--color-background-alternative)' : 'var(--color-text-strong)',
            color: following ? 'var(--color-text-normal)' : '#fff',
            fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {following ? '팔로잉' : '팔로우'}
          </button>
        </Glass>

        <p style={{ margin: '0 4px', fontSize: 14, lineHeight: '20px', color: 'var(--color-text-normal)' }}>
          성수동 골목 구석구석, 소금빵 굽는 냄새를 따라 탐험하는 빵순이입니다. 🥐 맛있는 빵집 추천 환영해요!
        </p>

        <div style={{ padding: '16px 18px', borderRadius: 20, background: 'var(--color-background-alternative)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-alternative)', letterSpacing: '0.04em' }}>취향 시놉시스</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ padding: '4px 9px', borderRadius: 99, background: '#FFE9DE', color: '#FE5102', fontSize: 11.5, fontWeight: 700 }}>#소금빵</span>
            <span style={{ padding: '4px 9px', borderRadius: 99, background: '#FFE9DE', color: '#FE5102', fontSize: 11.5, fontWeight: 700 }}>#크루아상</span>
            <span style={{ padding: '4px 9px', borderRadius: 99, background: '#f0f0f0', color: 'var(--color-text-strong)', fontSize: 11.5, fontWeight: 700 }}>#햇살좋은</span>
            <span style={{ padding: '4px 9px', borderRadius: 99, background: '#f0f0f0', color: 'var(--color-text-strong)', fontSize: 11.5, fontWeight: 700 }}>#우드톤</span>
          </div>
        </div>

        <div style={{ borderBottom: '1px solid var(--color-line-alternative)', display: 'flex', gap: 16 }}>
          {[
            { id: 'collection', label: '공개 컬렉션' },
            { id: 'activity', label: '최근 활동' },
          ].map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                fontSize: 14.5, fontWeight: active ? 700 : 500,
                color: active ? 'var(--color-text-strong)' : 'var(--color-text-alternative)',
                padding: '8px 4px', position: 'relative', fontFamily: 'inherit',
              }}>
                {t.label}
                {active && (
                  <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--color-primary-normal)' }} />
                )}
              </button>
            );
          })}
        </div>

        {tab === 'collection' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {collections.map(c => (
              <div key={c.id} onClick={() => openOverlay && openOverlay('collection', c.id)} className="lift" style={{
                borderRadius: 20, background: '#fff', border: '1px solid var(--color-line-alternative)',
                padding: 16, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12,
                boxShadow: '0 4px 12px rgba(20,15,8,0.02)',
              }}>
                <Placeholder tone={c.ph} style={{ width: '100%', height: 96, borderRadius: 12 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)' }}>{c.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--color-text-alternative)', marginTop: 2 }}>빵집 {c.count}곳</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activities.map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--color-primary-normal)', marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span onClick={() => openDetail(act.bakeryId)} style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)', cursor: 'pointer', textDecoration: 'underline' }}>
                      {act.title}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-alternative)' }}>{act.time}</span>
                  </div>
                  {act.type === 'review' ? (
                    <div onClick={() => openOverlay && openOverlay('reviewDetail', { bakeryId: act.bakeryId, reviewIndex: 0 })} style={{
                      marginTop: 6, padding: 12, borderRadius: 12, background: 'var(--color-background-alternative)',
                      fontSize: 13, color: 'var(--color-text-normal)', cursor: 'pointer', lineHeight: '18px',
                    }}>
                      <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                        {Array.from({ length: act.rating }).map((_, s) => (
                          <svg key={s} width="10" height="10" viewBox="0 0 24 24" fill="#FE5102"><path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z"/></svg>
                        ))}
                      </div>
                      {act.text}
                    </div>
                  ) : (
                    <div style={{ marginTop: 4, fontSize: 13, color: 'var(--color-text-alternative)' }}>{act.text}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </OverlayShell>
  );
}

// ── Post Detail (OV-15) ────────────────────────────────────────────────────
function ScreenPostDetail({ postId, onClose, openDetail, openOverlay }) {
  const post = SOCIAL_POSTS.find(p => p.id === postId) || SOCIAL_POSTS[0];
  const bakery = BAKERY_BY_ID[post.bakeryId] || BAKERIES[0];
  
  const [comments, setComments] = useStateOv([
    { user: '민재', handle: '@minj.eats', avatarPh: 'ph-sage', avatarChar: '민', text: '여기 크루아상은 진짜 결이 예술이에요! 👍', time: '1시간 전' },
    { user: '서연', handle: '@seoyeon.s', avatarPh: 'ph-cream', avatarChar: '서', text: '오후에 가도 남아있는 편인가요?', time: '30분 전' },
  ]);
  const [newComment, setNewComment] = useStateOv('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [
      ...prev,
      {
        user: '나',
        handle: '@me.gluten',
        avatarPh: 'ph-butter',
        avatarChar: '나',
        text: newComment.trim(),
        time: '방금',
      }
    ]);
    setNewComment('');
  };

  return (
    <OverlayShell title="탐험 피드" onClose={onClose}>
      <div style={{ padding: '16px 20px 0' }}>
        <Glass radius={20} style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 4px 12px rgba(20,15,8,0.03)' }}>
          <Placeholder tone={bakery.ph} style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)' }}>{bakery.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--color-text-alternative)', marginTop: 2 }}>{bakery.region} · 대표메뉴: {bakery.signature}</div>
          </div>
          <button onClick={() => openDetail(bakery.id)} className="lift" style={{
            padding: '6px 12px', borderRadius: 8, border: '1px solid var(--color-line-normal)',
            background: '#fff', color: 'var(--color-text-strong)', fontSize: 11.5, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            이 빵집 보기
          </button>
        </Glass>
      </div>

      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Placeholder tone={post.avatarPh} onClick={() => openOverlay('userProfile', post.user)} style={{ width: 38, height: 38, borderRadius: 99, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{post.avatarChar}</span>
        </Placeholder>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => openOverlay('userProfile', post.user)}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)' }}>{post.user}</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-alternative)', marginTop: 1 }}>{post.time}</div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <div className="scroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {post.images.map((tone, idx) => (
            <Placeholder key={idx} tone={tone} style={{ width: 280, height: 280, borderRadius: 16, flexShrink: 0 }} />
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px 24px', borderBottom: '6px solid var(--color-background-alternative)' }}>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: '22px', color: 'var(--color-text-normal)' }}>{post.text}</p>
        {post.mood && (
          <div style={{ marginTop: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary-normal)' }}>#{post.mood.replace(/ /g,'')}</span>
          </div>
        )}
      </div>

      <div style={{ padding: '20px 20px 80px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)', marginBottom: 14 }}>댓글 {comments.length}개</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {comments.map((comm, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Placeholder tone={comm.avatarPh} style={{ width: 32, height: 32, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{comm.avatarChar}</span>
              </Placeholder>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)' }}>{comm.user}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--color-text-alternative)' }}>{comm.time}</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: '18px', color: 'var(--color-text-normal)' }}>{comm.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--color-line-alternative)',
        padding: '10px 16px 20px', display: 'flex', gap: 10, alignItems: 'center',
        zIndex: 140,
      }}>
        <input
          type="text"
          placeholder="칭찬 섞인 댓글을 남겨보세요..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 12,
            border: '1px solid var(--color-line-normal)', background: '#fff',
            fontSize: 13, fontFamily: 'inherit', outline: 'none',
          }}
        />
        <button onClick={handleAddComment} disabled={!newComment.trim()} className="lift" style={{
          padding: '10px 16px', borderRadius: 12, border: 'none',
          background: newComment.trim() ? 'var(--color-primary-normal)' : 'var(--color-fill-normal)',
          color: newComment.trim() ? '#fff' : 'var(--color-text-assistive)',
          fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          등록
        </button>
      </div>
    </OverlayShell>
  );
}

// ── Review Detail (OV-18) ──────────────────────────────────────────────────
function ScreenReviewDetail({ bakeryId, reviewIndex, onClose, openDetail }) {
  const b = BAKERY_BY_ID[bakeryId] || BAKERIES[0];
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

  const [currentIndex, setCurrentIndex] = useStateOv(reviewIndex || 0);
  const [helpfulClicked, setHelpfulClicked] = useStateOv(false);

  const r = reviews[currentIndex % reviews.length] || reviews[0];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % reviews.length);
    setHelpfulClicked(false);
  };
  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + reviews.length) % reviews.length);
    setHelpfulClicked(false);
  };

  return (
    <OverlayShell title="리뷰 상세" onClose={onClose}>
      <div style={{ padding: '20px 20px 80px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary-normal)' }}>{b.name}의 리뷰</span>
          <span style={{ fontSize: 12, color: 'var(--color-text-alternative)' }}>{currentIndex + 1} / {reviews.length}</span>
        </div>

        <Glass radius={24} style={{ padding: 20, boxShadow: '0 4px 16px rgba(20,15,8,0.04)', position: 'relative' }}>
          <button onClick={handlePrev} className="lift" style={{
            position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)',
            width: 32, height: 32, borderRadius: 99, border: '1px solid var(--color-line-normal)',
            background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)', zIndex: 10,
          }}>
            <Icon.chevL />
          </button>
          <button onClick={handleNext} className="lift" style={{
            position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)',
            width: 32, height: 32, borderRadius: 99, border: '1px solid var(--color-line-normal)',
            background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)', zIndex: 10,
          }}>
            <Icon.chevR />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Placeholder tone={r.avatarPh} style={{ width: 36, height: 36, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{r.avatarChar}</span>
            </Placeholder>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)' }}>{r.user}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-alternative)', marginTop: 2 }}>{r.visits} · {r.time}</div>
            </div>
            
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={getMoodColor(b.moodKey)}>
                  <path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z"/>
                </svg>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
            {r.mood.map(m => (
              <span key={m} style={{
                padding: '3px 8px', borderRadius: 99,
                background: 'rgba(254,81,2,0.1)', color: '#FE5102',
                fontSize: 11, fontWeight: 700,
              }}>#{m}</span>
            ))}
          </div>

          <p style={{ margin: '0 0 16px', fontSize: 14, lineHeight: '22px', color: 'var(--color-text-normal)' }}>{r.text}</p>

          {r.images && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {r.images.map((tone, j) => (
                <Placeholder key={j} tone={tone} style={{ width: '100%', height: 160, borderRadius: 12 }} />
              ))}
            </div>
          )}

          <button onClick={() => setHelpfulClicked(!helpfulClicked)} className="lift" style={{
            border: helpfulClicked ? '1.5px solid #00BF40' : '1px solid var(--color-line-normal)',
            background: helpfulClicked ? 'rgba(0,191,64,0.06)' : '#fff',
            padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
            fontSize: 12, fontWeight: 700,
            color: helpfulClicked ? '#0E7C3A' : 'var(--color-text-normal)',
            fontFamily: 'inherit',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
              <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
            </svg>
            도움됨 {r.helpful + (helpfulClicked ? 1 : 0)}
          </button>
        </Glass>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 20px 24px', background: '#fff',
        borderTop: '1px solid var(--color-line-alternative)',
        zIndex: 140,
      }}>
        <button onClick={() => { onClose(); setTimeout(() => openDetail(b.id), 100); }} className="lift" style={{
          width: '100%', padding: '16px 20px', borderRadius: 16, border: 'none',
          background: 'var(--color-primary-normal)', color: '#fff',
          fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          이 베이커리 상세 보기 ({b.name})
        </button>
      </div>
    </OverlayShell>
  );
}

window.ScreenUserProfile = ScreenUserProfile;
window.ScreenPostDetail = ScreenPostDetail;
window.ScreenReviewDetail = ScreenReviewDetail;

// ── Community Detail (ScreenCommunityDetail) ───────────────────────────────
function ScreenCommunityDetail({ community, onClose, openDetail, openOverlay }) {
  const [activeSubTab, setActiveSubTab] = useStateOv('feed');
  const [joined, setJoined] = useStateOv(false);

  const getFilteredPosts = () => {
    if (community.id === 'c1') return SOCIAL_POSTS.filter(p => p.text.includes('소금빵') || p.text.includes('버터') || p.bakeryName.includes('소금'));
    if (community.id === 'c2') return SOCIAL_POSTS.filter(p => p.text.includes('산책') || p.text.includes('아침') || p.text.includes('호밀'));
    if (community.id === 'c3') return SOCIAL_POSTS.filter(p => p.text.includes('캄파뉴') || p.text.includes('발효') || p.text.includes('사워도우'));
    if (community.id === 'c4') return SOCIAL_POSTS.filter(p => p.text.includes('성수') || p.text.includes('신상') || p.text.includes('먼슬리'));
    if (community.id === 'c5') return SOCIAL_POSTS.filter(p => p.text.includes('디저트') || p.text.includes('달콤') || p.text.includes('코른'));
    return SOCIAL_POSTS;
  };
  const posts = getFilteredPosts();

  const getRecommendedBakeries = () => {
    if (community.id === 'c1') return [BAKERIES[0], BAKERIES[3], BAKERIES[6]]; 
    if (community.id === 'c2') return [BAKERIES[1], BAKERIES[4], BAKERIES[7]]; 
    if (community.id === 'c3') return [BAKERIES[2], BAKERIES[5], BAKERIES[7]]; 
    if (community.id === 'c4') return [BAKERIES[0], BAKERIES[1], BAKERIES[3]]; 
    return BAKERIES.slice(0, 3);
  };
  const recommended = getRecommendedBakeries();

  const members = [
    { name: '도윤', handle: '@doyun.y', avatarPh: 'ph-stone', avatarChar: '도', desc: '크루아상 전문가' },
    { name: '지수', handle: '@jisu.bread', avatarPh: 'ph-rose', avatarChar: '지', desc: '디저트 수집가' },
    { name: '서연', handle: '@seoyeon.s', avatarPh: 'ph-cream', avatarChar: '서', desc: '주말 빵 투어러' },
    { name: '민재', handle: '@minj.eats', avatarPh: 'ph-sage', avatarChar: '민', desc: '발효빵 마니아' },
    { name: '준우', handle: '@junu.b', avatarPh: 'ph-amber', avatarChar: '준', desc: '소금빵 사냥꾼' },
  ];

  return (
    <OverlayShell title="소모임 홈" onClose={onClose}>
      {/* Cover visual & intro banner */}
      <div style={{
        padding: '32px 20px 24px',
        background: `linear-gradient(135deg, ${getMoodColor(community.moodKey)}30 0%, var(--color-background-normal) 100%)`,
        borderBottom: '1px solid var(--color-line-alternative)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', right: -20, bottom: -20, width: 100, height: 100, borderRadius: 99,
          background: getMoodColor(community.moodKey), opacity: 0.1, filter: 'blur(10px)',
        }}/>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Group large icon */}
          <div style={{
            width: 72, height: 72, borderRadius: 24,
            background: getMoodColor(community.moodKey),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
            border: '2px solid #fff',
          }}>
            {community.emoji}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              margin: 0, fontSize: 20, fontWeight: 800,
              color: 'var(--color-text-strong)', letterSpacing: '-0.016em',
            }}>{community.name}</h2>
            <div style={{
              marginTop: 4, fontSize: 11.5, color: 'var(--color-text-alternative)',
              fontWeight: 600, display: 'flex', gap: 8,
            }}>
              <span>멤버 {community.members}명</span>
              <span>·</span>
              <span>글 {posts.length * 3 + 12}개</span>
            </div>
          </div>
        </div>

        <p style={{
          margin: '16px 0 0', fontSize: 12.5, lineHeight: '18px',
          color: 'var(--color-text-normal)', fontWeight: 500,
        }}>{community.desc}</p>

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button 
            onClick={() => setJoined(!joined)} 
            className="lift" 
            style={{
              flex: 1, padding: '10px 16px', borderRadius: 12, border: joined ? '1px solid var(--color-line-normal)' : 'none',
              background: joined ? 'var(--color-background-alternative)' : 'var(--color-text-strong)',
              color: joined ? 'var(--color-text-normal)' : '#fff',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {joined ? '가입됨 ✓' : '소모임 가입하기'}
          </button>
          <button style={{
            padding: '10px 14px', borderRadius: 12, border: '1px solid var(--color-line-normal)',
            background: '#fff', color: 'var(--color-text-strong)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon.share/>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--color-line-alternative)',
        background: '#fff', position: 'sticky', top: 0, zIndex: 10,
      }}>
        {['feed', 'map', 'members'].map(t => {
          const active = activeSubTab === t;
          const label = t === 'feed' ? '소식 피드' : t === 'map' ? '공동 빵지도' : '모임 멤버';
          return (
            <button 
              key={t} 
              onClick={() => setActiveSubTab(t)}
              style={{
                flex: 1, padding: '14px 0', border: 'none', background: 'transparent',
                color: active ? 'var(--color-text-strong)' : 'var(--color-text-alternative)',
                fontSize: 14, fontWeight: active ? 700 : 500, cursor: 'pointer',
                fontFamily: 'inherit', position: 'relative',
              }}
            >
              {label}
              {active && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 24, right: 24, height: 3,
                  background: getMoodColor(community.moodKey), borderRadius: 99,
                }}/>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div style={{ background: 'var(--color-background-normal)', minHeight: 250 }}>
        {activeSubTab === 'feed' && (
          <div style={{ background: '#fff' }}>
            {posts.map((p, i) => (
              <div 
                key={p.id} 
                onClick={() => openOverlay && openOverlay('postDetail', p.id)} 
                className="lift" 
                style={{
                  padding: '20px 16px', cursor: 'pointer',
                  borderBottom: i < posts.length - 1 ? '1px solid var(--color-line-alternative)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 99, 
                    background: 'var(--color-background-alternative)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: 'var(--color-text-strong)',
                  }}>{p.avatarChar}</div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)' }}>{p.user}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-alternative)', marginTop: 1 }}>{p.time}</div>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: '20px', color: 'var(--color-text-normal)' }}>{p.text}</p>
                <div style={{ marginTop: 10, display: 'flex', gap: 14, fontSize: 12, color: 'var(--color-text-alternative)' }}>
                  <span>♥ {p.saves}</span>
                  <span>💬 {p.comments}</span>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-alternative)' }}>
                아직 올라온 게시글이 없습니다. 첫 이야기를 공유해보세요!
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'map' && (
          <div style={{ padding: 16 }}>
            {/* Abstracted naver-style mini map pattern */}
            <div className="map-bg" style={{
              height: 180, borderRadius: 20, position: 'relative', overflow: 'hidden',
              border: '1px solid var(--color-line-alternative)', marginBottom: 20,
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)',
            }}>
              {/* Expand map button */}
              <div 
                onClick={() => openOverlay && openOverlay('communityMap', { community, recommended })} 
                className="lift"
                style={{
                  position: 'absolute', top: 12, right: 12, zIndex: 30,
                  padding: '6px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.92)',
                  fontSize: 11, fontWeight: 700, color: 'var(--color-text-strong)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <span>🗺️</span> 크게 보기
              </div>
              {recommended.map((b, idx) => {
                const coords = [
                  { top: '32%', left: '22%' },
                  { top: '68%', left: '52%' },
                  { top: '28%', left: '78%' },
                  { top: '48%', left: '42%' },
                  { top: '22%', left: '48%' },
                  { top: '72%', left: '18%' },
                  { top: '52%', left: '82%' },
                  { top: '78%', left: '72%' },
                ];
                const coord = coords[idx % coords.length];
                return (
                  <div 
                    key={b.id} 
                    onClick={() => { onClose(); setTimeout(() => openDetail(b.id), 100); }} 
                    className="lift" 
                    style={{
                      position: 'absolute', top: coord.top, left: coord.left,
                      zIndex: 20, transform: 'translate(-50%, -50%)', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 99, 
                      background: getMoodColor(community.moodKey),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
                      border: '2px solid #fff',
                      fontSize: 16,
                    }}>
                      {community.emoji}
                    </div>
                    <div style={{
                      background: 'rgba(28,28,32,0.85)', color: '#fff',
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                      marginTop: 4, whiteSpace: 'nowrap', backdropFilter: 'blur(4px)',
                    }}>{b.name}</div>
                  </div>
                );
              })}
            </div>

            <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)' }}>
              멤버 추천 빵집 ({recommended.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recommended.map(b => (
                <div 
                  key={b.id} 
                  className="lift" 
                  onClick={() => { onClose(); setTimeout(() => openDetail(b.id), 100); }} 
                  style={{
                    display: 'flex', gap: 12, padding: 14, borderRadius: 16,
                    background: '#fff', border: '1px solid var(--color-line-alternative)',
                    cursor: 'pointer', alignItems: 'center',
                  }}
                >
                  <Placeholder tone={b.ph} style={{ width: 56, height: 56, borderRadius: 12, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)' }}>{b.name}</div>
                    <div style={{ marginTop: 2, fontSize: 11.5, color: 'var(--color-text-alternative)' }}>
                      {b.region} · {b.signature}
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(0, 191, 64, 0.08)', color: '#0E7C3A',
                    padding: '2px 8px', borderRadius: 99, fontSize: 10.5, fontWeight: 800,
                  }}>추천 픽</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'members' && (
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {members.map((m, idx) => (
              <div 
                key={idx} 
                onClick={() => openOverlay && openOverlay('userProfile', m.name)} 
                className="lift" 
                style={{
                  padding: 14, borderRadius: 16, background: '#fff',
                  border: '1px solid var(--color-line-alternative)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  textAlign: 'center', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 99, padding: 2,
                  background: getMoodColor(community.moodKey),
                }}>
                  <Placeholder tone={m.avatarPh} style={{ width: '100%', height: '100%', borderRadius: 99, border: '2px solid #fff' }}/>
                </div>
                <div style={{ marginTop: 8, fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)' }}>{m.name}</div>
                <div style={{ fontSize: 10.5, color: 'var(--color-text-alternative)', marginTop: 2 }}>{m.handle}</div>
                <div style={{
                  marginTop: 8, fontSize: 11, fontWeight: 600, color: getMoodColor(community.moodKey),
                  background: 'var(--color-background-alternative)', padding: '3px 8px', borderRadius: 8,
                }}>{m.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </OverlayShell>
  );
}

window.ScreenCommunityDetail = ScreenCommunityDetail;

// ═══════════════════════════════════════════════════════════════════════════
// COMMUNITY MAP OVERLAY
// ═══════════════════════════════════════════════════════════════════════════
function ScreenCommunityMap({ community, recommended, onClose, openDetail }) {
  const [selectedId, setSelectedId] = useStateOv(recommended[0]?.id || null);
  const selectedBakery = recommended.find(b => b.id === selectedId) || recommended[0];
  
  // Coordinates on svg (402x450 scale) matching community pins
  const pinCoords = {
    b1: { x: 100, y: 130 },
    b2: { x: 280, y: 190 },
    b3: { x: 180, y: 290 },
    b4: { x: 300, y: 100 },
    b5: { x: 120, y: 240 },
    b6: { x: 220, y: 80 },
    b7: { x: 80, y: 320 },
    b8: { x: 320, y: 310 },
  };

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const mapBg = isDark ? '#1C1C1E' : '#F1ECDF';
  const roadStroke = isDark ? 'rgba(255,255,255,0.08)' : '#fff';
  const markingStroke = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)';
  const labelColor = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.25)';

  return (
    <OverlayShell title={`${community.name} 공동지도`} onClose={onClose}>
      <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 12px)', overflow: 'hidden', background: mapBg }}>
        
        {/* SVG Interactive Map — viewBox lets the vector art + pins scale to fill any width/height */}
        <div style={{ width: '100%', height: '100%', minHeight: 360, overflow: 'hidden', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 402 480" preserveAspectRatio="xMidYMid slice" style={{ background: mapBg }}>
            {/* River Grid / Han River background */}
            <rect x="0" y="380" width="100%" height="100" fill="url(#riverGrad)"/>
            
            {/* Roads */}
            <line x1="0" y1="180" x2="402" y2="180" stroke={roadStroke} strokeWidth="18"/>
            <line x1="160" y1="0" x2="160" y2="480" stroke={roadStroke} strokeWidth="18"/>
            <line x1="0" y1="80" x2="402" y2="300" stroke={roadStroke} strokeWidth="8"/>
            <line x1="80" y1="0" x2="320" y2="480" stroke={roadStroke} strokeWidth="6"/>

            {/* Road markings */}
            <line x1="0" y1="180" x2="402" y2="180" stroke={markingStroke} strokeWidth="1.5" strokeDasharray="6,6"/>
            <line x1="160" y1="0" x2="160" y2="480" stroke={markingStroke} strokeWidth="1.5" strokeDasharray="6,6"/>

            {/* River Gradients */}
            <defs>
              <linearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isDark ? "#112233" : "#A2C8F5"} stopOpacity="1"/>
                <stop offset="100%" stopColor={isDark ? "#081320" : "#7DAAF0"} stopOpacity="1"/>
              </linearGradient>
            </defs>

            {/* River text */}
            <text x="50%" y="420" fill={isDark ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.95)"} fontSize="13" fontWeight="800" textAnchor="middle" letterSpacing="-0.02em">
              한강 (Han River)
            </text>
            <text x="140" y="215" fill={labelColor} fontSize="9.5" fontWeight="700">성수이로</text>
            <text x="40" y="165" fill={labelColor} fontSize="9.5" fontWeight="700">뚝섬로</text>

            {/* Render Recommended Bakery Pins */}
            {recommended.map(b => {
              const coord = pinCoords[b.id] || { x: 200, y: 200 };
              const isSelected = selectedId === b.id;
              const color = getMoodColor(community.moodKey);
              return (
                <g key={b.id} onClick={() => setSelectedId(b.id)} cursor="pointer">
                  {/* Selected ring */}
                  {isSelected && (
                    <circle cx={coord.x} cy={coord.y} r="20" fill="none" stroke={color} strokeWidth="2.5" opacity="0.8">
                      <animate attributeName="r" values="14;24;14" dur="2.2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.2s" repeatCount="indefinite"/>
                    </circle>
                  )}
                  
                  {/* Pin shadow */}
                  <circle cx={coord.x} cy={coord.y + 2} r={isSelected ? 14 : 11} fill="rgba(0,0,0,0.1)"/>
                  
                  {/* Pin outer bubble */}
                  <circle cx={coord.x} cy={coord.y} r={isSelected ? 14 : 11} fill={isSelected ? color : '#fff'} stroke={color} strokeWidth="2.5" style={{ transition: 'all 200ms' }}/>
                  
                  {/* Emoji inside marker */}
                  <text x={coord.x} y={coord.y + 1} dominantBaseline="middle" textAnchor="middle" fontSize={isSelected ? 13.5 : 11.5}>
                    {community.emoji}
                  </text>
                  
                  {/* Small tag label */}
                  <g transform={`translate(${coord.x}, ${coord.y - (isSelected ? 26 : 22)})`}>
                    <rect x="-32" y="-10" width="64" height="18" rx="6" fill="rgba(28,28,32,0.85)" stroke={isSelected ? '#fff' : 'none'} strokeWidth="1" boxShadow="0 2px 4px rgba(0,0,0,0.1)"/>
                    <text x="0" y="-1" dominantBaseline="middle" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff">
                      {b.name.length > 5 ? b.name.slice(0, 4) + '..' : b.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Floating Bakery Card */}
        {selectedBakery && (
          <div style={{
            position: 'absolute', bottom: 32, left: 16, right: 16, zIndex: 100,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: 22, padding: 18,
            boxShadow: '0 12px 36px rgba(20,15,8,0.16)',
            border: '1px solid rgba(255,255,255,0.4)',
            display: 'flex', gap: 14, alignItems: 'center',
          }}>
            <Placeholder tone={selectedBakery.ph || 'ph-butter'} style={{ width: 64, height: 64, borderRadius: 16, flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedBakery.name}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 800, color: getMoodColor(community.moodKey),
                  background: `${getMoodColor(community.moodKey)}12`,
                  padding: '2px 6px', borderRadius: 6, flexShrink: 0,
                }}>{selectedBakery.region}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-alternative)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                대표메뉴: {selectedBakery.signature} · {selectedBakery.distance}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: getMoodColor(community.moodKey) }}>💡 멤버 추천사:</span>
                <span style={{ fontStyle: 'italic', fontWeight: 500, color: 'var(--color-text-normal)' }}>
                  "{selectedBakery.name === '르 파베' ? '소금빵 밑바닥 엄청 바삭함!' : 
                    selectedBakery.name === '밀리언즈' ? '버터 동굴 깊이가 남달라요' : '담백하고 속이 편해요'}"
                </span>
              </div>
            </div>
            <IconButton
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              }
              onClick={() => { onClose(); setTimeout(() => openDetail(selectedBakery.id), 100); }}
              variant="background"
              size="medium"
              style={{
                background: getMoodColor(community.moodKey),
                color: '#fff',
                width: 42,
                height: 42,
                borderRadius: 12,
              }}
            />
          </div>
        )}
      </div>
    </OverlayShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TASTE QUIZ OVERLAY
// ═══════════════════════════════════════════════════════════════════════════
function ScreenTasteQuiz({ onClose }) {
  const [step, setStep] = useStateOv(0);
  const [answers, setAnswers] = useStateOv([]);
  const [analyzing, setAnalyzing] = useStateOv(false);

  const questions = [
    {
      q: "아침에 가장 먼저 꺼내 먹고 싶은 식사빵은?",
      options: [
        { text: "🌾 슴슴하고 시큼한 호밀빵 & 사워도우", val: "savory" },
        { text: "🥐 버터 풍미 가득한 고소한 크루아상", val: "butter" },
        { text: "🍩 달콤하고 부드러운 도넛 & 소보로", val: "sweet" },
        { text: "🥪 신선한 채소와 햄이 가득한 치아바타 샌드위치", val: "meal" }
      ]
    },
    {
      q: "내가 머무르고 싶은 이상적인 빵집 공간은?",
      options: [
        { text: "🪵 나무 냄새와 책이 가득한 조용한 골목길 빵집", val: "cozy" },
        { text: "🏛️ 감각적인 인테리어와 미니멀한 갤러리풍 대형 카페", val: "modern" },
        { text: "☀️ 햇살이 쏟아지는 아기자기하고 따뜻한 정원 테라스", val: "warm" },
        { text: "🎧 잔잔한 Lo-Fi 비트가 흐르고 노트북 작업이 편한 샵", val: "work" }
      ]
    },
    {
      q: "새로운 베이커리를 고를 때 나만의 선택 기준은?",
      options: [
        { text: "🥖 소화가 잘 되는 천연발효종 & 천연 유기농 밀가루", val: "healthy" },
        { text: "🧁 눈을 사로잡는 한정판 시즌 플레이트 및 타르트", val: "visual" },
        { text: "🧈 입안 가득 감칠맛이 폭발하는 버터향 버터동굴", val: "rich" }
      ]
    },
    {
      q: "나의 빵 탐험 스타일을 정의한다면?",
      options: [
        { text: "🧘 조용하게 나만의 감각과 맛에 집중하는 나홀로 탐험", val: "solo" },
        { text: "👭 맛있는 빵을 맛보고 나누는 즐거운 빵친구들과의 투어", val: "group" }
      ]
    }
  ];

  const handleSelect = (val) => {
    const nextAnswers = [...answers, val];
    setAnswers(nextAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setAnalyzing(true);
    }
  };

  useEffectOv(() => {
    if (analyzing) {
      const t = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [analyzing]);

  if (analyzing) {
    return (
      <OverlayShell title="AI 취향 분석" onClose={onClose}>
        <div style={{
          height: '75%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center',
        }}>
          <div className="pulse-slow" style={{
            width: 100, height: 100, borderRadius: 99,
            background: 'radial-gradient(circle, #FE5102 0%, #FF8D5C 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(254, 81, 2, 0.35)',
            marginBottom: 32,
          }}>
            <span style={{ fontSize: 44 }}>🍞</span>
          </div>
          
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
            color: 'var(--color-text-strong)', margin: '0 0 12px',
          }}>
            취향 분석 리포트 업데이트 중
          </h3>
          
          <p style={{
            fontSize: 13, color: 'var(--color-text-alternative)', lineHeight: '20px',
            maxWidth: 260, margin: 0, fontWeight: 500,
          }}>
            선택하신 답변과 저장 이력, 리뷰 키워드를 결합하여 김기현님의 5차원 빵스펙트럼을 새로 매핑하고 있습니다. 잠시만 기다려주세요.
          </p>
        </div>
      </OverlayShell>
    );
  }

  const curQ = questions[step];
  const progressPct = ((step + 1) / questions.length) * 100;

  return (
    <OverlayShell title="취향 재분석 퀴즈" onClose={onClose}>
      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--color-fill-normal)', position: 'relative' }}>
        <div style={{
          height: '100%', width: `${progressPct}%`, background: 'var(--color-primary-normal)',
          transition: 'width 250ms ease-out',
        }}/>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 800, color: 'var(--color-primary-normal)',
            letterSpacing: '0.04em', marginBottom: 6,
          }}>
            Question {step + 1} of {questions.length}
          </div>
          <h2 style={{
            margin: 0, fontFamily: 'var(--font-display)', fontSize: 21,
            fontWeight: 800, color: 'var(--color-text-strong)', letterSpacing: '-0.02em',
            lineHeight: '29px',
          }}>
            {curQ.q}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {curQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(opt.val)}
              className="lift"
              style={{
                padding: '18px 20px', borderRadius: 18,
                background: '#fff', border: '1px solid var(--color-line-normal)',
                textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)',
                boxShadow: '0 2px 8px rgba(20,15,8,0.02)',
                display: 'block', width: '100%', lineHeight: '20px',
              }}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </OverlayShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RANK DETAIL OVERLAY
// ═══════════════════════════════════════════════════════════════════════════
function ScreenRankDetail({ initialCategory, onClose, openDetail }) {
  const [category, setCategory] = useStateOv(initialCategory || 'all');
  
  const tabs = [
    { id: 'all', label: '전체 랭킹' },
    { id: 'salt', label: '소금빵 TOP' },
    { id: 'crust', label: '식사빵/캄파뉴' },
    { id: 'dessert', label: '디저트/타르트' },
  ];

  const rankedData = [
    { id: 'b1', name: '르 파베', region: '성수동', signature: '소금 버터롤', rating: '4.8', reviews: 210, delta: 'NEW', trend: 'up', type: 'salt', tag: '소금빵 성지' },
    { id: 'b2', name: '밀리언즈', region: '연남동', signature: '버터 크루아상', rating: '4.7', reviews: 180, delta: '▲2', trend: 'up', type: 'salt', tag: '풍성한 버터' },
    { id: 'b3', name: '슬로우브레드', region: '성수동', signature: '천연 발효 바게트', rating: '4.9', reviews: 312, delta: '▼1', trend: 'down', type: 'crust', tag: '천연발효종' },
    { id: 'b4', name: '먼슬리 페이스트리', region: '성수동', signature: '살구 페이스트리', rating: '4.9', reviews: 82, delta: '▲4', trend: 'up', type: 'dessert', tag: '시즈널 에디션' },
    { id: 'b5', name: '코른블루멘', region: '망원동', signature: '호밀 캄파뉴', rating: '4.8', reviews: 140, delta: '▲1', trend: 'up', type: 'crust', tag: '비건/호밀' },
    { id: 'b6', name: '오뜨 디저트', region: '한남동', signature: '샤인머스캣 타르트', rating: '4.6', reviews: 98, delta: '▼3', trend: 'down', type: 'dessert', tag: '화려한 디저트' },
    { id: 'b7', name: '안국 브레드하우스', region: '안국동', signature: '통밀 식빵', rating: '4.5', reviews: 64, delta: '▲2', trend: 'up', type: 'crust', tag: '식사빵 전문' },
    { id: 'b8', name: '카페 진정성 베이커리', region: '성수동', signature: '바닐라 크루아상', rating: '4.7', reviews: 104, delta: '-', trend: 'none', type: 'dessert', tag: '크림 커스터드' },
    { id: 'b1', name: '브레드 앤 버터', region: '성수동', signature: '명란 소금빵', rating: '4.6', reviews: 90, delta: '▲5', trend: 'up', type: 'salt', tag: '이색 소금빵' },
    { id: 'b2', name: '소피 베이커리', region: '연남동', signature: '올리브 치아바타', rating: '4.8', reviews: 115, delta: '▼2', trend: 'down', type: 'crust', tag: '촉촉한 식감' },
    { id: 'b3', name: '더블 타르트', region: '신사동', signature: '바닐라 타르트', rating: '4.7', reviews: 78, delta: 'NEW', trend: 'up', type: 'dessert', tag: '프랑스 정통' },
    { id: 'b4', name: '로프 베이커리', region: '한남동', signature: '무화과 캄파뉴', rating: '4.9', reviews: 204, delta: '▲1', trend: 'up', type: 'crust', tag: '건강한 단맛' },
  ];

  const filtered = category === 'all' 
    ? rankedData 
    : rankedData.filter(b => b.type === category);

  return (
    <OverlayShell title="실시간 인기 랭킹" onClose={onClose}>
      <div style={{
        display: 'flex', gap: 6, padding: '12px 16px', overflowX: 'auto',
        background: 'var(--color-background-alternative)',
        borderBottom: '1px solid var(--color-line-alternative)',
      }} className="scroll">
        {tabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => setCategory(t.id)} 
            className="lift"
            style={{
              padding: '8px 14px', borderRadius: 99,
              background: category === t.id ? 'var(--color-text-strong)' : '#fff',
              color: category === t.id ? '#fff' : 'var(--color-text-normal)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 12.5, fontWeight: 700, flexShrink: 0,
              border: category === t.id ? 'none' : '1px solid var(--color-line-normal)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: 60 }}>
        {filtered.map((b, idx) => (
          <div 
            key={idx} 
            onClick={() => { onClose(); setTimeout(() => openDetail(b.id), 100); }} 
            className="lift"
            style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
              borderBottom: '1px solid var(--color-line-alternative)', cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
              <span style={{
                fontSize: 16, fontWeight: 900,
                color: idx < 3 ? 'var(--color-primary-normal)' : 'var(--color-text-alternative)',
                fontFamily: 'var(--font-display)',
              }}>{idx + 1}</span>
              
              <span style={{
                fontSize: 9, fontWeight: 800, marginTop: 2,
                color: b.delta === 'NEW' ? 'var(--color-primary-normal)' :
                       b.trend === 'up' ? '#0E7C3A' :
                       b.trend === 'down' ? '#E52222' : 'var(--color-text-alternative)',
              }}>
                {b.delta}
              </span>
            </div>

            <Placeholder tone={b.id === 'b1' ? 'ph-butter' : b.id === 'b2' ? 'ph-amber' : b.id === 'b3' ? 'ph-cream' : 'ph-sage'} style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }}/>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--color-text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {b.name}
                </h4>
                <span style={{
                  padding: '1px 5px', borderRadius: 4, background: 'var(--color-background-alternative)',
                  color: 'var(--color-text-alternative)', fontSize: 9, fontWeight: 700, flexShrink: 0,
                }}>{b.tag}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--color-text-alternative)', marginTop: 3 }}>
                {b.region} · 대표메뉴: {b.signature}
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--color-primary-normal)' }}>★ {b.rating}</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-alternative)', marginTop: 2 }}>{b.reviews}개 리뷰</div>
            </div>
          </div>
        ))}
      </div>
    </OverlayShell>
  );
}

window.ScreenCommunityDetail = ScreenCommunityDetail;
window.ScreenCommunityMap = ScreenCommunityMap;
window.ScreenTasteQuiz = ScreenTasteQuiz;
window.ScreenRankDetail = ScreenRankDetail;



