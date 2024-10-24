import React, { useEffect, useState } from 'react';
import { db } from '../../firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../components/authContext/authContext.js';
import NavBar from '../../components/navBar/navBar.js';
import './profile.css';

const Profile = () => {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // To track loading state

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                const uid = currentUser.uid;

                try {
                    // Fetch the Firestore document using the user's UID
                    const userDocRef = doc(db, 'users', uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUserData(userDoc.data()); // Store Firestore data
                    } else {
                        console.error('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                } finally {
                    setLoading(false); // Finished loading
                }
            } else {
                setLoading(false); // No user is logged in
            }
        };

        fetchUserData();
    }, [currentUser]);

    if (loading) {
        return <div><NavBar /><div className="profile-loading">Loading...</div></div>;
    }

    if (!userData) {
        return <div><NavBar /><div className="profile-no-data">No user data found</div></div>;
    }

    return (
        <div>
            <NavBar />
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Profile</h1>
                    <p>Welcome, {userData.username}</p>
                </div>
                <div className="profile-info">
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Money:</strong> {userData.currencies.money}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
