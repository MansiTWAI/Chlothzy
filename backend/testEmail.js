import transporter from "./config/email.js";

const sendTest = async () => {
  try {
    await transporter.sendMail({
      from: `"Clothzy" <${process.env.EMAIL_USER}>`,
      to: "shuklamansi@1010@gmail.com",
      subject: "Test Email",
      text: "This is a test email from Clothzy"
    });
    console.log("Test email sent ✅");
  } catch (err) {
    console.error("Email failed ❌", err);
  }
};

sendTest();
