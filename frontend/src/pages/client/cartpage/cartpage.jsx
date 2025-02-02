import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cartApi, updateCartApi, fetchProductDetails } from "../../../api/Api"; // Adjust the path as necessary

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        const response = await cartApi(userId);

        if (response.data.success && response.data.cart) {
          const cartProducts = response.data.cart.products || [];
          const productIds = cartProducts.map(item => item.productId);

          // Fetch product details
          const productResponse = await fetchProductDetails({ ids: productIds });

          if (productResponse.data.success) {
            const productsMap = productResponse.data.products.reduce((map, product) => {
              map[product._id] = product;
              return map;
            }, {});

            const detailedCartItems = cartProducts.map(item => ({
              ...item,
              ...(productsMap[item.productId] || {})
            }));

            setCartItems(detailedCartItems);
          } else {
            console.error('Failed to fetch product details:', productResponse.data.message);
            setError('Failed to fetch product details');
          }
        } else {
          console.error('Failed to fetch cart items:', response.data.message);
          setError('Failed to fetch cart items');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('An error occurred while fetching cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleBuyNow = () => {
    navigate('/checkout');
};

  const handleQuantityChange = async (productId, quantityChange) => {
    try {
        const userId = JSON.parse(localStorage.getItem('user'))._id;
        
        const updateCartItems = (cartItems, productId, quantityChange) => {
          const updatedCartItems = cartItems
          .map(item => ({
              productId: item.productId,
              quantity: item.productId === productId
                  ? item.quantity + quantityChange
                  : item.quantity
          }))
          .filter(item => item.quantity > 0); // Remove items with zero quantity
      
      return updatedCartItems;
  };

        const updatedCartItems = updateCartItems(cartItems, productId, quantityChange);

        // Update cart in the backend
        const response = await updateCartApi(userId, { items: updatedCartItems });

        if (response.data.success) {
            setCartItems(updatedCartItems);
        } else {
            console.error('Failed to update cart:', response.data.message);
            setError('Failed to update cart');
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        setError('Failed to update cart');
    }
};

  

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <div>
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center border p-4 rounded-lg shadow-md">
                <img 
                  src={`http://localhost:5500/products/${item.productImage}`} 
                  alt={item.productName || 'No Image'} 
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{item.productName || 'No Name'}</h2>
                  <p className="text-gray-600">{item.productDescription || 'No Description'}</p>
                  <p className="text-lg font-medium">Rs. {item.productPrice?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleQuantityChange(item.productId, -1)} 
                    className="bg-gray-200 px-2 py-1 rounded text-gray-600"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.productId, 1)} 
                    className="bg-gray-200 px-2 py-1 rounded text-gray-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="text-right font-bold text-xl mt-4">
              Total: Rs. {cartItems.reduce((total, item) => total + (item.productPrice || 0) * (item.quantity || 0), 0).toFixed(2)}
            </div>
            <div className="mt-6 text-center">
              <button onClick={handleBuyNow} className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600">

                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
