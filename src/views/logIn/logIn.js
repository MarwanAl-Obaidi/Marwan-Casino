import React, { useState } from 'react';
import NavBar from '../../components/navBar/navBar.js';
import { useAuth } from '../../components/authContext/authContext.js';
import { useNavigate } from 'react-router-dom';
import './logIn.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await login(email, password);
            alert("Logged in successfully!");
            navigate("/");
        } catch (error) {
            alert("Failed to log in: " + error.message);
        }
    }

    return (
        <div>
            <NavBar />
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="login-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button className="login-button" type="submit">Log In</button>
                </form>
            </div>
        </div>
    );
}
