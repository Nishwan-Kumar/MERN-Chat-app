import React, { useState } from 'react';
import { Mail, Loader2, ArrowLeft, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import AuthImagePattern from '../components/AuthImagePattern';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const { forgotPassword, isSendingResetEmail } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await forgotPassword(email);
        if (success) setIsEmailSent(true);
    };

    return (
        <div className='grid lg:grid-cols-2 min-h-screen'>
            {/* Left Side */}
            <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
                <div className='w-full max-w-md space-y-8'>
                    <div className='text-center'>
                        <div className='flex flex-col items-center gap-2 group'>
                            <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                                <MessageSquare className='size-6 text-primary' />
                            </div>
                            <h1 className='text-2xl font-bold mt-2'>Forgot Password?</h1>
                            <p className='text-base-content/60'>
                                {isEmailSent ? "Check your inbox!" : "Enter your email to receive a reset link."}
                            </p>
                        </div>
                    </div>

                    {!isEmailSent ? (
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text font-medium'>Email Address</span>
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Mail className='size-5 text-base-content/40' />
                                    </div>
                                    <input 
                                        type="email"
                                        className='input input-bordered w-full pl-10'
                                        placeholder='you@example.com'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button type='submit' className='btn btn-primary w-full' disabled={isSendingResetEmail}>
                                {isSendingResetEmail ? <Loader2 className='size-5 animate-spin' /> : "Send Reset Link"}
                            </button>
                        </form>
                    ) : (
                        <div className='text-center p-6 bg-primary/5 rounded-xl border border-primary/10'>
                            <p className='text-sm mb-4'>We've sent a link to <strong>{email}</strong></p>
                            <button onClick={() => setIsEmailSent(false)} className='btn btn-ghost btn-sm text-primary'>
                                Didn't get it? Try again
                            </button>
                        </div>
                    )}

                    <div className='text-center'>
                        <Link to="/login" className='link link-primary inline-flex items-center gap-2 text-sm'>
                            <ArrowLeft className='size-4' /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>

            <div className='hidden lg:block'>
                <AuthImagePattern
                    title="Security First"
                    subtitle="Reset your password securely and get back to your conversations."
                />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;