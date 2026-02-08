import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { useNavigate } from 'react-router-dom'

const Contact = () => {

  const navigate = useNavigate();

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'CHLOTHZY'}/>
      </div>

      <div className='my-20 flex flex-col justify-center md:flex-row gap-12 lg:gap-24 mb-28 items-center'>
        
        {/* Contact Image */}
        <img 
          className='w-full md:max-w-[480px] rounded-sm shadow-sm' 
          src={assets.contact_img} 
          alt="Chlothzy Concierge Support" 
        />

        {/* Contact Details */}
        <div className='flex flex-col justify-center items-start gap-8 md:w-1/2'>
          
          <div className='space-y-4'>
            <p className='font-serif font-bold text-2xl text-gray-800'>Our Atelier</p>
            <p className='text-gray-600 leading-relaxed'>
              Unit 132, Malabar Hills, <br /> 
              Mumbai, Maharashtra, 400006
            </p>
          </div>

          <div className='space-y-4'>
            <p className='font-serif font-bold text-2xl text-gray-800'>Get In Touch</p>
            <p className='text-gray-600 leading-relaxed'>
              <span className='font-medium text-gray-800'>WhatsApp:</span> +91 9211364653 <br /> 
              <span className='font-medium text-gray-800'>Email:</span> contact@chlothzy.shop
            </p>
            <p className='text-gray-600'>
              <span className='font-medium text-gray-800'>Instagram:</span> @chlothzy
            </p>
          </div>

          {/* New Shopping Section instead of Careers */}
          <div className='space-y-4'>
            <p className='font-serif font-bold text-2xl text-gray-800'>Step into Style</p>
            <p className='text-gray-600 leading-relaxed max-w-sm'>
              Discover our latest curation of premium formal and casual wear designed for the modern individual.
            </p>
            <button 
              onClick={() => { navigate('/collection'); window.scrollTo(0,0); }}
              className='border border-[#78350F] text-[#78350F] px-10 py-4 text-sm font-semibold hover:bg-[#78350F] hover:text-white transition-all duration-500 rounded-sm tracking-widest'
            >
              EXPLORE COLLECTION
            </button>
          </div>

        </div>
      </div>

      <div className='pb-20'>
        <NewsletterBox />
      </div>
    </div>
  )
}

export default Contact