import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DataProvider from './src/context/DataProvider';
import Login from './src/pages/Login/Login';

describe('Login Component', () => {
  test('displays email input with correct placeholder', () => {
    render(
      <DataProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Login />
        </MemoryRouter>
      </DataProvider>
    );

    const signInButton = screen.getByText(/Sign-in to Pingsly/i);
    fireEvent.click(signInButton);

    const emailInput = screen.getByPlaceholderText(/Your e-mail/i);
    expect(emailInput).toBeInTheDocument();
  });
});
