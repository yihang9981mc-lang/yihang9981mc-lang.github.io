const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* ================= 烟花 ================= */
class Firework {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height * 0.4;
    this.speed = 5;
    this.exploded = false;
  }
  update() {
    this.y -= this.speed;
    if (this.y <= this.targetY) {
      this.exploded = true;
      for (let i = 0; i < 60; i++) {
        fireParticles.push(new FireParticle(this.x, this.y));
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }
}

class FireParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.5) * 6;
    this.alpha = 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.02;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();
  }
}

/* ================= 文字粒子 ================= */
let textParticles = [];
const texts = [
  "新年快乐",
  "2026",
  "HAPPY NEW YEAR",

  "万事顺意",
  "平安喜乐",
  "阖家幸福",
  "心想事成",
  "前程似锦",
  "一路生花",

  "财源广进",
  "招财进宝",
  "年年有余",
  "富贵常在",

  "身体健康",
  "笑口常开",
  "无忧无虑",

  "学业进步",
  "金榜题名",
  "逢考必过",

  "事业腾飞",
  "步步高升",
  "顺风顺水",

  "好运连连",
  "福气满满",
  "喜乐安康",

  "愿你所求皆如愿",
  "愿你所行皆坦途",
  "愿新年胜旧年",
  "祝各位2026新年快乐"
];

let textIndex = 0;

function createTextParticles(text) {
  textParticles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const fontSize = Math.min(canvas.width / text.length, canvas.height * 0.25);
  ctx.font = `bold ${fontSize}px Microsoft YaHei, Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] > 128) {
        textParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          tx: x,
          ty: y
        });
      }
    }
  }
}

setInterval(() => {
  textIndex = (textIndex + 1) % texts.length;
  createTextParticles(texts[textIndex]);
}, 1900);

/* ================= 主循环 ================= */
let fireworks = [];
let fireParticles = [];

createTextParticles(texts[0]);

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 烟花
  if (Math.random() < 0.04) fireworks.push(new Firework());
  fireworks = fireworks.filter(f => !f.exploded);
  fireworks.forEach(f => { f.update(); f.draw(); });

  fireParticles = fireParticles.filter(p => p.alpha > 0);
  fireParticles.forEach(p => { p.update(); p.draw(); });

  // 文字粒子
  textParticles.forEach(p => {
    p.x += (p.tx - p.x) * 0.08;
    p.y += (p.ty - p.y) * 0.08;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

document.body.addEventListener("click", () => {
  document.getElementById("马超high").play();
});
