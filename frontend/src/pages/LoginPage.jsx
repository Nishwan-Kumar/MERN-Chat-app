import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, LockIcon, Mail, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [showPassword, setShowPassowrd] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const { logIn, isLoggingIn } = useAuthStore()

    const validateForm = () => {
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) return toast.error("Email is Invalid");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password length must me minimum 6 charcters");
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validateForm()
        if (success == true) {
            logIn(formData)
        }
    }
    return (
        <div className='grid lg:grid-cols-2'>
            {/* Left Side */}
            <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
                <div className='w-full max-w-md space-y-8'>
                    {/* Logo */}
                    <div className='text-center mb-8'>
                        <div className='flex flex-col items-center gap-2 group'>
                            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                                <MessageSquare className='size-6 text-primary' />
                            </div>
                            <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
                            <p className='text-base-content-60'>Log in to your Account</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className='space-y-6'>

                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text font-medium'>Email</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Mail className='size-5 text-base-content/40'></Mail>
                                </div>
                                <input type="email"
                                    className='input input-bordered w-full pl-10'
                                    placeholder='you@example.com'
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>

                        <div className='form-control'>
                            <label className='label'>
                                <span className='label-text font-medium'>Password</span>
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <LockIcon className='size-5 text-base-content/40'></LockIcon>
                                </div>
                                <input type={showPassword ? "text" : "password"}
                                    className='input input-bordered w-full pl-10'
                                    placeholder='***********'
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                <button type='button'
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                    onClick={() => setShowPassowrd(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff className='size-5 text-base-content/40'></EyeOff>
                                    ) : (
                                        <Eye className='size-5 text-base-content/40'></Eye>
                                    )}
                                </button>
                            </div>
                        </div>
                        <button type='submit' className='btn btn-primary w-full' disabled={isLoggingIn}>
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className='size-5 animate-spin'>Loading...</Loader2>
                                </>
                            ) : (
                                "Log in"
                            )}
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className='flex items-center gap-3 my-2'>
                        <div className='flex-1 h-px bg-base-300'></div>
                        <span className='text-sm text-base-content/40'>OR</span>
                        <div className='flex-1 h-px bg-base-300'></div>
                    </div>

                    {/* Google OAuth Button */}
                    <a
                        href='http://localhost:5001/api/auth/google'
                        className='btn btn-outline w-full flex items-center gap-2'
                    >
                        <img
                            src='https://www.svgrepo.com/show/475656/google-color.svg'
                            alt='Google'
                            className='size-5'
                        />
                        Continue with Google
                    </a>

                    <div className='text-center'>
                        <p className='text-base-content/60'>
                            Don't have an account?{" "}
                            <Link to={"/signup"} className='link link-primary'>Sign Up</Link></p>
                    </div>
                </div>
            </div>
            {/* Right side */}
            <div>
                <AuthImagePattern
                    title="Join Our Community"
                    subtitle="Connect witn friends, Share moments, and stay in touch with your loved ones."
                ></AuthImagePattern>
            </div>
        </div>
    )
}

export default LoginPage