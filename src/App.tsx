// App.tsx — Gluten root with onboarding + tabs + overlays.
// Migrated from Gluten-ClaudeDesign/app.jsx. The legacy IOSDevice wrapper has
// been replaced by an inline container <div> (option 1 — keeps the existing
// phone column layout from #root in app.css; no other layout changes).

import { useState, useEffect } from 'react';
import {
  SaveProvider, BottomNav, SearchBottomBar, SaveToast,
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

type Tab = 'explore' | 'near' | 'social' | 'search' | 'profile';

type OverlayItem = { kind: string; data?: any };
type RouteState = {
  tab: Tab;
  query: string;
  routeOverlay?: OverlayItem;
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

  if (path === '/near') return { tab: 'near', query: '' };
  if (path === '/social') return { tab: 'social', query: '' };
  if (path === '/profile') return { tab: 'profile', query: '' };
  if (path === '/search') return { tab: 'search', query: params.get('q') || '' };
  return { tab: 'explore', query: '' };
};

function App() {
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [route, setRoute] = useState<RouteState>(() => parseRoute());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [overlayStack, setOverlayStack] = useState<OverlayItem[]>([]);
  const [locationAsked, setLocationAsked] = useState<boolean>(false);

  const tab = route.tab;
  const routeOverlay = route.routeOverlay;

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
          {!onboarded && (
            <ScreenOnboarding onComplete={() => setOnboarded(true)} />
          )}

          {/* Main app */}
          {onboarded && (
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
                      onLogout={() => { setOverlayStack([]); setOnboarded(false); }}
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
                  return <ScreenCommunityDetail key={key} community={item.data} onClose={closeCurrent} openDetail={openDetail} openOverlay={openOverlay} />;
                }
                if (item.kind === 'communityMap') {
                  return <ScreenCommunityMap key={key} community={item.data.community} recommended={item.data.recommended} onClose={closeCurrent} openDetail={openDetail} />;
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
