import { lazy } from 'react';
import PrivateRoute from './Privateroute'; // Import the PrivateRoute component
// import DefaultLayout from '../components/Layouts/DefaultLayout';
import BlankLayout from '../components/Layouts/BlankLayout';
import App from '../App';


// 'LoginBoxed' is declared but its value is never read.ts(6133)
const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const RegisterBoxed = lazy(() => import('../pages/Authentication/RegisterBoxed'));

// HCIMS
const CompanyDashboard = lazy(() => import('../components/Main/HCIMS/Dashboard'));
const EditEmployee = lazy(() => import('../components/Main/HCIMS/Edit_Employee'));
const TerminateEmplyee = lazy(() => import('../components/Main/HCIMS/Terminate_Employee'));
const WhatsApp = lazy(() => import('../components/Main/HCIMS/WhatsApp'));
const HCIMSReports = lazy(() => import('../components/Main/HCIMS/Reports'));
const Configuration = lazy(() => import('../components/Main/HCIMS/Configurations'));
const ReportEmpForm = lazy(() => import('../components/Main/HCIMS/Reports_Emp_Form'));
const EmployeeDetails = lazy(() => import('../components/Main/HCIMS/Report-Details/Employee_Details'));
const EmployeeContactDirectory = lazy(() => import('../components/Main/HCIMS/Report-Details/Employee_Contact_Directory'));
const BirthdayDirectory = lazy(() => import('../components/Main/HCIMS/Report-Details/Birthday_Directory'));

// Tasks
const TasksDashboard = lazy(() => import('../components/Main/Tasks/Dashboard'));
const ViewTasks = lazy(() => import('../components/Main/Tasks/View_Tasks'));
const TasksReports = lazy(() => import('../components/Main/Tasks/Reports'));
const ViewTasksForm = lazy(() => import('../components/Main/Tasks/View_Tasks_Form'));
const Annoucements = lazy(() => import('../components/Main/Tasks/Announcement'));
const PersonalTaskReports=lazy(()=>import('../components/Main/Tasks/PersonalTaskReports'))
const TaskProgressReports=lazy(()=>import('../components/Main/Tasks/TaskProgressReports'))
const SubordinateTaskReports=lazy(()=>import('../components/Main/Tasks/SubordinateTaskReports'))
// Routines
const RoutineDashboard = lazy(() => import('../components/Main/Routines/Dashboard'));
const Attendance = lazy(() => import('../components/Main/Routines/Attendance'));
const TimeReq = lazy(() => import('../components/Main/Routines/Time_Req'));
const CreateMins = lazy(() => import('../components/Main/Routines/Create_Min'));
const ExpClaims = lazy(() => import('../components/Main/Routines/Exp_Claims'));
const CreateExp = lazy(() => import('../components/Main/Routines/Create_Exp'));
const RoutinesReports = lazy(() => import('../components/Main/Routines/Reports'));
const Whistle = lazy(() => import('../components/Main/Routines/Whistle'));
const MarkHoliday = lazy(() => import('../components/Main/Routines/MarkHoliday')); // Ensure the file exists at this path or update the path accordingly
const ViewMarkedHolidays =lazy(() => import('../components/Main/Routines/ViewMarkedHolidays'))
// Evaluation
const CompanyPolicies = lazy(() => import('../components/Main/Evaluation/Company_Policies'));
const Contest = lazy(() => import('../components/Main/Evaluation/Contest'));
const PerformanceMatric = lazy(() => import('../components/Main/Evaluation/Performance_Matric'));
const SetupEval = lazy(() => import('../components/Main/Evaluation/Setup_Eval'));
const Submit_360_Eval = lazy(() => import('../components/Main/Evaluation/Submit_360_Eval'));
const SubmitManagerEval = lazy(() => import('../components/Main/Evaluation/Submit_Mngr_Eval'));
const SubmitEngmntEval = lazy(() => import('../components/Main/Evaluation/Submit_Engmnt_Eval'));
const SubmitStftnEval = lazy(() => import('../components/Main/Evaluation/Submit_Stftn_Eval'));
const SubmitSelfEval = lazy(() => import('../components/Main/Evaluation/Submit_Self_Eval'));

// Settings
const CompanyInfo = lazy(() => import('../components/Main/Settings/Company_Info'));
const GroupCompany = lazy(() => import('../components/Main/Settings/Group_Company'));
const CreateDepartment = lazy(() => import('../components/Main/Settings/Create_Depart'));
const CreateDesignation = lazy(() => import('../components/Main/Settings/Create_Design'));
const CreateSalary = lazy(() => import('../components/Main/Settings/Create_Salary'));
const PerformanceMoni = lazy(() => import('../components/Main/Settings/Performance_Moni'));
const SettingsPermission = lazy(() => import('../components/Main/Settings/Permissions'));

// Training Section
const TrainingAssess = lazy(() => import('../components/Main/Training/Train_Assess'));
const CreateTraining = lazy(() => import('../components/Main/Training/Create_Train'));
const AssignTraining = lazy(() => import('../components/Main/Training/Assign_Train'));
const CreateQues = lazy(() => import('../components/Main/Training/Create_Ques'));
const ViewRes = lazy(() => import('../components/Main/Training/View_Results'));
const CreateQuiz = lazy(() => import('../components/Main/Training/Create_Quiz'));
const SubmitQuiz = lazy(() => import('../components/Main/Training/Submit_Quiz'));

// Main Dashboard
const MainDashboard = lazy(() => import('../components/Main/MainDashboard/Dashboard'));
const TodoList = lazy(() => import('../pages/Apps/Todolist'));
const Calendar = lazy(() => import('../pages/Apps/Calendar'));

// Error
const Error = lazy(() => import('../components/Error'));

const routes = [
    // Auth Routes
    {
        path: '/auth/boxed-signin',
        element: <LoginBoxed />,
        layout: 'blank'
    },
    {
        path: '/auth/register',
        element: <RegisterBoxed />,
        layout: 'blank'
    },
    {
        path: '/auth/LoginBoxed',
        element: <LoginBoxed />,
        layout: 'blank'
    },
    // Main Route
    {
        path: '/',
        element: <MainDashboard />,
        layout: 'default'
    },
    // Main Dashboard Route
    {
        path: '/dashboard',
        element: <MainDashboard />,
        layout: 'default'
    },
    // Todo List Route
    {
        path: '/todolist',
        element: <TodoList />,
        layout: 'default'
    },
    // Calendar Route
    {
        path: '/calendar',
        element: <Calendar />,
        layout: 'default'
    },
    // HCIMS Routes
    {
        path: '/hcims',
        element: <CompanyDashboard />,
        layout: 'default'
    },
    {
        path: '/edit_employee',
        element: <EditEmployee />,
        layout: 'default'
    },
    {
        path: '/terminate_employee',
        element: <TerminateEmplyee />,
        layout: 'default'
    },
    {
        path: '/whatsapp',
        element: <WhatsApp />,
        layout: 'default'
    },
    {
        path: '/reports_pages',
        element: <HCIMSReports />,
        layout: 'default'
    },
    {
        path: '/config_reports',
        element: <Configuration />,
        layout: 'default'
    },
    {
        path: '/employee-details',
        element: <ReportEmpForm />,
        layout: 'default'
    },
    {
        path: '/Employee_Contact_Directory',
        element: <EmployeeContactDirectory />,
        layout: 'default'
    },
    {
        path: '/report-employee-details',
        element: <EmployeeDetails />,
        layout: 'default'
    },
    {
        path: '/Birthday_Directory',
        element: <BirthdayDirectory />,
        layout: 'default'
    },
    // Tasks Routes
    {
        path: '/company_tasks_dashboard',
        element: <TasksDashboard />,
        layout: 'default'
    },
    {
        path: '/view_tasks',
        element: <ViewTasks />,
        layout: 'default'
    },
    {
        path: '/create-announcement',
        element: <Annoucements/>,
        layout: 'default'
    },
    {
        path:'/PersonalTasks',
        element:<PersonalTaskReports/>,
        layout:'default'
    },
    {
        path:'/TaskReports',
        element:<TaskProgressReports/>,
        layout:'default'
    },
    {
        path: '/tasks_reports',
        element: <TasksReports />,
        layout: 'default'
    },
    {
        path: '/SubordinateTaskReports',
        element: <SubordinateTaskReports/>,
        layout: 'default'
    },
    
    {
        path: '/tasks_form',
        element: <ViewTasksForm />,
        layout: 'default'
    },
    // Routines Routes
    {
        path: '/routine_report_dashboard',
        element: <RoutineDashboard />,
        layout: 'default'
    },
    {
        path: '/mark_holidays',
        element: <MarkHoliday />,
        layout: 'default'
    },
    {
        path: '/view-marked-holidays',
        element: <ViewMarkedHolidays />,
        layout: 'default'
    },

    {
        path: '/staff_attendence',
        element: <Attendance />,
        layout: 'default'
    },
    {
        path: '/employee_leave_requests',
        element: <TimeReq />,
        layout: 'default'
    },
    {
        path: '/create_meeting',
        element: <CreateMins />,
        layout: 'default'
    },
   
    {
        path: '/owner_expense_claim_list',
        element: <ExpClaims />,
        layout: 'default'
    },
    {
        path: '/create_expense_claim',
        element: <CreateExp />,
        layout: 'default'
    },
    {
        path: '/routine_reports',
        element: <RoutinesReports />,
        layout: 'default'
    },
    {
        path: '/routine_whistle',
        element: <Whistle />,
        layout: 'default'
    },
    // Evaluation Routes
    {
        path: '/company_policies',
        element: <CompanyPolicies />,
        layout: 'default'
    },
    {
        path: '/create_contest',
        element: <Contest />,
        layout: 'default'
    },
    {
        path: '/performance_matric',
        element: <PerformanceMatric />,
        layout: 'default'
    },
    {
        path: '/step_evaluation',
        element: <SetupEval />,
        layout: 'default'
    },
    {
        path: '/view_overall_all_forms',
        element: <Submit_360_Eval />,
        layout: 'default'
    },
    {
        path: '/view_manager_all_forms',
        element: <SubmitManagerEval />,
        layout: 'default'
    },
    {
        path: '/view_engagement_all_forms',
        element: <SubmitEngmntEval />,
        layout: 'default'
    },
    {
        path: '/view_satisfaction_all_forms',
        element: <SubmitStftnEval />,
        layout: 'default'
    },
    {
        path: '/view_all_forms',
        element: <SubmitSelfEval />,
        layout: 'default'
    },
    // Settings Routes
    {
        path: '/company_info',
        element: <CompanyInfo />,
        layout: 'default'
    },
    {
        path: '/group_of_companies',
        element: <GroupCompany />,
        layout: 'default'
    },
    {
        path: '/add_department',
        element: <CreateDepartment />,
        layout: 'default'
    },
    {
        path: '/add_designation',
        element: <CreateDesignation />,
        layout: 'default'
    },
    {
        path: '/create_salary_structure',
        element: <CreateSalary />,
        layout: 'default'
    },
    {
        path: '/create_performance_monitoring',
        element: <PerformanceMoni />,
        layout: 'default'
    },
    {
        path: '/permissions',
        element: <SettingsPermission />,
        layout: 'default'
    },
    // Training Routes
    {
        path: '/training_assessment',
        element: <TrainingAssess />,
        layout: 'default'
    },
    {
        path: '/create_training',
        element: <CreateTraining />,
        layout: 'default'
    },
    {
        path: '/assign_training',
        element: <AssignTraining />,
        layout: 'default'
    },
    {
        path: '/create-questions',
        element: <CreateQues />,
        layout: 'default'
    },
    {
        path: '/view_results',
        element: <ViewRes />,
        layout: 'default'
    },
    {
        path: '/create-quiz',
        element: <CreateQuiz />,
        layout: 'default'
    },
    {
        path: '/submit-quiz',
        element: <SubmitQuiz />,
        layout: 'default'
    },
    // Error Route
    {
        path: '*',
        element: <Error />,
        layout: 'blank'
    }
];

const wrappedRoutes = routes.map((route) => {
    if (route.protected) {
        return {
            ...route,
            element: <PrivateRoute>{route.element}</PrivateRoute>,
        };
    }
    return route;
});

export { wrappedRoutes as routes };
