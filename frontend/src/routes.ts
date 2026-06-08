import { type RouteObject } from "react-router"
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import Map from './pages/Map'
import Raise from './pages/Raise'
import Updates from './pages/Updates'
import Profile from './pages/Profile'
import ErrorPage from "./pages/ErrorPage"

const routes:RouteObject[] = [
    {
        path:'/',
        Component: MainLayout,
        ErrorBoundary: ErrorPage,
        children: [
            {
                index:true,
                Component: Home
            },
            {
                path: 'map',
                Component: Map
            },
            {
                path: 'raise',
                Component: Raise
            },
            {
                path: 'updates',
                Component: Updates
            },
            {
                path: 'profile',
                Component: Profile
            }
        ]
    }
]
export default routes;