import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RequestAccessModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-lazyBg/95 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-lazyBg border border-lazyText/10 rounded-3xl p-8 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-lazyText/40 hover:text-lazyText transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 bg-lazyAccent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-lazyAccent">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-bold mb-4 text-lazyText">Exclusive Content</h2>
            <p className="text-lazyText/50 mb-8">This premium client work is protected under NDA or is exclusive. Please apply to view our private portfolio.</p>

            <Link 
              to="/contact"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-lazyAccent to-lazyDeep hover:opacity-90 text-white font-bold py-4 rounded-xl transition-opacity shadow-[0_0_20px_rgba(148,148,255,0.25)]"
            >
              Request Access <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RequestAccessModal;
