import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HomePage from '@/components/HomePage';
import ModelsPage from '@/components/ModelsPage';
import ProductsPage from '@/components/ProductsPage';
import LibraryPage from '@/components/LibraryPage';
import Footer from '@/components/Footer';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFooterInSolution, setShowFooterInSolution] = useState(false);

  const handleScrollToFooter = () => {
    setShowFooterInSolution(true);
    // 滚动到footer
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleHideFooter = () => {
    setShowFooterInSolution(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'models':
        return <ModelsPage />;
      case 'products':
        return <ProductsPage />;
      case 'library':
        return <LibraryPage />;
      case 'home':
      case 'hero':
      case 'solution':
      default:
        return <HomePage activeTab={activeTab} setActiveTab={setActiveTab} onScrollToFooter={handleScrollToFooter} onHideFooter={handleHideFooter} />;
    }
  };

  // Show footer for non-scroll pages or when scrolled to footer in solution page
  const showFooter = !['home', 'hero', 'solution'].includes(activeTab) || (activeTab === 'solution' && showFooterInSolution);
  
  // Reset showFooterInSolution when leaving solution page
  useEffect(() => {
    if (activeTab !== 'solution') {
      setShowFooterInSolution(false);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="animate-fade-in">
        {renderContent()}
      </main>

      {showFooter && <Footer setActiveTab={setActiveTab} />}
    </div>
  );
};

export default Index;
