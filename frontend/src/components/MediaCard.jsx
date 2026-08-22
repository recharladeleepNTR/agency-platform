import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const isVideoSrc = (src) => src && /\.(mp4|mov|webm|avi)(\?.*)?$/i.test(src);

const MediaCard = ({ src, thumbnail, title, ratio = '16:9', onClick, layoutId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const ratioClasses = {
    '1:1': 'aspect-square',
    '4:5': 'aspect-[4/5]',
    '9:16': 'aspect-[9/16]',
    '16:9': 'aspect-video',
  };

  const useVideoPoster = !thumbnail && isVideoSrc(src);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      layoutId={layoutId}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer group bg-lazyBg border border-lazyText/5",
        ratioClasses[ratio] || 'aspect-video'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{
        scale: 1.03,
        y: -6,
        boxShadow: '0 0 30px rgba(148, 148, 255, 0.4)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Static thumbnail */}
      {thumbnail ? (
        <div
          className={cn(
            "absolute inset-0 bg-cover bg-center transition-opacity duration-500 z-0",
            isHovered ? "opacity-0" : "opacity-100"
          )}
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-lazyDeep/30 via-lazyBg to-lazyBg z-0" />
      )}

      {/* Video element */}
      {isVideoSrc(src) && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload={useVideoPoster ? "metadata" : "none"}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-0",
            useVideoPoster ? "opacity-100" : isHovered ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Overlay Details */}
      <div className="absolute inset-0 bg-gradient-to-t from-lazyBg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-20">
        <h3 className="text-lazyText font-bold text-lg mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{title}</h3>
      </div>
    </motion.div>
  );
};

export default MediaCard;
