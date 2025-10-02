const axios = require('axios');

module.exports = async (userEmail, subject, htmlTemplate) => {
    try {
        const payload = {
        from: 'Blog App <onboarding@resend.dev>',
        to: [userEmail],
        subject,
        html: htmlTemplate,
        };

        const res = await axios.post('https://api.resend.com/emails', payload, {
        headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        },});

        console.log('Email sent:', res.data);
        } 
        catch (error) {
        console.error('Resend error:', error.response?.data || error.message);
        throw new Error('Internal server error (Resend)');
        }
};
