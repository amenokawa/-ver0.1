// =========================
// 🔊 共通サウンドシステム（完全版）
// =========================

let audioCtx;
let popBuffer = null;
let unlocked = false;
let volume = 3;

// 初期化（音データ読み込み）
async function initSound(){
  try{
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // ★絶対パスに変更（ここが重要）
    const res = await fetch("sounds/pop.ogg");

    if(!res.ok){
      throw new Error("音ファイル取得失敗: " + res.status);
    }

    const arrayBuffer = await res.arrayBuffer();
    popBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    console.log("音読み込み完了");
  }catch(e){
    console.log("音読み込み失敗", e);
  }
}

// 最初の操作で音を有効化
function unlockSound(){
  if(audioCtx && audioCtx.state === "suspended"){
    audioCtx.resume();
  }
  unlocked = true;
}

// ポン音再生（連打対応）
function playPop(){
  if(!audioCtx) return;

  if(audioCtx.state === "suspended"){
    audioCtx.resume();
  }

  if(!popBuffer) return;

  const source = audioCtx.createBufferSource();
  source.buffer = popBuffer;

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = volume / 5;

  source.connect(gainNode).connect(audioCtx.destination);

  source.start(0);
}

// 音量設定
function setVolume(v){
  volume = Number(v);
}