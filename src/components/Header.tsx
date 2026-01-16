import React, { useState } from 'react';
import { Menu, X, Globe, Sun, Moon, User, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface UserData {
  username: string;
  email: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  
  // Form fields
  const [username, setUsername] = useState('');
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

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock sign in - in real app this would call an API
    setUser({ username: email.split('@')[0], email });
    setDialogOpen(false);
    resetForm();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock sign up - in real app this would call an API
    setUser({ username, email });
    setDialogOpen(false);
    resetForm();
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const openSignIn = () => {
    setIsSignUp(false);
    setDialogOpen(true);
  };

  const openSignUp = () => {
    setIsSignUp(true);
    setDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
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
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                          {getInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm font-medium text-foreground">
                      {user.username}
                    </div>
                    <div className="px-2 pb-2 text-xs text-muted-foreground">
                      {user.email}
                    </div>
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      {language === 'en' ? 'Sign Out' : '退出登录'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={openSignIn}
                  className="text-sm font-medium text-foreground/70 hover:text-foreground hover:underline underline-offset-4 transition-all duration-200"
                >
                  {language === 'en' ? 'Sign In' : '登录'}
                </button>
              )}
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

      {/* Sign In / Sign Up Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              {isSignUp
                ? (language === 'en' ? 'Create Account' : '创建账号')
                : (language === 'en' ? 'Sign In to OranAI' : '登录 OranAI')
              }
            </DialogTitle>
          </DialogHeader>
          
          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="username">{language === 'en' ? 'Username' : '用户名'}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={language === 'en' ? 'Enter your username' : '请输入用户名'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">{language === 'en' ? 'Email' : '邮箱'}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder={language === 'en' ? 'Enter your email' : '请输入邮箱'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">{language === 'en' ? 'Password' : '密码'}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder={language === 'en' ? 'Create a password' : '请设置密码'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {language === 'en' ? 'Sign Up' : '注册'}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                {language === 'en' ? 'Already have an account?' : '已有账号？'}{' '}
                <button type="button" onClick={() => setIsSignUp(false)} className="text-primary hover:underline">
                  {language === 'en' ? 'Sign In' : '登录'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignIn} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">{language === 'en' ? 'Email' : '邮箱'}</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder={language === 'en' ? 'Enter your email' : '请输入邮箱'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">{language === 'en' ? 'Password' : '密码'}</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder={language === 'en' ? 'Enter your password' : '请输入密码'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background border-border"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {language === 'en' ? 'Sign In' : '登录'}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                {language === 'en' ? "Don't have an account?" : '还没有账号？'}{' '}
                <button type="button" onClick={openSignUp} className="text-primary hover:underline">
                  {language === 'en' ? 'Sign Up' : '注册'}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
