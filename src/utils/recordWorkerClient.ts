import { SessionCollection } from '../components/Timer/timeData';
import { WorkerResult } from '../worker/recordWorker';
// eslint-disable-next-line import/no-unresolved
import Worker from '../worker/recordWorker?worker';

export const analyzeSessionCollection = (
  sessionCollection: SessionCollection,
  { signal }: { signal?: AbortSignal } = {}
): Promise<WorkerResult> =>
  new Promise((resolve, reject) => {
    const worker = new Worker();
    signal?.addEventListener('abort', () => {
      worker.terminate();
    });
    worker.onmessage = (data) => {
      resolve(data.data);
    };
    worker.onerror = (error) => reject(error);
    worker.postMessage(sessionCollection);
  });
