import { StrictMode } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename="/oll">
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
  document.querySelector('#app')
);
