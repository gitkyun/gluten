// bakery-data.jsx — mock bakeries, collections, posts

const BAKERIES = [
  {
    id: 'b1',
    name: '르 파베',
    region: '성수',
    address: '서울 성동구 연무장길 28',
    distance: '320m',
    mood: ['조용한', '우드톤', '햇살'],
    signature: '솔티드 버터 크루아상',
    summary: '아침 햇살 좋은 코너 자리. 페이스트리 향이 천천히 채워지는 곳.',
    tasteFit: 92,
    saves: 1402,
    ph: 'ph-wheat',
    phAlt: 'ph-cream',
    phPerson: 'ph-rose',
    hours: '08:00 — 19:00',
    crowded: 'quiet',
    soldOut: ['에그타르트', '바스크 치즈케이크'],
    breads: [
      { name: '솔티드 버터 크루아상', price: '4,500원', ph: 'ph-butter', popular: true, soldOut: false },
      { name: '뺑오쇼콜라', price: '4,800원', ph: 'ph-crust', popular: false, soldOut: false },
      { name: '바스크 치즈케이크', price: '7,500원', ph: 'ph-amber', popular: true, soldOut: true },
      { name: '캄파뉴', price: '12,000원', ph: 'ph-toast', popular: false, soldOut: false },
      { name: '브리오슈 식빵', price: '13,000원', ph: 'ph-cream', popular: false, soldOut: false },
    ],
    keywords: [
      { label: '버터향이 진해요', count: 312 },
      { label: '오래 머물기 좋아요', count: 248 },
      { label: '혼자 오기 좋아요', count: 196 },
      { label: '햇살이 따뜻해요', count: 154 },
      { label: '재료가 신선해요', count: 122 },
    ],
  },
  {
    id: 'b2', name: '슬로우브레드', region: '연남', address: '서울 마포구 연남로 56',
    distance: '1.2km', mood: ['미니멀', '조용한'], signature: '호밀 사워도우',
    summary: '천천히 발효한 통밀, 단단한 식감의 호밀 사워.', tasteFit: 88,
    saves: 982, ph: 'ph-toast', phAlt: 'ph-crust', phPerson: 'ph-stone',
    hours: '11:00 — 21:00', crowded: 'medium', soldOut: [],
    breads: [], keywords: [],
  },
  {
    id: 'b3', name: '메종 드 비', region: '한남', address: '서울 용산구 이태원로 198',
    distance: '4.8km', mood: ['빈티지', '우드톤'], signature: '시즈널 타르트',
    summary: '계절 과일 타르트 라인업이 매주 바뀌는 곳.', tasteFit: 79,
    saves: 2103, ph: 'ph-rose', phAlt: 'ph-amber', phPerson: 'ph-cream',
    hours: '10:30 — 20:00', crowded: 'busy', soldOut: ['딸기 타르트'],
    breads: [], keywords: [],
  },
  {
    id: 'b4', name: '베이크하우스 청담', region: '청담', address: '서울 강남구 도산대로 88',
    distance: '6.2km', mood: ['모던', '미니멀'], signature: '소금빵',
    summary: '바삭한 겉, 촉촉한 속. 소금빵의 표준을 다시 쓰는 곳.', tasteFit: 85,
    saves: 1856, ph: 'ph-cream', phAlt: 'ph-butter', phPerson: 'ph-stone',
    hours: '08:30 — 20:30', crowded: 'medium', soldOut: [],
    breads: [], keywords: [],
  },
  {
    id: 'b5', name: '코른블루멘', region: '망원', address: '서울 마포구 망원로 12',
    distance: '3.4km', mood: ['아늑한', '햇살'], signature: '독일식 호밀빵',
    summary: '독일식 캄파뉴와 묵직한 호밀 라인업.', tasteFit: 81,
    saves: 743, ph: 'ph-stone', phAlt: 'ph-toast', phPerson: 'ph-sage',
    hours: '09:00 — 19:00', crowded: 'quiet', soldOut: [],
    breads: [], keywords: [],
  },
  {
    id: 'b6', name: '어글리 베이커리', region: '합정', address: '서울 마포구 양화로 45',
    distance: '2.8km', mood: ['빈티지', '아늑한'], signature: '브리오슈 도넛',
    summary: '겉모양은 못생겼지만 속은 가장 부드러운 빵을 만드는 곳.', tasteFit: 76,
    saves: 1289, ph: 'ph-amber', phAlt: 'ph-rose', phPerson: 'ph-wheat',
    hours: '12:00 — 22:00', crowded: 'busy', soldOut: ['브리오슈 도넛'],
    breads: [], keywords: [],
  },
  {
    id: 'b7', name: '노티드 베이커리', region: '안국', address: '서울 종로구 윤보선길 31',
    distance: '5.1km', mood: ['모던', '햇살'], signature: '오트밀 캄파뉴',
    summary: '한옥 골목 끝, 오트와 통곡물 향이 깊은 한 칸.', tasteFit: 90,
    saves: 654, ph: 'ph-sage', phAlt: 'ph-stone', phPerson: 'ph-cream',
    hours: '10:00 — 19:00', crowded: 'quiet', soldOut: [],
    breads: [], keywords: [],
  },
  {
    id: 'b8', name: '먼슬리 페이스트리', region: '성수', address: '서울 성동구 성수일로 20',
    distance: '450m', mood: ['모던', '미니멀'], signature: '월간 시즌 페이스트리',
    summary: '매달 한 가지 페이스트리만 출시하는 한 시즌 베이커리.', tasteFit: 87,
    saves: 2410, ph: 'ph-butter', phAlt: 'ph-amber', phPerson: 'ph-rose',
    hours: '11:00 — 19:00', crowded: 'busy', soldOut: [],
    breads: [], keywords: [],
  },
];

// Index lookup
const BAKERY_BY_ID = Object.fromEntries(BAKERIES.map(b => [b.id, b]));

// Map bakery ids → moodKey (used for marker color, tags, etc.)
const BAKERY_MOOD = {
  b1: 'sweet',     // 르 파베 — 햇살, 버터
  b2: 'healthy',   // 슬로우브레드 — 미니멀, 조용한
  b3: 'savory',    // 메종 드 비 — 빈티지
  b4: 'specialty', // 베이크하우스 청담 — 모던
  b5: 'savory',    // 코른블루멘 — 묵직, 우드
  b6: 'savory',    // 어글리 베이커리 — 빈티지, 아늑한
  b7: 'healthy',   // 노티드 — 한옥, 조용한
  b8: 'pixel',     // 먼슬리 — 한정, 시즈널
};
// Attach moodKey
BAKERIES.forEach(b => { b.moodKey = BAKERY_MOOD[b.id]; });

const COMMUNITIES = [
  { id: 'cm1', name: '소금빵 마니아', ph: 'ph-butter', members: '2.1k', moodKey: 'sweet' },
  { id: 'cm2', name: '주말 빵 산책', ph: 'ph-wheat', members: '892',  moodKey: 'healthy' },
  { id: 'cm3', name: '캄파뉴 클럽', ph: 'ph-crust', members: '443',    moodKey: 'savory' },
  { id: 'cm4', name: '성수 탐험가', ph: 'ph-stone', members: '1.4k',   moodKey: 'pixel' },
  { id: 'cm5', name: '디저트 새로 열린', ph: 'ph-rose', members: '278', moodKey: 'specialty' },
];

const COLLECTIONS = [
  { id: 'c1', name: '성수 빵 산책', count: 8, ph: 'ph-wheat', accent: '#D9B988' },
  { id: 'c2', name: '조용한 오후', count: 12, ph: 'ph-stone', accent: '#B7A78B' },
  { id: 'c3', name: '주말 베이커리', count: 5, ph: 'ph-cream', accent: '#E6C9A1' },
  { id: 'c4', name: '소금빵 비교', count: 6, ph: 'ph-amber', accent: '#B98552' },
];

const MOODS = [
  { id: 'm1', label: '조용한 오후', ph: 'ph-stone', count: 142 },
  { id: 'm2', label: '햇살 좋은', ph: 'ph-butter', count: 98 },
  { id: 'm3', label: '우드톤', ph: 'ph-crust', count: 124 },
  { id: 'm4', label: '미니멀', ph: 'ph-cream', count: 87 },
  { id: 'm5', label: '빈티지', ph: 'ph-rose', count: 64 },
  { id: 'm6', label: '아늑한', ph: 'ph-amber', count: 103 },
];

const BREAD_TYPES = [
  { id: 'bt1', label: '소금빵', ph: 'ph-butter' },
  { id: 'bt2', label: '크루아상', ph: 'ph-amber' },
  { id: 'bt3', label: '베이글', ph: 'ph-toast' },
  { id: 'bt4', label: '캄파뉴', ph: 'ph-crust' },
  { id: 'bt5', label: '브리오슈', ph: 'ph-cream' },
  { id: 'bt6', label: '도넛', ph: 'ph-rose' },
];

const LOCALS = [
  { id: 'l1', label: '성수', count: 86, ph: 'ph-wheat' },
  { id: 'l2', label: '연남', count: 64, ph: 'ph-sage' },
  { id: 'l3', label: '망원', count: 41, ph: 'ph-toast' },
  { id: 'l4', label: '한남', count: 38, ph: 'ph-rose' },
  { id: 'l5', label: '합정', count: 29, ph: 'ph-stone' },
  { id: 'l6', label: '안국', count: 22, ph: 'ph-amber' },
];

const SOCIAL_POSTS = [
  {
    id: 'p1', user: '지수', handle: '@jisoo.crumb', avatarPh: 'ph-rose', avatarChar: '지',
    time: '2시간 전', bakeryId: 'b1', bakeryName: '르 파베', region: '성수',
    text: '햇살이 너무 좋아서 한 시간 더 머물렀어요. 솔티드 버터 크루아상은 11시 전에 가야 함 🥐',
    images: ['ph-wheat', 'ph-cream'],
    layout: 'large',
    saves: 24, comments: 6,
    mood: '햇살 좋은',
  },
  {
    id: 'p2', user: '도윤', handle: '@dy.bake', avatarPh: 'ph-stone', avatarChar: '도',
    time: '5시간 전', bakeryId: 'b5', bakeryName: '코른블루멘', region: '망원',
    text: '독일식 호밀빵 두 덩어리 — 하나는 가족, 하나는 내일 아침용.',
    images: ['ph-toast'],
    layout: 'tall',
    saves: 41, comments: 12,
    mood: '아늑한',
  },
  {
    id: 'p3', user: '서연', handle: '@seoyeon.s', avatarPh: 'ph-cream', avatarChar: '서',
    time: '어제', bakeryId: 'b8', bakeryName: '먼슬리 페이스트리', region: '성수',
    text: '이번 달 페이스트리는 살구. 살구 다 떨어지면 다음 달까지 못 먹어요.',
    images: ['ph-amber', 'ph-butter', 'ph-rose'],
    layout: 'grid',
    saves: 87, comments: 23,
    mood: '시즈널',
  },
  {
    id: 'p4', user: '민재', handle: '@minj.eats', avatarPh: 'ph-sage', avatarChar: '민',
    time: '어제', bakeryId: 'b7', bakeryName: '노티드 베이커리', region: '안국',
    text: '한옥 골목 끝의 작은 한 칸. 손님 두 팀, 직원 한 명. 조용해요.',
    images: ['ph-sage'],
    layout: 'medium',
    saves: 18, comments: 3,
    mood: '조용한',
  },
];

// Map markers for Near (relative %)
const MAP_MARKERS = [
  { id: 'b1', x: 28, y: 52, hot: true },
  { id: 'b8', x: 42, y: 38, hot: true },
  { id: 'b4', x: 68, y: 42 },
  { id: 'b5', x: 18, y: 64 },
  { id: 'b6', x: 32, y: 72 },
  { id: 'b2', x: 56, y: 28 },
  { id: 'b7', x: 78, y: 60 },
  { id: 'b3', x: 84, y: 24 },
];

Object.assign(window, {
  BAKERIES, BAKERY_BY_ID, COLLECTIONS, MOODS, BREAD_TYPES, LOCALS,
  SOCIAL_POSTS, MAP_MARKERS, COMMUNITIES,
});
