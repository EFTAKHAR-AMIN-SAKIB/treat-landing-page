/**
 * Treat Landing Page - Main Orchestrator
 * Coordinates 4-Phone Wave Flow, 3D Interactive Turntable Modal, Admin Studio, and Downloads
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 4-Phone Screen Flow (Parallax, Step Sync, Hover highlights)
  const flow = new TreatScreenFlow();

  // 2. Initialize Admin Studio Panel
  const admin = new TreatAdminPanel(flow);

  window.treatApp = { flow, admin };

  // 3. Setup Download Actions & QR Modal
  setupDownloadActions();

  // 4. Setup Foodie Deals & Testimonials
  setupPerksAndReviews();

  console.log('🍰 Treat 4-Phone Wave Flow initialized successfully!');

  function setupDownloadActions() {
    const flowBtn = document.getElementById('flow-download-btn');
    const apkDirect = document.getElementById('apk-direct-link');
    const qrModal = document.getElementById('qr-code-modal');
    const openQrBtn = document.getElementById('open-qr-modal-btn');
    const closeQrBtn = document.getElementById('close-qr-modal-btn');
    const qrBackdrop = document.getElementById('qr-modal-backdrop');

    const handleDownload = (e) => {
      const target = e.currentTarget.getAttribute('href');
      if (!target || target === '#' || target.startsWith('#')) {
        e.preventDefault();
        triggerDemoApkDownload();
      }
    };

    if (flowBtn) flowBtn.addEventListener('click', handleDownload);
    if (apkDirect) apkDirect.addEventListener('click', handleDownload);

    if (openQrBtn && qrModal) {
      openQrBtn.addEventListener('click', () => {
        qrModal.classList.remove('hidden');
        generateSimpleQrCode();
      });
    }

    const closeQr = () => {
      if (qrModal) qrModal.classList.add('hidden');
    };

    if (closeQrBtn) closeQrBtn.addEventListener('click', closeQr);
    if (qrBackdrop) qrBackdrop.addEventListener('click', closeQr);
  }

  function triggerDemoApkDownload() {
    showToast('🍰 Preparing Treat for Android (v1.0.4)...');
    setTimeout(() => {
      const dummyContent = 'Treat Android APK Release Package - v1.0.4\nEnjoy Funky Foodie Feasts & Squad Deals!';
      const blob = new Blob([dummyContent], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Treat-v1.0.4-release.apk';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('✨ Treat-v1.0.4-release.apk download started!');
    }, 600);
  }

  function showToast(message) {
    let toast = document.getElementById('treat-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'treat-toast';
      toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full bg-on-surface text-white text-xs font-bold shadow-2xl z-[160] transition-all duration-300 opacity-0 pointer-events-none flex items-center gap-2 border border-primary/40';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span class="material-symbols-outlined text-primary text-[18px]">celebration</span><span>${message}</span>`;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');

    setTimeout(() => {
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0', 'pointer-events-none');
    }, 3200);
  }

  function generateSimpleQrCode() {
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#2E1A28';
    const grid = 25;
    const cellSize = size / grid;

    function drawFinder(r, c) {
      ctx.fillStyle = '#2E1A28';
      ctx.fillRect(c * cellSize, r * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect((c + 1) * cellSize, (r + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect((c + 2) * cellSize, (r + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    }

    drawFinder(1, 1);
    drawFinder(1, grid - 8);
    drawFinder(grid - 8, 1);

    let seed = 42;
    function random() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    }

    ctx.fillStyle = '#2E1A28';
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        const inFinder1 = r < 9 && c < 9;
        const inFinder2 = r < 9 && c > grid - 10;
        const inFinder3 = r > grid - 10 && c < 9;
        if (inFinder1 || inFinder2 || inFinder3) continue;

        if (random() > 0.52) {
          ctx.fillRect(c * cellSize + 0.5, r * cellSize + 0.5, cellSize - 1, cellSize - 1);
        }
      }
    }

    const centerSize = cellSize * 5;
    const centerX = (size - centerSize) / 2;
    const centerY = (size - centerSize) / 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(centerX, centerY, centerSize, centerSize);
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, centerSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('treat', size / 2, size / 2);
  }

  function setupPerksAndReviews() {
    const foodContainer = document.getElementById('foodie-deals-container');
    if (foodContainer && window.TREAT_DEFAULT_DATA && Array.isArray(window.TREAT_DEFAULT_DATA.foodPhotos)) {
      foodContainer.innerHTML = window.TREAT_DEFAULT_DATA.foodPhotos.map(item => `
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

    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer && window.TREAT_DEFAULT_DATA && Array.isArray(window.TREAT_DEFAULT_DATA.reviews)) {
      reviewsContainer.innerHTML = window.TREAT_DEFAULT_DATA.reviews.map(rev => `
        <div class="p-6 rounded-3xl glass-panel flex flex-col justify-between gap-4 transition-transform hover:-translate-y-1">
          <div class="flex items-center gap-1 text-primary">
            ${'<span class="material-symbols-outlined text-[18px]">star</span>'.repeat(rev.rating)}
          </div>
          <p class="text-xs md:text-sm text-on-surface font-medium leading-relaxed italic">
            "${rev.comment}"
          </p>
          <div class="flex items-center gap-3 pt-2 border-t border-outline-variant/20">
            <img src="${rev.avatar}" alt="${rev.name}" class="w-10 h-10 rounded-full object-cover ring-2 ring-primary/40">
            <div>
              <h5 class="font-bold text-xs text-on-surface">${rev.name}</h5>
              <span class="text-[11px] text-on-surface-variant font-medium">${rev.role}</span>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
});
