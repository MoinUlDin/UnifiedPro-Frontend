import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { routes } from './routes';

const finalRoutes = routes.map((route) => ({
    ...route,
    element: route.layout === 'blank' ? (
        <BlankLayout key={route.path}>{route.element}</BlankLayout>
    ) : (
        <DefaultLayout key={route.path}>{route.element}</DefaultLayout>
    ),
}));

const router = createBrowserRouter(finalRoutes);

export default router;