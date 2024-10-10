import React, { useState, useEffect } from 'react';
import './cardColorGame.css';
import NavBar from '../../components/navBar/navBar.js';

const cardColors = ['red', 'black'];

const CardColorGame = () => {
    const [targetColor, setTargetColor] = useState('');
    const [message, setMessage] = useState('');

    const generateCardColor = () => {
        const randomIndex = Math.floor(Math.random() * cardColors.length);
        const color = cardColors[randomIndex];
        setTargetColor(color);
    };

    const handleGuess = (color) => {
        if (color === targetColor) {
            setMessage(`Correct! The card was ${targetColor}.`);
        } else {
            setMessage(`Wrong! The card was ${targetColor}.`);
        }
        generateCardColor();
    };

    useEffect(() => {
        generateCardColor();
    }, []);

    return (
        <div>
            <NavBar />
            <div className="game-container">
                <h1>Card Color Game</h1>
                <h2>Guess the color of the next card!</h2>
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
