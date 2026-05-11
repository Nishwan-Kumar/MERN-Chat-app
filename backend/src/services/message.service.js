import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/Socket.js";
import AppError from "../lib/AppError.js"
import {logEvent} from "./eventLog.service.js"

export const getUsersForSidebar = async(loggedInUserId)=>{
    const filteredUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
    return filteredUser
}

export const getMessages = async (userToChatId,myId)=>{
    const messages = await Message.find({
        $or:[
            {senderId:myId,receiverId:userToChatId},
            {senderId:userToChatId,receiverId:myId}
        ]
    }).sort({createdAt:1})
    return messages
}

export const sendMessage = async ({text,image},receiverId,senderId)=>{
        let imageUrl;
        if (!text && !image) {
            throw new AppError("Message cannot be empty", 400);
        }

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image,{folder: "chat-app/messages"});
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        logEvent({
            userId: senderId,
            eventType: "SEND_MESSAGE",
            message: "Message sent",
            metadata: {
                receiverId,
                hasImage: !!image,
            },
        });

        return newMessage
}

export const deleteMessage = async (messageToDeleteId,userId)=>{

  const message = await Message.findById(messageToDeleteId);

  if (!message) {
    throw new AppError("Message not found", 404);
  }

  if (!message.senderId.equals(userId)) {
    throw new AppError("Not authorized to delete this message", 403);
  }

  await message.deleteOne();

  logEvent({
        userId,
        eventType: "DELETE_MESSAGE",
        message: "Message deleted",
        metadata: { messageId:messageToDeleteId },
    });
  
    return { message: "Message deleted successfully" };
};