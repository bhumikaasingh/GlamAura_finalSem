import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Shoppage from './Shoppage';
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

describe('Shoppage Component', () => {
  it('renders the component and displays products', () => {
    render(
      <Router>
        <Shoppage searchQuery="" data={mockData} />
      </Router>
    );

    expect(screen.getByText('All Products')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('filters products based on search query', () => {
    render(
      <Router>
        <Shoppage searchQuery="Product 1" data={mockData} />
      </Router>
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
  });

  it('displays "No products found" when no products match the search query', () => {
    render(
      <Router>
        <Shoppage searchQuery="Non-existing Product" data={mockData} />
      </Router>
    );

    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('renders product details and links correctly', () => {
    render(
      <Router>
        <Shoppage searchQuery="" data={mockData} />
      </Router>
    );

    const product1Link = screen.getByRole('link', { name: 'Product 1' });
    expect(product1Link).toHaveAttribute('href', '/product-details/1');
  });
});
