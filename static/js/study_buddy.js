// NEURAL NETWORK BACKGROUND
const cv = document.getElementById('neural');
const cx = cv.getContext('2d');
function rs(){cv.width=window.innerWidth;cv.height=window.innerHeight;}
rs();window.addEventListener('resize',rs);

const nodes=[];
for(let i=0;i<60;i++) nodes.push({
  x:Math.random()*window.innerWidth,
  y:Math.random()*window.innerHeight,
  vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,
  r:Math.random()*1.5+.5,
  op:Math.random()*.15+.03,
  col:Math.random()>.5?'124,111,255':'37,99,235'
});

function drawNeural(){
  cx.clearRect(0,0,cv.width,cv.height);
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){
        cx.globalAlpha=.06*(1-d/120);
        cx.strokeStyle='rgba(124,111,255,1)';
        cx.lineWidth=.5;
        cx.beginPath();cx.moveTo(nodes[i].x,nodes[i].y);cx.lineTo(nodes[j].x,nodes[j].y);cx.stroke();
      }
    }
  }
  nodes.forEach(n=>{
    cx.globalAlpha=n.op;
    cx.beginPath();cx.arc(n.x,n.y,n.r,0,Math.PI*2);
    cx.fillStyle=`rgba(${n.col},1)`;cx.fill();
    n.x+=n.vx;n.y+=n.vy;
    if(n.x<0)n.x=cv.width;if(n.x>cv.width)n.x=0;
    if(n.y<0)n.y=cv.height;if(n.y>cv.height)n.y=0;
  });
  cx.globalAlpha=1;
  requestAnimationFrame(drawNeural);
}
drawNeural();

// PARTICLES
function createParticle(){
  const p=document.createElement('div');
  p.className='particle';
  const size=Math.random()*6+2;
  const hue=Math.random()>.5?'124,111,255':'167,139,250';
  p.style.cssText=`width:${size}px;height:${size}px;background:rgba(${hue},.8);left:${30+Math.random()*40}%;top:${20+Math.random()*40}%;filter:blur(${Math.random()*2}px);position:absolute;border-radius:50%;pointer-events:none;z-index:6;`;
  document.getElementById('particles').appendChild(p);
  let y=0,op=0,fade=0;
  const tick=setInterval(()=>{
    y-=(Math.random()*2+1);op=Math.min(1,op+.05);fade++;
    if(fade>60) op-=.03;
    p.style.transform=`translateY(${y}px)`;
    p.style.opacity=Math.max(0,op);
    if(op<=0){clearInterval(tick);p.remove();}
  },16);
}

// WAVE ANIMATION
function waveArm(){
  const arm=document.getElementById('waveArm');
  let angle=0,dir=1,count=0;
  const waving=setInterval(()=>{
    angle+=dir*4;
    if(angle>25||angle<-5) dir*=-1;
    arm.style.transform=`rotate(${angle}deg)`;
    count++;
    if(count>80){
      clearInterval(waving);
      arm.style.transform='rotate(0deg)';
      ['star1','star2','star3'].forEach((id,i)=>{
        setTimeout(()=>{
          const el=document.getElementById(id);
          if(el) el.style.opacity='0.8';
        },i*150);
      });
    }
  },30);
}

// MAIN ANIMATION SEQUENCE
function runSequence(){
  // Phase 1 — book glow
 setTimeout(()=>{
    document.getElementById('bookGlow').style.opacity='1';
    document.getElementById('bookImg').classList.add('visible');
  },500);

  // Phase 2 — book opens
  setTimeout(()=>{
    document.getElementById('bookPageLeft').style.transform='rotateY(-140deg)';
    const light=document.getElementById('bookLight');
    light.style.opacity='1';
    light.style.width='300px';
    light.style.height='300px';
    for(let i=0;i<20;i++) setTimeout(()=>createParticle(),i*80);
  },1000);

  // Phase 3 — character rises
  setTimeout(()=>{
    const cw=document.getElementById('charWrap');
    cw.style.opacity='1';
    cw.style.transform='translateX(-50%) translateY(-20px)';
  },2200);

  // Phase 4 — wave
  setTimeout(()=>waveArm(),3000);

  // Phase 5 — welcome text
  setTimeout(()=>{
    const ws=document.getElementById('welcomeSection');
    ws.style.opacity='1';
    ws.style.transform='translateY(0)';
  },5200);

  // Phase 6 — cards stagger
  setTimeout(()=>{
    document.getElementById('cardsSection').style.opacity='1';
    document.getElementById('cardsSection').style.transform='translateY(0)';
    ['card1','card2','card3'].forEach((id,i)=>{
      setTimeout(()=>{
        const c=document.getElementById(id);
        c.style.opacity='1';
        c.style.transform='translateY(0)';
        c.style.transition='all .5s cubic-bezier(.34,1.2,.64,1)';
      },i*150);
    });
  },5800);
}

// LEVEL CONFIGURATION
const levels = {
  highschool: {
    name: 'High School',
    greeting: 'Hey there! 👋 Ask me anything — no question is too simple!',
    welcome: 'Hi! I\'m here to help you understand coding in the simplest way possible. What would you like to learn today?',
    systemPrompt: 'You are a friendly coding tutor for high school students under 18. Use very simple language, fun analogies, and short sentences. Avoid technical jargon. Use emojis occasionally. Always encourage the student.',
  },
  college: {
    name: 'College / University',
    greeting: 'Welcome! 🎓 Let\'s master your coursework together.',
    welcome: 'Hello! I\'m here to help you with Python, SQL, React JS, Power BI and Tableau. What are we working on today?',
    systemPrompt: 'You are a knowledgeable coding tutor for college students. Give clear structured explanations with examples. Use proper technical terms but always explain them. Be encouraging and thorough.',
  },
  professional: {
    name: 'Working Professional',
    greeting: 'Good to have you here. 💼 Let\'s get straight to it.',
    welcome: 'Welcome. I\'m here to help you upskill efficiently. Ask me anything about Python, SQL, React JS, Power BI or Tableau.',
    systemPrompt: 'You are an expert coding mentor for working professionals. Be concise, technical, and direct. Focus on practical real-world applications. Skip basic explanations unless asked.',
  }
};

// STATE
let currentLevel = null;
let points       = parseInt(localStorage.getItem('ht_points')  || '0');
let streak       = parseInt(localStorage.getItem('ht_streak')  || '0');
let badges       = JSON.parse(localStorage.getItem('ht_badges') || '[]');
let questionCount = parseInt(localStorage.getItem('ht_qcount') || '0');

const pointsVal    = document.getElementById('pointsVal');
const streakVal    = document.getElementById('streakVal');

pointsVal.textContent = points;
streakVal.textContent = streak;

// SELECT LEVEL
function selectLevel(level){
  currentLevel = level;
  const cfg = levels[level];
  document.getElementById('charGreeting').textContent = cfg.greeting;
  document.getElementById('charLevel').textContent    = cfg.name;
  document.getElementById('welcomeMsg').textContent   = cfg.welcome;
  renderBadges();
  setTimeout(()=>{
    document.getElementById('scene').style.display    = 'none';
    document.getElementById('chatScreen').classList.add('active');
  },300);
}

// SEND MESSAGE
const chatInput  = document.getElementById('chatInput');
const chatSend   = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

async function sendMessage(){
  const text = chatInput.value.trim();
  if(!text||!currentLevel) return;
  addMessage('user',text);
  chatInput.value='';
  chatInput.style.height='auto';
  const thinkId = addMessage('ai',null,true);
  chatSend.disabled=true;
  try{
    const res  = await fetch('/ask',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({question:text,level:currentLevel,system:levels[currentLevel].systemPrompt})
    });
    const data = await res.json();
    document.getElementById(thinkId)?.remove();
    if(data.answer){
      addMessage('ai',data.answer);
      addPoints(10);
      streak++;
      streakVal.textContent=streak;
      localStorage.setItem('ht_streak',streak);
      questionCount++;
      localStorage.setItem('ht_qcount',questionCount);
      checkBadges(text);
    } else {
      addMessage('ai','Something went wrong. Please try again.');
    }
  } catch(err){
    document.getElementById(thinkId)?.remove();
    addMessage('ai','Could not connect. Make sure the server is running.');
  }
  chatSend.disabled=false;
}

function addMessage(role,text,thinking=false){
  const id='msg_'+Date.now();
  const div=document.createElement('div');
  div.className=`msg ${role}`;div.id=id;
  const avatar=document.createElement('div');
  avatar.className='msg-avatar';
  avatar.textContent=role==='ai'?'HT':'You';
  const bubble=document.createElement('div');
  bubble.className='msg-bubble';
  if(thinking) bubble.innerHTML=`<div class="dot-pulse"><span></span><span></span><span></span></div>`;
  else bubble.textContent=text;
  div.appendChild(avatar);div.appendChild(bubble);
  chatMessages.appendChild(div);
  chatMessages.scrollTop=chatMessages.scrollHeight;
  return id;
}

function addPoints(p){
  points+=p;pointsVal.textContent=points;
  localStorage.setItem('ht_points',points);
}

function checkBadges(question){
  const q=question.toLowerCase();
  const newBadges=[];
  if(questionCount===1&&!badges.includes('first')){badges.push('first');newBadges.push('first');}
  if(questionCount>=5&&!badges.includes('five')){badges.push('five');newBadges.push('five');}
  if(questionCount>=10&&!badges.includes('ten')){badges.push('ten');newBadges.push('ten');}
  if(q.includes('python')&&!badges.includes('python')){badges.push('python');newBadges.push('python');}
  if(q.includes('sql')&&!badges.includes('sql')){badges.push('sql');newBadges.push('sql');}
  if((q.includes('react')||q.includes('js'))&&!badges.includes('react')){badges.push('react');newBadges.push('react');}
  localStorage.setItem('ht_badges',JSON.stringify(badges));
  renderBadges();
  if(newBadges.length>0) celebrate('🏆 Badge Unlocked!');
}

function renderBadges(){
  const badgeMap={first:0,five:1,ten:2,python:3,sql:4,react:5};
  const items=document.querySelectorAll('.badge-item');
  badges.forEach(b=>{
    const idx=badgeMap[b];
    if(idx!==undefined&&items[idx]){
      items[idx].classList.remove('locked');
      items[idx].classList.add('unlocked');
    }
  });
}

function celebrate(msg){
  const div=document.createElement('div');
  div.className='celebrate';
  div.innerHTML=`<div class="celebrate-text">${msg}</div>`;
  document.body.appendChild(div);
  setTimeout(()=>div.remove(),1500);
  addPoints(25);
}

document.getElementById('understood').addEventListener('click',()=>{
  celebrate('🎉 +50 Points!');addPoints(50);
  streak++;streakVal.textContent=streak;
  localStorage.setItem('ht_streak',streak);
});

function clearChat(){
  chatMessages.innerHTML=`<div class="welcome-msg">${levels[currentLevel]?.welcome||''}</div>`;
  streak=0;streakVal.textContent='0';
  localStorage.setItem('ht_streak','0');
}

chatInput.addEventListener('input',()=>{
  chatInput.style.height='auto';
  chatInput.style.height=chatInput.scrollHeight+'px';
});

chatInput.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}
});

chatSend.addEventListener('click',sendMessage);

// START SEQUENCE
runSequence();