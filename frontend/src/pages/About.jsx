import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const workflowSteps = [
  { num: '01', title: 'You share your content',  desc: 'Send us your raw footage, assets, and brief.' },
  { num: '02', title: 'We edit and refine',       desc: 'Our team crafts polished, platform-ready content.' },
  { num: '03', title: 'You review',               desc: 'Preview the result and request any revisions.' },
  { num: '04', title: 'Final delivery',           desc: 'Receive your finished content, ready to publish.' },
];

const About = () => {
  return (
    <div className="bg-lazyBg text-lazyText min-h-screen flex flex-col">

      {/* ── Hero ── */}
      <section className="container mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div
          variants={container} initial="hidden" animate="show"
          className="max-w-4xl mx-auto"
        >
          <motion.p variants={fadeUp} className="text-lazyAccent text-xs font-bold tracking-[0.2em] uppercase mb-4">
            About Us
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl font-extrabold tracking-tighter mb-6 text-lazyText leading-tight pb-1">
            A{' '}
            <span className="inline-block bg-gradient-to-r from-lazyAccent via-purple-400 to-lazyDeep bg-clip-text text-transparent pb-1">
              creative team
            </span>{' '}
            working behind the scenes
          </motion.h1>
        </motion.div>
      </section>

      {/* ── 1. Who We Are ── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-6 text-lazyText flex items-center gap-4">
              <img src="/icon_people.png" alt="Who We Are" className="w-10 h-10 md:w-12 md:h-12 object-contain filter drop-shadow-[0_0_12px_rgba(148,148,255,0.5)]" />
              <span>Who We Are?</span>
            </motion.h2>
            <motion.div variants={fadeUp} className="space-y-4 text-lazyText/75 text-lg md:text-xl leading-relaxed">
              <p>
                Lazydition is a friendly creative team working behind the scenes with creators, models, and teams who care about how their content is presented.
              </p>
              <p className="text-lazyAccent font-bold text-lg md:text-xl">
                We focus on keeping things simple, consistent, and done right, without overcomplicating the process.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 🏆 2. Experience ── */}
      <section className="py-20 bg-lazyBg">
        <div className="container mx-auto px-6">
          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-6 text-lazyText flex items-center gap-4">
              <img src="/icon_trophy.png" alt="Experience" className="w-10 h-10 md:w-12 md:h-12 object-contain filter drop-shadow-[0_0_12px_rgba(148,148,255,0.5)]" />
              <span>Experience</span>
            </motion.h2>
            <motion.div variants={fadeUp} className="space-y-4 text-lazyText/75 text-lg md:text-xl leading-relaxed">
              <p>
                Over time, we’ve worked across different content spaces, from mainstream platforms to private, subscription-based content.
              </p>
              <p className="text-lazyAccent font-bold text-lg md:text-xl">
                This gives us a clear understanding of what works, what doesn’t, and how content should feel on each platform.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 🎬🎨 3. What We Do ── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-6 text-lazyText flex items-center gap-4">
              <img src="/icon_what_we_do.png" alt="What We Do" className="w-10 h-10 md:w-12 md:h-12 object-contain filter drop-shadow-[0_0_12px_rgba(148,148,255,0.5)]" />
              <span>What We Do?</span>
            </motion.h2>
            <motion.div variants={fadeUp} className="space-y-4 text-lazyText/75 text-lg md:text-xl leading-relaxed">
              <p>
                We save your time by handling the editing and design side of your content.
              </p>
              <p className="text-lazyAccent font-bold text-lg md:text-xl">
                You can focus on creating more and we'll take care of the rest !
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 👍 4. Why Us ── */}
      <section className="py-20 bg-lazyBg">
        <div className="container mx-auto px-6">
          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-6 text-lazyText flex items-center gap-4">
              <img src="/icon_why_us.png" alt="Why Us" className="w-10 h-10 md:w-12 md:h-12 object-contain filter drop-shadow-[0_0_12px_rgba(148,148,255,0.5)]" />
              <span>Why Us?</span>
            </motion.h2>
            <motion.div variants={fadeUp} className="p-8 rounded-2xl border border-lazyAccent/30 bg-lazyAccent/5 backdrop-blur-sm">
              <p className="text-lazyText font-bold text-xl md:text-2xl leading-snug">
                Friendly Communication, we keep things simple, reliable, and private.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            variants={container} initial="hidden" whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <motion.p variants={fadeUp} className="text-lazyAccent text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Workflow
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-12 text-lazyText">
              Simple, smooth, and built around your schedule
            </motion.h2>

            <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {workflowSteps.map((step, i) => (
                <motion.div
                  key={i} variants={fadeUp}
                  className="relative p-7 rounded-2xl border border-lazyAccent/20 bg-lazyAccent/5 hover:border-lazyAccent/40 transition-colors"
                >
                  <span className="text-5xl font-black text-white/80 leading-none block mb-4">
                    {step.num}
                  </span>
                  <h3 className="text-lazyAccent font-extrabold text-base mb-2">{step.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed font-medium">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Privacy Commitment ── */}
      <section className="py-20 bg-lazyBg">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="mb-4 flex justify-center">
              <img
                src="/shield_lock.png"
                alt="Privacy Shield Lock"
                className="w-28 h-28 md:w-36 md:h-36 object-contain filter drop-shadow-[0_0_25px_rgba(148,148,255,0.5)] hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-4 text-lazyText">
              Privacy Commitment
            </h2>
            <p className="text-lazyText/70 text-lg leading-relaxed">
              We take privacy seriously. Your content is never shared, reused, or displayed
              without your explicit consent — no matter the platform or project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-8 text-lazyText leading-tight">
              If you’ve been looking for the right editors <br className="hidden sm:block" />
              to trust with your content, you’re <br className="hidden sm:block" />
              in the right place
            </h2>
            <Link
              to="/contact"
              id="about-cta-btn"
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

export default About;
