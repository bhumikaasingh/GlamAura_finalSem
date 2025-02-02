import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { singleOrderApi } from '../../../api/Api'; // Adjust the path as necessary

const OrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = JSON.parse(localStorage.getItem('user'))?._id;

      try {
        const response = await singleOrderApi(userId);
        if (response.data.success) {
          setOrders(response.data.orders); // Set all orders
        } else {
          setError(response.data.message || 'Failed to fetch orders');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Order List</h1>
      {orders.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Total Amount</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Tracking</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr 
                key={order._id} 
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/orders/${order._id}`)} // Navigate to order details page
              >
                <td className="py-2 px-4 border-b">{order._id}</td>
                <td className="py-2 px-4 border-b">Rs. {order.totalAmount.toFixed(2)}</td>
                <td className={`py-2 px-4 border-b ${order.status === 'completed' ? 'text-green-500' : 
                                                    order.status === 'pending' ? 'text-yellow-500' : 
                                                    order.status === 'shipped' ? 'text-blue-500' : 'text-gray-500'}`}>
                  {order.status}
                </td>
                <td className={`py-2 px-4 border-b ${order.tracking === 'Completed' ? 'text-green-500' : 
                                                    order.tracking === 'Pending' ? 'text-yellow-500' : 
                                                    'text-gray-500'}`}>
                  {order.tracking}
                </td>
                <td className="py-2 px-4 border-b text-blue-500 underline">
                  View Details
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No orders found</p>
      )}
    </div>
  );
};

export default OrderPage;
