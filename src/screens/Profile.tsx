// @ts-nocheck
import { useState } from 'react';
import {
  TopBar, Icon, Button, IconButton, Tabs, SaveStar, useSave,
  MediaSlot, ArchiveCard, RankedFeatureCard, FieldNoteCard, MagazineKicker, Avatar,
} from '@/components/shared';
import { BAKERIES, COLLECTIONS } from '@/data/bakeries';

function ScreenProfile({ openDetail, openOverlay }) {
  const [tab, setTab] = useState('profile');
  const { saved } = useSave();

  return (
    <div className="scroll fade-enter" style={{
      height: '100%', overflowY: 'auto',
      background: 'var(--color-fill-surface-canvas)',
      paddingBottom: 132,
    }}>
      <TopBar
        title="마이"
        rightActions={[
          { icon: <Icon.bell />, onClick: () => openOverlay && openOverlay('notifications') },
          {
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>
              </svg>
            ),
            onClick: () => openOverlay && openOverlay('settings')
          }
        ]}
      />
      <div style={{ paddingTop: 94 }} />

      <section style={{ padding: '0 16px 20px' }}>
        <div style={{
          borderRadius: 30,
          overflow: 'hidden',
          background: 'var(--color-fill-surface-default)',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: '0 16px 38px rgba(19,15,13,0.10)',
        }}>
          <MediaSlot tone="ph-rose" aspectRatio="16 / 8" overlay="side">
            <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, color: '#fff' }}>
              <MagazineKicker inverse>Personal archive</MagazineKicker>
              <div style={{ marginTop: 6, fontSize: 30, lineHeight: '36px', fontWeight: 850, fontFamily: 'var(--font-display)' }}>김기현</div>
              <div style={{ marginTop: 6, fontSize: 13, fontWeight: 650, color: 'rgba(255,255,255,0.82)' }}>탐험가 · 디자인 · Lv. 빵수저</div>
            </div>
          </MediaSlot>
          <div style={{ padding: '18px 18px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              <Stat n={saved.size} label="저장" />
              <Stat n="12" label="방문" />
              <Stat n="4" label="컬렉션" />
              <Stat n="86" label="팔로워" />
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 8 }}>
              <Button label="프로필 편집" variant="outlined" color="assistive" style={{ flex: 1 }} />
              <IconButton icon={<Icon.share />} variant="outlined" size="large" style={{ borderRadius: 16 }} />
            </div>
          </div>
        </div>
      </section>

      <div style={{
        position: 'sticky', top: 0, zIndex: 5,
        background: 'rgba(250,250,250,0.92)',
        backdropFilter: 'blur(16px)',
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

      <div key={tab} className="fade-enter" style={{ padding: '18px 16px 28px' }}>
        {tab === 'profile' && <TabProfileInfo openDetail={openDetail} openOverlay={openOverlay} />}
        {tab === 'collection' && <TabCollections openCollection={(id) => openOverlay && openOverlay('collection', id)} />}
        {tab === 'activity' && <TabActivity openDetail={openDetail} />}
        {tab === 'review' && <TabMyReviews openDetail={openDetail} />}
      </div>
    </div>
  );
}

function Stat({ n, label }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 4px', borderRadius: 16, background: 'var(--color-fill-surface-subtle)' }}>
      <div style={{ fontSize: 19, fontWeight: 850, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>{n}</div>
      <div style={{ marginTop: 3, fontSize: 10.5, fontWeight: 700, color: 'var(--color-text-tertiary)' }}>{label}</div>
    </div>
  );
}

function TabProfileInfo({ openDetail, openOverlay }) {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <ArchiveCard
        title="묵직한 호밀이 3주째 늘고 있어요."
        subtitle="우드톤 공간 7곳 · 조용한 오후 9곳 · 소금빵 4곳을 저장"
        meta="이번 달 취향 리포트"
        tone="ph-toast"
        onClick={() => openOverlay && openOverlay('tasteReport')}
      />
      <div style={{ padding: 18, borderRadius: 24, background: 'var(--color-fill-surface-default)', border: '1px solid var(--color-border-subtle)' }}>
        <MagazineKicker>Profile note</MagazineKicker>
        <p style={{ margin: '8px 0 0', fontSize: 17, lineHeight: '26px', fontWeight: 750, color: 'var(--color-text-primary)' }}>
          조용한 오후의 우드톤, 묵직한 호밀, 햇살이 비치는 코너 자리를 좋아함.
        </p>
      </div>
      <SectionTitle title="아직 안 가본 저장" />
      {BAKERIES.slice(0, 4).map((b, i) => (
        <RankedFeatureCard key={b.id} rank={i + 1} item={b} onClick={() => openDetail(b.id)} action={<SaveStar bakeryId={b.id} size={32} />} compact />
      ))}
    </div>
  );
}

function TabCollections({ openCollection }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {COLLECTIONS.map(c => (
        <ArchiveCard
          key={c.id}
          title={c.name}
          subtitle={`${c.count} places`}
          meta="Collection"
          tone={c.ph}
          onClick={() => openCollection(c.id)}
        />
      ))}
    </div>
  );
}

function TabActivity({ openDetail }) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <SectionTitle title="최근 탐험 기록" />
      {BAKERIES.slice(2, 6).map((b, i) => (
        <RankedFeatureCard key={b.id} rank={i + 1} item={b} compact onClick={() => openDetail && openDetail(b.id)} action={<Icon.chevR />} />
      ))}
    </div>
  );
}

function TabMyReviews({ openDetail }) {
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <SectionTitle title="방문 노트" />
      {BAKERIES.slice(0, 3).map(b => (
        <FieldNoteCard
          key={b.id}
          avatar={<Avatar label="K" tone="ph-rose" size="small" />}
          title={b.name}
          subtitle={`${b.region} · 저장한 장소`}
          body={`${b.signature} 때문에 다시 가고 싶은 곳. ${b.summary}`}
          imageTone={b.phAlt}
          onClick={() => openDetail && openDetail(b.id)}
          action={<SaveStar bakeryId={b.id} size={30} />}
        />
      ))}
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div>
      <MagazineKicker>Archive section</MagazineKicker>
      <h3 style={{ margin: '5px 0 0', fontSize: 19, lineHeight: '25px', fontWeight: 850, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}>{title}</h3>
    </div>
  );
}

export { ScreenProfile };
