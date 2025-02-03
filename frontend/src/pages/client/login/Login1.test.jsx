import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login1 from './Login1';
import { loginUserApi } from '../../../api/Api';
import { toast } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock dependencies
jest.mock('../../../api/Api');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Login1 Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders login form with email and password fields', () => {
    render(
      <Router>
        <Login1 />
      </Router>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('displays error messages for invalid email and empty password', async () => {
    render(
      <Router>
        <Login1 />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '' } });
    fireEvent.click(screen.getByText(/Login/i));

    expect(await screen.findByText(/Email is empty or invalid/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is empty/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Login successful',
        token: 'fake-token',
        userData: { id: 1, name: 'bhumika singh' },
      },
    };

    loginUserApi.mockResolvedValue(mockResponse);

    render(
      <Router>
        <Login1 />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'bhumi1@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '1234567' } });
    fireEvent.click(screen.getByText(/Login/i));

    expect(loginUserApi).toHaveBeenCalledWith({ email: 'bhumi1@gmail.com', password: '1234567' });
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify({ id: 1, name: 'bhumika singh' }));
    expect(toast.success).toHaveBeenCalledWith('Login successful');
  });

  it('handles login failure', async () => {
    const mockResponse = {
      data: {
        success: false,
        message: 'Invalid credentials',
      },
    };

    loginUserApi.mockResolvedValue(mockResponse);

    render(
      <Router>
        <Login1 />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'bhumi11@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '12345678' } });
    fireEvent.click(screen.getByText(/Login/i));

    expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
  });
});
