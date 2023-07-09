'use client';
import Loader from '@/components/Loader';
import WithoutAuth from '@/components/WithoutAuth';
import { doRegisterService } from '@/services/userServices';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ScreenRegister = () => {
    const [isLoading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [passValue, setPassValue] = useState({
        password: '',
        showPassword: false,
    });

    const router = useRouter();

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!name || !username || !email || !phone || !passValue.password) {
            setLoading(false);
            toast('Provide name, username, email, phone and password');
            return;
        }
        doRegisterService({
            name,
            email,
            username,
            phone,
            password: passValue.password,
        })
            .then(() => {
                router.replace('/');
                toast.success('Registration success');
                setTimeout(() => {
                    setLoading(false);
                }, 2000);
            })
            .catch((error: any) => {
                toast.error(error.message);
                setLoading(false);
            });
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="flex w-full h-screen">
                    <div className="w-full px-3 lg:py-8 flex items-center justify-center lg:w-1/2">
                        <div className="bg-white px-6 lg:px-10 py-10 rounded-3xl border-2 border-gray-200">
                            <h1 className="text-4xl font-semibold">Welcome</h1>
                            <p className="font-medium text-lg text-gray-500 mt-4">
                                Welcome! Please enter your details.
                            </p>
                            <div className="mt-6">
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="name" className="text-lg font-medium">
                                            Name
                                        </label>
                                        <input
                                            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                                            placeholder="Enter your name"
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            autoComplete="OFF"
                                        />
                                    </div>
                                    <div className="mt-1">
                                        <label htmlFor="username" className="text-lg font-medium">
                                            Username
                                        </label>
                                        <input
                                            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                                            placeholder="Enter your username"
                                            type="text"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            autoComplete="OFF"
                                        />
                                    </div>
                                    <div className="mt-1">
                                        <label htmlFor="email" className="text-lg font-medium">
                                            Email
                                        </label>
                                        <input
                                            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                                            placeholder="Enter your email"
                                            id="email"
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-1">
                                        <label htmlFor="phone" className="text-lg font-medium">
                                            Phone
                                        </label>
                                        <input
                                            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                                            placeholder="Enter your phone"
                                            id="phone"
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="mt-1">
                                        <label htmlFor="password" className="text-lg font-medium">
                                            Password
                                        </label>
                                        <input
                                            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                                            placeholder="Enter your password"
                                            id="password"
                                            type="password"
                                            value={passValue.password}
                                            onChange={(e) =>
                                                setPassValue({ ...passValue, password: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="mt-8 flex justify-between">
                                        <div>
                                            <input type="checkbox" id="remainder" />
                                            <label
                                                htmlFor="remainder"
                                                className="ml-2 font-medium text-base"
                                            >
                                                Remember for 30 days{' '}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-col gap-y-4">
                                        <button
                                            className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 bg-primary-color text-white  text-lg font-bold rounded-xl"
                                            type="submit"
                                        >
                                            Register
                                        </button>
                                    </div>
                                    <div className="mt-1 flex flex-col gap-y-4">
                                        <button
                                            className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 text-base text-primary-color font-medium rounded-xl"
                                            type="button"
                                            onClick={() => {
                                                router.replace('/login');
                                            }}
                                        >
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex h-full w-1/2 items-center justify-center  bg-gray-200 relative">
                        <div className="w-60 h-60 bg-gradient-to-tr from-violet-500 to-pink-500 rounded-full animate-bounce"></div>
                        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg"></div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WithoutAuth(ScreenRegister);
