// ===== COVER 열고 닫기 =====
const KEY="ive-cover-seen";
const splash=document.getElementById('splash');
const app=document.getElementById('app');
const openBtn=document.getElementById('openDiary');
const showCover=document.getElementById('showCover');

function openBook(){ document.querySelector('.cover3d').classList.add('opening');
  setTimeout(()=>{ splash.classList.add('hide'); app.style.visibility='visible';
    localStorage.setItem(KEY,'1'); }, 1200); }
function showBook(){ splash.classList.remove('hide'); app.style.visibility='hidden';
  document.querySelector('.cover3d').classList.remove('opening'); }
if(localStorage.getItem(KEY)==='1'){ splash.classList.add('hide'); app.style.visibility='visible'; }
openBtn.addEventListener('click', openBook);
showCover.addEventListener('click', ()=>{ localStorage.removeItem(KEY); showBook(); });

// ===== 파티클 (간단한 장식) =====
const particles = document.getElementById('particles');
function spawn() {
  const el = document.createElement('div');
  el.className = 'particle';
  el.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
     <radialGradient id="g3" cx="50%" cy="40%" r="60%">
       <stop offset="0%" stop-color="#ffffff"/><stop offset="60%" stop-color="#f6f1ff"/><stop offset="100%" stop-color="#e8dbff"/></radialGradient>
     <circle cx="12" cy="12" r="8" fill="url(#g3)" />
   </svg>`;
  const size = 16 + Math.random()*28;
  el.style.left = Math.random()*100 + 'vw';
  el.style.bottom = (-10 + Math.random()*20) + 'vh';
  el.style.width = size + 'px';
  const dur = 18 + Math.random()*16;
  el.style.animationDuration = dur + 's, ' + (3 + Math.random()*3) + 's';
  particles.appendChild(el);
  setTimeout(()=>el.remove(), (dur+1)*1000);
}
for(let i=0;i<20;i++) spawn();
setInterval(()=>spawn(), 1800);

// ===== 앱 상태 =====
const LS="ive-diary-contrast-v1";
const $=(s)=>document.querySelector(s);
const listEl=$("#list"), inputEl=$("#input");
const sendBtn=$("#send"), exportBtn=$("#export"), clearBtn=$("#clear");
const copyBtn=$("#copyLast"), sbBtn=$("#scrollBottom");
const toneBtns=document.querySelectorAll(".tone button");
const presetsEl=$("#presets");

const presets=[
  "나 오늘 힘들었어. 어떻게 하면 좋을까?",
  "요즘 자신감이 떨어지는 느낌이야.",
  "실수를 해서 너무 속상해.",
  "사람 관계가 어려워…",
  "새로운 도전 앞이라 떨려.",
  "미루게 돼서 루틴을 만들고 싶어.",
];

let tone="itgirl"; let entries=[];
try{ entries=JSON.parse(localStorage.getItem(LS)||"[]"); }catch(e){ entries=[]; }

presets.forEach(p=>{ const b=document.createElement("button"); b.className="chip"; b.textContent=p; b.onclick=()=>sendMessage(p); presetsEl.appendChild(b); });
toneBtns.forEach(btn=>btn.addEventListener("click",()=>{ toneBtns.forEach(b=>b.classList.remove("active")); btn.classList.add("active"); tone=btn.dataset.tone; }));

function render(){
  listEl.innerHTML="";
  entries.forEach(item=>{
    const div=document.createElement("div");
    div.className="bubble "+(item.role==="user"?"me":"ive");
    div.textContent=item.text;
    const meta=document.createElement("div");
    meta.className="meta";
    meta.textContent=(item.role==="user"?"나의 기록 · ":"IVE 응원 · ")+new Date(item.time).toLocaleString();
    div.appendChild(meta);
    listEl.appendChild(div);
  });
  listEl.scrollTop=999999; // 맨 아래
  localStorage.setItem(LS, JSON.stringify(entries));
}
render();

// ====== 파이썬 로직을 JS로 변환 ======
const KEYWORDS = {
  stress: ["힘들","지쳤","번아웃","피곤","스트레스"],
  selfDoubt: ["불안","자신","자존감","걱정","초조"],
  mistake: ["실수","망했","후회","창피","민망"],
  relationship: ["친구","연애","관계","팀","회사"],
  challenge: ["도전","새로운","시작","면접","시험"],
  procrastination: ["미루","게으","집중","루틴","습관"],
};
const TONES = ["warm","itgirl","coach"];
const REPLIES = {
  stress: {
    warm: [
      "부딪히는 날도 있지. 그래도 행운은 늘 네 편이래.🍀",
      "오늘 수고했어. 따뜻한 차 한 잔처럼 마음을 덮어주자.",
      "판단은 내일에게 맡기자. 지금은 쉬어도 충분히 가치 있어.",
      "숨을 깊게 쉬고 어깨 편 다음, 오늘의 나를 꼭 안아줘.",
    ],
    itgirl: [
      "오늘 무드는 네가 정해! 다른 사람이 뭐라 해도 넌 너라서 충분해.  ",
      "스트레스? 난 루틴으로 컨트롤해. 물 마시고 스트레칭 1분, 리셋!",
      "바쁠수록 더 빛나는 무드. 오늘도 주인공은 나야 ✨",
      "내 페이스는 내가 정해. 천천히 가도 꾸준히 쌓여.",
    ],
    coach: [
      "“난 나일 때 가장 빛나.” 따라갈 필요 없어—넌 너의 길로. 🚀",
      "10분 회복 루틴: 물→스트레칭→창 밖 보기. 그다음 한 가지만 처리.",
      "할 일 3개로 줄이기. 작은 승리부터 쌓자.",
      "피곤지수 1~5 기록. 4 이상이면 회복 먼저!",
    ],
  },
  selfDoubt: {
    warm: [
      "난 나일 때 가장 빛나!✨ 잊지 말고, 길을 잃어도 괜찮아.",
      "불안해도 괜찮아. 네 가치는 흔들리지 않아.",
      "오늘의 나도 충분히 예쁘고 단단해.",
      "걱정의 크기보다, 내가 해낸 것의 목록을 더 크게 쓰자.",
    ],
    itgirl: [
      "무드는 내가 정해. 남 눈치 NO—끌리지 않는 것엔 안 끌려.",
      "거울 보기. 이미 ‘베스트 버전’ 갱신 중 💖",
      "기준은 내가 만든다. 오늘도 자기확신 ON.",
      "비교는 OFF, 나다움은 MAX.",
    ],
    coach: [
      "자신감 루틴: 거울 앞에서 “누구보다도 먼저 나를 믿어” 3회!",
      "증거 3가지 적기: 해낸 일, 받은 칭찬, 버틴 순간.",
      "24시간 비교 금지 챌린지 시작!",
      "불안 한 줄 → 반박 한 줄. 균형 잡기.",
    ],
  },
  mistake: {
    warm: [
      "실수는 성장의 이정표야. 오늘은 다정하게 넘어가자.",
      "하루의 한 장면일 뿐, 전체 서사는 충분히 아름다워.",
      "미안함보다 회복과 배움에 집중하자.",
    ],
    itgirl: [
      "오케이 NG! 다음 컷은 원테이크로 가자 💅",
      "흔들려도 중심은 나. 실수도 내 서사의 스파클.✨",
      "프로는 빠른 리셋. 지금이 리부트 타이밍.",
    ],
    coach: [
      "사실 체크→배운 점 1개→다음 행동 1개. 끝!",
      "필요하면 바로 사과, 그다음 개선 플랜.",
      "핵심 원인 1개만 고치기(과부하 금지).",
    ],
  },
  relationship: {
    warm: [
      "내가 옆에서 같이 걸을게. 네 안의 자신감이 너를 더 비춰. ✨",
      "내 마음을 먼저 돌보자. 건강한 경계가 다정함을 지켜줘.",
      "상대의 감정은 내 책임이 아니야. 난 진심이면 충분해.",
      "말을 고르는 시간은 관계를 지키는 시간.",
    ],
    itgirl: [
      "존중은 기본값. 기준에 못 미치면 거기까지.",
      "내 에너지는 소중해. 가치 있는 곳에만 쓰기.",
      "선을 명확히 긋는 게 결국 더 다정해.",
    ],
    coach: [
      "상황 3줄→원하는 결과 1줄→말할 문장 1개 연습.",
      "‘언제/무엇/왜’ 포함해서 요청하기.",
      "대화 시간 약속→사실부터 5분 핵심토크.",
    ],
  },
  challenge: {
    warm: [
      "떨림은 앞으로 밀어주는 바람이야.",
      "시작한 너, 이미 절반을 해냈어.",
      "지금의 용기가 내일의 자랑이 된다.",
    ],
    itgirl: [
      "모두 다 가지면 되는 거야. 하나만 고를필요 없어! 💅",
      "무대는 준비 완료. 등장은 나답게 💖",
      "도전은 나를 비추는 조명, 눈부시게 가자.",
      "크게 숨 들이마시고—주인공 모드 ON.",
    ],
    coach: [
      "무드 ON: “내가 정할게 나의 무드.”",
      "연습 20분×2세트, 끝나면 가벼운 산책.",
      "리허설 영상 1회→자기 피드백 3개.",
    ],
  },
  procrastination: {
    warm: [
      "아주 작게 시작하자. 2분이면 충분해.",
      "완벽보다 진행. 한 걸음도 앞으로.",
      "오늘의 작은 루틴이 내일의 편안함.",
    ],
    itgirl: [
      "세상에 보란 듯 보여줘; 넌 이미 누구보다 환하게 빛나거든.",
      "루틴은 나의 시그니처. 타이머 스타트!",
      "집중은 최고의 액세서리.",
      "핸드폰 내려놓고, 주인공 모드 ON.",
    ],
    coach: [
      "2-5-10: 2분 정리→5분 계획→10분 실행.",
      "할 일 하나만! 끝나면 셀프 보상.",
      "방해요소 3개 차단: 알림/TV/간식.",
    ],
  },
};
const GENERIC = {
  warm: [
    "네 속도로 가면 돼. 오늘의 나를 다정하게 응원해.",
    "마음이 말하는 걸 들었어. 함께 숨 고르자.",
  ],
  itgirl: [
    "오늘도 주인공은 나. 기준은 내가 만든다 💖",
    "빛은 스스로 켜는 것. 스위치 ON.",
  ],
  coach: [
    "목표 1개만 고르고 10분만 실행!",
    "기록→피드백→다음 한 걸음. 루프를 믿자.",
  ],
};
const HASH_TAGS = ["#IVENISM","#ItGirlEnergy","#SelfLoveFirst","#나답게","#오늘의주인공"];

function detectIntent(text=""){
  const t = text.toLowerCase();
  for(const [intent, keys] of Object.entries(KEYWORDS)){
    if(keys.some(k=>t.includes(k.toLowerCase()))) return intent;
  }
  return null;
}
function generateReply(text, tone){
  const safeTone = TONES.includes(tone) ? tone : "itgirl";
  const intent = detectIntent(text);
  let pool;
  if(intent && REPLIES[intent] && REPLIES[intent][safeTone]){
    pool = REPLIES[intent][safeTone];
  } else {
    pool = GENERIC[safeTone];
  }
  const firstLine = (pool.find(s=>typeof s==="string" && s.trim()) || "").trim();
  const tag = HASH_TAGS[Math.floor(Math.random()*HASH_TAGS.length)];
  return `${firstLine} ${tag}`.trim();
}

// ===== 메시지 처리 (이제 /reply 없이 클라이언트에서 바로 생성) =====
async function sendMessage(text){
  const content=(text ?? inputEl.value).trim();
  if(!content) return;
  const now=new Date().toISOString();
  entries.push({role:"user", text:content, time:now, tone}); render(); inputEl.value="";
  const ai = generateReply(content, tone);
  entries.push({role:"ive", text:ai, time:new Date().toISOString(), tone}); render();
}

sendBtn.addEventListener("click", ()=>sendMessage());
inputEl.addEventListener("keydown", (e)=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendMessage(); }});
exportBtn?.addEventListener("click", ()=>{ const blob=new Blob([JSON.stringify(entries,null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="ive-diary.json"; a.click(); URL.revokeObjectURL(url); });
clearBtn?.addEventListener("click", ()=>{ if(confirm("모든 대화를 삭제할까요?")){ entries=[]; render(); }});
copyBtn?.addEventListener("click", ()=>{ const last=[...entries].reverse().find(e=>e.role==="ive"); if(!last) return; navigator.clipboard.writeText(last.text).then(()=>alert("마지막 응원문구를 복사했어요 💖")); });
sbBtn?.addEventListener("click", ()=>{ listEl.scrollTop=999999; });
