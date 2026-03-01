import mongoose from "mongoose";

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
        }
    },
    {
        timestamps:true
    }
);

const User = mongoose.model("user",userSchema);

export default User;