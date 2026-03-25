import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, MessageSquare } from 'lucide-react';
import { axiosInstance } from '../lib/axios'; // 👈 Import it normally at the top
import toast from 'react-hot-toast';
import AuthImagePattern from '../components/AuthImagePattern';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic Validations
        if (password !== confirmPassword) return toast.error("Passwords do not match");
        if (password.length < 6) return toast.error("Password must be at least 6 characters");

        setIsSubmitting(true);
        console.log("Attempting to reset password for token:", token); // 👈 Browser Console check

        try {
            // Send the request
            const res = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
            
            toast.success("Password updated! Please log in.");
            navigate("/login");
        } catch (error) {
            console.error("Backend Error:", error.response?.data); // 👈 Helpful for debugging
            toast.error(error.response?.data?.message || "Link expired or invalid");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
          <div className='grid lg:grid-cols-2 min-h-screen'>

            <div className='flex flex-col justify-center items-center p-6 sm:p-12'>

                <div className='w-full max-w-md space-y-8'>

                    <div className='text-center'>

                        <div className='flex flex-col items-center gap-2 group'>

                            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center'>

                                <MessageSquare className='size-6 text-primary' />

                            </div>

                            <h1 className='text-2xl font-bold mt-2'>Set New Password</h1>

                            <p className='text-base-content/60'>Almost there! Enter your new password below.</p>

                        </div>

                    </div>



                    <form onSubmit={handleSubmit} className='space-y-6'>

                        <div className='form-control'>

                            <label className='label'><span className='label-text font-medium'>New Password</span></label>

                            <div className='relative'>

                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'><Lock className='size-5 text-base-content/40' /></div>

                                <input 

                                    type={showPassword ? "text" : "password"}

                                    className='input input-bordered w-full pl-10'

                                    placeholder='••••••••'

                                    value={password}

                                    onChange={(e) => setPassword(e.target.value)}

                                    required

                                />

                                <button type='button' className='absolute inset-y-0 right-0 pr-3 flex items-center' onClick={() => setShowPassword(!showPassword)}>

                                    {showPassword ? <EyeOff className='size-5 text-base-content/40' /> : <Eye className='size-5 text-base-content/40' />}

                                </button>

                            </div>

                        </div>



                        <div className='form-control'>

                            <label className='label'><span className='label-text font-medium'>Confirm Password</span></label>

                            <div className='relative'>

                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center'><Lock className='size-5 text-base-content/40' /></div>

                                <input 

                                    type="password"

                                    className='input input-bordered w-full pl-10'

                                    placeholder='••••••••'

                                    value={confirmPassword}

                                    onChange={(e) => setConfirmPassword(e.target.value)}

                                    required

                                />

                            </div>

                        </div>



                        <button type='submit' className='btn btn-primary w-full' disabled={isSubmitting}>

                            {isSubmitting ? <Loader2 className='size-5 animate-spin' /> : "Reset Password"}

                        </button>

                    </form>

                </div>

            </div>

            <div className='hidden lg:block'>

                <AuthImagePattern title="Secure Your Account" subtitle="A strong password helps keep your messages and media safe from prying eyes." />

            </div>

        </div>
    );
};

export default ResetPasswordPage;