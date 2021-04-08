import { OllPage, LearningPage, ListPage, CpPage } from './pages';

export const Route = [
  { path: '/', component: <OllPage />, name: 'oll' },
  { path: '/learn', component: <LearningPage />, name: 'learn' },
  { path: '/list', component: <ListPage />, name: 'checklist' },
  { path: '/cp', component: <CpPage />, name: 'cp check' },
] as const;
