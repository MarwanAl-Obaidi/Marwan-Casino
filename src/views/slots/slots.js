import React, { useState } from 'react';
import './slots.css';
import NavBar from '../../components/navBar/navBar.js';

const Slots = () => {
    const slotItems = ['🍒', '🍋', '🍊', '🍇', '🍉'];
    const [slots, setSlots] = useState(['🍒', '🍒', '🍒']);
    const [message, setMessage] = useState('');
    const [spinning, setSpinning] = useState(false);

    const spinSlots = () => {
        if (spinning) return;
        setSpinning(true);
        setMessage('');

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

        setTimeout(() => {
            clearInterval(spinIntervals[2]);
            const finalSymbol3 = getRandomSlot();
            finalSlots.push(finalSymbol3);
            setSlots(prevSlots => {
                const updatedSlots = [...prevSlots];
                updatedSlots[2] = finalSymbol3;
                return updatedSlots;
            });

            if (finalSlots.every(slot => slot === finalSlots[0])) {
                setMessage('🎉 Jackpot! You won! 🎉');
            } else {
                setMessage('Try Again!');
            }

            setSpinning(false);
        }, 2000);
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
                <button className="spin-button" onClick={spinSlots} disabled={spinning}>
                    {spinning ? 'Spinning...' : 'Spin'}
                </button>
            </div>
        </div>
    );
};

export default Slots;
