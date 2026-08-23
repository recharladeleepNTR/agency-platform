import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, MessageSquare } from 'lucide-react';
import { ALL_REVIEWS } from '../data/reviewsData';
import { apiRequest } from '../api/client';
import CountryFlag from './CountryFlag';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/* Star Renderer */
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5 text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : i === fullStars && hasHalf
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-white/20'
            }`}
          />
        ))}
      </div>
      <span className="text-lazyAccent font-extrabold text-[11px] ml-1 bg-lazyAccent/15 border border-lazyAccent/30 px-2.5 py-0.5 rounded-full">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

/* Individual Review Card - Deep Obsidian Purple Styling */
const ReviewCard = ({ item }) => (
  <div className="w-[300px] sm:w-[360px] h-[220px] p-6 rounded-2xl bg-[#140622] border border-lazyAccent/25 hover:border-lazyAccent/70 hover:shadow-[0_0_35px_rgba(148,148,255,0.3)] transition-all duration-300 backdrop-blur-md shadow-lg flex flex-col justify-between flex-shrink-0 group relative overflow-hidden text-left cursor-default">
    {/* Ambient Corner Glow */}
    <div className="absolute -top-12 -right-12 w-24 h-24 bg-lazyAccent/12 rounded-full blur-xl group-hover:bg-lazyAccent/25 transition-all" />

    <div>
      {/* Top Meta: Stars + Flag Badge */}
      <div className="flex items-center justify-between mb-3">
        <StarRating rating={item.rating || 5} />
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-[#200d36] border border-lazyAccent/30 text-white shadow-inner">
          <CountryFlag country={item.country} flag={item.flag} className="w-4 h-3 rounded-xs object-cover flex-shrink-0 shadow-xs" />
          <span>{item.country || 'USA'}</span>
        </span>
      </div>

      {/* Review Body */}
      <p className="text-white font-medium text-xs sm:text-sm leading-relaxed italic line-clamp-4">
        &ldquo;{item.text}&rdquo;
      </p>
    </div>

    {/* Footer Meta */}
    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
      <div>
        <span className="text-[11px] font-extrabold text-lazyAccent uppercase tracking-wider block">
          {item.role || 'Creator'}
        </span>
        <span className="text-[10px] text-white/40 font-semibold block mt-0.5">
          {item.name || 'Verified Client'}
        </span>
      </div>
      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25">
        <CheckCircle2 className="w-3 h-3" /> Verified
      </span>
    </div>
  </div>
);

const ReviewsSection = ({ title = "Client Reviews & Feedback" }) => {
  const [reviewsList, setReviewsList] = useState(ALL_REVIEWS);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await apiRequest('GET', '/testimonials');
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setReviewsList(res.data);
        }
      } catch (err) {
        console.error('Error fetching live reviews:', err);
      }
    };
    fetchReviews();
  }, []);

  const midPoint = Math.ceil(reviewsList.length / 2);
  const row1Reviews = useMemo(() => {
    const slice = reviewsList.slice(0, midPoint);
    return [...slice, ...slice, ...slice];
  }, [reviewsList, midPoint]);

  const row2Reviews = useMemo(() => {
    const slice = reviewsList.slice(midPoint);
    return [...slice, ...slice, ...slice];
  }, [reviewsList, midPoint]);

  return (
    <section id="reviews" className="py-24 bg-[#07000e] relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-lazyAccent/10 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center mb-10">
        {/* Section Header */}
        <motion.div
          variants={container} initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.2 }} className="max-w-3xl mx-auto"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-lazyAccent border border-lazyAccent/25 bg-lazyAccent/8 px-5 py-2 rounded-full mb-4 backdrop-blur-sm">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{title}</span>
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-6 leading-tight pb-1">
            Loved by Creators & Managers <br className="hidden sm:block" />
            <span className="inline-block bg-gradient-to-r from-lazyAccent via-purple-400 to-lazyDeep bg-clip-text text-transparent pb-1">
              Worldwide
            </span>
          </motion.h2>

          {/* Stats Bar */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-[#140622] border border-lazyAccent/25 shadow-xl max-w-md mx-auto">
            <div className="text-center">
              <p className="text-2xl font-black text-lazyAccent">4.9 ★</p>
              <p className="text-xs text-white/50 font-medium">Avg Rating</p>
            </div>
            <div className="text-center border-l border-white/10">
              <p className="text-2xl font-black text-lazyAccent">99.99%</p>
              <p className="text-xs text-white/50 font-medium">Satisfaction</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          ALWAYS IN CONTINUOUS SLOW LOOPING CAROUSEL (DUAL OPPOSING TRACKS)
          ═════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden space-y-6">
        {/* Side Ambient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-[#07000e] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#07000e] to-transparent z-20 pointer-events-none" />

        {/* ROW 1: ROTATES LEFT TO RIGHT VERY SLOWLY (85s) */}
        <div className="relative w-full overflow-hidden py-1 group">
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 85,
            }}
          >
            {row1Reviews.map((item, idx) => (
              <ReviewCard key={`r1-${item.id}-${idx}`} item={item} />
            ))}
          </motion.div>
        </div>

        {/* ROW 2: ROTATES RIGHT TO LEFT VERY SLOWLY (85s OPPOSITE DIRECTION) */}
        <div className="relative w-full overflow-hidden py-1 group">
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 85,
            }}
          >
            {row2Reviews.map((item, idx) => (
              <ReviewCard key={`r2-${item.id}-${idx}`} item={item} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
