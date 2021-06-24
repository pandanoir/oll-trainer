/**
 * @example
 * import audioDataUrl from '../../sound/steady.mp3';
 * const audioData = fetch(audioDataUrl).then((response) =>
 *   response.arrayBuffer()
 * );
 * audioData.then(playAudio);
 */
export const playAudio = async (audioData: ArrayBuffer) => {
  const audioCtx = new AudioContext(),
    source = audioCtx.createBufferSource();
  const buffer: AudioBuffer = await new Promise((resolve) =>
    audioCtx.decodeAudioData(audioData.slice(0), resolve)
  );
  source.buffer = buffer;
  source.loop = false;
  source.connect(audioCtx.destination);
  source.start();
};
