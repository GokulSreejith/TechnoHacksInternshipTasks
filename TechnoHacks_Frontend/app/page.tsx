"use client"
import Loader from '@/components/Loader';
import WithAuth from '@/components/WithAuth';
import { IUser } from '@/interfaces/userInterfaces';
import { doLogoutService, getProfile } from '@/services/userServices';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const HomePage = () => {
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser>();

  const router = useRouter();

  useEffect(() => {
    setLoading(true)
    // Get the user profile
    getProfile().then((resp: any) => {
      setUser(resp.data);
      setLoading(false);
    }).catch((err: any) => {
      doLogoutService()
      router.replace('/login');
      setLoading(false);
    })
  }, [router])


  return (
    <>
      {
        isLoading ? (<Loader />) : (<div className="app min-h-screen font-sans overflow-hidden">

          <div className="h-60 flex items-center justify-center bg-gradient-to-tr from-violet-500 to-pink-500">
            <h1 className="absolute transform translate-x-1/2 -translate-y-1/2 uppercase font-verdana text-6xl font-bold text-white animate-bounce"><span className="text-shadow">Welcome GOKUL</span></h1>
          </div>

          <div className="wrapper px-6 lg:px-10 py-10 rounded-3xl border-2 border-gray-200 -mt-8 bg-white overflow-hidden mx-auto max-w-md rounded shadow-lg px-6">
            <h1 className="text-4xl font-semibold text-primary-color text-center">PROFILE</h1>

            <div className='mb-4 mt-4'>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-primary-color">Name</label>
              <input type="text" id="name" value={user?.name} className="bg-gray-50 border border-gray-300 text-primary-color text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Name" required />
            </div>

            <div className='mb-4'>
              <label htmlFor="username" className="block mb-2 text-sm font-medium text-primary-color ">Username</label>
              <input type="text" id="username" value={user?.username} className="bg-gray-50 border border-gray-300 text-primary-color text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Username" required />
            </div>

            <div className='mb-4'>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-primary-color ">Email</label>
              <input type="text" id="email" value={user?.email} className="bg-gray-50 border border-gray-300 text-primary-color text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Email" required />
            </div>

            <div className='mb-4'>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-primary-color ">Phone</label>
              <input type="text" id="phone" value={user?.phone} className="bg-gray-50 border border-gray-300 text-primary-color text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Email" required />
            </div>

            <div className='mb-4'>
              <label htmlFor="hashed_password" className="block mb-2 text-sm font-medium text-primary-color ">Hashed Password</label>
              <input type="text" id="hashed_password" value={user?.password} className="bg-gray-50 border border-gray-300 text-primary-color text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Hashed Password" required />
            </div>

            <div className="mt-8 flex flex-col gap-y-4">
              <button
                className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 bg-primary-color text-white  text-lg font-bold rounded-xl"
                type="submit"
                onClick={() => {
                  doLogoutService()
                  window.location.href = '/login';
                  toast.success("Logout Success")
                }}
              >
                LOGOUT
              </button>
            </div>

          </div>

          <footer className="text-center py-8 text-grey-dark">
            @GokulSreejith
          </footer>

        </div>)
      }
    </>
  )
}

export default WithAuth(HomePage)