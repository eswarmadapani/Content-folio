const revealEls = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revObs.observe(el));

function animCount(el, target, fmt, dur) {
  let v = 0;
  const step = target / (dur / 16);
  const t = setInterval(() => {
    v = Math.min(v + step, target);
    el.textContent = fmt(v);
    if (v >= target) clearInterval(t);
  }, 16);
}

const countered = { done: false };
const cObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !countered.done) {
      countered.done = true;
      const followersEl = document.getElementById('followers');
      if (followersEl) animCount(followersEl, 13000, v => v >= 1000 ? (v/1000).toFixed(1)+'K+' : Math.floor(v)+'', 1800);
    }
  });
}, { threshold: 0.1 });
const ic = document.querySelector('.insta-card');
if (ic) cObs.observe(ic);

/* ─── CONTACT WAVES ─── */
class Grad {
  constructor(x, y, z) {
    this.x = x; this.y = y; this.z = z;
  }
  dot2(x, y) {
    return this.x * x + this.y * y;
  }
}

class Noise {
  constructor(seed = 0) {
    this.grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0), new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1), new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];
    this.p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];
    this.perm = new Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }
  seed(seed) {
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;
    for (let i = 0; i < 256; i++) {
      let v = i & 1 ? this.p[i] ^ (seed & 255) : this.p[i] ^ ((seed >> 8) & 255);
      this.perm[i] = this.perm[i + 256] = v;
      this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
    }
  }
  fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(a, b, t) { return (1 - t) * a + t * b; }
  perlin2(x, y) {
    let X = Math.floor(x), Y = Math.floor(y);
    x -= X; y -= Y; X &= 255; Y &= 255;
    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
    const u = this.fade(x);
    return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
  }
}

function initWaves() {
  const canvas = document.getElementById("waves-canvas");
  const container = document.getElementById("contact");
  if (!canvas || !container) return;

  const ctx = canvas.getContext("2d");
  const noise = new Noise(Math.random());
  let lines = [];
  let mouse = { x: -1000, y: -1000, sx: 0, sy: 0, lx: 0, ly: 0, v: 0, vs: 0, a: 0, set: false };
  
  const config = {
    lineColor: "rgba(201, 168, 76, 0.25)",
    waveSpeedX: 0.0125,
    waveSpeedY: 0.005,
    waveAmpX: 32,
    waveAmpY: 16,
    xGap: 12,
    yGap: 36,
    friction: 0.925,
    tension: 0.005,
    maxCursorMove: 100
  };

  function setSize() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function setLines() {
    lines = [];
    const { width, height } = canvas;
    const totalLines = Math.ceil((width + 200) / config.xGap);
    const totalPoints = Math.ceil((height + 30) / config.yGap);
    const xStart = (width - config.xGap * totalLines) / 2;
    const yStart = (height - config.yGap * totalPoints) / 2;

    for (let i = 0; i <= totalLines; i++) {
      const pts = [];
      for (let j = 0; j <= totalPoints; j++) {
        pts.push({ x: xStart + config.xGap * i, y: yStart + config.yGap * j, wave: { x: 0, y: 0 }, cursor: { x: 0, y: 0, vx: 0, vy: 0 } });
      }
      lines.push(pts);
    }
  }

  function tick(t) {
    mouse.sx += (mouse.x - mouse.sx) * 0.1;
    mouse.sy += (mouse.y - mouse.sy) * 0.1;
    const dx = mouse.x - mouse.lx, dy = mouse.y - mouse.ly;
    const d = Math.hypot(dx, dy);
    mouse.v = d;
    mouse.vs += (d - mouse.vs) * 0.1;
    mouse.vs = Math.min(100, mouse.vs);
    mouse.lx = mouse.x;
    mouse.ly = mouse.y;
    mouse.a = Math.atan2(dy, dx);

    lines.forEach(pts => {
      pts.forEach(p => {
        const move = noise.perlin2((p.x + t * config.waveSpeedX) * 0.002, (p.y + t * config.waveSpeedY) * 0.0015) * 12;
        p.wave.x = Math.cos(move) * config.waveAmpX;
        p.wave.y = Math.sin(move) * config.waveAmpY;
        
        const pdx = p.x - mouse.sx, pdy = p.y - mouse.sy;
        const dist = Math.hypot(pdx, pdy);
        const l = Math.max(175, mouse.vs);
        if (dist < l) {
          const s = 1 - dist / l;
          const f = Math.cos(dist * 0.001) * s;
          p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * 0.00065;
          p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * 0.00065;
        }
        p.cursor.vx += (0 - p.cursor.x) * config.tension;
        p.cursor.vy += (0 - p.cursor.y) * config.tension;
        p.cursor.vx *= config.friction;
        p.cursor.vy *= config.friction;
        p.cursor.x += p.cursor.vx * 2;
        p.cursor.y += p.cursor.vy * 2;
        p.cursor.x = Math.min(config.maxCursorMove, Math.max(-config.maxCursorMove, p.cursor.x));
        p.cursor.y = Math.min(config.maxCursorMove, Math.max(-config.maxCursorMove, p.cursor.y));
      });
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = config.lineColor;
    lines.forEach(points => {
      let moved0 = { x: points[0].x + points[0].wave.x + points[0].cursor.x, y: points[0].y + points[0].wave.y + points[0].cursor.y };
      ctx.moveTo(moved0.x, moved0.y);
      points.forEach((p, idx) => {
        const isLast = idx === points.length - 1;
        const px = p.x + p.wave.x + (!isLast ? p.cursor.x : 0);
        const py = p.y + p.wave.y + (!isLast ? p.cursor.y : 0);
        ctx.lineTo(px, py);
      });
    });
    ctx.stroke();
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", () => { setSize(); setLines(); });
  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    if (!mouse.set) { mouse.sx = mouse.x; mouse.sy = mouse.y; mouse.lx = mouse.x; mouse.ly = mouse.y; mouse.set = true; }
  });

  setSize();
  setLines();
  requestAnimationFrame(tick);
}


initWaves();

/* ─── MOBILE MENU ─── */
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "auto";
  });

  // Close menu on link click
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });
}

