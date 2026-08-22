import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Shield, ChevronRight, Users, Sparkles, Play, Eye, Volume2, VolumeX
} from 'lucide-react';
import ReviewsSection from '../components/ReviewsSection';
import CinematicModal from '../components/CinematicModal';
import { apiRequest, getMediaUrl, isVideoMedia } from '../api/client';

/* ─────────────── Motion variants ─────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const platformList = [
  { name: 'YouTube',        icon: '/logos/youtube.png'   },
  { name: 'Instagram',      icon: '/logos/instagram.png' },
  { name: 'TikTok',         icon: '/logos/tiktok.png'    },
  { name: 'Facebook',       icon: '/logos/facebook.png'  },
  { name: 'YT Shorts',      icon: '/logos/yt_shorts.png' },
  { name: 'X',              icon: '/logos/x.svg'         },
  { name: 'OF',             icon: '/logos/onlyfans.png'  },
  { name: 'Reddit',         icon: '/logos/reddit.png'    },
  { name: 'Fansly',         icon: '/logos/fansly.png'    },
  { name: 'Kick',           icon: '/logos/kick.png'      },
];

const whoWeWorkWith = [
  { icon: <Users className="w-5 h-5 text-lazyAccent" />,    label: 'Independent Creators' },
  { icon: <Sparkles className="w-5 h-5 text-lazyAccent" />, label: 'Subscription Based Creators' },
  { icon: <Shield className="w-5 h-5 text-lazyAccent" />,   label: 'Agencies' },
];

/* ─────────────── Component ─────────────── */
const DEFAULT_PREVIEW_ITEMS = [
  {
    _id: 'slot-1',
    id: 'slot-1',
    title: '1',
    ratio: 'Work Preview - Slot 1 (9:16)',
    category: 'Work Preview',
    img: '/uploads/vid_1787332491700_mygcu.mp4',
    mediaUrl: '/uploads/vid_1787332491700_mygcu.mp4'
  },
  {
    _id: 'slot-2',
    id: 'slot-2',
    title: '2',
    ratio: 'Work Preview - Slot 2 (16:9)',
    category: 'Work Preview',
    img: '/uploads/img_1787335251860_szynt.jpg',
    mediaUrl: '/uploads/img_1787335251860_szynt.jpg'
  },
  {
    _id: 'slot-3',
    id: 'slot-3',
    title: '3',
    ratio: 'Work Preview - Slot 3 (4:5)',
    category: 'Work Preview',
    img: '/uploads/img_1787333909377_4uott.png',
    mediaUrl: '/uploads/img_1787333909377_4uott.png'
  }
];

const Home = () => {
  const [previewItems, setPreviewItems]   = useState(DEFAULT_PREVIEW_ITEMS);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMuted, setIsMuted]             = useState(true);

  /* Load Work Preview items dynamically from Database API */
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await apiRequest('GET', '/portfolio');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setPreviewItems(res.data);
        } else {
          setPreviewItems(DEFAULT_PREVIEW_ITEMS);
        }
      } catch (e) {
        console.error('Error fetching Work Preview from DB:', e);
        setPreviewItems(DEFAULT_PREVIEW_ITEMS);
      }
    };
    loadData();
  }, []);

  /* Strictly assign the exact media items for Work Preview slots from database */
  const slot1 = (previewItems || []).find(i => i.ratio?.includes('Slot 1') || i.title === '1') || DEFAULT_PREVIEW_ITEMS[0];
  const slot2 = (previewItems || []).find(i => i.ratio?.includes('Slot 2') || i.title === '2') || DEFAULT_PREVIEW_ITEMS[1];
  const slot3 = (previewItems || []).find(i => i.ratio?.includes('Slot 3') || i.title === '3') || DEFAULT_PREVIEW_ITEMS[2];

  return (
    <div className="flex flex-col">

      {/* ══════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Animated background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #0E0014 0%, #1a0029 30%, #0a0018 60%, #200030 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 14s ease infinite',
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_#0E0014_100%)] z-[1]" />

        {/* Content */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="container relative z-10 px-6 text-center max-w-5xl mx-auto pt-20"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-flex flex-col items-center justify-center text-[11px] sm:text-xs font-extrabold tracking-[0.22em] uppercase text-lazyAccent border border-lazyAccent/25 bg-lazyAccent/8 px-6 py-3 rounded-full backdrop-blur-sm leading-relaxed text-center">
              <span>A creative team working behind</span>
              <span>the scenes</span>
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[4.85rem] font-extrabold tracking-tighter leading-[1.15] mb-7 text-lazyText max-w-7xl mx-auto pb-2"
          >
            <span className="block whitespace-nowrap">
              Turn content into something
            </span>
            <span className="block whitespace-nowrap bg-gradient-to-r from-lazyAccent via-purple-400 to-lazyDeep bg-clip-text text-transparent pb-3 pt-1">
              people actually watch
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-lazyText/55 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            We work with both mainstream and subscription-based creators, <br className="hidden sm:block" />
            shaping raw content into polished, high-performing <br className="hidden sm:block" />
            visuals across platforms.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/portfolio"
                id="hero-view-work"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-lazyAccent to-lazyDeep text-white px-9 py-4 rounded-full font-bold text-base shadow-[0_0_32px_rgba(148,148,255,0.35)] hover:shadow-[0_0_48px_rgba(148,148,255,0.55)] transition-shadow"
              >
                View Work
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                id="hero-start-project"
                className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-base border border-lazyAccent/30 hover:bg-lazyAccent/8 backdrop-blur-sm transition-all text-lazyText"
              >
                Let's get started <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            variants={fadeUp}
            className="mt-20 flex flex-col items-center gap-2 text-lazyText/25"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-px h-10 bg-gradient-to-b from-lazyAccent/40 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          PLATFORMS SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-lazyBg">
        <div className="container mx-auto px-6">
          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.2 }} className="mb-12 text-center"
          >
            <motion.p variants={fadeUp} className="text-lazyAccent text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Built for all platforms
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold tracking-tighter text-lazyText max-w-3xl mx-auto">
              We work across all major platforms, where creators publish and grow
            </motion.h2>
          </motion.div>

          {/* Clean Floating High-Quality Logos */}
          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-14 max-w-5xl mx-auto py-6"
          >
            {platformList.map((p, i) => (
              <motion.div
                key={i} variants={fadeUp}
                whileHover={{ scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="cursor-pointer p-3 flex items-center justify-center transition-all duration-300 group"
                title={p.name}
              >
                <img
                  src={p.icon}
                  alt={p.name}
                  className="w-14 h-14 md:w-16 md:h-16 object-contain transition-all duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WHAT WE DO
      ══════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.2 }} className="max-w-4xl mx-auto text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-lazyAccent text-xs font-bold tracking-[0.2em] uppercase mb-3">
              What we do
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-extrabold tracking-tighter text-lazyText mb-6 leading-tight pb-1">
              Turning{' '}
              <span className="inline-block bg-gradient-to-r from-lazyAccent via-purple-400 to-lazyDeep bg-clip-text text-transparent pb-1">
                raw footages
              </span>{' '}
              and{' '}
              <span className="inline-block bg-gradient-to-r from-lazyAccent via-purple-400 to-lazyDeep bg-clip-text text-transparent pb-1">
                clips
              </span>{' '}
              into high-performing content
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lazyText/60 text-lg leading-relaxed max-w-2xl mx-auto">
              We help creators edit, format, and structure their content for maximum retention, engagement, and reach.
            </motion.p>
          </motion.div>

          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.2 }} className="mb-16 text-center"
          >
            <motion.p variants={fadeUp} className="text-lazyAccent text-xs font-extrabold tracking-[0.2em] uppercase mb-4">
              Who we work with
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold tracking-tighter text-lazyText max-w-2xl mx-auto">
              Creators across both public and <br className="hidden sm:block" />
              private spaces
            </motion.h2>
          </motion.div>

          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {whoWeWorkWith.map((w, i) => (
              <motion.div
                key={i} variants={fadeUp}
                className="flex flex-col items-center text-center p-8 rounded-2xl border border-lazyText/10 bg-white/[0.03] hover:border-lazyAccent/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-lazyAccent/10 text-lazyAccent flex items-center justify-center mb-4">
                  {w.icon}
                </div>
                <span className="text-lazyText font-bold text-lg">{w.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PRIVACY AND DISCRETION
      ══════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeUp} className="mb-2 flex justify-center">
              <img
                src="/shield_lock.png"
                alt="Privacy Shield Lock"
                className="w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 object-contain filter drop-shadow-[0_0_35px_rgba(148,148,255,0.55)] hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
            <motion.p variants={fadeUp} className="text-lazyAccent text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Privacy and discretion
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-6 text-lazyText">
              Your content stays yours
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lazyText/70 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
              We strictly do not share, reuse, or publish any client content under any circumstances. <br className="hidden sm:block" />
              Your work remains completely private and is never used for portfolio or <br className="hidden sm:block" />
              public display without your clear permission.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-6 text-base font-semibold text-lazyText mb-8">
              {['Private', 'Confidential', 'Discreet workflow'].map((t, i) => (
                <span key={i} className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-lazyAccent/30 bg-lazyAccent/5 hover:border-lazyAccent/60 transition-all shadow-md">
                  <img src="/shield_lock.png" alt="Shield" className="w-6 h-6 object-contain flex-shrink-0 filter drop-shadow-[0_0_10px_rgba(148,148,255,0.6)]" /> {t}
                </span>
              ))}
            </motion.div>

            <motion.p variants={fadeUp} className="text-lazyText/50 text-sm italic max-w-2xl mx-auto pt-6">
              We delete all project files and drafts from our devices once the work is complete.
              Nothing is stored, and this is done only after your confirmation.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WORK PREVIEW (SLOT 1: 9:16 VERTICAL | SLOT 2: 16:9 WIDESCREEN [Private] | SLOT 3: 4:5 POST WITH AUDIO MUTE TOGGLE)
      ══════════════════════════════════════════════ */}
      <section className="py-24 bg-lazyBg">
        <div className="container mx-auto px-6 text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-10"
          >
            <p className="text-lazyAccent text-xs font-extrabold tracking-[0.25em] uppercase mb-2">
              WORK PREVIEW
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tighter mb-2 text-white whitespace-nowrap">
              A small{' '}
              <span className="inline-block bg-gradient-to-r from-lazyAccent via-purple-400 to-lazyDeep bg-clip-text text-transparent pb-1">
                glimpse
              </span>{' '}
              of our work
            </h2>
            <p className="text-lazyText/50 text-sm md:text-base font-medium">
              Full edits are shared privately based on request.
            </p>
          </motion.div>

          {/* 3 Work Preview Cards: (1) 9:16 Vertical Reel/Short [264x470px], (2) 16:9 Widescreen Video [498x280px], (3) 4:5 Portrait Post [320x400px]. Flexbox centered with gap-6 lg:gap-8 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 max-w-7xl mx-auto mb-12 px-4"
          >
            {/* First Item: 9:16 Vertical Video (Emphasized, Visibly Larger & Taller - 264x470px) - LEFT */}
            <div
              className="relative w-full max-w-[264px] aspect-[9/16] rounded-3xl bg-[#12051f] border border-lazyAccent/30 hover:border-lazyAccent/70 hover:shadow-[0_0_40px_rgba(148,148,255,0.35)] transition-all duration-300 flex flex-col items-center justify-center p-6 group overflow-hidden flex-shrink-0 z-10"
            >
              {slot1 && (slot1.img || slot1.mediaUrl) ? (
                isVideoMedia(slot1.img || slot1.mediaUrl) ? (
                  <video
                    src={getMediaUrl(slot1.img || slot1.mediaUrl)}
                    ref={(el) => {
                      if (el) {
                        el.muted = true;
                        el.play().catch(() => {});
                      }
                    }}
                    autoPlay loop playsInline webkit-playsinline="true" muted preload="auto"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={getMediaUrl(slot1.img || slot1.mediaUrl)}
                    alt="Reel / Short Preview"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/card_own_power.png'; }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-lazyText/40 group-hover:text-lazyAccent transition-colors">
                  <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center mb-4 pl-0.5">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-white font-bold text-sm mb-1">Reel / Short</span>
                  <span className="text-xs text-lazyText/40 font-mono">1080×1920</span>
                </div>
              )}
            </div>

            {/* Second Item (Middle): 16:9 Widescreen Video (Exact 16:9 Ratio - 498x280px, Zero Cropping) - MIDDLE */}
            <div
              className="relative w-full max-w-[498px] aspect-video rounded-3xl bg-[#12051f] border border-lazyAccent/20 hover:border-lazyAccent/60 hover:shadow-[0_0_35px_rgba(148,148,255,0.25)] transition-all duration-300 flex flex-col items-center justify-center p-6 group overflow-hidden shadow-2xl flex-shrink-0"
            >
              {slot2 && (slot2.img || slot2.mediaUrl) ? (
                isVideoMedia(slot2.img || slot2.mediaUrl) ? (
                  <video
                    src={getMediaUrl(slot2.img || slot2.mediaUrl)}
                    ref={(el) => {
                      if (el) {
                        el.muted = true;
                        el.play().catch(() => {});
                      }
                    }}
                    autoPlay loop playsInline webkit-playsinline="true" muted preload="auto"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={getMediaUrl(slot2.img || slot2.mediaUrl)}
                    alt="Widescreen Video Preview"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/card_own_power.png'; }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-lazyText/40 group-hover:text-lazyAccent transition-colors">
                  <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center mb-4">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span className="text-white font-bold text-sm mb-1">Widescreen Video</span>
                  <span className="text-xs text-lazyText/40 font-mono">1920×1080</span>
                </div>
              )}
            </div>

            {/* Third Item: 4:5 Portrait Image (320x400px) - RIGHT */}
            <div
              className="relative w-full max-w-[320px] aspect-[4/5] rounded-3xl bg-[#12051f] border border-lazyAccent/20 hover:border-lazyAccent/60 hover:shadow-[0_0_35px_rgba(148,148,255,0.25)] transition-all duration-300 flex flex-col items-center justify-center p-6 group overflow-hidden flex-shrink-0"
            >
              {slot3 && (slot3.img || slot3.mediaUrl) ? (
                isVideoMedia(slot3.img || slot3.mediaUrl) ? (
                  <video
                    src={getMediaUrl(slot3.img || slot3.mediaUrl)}
                    ref={(el) => {
                      if (el) {
                        el.muted = true;
                        el.play().catch(() => {});
                      }
                    }}
                    autoPlay loop playsInline webkit-playsinline="true" muted preload="auto"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={getMediaUrl(slot3.img || slot3.mediaUrl)}
                    alt="Social Post Preview"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/card_own_power.png'; }}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-lazyText/40 group-hover:text-lazyAccent transition-colors">
                  <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center mb-4 pl-0.5">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-white font-bold text-sm mb-1">Social Post</span>
                  <span className="text-xs text-lazyText/40 font-mono">1080×1350</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Visit Portfolio Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1.5 text-sm font-extrabold text-lazyAccent hover:text-white transition-colors duration-200 group"
            >
              <span>Visit Portfolio</span>
              <ChevronRight className="w-4 h-4 text-lazyAccent group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          REVIEWS & FEEDBACK SECTION
      ══════════════════════════════════════════════ */}
      <ReviewsSection limit={6} title="Client Reviews & Feedback" />

      {/* ══════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════ */}
      <section className="py-32 text-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 text-lazyText leading-tight">
              Great content is defined by <br className="hidden sm:block" />
              how it’s presented
            </h2>
            <p className="text-lazyText/60 text-lg md:text-xl mb-10">
              Work with a team you can trust
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/contact"
                id="final-cta-btn"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-lazyAccent to-lazyDeep text-white px-9 py-4 rounded-full font-bold text-base shadow-[0_0_32px_rgba(148,148,255,0.3)] hover:scale-105 transition-all"
              >
                begin your project with us <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-9 py-4 rounded-full font-bold text-base border border-lazyText/20 text-lazyText/70 hover:text-lazyText hover:border-lazyText/40 transition-all"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal for inspecting media */}
      <CinematicModal item={selectedMedia} onClose={() => setSelectedMedia(null)} />
    </div>
  );
};

export default Home;
