import React from "react";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";
import Typewriter from "../../../components/Typewriter/Typewriter";

const Homepage = ({ searchQuery, data }) => {
  const searchParams = data.length > 0 ? Object.keys(data[0]) : [];

  const search = (data, query) => {
    if (!query) return data;
    return data.filter((item) =>
      searchParams.some((param) =>
        item[param].toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const filteredData = search(data, searchQuery);

  return (
    <div>
      <Breadcrumb />
      <div className="bg-white text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
  <div className="grid lg:grid-cols-2 items-center justify-items-center gap-5">
    <div className="order-1 lg:order-1 shadow-2xl">
      <img
        className="h-80 w-80 object-cover lg:w-[500px] lg:h-[500px]"
        src="https://img.freepik.com/premium-psd/top-view-makeup-mock-up-concept_23-2148735086.jpg?w=996"
        alt="GlamAura"
      />
    </div>
    <div className="order-2 lg:order-2 flex flex-col justify-center lg:items-start text-center sm:text-left">
      <p className="mt-2 text-3xl md:text-lg sm:text-sm text-gray-800">Welcome to</p>
      <p className="text-4xl font-bold md:text-7xl text-gray-800">
        <span className="text-red-500">GlamAura</span>
      </p>
      <p className="text-3xl md:text-6xl text-gray-800">
        Your Destination for&nbsp; 
        <span>
          
            <Typewriter
            words={['Beauty.','Elegance.','Style.']}
            loop={5}
            cursor
            cursorStyle="|"
            typeSpeed={40}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </span>
      </p>
      <p className="mt-2 lg:text-3xl md:text-lg sm:text-sm text-gray-800"> 
        Explore premium cosmetics designed to enhance your look and celebrate your unique beauty.
      </p>
      <div className="flex">
        <button className="text-lg md:text-2xl bg-red-500 text-white py-2 m-2 px-5 mt-10 hover:bg-gray-800 rounded-full">
          <a href="/contact">Contact Us</a>
        </button>
        <button className="text-lg md:text-2xl bg-red-500 text-white py-2 m-2 px-5 mt-10 hover:bg-gray-800 rounded-full" >
         <a href="/contact">  Shop Now✨ </a>
        </button>
      </div>
    </div>
  </div>
</div>


      <div className="text-center">
        <p className="text-3xl m-8 font-bold">Our Products</p>
      </div>
      <div className="flex flex-wrap justify-center">
        {filteredData.length > 0 ? (
          filteredData.slice(0, 8).map((item) => (
            <div key={item._id} className="w-1/5 p-4">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={`http://localhost:5500/products/${item.productImage.replace(/\s/g, '%20')}
`}
                  alt={item.productName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <Link to={`/product-details/${item._id}`}>
                    <h2 className="text-lg font-bold">{item.productName}</h2> </Link>
                  <p className="text-gray-600">{`Rs.${item.productPrice}`}</p>
                  <p className="text-gray-600">{item.productDescription}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
    
     
  );
};

export default Homepage;