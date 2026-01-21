import {create} from "zustand";
import {axiosInstance} from "../lib/axios"
import toast from "react-hot-toast";
import {io} from "socket.io-client"
const BASE_URL = import.meta.env.MODE==="development"?"http://localhost:5001":"/"

export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth:async()=>{
        try{
            const response = await axiosInstance.get("/auth/check");
            set({authUser:response.data})
            get().connectSocket();
        }catch(err){
            console.log("Error in check Auth:",err)
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },

    signUp:async (data)=>{
        set({isSigningUp:true})
        try{
            const res = await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data})
            toast.success("Account created successfully")
            get().connectSocket()
        }catch(err){
            toast.error(err.response.data.message);
        }finally{
            set({isSigningUp:false})
        }
    },

    logIn:async (data)=>{
        set({isLoggingIn:true})
        try{
            const res = await axiosInstance.post("/auth/login",data)
            set({authUser:res.data})
            toast.success("Logged in successfully")

            get().connectSocket()
        }catch(err){
            toast.error(err.response.data.message);
        }finally{
            set({isLoggingIn:false})
        }
    },

    logOut:async()=>{
        try{
            await axiosInstance.post('/auth/logout');
            set({authUser:null})
            toast.success("Logged out successfully")
            get().disconnectSocket()
        }catch(err){
            toast.error(err.response.data.message)
        }
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true})
        try{
            const res = await axiosInstance.put("/auth/update-profile",data)
            set({authUser:res.data})
            toast.success("Profile Updated Successfully")
        }catch(err){
            toast.error(err.response.data.message);
        }finally{
            set({isUpdatingProfile:false})
        }
    },

    connectSocket:()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return

        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id
            }
        })
        socket.connect()
        set({socket:socket})
        socket.on("getOnlineUsers",(userId)=>{
            set({onlineUsers:userId})
        })
    },
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect()
    }

}))