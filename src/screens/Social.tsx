// @ts-nocheck
// screen-social — exploration-sharing feed (Threads/Wanted-style)
// Migrated from Gluten-ClaudeDesign/screen-social.jsx.
import { useState } from 'react';
import {
  TopBar, Icon, Chip, Placeholder, MediaSlot, Avatar, Button, SaveStar, getMoodColor, MagazineKicker,
} from '@/components/shared';
import { SOCIAL_POSTS } from '@/data/bakeries';
import type { SocialPost, MoodKey, PhTone } from '@/data/bakeries';

type OpenOverlay = (kind: string, data?: any) => void;

interface ScreenSocialProps {
  openDetail: (id: string) => void;
  openOverlay?: OpenOverlay;
}

interface LocalCommunity {
  id: string;
  name: string;
  ph: PhTone;
  members: string;
  moodKey: MoodKey;
  emoji: string;
  desc: string;
}

const SOCIAL_FILTERS: string[] = ['전체', '오늘 다녀온', '저장 모음', '동네 산책', '메뉴 발견', '분위기'];

// Local communities list — richer shape than the shared COMMUNITIES dataset.
const SOCIAL_COMMUNITIES: LocalCommunity[] = [
  { id: 'c1', name: '소금빵 마니아', ph: 'ph-butter', members: '2,128', moodKey: 'sweet', emoji: '🧈', desc: '성수동과 연남동의 숨겨진 소금빵 맛집을 공유하고 토론하는 빵덕후들의 모임입니다.' },
  { id: 'c2', name: '주말 빵 산책', ph: 'ph-wheat', members: '892', moodKey: 'healthy', emoji: '🚶', desc: '주말 아침, 산책하며 들르기 좋은 조용하고 담백한 동네 빵집을 탐험합니다.' },
  { id: 'c3', name: '캄파뉴 클럽', ph: 'ph-crust', members: '443', moodKey: 'savory', emoji: '🍞', desc: '천연 발효종을 사용해 시큼하고 고소한 유럽식 식사빵과 캄파뉴 정보를 교류합니다.' },
  { id: 'c4', name: '성수 탐험가', ph: 'ph-stone', members: '1,420', moodKey: 'specialty', emoji: '☕', desc: '성수동의 가장 핫한 신상 베이커리 카페와 한정판 디저트를 발 빠르게 찾아갑니다.' },
  { id: 'c5', name: '디저트 새로 열린', ph: 'ph-rose', members: '278', moodKey: 'pixel', emoji: '🍰', desc: '계절 과일 타르트, 밀푀유, 푸딩 등 눈과 입이 모두 즐거운 화려한 디저트를 다룹니다.' },
];

function ScreenSocial({ openDetail, openOverlay }: ScreenSocialProps) {
  const [filter, setFilter] = useState<string>('전체');
  const [notif] = useState<boolean>(true);

  return (
    <div className="scroll fade-enter" style={{
      height: '100%', overflowY: 'auto',
      background: 'var(--color-background-normal)',
      paddingBottom: 120,
    }}>
      <TopBar
        title="방문 노트"
        rightActions={[
          {
            icon: (
              <>
                <Icon.bell />
                {notif && (
                  <span style={{
                    position: 'absolute', top: 0, right: 0,
                    width: 7, height: 7, borderRadius: 99, background: '#FF5E00',
                    border: '1.5px solid #fff',
                  }}/>
                )}
              </>
            ),
            onClick: () => openOverlay && openOverlay('notifications')
          },
          {
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M14 4l6 6-11 11H3v-6L14 4z" strokeLinejoin="round"/>
              </svg>
            ),
            onClick: () => openOverlay && openOverlay('postWrite')
          }
        ]}
      />
      <div style={{ paddingTop: 92 }} />

      <section style={{ padding: '0 20px 18px' }}>
        <MagazineKicker>Community journal</MagazineKicker>
        <div style={{
          marginTop: 7,
          fontFamily: 'var(--font-display)',
          fontSize: 27,
          lineHeight: '34px',
          fontWeight: 850,
          color: 'var(--color-text-primary)',
        }}>
          사람들이 남긴<br />동네 빵집의 장면들.
        </div>
      </section>

      {/* Filter chips */}
      <div className="scroll" style={{
        display: 'flex', gap: 8, padding: '0 20px 18px', overflowX: 'auto',
      }}>
        {SOCIAL_FILTERS.map(f => (
          <Chip key={f} label={f} active={filter === f}
            onClick={() => setFilter(f)} style={{ flexShrink: 0 }}/>
        ))}
      </div>

      {/* Communities + activity row */}
      <div className="scroll" style={{
        display: 'flex', gap: 14, padding: '4px 20px 24px', overflowX: 'auto',
      }}>
        {/* Create */}
        <div onClick={() => openOverlay && openOverlay('postWrite')} style={{ flexShrink: 0, textAlign: 'center', cursor: 'pointer' }} className="lift">
          <div style={{
            width: 64, height: 64, borderRadius: 99,
            background: 'var(--color-background-alternative)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-normal)',
          }}>
            <Icon.plus/>
          </div>
          <div style={{
            marginTop: 6, fontSize: 11, fontWeight: 600,
            color: 'var(--color-text-alternative)',
            maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>새 탐험</div>
        </div>
        {SOCIAL_COMMUNITIES.map(c => (
          <div key={c.id} onClick={() => openOverlay && openOverlay('communityDetail', c)} style={{ flexShrink: 0, textAlign: 'center', cursor: 'pointer' }} className="lift">
            <div style={{
              width: 64, height: 64, borderRadius: 99, padding: 2,
              background: getMoodColor(c.moodKey),
            }}>
              <Placeholder tone={c.ph} style={{
                width: '100%', height: '100%', borderRadius: 99,
                border: '2px solid #fff',
              }}/>
            </div>
            <div style={{
              marginTop: 6, fontSize: 11, fontWeight: 600,
              color: 'var(--color-text-strong)',
              maxWidth: 72, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{c.name}</div>
            <div style={{
              fontSize: 10, color: 'var(--color-text-alternative)', fontWeight: 500,
            }}>{c.members}명</div>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div style={{
        display: 'grid', gap: 16, padding: '0 16px',
      }}>
        {SOCIAL_POSTS.map((p, i) => (
          <Post key={p.id} post={p} openDetail={openDetail} openOverlay={openOverlay}
            divider={i < SOCIAL_POSTS.length - 1}/>
        ))}
      </div>
    </div>
  );
}

interface PostProps {
  post: SocialPost;
  openDetail: (id: string) => void;
  openOverlay?: OpenOverlay;
  divider: boolean;
}

function Post({ post, openDetail, openOverlay, divider }: PostProps) {
  const [liked, setLiked] = useState<boolean>(false);
  const [follow, setFollow] = useState<boolean>(false);
  const handleUserClick = () => openOverlay && openOverlay('userProfile', post.user);
  const handlePostClick = () => openOverlay && openOverlay('postDetail', post.id);

  return (
    <article style={{
      padding: 16,
      borderRadius: 26,
      background: 'var(--color-fill-surface-default)',
      border: '1px solid var(--color-border-subtle)',
      boxShadow: '0 12px 28px rgba(19,15,13,0.07)',
      overflow: 'hidden',
    }}>
      {/* User row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Avatar
          tone={post.avatarPh}
          label={post.avatarChar}
          onClick={handleUserClick}
          style={{ width: 38, height: 38 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span onClick={handleUserClick} style={{
              fontSize: 14, fontWeight: 700, color: 'var(--color-text-strong)',
              letterSpacing: '-0.008em', cursor: 'pointer'
            }}>{post.user}</span>
            <span style={{ fontSize: 11.5, color: 'var(--color-text-alternative)' }}>
              · {post.time}
            </span>
          </div>
          <div onClick={() => openDetail(post.bakeryId)} className="lift" style={{
            marginTop: 2, fontSize: 12,
            color: 'var(--color-text-alternative)',
            display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer',
          }}>
            <span style={{
              width: 14, height: 14, borderRadius: 99,
              background: '#00BF40',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2.5l2.9 6.5 7 .7-5.3 4.8 1.6 6.9L12 17.8 5.8 21.4l1.6-6.9L2.1 9.7l7-.7L12 2.5z"/>
              </svg>
            </span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-normal)' }}>{post.bakeryName}</span>
            <span> · {post.region}</span>
          </div>
        </div>
        <Button
          label={follow ? '팔로잉' : '팔로우'}
          onClick={() => setFollow(!follow)}
          variant={follow ? 'outlined' : 'solid'}
          color={follow ? 'assistive' : 'primary'}
          size="small"
        />
      </div>

      {/* Media */}
      <PostMedia post={post} onClick={handlePostClick}/>

      {/* Text */}
      <p onClick={handlePostClick} style={{
        margin: '14px 2px 0',
        fontSize: 14.5, lineHeight: '22px', fontWeight: 500,
        color: 'var(--color-text-normal)',
        textWrap: 'pretty', cursor: 'pointer'
      }}>{post.text}</p>

      {/* Mood tag */}
      {post.mood && (
        <div style={{ marginTop: 10 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, color: 'var(--color-primary-normal)',
          }}>#{post.mood.replace(/ /g, '')}</span>
        </div>
      )}

      {/* Actions */}
      <div style={{
        marginTop: 14, display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <button onClick={() => setLiked(!liked)} className="lift" style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 5, padding: 0,
          color: liked ? '#E52222' : 'var(--color-text-alternative)',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        }}>
          {Icon.heart(liked)} {post.saves + (liked ? 1 : 0)}
        </button>
        <button onClick={handlePostClick} className="lift" style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 5, padding: 0,
          color: 'var(--color-text-alternative)',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
        }}>
          <Icon.bubble/> {post.comments}
        </button>
        <button style={{
          border: 'none', background: 'transparent', cursor: 'pointer',
          padding: 0,
          color: 'var(--color-text-alternative)',
        }}>
          <Icon.share/>
        </button>
        <div style={{ flex: 1 }}/>
        <SaveStar bakeryId={post.bakeryId} size={32}/>
      </div>
    </article>
  );
}

interface PostMediaProps {
  post: SocialPost;
  onClick?: () => void;
}

function PostMedia({ post, onClick }: PostMediaProps) {
  const { images, imageUrls, layout } = post;
  if (layout === 'tall') {
    return <MediaSlot imageUrl={imageUrls?.[0]} tone={images[0]} onClick={onClick} aspectRatio="20 / 21" style={{
      width: '100%', aspectRatio: '20 / 21', borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
    }}/>;
  }
  if (layout === 'medium') {
    return <MediaSlot imageUrl={imageUrls?.[0]} tone={images[0]} onClick={onClick} aspectRatio="4 / 3" style={{
      width: '100%', aspectRatio: '4/3', borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
    }}/>;
  }
  if (layout === 'large') {
    return (
      <div onClick={onClick} className="lift" style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 4, cursor: 'pointer',
        aspectRatio: '201 / 160',
      }}>
        <MediaSlot imageUrl={imageUrls?.[0]} tone={images[0]} overlay="none" style={{ height: '100%', borderRadius: 18, overflow: 'hidden' }}/>
        <MediaSlot imageUrl={imageUrls?.[1]} tone={images[1]} overlay="none" style={{ height: '100%', borderRadius: 18, overflow: 'hidden' }}/>
      </div>
    );
  }
  if (layout === 'grid') {
    return (
      <div onClick={onClick} className="lift" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
        gap: 4, cursor: 'pointer', aspectRatio: '4 / 3',
      }}>
        <MediaSlot imageUrl={imageUrls?.[0]} tone={images[0]} overlay="none" style={{
          gridRow: '1 / span 2', borderRadius: 18, overflow: 'hidden', height: '100%',
        }}/>
        <MediaSlot imageUrl={imageUrls?.[1]} tone={images[1]} overlay="none" style={{ borderRadius: 18, overflow: 'hidden', height: '100%' }}/>
        <MediaSlot imageUrl={imageUrls?.[2]} tone={images[2]} overlay="none" style={{ borderRadius: 18, overflow: 'hidden', height: '100%' }}/>
      </div>
    );
  }
  return null;
}

export { ScreenSocial };
