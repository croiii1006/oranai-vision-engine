import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import cardSolutions from '@/assets/cards/card-solutions.png';
import cardModels from '@/assets/cards/card-models.png';
import cardProducts from '@/assets/cards/card-products.png';
import cardLibrary from '@/assets/cards/card-library.png';

interface FeatureCardsProps {
  setActiveTab: (tab: string) => void;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({ setActiveTab }) => {
  const { language } = useLanguage();

  const cards = [
    {
      id: 'solution',
      title: language === 'en' ? 'Solutions' : '解决方案',
      image: cardSolutions,
      rotation: -15,
      delay: 0,
      x: -20,
      y: 0,
    },
    {
      id: 'models',
      title: language === 'en' ? 'Models' : '模型',
      image: cardModels,
      rotation: -5,
      delay: 0.1,
      x: 10,
      y: 20,
    },
    {
      id: 'products',
      title: language === 'en' ? 'Products' : '产品',
      image: cardProducts,
      rotation: 8,
      delay: 0.2,
      x: 30,
      y: 10,
    },
    {
      id: 'library',
      title: language === 'en' ? 'Library' : '素材库',
      image: cardLibrary,
      rotation: 18,
      delay: 0.3,
      x: 50,
      y: 30,
    },
  ];

  return (
    <div className="absolute left-6 sm:left-10 lg:left-16 bottom-[18%] z-10">
      <div className="relative flex items-end gap-[-60px]">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ 
              y: -600, 
              opacity: 0,
              rotate: card.rotation - 10,
            }}
            animate={{ 
              y: card.y, 
              opacity: 1,
              rotate: card.rotation,
            }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
              delay: 0.5 + card.delay,
            }}
            whileHover={{ 
              y: card.y - 20, 
              scale: 1.05,
              rotate: card.rotation + 2,
              zIndex: 50,
              transition: { duration: 0.3 }
            }}
            onClick={() => setActiveTab(card.id)}
            className="relative cursor-pointer group"
            style={{
              marginLeft: index === 0 ? 0 : '-40px',
              zIndex: index + 1,
            }}
          >
            <div 
              className="w-28 h-36 sm:w-32 sm:h-40 md:w-36 md:h-44 lg:w-40 lg:h-48 rounded-2xl overflow-hidden shadow-2xl bg-muted/80 backdrop-blur-sm border border-border/30 transition-shadow duration-300 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              <img 
                src={card.image} 
                alt={card.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-xs sm:text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                  {card.title}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;
