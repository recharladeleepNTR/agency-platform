import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { apiRequest } from '../api/client';

/* Symmetrical 3D Arc Geometry Slots for 4:5 Poster Stage (Desktop & Mobile Responsive) */
const SLOTS_4_5_DESKTOP = [
  { ry: -36, x: -420, z: -220, s: 0.72, o: 0.55 },
  { ry: -18, x: -230, z: -100, s: 0.88, o: 0.85 },
  { ry:   0, x:    0, z:    0, s: 1.08, o: 1.00 }, // ← Center Spotlight Card
  { ry:  18, x:  230, z: -100, s: 0.88, o: 0.85 },
  { ry:  36, x:  420, z: -220, s: 0.72, o: 0.55 },
];

const SLOTS_4_5_MOBILE = [
  { ry: -24, x: -210, z: -160, s: 0.62, o: 0.35 },
  { ry: -12, x: -115, z: -75,  s: 0.82, o: 0.75 },
  { ry:   0, x:    0, z:    0,   s: 0.96, o: 1.00 },
  { ry:  12, x:  115, z: -75,  s: 0.82, o: 0.75 },
  { ry:  24, x:  210, z: -160, s: 0.62, o: 0.35 },
];

const ROTATION_INTERVAL = 3400; // 3.4 seconds auto-advance

const getMediaUrl = (url, fallback = '/card_own_power.png') => {
  if (!url || typeof url !== 'string') return fallback;
  if (url.includes('/uploads/')) {
    const parts = url.split('/uploads/');
    return `/uploads/${parts[1]}`;
  }
  return url;
};

const DEFAULT_POSTS_45 = [
  { id: 'p1', title: 'Work Poster 1', img: '/uploads/img_1787333949894_1jmf0.jpg', ratio: '4:5', category: 'Design' },
  { id: 'p2', title: 'Work Poster 2', img: '/uploads/img_1787333959824_d5d5t.jpg', ratio: '4:5', category: 'Design' },
  { id: 'p3', title: 'Work Poster 3', img: '/uploads/img_1787333971022_a6gxa.png', ratio: '4:5', category: 'Design' },
  { id: 'p4', title: 'Work Poster 4', img: '/uploads/img_1787333981872_baixa.png', ratio: '4:5', category: 'Design' },
  { id: 'p5', title: 'Work Poster 5', img: '/uploads/img_1787333992992_iyf98.jpg', ratio: '4:5', category: 'Design' },
  { id: 'p6', title: 'Work Poster 6', img: '/uploads/img_1787334002671_273ss.jpg', ratio: '4:5', category: 'Design' },
  { id: 'p7', title: 'Work Poster 7', img: '/uploads/img_1787334017008_lj9un.jpg', ratio: '4:5', category: 'Design' },
  { id: 'p8', title: 'Work Poster 8', img: '/uploads/img_1787334033661_lxfkj.jpg', ratio: '4:5', category: 'Design' },
];

const DEFAULT_THUMBNAILS = [
  { id: 't1', title: 'Widescreen Work 1', img: '/uploads/img_1787334805662_b1tw7.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't2', title: 'Widescreen Work 2', img: '/uploads/img_1787335251860_szynt.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't3', title: 'Widescreen Work 3', img: '/uploads/img_1787335265295_lkbrl.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't4', title: 'Widescreen Work 4', img: '/uploads/img_1787335277827_huaja.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't5', title: 'Widescreen Work 5', img: '/uploads/img_1787335292227_aqdyj.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't6', title: 'Widescreen Work 6', img: '/uploads/img_1787335301578_kbkua.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't7', title: 'Widescreen Work 7', img: '/uploads/img_1787335313226_ekbud.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't8', title: 'Widescreen Work 8', img: '/uploads/img_1787335327424_4ukqc.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't9', title: 'Widescreen Work 9', img: '/uploads/img_1787335385637_80rgz.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't10', title: 'Widescreen Work 10', img: '/uploads/img_1787335404823_ywbus.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't11', title: 'Widescreen Work 11', img: '/uploads/img_1787335417213_44yop.jpg', ratio: '16:9', category: 'Video Editing' },
  { id: 't12', title: 'Widescreen Work 12', img: '/uploads/img_1787335427940_6edkw.jpg', ratio: '16:9', category: 'Video Editing' },
];

const DEFAULT_BANNERS = [
  { id: 'b1', title: 'Ultra Wide Banner 1', img: '/uploads/img_1787335466696_5zgbr.jpg', ratio: 'Banner', category: 'Banner Design' },
  { id: 'b2', title: 'Ultra Wide Banner 2', img: '/uploads/img_1787335477095_2pm9i.jpg', ratio: 'Banner', category: 'Banner Design' },
  { id: 'b3', title: 'Ultra Wide Banner 3', img: '/uploads/img_1787335486546_tep7i.jpg', ratio: 'Banner', category: 'Banner Design' },
];

const Portfolio = () => {
  const [posts45, setPosts45]               = useState(DEFAULT_POSTS_45);
  const [thumbnails, setThumbnails]         = useState(DEFAULT_THUMBNAILS);
  const [banners, setBanners]               = useState(DEFAULT_BANNERS);

  const [isLoading, setIsLoading]           = useState(true);
  const [active45Idx, setActive45Idx]       = useState(0);
  const [isPaused45, setIsPaused45]         = useState(false);

  /* Fetch live portfolio items 100% from Backend Database API with fallbacks */
  const loadPortfolioData = useCallback(async () => {
    try {
      setIsLoading(true);
      const r = await apiRequest('GET', '/portfolio');
      if (r.data && Array.isArray(r.data) && r.data.length > 0) {
        const p45 = r.data.filter(i => i.ratio === '4:5' || !i.ratio);
        const t169 = r.data.filter(i => i.ratio === '16:9');
        const ban = r.data.filter(i => i.ratio === 'Banner' || i.ratio === '6:1');

        setPosts45(p45.length > 0 ? p45 : DEFAULT_POSTS_45);
        setThumbnails(t169.length > 0 ? t169 : DEFAULT_THUMBNAILS);
        setBanners(ban.length > 0 ? ban : DEFAULT_BANNERS);
      } else {
        setPosts45(DEFAULT_POSTS_45);
        setThumbnails(DEFAULT_THUMBNAILS);
        setBanners(DEFAULT_BANNERS);
      }
    } catch (e) {
      console.error('Error loading portfolio from Database:', e);
      setPosts45(DEFAULT_POSTS_45);
      setThumbnails(DEFAULT_THUMBNAILS);
      setBanners(DEFAULT_BANNERS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.removeItem('portfolio_items_45');
      localStorage.removeItem('portfolio_items_row1');
      localStorage.removeItem('portfolio_items_banners');
    } catch {}

    loadPortfolioData();
  }, [loadPortfolioData]);

  const safePostsCount = (posts45 && posts45.length > 0) ? posts45.length : 1;

  /* Continuous Auto-Rotation for 4:5 3D Stage */
  const advance45 = useCallback(() => {
    setActive45Idx((prev) => (prev + 1) % safePostsCount);
  }, [safePostsCount]);

  const prev45 = useCallback(() => {
    setActive45Idx((prev) => (prev - 1 + safePostsCount) % safePostsCount);
  }, [safePostsCount]);

  useEffect(() => {
    if (isPaused45 || !posts45 || posts45.length === 0) return;
    const timer = setInterval(advance45, ROTATION_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused45, advance45, posts45]);

  /* Calculate 5 visible slots centered around active index */
  const getVisibleItems = () => {
    const validPosts = (posts45 || []).filter(item => item && (item.img || item.mediaUrl));
    if (validPosts.length === 0) return [];
    const len = validPosts.length;
    const slots = [];
    const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 640;
    const targetSlots = isMobileScreen ? SLOTS_4_5_MOBILE : SLOTS_4_5_DESKTOP;

    for (let offset = -2; offset <= 2; offset++) {
      const slotIndex = offset + 2; // 0..4
      const itemIndex = (active45Idx + offset + len * 10) % len;
      const currentItem = validPosts[itemIndex];
      if (currentItem) {
        slots.push({
          item: currentItem,
          slot: targetSlots[slotIndex],
          isCenter: offset === 0,
        });
      }
    }
    return slots;
  };

  const visibleSlots = getVisibleItems();

  /* Prepare 16:9 Thumbnail items: First 6 on Row 1, remaining on Row 2 */
  const rawThumbnails = thumbnails || [];
  const row1Slice = rawThumbnails.slice(0, 6);
  const row2Slice = rawThumbnails.length > 6 ? rawThumbnails.slice(6) : rawThumbnails.slice(0, 6);

  // 2x duplication is 100% seamless for GPU infinite CSS marquee
  const row1Items = row1Slice.length > 0 ? [...row1Slice, ...row1Slice] : [];
  const row2Items = row2Slice.length > 0 ? [...row2Slice, ...row2Slice] : [];

  /* ── GREAT AGENCY LOADING ANIMATION ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07000e] flex flex-col items-center justify-center relative overflow-hidden z-50">
        {/* Background Ambient Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(148,148,255,0.18),transparent_60%)]" />
        <div className="absolute w-[500px] h-[500px] bg-lazyDeep/20 rounded-full blur-[140px] animate-pulse" />

        {/* Futuristic Glowing Loader */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-24 h-24 flex items-center justify-center mb-8">
            {/* Outer Spinning Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-lazyAccent border-r-purple-500 shadow-[0_0_25px_rgba(148,148,255,0.5)]"
            />
            {/* Inner Counter-Spinning Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
              className="absolute inset-2 rounded-full border-2 border-transparent border-b-lazyAccent border-l-purple-400"
            />
            {/* Center Logo Icon */}
            <div className="w-12 h-12 rounded-2xl bg-lazyAccent/20 border border-lazyAccent/60 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-lazyAccent animate-pulse" />
            </div>
          </div>

          {/* Shimmer Text */}
          <h2 className="text-xl font-black tracking-widest text-white uppercase mb-2">
            LAZYDITION <span className="bg-gradient-to-r from-lazyAccent to-purple-400 bg-clip-text text-transparent">PORTFOLIO</span>
          </h2>
          <p className="text-xs text-lazyAccent font-bold tracking-widest uppercase animate-pulse">
            Loading Visual Excellence...
          </p>

          {/* Progress Bar */}
          <div className="w-48 h-1 bg-white/10 rounded-full mt-6 overflow-hidden relative">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="w-full h-full bg-gradient-to-r from-transparent via-lazyAccent to-transparent"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07000e] text-lazyText overflow-hidden flex flex-col relative pt-24 pb-16">

      {/* ── Ambient Background Lighting ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(148,148,255,0.12),transparent_60%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-lazyDeep/15 rounded-full blur-[140px]" />
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          SECTION 1: PURE 4:5 WORK 3D ARC COVERFLOW STAGE WITH NAVIGATION ARROWS
          ═════════════════════════════════════════════════════════════════ */}
      {posts45.length > 0 && (
        <section className="relative z-10 py-8">
          <div
            className="relative w-full h-[420px] sm:h-[480px] overflow-hidden flex items-center justify-center group/stage"
            onMouseEnter={() => setIsPaused45(true)}
            onMouseLeave={() => setIsPaused45(false)}
            style={{ perspective: '1200px' }}
          >
            {/* Left Glassy Navigation Arrow */}
            {posts45.length > 1 && (
              <button
                onClick={prev45}
                aria-label="Previous Slide"
                className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full border border-white/20 bg-black/60 hover:bg-lazyAccent/30 hover:border-lazyAccent text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Right Glassy Navigation Arrow */}
            {posts45.length > 1 && (
              <button
                onClick={advance45}
                aria-label="Next Slide"
                className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full border border-white/20 bg-black/60 hover:bg-lazyAccent/30 hover:border-lazyAccent text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {visibleSlots.map(({ item, slot, isCenter }, idx) => {
              if (!item) return null;
              const rawUrl = item.img || item.mediaUrl;
              const mediaImage = getMediaUrl(rawUrl, '/uploads/img_1787335251860_szynt.jpg');
              const itemKey = item._id || item.id || `post-${idx}`;

              return (
                <motion.div
                  key={itemKey}
                  initial={false}
                  animate={{
                    x: slot.x,
                    z: slot.z,
                    rotateY: slot.ry,
                    scale: slot.s,
                    opacity: slot.o,
                  }}
                  transition={{
                    duration: 0.9,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform, opacity',
                  }}
                  className={`
                    w-[270px] sm:w-[300px] h-[340px] sm:h-[375px] rounded-2xl overflow-hidden
                    -ml-[135px] -mt-[170px] md:-ml-[150px] md:-mt-[187.5px]
                    ${isCenter
                      ? 'border-2 border-lazyAccent/80 shadow-[0_0_50px_rgba(148,148,255,0.45)] z-30'
                      : 'border border-white/15 shadow-xl z-10 hover:border-lazyAccent/40'
                    }
                    bg-[#140622] group transition-colors duration-300 relative
                  `}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <div className="absolute inset-0 z-20 bg-transparent select-none" onContextMenu={(e) => e.preventDefault()} />
                  <img
                    src={mediaImage}
                    alt="Client Work"
                    loading="lazy"
                    decoding="async"
                    onContextMenu={(e) => e.preventDefault()}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/uploads/img_1787335251860_szynt.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {(posts45 || []).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive45Idx(idx)}
                aria-label={`Go to item ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  active45Idx === idx
                    ? 'w-8 bg-gradient-to-r from-lazyAccent to-purple-400 shadow-[0_0_12px_rgba(148,148,255,0.8)]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          SECTION 2: PURE 16:9 WORK DUAL GPU-ACCELERATED MARQUEES
          ═════════════════════════════════════════════════════════════════ */}
      {row1Items.length > 0 && (
        <section className="relative z-10 py-12">
          {/* MARQUEE ROW 1: LEFT TO RIGHT */}
          <div className="relative w-full overflow-hidden mb-6 py-2 group">
            <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#07000e] to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#07000e] to-transparent z-20 pointer-events-none" />

            <div className="flex gap-6 w-max animate-marquee-left">
              {row1Items.map((item, idx) => {
                if (!item) return null;
                const rawUrl = item.img || item.mediaUrl;
                const mediaImg = getMediaUrl(rawUrl, '/uploads/img_1787335385637_80rgz.jpg');
                return (
                  <div
                    key={`r1-${idx}`}
                    className="relative w-[280px] sm:w-[320px] aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black hover:border-lazyAccent/70 hover:shadow-[0_0_30px_rgba(148,148,255,0.4)] transition-all duration-300 flex-shrink-0 group/card"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <div className="absolute inset-0 z-20 bg-transparent select-none" onContextMenu={(e) => e.preventDefault()} />
                    <img
                      src={mediaImg}
                      alt="Client Work"
                      loading="lazy"
                      decoding="async"
                      onContextMenu={(e) => e.preventDefault()}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/uploads/img_1787335385637_80rgz.jpg';
                      }}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* MARQUEE ROW 2: RIGHT TO LEFT */}
          {row2Items.length > 0 && (
            <div className="relative w-full overflow-hidden py-2 group">
              <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#07000e] to-transparent z-20 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#07000e] to-transparent z-20 pointer-events-none" />

              <div className="flex gap-6 w-max animate-marquee-right">
                {row2Items.map((item, idx) => {
                  if (!item) return null;
                  const rawUrl = item.img || item.mediaUrl;
                  const mediaImg = getMediaUrl(rawUrl, '/uploads/img_1787335404823_ywbus.jpg');
                  return (
                    <div
                      key={`r2-${idx}`}
                      className="relative w-[280px] sm:w-[320px] aspect-video rounded-2xl overflow-hidden border border-white/15 bg-black hover:border-lazyAccent/70 hover:shadow-[0_0_30px_rgba(148,148,255,0.4)] transition-all duration-300 flex-shrink-0 group/card"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <div className="absolute inset-0 z-20 bg-transparent select-none" onContextMenu={(e) => e.preventDefault()} />
                      <img
                        src={mediaImg}
                        alt="Client Work"
                        loading="lazy"
                        decoding="async"
                        onContextMenu={(e) => e.preventDefault()}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/uploads/img_1787335404823_ywbus.jpg';
                        }}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          SECTION 3: PURE 6:1 ULTRA-WIDE BANNERS SHOWCASE
          ═════════════════════════════════════════════════════════════════ */}
      {banners.length > 0 && (
        <section className="relative z-10 py-12 container mx-auto px-6">
          <div className="space-y-8 max-w-6xl mx-auto">
            {banners.map((b, idx) => {
              if (!b) return null;
              const rawUrl = b.img || b.mediaUrl;
              const bannerImg = getMediaUrl(rawUrl, '/uploads/img_1787334002671_273ss.jpg');
              const bKey = b._id || b.id || `banner-${idx}`;

              return (
                <motion.div
                  key={bKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  onContextMenu={(e) => e.preventDefault()}
                  className="relative rounded-3xl overflow-hidden border-2 border-lazyAccent/30 bg-black hover:border-lazyAccent/70 hover:shadow-[0_0_40px_rgba(148,148,255,0.4)] transition-all duration-300 group"
                >
                  <div className="relative w-full aspect-[6/1] rounded-[22px] overflow-hidden bg-black flex items-center justify-center" onContextMenu={(e) => e.preventDefault()}>
                    <div className="absolute inset-0 z-20 bg-transparent select-none" onContextMenu={(e) => e.preventDefault()} />
                    <img
                      src={bannerImg}
                      alt="Client Work"
                      loading="lazy"
                      decoding="async"
                      onContextMenu={(e) => e.preventDefault()}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/uploads/img_1787334002671_273ss.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Empty State Banner */}
      {posts45.length === 0 && thumbnails.length === 0 && banners.length === 0 && !isLoading && (
        <div className="relative z-10 my-auto text-center py-24 px-6">
          <div className="w-16 h-16 rounded-2xl bg-lazyAccent/10 border border-lazyAccent/30 flex items-center justify-center mx-auto mb-4 text-lazyAccent">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">No Media Uploaded Yet</h2>
          <p className="text-lazyText/50 text-sm max-w-md mx-auto">
            Upload client work, posters, 9:16 videos, 16:9 thumbnails, and banners directly from the Admin Dashboard.
          </p>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
