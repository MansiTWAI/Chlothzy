// emailController.js
import transporter from '../config/email.js';

/**
 * BRAND STYLES - Centralizing colors for consistency
 */
const BRAND_COLOR = '#78350F'; // Your Footer Brown
const ACCENT_COLOR = '#F5F5F4';
const TEXT_COLOR = '#1C1917';

/**
 * Base Email Wrapper Layout
 * Wraps content in a consistent header/footer
 */
const emailWrapper = (content) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; color: ${TEXT_COLOR};">
  <div style="background-color: ${BRAND_COLOR}; padding: 30px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; font-family: serif;">CHLOTHZY</h1>
  </div>
  <div style="padding: 40px 30px;">
    ${content}
  </div>
  <div style="background-color: #F9F8F6; padding: 20px; text-align: center; font-size: 12px; color: #78716c; border-top: 1px solid #eeeeee;">
    <p style="margin: 5px 0;">Unit 132, Malabar Hills, Mumbai, 400006</p>
    <p style="margin: 5px 0;">© ${new Date().getFullYear()} Chlothzy Clothing. All Rights Reserved.</p>
    <div style="margin-top: 10px;">
        <a href="https://www.instagram.com/chlothzy/" style="color: ${BRAND_COLOR}; text-decoration: none; margin: 0 10px;">Instagram</a>
        <a href="#" style="color: ${BRAND_COLOR}; text-decoration: none; margin: 0 10px;">Support</a>
    </div>
  </div>
</div>
`;

// --- Order Confirmation Template ---
const orderConfirmationTemplate = ({ name, orderId, items, total, estimatedDelivery }) => {
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
        <span style="font-weight: 600; display: block;">${item.name}</span>
        <span style="font-size: 12px; color: #666;">Size: ${item.size} | Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; text-align: right; vertical-align: top; font-weight: 600;">
        ₹${item.finalPrice}
      </td>
    </tr>
  `).join('');

  const content = `
    <h2 style="margin-top: 0; color: ${BRAND_COLOR};">Order Confirmed</h2>
    <p>Hello <strong>${name || 'Customer'}</strong>,</p>
    <p>Thank you for choosing Chlothzy. We've received your order and are getting it ready for shipment.</p>
    
    <div style="margin: 25px 0; padding: 20px; border-radius: 8px; background-color: #fcfaf9; border-left: 4px solid ${BRAND_COLOR};">
      <p style="margin: 0; font-size: 14px;"><strong>Order ID:</strong> #${orderId}</p>
      <p style="margin: 5px 0 0; font-size: 14px;"><strong>Est. Delivery:</strong> ${estimatedDelivery}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; font-size: 12px; text-transform: uppercase; color: #a8a29e; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Item</th>
          <th style="text-align: right; font-size: 12px; text-transform: uppercase; color: #a8a29e; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div style="text-align: right; margin-top: 20px;">
      <p style="font-size: 18px; margin: 0;"><strong>Total Amount: ₹${total}</strong></p>
    </div>

    <div style="margin-top: 40px; text-align: center;">
      <a href="#" style="background-color: ${BRAND_COLOR}; color: #ffffff; padding: 14px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">TRACK YOUR ORDER</a>
    </div>
  `;
  return emailWrapper(content);
};

// --- Order Status Template ---
const orderStatusTemplate = ({ name, orderId, status, expectedDelivery }) => {
  const content = `
    <h2 style="margin-top: 0; color: ${BRAND_COLOR};">Order Update</h2>
    <p>Hi ${name || 'Customer'},</p>
    <p>The status of your order <strong>#${orderId}</strong> has been updated:</p>
    
    <div style="background: #fdf8f6; padding: 30px; border-radius: 12px; margin: 25px 0; text-align: center; border: 1px dashed ${BRAND_COLOR};">
      <span style="text-transform: uppercase; font-size: 12px; tracking: 1px; color: #78716c;">Current Status</span>
      <h3 style="margin: 10px 0; color: ${BRAND_COLOR}; font-size: 24px;">${status}</h3>
      ${expectedDelivery ? `<p style="margin: 0; font-size: 14px; color: #444;">Expected Delivery: <strong>${expectedDelivery}</strong></p>` : ''}
    </div>

    <p style="font-size: 14px; line-height: 1.6;">If you have any questions regarding this change, feel free to contact our concierge team by replying to this email.</p>
  `;
  return emailWrapper(content);
};

// --- Exported Sending Functions ---

export const sendOrderConfirmation = async ({ to, name, orderId, items, total, estimatedDelivery }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Chlothzy" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmed: #${orderId} | Chlothzy`,
      html: orderConfirmationTemplate({ name, orderId, items, total, estimatedDelivery }),
      text: `Thank you for your order, ${name}. Order ID: ${orderId}. Total: ₹${total}.`
    });
    console.log(`✅ Confirmation sent to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Mail Error:`, error);
    throw error;
  }
};

export const sendOrderStatusMail = async ({ to, name, orderId, status, expectedDelivery }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Chlothzy" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Update on your Chlothzy order #${orderId}`,
      html: orderStatusTemplate({ name, orderId, status, expectedDelivery }),
      text: `Your order #${orderId} status is now: ${status}.`
    });
    console.log(`✅ Status update sent to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Mail Error:`, error);
    throw error;
  }
};