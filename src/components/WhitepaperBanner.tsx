import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const WhitepaperBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Show banner on every homepage visit
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDetailsClick = () => {
    window.open('https://whitebook.photog.art/', '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg flex items-center gap-4"
        >
          <span className="text-sm font-medium">
            {language === 'zh' ? 'OranAI白皮书已上线！' : 'OranAI Whitepaper is now live!'}
          </span>
          <button
            onClick={handleDetailsClick}
            className="text-sm font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {language === 'zh' ? '详情' : 'Details'}
          </button>
          <button
            onClick={handleClose}
            className="absolute -top-2 -right-2 w-6 h-6 bg-background text-foreground rounded-full flex items-center justify-center shadow-md hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhitepaperBanner;
