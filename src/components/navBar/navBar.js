import React from 'react';
import { NavLink } from 'react-router-dom';
import './navBar.css';
import { useAuth } from '../authContext/authContext.js'; // Import useAuth hook

const NavBar = () => {
    const { currentUser, logout } = useAuth(); // Get current user and logout function

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    return (
        <nav className="navbar">
            <ul className="navList">
                <li className="navItem">
                    <NavLink to="/" className={({ isActive }) => (isActive ? "activeNavLink" : "navLink")}>
                        Home
                    </NavLink>
                </li>
                {currentUser && (
                    <>
                        <li className="navItem">
                            <NavLink to="/slots" className={({ isActive }) => (isActive ? "activeNavLink" : "navLink")}>
                                Slots
                            </NavLink>
                        </li>
                        <li className="navItem">
                            <NavLink to="/cardcolorgame" className={({ isActive }) => (isActive ? "activeNavLink" : "navLink")}>
                                Card Color Game
                            </NavLink>
                        </li>
                        <li className="navItem">
                            <NavLink to="/baccarat" className={({ isActive }) => (isActive ? "activeNavLink" : "navLink")}>
                                Baccarat
                            </NavLink>
                        </li>
                    </>
                )}
                {!currentUser ? (
                    <>
                        <li className="navItem">
                            <NavLink to="/login" className={({ isActive }) => (isActive ? "activeNavLink" : "navLink")}>
                                Log In
                            </NavLink>
                        </li>
                        <li className="navItem">
                            <NavLink to="/signup" className={({ isActive }) => (isActive ? "activeNavLink" : "navLink")}>
                                Sign Up
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <li className="navItem">
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default NavBar;
