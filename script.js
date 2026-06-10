// Smooth logo carousel infinite looping
(function initCarousel() {
  const logoCarousel = document.querySelector(".logo-carousel");
  const logoTrack = document.querySelector(".logo-track");
  
  if (!logoCarousel || !logoTrack) return;

  let currentTranslate = 0;
  const scrollSpeed = 0.4; // pixels per frame
  let isPaused = false;

  // Calculate the width of one complete set (dynamic based on actual items)
  const logoItems = logoTrack.querySelectorAll(".logo-item");
  let itemWidth = 0;
  let totalGap = 0;

  // Measure after items are loaded
  const measureItems = () => {
    if (logoItems.length > 0) {
      itemWidth = logoItems[0].offsetWidth;
      // Gap between items
      const gap = 24;
      // Calculate original set count (total items / 2, since we duplicate for seamless loop)
      const originalSetCount = logoItems.length / 2;
      // Total width of the original set before duplication
      const halfSetWidth = (itemWidth * originalSetCount) + (gap * (originalSetCount - 1));
      return halfSetWidth;
    }
    return 0;
  };

  let halfSetWidth = measureItems();

  function animateCarousel() {
    if (!isPaused) {
      currentTranslate -= scrollSpeed;
      logoTrack.style.transform = `translateX(${currentTranslate}px)`;

      // Reset seamlessly when we've scrolled half the track
      if (halfSetWidth > 0 && Math.abs(currentTranslate) >= halfSetWidth) {
        currentTranslate = 0;
        logoTrack.style.transform = `translateX(0px)`;
      }
    }
    requestAnimationFrame(animateCarousel);
  }

  // Pause on hover
  logoCarousel.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  logoCarousel.addEventListener("mouseleave", () => {
    isPaused = false;
  });

  // Handle window resize - recalculate dimensions
  window.addEventListener("resize", () => {
    halfSetWidth = measureItems();
  });

  // Start with a small delay to ensure DOM is ready
  setTimeout(() => {
    halfSetWidth = measureItems();
    animateCarousel();
  }, 100);
})();

// Particle canvas background animation
(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  let dpr = window.devicePixelRatio || 1;
  let width = window.innerWidth;
  let height = window.innerHeight;

  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // keep particles inside the new bounds
    particles.forEach((p) => {
      if (p.x > width) p.x = Math.random() * width;
      if (p.y > height) p.y = Math.random() * height;
    });
  }

  const particles = [];
  const particleCount = 60;
  const connectionDistance = 180;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.8 + 0.6;
      this.opacity = Math.random() * 0.45 + 0.45;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      this.x = Math.max(0, Math.min(width, this.x));
      this.y = Math.max(0, Math.min(height, this.y));
    }

    draw() {
      ctx.fillStyle = `rgba(96, 165, 250, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticlesArray() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.45;
          ctx.strokeStyle = `rgba(94, 234, 212, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(10, 10, 10, 0.04)";
    ctx.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  // Initialize
  resizeCanvas();
  initParticlesArray();
  animate();
})();
