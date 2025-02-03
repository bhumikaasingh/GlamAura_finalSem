import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from './Register';
import { registerUserApi } from '../../../api/Api';
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

describe('Register Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders registration form with fields', () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    expect(screen.getByPlaceholderText(/Enter your first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Password/i)).toBeInTheDocument();
  });

  it('displays validation errors for empty fields', async () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.click(screen.getByText(/Register/i));

    expect(await screen.findByText(/Please enter first name/i)).toBeInTheDocument();
    expect(await screen.findByText(/Please enter last name/i)).toBeInTheDocument();
    expect(await screen.findByText(/Please enter email/i)).toBeInTheDocument();
    expect(await screen.findByText(/Please enter password/i)).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    const mockResponse = {
      data: {
        success: true,
        message: 'Registration successful',
      },
    };

    registerUserApi.mockResolvedValue(mockResponse);

    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your first name/i), { target: { value: 'bhumikaa' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your last name/i), { target: { value: 'singhh' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: 'bhumi1@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), { target: { value: '1234567' } });

    fireEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalledWith({
        firstName: 'bhumikaa',
        lastName: 'singhh',
        email: 'bhumi1@gmail.com',
        password: '1234567',
      });
      expect(toast.success).toHaveBeenCalledWith('Registration successful');
    });
  });

  it('handles registration failure', async () => {
    const mockResponse = {
      data: {
        success: false,
        message: 'Registration failed',
      },
    };

    registerUserApi.mockResolvedValue(mockResponse);

    render(
      <Router>
        <Register />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText(/Enter your first name/i), { target: { value: 'bhumikaaa' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your last name/i), { target: { value: 'singhhh' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: 'bhumi11@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), { target: { value: '12345678' } });

    fireEvent.click(screen.getByText(/Register/i));

    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalledWith({
        firstName: 'bhumikaaa',
        lastName: 'singhhh',
        email: 'bhumi11@gmail.com',
        password: '12345678',
      });
      expect(toast.error).toHaveBeenCalledWith('Registration failed');
    });
  });
});
