import { type RouteObject } from "react-router"
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'


const routes:RouteObject[] = [
    {
        path:'/',
        Component: MainLayout,
        children: [
            {
                index:true,
                Component: Home
            }
        ]
    }
]
export default routes;