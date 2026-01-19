import React, { useState } from 'react';
import { Menu, X, Globe, Sun, Moon, LogOut, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setShowPassword(false);
    setShowConfirmPassword(false);
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
    if (password !== confirmPassword) {
      alert(language === 'en' ? 'Passwords do not match' : '两次密码不一致');
      return;
    }
    setUser({ username: email.split('@')[0], email });
    setDialogOpen(false);
    resetForm();
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const openSignIn = () => {
    setIsSignUp(false);
    resetForm();
    setDialogOpen(true);
  };

  const openSignUp = () => {
    setIsSignUp(true);
    resetForm();
    setDialogOpen(true);
  };

  const handleSendCode = () => {
    // Mock send verification code
    alert(language === 'en' ? 'Verification code sent!' : '验证码已发送！');
  };

  const handleGoogleLogin = () => {
    // Mock Google login
    setUser({ username: 'GoogleUser', email: 'user@gmail.com' });
    setDialogOpen(false);
    resetForm();
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
              {/* <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button> */}
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
                  className="text-sm font-light text-foreground/70 hover:text-foreground hover:underline underline-offset-4 transition-all duration-200"
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
        <DialogContent className="sm:max-w-[420px] bg-background border border-border rounded-3xl p-8">
          {isSignUp ? (
            /* Sign Up Form */
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-primary">
                {language === 'en' ? 'Sign up for an account' : '注册账号'}
              </h2>
              
              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Email */}
                <Input
                  type="email"
                  placeholder={language === 'en' ? 'Email' : '邮箱'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl bg-muted/50 border-0 px-4"
                  required
                />
                
                {/* Password */}
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={language === 'en' ? 'Password' : '密码'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Confirm Password */}
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={language === 'en' ? 'Confirm' : '确认密码'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Verification Code */}
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder={language === 'en' ? 'Verification Code' : '验证码'}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 flex-1"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSendCode}
                    className="h-12 px-4 text-primary hover:text-primary/80 hover:bg-transparent font-medium"
                  >
                    {language === 'en' ? 'Send Code' : '发送验证码'}
                  </Button>
                </div>
                
                {/* Already have account */}
                <div className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Already have an account?' : '已有账号？'}{' '}
                  <button type="button" onClick={() => setIsSignUp(false)} className="text-primary hover:underline font-medium">
                    {language === 'en' ? 'Login' : '登录'}
                  </button>
                </div>
                
                {/* Sign Up Button */}
                <Button type="submit" className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium">
                  {language === 'en' ? 'Sign Up' : '注册'}
                </Button>
              </form>
              
              {/* Terms */}
              <p className="text-xs text-center text-muted-foreground">
                {language === 'en' ? 'By continuing, you agree to our ' : '继续即表示您同意我们的'}
                <button className="text-foreground font-medium hover:underline">
                  {language === 'en' ? 'Terms of Service' : '服务条款'}
                </button>
                {language === 'en' ? ' and acknowledge our ' : ' 并确认我们的'}
                <button className="text-foreground font-medium hover:underline">
                  {language === 'en' ? 'Privacy Policy' : '隐私政策'}
                </button>
                。
              </p>
            </div>
          ) : (
            /* Login Form */
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center text-foreground">
                {language === 'en' ? 'Create an account or Login' : '创建账号或登录'}
              </h2>
              
              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 border-0 font-medium flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {language === 'en' ? 'Continue with Google' : '使用 Google 登录'}
              </Button>
              
              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              
              {/* Continue with email label */}
              <p className="text-primary font-medium">
                {language === 'en' ? 'Continue with email' : '使用邮箱登录'}
              </p>
              
              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Email */}
                <Input
                  type="email"
                  placeholder={language === 'en' ? 'Email' : '邮箱'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl bg-muted/50 border-0 px-4"
                  required
                />
                
                {/* Password */}
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={language === 'en' ? 'Password' : '密码'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Login Button */}
                <Button type="submit" className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium">
                  {language === 'en' ? 'Login' : '登录'}
                </Button>
              </form>
              
              {/* Sign Up & Forgot Password */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={openSignUp}
                  className="flex-1 h-12 rounded-2xl bg-muted/50 text-primary hover:bg-muted font-medium"
                >
                  {language === 'en' ? 'Sign Up' : '注册'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 h-12 rounded-2xl bg-muted/50 text-foreground hover:bg-muted font-medium"
                >
                  {language === 'en' ? 'Forgot Password' : '忘记密码'}
                </Button>
              </div>
              
              {/* Terms */}
              <p className="text-xs text-center text-muted-foreground">
                {language === 'en' ? 'By continuing, you agree to our ' : '继续即表示您同意我们的'}
                <button className="text-foreground font-medium hover:underline">
                  {language === 'en' ? 'Terms of Service' : '服务条款'}
                </button>
                {language === 'en' ? ' and acknowledge our ' : ' 并确认我们的'}
                <button className="text-foreground font-medium hover:underline">
                  {language === 'en' ? 'Privacy Policy' : '隐私政策'}
                </button>
                。
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
