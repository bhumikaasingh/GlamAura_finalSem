import React, { useState, useEffect } from "react";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { useParams } from "react-router-dom";
import { singleProductApi, createCartApi } from "../../../api/Api"; // Import your API functions
import ProductReviews from "../../../components/Reviewform/ProductReviews";
import ReviewForm from "../../../components/Reviewform/ReviewForm";

const ProductDetails = () => {
  const { id } = useParams(); // Using useParams to get the id from route params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await singleProductApi(id); // Use the singleProductApi function
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          console.error('Error fetching product:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const user = localStorage.getItem('user');

    let userId;
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        userId = parsedUser._id;
      } catch (error) {
        console.error('Failed to parse user object from local storage:', error);
        userId = null;
      }
    } else {
      console.warn('User not found in local storage');
      userId = null;
    }
    
    if (!userId) {
      alert('User is not logged in or user ID is missing.');
      return;
    }

    const cartData = {
      userId,
      products: [
        {
          productId: product._id,
          quantity: 1, // Default quantity set to 1
        },
      ],
    };

    try {
      const response = await createCartApi(cartData);
      if (response.status === 201) {
        alert("Product added to cart");
        
        // Optionally, update the cart count in the navbar
        const cartCount = document.getElementById("cart-count");
        if (cartCount) {
          const existingCartCount = parseInt(cartCount.innerText);
          cartCount.innerText = existingCartCount + 1;
        }
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert("Failed to add product to cart");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-8">Loading...</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-600 mt-8">No product found</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Breadcrumb />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">{product.productName}</h1>
        <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src={`http://localhost:5500/products/${product.productImage}`}
              alt={product.productName}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2">
            <p className="text-gray-700 text-lg mb-4">{product.productDescription}</p>
            <p className="text-gray-900 text-2xl font-semibold mb-6">{`Rs.${product.productPrice}`}</p>
            <div className="flex justify-center">
              <button 
                onClick={handleAddToCart} 
                className="bg-black text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        {/* Product Reviews Section */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Product Reviews</h2>
          <ProductReviews productId={product._id} />
        </div>
        <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
          <ReviewForm productId={product._id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
