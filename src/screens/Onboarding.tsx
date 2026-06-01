// screen-onboarding.jsx — 12-step onboarding flow (Splash → Login → Type → Taste)
// @ts-nocheck
import { useState, useEffect } from 'react';
import {
  Glass, Placeholder, MediaSlot, Chip, Icon, Button, IconButton, Textarea, MOOD_COLORS, MagazineKicker,
} from '@/components/shared';

const BREAD_TASTES = [
  '소금빵','크루아상','케이크','타르트','마카롱','도넛','식빵',
  '베이글','스콘','휘낭시에','바게트','파이','브리오슈','깜빠뉴',
];
const MOOD_GROUPS = [
  { key: 'sweet',     emoji: '☀️', label: '따뜻한',  tags: ['햇살 좋은', '아늑한', '브런치'] },
  { key: 'savory',    emoji: '🪵', label: '빈티지',  tags: ['우드톤', '빈티지', '혼자 오기 좋은'] },
  { key: 'healthy',   emoji: '🌿', label: '미니멀',  tags: ['미니멀', '조용한', '작업하기 좋은'] },
  { key: 'specialty', emoji: '✨', label: '모던',    tags: ['모던', '루프톱', '데이트'] },
];

function ScreenOnboarding({ onComplete }) {
  const [step, setStep] = useState('splash');
  const [userType, setUserType] = useState(null);
  const [breadSel, setBreadSel] = useState(new Set());
  const [moodSel, setMoodSel] = useState(new Set());
  const [bizNewsList, setBizNewsList] = useState([
    { title: '오픈 기념 이벤트', content: '오늘 방문해주시는 선착순 30분께 갓 구운 소금빵 1개를 무료로 드립니다! 많은 참여 부탁드려요.', tag: '📢 공지 사항', time: '1일 전' }
  ]);

  // Auto advance splash → login
  useEffect(() => {
    if (step === 'splash') {
      const t = setTimeout(() => setStep('login'), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  const toggleBread = (b) => {
    setBreadSel(prev => {
      const next = new Set(prev);
      next.has(b) ? next.delete(b) : next.add(b);
      return next;
    });
  };
  const toggleMood = (t) => {
    setMoodSel(prev => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };

  const addBizNews = (item) => {
    setBizNewsList(prev => [item, ...prev]);
    setStep('bizHome');
  };

  return (
    <div className="fade-enter" key={step} style={{
      position: 'absolute', inset: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column',
      background: 'var(--color-background-normal)',
    }}>
      {step === 'splash'  && <OnSplash/>}
      {step === 'login'   && <OnLogin onLogin={() => setStep('type')} onReset={() => setStep('reset1')}/>}
      {step === 'reset1'  && <OnReset1 onNext={() => setStep('reset2')} onBack={() => setStep('login')}/>}
      {step === 'reset2'  && <OnReset2 onDone={() => setStep('login')} onBack={() => setStep('reset1')}/>}
      {step === 'type'    && <OnType
        onSelect={(t) => { setUserType(t); setStep(t === 'biz' ? 'bizSignup' : 'signup'); }}
        onBack={() => setStep('login')}/>}
      {step === 'signup'  && <OnSignup onNext={() => setStep('taste1')} onBack={() => setStep('type')}/>}
      {step === 'taste1'  && <OnTaste1
        breadSel={breadSel} toggle={toggleBread}
        onNext={() => setStep('taste2')} onBack={() => setStep('signup')}/>}
      {step === 'taste2'  && <OnTaste2
        moodSel={moodSel} toggle={toggleMood}
        onComplete={() => setStep('finish')} onBack={() => setStep('taste1')}/>}
      {step === 'bizSignup' && <OnBizSignup onNext={() => setStep('bizStore')} onBack={() => setStep('type')}/>}
      {step === 'bizStore'  && <OnBizStore onComplete={() => setStep('finish')} onBack={() => setStep('bizSignup')}/>}
      {step === 'finish'    && <OnFinish userType={userType} breadSel={breadSel} moodSel={moodSel} onComplete={onComplete} setStep={setStep}/>}
      {step === 'bizHome'   && <OnBizHome onComplete={onComplete} openNewsWrite={() => setStep('bizNews')} newsList={bizNewsList}/>}
      {step === 'bizNews'   && <OnBizNews onClose={() => setStep('bizHome')} onSubmit={addBizNews}/>}
    </div>
  );
}

// ─── Step shells ─────────────────────────────────────────────────────────
function OnShell({ children, back, pad = 24 }) {
  return (
    <div className="scroll fade-enter" style={{
      flex: 1, overflowY: 'auto',
      padding: `28px ${pad}px 32px`,
      display: 'flex', flexDirection: 'column',
      background:
        'linear-gradient(180deg, var(--color-fill-surface-canvas) 0%, var(--color-fill-surface-default) 58%, var(--color-fill-surface-canvas) 100%)',
    }}>
      {back && (
        <IconButton
          icon={<Icon.chevL/>}
          onClick={back}
          variant="normal"
          size="medium"
          style={{ position: 'absolute', top: 20, left: 14, color: 'var(--color-text-strong)' }}
        />
      )}
      {children}
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled }) {
  return (
    <Button
      label={children}
      onClick={onClick}
      disabled={disabled}
      variant="solid"
      color="primary"
      style={{ width: '100%' }}
    />
  );
}

function FieldGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontSize: 11, fontWeight: 800, color: 'var(--color-text-tertiary)',
        letterSpacing: 0, marginBottom: 8, textTransform: 'uppercase',
      }}>{label}</div>
      {children}
    </div>
  );
}
function Input({ placeholder, type = 'text', ...props }) {
  return (
    <div style={{
      height: 54,
      borderRadius: 18,
      border: '1px solid var(--color-border-subtle)',
      background: 'var(--color-fill-surface-default)',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 8px 20px rgba(19,15,13,0.05)',
    }}>
      <input
        type={type}
        placeholder={placeholder}
        {...props}
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
    </div>
  );
}

// ─── Splash ──────────────────────────────────────────────────────────────
function OnSplash() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #F4EDE0 0%, #E2C9A0 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* orbit mood dots */}
      <div style={{
        position: 'absolute', width: 280, height: 280,
        animation: 'orbitRot 8s linear infinite',
      }}>
        {Object.entries(MOOD_COLORS).map(([k, c], i) => {
          const angle = (i / 5) * Math.PI * 2;
          const x = 140 + Math.cos(angle) * 120;
          const y = 140 + Math.sin(angle) * 120;
          return (
            <div key={k} style={{
              position: 'absolute', left: x - 10, top: y - 10,
              width: 20, height: 20, borderRadius: 99,
              background: c,
              boxShadow: `0 0 24px ${c}`,
            }}/>
          );
        })}
      </div>
      <div style={{
        position: 'relative', zIndex: 2,
        fontFamily: 'var(--font-display)',
        fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em',
        color: 'var(--color-text-strong)',
      }}>gluten</div>
      <div style={{
        marginTop: 10, fontSize: 13, fontWeight: 600,
        color: 'rgba(70,60,40,0.55)', letterSpacing: '0.06em',
      }}>taste, archived.</div>
      <style>{`
        @keyframes orbitRot {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────
function OnLogin({ onLogin, onReset }) {
  return (
    <OnShell>
      <div style={{ marginBottom: 36 }}>
        <MagazineKicker>Welcome back</MagazineKicker>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 30, fontWeight: 800, letterSpacing: 0,
          color: 'var(--color-text-strong)',
          marginTop: 8,
        }}>다시 만나서<br/>반가워요.</div>
        <div style={{
          marginTop: 10, fontSize: 14, lineHeight: '22px',
          color: 'var(--color-text-alternative)',
        }}>오늘의 탐험을 이어가요.</div>
      </div>
      <FieldGroup label="이메일">
        <Input placeholder="hello@gluten.kr" type="email"/>
      </FieldGroup>
      <FieldGroup label="비밀번호">
        <Input placeholder="••••••••" type="password"/>
      </FieldGroup>
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <PrimaryBtn onClick={onLogin}>로그인</PrimaryBtn>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 14 }}>
          <button onClick={onReset} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 13, color: 'var(--color-text-alternative)', fontFamily: 'inherit',
            fontWeight: 500,
          }}>비밀번호 찾기</button>
          <span style={{ color: 'var(--color-line-normal)' }}>·</span>
          <button onClick={onLogin} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 13, color: 'var(--color-text-normal)', fontFamily: 'inherit',
            fontWeight: 700,
          }}>회원가입</button>
        </div>
      </div>
    </OnShell>
  );
}
function OnReset1({ onNext, onBack }) {
  return (
    <OnShell back={onBack}>
      <div style={{ marginBottom: 36 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800,
          letterSpacing: '-0.018em', color: 'var(--color-text-strong)',
        }}>비밀번호 재설정</div>
        <div style={{ marginTop: 8, fontSize: 13.5, color: 'var(--color-text-alternative)' }}>
          가입한 이메일로 인증 코드를 보낼게요.
        </div>
      </div>
      <FieldGroup label="이메일"><Input placeholder="hello@gluten.kr" type="email"/></FieldGroup>
      <div style={{ marginTop: 'auto' }}>
        <PrimaryBtn onClick={onNext}>코드 받기</PrimaryBtn>
      </div>
    </OnShell>
  );
}
function OnReset2({ onDone, onBack }) {
  return (
    <OnShell back={onBack}>
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800,
          letterSpacing: '-0.018em', color: 'var(--color-text-strong)',
        }}>새 비밀번호</div>
      </div>
      <FieldGroup label="인증 코드"><Input placeholder="6자리 코드"/></FieldGroup>
      <FieldGroup label="새 비밀번호"><Input placeholder="••••••••" type="password"/></FieldGroup>
      <FieldGroup label="비밀번호 확인"><Input placeholder="••••••••" type="password"/></FieldGroup>
      <div style={{ marginTop: 'auto' }}>
        <PrimaryBtn onClick={onDone}>변경 완료</PrimaryBtn>
      </div>
    </OnShell>
  );
}

// ─── Type select ────────────────────────────────────────────────────────
function OnType({ onSelect, onBack }) {
  return (
    <OnShell back={onBack}>
      <div style={{ marginBottom: 36 }}>
        <MagazineKicker>Start type</MagazineKicker>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
          letterSpacing: 0, color: 'var(--color-text-strong)', marginTop: 8,
        }}>어떻게 시작할까요?</div>
        <div style={{ marginTop: 8, fontSize: 14, color: 'var(--color-text-alternative)' }}>
          가입 유형에 따라 다른 경험을 준비했어요.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TypeCard
          onClick={() => onSelect('user')}
          icon="🥐"
          title="탐험가로 시작"
          desc="베이커리를 발견하고, 저장하고, 취향을 쌓아가요."
          tone={MOOD_COLORS.sweet}
        />
        <TypeCard
          onClick={() => onSelect('biz')}
          icon="🏪"
          title="베이커리 사업자"
          desc="우리 매장을 등록하고 손님과 만나요."
          tone={MOOD_COLORS.specialty}
        />
      </div>
    </OnShell>
  );
}
function TypeCard({ icon, title, desc, tone, onClick }) {
  return (
    <button onClick={onClick} className="lift" style={{
      padding: 18, borderRadius: 24, border: '1px solid var(--color-border-subtle)',
      background: 'var(--color-fill-surface-default)', cursor: 'pointer', textAlign: 'left',
      fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 14,
      boxShadow: '0 12px 28px rgba(19,15,13,0.07)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: `${tone}1A`, fontSize: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16, fontWeight: 700, color: 'var(--color-text-strong)',
          letterSpacing: '-0.012em',
        }}>{title}</div>
        <div style={{
          marginTop: 4, fontSize: 12.5, lineHeight: '18px',
          color: 'var(--color-text-alternative)',
        }}>{desc}</div>
      </div>
      <Icon.chevR/>
    </button>
  );
}

// ─── Signup ──────────────────────────────────────────────────────────────
function OnSignup({ onNext, onBack }) {
  return (
    <OnShell back={onBack}>
      <div style={{ marginBottom: 28 }}>
        <MagazineKicker>Explorer profile</MagazineKicker>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
          letterSpacing: 0, color: 'var(--color-text-strong)', marginTop: 8,
        }}>탐험가 등록</div>
        <div style={{ marginTop: 8, fontSize: 13.5, color: 'var(--color-text-alternative)' }}>
          이메일과 닉네임만 있으면 충분해요.
        </div>
      </div>
      <FieldGroup label="닉네임"><Input placeholder="기현"/></FieldGroup>
      <FieldGroup label="이메일"><Input placeholder="hello@gluten.kr" type="email"/></FieldGroup>
      <FieldGroup label="비밀번호"><Input placeholder="8자 이상" type="password"/></FieldGroup>
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--color-text-alternative)' }}>
        가입 시 <u>이용약관</u>과 <u>개인정보 처리방침</u>에 동의합니다.
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <PrimaryBtn onClick={onNext}>다음</PrimaryBtn>
      </div>
    </OnShell>
  );
}

// ─── Taste 1 — bread ──────────────────────────────────────────────────────
function OnTaste1({ breadSel, toggle, onNext, onBack }) {
  return (
    <OnShell back={onBack} pad={20}>
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.04em',
          fontWeight: 700, color: 'var(--color-text-alternative)',
        }}>취향 · 1/2</div>
        <div style={{
          marginTop: 6,
          fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
          letterSpacing: '-0.02em', color: 'var(--color-text-strong)',
          lineHeight: '34px',
        }}>좋아하는 빵을<br/>모두 골라주세요.</div>
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--color-text-alternative)' }}>
          {breadSel.size}개 선택됨 · 최소 3개
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {BREAD_TASTES.map(b => {
          const active = breadSel.has(b);
          return (
            <Chip
              key={b}
              label={b}
              active={active}
              onClick={() => toggle(b)}
              size="medium"
            />
          );
        })}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <PrimaryBtn onClick={onNext} disabled={breadSel.size < 3}>
          다음 ({breadSel.size}/3)
        </PrimaryBtn>
      </div>
    </OnShell>
  );
}

// ─── Taste 2 — mood ───────────────────────────────────────────────────────
function OnTaste2({ moodSel, toggle, onComplete, onBack }) {
  return (
    <OnShell back={onBack} pad={20}>
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 11, letterSpacing: '0.04em',
          fontWeight: 700, color: 'var(--color-text-alternative)',
        }}>취향 · 2/2</div>
        <div style={{
          marginTop: 6,
          fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
          letterSpacing: '-0.02em', color: 'var(--color-text-strong)',
          lineHeight: '34px',
        }}>어떤 분위기를<br/>좋아하세요?</div>
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--color-text-alternative)' }}>
          {moodSel.size}개 선택됨
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {MOOD_GROUPS.map(g => (
          <div key={g.key}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
            }}>
              <span style={{ fontSize: 16 }}>{g.emoji}</span>
              <span style={{
                fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)',
              }}>{g.label}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {g.tags.map(t => {
                const active = moodSel.has(t);
                return (
                  <button key={t} onClick={() => toggle(t)} className="lift" style={{
                    padding: '9px 14px', borderRadius: 99,
                    border: active ? `1.5px solid ${MOOD_COLORS[g.key]}` : '1px solid var(--color-line-normal)',
                    background: active ? MOOD_COLORS[g.key] : '#fff',
                    color: active ? '#fff' : 'var(--color-text-normal)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 13, fontWeight: 600,
                  }}>{t}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <PrimaryBtn onClick={onComplete} disabled={moodSel.size === 0}>
          탐험 시작하기
        </PrimaryBtn>
      </div>
    </OnShell>
  );
}

// ─── Biz signup ──────────────────────────────────────────────────────────
function OnBizSignup({ onNext, onBack }) {
  return (
    <OnShell back={onBack}>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
          letterSpacing: '-0.02em', color: 'var(--color-text-strong)',
        }}>사업자 등록</div>
      </div>
      <FieldGroup label="대표자명"><Input placeholder="홍길동"/></FieldGroup>
      <FieldGroup label="이메일"><Input placeholder="store@gluten.kr" type="email"/></FieldGroup>
      <FieldGroup label="전화번호"><Input placeholder="010-1234-5678"/></FieldGroup>
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <PrimaryBtn onClick={onNext}>다음</PrimaryBtn>
      </div>
    </OnShell>
  );
}
function OnBizStore({ onComplete, onBack }) {
  return (
    <OnShell back={onBack}>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
          letterSpacing: '-0.02em', color: 'var(--color-text-strong)',
        }}>매장 정보</div>
      </div>
      <FieldGroup label="매장명"><Input placeholder="르 파베"/></FieldGroup>
      <FieldGroup label="주소"><Input placeholder="서울 성동구 연무장길 28"/></FieldGroup>
      <FieldGroup label="영업시간"><Input placeholder="08:00 — 19:00"/></FieldGroup>
      <FieldGroup label="시그니처 메뉴"><Input placeholder="솔티드 버터 크루아상"/></FieldGroup>
      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <PrimaryBtn onClick={onComplete}>등록 완료</PrimaryBtn>
      </div>
    </OnShell>
  );
}

// ─── Onboarding complete (ON-09) ──────────────────────────────────────────
function OnFinish({ userType, breadSel, moodSel, onComplete, setStep }) {
  const isBiz = userType === 'biz';
  
  return (
    <OnShell pad={20}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 0' }}>
        
        {/* Animated Particle Orbit */}
        <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Pulse circles */}
          <div className="saved-pulse" style={{
            position: 'absolute', width: 140, height: 140, borderRadius: 99,
            background: 'var(--color-primary-normal)', opacity: 0.1,
            animation: 'savedPulse 2s infinite var(--easing-emphasized)',
          }}/>
          <div style={{
            position: 'absolute', width: 100, height: 100, borderRadius: 99,
            background: 'var(--color-primary-normal)', opacity: 0.15,
            boxShadow: '0 0 20px rgba(254,81,2,0.2)',
          }}/>
          {/* Logo center */}
          <div style={{
            position: 'relative', width: 72, height: 72, borderRadius: 24,
            background: 'linear-gradient(135deg, #FE5102, #FF8A5F)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(254,81,2,0.3)',
            zIndex: 10,
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>G</span>
          </div>
          
          {/* Orbit particles */}
          <div style={{
            position: 'absolute', inset: 0,
            animation: 'spin 12s linear infinite',
          }}>
            <div style={{ position: 'absolute', top: 20, left: 90, width: 10, height: 10, borderRadius: 99, background: '#FE5102' }}/>
            <div style={{ position: 'absolute', bottom: 30, right: 40, width: 8, height: 8, borderRadius: 99, background: '#FF9200' }}/>
          </div>
          <div style={{
            position: 'absolute', inset: 10,
            animation: 'spin 8s linear infinite reverse',
          }}>
            <div style={{ position: 'absolute', top: 50, right: 10, width: 6, height: 6, borderRadius: 99, background: '#FFE9DE' }}/>
            <div style={{ position: 'absolute', bottom: 40, left: 20, width: 9, height: 9, borderRadius: 99, background: '#FE5102', opacity: 0.6 }}/>
          </div>
        </div>

        <h1 style={{
          margin: 0, fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
          letterSpacing: '-0.022em', color: 'var(--color-text-strong)', lineHeight: '34px'
        }}>
          {isBiz ? '파트너 등록 완료!' : '나만의 빵지도 준비 완료!'}
        </h1>
        <p style={{
          marginTop: 12, fontSize: 14.5, lineHeight: '22px',
          color: 'var(--color-text-alternative)', maxWidth: 280,
        }}>
          {isBiz 
            ? '글루텐 파트너가 되신 것을 축하합니다. 이제 매장 소식을 전하고 분석 대시보드를 확인할 수 있어요.' 
            : '취향 설정을 바탕으로 소금빵 굽는 냄새와 햇살 가득한 우드톤 공간을 찾아드릴게요.'}
        </p>

        {/* Selected taste tags summary */}
        {!isBiz && breadSel.size > 0 && (
          <div style={{
            marginTop: 24, padding: '16px 20px', borderRadius: 20,
            background: 'var(--color-background-alternative)', width: '100%',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-alternative)', letterSpacing: '0.04em' }}>
              나의 취향 시놉시스
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {Array.from(breadSel).slice(0, 3).map(b => (
                <span key={b} style={{ padding: '4px 9px', borderRadius: 99, background: '#FFE9DE', color: '#FE5102', fontSize: 11.5, fontWeight: 700 }}>
                  #{b}
                </span>
              ))}
              {Array.from(moodSel).slice(0, 2).map(m => (
                <span key={m} style={{ padding: '4px 9px', borderRadius: 99, background: '#f0f0f0', color: 'var(--color-text-strong)', fontSize: 11.5, fontWeight: 700 }}>
                  #{m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <PrimaryBtn onClick={isBiz ? () => setStep('bizHome') : onComplete}>
          {isBiz ? '사업자 대시보드 가기' : '탐험 시작하기'}
        </PrimaryBtn>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </OnShell>
  );
}

// ─── Biz Home (ON-12) ─────────────────────────────────────────────────────
function OnBizHome({ onComplete, openNewsWrite, newsList }) {
  return (
    <OnShell pad={20}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary-normal)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Gluten Partner</div>
          <h1 style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text-strong)' }}>르 파베 성수</h1>
        </div>
        <Placeholder tone="ph-wheat" style={{ width: 44, height: 44, borderRadius: 14 }}/>
      </div>

      {/* Analytics Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <Glass radius={18} style={{ padding: 16, boxShadow: '0 4px 12px rgba(20,15,8,0.05)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-alternative)' }}>오늘 방문 예정</div>
          <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800, color: 'var(--color-text-strong)' }}>14명</div>
          <div style={{ marginTop: 4, fontSize: 10.5, color: '#00BF40', fontWeight: 700 }}>실시간 혼잡 보통</div>
        </Glass>
        <Glass radius={18} style={{ padding: 16, boxShadow: '0 4px 12px rgba(20,15,8,0.05)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-alternative)' }}>단골 저장 수</div>
          <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800, color: 'var(--color-text-strong)' }}>342명</div>
          <div style={{ marginTop: 4, fontSize: 10.5, color: '#00BF40', fontWeight: 700 }}>전주 대비 +12% ↑</div>
        </Glass>
      </div>

      {/* Representative Menu Status */}
      <Glass radius={20} style={{ padding: '16px 18px', marginBottom: 24, boxShadow: '0 4px 12px rgba(20,15,8,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-alternative)' }}>시그니처 메뉴 상태</div>
            <div style={{ marginTop: 4, fontSize: 14.5, fontWeight: 700, color: 'var(--color-text-strong)' }}>솔티드 버터 크루아상</div>
          </div>
          <span style={{
            padding: '4px 9px', borderRadius: 99, background: 'rgba(0,191,64,0.10)', color: '#0E7C3A',
            fontSize: 11, fontWeight: 700
          }}>판매 중</span>
        </div>
      </Glass>

      {/* Quick actions row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <Button
          onClick={openNewsWrite}
          label="소식/공지 작성"
          variant="solid"
          color="primary"
          leadingIcon={<Icon.plus />}
          style={{ flex: 1 }}
        />
        <Button
          label="매장 관리"
          variant="outlined"
          color="primary"
          style={{ flex: 1 }}
        />
      </div>

      {/* Registered news feed list */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)', marginBottom: 12 }}>작성된 소식 피드</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {newsList.map((n, i) => (
            <div key={i} style={{
              padding: 16, borderRadius: 16, background: 'var(--color-background-alternative)',
              display: 'flex', flexDirection: 'column', gap: 6
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: 4, background: '#FFE9DE', color: '#FE5102',
                  fontSize: 9.5, fontWeight: 800, letterSpacing: '0.02em'
                }}>{n.tag}</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-alternative)' }}>{n.time}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)' }}>{n.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--color-text-normal)', lineHeight: '18px' }}>{n.content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time notifications logs */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-strong)', marginBottom: 12 }}>최근 파트너 활동 로그</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { msg: '민재님이 우리 매장을 컬렉션에 추가했습니다.', time: '방금' },
            { msg: '지수님이 크루아상에 5점 별점 리뷰를 등록했습니다.', time: '1시간 전' },
            { msg: '누적 단골 저장 수 300명을 돌파했습니다!', time: '3시간 전' },
          ].map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: '#FE5102', marginTop: 6, flexShrink: 0 }}/>
              <span style={{ color: 'var(--color-text-normal)', flex: 1 }}>{l.msg}</span>
              <span style={{ color: 'var(--color-text-alternative)', fontSize: 11 }}>{l.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User mode preview */}
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <PrimaryBtn onClick={onComplete}>일반 모드로 둘러보기</PrimaryBtn>
      </div>
    </OnShell>
  );
}

// ─── Biz News (ON-13) ─────────────────────────────────────────────────────
function OnBizNews({ onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('📢 공지 사항');

  const tags = ['📢 공지 사항', '✨ 신규 메뉴', '🔥 매진 임박'];

  const handlePost = () => {
    if (!title || !content) return;
    onSubmit({
      title,
      content,
      tag: selectedTag,
      time: '방금',
    });
  };

  return (
    <OnShell back={onClose} pad={20}>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800,
          letterSpacing: '-0.02em', color: 'var(--color-text-strong)',
        }}>소식 작성</div>
        <p style={{ margin: '6px 0 0', fontSize: 13.5, color: 'var(--color-text-alternative)' }}>
          매장 정보나 실시간 판매 현황을 손님들에게 공지하세요.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
        {/* Tag selection */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)', marginBottom: 8 }}>공지 태그 선택</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {tags.map(t => {
              const active = selectedTag === t;
              return (
                <button key={t} onClick={() => setSelectedTag(t)} className="lift" style={{
                  padding: '8px 12px', borderRadius: 10,
                  border: active ? '1.5px solid var(--color-primary-normal)' : '1px solid var(--color-line-normal)',
                  background: active ? '#FFE9DE' : '#fff',
                  color: active ? '#FE5102' : 'var(--color-text-normal)',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700
                }}>{t}</button>
              );
            })}
          </div>
        </div>

        <FieldGroup label="소식 제목">
          <Input placeholder="오후 2시 소금빵 추가 생산 예정" value={title} onChange={(e) => setTitle(e.target.value)}/>
        </FieldGroup>

        <FieldGroup label="상세 내용">
          <Textarea
            placeholder="많은 분들이 소금빵을 찾아주셔서 추가 물량을 생산 중입니다! 2시 전후로 갓 구워진 소금빵이 나오니 참고해주세요."
            value={content}
            onChange={setContent}
            style={{ minHeight: 120 }}
          />
        </FieldGroup>

        {/* Thumbnail mockup */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-text-alternative)', marginBottom: 8 }}>대표 이미지</label>
          <Placeholder tone="ph-butter" style={{ width: '100%', height: 140, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>📷 사진 추가하기</span>
          </Placeholder>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 24 }}>
        <PrimaryBtn onClick={handlePost} disabled={!title || !content}>
          작성 완료
        </PrimaryBtn>
      </div>
    </OnShell>
  );
}

export { ScreenOnboarding };
