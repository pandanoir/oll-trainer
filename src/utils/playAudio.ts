/**
 * @example
 * import audioDataUrl from '../../sound/steady.mp3';
 * const audioData = fetch(audioDataUrl).then((response) =>
 *   response.arrayBuffer()
 * );
 * audioData.then(playAudio);
 */
export const playAudio = async (
  audioData: ArrayBuffer,
  { volume = 1 }: { volume?: number }
) => {
  const audioCtx = new AudioContext();
  const gainNode = audioCtx.createGain();
  const source = audioCtx.createBufferSource();

  gainNode.gain.value = volume;
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const buffer: AudioBuffer = await new Promise((resolve) =>
    audioCtx.decodeAudioData(audioData.slice(0), resolve)
  );

  source.buffer = buffer;
  source.loop = false;
  source.start();
};
