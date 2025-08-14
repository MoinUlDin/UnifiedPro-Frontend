import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import AuthServices from '../../services/AuthServices';

interface ThemeConfig {
    theme: string;
    isDarkMode: boolean;
}

const LoginBoxed: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isDark = useSelector((state: { themeConfig: ThemeConfig }) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    useEffect(() => {
        dispatch(setPageTitle('Login'));
    }, [dispatch]);

    const modernImages = [
        'https://media.istockphoto.com/id/1080367616/vector/virtual-reality-concept-abstract-visualization-of-artificial-intelligence.jpg?s=612x612&w=0&k=20&c=I61rxe_RfZRxFrS34QRtMq0OwG6k8cp-fxM2dUT_vhE=',
        'https://img.freepik.com/free-photo/metaverse-avatar-collage-concept_52683-96429.jpg',
        'https://media.istockphoto.com/id/1357255073/vector/artificial-intelligence-abstract-artistic-human-head-portrait-made-of-dotted-particles-array.jpg?s=612x612&w=0&k=20&c=T9nXK76OG_h38NblhUNmsvD0nVK19XRBi3Kz8uDjhEU=',
    ];

    const slideTexts = ['Revolutionize your HR experience', 'Empower your workforce', 'Innovate with AI-driven insights'];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % modernImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await handleLogin();
    };

    const handleLogin = async () => {
        setError('');
        console.log('Loging in Bhai sahab');
        // const API_BASE_URL = 'https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me';
        // const API_BASE_URL = 'http://127.0.0.1:8000';

        const payload = {
            email,
            password,
        };
        AuthServices.login(payload)
            .then((r) => {
                const user = r.user;
                const permissions = r.permissions;
                localStorage.setItem('UserInfo', JSON.stringify(user));
                localStorage.setItem('UserPerms', JSON.stringify(permissions));

                // to read
                // const user = JSON.parse(localStorage.getItem('UserInfo') || 'null');
                // const permissions = JSON.parse(localStorage.getItem('UserPerms') || '[]');
                navigate('/');
            })
            .catch((err) => {
                console.error('❌ Login Error:', err);

                if (err.response) {
                    const { status } = err.response;

                    if (status === 400) {
                        setError('Invalid credentials. Please check your email and password.');
                    } else if (status === 401) {
                        setError('No active account found with the given credentials');
                    } else if (status === 404) {
                        setError('Email not found. Please check your email address.');
                    } else {
                        setError('Login failed. Please try again later.');
                    }
                } else {
                    setError('Network error. Please check your connection.');
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:block lg:w-[60%] relative overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                    {modernImages.map(
                        (image, index) =>
                            index === activeIndex && (
                                <motion.div
                                    key={image}
                                    className="absolute inset-0"
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 1.8, ease: 'easeInOut' }}
                                >
                                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent" />
                                    </div>
                                </motion.div>
                            )
                    )}
                </AnimatePresence>

                <div className="relative z-10 h-full flex flex-col justify-center p-24">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="space-y-8">
                        <div className="space-y-6 max-w-xl">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center space-x-3">
                                <div className="h-0.5 w-12 bg-blue-500"></div>
                                <span className="text-blue-500 font-medium tracking-wider">ENTERPRISE SOLUTION</span>
                            </motion.div>
                            <h1 className="text-7xl font-bold text-white tracking-tight leading-[1.1]">
                                <motion.span
                                    key={slideTexts[activeIndex]}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.8 }}
                                    className="block mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                                >
                                    {slideTexts[activeIndex]}
                                </motion.span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed">Experience the future of workforce management with our AI-powered platform</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-16">
                            {[
                                { title: 'Smart Analytics', desc: 'AI-powered insights' },
                                { title: 'Employee Management', desc: 'Streamlined workflows' },
                                { title: 'Performance Tracking', desc: 'Real-time monitoring' },
                                { title: 'Automated Reports', desc: 'Instant generation' },
                            ].map((feature, index) => (
                                <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + index * 0.1 }} className="relative">
                                    <div className="absolute -left-2 top-2 w-1 h-1 rounded-full bg-blue-500" />
                                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className={`flex-1 flex items-center justify-center p-8 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md space-y-10">
                    <div className="text-center space-y-3">
                        <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Sign In</h2>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Access your workspace</p>
                    </div>

                    <form onSubmit={submitForm} className="space-y-8">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`p-4 rounded-2xl ${isDark ? 'bg-red-500/10' : 'bg-red-50'} border border-red-500/20 text-red-500`}
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full px-5 py-4 rounded-2xl border ${
                                            isDark ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        placeholder="Enter your email"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-2xl transition-opacity duration-200 pointer-events-none">
                                        <div
                                            className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-100"
                                            style={{ padding: '1px' }}
                                        >
                                            <div className={`h-full w-full rounded-2xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`w-full px-5 py-4 rounded-2xl border ${
                                            isDark ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 placeholder-gray-400'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-2xl transition-opacity duration-200 pointer-events-none">
                                        <div
                                            className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-100"
                                            style={{ padding: '1px' }}
                                        >
                                            <div className={`h-full w-full rounded-2xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="w-4 h-4 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <label htmlFor="remember" className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Remember me
                                </label>
                            </div>
                            <Link to="/forgot-password" className={`text-sm font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} transition-colors`}>
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center px-4 py-3 rounded-xl text-white font-medium
                                ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} 
                                transition-colors duration-200`}
                        >
                            {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign In'}
                        </button>

                        <div className="text-center mt-6">
                            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Don't have an account?{' '}
                                <Link to="/auth/register" className="text-blue-500 hover:text-blue-600 font-medium">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginBoxed;
