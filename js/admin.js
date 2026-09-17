/**
 * Treat Landing Page - Admin Studio Controller
 * Enables uploading custom mockup images for all 4 phones, editing step titles/descriptions,
 * changing download targets, and exporting/importing JSON backups.
 */

class TreatAdminPanel {
  constructor(screenFlowInstance) {
    this.flow = screenFlowInstance;

    this.storageKey = 'treat_landing_config_v4';
    this.authSessionKey = 'treat_admin_session_auth_v1';
    this.masterPasskey = '133162029';

    this.config = this.loadConfig();

    this.activeTab = 'flow'; // 'flow', 'hero', 'downloads', 'backup'

    // DOM Elements - Studio Drawer
    this.drawer = document.getElementById('admin-studio-drawer');
    this.backdrop = document.getElementById('admin-studio-backdrop');
    this.openBtn = document.getElementById('admin-open-btn');
    this.closeBtn = document.getElementById('admin-close-btn');
    this.lockBtn = document.getElementById('admin-lock-btn');

    // DOM Elements - Login Modal
    this.loginModal = document.getElementById('admin-login-modal');
    this.loginCard = document.getElementById('admin-login-card');
    this.loginBackdrop = document.getElementById('admin-login-backdrop');
    this.closeLoginBtn = document.getElementById('close-admin-login-btn');
    this.loginForm = document.getElementById('admin-login-form');
    this.passInput = document.getElementById('admin-pass-input');
    this.togglePassBtn = document.getElementById('toggle-pass-visibility');
    this.passIcon = document.getElementById('pass-visibility-icon');
    this.loginError = document.getElementById('admin-login-error');
    this.loginErrorText = document.getElementById('admin-login-error-text');

    this.init();
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.flowSteps) && parsed.flowSteps.length >= 4) {
          if (!parsed.developer && window.TREAT_DEFAULT_DATA && window.TREAT_DEFAULT_DATA.developer) {
            parsed.developer = JSON.parse(JSON.stringify(window.TREAT_DEFAULT_DATA.developer));
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load localStorage config:', err);
    }
    return JSON.parse(JSON.stringify(window.TREAT_DEFAULT_DATA));
  }

  saveConfig() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.config));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
    this.applyLiveChanges();
  }

  init() {
    this.bindDrawerEvents();
    this.renderTabs();
    this.renderCurrentTab();
    this.applyLiveChanges();

    // Synchronize changes made in full-page admin.html across browser tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        this.config = this.loadConfig();
        this.applyLiveChanges();
      }
    });
  }

  // --- AUTHENTICATION & SECURITY ---

  isAuthenticated() {
    try {
      return sessionStorage.getItem(this.authSessionKey) === 'true';
    } catch (e) {
      return false;
    }
  }

  openLoginModal() {
    if (!this.loginModal) return;
    this.loginModal.classList.remove('hidden');
    if (this.loginError) this.loginError.classList.add('hidden');
    if (this.passInput) {
      this.passInput.value = '';
      this.passInput.type = 'password';
      if (this.passIcon) this.passIcon.textContent = 'visibility';
      setTimeout(() => this.passInput.focus(), 80);
    }
  }

  closeLoginModal() {
    if (!this.loginModal) return;
    this.loginModal.classList.add('hidden');
    if (this.passInput) this.passInput.value = '';
    if (this.loginError) this.loginError.classList.add('hidden');
  }

  submitLogin() {
    if (!this.passInput) return;
    const entered = this.passInput.value.trim();
    if (entered === this.masterPasskey) {
      try {
        sessionStorage.setItem(this.authSessionKey, 'true');
      } catch (e) {}
      this.closeLoginModal();
      this.openDrawer();
      this.showToast('Admin Studio Unlocked');
    } else {
      if (this.loginError) {
        this.loginError.classList.remove('hidden');
        if (this.loginErrorText) {
          this.loginErrorText.textContent = entered === '' ? 'Please enter the passkey.' : 'Incorrect passkey. Access denied.';
        }
      }
      if (this.loginCard) {
        this.loginCard.classList.remove('shake-error');
        void this.loginCard.offsetWidth; // trigger reflow
        this.loginCard.classList.add('shake-error');
      }
      this.passInput.select();
      this.passInput.focus();
    }
  }

  togglePasswordVisibility() {
    if (!this.passInput) return;
    if (this.passInput.type === 'password') {
      this.passInput.type = 'text';
      if (this.passIcon) this.passIcon.textContent = 'visibility_off';
    } else {
      this.passInput.type = 'password';
      if (this.passIcon) this.passIcon.textContent = 'visibility';
    }
  }

  lock() {
    try {
      sessionStorage.removeItem(this.authSessionKey);
    } catch (e) {}
    this.close();
    this.showToast('Admin Studio Locked');
  }

  showToast(message) {
    let toast = document.getElementById('admin-studio-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'admin-studio-toast';
      toast.className = 'fixed bottom-6 right-6 z-[150] px-4 py-2.5 rounded-full bg-[#181024] text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/15 transition-all duration-300 pointer-events-none opacity-0 translate-y-4';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4');
    }, 2800);
  }

  bindDrawerEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.open());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.lockBtn) {
      this.lockBtn.addEventListener('click', () => this.lock());
    }

    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    // Login modal events
    if (this.closeLoginBtn) {
      this.closeLoginBtn.addEventListener('click', () => this.closeLoginModal());
    }

    if (this.loginBackdrop) {
      this.loginBackdrop.addEventListener('click', () => this.closeLoginModal());
    }

    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitLogin();
      });
    }

    if (this.togglePassBtn) {
      this.togglePassBtn.addEventListener('click', () => this.togglePasswordVisibility());
    }

    // Keyboard shortcut Ctrl+Shift+A / Cmd+Shift+A
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'Escape') {
        if (this.loginModal && !this.loginModal.classList.contains('hidden')) {
          this.closeLoginModal();
        } else if (this.isOpen()) {
          this.close();
        }
      }
    });
  }

  isOpen() {
    return this.drawer && this.drawer.classList.contains('open');
  }

  open() {
    if (!this.isAuthenticated()) {
      this.openLoginModal();
      return;
    }
    this.openDrawer();
  }

  openDrawer() {
    if (!this.drawer) return;
    this.drawer.classList.add('open');
    if (this.backdrop) this.backdrop.classList.remove('hidden');
    this.renderCurrentTab();
  }

  close() {
    if (!this.drawer) return;
    this.drawer.classList.remove('open');
    if (this.backdrop) this.backdrop.classList.add('hidden');
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  renderTabs() {
    const tabsContainer = document.getElementById('admin-tabs-nav');
    if (!tabsContainer) return;

    const tabs = [
      { id: 'flow', label: '4 Mockup Phones', icon: 'smartphone' },
      { id: 'hero', label: 'Hero & Vision', icon: 'auto_awesome' },
      { id: 'developer', label: 'Developer Profile', icon: 'terminal' },
      { id: 'downloads', label: 'Download CTA', icon: 'download' },
      { id: 'backup', label: 'Config / JSON', icon: 'save' }
    ];

    tabsContainer.innerHTML = tabs.map(t => `
      <button type="button" class="admin-tab-btn ${this.activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">
        <span class="material-symbols-outlined text-[18px]">${t.icon}</span>
        <span>${t.label}</span>
      </button>
    `).join('');

    tabsContainer.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeTab = btn.getAttribute('data-tab');
        this.renderTabs();
        this.renderCurrentTab();
      });
    });
  }

  renderCurrentTab() {
    const contentArea = document.getElementById('admin-tab-content');
    if (!contentArea) return;

    contentArea.innerHTML = '';

    switch (this.activeTab) {
      case 'flow':
        this.renderFlowTab(contentArea);
        break;
      case 'hero':
        this.renderHeroTab(contentArea);
        break;
      case 'developer':
        this.renderDeveloperTab(contentArea);
        break;
      case 'downloads':
        this.renderDownloadsTab(contentArea);
        break;
      case 'backup':
        this.renderBackupTab(contentArea);
        break;
    }
  }

  // --- TAB 1: 4 MOCKUP PHONES ---

  renderFlowTab(container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col gap-5';

    wrapper.innerHTML = `
      <div class="pb-2 border-b border-outline-variant/30">
        <h3 class="font-headline font-bold text-base text-on-surface">4-Phone Wave Showcase</h3>
        <p class="text-xs text-on-surface-variant font-medium">Upload new screenshots, change titles, or pick from wireframes library.</p>
      </div>

      <div id="admin-steps-cards" class="flex flex-col gap-4"></div>
    `;

    container.appendChild(wrapper);

    const cardsContainer = wrapper.querySelector('#admin-steps-cards');

    this.config.flowSteps.slice(0, 4).forEach((step, idx) => {
      const card = document.createElement('div');
      card.className = 'admin-screen-card flex flex-col gap-3';
      card.innerHTML = `
        <div class="flex items-center justify-between pb-1 border-b border-outline-variant/20">
          <div class="flex items-center gap-2">
            <span class="flow-step-badge">0${idx + 1}</span>
            <span class="font-headline font-bold text-sm text-on-surface">Position #${idx + 1}</span>
          </div>
          <span class="text-[11px] font-bold text-secondary uppercase">${step.tag || 'STEP'}</span>
        </div>

        <!-- Image Upload & Preview -->
        <div class="flex items-center gap-3">
          <div class="w-14 h-24 rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant/40 shrink-0 shadow-sm relative">
            <img src="${step.image}" id="admin-preview-img-${idx}" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 min-w-0 flex flex-col gap-1.5">
            <label class="block text-[11px] font-bold text-on-surface">Screenshot Source</label>
            <input type="text" id="admin-step-img-${idx}" value="${step.image}" class="admin-input text-xs" placeholder="Image URL or path">
            <div class="flex items-center gap-2">
              <label class="px-2.5 py-1.5 rounded-lg bg-secondary-fixed hover:bg-secondary hover:text-white text-on-secondary-fixed text-[11px] font-bold cursor-pointer flex items-center gap-1 transition-all">
                <span class="material-symbols-outlined text-[14px]">upload_file</span> Upload
                <input type="file" id="admin-file-${idx}" accept="image/*" class="hidden">
              </label>
              
              <!-- Quick Library Preset Picker -->
              <select id="admin-preset-${idx}" class="admin-input text-[11px] py-1">
                <option value="">Choose wireframe...</option>
                ${(this.config.availableScreens || []).map(scr => `
                  <option value="${scr.image}">${scr.title}</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Title & Icon -->
        <div class="grid grid-cols-3 gap-2">
          <div class="col-span-2">
            <label class="block text-[11px] font-bold text-on-surface mb-0.5">Title</label>
            <input type="text" id="admin-title-${idx}" value="${step.title}" class="admin-input font-bold">
          </div>
          <div>
            <label class="block text-[11px] font-bold text-on-surface mb-0.5">Icon Name</label>
            <input type="text" id="admin-icon-${idx}" value="${step.icon}" class="admin-input">
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-[11px] font-bold text-on-surface mb-0.5">Description (under header)</label>
          <textarea id="admin-desc-${idx}" rows="2" class="admin-input text-xs">${step.description}</textarea>
        </div>
      `;

      // File upload handler
      const fileInput = card.querySelector(`#admin-file-${idx}`);
      const imgInput = card.querySelector(`#admin-step-img-${idx}`);
      const previewImg = card.querySelector(`#admin-preview-img-${idx}`);
      const presetSelect = card.querySelector(`#admin-preset-${idx}`);

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            imgInput.value = re.target.result;
            previewImg.src = re.target.result;
            this.config.flowSteps[idx].image = re.target.result;
            this.saveConfig();
          };
          reader.readAsDataURL(file);
        }
      });

      presetSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          imgInput.value = e.target.value;
          previewImg.src = e.target.value;
          this.config.flowSteps[idx].image = e.target.value;
          this.saveConfig();
        }
      });

      imgInput.addEventListener('input', () => {
        previewImg.src = imgInput.value.trim();
        this.config.flowSteps[idx].image = imgInput.value.trim();
        this.saveConfig();
      });

      card.querySelector(`#admin-title-${idx}`).addEventListener('input', (e) => {
        this.config.flowSteps[idx].title = e.target.value.trim();
        this.saveConfig();
      });

      card.querySelector(`#admin-icon-${idx}`).addEventListener('input', (e) => {
        this.config.flowSteps[idx].icon = e.target.value.trim();
        this.saveConfig();
      });

      card.querySelector(`#admin-desc-${idx}`).addEventListener('input', (e) => {
        this.config.flowSteps[idx].description = e.target.value.trim();
        this.saveConfig();
      });

      cardsContainer.appendChild(card);
    });
  }

  // --- TAB 2: HERO & VISION ---

  renderHeroTab(container) {
    const brand = this.config.brand || {};
    container.innerHTML = `
      <div class="flex flex-col gap-4">
        <div>
          <h3 class="font-headline font-bold text-base text-on-surface">Hero Copy & App Vision</h3>
          <p class="text-xs text-on-surface-variant font-medium">Update the short-form caption and brand headline seen by visitors.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Hero Pill Badge</label>
          <input type="text" id="admin-hero-badge" value="${brand.heroBadge || ''}" class="admin-input">
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Catchy Headline (Lines stacked one under another)</label>
          <textarea id="admin-hero-headline" rows="3" class="admin-input font-bold">${brand.heroHeadline || ''}</textarea>
          <span class="text-[11px] text-on-surface-variant">Default: Find Treat, Give Treat, Get Treat (each on its own line).</span>
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Eye-Catching Short-Form Caption (Vision)</label>
          <textarea id="admin-hero-caption" rows="4" class="admin-input">${brand.heroCaption || ''}</textarea>
          <span class="text-[11px] text-on-surface-variant">Keep it punchy (1-2 sentences) highlighting group deals, budget matching, and live table hold.</span>
        </div>

        <div class="pt-2">
          <button id="admin-save-hero-btn" class="w-full py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">save</span>
            <span>Update Hero & Vision</span>
          </button>
        </div>
      </div>
    `;

    container.querySelector('#admin-save-hero-btn').addEventListener('click', () => {
      this.config.brand.heroBadge = container.querySelector('#admin-hero-badge').value.trim();
      this.config.brand.heroHeadline = container.querySelector('#admin-hero-headline').value.trim();
      this.config.brand.heroCaption = container.querySelector('#admin-hero-caption').value.trim();
      this.saveConfig();
      this.showToast('Hero copy updated successfully');
    });
  }

  // --- TAB 3: DOWNLOAD CTA & LINKS ---

  renderDownloadsTab(container) {
    const dl = this.config.download || {};
    container.innerHTML = `
      <div class="flex flex-col gap-4">
        <div>
          <h3 class="font-headline font-bold text-base text-on-surface">Download Button & CTA Settings</h3>
          <p class="text-xs text-on-surface-variant font-medium">Configure the prominent button directly below the 4-phone wave.</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Button Label</label>
          <input type="text" id="admin-cta-text" value="${dl.ctaText || 'Download Treat App'}" class="admin-input font-bold">
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Subtitle / Squad Callout</label>
          <textarea id="admin-cta-subtext" rows="2" class="admin-input">${dl.ctaSubtext || ''}</textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Android APK Download Target</label>
          <input type="text" id="admin-dl-apk-url" value="${dl.apkDownloadUrl || ''}" placeholder="URL or path to .apk" class="admin-input">
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold text-on-surface mb-1">Version Number</label>
            <input type="text" id="admin-dl-version" value="${dl.apkVersion || 'v1.0.4'}" class="admin-input">
          </div>
          <div>
            <label class="block text-xs font-bold text-on-surface mb-1">File Size</label>
            <input type="text" id="admin-dl-size" value="${dl.apkSize || '24.8 MB'}" class="admin-input">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Google Play URL</label>
          <input type="text" id="admin-dl-playstore" value="${dl.playStoreUrl || ''}" class="admin-input">
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Web Demo URL</label>
          <input type="text" id="admin-dl-webdemo" value="${dl.webDemoUrl || 'http://localhost:8080'}" class="admin-input">
        </div>

        <div class="pt-2">
          <button id="admin-save-downloads-btn" class="w-full py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">save</span>
            <span>Update CTA & Links</span>
          </button>
        </div>
      </div>
    `;

    container.querySelector('#admin-save-downloads-btn').addEventListener('click', () => {
      this.config.download.ctaText = container.querySelector('#admin-cta-text').value.trim();
      this.config.download.ctaSubtext = container.querySelector('#admin-cta-subtext').value.trim();
      this.config.download.apkDownloadUrl = container.querySelector('#admin-dl-apk-url').value.trim();
      this.config.download.apkVersion = container.querySelector('#admin-dl-version').value.trim();
      this.config.download.apkSize = container.querySelector('#admin-dl-size').value.trim();
      this.config.download.playStoreUrl = container.querySelector('#admin-dl-playstore').value.trim();
      this.config.download.webDemoUrl = container.querySelector('#admin-dl-webdemo').value.trim();
      this.saveConfig();
      this.showToast('Download CTA updated successfully');
    });
  }

  // --- TAB: DEVELOPER PROFILE ---

  renderDeveloperTab(container) {
    const dev = this.config.developer || (window.TREAT_DEFAULT_DATA ? window.TREAT_DEFAULT_DATA.developer : {});
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col gap-4';

    wrapper.innerHTML = `
      <div class="pb-2 border-b border-outline-variant/30">
        <h3 class="font-headline font-bold text-base text-on-surface">Developer Profile Showcase</h3>
        <p class="text-xs text-on-surface-variant font-medium">Customize the developer profile shown on the Treat landing page.</p>
      </div>

      <div class="flex flex-col gap-3">
        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Developer Full Name</label>
          <input type="text" id="admin-dev-name" value="${dev.name || ''}" class="admin-input">
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Role / Job Title</label>
          <input type="text" id="admin-dev-role" value="${dev.role || ''}" class="admin-input">
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Location & Status</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="text" id="admin-dev-location" value="${dev.location || ''}" class="admin-input" placeholder="Location">
            <input type="text" id="admin-dev-status" value="${dev.status || ''}" class="admin-input" placeholder="Status">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Bio / Craft Statement</label>
          <textarea id="admin-dev-bio" rows="3" class="admin-input text-xs font-medium">${dev.bio || ''}</textarea>
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Avatar Image URL</label>
          <input type="text" id="admin-dev-avatar" value="${dev.avatar || ''}" class="admin-input text-xs" placeholder="https://github.com/username.png">
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">GitHub Profile URL</label>
          <input type="text" id="admin-dev-github" value="${dev.githubUrl || ''}" class="admin-input text-xs" placeholder="https://github.com/username">
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Project Repository URL</label>
          <input type="text" id="admin-dev-repo" value="${dev.repoUrl || ''}" class="admin-input text-xs" placeholder="https://github.com/username/repo">
        </div>

        <div>
          <label class="block text-xs font-bold text-on-surface mb-1">Technologies & Skills (comma-separated)</label>
          <input type="text" id="admin-dev-skills" value="${Array.isArray(dev.skills) ? dev.skills.join(', ') : ''}" class="admin-input text-xs" placeholder="Flutter, Android, Tailwind CSS, Node.js">
        </div>

        <button type="button" id="admin-save-dev-btn" class="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-extrabold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-2">
          <span class="material-symbols-outlined text-[16px]">save</span>
          <span>Save Developer Profile</span>
        </button>
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('#admin-save-dev-btn').addEventListener('click', () => {
      if (!this.config.developer) this.config.developer = {};
      this.config.developer.name = wrapper.querySelector('#admin-dev-name').value.trim();
      this.config.developer.role = wrapper.querySelector('#admin-dev-role').value.trim();
      this.config.developer.location = wrapper.querySelector('#admin-dev-location').value.trim();
      this.config.developer.status = wrapper.querySelector('#admin-dev-status').value.trim();
      this.config.developer.bio = wrapper.querySelector('#admin-dev-bio').value.trim();
      this.config.developer.avatar = wrapper.querySelector('#admin-dev-avatar').value.trim();
      this.config.developer.githubUrl = wrapper.querySelector('#admin-dev-github').value.trim();
      this.config.developer.repoUrl = wrapper.querySelector('#admin-dev-repo').value.trim();
      const rawSkills = wrapper.querySelector('#admin-dev-skills').value;
      this.config.developer.skills = rawSkills.split(',').map(s => s.trim()).filter(Boolean);

      this.saveConfig();
      this.showToast('Developer profile updated');
    });
  }

  // --- TAB 5: BACKUP & CONFIG ---

  renderBackupTab(container) {
    container.innerHTML = `
      <div class="flex flex-col gap-4">
        <div>
          <h3 class="font-headline font-bold text-base text-on-surface">Configuration & JSON Backup</h3>
          <p class="text-xs text-on-surface-variant font-medium">Export your 4-phone configuration or restore factory defaults.</p>
        </div>

        <div class="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div>
              <h5 class="font-bold text-xs text-on-surface">Export Configuration</h5>
              <p class="text-[11px] text-on-surface-variant">Download treat-landing-config.json</p>
            </div>
            <button id="admin-export-json-btn" class="px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary hover:text-white text-xs font-bold flex items-center gap-1 transition-all">
              <span class="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export JSON</span>
            </button>
          </div>

          <div class="h-px bg-outline-variant/20"></div>

          <div class="flex items-center justify-between">
            <div>
              <h5 class="font-bold text-xs text-on-surface">Import Configuration</h5>
              <p class="text-[11px] text-on-surface-variant">Restore configuration from a JSON file</p>
            </div>
            <label class="px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary hover:text-white text-xs font-bold cursor-pointer flex items-center gap-1 transition-all">
              <span class="material-symbols-outlined text-[16px]">file_upload</span>
              <span>Import JSON</span>
              <input type="file" id="admin-import-json-file" accept=".json" class="hidden">
            </label>
          </div>

          <div class="h-px bg-outline-variant/20"></div>

          <div class="flex items-center justify-between">
            <div>
              <h5 class="font-bold text-xs text-error">Reset to Factory Defaults</h5>
              <p class="text-[11px] text-on-surface-variant">Restore initial Treat 4-phone wave setup</p>
            </div>
            <button id="admin-reset-defaults-btn" class="px-3 py-1.5 rounded-full bg-error-container text-onErrorContainer hover:bg-error hover:text-white text-xs font-bold flex items-center gap-1 transition-all">
              <span class="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Export
    container.querySelector('#admin-export-json-btn').addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.config, null, 2));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute('href', dataStr);
      dlAnchor.setAttribute('download', 'treat-4phone-flow-config.json');
      document.body.appendChild(dlAnchor);
      dlAnchor.click();
      dlAnchor.remove();
    });

    // Import
    container.querySelector('#admin-import-json-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          try {
            const imported = JSON.parse(re.target.result);
            if (imported && Array.isArray(imported.flowSteps) && imported.flowSteps.length >= 4) {
              this.config = imported;
              this.saveConfig();
              this.showToast('Configuration imported successfully');
              this.renderCurrentTab();
            } else {
              this.showToast('Invalid configuration format');
            }
          } catch (err) {
            this.showToast('Error parsing JSON: ' + err.message);
          }
        };
        reader.readAsText(file);
      }
    });

    // Reset
    container.querySelector('#admin-reset-defaults-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to reset to Treat factory defaults?')) {
        localStorage.removeItem(this.storageKey);
        this.config = JSON.parse(JSON.stringify(window.TREAT_DEFAULT_DATA));
        this.saveConfig();
        this.showToast('Restored Treat defaults');
        this.renderCurrentTab();
      }
    });
  }

  // --- Live DOM Synchronization ---

  applyLiveChanges() {
    // 1. Update Hero texts
    const heroBadge = document.getElementById('hero-badge-text');
    if (heroBadge && this.config.brand.heroBadge) {
      heroBadge.textContent = this.config.brand.heroBadge;
    }

    const heroHeadline = document.getElementById('hero-headline-text');
    if (heroHeadline && this.config.brand.heroHeadline) {
      if (this.config.brand.heroHeadline.includes('Feast Together') || this.config.brand.heroHeadline.includes('Find Treat') || this.config.brand.heroHeadline.includes('Find your people')) {
        this.config.brand.heroHeadline = "Find Your Craving\nShare the Good Stuff\nMake It a Treat";
        try { localStorage.setItem(this.storageKey, JSON.stringify(this.config)); } catch(e) {}
      }

      if (this.config.brand.heroHeadline.includes('Find Your Craving')) {
        heroHeadline.innerHTML = `
          <span class="hero-title-line flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-[#181024]">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#9357E8] -rotate-12 shrink-0 select-none hidden sm:inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
              <path d="M6 15 C5 12 5.5 8 8 6" />
              <path d="M12 18 C11 16 11.5 13.5 13 11" />
            </svg>
            <span>Find Your Craving</span>
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#9357E8] rotate-12 shrink-0 select-none hidden sm:inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
              <path d="M18 15 C19 12 18.5 8 16 6" />
              <path d="M12 18 C13 16 12.5 13.5 11 11" />
            </svg>
          </span>
          <span class="hero-title-line block text-center lg:text-left text-[#E040A0] my-0.5">
            <span class="hero-title-primary text-[#E040A0]">
              <span>Share </span>
              <span class="relative inline-block">
                <span>the Good Stuff</span>
                <svg class="absolute -bottom-2 sm:-bottom-3.5 left-0 w-full h-3 sm:h-4 overflow-visible pointer-events-none" viewBox="0 0 240 16" fill="none" preserveAspectRatio="none">
                  <path d="M 3 8 C 65 14, 155 15, 237 6" stroke="#E040A0" stroke-width="4.5" stroke-linecap="round" />
                </svg>
              </span>
            </span>
          </span>
          <span class="hero-title-line inline-flex items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-[#181024]">
            <span>Make It a Treat</span>
            <svg class="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-[#9357E8] -rotate-12 translate-y-0.5 shrink-0 select-none" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 27 C16 27, 4.5 19, 4.5 11.5 C4.5 6.5, 8.5 3.5, 12.5 4.5 C14.8 5.1, 15.6 6.8, 16 8 C16.4 6.8, 17.2 5.1, 19.5 4.5 C23.5 3.5, 27.5 6.5, 27.5 11.5 C27.5 19, 16 27, 16 27 Z" />
            </svg>
          </span>
        `;
      } else if (this.config.brand.heroHeadline.includes('\n')) {
        const lines = this.config.brand.heroHeadline.split('\n').map(s => s.trim()).filter(Boolean);
        heroHeadline.innerHTML = lines.map((line, idx) => {
          if (idx === 1) {
            return `<span class="hero-title-line block text-gradient-give">${line}</span>`;
          }
          return `<span class="hero-title-line block">${line}</span>`;
        }).join('');
      } else if (this.config.brand.heroHeadline.includes('<')) {
        heroHeadline.innerHTML = this.config.brand.heroHeadline;
      } else {
        heroHeadline.textContent = this.config.brand.heroHeadline;
      }
    }

    const heroCaption = document.getElementById('hero-caption-text');
    if (heroCaption && this.config.brand.heroCaption) {
      if (this.config.brand.heroCaption.includes('Discover amazing deals')) {
        this.config.brand.heroCaption = "Treat connects modern foodies with dynamic platter deals, automated budget matching, instant 2-minute table holds, and real-time kitchen floor sync. The all-in-one culinary squad experience.";
        try { localStorage.setItem(this.storageKey, JSON.stringify(this.config)); } catch(e) {}
      }
      heroCaption.textContent = this.config.brand.heroCaption;
    }

    const liveProof = document.getElementById('live-proof-text');
    if (liveProof && this.config.brand.liveSocialProof) {
      liveProof.textContent = this.config.brand.liveSocialProof;
    }

    // 2. Update Download CTA Button & Subtext
    const flowBtn = document.getElementById('flow-download-btn');
    const flowBtnText = document.getElementById('flow-cta-text');
    const flowSubtext = document.getElementById('flow-cta-subtext');

    if (flowBtn && this.config.download.apkDownloadUrl) {
      flowBtn.setAttribute('href', this.config.download.apkDownloadUrl);
    }
    if (flowBtnText && this.config.download.ctaText) {
      flowBtnText.textContent = this.config.download.ctaText;
    }
    if (flowSubtext && this.config.download.ctaSubtext) {
      flowSubtext.textContent = this.config.download.ctaSubtext;
    }

    // 3. Update 4-Phone Screen Flow in DOM
    if (this.flow && Array.isArray(this.config.flowSteps)) {
      this.flow.setSteps(this.config.flowSteps);
    }

    // 4. Update Developer Profile in DOM
    if (this.config.developer) {
      const devName = document.getElementById('dev-profile-name');
      const devRole = document.getElementById('dev-profile-role');
      const devBio = document.getElementById('dev-profile-bio');
      const devStatus = document.getElementById('dev-profile-status');
      const devLocation = document.getElementById('dev-profile-location');
      const devAvatar = document.getElementById('dev-profile-avatar');
      const devGithub = document.getElementById('dev-profile-github');
      const devRepo = document.getElementById('dev-profile-repo');
      const devSkills = document.getElementById('dev-profile-skills');

      if (devName && this.config.developer.name) devName.textContent = this.config.developer.name;
      if (devRole && this.config.developer.role) devRole.textContent = this.config.developer.role;
      if (devBio && this.config.developer.bio) devBio.textContent = this.config.developer.bio;
      if (devStatus && this.config.developer.status) devStatus.textContent = this.config.developer.status;
      if (devLocation && this.config.developer.location) devLocation.textContent = this.config.developer.location;
      if (devAvatar && this.config.developer.avatar) devAvatar.src = this.config.developer.avatar;
      if (devGithub && this.config.developer.githubUrl) devGithub.href = this.config.developer.githubUrl;
      if (devRepo && this.config.developer.repoUrl) devRepo.href = this.config.developer.repoUrl;
      if (devSkills && Array.isArray(this.config.developer.skills)) {
        devSkills.innerHTML = this.config.developer.skills.map(s => 
          `<span class="px-3 py-1 rounded-full bg-purple-50 text-[#7C52AA] text-[11px] font-extrabold border border-purple-100">${s}</span>`
        ).join('');
      }
    }

    // 5. Update Flow Step Titles & Descriptions below phones
    if (Array.isArray(this.config.flowSteps)) {
      this.config.flowSteps.forEach((step, idx) => {
        const titleEl = document.getElementById(`step-title-${idx}`);
        const descEl = document.getElementById(`step-desc-${idx}`);
        if (titleEl && step.title) titleEl.textContent = step.title;
        if (descEl && step.description) descEl.textContent = step.description;
      });

      // Update Phone 2 Budget Matcher defaults
      if (this.config.flowSteps[1] && this.config.flowSteps[1].budgetAmount) {
        const budgetVal = document.getElementById('budget-amount-val');
        const budgetSlider = document.getElementById('interactive-budget-slider');
        if (budgetVal) budgetVal.textContent = '৳ ' + this.config.flowSteps[1].budgetAmount;
        if (budgetSlider) budgetSlider.value = this.config.flowSteps[1].budgetAmount;
      }

      // Update Phone 3 Countdown timer default
      if (this.config.flowSteps[2] && this.config.flowSteps[2].holdTimerStart) {
        const holdTimer = document.getElementById('flow-countdown-timer');
        if (holdTimer) holdTimer.textContent = this.config.flowSteps[2].holdTimerStart;
      }
    }

    // 6. Update Featured Platters in DOM
    const foodContainer = document.getElementById('foodie-deals-container');
    if (foodContainer && Array.isArray(this.config.foodPhotos) && this.config.foodPhotos.length > 0) {
      foodContainer.innerHTML = this.config.foodPhotos.map(item => `
        <div class="snap-start shrink-0 w-[260px] md:w-[280px] rounded-3xl overflow-hidden glass-panel flex flex-col group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
          <div class="h-44 w-full relative overflow-hidden bg-surface-container">
            <img src="${item.src}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-extrabold tracking-wide uppercase shadow-md">
              ${item.tag}
            </span>
            <span class="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-on-surface text-xs font-black shadow">
              ${item.price}
            </span>
          </div>
          <div class="p-4 flex flex-col justify-between flex-1">
            <h4 class="font-headline font-bold text-sm text-on-surface truncate">${item.title}</h4>
            <p class="text-xs text-on-surface-variant font-medium mt-1">Available across top participating Treat partner kitchens.</p>
            <div class="mt-3 pt-2 border-t border-outline-variant/30 flex items-center justify-between">
              <span class="text-[11px] font-bold text-secondary flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">bolt</span> Instant Match
              </span>
              <span class="text-xs font-black text-primary">Explore Platter →</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 7. Update Reviews in DOM
    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer && Array.isArray(this.config.reviews) && this.config.reviews.length > 0) {
      reviewsContainer.innerHTML = this.config.reviews.map(rev => `
        <div class="p-6 rounded-3xl glass-panel flex flex-col justify-between gap-4 transition-transform hover:-translate-y-1">
          <div class="flex items-center gap-1 text-primary">
            ${'<span class="material-symbols-outlined text-[18px]">star</span>'.repeat(rev.rating || 5)}
          </div>
          <p class="text-xs md:text-sm text-on-surface-variant font-medium leading-relaxed italic">
            "${rev.comment}"
          </p>
          <div class="flex items-center gap-3 pt-3 border-t border-outline-variant/30">
            <div class="w-9 h-9 rounded-full overflow-hidden bg-surface-container shrink-0 border border-primary/20">
              <img src="${rev.avatar}" alt="${rev.name}" class="w-full h-full object-cover">
            </div>
            <div>
              <h5 class="font-headline font-bold text-xs text-on-surface leading-tight">${rev.name}</h5>
              <span class="text-[10px] text-on-surface-variant font-medium">${rev.role}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

if (typeof window !== 'undefined') {
  window.TreatAdminPanel = TreatAdminPanel;
}
