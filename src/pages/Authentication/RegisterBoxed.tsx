import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import config from '../../config';

interface ThemeConfig {
    theme: string;
    isDarkMode: boolean;
}

const RegisterBoxed: React.FC = () => {
    const navigate = useNavigate();
    const isDark = useSelector((state: { themeConfig: ThemeConfig }) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);;
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const modernImages = [
        'https://media.istockphoto.com/id/1080367616/vector/virtual-reality-concept-abstract-visualization-of-artificial-intelligence.jpg?s=612x612&w=0&k=20&c=I61rxe_RfZRxFrS34QRtMq0OwG6k8cp-fxM2dUT_vhE=',
        'https://img.freepik.com/free-photo/metaverse-avatar-collage-concept_52683-96429.jpg',
        'https://media.istockphoto.com/id/1357255073/vector/artificial-intelligence-abstract-artistic-human-head-portrait-made-of-dotted-particles-array.jpg?s=612x612&w=0&k=20&c=T9nXK76OG_h38NblhUNmsvD0nVK19XRBi3Kz8uDjhEU='
    ];

    const slideTexts = [
        "Join our HR revolution",
        "Start your journey",
        "Transform your workplace"
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % modernImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
    
        if (password !== password2) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }
        const secretKey = 'jAAVaQxytWMDOhydK75SXjyKzDCLYa21E32fdkWve4joEfMGWPxwaFskSHtLDvLZ';
        const API_BASE_URL = 'https://success365-backend-86f1c1-145db9-65-108-245-140.traefik.me';
        
        const submitForm = async () => {
            setIsLoading(true);
        
            const formData = new FormData();
            formData.append("email", email);
            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            formData.append("password", password);
            formData.append("password2", password2);
            formData.append("secret_key", secretKey);
        
            // ✅ Ensure profileImage is a valid File object before appending
            if (profileImage && profileImage instanceof File) {
                formData.append("profile_image", profileImage, profileImage.name);
            } else {
                console.error("⚠️ profileImage is not a valid File object:", profileImage);
            }
        
            // ✅ Properly log FormData contents
            console.log("📤 Sending data to server:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
        
            try {
                const response = await axios.post(`${API_BASE_URL}/auth/owner-register/`, formData, {
                    headers: { },
                });
        
                console.log("✅ Server response:", response);
        
                if (response.status === 201) {
                    setSuccess("Registration successful!");
                    navigate("/auth/boxed-signin");
                } else {
                    setError("Registration failed. Please try again.");
                }
            } catch (err: any) {
                console.error("❌ Error:", err);
        
                if (err.response) {
                    const { status, data } = err.response;
                    if (status === 400) {
                        setError(data.email ? "User already exists." : "Invalid input. Please check your details.");
                    } else if (status === 500) {
                        setError("Server error. Try again later.");
                    } else {
                        setError("Registration failed. Please check your details.");
                    }
                } else {
                    setError("Network error. Please check your connection.");
                }
            } finally {
                setIsLoading(false);
            }
     
        }}

    

    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:block lg:w-[60%] relative overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                    {modernImages.map((image, index) => (
                        index === activeIndex && (
                            <motion.div
                                key={image}
                                className="absolute inset-0"
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 1.8, ease: "easeInOut" }}
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${image})` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent" />
                                </div>
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>

                <div className="relative z-10 h-full flex flex-col justify-center p-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="space-y-6 max-w-xl">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }} 
                                className="flex items-center space-x-3"
                            >
                                <div className="h-0.5 w-12 bg-blue-500"></div>
                                <span className="text-blue-500 font-medium tracking-wider">GET STARTED</span>
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
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Create your account and start managing your workforce efficiently
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className={`flex-1 flex items-center justify-center p-8 ${isDark ? 'bg-[#0A0A0A]' : 'bg-white'}`}>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md space-y-10"
                >
                    <div className="text-center space-y-3">
                        <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Sign Up</h2>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Create your account</p>
                    </div>

                    <form onSubmit={submitForm} className="space-y-6">
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
                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        isDark 
                                            ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                                            : 'bg-white border-gray-300 focus:border-blue-500'
                                    } focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200`}
                                    placeholder="Enter your first name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        isDark 
                                            ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                                            : 'bg-white border-gray-300 focus:border-blue-500'
                                    } focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200`}
                                    placeholder="Enter your last name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        isDark 
                                            ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                                            : 'bg-white border-gray-300 focus:border-blue-500'
                                    } focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200`}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        isDark 
                                            ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                                            : 'bg-white border-gray-300 focus:border-blue-500'
                                    } focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200`}
                                    placeholder="Create a password"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                                <input
                                    type="password"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        isDark 
                                            ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                                            : 'bg-white border-gray-300 focus:border-blue-500'
                                    } focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200`}
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Profile Picture</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setProfileImage(e.target.files[0]);
                                        } }}
                                 
                                    className={`w-full px-4 py-3 rounded-xl border ${
                                        isDark 
                                            ? 'bg-gray-900 border-gray-700 text-white focus:border-blue-500' 
                                            : 'bg-white border-gray-300 focus:border-blue-500'
                                    } focus:ring-1 focus:ring-blue-500 outline-none transition-colors duration-200`}
                                    placeholder="Upload image"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center px-4 py-3 rounded-xl text-white font-medium
                                    ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} 
                                    transition-colors duration-200`}
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            <div className="text-center mt-6">
                                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Already have an account?{' '}
                                    <Link to="/auth/boxed-signin" className="text-blue-500 hover:text-blue-600 font-medium">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterBoxed;
