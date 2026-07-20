import { type RouteObject } from "react-router"
import MainLayout from './layout/MainLayout'
import EmployeeLayout from './layout/EmployeeLayout'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import Raise from './pages/Raise'
import Updates from './pages/Updates'
import Profile from './pages/Profile'
import ErrorPage from "./pages/ErrorPage"
import Complaint from "./pages/Complaint"
import ComplaintsView from "./pages/ComplaintsView"
import WardAnalytics from "./pages/WardAnalytics"
import {grievanceAction} from "./actions/grievanceUploadAction"
import {mapLoader} from "./loaders/mapLoader"
const routes:RouteObject[] = [
    {
        path:'/',
        ErrorBoundary: ErrorPage,
        children:[
            {
                path: 'citizen',
                Component: MainLayout,
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
                    },
                    {
                        path: 'complaints/:complaintId',
                        Component: Complaint
                    }
                ]
            },
            {
                path: '/employee',
                Component: EmployeeLayout,
                children:[
                    {
                        path: 'complaints',
                        Component: ComplaintsView
                    },
                    {
                        path: 'wardanalytics',
                        Component: WardAnalytics,
                        loader: mapLoader
                    }
                ]
            }
        ]
    }
]
export default routes;