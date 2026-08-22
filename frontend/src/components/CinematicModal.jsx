import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getMediaUrl, isVideoMedia } from '../api/client';

const CinematicModal = ({ isOpen, item, src, onClose, layoutId }) => {
  const rawMedia = src || item?.img || item?.mediaUrl;
  const activeMedia = getMediaUrl(rawMedia);
  const showModal = isOpen !== undefined ? isOpen : Boolean(item);

  if (!showModal || !rawMedia) return null;

  const isVideo = isVideoMedia(rawMedia);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-lazyAccent text-white transition-all z-50 backdrop-blur-lg border border-white/20 shadow-lg cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.div
          layoutId={layoutId}
          className="relative w-full max-w-5xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border-2 border-lazyAccent/30 bg-black flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        >
          {isVideo ? (
            <video
              src={activeMedia}
              controls
              autoPlay
              playsInline
              className="w-full max-h-[85vh] object-contain bg-black"
            />
          ) : (
            <img
              src={activeMedia}
              alt="Media Preview"
              className="w-full max-h-[85vh] object-contain bg-black"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CinematicModal;
