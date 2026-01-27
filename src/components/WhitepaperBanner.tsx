import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const STORAGE_KEY = 'whitepaper_banner_closed';

const WhitepaperBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Check if banner has been closed before
    const hasClosed = localStorage.getItem(STORAGE_KEY);
    if (!hasClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleDetailsClick = () => {
    window.open('https://whitebook.photog.art/', '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleClose}
          />
          {/* Centered Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card text-card-foreground px-8 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 min-w-[280px]"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-7 h-7 bg-muted text-muted-foreground rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-lg font-semibold text-center">
              {language === 'zh' ? 'OranAI白皮书已上线！' : 'OranAI Whitepaper is now live!'}
            </span>
            <button
              onClick={handleDetailsClick}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {language === 'zh' ? '查看详情' : 'View Details'}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WhitepaperBanner;
