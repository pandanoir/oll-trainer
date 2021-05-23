import {
  OllPage,
  LearningPage,
  CpPage,
  ScramblePage,
  TimerPage,
} from './pages';

export const RouteList = [
  { path: '/', component: <OllPage />, name: 'oll' },
  { path: '/learn', component: <LearningPage />, name: 'learn' },
  { path: '/scramble', component: <ScramblePage />, name: 'scramble' },
  { path: '/cp', component: <CpPage />, name: 'cp check' },
  { path: '/timer', component: <TimerPage />, name: 'Hi-Timer' },
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
  oll: RouteList[0],
  learn: RouteList[1],
  scramble: RouteList[2],
  'cp check': RouteList[3],
  timer: RouteList[4],
} as const;
