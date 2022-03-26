/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TopPage } from './TopPage';

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
