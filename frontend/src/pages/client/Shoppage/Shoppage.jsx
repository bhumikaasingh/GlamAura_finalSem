import React from "react";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";

const Shoppage = ({ searchQuery, data }) => {
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
      <div className="text-center">
        <p className="text-3xl m-8 font-bold">All Products</p>
      </div>
      <div className="flex flex-wrap justify-center">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
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

export default Shoppage;