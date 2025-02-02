import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-gray-300'>
      <div className='container mx-auto py-10 px-5'>
        <div className='flex flex-wrap justify-between'>
          <div className='w-full md:w-1/3 mb-6 md:mb-0'>
            <h5 className='text-lg font-bold mb-4'>GlamAura</h5>
            <p>Explore the finest beauty products, thoughtfully curated for you. Elevate your beauty routine with our premium selection of top-quality essentials.</p>
          </div>
          <div className='w-full md:w-1/3 mb-6 md:mb-0'>
            <h5 className='text-lg font-bold mb-4'>Quick Links</h5>
            <ul>
              <li className='mb-2'><Link to='#' className='hover:underline'>Home</Link></li>
              <li className='mb-2'><Link to='#' className='hover:underline'>Shop</Link></li>
              <li className='mb-2'><Link to='#' className='hover:underline'>About Us</Link></li>
              <li className='mb-2'><Link to='#' className='hover:underline'>Contact</Link></li>
              <li className='mb-2'><Link to='#' className='hover:underline'>FAQs</Link></li>
            </ul>
          </div>
          <div className='w-full md:w-1/3'>
            <h5 className='text-lg font-bold mb-4'>Contact Us</h5>
            <p className='mb-2'>Email: support@GlamAura.com</p>
            <p className='mb-2'>Phone: +977 9875453432</p>
            <div className='flex mt-4'>
              <Link to='#' className='mr-4'><i className='fab fa-facebook-f'></i></Link>
              <Link to='#' className='mr-4'><i className='fab fa-instagram'></i></Link>
              <Link to='#' className='mr-4'><i className='fab fa-twitter'></i></Link>
              <Link to='#' className='mr-4'><i className='fab fa-pinterest'></i></Link>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-gray-900 text-gray-500 text-center py-4'>
        © 2024 GlamAura. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;