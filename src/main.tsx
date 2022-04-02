import { StrictMode } from 'react';
import { render } from 'react-dom';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
  document.querySelector('#app')
);
