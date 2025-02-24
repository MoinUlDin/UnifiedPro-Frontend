// import { PropsWithChildren, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { IRootState } from './store';
// import { toggleRTL, toggleTheme, toggleLocale, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar, toggleSemidark } from './store/themeConfigSlice';
// import store from './store';

// function App({ children }: PropsWithChildren) {
//     const themeConfig = useSelector((state: IRootState) => state.themeConfig);
//     const dispatch = useDispatch();

//     useEffect(() => {
//         dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
//         dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
//         dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
//         dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
//         dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
//         dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
//         dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
//         dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
//     }, [dispatch, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.locale, themeConfig.semidark]);

//     return (
//         <div
//             className={`${(store.getState().themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${
//                 themeConfig.rtlClass
//             } main-section antialiased relative font-nunito text-sm font-normal`}
//         >
//             {children}
//         </div>
//     );
// }

// export default App;







import React, { PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IRootState } from './store';
import store from './store';

import {
    toggleRTL,
    toggleTheme,
    toggleLocale,
    toggleMenu,
    toggleLayout,
    toggleAnimation,
    toggleNavbar,
    toggleSemidark,
} from './store/themeConfigSlice';

function App({ children }: PropsWithChildren) {
    // Using useSelector to get the current state from Redux
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Dispatching actions to set up theme configurations from localStorage
    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
    }, [
        dispatch,
        themeConfig.theme,
        themeConfig.menu,
        themeConfig.layout,
        themeConfig.rtlClass,
        themeConfig.animation,
        themeConfig.navbar,
        themeConfig.locale,
        themeConfig.semidark,
    ]);

    // Session timeout logic for user inactivity
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
        events.forEach(event => document.addEventListener(event, handleUserActivity));

        // Initial setup of session timeout
        timeoutId = setTimeout(handleSessionTimeout, 30 * 60 * 1000); // 30 minutes

        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => document.removeEventListener(event, handleUserActivity));
        };
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