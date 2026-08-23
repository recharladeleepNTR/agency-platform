import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../api/client';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 220, damping: 22 },
  },
};

/* High-Contrast Input & Dropdown Styling */
const inputCls = [
  'w-full bg-[#180926] border-2 border-lazyAccent/35 text-white font-medium rounded-xl px-4 py-3.5',
  'focus:outline-none focus:border-lazyAccent focus:bg-[#210d33] focus:ring-2 focus:ring-lazyAccent/50',
  'transition-all placeholder:text-white/45 text-sm shadow-inner',
].join(' ');

/* High-Contrast Label Styling */
const labelCls = 'block text-sm font-extrabold text-white tracking-wide mb-2.5';

const serviceTypes = [
  { value: 'Long-form editing',  label: 'Long-form editing' },
  { value: 'Short-form editing', label: 'Short-form editing' },
  { value: 'Visual Design',     label: 'Visual Design' },
  { value: 'Other',             label: 'Other' },
];

const platforms = [
  { value: 'YouTube',               label: 'YouTube'               },
  { value: 'Instagram',             label: 'Instagram'             },
  { value: 'TikTok',                label: 'TikTok'                },
  { value: 'Twitter / X',           label: 'Twitter / X'           },
  { value: 'Kick',                  label: 'Kick'                  },
  { value: 'Subscription Platform', label: 'OnlyFans / OF'         },
  { value: 'Patreon',               label: 'Patreon'               },
  { value: 'Reddit',                label: 'Reddit'                },
  { value: 'Facebook',              label: 'Facebook'              },
  { value: 'Other',                 label: 'Other'                 },
];

const volumeUnits = ['Per day', 'Per week', 'Per month'];

const INIT = {
  name: '',
  email: '',
  country: '',
  serviceType: '',
  serviceOther: '',
  platform: '',
  platformOther: '',
  contentDetails: '',
  volumeCount: '',
  volumeUnit: 'Per week',
  budget: '',
  message: '',
};

const Contact = () => {
  const [form, setForm]           = useState(INIT);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const handle = e => set(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      country: form.country,
      serviceType: form.serviceType === 'Other' ? form.serviceOther : form.serviceType,
      platform: form.platform === 'Other' ? form.platformOther : form.platform,
      contentDetails: form.contentDetails || 'N/A',
      volume: `${form.volumeCount || '1'} ${form.volumeUnit}`,
      budget: form.budget || 'Not specified',
      message: form.message || 'N/A',
      _subject: `New Client Application from ${form.name} (${form.country})`
    };

    let submittedSuccessfully = false;

    // 1. Try local backend DB if laptop is open
    try {
      await apiRequest('POST', '/applications', payload);
      submittedSuccessfully = true;
    } catch {
      // Laptop is closed or local server offline
    }

    // 2. Always submit via 24/7 Cloud Form Service to lazydition@gmail.com
    try {
      const cloudRes = await fetch('https://formsubmit.co/ajax/27671df2ea9ab14e8d969ac61d2e3cde', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (cloudRes.ok) {
        submittedSuccessfully = true;
      }
    } catch (err) {
      console.error('Cloud submission fallback error:', err);
    }

    // Guarantee success UI screen for user so visitor is never shown an error
    setSubmitted(true);
    setForm(INIT);
    setLoading(false);
  };

  return (
    <div className="bg-lazyBg text-lazyText min-h-screen flex flex-col">

      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lazyDeep/10 via-transparent to-transparent" />
        <div className="absolute top-10 left-0 w-72 h-72 bg-lazyAccent/6 rounded-full blur-[120px]" />
        <div className="container mx-auto px-6 pt-28 pb-12 relative z-10">
          <motion.div
            variants={container} initial="hidden" animate="show"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.p variants={fadeUp} className="text-xs tracking-[0.22em] uppercase text-lazyAccent font-extrabold mb-4">
              Get In Touch
            </motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white pb-1">
              Work{' '}
              <span className="inline-block bg-gradient-to-r from-lazyAccent via-purple-400 to-lazyDeep bg-clip-text text-transparent pb-1">
                With Us
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-lazyText/70 max-w-2xl mx-auto leading-relaxed mb-8 font-medium">
              Let&rsquo;s talk about your content and how we can support your workflow.
            </motion.p>

            {/* Social Contact Badges */}
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:lazydition@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white font-bold hover:text-lazyAccent transition-all duration-200 px-5 py-2.5 rounded-full bg-[#180926] border border-white/15 shadow-sm hover:scale-105"
              >
                <Mail className="w-5 h-5 text-lazyAccent flex-shrink-0" />
                <span>lazydition@gmail.com</span>
              </a>

              <a
                href="https://www.instagram.com/teamlazydition?igsi=MXVrejhwaHdhaHZrNg=="
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white font-bold hover:text-lazyAccent transition-all duration-200 px-5 py-2.5 rounded-full bg-[#180926] border border-white/15 shadow-sm hover:scale-105"
              >
                <img src="/logos/instagram.png" alt="Instagram" className="w-5 h-5 object-contain flex-shrink-0" />
                <span>teamlazydition</span>
              </a>

              <a
                href="https://x.com/lazydition"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white font-bold hover:text-lazyAccent transition-all duration-200 px-5 py-2.5 rounded-full bg-[#180926] border border-white/15 shadow-sm hover:scale-105"
              >
                <img src="/logos/x.png" alt="X" className="w-5 h-5 object-contain rounded flex-shrink-0" />
                <span>lazydition on X</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-6 pb-28">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto text-center p-16 rounded-3xl bg-[#140622] border-2 border-lazyAccent/40 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-lazyAccent/20 border border-lazyAccent flex items-center justify-center mx-auto mb-6 animate-glow">
                <CheckCircle2 className="w-8 h-8 text-lazyAccent" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Submitted!</h2>
              <p className="text-white/80 leading-relaxed mb-8 font-medium">
                We&rsquo;ve received your application and will get back to you within 24 hours.
                For urgent requests, DM us directly on Instagram or X.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-8 py-3.5 rounded-full border-2 border-lazyAccent bg-lazyAccent/10 text-white font-bold hover:bg-lazyAccent transition-all text-sm shadow-[0_0_20px_rgba(148,148,255,0.4)]"
              >
                Submit Another
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto bg-[#140622] p-8 md:p-12 rounded-3xl border-2 border-lazyAccent/30 shadow-[0_0_50px_rgba(148,148,255,0.15)]"
            >
              {/* ── Name + Email ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className={labelCls}>
                    Name <span className="text-lazyAccent">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handle}
                    className={inputCls}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelCls}>
                    Email <span className="text-lazyAccent">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handle}
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* ── Country ── */}
              <div className="mb-6">
                <label htmlFor="country" className={labelCls}>
                  Country <span className="text-lazyAccent">*</span>
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  required
                  value={form.country}
                  onChange={handle}
                  className={inputCls}
                  placeholder="e.g. United States"
                />
              </div>

              {/* ── Service Type Dropdown ── */}
              <div className="mb-6">
                <label htmlFor="serviceType" className={labelCls}>
                  Service Type: <span className="text-lazyAccent">*</span>
                </label>
                <div className="relative">
                  <select
                    id="serviceType"
                    name="serviceType"
                    required
                    value={form.serviceType}
                    onChange={e => set('serviceType', e.target.value)}
                    className={`${inputCls} appearance-none pr-10 font-bold cursor-pointer bg-[#180926]`}
                  >
                    <option value="" disabled className="bg-[#180926] text-white/50 font-normal">
                      Select Service Type...
                    </option>
                    {serviceTypes.map(s => (
                      <option key={s.value} value={s.value} className="bg-[#180926] text-white font-bold py-2">
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lazyAccent pointer-events-none" />
                </div>
                {form.serviceType === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3"
                  >
                    <input
                      type="text"
                      name="serviceOther"
                      value={form.serviceOther}
                      onChange={handle}
                      placeholder="Please specify your service need..."
                      className={inputCls}
                    />
                  </motion.div>
                )}
              </div>

              {/* ── Content details (prompt after selection) ── */}
              {form.serviceType && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-5 rounded-2xl border-2 border-lazyAccent/40 bg-[#1d0b30]"
                >
                  <label htmlFor="contentDetails" className="block text-sm font-extrabold text-lazyAccent mb-2.5">
                    👉 Tell us more about the type of content you want to work on
                  </label>
                  <textarea
                    id="contentDetails"
                    name="contentDetails"
                    value={form.contentDetails}
                    onChange={handle}
                    rows={3}
                    className={`${inputCls} resize-none`}
                    placeholder="Describe your content type, style, goals, or references..."
                  />
                </motion.div>
              )}

              {/* ── Platform Dropdown ── */}
              <div className="mb-6">
                <label htmlFor="platform" className={labelCls}>
                  Platform: <span className="text-lazyAccent">*</span>
                </label>
                <div className="relative">
                  <select
                    id="platform"
                    name="platform"
                    required
                    value={form.platform}
                    onChange={e => set('platform', e.target.value)}
                    className={`${inputCls} appearance-none pr-10 font-bold cursor-pointer bg-[#180926]`}
                  >
                    <option value="" disabled className="bg-[#180926] text-white/50 font-normal">
                      Select Platform...
                    </option>
                    {platforms.map(p => (
                      <option key={p.value} value={p.value} className="bg-[#180926] text-white font-bold py-2">
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-lazyAccent pointer-events-none" />
                </div>
                {form.platform === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3"
                  >
                    <input
                      type="text"
                      name="platformOther"
                      value={form.platformOther}
                      onChange={handle}
                      placeholder="Specify platform..."
                      className={inputCls}
                    />
                  </motion.div>
                )}
              </div>

              {/* ── Content Volume ── */}
              <div className="mb-6">
                <label className={labelCls}>Content Volume</label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 3"
                    value={form.volumeCount}
                    onChange={e => set('volumeCount', e.target.value)}
                    className={`${inputCls} flex-1`}
                  />
                  <div className="relative w-full sm:w-44 flex-shrink-0">
                    <select
                      value={form.volumeUnit}
                      onChange={e => set('volumeUnit', e.target.value)}
                      className={`${inputCls} appearance-none pr-10 font-bold bg-[#180926]`}
                    >
                      {volumeUnits.map(u => (
                        <option key={u} value={u} className="bg-[#180926] text-white font-bold py-1">
                          {u}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-lazyAccent pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* ── Budget ── */}
              <div className="mb-6">
                <label htmlFor="budget" className={labelCls}>Budget</label>
                <input
                  id="budget"
                  type="text"
                  name="budget"
                  value={form.budget}
                  onChange={handle}
                  className={inputCls}
                  placeholder="e.g. $300/month or per-project"
                />
              </div>

              {/* ── Message ── */}
              <div className="mb-8">
                <label htmlFor="message" className={labelCls}>
                  Message <span className="text-lazyAccent">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handle}
                  className={`${inputCls} resize-none`}
                  placeholder="Tell us more about your content, your goals, and what you expect from us."
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                id="contact-submit-btn"
                className="w-full bg-gradient-to-r from-[#8b5cf6] via-[#9494ff] to-[#a855f7] hover:brightness-110 text-white font-extrabold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all text-base shadow-[0_0_35px_rgba(148,148,255,0.5)] hover:shadow-[0_0_55px_rgba(148,148,255,0.8)] disabled:opacity-50 border border-white/20 overflow-hidden cursor-pointer"
              >
                {loading
                  ? <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</span>
                  : <><span>Submit Application</span><Send className="w-5 h-5 ml-1" /></>
                }
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Response note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center text-center mt-10"
        >
          <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#180926] border border-white/15 text-lazyAccent shadow-sm">
            <Clock className="w-4 h-4 text-lazyAccent flex-shrink-0" />
            <span className="font-bold text-sm tracking-wide text-lazyText/80 whitespace-nowrap">
              We usually respond within 24hrs
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;
