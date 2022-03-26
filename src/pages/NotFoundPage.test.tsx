/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

describe('NotFoundPage', () => {
  it('snapshot', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
