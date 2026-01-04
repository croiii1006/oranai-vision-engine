import React from 'react';
import { BarChart3, Palette, Cog, Rocket, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedHeadline from './AnimatedHeadline';

const ProductsPage: React.FC = () => {
  const { t } = useLanguage();

  const products = [
    {
      icon: BarChart3,
      title: t('products.dashboard'),
      description: t('products.dashboardDesc'),
    },
    {
      icon: Palette,
      title: t('products.studio'),
      description: t('products.studioDesc'),
    },
    {
      icon: Cog,
      title: t('products.operations'),
      description: t('products.operationsDesc'),
    },
    {
      icon: Rocket,
      title: t('products.growth'),
      description: t('products.growthDesc'),
    },
  ];

  return (
    <div className="min-h-screen pt-32">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <AnimatedHeadline text={t('products.title')} as="h2" className="heading-lg mb-4" />
        <div className="w-16 h-px bg-foreground/20 mb-16" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="group glass rounded-3xl p-8 md:p-10 hover-lift glow-hover cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="glass p-4 rounded-2xl group-hover:bg-foreground/5 transition-colors duration-300">
                  <product.icon className="w-6 h-6" />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl font-medium mb-4">{product.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              <button className="flex items-center space-x-2 px-6 py-3 rounded-full border border-border/50 text-sm font-medium hover:bg-foreground hover:text-background transition-all duration-300 group/btn">
                <span>{t('products.requestDemo')}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>

              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-24 text-center">
          <div className="glass inline-block rounded-3xl p-12 md:p-16 max-w-2xl glow">
            <h3 className="heading-md mb-4">Enterprise Solutions</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Custom deployment, dedicated support, and tailored AI solutions for enterprise needs.
            </p>
            <button className="flex items-center space-x-2 mx-auto px-8 py-4 rounded-full bg-foreground text-background font-medium hover-lift glow-hover transition-all duration-300">
              <span>{t('nav.contactUs')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
