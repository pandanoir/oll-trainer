import {
  OllPage,
  LearningPage,
  CpPage,
  ScramblePage,
  TimerPage,
} from './pages';

export const RouteList = [
  { path: '/timer', component: <TimerPage />, name: 'Hi-Timer' },
  { path: '/', component: <OllPage />, name: 'oll' },
  { path: '/learn', component: <LearningPage />, name: 'learn' },
  { path: '/scramble', component: <ScramblePage />, name: 'scramble' },
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
  'Hi-Timer': RouteList[0],
  oll: RouteList[1],
  learn: RouteList[2],
  scramble: RouteList[3],
  'cp check': RouteList[4],
} as const;
