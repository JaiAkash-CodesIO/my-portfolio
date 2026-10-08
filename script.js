/**
 * JAI AKASH K - PORTFOLIO INTERACTION ENGINE
 * Particle Canvas, Dynamic Typing, Interactive CLI Terminal, Project Modals & Toast System
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTypingEffect();
  initScrollSpy();
  initInteractiveTerminal();
  initProjectFiltersAndModals();
  initClipboardAndToasts();
  initContactForm();
  initMobileNav();
  init3DCardTilt();
  setCurrentYear();
});

/* --------------------------------------------------------------------------
   1. INTERACTIVE PARTICLE CANVAS BACKGROUND
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.8 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(138, 43, 226, ';
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   2. DYNAMIC HERO TYPING EFFECT
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'Java & Spring Boot Backends',
    'Real-Time Computer Vision (YOLO & ONNX)',
    'High-Performance FastAPI & Flask APIs',
    'AI / ML Models with Bias Mitigation',
    'Full-Stack MERN & Modern Web Apps'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeLoop() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 45;
    } else {
      typingElement.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at full word
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 350; // Pause before next role
    }

    setTimeout(typeLoop, typingSpeed);
  }

  typeLoop();
}

/* --------------------------------------------------------------------------
   3. SCROLL SPY & PROGRESS INDICATOR
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const progressBar = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active link highlighting
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. 3D CARD TILT INTERACTION
   -------------------------------------------------------------------------- */
function init3DCardTilt() {
  const card = document.getElementById('tech-card');
  if (!card) return;

  const visualWrapper = card.parentElement;

  visualWrapper.addEventListener('mousemove', (e) => {
    const rect = visualWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  visualWrapper.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  });
}

/* --------------------------------------------------------------------------
   5. INTERACTIVE DEVELOPER TERMINAL (CLI PLAYGROUND)
   -------------------------------------------------------------------------- */
function initInteractiveTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const submitBtn = document.getElementById('terminal-submit-btn');
  const quickBtns = document.querySelectorAll('.quick-cmd-btn');

  if (!terminalBody || !terminalInput) return;

  const commandResponses = {
    help: `
      <div class="t-response">
        <strong>Available CLI Commands:</strong><br>
        <span class="t-cmd">whoami</span>       - Profile summary & core identity<br>
        <span class="t-cmd">skills</span>       - Technical competencies & stack matrix<br>
        <span class="t-cmd">projects</span>     - Key engineering projects & ML pipelines<br>
        <span class="t-cmd">experience</span>   - Internships & industry exposure<br>
        <span class="t-cmd">education</span>    - Degree, institution & academic score<br>
        <span class="t-cmd">certs</span>        - Certifications & credentials<br>
        <span class="t-cmd">contact</span>      - Email, phone & direct reach-out options<br>
        <span class="t-cmd">hire</span>         - Why hire Jai Akash K?<br>
        <span class="t-cmd">clear</span>        - Clean terminal screen
      </div>
    `,
    whoami: `
      <div class="t-response">
        <strong>Jai Akash K</strong> | Software Developer & AI/ML Engineer<br>
        🎓 B.E. Computer Science & Eng. @ UCE Tindivanam (CGPA: 8.34/10)<br>
        💼 Software Development Intern @ DIGISAILOR | MERN Intern @ Microsoft-SAP<br>
        📍 Ready for Full-Time Opportunities
      </div>
    `,
    skills: `
      <div class="t-response">
        <strong>⚡ Technical Skill Matrix:</strong><br>
        • <strong>Languages:</strong> Java, Python, SQL, JavaScript (ES6+), C/C++<br>
        • <strong>Backend & APIs:</strong> Spring Boot, FastAPI, Flask, Node.js, Express.js, REST APIs<br>
        • <strong>AI & CV:</strong> YOLOv8, OpenCV, ONNX Runtime, Scikit-Learn, Fairness-AI<br>
        • <strong>Cloud & DevOps:</strong> GCP, Docker (Hub/Compose), Git/GitHub, Linux, Maven<br>
        • <strong>Databases:</strong> MySQL, MongoDB, Firebase
      </div>
    `,
    projects: `
      <div class="t-response">
        <strong>🚀 Featured Projects:</strong><br>
        1. <strong>Loan Fairness Auditor:</strong> End-to-end ML bias detection pipeline reducing demographic bias gap to 11.9% with 86.5% accuracy.<br>
        2. <strong>Real-Time Carton Detection:</strong> Industrial YOLO + ONNX + OpenCV computer vision system streaming live RTSP feeds via FastAPI.<br>
        3. <strong>Spring Boot REST API Engine:</strong> High-performance Java microservice with JWT authentication and MySQL persistence.<br>
        4. <strong>MERN Full-Stack Platform:</strong> Interactive React & Node.js application with MongoDB aggregation.<br>
        5. <strong>VLM Image Captioning & VQA:</strong> Vision-Language application using BLIP and Transformers for dynamic image captioning and Q&A.
      </div>
    `,
    experience: `
      <div class="t-response">
        <strong>💼 Practical Experience:</strong><br>
        • <strong>Software Development Intern @ DIGISAILOR (July 2026):</strong><br>
          - Built AI object detection solutions with Python, YOLO, OpenCV, and ONNX.<br>
          - Deployed real-time RTSP camera streaming dashboard in FastAPI.<br>
        • <strong>MERN Stack Trainee @ Microsoft-SAP (March 2025):</strong><br>
          - Full-stack web application development and RESTful API integration.
      </div>
    `,
    education: `
      <div class="t-response">
        <strong>🎓 Academic Background:</strong><br>
        • <strong>Degree:</strong> Bachelor of Engineering (B.E.) in Computer Science & Engineering<br>
        • <strong>Institution:</strong> University College of Engineering, Tindivanam<br>
        • <strong>Duration:</strong> 2022 — 2026<br>
        • <strong>CGPA:</strong> <strong>8.34 / 10</strong>
      </div>
    `,
    certs: `
      <div class="t-response">
        <strong>🏆 Certifications:</strong><br>
        • Google Gen-AI Certification<br>
        • Programming in Java (NPTEL - Elite Grade)<br>
        • MERN Stack Web Development (Edunet Foundation)<br>
        • Google Data Analytics Professional Certificate
      </div>
    `,
    contact: `
      <div class="t-response">
        <strong>📫 Get in Touch:</strong><br>
        • <strong>Email:</strong> <a href="mailto:jaiakashkarthikeyan@gmail.com" class="text-cyan">jaiakashkarthikeyan@gmail.com</a><br>
        • <strong>Phone:</strong> <a href="tel:+916381849926" class="text-cyan">+91 6381849926</a><br>
        • <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/jai-akash-k" target="_blank" class="text-cyan">linkedin.com/in/jai-akash-k</a><br>
        • <strong>GitHub:</strong> <a href="https://github.com/JaiAkash-CodesIO" target="_blank" class="text-cyan">github.com/JaiAkash-CodesIO</a>
      </div>
    `,
    hire: `
      <div class="t-response">
        <strong>🌟 Why Hire Jai Akash?</strong><br>
        ✓ Solid fundamentals in Java (Spring Boot) and Python (FastAPI/Flask).<br>
        ✓ Practical experience in Computer Vision & ONNX edge model deployments.<br>
        ✓ 8.34 CGPA academic excellence combined with continuous real-world project builds.<br>
        ✓ Fast learner, proactive team collaborator, and eager to drive organizational impact!
      </div>
    `
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Echo command line
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="t-prompt">jai@workstation:~$</span> <span class="t-cmd">${escapeHTML(rawCmd)}</span>`;
    terminalBody.appendChild(cmdLine);

    if (cmd === 'clear' || cmd === 'cls') {
      terminalBody.innerHTML = '';
    } else if (commandResponses[cmd]) {
      const responseLine = document.createElement('div');
      responseLine.innerHTML = commandResponses[cmd];
      terminalBody.appendChild(responseLine);
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'terminal-line text-muted';
      errLine.innerHTML = `zsh: command not found: <span class="text-danger">${escapeHTML(cmd)}</span>. Type <span class="t-highlight">help</span> for a list of commands.`;
      terminalBody.appendChild(errLine);
    }

    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
    terminalInput.value = '';
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    }
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      executeCommand(terminalInput.value);
      terminalInput.focus();
    });
  }

  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd);
      terminalInput.focus();
    });
  });
}

/* --------------------------------------------------------------------------
   6. PROJECT FILTERS & ARCHITECTURE DETAIL MODALS
   -------------------------------------------------------------------------- */
function initProjectFiltersAndModals() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Filtering
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal data
  const projectDetails = {
    'loan-fairness': {
      title: 'Loan Fairness Auditor — Bias Detection & Mitigation',
      category: 'Machine Learning & Ethics in AI',
      body: `
        <p><strong>System Overview:</strong> Automated loan scoring and credit evaluation algorithms often suffer from hidden demographic disparities. The Loan Fairness Auditor is an end-to-end fairness-aware machine learning pipeline engineered to detect and actively mitigate gender and racial bias in financial decision pipelines.</p>
        
        <div class="modal-section-title"><i class="fa-solid fa-network-wired text-cyan"></i> Architecture & Pipeline Flow</div>
        <div class="modal-arch-box">
          [Credit Data Input] ➔ [Demographic Parity & Disparate Impact Audit]<br>
          ➔ [Reweighting / Pre-processing] ➔ [Two-Layer MLP Neural Network]<br>
          ➔ [Post-Processing Equalized Odds Optimization] ➔ [Fair Scoring Output]
        </div>

        <div class="modal-section-title"><i class="fa-solid fa-chart-column text-cyan"></i> Benchmark Metrics</div>
        <table class="modal-metrics-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Baseline Model</th>
              <th>Fairness-Mitigated Model</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Overall Accuracy</td>
              <td>84.2%</td>
              <td><strong class="text-green">86.5% (+2.3%)</strong></td>
            </tr>
            <tr>
              <td>Demographic Bias Gap</td>
              <td>18.8%</td>
              <td><strong class="text-cyan">11.9% (-6.9% reduction)</strong></td>
            </tr>
            <tr>
              <td>Equalized Odds Disparity</td>
              <td>0.24</td>
              <td><strong class="text-cyan">0.09</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="modal-section-title"><i class="fa-solid fa-microchip text-cyan"></i> Technical Highlights</div>
        <ul class="project-highlights">
          <li>Custom multi-stage bias audit covering Disparate Impact, Statistical Parity, and False Positive Rate parity.</li>
          <li>Trained Multi-Layer Perceptron (MLPClassifier) with optimized regularization preventing demographic overfitting.</li>
          <li>Interactive reporting dashboard generating fairness-versus-accuracy Pareto trade-off curves.</li>
        </ul>
      `
    },
    'carton-detection': {
      title: 'Real-Time Carton Detection & RTSP Monitoring System',
      category: 'Computer Vision & Industrial IoT',
      body: `
        <p><strong>System Overview:</strong> Designed for high-speed industrial warehouse logistics and packaging verification, this computer vision solution performs sub-millisecond object detection on continuous RTSP camera streams.</p>
        
        <div class="modal-section-title"><i class="fa-solid fa-video text-cyan"></i> Stream & Inference Pipeline</div>
        <div class="modal-arch-box">
          [RTSP / Live Camera Feed] ➔ [OpenCV Frame Decoder] ➔ [YOLOv8 Feature Extraction]<br>
          ➔ [ONNX Runtime Acceleration] ➔ [FastAPI Async WebSocket Stream] ➔ [Client Canvas HUD]
        </div>

        <div class="modal-section-title"><i class="fa-solid fa-gauge-high text-cyan"></i> Performance Benchmarks</div>
        <table class="modal-metrics-table">
          <thead>
            <tr>
              <th>Execution Target</th>
              <th>mAP@50</th>
              <th>Avg Latency per Frame</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Raw PyTorch Model</td>
              <td>91.4%</td>
              <td>34.2 ms</td>
            </tr>
            <tr>
              <td>ONNX Runtime (CPU)</td>
              <td>91.2%</td>
              <td><strong class="text-green">8.6 ms (4x Speedup)</strong></td>
            </tr>
            <tr>
              <td>ONNX Runtime (CUDA)</td>
              <td>91.2%</td>
              <td><strong class="text-cyan">2.1 ms (Real-time 120 FPS)</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="modal-section-title"><i class="fa-solid fa-layer-group text-cyan"></i> Key Engineering Achievements</div>
        <ul class="project-highlights">
          <li>Curated and annotated over 2,500+ industrial package images under varied lighting and conveyor speeds.</li>
          <li>Engineered FastAPI asynchronous frame streamer delivering live video feeds with minimal latency.</li>
          <li>Sub-millisecond bounding box inference enabled by ONNX FP16 quantization.</li>
        </ul>
      `
    },
    'spring-backend': {
      title: 'Enterprise Spring Boot REST API & Microservice Engine',
      category: 'Enterprise Backend & Distributed Systems',
      body: `
        <p><strong>System Overview:</strong> A robust, enterprise-grade RESTful API backend engineered using Java 17, Spring Boot 3.x, Spring Data JPA, and Docker for scalable cloud deployments.</p>

        <div class="modal-section-title"><i class="fa-solid fa-cubes text-cyan"></i> Layered Architecture</div>
        <div class="modal-arch-box">
          [REST Client] ➔ [Spring Security / JWT Filter] ➔ [Controller Layer]<br>
          ➔ [Service Business Logic & Validation] ➔ [Spring Data JPA Repository] ➔ [MySQL DB]
        </div>

        <div class="modal-section-title"><i class="fa-solid fa-shield-halved text-cyan"></i> Security & Architecture Highlights</div>
        <ul class="project-highlights">
          <li>Stateless JSON Web Token (JWT) authentication flow with refresh tokens and role-based permissions (RBAC).</li>
          <li>Strict DTO mapping using MapStruct and bean validation constraints for reliable input sanitation.</li>
          <li>Full Docker containerization with multi-stage build optimization reducing container size by 65%.</li>
          <li>Comprehensive unit and integration testing coverage with JUnit 5 and Mockito.</li>
        </ul>
      `
    },
    'mern-platform': {
      title: 'Full Stack MERN Dynamic Web Application',
      category: 'Full Stack Web Engineering',
      body: `
        <p><strong>System Overview:</strong> High-performance full-stack web application developed as part of the Microsoft-SAP training program, featuring responsive React components, RESTful Express APIs, and MongoDB document persistence.</p>

        <div class="modal-section-title"><i class="fa-solid fa-laptop-code text-cyan"></i> Architecture Stack</div>
        <div class="modal-arch-box">
          [React.js Single Page App] ➔ [Axios Client] ➔ [Express.js Middleware & Router]<br>
          ➔ [Node.js Async Business Controllers] ➔ [Mongoose ODM] ➔ [MongoDB Atlas Cloud]
        </div>

        <div class="modal-section-title"><i class="fa-solid fa-check-double text-cyan"></i> Implemented Capabilities</div>
        <ul class="project-highlights">
          <li>Custom JWT authentication with password hashing using bcrypt.</li>
          <li>Optimized MongoDB aggregation pipelines for rapid dashboard analytics and complex filtering.</li>
          <li>Modern responsive layout with glassmorphic cards and intuitive user workflows.</li>
        </ul>
      `
    }
  };

  const modalOverlay = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalSecondaryClose = document.getElementById('modal-secondary-close');

  function openModal(projectId) {
    const details = projectDetails[projectId];
    if (!details || !modalOverlay) return;

    modalTitle.textContent = details.title;
    modalCategory.textContent = details.category;
    modalBody.innerHTML = details.body;

    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-modal');
      openModal(projectId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalSecondaryClose) modalSecondaryClose.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   7. CLIPBOARD & TOAST NOTIFICATION SYSTEM
   -------------------------------------------------------------------------- */
function showToast(message, icon = 'fa-circle-check') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHTML(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

function initClipboardAndToasts() {
  document.querySelectorAll('[data-clipboard]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-clipboard');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Copied to clipboard: ${textToCopy}`);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. CONTACT FORM & WEB3FORMS BACKGROUND DISPATCH
   -------------------------------------------------------------------------- */
const WEB3FORMS_ACCESS_KEY = "701148e3-20d4-4dc1-a28c-e047de8486e9";

function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.elements['name']?.value.trim() || '';
    const email = form.elements['email']?.value.trim() || '';
    const subject = form.elements['subject']?.value.trim() || 'Software Engineering Opportunity';
    const message = form.elements['message']?.value.trim() || '';

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'fa-triangle-exclamation');
      return;
    }

    // If access key is configured, send directly in the background via Web3Forms API
    if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== "YOUR_ACCESS_KEY_HERE") {
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Message...</span>';
      }

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: name,
            email: email,
            subject: subject,
            message: message,
            from_name: "Jai Akash Portfolio Website"
          })
        });

        const result = await response.json();

        if (result.success) {
          showToast('Message sent directly to Jai Akash! I will reply soon.', 'fa-circle-check');
          form.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.warn('Web3Forms delivery issue, fallback to mail client:', err);
        showToast('Falling back to email client...', 'fa-paper-plane');
        const bodyContent = `Hello Jai Akash,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        window.location.href = `mailto:jaiakashkarthikeyan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    } else {
      // Direct Web3Forms prompt or fallback to mailto
      showToast('Opening default email client...', 'fa-paper-plane');
      const bodyContent = `Hello Jai Akash,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const mailtoUrl = `mailto:jaiakashkarthikeyan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;
      window.location.href = mailtoUrl;
      form.reset();
    }
  });
}

/* --------------------------------------------------------------------------
   9. MOBILE NAVIGATION TOGGLE
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
  });

  navMenu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
    });
  });
}

/* --------------------------------------------------------------------------
   10. CURRENT YEAR IN FOOTER
   -------------------------------------------------------------------------- */
function setCurrentYear() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* Helper to escape HTML in user inputs */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
