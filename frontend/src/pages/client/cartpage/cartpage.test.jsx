import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CartPage from './cartpage';
import * as api from '../../../api/Api';

// Mock the API calls
jest.mock('../../../api/Api', () => ({
  cartApi: jest.fn(),
  updateCartApi: jest.fn(),
  fetchProductDetails: jest.fn(),
}));

describe('CartPage Component', () => {
  beforeEach(() => {
    // Mock localStorage
    global.localStorage = {
      getItem: jest.fn(() => JSON.stringify({ _id: 'user123' })),
    };

    // Clear previous mock calls
    jest.clearAllMocks();
  });

  it('should display loading state initially', () => {
    api.cartApi.mockResolvedValue({ data: { success: true, cart: { products: [] } } });
    api.fetchProductDetails.mockResolvedValue({ data: { success: true, products: [] } });

    render(<CartPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should handle error state correctly', async () => {
    api.cartApi.mockRejectedValue(new Error('Failed to fetch cart items'));

    render(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText('An error occurred while fetching cart items')).toBeInTheDocument();
    });
  });

  it('should render cart items correctly', async () => {
    api.cartApi.mockResolvedValue({
      data: {
        success: true,
        cart: { products: [{ productId: 'prod123', quantity: 2 }] },
      },
    });
    api.fetchProductDetails.mockResolvedValue({
      data: {
        success: true,
        products: [{ _id: 'prod123', productName: 'Sample Product', productPrice: 100, productDescription: 'Description', productImage: 'image.jpg' }],
      },
    });

    render(<CartPage />);

    await waitFor(() => {
      expect(screen.getByText('Sample Product')).toBeInTheDocument();
      expect(screen.getByText('Rs. 100.00')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });
  });

  it('should handle quantity change correctly', async () => {
    api.cartApi.mockResolvedValue({
      data: {
        success: true,
        cart: { products: [{ productId: 'prod123', quantity: 2 }] },
      },
    });
    api.fetchProductDetails.mockResolvedValue({
      data: {
        success: true,
        products: [{ _id: 'prod123', productName: 'Sample Product', productPrice: 100, productDescription: 'Description', productImage: 'image.jpg' }],
      },
    });
    api.updateCartApi.mockResolvedValue({ data: { success: true } });

    render(<CartPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('+'));
      expect(api.updateCartApi).toHaveBeenCalledWith('user123', {
        items: [{ productId: 'prod123', quantity: 3 }],
      });
    });
  });

  it('should navigate to checkout on "Buy Now" click', () => {
    const navigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => navigate,
    }));

    api.cartApi.mockResolvedValue({
      data: {
        success: true,
        cart: { products: [] },
      },
    });

    render(<CartPage />);

    fireEvent.click(screen.getByText('Buy Now'));

    expect(navigate).toHaveBeenCalledWith('/checkout');
  });
});
