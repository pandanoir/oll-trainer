declare module 'scrambo' {
  export default class Scrambo {
    get(n?: number): string[];
  }
}

interface Window {
  webkitAudioContext: typeof AudioContext;
}
