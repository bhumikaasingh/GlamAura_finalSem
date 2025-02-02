import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { singleOrderApiDetails } from '../../../api/Api'; // Ensure paths are correct

const SingleOrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await singleOrderApiDetails(id); // Fetch by order ID
        console.log(response.data); // Log the response data
  
        // Check if the response and order object is valid
        if (response.data.success && response.data.order) {
          setOrder(response.data.order);
        } else {
          setError(response.data.message || 'Order not found or response is malformed');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch order');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]); // Include id in the dependency array

  const makePayment = async (orderId) => {
    return new Promise((resolve) => {
      resolve({
        data: {
          success: true,
          message: 'Payment initiated',
        },
      });
    });
  };

  const handlePayment = async () => {
    try {
      const response = await makePayment(id); // Simulate the payment API call
      console.log(response.data);

      if (response.data.success) {
        const paymentUrl = `https://uat.esewa.com.np/epay/main?tAmt=100&amt=90&txAmt=5&psc=2&pdc=3&scd=EPAYTEST&pid=ee2c3ca1-696b-4cc5-a6be-2c40d929d453&su=http://merchant.com.np/page/esewa_payment_success?q=su&fu=http://merchant.com.np/page/esewa_payment_failed?q=fu
`;
        window.location.href = paymentUrl; // Redirect to eSewa payment page
      } else {
        setError(response.data.message || 'Payment failed or response is malformed');
      }
    } catch (err) {
      setError(err.message || 'Failed to process payment');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      {order ? (
        <div>
          <div className="mb-4 p-4 border border-gray-200 rounded-md">
            <h2 className="text-2xl font-semibold mb-2">Order ID: <span className="text-blue-500">{order._id}</span></h2>
            <p className="text-lg mb-2">Total Amount: <span className="font-semibold">Rs. {order.totalAmount.toFixed(2)}</span></p>
            <p className="text-lg mb-4">Status: 
              <span className={`font-semibold ${order.status === 'completed' ? 'text-green-500' : 
                order.status === 'pending' ? 'text-yellow-500' : 
                order.status === 'shipped' ? 'text-blue-500' : 'text-gray-500'}`}>
                {order.status}
              </span>
            </p>
            
            <p className="text-lg mb-4">Tracking: 
              <span className={`font-semibold ${order.tracking === 'Completed' ? 'text-green-500' : 
                order.tracking === 'Pending' ? 'text-yellow-500' : 
                'text-gray-500'}`}>
                {order.tracking}
              </span>
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-2">Items:</h3>
          <ul className="space-y-4">
            {order.items.map(item => (
              <li key={item.productId} className="p-4 border border-gray-200 rounded-md shadow-sm">
                <h4 className="text-lg font-semibold mb-2">Product ID: {item.productId}</h4>
                <p className="text-gray-700 mb-1">Quantity: <span className="font-semibold">{item.quantity}</span></p>
                
                {/* Add other product details if available */}
              </li>
            ))}
          </ul>

          <button onClick={handlePayment} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600">Make Payment</button>

        </div>
      ) : (
        <p className="text-center text-gray-500">No order found</p>
      )}
    </div>
  );
};

export default SingleOrderPage;
