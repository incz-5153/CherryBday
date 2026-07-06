const challenges=[
'20-sec dance battle',
'Royal birthday selfie',
'Choose the next song',
'Claim a snack prize',
'Recreate an old photo',
'Make a giant wish',
'Collect 3 compliments',
'Give silly nicknames'
];

let rotation=0;
let spinning=false;
let audioCtx=null;

let bgMusic=null;

function burst(n=100){
let colors=['#ff4f8b','#c9ff5d','#7ee8fa','#9d7bff','#ffe66d'];

for(let i=0;i<n;i++){

let c=document.createElement('i');

c.className='confetti';

c.style.left=Math.random()*100+'vw';

c.style.background=colors[i%colors.length];

c.style.animationDelay=Math.random()*.5+'s';

c.style.animationDuration=2+Math.random()*2+'s';

document.body.appendChild(c);

setTimeout(()=>c.remove(),4300);

}

}

function toast(s){

let t=document.querySelector('.toast');

if(!t)return;

t.textContent=s;

t.classList.add('show');

setTimeout(()=>t.classList.remove('show'),2800);

}

function beep(freq=600,d=.08,vol=.04){

audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();

let o=audioCtx.createOscillator();

let g=audioCtx.createGain();

o.frequency.value=freq;

o.type='triangle';

g.gain.value=vol;

o.connect(g);

g.connect(audioCtx.destination);

o.start();

g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+d);

o.stop(audioCtx.currentTime+d);

}

function initMusic(){

if(bgMusic)return;

bgMusic=new Audio('assets/birthday.mp3');

bgMusic.loop=true;

bgMusic.volume=.35;

if(localStorage.getItem('birthday_music')==='playing'){

bgMusic.play().catch(()=>{});

}

}

function toggleMusic(){

initMusic();

let b=document.querySelector('#musicBtn');

if(bgMusic.paused){

bgMusic.play();

localStorage.setItem('birthday_music','playing');

if(b)b.textContent='Pause Music';

}else{

bgMusic.pause();

localStorage.setItem('birthday_music','paused');

if(b)b.textContent='Play Music';

}

}

function spin(){

if(spinning)return;

spinning=true;

let i=Math.floor(Math.random()*8);

let target=(337.5-i*45+360)%360;

rotation+=1800+(target-rotation%360+360)%360;

document.querySelector('.wheel').style.transform=`rotate(${rotation}deg)`;

document.querySelector('#spinBtn').textContent='WHEEEEE...';

let ticks=0;

let ticker=setInterval(()=>{

beep(450+ticks*8,.04,.025);

if(++ticks>28)clearInterval(ticker);

},130);

setTimeout(()=>{

document.querySelector('#result').textContent='Your challenge: '+challenges[i];

document.querySelector('#spinBtn').textContent='Spin again';

spinning=false;

beep(880,.35,.08);

burst(100);

},4900);

}

function answer(el,ok){

document.querySelectorAll('.answer').forEach(x=>x.disabled=true);

el.classList.add(ok?'correct':'wrong');

if(ok){

toast('Correct! You know Dr. Charishma!');

burst(40);

}else{

toast('Nice try. The answer is: all of them!');

setTimeout(()=>document.querySelector('.answer[data-ok="1"]').classList.add('correct'),400);

}

}

function openEnvelope(el,msg){

if(el.classList.contains('open'))return;

el.classList.add('open');

el.textContent=msg;

burst(30);

}

function startParty(){

initMusic();

bgMusic.play().catch(()=>{});

localStorage.setItem('birthday_music','playing');

burst(180);

setTimeout(()=>location.href='hub.html',700);

}

function finale(){

document.querySelector('.finale').classList.add('pop');

for(let i=0;i<8;i++){

setTimeout(()=>burst(180),i*600);

}

if(bgMusic){

bgMusic.volume=.6;

}

beep(988,.5,.1);

setTimeout(()=>beep(1175,.5,.08),500);

toast('🎉 HAPPY 20TH BIRTHDAY DR. CHARISHMA! 🎉');

}

function addMusicControl(){

['extras.css','doctor.css'].forEach(href=>{

let l=document.createElement('link');

l.rel='stylesheet';

l.href=href;

document.head.appendChild(l);

});

initMusic();

let x=document.createElement('div');

x.className='music-box';

x.innerHTML='<span>🎵 Music</span><button id="musicBtn" onclick="toggleMusic()">'+(localStorage.getItem('birthday_music')==='playing'?'Pause Music':'Play Music')+'</button>';

document.body.appendChild(x);

}

function loadPhotos(input){

let files=[...input.files].slice(0,12);

let g=document.querySelector('#gallery');

if(!files.length)return;

g.innerHTML='';

files.forEach((f,i)=>{

let r=new FileReader();

r.onload=e=>{

let c=document.createElement('figure');

c.className='photo-card';

c.innerHTML=`<img src="${e.target.result}" alt="Memory ${i+1}"><input value="Memory ${i+1}" aria-label="Photo caption">`;

g.appendChild(c);

};

r.readAsDataURL(f);

});

toast(files.length+' memories added');

burst(50);

}

document.addEventListener('DOMContentLoaded',addMusicControl);
