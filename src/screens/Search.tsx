// @ts-nocheck
import type { ReactNode } from 'react';
import {
  Icon, Chip, RankedFeatureCard, EditorialCard, ArchiveCard, MagazineKicker, SaveStar,
} from '@/components/shared';
import { BAKERIES, COLLECTIONS, MOODS } from '@/data/bakeries';

interface ScreenSearchProps {
  query: string;
  setQuery: (q: string) => void;
  openDetail: (id: string) => void;
}

function ScreenSearch({ query, setQuery, openDetail }: ScreenSearchProps) {
  const recents = ['소금빵', '성수 베이커리', '르 파베', '캄파뉴', '조용한 카페'];
  const trending = ['월간 페이스트리', '성수 소금빵', '한남 디저트', '에그타르트', '연남 베이커리', '바스크 치즈케이크'];
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
      background: 'var(--color-fill-surface-canvas)',
      display: 'flex', flexDirection: 'column',
    }}>
      <header style={{ padding: '26px 20px 12px' }}>
        <MagazineKicker>Explorer index</MagazineKicker>
        <h2 style={{
          margin: '7px 0 0',
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          lineHeight: '34px',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
        }}>탐험 인덱스</h2>
        <p style={{ margin: '8px 0 0', fontSize: 13.5, lineHeight: '20px', color: 'var(--color-text-secondary)' }}>
          지역, 빵 종류, 분위기를 잡지 목차처럼 훑어보세요.
        </p>
      </header>

      <div className="scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: 120 }}>
        {query ? (
          <section style={{ padding: '8px 16px 24px', display: 'grid', gap: 12 }}>
            <SectionLabel title={`'${query}' 검색 결과`} sub={`${filtered.length}곳`} />
            {filtered.length === 0 ? (
              <ArchiveCard
                title="아직 맞는 결과가 없어요"
                subtitle="다른 지역이나 빵 이름으로 다시 검색해보세요."
                meta="No result"
                tone="ph-stone"
              />
            ) : filtered.map((b, i) => (
              <RankedFeatureCard
                key={b.id}
                rank={i + 1}
                item={b}
                compact
                onClick={() => openDetail(b.id)}
                action={<SaveStar bakeryId={b.id} size={32} />}
              />
            ))}
          </section>
        ) : (
          <>
            <section style={{ padding: '8px 16px 28px' }}>
              <SectionLabel title="최근 펼친 목차" sub="빠르게 다시 찾기" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {recents.map(r => (
                  <Chip key={r} label={r} variant="outlined" leading={<Icon.clock />} onClick={() => setQuery(r)} />
                ))}
              </div>
            </section>

            <section style={{ padding: '0 16px 30px' }}>
              <SectionLabel title="내 취향으로 찾기" sub="저장 패턴 기반" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {tasteTags.map(t => (
                  <Chip key={t} label={t} active={false} onClick={() => setQuery(t.replace('#', ''))} />
                ))}
              </div>
            </section>

            <section style={{ padding: '0 16px 34px' }}>
              <SectionLabel title="지금 떠오르는 탐험" sub="15분 전 업데이트" />
              <div style={{ display: 'grid', gap: 10 }}>
                {trending.map((label, i) => (
                  <button key={label} onClick={() => setQuery(label)} className="lift" style={{
                    border: '1px solid var(--color-border-subtle)',
                    background: 'var(--color-fill-surface-default)',
                    borderRadius: 18,
                    padding: '13px 14px',
                    display: 'grid',
                    gridTemplateColumns: '28px 1fr auto',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 6px 16px rgba(19,15,13,0.05)',
                  }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: i < 3 ? 'var(--color-text-brand)' : 'var(--color-text-tertiary)' }}>{i + 1}</span>
                    <span style={{ textAlign: 'left', fontSize: 14, fontWeight: 750, color: 'var(--color-text-primary)' }}>{label}</span>
                    <Icon.chevR />
                  </button>
                ))}
              </div>
            </section>

            <section style={{ padding: '0 16px 30px' }}>
              <SectionLabel title="추천 아카이브" sub="저장리스트" />
              <div className="scroll" style={{ display: 'flex', gap: 14, overflowX: 'auto' }}>
                {COLLECTIONS.slice(0, 3).map(c => (
                  <EditorialCard
                    key={c.id}
                    item={{ ph: c.ph }}
                    title={c.name}
                    subtitle={`${c.count}곳을 모아둔 큐레이션`}
                    meta="Archive"
                    style={{ width: 210, flexShrink: 0 }}
                  />
                ))}
              </div>
            </section>

            <section style={{ padding: '0 16px 24px' }}>
              <SectionLabel title="분위기별 색인" sub="장소 감도" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {MOODS.slice(0, 4).map(m => (
                  <ArchiveCard
                    key={m.id}
                    title={m.label}
                    subtitle={`${m.count}개의 장소`}
                    meta="Mood"
                    tone={m.ph}
                    onClick={() => setQuery(m.label)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ title, sub }) {
  return (
    <div style={{ marginBottom: 13, display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 12 }}>
      <div style={{ fontSize: 16, fontWeight: 850, color: 'var(--color-text-primary)' }}>{title}</div>
      {sub && <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--color-text-tertiary)' }}>{sub}</div>}
    </div>
  );
}

function highlight(text: string, q: string): ReactNode {
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

export { ScreenSearch };
