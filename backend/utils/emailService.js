const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token, firstName) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    try {
        await resend.emails.send({
            from: 'Dashpay <onboarding@resend.dev>',
            to: email,
            subject: 'Verify your Dashpay account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4F46E5;">Welcome to Dashpay, ${firstName}!</h2>
                    <p>Thank you for signing up. Please verify your email address to start using Dashpay.</p>
                    <div style="margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 6px; display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        This link will expire in 24 hours.
                    </p>
                    <p style="color: #666; font-size: 14px;">
                        If you didn't create this account, please ignore this email.
                    </p>
                </div>
            `
        });
        console.log('Verification email sent successfully to:', email);
    } catch (error) {
        console.error('Resend email error:', error);
        throw error;
    }
};

module.exports = { sendVerificationEmail };
