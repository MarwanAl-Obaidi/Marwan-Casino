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

    // Experience levels
    const experienceLevels = [
        0, 100, 300, 600, 1000, 1500,
        2100, 2800, 3600, 4500, 5500,
        6600, 7800, 9100, 10500, 12000,
        13600, 15300, 17100, 19000, 21000,
        23100, 25300, 27600, 30000, 32500,
        35100, 37800, 40600, 43500, 46500
    ];


    // Calculate user's level and experience progress towards the next level
    const calculateLevel = (experience) => {
        let level = 0;
        let nextLevelExp = experienceLevels[1]; // Default to level 1 requirement (100xp)

        for (let i = 1; i < experienceLevels.length; i++) {
            if (experience >= experienceLevels[i]) {
                level = i;
            } else {
                nextLevelExp = experienceLevels[i];
                break;
            }
        }

        const currentLevelExp = experienceLevels[level]; // Total exp required for current level
        const progress = ((experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100; // Percentage progress

        return {
            level,
            progress: Math.min(progress, 100), // Progress in percentage, capped at 100%
            nextLevelExp,
            currentLevelExp
        };
    };

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

    const { level, progress, nextLevelExp, currentLevelExp } = calculateLevel(userData.experience || 0);

    // Format signUpDate
    const formattedSignUpDate = userData.signUpDate
        ? new Date(userData.signUpDate).toLocaleString('en-FI', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true
        })
        : "N/A";

    // Use default values if currency or experience is missing
    const money = userData.currencies?.money || 0; // Default to 0 if no money
    const experience = userData.experience || 0; // Default to 0 if no experience

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
                    <p><strong>Money:</strong> {money}</p>
                    <p><strong>Experience:</strong> {experience} XP</p>
                    <p><strong>Level:</strong> {level}</p>
                    <p><strong>Sign Up Date:</strong> {formattedSignUpDate}</p>
                </div>

                {experience > 0 && (
                    <div className="experience-bar-container">
                        <div className="experience-bar" style={{ width: `${progress}%` }}>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <p>{experience - currentLevelExp} / {nextLevelExp - currentLevelExp} XP to next level</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
