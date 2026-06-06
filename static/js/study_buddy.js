// LEVEL CONFIGURATION
const levels = {
  highschool: {
    name: 'High School',
    greeting: 'Hey there! 👋 I\'m your Study Buddy. Ask me anything — no question is too simple!',
    welcome: 'Hi! I\'m here to help you understand coding in the simplest way possible. What would you like to learn today?',
    systemPrompt: 'You are a friendly coding tutor for high school students under 18. Use very simple language, fun analogies, and short sentences. Avoid technical jargon. Use emojis occasionally to keep it engaging. Always encourage the student.',
    color: '#f59e0b',
    emoji: '🎒'
  },
  college: {
    name: 'College / University',
    greeting: 'Welcome! 🎓 I\'m your Study Buddy. Let\'s master your coursework together.',
    welcome: 'Hello! I\'m here to help you with Python, SQL, React JS, Power BI and Tableau. What are we working on today?',
    systemPrompt: 'You are a knowledgeable coding tutor for college and university students. Give clear, structured explanations with examples. Use proper technical terms but always explain them. Be encouraging and thorough.',
    color: '#7c6fff',
    emoji: '🎓'
  },
  professional: {
    name: 'Working Professional',
    greeting: 'Good to have you here. 💼 Let\'s get straight to what you need.',
    welcome: 'Welcome. I\'m here to help you upskill efficiently. Ask me anything about Python, SQL, React JS, Power BI or Tableau.',
    systemPrompt: 'You are an expert coding mentor for working professionals. Be concise, technical, and direct. Use industry-standard terminology. Focus on practical, real-world applications. Skip basic explanations unless asked.',
    color: '#2563eb',
    emoji: '💼'
  }
};

// STATE
let currentLevel = null;
let points       = parseInt(localStorage.getItem('ht_points')  || '0');
let streak       = parseInt(localStorage.getItem('ht_streak')  || '0');
let badges       = JSON.parse(localStorage.getItem('ht_badges') || '[]');
let questionCount = parseInt(localStorage.getItem('ht_qcount') || '0');
let chatHistory  = [];

// DOM ELEMENTS
const onboard      = document.getElementById('onboard');
const chatScreen   = document.getElementById('chatScreen');
const chatMessages = document.getElementById('chatMessages');
const chatInput    = document.getElementById('chatInput');
const chatSend     = document.getElementById('chatSend');
const pointsVal    = document.getElementById('pointsVal');
const streakVal    = document.getElementById('streakVal');

// INIT POINTS DISPLAY
pointsVal.textContent = points;
streakVal.textContent = streak;

// SELECT LEVEL
function selectLevel(level) {
  // highlight selected card
  document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
  document.querySelector(`[data-level="${level}"]`).classList.add('selected');

  currentLevel = level;
  const cfg = levels[level];

  // update character panel
  document.getElementById('charGreeting').textContent = cfg.greeting;
  document.getElementById('charLevel').textContent    = cfg.name;
  document.getElementById('welcomeMsg').textContent   = cfg.welcome;

  // transition after short delay
  setTimeout(() => {
    onboard.style.display    = 'none';
    chatScreen.classList.add('active');
  }, 400);

  // unlock badges from storage
  renderBadges();
}

// SEND MESSAGE
async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text || !currentLevel) return;

  // add user message
  addMessage('user', text);
  chatInput.value = '';
  chatInput.style.height = 'auto';

  // add thinking bubble
  const thinkId = addMessage('ai', null, true);

  chatSend.disabled = true;

  try {
    const res  = await fetch('/ask', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        question: text,
        level:    currentLevel,
        system:   levels[currentLevel].systemPrompt
      })
    });
    const data = await res.json();

    // remove thinking bubble
    document.getElementById(thinkId)?.remove();

    if (data.answer) {
      addMessage('ai', data.answer);
      // update points and streak
      addPoints(10);
      streak++;
      streakVal.textContent = streak;
      localStorage.setItem('ht_streak', streak);
      // check badges
      questionCount++;
      localStorage.setItem('ht_qcount', questionCount);
      checkBadges(text);
    } else {
      document.getElementById(thinkId)?.remove();
      addMessage('ai', 'Something went wrong. Please try again.');
    }
  } catch (err) {
    document.getElementById(thinkId)?.remove();
    addMessage('ai', 'Could not connect. Make sure the server is running.');
  }

  chatSend.disabled = false;
}

// ADD MESSAGE TO CHAT
function addMessage(role, text, thinking = false) {
  const id  = 'msg_' + Date.now();
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.id        = id;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'ai' ? 'HT' : 'You';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  if (thinking) {
    bubble.innerHTML = `<div class="dot-pulse"><span></span><span></span><span></span></div>`;
  } else {
    bubble.textContent = text;
  }

  div.appendChild(avatar);
  div.appendChild(bubble);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return id;
}

// ADD POINTS
function addPoints(p) {
  points += p;
  pointsVal.textContent = points;
  localStorage.setItem('ht_points', points);
}

// CHECK AND UNLOCK BADGES
function checkBadges(question) {
  const q = question.toLowerCase();

  const newBadges = [];

  if (questionCount === 1 && !badges.includes('first'))       { badges.push('first');   newBadges.push('first'); }
  if (questionCount >= 5  && !badges.includes('five'))        { badges.push('five');    newBadges.push('five'); }
  if (questionCount >= 10 && !badges.includes('ten'))         { badges.push('ten');     newBadges.push('ten'); }
  if (q.includes('python') && !badges.includes('python'))     { badges.push('python');  newBadges.push('python'); }
  if (q.includes('sql')    && !badges.includes('sql'))        { badges.push('sql');     newBadges.push('sql'); }
  if ((q.includes('react') || q.includes('js')) && !badges.includes('react')) {
    badges.push('react'); newBadges.push('react');
  }

  localStorage.setItem('ht_badges', JSON.stringify(badges));
  renderBadges();

  if (newBadges.length > 0) celebrate('🏆 Badge Unlocked!');
}

// RENDER BADGES
function renderBadges() {
  const badgeMap = {
    first:  0,
    five:   1,
    ten:    2,
    python: 3,
    sql:    4,
    react:  5
  };

  const items = document.querySelectorAll('.badge-item');
  badges.forEach(b => {
    const idx = badgeMap[b];
    if (idx !== undefined && items[idx]) {
      items[idx].classList.remove('locked');
      items[idx].classList.add('unlocked');
    }
  });
}

// CELEBRATE
function celebrate(msg) {
  const div  = document.createElement('div');
  div.className = 'celebrate';
  div.innerHTML = `<div class="celebrate-text">${msg}</div>`;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1500);
  addPoints(25);
}

// I UNDERSTOOD THIS BUTTON
document.getElementById('understood').addEventListener('click', () => {
  celebrate('🎉 +50 Points!');
  addPoints(50);
  streak++;
  streakVal.textContent = streak;
  localStorage.setItem('ht_streak', streak);
});

// CLEAR CHAT
function clearChat() {
  chatMessages.innerHTML = `<div class="welcome-msg" id="welcomeMsg">${levels[currentLevel]?.welcome || ''}</div>`;
  streak = 0;
  streakVal.textContent = '0';
  localStorage.setItem('ht_streak', '0');
}

// AUTO RESIZE TEXTAREA
chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = chatInput.scrollHeight + 'px';
});

// SEND ON ENTER
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

chatSend.addEventListener('click', sendMessage);