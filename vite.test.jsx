import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DataProvider from './src/context/DataProvider';
import Login from './src/pages/Login/Login';
import Message from './src/pages/Message/Message';
import Signup from './src/pages/Login/SignUp';


describe('Component Tests', () => {
  test('Login displays email input with correct placeholder', () => {
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

  test('Message component renders textarea with correct placeholder', () => {
    render(
      <DataProvider>
        <Message
          receiverId={1}
          receiverEmail="test@email.com"
          messages={[]}
          setMessages={() => {}}
        />
      </DataProvider>
    );

    const textarea = screen.getByPlaceholderText(/Message test@email.com.../i);
    expect(textarea).toBeInTheDocument();
  });

test('Signup displays password input with correct placeholder', () => {
  render(
    <MemoryRouter initialEntries={['/signup']}>
      <Signup />
    </MemoryRouter>
  );

  const passwordInput = screen.getByPlaceholderText(/Enter a password/i);
  expect(passwordInput).toBeInTheDocument();

  });
});
