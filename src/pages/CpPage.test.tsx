/**
 * @jest-environment jsdom
 */
import { fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CpPage } from './CpPage';

describe('CpPage', () => {
  it('snapshot', () => {
    const { asFragment, getByRole } = render(
      <BrowserRouter>
        <CpPage />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();

    fireEvent.change(getByRole('textbox'), {
      target: { value: `F R U R' U' F'` },
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
