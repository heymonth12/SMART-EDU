import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
});

export const sendOTP= async(email , otp)=>{    
    const mailoption = {
        from:process.env.EMAIL,
        to:email,
        subject:"password reset request",
        text:`we have receieved a password reset request from ${email} for the same otp is ${otp} `
    }

    try {
        await transporter.sendMail(mailoption);
        console.log('email sent successfully');
        return true;
    } catch (error) {
        console.error("error in mail sending ", error);
        return false;
    }


}