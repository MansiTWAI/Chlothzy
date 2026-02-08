import React from 'react';
import Title from '../components/Title';

const FAQ = () => {
  const faqs = [
    { q: "How can I track my order?", a: "Once your order is shipped, you will receive an email and WhatsApp notification with your tracking ID and a link to track your package in real-time." },
    { q: "Do you offer international shipping?", a: "Currently, Chlothzy ships within India. We are working on expanding our elegance to international borders soon." },
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI (Google Pay, PhonePe), and Net Banking via our secure payment gateway." },
    { q: "Can I change my shipping address after placing an order?", a: "Address changes are only possible within 2 hours of placing the order. Please contact our concierge team immediately via WhatsApp." }
  ];

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-10 border-t'>
      <Title text1={'FREQUENTLY'} text2={'ASKED QUESTIONS'} />
      <div className='mt-12 max-w-3xl mx-auto space-y-8'>
        {faqs.map((item, index) => (
          <div key={index} className='border-b border-gray-200 pb-6'>
            <p className='text-lg font-serif font-medium text-gray-800 mb-2'>{item.q}</p>
            <p className='text-gray-600 leading-relaxed'>{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;