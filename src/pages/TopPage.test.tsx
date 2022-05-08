/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TopPage } from './TopPage';
jest.mock('./CpPage', () => ({ CpPage: () => void 0 }));
jest.mock('./EoQuizPage', () => ({ EoQuizPage: () => void 0 }));
jest.mock('./ExecutionPage', () => ({ ExecutionPage: () => void 0 }));
jest.mock('./InspectionPage', () => ({ InspectionPage: () => void 0 }));
jest.mock('./LearningPage', () => ({ LearningPage: () => void 0 }));
jest.mock('./OllPage', () => ({ OllPage: () => void 0 }));
jest.mock('./ScramblePage', () => ({ ScramblePage: () => void 0 }));
jest.mock('./TimerPage', () => ({ TimerPage: () => void 0 }));

describe('TopPage', () => {
  it('snapshot', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <TopPage />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
