import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import HeroSection from '@/components/HeroSection';
import SolutionPage from '@/components/SolutionPage';
import ModelsPage from '@/components/ModelsPage';
import ProductsPage from '@/components/ProductsPage';
import LibraryPage from '@/components/LibraryPage';
import Footer from '@/components/Footer';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'solution':
        return <SolutionPage />;
      case 'models':
        return <ModelsPage />;
      case 'products':
        return <ProductsPage />;
      case 'library':
        return <LibraryPage />;
      default:
        return <HeroSection setActiveTab={setActiveTab} />;
    }
  };

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

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default Index;
