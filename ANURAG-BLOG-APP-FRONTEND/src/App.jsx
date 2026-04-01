import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './components/RootLayout'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import UserDashboard from './components/UserDashboard'
import AuthorDashboard from './components/AuthorDashboard'
import AdminDashboard from './components/AdminDashboard'
import ArticleById from './components/ArticleById'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './store/authStore'
import { useEffect } from 'react'
import ErrorBoundary from './components/ErrorBoundary'

function App() {

    const refreshObj = useAuth((state)=>state.refresh)
    const loading = useAuth((state)=>state.loading)

    useEffect(()=>{
        refreshObj()
    },[])

    if(loading){
        return <div className="text-[#b91c1c]/70 text-sm animate-pulse text-center py-10">Loading...</div>
    }

    const routerObj = createBrowserRouter([
        {
            path: "/",
            element: <RootLayout />,
            errorElement:<ErrorBoundary/>,
            children: [
                {
                    path: "",
                    element: <Home />
                },
                {
                    path: "login",
                    element: <Login />
                },
                {
                    path: "register",
                    element: <Register />
                },
                {
                    path: "userdashboard",
                    element:
                        <ProtectedRoute allowedRoles={["USER"]}>
                            <UserDashboard />
                        </ProtectedRoute>
                },
                {
                    path: "article/:id",
                    element:
                        <ProtectedRoute allowedRoles={["USER"]}>
                            <ArticleById />
                        </ProtectedRoute>
                },
                {
                    path: "authordashboard",
                    element:
                        <ProtectedRoute allowedRoles={["AUTHOR"]}>
                            <AuthorDashboard />
                        </ProtectedRoute>
                },
                {
                    path: "admindashboard",
                    element: <AdminDashboard />
                }
            ]
        }
    ])
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <RouterProvider router={routerObj} />
        </>
    )
}

export default App