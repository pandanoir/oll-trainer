import { CpPage } from './pages/CpPage';
import { EoQuizPage } from './pages/EoQuizPage';
import { ExecutionPage } from './pages/ExecutionPage';
import { InspectionPage } from './pages/InspectionPage';
import { LearningPage } from './pages/LearningPage';
import { OllPage } from './pages/OllPage';
import { ScramblePage } from './pages/ScramblePage';
import { TimerPage } from './pages/TimerPage';

export const RouteList = [
  { path: '/timer', component: <TimerPage />, name: 'Hi-Timer' },
  { path: '/oll', component: <OllPage />, name: 'oll' },
  { path: '/learn', component: <LearningPage />, name: 'learn' },
  { path: '/scramble', component: <ScramblePage />, name: 'scramble' },
  { path: '/inspection', component: <InspectionPage />, name: 'inspection' },
  { path: '/cp', component: <CpPage />, name: 'cp check' },
  { path: '/quiz', component: <EoQuizPage />, name: 'quiz' },
  { path: '/execution', component: <ExecutionPage />, name: 'execution' },
] as const;

type UnionToIntersection<U> = (
  U extends infer R ? (x: R) => unknown : never
) extends (x: infer V) => unknown
  ? V
  : never;

type RouteInfo = UnionToIntersection<
  typeof RouteList[number] extends infer R
    ? R extends { name: string }
      ? { [K in R['name']]: Omit<R, 'name'> }
      : never
    : never
>;
export const RouteInfo: RouteInfo = {
  'Hi-Timer': RouteList[0],
  oll: RouteList[1],
  learn: RouteList[2],
  scramble: RouteList[3],
  inspection: RouteList[4],
  'cp check': RouteList[5],
  quiz: RouteList[6],
  execution: RouteList[7],
} as const;
