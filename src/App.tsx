// App.tsx — Gluten root with onboarding + tabs + overlays.
// Migrated from Gluten-ClaudeDesign/app.jsx. The legacy IOSDevice wrapper has
// been replaced by an inline container <div> (option 1 — keeps the existing
// phone column layout from #root in app.css; no other layout changes).

import { useState, useEffect } from 'react';
import {
  SaveProvider, BottomNav, SearchBottomBar, SaveToast, useSave,
} from '@/components/shared';
import { ScreenOnboarding } from '@/screens/Onboarding';
import { ScreenExplore } from '@/screens/Explore';
import { ScreenNear } from '@/screens/Near';
import { ScreenSocial } from '@/screens/Social';
import { ScreenSearch } from '@/screens/Search';
import { ScreenProfile } from '@/screens/Profile';
import { ScreenDetail } from '@/screens/Detail';
import {
  SaveFolderSheet,
  ScreenNotifications, ScreenSettings, ScreenTasteReport,
  ScreenPostWrite, ScreenReviewWrite, ScreenLocationPermission,
  ScreenCollectionDetail, ScreenUserProfile, ScreenPostDetail,
  ScreenReviewDetail, ScreenCommunityDetail, ScreenCommunityMap,
  ScreenTasteQuiz, ScreenRankDetail,
} from '@/screens/Overlays';
import { BAKERIES, COLLECTIONS, SOCIAL_POSTS } from '@/data/bakeries';

type Tab = 'explore' | 'near' | 'social' | 'search' | 'profile';

type OverlayItem = { kind: string; data?: any };
type RouteState = {
  tab: Tab;
  query: string;
  routeOverlay?: OverlayItem;
  captureIndex?: boolean;
};

const TAB_PATHS: Record<Tab, string> = {
  explore: '/explore',
  near: '/near',
  social: '/social',
  search: '/search',
  profile: '/profile',
};

const parseRoute = (): RouteState => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const params = new URLSearchParams(window.location.search);
  const historyState = window.history.state || {};
  const baseTab: Tab = historyState.baseTab || 'explore';

  if (path.startsWith('/capture/')) {
    const [, , captureKind, first, second] = path.split('/');
    const decodedFirst = decodeURIComponent(first || '');
    const decodedSecond = decodeURIComponent(second || '');
    const dataByKind: Record<string, any> = {
      notifications: undefined,
      settings: undefined,
      'taste-report': undefined,
      'taste-quiz': undefined,
      'post-write': undefined,
      'location-permission': undefined,
      'rank-detail': { category: decodedFirst || 'all' },
      'save-folder': decodedFirst || 'b1',
      'review-write': decodedFirst || 'b1',
      'user-profile': decodedFirst || '지수',
      post: decodedFirst || 'p1',
      review: { bakeryId: decodedFirst || 'b1', reviewIndex: Number(decodedSecond || 0) },
      community: decodedFirst || 'c1',
      'community-map': decodedFirst || 'c1',
    };
    const kindByPath: Record<string, string> = {
      notifications: 'notifications',
      settings: 'settings',
      'taste-report': 'tasteReport',
      'taste-quiz': 'tasteQuiz',
      'post-write': 'postWrite',
      'location-permission': 'locationPermission',
      'rank-detail': 'rankDetail',
      'save-folder': 'saveFolder',
      'review-write': 'reviewWrite',
      'user-profile': 'userProfile',
      post: 'postDetail',
      review: 'reviewDetail',
      community: 'communityDetail',
      'community-map': 'communityMap',
    };

    return {
      tab: baseTab,
      query: '',
      routeOverlay: { kind: kindByPath[captureKind] || 'notifications', data: dataByKind[captureKind] },
    };
  }

  if (path.startsWith('/bakery/')) {
    return {
      tab: baseTab,
      query: '',
      routeOverlay: { kind: 'detail', data: decodeURIComponent(path.split('/')[2] || '') },
    };
  }

  if (path.startsWith('/collection/')) {
    return {
      tab: baseTab,
      query: '',
      routeOverlay: { kind: 'collection', data: decodeURIComponent(path.split('/')[2] || '') },
    };
  }

  if (path === '/capture') return { tab: 'explore', query: '', captureIndex: true };
  if (path === '/near') return { tab: 'near', query: '' };
  if (path === '/social') return { tab: 'social', query: '' };
  if (path === '/profile') return { tab: 'profile', query: '' };
  if (path === '/search') return { tab: 'search', query: params.get('q') || '' };
  return { tab: 'explore', query: '' };
};

const withCapture = (path: string) => `${path}${path.includes('?') ? '&' : '?'}capture=1`;

const CAPTURE_COMMUNITIES = [
  { id: 'c1', name: '소금빵 마니아', ph: 'ph-butter', members: '2,128', moodKey: 'sweet', emoji: '🧈', desc: '성수동과 연남동의 숨겨진 소금빵 맛집을 공유하고 토론하는 빵덕후들의 모임입니다.' },
  { id: 'c2', name: '주말 빵 산책', ph: 'ph-wheat', members: '892', moodKey: 'healthy', emoji: '🚶', desc: '주말 아침, 산책하며 들르기 좋은 조용하고 담백한 동네 빵집을 탐험합니다.' },
  { id: 'c3', name: '캄파뉴 클럽', ph: 'ph-crust', members: '443', moodKey: 'savory', emoji: '🍞', desc: '천연 발효종을 사용해 시큼하고 고소한 유럽식 식사빵과 캄파뉴 정보를 교류합니다.' },
  { id: 'c4', name: '성수 탐험가', ph: 'ph-stone', members: '1,420', moodKey: 'specialty', emoji: '☕', desc: '성수동의 가장 핫한 신상 베이커리 카페와 한정판 디저트를 발 빠르게 찾아갑니다.' },
  { id: 'c5', name: '디저트 새로 열린', ph: 'ph-rose', members: '278', moodKey: 'pixel', emoji: '🍰', desc: '계절 과일 타르트, 밀푀유, 푸딩 등 눈과 입이 모두 즐거운 화려한 디저트를 다룹니다.' },
];

const getCaptureCommunity = (id?: string) => (
  CAPTURE_COMMUNITIES.find(c => c.id === id) || CAPTURE_COMMUNITIES[0]
);

const getCommunityRecommended = (id?: string) => {
  if (id === 'c1') return [BAKERIES[0], BAKERIES[3], BAKERIES[6]];
  if (id === 'c2') return [BAKERIES[1], BAKERIES[4], BAKERIES[7]];
  if (id === 'c3') return [BAKERIES[2], BAKERIES[5], BAKERIES[7]];
  if (id === 'c4') return [BAKERIES[0], BAKERIES[1], BAKERIES[3]];
  return BAKERIES.slice(0, 3);
};

function CaptureSaveFolderRoute({ bakeryId }: { bakeryId: string }) {
  const { requestSave } = useSave();

  useEffect(() => {
    requestSave(bakeryId || 'b1');
  }, [bakeryId, requestSave]);

  return null;
}

function CaptureIndex() {
  const sections = [
    {
      title: '메인 탭',
      links: [
        { label: 'Explore', path: '/explore' },
        { label: 'Near', path: '/near' },
        { label: 'Social', path: '/social' },
        { label: 'Search', path: '/search' },
        { label: 'Search - 소금빵 검색', path: '/search?q=소금빵' },
        { label: 'Profile', path: '/profile' },
      ],
    },
    {
      title: '베이커리 상세 전체',
      links: BAKERIES.map(b => ({
        label: `${b.id} · ${b.name} · ${b.region}`,
        path: `/bakery/${b.id}`,
      })),
    },
    {
      title: '컬렉션 상세 전체',
      links: COLLECTIONS.map(c => ({
        label: `${c.id} · ${c.name}`,
        path: `/collection/${c.id}`,
      })),
    },
    {
      title: '게시글이 연결된 장소 상세',
      links: SOCIAL_POSTS.map(p => ({
        label: `${p.id} · ${p.user} 노트 → ${p.bakeryName}`,
        path: `/bakery/${p.bakeryId}`,
      })),
    },
    {
      title: '알림/설정/취향',
      links: [
        { label: '알림 목록', path: '/capture/notifications' },
        { label: '설정', path: '/capture/settings' },
        { label: '취향 리포트', path: '/capture/taste-report' },
        { label: '취향 재분석 퀴즈', path: '/capture/taste-quiz' },
        { label: '위치 권한 시트', path: '/capture/location-permission' },
      ],
    },
    {
      title: '작성/저장 인터랙션',
      links: [
        { label: '새 탐험 공유 작성', path: '/capture/post-write' },
        { label: '저장 폴더 선택 시트', path: '/capture/save-folder/b1' },
        ...BAKERIES.map(b => ({
          label: `리뷰 작성 · ${b.id} · ${b.name}`,
          path: `/capture/review-write/${b.id}`,
        })),
      ],
    },
    {
      title: '소셜 상세 전체',
      links: [
        ...SOCIAL_POSTS.map(p => ({
          label: `게시글 상세 · ${p.id} · ${p.user}`,
          path: `/capture/post/${p.id}`,
        })),
        ...SOCIAL_POSTS.map(p => ({
          label: `유저 프로필 · ${p.user}`,
          path: `/capture/user-profile/${encodeURIComponent(p.user)}`,
        })),
      ],
    },
    {
      title: '리뷰 상세 전체',
      links: BAKERIES.flatMap(b => [0, 1].map(index => ({
        label: `리뷰 상세 · ${b.id} · ${b.name} · ${index + 1}`,
        path: `/capture/review/${b.id}/${index}`,
      }))),
    },
    {
      title: '커뮤니티 상세 전체',
      links: CAPTURE_COMMUNITIES.flatMap(c => [
        {
          label: `커뮤니티 홈 · ${c.id} · ${c.name}`,
          path: `/capture/community/${c.id}`,
        },
        {
          label: `커뮤니티 지도 · ${c.id} · ${c.name}`,
          path: `/capture/community-map/${c.id}`,
        },
      ]),
    },
    {
      title: '랭킹 상세 전체',
      links: [
        { label: '전체 랭킹', path: '/capture/rank-detail/all' },
        { label: '소금빵 TOP', path: '/capture/rank-detail/salt' },
        { label: '식사빵/캄파뉴', path: '/capture/rank-detail/crust' },
        { label: '디저트/타르트', path: '/capture/rank-detail/dessert' },
      ],
    },
  ];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflowY: 'auto',
      background: 'var(--color-background-normal)',
      padding: '28px 20px 44px',
      color: 'var(--color-label-normal)',
    }}>
      <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--color-fill-brand-default)',
          textTransform: 'uppercase',
          letterSpacing: 0,
        }}>Capture index</div>
        <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.05, letterSpacing: 0 }}>
          Gluten 전체 캡쳐 페이지
        </h1>
        <p style={{
          margin: 0,
          color: 'var(--color-label-alternative)',
          fontSize: 14,
          lineHeight: 1.55,
        }}>
          모든 링크는 온보딩을 건너뛰는 캡쳐 모드로 열립니다. 휴대폰에서도 바로 각 화면을 캡쳐할 수 있어요.
        </p>
      </div>

      <div style={{ display: 'grid', gap: 18 }}>
        {sections.map(section => (
          <section key={section.title} style={{ display: 'grid', gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 16, letterSpacing: 0 }}>{section.title}</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {section.links.map(link => (
                <a
                  key={`${section.title}-${link.label}`}
                  href={withCapture(link.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    minHeight: 48,
                    padding: '12px 14px',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-xs, 8px)',
                    background: 'var(--color-background-elevated)',
                    color: 'var(--color-label-normal)',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 700,
                    boxShadow: 'var(--elevation-shadow-1)',
                  }}
                >
                  <span>{link.label}</span>
                  <span style={{
                    color: 'var(--color-label-assistive)',
                    fontSize: 12,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>{withCapture(link.path)}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState<RouteState>(() => parseRoute());
  const isCaptureMode = (
    route.captureIndex ||
    window.location.pathname.startsWith('/capture') ||
    new URLSearchParams(window.location.search).get('capture') === '1'
  );
  const [onboarded, setOnboarded] = useState<boolean>(() => (
    isCaptureMode || window.localStorage.getItem('gluten:onboarded') === '1'
  ));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [overlayStack, setOverlayStack] = useState<OverlayItem[]>([]);
  const [locationAsked, setLocationAsked] = useState<boolean>(false);

  const tab = route.tab;
  const routeOverlay = route.routeOverlay;
  const completeOnboarding = () => {
    window.localStorage.setItem('gluten:onboarded', '1');
    setOnboarded(true);
  };

  const syncRoute = () => setRoute(parseRoute());
  const navigate = (path: string, state: Record<string, any> = {}) => {
    window.history.pushState(state, '', path);
    syncRoute();
  };
  const replace = (path: string, state: Record<string, any> = {}) => {
    window.history.replaceState(state, '', path);
    syncRoute();
  };
  const navigateTab = (nextTab: Tab) => {
    setOverlayStack([]);
    navigate(TAB_PATHS[nextTab]);
  };

  const openOverlay = (kind: string, data?: any) => {
    if (kind === 'collection') {
      navigate(`/collection/${encodeURIComponent(data)}`, { baseTab: tab });
      return;
    }
    setOverlayStack(prev => [...prev, { kind, data }]);
  };
  const closeOverlay = () => setOverlayStack(prev => prev.slice(0, -1));

  const openDetail = (id: string) =>
    navigate(`/bakery/${encodeURIComponent(id)}`, { baseTab: tab });
  const closeRouteOverlay = () => {
    setOverlayStack([]);
    navigate(TAB_PATHS[tab] || '/explore');
  };

  useEffect(() => {
    const onPopState = () => syncRoute();
    window.addEventListener('popstate', onPopState);
    if (window.location.pathname === '/') {
      window.history.replaceState({}, '', '/explore');
      syncRoute();
    }
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (route.tab === 'search') {
      setSearchQuery(route.query);
    }
  }, [route.tab, route.query]);

  useEffect(() => {
    if (isCaptureMode && !onboarded) setOnboarded(true);
  }, [isCaptureMode, onboarded]);

  // Ask location permission first time user enters Near tab
  useEffect(() => {
    if (onboarded && tab === 'near' && !locationAsked) {
      const t = setTimeout(() => openOverlay('locationPermission'), 500);
      return () => clearTimeout(t);
    }
  }, [tab, onboarded, locationAsked]);

  return (
    <SaveProvider>
      {/* Inline replacement for the former IOSDevice container.
          Fills the parent phone column (#root in app.css). */}
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-background-normal)',
        fontFamily: 'var(--font-sans)',
        WebkitFontSmoothing: 'antialiased',
      }}>
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
          background: 'var(--color-background-normal)',
        }} data-screen-label={onboarded ? `app/${tab}` : 'app/onboarding'}>

          {/* Onboarding */}
          {route.captureIndex && (
            <CaptureIndex />
          )}

          {!route.captureIndex && !onboarded && (
            <ScreenOnboarding onComplete={completeOnboarding} />
          )}

          {/* Main app */}
          {!route.captureIndex && onboarded && (
            <>
              {/* Tab screens (kept mounted to preserve scroll positions) */}
              <div style={{ position: 'absolute', inset: 0 }}>
                <div style={{ display: tab === 'explore' ? 'block' : 'none', position: 'absolute', inset: 0 }}>
                  <ScreenExplore
                    openDetail={openDetail}
                    openOverlay={openOverlay}
                    onSearch={(q: string) => {
                      const nextQuery = q || '';
                      setSearchQuery(nextQuery);
                      navigate(`/search${nextQuery ? `?q=${encodeURIComponent(nextQuery)}` : ''}`);
                    }}
                  />
                </div>
                <div style={{ display: tab === 'near' ? 'block' : 'none', position: 'absolute', inset: 0 }}>
                  <ScreenNear openDetail={openDetail} />
                </div>
                <div style={{ display: tab === 'social' ? 'block' : 'none', position: 'absolute', inset: 0 }}>
                  <ScreenSocial openDetail={openDetail} openOverlay={openOverlay} />
                </div>
                <div style={{ display: tab === 'search' ? 'block' : 'none', position: 'absolute', inset: 0 }}>
                  <ScreenSearch
                    query={searchQuery}
                    setQuery={(q: string) => {
                      setSearchQuery(q);
                      replace(`/search${q ? `?q=${encodeURIComponent(q)}` : ''}`);
                    }}
                    openDetail={openDetail}
                  />
                </div>
                <div style={{ display: tab === 'profile' ? 'block' : 'none', position: 'absolute', inset: 0 }}>
                  <ScreenProfile openDetail={openDetail} openOverlay={openOverlay} />
                </div>
              </div>

              {/* Bottom Nav (hidden when an overlay is open) */}
              {!routeOverlay && overlayStack.length === 0 && (
                tab === 'search' ? (
                  <SearchBottomBar
                    query={searchQuery}
                    setQuery={(q: string) => {
                      setSearchQuery(q);
                      replace(`/search${q ? `?q=${encodeURIComponent(q)}` : ''}`);
                    }}
                    onBack={() => navigateTab('explore')}
                  />
                ) : (
                  <BottomNav tab={tab} setTab={navigateTab} onSearch={() => navigateTab('search')} />
                )
              )}

              {/* Save toast (floats above bottom nav) */}
              <SaveToast />

              {/* Save Folder Sheet (always mounted, listens for pendingSave) */}
              <SaveFolderSheet />

              {/* Overlays stack */}
              {[
                ...(routeOverlay ? [routeOverlay] : []),
                ...overlayStack,
              ].map((item, idx) => {
                const key = `${item.kind}-${idx}-${JSON.stringify(item.data || '')}`;
                const isRouteOverlay = routeOverlay && idx === 0;
                const closeCurrent = () => {
                  if (isRouteOverlay) {
                    closeRouteOverlay();
                  } else {
                    setOverlayStack(prev => prev.slice(0, -1));
                  }
                };

                if (item.kind === 'detail') {
                  return (
                    <ScreenDetail
                      key={key}
                      bakeryId={item.data}
                      onClose={closeCurrent}
                      openDetail={openDetail}
                      openReviewWrite={(id: string) => openOverlay('reviewWrite', id)}
                      openOverlay={openOverlay}
                    />
                  );
                }
                if (item.kind === 'notifications') {
                  return <ScreenNotifications key={key} onClose={closeCurrent} openDetail={openDetail} />;
                }
                if (item.kind === 'settings') {
                  return (
                    <ScreenSettings
                      key={key}
                      onClose={closeCurrent}
                      onLogout={() => {
                        setOverlayStack([]);
                        window.localStorage.removeItem('gluten:onboarded');
                        setOnboarded(false);
                      }}
                      openOverlay={openOverlay}
                    />
                  );
                }
                if (item.kind === 'tasteReport') {
                  return <ScreenTasteReport key={key} onClose={closeCurrent} openDetail={openDetail} openOverlay={openOverlay} />;
                }
                if (item.kind === 'postWrite') {
                  return <ScreenPostWrite key={key} onClose={closeCurrent} />;
                }
                if (item.kind === 'reviewWrite') {
                  return <ScreenReviewWrite key={key} bakeryId={item.data} onClose={closeCurrent} />;
                }
                if (item.kind === 'saveFolder') {
                  return <CaptureSaveFolderRoute key={key} bakeryId={item.data} />;
                }
                if (item.kind === 'collection') {
                  return <ScreenCollectionDetail key={key} collectionId={item.data} onClose={closeCurrent} openDetail={openDetail} openOverlay={openOverlay} />;
                }
                if (item.kind === 'locationPermission') {
                  return (
                    <ScreenLocationPermission
                      key={key}
                      onAllow={() => { setLocationAsked(true); closeCurrent(); }}
                      onDeny={() => { setLocationAsked(true); closeCurrent(); }}
                    />
                  );
                }
                if (item.kind === 'userProfile') {
                  return <ScreenUserProfile key={key} username={item.data} onClose={closeCurrent} openDetail={openDetail} openOverlay={openOverlay} />;
                }
                if (item.kind === 'postDetail') {
                  return <ScreenPostDetail key={key} postId={item.data} onClose={closeCurrent} openDetail={openDetail} openOverlay={openOverlay} />;
                }
                if (item.kind === 'reviewDetail') {
                  return <ScreenReviewDetail key={key} bakeryId={item.data.bakeryId} reviewIndex={item.data.reviewIndex} onClose={closeCurrent} openDetail={openDetail} />;
                }
                if (item.kind === 'communityDetail') {
                  const community = typeof item.data === 'string' ? getCaptureCommunity(item.data) : item.data;
                  return <ScreenCommunityDetail key={key} community={community} onClose={closeCurrent} openDetail={openDetail} openOverlay={openOverlay} />;
                }
                if (item.kind === 'communityMap') {
                  const community = typeof item.data === 'string' ? getCaptureCommunity(item.data) : item.data.community;
                  const recommended = typeof item.data === 'string' ? getCommunityRecommended(item.data) : item.data.recommended;
                  return <ScreenCommunityMap key={key} community={community} recommended={recommended} onClose={closeCurrent} openDetail={openDetail} />;
                }
                if (item.kind === 'tasteQuiz') {
                  return <ScreenTasteQuiz key={key} onClose={closeCurrent} />;
                }
                if (item.kind === 'rankDetail') {
                  return <ScreenRankDetail key={key} initialCategory={item.data?.category} onClose={closeCurrent} openDetail={openDetail} />;
                }
                return null;
              })}
            </>
          )}
        </div>
      </div>
    </SaveProvider>
  );
}

export default App;
