import { OllPage, LearningPage, ListPage } from './pages';

export const Route = [
  { path: '/', component: <OllPage />, name: 'oll' },
  { path: '/learn', component: <LearningPage />, name: 'learn' },
  { path: '/list', component: <ListPage />, name: 'checklist' },
] as const;
