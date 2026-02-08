import React from 'react';
import Title from '../components/Title';

const RefundReturn = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-10 border-t'>
      <Title text1={'REFUND &'} text2={'RETURNS'} />
      <div className='mt-12 text-gray-600 leading-relaxed space-y-6 max-w-4xl'>
        <section>
          <h3 className='text-xl font-serif text-gray-800 mb-3'>7-Day Return Policy</h3>
          <p>We want you to be completely satisfied with your Chlothzy purchase. You may return any unworn, unwashed item with original tags attached within 7 days of delivery.</p>
        </section>
        <section>
          <h3 className='text-xl font-serif text-gray-800 mb-3'>Non-Returnable Items</h3>
          <p>Items purchased during "Final Sale" or personalized garments cannot be returned or exchanged unless there is a manufacturing defect.</p>
        </section>
        <section>
          <h3 className='text-xl font-serif text-gray-800 mb-3'>Refund Process</h3>
          <p>Once we receive and inspect your return, we will process your refund within 5-7 business days. The amount will be credited back to your original payment method.</p>
        </section>
      </div>
    </div>
  );
};

export default RefundReturn;