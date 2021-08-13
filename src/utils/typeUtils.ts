export type Awaited<T> = T extends Promise<infer R> ? Awaited<R> : T;
