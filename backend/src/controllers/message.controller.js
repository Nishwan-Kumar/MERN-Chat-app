import * as messageService from "../services/message.service.js";

export const getUsersForSidebar = async(req,res,next)=>{
    try{
        const Users = await messageService.getUsersForSidebar(req.user._id) 
        res.status(200).json(Users)
    }catch(error){
        next(error)
    }
}

export const getMessages = async (req,res,next)=>{
    try{
        const messages = await messageService.getMessages(req.params.id,req.user._id)
        res.status(200).json({messages})
    }catch(error){
        next(error)
    }
}

export const sendMessage = async (req,res,next)=>{
    try{
        const newMessage = await messageService.sendMessage(req.body,req.params.id,req.user._id)
        res.status(201).json(newMessage)
    }catch(error){
        next(error)
    }
}

export const deleteMessage = async (req,res,next)=>{
    try{
        const {message} = await messageService.deleteMessage(req.params.id,req.user._id)
        res.status(200).json({message})
    }catch(error){
        next(error)
    }
}