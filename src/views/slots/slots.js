import React, { useState, useEffect, useCallback } from 'react';
import './slots.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import NavBar from '../../components/navBar/navBar.js';

const Slots = () => {
    const slotItems = ['🍒', '🍋', '🍊', '🍇', '🍉'];
    const spinCost = 10; // Cost of each spin

    // Updated payout table including two-of-a-kind rewards
    const winRewards = {
        '🍒': { three: 100, two: 20 }, // Triple Cherries, Double Cherries
        '🍋': { three: 80, two: 16 },  // Triple Lemons, Double Lemons
        '🍊': { three: 70, two: 14 },  // Triple Oranges, Double Oranges
        '🍇': { three: 50, two: 10 },  // Triple Grapes, Double Grapes
        '🍉': { three: 50, two: 10 },  // Triple Watermelon, Double Watermelon
    };

    const [slots, setSlots] = useState(['🍒', '🍒', '🍒']);
    const [message, setMessage] = useState('');
    const [spinning, setSpinning] = useState(false);
    const [userMoney, setUserMoney] = useState(null); // User's money state

    const auth = getAuth();
    const db = getFirestore();

    // Function to fetch user money
    const fetchUserMoney = useCallback(async () => {
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
                if (userData.currencies && userData.currencies.money !== undefined) {
                    setUserMoney(userData.currencies.money); // Set user money state
                } else {
                    setUserMoney(0); // Default to 0 if no money exists
                }
            } else {
                console.log("User document does not exist");
            }
        } catch (error) {
            console.error("Error fetching money: ", error);
        }
    }, [auth, db]);

    // Effect to fetch user's money when component mounts
    useEffect(() => {
        fetchUserMoney();
    }, [fetchUserMoney]);

    const spinSlots = async () => {
        if (spinning) return;

        if (userMoney === null) {
            alert("Loading user balance, please wait.");
            return;
        }

        // Check if the user has enough money to spin
        if (userMoney < spinCost) {
            alert("Not enough money to spin.");
            return;
        }

        // Deduct the spin cost from user's money
        const newMoney = userMoney - spinCost;
        setUserMoney(newMoney); // Update local state
        setSpinning(true);
        setMessage('');

        const userId = auth.currentUser.uid; // Get user UID
        const userDocRef = doc(db, 'users', userId);

        // Update user's money in Firestore
        try {
            await updateDoc(userDocRef, {
                'currencies.money': newMoney
            });
        } catch (error) {
            console.error("Error updating money: ", error);
            return;
        }

        const finalSlots = [];
        const getRandomSlot = () => slotItems[Math.floor(Math.random() * slotItems.length)];

        const spinIntervals = [null, null, null];
        for (let i = 0; i < 3; i++) {
            spinIntervals[i] = setInterval(() => {
                setSlots(prevSlots => {
                    const newSymbol = getRandomSlot();
                    const updatedSlots = [...prevSlots];
                    updatedSlots[i] = newSymbol;
                    return updatedSlots;
                });
            }, 100);
        }

        setTimeout(() => {
            clearInterval(spinIntervals[0]);
            const finalSymbol1 = getRandomSlot();
            finalSlots.push(finalSymbol1);
            setSlots(prevSlots => {
                const updatedSlots = [...prevSlots];
                updatedSlots[0] = finalSymbol1;
                return updatedSlots;
            });
        }, 1000);

        setTimeout(() => {
            clearInterval(spinIntervals[1]);
            const finalSymbol2 = getRandomSlot();
            finalSlots.push(finalSymbol2);
            setSlots(prevSlots => {
                const updatedSlots = [...prevSlots];
                updatedSlots[1] = finalSymbol2;
                return updatedSlots;
            });
        }, 1500);

        setTimeout(async () => {
            clearInterval(spinIntervals[2]);
            const finalSymbol3 = getRandomSlot();
            finalSlots.push(finalSymbol3);
            setSlots(prevSlots => {
                const updatedSlots = [...prevSlots];
                updatedSlots[2] = finalSymbol3;
                return updatedSlots;
            });

            // Determine win based on final symbols
            const winAmount = determineWin(finalSlots);
            if (winAmount > 0) {
                setMessage(`🎉 You won ${winAmount}! 🎉`);
                const updatedMoney = newMoney + winAmount;
                setUserMoney(updatedMoney); // Update local state

                // Update user's money in Firestore
                try {
                    await updateDoc(userDocRef, {
                        'currencies.money': updatedMoney
                    });
                } catch (error) {
                    console.error("Error updating money after win: ", error);
                }
            } else {
                setMessage('Try Again!');
            }

            setSpinning(false);
        }, 2000);
    };

    // Function to determine win based on the final slots
    const determineWin = (slots) => {
        const counts = {};
        slots.forEach(slot => {
            counts[slot] = (counts[slot] || 0) + 1;
        });

        const uniqueSlots = Object.keys(counts);

        // Check for three-of-a-kind first
        for (const slot of uniqueSlots) {
            if (counts[slot] === 3) {
                return winRewards[slot].three; // Return three-of-a-kind reward
            } else if (counts[slot] === 2) {
                return winRewards[slot].two; // Return two-of-a-kind reward
            }
        }

        return 0; // No win
    };

    return (
        <div>
            <NavBar />
            <div className="slot-machine">
                <h1>Slot Machine</h1>
                <div className="slots">
                    {slots.map((slot, index) => (
                        <div key={index} className="slot">
                            <span className={`symbol ${spinning ? 'spinning' : ''}`}>{slot}</span>
                        </div>
                    ))}
                </div>
                <p className="message">{message || ''}</p>
                <p className="balance">Current Balance: {userMoney !== null ? userMoney : 'Loading...'}</p>
                <button className="spin-button" onClick={spinSlots} disabled={spinning || userMoney < spinCost}>
                    {spinning ? 'Spinning...' : `Spin (-${spinCost} money)`}
                </button>
            </div>
        </div>
    );
};

export default Slots;
