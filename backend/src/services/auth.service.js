import { generate_token } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import crypto from "crypto";
import { sendEmail } from "../lib/sendEmail.js"
import cloudinary from "../lib/cloudinary.js";
import AppError from "../lib/AppError.js"
import { getResetPasswordEmailTemplate  } from "../templates/resetPasswordTemplate.js";
import {logEvent} from "./eventLog.service.js"

export const signup = async ({fullName,email,password}) => {

        if (!fullName || !email || !password) {
            throw new AppError("All fields are required",400)
        }
        if (password.length < 6) {
           throw new AppError("Password must be at least 6 characters",400)
        }
        const user = await User.findOne({ email });
        if (user) throw new AppError("Email already exists",400);

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            password: hashPassword
        })
        const token = generate_token(newUser._id)

        return{
        user:{
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        },token}

}

export const login = async ({email,password}) => {
    if (!email || !password) {
        throw new AppError("All fields are required",400);
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError("Invalid credentials",400);
    }

    //Prevent Google users from logging in via password
    if (user.provider === "google") {
        throw new AppError("Please login using Google",400);
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new AppError("Invalid credentials",400);
    }

    const token = generate_token(user._id);

    logEvent({
        userId: user._id,
        eventType: "LOGIN",
        message: "User logged in",
    });

    return {
        user:{
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
    },token};
};

export const googleCallback = async (user) => {
    const token = generate_token(user._id);
    logEvent({
        userId: user._id,
        eventType: "GOOGLE_LOGIN",
        message: "User logged in via Google",
    });

    return token
    
}

export const updateProfile = async (userId,profilePic) => {
    if (!profilePic) {
        throw new AppError("Profile Pic is required",400)
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic, { folder: "chat-app/profile-pics" })
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
    logEvent({
        userId,
        eventType: "UPDATE_PROFILE",
        message: "Profile updated",
    });
    return updatedUser
    
}

export const forgotPassword = async (email) => {

        if (!email) {
            throw new AppError("Email is required",400);
        }

        const user = await User.findOne({ email });

        if (!user) {
            // Return success even if user doesn't exist for security reasons
            return { 
                message: "If an account with that email exists, a reset link has been sent." 
            };
        }

        // Prevent Google users from trying to reset a password they don't have
        if (user.provider === "google") {
            throw new AppError("You signed up using Google. Please log in with Google.",400);
        }

        // Generate unhashed token for the email link
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token to save in database
        user.passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set expiration to 10 minutes from now
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Construct frontend URL
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const message = `You requested a password reset. \n\nClick this link to set a new password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.`;

        const htmlContent = getResetPasswordEmailTemplate(resetUrl)

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request",
                message: message,
                html: htmlContent,
            });

            logEvent({
                userId: user._id,
                eventType: "RESET_PASSWORD",
                message: "Password reset requested",
            });

            return {
                message: "If an account with that email exists, a reset link has been sent.",
            };

        } catch (error) {
            // If email fails, clear the token so they can try again
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            throw new AppError("Error sending email. Please try again later",400)
        }
    
};

export const resetPassword = async (token,password) => {

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  
   
    // Find user by token ONLY first
    const user = await User.findOne({ passwordResetToken: hashedToken });

    if (!user) {
        throw new AppError("Token is invalid",400);
    }

    if (user.passwordResetExpires < Date.now()) {
        throw new AppError("Link has expired",400);
    }

    if (password.length < 6) {
        throw new AppError("Password must be at least 6 characters", 400);
    }
    // If we got here, everything is correct
    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    logEvent({
        userId: user._id,
        eventType: "RESET_PASSWORD_SUCCESS",
        message: "Password reset successful",
    });

    return {message: "Password reset successful" };
};
