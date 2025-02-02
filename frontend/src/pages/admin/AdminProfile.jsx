import React, { useState, useEffect } from 'react';
import { getAllUsersApi, deleteUserApi } from '../../api/Api'; // Assuming this is the correct import path
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar/AdminNavbar'

const AdminProfile = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsersApi()
      .then((res) => {
        console.log(res.data); // Log the response data for verification
        if (res.data.success) {
          setUsers(res.data.users); // Set the users state with the fetched users array
        } else {
          console.error('API response indicated failure:', res.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleEdit = (userId) => {
    // Navigate to the edit page with the user ID
    // For example, using React Router's useNavigate hook:
    navigate(`/admin/profile/update/${userId}`);
    console.log(`Edit user with ID ${userId}`);
  };

  const handleDelete = (userId) => {
    deleteUserApi(userId)
    .then((res) => {
      console.log(`Delete user with ID ${userId}`, res);
      // Optionally refresh the user list or update the state to remove the deleted user
      setUsers(users.filter(user => user._id !== userId));
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
    });
    console.log(`Delete user with ID ${userId}`);

};

  return (
    <div className="max-w-4xl mx-auto p-4">

<div className='my-3'>
            < AdminNavbar />
        </div>

      <h1 className="text-3xl font-bold mb-4">All Profiles</h1>
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div key={user._id} className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Contact Number: {user.contactNumber}</p>
            {/* Edit and Delete buttons */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleEdit(user._id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProfile;
