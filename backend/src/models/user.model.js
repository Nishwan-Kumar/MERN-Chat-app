import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true
        },
        fullName:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:false,
            minlength:6,
            default: null
        },
        googleId: {
            type: String,
            default: null,   // 👈 For OAuth users
        },
        provider: {
            type: String,
            default: "local",  // "local" or "google"
        },
        profilePic:{
            type:String,
            default:""
        },
        passwordResetToken: {
            type: String,
            default: undefined
        },
        passwordResetExpires: {
            type: Date,
            default: undefined
        }
    },
    {
        timestamps:true
    }
);


const User = mongoose.model("user",userSchema);

export default User;