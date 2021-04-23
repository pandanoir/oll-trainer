import { OllPage, LearningPage, CpPage } from './pages';

export const RouteList = [
  { path: '/', component: <OllPage />, name: 'oll' },
  { path: '/learn', component: <LearningPage />, name: 'learn' },
  { path: '/cp', component: <CpPage />, name: 'cp check' },
] as const;

type UnionToIntersection<U> = (
  U extends infer R ? (x: R) => unknown : never
) extends (x: infer V) => unknown
  ? V
  : never;

type Hoge = UnionToIntersection<
  typeof RouteList[number] extends infer R
    ? R extends { name: string }
      ? { [K in R['name']]: Omit<R, 'name'> }
      : never
    : never
>;
export const RouteInfo: Hoge = {
  oll: { path: '/', component: <OllPage /> },
  learn: { path: '/learn', component: <LearningPage /> },
  'cp check': { path: '/cp', component: <CpPage /> },
} as const;
