import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { RootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMinus from '../Icon/IconMinus';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import IconMenuMailbox from '../Icon/Menu/IconMenuMailbox';
import IconMenuTodo from '../Icon/Menu/IconMenuTodo';
import IconMenuNotes from '../Icon/Menu/IconMenuNotes';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';
import IconMenuContacts from '../Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import IconMenuElements from '../Icon/Menu/IconMenuElements';
import IconMenuCharts from '../Icon/Menu/IconMenuCharts';
import IconMenuWidgets from '../Icon/Menu/IconMenuWidgets';
import IconMenuFontIcons from '../Icon/Menu/IconMenuFontIcons';
import IconMenuDragAndDrop from '../Icon/Menu/IconMenuDragAndDrop';
import IconMenuTables from '../Icon/Menu/IconMenuTables';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconMenuAuthentication from '../Icon/Menu/IconMenuAuthentication';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';
import IconUser from '../Icon/IconUser';
import IconHome from '../Icon/IconHome';
import IconListCheck from '../Icon/IconListCheck';
import IconLogout from '../Icon/IconLogout';
import IconLogin from '../Icon/IconLogin';
import IconTrendingUp from '../Icon/IconTrendingUp';
import IconSettings from '../Icon/IconSettings';
import IconNotes from '../Icon/IconNotes';
import IconServer from '../Icon/IconServer';
import { AppRoute } from '../../router/routes'; // Import AppRoute type
import AuthServices from '../../services/AuthServices';

interface SidebarProps {
    items: AppRoute[]; // Add items prop
}

const Sidebar = ({ items }: SidebarProps) => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: RootState) => state.themeConfig);
    const semidark = useSelector((state: RootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const FetchPermissions = () => {
        console.log('fetching User Permissions');
        AuthServices.FetchUsersPermissions().catch((e) => {});
    };

    useEffect(() => {
        const userinfo = JSON.parse(localStorage.getItem('UserInfo') ?? '');
        if (userinfo.is_owner) return;
        FetchPermissions();
    }, []);
    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    // new code
    const getMainCategories = () => {
        const categories = new Set<string>();
        items.forEach((item) => {
            if (item.category) {
                categories.add(item.category);
            }
        });
        return Array.from(categories);
    };

    // Get sub-items for a category
    const getSubItems = (category: string) => {
        return items.filter(
            (item) => item.category === category && item.layout === 'default' && item.path !== '/' // Exclude home route
        );
    };

    // Check if a category has visible items
    const hasVisibleItems = (category: string) => {
        return getSubItems(category).length > 0;
    };

    // Get icon for a category
    const getCategoryIcon = (category: string) => {
        const icons: Record<string, JSX.Element> = {
            HCIMS: <IconServer className="group-hover:!text-primary shrink-0" />,
            Tasks: <IconListCheck className="group-hover:!text-primary shrink-0" />,
            Routines: <IconUser className="group-hover:!text-primary shrink-0" />,
            Evaluation: <IconTrendingUp className="group-hover:!text-primary shrink-0" />,
            Settings: <IconSettings className="group-hover:!text-primary shrink-0" />,
            Training: <IconNotes className="group-hover:!text-primary shrink-0" />,
        };
        return icons[category] || <IconMenuComponents className="group-hover:!text-primary shrink-0" />;
    };

    // Get translation key for a category
    const getCategoryTranslationKey = (category: string) => {
        const translations: Record<string, string> = {
            HCIMS: 'HCIMS',
            Tasks: 'Tasks',
            Routines: 'Routines',
            Evaluation: 'Evaluation',
            Settings: 'Settings',
            Training: 'Training Section',
        };
        return translations[category] || category;
    };

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center justify-center shrink-0">
                            <img className="w-28 h-auto ml-[30px] mb-4 flex-none" src="/assets/images/TheVistaOneLogo.jpeg" alt="logo" />
                            {/* <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('VRISTO')}</span> */}
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {/* Dashboard - Always visible */}
                            <li className="menu nav-item">
                                <NavLink to="/" className="nav-link group">
                                    <div className="flex items-center">
                                        <IconHome className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('dashboard')}</span>
                                    </div>
                                </NavLink>
                            </li>

                            {/* Dynamic Categories */}
                            {getMainCategories().map(
                                (category) =>
                                    hasVisibleItems(category) && (
                                        <li className="menu nav-item" key={category}>
                                            <button type="button" className={`${currentMenu === category ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu(category)}>
                                                <div className="flex items-center">
                                                    {getCategoryIcon(category)}
                                                    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t(getCategoryTranslationKey(category))}</span>
                                                </div>
                                                <div className={currentMenu !== category ? 'rtl:rotate-90 -rotate-90' : ''}>
                                                    <IconCaretDown />
                                                </div>
                                            </button>

                                            <AnimateHeight duration={300} height={currentMenu === category ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    {getSubItems(category).map((item) => (
                                                        <li key={item.path}>
                                                            <NavLink to={item.path}>{item.label ? t(item.label) : item.path.split('/').pop()}</NavLink>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AnimateHeight>
                                        </li>
                                    )
                            )}

                            {/* Logout - Always visible */}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'logout' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('logout')}>
                                    <div className="flex items-center">
                                        <IconLogin className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Logout')}</span>
                                    </div>
                                </button>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
