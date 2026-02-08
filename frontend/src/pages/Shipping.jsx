import React from 'react';
import Title from '../components/Title';

const Shipping = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-10 border-t'>
      <Title text1={'SHIPPING'} text2={'POLICY'} />
      <div className='mt-12 text-gray-600 leading-relaxed space-y-6 max-w-4xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 border-b pb-10'>
          <div>
            <h3 className='text-xl font-serif text-gray-800 mb-3'>Standard Shipping</h3>
            <p>Delivery within 5-7 business days. Free on all orders above ₹1999.</p>
          </div>
          <div>
            <h3 className='text-xl font-serif text-gray-800 mb-3'>Express Delivery</h3>
            <p>Available in select metros (Mumbai, Delhi, Bangalore). Delivery within 48 hours for an additional fee.</p>
          </div>
        </div>
        <p className='italic text-sm'>*Please note that during peak seasons or sale periods, delivery may take slightly longer.</p>
      </div>
    </div>
  );
};

export default Shipping;