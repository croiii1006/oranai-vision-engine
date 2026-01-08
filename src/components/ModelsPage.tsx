import React, { useState } from 'react';
import { ArrowUp, ArrowRight, ChevronDown, ChevronUp, Sparkles, Brain, Diamond, Layers, Wind, Moon, Zap, Play, Video, Grid3X3, MessageCircle, ShoppingBag, Bot, HelpCircle, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  audio: modelAudio
};
interface Model {
  id: number;
  name: string;
  version: string;
  category: string;
  inputPrice: string;
  outputPrice: string;
  contextLength: string;
  maxOutput: string;
  cutoff: string;
}
const ModelsPage: React.FC = () => {
  const {
    t
  } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const filterCategories = [{
    id: 'all',
    label: t('common.all')
  }, {
    id: 'nlp',
    label: t('models.nlp')
  }, {
    id: 'multimodal',
    label: t('models.multimodal')
  }, {
    id: 'generation',
    label: t('models.generation')
  }, {
    id: 'vision',
    label: t('models.vision')
  }, {
    id: 'audio',
    label: t('models.audio')
  }];

  // Filter states for each category
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [billingFilter, setBillingFilter] = useState('all');
  const [endpointFilter, setEndpointFilter] = useState('all');

  // Expand states for each filter section
  const [supplierExpanded, setSupplierExpanded] = useState(false);
  const [endpointExpanded, setEndpointExpanded] = useState(false);
  const supplierOptions: {
    id: string;
    label: string;
    icon: LucideIcon;
  }[] = [{
    id: 'all',
    label: '全部供应商',
    icon: Grid3X3
  }, {
    id: 'anthropic',
    label: 'Anthropic',
    icon: Sparkles
  }, {
    id: 'deepseek',
    label: 'DeepSeek',
    icon: Brain
  }, {
    id: 'google',
    label: 'Google',
    icon: Diamond
  }, {
    id: 'meta',
    label: 'Meta',
    icon: Layers
  }, {
    id: 'mistral',
    label: 'Mistral',
    icon: Wind
  }, {
    id: 'moonshot',
    label: 'Moonshot',
    icon: Moon
  }, {
    id: 'openai',
    label: 'OpenAI',
    icon: Sparkles
  }, {
    id: 'xai',
    label: 'xAI',
    icon: Zap
  }, {
    id: 'bytedance',
    label: '字节跳动',
    icon: Play
  }, {
    id: 'kuaishou',
    label: '快手',
    icon: Video
  }, {
    id: 'zhipu',
    label: '智谱',
    icon: Grid3X3
  }, {
    id: 'tencent',
    label: '腾讯',
    icon: MessageCircle
  }, {
    id: 'alibaba',
    label: '阿里巴巴',
    icon: ShoppingBag
  }, {
    id: 'lingyiwanwu',
    label: '零一万物',
    icon: Bot
  }, {
    id: 'unknown',
    label: '未知供应商',
    icon: HelpCircle
  }];
  const billingOptions = [{
    id: 'all',
    label: '全部类型'
  }, {
    id: 'usage',
    label: '按量计费'
  }, {
    id: 'times',
    label: '按次计费'
  }];
  const endpointOptions = [{
    id: 'all',
    label: '全部端点'
  }, {
    id: 'image-generation',
    label: 'image-generation'
  }, {
    id: 'openai',
    label: 'openai'
  }, {
    id: 'openai-response',
    label: 'openai-response'
  }];

  // Gradient styles for cards
  const gradients = ['bg-gradient-to-br from-fuchsia-400 via-orange-300 to-cyan-300', 'bg-gradient-to-br from-orange-400 via-pink-300 to-cyan-200', 'bg-gradient-to-br from-cyan-200 via-pink-200 to-orange-300', 'bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-200', 'bg-gradient-to-br from-blue-300 via-purple-200 to-pink-300', 'bg-gradient-to-br from-teal-300 via-cyan-200 to-pink-200'];
  const models = [{
    id: 1,
    name: 'Oran-R1',
    version: '28B',
    category: 'nlp',
    inputPrice: '$1.75',
    outputPrice: '$14.00',
    contextLength: '400K',
    maxOutput: '128K',
    cutoff: 'Aug 31, 2025'
  }, {
    id: 2,
    name: 'OranLM',
    version: '127B',
    category: 'nlp',
    inputPrice: '$21.00',
    outputPrice: '$168.00',
    contextLength: '400K',
    maxOutput: '128K',
    cutoff: 'Aug 31, 2025'
  }, {
    id: 3,
    name: 'Oran-VL',
    version: '7B',
    category: 'multimodal',
    inputPrice: '$0.25',
    outputPrice: '$2.00',
    contextLength: '400K',
    maxOutput: '128K',
    cutoff: 'Sep 30, 2024'
  }, {
    id: 4,
    name: 'OranVideo',
    version: '15B',
    category: 'generation',
    inputPrice: '$3.50',
    outputPrice: '$28.00',
    contextLength: '200K',
    maxOutput: '64K',
    cutoff: 'Jun 15, 2025'
  }, {
    id: 5,
    name: 'Oran-MV2',
    version: '354B',
    category: 'generation',
    inputPrice: '$45.00',
    outputPrice: '$360.00',
    contextLength: '500K',
    maxOutput: '256K',
    cutoff: 'Dec 1, 2025'
  }, {
    id: 6,
    name: 'Oran-ASR',
    version: '2B',
    category: 'audio',
    inputPrice: '$0.10',
    outputPrice: '$0.80',
    contextLength: '100K',
    maxOutput: '32K',
    cutoff: 'Mar 20, 2025'
  }, {
    id: 7,
    name: 'Oran-TTS',
    version: '4B',
    category: 'audio',
    inputPrice: '$0.15',
    outputPrice: '$1.20',
    contextLength: '100K',
    maxOutput: '32K',
    cutoff: 'Mar 20, 2025'
  }, {
    id: 8,
    name: 'Oran-OCR',
    version: '1B',
    category: 'vision',
    inputPrice: '$0.05',
    outputPrice: '$0.40',
    contextLength: '50K',
    maxOutput: '16K',
    cutoff: 'Jan 10, 2025'
  }, {
    id: 9,
    name: 'Oran-VQA',
    version: '12B',
    category: 'multimodal',
    inputPrice: '$2.00',
    outputPrice: '$16.00',
    contextLength: '300K',
    maxOutput: '64K',
    cutoff: 'Jul 25, 2025'
  }, {
    id: 10,
    name: 'Oran-IMG',
    version: '8B',
    category: 'generation',
    inputPrice: '$1.00',
    outputPrice: '$8.00',
    contextLength: '200K',
    maxOutput: '64K',
    cutoff: 'May 5, 2025'
  }];
  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || model.category === activeFilter;
    return matchesSearch && matchesFilter;
  });
  return <div className="min-h-screen pt-32 pb-20">
      <div className="w-full px-6 sm:px-10 lg:px-16">
        {/* Header with Title and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {t('models.title')}
          </h1>
          
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="flex-1 relative">
              <input type="text" placeholder={t('common.search')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-6 py-3 rounded-full border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 transition-colors" />
            </div>
            <button className="px-8 py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors">
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-none">
              {/* Header with title and reset */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-medium">筛选</h3>
                <button onClick={() => {
                setSupplierFilter('all');
                setBillingFilter('all');
                setEndpointFilter('all');
              }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  重置
                </button>
              </div>

              {/* 供应商 Section */}
              <div className="mb-6 border-t border-border/30 pt-4">
                <h4 className="text-sm font-medium mb-3 text-left">供应商</h4>
                <div className="flex flex-col gap-2">
                  {(supplierExpanded ? supplierOptions : supplierOptions.slice(0, 4)).map(option => {
                  const IconComponent = option.icon;
                  return <button key={option.id} onClick={() => setSupplierFilter(option.id)} className={`px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors ${supplierFilter === option.id ? 'bg-foreground/20 text-foreground' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        <span>{option.label}</span>
                      </button>;
                })}
                  {supplierOptions.length > 4 && <button onClick={() => setSupplierExpanded(!supplierExpanded)} className="gap-1 text-xs text-muted-foreground hover:text-foreground py-1 flex items-center justify-end">
                      {supplierExpanded ? <>收起 <ChevronUp className="w-3 h-3" /></> : <>展开更多 <ChevronDown className="w-3 h-3" /></>}
                    </button>}
                </div>
              </div>

              {/* 计费类型 Section */}
              <div className="mb-6 border-t border-border/30 pt-4">
                <h4 className="text-sm font-medium mb-3 text-left">计费类型</h4>
                <div className="flex flex-col gap-2">
                  {billingOptions.map(option => <button key={option.id} onClick={() => setBillingFilter(option.id)} className={`px-3 py-2 rounded-lg text-xs text-center transition-colors ${billingFilter === option.id ? 'bg-foreground/20 text-foreground' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                      {option.label}
                    </button>)}
                </div>
              </div>

              {/* 端点类型 Section */}
              <div className="border-t border-border/30 pt-4">
                <h4 className="text-sm font-medium mb-3 text-left">端点类型</h4>
                <div className="flex flex-col gap-2">
                  {(endpointExpanded ? endpointOptions : endpointOptions.slice(0, 4)).map(option => <button key={option.id} onClick={() => setEndpointFilter(option.id)} className={`px-3 py-2 rounded-lg text-xs text-center transition-colors ${endpointFilter === option.id ? 'bg-foreground/20 text-foreground' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                      {option.label}
                    </button>)}
                  {endpointOptions.length > 4 && <button onClick={() => setEndpointExpanded(!endpointExpanded)} className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground py-1">
                      {endpointExpanded ? <>收起 <ChevronUp className="w-3 h-3" /></> : <>展开更多 <ChevronDown className="w-3 h-3" /></>}
                    </button>}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Model Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredModels.map((model, index) => <div key={model.id} onClick={() => setSelectedModel(model)} className={`group rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300 relative min-h-[420px] ${gradients[index % gradients.length]}`}>
                  {/* Hover overlay with Learn more */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2 text-white font-light text-lg">
                      <span>Learn more</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Content floating on gradient */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-gray-800 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-3xl font-sans font-light tracking-tight mb-4">
                      {model.name} {model.version}
                    </h3>
                    
                    <div className="space-y-0.5 text-sm font-light">
                      <p>Input: {model.inputPrice} per 1M tokens</p>
                      <p>Output: {model.outputPrice} per 1M tokens</p>
                    </div>
                    
                    <div className="mt-4 space-y-0.5 text-sm font-light">
                      <p>{model.contextLength} context length</p>
                      <p>{model.maxOutput} max output tokens</p>
                    </div>
                    
                    <p className="mt-4 text-sm font-light">
                      Knowledge cut-off: {model.cutoff}
                    </p>
                  </div>
                </div>)}
            </div>
          </main>
        </div>
      </div>

      {/* Model Detail Dialog */}
      <Dialog open={!!selectedModel} onOpenChange={() => setSelectedModel(null)}>
        <DialogContent className="max-w-2xl">
          {selectedModel && <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-light">
                  {selectedModel.name} {selectedModel.version}
                </DialogTitle>
              </DialogHeader>
              
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pricing</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Input</span>
                        <span className="font-medium">{selectedModel.inputPrice} / 1M tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Output</span>
                        <span className="font-medium">{selectedModel.outputPrice} / 1M tokens</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Specifications</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Context Length</span>
                        <span className="font-medium">{selectedModel.contextLength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Output</span>
                        <span className="font-medium">{selectedModel.maxOutput}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Category</span>
                    <span className="px-3 py-1 rounded-full bg-muted text-sm capitalize">{selectedModel.category}</span>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-muted-foreground">Knowledge Cut-off</span>
                    <span className="font-medium">{selectedModel.cutoff}</span>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="w-full py-3 rounded-full bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2">
                    <span>Try this model</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>}
        </DialogContent>
      </Dialog>
    </div>;
};
export default ModelsPage;