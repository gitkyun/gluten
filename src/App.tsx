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

function App() {
  const [onboarded, setOnboarded] = useState<boolean>(false);
  const [tab, setTab] = useState<Tab>('explore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [overlayStack, setOverlayStack] = useState<OverlayItem[]>([]);
  const [locationAsked, setLocationAsked] = useState<boolean>(false);

  const openOverlay = (kind: string, data?: any) =>
    setOverlayStack(prev => [...prev, { kind, data }]);
  const closeOverlay = () => setOverlayStack(prev => prev.slice(0, -1));

  const openDetail = (id: string) => openOverlay('detail', id);

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
                    onSearch={(q: string) => { setSearchQuery(q || ''); setTab('search'); }}
                  />
                </div>
                <div style={{ display: tab === 'near' ? 'block' : 'none', position: 'absolute', inset: 0 }}>
                  <ScreenNear openDetail={openDetail} />
                </div>
                <div style={{ display: tab === 'social' ? 'block' : 'none', position: 'absolute', inset: 0 }}>
                  <ScreenSocial openDetail={openDetail} openOverlay={openOverlay} />
                </div>
                <div style={{ display: tab === 'search' ? 'block' : 'none', position: 'absolute', inset: 0 }}>
                  <ScreenSearch query={searchQuery} setQuery={setSearchQuery} openDetail={openDetail} />
                </div>
                <div style={{ display: tab === 'profile' ? 'block' : 'none', position: 'absolute', inset: 0 }}>
                  <ScreenProfile openDetail={openDetail} openOverlay={openOverlay} />
                </div>
              </div>

              {/* Bottom Nav (hidden when an overlay is open) */}
              {overlayStack.length === 0 && (
                tab === 'search' ? (
                  <SearchBottomBar query={searchQuery} setQuery={setSearchQuery} onBack={() => setTab('explore')} />
                ) : (
                  <BottomNav tab={tab} setTab={setTab} onSearch={() => setTab('search')} />
                )
              )}

              {/* Save toast (floats above bottom nav) */}
              <SaveToast />

              {/* Save Folder Sheet (always mounted, listens for pendingSave) */}
              <SaveFolderSheet />

              {/* Overlays stack */}
              {overlayStack.map((item, idx) => {
                const key = `${item.kind}-${idx}-${JSON.stringify(item.data || '')}`;
                const closeCurrent = () => {
                  setOverlayStack(prev => prev.slice(0, -1));
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
