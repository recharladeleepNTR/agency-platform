import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-zinc-800 border-t-accent rounded-full"
      />
    </div>
  );
};

export default LoadingSpinner;
