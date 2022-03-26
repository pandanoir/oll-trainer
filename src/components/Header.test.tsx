/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

jest.mock('../pages/CpPage', () => ({ CpPage: () => null }));
jest.mock('../pages/EoQuizPage', () => ({ EoQuizPage: () => null }));
jest.mock('../pages/InspectionPage', () => ({ InspectionPage: () => null }));
jest.mock('../pages/LearningPage', () => ({ LearningPage: () => null }));
jest.mock('../pages/OllPage', () => ({ OllPage: () => null }));
jest.mock('../pages/ScramblePage', () => ({ ScramblePage: () => null }));
jest.mock('../pages/TimerPage', () => ({ TimerPage: () => null }));

describe('Header', () => {
  it('snapshot', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <Header onSettingButtonClick={jest.fn()} onDarkModeToggle={jest.fn()} />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
