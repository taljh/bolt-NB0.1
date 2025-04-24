import { motion } from "framer-motion";

interface Props {
  isVisible: boolean;
}

export function UnsavedChangesAlert({ isVisible }: Props) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      className="fixed top-4 right-4 left-4 md:left-auto md:w-96 bg-yellow-50 border border-yellow-200 p-4 rounded-lg shadow-lg z-50"
      layoutId="unsaved-changes-alert"
    >
      <p className="text-yellow-800 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        لديك تغييرات غير محفوظة
      </p>
    </motion.div>
  );
}