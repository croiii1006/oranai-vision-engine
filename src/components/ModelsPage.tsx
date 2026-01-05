import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Import model category images
import modelNlp from '@/assets/models/model-nlp.png';
import modelMultimodal from '@/assets/models/model-multimodal.png';
import modelGeneration from '@/assets/models/model-generation.png';
import modelVision from '@/assets/models/model-vision.png';
import modelAudio from '@/assets/models/model-audio.png';

const categoryImages: Record<string, string> = {
  nlp: modelNlp,
  multimodal: modelMultimodal,
  generation: modelGeneration,
  vision: modelVision,
  audio: modelAudio,
};

const ModelsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sidebarFilter, setSidebarFilter] = useState('all');

  const filterCategories = [
    { id: 'all', label: t('common.all') },
    { id: 'nlp', label: t('models.nlp') },
    { id: 'multimodal', label: t('models.multimodal') },
    { id: 'generation', label: t('models.generation') },
    { id: 'vision', label: t('models.vision') },
    { id: 'audio', label: t('models.audio') },
  ];

  const sidebarFilters = [
    { id: 'all', label: t('common.all') },
    { id: 'enterprise', label: t('models.enterprise') },
    { id: 'nlp', label: t('models.nlp') },
    { id: 'vision', label: t('models.vision') },
  ];

  const models = [
    { id: 1, name: 'Oran-R1', version: '28B', category: 'nlp' },
    { id: 2, name: 'OranLM', version: '127B', category: 'nlp' },
    { id: 3, name: 'Oran-VL', version: '7B', category: 'multimodal' },
    { id: 4, name: 'OranVideo', version: '15B', category: 'generation' },
    { id: 5, name: 'Oran-MV2', version: '354B', category: 'generation' },
    { id: 6, name: 'Oran-ASR', version: '2B', category: 'audio' },
    { id: 7, name: 'Oran-TTS', version: '4B', category: 'audio' },
    { id: 8, name: 'Oran-OCR', version: '1B', category: 'vision' },
    { id: 9, name: 'Oran-VQA', version: '12B', category: 'multimodal' },
    { id: 10, name: 'Oran-IMG', version: '8B', category: 'generation' },
  ];

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || model.category === activeFilter;
    const matchesSidebar = sidebarFilter === 'all' || model.category === sidebarFilter;
    return matchesSearch && matchesFilter && matchesSidebar;
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {t('models.title')}
          </h1>
          
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-full border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
              />
            </div>
            <button className="px-8 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors">
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32">
              <h3 className="text-sm font-medium mb-4 text-muted-foreground">
                {t('models.filter')}
              </h3>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder={t('common.search')}
                  className="w-full px-4 py-2 rounded-full border border-border/50 bg-background/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                {sidebarFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSidebarFilter(filter.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm ${
                      sidebarFilter === filter.id
                        ? 'glass-tab-active'
                        : 'glass-tab text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-medium mb-4 text-muted-foreground">
                  {t('models.filter')}
                </h3>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder={t('common.search')}
                    className="w-full px-4 py-2 rounded-full border border-border/50 bg-background/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  {sidebarFilters.map((filter) => (
                    <button
                      key={filter.id}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm glass-tab text-muted-foreground hover:text-foreground"
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Model Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  className="group bg-muted/30 rounded-2xl p-6 hover:bg-muted/50 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden bg-muted/50">
                      <img 
                        src={categoryImages[model.category] || modelNlp} 
                        alt={model.category}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {model.name} {model.version}
                      </h3>
                      <p className="text-sm text-muted-foreground uppercase tracking-wide">
                        MODELS
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ModelsPage;
