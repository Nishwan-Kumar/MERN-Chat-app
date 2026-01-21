import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { LogOut, MessageSquare, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const {logOut, authUser} = useAuthStore();
  return (
    <header className='bg-base-100 border-b border-base-300 w-full top-0 z-40 backdrop-blur-lg bg-base-100/80'>
      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full'>
          <Link to={"/"} className='flex items-center gap-2.5 hover:opacity-80 transition-all'>
          <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center'>
            <MessageSquare className='w-5 h-5 text-primary' />
          </div>
          <h1 className='text-lg font-bold'>Chattify</h1>
          </Link>

          <div className='flex items-center gap-2.5'>
          <Link to={"/settings"}
            className={'btn btn-sm gap-2 transition-colors'}>
              <Settings className='size-4'></Settings>
              <span className='hidden sm:inline'>Settings</span>
          </Link>

          {authUser && (
            <>
              <Link to={"/profile"} className='btn btn-sm gap-2'>
                <User className='size-5'></User>
                <span className='hidden sm:inline'>Profile</span>
              </Link>

              <button className='flex gap-2 items-center' onClick={logOut}>
                <LogOut className='size-5'></LogOut>
                <span className='hidden sm:inline'>Logout</span>
              </button>
            </>
          )}
        </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar