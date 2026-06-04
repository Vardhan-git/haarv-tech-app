// TIME-BASED GREETING
const gs = [
  { h: [0,  5],  i: '🌙', t: 'Still up?\nNight owls code the best.' },
  { h: [5,  9],  i: '☀️', t: 'Good morning.\nFresh mind, clean code.' },
  { h: [9,  12], i: '🍵', t: 'Mid-morning grind.\nYou\'re on a roll.' },
  { h: [12, 13], i: '🌤️', t: 'Lunchtime learning\nhits different.' },
  { h: [13, 16], i: '⚡', t: 'Afternoon focus mode.\nLet\'s build.' },
  { h: [16, 18], i: '🎯', t: 'Golden hour.\nBest time to master something.' },
  { h: [18, 21], i: '🌆', t: 'Evening session.\nConsistency is everything.' },
  { h: [21, 24], i: '🌙', t: 'Night quizzes\nbefore you sleep.' },
];

const hr = new Date().getHours();
const g  = gs.find(x => hr >= x.h[0] && hr < x.h[1]) || gs[0];
document.getElementById('gi').textContent = g.i;

// split on \n to create two lines
const lines = g.t.split('\n');
const gtEl  = document.getElementById('gt');
gtEl.innerHTML = lines.map((l, i) =>
  `<span style="display:block;${i === 1 ?
    'background:linear-gradient(135deg,#7c6fff,#2563eb,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;' :
    'color:#000;'
  }">${l}</span>`
).join('');

// CANVAS — PREMIUM BACKGROUND
const cv = document.getElementById('c');
const cx = cv.getContext('2d');

function rs() {
  cv.width  = window.innerWidth;
  cv.height = window.innerHeight;
}
rs();
window.addEventListener('resize', rs);

let t = 0;

// aurora orbs
const orbs = [
  { x: .15, y: .2,  r: 500, h: 250, s: .7  },
  { x: .85, y: .15, r: 450, h: 220, s: .65 },
  { x: .5,  y: .85, r: 480, h: 270, s: .6  },
  { x: .2,  y: .75, r: 380, h: 200, s: .55 },
  { x: .8,  y: .55, r: 420, h: 190, s: .6  },
];

// dots
const dots = [];
for (let i = 0; i < 60; i++) {
  dots.push({
    x:   Math.random() * window.innerWidth,
    y:   Math.random() * window.innerHeight,
    r:   Math.random() * 1.5 + .4,
    op:  Math.random() * .1  + .03,
    vx:  (Math.random() - .5) * .3,
    vy:  (Math.random() - .5) * .3,
    col: Math.random() > .5 ? '124,111,255' : '37,99,235'
  });
}

function frame() {
  cx.clearRect(0, 0, cv.width, cv.height);
  t += .005;

  // aurora orbs
  orbs.forEach((o, i) => {
    const ox    = (o.x + Math.sin(t * (i + 1) * .25) * .1) * cv.width;
    const oy    = (o.y + Math.cos(t * (i + 1) * .2)  * .08) * cv.height;
    const alpha = .08 + Math.sin(t * .5 + i) * .03;
    const grad  = cx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
    grad.addColorStop(0,  `hsla(${o.h},${Math.round(o.s * 100)}%,70%,${alpha})`);
    grad.addColorStop(.5, `hsla(${o.h},${Math.round(o.s * 100)}%,70%,${alpha * .3})`);
    grad.addColorStop(1,  `hsla(${o.h},${Math.round(o.s * 100)}%,70%,0)`);
    cx.fillStyle = grad;
    cx.beginPath();
    cx.arc(ox, oy, o.r, 0, Math.PI * 2);
    cx.fill();
  });

  // faint grid
  cx.strokeStyle = 'rgba(124,111,255,.04)';
  cx.lineWidth   = 1;
  for (let x = 0; x < cv.width;  x += 56) {
    cx.beginPath(); cx.moveTo(x, 0);        cx.lineTo(x, cv.height); cx.stroke();
  }
  for (let y = 0; y < cv.height; y += 56) {
    cx.beginPath(); cx.moveTo(0, y);        cx.lineTo(cv.width, y);  cx.stroke();
  }

  // connections between dots
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        cx.globalAlpha = .07 * (1 - d / 110);
        cx.strokeStyle = '#7c6fff';
        cx.lineWidth   = .5;
        cx.beginPath();
        cx.moveTo(dots[i].x, dots[i].y);
        cx.lineTo(dots[j].x, dots[j].y);
        cx.stroke();
      }
    }
  }

  // dots
  dots.forEach(p => {
    cx.globalAlpha = p.op;
    cx.beginPath();
    cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    cx.fillStyle = `rgba(${p.col},1)`;
    cx.fill();
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0)         p.x = cv.width;
    if (p.x > cv.width)  p.x = 0;
    if (p.y < 0)         p.y = cv.height;
    if (p.y > cv.height) p.y = 0;
  });

  cx.globalAlpha = 1;
  requestAnimationFrame(frame);
}

frame();