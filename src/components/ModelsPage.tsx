import React from 'react';
import { Brain, Eye, Wand2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import GlowCard from './GlowCard';
import ScrollReveal from './ScrollReveal';
import AnimatedHeadline from './AnimatedHeadline';
import RotatingWord from './RotatingWord';
import InvestorLogos from './InvestorLogos';

const ModelsPage: React.FC = () => {
  const { t } = useLanguage();

  const modelCategories = [
    {
      icon: Brain,
      title: t('models.nlp'),
      models: t('models.nlpModels'),
      capabilities: [
        t('models.semantic'),
        t('models.sentiment'),
        t('models.translation'),
      ],
    },
    {
      icon: Eye,
      title: t('models.multimodal'),
      models: t('models.multimodalModels'),
      capabilities: [
        t('models.crossModal'),
        t('models.visualQA'),
        t('models.asrTts'),
      ],
    },
    {
      icon: Wand2,
      title: t('models.generation'),
      models: t('models.generationModels'),
      capabilities: [
        t('models.t2i'),
        t('models.t2v'),
        t('models.i2t'),
        t('models.voiceCloning'),
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-32">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Premium Headline Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6 flex items-baseline justify-center">
            <RotatingWord 
              words={['Enterprise', 'Agentic', 'Multimodal', 'Generative', 'Vision', 'Workflow']}
              interval={2200}
              className="text-foreground font-light"
            />
            <span className="text-foreground">Models</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground/70 font-light tracking-wide">
            Models built for real-world enterprise AI.
          </p>
        </div>

        {/* Investor Logos */}
        <InvestorLogos />

        <div className="w-16 h-px bg-foreground/20 mx-auto mb-16 mt-8" />

        <div className="space-y-8">
          {modelCategories.map((category, index) => (
            <ScrollReveal key={index}>
              <GlowCard
                className="glass rounded-3xl hover-lift"
              >
                <div className="p-8 md:p-12">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                    {/* Left - Title and Icon */}
                    <div className="flex items-start space-x-6">
                      <div className="glass p-4 rounded-2xl">
                        <category.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="heading-md mb-2">{category.title}</h3>
                        <p className="font-mono text-sm text-muted-foreground">
                          {category.models}
                        </p>
                      </div>
                    </div>

                    {/* Right - Capabilities */}
                    <div className="flex flex-wrap gap-3 lg:max-w-md">
                      {category.capabilities.map((capability, capIndex) => (
                        <div
                          key={capIndex}
                          className="px-4 py-2 rounded-full border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer"
                        >
                          {capability}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="mt-8 pt-8 border-t border-border/30">
                    <div className="flex flex-wrap gap-6 text-xs font-mono text-muted-foreground">
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-foreground/30" />
                        <span>Enterprise Ready</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-foreground/30" />
                        <span>API Access</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-foreground/30" />
                        <span>On-premise Available</span>
                      </span>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Technical Architecture Diagram (Minimal) */}
        <ScrollReveal>
          <div className="mt-24">
            <h3 className="text-lg font-medium mb-8 text-center text-muted-foreground">Architecture Overview</h3>
            <div className="glass rounded-2xl p-12">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center">
                    <span className="font-mono text-sm">Input</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Text / Image / Audio</span>
                </div>
                <div className="w-16 h-px md:w-px md:h-16 bg-foreground/20" />
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-24 h-24 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                    <span className="font-mono text-sm">OranAI</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Multimodal Processing</span>
                </div>
                <div className="w-16 h-px md:w-px md:h-16 bg-foreground/20" />
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center">
                    <span className="font-mono text-sm">Output</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Intelligence / Content</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default ModelsPage;
