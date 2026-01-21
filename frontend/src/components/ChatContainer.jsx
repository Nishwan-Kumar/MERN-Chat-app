import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageSkeleton from './Skeletons/MessageSkeleton'
import MessageInput from './MessageInput'
import { useAuthStore } from '../store/useAuthStore'
import { motion } from "framer-motion";


const chatContainer = () => {
  const {messages,getMessages,isMessagesLoading,selectedUser,listenToMessages,notListenToMessages}=useChatStore()
  const {authUser} = useAuthStore();
  const messageEndRef =useRef()

  useEffect(()=>{
    getMessages(selectedUser._id)
    listenToMessages();
    return ()=>notListenToMessages();
  },[selectedUser._id,getMessages,listenToMessages,notListenToMessages])

  useEffect(()=>{
    if(messageEndRef.current&&messages){
      messageEndRef.current.scrollIntoView({behaviour:"smooth"})
    }
  },[messages])

  if(isMessagesLoading){
     return (<div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <MessageSkeleton />
      <MessageInput />
    </div>)
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message)=>(
          <div
          key={message._id}
          className={`chat ${message.senderId===authUser._id?"chat-end":"chat-start"}`}
          ref={messageEndRef} >
            <motion.div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              // Animation properties
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className='chat-image avatar'>
                <div className='size-10 rounded-full border'>
                  <img src={message.senderId === authUser._id?authUser.profilePic || "/avatar.png":selectedUser.profilePic || "/avatar.png"} alt="profile-pic" />
                </div>
              </div>
              <div className="chat-header mb-1">
                {message.senderId===authUser._id?authUser.fullName:selectedUser.fullName}
                <time className="text-xs opacity-50">
                  {message.createdAt}
                </time>
              </div>
              <div className="chat-bubble">{message.image&&(<img src={message.image} alt='attachement' className='sm:max-w-[200px] rounded-md mb-2'></img>)}{message.text&&<p>{message.text}</p>}</div>
              <div className="chat-footer opacity-50">Delivered</div>
            </motion.div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  )
}

export default chatContainer