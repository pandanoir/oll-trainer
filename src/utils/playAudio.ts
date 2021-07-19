/**
 * @example
 * import audioDataUrl from '../../sound/steady.mp3';
 * const audioData = fetch(audioDataUrl).then((response) =>
 *   response.arrayBuffer()
 * );
 * audioData.then(playAudio);
 */
let audioCtx: AudioContext | null = null;
const getAudioContext = () => {
  if (audioCtx) {
    return audioCtx;
  }
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
  return audioCtx;
};
export const playAudio = async (
  audioData: ArrayBuffer,
  { volume = 1 } = { volume: 1 }
) => {
  if (volume === 0) {
    return;
  }
  const audioCtx = getAudioContext();
  const gainNode = audioCtx.createGain();
  const source = audioCtx.createBufferSource();

  gainNode.gain.value = volume;
  source.buffer = await new Promise((resolve, reject) =>
    audioCtx.decodeAudioData(audioData.slice(0), resolve, reject)
  );
  source.loop = false;
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.start();
};

/**
 * 無音を流すことで制限を解除する
 */
export const playSilence = () => {
  const audioCtx = getAudioContext();

  const source = audioCtx.createBufferSource();
  source.buffer = audioCtx.createBuffer(1, 1, 22050);
  source.onended = () => source.disconnect(0);
  source.connect(audioCtx.destination);
  source.start(0);
};
