// =========================
// 🔊 共通サウンドシステム（完全版）
// =========================

let audioCtx;
let popBuffer;
let unlocked = false;
let volume = 3;

// =========================
// 初期化
// =========================
async function initSound(){
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const res = await fetch("sounds/pop.ogg");
  const arrayBuffer = await res.arrayBuffer();
  popBuffer = await audioCtx.decodeAudioData(arrayBuffer);
}

// =========================
// アンロック
// =========================
function unlockSound(){
  if(!audioCtx) return;

  if(audioCtx.state === "suspended"){
    audioCtx.resume();
  }

  unlocked = true;
}

// =========================
// 音量設定
// =========================
function setVolume(v){
  volume = v;
}

// =========================
// 通常音（ゲーム用）
// =========================
function playPop(){
  if(!audioCtx || !unlocked || !popBuffer) return;

  const source = audioCtx.createBufferSource();
  source.buffer = popBuffer;

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = volume / 5;

  source.connect(gainNode).connect(audioCtx.destination);
  source.start(0);
}

// =========================
// 短い音（遷移用）
// =========================
function playPopShort(){
  if(!audioCtx || !unlocked || !popBuffer) return;

  const source = audioCtx.createBufferSource();
  source.buffer = popBuffer;

  const gainNode = audioCtx.createGain();

  const now = audioCtx.currentTime;

  gainNode.gain.setValueAtTime(volume / 5, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  source.connect(gainNode).connect(audioCtx.destination);

  source.start(0);
  source.stop(now + 0.1);
}