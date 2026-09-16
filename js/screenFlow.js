/**
 * Treat Landing Page - 4-Phone Flow & Parallax Controller
 * Manages step synchronization, ambient wave floating motion, 3D mouse tilt,
 * automated workflow tour, and in-phone screen scrolling motion.
 */

class TreatScreenFlow {
  constructor(options = {}) {
    this.options = Object.assign({
      steps: [],
      autoTour: true,
      tourIntervalMs: 4200
    }, options);

    this.steps = (this.options.steps && this.options.steps.length >= 4)
      ? this.options.steps
      : (window.TREAT_DEFAULT_DATA ? window.TREAT_DEFAULT_DATA.flowSteps : []);

    this.activeStepIdx = 0;
    this.phoneCards = [];
    this.stepColumns = [];
    this.tourTimer = null;
    this.isPaused = false;

    this.init();
  }

  init() {
    this.cacheDomElements();
    this.renderFlowContent();
    this.bindParallaxAndHover();

    // Start on step 0 and start auto-motion tour
    this.focusStep(0);

    if (this.options.autoTour) {
      this.startMotionTour();
    }
  }

  cacheDomElements() {
    this.phoneCards = [
      document.getElementById('phone-card-0'),
      document.getElementById('phone-card-1'),
      document.getElementById('phone-card-2'),
      document.getElementById('phone-card-3')
    ].filter(Boolean);

    this.stepColumns = Array.from(document.querySelectorAll('.flow-step-column'));
    this.flowContainer = document.querySelector('.flow-showcase-container');
  }

  setSteps(newSteps) {
    if (!Array.isArray(newSteps) || newSteps.length < 4) return;
    this.steps = newSteps;
    this.renderFlowContent();
    this.focusStep(this.activeStepIdx);
  }

  renderFlowContent() {
    this.steps.slice(0, 4).forEach((step, idx) => {
      // 1. Update Top Step Column
      const iconEl = document.getElementById(`step-icon-${idx}`);
      const titleEl = document.getElementById(`step-title-${idx}`);
      const descEl = document.getElementById(`step-desc-${idx}`);

      if (iconEl) iconEl.textContent = step.icon || 'star';
      if (titleEl) titleEl.textContent = step.title || `Step ${idx + 1}`;
      if (descEl) descEl.textContent = step.description || '';

      // 2. Update Phone Screen Mockup Image
      const imgEl = document.getElementById(`phone-img-${idx}`);
      if (imgEl && step.image) {
        imgEl.src = step.image;
        imgEl.alt = step.title || `Screen ${idx + 1}`;
      }
    });
  }

  startMotionTour() {
    this.stopMotionTour();
    this.tourTimer = setInterval(() => {
      if (!this.isPaused) {
        this.activeStepIdx = (this.activeStepIdx + 1) % 4;
        this.focusStep(this.activeStepIdx);
      }
    }, this.options.tourIntervalMs);
  }

  stopMotionTour() {
    if (this.tourTimer) {
      clearInterval(this.tourTimer);
      this.tourTimer = null;
    }
  }

  bindParallaxAndHover() {
    // Pause tour when hovering anywhere over the workflow showcase
    if (this.flowContainer) {
      this.flowContainer.addEventListener('mouseenter', () => {
        this.isPaused = true;
      });
      this.flowContainer.addEventListener('mouseleave', () => {
        this.isPaused = false;
      });
    }

    // 1. Top step column interactions
    this.stepColumns.forEach((col, idx) => {
      col.addEventListener('mouseenter', () => {
        this.isPaused = true;
        this.focusStep(idx);
      });
      col.addEventListener('mouseleave', () => {
        this.isPaused = false;
      });
      col.addEventListener('click', () => {
        this.focusStep(idx);
      });
    });

    // 2. 3D Interactive Mouse Tilt on Each Phone Mockup
    this.phoneCards.forEach((phone, idx) => {
      phone.addEventListener('mouseenter', () => {
        this.isPaused = true;
        this.focusStep(idx);
      });

      phone.addEventListener('click', () => {
        this.focusStep(idx);
      });

      // Mouse move 3D tilt tracking
      phone.addEventListener('mousemove', (e) => {
        const rect = phone.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const baseStagger = this.getBaseStaggerTransform(idx);

        const rotateX = -deltaY * 11; // tilt up/down
        const rotateY = deltaX * 13;  // tilt left/right

        phone.style.transform = `${baseStagger} perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(26px) scale(1.07)`;
      });

      phone.addEventListener('mouseleave', () => {
        this.isPaused = false;
        // Restore active or natural state
        if (this.activeStepIdx === idx) {
          phone.style.transform = '';
        } else {
          phone.style.transform = '';
        }
      });
    });
  }

  getBaseStaggerTransform(idx) {
    switch (idx) {
      case 0: return 'translateY(-24px) rotate(-2.6deg)';
      case 1: return 'translateY(42px) rotate(1.2deg)';
      case 2: return 'translateY(-16px) rotate(-1.0deg)';
      case 3: return 'translateY(54px) rotate(2.8deg)';
      default: return '';
    }
  }

  focusStep(idx) {
    this.activeStepIdx = idx;

    // Update 4 Phones in the Wave
    this.phoneCards.forEach((phone, i) => {
      if (i === idx) {
        phone.classList.add('active-flow');
      } else {
        phone.classList.remove('active-flow');
      }
    });

    // Update 4 Step Column Headers
    this.stepColumns.forEach((col, i) => {
      if (i === idx) {
        col.classList.add('active-step');
      } else {
        col.classList.remove('active-step');
      }
    });
  }
}

if (typeof window !== 'undefined') {
  window.TreatScreenFlow = TreatScreenFlow;
}
