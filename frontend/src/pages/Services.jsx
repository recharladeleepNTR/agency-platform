import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scissors, Palette, ArrowRight, CheckCircle2, AlertTriangle
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const videoEditingServices = [
  {
    title: 'Long-form video editing',
    platforms: '(YouTube, OFTV, websites)',
  },
  {
    title: 'Short-form content',
    platforms: '(Reels, TikTok, Shorts)',
  },
  {
    title: 'Clipping & content breakdown',
    platforms: '(Reddit, X, Instagram, Kick, Onlyfans)',
  },
  {
    title: 'Intros & outros',
    platforms: '(youtube , onlyfans, selling platforms)',
  },
  {
    title: 'Promos & teaser edits',
    platforms: '(Only fans , X , Reddit and Selling platforms)',
  },
];

const visualDesignServices = [
  {
    title: 'Thumbnails',
    platforms: '(youtube, sites , only fans , selling platforms)',
  },
  {
    title: 'Cover designs',
    platforms: '(instagram, facebook, YouTube shorts , tiktok)',
  },
  {
    title: 'Posters',
    platforms: (
      <>
        (Onlyfans, sites, instagram, <br />
        tiktok, X)
      </>
    ),
  },
  {
    title: 'Banners',
    platforms: '(youtube, onlyfans, X , facebook )',
  },
  {
    title: 'Flyers and tip menus',
    platforms: '(onlyfans, Reddit, X)',
  },
  {
    title: 'Social media theme posts',
    platforms: '(instagram, tiktok, Facebook)',
  },
];

const Services = () => {
  return (
    <div className="bg-lazyBg text-lazyText min-h-screen flex flex-col">

      {/* Hero */}
      <section className="container mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="max-w-4xl mx-auto"
        >
          <motion.p variants={fadeUp} className="text-lazyAccent text-xs font-bold tracking-[0.2em] uppercase mb-4">
            Services
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-lazyText mb-6 leading-tight pb-1">
            We handle entire <br className="hidden sm:block" />
            <span className="inline-block bg-gradient-to-r from-lazyAccent via-purple-400 to-lazyDeep bg-clip-text text-transparent pb-1">
              video editing and visual designs
            </span>
          </motion.h1>
        </motion.div>
      </section>

      {/* 1. Video Editing */}
      <section id="video-editing" className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-lazyAccent/10 text-lazyAccent flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-lazyText">
                Video Editing
              </h2>
            </motion.div>

            <motion.p variants={fadeUp} className="text-lazyText/60 text-lg md:text-xl max-w-2xl mb-12">
              Clean, structured edits that turn raw footage into <br className="hidden sm:block" />
              platform-ready content.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {videoEditingServices.map((item, i) => (
                <motion.div
                  key={i} variants={fadeUp}
                  className="p-6 rounded-2xl border border-lazyText/10 bg-white/[0.03] hover:border-lazyAccent/40 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-lazyAccent flex-shrink-0" />
                    <span className="font-bold text-lazyText text-base">{item.title}</span>
                  </div>
                  <span className="text-lazyText/45 text-sm font-medium pl-7 block">
                    {item.platforms}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Visual Design */}
      <section id="visual-design" className="py-20 bg-lazyBg">
        <div className="container mx-auto px-6">
          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-lazyAccent/10 text-lazyAccent flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-lazyText">
                Visual Design
              </h2>
            </motion.div>

            <motion.p variants={fadeUp} className="text-lazyText/60 text-lg md:text-xl max-w-2xl mb-12">
              High-quality Visuals that grab attention and drive clicks
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visualDesignServices.map((item, i) => (
                <motion.div
                  key={i} variants={fadeUp}
                  className="p-6 rounded-2xl border border-lazyText/10 bg-white/[0.03] hover:border-lazyAccent/40 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-lazyAccent flex-shrink-0" />
                    <span className="font-bold text-lazyText text-base">{item.title}</span>
                  </div>
                  <span className="text-lazyText/45 text-sm font-medium pl-7 block">
                    {item.platforms}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Note */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto p-8 rounded-2xl border border-lazyAccent/30 bg-lazyAccent/5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-lazyAccent flex-shrink-0" />
              <h3 className="font-extrabold text-lazyText text-lg">Important Note</h3>
            </div>
            <p className="text-lazyText/75 text-base leading-relaxed">
              Our role is to deliver high-quality edits and visuals that support your content.
              Performance, reach, and conversions depend on overall content strategy and marketing
              efforts, which are handled seperately by you or your team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-8 text-lazyText leading-tight">
              Unfinished content? Let’s make it <br className="hidden sm:block" />
              ready with the right edits and visuals
            </h2>
            <Link
              to="/contact" id="services-cta-btn"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-lazyAccent to-lazyDeep text-white px-9 py-4 rounded-full font-bold text-base shadow-[0_0_24px_rgba(148,148,255,0.3)] hover:scale-105 transition-all"
            >
              begin your project with us <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Services;
