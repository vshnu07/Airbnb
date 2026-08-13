'use client';

import Modal from "./Modal";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import useLoginModal from "@/app/hooks/useLoginModal";
import useToast from "@/app/hooks/useToast";
import CustomButton from "../forms/CustomButton";
import { handleLogin } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";

const LoginModal = () => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const performLogin = async (loginEmail: string, loginPass: string) => {
        setLoading(true);
        setErrors([]);

        try {
            const formData = {
                email: loginEmail,
                password: loginPass
            };

            const response = await apiService.postWithoutToken('/api/auth/login/', JSON.stringify(formData));

            if (response.access) {
                await handleLogin(response.user.pk, response.access, response.refresh);
                toast.show(`Welcome back, ${response.user.name || 'Traveler'}!`, 'success');
                loginModal.close();
                router.push('/');
                router.refresh();
            } else {
                const errs = response.non_field_errors || [response.error || 'Invalid email or password'];
                setErrors(errs);
                toast.show('Login failed. Please check credentials.', 'error');
            }
        } catch (err: any) {
            setErrors(['Unable to connect to server.']);
            toast.show('Login error.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const submitLogin = async () => {
        if (!email || !password) {
            setErrors(['Please enter both email and password.']);
            return;
        }
        await performLogin(email, password);
    };

    const quickLogin = async (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword('password123');
        await performLogin(demoEmail, 'password123');
    };

    const content = (
        <div className="space-y-6 max-h-[75vh] overflow-y-auto px-1">
            {/* Quick Demo Login Presets */}
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center">
                    <span className="mr-1.5">⚡</span> Fast Evaluation Demo Logins
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                        type="button"
                        onClick={() => quickLogin('superhost@airbnb.com')}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-airbnb hover:shadow-md transition text-left"
                    >
                        <div className="text-xs font-bold text-gray-900 flex items-center">
                            <span className="mr-1">👑</span> Priya
                        </div>
                        <div className="text-[10px] font-semibold text-airbnb">Superhost</div>
                    </button>

                    <button
                        type="button"
                        onClick={() => quickLogin('host1@airbnb.com')}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-airbnb hover:shadow-md transition text-left"
                    >
                        <div className="text-xs font-bold text-gray-900 flex items-center">
                            <span className="mr-1">🏔️</span> Rohit
                        </div>
                        <div className="text-[10px] font-semibold text-emerald-600">Mountain Host</div>
                    </button>

                    <button
                        type="button"
                        onClick={() => quickLogin('guest@airbnb.com')}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-airbnb hover:shadow-md transition text-left"
                    >
                        <div className="text-xs font-bold text-gray-900 flex items-center">
                            <span className="mr-1">✈️</span> Rahul
                        </div>
                        <div className="text-[10px] font-semibold text-blue-600">Guest / Traveler</div>
                    </button>
                </div>
            </div>

            <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase">or log in with email</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submitLogin();
                }}
                className="space-y-4"
            >
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email address</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="you@example.com"
                        type="email"
                        className="w-full h-[52px] px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-black text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="••••••••"
                        type="password"
                        className="w-full h-[52px] px-4 border border-gray-300 rounded-xl focus:outline-none focus:border-black text-sm"
                    />
                </div>

                {errors.map((error, index) => (
                    <div
                        key={`error_${index}`}
                        className="p-3 bg-red-50 text-red-700 border border-red-200 text-xs font-semibold rounded-xl"
                    >
                        {error}
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-airbnb to-airbnb-dark text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                    {loading ? <span>Logging in...</span> : <span>Continue</span>}
                </button>
            </form>
        </div>
    );

    return (
        <Modal
            isOpen={loginModal.isOpen}
            close={loginModal.close}
            label="Log in to Airbnb"
            content={content}
        />
    );
};

export default LoginModal;