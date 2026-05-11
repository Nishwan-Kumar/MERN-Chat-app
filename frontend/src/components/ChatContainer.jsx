import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageSkeleton from './Skeletons/MessageSkeleton'
import MessageInput from './MessageInput'
import { useAuthStore } from '../store/useAuthStore'
import { motion,AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";


const chatContainer = () => {
  const {messages,getMessages,isMessagesLoading,selectedUser,listenToMessages,notListenToMessages,deleteMessage}=useChatStore()
  const {authUser} = useAuthStore();
  const messageEndRef =useRef()
  const [selectedMsg, setSelectedMsg] = React.useState(null);
  const [showMenu, setShowMenu] = React.useState(false);

  const handleDelete = async (messageId,userId) => {
    console.log("Deleted initiated")
    const confirmDelete = window.confirm("Delete this message?");
    if (!confirmDelete) return;

    await deleteMessage(messageId,userId);
  };

  let pressTimer;

  const handleTouchStart = (message) => {
    pressTimer = setTimeout(() => {
      setSelectedMsg(message);
      setShowMenu(true);
    }, 600); // 600ms press
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  useEffect(()=>{
    getMessages(selectedUser._id)
    listenToMessages();
    return ()=>notListenToMessages();
  },[selectedUser._id,getMessages,listenToMessages,notListenToMessages])

  useEffect(()=>{
    if(messageEndRef.current&&messages){
      messageEndRef.current.scrollIntoView({behavior:"smooth"})
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
        <AnimatePresence>
        {messages.map((message,index)=>(
          <div
          key={message._id}
          className={`chat ${message.senderId===authUser._id?"chat-end":"chat-start"}`}
          ref={index === messages.length - 1 ? messageEndRef : null}>
            <motion.div
              key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              // Animation properties
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ 
                opacity: 0, 
                scale: 0.7, 
                y: -20,
                transition: { duration: 0.3 }
              }}
              transition={{ duration: 0.25 }}
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
              <div className="chat-bubble flex flex-col "
                onTouchStart={() => handleTouchStart(message)}
                onTouchEnd={handleTouchEnd}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSelectedMsg(message);
                  setShowMenu(true);
                }}>
                {message.image&&(<img src={message.image} alt='attachement' className='sm:max-w-[200px] rounded-md mb-2'></img>)}
                {message.text&&<p>{message.text}</p>}
                {message.senderId === authUser._id && (
                    <button
                      onClick={() => handleDelete(message._id)}
                      className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                </div>
                {showMenu && selectedMsg && (
                  <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 rounded-t-xl">
                    
                    <button
                      onClick={() => {
                        handleDelete(selectedMsg._id,authUser._id);
                        setShowMenu(false);
                      }}
                      className="w-full text-red-500 text-lg py-2"
                    >
                      Delete Message
                    </button>

                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full text-white py-2"
                    >
                      Cancel
                    </button>

                  </div>
                )}
              <div className="chat-footer opacity-50">Delivered</div>
            </motion.div>
          </div>
        ))}
        </AnimatePresence>
      </div>
      <MessageInput />
    </div>
  )
}

export default chatContainer