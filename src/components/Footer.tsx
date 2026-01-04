import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();

  const footerLinks = [
    { label: t('nav.business'), action: () => setActiveTab('business') },
    { label: t('nav.models'), action: () => setActiveTab('models') },
    { label: t('nav.products'), action: () => setActiveTab('products') },
    { label: t('sidebar.resources'), action: () => {} },
    { label: t('sidebar.aboutUs'), action: () => {} },
  ];

  return (
    <footer className="border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background text-sm font-bold">O</span>
            </div>
            <span className="text-lg font-light tracking-tight">OranAI</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {footerLinks.map((link, index) => (
              <button
                key={index}
                onClick={link.action}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 link-underline"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
