import React from 'react';
import Title from '../components/Title';

const Terms = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-10 border-t'>
      <Title text1={'TERMS &'} text2={'CONDITIONS'} />
      <div className='mt-12 text-gray-600 text-sm leading-relaxed space-y-6 max-w-5xl bg-gray-50 p-8 rounded-sm'>
        <p>Welcome to Chlothzy. By accessing this website, you agree to comply with and be bound by the following terms and conditions of use...</p>
        <h4 className='font-bold text-gray-800 uppercase'>1. Use of Website</h4>
        <p>The content of the pages of this website is for your general information and use only. It is subject to change without notice.</p>
        <h4 className='font-bold text-gray-800 uppercase'>2. Product Accuracy</h4>
        <p>We strive to display our garment colors and textures as accurately as possible. However, the actual color you see depends on your monitor settings.</p>
      </div>
    </div>
  );
};

export default Terms;