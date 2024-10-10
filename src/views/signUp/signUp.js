import React, { useState } from 'react';
import NavBar from '../../components/navBar/navBar.js';
import { useAuth } from '../../components/authContext/authContext.js';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { setDoc, doc } from 'firebase/firestore';
import './signUp.css';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Attempt to sign up the user
            const userCredential = await signup(email, password);
            const user = userCredential.user;

            // Prepare user data for Firestore
            const userData = {
                uid: user.uid,
                email: user.email,
                username: username,
            };

            // Attempt to store the data in Firestore
            await setDoc(doc(db, 'users', user.uid), userData);

            alert("Signed up successfully!");
            navigate("/");
        } catch (error) {
            // Handle errors from signup and Firestore
            console.error("Error during signup or Firestore operation:", error.message);
            alert("Failed to sign up: " + error.message);
        }
    }

    return (
        <div>
            <NavBar />
            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="signup-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                    />
                    <input
                        type="email"
                        className="signup-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        className="signup-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <input
                        type="password"
                        className="signup-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                    <button className="signup-button" type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
}
