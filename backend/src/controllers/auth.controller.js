import cloudinary from "../lib/cloudinary.js";
import { generate_token } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import crypto from "crypto";

import { sendEmail } from "../lib/sendEmail.js"

export const signup = async (req, res) => {

    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "The password must be above 6 characters" })
        }
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = User({
            fullName,
            email,
            password: hashPassword
        })
        if (newUser) {
            generate_token(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({ message: "Invalid User data" })
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 🔥 Prevent Google users from logging in via password
        if (user.provider === "google") {
            return res.status(400).json({
                message: "Please login using Google",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generate_token(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged Out Successfully" })
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server error" })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(401).json({ message: "Profile Pic is required" })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, { folder: "chat-app/profile-pics" })
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        res.json(updatedUser)
    } catch (err) {
        console.log("Error in update Profile router " + err.message);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.log("Error in check Auth controller " + err.message);
        res.status(500).json({ message: "Internal Server error" })
    }
}

export const googleCallback = async (req, res) => {
    try {
        const user = req.user; // Passport sets this

        // Use same JWT function
        generate_token(user._id, res);

        // Redirect to frontend home page
        res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");

    } catch (error) {
        console.log("Error in Google OAuth", error.message);
        res.status(500).json({ message: "OAuth failed" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            // Return success even if user doesn't exist for security reasons
            return res.status(200).json({ 
                message: "If an account with that email exists, a reset link has been sent." 
            });
        }

        // Prevent Google users from trying to reset a password they don't have
        if (user.provider === "google") {
            return res.status(400).json({
                message: "You signed up using Google. Please log in with Google.",
            });
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

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password for Chattify.</p>
                <p>Please click the button below to set a new password. This link is valid for 10 minutes:</p>
                <a href="${resetUrl}" 
                style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
                </a>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>If you did not request this, please ignore this email.</p>
            </div>`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Request",
                message: message,
                html: htmlContent,
            });

            res.status(200).json({
                message: "If an account with that email exists, a reset link has been sent.",
            });
        } catch (error) {
            // If email fails, clear the token so they can try again
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            console.log("Email sending error:", error);
            return res.status(500).json({ message: "Error sending email. Please try again later." });
        }
    } catch (error) {
        console.log("Error in forgotPassword controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // console.log("--- DEBUG START ---");
        // console.log("Raw Token from URL:", token);
        // console.log("Hashed Token to search:", hashedToken);

        // Find user by token ONLY first
        const user = await User.findOne({ passwordResetToken: hashedToken });

        if (!user) {
            console.log("❌ ERROR: No user found with this token in DB.");
            return res.status(400).json({ message: "Token is invalid" });
        }

        // console.log("✅ User Found:", user.email);
        // console.log("DB Expiry Time:", user.passwordResetExpires);
        // console.log("Current Time:", new Date());

        if (user.passwordResetExpires < Date.now()) {
            console.log("❌ ERROR: Token has expired.");
            return res.status(400).json({ message: "Link has expired" });
        }

        // If we got here, everything is correct
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        console.log("✅ Password successfully reset!");
        res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        console.log("CRASH ERROR:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};