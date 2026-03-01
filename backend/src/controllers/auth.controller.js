import cloudinary from "../lib/cloudinary.js";
import { generate_token } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

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