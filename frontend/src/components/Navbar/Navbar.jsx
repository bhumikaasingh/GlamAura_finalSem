import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ searchQuery, setSearchQuery, cartItems }) => {
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Ensure cartItems is defined and has a length before accessing it
  const cartItemsCount = cartItems ? cartItems.length : 0;

  return (
    <nav className="flex flex-col">
      <div className="flex justify-around items-center bg-black h-10">
        <p className="text-white text-sm">
          Winter Sale for Cosmetics items and Free Delivery - OFF 20%!
        </p>
        <Link to="/shop" className="text-white text-sm underline">
          Shop Now
        </Link>
      </div>
      <div className="flex pl-12 pr-22 items-center justify-between bg-white h-20">
        <div>
          <img
            src="/assets/images/GlamAura2.png" // logo change here 
            className="h-20"
            alt="GlamAuraCosmetics Logo"
          />
        </div>
        <div>
          <ul className="flex items-center">
            <li className="px-4">
              <Link to="/">Home</Link>
            </li>
            <li className="px-4">
              <Link to="/shop">Shop</Link>
            </li>
            <li className="px-4">
              <Link to="/about">About</Link>
            </li>
            <li className="px-4">
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center">
          <div className="flex w-80 items-center px-4 relative">
            <img
              className="absolute pl-5 left-3 top-1/2 transform -translate-y-1/2"
              src="/assets/Navbarimage/search.png"
              alt="Search Icon"
            />
            <input
              className="pl-10 py-2 rounded-xl bg-gray-200 border-black w-full"
              type="text"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              value={searchQuery}
            />
          </div>
          <div className="px-8 flex flex-row">
            <Link to="/cart">
              <img src="/assets/Navbarimage/cart.png" alt="Cart" />
            </Link>
            <span className="ml-1 text-xs text-gray-800">
              {cartItemsCount > 0 ? `(${cartItemsCount})` : null}
            </span>
          </div>
          <div className="px-4 relative">
            <button
              onClick={() => setDropDownOpen(!isDropDownOpen)}
              className="flex items-center"
              aria-haspopup="true"
              aria-expanded={isDropDownOpen}
            >
              <img src="/assets/Navbarimage/user.png" alt="User" />
            </button>
            {isDropDownOpen && (
              <div className="absolute top-full mt-2 w-48 bg-white shadow-lg rounded-lg">
                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Profile
                </Link>
                <Link to="/profile/order" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Orders
                </Link>
                <button onClick={handleLogOut} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;