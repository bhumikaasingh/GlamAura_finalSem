import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/category', label: 'Categories' },
    { path: '/admin/dashboard/profile', label: 'Profile' },
    { path: '/admin/order', label: 'Orders' }
  ];

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/admin/dashboard" className="text-2xl font-bold">
          Admin Panel
        </Link>
        <ul className="flex space-x-4">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`hover:bg-gray-700 px-4 py-2 rounded transition duration-300 ${
                  location.pathname === link.path ? 'bg-gray-700' : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
