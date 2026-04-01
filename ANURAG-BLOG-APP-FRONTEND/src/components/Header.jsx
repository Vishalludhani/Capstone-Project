import React from 'react'
import { NavLink, useNavigate } from 'react-router'
import {
    navbarClass,
    navBrandClass,
    navContainerClass,
    navLinkActiveClass,
    navLinkClass,
    navLinksClass
} from '../styles/common'
import { useAuth } from '../store/authStore'

function Header() {
    const isAuthenticated = useAuth((state) => state.isAuthenticated)
    const logout = useAuth((state) => state.logout)
    const user = useAuth((state) => state.currentUser)

    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout();
        navigate('/login')
    }

    const getProfilePath = () => {
        if (!user) return '/'

        console.log("current user", user);
        switch (user.role) {
            case "AUTHOR":
                return "/authordashboard";
            case "ADMIN":
                return "/admindashboard";
            default:
                return "/userdashboard";
        }
    }

    return (
        <nav className={navbarClass}>
            <div className={navContainerClass}>
                <h1 className={navBrandClass}>Anurag Blog</h1>
                <ul className={navLinksClass}>
                    <li>
                        <NavLink to="" className={({ isActive }) => (isActive ?  navLinkActiveClass :  navLinkClass )}>Home</NavLink>
                    </li>
                    {/* Not logged in */}
                    {!isAuthenticated && (
                        <>
                            <li>
                                <NavLink to="/register" className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}>
                                    Register
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/login" className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}>
                                    Login
                                </NavLink>
                            </li>
                        </>
                    )}

                    {/* Logged in */}
                    {isAuthenticated && (
                        <>
                            <li>
                                <NavLink
                                    to={getProfilePath()}
                                    className={({ isActive }) => (isActive ? navLinkActiveClass : navLinkClass)}
                                >
                                    Profile
                                </NavLink>
                            </li>

                            <li>
                                <button className={`${navLinkClass} cursor-pointer`} onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}

export default Header