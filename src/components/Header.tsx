import React, { useState } from 'react';
import { Menu, X, Globe, Sun, Moon, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [signInOpen, setSignInOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const tabs = [
    { id: 'solution', label: t('nav.solution') },
    { id: 'models', label: t('nav.models') },
    { id: 'products', label: t('nav.products') },
    { id: 'library', label: t('nav.library') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual sign in logic
    console.log('Sign in with:', email, password);
    setSignInOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-md bg-background/20 dark:bg-background/10 border-b border-foreground/10 dark:border-border/20">
        <div className="w-full px-6 sm:px-10 lg:px-16">
          <div className="relative flex items-center justify-between h-16">
            {/* Left - Logo with glassmorphism */}
            <div className="flex items-center space-x-3 z-10">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <div 
                onClick={() => setActiveTab('hero')}
                className="glass px-4 py-1.5 rounded-full cursor-pointer hover:bg-accent/50 transition-all duration-300 glow-sm border border-foreground/10 dark:border-transparent"
              >
                <span 
                  className="text-lg font-semibold tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, hsl(0 0% 20%), hsl(0 0% 40%) 30%, hsl(0 0% 60%) 50%)',
                  }}
                >
                  <span className="dark:hidden">OranAI</span>
                </span>
                <span 
                  className="hidden dark:inline text-lg font-semibold tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, hsl(0 0% 40%), hsl(0 0% 70%) 30%, hsl(0 0% 100%) 60%, hsl(0 0% 100%))',
                  }}
                >
                  OranAI
                </span>
              </div>
            </div>

            {/* Center - Main Navigation Tabs - Absolutely positioned for true center */}
            <nav className="hidden md:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="rounded-full px-1.5 py-1.5 flex items-center space-x-1 border-0 dark:border dark:border-border/30 shadow-none dark:shadow-lg bg-transparent dark:bg-background/40 backdrop-blur-none dark:backdrop-blur-md">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-foreground text-background shadow-md'
                        : 'text-foreground/60 dark:text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
            {/* Right - Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'en' ? 'EN' : '中文'}</span>
              </button>
              <button
                onClick={() => setSignInOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'en' ? 'Sign In' : '登录'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="rounded-full px-1.5 py-1.5 flex items-center justify-center space-x-1 border border-foreground/15 dark:border-border/30 bg-background/70 dark:bg-background/40 backdrop-blur-md">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-foreground text-background shadow-md'
                      : 'text-foreground/60 dark:text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sign In Dialog */}
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent className="sm:max-w-[400px] bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              {language === 'en' ? 'Sign In to OranAI' : '登录 OranAI'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSignIn} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">{language === 'en' ? 'Email' : '邮箱'}</Label>
              <Input
                id="email"
                type="email"
                placeholder={language === 'en' ? 'Enter your email' : '请输入邮箱'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{language === 'en' ? 'Password' : '密码'}</Label>
              <Input
                id="password"
                type="password"
                placeholder={language === 'en' ? 'Enter your password' : '请输入密码'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <Button type="submit" className="w-full">
              {language === 'en' ? 'Sign In' : '登录'}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              {language === 'en' ? "Don't have an account?" : '还没有账号？'}{' '}
              <button type="button" className="text-primary hover:underline">
                {language === 'en' ? 'Sign Up' : '注册'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
