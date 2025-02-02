import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">CALL US</h2>
          <p>9812345678, 9853626323</p>
          <h2 className="text-lg font-semibold mt-4 mb-2">LOCATION</h2>
          <p>121 Pokhara, Nepal</p>
          <p>121 Kathmandu, Nepal</p>
          <h2 className="text-lg font-semibold mt-4 mb-2">BUSINESS HOURS</h2>
          <p>Sun - Fri - 9:00 am - 5:00 pm</p>
          <p>Sat - 9:00 am - 1:00 pm</p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">SEND A MESSAGE</h2>
          <form action="" className="flex flex-col space-y-4">
            <input type="text" placeholder="Name" required className="p-2 border border-gray-300 rounded" />
            <input type="email" placeholder="Email" required className="p-2 border border-gray-300 rounded" />
            <input type="text" placeholder="Subject" required className="p-2 border border-gray-300 rounded" />
            <textarea placeholder="Message" required className="p-2 border border-gray-300 rounded h-32"></textarea>
            <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Send Message</button>
          </form>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">OUR LOCATION</h2>
          <div className="relative h-0 pb-2/3">
          <iframe
          title='map'
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d220.873715707!2d85.37375685364802!3d27.656107459511844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb117fb0c15927%3A0x35bdadcb934eb7ce!2sRIIBAA!5e0!3m2!1sen!2snp!4v1721060821812!5m2!1sen!2snp"
              width="100%"
              height={350}
              style={{ border: 0 }}
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;