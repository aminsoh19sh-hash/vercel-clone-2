// Internationalization (i18n) Engine for Deployly
// Official default language: English ('en')
// Arabic ('ar') selectable via the language switcher icon

const I18N = {
  current: localStorage.getItem('deployly_lang') || 'en',

  translations: {
    en: {
      dir: 'ltr',
      langName: 'En',
      altLang: 'ar',
      altLangName: 'AR',
      
      // Navigation
      navDashboard: 'Dashboard',
      navLogin: 'Sign In',
      navRegister: 'Get Started Free →',
      navLogout: 'Sign Out',
      navSettings: 'Settings',
      switchLang: 'Language',
      
      // Dashboard Stats & Header
      welcomeTo: 'Welcome to',
      dashTitle: 'Deployly Dashboard',
      ghConnected: '✓ GitHub Connected — ',
      ghConnectBtn: '🔗 Connect GitHub',
      statProjects: 'Deployed Projects',
      statDeployments: 'Total Deployments',
      statRam: 'RAM Usage',
      statUptime: 'Server Uptime',
      
      // Projects Section
      projectsTitle: 'Your Projects',
      projectsRunning: 'project(s) running right now',
      newProjectBtn: 'New Project',
      noProjectsTitle: 'No projects deployed yet',
      noProjectsDesc: 'Import a repository from GitHub or any Git URL to deploy automatically in seconds.',
      importFirstBtn: '+ Import First Project',
      notDeployedYet: 'Not deployed yet',
      lastDeployed: 'Deployed',
      neverDeployed: 'Never',
      
      // Status Badges
      stIdle: 'Ready to deploy',
      stBuilding: 'Building...',
      stRunning: 'Running',
      stStopped: 'Stopped',
      stFailed: 'Failed',
      
      // Project Details
      backToProjects: '← All Projects',
      btnDeploy: 'Deploy',
      btnStop: 'Stop',
      btnDelete: 'Delete',
      tabLogs: 'Logs',
      tabFiles: 'Files',
      tabSettings: 'Settings',
      tabDeployments: 'Deployments',
      confirmDeleteProject: 'Are you sure you want to permanently delete this project and all its files?',
      confirmDeleteDep: 'Delete this deployment record?',
      deployStarted: 'Deployment started',
      projectStopped: 'Project stopped',
      savedSuccess: 'Saved successfully',
      deletedSuccess: 'Deleted successfully',
      
      // Project Settings Tab
      settingsBranch: 'Production Branch',
      settingsRootDir: 'Root Directory (for monorepos)',
      settingsInstallCmd: 'Install Command',
      settingsBuildCmd: 'Build Command (optional)',
      settingsStartCmd: 'Start Command',
      settingsEnv: 'Environment Variables (KEY=value per line)',
      settingsWebhook: 'Webhook for Auto-Deploy (add to GitHub → Settings → Webhooks)',
      settingsCustomUrl: 'Project Link / Custom Domain',
      settingsCustomUrlPlaceholder: 'e.g. https://myproject.com or app.mydomain.local',
      settingsCustomUrlHint: 'Enter any custom domain, subdomain, or text address where your project link will appear and be accessed.',
      btnSave: 'Save Changes',
      btnSaveRedeploy: 'Save & Redeploy',
      
      // Files & Logs
      loadingFiles: 'Loading files...',
      noFilesFound: 'No files found (repository has not been cloned yet)',
      failedFiles: 'Failed to fetch files',
      noDepsYet: 'No deployments recorded yet.',
      
      // Single-Page Project Creator
      creatorBreadcrumb: 'Projects',
      creatorBreadcrumbCurrent: 'New Project',
      creatorTitle: 'Deploy a New Project',
      creatorSubtitle: 'Import an existing Git repository or enter a clone URL to deploy with instant zero-config detection on a single page.',
      
      sourceTabGithub: 'GitHub Repositories',
      sourceTabGitUrl: 'Direct Git Clone URL',
      
      searchReposPlaceholder: 'Search your repositories...',
      loadingRepos: 'Loading repositories from GitHub...',
      noReposFound: 'No repositories matching your search.',
      selectRepoBtn: 'Import Repo',
      
      ghNoticeTitle: 'Connect GitHub to browse your private and public repositories.',
      ghOAuthBtn: 'Connect with GitHub OAuth',
      ghPatLabel: 'Or paste Personal Access Token (repo scope)',
      ghPatPlaceholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
      ghPatSave: 'Save Token',
      
      gitUrlLabel: 'Git Repository URL',
      gitUrlPlaceholder: 'https://github.com/username/my-app.git',
      gitBranchLabel: 'Branch',
      btnAnalyzeRepo: 'Analyze Repository',
      analyzingText: 'Cloning and analyzing repository structure & databases...',
      
      insightsTitle: 'Smart Detection & Framework Insights',
      insightsFramework: 'Framework',
      insightsDb: 'Database detected',
      insightsDbTip: 'We detected database drivers. Environment variables have been pre-filled below — replace them with your external database connection strings.',
      
      configSectionTitle: 'Project Configuration',
      projNameLabel: 'Project Name',
      projBranchLabel: 'Branch',
      projRootDirLabel: 'Root Directory',
      
      buildSectionTitle: 'Build & Output Settings',
      
      envSectionTitle: 'Environment Variables',
      envHelper: 'Your application should listen on process.env.PORT.',
      
      btnLaunchDeploy: '🚀 Deploy Project',
      btnCancel: 'Cancel',
      deployingNotice: 'Deploying project... redirecting to live logs.',
      
      // Global Settings Modal
      modalSettingsTitle: 'Dashboard & Workspace Settings',
      prefLangLabel: 'Interface Language',
      savePrefBtn: 'Save Preferences',

      // Authentication
      authWelcomeBack: 'Welcome Back',
      authLoginSub: 'Sign in to manage and monitor your deployments.',
      authCreateAccount: 'Create Your Account',
      authRegisterSub: 'Start deploying your apps in seconds.',
      authNameLabel: 'Full Name',
      authNamePlaceholder: 'John Doe',
      authEmailLabel: 'Email Address',
      authPasswordLabel: 'Password',
      authSignInBtn: 'Sign In',
      authSignUpBtn: 'Create Account',
      authHaveAccount: 'Already have an account?',
      authNoAccount: "Don't have an account?",
      authSignInLink: 'Sign In',
      authSignUpLink: 'Sign Up Free',

      // Landing page
      landTitle: 'Deployly — Deploy your project in seconds',
      landBadge: 'Open-source auto-deployment platform',
      heroPre: 'From',
      heroPost: 'to a live link.',
      heroSub: 'Connect GitHub, pick a repository, and Deployly detects your project type, configures everything and puts it live in seconds — no complex setup.',
      heroCtaPrimary: 'Create your free account',
      heroCtaSecondary: 'How does it work?',
      numProjects: 'Projects',
      numPrice: 'SAR per month',
      numFaster: 'Faster than manual setup',
      featTitle: 'Everything you need to deploy your projects',
      featSub: 'Professional tools in one simple, fast platform',
      f1t: 'Direct GitHub integration',
      f1d: 'Sign in with OAuth or a personal token, browse your public and private repositories and import any project in one click.',
      f2t: 'Smart framework detection',
      f2a: 'We read',
      f2b: 'and detect Next.js, Vite, Express or NestJS, then suggest the right commands automatically.',
      f3t: 'Database detection',
      f3d: 'MongoDB, PostgreSQL, MySQL, Redis, Prisma and Supabase — we detect them and prepare your environment variables automatically.',
      f4t: 'Auto-deploy on every push',
      f4d: 'Add the webhook URL to your repository and it redeploys on every update, with live logs for each step.',
      f5t: 'Server monitoring',
      f5d: 'Track memory usage, uptime and the number of deployed projects from a single real-time dashboard.',
      f6t: 'File browser',
      f6d: 'Browse your project file structure right after deployment from the browser — no SSH or terminal needed.',
      ctaTitle: 'Ready to deploy your first project?',
      ctaSub: 'Join now and deploy your project in under a minute.',
      ctaBtn: 'Get started — completely free',
      footText: 'Deployly — self-hosted deployment platform · Open source',
      termDetected: 'Detected:',
      termListening: 'Listening on port 4001',
      termReady: 'Ready →',
      errUnexpected: 'An unexpected error occurred'
    },

    ar: {
      dir: 'rtl',
      langName: 'AR',
      altLang: 'en',
      altLangName: 'En',
      
      // Navigation
      navDashboard: 'لوحة التحكم',
      navLogin: 'تسجيل الدخول',
      navRegister: 'ابدأ مجاناً ←',
      navLogout: 'تسجيل الخروج',
      navSettings: 'الإعدادات',
      switchLang: 'اللغة',
      
      // Dashboard Stats & Header
      welcomeTo: 'مرحباً بك في',
      dashTitle: 'Deployly Dashboard',
      ghConnected: '✓ GitHub مربوط — ',
      ghConnectBtn: '🔗 ربط GitHub',
      statProjects: 'مشاريع منشورة',
      statDeployments: 'عمليات نشر',
      statRam: 'استهلاك الرام',
      statUptime: 'وقت التشغيل',
      
      // Projects Section
      projectsTitle: 'مشاريعك',
      projectsRunning: 'مشروع يعمل الآن',
      newProjectBtn: 'مشروع جديد',
      noProjectsTitle: 'لا توجد مشاريع بعد',
      noProjectsDesc: 'استورد مستودعاً من GitHub أو أدخل رابط Git لنشره تلقائياً خلال ثوانٍ.',
      importFirstBtn: '+ استيراد أول مشروع',
      notDeployedYet: 'لم يُنشر بعد',
      lastDeployed: 'تاريخ النشر',
      neverDeployed: 'أبداً',
      
      // Status Badges
      stIdle: 'جاهز للنشر',
      stBuilding: 'جارٍ البناء...',
      stRunning: 'يعمل',
      stStopped: 'متوقف',
      stFailed: 'فشل',
      
      // Project Details
      backToProjects: '← كل المشاريع',
      btnDeploy: 'نشر',
      btnStop: 'إيقاف',
      btnDelete: 'حذف',
      tabLogs: 'السجلات',
      tabFiles: 'الملفات',
      tabSettings: 'الإعدادات',
      tabDeployments: 'عمليات النشر',
      confirmDeleteProject: 'هل أنت متأكد من حذف المشروع وملفاته نهائياً؟',
      confirmDeleteDep: 'حذف عملية النشر هذه؟',
      deployStarted: 'بدأ النشر',
      projectStopped: 'تم الإيقاف',
      savedSuccess: 'تم الحفظ بنجاح',
      deletedSuccess: 'تم الحذف بنجاح',
      
      // Project Settings Tab
      settingsBranch: 'فرع الإنتاج',
      settingsRootDir: 'المجلد الجذر (للمونوريبو)',
      settingsInstallCmd: 'أمر التثبيت',
      settingsBuildCmd: 'أمر البناء (اختياري)',
      settingsStartCmd: 'أمر التشغيل',
      settingsEnv: 'متغيرات البيئة (KEY=value في كل سطر)',
      settingsWebhook: 'Webhook للنشر التلقائي (أضفه في GitHub ← Settings ← Webhooks)',
      settingsCustomUrl: 'عنوان الرابط / الدومين المخصص للمشروع',
      settingsCustomUrlPlaceholder: 'مثال: https://myproject.com أو app.mydomain.local',
      settingsCustomUrlHint: 'اكتب أي عنوان نصي أو دومين مخصص ليظهر فيه رابط مشروعك ويتم الوصول إليه من خلاله.',
      btnSave: 'حفظ التعديلات',
      btnSaveRedeploy: 'حفظ وإعادة النشر',
      
      // Files & Logs
      loadingFiles: 'جارٍ تحميل الملفات...',
      noFilesFound: 'لا توجد ملفات (لم يتم سحب المستودع بعد)',
      failedFiles: 'فشل جلب الملفات',
      noDepsYet: 'لا توجد عمليات نشر بعد.',
      
      // Single-Page Project Creator
      creatorBreadcrumb: 'المشاريع',
      creatorBreadcrumbCurrent: 'مشروع جديد',
      creatorTitle: 'إنشاء ونشر مشروع جديد',
      creatorSubtitle: 'استورد مستودع Git أو أدخل رابطه مباشرةً لتجهيز إعدادات النشر والكشف الذكي في صفحة واحدة مريحة.',
      
      sourceTabGithub: 'مستودعات GitHub',
      sourceTabGitUrl: 'رابط مستودع Git مباشر',
      
      searchReposPlaceholder: 'ابحث في مستودعاتك...',
      loadingRepos: 'جارٍ تحميل المستودعات من GitHub...',
      noReposFound: 'لم يتم العثور على مستودعات مطابقة.',
      selectRepoBtn: 'استيراد المستودع',
      
      ghNoticeTitle: 'اربط GitHub لتصفّح مستودعاتك الخاصة والعامة بسهولة.',
      ghOAuthBtn: 'الربط عبر GitHub',
      ghPatLabel: 'أو الصق توكن شخصي (صلاحية repo)',
      ghPatPlaceholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
      ghPatSave: 'حفظ التوكن',
      
      gitUrlLabel: 'رابط مستودع Git',
      gitUrlPlaceholder: 'https://github.com/username/my-app.git',
      gitBranchLabel: 'الفرع',
      btnAnalyzeRepo: 'تحليل المستودع',
      analyzingText: 'جارٍ سحب المستودع وتحليله وقراءة متطلباته وقواعد بياناته...',
      
      insightsTitle: 'نتائج الكشف والتحليل الذكي',
      insightsFramework: 'إطار العمل',
      insightsDb: 'قاعدة البيانات',
      insightsDbTip: 'اكتشفنا استخدام حزم قواعد البيانات. أضفنا المتغيرات المطلوبة أدناه — املأ قيمها بروابط قواعد بياناتك.',
      
      configSectionTitle: 'إعدادات المشروع',
      projNameLabel: 'اسم المشروع',
      projBranchLabel: 'الفرع الأساسي',
      projRootDirLabel: 'المجلد الجذر (Root Directory)',
      
      buildSectionTitle: 'أوامر البناء والتشغيل',
      
      envSectionTitle: 'متغيرات البيئة (Environment Variables)',
      envHelper: 'يجب أن يستمع تطبيقك على المنفذ process.env.PORT.',
      
      btnLaunchDeploy: '🚀 نشر المشروع الآن',
      btnCancel: 'إلغاء والعودة',
      deployingNotice: 'جارٍ بدء النشر... سيتم تحويلك إلى سجلات البناء المباشرة.',
      
      // Global Settings Modal
      modalSettingsTitle: 'إعدادات المنصة ولوحة التحكم',
      prefLangLabel: 'لغة الواجهة',
      savePrefBtn: 'حفظ الإعدادات',

      // Authentication
      authWelcomeBack: 'مرحباً بعودتك',
      authLoginSub: 'سجّل الدخول لإدارة ومراقبة مشاريعك المنشورة.',
      authCreateAccount: 'أنشئ حسابك الجديد',
      authRegisterSub: 'ابدأ بنشر مشاريعك وتطبيقاتك خلال ثوانٍ.',
      authNameLabel: 'الاسم الكامل',
      authNamePlaceholder: 'اسمك الكريم',
      authEmailLabel: 'البريد الإلكتروني',
      authPasswordLabel: 'كلمة المرور',
      authSignInBtn: 'تسجيل الدخول',
      authSignUpBtn: 'إنشاء حساب جديد',
      authHaveAccount: 'لديك حساب بالفعل؟',
      authNoAccount: 'ليس لديك حساب بعد؟',
      authSignInLink: 'تسجيل الدخول',
      authSignUpLink: 'أنشئ حساباً مجاناً',

      // Landing page
      landTitle: 'Deployly — انشر مشروعك خلال ثوانٍ',
      landBadge: 'منصة نشر تلقائي مفتوحة المصدر',
      heroPre: 'من',
      heroPost: 'إلى رابط يعمل.',
      heroSub: 'اربط GitHub، اختر المستودع، وسيكتشف Deployly نوع مشروعك ويضبط كل شيء ويرفعه على الهواء خلال ثوانٍ — بدون إعدادات معقدة.',
      heroCtaPrimary: 'أنشئ حسابك مجاناً',
      heroCtaSecondary: 'كيف يعمل؟',
      numProjects: 'مشاريع',
      numPrice: 'ريال شهرياً',
      numFaster: 'أسرع من الإعداد اليدوي',
      featTitle: 'كل ما تحتاجه لنشر مشاريعك',
      featSub: 'أدوات احترافية في منصة واحدة بسيطة وسريعة',
      f1t: 'ربط مباشر مع GitHub',
      f1d: 'سجّل الدخول عبر OAuth أو بتوكن شخصي، وتصفّح مستودعاتك العامة والخاصة واستورد أي مشروع بنقرة واحدة.',
      f2t: 'كشف ذكي للإطار',
      f2a: 'نقرأ',
      f2b: 'ونعرف إن كان Next.js أو Vite أو Express أو NestJS، ونقترح الأوامر المناسبة تلقائياً.',
      f3t: 'اكتشاف قاعدة البيانات',
      f3d: 'MongoDB وPostgreSQL وMySQL وRedis وPrisma وSupabase — نكتشفها ونجهّز لك متغيرات البيئة تلقائياً.',
      f4t: 'نشر تلقائي عند كل Push',
      f4d: 'أضف رابط الـ Webhook إلى مستودعك وسيُعاد النشر تلقائياً عند كل تحديث مع سجلات مباشرة لكل خطوة.',
      f5t: 'مراقبة السيرفر',
      f5d: 'تابع استهلاك الذاكرة ووقت التشغيل وعدد المشاريع المنشورة من لوحة تحكم واحدة في الوقت الحقيقي.',
      f6t: 'مستعرض الملفات',
      f6d: 'تصفّح بنية ملفات مشروعك بعد النشر مباشرة من المتصفح — لا حاجة لفتح SSH أو Terminal.',
      ctaTitle: 'جاهز لنشر أول مشروع؟',
      ctaSub: 'انضم الآن وانشر مشروعك في أقل من دقيقة.',
      ctaBtn: 'ابدأ الآن — مجاناً تماماً',
      footText: 'Deployly — منصة نشر ذاتية الاستضافة · مفتوحة المصدر',
      termDetected: 'تم الكشف:',
      termListening: 'الاستماع على المنفذ 4001',
      termReady: 'جاهز →',
      errUnexpected: 'حدث خطأ غير متوقع'
    }
  },

  t(key, fallback = '') {
    const dict = I18N.translations[I18N.current] || I18N.translations.en;
    return dict[key] !== undefined ? dict[key] : (I18N.translations.en[key] !== undefined ? I18N.translations.en[key] : fallback || key);
  },

  setLang(lang) {
    if (!['en', 'ar'].includes(lang)) lang = 'en';
    I18N.current = lang;
    localStorage.setItem('deployly_lang', lang);
    I18N.apply();
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  },

  toggleLang() {
    const next = I18N.current === 'en' ? 'ar' : 'en';
    I18N.setLang(next);
  },

  apply() {
    const lang = I18N.current;
    const isAr = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-ar', isAr);
    document.body.classList.toggle('lang-en', !isAr);

    // Update any elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = I18N.t(key);
        } else {
          el.textContent = I18N.t(key);
        }
      }
    });

    // Update switcher buttons
    document.querySelectorAll('.lang-switcher-btn').forEach(btn => {
      const flag = isAr ? '🇺🇸 EN' : '🇸🇦 AR';
      btn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-inline-end:4px">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span>${isAr ? 'En' : 'AR'}</span>
      `;
      btn.title = isAr ? 'Switch to English (Official)' : 'التحويل إلى AR';
    });
  },

  createSwitcherHtml(extraClass = '') {
    const isAr = I18N.current === 'ar';
    return `
      <button type="button" class="btn sm lang-switcher-btn ${extraClass}" onclick="I18N.toggleLang()" title="${isAr ? 'Switch to English' : 'التحويل إلى AR'}" style="gap:6px;font-weight:600">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span>${isAr ? 'En' : 'AR'}</span>
      </button>
    `;
  }
};

// Initial apply
I18N.apply();