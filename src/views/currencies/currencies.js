import React, { useState, useEffect, useCallback } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import NavBar from '../../components/navBar/navBar';
import './currencies.css';

const Currencies = () => {
    const [amount, setAmount] = useState('');
    const [userCurrencies, setUserCurrencies] = useState(null);
    const auth = getAuth();
    const db = getFirestore();

    // Function to fetch user currencies
    const fetchUserCurrencies = useCallback(async () => {
        if (!auth.currentUser) {
            console.log("User is not logged in");
            return;
        }

        const userId = auth.currentUser.uid; // Get the current logged-in user's UID
        const userDocRef = doc(db, 'users', userId); // Reference to the user's document

        try {
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.currencies) {
                    setUserCurrencies(userData.currencies); // Set user currencies state
                } else {
                    setUserCurrencies({ money: 0 }); // Default to 0 if no currencies exist
                }
            } else {
                console.log("User document does not exist");
            }
        } catch (error) {
            console.error("Error fetching currencies: ", error);
        }
    }, [auth, db]); // Include db in the dependency array

    // Effect to fetch currencies on component mount
    useEffect(() => {
        fetchUserCurrencies();
    }, [fetchUserCurrencies]);

    const handleAddMoney = async () => {
        if (!auth.currentUser) {
            console.log("User is not logged in");
            return;
        }

        const userId = auth.currentUser.uid; // Get the current logged-in user's UID
        const userDocRef = doc(db, 'users', userId); // Reference to the user's document

        try {
            // First, get the user's current document
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                let currentMoney = 0;

                // Check if currencies object exists and has a money value
                if (userData.currencies && userData.currencies.money) {
                    currentMoney = userData.currencies.money; // Access the money value directly
                }

                // Calculate new money value by adding the new amount
                const newMoney = currentMoney + parseInt(amount, 10); // Parse as integer

                // Update the user's document with the new total money in the currencies object
                await updateDoc(userDocRef, {
                    currencies: { money: newMoney } // Set currencies as an object with money key
                });

                console.log("Money updated successfully!");
                setAmount(''); // Clear the input field after success
                fetchUserCurrencies(); // Fetch updated currencies
            } else {
                console.log("User document does not exist");
            }
        } catch (error) {
            console.error("Error updating money: ", error);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="currencies-container">
                <h2 className="currencies-title">Add Money</h2>
                <input
                    type="number"
                    className="currencies-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                />
                <button className="currencies-button" onClick={handleAddMoney}>
                    Add Money
                </button>
                <div className="currencies-list">
                    <h3 className="currencies-list-title">Current Currencies</h3>
                    {userCurrencies ? (
                        <div className="currencies-item">
                            <p>Money: {userCurrencies.money}</p>
                        </div>
                    ) : (
                        <p>Loading currencies...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Currencies;
