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

const Sidebar = () => {
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
                            {/* Dashboard */}
                            <li className="menu nav-item">
                                <NavLink to="/" className="nav-link group">
                                    <div className="flex items-center">
                                        <IconHome className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('dashboard')}</span>
                                    </div>
                                </NavLink>
                            </li>
                            {/* HCIMS */}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'hcims' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('hcims')}>
                                    <div className="flex items-center">
                                        <IconServer className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('HCIMS')}</span>
                                    </div>

                                    <div className={currentMenu !== 'hcims' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'hcims' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/hcims">{t('Dashboard')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/edit_employee">{t('Add/Edit Employee')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/terminate_employee">{t('Terminate Employee')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/whatsapp">{t('WhatsApp')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/reports_pages">{t('Reports')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/config_reports">{t('Configurations')}</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                            {/* Tasks */}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'tasks' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('tasks')}>
                                    <div className="flex items-center">
                                        <IconListCheck className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Tasks')}</span>
                                    </div>

                                    <div className={currentMenu !== 'tasks' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'tasks' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/company_tasks_dashboard">{t('Dashboard')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/view_tasks">{t('Add/View Tasks')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/create-announcement">{t('Announcement')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/tasks_reports">{t('Reports')}</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                            {/* Routines */}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'routines' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('routines')}>
                                    <div className="flex items-center">
                                        <IconUser className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Routines')}</span>
                                    </div>

                                    <div className={currentMenu !== 'routines' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'routines' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/routine_report_dashboard">{t('Dashboard')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/staff_attendence">{t('Attendance')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/employee_leave_requests">{t('Time Off Requests')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/create_meeting">{t('Create Minutes Of Meetings')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/owner_expense_claim_list">{t('Expense Claims')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/create_expense_claim">{t('Create Expense Claim')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/routine_reports">{t('Reports')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/routine_whistle">{t('Whistle')}</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                            {/* Evaluation */}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'evaluation' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('evaluation')}>
                                    <div className="flex items-center">
                                        <IconTrendingUp className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Evaluation')}</span>
                                    </div>

                                    <div className={currentMenu !== 'evaluation' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'evaluation' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/company_policies">{t('Company Policies')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/create_contest">{t('Contest')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/performance_matric">{t('Performance Matric')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/step_evaluation">{t('Setup Evaluation')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/view_overall_all_forms">{t('Submit 360 Evaluation')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/view_manager_all_forms">{t('Submit Manager Evaluation')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/view_engagement_all_forms">{t('Submit Engagement Evaluation')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/view_satisfaction_all_forms">{t('Submit Satisfaction Evaluation')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/view_all_forms">{t('Submit Self Evaluation')}</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                            {/* Settings */}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'settings' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('settings')}>
                                    <div className="flex items-center">
                                        <IconSettings className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Settings')}</span>
                                    </div>

                                    <div className={currentMenu !== 'settings' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'settings' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/company_info">{t('Company Information')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/group_of_companies">{t('Group of Companies')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/departments">{t('Create Department')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/add_designation">{t('Create Designation')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/create_salary_structure">{t('Create Salary Structure')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/create_performance_monitoring">{t('Performance Monitoring')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/permissions">{t('Permissions')}</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                            {/* Training Section */}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'trainingSection' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('trainingSection')}>
                                    <div className="flex items-center">
                                        <IconNotes className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Training Section')}</span>
                                    </div>

                                    <div className={currentMenu !== 'trainingSection' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'trainingSection' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/training_assessment">{t('Training Assessment')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/create_training">{t('Create Training')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/assign_training">{t('Assign Training')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/create-questions">{t('Create Questions')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/view_results">{t('View Results')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/create-quiz">{t('Create Quiz')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/submit-quiz">{t('Submit Quiz')}</NavLink>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>
                            {/* Logout */}
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
