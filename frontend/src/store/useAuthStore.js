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
    isSendingResetEmail: false,
    isResettingPassword: false,

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

    forgotPassword: async (email) => {
        set({ isSendingResetEmail: true });
        try {
            // Notice we use /auth/ because your other routes use it (e.g., /auth/login)
            const res = await axiosInstance.post("/auth/forgot-password", { email });
            toast.success(res.data.message || "Reset link sent successfully!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send reset link");
            return false;
        } finally {
            set({ isSendingResetEmail: false });
        }
    },

    resetPassword: async (token, password) => {
        set({ isResettingPassword: true });
        try {
            const res = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
            toast.success("Password reset successfully!");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Reset failed");
            return false;
        } finally {
            set({ isResettingPassword: false });
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

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);

            const start = Date.now();

            socket.emit("pingTest", start);

            socket.off("pongTest"); // prevent duplicates

            socket.on("pongTest", (startTime) => {
                const latency = Date.now() - startTime;
                console.log("🔥 Socket Latency:", latency, "ms");
            });
        });
    },
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect()
    }

}))