import React from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../store/authStore'
import { loadingClass } from '../styles/common'

function ProtectedRoute({ children,allowedRoles }) {
    const { loading, currentUser, isAuthenticated } = useAuth()


    if (loading) {
        return <div className={loadingClass}>Loading..</div>
    }

    if (!isAuthenticated) {
        //reroute to login
        return <Navigate to='/login' replace />// replace will remove the previous page url from browser and replaces it to this url
    }
    
    if(allowedRoles && !allowedRoles.includes(currentUser?.role)){
        return <Navigate to='/user-dashboard' redirectTo ='/' /> //create an unauthorized file and navigate to it
    }

    return children;
}

export default ProtectedRoute