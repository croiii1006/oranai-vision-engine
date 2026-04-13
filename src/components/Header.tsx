import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Sun, Moon, LogOut, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { login, register, getUserInfo, sendCaptcha, getGoogleOAuthUrl, forgotPassword } from "@/lib/api/auth";
import { encryptPassword } from "@/lib/utils/rsa";
import {
  saveToken,
  saveUserInfo,
  clearAuth,
  getUserInfo as getCachedUserInfo,
  getToken,
} from "@/lib/utils/auth-storage";
import type { UserInfo } from "@/lib/api/auth";
import { config } from "@/lib/config";
import type { PlanId } from "@/lib/pricing";
import {
  getBillingSummary,
  membershipPlanToPlanId,
  type BillingSummary,
} from "@/lib/api/billing";
import { MEGA_MENU_EXTERNAL_URLS } from "@/i18n/menu-external-urls";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentPlanId: PlanId;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isVisible?: boolean;
  setLibrarySubTab?: (tab: "video" | "voice" | "model") => void;
  /** 递增时打开登录弹窗（定价页等子组件请求登录） */
  loginDialogTrigger?: number;
}

interface UserData {
  username: string;
  email: string;
  nickname?: string;
  avatar?: string;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentPlanId,
  sidebarOpen,
  setSidebarOpen,
  isVisible = true,
  setLibrarySubTab,
  loginDialogTrigger = 0,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const closeMenuTimerRef = useRef<NodeJS.Timeout | null>(null);
  const postLoginRedirectRef = useRef<'back' | 'toolbox' | null>(null); // 登录成功后的跳转：back=返回上一页，toolbox=跳转 toolbox
  const prevLoginDialogTriggerRef = useRef(0);

  // 定价页等：父组件递增 loginDialogTrigger 时打开登录框（不设 loginRedirect，登录成功后留在当前页）
  useEffect(() => {
    if (loginDialogTrigger <= prevLoginDialogTriggerRef.current) return;
    prevLoginDialogTriggerRef.current = loginDialogTrigger;
    setDialogOpen(true);
    setIsSignUp(false);
  }, [loginDialogTrigger]);

  // 从缓存加载用户信息（在 App 初始化检查完成后）
  useEffect(() => {
    // 延迟一点确保 App 的初始化检查完成
    const timer = setTimeout(() => {
      const cachedUser = getCachedUserInfo();
      const token = getToken();
      if (cachedUser && token) {
        setUser({
          username: cachedUser.username,
          email: cachedUser.email,
          nickname: cachedUser.nickname,
          avatar: cachedUser.avatar,
        });
      } else {
        // 如果没有 token 或用户信息，确保是未登录状态
        setUser(null);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 已登录：拉取计费摘要，用于头像菜单展示与定价页一致的套餐档位
  useEffect(() => {
    if (!user) {
      setBillingSummary(null);
      return;
    }
    const token = getToken();
    if (!token) {
      setBillingSummary(null);
      return;
    }
    let cancelled = false;
    getBillingSummary()
      .then((s) => {
        if (!cancelled) setBillingSummary(s);
      })
      .catch(() => {
        if (!cancelled) setBillingSummary(null);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // 检查 URL 参数：?login=1 弹出登录框且登录成功后返回上一页；?login=toolbox 弹出登录框且登录成功后跳转 toolbox
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginParam = urlParams.get('login');

    if (loginParam === 'toolbox') {
      postLoginRedirectRef.current = 'toolbox';
      sessionStorage.setItem('loginRedirect', 'toolbox');
      setDialogOpen(true);
      setIsSignUp(false);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('login');
      window.history.replaceState({}, '', newUrl.toString());
    } else if (loginParam === '1') {
      postLoginRedirectRef.current = 'back';
      sessionStorage.setItem('loginRedirect', 'back');
      setDialogOpen(true);
      setIsSignUp(false);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('login');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (closeMenuTimerRef.current) {
        clearTimeout(closeMenuTimerRef.current);
      }
    };
  }, []);

  // 处理菜单打开
  const handleMenuOpen = (menuId: string | null) => {
    // 清除关闭定时器
    if (closeMenuTimerRef.current) {
      clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
    setOpenMenu(menuId);
  };

  // 处理菜单关闭（延迟关闭）
  const handleMenuClose = () => {
    // 清除之前的定时器
    if (closeMenuTimerRef.current) {
      clearTimeout(closeMenuTimerRef.current);
    }
    // 延迟关闭，给用户时间移动到菜单
    closeMenuTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
      closeMenuTimerRef.current = null;
    }, 200); // 200ms 延迟
  };

  const tabs = [
    { id: "solution", label: t("nav.solution") },
    { id: "models", label: t("nav.models") },
    { id: "products", label: t("nav.products") },
    { id: "library", label: t("nav.library") },
  ];

  const menuConfigs = useMemo(
    () => ({
      solution: {
        sections: [
          {
            title: t("header.mega.scenarioTitle"),
            items: ["menu.sol.geo", "menu.sol.social", "menu.sol.email", "menu.sol.sales"],
          },
          {
            title: t("header.mega.industryTitle"),
            items: ["menu.ind.beauty", "menu.ind.electronics", "menu.ind.crossborder", "menu.ind.data"],
          },
        ],
      },
      models: {
        sections: [
          {
            title: t("header.mega.platformTitle"),
            items: ["menu.plat.dataCenter", "menu.plat.modelLibrary", "menu.plat.skills"],
          },
        ],
      },
      products: {
        sections: [
          {
            title: t("header.mega.productTitle"),
            items: ["menu.prod.dataInfra", "menu.prod.insights", "menu.prod.strategy", "menu.prod.contentFactory"],
          },
        ],
      },
      library: {
        sections: [
          {
            title: t("header.mega.libraryTitle"),
            items: ["menu.lib.video", "menu.lib.voice", "menu.lib.model"],
          },
        ],
      },
    }),
    [t],
  );

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setVerificationCode("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError(null);
    setCodeCountdown(0);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 加密密码
      const encryptedPassword = await encryptPassword(password);

      // 调用登录接口
      const response = await login({
        clientId: "portal-a",
        authType: "EMAIL_PASSWORD",
        email: email.trim(),
        password: encryptedPassword,
      });
      
      // 保存 token（保存到 cookies 和 localStorage）
      saveToken(response.data.token);
      
      // 获取用户信息（token 通过 Authorization 头传递）
      const userInfoResponse = await getUserInfo();
      
      // 保存用户信息到缓存
      saveUserInfo(userInfoResponse.data);

      // 更新 UI 状态
      setUser({
        username: userInfoResponse.data.username,
        email: userInfoResponse.data.email,
        nickname: userInfoResponse.data.nickname,
        avatar: userInfoResponse.data.avatar,
      });

      setDialogOpen(false);
      resetForm();

      // 根据 URL 参数决定登录成功后行为：login=1 返回上一页，login=toolbox 跳转 toolbox
      const redirect = postLoginRedirectRef.current || sessionStorage.getItem('loginRedirect');
      postLoginRedirectRef.current = null;
      sessionStorage.removeItem('loginRedirect');
      if (redirect) {
        setTimeout(() => {
          if (redirect === 'toolbox') {
            window.location.href = config.toolbox.baseUrl;
          } else if (redirect === 'back') {
            window.history.back();
          }
        }, 300);
      }
    } catch (error) {
      console.error('Login failed:', error);
      // 如果是 401 错误（token 过期），清除用户状态
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('401') || errorMessage.includes('登录已过期') || errorMessage.includes('token')) {
        setUser(null);
      }
      setError(
        error instanceof Error ? error.message : t("auth.error.loginFailed"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 验证密码匹配
    if (password !== confirmPassword) {
      setError(t("auth.error.passwordMismatch"));
      return;
    }

    if (!verificationCode || verificationCode.trim() === "") {
      setError(t("auth.error.verificationRequired"));
      return;
    }

    setIsLoading(true);

    try {
      // 加密密码
      const encryptedPassword = await encryptPassword(password);

      // 调用注册接口
      await register({
        email: email.trim(),
        password: encryptedPassword,
        captcha: verificationCode.trim(),
      });

      // 注册成功后，自动登录
      const loginResponse = await login({
        clientId: "portal-a",
        authType: "EMAIL_PASSWORD",
        email: email.trim(),
        password: encryptedPassword,
      });
      
      // 保存 token（保存到 cookies 和 localStorage）
      saveToken(loginResponse.data.token);
      
      // 获取用户信息（token 通过 Authorization 头传递）
      const userInfoResponse = await getUserInfo();
      
      // 保存用户信息到缓存
      saveUserInfo(userInfoResponse.data);

      // 更新 UI 状态
      setUser({
        username: userInfoResponse.data.username,
        email: userInfoResponse.data.email,
        nickname: userInfoResponse.data.nickname,
        avatar: userInfoResponse.data.avatar,
      });

      setDialogOpen(false);
      resetForm();

      // 根据 URL 参数决定登录成功后行为（与邮箱登录一致）
      const redirect = postLoginRedirectRef.current || sessionStorage.getItem('loginRedirect');
      postLoginRedirectRef.current = null;
      sessionStorage.removeItem('loginRedirect');
      if (redirect) {
        setTimeout(() => {
          if (redirect === 'toolbox') {
            window.location.href = config.toolbox.baseUrl;
          } else if (redirect === 'back') {
            window.history.back();
          }
        }, 300);
      }
    } catch (error) {
      console.error('Register failed:', error);
      // 如果是 401 错误（token 过期），清除用户状态
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('401') || errorMessage.includes('登录已过期') || errorMessage.includes('token')) {
        setUser(null);
      }
      setError(
        error instanceof Error ? error.message : t("auth.error.registerFailed"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    clearAuth();
    setUser(null);
  };

  const openSignIn = () => {
    setIsSignUp(false);
    resetForm();
    setDialogOpen(true);
  };

  const openSignUp = () => {
    setIsSignUp(true);
    setIsForgotPassword(false);
    resetForm();
    setDialogOpen(true);
  };

  const openForgotPassword = () => {
    setIsForgotPassword(true);
    setIsSignUp(false);
    setError(null);
    setDialogOpen(true);
  };

  const backToLogin = () => {
    setIsForgotPassword(false);
    setError(null);
  };

  // 处理对话框关闭
  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setIsForgotPassword(false);
      postLoginRedirectRef.current = null;
      sessionStorage.removeItem('loginRedirect');
    }
  };

  const handleSendCode = async () => {
    // 验证邮箱
    if (!email || !email.trim()) {
      setError(t("auth.error.emailRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError(t("auth.error.emailInvalid"));
      return;
    }

    // 如果正在倒计时，不允许重复发送
    if (codeCountdown > 0) {
      return;
    }

    setIsSendingCode(true);
    setError(null);

    try {
      await sendCaptcha({ email: email.trim() });

      // 开始倒计时（60秒）
      setCodeCountdown(60);
      const countdownInterval = setInterval(() => {
        setCodeCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Send captcha failed:", error);
      setError(
        error instanceof Error ? error.message : t("auth.error.sendCodeFailed"),
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const res = await getGoogleOAuthUrl();
      if (res.success && res.data?.authorizeUrl) {
        window.location.href = res.data.authorizeUrl;
        return;
      }
      setError(t("auth.error.googleUrlFailed"));
    } catch (err) {
      setError(t("auth.error.googleLoginFailed"));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError(t("auth.error.emailRequired"));
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError(t("auth.error.emailInvalid"));
      return;
    }
    if (!verificationCode.trim()) {
      setError(t("auth.error.codeRequiredForgot"));
      return;
    }
    if (!password) {
      setError(t("auth.error.newPasswordRequired"));
      return;
    }
    if (password.length < 6) {
      setError(t("auth.error.passwordMin"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.error.passwordMismatchForgot"));
      return;
    }

    setIsLoading(true);
    try {
      const encryptedPassword = await encryptPassword(password);
      await forgotPassword({
        email: email.trim(),
        password: encryptedPassword,
        captcha: verificationCode.trim(),
      });
      resetForm();
      setIsForgotPassword(false);
      setError(null);
      setDialogOpen(false);
      toast.success(t("auth.toast.passwordResetOk"));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("auth.error.resetFailed"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.slice(0, 1).toUpperCase();
  };

  const displayPlanId = useMemo((): PlanId => {
    if (billingSummary?.subscriptionStatus === "ACTIVE") {
      const pid = membershipPlanToPlanId(billingSummary.membershipPlan);
      if (pid !== "free") return pid;
    }
    return currentPlanId;
  }, [billingSummary, currentPlanId]);

  const currentPlanLabel = t(`pricing.plan.${displayPlanId}`);
  const handlePlanMenuClick = () => {
    setActiveTab("pricing");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="backdrop-blur bg-background/20 dark:bg-background/10">
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
                onClick={() => setActiveTab("hero")}
                className="glass px-4 py-1.5 rounded-full cursor-pointer hover:bg-accent/50 transition-all duration-300 glow-sm border border-foreground/10 dark:border-transparent"
              >
                <span 
                  className="text-lg font-semibold tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(90deg, hsl(0 0% 20%), hsl(0 0% 40%) 30%, hsl(0 0% 60%) 50%)",
                  }}
                >
                  <span className="dark:hidden">OranAI</span>
                </span>
                <span 
                  className="hidden dark:inline text-lg font-semibold tracking-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, hsl(0 0% 40%), hsl(0 0% 70%) 30%, hsl(0 0% 100%) 60%, hsl(0 0% 100%))",
                  }}
                >
                  OranAI
                </span>
              </div>
            </div>

            {/* Center - Main Navigation Tabs - Absolutely positioned for true center */}
            <div className="hidden md:flex flex-1 justify-center relative" onMouseLeave={handleMenuClose}>
              <nav className="flex items-center">
                <div className="rounded-full px-1.5 py-1.5 flex items-center space-x-1 border-0 dark:border dark:border-border/30 shadow-none dark:shadow-lg bg-transparent dark:bg-background/40 backdrop-blur dark:backdrop-blur-md relative">
                  {tabs.map((tab) =>
                    menuConfigs[tab.id] ? (
                      <div key={tab.id} className="relative">
                        <button
                          onMouseEnter={() => handleMenuOpen(tab.id)}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            activeTab === tab.id
                              ? "bg-foreground text-background shadow-md"
                              : "text-foreground/60 dark:text-muted-foreground hover:text-foreground hover:bg-accent/50"
                          }`}
                        >
                          {tab.label}
                        </button>
                      </div>
                    ) : (
                  <button
                    key={tab.id}
                        onMouseEnter={() => handleMenuOpen(null)}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-foreground text-background shadow-md'
                        : 'text-foreground/60 dark:text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                    )
                  )}
                </div>
              </nav>
              <AnimatePresence>
                {openMenu && menuConfigs[openMenu] && (
                  <motion.div
                    key="solution-mega"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="fixed left-0 right-0 top-20 px-6 sm:px-10 lg:px-16 pointer-events-none z-40 flex justify-center"
                    onMouseEnter={() => handleMenuOpen(openMenu)}
                    onMouseLeave={handleMenuClose}
                  >
                    <div className="bg-background/80 pointer-events-auto w-fit rounded-3xl border border-border/30 ring-1 ring-white/10 dark:ring-white/6 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.65)] px-8 py-6">
                      {menuConfigs[openMenu]?.sections && (
                        <div
                          className={`grid ${
                            menuConfigs[openMenu].sections.length > 1 ? "grid-cols-2" : "grid-cols-1"
                          } gap-10`}
                        >
                          {menuConfigs[openMenu].sections.map((section) => (
                            <div className="space-y-3" key={section.title}>
                              <div className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                                {section.title}
                              </div>
                              <div className="space-y-2">
                                {section.items.map((itemKey, index) => (
                                  <button
                                    key={itemKey}
                                    onClick={() => {
                                      const url = MEGA_MENU_EXTERNAL_URLS[itemKey];
                                      if (url) {
                                        window.open(url, "_blank");
                                        setOpenMenu(null);
                                        return;
                                      }
                                      if (openMenu === "library" && setLibrarySubTab) {
                                        const subTabs: ("video" | "voice" | "model")[] = ["video", "voice", "model"];
                                        setLibrarySubTab(subTabs[index]);
                                      }
                                      if (openMenu) {
                                        setActiveTab(openMenu);
                                      }
                                      setOpenMenu(null);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl text-sm text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-all"
                                  >
                                    {t(itemKey)}
                                  </button>
                                ))}
                              </div>
                            </div>
                ))}
              </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Right - Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
            <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {language === "en" ? t("common.langShortEn") : t("common.langShortZh")}
                </span>
              </button>

              {user ? (
                <HoverCard openDelay={80} closeDelay={140}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      className="focus:outline-none"
                      aria-label={t("header.accountMenuAria")}
                    >
                      <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                        {user.avatar && <AvatarImage src={user.avatar} alt={user.nickname || user.username} />}
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                          {getInitials(user.nickname || user.username)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent
                    align="center"
                    sideOffset={6}
                    className="w-72 rounded-2xl border border-border/30 bg-background/95 p-2.5 shadow-[0_25px_80px_-40px_rgba(0,0,0,0.65)] ring-1 ring-black/5 backdrop-blur-md dark:bg-background/90 dark:ring-white/10"
                  >
                    <div className="flex flex-col px-2 py-3">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="w-full min-w-0 break-all text-base font-semibold leading-snug text-foreground">
                          {user.nickname || user.username}
                        </div>
                        <div className="w-full pb-4 pt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {user.email}
                        </div>
                        <button
                          type="button"
                          onClick={handlePlanMenuClick}
                          className="w-full max-w-full rounded-full border border-border/30 bg-[hsl(0_0%_96%)] px-4 py-2.5 text-center text-sm font-medium text-foreground transition-all hover:border-foreground/25 hover:bg-[hsl(0_0%_92%)] dark:border-border/40 dark:bg-muted dark:hover:bg-muted/80"
                        >
                          {currentPlanLabel}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        aria-label={t("header.signOutAria")}
                        className="mt-5 mx-auto w-auto flex items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-[#FF4D4F] transition-colors hover:bg-[#FF4D4F]/8 hover:text-[#E63539] dark:text-[#FF6B6B] dark:hover:bg-[#FF4D4F]/12 dark:hover:text-[#FF8585]"
                      >
                        <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                        <span>{t("header.signOut")}</span>
                      </button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <button
                  onClick={openSignIn}
                  className="text-sm font-light text-foreground/70 hover:text-foreground hover:underline underline-offset-4 transition-all duration-200"
                >
                  {t("header.signIn")}
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
                      ? "bg-foreground text-background shadow-md"
                      : "text-foreground/60 dark:text-muted-foreground hover:text-foreground hover:bg-accent/50"
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
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[420px] bg-background border border-border rounded-3xl p-8">
          <TooltipProvider>
          {isForgotPassword ? (
            /* Forgot Password Form */
            <div className="space-y-6">
              <DialogTitle className="text-xl font-semibold text-center text-foreground">
                {t("auth.forgot.title")}
              </DialogTitle>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    {t("auth.label.email")}
                  </label>
                  <Input
                    type="email"
                    placeholder={t("auth.placeholder.email")}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    {t("auth.label.code")}
                  </label>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      placeholder={t("auth.placeholder.code")}
                      value={verificationCode}
                      onChange={(e) => {
                        setVerificationCode(e.target.value);
                        setError(null);
                      }}
                      className="h-12 rounded-2xl bg-muted/50 border-0 px-4 flex-1"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleSendCode}
                      className="h-12 px-4 text-primary hover:text-primary/80 hover:bg-transparent font-medium whitespace-nowrap rounded-2xl bg-muted/50"
                      disabled={isLoading || isSendingCode || codeCountdown > 0}
                    >
                      {isSendingCode
                        ? t("auth.sendCode.sending")
                        : codeCountdown > 0
                          ? `${codeCountdown}${t("auth.sendCode.seconds")}`
                          : t("auth.sendCode")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    {t("auth.label.newPassword")}
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.placeholder.password")}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">
                    {t("auth.label.confirmPassword")}
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("auth.placeholder.confirm")}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError(null);
                      }}
                      className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {t("auth.alreadyHaveAccount")}{" "}
                  <button
                    type="button"
                    onClick={backToLogin}
                    className="text-primary hover:underline font-medium"
                  >
                    {t("auth.loginCta")}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.resetting") : t("auth.resetPassword")}
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                {t("auth.terms.prefix")}
                <a
                  href={`https://policies.photog.art/terms?lang=${language}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:underline"
                >
                  {t("auth.terms.service")}
                </a>
                {t("auth.terms.mid")}
                <a
                  href={`https://policies.photog.art/privacy?lang=${language}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:underline"
                >
                  {t("auth.terms.privacy")}
                </a>
                。
              </p>
            </div>
          ) : isSignUp ? (
            /* Sign Up Form */
            <div className="space-y-6">
              <DialogTitle className="text-xl font-semibold text-primary">
                {t("auth.signup.title")}
              </DialogTitle>

              <form onSubmit={handleSignUp} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Email */}
                <Input
                  type="email"
                  placeholder={t("auth.placeholder.email")}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="h-12 rounded-2xl bg-muted/50 border-0 px-4"
                  required
                  disabled={isLoading}
                />

                {/* Password */}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.placeholder.password")}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                    required
                    disabled={isLoading}
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
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("auth.placeholder.confirmSignup")}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError(null);
                    }}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                    required
                    disabled={isLoading}
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
                    placeholder={t("auth.placeholder.code")}
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      setError(null);
                    }}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 flex-1"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSendCode}
                    className="h-12 px-4 text-primary hover:text-primary/80 hover:bg-transparent font-medium whitespace-nowrap"
                    disabled={isLoading || isSendingCode || codeCountdown > 0}
                  >
                    {isSendingCode
                      ? t("auth.sendCode.sending")
                      : codeCountdown > 0
                        ? `${codeCountdown}${t("auth.sendCode.seconds")}`
                        : t("auth.sendCode")}
                  </Button>
                </div>

                {/* Already have account */}
                <div className="text-sm text-muted-foreground">
                  {t("auth.alreadyHaveAccountAlt")}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setError(null);
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    {t("auth.loginCta")}
                  </button>
                </div>

                {/* Sign Up Button */}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.signup.submitting") : t("auth.signup.cta")}
                </Button>
              </form>

              {/* Terms */}
              <p className="text-xs text-center text-muted-foreground">
                {t("auth.terms.prefix")}
                <a
                  href={`https://policies.photog.art/terms?lang=${language}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:underline"
                >
                  {t("auth.terms.service")}
                </a>
                {t("auth.terms.mid")}
                <a
                  href={`https://policies.photog.art/privacy?lang=${language}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:underline"
                >
                  {t("auth.terms.privacy")}
                </a>
                。
              </p>
            </div>
          ) : (
            /* Login Form */
            <div className="space-y-6">
              <DialogTitle className="text-xl font-semibold text-center text-foreground">
                {t("auth.login.title")}
              </DialogTitle>

              {/* Google Login */}
              <Button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isGoogleLoading ? t("auth.google.redirecting") : t("auth.google.continue")}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted-foreground">{t("common.or")}</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Continue with email label */}
              <p className="text-primary font-medium">{t("auth.continueEmail")}</p>

              <form onSubmit={handleSignIn} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Email */}
                <Input
                  type="email"
                  placeholder={t("auth.placeholder.email")}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  className="h-12 rounded-2xl bg-muted/50 border-0 px-4"
                  required
                  disabled={isLoading}
                />

                {/* Password */}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.placeholder.password")}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className="h-12 rounded-2xl bg-muted/50 border-0 px-4 pr-12"
                    required
                    disabled={isLoading}
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
                <Button
                  type="submit"
                  className="w-full h-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.login.loggingIn") : t("auth.login.submit")}
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
                  {t("auth.signUpLink")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={openForgotPassword}
                  className="flex-1 h-12 rounded-2xl bg-muted/50 text-primary hover:bg-muted font-medium"
                >
                  {t("auth.forgotLink")}
                </Button>
              </div>

              {/* Terms */}
              <p className="text-xs text-center text-muted-foreground">
                {t("auth.terms.prefix")}
                <a
                  href={`https://policies.photog.art/terms?lang=${language}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:underline"
                >
                  {t("auth.terms.service")}
                </a>
                {t("auth.terms.mid")}
                <a
                  href={`https://policies.photog.art/privacy?lang=${language}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground font-medium hover:underline"
                >
                  {t("auth.terms.privacy")}
                </a>
                。
              </p>
            </div>
          )}
          </TooltipProvider>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
