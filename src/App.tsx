// App.tsx
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from './store';
import store from './store';
import { toggleRTL, toggleTheme, toggleLocale, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar, toggleSemidark } from './store/themeConfigSlice';

import useTokenRefresher from './TokenRefresh';
import NotificationServices from './services/NotificationServices';

function App({ children }: PropsWithChildren) {
    // Using useSelector to get the current state from Redux
    const themeConfig = useSelector((state: RootState) => state.themeConfig);
    const [loadingDone, setLoadingDone] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useTokenRefresher();

    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
    }, [dispatch, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.locale, themeConfig.semidark]);

    useEffect(() => {
        setTimeout(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/auth/boxed-signin');
            }
        }, 4000);
    }, []);
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleUserActivity = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleSessionTimeout, 30 * 60 * 1000); // 30 minutes
        };

        const handleSessionTimeout = () => {
            localStorage.removeItem('token'); // Clear session data
            navigate('/auth/boxed-signin'); // Redirect to login page
        };

        const events = ['mousemove', 'keypress', 'click', 'scroll', 'touchstart', 'touchmove', 'touchend'];
        events.forEach((event) => document.addEventListener(event, handleUserActivity));

        // Initial setup of session timeout
        timeoutId = setTimeout(handleSessionTimeout, 30 * 60 * 1000); // 30 minutes

        return () => {
            clearTimeout(timeoutId);
            events.forEach((event) => document.removeEventListener(event, handleUserActivity));
        };
    }, [navigate]);

    // watching local storage if token is removed then goto login page
    useEffect(() => {
        // 1) Delayed initial check
        const timeoutId = setTimeout(() => {
            const token = localStorage.getItem('token');
            const rt = localStorage.getItem('refresh_token');
            if (!token && !rt) {
                navigate('/auth/boxed-signin', { replace: true });
            }
        }, 15000); // run once, 15s after mount

        return () => clearTimeout(timeoutId);
    }, [navigate]);

    useEffect(() => {
        // 2) Storage‑event listener
        const onStorage = (e: StorageEvent) => {
            if ((e.key === 'token' || e.key === 'refresh_token') && !localStorage.getItem('token') && !localStorage.getItem('refresh_token')) {
                navigate('/auth/boxed-signin', { replace: true });
            }
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [navigate]);
    useEffect(() => {
        // 1) Delayed initial check
        const timeoutId = setTimeout(() => {
            const token = localStorage.getItem('token');
            const rt = localStorage.getItem('refresh_token');
            if (!token && !rt) {
                navigate('/auth/boxed-signin', { replace: true });
            }
        }, 15000); // run once, 15s after mount

        return () => clearTimeout(timeoutId);
    }, [navigate]);

    const FetchNotifications = useCallback(() => {
        NotificationServices.FetchNotifications(dispatch)
            .then((r) => {
                console.log('notifications: ', r);
            })
            .catch((e) => {
                console.log('Notifications Error: ', e);
            });
    }, []);
    useEffect(() => {
        setTimeout(() => {
            FetchNotifications();
            return;
        }, 55000);

        FetchNotifications();
    }, []);
    useEffect(() => {
        // 2) Storage‑event listener
        const onStorage = (e: StorageEvent) => {
            if ((e.key === 'token' || e.key === 'refresh_token') && !localStorage.getItem('token') && !localStorage.getItem('refresh_token')) {
                navigate('/auth/boxed-signin', { replace: true });
            }
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [navigate]);

    return (
        <>
            {/* Dynamically apply className based on themeConfig state */}
            <div
                className={`${(store.getState().themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${
                    themeConfig.rtlClass
                } main-section antialiased relative font-nunito text-sm font-normal`}
            >
                {children}
            </div>
        </>
    );
}

export default App;
