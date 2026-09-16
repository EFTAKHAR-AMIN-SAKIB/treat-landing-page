/**
 * Treat Landing Page - Admin Studio Controller
 * Enables uploading custom mockup images for all 4 phones, editing step titles/descriptions,
 * changing download targets, and exporting/importing JSON backups.
 */

class TreatAdminPanel {
  constructor(screenFlowInstance) {
    this.flow = screenFlowInstance;

    this.storageKey = 'treat_landing_config_v2';
    this.config = this.loadConfig();

    this.activeTab = 'flow'; // 'flow', 'hero', 'downloads', 'backup'

    // DOM Elements
    this.drawer = document.getElementById('admin-studio-drawer');
    this.backdrop = document.getElementById('admin-studio-backdrop');
    this.openBtn = document.getElementById('admin-open-btn');
    this.closeBtn = document.getElementById('admin-close-btn');

    this.init();
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.flowSteps) && parsed.flowSteps.length >= 4) {
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
  }

  bindDrawerEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.open());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    // Keyboard shortcut Ctrl+Shift+A / Cmd+Shift+A
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        this.toggle();
      }
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.drawer && this.drawer.classList.contains('open');
  }

  open() {
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
    if (this.isOpen()) this.close();
    else this.open();
  }

  renderTabs() {
    const tabsContainer = document.getElementById('admin-tabs-nav');
    if (!tabsContainer) return;

    const tabs = [
      { id: 'flow', label: '4 Mockup Phones', icon: 'smartphone' },
      { id: 'hero', label: 'Hero & Vision', icon: 'auto_awesome' },
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
          <label class="block text-xs font-bold text-on-surface mb-1">Catchy Headline</label>
          <input type="text" id="admin-hero-headline" value="${brand.heroHeadline || ''}" class="admin-input font-bold">
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
      alert('Hero captions updated successfully!');
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
      alert('Download CTA updated successfully!');
    });
  }

  // --- TAB 4: BACKUP & CONFIG ---

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
              alert('Configuration imported successfully!');
              this.renderCurrentTab();
            } else {
              alert('Invalid configuration format.');
            }
          } catch (err) {
            alert('Error parsing JSON file: ' + err.message);
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
        alert('Restored Treat defaults!');
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
      heroHeadline.textContent = this.config.brand.heroHeadline;
    }

    const heroCaption = document.getElementById('hero-caption-text');
    if (heroCaption && this.config.brand.heroCaption) {
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
  }
}

if (typeof window !== 'undefined') {
  window.TreatAdminPanel = TreatAdminPanel;
}
