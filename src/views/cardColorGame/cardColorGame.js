import React, { useState, useEffect, useCallback } from 'react';
import './cardColorGame.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import NavBar from '../../components/navBar/navBar.js';

const cardColors = ['red', 'black'];

const CardColorGame = () => {
    const [targetColor, setTargetColor] = useState('');
    const [message, setMessage] = useState('');
    const [userMoney, setUserMoney] = useState(null); // User's money state
    const [betAmount, setBetAmount] = useState(10); // Default bet amount

    const auth = getAuth();
    const db = getFirestore();

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

    useEffect(() => {
        fetchUserMoney();
        generateCardColor(); // Generate the initial card color
    }, [fetchUserMoney]);

    const generateCardColor = () => {
        const randomIndex = Math.floor(Math.random() * cardColors.length);
        const color = cardColors[randomIndex];
        setTargetColor(color);
    };

    const handleGuess = async (color) => {
        if (userMoney === null) {
            alert("Loading user balance, please wait.");
            return;
        }

        // Check if the user has enough money to bet
        if (userMoney < betAmount) {
            alert("Not enough money to make this bet.");
            return;
        }

        const newMoney = userMoney - betAmount; // Deduct the bet amount
        setUserMoney(newMoney); // Update local state

        // Update user's money in Firestore
        const userId = auth.currentUser.uid; // Get user UID
        const userDocRef = doc(db, 'users', userId);

        try {
            await updateDoc(userDocRef, {
                'currencies.money': newMoney
            });
        } catch (error) {
            console.error("Error updating money: ", error);
        }

        // Determine win/loss
        if (color === targetColor) {
            const winnings = betAmount * 1.5; // Winning amount is 1.5x of the bet
            setMessage(`Correct! The card was ${targetColor}. You won ${winnings}!`);
            const updatedMoney = newMoney + winnings; // Update money with winnings
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
            setMessage(`Wrong! The card was ${targetColor}. You lost your bet of ${betAmount}.`);
        }

        generateCardColor(); // Generate a new card color for the next round
    };

    return (
        <div>
            <NavBar />
            <div className="game-container">
                <h1>Card Color Game</h1>
                <h2>Guess the color of the next card!</h2>
                <div>
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
                <p className="balance">Current Balance: {userMoney !== null ? userMoney : 'Loading...'}</p>
                <div>
                    <button className="button button-red" onClick={() => handleGuess('red')}>
                        Red
                    </button>
                    <button className="button button-black" onClick={() => handleGuess('black')}>
                        Black
                    </button>
                </div>
                <h3 className="message">{message}</h3>
            </div>
        </div>
    );
};

export default CardColorGame;
