/**
 * 补充英文文案（与 partial-zh 键一一对应，供 LanguageContext 合并）
 */
export const partialEn: Record<string, string> = {
  "common.langShortEn": "EN",
  "common.langShortZh": "中文",

  "whitepaper.banner": "🎉 OranAI Whitepaper is now live!",
  "whitepaper.details": "Details",
  "whitepaper.closeAria": "Close",

  "home.hero.subtitle":
    "One-stop Solution to Marketing Challenges, All-round Support for Brand Growth",
  "home.hero.s1": "Integrate cutting-edge ",
  "home.hero.em1": "Models",
  "home.hero.s2": ", ",
  "home.hero.em2": "Product Matrices",
  "home.hero.s3": ", and ",
  "home.hero.em3": "Creative Asset Libraries",
  "home.hero.s4": " to build a ",
  "home.hero.em4": "One-stop Marketing Solution",
  "home.hero.s5": ", empowering the growth of ",
  "home.hero.em5": "Global Brands",
  "home.hero.s6": ".",

  "auth.error.loginFailed": "Login failed. Please try again.",
  "auth.error.registerFailed": "Registration failed. Please try again.",
  "auth.error.passwordMismatch": "Passwords do not match",
  "auth.error.verificationRequired": "Please enter verification code",
  "auth.error.emailRequired": "Please enter your email address",
  "auth.error.emailInvalid": "Please enter a valid email address",
  "auth.error.sendCodeFailed": "Failed to send verification code. Please try again.",
  "auth.error.googleUrlFailed": "Failed to get Google login link.",
  "auth.error.googleLoginFailed": "Google login failed. Please try again.",
  "auth.error.resetFailed": "Reset password failed. Please try again.",
  "auth.error.codeRequiredForgot": "Please enter the verification code",
  "auth.error.newPasswordRequired": "Please enter your new password",
  "auth.error.passwordMin": "Password must be at least 6 characters",
  "auth.error.passwordMismatchForgot": "Passwords do not match",
  "auth.toast.passwordResetOk": "Password reset successfully",

  "header.signOutAria": "Sign Out",
  "header.signOut": "Sign Out",
  "header.signIn": "Sign In",
  "header.accountMenuAria": "Account menu",

  "auth.forgot.title": "Forget password",
  "auth.label.email": "Email Address",
  "auth.placeholder.email": "Email",
  "auth.label.code": "Verification Code",
  "auth.placeholder.code": "Verification Code",
  "auth.sendCode.sending": "Sending...",
  "auth.sendCode.seconds": "s",
  "auth.sendCode": "Send Code",
  "auth.label.newPassword": "New Password",
  "auth.placeholder.password": "Password",
  "auth.label.confirmPassword": "Confirm Password",
  "auth.placeholder.confirm": "Confirm",
  "auth.placeholder.confirmSignup": "Confirm",
  "auth.login.loggingIn": "Logging in...",
  "common.or": "or",
  "auth.alreadyHaveAccount": "Already have an account?",
  "auth.loginCta": "Login",
  "auth.resetting": "Resetting...",
  "auth.resetPassword": "Reset Password",
  "auth.terms.prefix": "By continuing, you agree to our ",
  "auth.terms.service": "Terms of Service",
  "auth.terms.mid": " and acknowledge our ",
  "auth.terms.privacy": "Privacy Policy",

  "auth.signup.title": "Sign up for an account",
  "auth.signup.submitting": "Signing up...",
  "auth.signup.cta": "Sign Up",
  "auth.alreadyHaveAccountAlt": "Already have an account?",

  "auth.login.title": "Create an account or Login",
  "auth.google.redirecting": "Redirecting...",
  "auth.google.continue": "Continue with Google",
  "auth.continueEmail": "Continue with email",
  "auth.login.submitting": "Signing in...",
  "auth.login.submit": "Sign In",
  "auth.signUpLink": "Sign Up",
  "auth.forgotLink": "Forgot Password",

  "header.mega.scenarioTitle": "Scenario Solutions",
  "header.mega.industryTitle": "Industry Solutions",
  "header.mega.platformTitle": "Platform Capabilities",
  "header.mega.productTitle": "Product Matrix",
  "header.mega.libraryTitle": "Inspiration Library",

  "menu.sol.geo": "GEO",
  "menu.sol.social": "Social Media Marketing",
  "menu.sol.email": "Email Marketing",
  "menu.sol.sales": "Sales Support",
  "menu.ind.beauty": "Beauty & FMCG",
  "menu.ind.electronics": "Consumer Electronics",
  "menu.ind.crossborder": "Cross-border Expansion",
  "menu.ind.data": "Data Infrastructure",
  "menu.plat.dataCenter": "Data Center",
  "menu.plat.modelLibrary": "Model Library",
  "menu.plat.skills": "Skills",
  "menu.plat.miniapps": "MiniApps",
  "menu.prod.dataInfra": "Data Infrastructure",
  "menu.prod.insights": "Insights Hub",
  "menu.prod.strategy": "Strategy Engine",
  "menu.prod.contentFactory": "Content Factory",
  "menu.lib.video": "Video",
  "menu.lib.voice": "Voice",
  "menu.lib.model": "Model",

  "pricing.plan.free": "Free",
  "pricing.plan.basic": "Basic",
  "pricing.plan.pro": "Pro",
  "pricing.plan.enterprise": "Enterprise",

  "pricing.mailto.subject": "OranAI Enterprise Inquiry",
  "pricing.mailto.body":
    "Hi, I'd like to inquire about OranAI Enterprise.\nUse case: ________\nContact: ________",

  "pricing.hero.title": "Choose the plan that fits you",
  "pricing.hero.subtitle":
    "Use OranAI's insights and creative tools to grow faster.",

  "pricing.action.contactSales": "Contact Sales",
  "pricing.action.currentPlan": "Current Plan",
  "pricing.action.upgradeTo": "Upgrade to {{plan}}",
  "pricing.action.switchTo": "Switch to {{plan}}",

  "pricing.plans.free.name": "Free",
  "pricing.plans.free.desc": "Sign up and start exploring AI features",
  "pricing.plans.free.creditsNote": "One-time",

  "pricing.plans.basic.name": "Basic",
  "pricing.plans.basic.desc": "For light creators - daily image gen & insight reports",
  "pricing.plans.basic.priceSub": "/ month",
  "pricing.plans.basic.creditsNote": "~17% premium",

  "pricing.plans.pro.name": "Pro",
  "pricing.plans.pro.desc": "For power users - high-frequency reports & video rendering",
  "pricing.plans.pro.priceSub": "/ month",
  "pricing.plans.pro.creditsNote": "~16% premium",

  "pricing.plans.enterprise.name": "Enterprise",
  "pricing.plans.enterprise.desc": "For large organizations - custom contracts",

  "pricing.badge.popular": "Most Popular",
  "pricing.autoRenew.label": "Auto renew",
  "pricing.enterprise.customPrice": "Custom",
  "pricing.enterprise.customCredits": "Custom Credits",

  "pricing.cta.needMore": "Need more credits?",
  "pricing.cta.buyTopUp": "Buy top-up packs",
  "pricing.section.comparison": "Plan Comparison",
  "pricing.section.faq": "Frequently Asked Questions",
  "pricing.comparison.featureCol": "Feature",
  "pricing.comparison.infinity": "∞",
  "pricing.quota.unlimited": "Unlimited",

  "pricing.faq.0.q": "Do Credits expire?",
  "pricing.faq.0.a":
    "Subscription credits reset monthly (use-it-or-lose-it), calculated to the minute from purchase time. Top-up credits expire one month after purchase.",
  "pricing.faq.1.q": "Can I cancel my subscription anytime?",
  "pricing.faq.1.a":
    "Yes. Cancel auto-renewal anytime. Benefits remain until the period ends, then downgrade.",
  "pricing.faq.2.q": "What are the upgrade rules?",
  "pricing.faq.2.a":
    "Plan switches immediately upon payment with full new Credits. Old plan time is not prorated or carried over.",
  "pricing.faq.3.q": "How do top-up packs work?",
  "pricing.faq.3.a":
    "One-off payment, no recurring billing. Credits expire one month after purchase.",
  "pricing.faq.4.q": "Do you support refunds?",
  "pricing.faq.4.a":
    "We do not support refunds, downgrades, or lateral plan changes. Contact sales for special requests.",

  "pricing.bottom.title": "Ready to start with OranAI?",
  "pricing.bottom.subscribe": "Subscribe",

  "pricing.checkout.noUrl": "No checkout URL returned. Please try again or contact support.",
  "pricing.checkout.failed": "Could not start checkout",
  "pricing.checkout.inProgress": "Redirecting to payment…",
  "pricing.checkout.sameOrHigherTier": "You are already on this plan or a higher tier.",

  "pricing.autoRenew.resumeTitle": "Resume recurring subscription?",
  "pricing.autoRenew.cancelTitle": "Cancel recurring subscription?",
  "pricing.autoRenew.resumeDesc":
    "Recurring subscription will be re-enabled by default for {{plan}}.",
  "pricing.autoRenew.cancelDesc":
    "Recurring subscription will be turned off for {{plan}}.",
  "pricing.autoRenew.planFallback": "this plan",
  "pricing.autoRenew.keep": "Keep current",
  "pricing.autoRenew.resumeConfirm": "Resume recurring",
  "pricing.autoRenew.cancelConfirm": "Cancel recurring",

  "pricing.topUp.accessTitle": "Top-up access notice",
  "pricing.topUp.accessDesc":
    "Top-up packs are available only after upgrading to the Basic or Pro plan.",
  "pricing.topUp.memberRequired": "Subscribe to a paid plan before purchasing top-up packs.",
  "pricing.topUp.gotIt": "Got it",
  "pricing.topUp.dialogTitle": "Choose a top-up pack",
  "pricing.topUp.dialogDesc":
    "One-off payment with no recurring billing. Top-up credits stay valid for one month from purchase.",
  "pricing.topUp.oneOffLabel": "One-off refill pack",
  "pricing.topUp.youReceive": "You Receive",
  "pricing.topUp.cancel": "Cancel",
  "pricing.topUp.purchase": "Purchase",

  "pricing.topup.starter.name": "Starter",
  "pricing.topup.starter.note":
    "Straight value with no bonus, ideal for a quick trial or small refill.",
  "pricing.topup.base.name": "Base",
  "pricing.topup.base.note":
    "Includes 10 extra Credits beyond the benchmark, ideal for routine top-ups.",
  "pricing.topup.value.name": "Value Pack",
  "pricing.topup.value.note":
    "Adds nearly 100 bonus Credits, best for heavy creation or larger refills.",
  "pricing.topup.value.badge": "Best Value",

  "pricing.feature.brandInsight": "Brand Insight",
  "pricing.feature.strategyPlan": "Strategy Plan",
  "pricing.feature.imageGen": "Image Generation",
  "pricing.feature.videoGen": "Video Generation",
  "pricing.feature.viralMatch": "Viral Video Matching",
  "pricing.feature.videoRemix": "Video Remix",
  "pricing.feature.tkSolution": "TikTok Solution",

  "pricing.featureQuota.title": "What you can generate",
  "pricing.featureQuota.footerNote": "Based on your monthly credits",

  "app.error.title": "Something went wrong",
  "app.error.hint": "An unexpected error occurred. You can try again.",
  "app.error.retry": "Try again",
};
