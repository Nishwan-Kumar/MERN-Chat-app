import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/Socket.js";

export const getUsersForSlidebar = async(req,res)=>{
    try{
        const loggedInUserId = req.user._id
        const filteredUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUser)
    }catch(err){
        console.log("Error in getUSerForSlidebar"+err.Message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const getMessages = async (req,res)=>{
    try{
        const {id:userToChatId} = req.params
        const myId  = req.user._id

        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
        res.status(200).json({messages})
    }catch(err){
        console.log("Error in get Meassages "+err.Message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const sendMessage = async (req,res)=>{
    try{
        const {text,image} = req.body
        const {id:receiverId}= req.params
        const senderId = req.user._id

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        await newMessage.save()
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)
    }catch(err){
        console.log("Error in send Meassages "+err.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const deleteMessage = async (req,res)=>{
    try{
        const {id:messageToDeleteId} = req.params
        await Message.findByIdAndDelete(messageToDeleteId)
        res.status(201).json({message:"Message deleted successfully"})
    }catch(err){
        console.log("Error in delete Message "+err.message);
        res.status(500).json({message:"Internal Server Error"})
    }
    
    
}