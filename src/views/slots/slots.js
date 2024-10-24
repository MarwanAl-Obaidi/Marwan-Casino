import React, { useState, useEffect, useCallback } from 'react';
import './slots.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import NavBar from '../../components/navBar/navBar.js';

const Slots = () => {
    const slotItems = ['🍒', '🍋', '🍊', '🍇', '🍉'];

    // Updated payout table with adjusted rewards based on the bet
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
    const [userExperience, setUserExperience] = useState(null); // User's experience state
    const [betAmount, setBetAmount] = useState(10); // Default bet amount

    const auth = getAuth();
    const db = getFirestore();

    // Fetch user data (money and experience)
    const fetchUserData = useCallback(async () => {
        if (!auth.currentUser) {
            console.log("User is not logged in");
            return;
        }

        const userId = auth.currentUser.uid;
        const userDocRef = doc(db, 'users', userId);

        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setUserMoney(userData.currencies?.money ?? 0);
                setUserExperience(userData.experience ?? 0); // Fetch experience or default to 0
            } else {
                console.log("User document does not exist");
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
        }
    }, [auth, db]);

    // Fetch data on component mount
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const spinSlots = async () => {
        if (spinning) return;

        if (userMoney === null) {
            alert("Loading user balance, please wait.");
            return;
        }

        // Check if the user has enough money to spin
        if (userMoney < betAmount) {
            alert("Not enough money to spin.");
            return;
        }

        // Deduct the spin cost from user's money
        const newMoney = userMoney - betAmount;
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
            let experienceGain = 10; // Default experience gain for losing

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

                experienceGain = 50; // Experience gain for winning
            } else {
                setMessage('Try Again!');
            }

            // Update user's experience
            const updatedExperience = userExperience + experienceGain;
            setUserExperience(updatedExperience);

            try {
                await updateDoc(userDocRef, {
                    experience: updatedExperience // Update experience in Firestore
                });
            } catch (error) {
                console.error("Error updating experience: ", error);
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
                <div className="bet-options">
                    <label>
                        <input
                            type="radio"
                            name="bet"
                            value="1"
                            checked={betAmount === 1}
                            onChange={() => setBetAmount(1)}
                        />
                        Bet 1 Money
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="bet"
                            value="5"
                            checked={betAmount === 5}
                            onChange={() => setBetAmount(5)}
                        />
                        Bet 5 Money
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="bet"
                            value="10"
                            checked={betAmount === 10}
                            onChange={() => setBetAmount(10)}
                        />
                        Bet 10 Money
                    </label>
                </div>
                <div className="slots">
                    {slots.map((slot, index) => (
                        <div key={index} className="slot">
                            <span className={`symbol ${spinning ? 'spinning' : ''}`}>{slot}</span>
                        </div>
                    ))}
                </div>
                <p className="message">{message || ''}</p>
                <p className="balance">Current Balance: {userMoney !== null ? userMoney : 'Loading...'}</p>
                <button className="spin-button" onClick={spinSlots} disabled={spinning || userMoney < betAmount}>
                    {spinning ? 'Spinning...' : `Spin (-${betAmount} money)`}
                </button>
            </div>
        </div>
    );
};

export default Slots;
