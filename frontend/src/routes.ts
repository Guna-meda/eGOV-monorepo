import { type RouteObject } from "react-router"
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import Raise from './pages/Raise'
import Updates from './pages/Updates'
import Profile from './pages/Profile'
import ErrorPage from "./pages/ErrorPage"
import {grievanceAction} from "./actions/grievanceUploadAction"
import {mapLoader} from "./loaders/mapLoader"
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
                Component: MapPage,
                loader: mapLoader
            },
            {
                path: 'raise',
                Component: Raise,
                action: grievanceAction
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