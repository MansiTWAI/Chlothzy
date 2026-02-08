import React from 'react';
import Title from '../components/Title';
import { Mail, MessageCircle, Clock } from 'lucide-react';

const CustomerService = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-10 border-t'>
      <Title text1={'CUSTOMER'} text2={'CONCIERGE'} />
      <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='border p-10 text-center flex flex-col items-center gap-4 hover:bg-[#78350F] hover:text-white transition-all group'>
          <MessageCircle className='text-[#78350F] group-hover:text-white' size={40} />
          <h3 className='font-serif text-xl'>WhatsApp Support</h3>
          <p className='text-sm opacity-80'>Instant help for order tracking and sizing.</p>
          <p className='font-bold'>+91 9211364653</p>
        </div>
        <div className='border p-10 text-center flex flex-col items-center gap-4 hover:bg-[#78350F] hover:text-white transition-all group'>
          <Mail className='text-[#78350F] group-hover:text-white' size={40} />
          <h3 className='font-serif text-xl'>Email Us</h3>
          <p className='text-sm opacity-80'>For business inquiries and formal complaints.</p>
          <p className='font-bold'>contact@chlothzy.shop</p>
        </div>
        <div className='border p-10 text-center flex flex-col items-center gap-4 hover:bg-[#78350F] hover:text-white transition-all group'>
          <Clock className='text-[#78350F] group-hover:text-white' size={40} />
          <h3 className='font-serif text-xl'>Operating Hours</h3>
          <p className='text-sm opacity-80'>We are here to help you.</p>
          <p className='font-bold'>Mon - Sat: 10AM - 7PM</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerService;