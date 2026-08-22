import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clapperboard, Mail, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  Pages: [
    { label: 'Home',      to: '/'          },
    { label: 'Services',  to: '/services'  },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'About',     to: '/about'     },
    { label: 'Contact',   to: '/contact'   },
  ],
};

const socials = [
  { icon: '/logos/instagram.png', href: 'https://www.instagram.com/teamlazydition?igsi=MXVrejhwaHdhaHZrNg==', label: 'Instagram' },
  { icon: '/logos/x.svg',         href: 'https://x.com/lazydition',       label: 'X / Twitter' },
];

const Footer = () => {
  return (
    <footer className="bg-lazyBg mt-auto">
      {/* CTA Strip */}
      <div>
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-lazyAccent font-semibold mb-3">Let's work together !</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-lazyText">
              begin your project{' '}
              <span className="bg-gradient-to-r from-lazyAccent to-lazyDeep bg-clip-text text-transparent">
                with us
              </span>
            </h2>
          </div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact"
              id="footer-cta-btn"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-lazyAccent to-lazyDeep text-white font-bold px-8 py-4 rounded-full shadow-[0_0_32px_rgba(148,148,255,0.3)] hover:shadow-[0_0_48px_rgba(148,148,255,0.5)] transition-shadow"
            >
              Start a Project <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2.5 mb-5">
              <img
                src="/lazydition_logo.png"
                alt="Lazydition Logo"
                className="w-10 h-10 object-contain filter drop-shadow-[0_0_12px_rgba(148,148,255,0.6)]"
              />
              <span className="text-xl font-extrabold text-white">
                lazydition
              </span>
            </div>
            <p className="text-lazyText/50 leading-relaxed mb-6 max-w-md text-sm font-medium">
              A friendly creative team behind creators, models and agencies
            </p>
            
            {/* Frameless High-Quality Social Media Logos (No Borders or Placeholders) */}
            <div className="flex items-center gap-5">
              <a
                href="mailto:lazydition@gmail.com"
                aria-label="Email"
                className="hover:scale-125 transition-transform duration-300 group"
              >
                <Mail className="w-6 h-6 text-lazyAccent filter drop-shadow-[0_0_8px_rgba(148,148,255,0.4)] group-hover:drop-shadow-[0_0_16px_rgba(148,148,255,0.8)]" />
              </a>

              {socials.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="hover:scale-125 transition-transform duration-300 group"
                >
                  <img
                    src={icon}
                    alt={label}
                    className="w-6 h-6 object-contain filter drop-shadow-[0_0_8px_rgba(148,148,255,0.4)] group-hover:drop-shadow-[0_0_16px_rgba(148,148,255,0.8)]"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-lazyAccent mb-5">{section}</h4>
              <ul className="space-y-3">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-lazyText/60 hover:text-white transition-colors duration-200 font-medium"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-lazyText/30 font-medium">
          <p>© {new Date().getFullYear()} Lazydition. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
