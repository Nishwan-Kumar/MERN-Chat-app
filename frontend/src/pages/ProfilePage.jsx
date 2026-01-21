import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, User } from 'lucide-react';
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";


const ProfilePage = () => {
  const {authUser,isUpdatingProfile,updateProfile} = useAuthStore();
  const [selectedItem,setSelectedItem] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);


  const handleImageUpload = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async()=>{
      setImageSrc(reader.result);
    }
  }
  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };
  const handleCropSave = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    setImageSrc(null);
    await updateProfile({ profilePic: croppedImage });
    setSelectedItem(croppedImage)
  };



  return (
    <div className='min-h-screen pt-12'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2'>Your Profile information</p>
          </div>

          {/* Avatar Section */}
          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img src={selectedItem|| authUser.profilePic || "/avatar.png"} alt="Profile" className='size-32 rounded-full object-cover border-4' />
              <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none":""}`}>
                <Camera className='w-5 h-5 text-base-200'></Camera>
                <input type="file" id='avatar-upload' className='hidden' accept='image/*' onChange={handleImageUpload} disabled={isUpdatingProfile} />
              </label>
            </div>
            {imageSrc && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                <div className="bg-base-300 p-4 rounded-xl w-[90%] max-w-md">

                  <div className="relative w-full h-72 bg-black rounded-lg overflow-hidden">
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full mt-4"
                  />

                  <div className="flex justify-end gap-3 mt-4">
                    <button className="btn btn-ghost" onClick={() => setImageSrc(null)}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleCropSave}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            <p className='text-sm text-zinc-400'>{isUpdatingProfile?"Uploading....":"Click the camera icon to update your profile photo"}</p>
          </div>
          <div className='space-y-6'>
            <div className='space-y-1.5'>
              <div className='text-sm text-zinc-400 flex items-center gap-2'>
                <User className='size-4'></User>
                Full Name
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser.fullName}</p>
            </div>

            <div className='space-y-1.5'>
              <div className='text-sm text-zinc-400 flex items-center gap-2'>
                <Mail className='size-4'></Mail>
                Email Address
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser.email}</p>
            </div>
          </div>

          <div className='mt-6 bg-base-300 rounded-xl p-6'>
            <h2 className='text-center text-lg font-medium mb-4'>Account Information</h2>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className='flex items-center justify-between py-2'>
                <span>Account Status</span>
                <span className='text-green-500'>Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage