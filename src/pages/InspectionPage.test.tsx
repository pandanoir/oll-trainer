/**
 * @jest-environment jsdom
 */
import { render, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { InspectionPage } from './InspectionPage';

jest.mock('../sound/steady.mp3', () => '');
jest.mock('../sound/eightSeconds.mp3', () => '');
jest.mock('../sound/twelveSeconds.mp3', () => '');
jest.mock('../sound/警告音1.mp3', () => '');
jest.mock('../sound/警告音2.mp3', () => '');

jest.mock('../utils/playAudio', () => ({
  playAudio: jest.fn(),
  playSilence: jest.fn(),
}));

jest.setTimeout(50000);
describe('InspectionPage', () => {
  it('snapshot', () => {
    const { asFragment, queryByText, getByText } = render(
      <BrowserRouter>
        <InspectionPage />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
    expect(queryByText(/15 seconds/)).toBe(null);
    act(() => {
      getByText(/press space or tap to start inspection/).click();
    });
    expect(asFragment()).toMatchSnapshot();
    expect(queryByText(/15 seconds/)).not.toBe(null);
    act(() => {
      jest.advanceTimersByTime(1000 + (1000 / 60) * 2);
    });
    expect(queryByText(/14 seconds/)).not.toBe(null);

    act(() => {
      jest.advanceTimersByTime(14000);
    });
    expect(queryByText(/\+2/)).not.toBe(null);
  });
});
