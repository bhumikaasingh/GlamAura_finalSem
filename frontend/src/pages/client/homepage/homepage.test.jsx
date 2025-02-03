import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Homepage from './homepage';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock data
const mockData = [
  {
    _id: '1',
    productName: 'Product 1',
    productPrice: 100,
    productDescription: 'Description 1',
    productImage: 'product1.jpg'
  },
  {
    _id: '2',
    productName: 'Product 2',
    productPrice: 200,
    productDescription: 'Description 2',
    productImage: 'product2.jpg'
  }
];

describe('Homepage Component', () => {
  it('renders the component and displays the welcome message', () => {
    render(
      <Router>
        <Homepage searchQuery="" data={mockData} />
      </Router>
    );

    expect(screen.getByText('Welcome to')).toBeInTheDocument();
    expect(screen.getByText('Glam Craft')).toBeInTheDocument();
    expect(screen.getByText('Your Destination for')).toBeInTheDocument();
  });

  it('displays the Typewriter component with correct words', () => {
    render(
      <Router>
        <Homepage searchQuery="" data={mockData} />
      </Router>
    );

    expect(screen.getByText('Beauty.')).toBeInTheDocument();
    expect(screen.getByText('Elegance.')).toBeInTheDocument();
    expect(screen.getByText('Confidence.')).toBeInTheDocument();
    expect(screen.getByText('Style.')).toBeInTheDocument();
  });

  it('filters and displays featured products', () => {
    render(
      <Router>
        <Homepage searchQuery="" data={mockData} />
      </Router>
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.queryByText('No products found')).not.toBeInTheDocument();
  });

  it('displays "No products found" when no products match the search query', () => {
    render(
      <Router>
        <Homepage searchQuery="Non-existing Product" data={mockData} />
      </Router>
    );

    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('renders product details and links correctly', () => {
    render(
      <Router>
        <Homepage searchQuery="" data={mockData} />
      </Router>
    );

    const product1Link = screen.getByRole('link', { name: 'Product 1' });
    expect(product1Link).toHaveAttribute('href', '/product-details/1');
  });

  it('renders the contact and shop now buttons with correct links', () => {
    render(
      <Router>
        <Homepage searchQuery="" data={mockData} />
      </Router>
    );

    expect(screen.getByText('Contact Us')).toHaveAttribute('href', '/contact');
    expect(screen.getByText('Shop Now✨')).toHaveAttribute('href', '/contact');
  });
});
