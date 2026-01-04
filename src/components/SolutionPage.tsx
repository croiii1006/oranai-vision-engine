import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  BarChart3,
  Palette,
  Shield,
  Globe,
  TrendingUp,
  Target,
  FileText,
  Layers,
  Settings,
  Users,
  Zap,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';
import AnimatedHeadline from './AnimatedHeadline';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

// Screen 1: Narrative Hero
const NarrativeHero: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen flex items-start justify-center pt-[25vh] px-4"
    >
      <div className="text-center max-w-[900px]">
        <AnimatedHeadline 
          text="AI Integrated Marketing Framework"
          as="h1"
          className="text-[100px] md:text-[120px] font-normal tracking-tight leading-[1.05] mb-8"
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-muted-foreground leading-[1.6]"
        >
          End-to-end brand intelligence, from insight to global execution.
        </motion.p>
      </div>
    </motion.section>
  );
};

// Screen 2: Framework Reveal
const FrameworkReveal: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const frameworks = [
    { word: 'Know', description: 'Transform data into brand intelligence' },
    { word: 'Build', description: 'Create cohesive brand identities' },
    { word: 'Manage', description: 'Maintain consistency at scale' },
    { word: 'Scale', description: 'Expand globally with precision' }
  ];

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <AnimatedHeadline 
        text="The system behind scalable brand growth"
        as="h2"
        className="text-[56px] font-normal text-center mb-16"
      />
      
      <motion.div
        className="flex items-center justify-center gap-8 md:gap-16 flex-wrap"
        variants={staggerChildren}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {frameworks.map((item, index) => (
          <motion.div
            key={item.word}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span 
              className={`text-[44px] font-medium transition-all duration-300 cursor-default ${
                hoveredIndex === index 
                  ? 'text-foreground' 
                  : 'text-muted-foreground/70'
              }`}
            >
              {item.word}
            </span>
            {index < frameworks.length - 1 && (
              <span className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 text-muted-foreground/30">
                —
              </span>
            )}
            
            {/* Hover description */}
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ 
                opacity: hoveredIndex === index ? 1 : 0, 
                y: hoveredIndex === index ? 0 : 4 
              }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-sm text-muted-foreground/60 whitespace-nowrap"
            >
              {item.description}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

// Stage Section Component (reusable for screens 3-6)
interface StageSectionProps {
  stageNumber: number;
  title: string;
  description: string;
  outcomes: { title: string; description: string; icon: React.ElementType }[];
  visualLabel: string;
  visualIcon: React.ElementType;
  layout: 'left-text' | 'right-text' | 'vertical' | 'full-width';
  titleSize?: string;
}

const StageSection: React.FC<StageSectionProps> = ({
  stageNumber,
  title,
  description,
  outcomes,
  visualLabel,
  visualIcon: VisualIcon,
  layout,
  titleSize = 'text-[36px]'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-150px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // Vertical layout (Screen 5 - Manage)
  if (layout === 'vertical') {
    return (
      <motion.section 
        ref={ref} 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen flex flex-col justify-center px-4 py-20"
      >
        <div className="max-w-4xl mx-auto w-full">
          {/* Text on top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <span className="text-xs tracking-[0.1em] text-muted-foreground uppercase mb-4 block">
              STAGE {stageNumber}
            </span>
            <AnimatedHeadline text={title} as="h2" className={`${titleSize} font-normal mb-4`} />
            <p className="text-[15px] text-muted-foreground leading-[1.7] max-w-[520px]">
              {description}
            </p>
          </motion.div>

          {/* Image below - Workflow visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-xl border border-border/20 p-8"
          >
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4">
              {['Review', 'Approve', 'Publish', 'Monitor', 'Alert'].map((step, index) => (
                <motion.div
                  key={step}
                  className="flex flex-col items-center min-w-[100px] group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-foreground/5 border border-border/30 flex items-center justify-center mb-2 group-hover:border-foreground/30 transition-colors">
                    {index === 0 && <FileText className="w-5 h-5 text-muted-foreground/60" />}
                    {index === 1 && <Check className="w-5 h-5 text-muted-foreground/60" />}
                    {index === 2 && <Zap className="w-5 h-5 text-muted-foreground/60" />}
                    {index === 3 && <BarChart3 className="w-5 h-5 text-muted-foreground/60" />}
                    {index === 4 && <AlertCircle className="w-5 h-5 text-muted-foreground/60" />}
                  </div>
                  <span className="text-xs text-muted-foreground/70 group-hover:text-foreground/80 transition-colors">
                    {step}
                  </span>
                  {index < 4 && (
                    <div className="absolute top-6 -right-8 w-8 h-px bg-border/40" />
                  )}
                </motion.div>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground/50 mt-4">{visualLabel}</p>
          </motion.div>

          {/* Outcome cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
          >
            {outcomes.map((outcome, index) => (
              <div
                key={index}
                className="glass rounded-lg p-5 border border-border/20 hover:border-border/40 transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <outcome.icon className="w-5 h-5 text-muted-foreground/60 mb-3" />
                <h3 className="text-sm font-medium mb-1">{outcome.title}</h3>
                <p className={`text-xs text-muted-foreground/70 transition-opacity duration-300 ${
                  hoveredCard === index ? 'opacity-100' : 'opacity-70'
                }`}>
                  {outcome.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    );
  }

  // Full-width layout (Screen 6 - Scale)
  if (layout === 'full-width') {
    return (
      <motion.section 
        ref={ref} 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-screen flex flex-col justify-center px-4 py-20"
      >
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <span className="text-xs tracking-[0.1em] text-muted-foreground uppercase mb-4 block">
              STAGE {stageNumber}
            </span>
            <AnimatedHeadline text={title} as="h2" className={`${titleSize} font-normal mb-4`} />
            <p className="text-[15px] text-muted-foreground leading-[1.7] max-w-[520px] mx-auto">
              {description}
            </p>
          </motion.div>

          {/* Full-width map visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-xl border border-border/20 p-8 aspect-[21/9] relative overflow-hidden"
          >
            {/* Abstract world map dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Simulated regions */}
                {[
                  { left: '20%', top: '30%', label: 'NA', kpi: '+24%' },
                  { left: '45%', top: '25%', label: 'EU', kpi: '+18%' },
                  { left: '70%', top: '35%', label: 'APAC', kpi: '+42%' },
                  { left: '55%', top: '55%', label: 'MEA', kpi: '+12%' },
                  { left: '30%', top: '65%', label: 'LATAM', kpi: '+31%' },
                ].map((region, index) => (
                  <motion.div
                    key={region.label}
                    className="absolute group cursor-pointer"
                    style={{ left: region.left, top: region.top }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <div className="w-3 h-3 rounded-full bg-foreground/20 group-hover:bg-foreground/40 transition-colors" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <span className="text-xs text-foreground/80">{region.label}</span>
                      <span className="text-xs text-green-400/80 ml-2">{region.kpi}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50">
              {visualLabel}
            </p>
          </motion.div>

          {/* Outcome cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
          >
            {outcomes.map((outcome, index) => (
              <div
                key={index}
                className="glass rounded-lg p-5 border border-border/20 hover:border-border/40 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <outcome.icon className="w-5 h-5 text-muted-foreground/60 mb-3" />
                <h3 className="text-sm font-medium mb-1">{outcome.title}</h3>
                <p className="text-xs text-muted-foreground/70">{outcome.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    );
  }

  // Left-text or right-text layout (Screens 3 & 4)
  const isLeftText = layout === 'left-text';

  return (
    <motion.section 
      ref={ref} 
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className={`flex flex-col ${isLeftText ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-16 items-center`}>
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: isLeftText ? 0.2 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            <span className="text-xs tracking-[0.1em] text-muted-foreground uppercase mb-4 block">
              STAGE {stageNumber}
            </span>
            <AnimatedHeadline text={title} as="h2" className={`${titleSize} font-normal mb-4`} />
            <p className="text-[15px] text-muted-foreground leading-[1.7] max-w-[520px] mb-8">
              {description}
            </p>

            {/* Outcome cards */}
            <div className="space-y-3">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={index}
                  className={`glass rounded-lg p-4 border border-border/20 transition-all duration-300 cursor-pointer ${
                    hoveredCard === index ? 'border-border/40 -translate-y-0.5' : ''
                  } ${expandedCard === index ? 'bg-foreground/[0.02]' : ''}`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                >
                  <div className="flex items-center gap-3">
                    <outcome.icon className="w-4 h-4 text-muted-foreground/60" />
                    <h3 className="text-sm font-medium">{outcome.title}</h3>
                  </div>
                  <motion.p
                    initial={false}
                    animate={{ 
                      height: hoveredCard === index || expandedCard === index ? 'auto' : 0,
                      opacity: hoveredCard === index || expandedCard === index ? 1 : 0
                    }}
                    className="text-xs text-muted-foreground/70 mt-2 overflow-hidden"
                  >
                    {outcome.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: isLeftText ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 w-full"
          >
            <div className="aspect-[4/3] glass rounded-xl border border-border/20 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-foreground/5 border border-border/30 flex items-center justify-center">
                  <VisualIcon className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <p className="text-sm text-muted-foreground/50">{visualLabel}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

// Screen 7: Synthesis / Closing
const SynthesisClosing: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <AnimatedHeadline 
        text="One system. Every stage of brand growth."
        as="h2"
        className="text-[96px] font-normal text-center mb-6"
      />
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="text-xl text-muted-foreground text-center mb-12"
      >
        Built for teams that need clarity, control and scale.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="group flex items-center gap-2 px-6 py-3 rounded-lg border border-foreground/20 hover:border-foreground/40 bg-foreground/5 hover:bg-foreground/10 transition-all duration-300"
      >
        <span className="text-sm">Get Started</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </motion.button>
    </motion.section>
  );
};

// Main Solution Page
const SolutionPage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Screen 1: Narrative Hero */}
      <NarrativeHero />
      
      {/* Screen 2: Framework Reveal */}
      <FrameworkReveal />
      
      {/* Screen 3: Know Your Brand */}
      <StageSection
        stageNumber={1}
        title="Know Your Brand"
        description="Transform raw data into actionable brand intelligence that drives strategic decisions."
        outcomes={[
          { title: 'Insight Map', description: 'Comprehensive market & audience intelligence', icon: BarChart3 },
          { title: 'Competitive Matrix', description: 'Real-time positioning analysis', icon: Target },
          { title: 'Sentiment Pulse', description: 'Brand perception & health metrics', icon: TrendingUp },
        ]}
        visualLabel="Market & Audience Insight Dashboard"
        visualIcon={BarChart3}
        layout="left-text"
        titleSize="text-[72px]"
      />
      
      {/* Screen 4: Build Your Brand */}
      <StageSection
        stageNumber={2}
        title="Build Your Brand"
        description="Turn insight into positioning, narrative and scalable content systems."
        outcomes={[
          { title: 'Brand Blueprint', description: 'Strategic brand architecture & guidelines', icon: Layers },
          { title: 'Content Engine', description: 'Scalable content production system', icon: FileText },
          { title: 'Creative Library', description: 'Unified asset management hub', icon: Palette },
        ]}
        visualLabel="Brand Kit & Content System"
        visualIcon={Palette}
        layout="right-text"
        titleSize="text-[68px]"
      />
      
      {/* Screen 5: Manage Your Brand */}
      <StageSection
        stageNumber={3}
        title="Manage Your Brand"
        description="Operate with governance, consistency and real-time intelligence."
        outcomes={[
          { title: 'Governance Layer', description: 'Automated compliance & approval flows', icon: Shield },
          { title: 'Operations Hub', description: 'Unified campaign management center', icon: Settings },
          { title: 'Community Matrix', description: 'Cross-channel engagement orchestration', icon: Users },
        ]}
        visualLabel="Brand Governance Workflow"
        visualIcon={Shield}
        layout="vertical"
        titleSize="text-[64px]"
      />
      
      {/* Screen 6: Scale Your Brand */}
      <StageSection
        stageNumber={4}
        title="Scale Your Brand"
        description="Expand globally with localized execution and predictive growth."
        outcomes={[
          { title: 'Growth Plan', description: 'Market expansion strategy & roadmap', icon: Globe },
          { title: 'Performance Matrix', description: 'Cross-market KPI tracking system', icon: TrendingUp },
          { title: 'Localization Engine', description: 'Cultural adaptation intelligence', icon: Zap },
        ]}
        visualLabel="Global Growth & Performance Map"
        visualIcon={Globe}
        layout="full-width"
        titleSize="text-[76px]"
      />
      
      {/* Screen 7: Synthesis / Closing */}
      <SynthesisClosing />
    </div>
  );
};

export default SolutionPage;
