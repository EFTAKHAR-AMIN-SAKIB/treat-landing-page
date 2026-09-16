/**
 * Treat Landing Page - 3D Android Mobile Phone Engine
 * Realistic WebGL 3D Model with PBR Materials, Dynamic Screen Canvas, Orbit Controls, and Parallax
 */

class TreatPhone3D {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    this.options = Object.assign({
      autoRotate: true,
      autoRotateSpeed: 0.6,
      phoneColor: 'pink', // 'pink', 'purple', 'black', 'silver'
      enableParallax: true,
      onReady: null
    }, options);

    // State
    this.currentScreenImg = null;
    this.nextScreenImg = null;
    this.fadeProgress = 1.0; // 1 = fully currentScreenImg
    this.isTransitioning = false;
    this.transitionDuration = 400; // ms
    this.transitionStartTime = 0;

    // Mouse & Touch Interaction
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.targetRotation = { x: 0.12, y: -0.35 };
    this.currentRotation = { x: 0.12, y: -0.35 };
    this.mouseParallax = { x: 0, y: 0 };
    this.targetParallax = { x: 0, y: 0 };

    // Preset camera angles
    this.presets = {
      front: { x: 0, y: 0 },
      isometric: { x: 0.16, y: -0.42 },
      angled: { x: 0.08, y: 0.52 },
      back: { x: 0.05, y: Math.PI }
    };

    // Color definitions
    this.colorPalettes = {
      pink: {
        chassis: 0xE040A0,
        back: 0xFA4B9D,
        accent: 0xFF85C5,
        metalness: 0.85,
        roughness: 0.22
      },
      purple: {
        chassis: 0x7C52AA,
        back: 0x683E96,
        accent: 0xB58EE5,
        metalness: 0.82,
        roughness: 0.25
      },
      black: {
        chassis: 0x18151D,
        back: 0x221E29,
        accent: 0x4A4356,
        metalness: 0.90,
        roughness: 0.30
      },
      silver: {
        chassis: 0xE8ECF2,
        back: 0xF5F7FA,
        accent: 0xFFFFFF,
        metalness: 0.92,
        roughness: 0.18
      }
    };

    this.init();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Camera setup
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 16.8);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting setup
    this.setupLighting();

    // 5. Screen Canvas Texture setup
    this.setupScreenCanvas();

    // 6. Build 3D Phone Geometry & Hierarchy
    this.buildPhoneModel();

    // 7. Event listeners
    this.setupEvents();

    // 8. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    if (typeof this.options.onReady === 'function') {
      this.options.onReady(this);
    }
  }

  setupLighting() {
    // Ambient soft fill
    const ambientLight = new THREE.AmbientLight(0xFFF0FA, 1.2);
    this.scene.add(ambientLight);

    // Key front light
    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.2);
    keyLight.position.set(6, 8, 12);
    this.scene.add(keyLight);

    // Cool cyan/soft fill light on opposite side
    const fillLight = new THREE.DirectionalLight(0xC8EAFF, 1.4);
    fillLight.position.set(-8, -4, 8);
    this.scene.add(fillLight);

    // Candy pink rim light for edge luster
    const rimPink = new THREE.DirectionalLight(0xE040A0, 2.0);
    rimPink.position.set(0, 10, -8);
    this.scene.add(rimPink);

    // Funky violet rim light for backplate sheen
    const rimPurple = new THREE.PointLight(0x7C52AA, 2.5, 30);
    rimPurple.position.set(0, -6, -10);
    this.scene.add(rimPurple);
  }

  setupScreenCanvas() {
    // High-resolution screen canvas (390 x 844 * 2)
    this.canvasW = 780;
    this.canvasH = 1688;
    this.screenCanvas = document.createElement('canvas');
    this.screenCanvas.width = this.canvasW;
    this.screenCanvas.height = this.canvasH;
    this.screenCtx = this.screenCanvas.getContext('2d');

    // Create Three.js dynamic canvas texture
    this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTexture.generateMipmaps = true;
    this.screenTexture.minFilter = THREE.LinearMipmapLinearFilter;
    this.screenTexture.magFilter = THREE.LinearFilter;

    // Draw initial placeholder
    this.renderScreenToCanvas();
  }

  buildPhoneModel() {
    this.phoneGroup = new THREE.Group();

    // Dimensions for modern Android flagship
    const width = 3.65;
    const height = 7.90;
    const depth = 0.38;
    const radius = 0.44;

    // Color theme
    const palette = this.colorPalettes[this.options.phoneColor] || this.colorPalettes.pink;

    // 1. Phone Frame & Chassis (Extruded Rounded Rectangle)
    const frameShape = this.createRoundedRectShape(width, height, radius);
    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    };

    const frameGeom = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
    // Center geometry origin
    frameGeom.center();

    this.frameMaterial = new THREE.MeshStandardMaterial({
      color: palette.chassis,
      metalness: palette.metalness,
      roughness: palette.roughness,
      envMapIntensity: 1.2
    });

    this.frameMesh = new THREE.Mesh(frameGeom, this.frameMaterial);
    this.phoneGroup.add(this.frameMesh);

    // 2. Back Cover Plate
    const backShape = this.createRoundedRectShape(width - 0.04, height - 0.04, radius - 0.02);
    const backGeom = new THREE.ShapeGeometry(backShape);
    backGeom.center();

    this.backMaterial = new THREE.MeshPhysicalMaterial({
      color: palette.back,
      metalness: 0.15,
      roughness: 0.18,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9
    });

    const backMesh = new THREE.Mesh(backGeom, this.backMaterial);
    backMesh.position.z = -depth / 2 - 0.051;
    backMesh.rotation.y = Math.PI; // Face outwards to rear
    this.phoneGroup.add(backMesh);

    // Treat Logo on Rear Backplate
    this.createRearBrandLogo(backMesh);

    // Rear Camera Island
    this.createRearCameraBump();

    // 3. Screen Bezel (ultra-thin black border)
    const bezelShape = this.createRoundedRectShape(width - 0.06, height - 0.06, radius - 0.03);
    const bezelGeom = new THREE.ShapeGeometry(bezelShape);
    bezelGeom.center();
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x07060A });
    const bezelMesh = new THREE.Mesh(bezelGeom, bezelMat);
    bezelMesh.position.z = depth / 2 + 0.051;
    this.phoneGroup.add(bezelMesh);

    // 4. Active Display Screen (Canvas Texture)
    const screenW = width - 0.18;
    const screenH = height - 0.18;
    const screenRadius = radius - 0.08;
    const screenShape = this.createRoundedRectShape(screenW, screenH, screenRadius);
    const screenGeom = new THREE.ShapeGeometry(screenShape);
    screenGeom.center();

    // Compute UVs for the ShapeGeometry to map the texture accurately
    this.computeShapeUVs(screenGeom, screenW, screenH);

    this.screenMaterial = new THREE.MeshBasicMaterial({
      map: this.screenTexture,
      toneMapped: false
    });

    this.screenMesh = new THREE.Mesh(screenGeom, this.screenMaterial);
    this.screenMesh.position.z = depth / 2 + 0.054;
    this.phoneGroup.add(this.screenMesh);

    // 5. Front Camera Punch-hole Lens (Centered at top)
    const punchHoleGeom = new THREE.CircleGeometry(0.06, 32);
    const punchHoleMat = new THREE.MeshPhysicalMaterial({
      color: 0x050810,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0
    });
    const punchHole = new THREE.Mesh(punchHoleGeom, punchHoleMat);
    punchHole.position.set(0, height / 2 - 0.32, depth / 2 + 0.056);
    this.phoneGroup.add(punchHole);

    // Tiny optical glint inside camera
    const glintGeom = new THREE.CircleGeometry(0.015, 16);
    const glintMat = new THREE.MeshBasicMaterial({ color: 0x40C0EE });
    const glint = new THREE.Mesh(glintGeom, glintMat);
    glint.position.set(0.02, height / 2 - 0.30, depth / 2 + 0.057);
    this.phoneGroup.add(glint);

    // 6. Side Hardware Buttons
    this.createSideButtons(width, height, depth);

    // 7. Ground Soft Shadow Plane
    this.createGroundShadow(height);

    // Add phone group to scene
    this.scene.add(this.phoneGroup);
  }

  createRoundedRectShape(w, h, r) {
    const shape = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    return shape;
  }

  computeShapeUVs(geom, width, height) {
    const pos = geom.attributes.position;
    const uvs = [];
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const u = (x + width / 2) / width;
      const v = (y + height / 2) / height;
      uvs.push(u, v);
    }
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  }

  createRearBrandLogo(backMesh) {
    // Subtle Treat badge plate in center rear
    const badgeW = 1.0;
    const badgeH = 0.35;
    const badgeGeom = new THREE.PlaneGeometry(badgeW, badgeH);

    // Canvas to draw stylized Treat logo
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 400;
    logoCanvas.height = 140;
    const ctx = logoCanvas.getContext('2d');
    ctx.clearRect(0, 0, 400, 140);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '900 68px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '-2px';
    ctx.fillText('treat ✨', 200, 70);

    const logoTexture = new THREE.CanvasTexture(logoCanvas);
    const logoMat = new THREE.MeshBasicMaterial({
      map: logoTexture,
      transparent: true,
      opacity: 0.7
    });

    const logoMesh = new THREE.Mesh(badgeGeom, logoMat);
    logoMesh.position.set(0, -0.6, 0.005);
    backMesh.add(logoMesh);
  }

  createRearCameraBump() {
    const bumpW = 1.15;
    const bumpH = 2.45;
    const bumpR = 0.22;
    const bumpD = 0.12;

    const bumpShape = this.createRoundedRectShape(bumpW, bumpH, bumpR);
    const bumpGeom = new THREE.ExtrudeGeometry(bumpShape, {
      depth: bumpD,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.03,
      bevelThickness: 0.03
    });
    bumpGeom.center();

    const bumpMat = new THREE.MeshStandardMaterial({
      color: 0x1A1422,
      metalness: 0.85,
      roughness: 0.2
    });

    const bumpMesh = new THREE.Mesh(bumpGeom, bumpMat);
    // Position on upper-left rear (viewed from back, x is negative)
    bumpMesh.position.set(-1.0, 2.2, -0.38 / 2 - 0.05 - bumpD / 2);
    bumpMesh.rotation.y = Math.PI;

    // 3 Camera Lenses
    const lensGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.04, 32);
    const lensRingMat = new THREE.MeshStandardMaterial({
      color: 0x7C52AA,
      metalness: 0.9,
      roughness: 0.15
    });
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x050A18,
      metalness: 0.8,
      roughness: 0.05,
      clearcoat: 1.0
    });

    const lensYPositions = [0.65, 0.0, -0.65];
    lensYPositions.forEach(yPos => {
      const ringMesh = new THREE.Mesh(lensGeom, lensRingMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set(0, yPos, bumpD / 2 + 0.02);

      const glassGeom = new THREE.CircleGeometry(0.18, 32);
      const glassMesh = new THREE.Mesh(glassGeom, lensGlassMat);
      glassMesh.position.set(0, yPos, bumpD / 2 + 0.041);

      bumpMesh.add(ringMesh);
      bumpMesh.add(glassMesh);
    });

    // Dual-tone LED Flash
    const flashGeom = new THREE.CircleGeometry(0.1, 24);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xFFF0B8 });
    const flashMesh = new THREE.Mesh(flashGeom, flashMat);
    flashMesh.position.set(0.38, 0.65, bumpD / 2 + 0.02);
    bumpMesh.add(flashMesh);

    this.phoneGroup.add(bumpMesh);
  }

  createSideButtons(w, h, d) {
    const btnMat = new THREE.MeshStandardMaterial({
      color: 0xE040A0,
      metalness: 0.85,
      roughness: 0.2
    });

    // Power Button on Right
    const powerGeom = new THREE.BoxGeometry(0.04, 0.65, 0.12);
    const powerMesh = new THREE.Mesh(powerGeom, btnMat);
    powerMesh.position.set(w / 2 + 0.06, 0.8, 0);
    this.phoneGroup.add(powerMesh);

    // Volume Rocker on Right
    const volumeGeom = new THREE.BoxGeometry(0.04, 1.25, 0.12);
    const volumeMesh = new THREE.Mesh(volumeGeom, btnMat);
    volumeMesh.position.set(w / 2 + 0.06, 1.9, 0);
    this.phoneGroup.add(volumeMesh);
  }

  createGroundShadow(phoneH) {
    // Soft radial ground shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(46, 26, 40, 0.45)');
    grad.addColorStop(0.4, 'rgba(124, 82, 170, 0.22)');
    grad.addColorStop(0.7, 'rgba(224, 64, 160, 0.08)');
    grad.addColorStop(1, 'rgba(254, 247, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeom = new THREE.PlaneGeometry(5.2, 5.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false
    });

    this.groundShadow = new THREE.Mesh(shadowGeom, shadowMat);
    this.groundShadow.rotation.x = -Math.PI / 2;
    this.groundShadow.position.y = -phoneH / 2 - 0.75;
    this.scene.add(this.groundShadow);
  }

  setPhoneColor(colorKey) {
    const palette = this.colorPalettes[colorKey];
    if (!palette) return;

    this.options.phoneColor = colorKey;

    if (this.frameMaterial) {
      this.frameMaterial.color.setHex(palette.chassis);
      this.frameMaterial.metalness = palette.metalness;
      this.frameMaterial.roughness = palette.roughness;
      this.frameMaterial.needsUpdate = true;
    }

    if (this.backMaterial) {
      this.backMaterial.color.setHex(palette.back);
      this.backMaterial.needsUpdate = true;
    }
  }

  setCameraAngle(presetKey) {
    const preset = this.presets[presetKey];
    if (preset) {
      this.targetRotation.x = preset.x;
      this.targetRotation.y = preset.y;
      this.options.autoRotate = false; // pause spin on intentional preset click
    }
  }

  toggleAutoRotate(enable) {
    if (typeof enable === 'boolean') {
      this.options.autoRotate = enable;
    } else {
      this.options.autoRotate = !this.options.autoRotate;
    }
    return this.options.autoRotate;
  }

  // --- Screen Texture Rendering & Transitions ---

  setScreenImage(imageSource) {
    if (!imageSource) return;

    if (typeof imageSource === 'string') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.transitionToImage(img);
      };
      img.onerror = () => {
        console.warn(`Failed to load screen image: ${imageSource}`);
      };
      img.src = imageSource;
    } else if (imageSource instanceof HTMLImageElement) {
      this.transitionToImage(imageSource);
    }
  }

  transitionToImage(newImg) {
    if (!this.currentScreenImg) {
      this.currentScreenImg = newImg;
      this.fadeProgress = 1.0;
      this.renderScreenToCanvas();
      return;
    }

    this.nextScreenImg = newImg;
    this.fadeProgress = 0.0;
    this.isTransitioning = true;
    this.transitionStartTime = performance.now();
  }

  renderScreenToCanvas() {
    const ctx = this.screenCtx;
    const w = this.canvasW;
    const h = this.canvasH;

    ctx.clearRect(0, 0, w, h);

    // Background base
    ctx.fillStyle = '#FEF7FF';
    ctx.fillRect(0, 0, w, h);

    // Draw images
    if (this.currentScreenImg && this.currentScreenImg.complete) {
      ctx.globalAlpha = 1.0;
      this.drawImageScaled(ctx, this.currentScreenImg, w, h);
    }

    if (this.nextScreenImg && this.nextScreenImg.complete && this.fadeProgress < 1.0) {
      ctx.globalAlpha = this.fadeProgress;
      this.drawImageScaled(ctx, this.nextScreenImg, w, h);
      ctx.globalAlpha = 1.0;
    }

    // Top Android Status Bar Overlay
    this.drawAndroidStatusBar(ctx, w);

    // Bottom Gesture Navigation Pill
    this.drawAndroidGesturePill(ctx, w, h);

    if (this.screenTexture) {
      this.screenTexture.needsUpdate = true;
    }
  }

  drawImageScaled(ctx, img, cw, ch) {
    const nw = img.naturalWidth || img.width;
    const nh = img.naturalHeight || img.height;
    if (!nw || !nh) return;

    // Crop or fit into mobile viewport (390:844 aspect)
    // Scale to fill width exactly, align top
    const scale = cw / nw;
    const renderW = cw;
    const renderH = nh * scale;

    ctx.drawImage(img, 0, 0, renderW, renderH);
  }

  drawAndroidStatusBar(ctx, w) {
    ctx.save();
    ctx.fillStyle = 'rgba(46, 26, 40, 0.85)';
    ctx.font = '700 24px "DM Sans", sans-serif';
    ctx.textBaseline = 'middle';

    // Current Time
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const timeStr = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    ctx.fillText(timeStr, 48, 52);

    // Status Icons on Right (5G, WiFi, Battery)
    ctx.textAlign = 'right';
    ctx.font = '600 20px "DM Sans", sans-serif';
    ctx.fillText('5G', w - 145, 52);

    // WiFi icon glyph representation
    ctx.beginPath();
    ctx.arc(w - 110, 52, 9, Math.PI * 1.2, Math.PI * 1.8);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(46, 26, 40, 0.85)';
    ctx.stroke();

    // Battery pill
    ctx.strokeStyle = 'rgba(46, 26, 40, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(w - 82, 42, 36, 20);
    ctx.fillStyle = '#00A86B'; // green battery
    ctx.fillRect(w - 80, 44, 28, 16);
    // Battery tip
    ctx.fillStyle = 'rgba(46, 26, 40, 0.85)';
    ctx.fillRect(w - 46, 47, 3, 10);

    ctx.restore();
  }

  drawAndroidGesturePill(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = 'rgba(46, 26, 40, 0.4)';
    const pillW = 160;
    const pillH = 6;
    const pillX = (w - pillW) / 2;
    const pillY = h - 22;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 4);
    ctx.fill();
    ctx.restore();
  }

  // --- Interaction & Events ---

  setupEvents() {
    const el = this.container;

    // Mouse drag rotation
    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.options.autoRotate = false;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      // Parallax effect when not dragging
      if (this.options.enableParallax && !this.isDragging) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const normX = (e.clientX - centerX) / (window.innerWidth / 2);
        const normY = (e.clientY - centerY) / (window.innerHeight / 2);
        this.targetParallax.x = THREE.MathUtils.clamp(normY * 0.14, -0.2, 0.2);
        this.targetParallax.y = THREE.MathUtils.clamp(normX * 0.22, -0.3, 0.3);
      }

      if (!this.isDragging) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * 0.007;
      this.targetRotation.x += deltaY * 0.007;

      // Limit pitch to prevent upside down
      this.targetRotation.x = THREE.MathUtils.clamp(this.targetRotation.x, -0.6, 0.6);

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch events for mobile devices
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.options.autoRotate = false;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.targetRotation.y += deltaX * 0.008;
      this.targetRotation.x += deltaY * 0.008;
      this.targetRotation.x = THREE.MathUtils.clamp(this.targetRotation.x, -0.6, 0.6);

      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Resize handling
    window.addEventListener('resize', () => {
      if (!this.container) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }

  // --- Main Animation Loop ---

  animate(time) {
    requestAnimationFrame(this.animate);

    // Screen Crossfade transition update
    if (this.isTransitioning) {
      const elapsed = time - this.transitionStartTime;
      this.fadeProgress = Math.min(elapsed / this.transitionDuration, 1.0);
      this.renderScreenToCanvas();

      if (this.fadeProgress >= 1.0) {
        this.isTransitioning = false;
        this.currentScreenImg = this.nextScreenImg;
        this.nextScreenImg = null;
        this.renderScreenToCanvas();
      }
    }

    // Auto-rotation when enabled
    if (this.options.autoRotate && !this.isDragging) {
      this.targetRotation.y += 0.0035 * this.options.autoRotateSpeed;
    }

    // Smooth inertia interpolation
    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;

    // Parallax interpolation
    this.mouseParallax.x += (this.targetParallax.x - this.mouseParallax.x) * 0.05;
    this.mouseParallax.y += (this.targetParallax.y - this.mouseParallax.y) * 0.05;

    if (this.phoneGroup) {
      this.phoneGroup.rotation.x = this.currentRotation.x + this.mouseParallax.x;
      this.phoneGroup.rotation.y = this.currentRotation.y + this.mouseParallax.y;

      // Gentle floating bob
      const bob = Math.sin(time * 0.0018) * 0.08;
      this.phoneGroup.position.y = bob;

      // Scale ground shadow slightly with bob
      if (this.groundShadow) {
        const shadowScale = 1.0 - bob * 0.5;
        this.groundShadow.scale.set(shadowScale, shadowScale, 1.0);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

if (typeof window !== 'undefined') {
  window.TreatPhone3D = TreatPhone3D;
}
