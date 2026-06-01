// @ts-nocheck
import { useState } from 'react';
import {
  TopBar, Icon, SegmentedControl, SaveStar, Button, Chip,
  CoverStoryCard, EditorialCard, RankedFeatureCard, ArchiveCard, MagazineKicker,
} from '@/components/shared';
import { BAKERIES, COLLECTIONS, BREAD_TYPES, MOODS } from '@/data/bakeries';

function ScreenExplore({ openDetail, openOverlay, onSearch }) {
  const [exploreTab, setExploreTab] = useState('curation');
  const cover = BAKERIES[7];

  return (
    <div className="scroll fade-enter" style={{
      height: '100%', overflowY: 'auto',
      background: 'var(--color-fill-surface-canvas)',
      paddingBottom: 132,
    }}>
      <TopBar
        variant="logo"
        rightActions={[
          { icon: <Icon.search />, onClick: () => onSearch && onSearch() },
          { icon: <Icon.bell />, onClick: () => openOverlay && openOverlay('notifications') },
        ]}
      />
      <div style={{ paddingTop: 94 }} />

      <section style={{ padding: '0 18px 18px' }}>
        <MagazineKicker>Gluten editorial</MagazineKicker>
        <div style={{
          marginTop: 7,
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          lineHeight: '34px',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
        }}>
          오늘 먹을 빵은<br />장소의 분위기까지 고릅니다.
        </div>
      </section>

      <div style={{ padding: '0 16px 24px' }}>
        <SegmentedControl
          options={[
            { value: 'curation', label: '에디터 픽' },
            { value: 'trend', label: '랭킹 노트' },
          ]}
          selected={exploreTab}
          onChange={setExploreTab}
        />
      </div>

      {exploreTab === 'curation' ? (
        <CurationView cover={cover} openDetail={openDetail} openOverlay={openOverlay} onSearch={onSearch} />
      ) : (
        <TrendView openDetail={openDetail} onSearch={onSearch} />
      )}
    </div>
  );
}

function CurationView({ cover, openDetail, openOverlay, onSearch }) {
  const themes = [
    { label: '햇살 좋은', query: '햇살', item: BAKERIES[0], copy: '오전 창가 좌석이 좋은 곳' },
    { label: '조용한 오후', query: '조용한', item: BAKERIES[4], copy: '혼자 천천히 머무는 코스' },
    { label: '시즌 페이스트리', query: '페이스트리', item: BAKERIES[7], copy: '이번 달만 만나는 메뉴' },
  ];

  return (
    <>
      <section style={{ padding: '0 16px 34px' }}>
        <CoverStoryCard
          item={cover}
          kicker="오늘의 커버"
          title={cover.name}
          subtitle={`${cover.region} · ${cover.signature}`}
          note="월간 시즌 페이스트리만 다루는 작은 실험실. 저장 패턴상 달콤한 향보다 '한정 메뉴'에 반응하는 사람에게 잘 맞아요."
          onClick={() => openDetail(cover.id)}
          action={<SaveStar bakeryId={cover.id} size={40} dark />}
        />
      </section>

      <SectionHeader title="취향별 큐레이션" action="검색으로 보기" onAction={() => onSearch && onSearch('성수')} />
      <div className="scroll" style={{ display: 'flex', gap: 14, padding: '0 16px 36px', overflowX: 'auto' }}>
        {themes.map(t => (
          <EditorialCard
            key={t.label}
            item={t.item}
            title={t.label}
            subtitle={t.copy}
            meta={`${t.item.region} · {${t.item.tasteFit}% fit}`.replace('{', '').replace('}', '')}
            onClick={() => onSearch && onSearch(t.query)}
            style={{ width: 218, flexShrink: 0 }}
            imageRatio="4 / 5"
          />
        ))}
      </div>

      <SectionHeader title="에디터가 고른 저장리스트" action="전체" onAction={() => openOverlay && openOverlay('collection', COLLECTIONS[0].id)} />
      <div className="scroll" style={{ display: 'flex', gap: 14, padding: '0 16px 38px', overflowX: 'auto' }}>
        {COLLECTIONS.map(c => (
          <ArchiveCard
            key={c.id}
            title={c.name}
            subtitle={`${c.count}곳의 분위기와 대표 메뉴를 묶었어요.`}
            meta="Archive"
            tone={c.ph}
            onClick={() => openOverlay && openOverlay('collection', c.id)}
            style={{ width: 250, flexShrink: 0 }}
          />
        ))}
      </div>

      <SectionHeader title="빵 종류로 훑어보기" />
      <div style={{ padding: '0 16px 38px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {BREAD_TYPES.concat(MOODS.slice(0, 4)).map(item => (
          <Chip key={item.id} label={item.label} variant="outlined" onClick={() => onSearch && onSearch(item.label)} />
        ))}
      </div>
    </>
  );
}

function TrendView({ openDetail, onSearch }) {
  const ranked = BAKERIES.slice().sort((a, b) => b.saves - a.saves);
  return (
    <>
      <section style={{ padding: '0 16px 24px' }}>
        <div style={{
          padding: 20,
          borderRadius: 28,
          background: 'var(--color-fill-surface-inverse)',
          color: 'var(--color-text-inverse)',
          boxShadow: '0 18px 40px rgba(19,15,13,0.18)',
        }}>
          <MagazineKicker inverse>Ranking note</MagazineKicker>
          <div style={{ marginTop: 8, fontSize: 24, lineHeight: '31px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            저장 수가 빠르게 오른<br />이번 주 베이커리.
          </div>
          <div style={{ marginTop: 10, fontSize: 13, lineHeight: '20px', color: 'rgba(255,255,255,0.68)' }}>
            랭킹은 저장, 거리, 취향 적합도를 섞어 매거진식으로 다시 정렬했어요.
          </div>
        </div>
      </section>

      <div style={{ padding: '0 16px 16px', display: 'grid', gap: 12 }}>
        {ranked.map((b, i) => (
          <RankedFeatureCard
            key={b.id}
            rank={i + 1}
            item={b}
            onClick={() => openDetail(b.id)}
            action={<SaveStar bakeryId={b.id} size={34} />}
          />
        ))}
      </div>

      <div style={{ padding: '6px 16px 24px' }}>
        <Button label="지역별 랭킹 검색" variant="outlined" color="assistive" style={{ width: '100%' }} onClick={() => onSearch && onSearch('랭킹')} />
      </div>
    </>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ padding: '0 18px 16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <MagazineKicker>Curated section</MagazineKicker>
        <h2 style={{
          margin: '5px 0 0',
          fontFamily: 'var(--font-display)',
          fontSize: 21,
          lineHeight: '27px',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
        }}>{title}</h2>
      </div>
      {action && (
        <button onClick={onAction} style={{
          border: 'none',
          background: 'transparent',
          color: 'var(--color-text-brand)',
          fontSize: 12.5,
          fontWeight: 800,
          fontFamily: 'inherit',
          cursor: 'pointer',
          padding: '0 0 4px',
        }}>{action}</button>
      )}
    </div>
  );
}

export { ScreenExplore };
