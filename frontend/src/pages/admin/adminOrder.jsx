import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi, updateOrderApi, deleteOrderApi, singleProductApi } from '../../api/Api'; 
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'


const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // For the selected order in the popup
  const [showPopup, setShowPopup] = useState(false); // For popup visibility
  const [showDetailsPopup, setShowDetailsPopup] = useState(false); // For order details popup
  const [products, setProducts] = useState({}); // To store product details by ID

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi();
        if (response.data.success) {
          setOrders(response.data.orders);
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

  useEffect(() => {
    if (selectedOrder && selectedOrder.items) {
      const fetchProducts = async () => {
        const newProducts = {};
        for (const item of selectedOrder.items) {
          if (!newProducts[item.productId]) {
            try {
              const productResponse = await singleProductApi(item.productId);
              if (productResponse.success) {
                newProducts[item.productId] = productResponse.product;
              } else {
                console.error('Product fetch error:', productResponse.message);
              }
            } catch (err) {
              console.error('Failed to fetch product details', err);
            }
          }
        }
        console.log('Fetched products:', newProducts);
        setProducts(prevProducts => ({ ...prevProducts, ...newProducts }));
      };

      fetchProducts();
    }
  }, [selectedOrder]);

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      const response = await updateOrderApi(selectedOrder._id, {
        orderId: selectedOrder._id,
        status: selectedOrder.status,
        tracking: selectedOrder.tracking,
      });

      if (response.data.success) {
        setOrders(orders.map(order => order._id === selectedOrder._id ? selectedOrder : order));
        setShowPopup(false);
      } else {
        setError(response.data.message || 'Failed to update order');
      }
    } catch (err) {
      setError(err.message || 'Failed to update order');
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      const response = await deleteOrderApi(selectedOrder._id);
      if (response.data.success) {
        setOrders(orders.filter(order => order._id !== selectedOrder._id));
        setShowDetailsPopup(false);
      } else {
        setError(response.data.message || 'Failed to delete order');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete order');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">

<div className='my-3'>
            < AdminNavbar />
        </div>

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
              <tr key={order._id} className="hover:bg-gray-100 cursor-pointer">
                <td className="py-2 px-4 border-b">{order._id}</td>
                <td className="py-2 px-4 border-b">Rs. {order.totalAmount.toFixed(2)}</td>
                <td className={`py-2 px-4 border-b ${order.status === 'Completed' ? 'text-green-500' : 
                                                    order.status === 'Pending' ? 'text-yellow-500' : 
                                                    order.status === 'Cancelled' ? 'text-red-500' : 'text-gray-500'}`}>
                  {order.status}
                </td>
                <td className={`py-2 px-4 border-b ${order.tracking === 'Delivered' ? 'text-green-500' : 
                                                    order.tracking === 'Pending' ? 'text-yellow-500' : 
                                                    order.tracking === 'Shipped' ? 'text-blue-500' : 
                                                    order.tracking === 'Out For Delivery' ? 'text-purple-500' : 'text-gray-500'}`}>
                  {order.tracking}
                </td>
                <td className="py-2 px-4 border-b text-blue-500 underline flex space-x-4">
                  <button 
                    onClick={() => { 
                      setSelectedOrder(order); 
                      setShowDetailsPopup(true); 
                    }} 
                    className="text-blue-500 underline"
                  >
                    View Items
                  </button>
                  <button 
                    onClick={() => { 
                      setSelectedOrder(order); 
                      setShowPopup(true); 
                    }} 
                    className="text-yellow-500 underline"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No orders found</p>
      )}

      {/* Update Order Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Update Order</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Status</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md"
                value={selectedOrder.status}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Tracking</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md"
                value={selectedOrder.tracking}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, tracking: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={handleUpdateOrder} 
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button 
                onClick={() => setShowPopup(false)} 
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Popup */}
      {showDetailsPopup && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl">
            <h2 className="text-2xl mb-4">Order Details</h2>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Order ID: {selectedOrder._id}</h3>
              <p className="text-gray-700">Total Amount: Rs. {selectedOrder.totalAmount.toFixed(2)}</p>
              <p className="text-gray-700">Status: {selectedOrder.status}</p>
              <p className="text-gray-700">Tracking: {selectedOrder.tracking}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Items</h3>
              {selectedOrder.items.map(item => (
                <div key={item.productId} className="mb-2">
                  <p className="text-gray-700">Product Name: {products[item.productId]?.name || 'Loading...'}</p>
                  <p className="text-gray-700">Price: Rs. {products[item.productId]?.price?.toFixed(2) || 'Loading...'}</p>
                  <p className="text-gray-700">Quantity: {item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={handleDeleteOrder} 
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Order
              </button>
              <button 
                onClick={() => setShowDetailsPopup(false)} 
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderPage;
