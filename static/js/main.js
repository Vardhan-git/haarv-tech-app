// VANTA BACKGROUND
VANTA.NET({
  el: "body",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  color: 0xc4beff,
  backgroundColor: 0xffffff,
  points: 4.00,
  maxDistance: 18.00,
  spacing: 35.00,
  showDots: false
})

window.addEventListener('load', () => {

  // TIME-BASED GREETING
  const gs = [
    { h: [0,  5],  i: '🌙', t: ['Still up?',            'Night owls code the best.']      },
    { h: [5,  9],  i: '☀️', t: ['Good morning.',         'Fresh mind, clean code.']         },
    { h: [9,  12], i: '🍵', t: ['Mid-morning grind.',    'You\'re on a roll.']              },
    { h: [12, 13], i: '🌤️', t: ['Lunchtime learning',    'hits different.']                 },
    { h: [13, 16], i: '⚡', t: ['Afternoon focus mode.', 'Let\'s build.']                  },
    { h: [16, 18], i: '🎯', t: ['Golden hour.',           'Best time to master something.'] },
    { h: [18, 21], i: '🌆', t: ['Evening session.',       'Consistency is everything.']     },
    { h: [21, 24], i: '🌙', t: ['Night quizzes',          'before you sleep.']              },
  ];

  const hr = new Date().getHours();
  const g  = gs.find(x => hr >= x.h[0] && hr < x.h[1]) || gs[0];

  document.getElementById('gi').textContent = g.i;
  document.getElementById('greetText').innerHTML = `
    <span class="line1">${g.t[0]}</span>
    <span class="line2">${g.t[1]}</span>
  `;

  // SEARCH FUNCTIONALITY
  const searchInput   = document.getElementById('searchInput');
  const answerWrap    = document.getElementById('answerWrap');
  const answerContent = document.getElementById('answerContent');
  const answerStatus  = document.getElementById('answerStatus');
  const sbtn          = document.getElementById('searchBtn');

  async function askQuestion() {
    const question = searchInput.value.trim();
    if (!question) return;

    answerWrap.classList.add('visible');
    answerStatus.textContent = 'Thinking...';
    answerContent.innerHTML  = `
      <div class="dot-pulse">
        <span></span><span></span><span></span>
      </div>`;
    sbtn.disabled = true;

    try {
      const res  = await fetch('/ask', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ question })
      });
      const data = await res.json();

      if (data.answer) {
        answerStatus.textContent  = 'Done';
        answerContent.textContent = data.answer;
      } else {
        answerStatus.textContent  = 'Error';
        answerContent.textContent = 'Something went wrong. Please try again.';
      }
    } catch (err) {
      answerStatus.textContent  = 'Error';
      answerContent.textContent = 'Could not connect. Make sure the server is running.';
    }

    sbtn.disabled = false;
  }

  sbtn.addEventListener('click', askQuestion);
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') askQuestion();
  });

});