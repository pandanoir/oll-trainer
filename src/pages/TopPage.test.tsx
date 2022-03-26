/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TopPage } from './TopPage';

describe('Header', () => {
  it('snapshot', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <TopPage />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
