import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { RootState } from '../../store';
import config from '../../config';

const RecoverResetPasswordPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [uid, setUid] = useState<string | null>(null); // Changed to string

    useEffect(() => {
        dispatch(setPageTitle('Reset Password'));

        const queryParams = new URLSearchParams(location.search);
        const tokenFromUrl = queryParams.get('token');
        const uidFromUrl = queryParams.get('uid');

        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('Token is missing.');
        }

        if (uidFromUrl) {
            setUid(uidFromUrl); // Removed numeric validation
        } else {
            setError('UID is missing.');
        }
    }, [dispatch, location.search]);

    const isRtl = useSelector((state: RootState) => state.themeConfig.rtlClass) === 'rtl';
    const themeConfig = useSelector((state: RootState) => state.themeConfig);

    const setLocale = (flag: string) => {
        setFlag(flag);
        dispatch(toggleRTL(flag.toLowerCase() === 'ae' ? 'rtl' : 'ltr'));
    };

    const [flag, setFlag] = useState(themeConfig.locale);

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (!token || !uid) {
            setError('Missing token or UID.');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                token,
                uid,
                new_password: newPassword,
                confirm_password: confirmPassword,
            };

            console.log('Sending request to backend:', payload);

            const response = await axios.post(`${config.API_BASE_URL}api/reset-password/`, payload);

            if (response.status === 200) {
                setSuccess('Your password has been reset successfully.');
                setNewPassword('');
                setConfirmPassword('');
                navigate('/auth/boxed-signin');
            } else {
                setError(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || 'An error occurred. Please try again.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="background" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="object1" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="object2" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="object3" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="polygon" className="absolute bottom-0 end-[28%]" />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/reset-password.svg" alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link to="/" className="w-8 block lg:hidden">
                                <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto w-10" />
                            </Link>
                        </div>
                        <div className="flex flex-col items-center gap-2.5 text-center">
                            <h1 className="text-3xl font-bold">Reset Password</h1>
                            <p className="text-sm text-body-dark">Please enter your new password below.</p>
                        </div>
                        <form className="mt-8 flex w-full max-w-[440px] flex-col items-center gap-6" onSubmit={submitForm}>
                            {error && <div className="w-full rounded-md bg-red-100 p-3 text-red-700">{error}</div>}
                            {success && <div className="w-full rounded-md bg-green-100 p-3 text-green-700">{success}</div>}
                            <div className="relative flex w-full flex-col items-center">
                                <label htmlFor="new-password" className="text-sm font-semibold text-body-dark">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="new-password"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 mt-2"
                                    required
                                />
                            </div>
                            <div className="relative flex w-full flex-col items-center">
                                <label htmlFor="confirm-password" className="text-sm font-semibold text-body-dark">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 mt-2"
                                    required
                                />
                            </div>
                            <button type="submit" className={`w-full rounded-lg bg-primary py-2 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                        <Link to="/auth/boxed-signin" className="text-primary">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecoverResetPasswordPage;
